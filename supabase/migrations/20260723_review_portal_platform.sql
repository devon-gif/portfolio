-- Archer Review — client review portal platform (used by /review, /review/admin, /emma).
--
-- Unlike most of this project's other tables (which use a permissive "local
-- anon full access" policy suited to a single-owner internal CRM — see e.g.
-- 20260614_client_onboarding.sql), this migration is genuinely multi-tenant
-- and client-facing: Emma at Valencia Hotel Group signs in herself, and must
-- never be able to read another client's data. Every table below gets real
-- role- and organization-scoped row level security instead of the "true"
-- shortcut used elsewhere.
--
-- Idempotent: safe to run more than once (create-if-not-exists / drop-then-
-- create policies / on-conflict-do-nothing seed rows).

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Tables
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists review_organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

create table if not exists review_properties (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references review_organizations(id) on delete cascade,
  name             text not null,
  slug             text not null,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  unique (organization_id, slug)
);

create index if not exists review_properties_org_idx on review_properties(organization_id);

-- One row per Supabase auth user who is allowed into the review portal at
-- all (as either the Archer Design admin or a client approver). Created by
-- the service-role setup script in scripts/seed-review-portal.ts, never by
-- client-side code — see the migration footer comment and the project
-- report for the exact invite flow.
create table if not exists review_profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  first_name  text,
  last_name   text,
  role        text not null default 'client' check (role in ('admin', 'client')),
  created_at  timestamptz not null default now()
);

