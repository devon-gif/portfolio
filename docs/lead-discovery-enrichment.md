# Hotel Pipeline OS — Lead Discovery + Enrichment Layer

**Goal:** turn the manual paste-a-lead CRM into a mostly-autopilot system that ethically discovers, enriches, finds contacts for, scores, and drafts outreach to hotel / hospitality-group / restaurant / spa / wedding-event / hotel-management-company leads — and drops them in an **approval queue**. The app drafts only. **Nothing is ever sent without Devon's approval.**

Migration for this layer: `supabase/migrations/20260607_lead_discovery_enrichment_layer.sql`.

---

## 0. What already exists (reuse, don't rebuild)

The repo already implements much of the pipeline. This layer extends it.

| Need | Already in repo | This layer adds |
|---|---|---|
| Website enrichment | `research_runs`, `research_sources`, `lib/research-run.ts`, `lib/research-extract.ts`, `/api/research/run`, `/api/research-company` | exposes `enrichment_runs` view; provenance via `source_urls` |
| Contact discovery | `contact_candidates`, `/candidates`, `/contact-candidates` | `contact_enrichment` view; `hunter_lookups` audit; `is_inference` |
| Hunter | `lib/hunter.ts`, `/api/hunter/{domain-search,find-email,verify-email}` | `hunter_lookups` audit + gating settings |
| Approval/sending | `outreach_queue`, `messages`, `lib/send-core.ts`, `/api/send-approved`, `/daily`, `/outreach` | approval-queue fields + `/outreach/approval` UI + `approval_queue` view |
| Compliance footer | `lib/compliance.ts` (CAN-SPAM unsubscribe + address) | pre-queue `compliance_checks` gate |
| Suppression | `suppression_list`, `/suppression`, `/unsubscribe/[token]` | wired into the gate |
| Scoring | `lib/scoring.ts` | discovery/job-signal scoring reused + extended |
| Send limits | per-market caps in `app_settings` | discovery/enrich/hunter daily caps |

**New tables:** `lead_sources`, `discovered_companies`, `job_signals`, `hunter_lookups`, `compliance_checks`, `source_urls`.
**New views (spec aliases):** `enrichment_runs` → research_runs, `contact_enrichment` → contact_candidates, `approval_queue` → outreach_queue+joins.

---

## 1. Product requirements

### Modules
1. **Lead Discovery Worker** — runs saved searches (`lead_sources`) against public web/search, writes `discovered_companies` with `source_url`, category, verticals, confidence, recommended next step. Respects `daily_limit` + `discovery_daily_limit`.
2. **Public Website Enrichment Worker** — for a discovered/known company, scrapes the public site (existing Firecrawl flow), produces a structured brief feeding the **Hospitality Lead Researcher** Skill; logs every fact to `source_urls`.
3. **Job Signal Worker** — searches public job posts for hospitality marketing/creative roles → `job_signals` with the contract-alternative angle.
4. **Contact Finder Worker** — public pages first (leadership/team/press/site/search snippets) → `contact_candidates`; **Hunter only when gated** (see §6) → `hunter_lookups`.
5. **Compliance Gate** — before anything enters the approval queue, runs the checklist → `compliance_checks` (pass/fail + missing + fix).
6. **Daily Research Queue** — orchestrates the daily run (discover 20–40 → enrich top 10 → contacts top 5–10 → Hunter top 3–5 → draft 5–10) and shows the approval queue. Sends nothing.
7. **Approval Queue UI** — `/outreach/approval` with approve / edit / reject / mark-sent / snooze.

### Non-negotiable product rules
- Drafts only. No auto-send of email, LinkedIn DMs, or connection requests.
- **No LinkedIn scraping/automation.** LinkedIn is manual-send only; LinkedIn drafts are flagged `manual_only`.
- Use only public sources + approved APIs (Firecrawl, Google CSE, Hunter). Respect robots.txt / site terms.
- Hunter only for high-priority, qualified leads (§6).
- Never contact suppressed/opted-out emails. Never contact unverified emails.
- Every company/contact fact stores its `source_url`; inferences are flagged `is_inference`.
- No invented facts, titles, properties, or emails.

---

## 2. Database schema (summary)

Full DDL in the migration. Key shapes:

