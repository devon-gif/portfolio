-- ─────────────────────────────────────────────────────────────────────────────
-- 20260824a — Link CRM client accounts to review organizations
--
-- STATUS: NOT APPLIED. Reviewed by Devon before running.
--
-- WHY
-- The CRM half (client_onboarding_records: plan, fee, property count, Stripe
-- customer, onboarding checklist) and the creative-review half (review_*:
-- organizations, properties, memberships, items) share one database and have
-- no relationship in it. No single query can answer "show this client their
-- plan AND their creative", which is exactly what the client portal is.
--
-- DESIGN
-- The CRM record is the system of record for "who is a client". The link is a
-- nullable FK from client_onboarding_records to review_organizations, so:
--   * every existing row stays valid with no backfill,
--   * a client can exist in the CRM before their review workspace is created,
--   * the review side keeps working untouched if the column is never set.
--
-- BLAST RADIUS
-- Additive only. No policy is created, altered, or dropped. No existing column
-- changes. Nothing outside this repo reads the new column. Safe to apply at any
-- time, independently of the other two migrations.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.client_onboarding_records
  add column if not exists review_organization_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'client_onboarding_records_review_organization_id_fkey'
  ) then
    alter table public.client_onboarding_records
      add constraint client_onboarding_records_review_organization_id_fkey
      foreign key (review_organization_id)
      references public.review_organizations (id)
      on delete set null;
  end if;
end $$;

-- One CRM record per review organization. Prevents two client accounts silently
-- pointing at the same workspace, which would make "whose creative is this?"
-- ambiguous. Partial, so the many un-linked rows don't collide on NULL.
create unique index if not exists client_onboarding_records_review_org_unique
  on public.client_onboarding_records (review_organization_id)
  where review_organization_id is not null;

comment on column public.client_onboarding_records.review_organization_id is
  'Optional link to the creative-review workspace for this client. Set by the owner in the admin workspace. NULL means no review workspace has been provisioned yet.';

-- ── Rollback ─────────────────────────────────────────────────────────────────
-- drop index if exists public.client_onboarding_records_review_org_unique;
-- alter table public.client_onboarding_records
--   drop constraint if exists client_onboarding_records_review_organization_id_fkey;
-- alter table public.client_onboarding_records
--   drop column if exists review_organization_id;
