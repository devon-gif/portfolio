-- Hotel Pipeline OS — Promo Rescue Lead Finder
-- Powers /admin/promo-leads: an ethical, manual-approval lead discovery tool
-- for the $59.99 Promo Rescue offer. Nothing in this feature sends outreach
-- automatically — every row is found/scored/drafted for a human to approve.
-- Idempotent.

create table if not exists promo_leads (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Discovery (Google Places)
  place_id              text,
  business_name         text not null,
  category              text,
  city                  text,
  state                 text,
  address               text,
  phone                 text,
  website               text,
  google_maps_url       text,
  source_url            text,
  rating                numeric,
  review_count          int,

  -- Scoring + signals (Firecrawl + rules)
  fit_score             int,
  fit_reason            text,
  visible_promo_signal  text,
  website_issue_summary text,
  suggested_angle       text,
  suggested_message     text,
  signals_json          jsonb,

  -- Manual workflow
  status                text not null default 'new' check (status in (
    'new', 'reviewed', 'approved', 'contacted', 'not_fit'
  )),
  notes                 text
);

create unique index if not exists promo_leads_place_id_idx on promo_leads(place_id) where place_id is not null;
create index if not exists promo_leads_status_idx on promo_leads(status, fit_score desc);
create index if not exists promo_leads_city_state_idx on promo_leads(state, city);

alter table promo_leads enable row level security;
do $$
begin
  begin
    create policy "local anon full access" on promo_leads for all to anon using (true) with check (true);
  exception when duplicate_object then null; end;
  begin
    create policy "local authed full access" on promo_leads for all to authenticated using (true) with check (true);
  exception when duplicate_object then null; end;
end $$;
