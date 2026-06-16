-- Hotel Pipeline OS — Hotel Creative Bandwidth Scorecard submissions
-- Public lead magnet at /hotel-creative-scorecard writes here (via the
-- /api/scorecard server route using the service-role key). The admin view at
-- /scorecard-submissions reads/updates these rows.
-- Idempotent.

create table if not exists scorecard_submissions (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  name                   text not null,
  email                  text not null,
  company                text,
  role                   text,
  website                text,
  linkedin_url           text,
  company_type           text,
  property_count         text,
  score_total            int,
  score_band             text,
  answers_json           jsonb,
  pain_points            text[],
  recommended_next_step  text,
  lead_score             int,
  status                 text not null default 'new' check (status in (
    'new','reviewed','follow_up_sent','creative_gap_review_requested',
    'call_booked','deck_sent','proposal_sent','won','lost','nurture','archived'
  )),
  follow_up_due          date,
  notes                  text
);

create index if not exists scorecard_submissions_created_idx
  on scorecard_submissions(created_at desc);
create index if not exists scorecard_submissions_status_idx
  on scorecard_submissions(status);
create index if not exists scorecard_submissions_lead_score_idx
  on scorecard_submissions(lead_score desc);

-- RLS. Inserts come from the server route (service role, bypasses RLS).
-- ⚠️  SECURITY: matching the local-first convention used by the rest of this
--     DB, anon is granted access so the local admin view works with the anon
--     key. Tighten this (server-only reads + per-user policies) before exposing
--     the database publicly — this table holds inbound leads.
alter table scorecard_submissions enable row level security;

do $$
begin
  begin
    create policy "local anon full access" on scorecard_submissions
      for all to anon using (true) with check (true);
  exception when duplicate_object then null; end;

  begin
    create policy "local authed full access" on scorecard_submissions
      for all to authenticated using (true) with check (true);
  exception when duplicate_object then null; end;
end $$;
