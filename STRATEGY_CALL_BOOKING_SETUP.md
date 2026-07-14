# Strategy Call Booking Setup — HSC × Archer Design Website

This document explains how to finish wiring up the dedicated "Book a Strategy
Call" flow for `/revenue-activation`. The code side is done; this doc covers
the external account setup only you (Devon/Wesam) can do, plus how to test
and troubleshoot it.

## 0. Current flow: direct request form (no Calendly, no mailto)

Every "Book a Strategy Call" button on `/revenue-activation` (nav, hero,
calculator, FAQ, final CTA) opens an in-page modal — **not** a mailto: link
and **not** a Calendly redirect. The visitor fills out a short form and it
submits to `POST /api/strategy-call`, which:

1. Saves the request to the existing `strategy_call_bookings` table
   (`booking_provider = 'website_form'`, `booking_status =
   'request_submitted'` — see migration
   `20260715_strategy_call_bookings_add_request_submitted_status.sql`).
2. Emails an internal notification to `wesam@hotelsalesconsultants.com` and
   `hello@archerdesign.shop` (fixed recipients, not env-configurable — see
   `sendStrategyCallRequestNotification` in `lib/strategy-call-notify.ts`).
3. Emails the visitor a confirmation receipt
   (`sendStrategyCallRequestConfirmation`).
4. Does **not** schedule anything automatically. A human (Wesam or Devon)
   still reaches out to actually find a time.

Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`, `RESEND_FROM_EMAIL` (all already documented in
`.env.example`). If Supabase isn't configured, the route returns a clear
500 rather than silently reporting success with nothing saved.

Basic spam protection: a hidden honeypot field (`hp_token` — real visitors
never see or fill it) and a simple in-memory per-IP rate limit
(`lib/rate-limit.ts`, 5 submissions per 10 minutes). The rate limiter is
best-effort on serverless (state doesn't share across cold-started
instances) — see the comment at the top of that file if stricter limiting
is ever needed.

**The Calendly flow described in the rest of this document (§ 1 onward) is
kept as a separate, optional path** — e.g. for a human to manually send a
prospect a Calendly link after reviewing their request, or if a future
redesign wires the buttons back to it. It is not currently linked from any
button on the page, and is safe to leave fully unconfigured.

**Provider: Calendly.** This site already uses Calendly for a different funnel
(the Creative Gap Review — see `lib/scorecard.ts`), so the new Hotel
Portfolio Strategy Call event reuses that same integration pattern rather
than introducing a second scheduling tool.

---

## 1. Which booking provider is being used

Calendly. Every "Book a Strategy Call" button on `/revenue-activation`
resolves to one dedicated Calendly event type, tracked with a fixed set of
UTM + lead-source params (see § 8). The webhook that records bookings
(`POST /api/webhooks/strategy-call`) is written specifically against
Calendly's v2 webhook payload shape and signature scheme.

If you decide to use a *different* Calendly account/org than the one running
the scorecard funnel, that's fine — nothing here assumes a specific account,
only that it's Calendly.

## 2. How to create the dedicated team event

1. In Calendly, create a new **Event Type** named exactly:
   `HSC × Archer Design — Hotel Portfolio Strategy Call`
2. Set its scheduling link slug to: `hotel-portfolio-strategy`
   (so the event URL is `https://calendly.com/<your-org>/hotel-portfolio-strategy`).
3. Under **Invitee Questions**, add these custom questions **in this exact
   order** — the webhook reads answers by position (a1 = first question, a2 =
   second, etc.), so the order must match:
   1. Company or hotel group *(required)*
   2. Number of hotels or properties *(required)*
   3. Company website *(required)*
   4. Phone number *(required)*
   5. Primary area of interest *(required, single-select)* — options, in
      this order:
      - Hotel sales and pipeline generation
      - Creative and social support
      - Restaurant and F&B promotion
      - Meetings, weddings, and events
      - Multi-property portfolio support
      - Full sales and creative pilot
      - Other
   6. Current marketing or sales challenge *(optional)*
   7. Anything we should know before the call? *(optional)*

   Full name and work email are Calendly's built-in invitee fields — don't
   add them as custom questions.
4. Under **Confirmation Page**, enable "Redirect to an external page after
   booking" (Standard plan and up) and set it to:
   `https://<your-domain>/revenue-activation/confirmed`
   This is what shows the required confirmation copy instead of Calendly's
   default confirmation screen. If your Calendly plan doesn't support a
   custom redirect, visitors will see Calendly's own confirmation screen
   instead — the booking still gets recorded correctly either way, you just
   lose the custom copy on that immediate screen.
