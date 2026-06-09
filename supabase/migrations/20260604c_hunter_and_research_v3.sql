-- Hotel Pipeline OS — Hunter enrichment + research v3 fields
-- Idempotent. Run in the Supabase SQL Editor or via psql.

-- ─── companies: richer extracted intelligence ────────────────────────────────
alter table companies add column if not exists public_emails text[] not null default '{}';
alter table companies add column if not exists leadership_names text[] not null default '{}';
alter table companies add column if not exists marketing_sales_people text[] not null default '{}';
alter table companies add column if not exists restaurant_bar_mentions boolean not null default false;
alter table companies add column if not exists spa_wellness_mentions boolean not null default false;
alter table companies add column if not exists meetings_events_weddings_mentions boolean not null default false;
alter table companies add column if not exists company_score int;

-- ─── contact_candidates: hunter fields ───────────────────────────────────────
alter table contact_candidates add column if not exists email_confidence int;
alter table contact_candidates add column if not exists hunter_used_at timestamptz;
alter table contact_candidates add column if not exists hunter_raw_result jsonb;

-- Expand source_type values for Hunter endpoints
do $$
begin
  alter table contact_candidates drop constraint if exists contact_candidates_source_type_check;
  alter table contact_candidates add constraint contact_candidates_source_type_check check (
    source_type in (
      'scraped_page','email_regex','search_result','manual',
      'hunter_domain_search','hunter_email_finder','hunter_email_verifier'
    )
  );
exception when duplicate_object then null;
end $$;

-- Expand email_status taxonomy to include classification + verification outcomes
do $$
begin
  alter table contact_candidates drop constraint if exists contact_candidates_email_status_check;
  alter table contact_candidates add constraint contact_candidates_email_status_check check (
    email_status in (
      -- legacy values
      'direct','role','generic','no_reply','unknown',
      -- classification values
      'direct_email_public','generic_role_email','contact_form','linkedin_only','needs_email','needs_manual_review',
      -- verification values
      'verified','unverified','risky','invalid'
    )
  );
exception when duplicate_object then null;
end $$;

-- Expand recommended_action taxonomy while keeping legacy values valid
-- New canonical values:
-- create_email_draft | create_linkedin_draft | create_contact_form_task |
-- verify_with_hunter | manual_review | skip
do $$
begin
  alter table contact_candidates drop constraint if exists contact_candidates_recommended_action_check;
  alter table contact_candidates add constraint contact_candidates_recommended_action_check check (
    recommended_action in (
      -- legacy
      'email_draft','generic_email_draft','contact_form_task','linkedin_draft','needs_manual_research',
      -- new
      'create_email_draft','create_linkedin_draft','create_contact_form_task',
      'verify_with_hunter','manual_review','skip'
    )
  );
exception when duplicate_object then null;
end $$;
