-- Hotel Pipeline OS — Migration: outreach queue uses real contacts
-- Adds the columns the "Generate Today's Queue" flow inserts/filters on.
-- Idempotent. Safe to run multiple times.

-- ─── Messages: company link + lifecycle metadata used by the outreach page ─────
alter table messages add column if not exists company_id    uuid references companies(id) on delete set null;
alter table messages add column if not exists approved_at    timestamptz;
alter table messages add column if not exists error_message  text;

create index if not exists messages_company_id_idx on messages(company_id);

-- ─── Suppression list: match by email, domain, or company name ────────────────
alter table suppression_list add column if not exists domain        text;
alter table suppression_list add column if not exists company_name  text;

-- Email may be null when suppressing by domain or company only.
alter table suppression_list alter column email drop not null;

create index if not exists suppression_domain_idx       on suppression_list(domain);
create index if not exists suppression_company_name_idx on suppression_list(company_name);
