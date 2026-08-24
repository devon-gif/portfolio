-- Archer Review — hardening pass on top of 20260723_review_portal_platform.sql.
--
-- Run this AFTER 20260723_review_portal_platform.sql. Idempotent: safe to run
-- more than once (create-or-replace functions only; no schema changes, no
-- data migration, nothing destructive).
--
-- Fixes four real problems found auditing the deployed shape of the portal:
--
--   1. Clients could not resolve the names or roles of anyone but themselves.
--      review_profiles' select policy is (correctly) "your own row, or you're
--      an admin", which means Emma's browser gets zero rows back when it asks
--      who performed each review_action or sent each review_message. The UI
--      then falls back to "Someone", and — worse — treats Devon's chat
--      messages as if they came from a client, because the role lookup also
--      returns nothing. Loosening the profiles policy would leak email
--      addresses across organizations, so instead this adds a narrow
--      SECURITY DEFINER lookup that returns display name + role ONLY (never
--      email, never last name) and only for users the caller legitimately
--      shares a workspace with.
--
--   2. review_client_decide accepted a decision on an item in ANY non-draft
--      status, including one that was already approved or archived. That let
--      a double-click write two decisions, let an approved asset be silently
--      flipped back to "changes requested" with no new version, and let a
--      decision be recorded against archived work. Decisions are now only
--      legal from 'ready_for_review' — the admin's explicit
--      review_reopen_item() is the intentional path back.
--
--   3. review_send_to_review accepted an item that was already
--      'ready_for_review', so a double-click produced two 'submitted' audit
--      rows and a duplicate notification to every member of the org.
--
--   4. review_create_item never checked that the property actually belongs to
--      the organization the item is being filed under, so a malformed or
--      hand-crafted call could attach a Valencia item to another client's
--      property.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Narrow participant lookup (display name + role only)
--
-- Returns a row only when the target user is either (a) an Archer Design
-- admin — admins are counterparties to every client workspace by design — or
-- (b) a member of an organization the CALLER also belongs to. Admins calling
-- this can resolve anyone. Deliberately does NOT return email or last name,
-- so this is strictly less exposure than widening the review_profiles select
-- policy would be.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_participants(p_user_ids uuid[])
returns table (user_id uuid, display_name text, role text)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.user_id,
    coalesce(nullif(trim(both from p.first_name), ''), split_part(p.email, '@', 1)) as display_name,
    p.role
  from review_profiles p
  where p.user_id = any(p_user_ids)
    and (
      -- The caller must themselves be a known participant.
      exists (select 1 from review_profiles me where me.user_id = auth.uid())
    )
    and (
      review_is_admin()
      or p.user_id = auth.uid()
      or p.role = 'admin'
      or exists (
        select 1
        from review_memberships target
        join review_memberships caller
          on caller.organization_id = target.organization_id
        where target.user_id = p.user_id
          and caller.user_id = auth.uid()
      )
    );
$$;

