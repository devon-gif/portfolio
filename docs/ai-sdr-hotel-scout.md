# Archer Design Hotel AI SDR

This adds a focused prospecting layer to the existing Hotel Pipeline OS. It does **not** create a second CRM and it does **not** auto-send cold email.

## What it does

On a manual run or weekday schedule, the scout:

1. Searches public web sources for reachable U.S. hotel management companies, boutique hotel groups, independent hospitality groups, and resort operators.
2. Intentionally filters out major enterprise hotel-brand domains and common aggregators/social/job-board domains.
3. Saves new results to `discovered_companies` with source URLs and confidence scores.
4. Promotes only high-confidence prospects into the existing `companies` table.
5. Reuses the existing Firecrawl `runResearch()` workflow to research the public company website and discover named decision-makers.
6. Can optionally use Hunter for a small number of high-confidence named buyers. This is OFF by default because it consumes credits.
7. Promotes usable contacts into the existing `contacts` table.
8. Creates a personalized email in the existing `messages` table with status `draft`.
9. Leaves approval, scheduling, suppression, unsubscribe handling, and sending to the existing Hotel Pipeline workflow.

**The AI SDR never approves, schedules, or sends a cold email itself.**

## New pieces

- `/ai-sdr` — owner-only control dashboard
- `/api/ai-sdr/scout` — secure manual/cron orchestrator
- `lib/ai-sdr.ts` — discovery → research → contact → draft workflow
- `ai_sdr_runs` — run/audit history
- Weekday Vercel cron at `13:15 UTC`
- AI SDR settings added to `app_settings`

## Database setup

The AI SDR builds on the existing lead-discovery layer. The Hotel Pipeline database should have these migrations applied in order:

1. `supabase/migrations/20260607_lead_discovery_enrichment_layer.sql`
2. `supabase/migrations/20260923_ai_sdr_controls.sql`

The second migration defaults to:

- AI SDR disabled
- auto-promote on
- auto-Hunter off
- auto-draft on
- 10 prospects/run
- 5 enrichments/run
- 70 minimum confidence
- Calendly: `https://calendly.com/devonavich0/30min`

Nothing begins prospecting until AI SDR is explicitly enabled.

## Environment requirements

The deployed `portfolio` Vercel project needs:

### Required for scheduled runs
- `SUPABASE_SERVICE_ROLE_KEY`
- existing Supabase URL/public configuration used by Hotel Pipeline
- `CRON_SECRET`

### Discovery (at least one path)
Preferred:
- `FIRECRAWL_API_KEY`

Fallback:
- `GOOGLE_SEARCH_API_KEY`
- `GOOGLE_CSE_ID`

### Optional enrichment
- `HUNTER_API_KEY` — only used if **Use Hunter for top decision-makers** is enabled
- `OPENAI_API_KEY` — generates tighter personalized drafts; without it, the scout uses a conservative deterministic draft template
- `AI_SDR_MODEL` — optional model override; defaults to `gpt-5-nano`

Existing Resend/send settings are unchanged. The scout only writes drafts.

## Security

`/api/ai-sdr/scout` is not public.

It accepts either:

- Vercel Cron's `Authorization: Bearer <CRON_SECRET>`, or
- a valid Supabase access token for the single CRM owner email.

The page itself remains behind the existing `OwnerAuthGuard`.

## Cost controls

Hunter is disabled by default. Turn it on only after confirming the public-source workflow is finding the right companies and named decision-makers.

Start with:

- 10 prospects/run
- 5 enrichments/run
- Hunter OFF
- drafts ON

Review a few runs before increasing volume.

## Current scheduling model

The first version books meetings by including Devon's Calendly link in qualified drafts. This gets the full outbound loop to:

**prospect → research → contact → personalized draft → Devon approval → send → Calendly meeting**

A later phase can add inbound-reply classification and direct Google Calendar negotiation, but that requires an inbound mailbox/webhook integration and should be added only after the prospecting loop proves it can produce replies.

## Validation checklist

Before enabling:

- [ ] Lead discovery migration is present
- [ ] AI SDR controls migration is present
- [ ] `/ai-sdr` loads without migration warnings
- [ ] Firecrawl or Google Search/CSE shows configured in existing Settings diagnostics
- [ ] `CRON_SECRET` exists in Vercel
- [ ] Run manually once with Hunter OFF
- [ ] Confirm discoveries are relevant independent/regional hotel operators
- [ ] Confirm named contacts have public source evidence
- [ ] Confirm generated messages are `draft`, never `approved` or `sent`
- [ ] Review drafts in the existing Command Center
- [ ] Only then consider enabling Hunter for top prospects

## Intentional boundaries

- No LinkedIn scraping or auto-DMs
- No guessed emails
- No automatic cold-email sending
- No contact of suppressed/opted-out records
- No claims based on private analytics
- No invented buying signals
- No automatic spending on Hunter unless the toggle is enabled
