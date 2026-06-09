-- Hotel Pipeline OS — Migration
-- Adds personalization fields + message status for template-driven draft generation.
-- Safe to run multiple times (uses IF NOT EXISTS / guarded updates).
-- Run in the Supabase SQL Editor or via psql.

-- ─── Personalization fields on contacts ──────────────────────────────────────
alter table contacts add column if not exists personalization_angle text;
alter table contacts add column if not exists specific_use_cases    text;
alter table contacts add column if not exists specific_client_type  text;

-- ─── Personalization fields on companies (used as fallback) ───────────────────
alter table companies add column if not exists personalization_angle text;
alter table companies add column if not exists specific_use_cases    text;
alter table companies add column if not exists specific_client_type  text;

-- ─── Messages: draft/sent lifecycle ──────────────────────────────────────────
alter table messages add column if not exists status text not null default 'draft';
-- Enforce allowed values (drop+recreate so the migration stays idempotent).
alter table messages drop constraint if exists messages_status_check;
alter table messages add constraint messages_status_check
  check (status in ('draft','sent','replied','archived'));

alter table messages add column if not exists template_id uuid
  references templates(id) on delete set null;

create index if not exists messages_status_idx on messages(status);

-- ─── Templates: align with channel / template_type naming ─────────────────────
-- The app reads either `channel`/`template_type` (new) or `type` (legacy).
alter table templates add column if not exists channel       text;
alter table templates add column if not exists template_type text;
-- Backfill channel from the legacy `type` column where present.
update templates set channel = type
  where channel is null
    and exists (
      select 1 from information_schema.columns
      where table_name = 'templates' and column_name = 'type'
    );
