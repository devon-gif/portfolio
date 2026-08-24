-- ─────────────────────────────────────────────────────────────────────────────
-- 20260824b — Harden the review SECURITY DEFINER functions
--
-- STATUS: NOT APPLIED. Reviewed by Devon before running.
--
-- Fixes two findings in the existing review portal platform. Neither changes a
-- function's signature, arguments, return type, or behaviour for a legitimate
-- caller, so no application code needs to change alongside it.
--
-- ═════════════════════════════════════════════════════════════════════════════
-- FINDING 1 (critical) — pg_temp is missing from every search_path
-- ═════════════════════════════════════════════════════════════════════════════
-- All 14 functions were created with `set search_path = public`.
--
-- PostgreSQL resolves unqualified relation names against pg_temp FIRST unless
-- pg_temp appears explicitly in the search_path, and TEMP on a database is
-- granted to PUBLIC by default. So any authenticated user can run:
--
--   create temp table review_profiles (user_id uuid, email text, role text,
--                                      first_name text, last_name text);
--   insert into review_profiles values (auth.uid(), 'x@x', 'admin', 'x', 'x');
--
-- and then review_is_admin() — executing as the function OWNER, because it is
-- SECURITY DEFINER — reads the attacker's temp table and returns true. Since
-- review_is_admin() backs every RLS policy and every write RPC in the schema,
-- that is complete admin escalation across all tenants.
--
-- The fix is to put pg_temp LAST in the search path, which is the documented
-- safe form: real objects in `public` win, and anything the caller creates in
-- pg_temp can never shadow them.
--
-- ALTER FUNCTION ... SET is used rather than CREATE OR REPLACE so the bodies
-- are not rewritten here. That keeps this migration small, reviewable, and
-- impossible to accidentally regress a body against.
-- ─────────────────────────────────────────────────────────────────────────────

alter function public.review_is_admin()                    set search_path = public, pg_temp;
alter function public.review_member_org_ids()              set search_path = public, pg_temp;
alter function public.review_admin_user_ids()              set search_path = public, pg_temp;
alter function public.review_org_member_user_ids(uuid)     set search_path = public, pg_temp;
alter function public.review_participants(uuid[])          set search_path = public, pg_temp;

alter function public.review_create_item(uuid, uuid, text, text, text, text, text, text, bigint)
  set search_path = public, pg_temp;
alter function public.review_send_to_review(uuid)          set search_path = public, pg_temp;
alter function public.review_upload_version(uuid, text, text, text, bigint, text)
  set search_path = public, pg_temp;
alter function public.review_update_item_metadata(uuid, text, text)
  set search_path = public, pg_temp;
alter function public.review_archive_item(uuid)            set search_path = public, pg_temp;
alter function public.review_reopen_item(uuid)             set search_path = public, pg_temp;
alter function public.review_client_decide(uuid, text, text)
  set search_path = public, pg_temp;
alter function public.review_send_message(uuid, uuid, uuid, text)
  set search_path = public, pg_temp;
alter function public.review_mark_message_read(uuid)       set search_path = public, pg_temp;

-- ═════════════════════════════════════════════════════════════════════════════
-- FINDING 2 (high) — review_org_member_user_ids() is a cross-tenant enumerator
-- ═════════════════════════════════════════════════════════════════════════════
-- It takes a caller-supplied organization id, performs NO membership check, and
-- is granted to `authenticated`. Any signed-in client can therefore call
--
--   select public.review_org_member_user_ids('<another-org-uuid>');
--
-- and enumerate that organization's member user ids — something no RLS policy
-- permits, since review_memberships is restricted to "your own row, or admin".
--
-- The function exists only so the write RPCs can fan out notification rows.
-- Those RPCs are SECURITY DEFINER: they execute as the owner and do NOT require
-- the CALLER to hold EXECUTE. So revoking the grant closes the hole with no
-- functional change. Verified against the review data layer: nothing in
-- lib/review/* calls this RPC directly from the browser.
-- ─────────────────────────────────────────────────────────────────────────────

revoke execute on function public.review_org_member_user_ids(uuid) from authenticated;
revoke execute on function public.review_org_member_user_ids(uuid) from anon;

-- review_admin_user_ids() has the same shape — a definer helper used only for
-- notification fan-out inside other RPCs — and leaks the full admin roster to
-- any signed-in user. Same reasoning, same fix.
revoke execute on function public.review_admin_user_ids() from authenticated;
revoke execute on function public.review_admin_user_ids() from anon;

-- ── Verification after applying ──────────────────────────────────────────────
-- Every function should show {search_path=public,\ pg_temp} in proconfig:
--
--   select p.proname, p.proconfig
--   from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--   where n.nspname = 'public' and p.proname like 'review_%'
--   order by p.proname;
--
-- And the two helpers should no longer be executable by authenticated:
--
--   select has_function_privilege('authenticated',
--     'public.review_org_member_user_ids(uuid)', 'execute');   -- expect false
--
-- Then sign in as a client and confirm the portal still loads items, and as
-- admin confirm upload / send-to-review / decide all still work. If anything
-- breaks, the rollback below is safe and immediate.

-- ── Rollback ─────────────────────────────────────────────────────────────────
-- grant execute on function public.review_org_member_user_ids(uuid) to authenticated;
-- grant execute on function public.review_admin_user_ids() to authenticated;
-- alter function public.review_is_admin() set search_path = public;
-- ... (repeat per function; the original value was `public`)
