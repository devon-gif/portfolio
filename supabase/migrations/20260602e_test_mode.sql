-- Hotel Pipeline OS — Migration: test mode
-- Lets you safely route all sends to your own inbox before going live.
-- Idempotent. test_mode defaults ON so you can't accidentally email real contacts.

alter table app_settings add column if not exists test_mode  boolean not null default true;
alter table app_settings add column if not exists test_email  text not null default '';

-- Pre-fill the test address if it's empty (edit in Settings anytime).
update app_settings set test_email = 'heydevon@gmail.com' where coalesce(test_email, '') = '';
