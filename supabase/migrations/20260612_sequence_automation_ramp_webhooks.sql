-- Sequence automation, ramp timer, and webhook safety.
-- Idempotent: safe to run more than once.

alter table public.contacts
  add column if not exists sequence_step integer default 0,
  add column if not exists sequence_status text default 'not_enrolled',
  add column if not exists next_step_due_at timestamptz,
  add column if not exists sequence_halt_reason text,
  add column if not exists sequence_started_at timestamptz,
  add column if not exists sequence_completed_at timestamptz,
  add column if not exists bounced_at timestamptz,
  add column if not exists complained_at timestamptz,
  add column if not exists bounce_count integer default 0;

alter table public.messages
  add column if not exists sequence_step integer,
  add column if not exists sequence_template_tag text,
  add column if not exists delivered_at timestamptz,
  add column if not exists bounced_at timestamptz,
  add column if not exists complained_at timestamptz;

alter table public.app_settings
  add column if not exists ramp_enabled boolean default false,
  add column if not exists ramp_start_date date,
  add column if not exists ramp_target integer default 100;

alter table public.suppression_list
  add column if not exists domain text,
  add column if not exists reason text;

create index if not exists idx_contacts_sequence_due
  on public.contacts(sequence_status, next_step_due_at);

create index if not exists idx_messages_resend_email_id
  on public.messages(resend_email_id);

create index if not exists idx_messages_sequence
  on public.messages(contact_id, sequence_step, sequence_template_tag);

create index if not exists idx_messages_deliverability_window
  on public.messages(sent_at, bounced_at, complained_at);
