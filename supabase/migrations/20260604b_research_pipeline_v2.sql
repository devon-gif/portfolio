-- Hotel Pipeline OS — Research pipeline v2 additions
-- Idempotent. Run in the Supabase SQL Editor or via psql.

-- ─── companies: extra research fields ────────────────────────────────────────
alter table companies add column if not exists research_summary       text;
alter table companies add column if not exists property_count_estimate int;
alter table companies add column if not exists property_names         text[] not null default '{}';
alter table companies add column if not exists locations              text[] not null default '{}';
alter table companies add column if not exists amenities              text[] not null default '{}';
alter table companies add column if not exists generic_emails         text[] not null default '{}';
alter table companies add column if not exists contact_form_urls      text[] not null default '{}';
alter table companies add column if not exists phone_numbers          text[] not null default '{}';
alter table companies add column if not exists last_researched_at     timestamptz;

-- ─── contact_candidates: richer fields ───────────────────────────────────────
-- run_id is NOT NULL in the original schema; allow null so we can add candidates
-- without a run (e.g. manual). Only add new columns; don't break existing ones.
alter table contact_candidates add column if not exists email_status        text
  check (email_status in ('direct','role','generic','no_reply','unknown'));
alter table contact_candidates add column if not exists source_type         text
  check (source_type in ('scraped_page','email_regex','search_result','manual'));
alter table contact_candidates add column if not exists source_excerpt      text;
alter table contact_candidates add column if not exists recommended_action  text
  check (recommended_action in (
    'email_draft','generic_email_draft','contact_form_task','linkedin_draft','needs_manual_research'
  ));

-- Relax run_id NOT NULL so candidates can be created outside a run (for future use)
-- We do this carefully: only if the column is still NOT NULL.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'contact_candidates'
      and column_name = 'run_id'
      and is_nullable = 'NO'
  ) then
    alter table contact_candidates alter column run_id drop not null;
  end if;
end $$;