revoke all on function public.review_participants(uuid[]) from public;
grant execute on function public.review_participants(uuid[]) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Decisions are only legal from 'ready_for_review'
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_client_decide(
  p_review_item_id uuid,
  p_decision       text,
  p_message        text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_status text;
begin
  if p_decision not in ('approved', 'changes_requested', 'new_direction_requested') then
    raise exception 'Invalid decision: %', p_decision;
  end if;

  if p_decision <> 'approved' and coalesce(trim(both from p_message), '') = '' then
    raise exception 'Written feedback is required before requesting a change.';
  end if;

  -- FOR UPDATE serializes concurrent decisions on the same item, so the
  -- status check below is a real guard and not a check-then-act race: a
  -- second, simultaneous click blocks here and then fails the status test.
  select organization_id, current_status into v_org_id, v_status
  from review_items where id = p_review_item_id
  for update;

  if v_org_id is null then
    raise exception 'Review item not found.';
  end if;

  if not (review_is_admin() or v_org_id in (select review_member_org_ids())) then
    raise exception 'Not authorized for this review item.';
  end if;

  if v_status = 'draft' then
    raise exception 'This item has not been sent for review yet.';
  end if;

  if v_status = 'archived' then
    raise exception 'This item has been archived and can no longer be reviewed.';
  end if;

  if v_status <> 'ready_for_review' then
    raise exception 'This item has already been reviewed. Ask Archer Design to send a new version or reopen it.';
  end if;

  update review_items
  set current_status = p_decision, updated_at = now()
  where id = p_review_item_id;

  insert into review_actions (review_item_id, user_id, action, message)
  values (p_review_item_id, auth.uid(), p_decision, nullif(trim(both from p_message), ''));

  insert into review_notification_events (organization_id, recipient_user_id, event_type, review_item_id)
  select v_org_id, admin_id,
         case p_decision when 'approved' then 'item_approved' else p_decision end,
         p_review_item_id
  from review_admin_user_ids() as admin_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Submitting for review is idempotent-by-rejection
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_send_to_review(p_review_item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_status text;
  v_version int;
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can send items for review.';
  end if;

  select organization_id, current_status, current_version
    into v_org_id, v_status, v_version
  from review_items where id = p_review_item_id
  for update;

  if v_org_id is null then
    raise exception 'Review item not found.';
  end if;

  if v_status = 'ready_for_review' then
    raise exception 'This item is already awaiting review.';
  end if;

  if v_status = 'archived' then
    raise exception 'Reopen this item before sending it for review.';
  end if;

  if v_version < 1 then
    raise exception 'This item has no uploaded version to review yet.';
  end if;

  update review_items
  set current_status = 'ready_for_review', updated_at = now()
  where id = p_review_item_id;

  insert into review_actions (review_item_id, user_id, action)
  values (p_review_item_id, auth.uid(), 'submitted');

  insert into review_notification_events (organization_id, recipient_user_id, event_type, review_item_id)
  select v_org_id, member_id, 'item_submitted', p_review_item_id
  from review_org_member_user_ids(v_org_id) as member_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. An item's property must belong to its organization
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_create_item(
  p_organization_id   uuid,
  p_property_id       uuid,
  p_title             text,
  p_description       text,
  p_media_type        text,
  p_storage_path      text,
  p_original_filename text,
  p_mime_type         text,
  p_file_size         bigint
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item_id uuid;
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can create review items.';
  end if;

  if p_media_type not in ('image', 'video') then
    raise exception 'Invalid media_type: %', p_media_type;
  end if;

  if coalesce(trim(both from p_title), '') = '' then
    raise exception 'A title is required.';
  end if;

  if not exists (
    select 1 from review_properties
    where id = p_property_id and organization_id = p_organization_id
  ) then
    raise exception 'That property does not belong to the selected organization.';
  end if;

  insert into review_items (
    organization_id, property_id, title, description, media_type,
    current_status, current_version, created_by
  )
  values (
    p_organization_id, p_property_id, trim(both from p_title), p_description, p_media_type,
    'draft', 1, auth.uid()
  )
  returning id into v_item_id;

  insert into review_versions (
    review_item_id, version_number, storage_path, original_filename, mime_type, file_size, uploaded_by
  )
  values (
    v_item_id, 1, p_storage_path, p_original_filename, p_mime_type, p_file_size, auth.uid()
  );

  insert into review_actions (review_item_id, user_id, action, message)
  values (v_item_id, auth.uid(), 'version_uploaded', format('Draft created with %s.', coalesce(p_original_filename, 'an uploaded file')));

  return v_item_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. Uploading a revised version can't silently overwrite an approval
--
-- Unchanged in spirit from the original — a new version legitimately moves
-- the item back to 'ready_for_review' — but an archived item should be
-- reopened deliberately first rather than resurrected by an upload.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_upload_version(
  p_review_item_id    uuid,
  p_storage_path       text,
  p_original_filename  text,
  p_mime_type          text,
  p_file_size          bigint,
  p_note               text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_status text;
  v_next_version int;
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can upload a new version.';
  end if;

  select organization_id, current_status, current_version + 1
    into v_org_id, v_status, v_next_version
  from review_items where id = p_review_item_id
  for update;

  if v_org_id is null then
    raise exception 'Review item not found.';
  end if;

  if v_status = 'archived' then
    raise exception 'Reopen this item before uploading a new version.';
  end if;

  insert into review_versions (
    review_item_id, version_number, storage_path, original_filename, mime_type, file_size, uploaded_by
  )
  values (
    p_review_item_id, v_next_version, p_storage_path, p_original_filename, p_mime_type, p_file_size, auth.uid()
  );

  update review_items
  set current_version = v_next_version,
      current_status = 'ready_for_review',
      updated_at = now()
  where id = p_review_item_id;

  insert into review_actions (review_item_id, user_id, action, message)
  values (p_review_item_id, auth.uid(), 'version_uploaded', nullif(trim(both from p_note), ''));

  insert into review_notification_events (organization_id, recipient_user_id, event_type, review_item_id)
  select v_org_id, member_id, 'version_uploaded', p_review_item_id
  from review_org_member_user_ids(v_org_id) as member_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Safe metadata correction (title / description only)
--
-- Lets an admin fix a typo without touching status, version, organization,
-- property, ownership, or any part of the audit trail. Deliberately narrow:
-- there is still no path for anyone to edit review_versions or
-- review_actions, which remain immutable.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_update_item_metadata(
  p_review_item_id uuid,
  p_title          text,
  p_description    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can edit item details.';
  end if;

  if coalesce(trim(both from p_title), '') = '' then
    raise exception 'A title is required.';
  end if;

  update review_items
  set title = trim(both from p_title),
      description = nullif(trim(both from coalesce(p_description, '')), ''),
      updated_at = now()
  where id = p_review_item_id;

  if not found then
    raise exception 'Review item not found.';
  end if;
end;
$$;

revoke all on function public.review_update_item_metadata(uuid, text, text) from public;
grant execute on function public.review_update_item_metadata(uuid, text, text) to authenticated;

-- Re-assert grants for the replaced functions (create-or-replace preserves
-- existing grants, but this keeps the file safe to run against a project
-- where only 20260723 has been applied in a different order).
revoke all on function public.review_client_decide(uuid, text, text) from public;
revoke all on function public.review_send_to_review(uuid) from public;
revoke all on function public.review_create_item(uuid, uuid, text, text, text, text, text, text, bigint) from public;
revoke all on function public.review_upload_version(uuid, text, text, text, bigint, text) from public;

grant execute on function public.review_client_decide(uuid, text, text) to authenticated;
grant execute on function public.review_send_to_review(uuid) to authenticated;
grant execute on function public.review_create_item(uuid, uuid, text, text, text, text, text, text, bigint) to authenticated;
grant execute on function public.review_upload_version(uuid, text, text, text, bigint, text) to authenticated;
