-- ─────────────────────────────────────────────────────────────────────────────
-- 20260824c — Tighten review policies and close anon access on bookings
--
-- STATUS: NOT APPLIED. Reviewed by Devon before running.
--
-- This is the only one of the three migrations that can break behaviour, so
-- each part is separated and independently revertible. Apply 20260824b first —
-- it is strictly safer and fixes the more serious problem.
--
-- ═════════════════════════════════════════════════════════════════════════════
-- PART 1 (safe now) — strategy_call_bookings is readable with the public key
-- ═════════════════════════════════════════════════════════════════════════════
-- Verified against the live database: the anon key returns all 5 rows of this
-- table. It is the ONLY table in the project that actually leaks — every other
-- table correctly returns zero rows to anon.
--
-- Origin: 20260713_strategy_call_bookings.sql created
--   `for all to anon using (true) with check (true)`
-- which grants the public key not just read but INSERT, UPDATE and DELETE on
-- every booking.
--
-- Verified safe to drop: all four consumers — app/api/strategy-call/route.ts,
-- app/api/strategy-call/confirmation/route.ts, app/api/webhooks/strategy-call/
-- route.ts, and lib/strategy-call.ts — are server routes using the service-role
-- client, which bypasses RLS entirely. No application code changes with this.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "local anon full access" on public.strategy_call_bookings;

-- The authenticated policy is left in place deliberately: it is not a public
-- credential, and removing it is a separate decision about who in the org may
-- read bookings.

-- ═════════════════════════════════════════════════════════════════════════════
-- PART 2 (needs a look first) — admin direct-write policies bypass the RPCs
-- ═════════════════════════════════════════════════════════════════════════════
-- The platform migration's stated design is "authorization logic in Postgres,
-- not in the React admin/client UI": every write goes through a SECURITY
-- DEFINER function that validates state transitions and writes the audit trail.
--
-- These four policies re-open the direct-write path for any admin session:
--
--   review_items_admin_insert    with check (review_is_admin())
--   review_items_admin_update    using/with check (review_is_admin())
--   review_versions_admin_insert with check (review_is_admin())
--   review_actions_admin_insert  with check (review_is_admin())
--
-- None constrains a single column, so from a browser console an admin session
-- can:
--   * insert a review_item whose property_id belongs to a DIFFERENT
--     organization — the exact cross-tenant bug the 20260728 hardening
--     migration added a check for, but only inside review_create_item;
--   * update current_status straight to 'approved', skipping the
--     review_client_decide state machine and writing no review_actions row —
--     the audit trail is bypassable by the party it exists to record;
--   * insert a review_actions row with an arbitrary user_id, forging an
--     approval in the client's name.
--
-- The RPCs do NOT need these policies: they are SECURITY DEFINER and execute as
-- the table owner. Dropping them makes the RPCs the only write path, which is
-- what the design intends.
--
-- BEFORE APPLYING, confirm no admin code path writes these tables directly.
-- Checked so far: lib/review/supabase.ts uses an RPC for every write
-- (review_create_item, review_send_to_review, review_upload_version,
-- review_archive_item, review_reopen_item, review_update_item_metadata) and
-- raw table access only for SELECT. Storage uploads are unaffected — they are
-- governed by the storage.objects policies, which this does not touch.
--
-- If anything does break, the symptom is a clear "new row violates row-level
-- security policy" on an admin action, and the rollback restores it instantly.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "review_items_admin_insert"    on public.review_items;
drop policy if exists "review_items_admin_update"    on public.review_items;
drop policy if exists "review_versions_admin_insert" on public.review_versions;
drop policy if exists "review_actions_admin_insert"  on public.review_actions;

-- ═════════════════════════════════════════════════════════════════════════════
-- PART 3 (low risk) — draft items leak through the messages table
-- ═════════════════════════════════════════════════════════════════════════════
-- review_items, review_versions and review_actions all hide drafts from clients
-- with `current_status <> 'draft'`. review_messages does not, so a message
-- attached to a draft item is readable by every client in the organization
-- before that work has been shown to them.
--
-- This adds the same draft filter, applied only to messages that are attached
-- to an item. Organization-level messages (review_item_id is null) are
-- unaffected, since those are the general client conversation.
-- ─────────────────────────────────────────────────────────────────────────────

drop policy if exists "review_messages_select" on public.review_messages;

create policy "review_messages_select" on public.review_messages
  for select to authenticated
  using (
    review_is_admin()
    or (
      organization_id in (select review_member_org_ids())
      and (
        review_item_id is null
        or exists (
          select 1 from public.review_items ri
          where ri.id = review_messages.review_item_id
            and ri.current_status <> 'draft'
        )
      )
    )
  );

-- ── Verification after applying ──────────────────────────────────────────────
--   -- anon must now see zero bookings:
--   select count(*) from strategy_call_bookings;      -- as anon: expect 0
--
--   -- the four policies must be gone:
--   select polname from pg_policy
--   where polrelid in ('review_items'::regclass, 'review_versions'::regclass,
--                      'review_actions'::regclass);
--
-- Then, signed in as admin: upload an item, send it for review, upload a
-- revision, archive and reopen it. Signed in as a client: load the portal,
-- approve an item, request changes, send a message. All must still work — they
-- go through the RPCs, which are unaffected.

-- ── Rollback ─────────────────────────────────────────────────────────────────
-- create policy "local anon full access" on public.strategy_call_bookings
--   for all to anon using (true) with check (true);
--
-- create policy "review_items_admin_insert" on public.review_items
--   for insert to authenticated with check (review_is_admin());
-- create policy "review_items_admin_update" on public.review_items
--   for update to authenticated using (review_is_admin()) with check (review_is_admin());
-- create policy "review_versions_admin_insert" on public.review_versions
--   for insert to authenticated with check (review_is_admin());
-- create policy "review_actions_admin_insert" on public.review_actions
--   for insert to authenticated with check (review_is_admin());
--
-- drop policy if exists "review_messages_select" on public.review_messages;
-- create policy "review_messages_select" on public.review_messages
--   for select to authenticated
--   using (review_is_admin() or organization_id in (select review_member_org_ids()));
