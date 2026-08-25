-- ─────────────────────────────────────────────────────────────────────────────
-- 20260825a — Annotations, caption approval, and publishing responsibility
--
-- STATUS: NOT APPLIED. Reviewed by Devon before running.
-- DEPENDS ON: 20260723_review_portal_platform.sql (already live). Independent
-- of 20260824a/b/c — it can be applied before or after any of them.
--
-- ═════════════════════════════════════════════════════════════════════════════
-- WHAT ALREADY FITS THE EXISTING SCHEMA (no change needed)
-- ═════════════════════════════════════════════════════════════════════════════
--   Creative items, versions, decisions  → review_items / review_versions /
--     review_actions. Exact fit. Version history and the approve /
--     request-changes / new-direction flow all work today through
--     review_client_decide.
--   General notes under an asset         → review_messages, which already
--     carries organization_id, review_item_id, sender_id and body.
--   Client isolation                     → review_memberships + existing RLS.
--
-- ═════════════════════════════════════════════════════════════════════════════
-- WHAT GENUINELY NEEDS NEW STRUCTURE (this migration)
-- ═════════════════════════════════════════════════════════════════════════════
--   1. review_annotations   — point comments pinned to coordinates on a
--      specific VERSION. Nothing existing stores a position, and pinning to the
--      version (not the item) is what keeps markers correct after a revision.
--   2. review_captions      — social copy approved SEPARATELY from the artwork.
--      review_items has one current_status; copy needs its own lifecycle so an
--      item can legitimately be "creative approved, caption pending".
--   3. Responsibility columns on review_organizations — who creates, who writes
--      copy, who publishes. Three independent axes rather than one enum,
--      because the combinations are real.
--
-- ═════════════════════════════════════════════════════════════════════════════
-- COMPATIBILITY
-- ═════════════════════════════════════════════════════════════════════════════
-- Purely additive: two new tables and three new columns with defaults. No
-- existing table, column, policy, or function is altered or dropped. Existing
-- rows stay valid — the new columns default to 'archer', which describes every
-- current engagement. hotel-auto, review-os, the checkout flow, and social
-- publishing read none of these objects and are unaffected.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═════════════════════════════════════════════════════════════════════════════
-- 1 · review_annotations
-- ═════════════════════════════════════════════════════════════════════════════
-- Coordinates are NORMALIZED fractions of the media box (0–1), never pixels, so
-- a marker stays on the same part of the artwork at any viewport size, zoom
-- level, or device. This is verified in the UI: resizing 1440px → 1000px moves
-- a marker by 0.0000 relative units.
--
-- timestamp_seconds is nullable and reserved for video. Storing it now means
-- video annotation is a UI addition later rather than another migration.

