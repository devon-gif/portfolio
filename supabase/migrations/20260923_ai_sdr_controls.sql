-- Hotel Pipeline OS — AI SDR control plane
-- Date: 2026-09-23
-- Adds low-risk controls + run audit for the automated hotel prospecting loop.
-- This migration does NOT enable automatic sending. All outbound still lands as
-- a draft and requires Devon's existing approval flow.

create extension if not exists "pgcrypto";

alter table app_settings add column if not exists ai_sdr_enabled boolean not null default false;
alter table app_settings add column if not exists ai_sdr_auto_promote boolean not null default true;
alter table app_settings add column if not exists ai_sdr_auto_hunter boolean not null default false;
alter table app_settings add column if not exists ai_sdr_auto_draft boolean not null default true;
alter table app_settings add column if not exists ai_sdr_daily_prospect_limit int not null default 10
  check (ai_sdr_daily_prospect_limit between 0 and 100);
alter table app_settings add column if not exists ai_sdr_enrich_limit int not null default 5
  check (ai_sdr_enrich_limit between 0 and 25);
alter table app_settings add column if not exists ai_sdr_min_confidence int not null default 70
  check (ai_sdr_min_confidence between 0 and 100);
alter table app_settings add column if not exists ai_sdr_calendly_url text not null default 'https://calendly.com/devonavich0/30min';

create table if not exists ai_sdr_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'running'
    check (status in ('running','success','partial','skipped','error')),
  trigger_type text not null default 'manual'
    check (trigger_type in ('manual','cron')),
  provider text,
  prospects_found int not null default 0,
  companies_promoted int not null default 0,
  companies_enriched int not null default 0,
  candidates_found int not null default 0,
  hunter_lookups int not null default 0,
  contacts_prepared int not null default 0,
  drafts_created int not null default 0,
  warnings text[] not null default '{}',
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ai_sdr_runs_created_at_idx on ai_sdr_runs(created_at desc);
create index if not exists ai_sdr_runs_status_idx on ai_sdr_runs(status);

alter table ai_sdr_runs enable row level security;

do $$
begin
  create policy "local anon full access" on ai_sdr_runs
    for all to anon using (true) with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "local authed full access" on ai_sdr_runs
    for all to authenticated using (true) with check (true);
exception when duplicate_object then null;
end $$;
