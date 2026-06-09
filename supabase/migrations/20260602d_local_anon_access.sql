-- Hotel Pipeline OS — Migration: local-first anon access
-- The app runs with NO AUTH (local, single user), so the browser uses the anon
-- key. The default RLS policies only allow the 'authenticated' role, which would
-- block all client reads/writes. These policies grant the anon role full access.
--
-- ⚠️  SECURITY: This makes every table readable/writable with the public anon key.
--     That is acceptable for a local-only database, but you MUST tighten these
--     (or front everything with server routes) before exposing this app or DB
--     to the internet.
-- Idempotent.

do $$
declare t text;
begin
  foreach t in array array[
    'companies','contacts','suppression_list','templates','outreach_queue',
    'messages','followups','partners','referrals','app_settings',
    'enrollments','send_events'
  ]
  loop
    -- Skip tables that don't exist in this database.
    if to_regclass(t) is null then
      continue;
    end if;

    execute format('alter table %I enable row level security;', t);

    begin
      execute format(
        'create policy "local anon full access" on %I for all to anon using (true) with check (true);', t
      );
    exception when duplicate_object then null; end;

    begin
      execute format(
        'create policy "local authed full access" on %I for all to authenticated using (true) with check (true);', t
      );
    exception when duplicate_object then null; end;
  end loop;
end $$;
