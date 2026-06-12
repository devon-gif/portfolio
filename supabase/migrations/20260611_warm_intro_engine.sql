-- Hotel Pipeline OS — Warm Intro Engine + Sprint upgrades
-- 1. Split channel metrics on creative_sprint_metrics
-- 2. winning_messages (the learning loop, finally persisted)
-- 3. intro_sources (people who can introduce Devon to hotel decision-makers)
-- Manual-first: nothing here sends anything. LinkedIn stays manual-only.
-- Idempotent.

-- ── 1. Split metrics ──────────────────────────────────────────────────────────
alter table creative_sprint_metrics add column if not exists buyer_positive_replies   int not null default 0;
alter table creative_sprint_metrics add column if not exists partner_positive_replies int not null default 0;
alter table creative_sprint_metrics add column if not exists hiring_dms_sent          int not null default 0;
alter table creative_sprint_metrics add column if not exists hiring_positive_replies  int not null default 0;
alter table creative_sprint_metrics add column if not exists warm_intro_requests_sent int not null default 0;
alter table creative_sprint_metrics add column if not exists warm_intros_received     int not null default 0;
-- (first_dms_sent = direct buyer DMs; partner_dms_sent, positive_replies,
--  sample_requests, sample_packs_sent, calls_booked, pilots_sent already exist.)

-- ── 2. Winning messages ───────────────────────────────────────────────────────
create table if not exists winning_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  source        text,                          -- linkedin / email / call / other
  sprint_day_id uuid references creative_sprint_days(id) on delete set null,
  message_type  text,                          -- connection / dm1 / followup / partner / hiring_signal / post / other
  audience      text,                          -- direct buyer / partner / hiring signal / intro source
  message_body  text not null,
  result        text,                          -- reply / call_booked / sample_requested / pilot / won
  notes         text,
  is_active     boolean not null default true
);

create index if not exists winning_messages_created_idx on winning_messages(created_at desc);

-- ── 3. Intro sources (warm intro engine) ──────────────────────────────────────
create table if not exists intro_sources (
  id                     uuid primary key default gen_random_uuid(),
  name                   text not null,
  company                text,
  linkedin_url           text,
  category               text,  -- hotel consultant / revenue consultant / former DOSM / recruiter / vendor / event planner / hotel tech rep / photographer / association leader / GM / owner-operator
  relationship_strength  text not null default 'cold' check (relationship_strength in ('cold','warming','warm','strong')),
  intro_quality          text not null default 'unknown' check (intro_quality in ('unknown','low','medium','high')),
  hotel_network_size     text,  -- free text: "10-20 GMs", "statewide association", etc.
  partner_interest       text not null default 'unknown' check (partner_interest in ('unknown','no','maybe','yes','active')),
  referral_terms_discussed boolean not null default false,
  last_touch             date,
  next_touch             date,
  intro_requested        boolean not null default false,
  intro_made             boolean not null default false,
  intro_result           text,
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists intro_sources_next_touch_idx on intro_sources(next_touch);
create unique index if not exists intro_sources_name_company_uniq on intro_sources(name, coalesce(company, ''));

-- ── RLS (matches local-first model; tighten before public exposure) ──────────
do $$
declare t text;
begin
  foreach t in array array['winning_messages','intro_sources']
  loop
    execute format('alter table %I enable row level security;', t);
    begin
      execute format('create policy "local anon full access" on %I for all to anon using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
    begin
      execute format('create policy "authenticated full access" on %I for all to authenticated using (true) with check (true);', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
