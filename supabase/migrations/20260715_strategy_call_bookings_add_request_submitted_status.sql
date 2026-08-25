-- Adds a 'request_submitted' booking_status value so the new direct
-- strategy-call request form on /revenue-activation (POST
-- /api/strategy-call) can save a row the moment a visitor submits the
-- form, before any call time exists. Distinct from 'strategy_call_booked',
-- which means a specific time was actually scheduled (via the existing
-- Calendly + POST /api/webhooks/strategy-call flow). Additive-only; does
-- not affect existing rows, the Calendly flow, or any other status value.
-- See app/api/strategy-call/route.ts and lib/strategy-call-notify.ts.

alter table strategy_call_bookings
  drop constraint if exists strategy_call_bookings_booking_status_check;

alter table strategy_call_bookings
  add constraint strategy_call_bookings_booking_status_check
  check (booking_status in (
    'request_submitted','strategy_call_booked','call_completed','pilot_proposed','pilot_signed',
    'expansion_opportunity','closed_lost','canceled','rescheduled'
  ));
