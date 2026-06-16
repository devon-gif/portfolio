-- Hotel Pipeline OS — AI website audit cache + AI fields on scorecard leads
-- Powers the AI-powered Creative Bandwidth audit at /hotel-creative-scorecard.
-- Idempotent.

create table if not exists website_audits (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  website_url        text,
  normalized_domain  text,
  source_urls        text[],
  extracted_title    text,
  extracted_meta     text,
  extracted_text     text,
  social_links       jsonb,
  ai_model           text,
  ai_result          jsonb,
  score_total        int,
  score_band         text,
  confidence         text,
  status             text not null default 'pending' check (status in (
    'pending','complete','failed','disabled'
  )),
  error_message      text
);

create index if not exists website_audits_domain_idx on website_audits(normalized_domain, created_at desc);

alter table website_audits enable row level security;
do $$
begin
  begin
    create policy "local anon full access" on website_audits for all to anon using (true) with check (true);
  exception when duplicate_object then null; end;
  begin
    create policy "local authed full access" on website_audits for all to authenticated using (true) with check (true);
  exception when duplicate_object then null; end;
end $$;

-- AI read fields stored on the scorecard lead for quick admin display.
alter table scorecard_submissions add column if not exists audit_source       text not null default 'manual';
alter table scorecard_submissions add column if not exists website_audited     text;
alter table scorecard_submissions add column if not exists website_audit_id    uuid references website_audits(id) on delete set null;
alter table scorecard_submissions add column if not exists ai_score_total      int;
alter table scorecard_submissions add column if not exists ai_score_band       text;
alter table scorecard_submissions add column if not exists ai_confidence       text;
alter table scorecard_submissions add column if not exists ai_summary          text;
alter table scorecard_submissions add column if not exists ai_strongest_gaps   text[];
alter table scorecard_submissions add column if not exists ai_quick_wins       text[];

-- The AI flow may insert a lead before the manual 10-question answers exist,
-- so answers_json / property_count / company_type must be nullable. They are
-- already nullable in the base table; nothing to change here.