- **lead_sources**(label, source_type, query, target_market, company_category, geography, keywords[], daily_limit, is_active, respect_robots, last_run_at, last_run_count)
- **discovered_companies**(lead_source_id, company_id?, name, website, **source_url**, company_category, fit_reason, possible_property_count, verticals[], confidence_score, **is_inference**, recommended_next_step, status, dedupe_key)
- **job_signals**(company_id?, company_name, job_title, **job_post_url**, job_platform, role_summary, keywords[], why_buying_signal, likely_decision_maker, contract_alternative_angle, suggested_offer, priority_score, status)
- **hunter_lookups**(company_id?, contact_candidate_id?, endpoint, **gate_priority_score, gate_lead_type, gate_reason**, domain, full_name, email, verification_status, confidence_score, raw_result, enrichment_date)
- **source_urls**(entity_type, entity_id, field, fact_value, url, excerpt, **is_inference**, confidence) — constraint: `url IS NOT NULL OR is_inference = true`
- **compliance_checks**(contact_id, outreach_queue_id?, result, + one boolean per gate check, risk_flags[], missing[], recommended_fix)
- **Extended companies**: discovered_company_id, lead_source_id, source, verticals[], confidence_score
- **Extended contacts**: email_verification_status, email_confidence, email_source_url, hunter_lookup_id, enrichment_date
- **Extended outreach_queue** (the approval queue): company_id, lead_type, priority_score, best_angle, suggested_offer, quality_result(jsonb), compliance_check_id, compliance_status, follow_up_date, snoozed_until, rejected_reason, source_count; status now includes `needs_review|rejected|snoozed`
- **Extended app_settings**: discovery_daily_limit, enrich_daily_limit, hunter_daily_limit, hunter_min_priority (default 7), recontact_cooldown_days (default 14)

---

## 3. API route plan

Follow existing conventions (`app/api/.../route.ts`, server-side, service role via `lib/supabase-admin.ts`). All are POST unless noted. **None of these send.**

```
/api/discovery/run            POST  run Lead Discovery Worker for active lead_sources (respects daily_limit)
/api/discovery/sources        GET/POST/PATCH  manage lead_sources (saved searches)
/api/discovery/promote        POST  discovered_company → companies (status=promoted)
/api/discovery/reject         POST  mark discovered_company rejected

/api/enrich/run               POST  Public Website Enrichment Worker for a company_id  (wraps existing research-run)
                                    → writes research_runs + source_urls

/api/job-signals/run          POST  Job Signal Worker over configured role searches → job_signals
/api/job-signals/queue        POST  turn a job_signal into a contact_candidate / draft (contract-alternative)

/api/contacts/find            POST  Contact Finder Worker (public pages first) → contact_candidates
/api/contacts/hunter          POST  GATED Hunter call → hunter_lookups (refuses if gate fails; logs gate_reason)

/api/compliance/check         POST  run Compliance Gate for a contact/draft → compliance_checks
/api/outreach/draft           POST  generate linkedin_draft + email_draft via Outreach Writer Skill → outreach_queue (status=needs_review)

/api/approval/list            GET   approval_queue rows (filters: status, priority, market)
/api/approval/approve         POST  status=approved (only if compliance_status=pass)
/api/approval/edit            POST  edit drafts; re-run quality + compliance
/api/approval/reject          POST  status=rejected (+rejected_reason)
/api/approval/mark-sent       POST  status=sent + write messages row + set contacts.last_contacted_at (manual-send confirmation)
/api/approval/snooze          POST  status=snoozed + snoozed_until

/api/daily/run                POST  Daily Research Queue orchestrator (discover→enrich→contacts→hunter→draft, all gated)
```

Reuse existing send routes (`/api/send-approved`, `/api/send-due`) for **email only**, and only for queue items already `approved` + `compliance_status=pass`. LinkedIn never auto-sends — `mark-sent` is a manual confirmation.

---

## 4. UI page plan

Reuse existing pages; add one.

- **`/discovery`** (new) — saved searches (lead_sources) + “Run discovery” + `discovered_companies` table (promote/reject, confidence, source link).
- **`/companies`** (exists) — add enrichment status, verticals, confidence, “Enrich” button.
- **`/candidates` + `/contact-candidates`** (exist) — show source_url, email_status, confidence, Hunter gate state, is_inference badge.
- **`/job-signals`** (new, or a tab on /daily) — job_signals list with contract-alternative angle + “Queue draft”.
- **`/outreach/approval`** (new) — the approval queue. Columns: company, contact, role, lead type, priority, **source URLs**, best angle, suggested offer, LinkedIn draft, email draft, quality checklist result, compliance result. Buttons: **Approve, Edit, Reject, Mark Sent, Snooze**. Follow-up date picker. Approve disabled unless `compliance_status = pass`. LinkedIn drafts show a “copy + send manually” affordance (never an auto-send).
- **`/daily`** (exists) — add the discovery→enrich→contacts→hunter→draft summary + counts vs daily caps.
- **`/settings`** (exists) — add discovery/enrich/hunter daily caps, hunter_min_priority, recontact_cooldown_days.

