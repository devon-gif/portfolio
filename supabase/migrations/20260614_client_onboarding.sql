-- Hotel Pipeline OS — Client Onboarding + Stripe billing (used by /client-onboarding)
-- Agreement/billing/intake/kickoff pipeline. Nothing here auto-sends anything.
-- Idempotent.

create table if not exists client_onboarding_records (
  id                          uuid primary key default gen_random_uuid(),
  company_id                  uuid references companies(id) on delete set null,
  contact_id                  uuid references contacts(id) on delete set null,
  company_name                text not null,
  contact_name                text,
  contact_email               text,
  package_name                text,
  agreement_type              text not null default 'pilot' check (agreement_type in ('pilot','6_month','12_month','custom','referral_partner')),
  monthly_fee                 numeric,
  setup_fee                   numeric,
  property_count              int,
  start_date                  date,
  term_months                 int,
  stage                       text not null default 'proposal_accepted' check (stage in (
    'proposal_accepted','agreement_sent','agreement_signed','payment_link_sent',
    'first_payment_completed','intake_sent','intake_completed','kickoff_scheduled',
    'active_client','renewal_expansion'
  )),
  billing_status              text not null default 'not_started' check (billing_status in (
    'not_started','payment_link_sent','subscription_active','invoice_sent','paid',
    'past_due','failed','canceled','manual'
  )),
  manual_override             boolean not null default false,
  stripe_customer_id          text,
  stripe_subscription_id      text,
  stripe_latest_invoice_id    text,
  agreement_sent_at           timestamptz,
  agreement_signed_at         timestamptz,
  payment_link_sent_at        timestamptz,
  first_payment_completed_at  timestamptz,
  intake_sent_at              timestamptz,
  intake_completed_at         timestamptz,
  kickoff_scheduled_at        timestamptz,
  kickoff_completed_at        timestamptz,
  notes                       text,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists client_onboarding_records_stage_idx on client_onboarding_records(stage);
create index if not exists client_onboarding_records_stripe_customer_idx on client_onboarding_records(stripe_customer_id);

create table if not exists client_onboarding_tasks (
  id                    uuid primary key default gen_random_uuid(),
  onboarding_record_id  uuid not null references client_onboarding_records(id) on delete cascade,
  title                 text not null,
  description           text,
  status                text not null default 'pending' check (status in ('pending','done','skipped')),
  due_date              date,
  completed_at          timestamptz,
  sort_order            int not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create unique index if not exists client_onboarding_tasks_record_title_uniq
  on client_onboarding_tasks(onboarding_record_id, title);

create table if not exists client_intake_responses (
  id                    uuid primary key default gen_random_uuid(),
  onboarding_record_id  uuid not null references client_onboarding_records(id) on delete cascade,
  intake_data           jsonb,
  completed_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create unique index if not exists client_intake_responses_record_uniq
  on client_intake_responses(onboarding_record_id);

-- Stripe price IDs live in app_settings (manual entry, v1).
alter table app_settings add column if not exists stripe_price_single_property text;
alter table app_settings add column if not exists stripe_price_three_property text;
alter table app_settings add column if not exists stripe_price_three_property_seo text;
alter table app_settings add column if not exists stripe_price_five_property_pilot text;
alter table app_settings add column if not exists stripe_price_five_property_seo text;
alter table app_settings add column if not exists stripe_price_custom_group text;
alter table app_settings add column if not exists stripe_price_setup_fee text;

-- RLS (local-first model; tighten before public exposure).
do $$
declare t text;
begin
  foreach t in array array['client_onboarding_records','client_onboarding_tasks','client_intake_responses']
  loop
    execute format('alter table %I enable row level security;', t);
    begin
      execute format('create policy "local anon full access" on %I for all to anon using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
    begin
      execute format('create policy "authenticated full access" on %I for all to authenticated using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
