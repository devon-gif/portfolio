-- Hotel Pipeline OS — 3-Property Creative Gap Review requests
-- Public form at /creative-gap-review writes here (via /api/creative-gap-review,
-- service-role key). Admin at /scorecard-submissions reads/updates these.
-- Idempotent.

create table if not exists creative_gap_reviews (
  id                            uuid primary key default gen_random_uuid(),
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),
  name                          text not null,
  email                         text not null,
  company                       text,
  role                          text,
  website                       text,
  property_urls                 jsonb,
  biggest_concern               text,
  preferred_call_time           text,
  status                        text not null default 'new' check (status in (
    'new','reviewing','review_prepared','call_requested','call_booked',
    'completed','proposal_sent','won','lost','archived'
  )),
  notes                         text,
  linked_scorecard_submission_id uuid references scorecard_submissions(id) on delete set null
);

create index if not exists creative_gap_reviews_created_idx
  on creative_gap_reviews(created_at desc);
create index if not exists creative_gap_reviews_status_idx
  on creative_gap_reviews(status);

-- RLS — same local-first convention as scorecard_submissions (see that file's
-- security note). Inserts run through the server route with the service role.
alter table creative_gap_reviews enable row level security;

do $$
begin
  begin
    create policy "local anon full access" on creative_gap_reviews
      for all to anon using (true) with check (true);
  exception when duplicate_object then null; end;

  begin
    create policy "local authed full access" on creative_gap_reviews
      for all to authenticated using (true) with check (true);
  exception when duplicate_object then null; end;
end $$;