---

## 5. Worker / job design

Each worker is a server route + a `lib/<worker>.ts` module (mirrors `lib/research-run.ts`). Idempotent, rate-limited by `app_settings` caps, and writes provenance to `source_urls`.

- **Discovery Worker** — for each active `lead_sources` row: run query via Google CSE / Firecrawl search (existing test routes show the integration). For each result, dedupe by normalized domain (`dedupe_key`), classify category + verticals (flag `is_inference` when classification is inferred), score confidence, write `discovered_companies` with `source_url`. Stop at `daily_limit`/`discovery_daily_limit`.
- **Enrichment Worker** — wraps existing Firecrawl research flow; respects robots.txt; extracts summary, properties, F&B/spa/event mentions, leadership/team, contact/careers pages, **verbatim phrases**; writes each extracted fact to `source_urls` (with excerpt). Output structured brief → feeds Hospitality Lead Researcher Skill.
- **Job Signal Worker** — query public job boards + company career pages for the role list; write `job_signals` with `job_post_url`, keywords, why-it's-a-signal, likely decision-maker, contract-alternative angle. **No LinkedIn scraping** — LinkedIn job leads are entered manually.
- **Contact Finder Worker** — parse public leadership/team/press/contact pages + search snippets for target roles (VP Marketing, Director of Sales & Marketing, GM, Owner, Director of F&B/Events, etc.). Only after exhausting public sources, and only if the Hunter gate passes, call Hunter.
- **Daily orchestrator** — sequences the above with the per-stage caps; ends by generating 5–10 drafts into `outreach_queue` at `needs_review`, each having passed the compliance gate. Sends nothing.

---

## 6. Compliance rules + Hunter gate

### Pre-queue Compliance Gate (writes `compliance_checks`)
A draft may enter the approval queue only if ALL pass:
1. `not_suppressed` — contact email not in `suppression_list` and `contacts.email_opt_out=false`, `opted_out=false`.
2. `not_recently_contacted` — `last_contacted_at` older than `recontact_cooldown_days` (default 14).
3. `email_verified_or_high_conf` — email verified (Hunter `verified`) or high confidence; else email channel disabled.
4. `has_source_urls` — ≥1 `source_urls` row backing the lead's facts.
5. `no_invented_fields` — every asserted fact has a source OR `is_inference=true`.
6. `has_specific_detail` — ≥1 real personalization detail captured.
7. `email_has_optout_and_address` — email draft includes opt-out line + physical address (via `lib/compliance.ts`).
8. `linkedin_manual_only` — LinkedIn draft flagged manual-send.
9. `allowed_contact_source` — source ∈ {company website, public career page, press release, public search, approved API}. LinkedIn-scraped = fail.

Output: `result` pass/fail, `risk_flags[]`, `missing[]`, `recommended_fix`.

### Hunter gate (before any `/api/contacts/hunter` call → `hunter_lookups`)
Run Hunter only when ALL true:
- company `priority_score >= app_settings.hunter_min_priority` (default 7)
- lead type ∈ {direct buyer, hiring signal, partner/referral}
- a likely contact name AND a domain exist
- no suppressed/opted-out record for that email/domain
- under `hunter_daily_limit`
Always record `gate_priority_score`, `gate_lead_type`, `gate_reason`. Use Domain Search → Email Finder → Email Verifier, store verification + confidence.

### Automation boundaries
**May auto:** search public sources, enrich companies, score, draft messages, prepare follow-up reminders, update pre-send CRM statuses.
**May NOT auto:** send cold email, send LinkedIn messages/connection requests, scrape LinkedIn, ignore opt-outs, contact unverified emails.

---

## 7. Approval workflow

```
discovered_company → (promote) → companies
   → enrich (research_runs + source_urls)
   → Lead Researcher Skill → brief
   → Lead Classifier Skill → lead_type
   → Contact Finder (+gated Hunter) → contact_candidates → (promote) → contacts
   → Outreach Writer Skill → outreach_queue (needs_review)
   → Compliance Gate → compliance_checks (pass/fail)
   → /outreach/approval:
        approve  → status=approved (email may then go to /api/send-approved)
        edit     → re-run quality + compliance
        reject   → status=rejected (+reason)
        mark sent→ status=sent + messages row + last_contacted_at  (manual LinkedIn/email confirm)
        snooze   → status=snoozed (+snoozed_until)
```
A queue item cannot be approved unless `compliance_status = pass`. LinkedIn is always manual-send.