5. Publish the event and copy its URL — that becomes
   `NEXT_PUBLIC_STRATEGY_CALL_URL` (§ 8).

## 3. How to configure round-robin assignment

Round-robin is **not** done through Calendly's own team routing in this
implementation — it's computed by the webhook handler
(`assignSalesperson()` in `lib/strategy-call.ts`), so it works on any
Calendly plan, including a solo/individual plan. It's stateless: it looks at
how many bookings already exist and cycles through your team list by
position (`existingCount % teamSize`).

To enable it:

1. Set `SALES_TEAM_NAMES` and `SALES_TEAM_EMAILS` as **parallel,
   comma-separated lists** (same order, same length), e.g.:
   ```
   SALES_TEAM_NAMES=Jordan Lee,Priya Shah
   SALES_TEAM_EMAILS=jordan@hotelsalesconsultants.com,priya@hotelsalesconsultants.com
   ```
2. Leave both empty and every call is assigned to whoever is in
   `WESAM_EMAIL` instead (see § 12 for changing this later).

If you *do* want Calendly to also handle round-robin natively (so it
distributes availability across hosts, not just who gets notified — that
matters if salespeople have different calendars/availability), that requires
Calendly's **Teams** plan and a **Round Robin** or **Collective** event type.
You can layer that on top of this later; the webhook's own assignment logic
would then just be tracking who Calendly already picked, if you also thread
the host's info through (not built here — see § 15 limitations).

## 4. How to create the shared Google Calendar

1. In Google Calendar, create a new calendar named exactly:
   `HSC × Archer Strategy Calls`
2. Under that calendar's settings → **Share with specific people**, add:
   - Wesam (Editor)
   - Devon (Editor, or Viewer if he should see but not edit)
   - Each salesperson in your round-robin list (Editor or Viewer, your call)
   - A shared sales-team email/distribution list, if you have one
3. Copy the **Calendar ID** (Settings → Integrate calendar → Calendar ID,
   looks like `xxxxx@group.calendar.google.com`) into `SHARED_CALENDAR_ID`.
   This env var is for reference/documentation today — see § 6 for how
   events actually land on this calendar.

## 5. How to share the calendar with Wesam, Devon, and the sales team

Covered in step 2 above — do this once when the calendar is created. Anyone
you add there sees every event on it going forward without needing their own
calendar invite per booking.

## 6. How to connect the booking provider to the shared calendar

This implementation does **not** call the Google Calendar API directly — no
Google Cloud service account is required. Instead:

1. In Calendly, go to **Account → Calendar Connections** and connect the
   Google account whose calendars include (or can access) the shared
   `HSC × Archer Strategy Calls` calendar.
2. On the Hotel Portfolio Strategy Call event type, under **Event Type →
   Calendar → Add to calendar**, choose the shared calendar as the
   destination instead of a personal calendar.

That's it — every booking on this event type writes directly to the shared
calendar with no extra code. This was the option chosen when this system was
built (see the "Shared calendar" decision in the implementation notes) over
building a custom Google Calendar API integration, since it needs zero extra
credentials and works today.

