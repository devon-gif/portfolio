# Hotel Pipeline OS — High-Volume, Approval-Based Outbound + Packages

**Goal:** ramp toward **200 approved cold emails/day** — safely and compliantly. Collect many *public* business emails from hotels, spas, restaurants, wedding/event venues, and hospitality groups, but only ever send to **qualified, compliant, approved** leads. **Build drafting + approval + compliance first. Sending integration comes later, only through approved batches.**

Migration: `supabase/migrations/20260607b_high_volume_packages_sending.sql` (builds on `20260607_lead_discovery_enrichment_layer.sql`).

---

## 1. Hard rules (enforced in code + DB)
- **No auto-send.** Drafts → compliance gate → approval queue → (later) approved batch send. Nothing leaves without Devon's approval.
- **Hunter is priority-only.** General leads use public emails from official websites/contact pages when available; Hunter only fires through the existing gate (priority ≥ `hunter_min_priority`, qualified lead type).
- **No LinkedIn scraping.** LinkedIn stays manual.
- **Every email** includes opt-out language + a physical address placeholder (`lib/compliance.ts`).
- **Suppression enforced** at the gate (suppression_list + opt-out/bounce flags).
- **Source URL logged for every email/contact** (`contacts.public_email_source_url`, `source_urls`).

---

## 2. Pricing / package logic

Stored in the new **`packages`** table (seeded), managed at `/pricing-packages`. Each package maps to lead/company types so the Proposal/Outreach skills can recommend the right one.

| Package | Category | Tier | Price |
|---|---|---|---|
| 3-Property Starter Pilot | hotel group | starter | $1,999/mo |
| 3-Property Growth Pilot | hotel group | growth | $2,999/mo |
| Hotel SEO Add-On (3 properties) | hotel group | addon | $1,499/mo |
| Hotel Creative + SEO Bundle | hotel group | bundle | $3,999–$4,499/mo |
| Spa Social Starter | spa | starter | $499/mo |
| Spa Social + SEO | spa | growth | $999/mo |
| Restaurant Social Starter | restaurant | starter | $399/mo |
| Restaurant Social + Local SEO | restaurant | growth | $699/mo |

**Recommendation logic (worker / Proposal Generator Skill):**
- Hotel management company / hospitality group / multi-property → hotel-group tiers; Starter Pilot for cold, Growth/Bundle once warm.
- Spa / wellness → spa tiers. Restaurant / F&B → restaurant tiers. SEO add-on/bundle only when they signal SEO/visibility need.
- Write the recommendation to `contacts.package_recommended` + `price_shown` + `pricing_tier` (and onto the queue item).

**Positioning (always):** cost savings + creative bandwidth, existing assets only, lower overhead than hiring full-time design/social/video/SEO, approval-based outreach. The **free 7-day / 5-asset trial stays available but is NOT auto-offered to every cold lead** — reserve it for warm/priority leads.

---

## 3. New CRM fields (where they live)
On **contacts** (and mirrored where relevant on outreach_queue/messages):
`package_recommended`, `price_shown`, `pricing_tier`, `public_email`, `public_email_source_url`, `email_collection_method` (website_contact_page | website_footer | website_team_page | public_directory | press_release | hunter | manual), `email_confidence`, `hunter_used`, `sending_inbox_id`, `send_batch_id`, `optout_included`, `address_included`, `compliance_status`, `landing_page_id`, `landing_page_visited`, `package_page_clicked`.

---

## 4. New pages
1. **`/pricing-packages`** — CRUD `packages`: name, price, tier, deliverables, category, which lead/company types they apply to, active toggle.
2. **`/lead-discovery`** — find public companies + **public emails from official websites/contact pages only**; show `public_email_source_url` + `email_collection_method`; Hunter button gated to priority leads. (Builds on `/discovery` from the prior layer.)
3. **`/approval-queue`** — review generated outreach before sending (this is the `approval_queue` view / `/outreach/approval`); approve/edit/reject/mark-sent/snooze; shows package + price + landing page + compliance + quality results.
4. **`/send-batches`** — plan send volume, batch size, sending inbox, status, send caps; shows ramp stage + bounce/complaint counts.
5. **`/suppression`** — exists; manage opt-outs, bounced emails, do-not-contact.
6. **`/landing-pages`** — manage package/offer pages, link to packages, track visits/clicks.

---

## 5. Send ramp logic
Stored in **`send_ramp_stages`** (seeded); `app_settings.active_ramp_stage_id` points to the current stage; `max_daily_send_cap` (default 200) is the absolute ceiling.

| Stage | Per day |
|---|---|
| Week 1–2 | 20–40 |
| Week 3–4 | 50–80 |
| Month 2 | 100–150 |
| Month 3+ | 150–200 **only if bounce/spam/complaint rates are safe** |

Ramp advancement is **manual + gated**: the app may *suggest* advancing only when `bounce_rate ≤ max_bounce_rate` (default 3%) and `complaint_rate ≤ max_complaint_rate` (default 0.10%) over recent batches. The orchestrator never sends above the active stage's `max_per_day` or `max_daily_send_cap`. Per-market caps (existing `app_settings.daily_send_limit_*`) still apply on top.

