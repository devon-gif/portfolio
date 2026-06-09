-- Hotel Pipeline OS — Migration: timed batch scheduled sending
-- Adds the full message-status set, scheduled_send_at, and batch/window settings.
-- Idempotent. Run after the earlier migrations.

-- ─── Messages: scheduled sending lifecycle ───────────────────────────────────
alter table messages add column if not exists scheduled_send_at timestamptz;

alter table messages drop constraint if exists messages_status_check;
alter table messages add constraint messages_status_check check (status in (
  'draft','needs_review','approved','scheduled','sending','sent',
  'send_failed','failed','replied','not_interested','do_not_contact',
  'bounced','skipped','archived'
));

create index if not exists messages_scheduled_send_at_idx on messages(scheduled_send_at);

-- ─── App settings: scheduling window + batch pacing ──────────────────────────
alter table app_settings add column if not exists target_daily_send_limit       int not null default 20;
alter table app_settings add column if not exists send_window_start_hour         int not null default 9;
alter table app_settings add column if not exists send_window_end_hour           int not null default 17;
alter table app_settings add column if not exists batch_size_min                 int not null default 3;
alter table app_settings add column if not exists batch_size_max                 int not null default 8;
alter table app_settings add column if not exists minutes_between_batches_min    int not null default 20;
alter table app_settings add column if not exists minutes_between_batches_max    int not null default 60;
alter table app_settings add column if not exists require_manual_approval        boolean not null default true;

-- target_daily_send_limit is the ceiling you're ramping toward (cap 200).
alter table app_settings drop constraint if exists app_settings_target_limit_check;
alter table app_settings add constraint app_settings_target_limit_check
  check (target_daily_send_limit between 1 and 200);

-- Sensible bounds on the send window (0–23, start before end).
alter table app_settings drop constraint if exists app_settings_send_window_check;
alter table app_settings add constraint app_settings_send_window_check
  check (
    send_window_start_hour between 0 and 23
    and send_window_end_hour between 1 and 24
    and send_window_start_hour < send_window_end_hour
  );