If you outgrow this later (e.g. you want per-salesperson calendar sync in
*addition* to the shared one, which Calendly's single "add to calendar"
setting doesn't do per-host on non-Teams plans), a custom Google Calendar API
integration is the next step — that requires a Google Cloud service account
with domain-wide delegation or OAuth, shared access to the target calendars,
and roughly a day of engineering work. Not built here; flagged in § 15.

## 7. How to configure webhook credentials

1. In Calendly, go to **Integrations → Webhooks** (or use the Calendly API
   directly if your plan doesn't expose this in the UI — webhook
   subscriptions require a paid Calendly plan; see § 15).
2. Create a webhook subscription:
   - **URL:** `https://<your-domain>/api/webhooks/strategy-call`
   - **Events:** `invitee.created`, `invitee.canceled`
   - **Scope:** the organization, or just the Hotel Portfolio Strategy Call
     event type if Calendly lets you scope it that narrowly.
3. Calendly gives you a **signing key** when the webhook is created — set
   that as `BOOKING_WEBHOOK_SECRET`.
4. Deploy with `BOOKING_WEBHOOK_SECRET` set *before* creating the webhook
   subscription (or immediately after), since requests with a missing/wrong
   secret return `400`.

## 8. Which environment variables are required

All of these are documented with inline comments in `.env.example`. Summary:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_STRATEGY_CALL_URL` | Buttons to link to Calendly at all | Public — this is meant to be visible, it's just a booking link |
| `BOOKING_WEBHOOK_SECRET` | Webhook signature verification | Server only, never exposed |
| `BOOKING_PROVIDER` | Logging/notifications only | Currently always `calendly` |
| `SHARED_CALENDAR_ID` | Documentation/reference | No code path calls the Calendar API directly (§ 6) |
| `WESAM_NAME` / `WESAM_EMAIL` | Wesam sees every call + is the assignment fallback | |
| `DEVON_NAME` / `DEVON_EMAIL` | Devon is notified on every call | |
| `SALES_TEAM_NAMES` / `SALES_TEAM_EMAILS` | Round-robin assignment | Parallel comma lists, same order/length |
| `SALES_NOTIFICATION_EMAIL` | Optional shared inbox notified on every call | |
| `SLACK_WEBHOOK_URL` | Optional Slack posting | No Slack integration exists elsewhere in this project — additive |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `RESEND_REPLY_TO` | All email notifications | Already used elsewhere in this app (scorecard, contact form) — may already be set in Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Saving bookings at all | Already used elsewhere in this app |

Every notification function is best-effort and **skips silently** (not an
error) if its required env vars aren't set — see `lib/sending.ts`,
`lib/strategy-call-notify.ts`. The one thing that must never silently skip
is the booking write to Supabase, which is why the webhook returns a `500`
(so Calendly retries) if that specific write fails.

## 9. How to test a booking

1. Set `NEXT_PUBLIC_STRATEGY_CALL_URL`, `BOOKING_WEBHOOK_SECRET`, and at
   least `WESAM_EMAIL` in your environment, then deploy (or run locally with
   a tunnel like `ngrok` so Calendly can reach your webhook).
2. Visit `/revenue-activation`, open dev tools, and confirm each
   `[data-strategy-call]` button's `href` updates to a real Calendly URL
   with `utm_source=hsc_archer_site&utm_medium=website&utm_campaign=hotel_portfolio_pilot&lead_source=HSC_ARCHER_WEBSITE`
   once you click it (the href is set at click time — right-click → Copy
   Link Address will show the pre-computed one from page load, which won't
   include click-time context; use dev tools' Elements panel after a real
   click, or the Network tab, to see the final URL).
3. Complete a real test booking through Calendly with a throwaway email.
4. Confirm Calendly delivers the webhook (Calendly's webhook management UI
   shows recent delivery attempts and response codes — look for `200`).
5. Query `strategy_call_bookings` in Supabase and confirm a row exists with
   `original_lead_source = 'HSC_ARCHER_WEBSITE'`, the right
   `assigned_salesperson_email`, and your test answers in
   `company_name` / `hotel_count` / etc.
6. Confirm the assigned salesperson, Wesam, and Devon (whichever have
   `_EMAIL` vars set) received the `NEW ARCHER WEBSITE LEAD` email.
7. Visit the confirmation redirect and confirm it shows the real date/time
   once the webhook has landed (may take a couple of seconds — the page
   polls briefly).

## 10. How to confirm attribution is saved

Run this in Supabase SQL editor after a test booking:

```sql
select original_lead_source, lead_source_display, campaign, booking_status,
       assigned_salesperson_email, utm_source, utm_medium, utm_campaign
from strategy_call_bookings
order by created_at desc
limit 5;
```

`original_lead_source` should always read `HSC_ARCHER_WEBSITE`. Try manually
running an `update ... set original_lead_source = 'something_else'` against
a test row — it should silently stay `HSC_ARCHER_WEBSITE` (the
`strategy_call_bookings_protect_source_trg` trigger overwrites any attempted
change back to the original value on every update).

## 11. How to test cancellations and reschedules

1. Cancel the test booking from Calendly (or the cancel link Calendly
   emails the invitee).
2. Confirm the webhook fires `invitee.canceled` and the row's
   `booking_status` becomes `canceled` and `canceled_at` is set.
3. For a reschedule, use Calendly's reschedule link instead of canceling
   outright. Calendly represents this as a cancel of the old invitee (with
   `rescheduled: true`) plus a new `invitee.created` for the new time. The
   webhook marks the old row `rescheduled` rather than `canceled` when it
   detects that flag, and creates a fresh row for the new time (linked only
   loosely, via the same prospect email/company — there's no hard foreign
   key between the two rows in this version; see § 15).

## 12. How to add or remove salespeople

Edit `SALES_TEAM_NAMES` / `SALES_TEAM_EMAILS` (parallel lists) and
redeploy. No code change needed. Round-robin picks up the new list on the
next booking — it's stateless, so there's no migration or counter to reset.

## 13. How to change the assigned meeting host

Two different things can mean this:

- **Who gets internally notified/credited as the owner:** just change the
  `SALES_TEAM_EMAILS` list (§ 12) — the webhook computes assignment fresh
  on every booking.
- **Who the Calendly event itself is hosted by / whose calendar it lands
  on:** that's a Calendly-side setting on the event type (single host, or a
  Round Robin/Collective event on the Teams plan — see § 3).

This build only implements the first (internal notification/attribution
assignment). The Calendly event itself is currently single-host — see § 15.

## 14. What to do when a booking fails to appear

1. Check Calendly's webhook delivery log for the booking — if it shows a
   non-`200` response, read the response body (the route returns a clear
   `error` field).
2. `400 Invalid signature` — `BOOKING_WEBHOOK_SECRET` doesn't match what
   Calendly is signing with. Re-copy it from the Calendly webhook settings.
3. `500 Database write failed` — check server logs for the Supabase error
   message; almost always a schema mismatch (migration not run) or
   `SUPABASE_SERVICE_ROLE_KEY` missing/wrong.
4. `ok: true, ignored: true, reason: "utm_source/utm_campaign mismatch"` —
   the booking didn't come through the dedicated link (someone booked
   directly on the Calendly page URL without the tracking params). This is
   working as intended — it's the "don't trust unverified source" guard —
   but if it's happening for real website visitors, double check every
   `[data-strategy-call]` button's `NEXT_PUBLIC_STRATEGY_CALL_URL` /
   `STRATEGY_CALL_BASE_URL` is actually set (§ 8, § 15).
5. No salesperson assigned (`assigned_salesperson_email` is null) — you'll
   also get an `ACTION REQUIRED — Unassigned Archer Website Strategy Call`
   email to Wesam/Devon when this happens. It means neither
   `SALES_TEAM_EMAILS` nor `WESAM_EMAIL` was set at the time of booking.

## 15. How to verify all website buttons use the dedicated URL

Every "Book a Strategy Call" button on `/revenue-activation` (nav, hero,
portfolio calculator, FAQ, final CTA) carries `data-strategy-call="..."` and
is wired through one function (`buildStrategyCallHref()`, in the page's own
`<script>` block near the end of the file) rather than each hardcoding a
URL. To verify:

```bash
grep -n 'data-strategy-call' public/revenue-activation/index.html
```

You should see exactly 5 anchors tagged `nav`, `hero`, `calculator`, `faq`,
`final-cta`, and one script block defining `buildStrategyCallHref`. If a new
CTA is ever added to the page, give it `data-strategy-call="<name>"` and it
will automatically pick up the same dedicated URL + tracking — no separate
wiring needed.

---

## Limitations that require a paid Calendly plan (or more engineering)

- **Webhook subscriptions** (the mechanism this whole system depends on to
  record bookings) require a paid Calendly plan — Basic/free plans cannot
  create webhook subscriptions at all. If you're on a free plan, bookings
  will still happen but nothing will be recorded, assigned, or notified
  server-side.
- **Custom "redirect after booking" page** (used for the branded confirmation
  copy in § 2 step 4) requires Standard plan or up. On a lower plan,
  visitors see Calendly's own confirmation screen instead — booking data is
  still captured correctly via the webhook either way.
- **True Calendly-native round-robin/collective scheduling** (where Calendly
  itself picks who has availability, not just who gets notified) requires
  the **Teams** plan. This build's round-robin (§ 3) works on any plan, but
  it only affects *notification/attribution*, not whose calendar the event
  actually lands on — the event is hosted by whoever owns the event type.
- **Reschedule linkage** isn't a hard foreign key between the old and new
  booking rows (see § 11) — good enough to not lose data or misattribute
  the source, but not a perfect audit trail. Fixable later using
  `invitee.new_invitee` / `old_invitee` URIs if you want a `rescheduled_from`
  column.
- **`landing_page_url` / `referrer_url`** are appended to the booking link for
  completeness but Calendly does not forward arbitrary non-UTM query params
  back through its webhook payload, so these two columns are currently
  always `null` in the database. Not a blocker for the core requirement
  (source attribution, assignment, notifications all work), just a known gap
  — see the comment above `buildStrategyCallUrl()` in `lib/strategy-call.ts`.
- **A custom Google Calendar API integration** was intentionally not built —
  see § 6 for why, and what building it later would require.
- **No live end-to-end test was run against real Calendly infrastructure**
  from this environment (no Calendly account/credentials available here).
  Field names in `lib/calendly.ts` follow Calendly's documented v2 webhook
  payload shape; verify them against one real test delivery (§ 9) before
  fully relying on this in production.
