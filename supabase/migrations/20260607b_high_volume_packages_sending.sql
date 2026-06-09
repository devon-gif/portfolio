-- Hotel Pipeline OS — High-Volume (approval-based) Outbound + Packages
-- Date: 2026-06-07
-- Goal: support ramping toward 200 APPROVED cold emails/day — safely, compliantly,
--   and only to qualified, approved leads. Drafts + approval + compliance first;
--   sending integration is later and only via approved batches. Never auto-send.
--
-- Builds on: 20260607_lead_discovery_enrichment_layer.sql (compliance_checks,
--   source_urls, approval_queue, hunter gating). Idempotent. Run in Supabase.

create extension if not exists "pgcrypto";

-- ════════════════════════════════════════════════════════════════════════════
-- 1. packages — pricing/package catalog (managed via /pricing-packages)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists packages (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  category           text not null check (category in ('hotel_group','spa','restaurant','cross')),
  applies_to_lead_types text[] not null default '{}',  -- e.g. {direct_buyer,enterprise_router}
  applies_to_company_types text[] not null default '{}', -- maps to companies.type vocab
  pricing_tier       text not null check (pricing_tier in ('starter','growth','addon','bundle')),
  price_min          numeric(10,2),
  price_max          numeric(10,2),
  price_display      text not null,        -- e.g. "$1,999/month" or "$3,999–$4,499/month"
  billing_period     text not null default 'month',
  deliverables       text[] not null default '{}',
  positioning        text not null default '',
  is_active          boolean not null default true,
  sort_order         int not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
drop trigger if exists packages_updated_at on packages;
create trigger packages_updated_at before update on packages
  for each row execute function set_updated_at();
create index if not exists packages_category_idx on packages(category);
create index if not exists packages_active_idx on packages(is_active);

-- Seed the real packages (fixed UUIDs; safe to re-run).
insert into packages (id, name, category, applies_to_company_types, pricing_tier, price_min, price_max, price_display, deliverables, positioning, sort_order) values
('70000000-0000-0000-0000-000000000001','3-Property Starter Pilot','hotel_group',
  ARRAY['hotel_management_company','hospitality_group','boutique_hotel_group','resort_group'],
  'starter', 1999, 1999, '$1,999/month',
  ARRAY['Social graphics across 3 properties','Short-form motion','Seasonal campaign creative','From existing assets only'],
  'Cost savings + creative bandwidth across 3 properties — lower overhead than in-house design/social.', 1),
('70000000-0000-0000-0000-000000000002','3-Property Growth Pilot','hotel_group',
  ARRAY['hotel_management_company','hospitality_group','boutique_hotel_group','resort_group'],
  'growth', 2999, 2999, '$2,999/month',
  ARRAY['Higher monthly volume across 3 properties','Social + motion + event/F&B promos','Seasonal campaigns','From existing assets only'],
  'More output per property without adding headcount.', 2),
('70000000-0000-0000-0000-000000000003','Hotel SEO Add-On (3 properties)','hotel_group',
  ARRAY['hotel_management_company','hospitality_group','boutique_hotel_group','resort_group'],
  'addon', 1499, 1499, '$1,499/month',
  ARRAY['Local + hotel SEO for 3 properties','On-page + listing optimization'],
  'Add-on to a creative pilot — lower overhead than an SEO hire/agency.', 3),
('70000000-0000-0000-0000-000000000004','Hotel Creative + SEO Bundle','hotel_group',
  ARRAY['hotel_management_company','hospitality_group','boutique_hotel_group','resort_group'],
  'bundle', 3999, 4499, '$3,999–$4,499/month',
  ARRAY['Creative pilot + SEO across 3 properties','Social, motion, campaigns + SEO','From existing assets only'],
  'One partner for creative AND SEO — far below the cost of multiple hires.', 4),
('70000000-0000-0000-0000-000000000005','Spa Social Starter','spa',
  ARRAY['other'], 'starter', 499, 499, '$499/month',
  ARRAY['Spa/wellness social graphics','Short-form motion','From existing assets only'],
  'Premium, calm content cadence without a social hire.', 5),
('70000000-0000-0000-0000-000000000006','Spa Social + SEO','spa',
  ARRAY['other'], 'growth', 999, 999, '$999/month',
  ARRAY['Spa social content','Local SEO for the spa'],
  'Content + visibility for less than a part-time hire.', 6),
('70000000-0000-0000-0000-000000000007','Restaurant Social Starter','restaurant',
  ARRAY['other'], 'starter', 399, 399, '$399/month',
  ARRAY['Menu/specials/seasonal graphics','Short-form motion','From existing assets only'],
  'Consistent F&B content off the owner''s plate.', 7),
('70000000-0000-0000-0000-000000000008','Restaurant Social + Local SEO','restaurant',
  ARRAY['other'], 'growth', 699, 699, '$699/month',
  ARRAY['Restaurant social content','Local SEO (maps, listings)'],
  'Content + local visibility without a marketing hire.', 8)
on conflict (id) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. sending_inboxes — inboxes/domains used to send (for ramp + deliverability)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists sending_inboxes (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  label         text,
  provider      text not null default 'resend' check (provider in ('resend','google','outlook','other')),
  daily_cap     int not null default 20 check (daily_cap between 0 and 500),
  warmup_stage  text not null default 'warming' check (warmup_stage in ('warming','ramping','steady','paused')),
  is_active     boolean not null default true,
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists sending_inboxes_updated_at on sending_inboxes;
create trigger sending_inboxes_updated_at before update on sending_inboxes
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════════════
-- 3. send_ramp_stages — the volume ramp plan (managed/seeded)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists send_ramp_stages (
  id           uuid primary key default gen_random_uuid(),
  label        text not null unique,
  min_per_day  int not null,
  max_per_day  int not null,
  sort_order   int not null default 0,
  gate_note    text not null default '',
  created_at   timestamptz not null default now()
);
insert into send_ramp_stages (id, label, min_per_day, max_per_day, sort_order, gate_note) values
('71000000-0000-0000-0000-000000000001','Week 1–2',  20, 40,  1, 'Initial warmup.'),
('71000000-0000-0000-0000-000000000002','Week 3–4',  50, 80,  2, 'Increase only if bounces/complaints are healthy.'),
('71000000-0000-0000-0000-000000000003','Month 2',   100,150, 3, 'Increase only if deliverability is safe.'),
('71000000-0000-0000-0000-000000000004','Month 3+',  150,200, 4, 'Reach 150–200/day ONLY if bounce/spam/complaint rates are safe.')
on conflict (id) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. send_batches — plan + track approved send volume (managed via /send-batches)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists send_batches (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  batch_date       date not null default current_date,
  sending_inbox_id uuid references sending_inboxes(id) on delete set null,
  ramp_stage_id    uuid references send_ramp_stages(id) on delete set null,
  planned_size     int not null default 0,
  send_cap         int not null default 0,   -- hard cap for this batch
  status           text not null default 'planned' check (status in (
    'planned','approved','sending','sent','paused','cancelled'
  )),
  sent_count       int not null default 0,
  bounce_count     int not null default 0,
  complaint_count  int not null default 0,
  notes            text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
drop trigger if exists send_batches_updated_at on send_batches;
create trigger send_batches_updated_at before update on send_batches
  for each row execute function set_updated_at();
create index if not exists send_batches_date_idx on send_batches(batch_date);
create index if not exists send_batches_status_idx on send_batches(status);

-- ════════════════════════════════════════════════════════════════════════════
-- 5. landing_pages — package/offer pages each message can link to (track clicks)
-- ════════════════════════════════════════════════════════════════════════════
create table if not exists landing_pages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  url          text not null,
  offer_type   text not null default 'package_page' check (offer_type in (
    'package_page','trial_page','portfolio','case_study','other'
  )),
  package_id   uuid references packages(id) on delete set null,
  visit_count  int not null default 0,
  click_count  int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
drop trigger if exists landing_pages_updated_at on landing_pages;
create trigger landing_pages_updated_at before update on landing_pages
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════════════
-- 6. EXTEND contacts — new CRM fields
-- ════════════════════════════════════════════════════════════════════════════
alter table contacts add column if not exists package_recommended uuid references packages(id) on delete set null;
alter table contacts add column if not exists price_shown text;
alter table contacts add column if not exists pricing_tier text check (pricing_tier in ('starter','growth','addon','bundle') or pricing_tier is null);
alter table contacts add column if not exists public_email text;
alter table contacts add column if not exists public_email_source_url text;
alter table contacts add column if not exists email_collection_method text check (email_collection_method in (
  'website_contact_page','website_footer','website_team_page','public_directory','press_release','hunter','manual'
) or email_collection_method is null);
-- email_confidence already added by the discovery/enrichment layer migration.
alter table contacts add column if not exists hunter_used boolean not null default false;
alter table contacts add column if not exists sending_inbox_id uuid references sending_inboxes(id) on delete set null;
alter table contacts add column if not exists send_batch_id uuid references send_batches(id) on delete set null;
alter table contacts add column if not exists optout_included boolean;
alter table contacts add column if not exists address_included boolean;
alter table contacts add column if not exists compliance_status text check (compliance_status in ('pass','fail','pending') or compliance_status is null);
alter table contacts add column if not exists landing_page_id uuid references landing_pages(id) on delete set null;
alter table contacts add column if not exists landing_page_visited boolean not null default false;
alter table contacts add column if not exists package_page_clicked boolean not null default false;
create index if not exists contacts_send_batch_idx on contacts(send_batch_id);
create index if not exists contacts_compliance_status_idx on contacts(compliance_status);

-- ════════════════════════════════════════════════════════════════════════════
-- 7. EXTEND messages — batch/inbox/compliance/landing linkage
-- ════════════════════════════════════════════════════════════════════════════
alter table messages add column if not exists send_batch_id uuid references send_batches(id) on delete set null;
alter table messages add column if not exists sending_inbox_id uuid references sending_inboxes(id) on delete set null;
alter table messages add column if not exists landing_page_id uuid references landing_pages(id) on delete set null;
alter table messages add column if not exists optout_included boolean;
alter table messages add column if not exists address_included boolean;
alter table messages add column if not exists compliance_status text check (compliance_status in ('pass','fail','pending') or compliance_status is null);
alter table messages add column if not exists package_recommended uuid references packages(id) on delete set null;
alter table messages add column if not exists price_shown text;
create index if not exists messages_send_batch_idx on messages(send_batch_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 8. EXTEND outreach_queue (approval queue) — package + landing context
-- ════════════════════════════════════════════════════════════════════════════
alter table outreach_queue add column if not exists package_recommended uuid references packages(id) on delete set null;
alter table outreach_queue add column if not exists price_shown text;
alter table outreach_queue add column if not exists pricing_tier text check (pricing_tier in ('starter','growth','addon','bundle') or pricing_tier is null);
alter table outreach_queue add column if not exists landing_page_id uuid references landing_pages(id) on delete set null;
alter table outreach_queue add column if not exists send_batch_id uuid references send_batches(id) on delete set null;

-- ════════════════════════════════════════════════════════════════════════════
-- 9. EXTEND compliance_checks — v2 gate items for cold email at volume
-- ════════════════════════════════════════════════════════════════════════════
alter table compliance_checks add column if not exists email_exists_with_source boolean;
alter table compliance_checks add column if not exists not_deceptive_subject boolean;
alter table compliance_checks add column if not exists no_fake_personalization boolean;
alter table compliance_checks add column if not exists fit_score_ok boolean;
alter table compliance_checks add column if not exists passed_quality_checklist boolean;
alter table compliance_checks add column if not exists fit_score int;

-- ════════════════════════════════════════════════════════════════════════════
-- 10. app_settings — ramp pointer + volume guardrails
-- ════════════════════════════════════════════════════════════════════════════
alter table app_settings add column if not exists active_ramp_stage_id uuid references send_ramp_stages(id) on delete set null;
alter table app_settings add column if not exists max_daily_send_cap int not null default 200 check (max_daily_send_cap between 0 and 500);
alter table app_settings add column if not exists max_bounce_rate numeric(5,2) not null default 3.00;     -- % threshold to pause ramp
alter table app_settings add column if not exists max_complaint_rate numeric(5,2) not null default 0.10;  -- % threshold to pause ramp
alter table app_settings add column if not exists min_fit_score_to_queue int not null default 6 check (min_fit_score_to_queue between 0 and 10);
-- Default the active ramp stage to Week 1–2 if not set.
update app_settings set active_ramp_stage_id = '71000000-0000-0000-0000-000000000001'
  where active_ramp_stage_id is null;

-- ════════════════════════════════════════════════════════════════════════════
-- 11. RLS — mirror the local-first pattern (anon + authenticated full access)
-- ════════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array[
    'packages','sending_inboxes','send_ramp_stages','send_batches','landing_pages'
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