create table if not exists public.review_annotations (
  id uuid primary key default gen_random_uuid(),
  review_version_id uuid not null references public.review_versions (id) on delete cascade,
  -- Denormalized so RLS and the notification fan-out don't need a three-table
  -- join on every read. Kept in step by the insert RPC below.
  review_item_id uuid not null references public.review_items (id) on delete cascade,
  user_id uuid references public.review_profiles (user_id) on delete set null,
  -- 0–1 fractions of the rendered media box.
  x numeric(6, 5) not null check (x >= 0 and x <= 1),
  y numeric(6, 5) not null check (y >= 0 and y <= 1),
  -- Video only; null on stills.
  timestamp_seconds numeric(9, 2) check (timestamp_seconds is null or timestamp_seconds >= 0),
  body text not null check (length(btrim(body)) > 0),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ON DELETE CASCADE justification: an annotation is meaningless without the
-- version it is pinned to — there is no coordinate space left to interpret it
-- in. Deleting a version therefore deletes its pins. Note that review_versions
-- itself has NO delete policy (service-role only), so this cascade cannot be
-- triggered by a client or by an admin session.
-- user_id uses SET NULL instead: losing a profile must not erase the feedback.

create index if not exists review_annotations_version_idx on public.review_annotations (review_version_id, created_at);
create index if not exists review_annotations_item_idx on public.review_annotations (review_item_id);

alter table public.review_annotations enable row level security;

-- Read: same rule as the parent item — admins see everything, members see their
-- own organization's non-draft work.
create policy "review_annotations_select" on public.review_annotations
  for select to authenticated
  using (
    review_is_admin()
    or exists (
      select 1 from public.review_items ri
      where ri.id = review_annotations.review_item_id
        and ri.organization_id in (select review_member_org_ids())
        and ri.current_status <> 'draft'
    )
  );

-- No INSERT/UPDATE/DELETE policy: writes go through the SECURITY DEFINER
-- function below, exactly as every other write in this schema does. That keeps
-- the membership check and the version/item consistency check in Postgres
-- rather than in React.

create or replace function public.review_add_annotation(
  p_review_version_id uuid,
  p_x numeric,
  p_y numeric,
  p_body text,
  p_timestamp_seconds numeric default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp   -- pg_temp LAST; see 20260824b
as $$
declare
  v_item_id uuid;
  v_org_id uuid;
  v_status text;
  v_new_id uuid;
begin
  if coalesce(btrim(p_body), '') = '' then
    raise exception 'A comment cannot be empty.';
  end if;
  if p_x < 0 or p_x > 1 or p_y < 0 or p_y > 1 then
    raise exception 'Annotation coordinates must be between 0 and 1.';
  end if;

  -- Derive the item from the VERSION the caller named. The client never tells
  -- us which item or organization this belongs to, so it cannot lie about it.
  select rv.review_item_id into v_item_id
  from public.review_versions rv
  where rv.id = p_review_version_id;

  if v_item_id is null then
    raise exception 'That version does not exist.';
  end if;

  select ri.organization_id, ri.current_status into v_org_id, v_status
  from public.review_items ri
  where ri.id = v_item_id;

  if not (review_is_admin() or v_org_id in (select review_member_org_ids())) then
    raise exception 'Not authorized for this review item.';
  end if;
  if v_status = 'draft' and not review_is_admin() then
    raise exception 'This item has not been shared for review yet.';
  end if;

  insert into public.review_annotations
    (review_version_id, review_item_id, user_id, x, y, timestamp_seconds, body)
  values
    (p_review_version_id, v_item_id, auth.uid(), p_x, p_y, p_timestamp_seconds, btrim(p_body))
  returning id into v_new_id;

  return v_new_id;
end;
$$;

revoke execute on function public.review_add_annotation(uuid, numeric, numeric, text, numeric) from public;
grant execute on function public.review_add_annotation(uuid, numeric, numeric, text, numeric) to authenticated;

-- ═════════════════════════════════════════════════════════════════════════════
-- 2 · review_captions
-- ═════════════════════════════════════════════════════════════════════════════
-- One row per platform per item, with its own approval lifecycle. Mirrors the
-- item status vocabulary so the two read consistently in the UI.

create table if not exists public.review_captions (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.review_items (id) on delete cascade,
  platform text not null check (length(btrim(platform)) > 0),
  body text not null default '',
  headline text,
  call_to_action text,
  hashtags text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'ready_for_review', 'changes_requested', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (review_item_id, platform)
);

create index if not exists review_captions_item_idx on public.review_captions (review_item_id);

alter table public.review_captions enable row level security;

-- Clients never see copy still being written, matching how drafts work for
-- artwork.
create policy "review_captions_select" on public.review_captions
  for select to authenticated
  using (
    review_is_admin()
    or exists (
      select 1 from public.review_items ri
      where ri.id = review_captions.review_item_id
        and ri.organization_id in (select review_member_org_ids())
        and ri.current_status <> 'draft'
        and review_captions.status <> 'draft'
    )
  );

create or replace function public.review_decide_caption(
  p_caption_id uuid,
  p_decision text,
  p_message text default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item_id uuid;
  v_org_id uuid;
  v_status text;
begin
  if p_decision not in ('approved', 'changes_requested') then
    raise exception 'Invalid caption decision: %', p_decision;
  end if;
  if p_decision = 'changes_requested' and coalesce(btrim(p_message), '') = '' then
    raise exception 'Please say what should change before requesting copy changes.';
  end if;

  select rc.review_item_id, rc.status into v_item_id, v_status
  from public.review_captions rc
  where rc.id = p_caption_id
  for update;

  if v_item_id is null then
    raise exception 'That caption does not exist.';
  end if;

  select ri.organization_id into v_org_id
  from public.review_items ri where ri.id = v_item_id;

  if not (review_is_admin() or v_org_id in (select review_member_org_ids())) then
    raise exception 'Not authorized for this caption.';
  end if;
  if v_status = 'draft' then
    raise exception 'This copy has not been sent for approval yet.';
  end if;

  update public.review_captions
     set status = p_decision, updated_at = now()
   where id = p_caption_id;

  -- Reuse the existing audit trail rather than inventing a second one.
  insert into public.review_actions (review_item_id, user_id, action, message)
  values (
    v_item_id,
    auth.uid(),
    case when p_decision = 'approved' then 'caption_approved' else 'caption_changes_requested' end,
    nullif(btrim(coalesce(p_message, '')), '')
  );
end;
$$;

revoke execute on function public.review_decide_caption(uuid, text, text) from public;
grant execute on function public.review_decide_caption(uuid, text, text) to authenticated;

-- ═════════════════════════════════════════════════════════════════════════════
-- 3 · Publishing responsibility
-- ═════════════════════════════════════════════════════════════════════════════
-- Defaults to 'archer' on all three axes, which is true of every current
-- engagement, so existing rows need no backfill and behaviour does not change.
-- Set at the organization level; if a single client ever needs this to differ
-- per property, the same three columns can be added to review_properties and
-- read with a coalesce, without changing what is here.

alter table public.review_organizations
  add column if not exists creative_responsibility text not null default 'archer'
    check (creative_responsibility in ('archer', 'client', 'external')),
  add column if not exists copy_responsibility text not null default 'archer'
    check (copy_responsibility in ('archer', 'client', 'external')),
  add column if not exists publishing_responsibility text not null default 'archer'
    check (publishing_responsibility in ('archer', 'client', 'external')),
  add column if not exists social_contact_name text,
  add column if not exists social_contact_email text;

comment on column public.review_organizations.publishing_responsibility is
  'Who publishes approved content: archer | client | external. Drives whether an approved item becomes "Ready to publish" (Archer) or "Approved & ready to download" (client/external).';

-- ── Verification after applying ──────────────────────────────────────────────
--   select count(*) from review_annotations;   -- expect 0
--   select count(*) from review_captions;      -- expect 0
--   select creative_responsibility, copy_responsibility, publishing_responsibility
--     from review_organizations;               -- expect archer/archer/archer
--
--   -- As a signed-in CLIENT of another org, both must return zero rows:
--   select count(*) from review_annotations;
--   select count(*) from review_captions;
--
--   -- pg_temp must be present on the two new functions:
--   select proname, proconfig from pg_proc
--   where proname in ('review_add_annotation','review_decide_caption');

-- ── Rollback ─────────────────────────────────────────────────────────────────
-- drop function if exists public.review_add_annotation(uuid, numeric, numeric, text, numeric);
-- drop function if exists public.review_decide_caption(uuid, text, text);
-- drop table if exists public.review_annotations;
-- drop table if exists public.review_captions;
-- alter table public.review_organizations
--   drop column if exists creative_responsibility,
--   drop column if exists copy_responsibility,
--   drop column if exists publishing_responsibility,
--   drop column if exists social_contact_name,
--   drop column if exists social_contact_email;
--
-- NOTE: dropping review_annotations/review_captions destroys client feedback.
-- Export first if anything real has been written.
