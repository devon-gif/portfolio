-- Hotel Pipeline OS — Growth Command Center (/growth)
-- Weekly growth lanes: SEO, citations, reviews, LinkedIn, buyer/partner outreach.
-- Tasks are created and worked manually; nothing here auto-posts or auto-sends.
-- Idempotent.

create table if not exists growth_tasks (
  id            uuid primary key default gen_random_uuid(),
  week_start    date not null,
  day           text not null check (day in ('monday','tuesday','wednesday','thursday','friday')),
  category      text not null,
  title         text not null,
  goal          text,
  status        text not null default 'todo' check (status in ('todo','in_progress','done','skipped')),
  notes         text,
  source_url    text,
  next_action   text,
  due_day       date,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists growth_tasks_week_start_idx on growth_tasks(week_start);
create index if not exists growth_tasks_status_idx on growth_tasks(status);

-- Makes "Generate this week's tasks" idempotent: the same default task can only
-- exist once per week.
create unique index if not exists growth_tasks_week_day_title_uniq
  on growth_tasks(week_start, day, title);

-- Match the local-first anon access model used by the rest of the CRM
-- (see 20260602d_local_anon_access.sql). Tighten before exposing publicly.
alter table growth_tasks enable row level security;

do $$
begin
  create policy "local anon full access" on growth_tasks
    for all to anon using (true) with check (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "authenticated full access" on growth_tasks
    for all to authenticated using (true) with check (true);
exception
  when duplicate_object then null;
end $$;
