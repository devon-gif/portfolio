-- Hotel Pipeline OS — Daily Command Center
-- Adds the 'approved_for_today' message status used by the /daily approve→schedule
-- flow. scheduled_send_at already exists (20260604c). Idempotent.

alter table messages drop constraint if exists messages_status_check;
alter table messages add constraint messages_status_check check (status in (
  'draft','needs_review','approved','approved_for_today','scheduled','sending','sent',
  'send_failed','failed','replied','not_interested','do_not_contact',
  'bounced','skipped','archived'
));

create index if not exists messages_scheduled_send_at_idx on messages(scheduled_send_at);
