-- Hotel Pipeline OS — Lead Discovery + Enrichment Layer
-- Date: 2026-06-07
-- Purpose: extend the existing CRM into a mostly-autopilot DISCOVERY → ENRICHMENT →
--   CONTACT-FINDING → COMPLIANCE → APPROVAL pipeline. Drafts only; never auto-send.
--
-- DESIGN NOTE — reuse over duplication. The repo already has:
--   research_runs        → used as the ENRICHMENT run log (aliased by view enrichment_runs)
--   research_sources     → raw scraped pages (kept; source_urls is the normalized fact log)
--   contact_candidates   → the contact review queue (aliased by view contact_enrichment)
--   outreach_queue       → the APPROVAL queue (extended below; aliased by view approval_queue)
--   suppression_list, messages, contacts, companies, app_settings — reused as-is/extended.
-- This migration ADDS only genuinely-new tables and columns, and creates read
-- views for the names requested in the spec so app code can use either name.
--
-- Idempotent. Safe to run multiple times. Run in Supabase SQL editor or psql.

create extension if not exists "pgcrypto";

-- ════════════════════════════════════════════════════════════════════════════
-- 1. lead_sources — catalog of saved searches / discovery sources
--    (e.g. "hotel management company Philadelphia" on google_cse)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists lead_sources (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,
  source_type     text not null default 'web_search' check (source_type in (
    'web_search','google_cse','firecrawl_search','company_website',
    'public_career_page','press_release','job_board','manual','referral'
  )),
  -- search definition
  query           text,
  target_market   text check (target_market in ('US','Canada','UK','UAE','Other') or target_market is null),
  company_category text,          -- maps to companies.type vocabulary
  geography       text,           -- free text e.g. "Philadelphia, PA"
  keywords        text[] not null default '{}',
  daily_limit     int not null default 30 check (daily_limit between 0 and 200),
  -- governance
  is_active       boolean not null default true,
  respect_robots  boolean not null default true,   -- enforced by the worker
  notes           text not null default '',
  last_run_at     timestamptz,
  last_run_count  int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
drop trigger if exists lead_sources_updated_at on lead_sources;
create trigger lead_sources_updated_at before update on lead_sources
  for each row execute function set_updated_at();
create index if not exists lead_sources_active_idx on lead_sources(is_active);

-- ════════════════════════════════════════════════════════════════════════════
-- 2. discovered_companies — raw discovery hits BEFORE promotion to companies.
--    The Lead Discovery Worker writes here; user/worker promotes good ones.
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists discovered_companies (
  id                 uuid primary key default gen_random_uuid(),
  lead_source_id     uuid references lead_sources(id) on delete set null,
  company_id         uuid references companies(id) on delete set null, -- set on promotion
  name               text not null,
  website            text,
  source_url         text not null,         -- where this company was found (REQUIRED)
  company_category   text,                  -- inferred; maps to companies.type vocab
  fit_reason         text,
  possible_property_count int,
  verticals          text[] not null default '{}', -- hotel|restaurant|fnb|spa|wellness|resort|wedding|event
  confidence_score   int not null default 0 check (confidence_score between 0 and 100),
  is_inference       boolean not null default false, -- true if category/verticals were inferred
  recommended_next_step text check (recommended_next_step in (
    'enrich_website','find_contacts','check_job_signals','skip','manual_review'
  ) or recommended_next_step is null),
  status             text not null default 'new' check (status in (
    'new','enriching','enriched','promoted','duplicate','rejected'
  )),
  dedupe_key         text,                  -- normalized domain for dedupe
  notes              text not null default '',
  discovered_at      timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
drop trigger if exists discovered_companies_updated_at on discovered_companies;
create trigger discovered_companies_updated_at before update on discovered_companies
  for each row execute function set_updated_at();
create unique index if not exists discovered_companies_dedupe_idx
  on discovered_companies(dedupe_key) where dedupe_key is not null;
create index if not exists discovered_companies_status_idx on discovered_companies(status);
create index if not exists discovered_companies_source_idx on discovered_companies(lead_source_id);
create index if not exists discovered_companies_score_idx on discovered_companies(confidence_score desc);

-- ════════════════════════════════════════════════════════════════════════════
-- 3. job_signals — hiring posts that indicate creative/marketing need.
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists job_signals (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid references companies(id) on delete set null,
  discovered_company_id uuid references discovered_companies(id) on delete set null,
  company_name       text not null,
  job_title          text not null,
  job_post_url       text not null,         -- REQUIRED source
  job_platform       text,                  -- linkedin(manual)|indeed|company_site|other
  role_summary       text,
  keywords           text[] not null default '{}',
  why_buying_signal  text,
  likely_decision_maker text,
  contract_alternative_angle text,
  suggested_offer    text not null default 'hiring_signal',  -- hiring_signal | contract_alternative
  priority_score     int not null default 0 check (priority_score between 0 and 10),
  is_inference       boolean not null default false,
  status             text not null default 'new' check (status in (
    'new','reviewed','queued','dismissed'
  )),
  found_at           timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
drop trigger if exists job_signals_updated_at on job_signals;
create trigger job_signals_updated_at before update on job_signals
  for each row execute function set_updated_at();
create unique index if not exists job_signals_url_idx on job_signals(job_post_url);
create index if not exists job_signals_company_idx on job_signals(company_id);
create index if not exists job_signals_status_idx on job_signals(status);

-- ════════════════════════════════════════════════════════════════════════════
-- 4. hunter_lookups — audit EVERY Hunter API call (gated; high-priority only).
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists hunter_lookups (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid references companies(id) on delete set null,
  contact_candidate_id uuid references contact_candidates(id) on delete set null,
  contact_id         uuid references contacts(id) on delete set null,
  endpoint           text not null check (endpoint in (
    'domain_search','email_finder','email_verifier'
  )),
  -- gate snapshot: WHY this lookup was allowed (the worker must fill these)
  gate_priority_score int,
  gate_lead_type      text,
  gate_reason         text,                 -- human-readable justification
  -- request
  domain             text,
  full_name          text,
  -- result
  email              text,
  verification_status text check (verification_status in (
    'verified','accept_all','webmail','disposable','unknown','invalid','risky'
  ) or verification_status is null),
  confidence_score   int,                   -- Hunter confidence 0..100
  hunter_source_urls text[] not null default '{}', -- Hunter-provided sources, if any
  raw_result         jsonb,
  enrichment_date    timestamptz not null default now(),
  created_at         timestamptz not null default now()
);
create index if not exists hunter_lookups_company_idx on hunter_lookups(company_id);
create index if not exists hunter_lookups_candidate_idx on hunter_lookups(contact_candidate_id);
create index if not exists hunter_lookups_endpoint_idx on hunter_lookups(endpoint);

-- ════════════════════════════════════════════════════════════════════════════
-- 5. source_urls — normalized provenance: one row per FACT → its source URL.
--    Enforces "log the source URL for every company/contact fact" and labels
--    inferences. Polymorphic (entity_type + entity_id).
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists source_urls (
  id           uuid primary key default gen_random_uuid(),
  entity_type  text not null check (entity_type in (
    'company','contact','discovered_company','job_signal','contact_candidate','outreach_queue'
  )),
  entity_id    uuid not null,
  field        text,                        -- which fact this supports (e.g. 'title','property_names')
  fact_value   text,                        -- the asserted value (optional snapshot)
  url          text,                        -- source URL (null only when is_inference = true)
  excerpt      text,                        -- exact quoted snippet from the source
  is_inference boolean not null default false,
  confidence   int,                         -- 0..100 optional
  fetched_at   timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  -- A fact must EITHER have a source URL OR be explicitly flagged an inference.
  constraint source_urls_url_or_inference check (url is not null or is_inference = true)
);
create index if not exists source_urls_entity_idx on source_urls(entity_type, entity_id);
create index if not exists source_urls_field_idx on source_urls(field);

-- ════════════════════════════════════════════════════════════════════════════
-- 6. compliance_checks — the pre-queue gate result for each contact/draft.
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists compliance_checks (
  id                 uuid primary key default gen_random_uuid(),
  contact_id         uuid references contacts(id) on delete cascade,
  contact_candidate_id uuid references contact_candidates(id) on delete set null,
  outreach_queue_id  uuid references outreach_queue(id) on delete set null,
  result             text not null default 'pending' check (result in ('pass','fail','pending')),
  -- individual gate outcomes (true = passed that check)
  not_suppressed     boolean,
  not_recently_contacted boolean,           -- not contacted in last 14 days
  email_verified_or_high_conf boolean,
  has_source_urls    boolean,
  no_invented_fields boolean,
  has_specific_detail boolean,              -- ≥1 real personalization detail
  email_has_optout_and_address boolean,     -- email draft includes opt-out + address
  linkedin_manual_only boolean,             -- linkedin draft flagged manual-send
  allowed_contact_source boolean,
  risk_flags         text[] not null default '{}',
  missing            text[] not null default '{}',
  recommended_fix    text,
  checked_at         timestamptz not null default now(),
  created_at         timestamptz not null default now()
);
create index if not exists compliance_checks_contact_idx on compliance_checks(contact_id);
create index if not exists compliance_checks_result_idx on compliance_checks(result);
create index if not exists compliance_checks_queue_idx on compliance_checks(outreach_queue_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 7. EXTEND existing tables
-- ════════════════════════════════════════════════════════════════════════════

-- companies: discovery linkage + verticals + source
alter table companies add column if not exists discovered_company_id uuid references discovered_companies(id) on delete set null;
alter table companies add column if not exists lead_source_id uuid references lead_sources(id) on delete set null;
alter table companies add column if not exists source text;            -- how the company entered the CRM
alter table companies add column if not exists verticals text[] not null default '{}';
alter table companies add column if not exists confidence_score int;   -- discovery/enrichment confidence 0..100

-- contacts: email verification provenance (links to hunter_lookups / source_urls)
alter table contacts add column if not exists email_verification_status text
  check (email_verification_status in ('verified','accept_all','webmail','unknown','invalid','risky','high_confidence') or email_verification_status is null);
alter table contacts add column if not exists email_confidence int;
alter table contacts add column if not exists email_source_url text;
alter table contacts add column if not exists hunter_lookup_id uuid references hunter_lookups(id) on delete set null;
alter table contacts add column if not exists enrichment_date timestamptz;

-- contact_candidates: link Hunter audit + provenance
alter table contact_candidates add column if not exists hunter_lookup_id uuid references hunter_lookups(id) on delete set null;
alter table contact_candidates add column if not exists is_inference boolean not null default false;

-- outreach_queue → the APPROVAL queue. Add the fields the approval UI needs.
alter table outreach_queue add column if not exists company_id uuid references companies(id) on delete set null;
alter table outreach_queue add column if not exists lead_type text;
alter table outreach_queue add column if not exists priority_score int;
alter table outreach_queue add column if not exists best_angle text;
alter table outreach_queue add column if not exists suggested_offer text;
alter table outreach_queue add column if not exists quality_result jsonb;       -- quality checklist output
alter table outreach_queue add column if not exists compliance_check_id uuid references compliance_checks(id) on delete set null;
alter table outreach_queue add column if not exists compliance_status text
  check (compliance_status in ('pass','fail','pending') or compliance_status is null);
alter table outreach_queue add column if not exists follow_up_date date;
alter table outreach_queue add column if not exists snoozed_until date;
alter table outreach_queue add column if not exists rejected_reason text;
alter table outreach_queue add column if not exists source_count int not null default 0; -- # of source_urls backing this draft

-- Expand outreach_queue status to support the approval workflow buttons.
do $$
begin
  alter table outreach_queue drop constraint if exists outreach_queue_status_check;
  alter table outreach_queue add constraint outreach_queue_status_check check (status in (
    'draft','needs_review','approved','sent','skipped','follow_up','rejected','snoozed'
  ));
exception when duplicate_object then null;
end $$;
create index if not exists outreach_queue_company_id_idx on outreach_queue(company_id);
create index if not exists outreach_queue_compliance_idx on outreach_queue(compliance_status);
create index if not exists outreach_queue_follow_up_idx on outreach_queue(follow_up_date);

-- app_settings: discovery daily caps (separate from SEND caps already present)
alter table app_settings add column if not exists discovery_daily_limit int not null default 40 check (discovery_daily_limit between 0 and 500);
alter table app_settings add column if not exists enrich_daily_limit int not null default 10 check (enrich_daily_limit between 0 and 200);
alter table app_settings add column if not exists hunter_daily_limit int not null default 5 check (hunter_daily_limit between 0 and 100);
alter table app_settings add column if not exists hunter_min_priority int not null default 7 check (hunter_min_priority between 0 and 10);
alter table app_settings add column if not exists recontact_cooldown_days int not null default 14 check (recontact_cooldown_days between 0 and 365);

-- ════════════════════════════════════════════════════════════════════════════
-- 8. COMPATIBILITY VIEWS for the names used in the build spec
--    (so Codex can query enrichment_runs / contact_enrichment / approval_queue).
-- ════════════════════════════════════════════════════════════════════════════

-- enrichment_runs == research_runs (the website enrichment log)
create or replace view enrichment_runs as
  select
    id, company_id, company_name, website_url, status, error_msg,
    property_count_estimate, company_type, property_names, amenities,
    generic_emails, contact_form_urls, personalization_angle, specific_use_cases,
    fit_score, pages_scraped, sources_used, created_at, updated_at
  from research_runs;

-- contact_enrichment == contact_candidates (the contact review queue)
create or replace view contact_enrichment as
  select
    cc.id, cc.run_id, cc.company_id, cc.name, cc.title, cc.email, cc.linkedin_url,
    cc.source_url, cc.source_excerpt, cc.confidence_score, cc.email_confidence,
    cc.email_status, cc.source_type, cc.recommended_channel, cc.recommended_action,
    cc.status, cc.hunter_lookup_id, cc.is_inference, cc.promoted_contact_id,
    cc.created_at, cc.updated_at
  from contact_candidates cc;

-- approval_queue == outreach_queue joined to contact + company for the UI.
create or replace view approval_queue as
  select
    oq.id,
    oq.contact_id,
    oq.company_id,
    co.name              as company_name,
    (c.first_name || ' ' || c.last_name) as contact_name,
    c.title              as contact_role,
    coalesce(oq.lead_type, c.type)       as lead_type,
    coalesce(oq.priority_score, oq.score) as priority_score,
    oq.best_angle,
    oq.suggested_offer,
    oq.linkedin_draft,
    oq.email_draft,
    oq.quality_result,
    oq.compliance_status,
    oq.compliance_check_id,
    oq.status,
    oq.follow_up_date,
    oq.snoozed_until,
    oq.rejected_reason,
    oq.source_count,
    c.email              as contact_email,
    c.linkedin_url       as contact_linkedin_url,
    oq.created_at,
    oq.updated_at
  from outreach_queue oq
  left join contacts  c  on c.id  = oq.contact_id
  left join companies co on co.id = oq.company_id;

-- ════════════════════════════════════════════════════════════════════════════
-- 9. RLS — mirror the existing local-first pattern (anon + authenticated full).
-- ════════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array[
    'lead_sources','discovered_companies','job_signals','hunter_lookups',
    'source_urls','compliance_checks'
  ]
  loop
    if to_regclass(t) is null then continue; end if;
    execute format('alter table %I enable row level security;', t);
    begin
      execute format('create policy "local anon full access" on %I for all to anon using (true) with check (true);', t);
    exception when duplicate_object then null; end;
    begin
      execute format('create policy "local authed full access" on %I for all to authenticated using (true) with check (true);', t);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- Done.
