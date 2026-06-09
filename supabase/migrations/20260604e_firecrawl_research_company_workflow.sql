-- Hotel Pipeline OS — Firecrawl Research Company workflow
-- Idempotent. Run in Supabase SQL Editor before expecting full research persistence.

create extension if not exists "pgcrypto";

-- ─── companies: Firecrawl research intelligence ─────────────────────────────
alter table companies add column if not exists research_summary text;
alter table companies add column if not exists property_count_estimate int;
alter table companies add column if not exists property_names text[] not null default '{}';
alter table companies add column if not exists locations text[] not null default '{}';
alter table companies add column if not exists amenities text[] not null default '{}';
alter table companies add column if not exists generic_emails text[] not null default '{}';
alter table companies add column if not exists public_emails text[] not null default '{}';
alter table companies add column if not exists contact_form_urls text[] not null default '{}';
alter table companies add column if not exists phone_numbers text[] not null default '{}';
alter table companies add column if not exists leadership_names text[] not null default '{}';
alter table companies add column if not exists marketing_sales_people text[] not null default '{}';
alter table companies add column if not exists restaurant_bar_mentions boolean not null default false;
alter table companies add column if not exists spa_wellness_mentions boolean not null default false;
alter table companies add column if not exists meetings_events_weddings_mentions boolean not null default false;
alter table companies add column if not exists company_score int;
alter table companies add column if not exists last_researched_at timestamptz;

-- ─── research_runs: enough audit data for one company research run ──────────
create table if not exists research_runs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  status text not null default 'pending'
);

alter table research_runs add column if not exists company_name text;
alter table research_runs add column if not exists website_url text;
alter table research_runs add column if not exists error_msg text;
alter table research_runs add column if not exists property_count_estimate int;
alter table research_runs add column if not exists company_type text;
alter table research_runs add column if not exists property_names text[] not null default '{}';
alter table research_runs add column if not exists amenities text[] not null default '{}';
alter table research_runs add column if not exists generic_emails text[] not null default '{}';
alter table research_runs add column if not exists contact_form_urls text[] not null default '{}';
alter table research_runs add column if not exists personalization_angle text;
alter table research_runs add column if not exists specific_use_cases text;
alter table research_runs add column if not exists fit_score int not null default 0;
alter table research_runs add column if not exists pages_scraped int not null default 0;
alter table research_runs add column if not exists sources_used text[] not null default '{}';
alter table research_runs add column if not exists created_at timestamptz not null default now();
alter table research_runs add column if not exists updated_at timestamptz not null default now();

alter table research_runs drop constraint if exists research_runs_status_check;
alter table research_runs add constraint research_runs_status_check check (
  status in ('pending','running','success','done','error')
);

create index if not exists research_runs_company_id_idx on research_runs(company_id);
create index if not exists research_runs_status_idx on research_runs(status);
create index if not exists research_runs_created_at_idx on research_runs(created_at desc);

-- ─── research_sources: pages scraped by Firecrawl ───────────────────────────
create table if not exists research_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null default 'firecrawl',
  url text,
  created_at timestamptz not null default now()
);

alter table research_sources add column if not exists run_id uuid references research_runs(id) on delete cascade;
alter table research_sources add column if not exists page_type text;
alter table research_sources add column if not exists raw_content text;
alter table research_sources add column if not exists metadata jsonb;

alter table research_sources drop constraint if exists research_sources_source_type_check;
alter table research_sources add constraint research_sources_source_type_check check (
  source_type in ('firecrawl','manual','hunter','google_cse')
);

create index if not exists research_sources_run_id_idx on research_sources(run_id);

-- ─── contact_candidates: review queue created by research ───────────────────
create table if not exists contact_candidates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  name text,
  title text,
  email text,
  linkedin_url text,
  source_url text,
  confidence_score int not null default 0,
  recommended_channel text,
  status text not null default 'needs_review',
  notes text,
  created_at timestamptz not null default now()
);

alter table contact_candidates add column if not exists run_id uuid references research_runs(id) on delete set null;
alter table contact_candidates add column if not exists email_status text;
alter table contact_candidates add column if not exists source_type text;
alter table contact_candidates add column if not exists source_excerpt text;
alter table contact_candidates add column if not exists recommended_action text;
alter table contact_candidates add column if not exists email_confidence int;
alter table contact_candidates add column if not exists promoted_contact_id uuid references contacts(id) on delete set null;
alter table contact_candidates add column if not exists updated_at timestamptz not null default now();

alter table contact_candidates drop constraint if exists contact_candidates_email_status_check;
alter table contact_candidates add constraint contact_candidates_email_status_check check (
  email_status in (
    'direct_email_public','generic_role_email','contact_form','linkedin_only','needs_email','needs_manual_review',
    'verified','unverified','risky','invalid',
    'direct','role','generic','no_reply','unknown'
  )
);

alter table contact_candidates drop constraint if exists contact_candidates_source_type_check;
alter table contact_candidates add constraint contact_candidates_source_type_check check (
  source_type in ('scraped_page','email_regex','search_result','manual','hunter_domain_search','hunter_email_finder','hunter_email_verifier')
);

alter table contact_candidates drop constraint if exists contact_candidates_recommended_channel_check;
alter table contact_candidates add constraint contact_candidates_recommended_channel_check check (
  recommended_channel in ('email','generic_email','contact_form','linkedin','needs_manual_research')
);

alter table contact_candidates drop constraint if exists contact_candidates_recommended_action_check;
alter table contact_candidates add constraint contact_candidates_recommended_action_check check (
  recommended_action in (
    'create_email_draft','create_linkedin_draft','create_contact_form_task','verify_with_hunter','manual_review','skip',
    'email_draft','generic_email_draft','contact_form_task','linkedin_draft','needs_manual_research'
  )
);

alter table contact_candidates drop constraint if exists contact_candidates_status_check;
alter table contact_candidates add constraint contact_candidates_status_check check (
  status in ('needs_review','promoted','rejected')
);

create index if not exists contact_candidates_run_id_idx on contact_candidates(run_id);
create index if not exists contact_candidates_company_id_idx on contact_candidates(company_id);
create index if not exists contact_candidates_status_idx on contact_candidates(status);
create index if not exists contact_candidates_confidence_score_idx on contact_candidates(confidence_score desc);

-- RLS remains compatible with existing service-role server routes.
alter table research_runs enable row level security;
alter table research_sources enable row level security;
alter table contact_candidates enable row level security;
