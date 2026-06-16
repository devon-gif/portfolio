create extension if not exists "pgcrypto";

create table if not exists public.website_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  website_url text not null,
  normalized_domain text not null,
  source_urls text[] default '{}',
  extracted_title text,
  extracted_meta text,
  extracted_text text,
  social_links jsonb default '{}'::jsonb,
  ai_model text,
  ai_result jsonb,
  score_total int,
  score_band text,
  confidence text,
  status text not null default 'completed',
  error_message text
);

create index if not exists website_audits_domain_created_idx
on public.website_audits (normalized_domain, created_at desc);

create table if not exists public.scorecard_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text,
  email text,
  company text,
  role text,
  website text,
  linkedin_url text,
  company_type text,
  property_count text,
  source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  score_total int,
  score_band text,
  confidence text,
  strongest_gaps text[] default '{}',
  quick_wins text[] default '{}',
  recommended_next_step text,
  ai_audit_id uuid references public.website_audits(id) on delete set null,
  status text not null default 'ai_audit_completed',
  calendly_clicked_at timestamptz,
  review_requested_at timestamptz,
  property_links jsonb default '[]'::jsonb,
  biggest_concern text,
  notes text
);

alter table public.scorecard_submissions add column if not exists ai_audit_id uuid references public.website_audits(id) on delete set null;
alter table public.scorecard_submissions add column if not exists confidence text;
alter table public.scorecard_submissions add column if not exists strongest_gaps text[] default '{}';
alter table public.scorecard_submissions add column if not exists quick_wins text[] default '{}';
alter table public.scorecard_submissions add column if not exists recommended_next_step text;
alter table public.scorecard_submissions add column if not exists calendly_clicked_at timestamptz;
alter table public.scorecard_submissions add column if not exists review_requested_at timestamptz;
alter table public.scorecard_submissions add column if not exists property_links jsonb default '[]'::jsonb;
alter table public.scorecard_submissions add column if not exists biggest_concern text;
alter table public.scorecard_submissions add column if not exists utm_source text;
alter table public.scorecard_submissions add column if not exists utm_medium text;
alter table public.scorecard_submissions add column if not exists utm_campaign text;
alter table public.scorecard_submissions add column if not exists utm_content text;

create index if not exists scorecard_submissions_created_idx
on public.scorecard_submissions (created_at desc);

create index if not exists scorecard_submissions_email_idx
on public.scorecard_submissions (email);
