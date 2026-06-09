-- Hotel Pipeline OS — Supabase Schema
-- Run this in the Supabase SQL Editor or via `psql`

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Helpers ─────────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Companies ───────────────────────────────────────────────────────────────
create table if not exists companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in (
    'hotel_management_company','hospitality_group','boutique_hotel_group',
    'resort_group','independent_lifestyle_hotel','branded_hotel','other'
  )),
  size          text check (size in ('small','medium','large','enterprise')),
  website       text,
  hq_city       text,
  hq_state      text,
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger companies_updated_at before update on companies
  for each row execute function set_updated_at();

-- ─── Contacts ────────────────────────────────────────────────────────────────
create table if not exists contacts (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  title           text not null default '',
  company_id      uuid references companies(id) on delete set null,
  company_name    text not null default '',
  company_type    text not null default 'other' check (company_type in (
    'hotel_management_company','hospitality_group','boutique_hotel_group',
    'resort_group','independent_lifestyle_hotel','branded_hotel','other'
  )),
  type            text not null check (type in ('buyer','decision_maker','influencer','partner','unknown')),
  status          text not null default 'new' check (status in (
    'new','contacted','replied','meeting_set','proposal_sent','won','lost','not_fit','opted_out','suppressed'
  )),
  email           text,
  phone           text,
  linkedin_url    text,
  city            text,
  state           text,
  notes           text not null default '',
  score           int not null default 0,
  last_contacted  timestamptz,
  opted_out       boolean not null default false,
  opt_out_status  text check (opt_out_status in ('opted_out','not_fit','suppressed')),
  source          text check (source in ('manual','import','linkedin','referral','website','other')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index contacts_company_id_idx on contacts(company_id);
create index contacts_status_idx on contacts(status);
create index contacts_score_idx on contacts(score desc);
create trigger contacts_updated_at before update on contacts
  for each row execute function set_updated_at();

-- ─── Suppression List ────────────────────────────────────────────────────────
create table if not exists suppression_list (
  id        uuid primary key default gen_random_uuid(),
  email     text not null unique,
  reason    text,
  source    text,
  added_at  timestamptz not null default now()
);
create index suppression_email_idx on suppression_list(email);

-- ─── Templates ───────────────────────────────────────────────────────────────
create table if not exists templates (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('email','linkedin','followup')),
  subject     text,
  body        text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger templates_updated_at before update on templates
  for each row execute function set_updated_at();

-- ─── Outreach Queue ──────────────────────────────────────────────────────────
create table if not exists outreach_queue (
  id              uuid primary key default gen_random_uuid(),
  contact_id      uuid not null references contacts(id) on delete cascade,
  status          text not null default 'draft' check (status in (
    'draft','approved','sent','skipped','follow_up'
  )),
  score           int not null default 0,
  email_draft     text,
  linkedin_draft  text,
  sent_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index outreach_queue_contact_id_idx on outreach_queue(contact_id);
create index outreach_queue_status_idx on outreach_queue(status);
create index outreach_queue_created_at_idx on outreach_queue(created_at desc);
create trigger outreach_queue_updated_at before update on outreach_queue
  for each row execute function set_updated_at();

-- ─── Messages ────────────────────────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  contact_id      uuid not null references contacts(id) on delete cascade,
  queue_item_id   uuid references outreach_queue(id) on delete set null,
  channel         text not null check (channel in ('email','linkedin','other')),
  subject         text,
  body            text not null,
  sent_at         timestamptz,
  opened_at       timestamptz,
  replied_at      timestamptz,
  created_at      timestamptz not null default now()
);
create index messages_contact_id_idx on messages(contact_id);

-- ─── Follow-ups ──────────────────────────────────────────────────────────────
create table if not exists followups (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references contacts(id) on delete cascade,
  due_date    date not null,
  notes       text not null default '',
  status      text not null default 'pending' check (status in ('pending','completed','cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index followups_contact_id_idx on followups(contact_id);
create index followups_due_date_idx on followups(due_date);
create index followups_status_idx on followups(status);
create trigger followups_updated_at before update on followups
  for each row execute function set_updated_at();

-- ─── Partners ────────────────────────────────────────────────────────────────
create table if not exists partners (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  company           text,
  email             text,
  phone             text,
  linkedin_url      text,
  partnership_type  text not null check (partnership_type in ('referral','agency','tech','co_marketing','other')),
  commission_type   text check (commission_type in ('percentage','flat','retainer')),
  commission_value  numeric(10,2),
  status            text not null default 'active' check (status in ('active','inactive','prospect')),
  notes             text not null default '',
  referral_count    int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create trigger partners_updated_at before update on partners
  for each row execute function set_updated_at();

-- ─── Referrals ───────────────────────────────────────────────────────────────
create table if not exists referrals (
  id              uuid primary key default gen_random_uuid(),
  partner_id      uuid references partners(id) on delete set null,
  contact_id      uuid references contacts(id) on delete set null,
  company_id      uuid references companies(id) on delete set null,
  status          text not null default 'pending' check (status in ('pending','active','won','lost')),
  deal_value      numeric(12,2),
  commission_due  numeric(12,2),
  notes           text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger referrals_updated_at before update on referrals
  for each row execute function set_updated_at();

-- ─── App Settings ─────────────────────────────────────────────────────────────
create table if not exists app_settings (
  id               uuid primary key default gen_random_uuid(),
  portfolio_url    text not null default '',
  sender_name      text not null default '',
  email_signature  text not null default '',
  mailing_address  text not null default '',
  opt_out_line     text not null default '',
  daily_send_goal  int not null default 10,
  updated_at       timestamptz not null default now()
);
-- Ensure single row
insert into app_settings (id) values (gen_random_uuid()) on conflict do nothing;

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS and create permissive policies for authenticated users.
-- Tighten these per your auth requirements.

alter table companies        enable row level security;
alter table contacts         enable row level security;
alter table suppression_list enable row level security;
alter table templates        enable row level security;
alter table outreach_queue   enable row level security;
alter table messages         enable row level security;
alter table followups        enable row level security;
alter table partners         enable row level security;
alter table referrals        enable row level security;
alter table app_settings     enable row level security;

create policy "auth users full access" on companies        for all using (auth.role() = 'authenticated');
create policy "auth users full access" on contacts         for all using (auth.role() = 'authenticated');
create policy "auth users full access" on suppression_list for all using (auth.role() = 'authenticated');
create policy "auth users full access" on templates        for all using (auth.role() = 'authenticated');
create policy "auth users full access" on outreach_queue   for all using (auth.role() = 'authenticated');
create policy "auth users full access" on messages         for all using (auth.role() = 'authenticated');
create policy "auth users full access" on followups        for all using (auth.role() = 'authenticated');
create policy "auth users full access" on partners         for all using (auth.role() = 'authenticated');
create policy "auth users full access" on referrals        for all using (auth.role() = 'authenticated');
create policy "auth users full access" on app_settings     for all using (auth.role() = 'authenticated');
