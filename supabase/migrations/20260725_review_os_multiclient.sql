-- Archer Review OS — multi-client foundation.
-- Forward-only migration. Do not apply until the matching application code is deployed.
-- Adds partner workspaces, projects/campaigns, property/project assignments,
-- expanded roles, invitation records, internal/client visibility, and scoped RLS.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Compatibility columns and role expansion
-- ---------------------------------------------------------------------------

alter table public.review_organizations
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists archived_at timestamptz;

alter table public.review_properties
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists archived_at timestamptz;

alter table public.review_profiles
  drop constraint if exists review_profiles_role_check;

alter table public.review_profiles
  add constraint review_profiles_role_check
  check (
    role in (
      'admin',
      'client',
      'archer_owner',
      'archer_designer',
      'partner_admin',
      'partner_strategist',
      'client_admin',
      'property_reviewer',
      'guest_reviewer',
      'read_only'
    )
  ) not valid;

alter table public.review_profiles
  validate constraint review_profiles_role_check;

alter table public.review_memberships
  drop constraint if exists review_memberships_role_check;

alter table public.review_memberships
  add constraint review_memberships_role_check
  check (
    role in (
      'admin',
      'client',
      'client_admin',
      'property_reviewer',
      'guest_reviewer',
      'read_only'
    )
  ) not valid;

alter table public.review_memberships
  validate constraint review_memberships_role_check;

-- ---------------------------------------------------------------------------
-- 2. Partner, project, assignment, and invitation tables
-- ---------------------------------------------------------------------------

create table if not exists public.review_partners (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  active         boolean not null default true,
  logo_path      text,
  primary_color  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  archived_at    timestamptz
);

create table if not exists public.review_partner_organizations (
  partner_id       uuid not null references public.review_partners(id) on delete cascade,
  organization_id  uuid not null references public.review_organizations(id) on delete cascade,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  primary key (partner_id, organization_id)
);

create table if not exists public.review_partner_memberships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.review_profiles(user_id) on delete cascade,
  partner_id  uuid not null references public.review_partners(id) on delete cascade,
  role        text not null check (role in ('partner_admin', 'partner_strategist')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, partner_id)
);

create table if not exists public.review_partner_account_assignments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.review_profiles(user_id) on delete cascade,
  partner_id       uuid not null references public.review_partners(id) on delete cascade,
  organization_id  uuid not null references public.review_organizations(id) on delete cascade,
  created_at       timestamptz not null default now(),
  unique (user_id, partner_id, organization_id)
);

create table if not exists public.review_property_memberships (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.review_profiles(user_id) on delete cascade,
  property_id  uuid not null references public.review_properties(id) on delete cascade,
  role         text not null default 'property_reviewer'
               check (role in ('client_admin', 'property_reviewer', 'guest_reviewer', 'read_only')),
  created_at   timestamptz not null default now(),
  unique (user_id, property_id)
);

create table if not exists public.review_projects (
  id                            uuid primary key default gen_random_uuid(),
  organization_id               uuid not null references public.review_organizations(id) on delete cascade,
  partner_id                    uuid references public.review_partners(id) on delete set null,
  name                          text not null,
  slug                          text not null,
  description                   text,
  status                        text not null default 'brief_submitted'
                                check (status in (
                                  'brief_submitted',
                                  'needs_clarification',
                                  'scheduled',
                                  'in_design',
                                  'internal_review',
                                  'ready_for_client',
                                  'client_reviewing',
                                  'changes_requested',
                                  'revision_in_progress',
                                  'approved',
                                  'delivered',
                                  'archived'
                                )),
  priority                      text not null default 'normal'
                                check (priority in ('low', 'normal', 'high', 'urgent')),
  due_date                      date,
  client_visible_notes          text,
  created_by                    uuid references public.review_profiles(user_id) on delete set null,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),
  archived_at                   timestamptz,
  unique (organization_id, slug)
);

