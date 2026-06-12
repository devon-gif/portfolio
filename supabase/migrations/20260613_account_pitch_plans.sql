-- Hotel Pipeline OS — account_pitch_plans (used by /account-pitch-planner)
-- Stores generated pitch plans only. Nothing here sends anything. Idempotent.

create table if not exists account_pitch_plans (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid references companies(id) on delete set null,
  contact_id     uuid references contacts(id) on delete set null,
  fit_score      int,
  account_type   text,
  primary_angle  text,
  generated_plan jsonb,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists account_pitch_plans_created_idx on account_pitch_plans(created_at desc);

do $$
begin
  execute 'alter table account_pitch_plans enable row level security;';
  begin
    create policy "local anon full access" on account_pitch_plans for all to anon using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "authenticated full access" on account_pitch_plans for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
end $$;