-- Organization-level membership. Emma gets ONE row here for Valencia Hotel
-- Group, which is what gives her visibility into every current and future
-- Valencia property without a separate per-property grant.
create table if not exists review_memberships (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references review_profiles(user_id) on delete cascade,
  organization_id  uuid not null references review_organizations(id) on delete cascade,
  role             text not null default 'client' check (role in ('admin', 'client')),
  created_at       timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index if not exists review_memberships_org_idx on review_memberships(organization_id);

create table if not exists review_items (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references review_organizations(id) on delete cascade,
  property_id      uuid not null references review_properties(id) on delete cascade,
  title            text not null,
  description      text,
  media_type       text not null check (media_type in ('image', 'video')),
  current_status   text not null default 'draft' check (current_status in (
                      'draft', 'ready_for_review', 'approved',
                      'changes_requested', 'new_direction_requested', 'archived'
                    )),
  current_version  int not null default 0,
  created_by       uuid references review_profiles(user_id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists review_items_org_idx on review_items(organization_id);
create index if not exists review_items_property_idx on review_items(property_id);
create index if not exists review_items_status_idx on review_items(current_status);

create table if not exists review_versions (
  id               uuid primary key default gen_random_uuid(),
  review_item_id   uuid not null references review_items(id) on delete cascade,
  version_number   int not null,
  storage_path     text not null,
  original_filename text,
  mime_type        text,
  file_size        bigint,
  uploaded_by      uuid references review_profiles(user_id) on delete set null,
  created_at       timestamptz not null default now(),
  unique (review_item_id, version_number)
);

create index if not exists review_versions_item_idx on review_versions(review_item_id);

create table if not exists review_actions (
  id              uuid primary key default gen_random_uuid(),
  review_item_id  uuid not null references review_items(id) on delete cascade,
  user_id         uuid references review_profiles(user_id) on delete set null,
  action          text not null check (action in (
                     'submitted', 'approved', 'changes_requested',
                     'new_direction_requested', 'version_uploaded', 'archived', 'reopened'
                   )),
  message         text,
  created_at      timestamptz not null default now()
);

create index if not exists review_actions_item_idx on review_actions(review_item_id);

create table if not exists review_messages (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references review_organizations(id) on delete cascade,
  property_id      uuid references review_properties(id) on delete set null,
  review_item_id   uuid references review_items(id) on delete set null,
  sender_id        uuid references review_profiles(user_id) on delete set null,
  body             text not null,
  created_at       timestamptz not null default now(),
  read_at          timestamptz
);

create index if not exists review_messages_org_idx on review_messages(organization_id);
create index if not exists review_messages_item_idx on review_messages(review_item_id);

create table if not exists review_notification_events (
  id                     uuid primary key default gen_random_uuid(),
  organization_id        uuid not null references review_organizations(id) on delete cascade,
  recipient_user_id      uuid not null references review_profiles(user_id) on delete cascade,
  event_type             text not null check (event_type in (
                            'item_submitted', 'item_approved', 'changes_requested',
                            'new_direction_requested', 'version_uploaded',
                            'item_archived', 'message_sent'
                          )),
  review_item_id         uuid references review_items(id) on delete set null,
  message_id             uuid references review_messages(id) on delete set null,
  occurred_at            timestamptz not null default now(),
  included_in_digest_at  timestamptz
);

create index if not exists review_notification_events_recipient_idx
  on review_notification_events(recipient_user_id, included_in_digest_at);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Helper functions (SECURITY DEFINER so RLS policies can call them
--    without recursively re-triggering RLS on review_profiles /
--    review_memberships — the standard Supabase pattern for this).
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.review_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from review_profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.review_member_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from review_memberships where user_id = auth.uid();
$$;

create or replace function public.review_admin_user_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select user_id from review_profiles where role = 'admin';
$$;

create or replace function public.review_org_member_user_ids(p_organization_id uuid)
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select user_id from review_memberships where organization_id = p_organization_id;
$$;

revoke all on function public.review_is_admin() from public;
revoke all on function public.review_member_org_ids() from public;
revoke all on function public.review_admin_user_ids() from public;
revoke all on function public.review_org_member_user_ids(uuid) from public;
grant execute on function public.review_is_admin() to authenticated;
grant execute on function public.review_member_org_ids() to authenticated;
grant execute on function public.review_admin_user_ids() to authenticated;
grant execute on function public.review_org_member_user_ids(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Row level security
-- ─────────────────────────────────────────────────────────────────────────

alter table review_organizations enable row level security;
alter table review_properties enable row level security;
alter table review_profiles enable row level security;
alter table review_memberships enable row level security;
alter table review_items enable row level security;
alter table review_versions enable row level security;
alter table review_actions enable row level security;
alter table review_messages enable row level security;
alter table review_notification_events enable row level security;

drop policy if exists "review_organizations_select" on review_organizations;
create policy "review_organizations_select" on review_organizations
  for select to authenticated
  using (
    review_is_admin()
    or id in (select review_member_org_ids())
  );
-- No insert/update/delete policy for authenticated/anon: organizations are
-- created only by the service-role setup script (the service role bypasses
-- RLS entirely), never from the browser.

drop policy if exists "review_properties_select" on review_properties;
create policy "review_properties_select" on review_properties
  for select to authenticated
  using (
    review_is_admin()
    or organization_id in (select review_member_org_ids())
  );
-- Same as above: properties are managed by the service-role script only.

drop policy if exists "review_profiles_select" on review_profiles;
create policy "review_profiles_select" on review_profiles
  for select to authenticated
  using (
    user_id = auth.uid()
    or review_is_admin()
  );
-- Profiles are created only by the service-role invite script.

drop policy if exists "review_memberships_select" on review_memberships;
create policy "review_memberships_select" on review_memberships
  for select to authenticated
  using (
    user_id = auth.uid()
    or review_is_admin()
  );
-- Memberships are created only by the service-role invite script.

drop policy if exists "review_items_select" on review_items;
create policy "review_items_select" on review_items
  for select to authenticated
  using (
    review_is_admin()
    or (
      organization_id in (select review_member_org_ids())
      and current_status <> 'draft'
    )
  );

drop policy if exists "review_items_admin_insert" on review_items;
create policy "review_items_admin_insert" on review_items
  for insert to authenticated
  with check (review_is_admin());

drop policy if exists "review_items_admin_update" on review_items;
create policy "review_items_admin_update" on review_items
  for update to authenticated
  using (review_is_admin())
  with check (review_is_admin());
-- Client-side status transitions (approve / request changes / request a new
-- direction) do NOT go through a direct UPDATE policy — they go through the
-- review_client_decide() function below, which validates the transition and
-- writes the audit trail in one atomic, server-enforced step. No delete
-- policy exists at all: items are archived, never deleted.

drop policy if exists "review_versions_select" on review_versions;
create policy "review_versions_select" on review_versions
  for select to authenticated
  using (
    review_is_admin()
    or exists (
      select 1 from review_items ri
      where ri.id = review_versions.review_item_id
        and ri.organization_id in (select review_member_org_ids())
        and ri.current_status <> 'draft'
    )
  );

drop policy if exists "review_versions_admin_insert" on review_versions;
create policy "review_versions_admin_insert" on review_versions
  for insert to authenticated
  with check (review_is_admin());
-- No update/delete policy for anyone: versions are an immutable audit trail.
-- This is also what satisfies "Emma cannot delete uploaded media."

drop policy if exists "review_actions_select" on review_actions;
create policy "review_actions_select" on review_actions
  for select to authenticated
  using (
    review_is_admin()
    or exists (
      select 1 from review_items ri
      where ri.id = review_actions.review_item_id
        and ri.organization_id in (select review_member_org_ids())
        and ri.current_status <> 'draft'
    )
  );

drop policy if exists "review_actions_admin_insert" on review_actions;
create policy "review_actions_admin_insert" on review_actions
  for insert to authenticated
  with check (review_is_admin());
-- Client actions are written by review_client_decide() (SECURITY DEFINER),
-- not by a direct insert policy.

drop policy if exists "review_messages_select" on review_messages;
create policy "review_messages_select" on review_messages
  for select to authenticated
  using (
    review_is_admin()
    or organization_id in (select review_member_org_ids())
  );

drop policy if exists "review_messages_insert" on review_messages;
create policy "review_messages_insert" on review_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and (
      review_is_admin()
      or organization_id in (select review_member_org_ids())
    )
  );
-- No update/delete policy: messages are marked read only via
-- review_mark_message_read() below, and are never edited or deleted.

drop policy if exists "review_notification_events_select" on review_notification_events;
create policy "review_notification_events_select" on review_notification_events
  for select to authenticated
  using (
    recipient_user_id = auth.uid()
    or review_is_admin()
  );
-- No insert/update/delete policy at all: this table is written exclusively
-- by the server-side digest job (app/api/review/digest), using the
-- service-role client, which bypasses RLS. Regular authenticated sessions
-- (Devon's or Emma's browser) can only ever read it.

-- ─────────────────────────────────────────────────────────────────────────
-- 4. RPC functions for state-changing actions
--
-- Every mutation that needs to (a) validate a transition, (b) write an
-- audit-trail row, and/or (c) log a notification event goes through one of
-- these SECURITY DEFINER functions rather than a raw table write. This is
-- the "server-side/session checks" enforcement layer the review portal
-- needs on top of RLS: it keeps authorization logic in Postgres, not in the
-- React admin/client UI, for both roles.
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

  insert into review_items (
    organization_id, property_id, title, description, media_type,
    current_status, current_version, created_by
  )
  values (
    p_organization_id, p_property_id, p_title, p_description, p_media_type,
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

create or replace function public.review_send_to_review(p_review_item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can send items for review.';
  end if;

  select organization_id into v_org_id from review_items where id = p_review_item_id;
  if v_org_id is null then
    raise exception 'Review item not found.';
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
  v_next_version int;
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can upload a new version.';
  end if;

  select organization_id, current_version + 1 into v_org_id, v_next_version
  from review_items where id = p_review_item_id
  for update;

  if v_org_id is null then
    raise exception 'Review item not found.';
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
  values (p_review_item_id, auth.uid(), 'version_uploaded', p_note);

  insert into review_notification_events (organization_id, recipient_user_id, event_type, review_item_id)
  select v_org_id, member_id, 'version_uploaded', p_review_item_id
  from review_org_member_user_ids(v_org_id) as member_id;
end;
$$;

create or replace function public.review_archive_item(p_review_item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can archive review items.';
  end if;

  update review_items
  set current_status = 'archived', updated_at = now()
  where id = p_review_item_id;

  insert into review_actions (review_item_id, user_id, action)
  values (p_review_item_id, auth.uid(), 'archived');
end;
$$;

create or replace function public.review_reopen_item(p_review_item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not review_is_admin() then
    raise exception 'Only Archer Design admins can reopen review items.';
  end if;

  update review_items
  set current_status = 'ready_for_review', updated_at = now()
  where id = p_review_item_id;

  insert into review_actions (review_item_id, user_id, action)
  values (p_review_item_id, auth.uid(), 'reopened');
end;
$$;

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
    raise exception 'Written feedback is required to request % .', p_decision;
  end if;

  select organization_id, current_status into v_org_id, v_status
  from review_items where id = p_review_item_id
  for update;

  if v_org_id is null then
    raise exception 'Review item not found.';
  end if;

  if v_status = 'draft' then
    raise exception 'This item has not been sent for review yet.';
  end if;

  if not (review_is_admin() or v_org_id in (select review_member_org_ids())) then
    raise exception 'Not authorized for this review item.';
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

create or replace function public.review_send_message(
  p_organization_id uuid,
  p_property_id     uuid default null,
  p_review_item_id  uuid default null,
  p_body            text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_message_id uuid;
  v_is_admin boolean := review_is_admin();
begin
  if coalesce(trim(both from p_body), '') = '' then
    raise exception 'Message body cannot be empty.';
  end if;

  if not (v_is_admin or p_organization_id in (select review_member_org_ids())) then
    raise exception 'Not authorized to message this organization.';
  end if;

  insert into review_messages (organization_id, property_id, review_item_id, sender_id, body)
  values (p_organization_id, p_property_id, p_review_item_id, auth.uid(), trim(both from p_body))
  returning id into v_message_id;

  if v_is_admin then
    insert into review_notification_events (organization_id, recipient_user_id, event_type, message_id)
    select p_organization_id, member_id, 'message_sent', v_message_id
    from review_org_member_user_ids(p_organization_id) as member_id;
  else
    insert into review_notification_events (organization_id, recipient_user_id, event_type, message_id)
    select p_organization_id, admin_id, 'message_sent', v_message_id
    from review_admin_user_ids() as admin_id;
  end if;

  return v_message_id;
end;
$$;

create or replace function public.review_mark_message_read(p_message_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_sender uuid;
begin
  select organization_id, sender_id into v_org_id, v_sender
  from review_messages where id = p_message_id;

  if v_org_id is null then
    raise exception 'Message not found.';
  end if;

  if not (review_is_admin() or v_org_id in (select review_member_org_ids())) then
    raise exception 'Not authorized for this message.';
  end if;

  if v_sender = auth.uid() then
    return; -- no-op: senders don't need to mark their own message read
  end if;

  update review_messages
  set read_at = now()
  where id = p_message_id and read_at is null;
end;
$$;

revoke all on function public.review_create_item(uuid, uuid, text, text, text, text, text, text, bigint) from public;
revoke all on function public.review_send_to_review(uuid) from public;
revoke all on function public.review_upload_version(uuid, text, text, text, bigint, text) from public;
revoke all on function public.review_archive_item(uuid) from public;
revoke all on function public.review_reopen_item(uuid) from public;
revoke all on function public.review_client_decide(uuid, text, text) from public;
revoke all on function public.review_send_message(uuid, uuid, uuid, text) from public;
revoke all on function public.review_mark_message_read(uuid) from public;

grant execute on function public.review_create_item(uuid, uuid, text, text, text, text, text, text, bigint) to authenticated;
grant execute on function public.review_send_to_review(uuid) to authenticated;
grant execute on function public.review_upload_version(uuid, text, text, text, bigint, text) to authenticated;
grant execute on function public.review_archive_item(uuid) to authenticated;
grant execute on function public.review_reopen_item(uuid) to authenticated;
grant execute on function public.review_client_decide(uuid, text, text) to authenticated;
grant execute on function public.review_send_message(uuid, uuid, uuid, text) to authenticated;
grant execute on function public.review_mark_message_read(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. Storage: private "review-media" bucket
--
-- Upload path convention (enforced by the app, not the database):
--   {organization_id}/{property_id}/{review_item_id}/v{version_number}-{filename}
-- The first path segment must always be the organization_id, since that's
-- what the storage policy below checks membership against.
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('review-media', 'review-media', false)
on conflict (id) do nothing;

drop policy if exists "review_media_admin_all" on storage.objects;
create policy "review_media_admin_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'review-media' and review_is_admin())
  with check (bucket_id = 'review-media' and review_is_admin());

drop policy if exists "review_media_member_select" on storage.objects;
create policy "review_media_member_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'review-media'
    and (
      review_is_admin()
      or exists (
        select 1 from review_member_org_ids() org_id
        where org_id::text = (storage.foldername(name))[1]
      )
    )
  );
-- Emma (and any future client member) can only ever SELECT — which is what
-- signed-URL generation checks against — never insert/update/delete. That
-- satisfies "Emma cannot delete uploaded media." Unauthenticated (anon)
-- requests match neither policy, so storage access is denied by default.

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Seed data: Valencia Hotel Group organization + properties.
--
-- Safe to run repeatedly. This seeds plain reference data only (no auth
-- users, no profiles, no memberships — see the migration footer / project
-- report for the secure, manual process to create Devon's admin profile and
-- invite Emma).
-- ─────────────────────────────────────────────────────────────────────────

insert into review_organizations (name, slug)
values ('Valencia Hotel Group', 'valencia-hotel-group')
on conflict (slug) do nothing;

insert into review_properties (organization_id, name, slug, active)
select o.id, p.name, p.slug, true
from review_organizations o
cross join (
  values
    ('Hotel Valencia Riverwalk', 'hotel-valencia-riverwalk'),
    ('Hotel Valencia Santana Row', 'hotel-valencia-santana-row'),
    ('Texican Court', 'texican-court'),
    ('Lone Star Court', 'lone-star-court'),
    ('Cotton Court', 'cotton-court'),
    ('Cavalry Court', 'cavalry-court'),
    ('The George', 'the-george'),
    ('Caravan Court', 'caravan-court')
) as p(name, slug)
where o.slug = 'valencia-hotel-group'
on conflict (organization_id, slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Creating Devon's admin profile and inviting Emma is deliberately NOT done
-- here, because both require a real auth.users row (review_profiles.user_id
-- is a foreign key to auth.users), and creating Supabase auth users must
-- happen through a privileged, service-role, server-side call — never a
-- SQL seed or client-side code. See scripts/seed-review-portal.ts and the
-- project report for the exact, safe steps.
-- ─────────────────────────────────────────────────────────────────────────
