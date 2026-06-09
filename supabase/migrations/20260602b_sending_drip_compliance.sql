-- Hotel Pipeline OS — Migration: approved sending, drip campaign, compliance
-- Idempotent. Run in the Supabase SQL Editor or via psql.

-- ─── Contacts: deliverability / opt-out / reply tracking ─────────────────────
alter table contacts add column if not exists email_opt_out    boolean not null default false;
alter table contacts add column if not exists replied_at        timestamptz;
alter table contacts add column if not exists bounced           boolean not null default false;
alter table contacts add column if not exists bounce_count      int not null default 0;
alter table contacts add column if not exists unsubscribed_at   timestamptz;
alter table contacts add column if not exists last_contacted_at timestamptz;

-- Backfill last_contacted_at from the legacy column when present.
update contacts set last_contacted_at = last_contacted
  where last_contacted_at is null
    and exists (
      select 1 from information_schema.columns
      where table_name = 'contacts' and column_name = 'last_contacted'
    );

-- Allow the additional lifecycle statuses used by the sending engine.
alter table contacts drop constraint if exists contacts_status_check;
alter table contacts add constraint contacts_status_check check (status in (
  'new','contacted','queued','approved','sent','replied','meeting_set','call_booked',
  'follow_up_due','proposal_sent','won','lost','not_fit','not_interested',
  'opted_out','unsubscribed','bounced','suppressed'
));

create index if not exists contacts_replied_at_idx on contacts(replied_at);
create index if not exists contacts_email_opt_out_idx on contacts(email_opt_out);

-- ─── Messages: approval + sending lifecycle ──────────────────────────────────
alter table messages add column if not exists status            text not null default 'draft';
alter table messages drop constraint if exists messages_status_check;
alter table messages add constraint messages_status_check check (status in (
  'draft','needs_review','approved','sent','replied','bounced','failed','archived'
));

alter table messages add column if not exists scheduled_for     date not null default current_date;
alter table messages add column if not exists resend_email_id   text;
alter table messages add column if not exists unsubscribe_token text;
alter table messages add column if not exists sequence_step     int;
alter table messages add column if not exists template_id       uuid references templates(id) on delete set null;

create unique index if not exists messages_unsubscribe_token_idx
  on messages(unsubscribe_token) where unsubscribe_token is not null;
create index if not exists messages_status_idx        on messages(status);
create index if not exists messages_scheduled_for_idx on messages(scheduled_for);

