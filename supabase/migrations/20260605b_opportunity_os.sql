-- Hotel Pipeline OS → Hotel Opportunity OS
-- Adds opportunity / signal tracking fields to companies. Idempotent and additive
-- only — existing companies and the outreach flow are unaffected (all new columns
-- are nullable except opportunity_status, which defaults to 'new_signal').

alter table companies add column if not exists lead_type               text;
alter table companies add column if not exists opportunity_type        text;
alter table companies add column if not exists opportunity_trigger     text;
alter table companies add column if not exists trigger_source_url      text;
alter table companies add column if not exists trigger_summary         text;
alter table companies add column if not exists hiring_role_title       text;
alter table companies add column if not exists hiring_job_url          text;
alter table companies add column if not exists hiring_platform         text;
alter table companies add column if not exists partner_type            text;
alter table companies add column if not exists recommended_approach    text;
alter table companies add column if not exists recommended_next_action text;
alter table companies add column if not exists priority_score          int;
alter table companies add column if not exists opportunity_status      text default 'new_signal';
alter table companies add column if not exists examples_to_send        text;
alter table companies add column if not exists last_signal_at          timestamptz;

-- Permissive, nullable check constraints (suggested vocab). Existing rows are safe:
-- lead_type stays NULL (allowed); opportunity_status defaults to 'new_signal' (allowed).
do $$
begin
  alter table companies add constraint companies_lead_type_check check (
    lead_type is null or lead_type in (
      'direct_buyer','hiring_signal','partner','enterprise_router',
      'spa','restaurant_fnb','wedding_events','job_application','warm_linkedin'
    )
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table companies add constraint companies_opportunity_status_check check (
    opportunity_status is null or opportunity_status in (
      'new_signal','needs_research','candidate_found','needs_hunter','ready_to_message',
      'message_drafted','approved_for_today','scheduled','replied','examples_sent',
      'pilot_proposed','won','lost','not_fit'
    )
  );
exception when duplicate_object then null;
end $$;

create index if not exists companies_lead_type_idx          on companies(lead_type);
create index if not exists companies_opportunity_status_idx on companies(opportunity_status);
create index if not exists companies_priority_score_idx     on companies(priority_score desc);
create index if not exists companies_last_signal_at_idx     on companies(last_signal_at desc);
