-- Hotel Pipeline OS — Scorecard → Calendly handoff
-- Adds low-friction handoff columns and statuses so a scorecard lead can add
-- optional property links and jump to a prefilled Calendly booking without
-- re-entering their details. Idempotent.

alter table scorecard_submissions add column if not exists property_links       jsonb;
alter table scorecard_submissions add column if not exists biggest_concern      text;
alter table scorecard_submissions add column if not exists calendly_clicked_at  timestamptz;
alter table scorecard_submissions add column if not exists review_requested_at  timestamptz;

-- Widen the status check to include the handoff statuses.
do $$
begin
  alter table scorecard_submissions drop constraint if exists scorecard_submissions_status_check;
  alter table scorecard_submissions add constraint scorecard_submissions_status_check
    check (status in (
      'new','scorecard_completed','reviewed','follow_up_sent',
      'creative_gap_review_requested','calendly_clicked','review_requested',
      'call_booked','deck_sent','proposal_sent','won','lost','nurture','archived'
    ));
end $$;
