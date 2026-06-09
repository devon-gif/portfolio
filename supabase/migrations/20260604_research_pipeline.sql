-- Hotel Pipeline OS — Research Pipeline
-- Idempotent. Run in the Supabase SQL Editor or via psql.

-- ─── research_runs ────────────────────────────────────────────────────────────
create table if not exists research_runs (
  id                      uuid primary key default gen_random_uuid(),
  company_id              uuid references companies(id) on delete set null,
  company_name            text not null,
  website_url             text,
  status                  text not null default 'pending' check (status in ('pending','running','done','error')),
  error_msg               text,
  -- Extracted findings
  property_count_estimate int,
  company_type            text,
  property_names          text[] not null default '{}',
  amenities               text[] not null default '{}',
  generic_emails          text[] not null default '{}',
  contact_form_urls       text[] not null default '{}',
  personalization_angle   text,
  specific_use_cases      text,
  fit_score               int not null default 0,
  pages_scraped           int not null default 0,
  sources_used            text[] not null default '{}',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger research_runs_updated_at before update on research_runs
  for each row execute function set_updated_at();

create index if not exists research_runs_company_id_idx on research_runs(company_id);
create index if not exists research_runs_status_idx     on research_runs(status);
create index if not exists research_runs_created_at_idx on research_runs(created_at desc);

-- ─── research_sources ─────────────────────────────────────────────────────────
-- Raw content captured from each source during a research run.
create table if not exists research_sources (
  id          uuid primary key default gen_random_uuid(),
  run_id      uuid not null references research_runs(id) on delete cascade,
  source_type text not null check (source_type in ('firecrawl','google_cse','hunter','manual')),
  url         text,
  page_type   text, -- homepage | about | contact | team | leadership | properties | search_result | email_search
  raw_content text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists research_sources_run_id_idx on research_sources(run_id);

-- ─── contact_candidates ───────────────────────────────────────────────────────
-- Possible contacts discovered during research. NOT emailed automatically.
-- User must promote a candidate to contacts before any outreach.
create table if not exists contact_candidates (
  id                   uuid primary key default gen_random_uuid(),
  run_id               uuid not null references research_runs(id) on delete cascade,
  company_id           uuid references companies(id) on delete set null,
  name                 text,
  title                text,
  email                text,
  linkedin_url         text,
  source_url           text,
  confidence_score     int not null default 0,
  recommended_channel  text check (recommended_channel in (
    'email','generic_email','contact_form','linkedin','needs_manual_research'
  )),
  status               text not null default 'needs_review' check (status in (
    'needs_review','promoted','rejected'
  )),
  notes                text,
  promoted_contact_id  uuid references contacts(id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger contact_candidates_updated_at before update on contact_candidates
  for each row execute function set_updated_at();

create index if not exists contact_candidates_run_id_idx    on contact_candidates(run_id);
create index if not exists contact_candidates_company_id_idx on contact_candidates(company_id);
create index if not exists contact_candidates_status_idx     on contact_candidates(status);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table research_runs      enable row level security;
alter table research_sources   enable row level security;
alter table contact_candidates enable row level security;

-- Permissive policies (service role bypasses RLS; anon key used only from server routes)
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'research_runs' and policyname = 'auth users full access'
  ) then
    execute 'create policy "auth users full access" on research_runs      for all using (auth.role() = ''authenticated'')';
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'research_sources' and policyname = 'auth users full access'
  ) then
    execute 'create policy "auth users full access" on research_sources   for all using (auth.role() = ''authenticated'')';
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'contact_candidates' and policyname = 'auth users full access'
  ) then
    execute 'create policy "auth users full access" on contact_candidates for all using (auth.role() = ''authenticated'')';
  end if;
end $$;