-- ─── Enrollments: drip-sequence membership ───────────────────────────────────
create table if not exists enrollments (
  id             uuid primary key default gen_random_uuid(),
  contact_id     uuid not null references contacts(id) on delete cascade,
  status         text not null default 'active' check (status in ('active','stopped','completed')),
  current_step   int not null default 0,          -- last step that was generated/sent (0 = none yet)
  next_send_at   timestamptz,                      -- when the next step becomes due
  stopped_reason text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists enrollments_contact_id_idx on enrollments(contact_id);
create index if not exists enrollments_status_idx      on enrollments(status);
create index if not exists enrollments_next_send_idx   on enrollments(next_send_at);
-- One active enrollment per contact.
create unique index if not exists enrollments_one_active_per_contact
  on enrollments(contact_id) where status = 'active';

drop trigger if exists enrollments_updated_at on enrollments;
create trigger enrollments_updated_at before update on enrollments
  for each row execute function set_updated_at();

alter table messages add column if not exists enrollment_id uuid
  references enrollments(id) on delete set null;

-- ─── Send events: raw Resend webhook log ─────────────────────────────────────
create table if not exists send_events (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid references messages(id) on delete set null,
  contact_id  uuid references contacts(id) on delete set null,
  type        text not null default 'unknown',
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists send_events_type_idx       on send_events(type);
create index if not exists send_events_message_id_idx on send_events(message_id);

-- ─── App settings: Resend config + limits + toggles ──────────────────────────
alter table app_settings add column if not exists resend_from           text not null default '';
alter table app_settings add column if not exists resend_reply_to       text not null default '';
alter table app_settings add column if not exists daily_send_limit      int  not null default 20;
alter table app_settings add column if not exists drip_send_limit       int  not null default 10;
alter table app_settings add column if not exists require_drip_approval boolean not null default true;
alter table app_settings add column if not exists auto_enroll           boolean not null default false;

-- Clamp the daily limit to the allowed 1..200 range.
alter table app_settings drop constraint if exists app_settings_daily_limit_check;
alter table app_settings add constraint app_settings_daily_limit_check
  check (daily_send_limit between 1 and 200);

-- ─── RLS for the new tables (match existing permissive policy) ────────────────
alter table enrollments enable row level security;
alter table send_events enable row level security;
do $$ begin
  create policy "auth users full access" on enrollments for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "auth users full access" on send_events for all using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ─── Seed: 8-step weekly drip templates (tagged drip-1 … drip-8) ──────────────
-- Lead with value + proof points; never lead with price; include {{unsubscribe_url}}
-- and {{mailing_address}} compliance variables.
insert into templates (id, name, type, subject, body, tags) values
('55555555-0000-0000-0000-000000000001','Drip 1 — Intro & value','email',
 'A creative partner for {{company_name}} — without the overhead',
'Hi {{first_name}},

I''ve been following {{personalization_angle}} at {{company_name}} — exactly the kind of work great creative amplifies.

We act as an embedded creative team for {{specific_client_type}}, supporting {{specific_use_cases}} — premium creative without the payroll, benefits, software, or onboarding overhead of an in-house hire.

A snapshot of what that''s produced:
{{stats_block}}

Open to a quick 20-minute look at whether there''s a fit?

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-1','cold']),

('55555555-0000-0000-0000-000000000002','Drip 2 — Proof & outcomes','email',
 'What {{specific_client_type}} get from a fractional creative team',
'Hi {{first_name}},

Following up with a little more on results. Across the hospitality brands we support, our work has driven:
{{stats_block}}

The model is simple: senior creative on demand for {{specific_use_cases}}, at a fraction of the cost of building the function in-house.

Worth a short call to see what this could look like for {{company_name}}?

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-2']),

('55555555-0000-0000-0000-000000000003','Drip 3 — Use cases','email',
 'A few ways we could help {{company_name}}',
'Hi {{first_name}},

A few concrete ways we typically plug in for {{specific_client_type}}:

• {{specific_use_cases}}
• Always-on social and campaign creative
• Refreshing property and brand assets without a long agency cycle

You keep the strategy; we handle execution — no extra headcount, benefits, or tooling to carry.

Would a quick walkthrough be useful?

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-3']),

('55555555-0000-0000-0000-000000000004','Drip 4 — Cost comparison','email',
 'In-house vs. fractional creative for {{company_name}}',
'Hi {{first_name}},

Quick thought on the math. A single in-house creative hire carries salary, benefits, software licenses, and onboarding time before producing anything.

A fractional team gives you that capability immediately — and our output speaks for itself:
{{stats_block}}

Happy to share how this maps to {{company_name}}''s goals. 15 minutes?

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-4']),

('55555555-0000-0000-0000-000000000005','Drip 5 — Social proof','email',
 'How we think about {{personalization_angle}}',
'Hi {{first_name}},

The brands we work with care about {{personalization_angle}} — and creative is usually the lever that moves it fastest.

A reminder of the kind of traction that''s possible:
{{stats_block}}

If it''s helpful, I can send a couple of relevant examples for {{specific_client_type}}.

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-5']),

('55555555-0000-0000-0000-000000000006','Drip 6 — Light touch','email',
 'Still happy to help, {{first_name}}',
'Hi {{first_name}},

I know inboxes are busy, so I''ll keep this short. If {{specific_use_cases}} is on your radar for {{company_name}}, we can support it without adding overhead.

No pressure at all — just reply and I''ll share specifics.

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-6']),

('55555555-0000-0000-0000-000000000007','Drip 7 — Case angle','email',
 'A quick idea for {{company_name}}',
'Hi {{first_name}},

I had a specific idea for how {{company_name}} could approach {{personalization_angle}} with sharper creative.

For context, here''s what our work has delivered elsewhere:
{{stats_block}}

Want me to put the idea in writing? Just say the word.

Best,
{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-7']),

('55555555-0000-0000-0000-000000000008','Drip 8 — Final note','email',
 'Closing the loop, {{first_name}}',
'Hi {{first_name}},

This is my last note for now — I don''t want to clutter your inbox.

If premium creative for {{specific_use_cases}} ever becomes a priority for {{company_name}}, I''d love to help, without the cost and overhead of an in-house team.

Wishing you and the team all the best.

{{sender_name}}

{{compliance_block}}', ARRAY['drip','drip-8'])
on conflict (id) do nothing;
