-- Hotel Pipeline OS — Creative Output Sprint (/creative-output)
-- 30-day premium hospitality client-acquisition sprint: daily command center.
-- Manual-first: nothing here sends anything. LinkedIn is manual-only.
--
-- Data-model decision (after inspecting growth_tasks, templates, followups):
--  * growth_tasks models WEEKLY lanes — a 30-day phased sprint with per-day
--    content/targets/metrics doesn't fit it, so sprint tables are new.
--  * Post copy, before/after assignments, and DM templates are versioned IN CODE
--    (lib/creative-sprint-plan.ts) — only their *status* (posted URL, asset link,
--    task checkboxes, metrics) persists here. That avoids two extra tables
--    (creative_sprint_content / creative_sprint_templates) full of duplicated copy.
-- Idempotent.

create table if not exists creative_sprints (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  start_date  date not null,
  end_date    date,
  status      text not null default 'active' check (status in ('active','paused','complete','archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists creative_sprints_name_uniq on creative_sprints(name);

create table if not exists creative_sprint_days (
  id            uuid primary key default gen_random_uuid(),
  sprint_id     uuid not null references creative_sprints(id) on delete cascade,
  day_number    int not null,
  phase         text,
  objective     text,
  time_required_minutes int not null default 150,
  status        text not null default 'not_started' check (status in ('not_started','in_progress','complete')),
  content_theme text,
  target_segment text,
  -- content tracking (copy itself lives in lib/creative-sprint-plan.ts)
  post_status   text not null default 'draft' check (post_status in ('draft','posted','skipped')),
  posted_url    text,
  asset_status  text not null default 'not_started' check (asset_status in ('not_started','in_progress','done','posted')),
  asset_link    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create unique index if not exists creative_sprint_days_sprint_day_uniq
  on creative_sprint_days(sprint_id, day_number);

create table if not exists creative_sprint_tasks (
  id              uuid primary key default gen_random_uuid(),
  sprint_day_id   uuid not null references creative_sprint_days(id) on delete cascade,
  title           text not null,
  description     text,
  task_type       text not null default 'general' check (task_type in (
    'linkedin_warmup','linkedin_post','before_after_asset','connection_requests',
    'first_dms','followups','partner_outreach','sample_pack','crm_cleanup',
    'weekly_review','general'
  )),
  target_count    int,
  timebox_minutes int,
  status          text not null default 'not_started' check (status in ('not_started','done','skipped')),
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists creative_sprint_tasks_day_title_uniq
  on creative_sprint_tasks(sprint_day_id, title);

create table if not exists creative_sprint_metrics (
  id                   uuid primary key default gen_random_uuid(),
  sprint_day_id        uuid not null references creative_sprint_days(id) on delete cascade,
  comments_made        int not null default 0,
  connections_sent     int not null default 0,
  accepted_connections int not null default 0,
  first_dms_sent       int not null default 0,
  followups_sent       int not null default 0,
  partner_dms_sent     int not null default 0,
  positive_replies     int not null default 0,
  sample_requests      int not null default 0,
  sample_packs_sent    int not null default 0,
  calls_booked         int not null default 0,
  pilots_sent          int not null default 0,
  revenue_pipeline     numeric not null default 0,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create unique index if not exists creative_sprint_metrics_day_uniq
  on creative_sprint_metrics(sprint_day_id);

-- Match the local-first access model used by the rest of the CRM
-- (see 20260602d_local_anon_access.sql). Tighten before exposing publicly.
do $$
declare t text;
begin
  foreach t in array array[
    'creative_sprints','creative_sprint_days','creative_sprint_tasks','creative_sprint_metrics'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    begin
      execute format(
        'create policy "local anon full access" on %I for all to anon using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
    begin
      execute format(
        'create policy "authenticated full access" on %I for all to authenticated using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
