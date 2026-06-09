-- Hotel Pipeline OS — Market-based sending limits
-- Idempotent. Run in Supabase SQL editor.

-- ─── Market enum-ish constraints ─────────────────────────────────────────────
alter table companies add column if not exists market text;
alter table contacts add column if not exists market text;

do $$
begin
  alter table companies drop constraint if exists companies_market_check;
  alter table companies add constraint companies_market_check
    check (market in ('US','Canada','UK','UAE','Other') or market is null);
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table contacts drop constraint if exists contacts_market_check;
  alter table contacts add constraint contacts_market_check
    check (market in ('US','Canada','UK','UAE','Other') or market is null);
exception when duplicate_object then null;
end $$;

-- Backfill contact market from company when missing.
update contacts c
set market = co.market
from companies co
where c.company_id = co.id
  and c.market is null
  and co.market is not null;

-- ─── app_settings per-market caps + targets ─────────────────────────────────
alter table app_settings add column if not exists daily_send_limit_us int not null default 20;
alter table app_settings add column if not exists daily_send_limit_uk int not null default 10;
alter table app_settings add column if not exists daily_send_limit_canada int not null default 5;
alter table app_settings add column if not exists daily_send_limit_uae int not null default 5;
alter table app_settings add column if not exists daily_send_limit_other int not null default 5;

alter table app_settings add column if not exists target_daily_send_limit_us int not null default 100;
alter table app_settings add column if not exists target_daily_send_limit_uk int not null default 50;
alter table app_settings add column if not exists target_daily_send_limit_canada int not null default 20;
alter table app_settings add column if not exists target_daily_send_limit_uae int not null default 20;
alter table app_settings add column if not exists target_daily_send_limit_other int not null default 10;
-- Hotel Pipeline OS — Market-based sending limits
-- Idempotent. Run in Supabase SQL Editor or via psql.

-- ─── markets on companies + contacts ─────────────────────────────────────────
alter table companies add column if not exists market text;
alter table contacts add column if not exists market text;

alter table companies drop constraint if exists companies_market_check;
alter table companies add constraint companies_market_check
  check (market in ('US','Canada','UK','UAE','Other'));

alter table contacts drop constraint if exists contacts_market_check;
alter table contacts add constraint contacts_market_check
  check (market in ('US','Canada','UK','UAE','Other'));

create index if not exists companies_market_idx on companies(market);
create index if not exists contacts_market_idx on contacts(market);

-- ─── per-market app settings ────────────────────────────────────────────────
alter table app_settings add column if not exists daily_send_limit_us      int not null default 20;
alter table app_settings add column if not exists daily_send_limit_uk      int not null default 10;
alter table app_settings add column if not exists daily_send_limit_canada  int not null default 5;
alter table app_settings add column if not exists daily_send_limit_uae     int not null default 5;
alter table app_settings add column if not exists daily_send_limit_other   int not null default 5;

alter table app_settings add column if not exists target_send_limit_us      int not null default 100;
alter table app_settings add column if not exists target_send_limit_uk      int not null default 50;
alter table app_settings add column if not exists target_send_limit_canada  int not null default 20;
alter table app_settings add column if not exists target_send_limit_uae     int not null default 20;
alter table app_settings add column if not exists target_send_limit_other   int not null default 10;

-- Keep existing single-row defaults aligned
update app_settings
set
  daily_send_limit_us = coalesce(daily_send_limit_us, 20),
  daily_send_limit_uk = coalesce(daily_send_limit_uk, 10),
  daily_send_limit_canada = coalesce(daily_send_limit_canada, 5),
  daily_send_limit_uae = coalesce(daily_send_limit_uae, 5),
  daily_send_limit_other = coalesce(daily_send_limit_other, 5),
  target_send_limit_us = coalesce(target_send_limit_us, 100),
  target_send_limit_uk = coalesce(target_send_limit_uk, 50),
  target_send_limit_canada = coalesce(target_send_limit_canada, 20),
  target_send_limit_uae = coalesce(target_send_limit_uae, 20),
  target_send_limit_other = coalesce(target_send_limit_other, 10);
