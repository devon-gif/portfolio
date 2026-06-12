-- Hotel Pipeline OS — generated_proposals (used by /proposal-generator)
-- Stores proposal drafts only. Nothing here sends anything. Idempotent.

create table if not exists generated_proposals (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid references companies(id) on delete set null,
  contact_id    uuid references contacts(id) on delete set null,
  title         text not null,
  proposal_body text not null,
  price         text,
  status        text not null default 'draft' check (status in ('draft','sent','revised','accepted','declined','archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists generated_proposals_created_idx on generated_proposals(created_at desc);

do $$
begin
  execute 'alter table generated_proposals enable row level security;';
  begin
    create policy "local anon full access" on generated_proposals for all to anon using (true) with check (true);
  exception when duplicate_object then null;
  end;
  begin
    create policy "authenticated full access" on generated_proposals for all to authenticated using (true) with check (true);
  exception when duplicate_object then null;
  end;
end $$;
