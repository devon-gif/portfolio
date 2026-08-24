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
current schema produces a badly wrong picture of the security posture — they
suggest the database is wide open when it is not.

## What the live database actually contains

35 tables. The ones this app uses:

- `client_onboarding_records`, `client_onboarding_tasks`, `client_intake_responses`
  — the CRM/billing side.
- `review_organizations`, `review_properties`, `review_profiles`,
  `review_memberships`, `review_items`, `review_versions`, `review_actions`,
  `review_messages`, `review_notification_events` — the creative-review side,
  with membership-scoped RLS and `SECURITY DEFINER` write functions.

Anon access was checked table by table by counting rows visible to the public
key: every table with data returns **zero** rows to anon, except
`strategy_call_bookings` (5 rows) — closed by `20260824c`.

## Already applied, tracked here for the record

| File | Status |
|---|---|
| `20260723_review_portal_platform.sql` | **Already applied** to Hotelauto. Copied from `hotel-pipeline-os@review-os-multiclient`. Creates the review schema, RLS, and RPCs. |
| `20260728_review_portal_hardening.sql` | **Already applied.** Adds `review_participants`, tightens the decide/submit state machines, adds org↔property coherence. |

Do not re-run these. They are here so this branch has a record of the schema it
depends on.

## Written but NOT applied

Apply in order, and read each header first — every one explains what it changes
and carries its own rollback.

| File | Risk | What it does |
|---|---|---|
| `20260824a_link_client_accounts_to_review_orgs.sql` | none | Adds a nullable FK from `client_onboarding_records` to `review_organizations`. Purely additive. |
| `20260824b_harden_review_functions.sql` | low | Adds `pg_temp` to every `SECURITY DEFINER` search path (fixes an admin-escalation vector), and revokes two helper functions from `authenticated` (fixes cross-tenant member enumeration). No signature or behaviour change. |
| `20260824c_tighten_review_policies.sql` | medium | Closes anon access on `strategy_call_bookings`, drops four admin direct-write policies that bypass the RPC guards and the audit trail, and adds the missing draft filter to `review_messages`. Part 2 is the one worth checking against your admin flows first. |

`20260824b` is the most important and the safest. If you only apply one, apply
that one.