---

## 8. MVP build order

- **Phase 1** — manual web-search import + enrichment fields + approval queue.
  Run migration. Build `/discovery` (manual add of `discovered_companies` with source_url) + `/outreach/approval` reading `approval_queue`. Wire Compliance Gate. Ship approve/edit/reject/mark-sent/snooze.
- **Phase 2** — Public Website Enrichment Worker. Wire `/api/enrich/run` to existing Firecrawl flow; write `source_urls`; feed Lead Researcher Skill.
- **Phase 3** — Hunter integration for qualified leads. `/api/contacts/hunter` + gate + `hunter_lookups`; settings for caps + min priority.
- **Phase 4** — Job Signal discovery. `/api/job-signals/run` + `job_signals` + `/job-signals` UI + contract-alternative draft.
- **Phase 5** — Daily Research Queue orchestrator `/api/daily/run` with per-stage caps; surface on `/daily`.
- **Phase 6** — optional Resend for **approved email only** (reuse `/api/send-approved`); LinkedIn stays manual.

---

## 9. Implementation checklist for Codex

> Repo is a non-standard Next.js (see `AGENTS.md`): read `node_modules/next/dist/docs/` before writing route/page code. Use `lib/supabase-admin.ts` (service role) in API routes; mirror existing route/page style.

**DB**
- [ ] Apply `supabase/migrations/20260607_lead_discovery_enrichment_layer.sql` in Supabase.
- [ ] Confirm views `enrichment_runs`, `contact_enrichment`, `approval_queue` resolve.
- [ ] Add types to `lib/types.ts` for the 6 new tables + extended fields.

**Phase 1**
- [ ] `/discovery` page: list/add/edit `lead_sources`; table of `discovered_companies` (promote/reject); show `source_url`, confidence, verticals, `is_inference` badge.
- [ ] `/api/discovery/sources` (CRUD), `/api/discovery/promote`, `/api/discovery/reject`.
- [ ] `lib/compliance-gate.ts`: implement the 9 checks → write `compliance_checks`; expose `runComplianceGate(contactId, queueId)`.
- [ ] `/outreach/approval` page reading `approval_queue`; buttons approve/edit/reject/mark-sent/snooze; approve disabled unless `compliance_status='pass'`; render source URLs + quality + compliance results.
- [ ] `/api/approval/*` routes (list, approve, edit, reject, mark-sent, snooze).
- [ ] `/api/outreach/draft`: build drafts (Outreach Writer Skill prompt) → `outreach_queue` (needs_review) + `source_count`.

**Phase 2**
- [ ] `lib/enrich-run.ts` wrapping existing Firecrawl research; write `source_urls` per fact (with excerpt + is_inference).
- [ ] `/api/enrich/run`; “Enrich” button on `/companies`.

**Phase 3**
- [ ] `lib/hunter-gate.ts` implementing the Hunter gate; `/api/contacts/hunter` refuses + logs `gate_reason` when gate fails; writes `hunter_lookups`.
- [ ] Settings UI: `hunter_daily_limit`, `hunter_min_priority`, `discovery_daily_limit`, `enrich_daily_limit`, `recontact_cooldown_days`.

**Phase 4**
- [ ] `lib/job-signals.ts` + `/api/job-signals/run` (public boards/career pages only, no LinkedIn scraping) → `job_signals`.
- [ ] `/job-signals` UI + “Queue draft” (contract-alternative angle).

**Phase 5**
- [ ] `lib/daily-orchestrator.ts` + `/api/daily/run` enforcing per-stage caps; counts surfaced on `/daily`.

**Phase 6 (optional)**
- [ ] Confirm `/api/send-approved` only sends email for `approved` + `compliance_status='pass'`; never touches LinkedIn.

**Guardrails to assert in code (write tests)**
- [ ] No route sends email/LinkedIn without an explicit approved+compliant queue item.
- [ ] Hunter refuses unless gate passes; every call logged with `gate_reason`.
- [ ] Suppressed / opted-out / unverified emails are never queued for email.
- [ ] Every discovered_company and job_signal has a non-null source URL.
- [ ] LinkedIn drafts are always `manual_only`.

---

*Built specifically for Archer Design + Hotel Pipeline OS. This layer is additive: existing companies, contacts, research, sending, and compliance flows keep working unchanged.*
