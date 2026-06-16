-- Hotel Pipeline OS — LinkedIn Scorecard Launch Board targets
-- Manual LinkedIn outreach tracker for promoting the Hotel Creative Bandwidth
-- Scorecard. NOTHING here automates LinkedIn — it's a tracker for manual,
-- human, copy/paste outreach. Used by /linkedin-scorecard-launch.
-- Idempotent.

create table if not exists linkedin_targets (
  id                            uuid primary key default gen_random_uuid(),
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now(),
  name                          text not null,
  company                       text,
  title                         text,
  linkedin_url                  text,
  target_type                   text not null default 'direct_buyer' check (target_type in (
    'direct_buyer','internal_champion','referral_partner','consultant',
    'vendor_partner','local_hospitality','existing_connection','other'
  )),
  priority                      text not null default 'medium' check (priority in (
    'high','medium','low'
  )),
  connection_status             text not null default 'not_connected' check (connection_status in (
    'not_connected','connection_requested','connected','message_sent',
    'scorecard_sent','responded','not_interested','call_booked','archived'
  )),
  scorecard_sent_at             timestamptz,
  responded_at                  timestamptz,
  scorecard_completed           boolean not null default false,
  creative_gap_review_requested boolean not null default false,
  call_booked                   boolean not null default false,
  notes                         text,
  source                        text,
  -- Manual link to a scorecard submission (by Devon), if matched.
  linked_scorecard_submission_id uuid references scorecard_submissions(id) on delete set null
);

create index if not exists linkedin_targets_status_idx on linkedin_targets(connection_status);
create index if not exists linkedin_targets_priority_idx on linkedin_targets(priority);
create index if not exists linkedin_targets_created_idx on linkedin_targets(created_at desc);

-- RLS — same local-first convention as the other scorecard tables.
alter table linkedin_targets enable row level security;

do $$
begin
  begin
    create policy "local anon full access" on linkedin_targets
      for all to anon using (true) with check (true);
  exception when duplicate_object then null; end;

  begin
    create policy "local authed full access" on linkedin_targets
      for all to authenticated using (true) with check (true);
  exception when duplicate_object then null; end;
end $$;