create table if not exists public.review_project_internal_notes (
  project_id                    uuid primary key references public.review_projects(id) on delete cascade,
  work_authorization_reference  text,
  notes                         text not null default '',
  updated_by   uuid references public.review_profiles(user_id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.review_project_properties (
  project_id   uuid not null references public.review_projects(id) on delete cascade,
  property_id  uuid not null references public.review_properties(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (project_id, property_id)
);

create table if not exists public.review_project_assignments (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.review_projects(id) on delete cascade,
  user_id          uuid not null references public.review_profiles(user_id) on delete cascade,
  assignment_role  text not null default 'collaborator'
                   check (assignment_role in ('owner', 'designer', 'strategist', 'approver', 'reviewer', 'observer', 'collaborator')),
  created_at       timestamptz not null default now(),
  unique (project_id, user_id)
);

create table if not exists public.review_invitations (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  role             text not null
                   check (role in (
                     'archer_designer',
                     'partner_admin',
                     'partner_strategist',
                     'client_admin',
                     'property_reviewer',
                     'guest_reviewer',
                     'read_only'
                   )),
  organization_id  uuid references public.review_organizations(id) on delete cascade,
  partner_id       uuid references public.review_partners(id) on delete cascade,
  invited_by       uuid not null references public.review_profiles(user_id) on delete restrict,
  status           text not null default 'pending'
                   check (status in ('pending', 'accepted', 'expired', 'revoked')),
  token_hash       text not null unique,
  expires_at       timestamptz not null,
  accepted_at      timestamptz,
  revoked_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (organization_id is not null or partner_id is not null or role = 'archer_designer')
);

create table if not exists public.review_invitation_properties (
  invitation_id  uuid not null references public.review_invitations(id) on delete cascade,
  property_id    uuid not null references public.review_properties(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (invitation_id, property_id)
);

alter table public.review_items
  add column if not exists project_id uuid references public.review_projects(id) on delete set null;

alter table public.review_messages
  add column if not exists project_id uuid references public.review_projects(id) on delete set null,
  add column if not exists visibility text not null default 'client';

alter table public.review_messages
  drop constraint if exists review_messages_visibility_check;

alter table public.review_messages
  add constraint review_messages_visibility_check
  check (visibility in ('client', 'internal')) not valid;

alter table public.review_messages
  validate constraint review_messages_visibility_check;

alter table public.review_notification_events
  add column if not exists project_id uuid references public.review_projects(id) on delete set null;

alter table public.review_notification_events
  drop constraint if exists review_notification_events_event_type_check;

alter table public.review_notification_events
  add constraint review_notification_events_event_type_check
  check (event_type in (
    'item_submitted',
    'item_approved',
    'changes_requested',
    'new_direction_requested',
    'version_uploaded',
    'item_archived',
    'message_sent',
    'brief_submitted',
    'project_updated',
    'invitation_created',
    'deadline_approaching'
  )) not valid;

alter table public.review_notification_events
  validate constraint review_notification_events_event_type_check;

-- ---------------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------------

create index if not exists review_partners_active_idx
  on public.review_partners(active, archived_at);

create index if not exists review_partner_organizations_org_idx
  on public.review_partner_organizations(organization_id, active);

create index if not exists review_partner_memberships_user_idx
  on public.review_partner_memberships(user_id, active);

create index if not exists review_partner_account_assignments_user_idx
  on public.review_partner_account_assignments(user_id, partner_id);

create index if not exists review_property_memberships_user_idx
  on public.review_property_memberships(user_id);

create index if not exists review_property_memberships_property_idx
  on public.review_property_memberships(property_id);

create index if not exists review_projects_org_status_idx
  on public.review_projects(organization_id, status);

create index if not exists review_projects_partner_idx
  on public.review_projects(partner_id);

create index if not exists review_projects_due_date_idx
  on public.review_projects(due_date)
  where archived_at is null;

create index if not exists review_project_properties_property_idx
  on public.review_project_properties(property_id);

create index if not exists review_project_assignments_user_idx
  on public.review_project_assignments(user_id);

create index if not exists review_invitations_email_status_idx
  on public.review_invitations(lower(email), status);

create index if not exists review_items_project_idx
  on public.review_items(project_id);

create index if not exists review_messages_project_idx
  on public.review_messages(project_id);

create index if not exists review_notification_events_project_idx
  on public.review_notification_events(project_id);

-- ---------------------------------------------------------------------------
-- 4. Updated-at trigger
-- ---------------------------------------------------------------------------

create or replace function public.review_set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists review_organizations_set_updated_at on public.review_organizations;
create trigger review_organizations_set_updated_at
before update on public.review_organizations
for each row execute function public.review_set_updated_at();

drop trigger if exists review_properties_set_updated_at on public.review_properties;
create trigger review_properties_set_updated_at
before update on public.review_properties
for each row execute function public.review_set_updated_at();

drop trigger if exists review_partners_set_updated_at on public.review_partners;
create trigger review_partners_set_updated_at
before update on public.review_partners
for each row execute function public.review_set_updated_at();

drop trigger if exists review_partner_memberships_set_updated_at on public.review_partner_memberships;
create trigger review_partner_memberships_set_updated_at
before update on public.review_partner_memberships
for each row execute function public.review_set_updated_at();

drop trigger if exists review_projects_set_updated_at on public.review_projects;
create trigger review_projects_set_updated_at
before update on public.review_projects
for each row execute function public.review_set_updated_at();

drop trigger if exists review_project_internal_notes_set_updated_at on public.review_project_internal_notes;
create trigger review_project_internal_notes_set_updated_at
before update on public.review_project_internal_notes
for each row execute function public.review_set_updated_at();

drop trigger if exists review_invitations_set_updated_at on public.review_invitations;
create trigger review_invitations_set_updated_at
before update on public.review_invitations
for each row execute function public.review_set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. Security helper functions
-- ---------------------------------------------------------------------------

create or replace function public.review_is_archer_owner()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.review_profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'archer_owner')
  );
$$;

create or replace function public.review_is_archer_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.review_profiles p
    where p.user_id = auth.uid()
      and p.role in ('admin', 'archer_owner', 'archer_designer')
  );
$$;

create or replace function public.review_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.review_is_archer_staff();
$$;

create or replace function public.review_partner_role(p_partner_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select rpm.role
  from public.review_partner_memberships rpm
  where rpm.user_id = auth.uid()
    and rpm.partner_id = p_partner_id
    and rpm.active
  limit 1;
$$;

create or replace function public.review_can_access_partner(p_partner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_staff()
    or exists (
      select 1
      from public.review_partner_memberships rpm
      where rpm.user_id = auth.uid()
        and rpm.partner_id = p_partner_id
        and rpm.active
    );
$$;

create or replace function public.review_has_org_wide_access(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_staff()
    or exists (
      select 1
      from public.review_memberships rm
      where rm.user_id = auth.uid()
        and rm.organization_id = p_organization_id
        and rm.role in ('admin', 'client', 'client_admin', 'read_only')
    )
    or exists (
      select 1
      from public.review_partner_organizations rpo
      join public.review_partner_memberships rpm
        on rpm.partner_id = rpo.partner_id
       and rpm.user_id = auth.uid()
       and rpm.active
       and rpm.role = 'partner_admin'
      where rpo.organization_id = p_organization_id
        and rpo.active
    )
    or exists (
      select 1
      from public.review_partner_account_assignments rpaa
      join public.review_partner_organizations rpo
        on rpo.partner_id = rpaa.partner_id
       and rpo.organization_id = rpaa.organization_id
       and rpo.active
      join public.review_partner_memberships rpm
        on rpm.partner_id = rpaa.partner_id
       and rpm.user_id = rpaa.user_id
       and rpm.active
      where rpaa.user_id = auth.uid()
        and rpaa.organization_id = p_organization_id
    );
$$;

create or replace function public.review_can_access_organization(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_has_org_wide_access(p_organization_id)
    or exists (
      select 1
      from public.review_property_memberships rpm
      join public.review_properties rp on rp.id = rpm.property_id
      where rpm.user_id = auth.uid()
        and rp.organization_id = p_organization_id
    );
$$;

create or replace function public.review_can_access_property(p_property_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_staff()
    or exists (
      select 1
      from public.review_properties rp
      where rp.id = p_property_id
        and public.review_has_org_wide_access(rp.organization_id)
    )
    or exists (
      select 1
      from public.review_property_memberships rpm
      where rpm.user_id = auth.uid()
        and rpm.property_id = p_property_id
    );
$$;

create or replace function public.review_can_access_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_staff()
    or exists (
      select 1
      from public.review_projects rp
      where rp.id = p_project_id
        and public.review_has_org_wide_access(rp.organization_id)
    )
    or exists (
      select 1
      from public.review_project_assignments rpa
      where rpa.project_id = p_project_id
        and rpa.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.review_project_properties rpp
      join public.review_property_memberships rpm
        on rpm.property_id = rpp.property_id
       and rpm.user_id = auth.uid()
      where rpp.project_id = p_project_id
    );
$$;

create or replace function public.review_can_manage_organization(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_owner()
    or exists (
      select 1
      from public.review_memberships rm
      where rm.user_id = auth.uid()
        and rm.organization_id = p_organization_id
        and rm.role in ('admin', 'client_admin')
    )
    or exists (
      select 1
      from public.review_partner_organizations rpo
      join public.review_partner_memberships rpm
        on rpm.partner_id = rpo.partner_id
       and rpm.user_id = auth.uid()
       and rpm.active
       and rpm.role = 'partner_admin'
      where rpo.organization_id = p_organization_id
        and rpo.active
    );
$$;

create or replace function public.review_can_access_internal_organization(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    public.review_is_archer_staff()
    or exists (
      select 1
      from public.review_partner_organizations rpo
      join public.review_partner_memberships rpm
        on rpm.partner_id = rpo.partner_id
       and rpm.user_id = auth.uid()
       and rpm.active
      left join public.review_partner_account_assignments rpaa
        on rpaa.partner_id = rpo.partner_id
       and rpaa.organization_id = rpo.organization_id
       and rpaa.user_id = rpm.user_id
      where rpo.organization_id = p_organization_id
        and rpo.active
        and (
          rpm.role = 'partner_admin'
          or rpaa.id is not null
        )
    );
$$;

create or replace function public.review_member_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select rm.organization_id
  from public.review_memberships rm
  where rm.user_id = auth.uid()
    and rm.role in ('admin', 'client', 'client_admin', 'read_only');
$$;

create or replace function public.review_admin_user_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select p.user_id
  from public.review_profiles p
  where p.role in ('admin', 'archer_owner', 'archer_designer');
$$;

revoke all on function public.review_is_archer_owner() from public;
revoke all on function public.review_is_archer_staff() from public;
revoke all on function public.review_partner_role(uuid) from public;
revoke all on function public.review_can_access_partner(uuid) from public;
revoke all on function public.review_has_org_wide_access(uuid) from public;
revoke all on function public.review_can_access_organization(uuid) from public;
revoke all on function public.review_can_access_property(uuid) from public;
revoke all on function public.review_can_access_project(uuid) from public;
revoke all on function public.review_can_manage_organization(uuid) from public;
revoke all on function public.review_can_access_internal_organization(uuid) from public;

grant execute on function public.review_is_archer_owner() to authenticated;
grant execute on function public.review_is_archer_staff() to authenticated;
grant execute on function public.review_partner_role(uuid) to authenticated;
grant execute on function public.review_can_access_partner(uuid) to authenticated;
grant execute on function public.review_has_org_wide_access(uuid) to authenticated;
grant execute on function public.review_can_access_organization(uuid) to authenticated;
grant execute on function public.review_can_access_property(uuid) to authenticated;
grant execute on function public.review_can_access_project(uuid) to authenticated;
grant execute on function public.review_can_manage_organization(uuid) to authenticated;
grant execute on function public.review_can_access_internal_organization(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Row-level security for new tables
-- ---------------------------------------------------------------------------

alter table public.review_partners enable row level security;
alter table public.review_partner_organizations enable row level security;
alter table public.review_partner_memberships enable row level security;
alter table public.review_partner_account_assignments enable row level security;
alter table public.review_property_memberships enable row level security;
alter table public.review_projects enable row level security;
alter table public.review_project_internal_notes enable row level security;
alter table public.review_project_properties enable row level security;
alter table public.review_project_assignments enable row level security;
alter table public.review_invitations enable row level security;
alter table public.review_invitation_properties enable row level security;

drop policy if exists review_partners_select on public.review_partners;
create policy review_partners_select on public.review_partners
for select to authenticated
using (public.review_can_access_partner(id));

drop policy if exists review_partner_organizations_select on public.review_partner_organizations;
create policy review_partner_organizations_select on public.review_partner_organizations
for select to authenticated
using (
  public.review_is_archer_staff()
  or public.review_can_access_partner(partner_id)
);

drop policy if exists review_partner_memberships_select on public.review_partner_memberships;
create policy review_partner_memberships_select on public.review_partner_memberships
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_owner()
  or public.review_partner_role(partner_id) = 'partner_admin'
);

drop policy if exists review_partner_account_assignments_select on public.review_partner_account_assignments;
create policy review_partner_account_assignments_select on public.review_partner_account_assignments
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_owner()
  or public.review_partner_role(partner_id) = 'partner_admin'
);

drop policy if exists review_property_memberships_select on public.review_property_memberships;
create policy review_property_memberships_select on public.review_property_memberships
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_staff()
);

drop policy if exists review_projects_select on public.review_projects;
create policy review_projects_select on public.review_projects
for select to authenticated
using (public.review_can_access_project(id));

drop policy if exists review_projects_insert on public.review_projects;
create policy review_projects_insert on public.review_projects
for insert to authenticated
with check (
  public.review_is_archer_staff()
  and public.review_can_access_organization(organization_id)
);

drop policy if exists review_projects_update on public.review_projects;
create policy review_projects_update on public.review_projects
for update to authenticated
using (public.review_is_archer_staff())
with check (public.review_is_archer_staff());

drop policy if exists review_project_internal_notes_select on public.review_project_internal_notes;
create policy review_project_internal_notes_select on public.review_project_internal_notes
for select to authenticated
using (
  exists (
    select 1
    from public.review_projects rp
    where rp.id = review_project_internal_notes.project_id
      and public.review_can_access_internal_organization(rp.organization_id)
  )
);

drop policy if exists review_project_internal_notes_insert on public.review_project_internal_notes;
create policy review_project_internal_notes_insert on public.review_project_internal_notes
for insert to authenticated
with check (
  public.review_is_archer_staff()
  or exists (
    select 1
    from public.review_projects rp
    where rp.id = review_project_internal_notes.project_id
      and public.review_can_access_internal_organization(rp.organization_id)
  )
);

drop policy if exists review_project_internal_notes_update on public.review_project_internal_notes;
create policy review_project_internal_notes_update on public.review_project_internal_notes
for update to authenticated
using (
  public.review_is_archer_staff()
  or exists (
    select 1
    from public.review_projects rp
    where rp.id = review_project_internal_notes.project_id
      and public.review_can_access_internal_organization(rp.organization_id)
  )
)
with check (
  public.review_is_archer_staff()
  or exists (
    select 1
    from public.review_projects rp
    where rp.id = review_project_internal_notes.project_id
      and public.review_can_access_internal_organization(rp.organization_id)
  )
);

drop policy if exists review_project_properties_select on public.review_project_properties;
create policy review_project_properties_select on public.review_project_properties
for select to authenticated
using (public.review_can_access_project(project_id));

drop policy if exists review_project_properties_insert on public.review_project_properties;
create policy review_project_properties_insert on public.review_project_properties
for insert to authenticated
with check (public.review_is_archer_staff());

drop policy if exists review_project_properties_delete on public.review_project_properties;
create policy review_project_properties_delete on public.review_project_properties
for delete to authenticated
using (public.review_is_archer_staff());

drop policy if exists review_project_assignments_select on public.review_project_assignments;
create policy review_project_assignments_select on public.review_project_assignments
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_staff()
  or exists (
    select 1
    from public.review_projects rp
    where rp.id = review_project_assignments.project_id
      and public.review_can_access_internal_organization(rp.organization_id)
  )
);

drop policy if exists review_project_assignments_insert on public.review_project_assignments;
create policy review_project_assignments_insert on public.review_project_assignments
for insert to authenticated
with check (public.review_is_archer_staff());

drop policy if exists review_project_assignments_update on public.review_project_assignments;
create policy review_project_assignments_update on public.review_project_assignments
for update to authenticated
using (public.review_is_archer_staff())
with check (public.review_is_archer_staff());

drop policy if exists review_project_assignments_delete on public.review_project_assignments;
create policy review_project_assignments_delete on public.review_project_assignments
for delete to authenticated
using (public.review_is_archer_staff());

drop policy if exists review_invitations_select on public.review_invitations;
create policy review_invitations_select on public.review_invitations
for select to authenticated
using (public.review_is_archer_owner());

drop policy if exists review_invitation_properties_select on public.review_invitation_properties;
create policy review_invitation_properties_select on public.review_invitation_properties
for select to authenticated
using (
  public.review_is_archer_owner()
  or exists (
    select 1
    from public.review_invitations ri
    where ri.id = review_invitation_properties.invitation_id
      and lower(ri.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

-- ---------------------------------------------------------------------------
-- 7. Replace existing read/write policies with scoped multi-client policies
-- ---------------------------------------------------------------------------

drop policy if exists review_organizations_select on public.review_organizations;
create policy review_organizations_select on public.review_organizations
for select to authenticated
using (public.review_can_access_organization(id));

drop policy if exists review_properties_select on public.review_properties;
create policy review_properties_select on public.review_properties
for select to authenticated
using (public.review_can_access_property(id));

drop policy if exists review_profiles_select on public.review_profiles;
create policy review_profiles_select on public.review_profiles
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_staff()
);

drop policy if exists review_memberships_select on public.review_memberships;
create policy review_memberships_select on public.review_memberships
for select to authenticated
using (
  user_id = auth.uid()
  or public.review_is_archer_staff()
);

drop policy if exists review_items_select on public.review_items;
create policy review_items_select on public.review_items
for select to authenticated
using (
  public.review_is_archer_staff()
  or (
    current_status <> 'draft'
    and (
      public.review_can_access_property(property_id)
      or (
        project_id is not null
        and public.review_can_access_project(project_id)
      )
    )
  )
);

drop policy if exists review_items_admin_insert on public.review_items;
create policy review_items_admin_insert on public.review_items
for insert to authenticated
with check (public.review_is_archer_staff());

drop policy if exists review_items_admin_update on public.review_items;
create policy review_items_admin_update on public.review_items
for update to authenticated
using (public.review_is_archer_staff())
with check (public.review_is_archer_staff());

drop policy if exists review_versions_select on public.review_versions;
create policy review_versions_select on public.review_versions
for select to authenticated
using (
  exists (
    select 1
    from public.review_items ri
    where ri.id = review_versions.review_item_id
      and (
        public.review_is_archer_staff()
        or (
          ri.current_status <> 'draft'
          and (
            public.review_can_access_property(ri.property_id)
            or (
              ri.project_id is not null
              and public.review_can_access_project(ri.project_id)
            )
          )
        )
      )
  )
);

drop policy if exists review_versions_admin_insert on public.review_versions;
create policy review_versions_admin_insert on public.review_versions
for insert to authenticated
with check (public.review_is_archer_staff());

drop policy if exists review_actions_select on public.review_actions;
create policy review_actions_select on public.review_actions
for select to authenticated
using (
  exists (
    select 1
    from public.review_items ri
    where ri.id = review_actions.review_item_id
      and (
        public.review_is_archer_staff()
        or (
          ri.current_status <> 'draft'
          and (
            public.review_can_access_property(ri.property_id)
            or (
              ri.project_id is not null
              and public.review_can_access_project(ri.project_id)
            )
          )
        )
      )
  )
);

drop policy if exists review_actions_admin_insert on public.review_actions;
create policy review_actions_admin_insert on public.review_actions
for insert to authenticated
with check (public.review_is_archer_staff());

drop policy if exists review_messages_select on public.review_messages;
create policy review_messages_select on public.review_messages
for select to authenticated
using (
  public.review_is_archer_staff()
  or (
    visibility = 'internal'
    and public.review_can_access_internal_organization(organization_id)
  )
  or (
    visibility = 'client'
    and (
      (property_id is not null and public.review_can_access_property(property_id))
      or (project_id is not null and public.review_can_access_project(project_id))
      or (
        property_id is null
        and project_id is null
        and public.review_has_org_wide_access(organization_id)
      )
    )
  )
);

drop policy if exists review_messages_insert on public.review_messages;
create policy review_messages_insert on public.review_messages
for insert to authenticated
with check (
  sender_id = auth.uid()
  and (
    public.review_is_archer_staff()
    or (
      visibility = 'internal'
      and public.review_can_access_internal_organization(organization_id)
    )
    or (
      visibility = 'client'
      and (
        (property_id is not null and public.review_can_access_property(property_id))
        or (project_id is not null and public.review_can_access_project(project_id))
        or (
          property_id is null
          and project_id is null
          and public.review_has_org_wide_access(organization_id)
        )
      )
    )
  )
);

drop policy if exists review_notification_events_select on public.review_notification_events;
create policy review_notification_events_select on public.review_notification_events
for select to authenticated
using (
  recipient_user_id = auth.uid()
  or public.review_is_archer_staff()
);

-- ---------------------------------------------------------------------------
-- 8. Storage access: retain private bucket and add property-aware reads
-- ---------------------------------------------------------------------------

drop policy if exists review_media_admin_all on storage.objects;
create policy review_media_admin_all on storage.objects
for all to authenticated
using (
  bucket_id = 'review-media'
  and public.review_is_archer_staff()
)
with check (
  bucket_id = 'review-media'
  and public.review_is_archer_staff()
);

drop policy if exists review_media_member_select on storage.objects;
create policy review_media_member_select on storage.objects
for select to authenticated
using (
  bucket_id = 'review-media'
  and (
    public.review_is_archer_staff()
    or (
      array_length(storage.foldername(name), 1) >= 1
      and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      and public.review_has_org_wide_access(((storage.foldername(name))[1])::uuid)
    )
    or (
      array_length(storage.foldername(name), 1) >= 2
      and (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
      and public.review_can_access_property(((storage.foldername(name))[2])::uuid)
    )
  )
);

-- ---------------------------------------------------------------------------
-- 9. Seed Dragonfly relationship and migrate Devon's role
-- ---------------------------------------------------------------------------

insert into public.review_partners (name, slug, active)
values ('Dragonfly Strategists', 'dragonfly', true)
on conflict (slug) do update
set name = excluded.name,
    active = true,
    archived_at = null;

insert into public.review_partner_organizations (partner_id, organization_id, active)
select p.id, o.id, true
from public.review_partners p
join public.review_organizations o
  on o.slug = 'valencia-hotel-group'
where p.slug = 'dragonfly'
on conflict (partner_id, organization_id) do update
set active = true;

update public.review_profiles
set role = 'archer_owner'
where lower(email) = 'heydevon@gmail.com'
  and role = 'admin';

-- No auth users or invitation emails are created by this migration.