---

## 6. Compliance gate (v2) — before an email can be APPROVED
Extends `compliance_checks`. ALL must pass:
1. `email_exists_with_source` — email present AND has a source URL (`public_email_source_url` or Hunter).
2. `not_suppressed` — not in suppression_list; not opted-out/bounced.
3. `not_recently_contacted` — no contact in last `recontact_cooldown_days` (14).
4. `email_has_optout_and_address` — opt-out line + physical address placeholder present.
5. `no_fake_personalization` — no fabricated personal details; any inference flagged.
6. `not_deceptive_subject` — subject not misleading/clickbait/false.
7. `fit_score_ok` — company/category fit ≥ `min_fit_score_to_queue` (default 6).
8. `passed_quality_checklist` — passed the Archer quality checklist.
9. `linkedin_manual_only` — LinkedIn drafts flagged manual-send.
Result → `pass/fail` + `risk_flags[]` + `missing[]` + `recommended_fix`. Approve is disabled in the UI unless `compliance_status='pass'`.

---

## 7. Build order (drafting/approval/compliance first)
- **Phase A — packages + recommendation.** Run migration; build `/pricing-packages`; wire package recommendation into draft generation (writes package_recommended/price_shown/pricing_tier).
- **Phase B — public email collection.** `/lead-discovery` collects public emails from official contact/footer/team pages only; store method + source URL; Hunter stays gated.
- **Phase C — compliance gate v2 + approval queue.** Implement the 9 checks; `/approval-queue` blocks approval unless pass; show package/price/landing/compliance/quality.
- **Phase D — landing pages.** `/landing-pages`; attach a landing_page_id to drafts; (optional) visit/click tracking via redirect.
- **Phase E — send batches + ramp (planning only).** `/send-batches` to plan size/inbox/cap against the ramp stage; no sending yet.
- **Phase F — sending integration (last).** Only approved + compliant queue items, only within an approved batch, within ramp + market caps, via Resend (`/api/send-approved`). LinkedIn never auto-sends.

---

## 8. API route plan (additions)
```
/api/packages            GET/POST/PATCH/DELETE   manage packages
/api/packages/recommend  POST  given a contact/company → recommended package + price (writes fields)
/api/lead-discovery/emails POST  collect public emails (official site/contact pages) + source URL + method
/api/landing-pages       GET/POST/PATCH          manage landing pages
/api/landing-pages/click GET   redirect + increment click (for package_page_clicked)
/api/send-batches        GET/POST/PATCH          plan/track batches (no send)
/api/ramp/status         GET   active stage + whether advancing is safe (bounce/complaint rates)
/api/compliance/check    POST  run gate v2 (extends prior route)
-- Sending (Phase F only):
/api/send-approved       POST  send ONLY approved + compliance_status='pass' items in an approved batch, within caps
```

---

## 9. Codex checklist
**DB**
- [ ] Apply `20260607b_high_volume_packages_sending.sql`; confirm `packages` seeded (8 rows) and `send_ramp_stages` seeded (4 rows).
- [ ] Add `lib/types.ts` types for packages, sending_inboxes, send_ramp_stages, send_batches, landing_pages + new contact/message fields.

**Phase A**
- [ ] `/pricing-packages` CRUD UI + `/api/packages*`.
- [ ] `lib/recommend-package.ts` (category/lead-type → package) + `/api/packages/recommend`; write package_recommended/price_shown/pricing_tier on draft gen.

**Phase B**
- [ ] `/lead-discovery` collects public emails from official pages only; store `public_email`, `public_email_source_url`, `email_collection_method`; Hunter button gated (reuse hunter-gate).

**Phase C**
- [ ] Extend `lib/compliance-gate.ts` with the 9 v2 checks (deceptive subject, fake personalization, fit score, quality checklist); write `compliance_checks` + `compliance_status`.
- [ ] `/approval-queue` blocks approve unless `pass`; render package/price/landing/compliance/quality + source URLs.

**Phase D**
- [ ] `/landing-pages` + `/api/landing-pages*`; attach landing_page_id to drafts; optional click redirect → `package_page_clicked`.

**Phase E**
- [ ] `/send-batches` planning UI + `/api/send-batches*`; show ramp stage, caps, bounce/complaint counts; `/api/ramp/status`.

**Phase F (last)**
- [ ] `/api/send-approved` enforces: approved + compliance pass + inside an approved batch + within active ramp stage max + market caps + not suppressed + verified/high-confidence email. LinkedIn excluded.

**Guardrail tests**
- [ ] No send path runs for a non-approved or non-compliant item, or above the ramp/market cap.
- [ ] Email without opt-out + address is never marked compliant.
- [ ] Suppressed/opted-out/bounced emails never queue or send.
- [ ] Every collected email has a source URL + collection method.
- [ ] Hunter only fires through the gate; `hunter_used` set truthfully.

---

*Additive and backwards-compatible: existing companies, contacts, research, outreach, and compliance flows keep working. The free 7-day/5-asset trial remains a manual, warm-lead tool — not a cold-blast default.*
