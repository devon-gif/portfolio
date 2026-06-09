-- Hotel Pipeline OS — Market-based send limits (guaranteed)
-- Fixes: "Could not find the 'daily_send_limit_canada' column of 'app_settings'".
-- The Settings page and scheduling code read/write per-market caps; this migration
-- guarantees the columns exist even if 20260604d was never applied.
-- Idempotent and safe to run multiple times. Existing rows keep their values.

-- ─── Per-market daily caps ───────────────────────────────────────────────────
alter table app_settings add column if not exists daily_send_limit_us     int not null default 20;
alter table app_settings add column if not exists daily_send_limit_uk     int not null default 10;
alter table app_settings add column if not exists daily_send_limit_canada int not null default 5;
alter table app_settings add column if not exists daily_send_limit_uae    int not null default 5;
alter table app_settings add column if not exists daily_send_limit_other  int not null default 5;

-- ─── Per-market ramp targets ─────────────────────────────────────────────────
alter table app_settings add column if not exists target_daily_send_limit_us     int not null default 100;
alter table app_settings add column if not exists target_daily_send_limit_uk     int not null default 50;
alter table app_settings add column if not exists target_daily_send_limit_canada int not null default 20;
alter table app_settings add column if not exists target_daily_send_limit_uae    int not null default 20;
alter table app_settings add column if not exists target_daily_send_limit_other  int not null default 10;

-- Backfill any pre-existing rows whose new columns are null (defensive; the NOT
-- NULL defaults above normally handle this, but this keeps older rows consistent).
update app_settings set
  daily_send_limit_us     = coalesce(daily_send_limit_us, 20),
  daily_send_limit_uk     = coalesce(daily_send_limit_uk, 10),
  daily_send_limit_canada = coalesce(daily_send_limit_canada, 5),
  daily_send_limit_uae    = coalesce(daily_send_limit_uae, 5),
  daily_send_limit_other  = coalesce(daily_send_limit_other, 5),
  target_daily_send_limit_us     = coalesce(target_daily_send_limit_us, 100),
  target_daily_send_limit_uk     = coalesce(target_daily_send_limit_uk, 50),
  target_daily_send_limit_canada = coalesce(target_daily_send_limit_canada, 20),
  target_daily_send_limit_uae    = coalesce(target_daily_send_limit_uae, 20),
  target_daily_send_limit_other  = coalesce(target_daily_send_limit_other, 10);

-- Safe range checks (0..500). Added only if missing so existing rows aren't broken.
do $$
begin
  alter table app_settings add constraint app_settings_market_daily_limits_check check (
    daily_send_limit_us     between 0 and 500 and
    daily_send_limit_uk     between 0 and 500 and
    daily_send_limit_canada between 0 and 500 and
    daily_send_limit_uae    between 0 and 500 and
    daily_send_limit_other  between 0 and 500 and
    target_daily_send_limit_us     between 0 and 500 and
    target_daily_send_limit_uk     between 0 and 500 and
    target_daily_send_limit_canada between 0 and 500 and
    target_daily_send_limit_uae    between 0 and 500 and
    target_daily_send_limit_other  between 0 and 500
  );
exception
  when duplicate_object then null; -- constraint already present
end $$;
