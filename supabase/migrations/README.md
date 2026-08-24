# Supabase migrations — read this before trusting anything in this folder

## The older files describe a different database

Migrations dated `20260602` through `20260615` create `companies`, `contacts`,
`app_settings`, `suppression_list`, `messages`, `scorecard_submissions` and
similar CRM tables, several with `for all to anon using (true)` policies.

**None of those tables exist in the Supabase project this app connects to.**
Verified against `jgultiqtphgdmuxhsrxj` (Hotelauto): every one returns
`Could not find the table in the schema cache`. Those permissive anon policies
were never applied to this project.

Treat those files as history for a different deployment. Reading them as the
current schema produces a badly wrong picture of the security posture.

## What the live database actually contains

The portal uses two groups of tables:

- `client_onboarding_records`, `client_onboarding_tasks`, `client_intake_responses`
  — the CRM/billing/onboarding side.
- `review_organizations`, `review_properties`, `review_profiles`,
  `review_memberships`, `review_items`, `review_versions`, `review_actions`,
  `review_messages`, `review_notification_events` — the creative-review side,
  with membership-scoped RLS and `SECURITY DEFINER` write functions.

Important current caveat: the three `client_onboarding_*` tables still have
`authenticated` SELECT policies with `using (true)`. That is acceptable only
while no real client accounts are being invited. Before client login is enabled,
those reads must be scoped to the caller's review organization or moved behind
an owner/server-only data path so Stripe IDs/internal notes cannot be queried by
another authenticated user.

## Applied to Hotelauto

| File / change | Status |
|---|---|
| `20260723_review_portal_platform.sql` | **Applied previously.** Creates the base review schema, RLS and RPCs. |
| `20260728_review_portal_hardening.sql` | **Applied 2026-08-24.** Adds `review_participants`, tightens the decide/submit state machines, adds org↔property coherence and safe metadata updates. |
| `20260824b_harden_review_functions.sql` | **Applied 2026-08-24.** Adds `pg_temp` after `public` in all review `SECURITY DEFINER` search paths and revokes the two helper enumerators from `authenticated`/`anon`. |
| `strategy_call_bookings` anon policy removal | **Applied 2026-08-24.** Dropped `local anon full access`; server/service-role consumers are unaffected. This is Part 1 of `20260824c`. |

Verification after the hardening pass confirmed:

- `review_participants(uuid[])` exists.
- `review_update_item_metadata(uuid,text,text)` exists.
- review functions use `search_path=public, pg_temp`.
- `authenticated` cannot execute `review_org_member_user_ids(uuid)` or `review_admin_user_ids()` directly.
- `strategy_call_bookings` no longer has the anon full-access policy.

## Written but NOT applied

Apply only after reviewing the current portal and the shared Hotelauto consumers.

| File | Risk | What it does |
|---|---|---|
| `20260824a_link_client_accounts_to_review_orgs.sql` | low | Adds a nullable FK from `client_onboarding_records` to `review_organizations`. Purely additive, but should be paired with tighter client-onboarding read policies before real client logins are created. |
| `20260824c_tighten_review_policies.sql` | medium | **Part 1 is already applied separately.** Remaining parts drop four admin direct-write policies that bypass RPC guards/audit history and add the missing draft filter to `review_messages`. Verify admin flows first. |

## Owner identity

The current Archer owner login (`devonavich0@gmail.com`) now also has a
`review_profiles` row with role `admin`, so `review_is_admin()` and the existing
review RPCs recognize the same owner account used by the CRM.
