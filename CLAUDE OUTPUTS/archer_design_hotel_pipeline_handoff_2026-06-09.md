# Archer Design / Hotel Pipeline OS — Handoff & Execution Plan
**Date: 2026-06-09** · Written after a full repo + project-file read. Built vs. planned is explicitly separated throughout.

---

## 1. Current Project Summary

**Archer Design** is Devon Archer's solo hospitality creative service. It turns a property's *existing* assets (photos, menus, event details, brand files) into polished, ready-to-post creative: social graphics, short-form motion, F&B/event promos, spa/wellness campaigns, and optional local SEO support. Devon is an outside creative partner — not an agency, not a freelancer marketplace.

**Who it serves:** hotels (especially select-service flags: Hampton, Indigo, HGI, Courtyard), independent/boutique hotels, resorts, restaurants/F&B groups, spas/wellness, wedding/event venues, and — the priority — multi-property hospitality groups and management companies.

**Current offer:** 6-month retainer as the main product, 1-month paid pilot as on-ramp, free 7-day/5-asset trial as the front door for warm/priority direct buyers (per pricing notes: do NOT auto-offer the trial to every cold lead). Live pricing (set 2026-06): Hotel Creative System $1,999/mo (up to 3 properties), SEO Add-On +$1,499, Bundle $3,999; Spa $499/$999; Restaurant $399/$699; 5+ properties quote-based. Partner model: recurring % for life of contract (% unconfirmed placeholder).

**Proof:** Revest Properties (western PA group) — Hotel Indigo Pittsburgh University-Oakland, Eliza Hot Metal Bistro, Hampton Inn Greensburg, Hampton Inn Johnstown, plus spa/wellness (Elements). Stats: 13.9M+ impressions, 543K+ engagements, 3.6M+ reach, 11K+ organic shares, 2.4K+ assets deployed, 700% engagement growth.

**Business goal:** $35K/month personal income within 12 months via multi-property clients — land 2–5 property pilots, expand to 10/20/40+ property systems. Math check: at current pricing that's roughly 9–18 hotel-group accounts ($1,999–$3,999/mo) or fewer larger custom group deals. The custom 5+ property tier is where $35K/mo actually lives — pilots are the wedge, not the destination.

---

## 2. Current Positioning

1. **"Your hotel group's creative team, without the $90K hire."** — Use for direct buyers at management companies/groups, and on the website. It names the buyer (group), the function (creative team), and the anchor (loaded hire cost). Strongest line for email subject lines and proposals.
2. **"Luxury hospitality creative, without adding headcount."** — Use for boutique/lifestyle brands and upscale independents where "luxury" signals fit and "$90K" feels off-brand. Also right for the website hero.
3. **"More finished content every month, from the assets you already have."** — Use in first LinkedIn DMs and conversations. It's concrete, non-salesy, and survives the "we have no budget" reflex because it's about output, not spend. Lead with this; escalate to line 1 once cost comes up.

Rule from files (don't relitigate): cost framing is "without adding headcount" / "lower overhead" — never "cheap."

---

## 3. Current Website Assessment (archerdesign.shop — repo app/)

The marketing site lives inside this repo (Next.js, public routes via `AppChrome` whitelist). As of 2026-06-09 it includes: homepage, /contact, /packages, /case-studies, and 5 SEO landing pages (/hotel-social-media-management, /hotel-video-marketing, /hospitality-creative-support, /hotel-restaurant-event-promos, /hotel-marketing-cost-savings), plus sitemap.ts, robots.ts, full OG/Twitter metadata, and JSON-LD (Organization, Service, FAQPage, VideoObject). `npm run build` passes (33 routes).

**Working:**
- Clear positioning + savings calculator + free-trial CTA path on homepage.
- Real client logos (Hampton, Indigo Pittsburgh, Eliza, Elements) and real aggregate stats.
- SEO foundation is now solid: landing pages with 1,000+ words, FAQ schema, internal linking, robots blocking the CRM.
- /case-studies covers the three named clients honestly (no invented per-client numbers).

**Fix (ordered):**
1. **Logo filename**: the brand logo is `/ChatGPT Image Jun 7, 2026, 04_28_24 PM.png` — referenced in ~6 files and used as the Organization JSON-LD logo. Rename to `/archer-logo.png`, update references (and Eliza's logo is `Untitled.png` — same problem). Cosmetic but a real credibility/fragility issue if anyone inspects, and AI-named logo file is a bad look for a creative studio.
2. **Two web presences**: outreach templates and objection responses all point to `devonarcher.framer.website`, while the real site is `archerdesign.shop`. Pick one canonical (archerdesign.shop, presumably), 301/redirect or retire the Framer site, and update every template + `ABOUT ME` file.
3. **Cost-anchor inconsistency**: site copy says a hire costs "$90K–$180K/yr loaded"; `package-pricing-notes.md` says "$70K–$110K+"; positioning line says "$90K hire." Pick one range (recommend $90K–$180K for groups, since it includes senior/manager roles) and align files + site.
4. **Stats inconsistency**: outreach uses 11K+ shares and 2.4K+ assets deployed; the site uses only impressions/engagements/reach. Either add them to MetricsStrip or drop them from outreach — one proof set everywhere.
5. **Open TODOs in code**: commitment-terms FAQ answer is vague ("ask us"), MetricsStrip start year unconfirmed, VideoObject `uploadDate` is a 2026-01-01 placeholder.
6. **Missing sections (next, not urgent)**: a real OG image (branded 1200×630 instead of a gallery photo), named testimonials with faces/titles (ValueQuoteRow quotes exist but anonymous attribution is weaker), Revest Properties logo (TODO already in ClientLogoStrip), an /about page with Devon's face — buyers of $2–4K/mo retainers want to see the human.

**Urgent credibility problems:** none fatal. The site supports the pitch today. Items 1–3 are the ones a sharp DOSM might notice.

---

## 4. Current Outreach Strategy

**Universal rules (from your updated logic + voice files):** no hard pitch in DM #1, no price in DM #1, no portfolio dump, no website link unless asked. First DM = short, natural, question-led, with one specific observation. 3–6 sentences. End with a low-friction question, not a CTA.

**Direct buyer sequence:**
1. Connect (no note, or 1-line note referencing something real).
2. Post-accept DM: specific observation → one-line what-you-do → bandwidth question ("do you handle creative in-house or is that on whoever has a spare hour?").
3. If reply: 2–3 *relevant* examples (match their category), then offer trial only if warm/priority.
4. If no reply: one bump at day 4–6 (add a thought, never "just checking in"), one final value-add at day 12–14, then Nurture.

**Partner/referral sequence:** lead with their client base, not your service. "Your clients probably need X but won't hire for it" → recurring-cut offer → quick call. Vetting questions live in `partner-offer.md`. Partners: consultants, task-force pros, recruiters, hospitality photographers, PR/agencies without creative.

**Hiring-signal sequence:** see job posting for marketing/social/creative role → message recruiter/hiring manager with the contract-alternative frame ("whatever you decide on the hire, flexible outside support without the headcount cost — could cover the gap or run alongside"). Never disparage hiring. `/hiring-signals` page + `job_signals` table + Job Signal Hijack Skill already exist for this.

**What not to do:** no LinkedIn automation/scraping (hard rule, enforced in compliance gate), no fake urgency, no triple follow-ups, no stats dump in DM #1, no leading with the trial to cold leads, no "I hope this finds you well."

**What DM #1 should sound like:**
> "Hey [Name] — was looking at [Property]'s page, the [specific thing] is great. Noticed the posting's been quiet since [month] though. Quick question — do you have creative in-house, or does social land on whoever has time that week?"

**What follow-ups should do:** add something (an observation, an example matched to their category, a relevant idea for their next season) — never just re-ask. Route per `objection-responses.md`: "pass to marketing" → right-person ask + samples offer; "have a team" → overflow positioning → Nurture; "what's it cost" → under-a-part-time-hire frame → pivot to seeing the work first.

---

## 5. Top Target Segments (ranked)

1. **Multi-property hotel management groups (5–40 properties)** — BEST. One deal = many properties = path to $35K/mo. They feel the creative bottleneck at scale and already think in cost-per-property terms. Slow buying cycle is the only downside; the 3-property pilot ($1,999–$2,999) de-risks it for them.
2. **Boutique/lifestyle groups (2–8 properties)** — Great fit for the "luxury creative" line; high brand standards, no in-house designer, faster decisions than big management companies. Smaller ceiling per account.
3. **Job-signal accounts (any segment, hiring marketing/creative)** — Highest intent signal that exists: they've budgeted for the function. Contract-alternative angle converts budget into retainer. Volume is limited by posting flow; work every one that appears.
4. **Referral partners (consultants, task-force, recruiters, photographers)** — Not revenue themselves but the cheapest multi-property pipeline. One active partner can outproduce a month of cold DMs. Needs the commission % finally confirmed (open decision #2 below).
5. **F&B-heavy hotel groups / restaurant groups** — Good: constant content need (menus, specials, events), fast yes at $399–$699. Bad: small tickets — only worth it when one group covers many outlets, or as a wedge into a hotel parent (Eliza → Indigo is your own proof of this motion).
6. **Wedding/event venues** — Good seasonal urgency (booking-season promos), decent budgets, visual product. One-venue deals are small; venue *groups*/caterers with multiple rooms are the version worth chasing.
7. **Spas/wellness** — Easiest sell aesthetically, lowest price point ($499–$999). Fine as add-ons inside hotel deals (Elements model); don't spend prime outreach hours on standalone spas.
8. **Major brands/non-buyers (Hilton/IHG corporate etc.)** — Not buyers. Only useful for routing ("who handles creative for your managed properties in X market?") and credibility connections. Minimal time.

---

## 6. Philadelphia Outreach Plan

Why Philly works: dense hotel + restaurant market, heavy management-company presence, drivable from western PA ("I'm in PA, I work with Pittsburgh properties" is a local story, not a cold one).

**Company types to target (in order):** hotel management companies HQ'd in/around Philly · boutique/lifestyle hotel operators · restaurant groups with hotel ties · wedding/event venue + catering groups · independent boutique hotels in Center City/Fishtown/Old City.

**Likely companies:** your project files contain no Philly-specific lead list (`lead-research-notes.md` is empty — flagged). From general knowledge, verify before outreach: **HHM Hotels** (major management co, Philadelphia HQ), **PM Hotel Group** (Philly-area HQ), **Method Co** (ROOST Apartment Hotels, Wm. Mulherin's Sons — boutique + F&B, exactly your aesthetic), **Hersha Hospitality Trust**-affiliated operators, **FCM Hospitality** (venues/restaurants), **Schulson Collective**, **Starr Restaurants**, **Garces Group** (F&B groups), **Cescaphe** and **Finley Catering** (wedding venue groups). Treat these as research seeds, not facts — run each through the Lead Researcher Skill first.

**Titles to search:** Director of Sales & Marketing (DOSM) · Area/Regional Director of Marketing · VP Marketing · Director of Marketing · Corporate Director of Sales · Marketing Manager (hotel) · General Manager (boutique) · Director of Brand/Creative · Owner/Principal (management co) · Director of Events/Catering Sales.

**First 20 LinkedIn search queries:**
1. "director of sales and marketing" hotel Philadelphia
2. "hotel management company" Philadelphia
3. "area director of marketing" hotels Philadelphia
4. "vp marketing" hospitality Philadelphia
5. "marketing manager" hotel Philadelphia
6. "general manager" boutique hotel Philadelphia
7. "director of marketing" restaurant group Philadelphia
8. "hospitality group" marketing Philadelphia
9. HHM Hotels marketing
10. PM Hotel Group marketing
11. Method Co marketing OR brand
12. "director of events" venue Philadelphia
13. "catering sales" Philadelphia wedding
14. "corporate director of sales" hotels Pennsylvania
15. "multi-property" marketing hotels Pennsylvania
16. hotel "social media manager" Philadelphia (job posts → hiring signals)
17. "marketing coordinator" hotel Philadelphia (find the overworked person → their boss)
18. hospitality consultant Philadelphia (partners)
19. hotel photographer Philadelphia (partners)
20. "task force" hotel sales marketing Pennsylvania (partners)

**Message angle:** local-ish proof first — "I do creative for a few PA hotels (Indigo Pittsburgh, some Hamptons)" — then the bandwidth question. For management companies, ask the multi-property version: "do your properties share a creative resource, or does each one fend for itself?"

**Track in CRM (existing fields):** Lead status flow New → Researched → Contacted → Engaged…; lead type; company category; priority 1–10; best angle; suggested offer; follow-up date; source = LinkedIn; tag `philadelphia` (add to tag library); message history one-liners. Log every reply to `best-performing-messages.md` — it is currently empty, which means the learning loop has never been fed. Fix that this week.

---

## 7. Hotel Pipeline OS — Current State (inspected 2026-06-09)

**Built and working (build passes, 33 routes):**
- **CRM pages:** /dashboard, /daily (Command Center: approve → schedule → send-due flow), /companies, /contacts, /candidates, /contact-candidates, /hiring-signals, /messages, /outreach, /partners, /templates, /followups, /suppression, /settings, /admin, /intake, /growth (weekly growth lanes, added today). Auth-gated via `OwnerAuthGuard` + `AppChrome`.
- **Marketing site:** homepage, /contact, /packages, /case-studies, 5 SEO landing pages, sitemap/robots/JSON-LD (added today).
- **Libs:** `send-core.ts` (do not touch), `sending.ts`, `sequence.ts`, `compliance.ts` (CAN-SPAM footer), `compliance-gate.ts` (9-check pre-queue gate, implemented, manual test checklist in docs/), `hunter.ts` (+3 API routes), `research-run.ts`/`research-extract.ts` (Firecrawl enrichment), `scoring.ts`, `queue.ts`, `generate-drafts.ts`, `buyer-titles.ts`, `seo.ts` (new).
- **API routes:** send-approved, send-due, send-test, schedule-approved-today, research/* (run/status/promote/reject/diagnostics/test-*), hunter/*, signals/hiring/*, contact.
- **Migrations (16):** message statuses, drip compliance, timed batch sending, anon access, **test mode**, outreach queue, research pipeline v1–v3, market limits, Firecrawl workflow, daily command center, market send limits, opportunity OS, **20260607 lead discovery/enrichment layer** (lead_sources, discovered_companies, job_signals, hunter_lookups, compliance_checks, source_urls + views), **20260607b high-volume packages/sending** (packages seeded with live pricing, sending_inboxes, send_ramp_stages, send_batches, landing_pages), **20260609 growth_tasks** (new — run it).

**Schema exists but NO UI yet (this is the gap):**
- `/pricing-packages` (packages CRUD) — table seeded, no page.
- `/lead-discovery` or `/discovery` (discovered_companies, lead_sources) — tables only.
- `/approval-queue` (the dedicated approve/edit/reject/snooze UI over outreach_queue + compliance_checks) — gate lib exists, no dedicated page; approval currently happens inside /daily.
- `/send-batches` (send_batches, sending_inboxes, ramp stages) — tables only, no batches/inboxes configured.
- `/landing-pages` — table only.
- Workers: discovery worker, contact-finder worker, daily research orchestrator — spec'd in docs/lead-discovery-enrichment.md, not implemented.

**Do not duplicate:** research_runs/Firecrawl flow (enrichment exists), contact_candidates (+/candidates pages), hunter routes, compliance.ts footer, suppression + unsubscribe flow, scoring.ts, outreach_queue/messages, packages table (seeded — don't re-seed with different prices). The docs explicitly alias spec names to existing tables (enrichment_runs→research_runs etc.) — use the views, don't create parallel tables.

**Risk areas:**
- Anon-key full-access RLS on every table (20260602d) — fine local-only; **must be tightened before the CRM is internet-exposed**. The marketing site is public on the same app, so confirm the deployed Supabase isn't reachable with meaningful data via anon key.
- `compliance-gate.ts` has a manual test checklist (17 scenarios) but no test runner — it has likely never been run end-to-end against dev data.
- Send ramp tables exist but no sending_inboxes rows; deliverability setup (domain, SPF/DKIM/DMARC, warmup) is entirely undone (open decision #6).
- Two sources of pricing truth: `package-pricing-notes.md` and the seeded `packages` table — keep in sync.
- Test Mode exists (20260602e) — verify it's ON in app_settings before any send testing.

---

## 8. Build Plan for Tomorrow (phased)

**Phase 1 — Stabilize current app**
- Touch: `app_settings` check via /settings or SQL; run `20260609_growth_command_center.sql`; rename logo files + update refs (`lib/seo.ts`, `app/page.tsx`, `app/contact/page.tsx`, `SeoLandingPage.tsx`, `case-studies`, `ClientLogoStrip.tsx`).
- Tables: app_settings (confirm `test_mode=true`, `require_manual_approval=true`).
- Output: clean build, growth_tasks live, no AI-named assets.
- Check: `npm run build` && visit /growth, /settings.
- Risk: low. Logo rename touches many files — grep for the encoded filename.

**Phase 2 — Approval queue (highest leverage)**
- Touch: new `app/approval-queue/page.tsx` (or `app/outreach/approval/`), `components/Sidebar.tsx`, reuse `lib/compliance-gate.ts`, `lib/types.ts`.
- Tables: outreach_queue (+compliance_check_id/compliance_status cols from 20260607), compliance_checks, messages, contacts, packages.
- Output: one screen listing queued drafts with compliance result, package/price, approve / edit / reject / snooze / mark-sent (LinkedIn = manual_only badge, mark-sent only).
- Check: `npm run build`; insert a test outreach_queue row; approve it; confirm status transitions and that NOTHING sends.
- Risk: medium — don't fork the /daily approve flow's status vocabulary; reuse the exact message statuses from 20260604f.

**Phase 3 — Compliance gate wiring**
- Touch: call `runComplianceGate` on queue-entry + before approve in the Phase 2 UI; temporary `/api/compliance/check` route for testing.
- Tables: compliance_checks, suppression_list, source_urls, contacts.
- Output: no draft approvable without a passing check; failures show missing[] + recommended_fix.
- Check: run scenarios 1, 4, 12, 17 from `docs/compliance-gate-test-checklist.md` against dev DB.
- Risk: gate is strict (source URLs, verified email) — seed test contacts properly or everything fails and it looks broken.

**Phase 4 — Public lead discovery/enrichment UI**
- Touch: new `app/discovery/page.tsx`; reuse research routes; lead_sources CRUD (can live on same page).
- Tables: lead_sources, discovered_companies, source_urls, research_runs (via enrichment_runs view), companies.
- Output: paste/run a saved search → discovered companies with source_url + confidence → promote to companies → enrich button (existing Firecrawl flow).
- Check: build; discover → promote → enrich one real company end-to-end.
- Risk: Firecrawl internals are off-limits — only call existing routes. Respect discovery daily caps in app_settings.

**Phase 5 — Hunter gating**
- Touch: gate check before calling existing `/api/hunter/*` from UI (priority ≥ hunter_min_priority + qualified lead type); write hunter_lookups audit rows.
- Tables: hunter_lookups, app_settings (hunter_min_priority), contact_candidates.
- Output: Hunter button disabled with reason unless lead qualifies; every lookup audited.
- Check: attempt Hunter on a low-priority lead → blocked with reason; high-priority → works, hunter_lookups row written.
- Risk: don't change `lib/hunter.ts` behavior — gate at the call site.

**Phase 6 — Send batches / approved email only**
- Touch: new `app/send-batches/page.tsx`; sending_inboxes CRUD; wire batch → existing send-approved/send-due (do NOT touch send-core.ts).
- Tables: send_batches, sending_inboxes, send_ramp_stages, app_settings (active_ramp_stage_id, max_daily_send_cap).
- Output: plan a batch (size, inbox, date) of already-approved messages; ramp stage caps enforced; Test Mode respected.
- Check: create batch in Test Mode → confirm sends are simulated/logged only.
- Risk: HIGHEST. Do this last, only after 2+3 are solid. Never raise caps in code; ramp advancement stays manual.

**Phase 7 — Analytics/reporting**
- Touch: extend /dashboard; SQL views (weekly sends, reply rate, status funnel, batch bounce/complaint rates, growth_tasks completion).
- Tables: messages, send_events, send_batches, growth_tasks.
- Output: one weekly numbers screen: contacted, replies, trials, pilots, revenue pipeline.
- Check: build; numbers match manual counts.
- Risk: low; just don't let dashboard queries hammer big tables unindexed.

---

## 9. Codex-Ready Prompt for the Next Build Step

Paste this tomorrow:

```
You are working in the Hotel Pipeline OS repo (Next.js 16 + Supabase + Tailwind 4).

TASK: Build the Approval Queue UI at app/approval-queue/page.tsx with a "Approval Queue" entry in components/Sidebar.tsx (icon: Inbox).

INSPECT FIRST, before writing any code:
- app/daily/page.tsx (existing approve flow + supabase client patterns)
- lib/compliance-gate.ts and lib/types.ts (gate + status types)
- supabase/migrations/20260607_lead_discovery_enrichment_layer.sql and 20260604_outreach_queue_real_contacts.sql (outreach_queue, compliance_checks columns)
- docs/lead-discovery-enrichment.md section 7 (approval queue spec)

REQUIREMENTS:
- List outreach_queue items with: contact + company, channel, draft preview, compliance_status (link to compliance_checks result, show missing[] and recommended_fix on failures), package_recommended + price_shown if set.
- Actions: Approve, Edit draft, Reject, Snooze (set a future date), Mark Sent (for LinkedIn manual sends only — flag linkedin items as manual_only, no send button ever).
- Run runComplianceGate before allowing Approve; block approve on fail with the reasons shown.
- Reuse the existing message/queue status values from the migrations. DO NOT invent new statuses, DO NOT create new tables, DO NOT duplicate the views (approval_queue view may already exist — check the migration and use it if so).
- HARD RULES: nothing in this feature sends email or LinkedIn messages. Do not touch lib/send-core.ts, Resend logic, scheduling logic, lib/hunter.ts behavior, Firecrawl internals, or .env.local. Keep Test Mode and manual approval semantics intact.
- Match the existing CRM UI style (zinc dark theme, PageHeader, clsx patterns from /daily and /followups).

WHEN DONE:
- Run npm run build (and lint). Fix all errors.
- Summarize: files changed, what each does, how to test manually (exact clicks), and anything you intentionally did not build.
```

---

## 10. Daily Sales Routine (60–90 min)

- **0–10 min — CRM open:** check follow-ups due today (/followups), yesterday's replies. Update statuses first, always.
- **10–25 min — LinkedIn comments (5):** comment on 5 hotel-marketing/management posts from the Thursday search-term list (in /growth). Specific, useful, no links. This warms the same people you'll DM.
- **25–40 min — Connections (10):** 10 connection requests to targets from the current city list (Philly queries above). No note, or one real line. Log to CRM as New/Researched.
- **40–60 min — DMs + follow-ups:** post-accept DMs to everyone who accepted (question-led opener), then due follow-up bumps (add value, never "checking in"). Log every send; set next follow-up date.
- **60–75 min — One content post (3×/week, not daily):** post one piece of work or one observation about hotel content. Your feed is your portfolio for everyone who clicks your profile from a comment.
- **75–90 min — CRM close-out:** every touched lead has status + next date. Paste any winning message into best-performing-messages.md.
- **Custom samples:** ONLY for (a) engaged replies who asked, or (b) priority ≥8 multi-property targets where 1–2 hours of spec work is justified. Never for cold accounts. The free trial is the formal version of this — don't give it away twice.

---

## 11. Message Templates (current best, voice-checked)

**Direct buyer (DM #1, question-led):**
> Hey [Name] — was looking at [Property]'s page, the [specific detail] is great. Looks like posting's been a bit quiet since [month] though. Quick question — is creative handled in-house, or does it land on whoever has a spare hour that week?

**Schulte-style large hotel group (volume operator, cost-driven):**
> Hi [Name] — question about how [Group] handles social/creative across the portfolio. Most groups I talk to either put it on each property's GM or run a small corporate team that's permanently slammed. I cover that output for a few PA hotels (Indigo Pittsburgh, some Hamptons) as an outside partner — flat monthly, no headcount. Curious which camp [Group] is in?

**Hotel Equities / Springboard-style senior operator (relationship-first):**
> Hi [Name] — I've followed [Group]'s growth this year, congrats on [specific property/win]. I work with a western PA group (Revest Properties — Indigo Pittsburgh, two Hamptons) doing all their property-level creative from existing assets. As you add properties, is creative something your corporate team scales, or property by property?

**Partner/referral consultant:**
> Hey [Name] — you work with a lot of properties that probably need better content but don't want to hire a creative team. I run that as an outside service (Indigo Pittsburgh, Hamptons, F&B, spa). If you intro me to one and it becomes a client, you get a recurring cut for the life of the contract — I handle all the delivery. Worth a quick chat?

**Major brand / non-buyer (routing):**
> Hi [Name] — I do property-level creative for a few [brand] flags in PA. Not pitching you — just trying to find the right door. Who typically owns creative/social decisions for your managed properties: corporate, regional, or each property?

**Hiring signal:**
> Hi [Name] — saw [Company] is hiring a [role]. Whatever you decide on the hire, wanted to flag the flexible option: I do that creative output (design, motion, social) as an outside partner for a few hotels, so you get the work without the salary/benefits/ramp. Could cover the gap now or run alongside a hire. Useful to see a few samples?

**"Send info":**
> Sure — short version: I turn the photos and assets you already have into finished monthly content (graphics, Reels, captions), as an outside partner instead of a hire. A couple of examples that match [their category]: [2 links/attachments]. What's the next event or season you need content for?

**"We already have a team":**
> Totally — not trying to replace anyone. I mostly work as overflow when in-house teams are slammed or want more output without another hire. Happy to be on file; if a busy season hits, I can spin up finished pieces fast.

**No-response follow-up (day 4–6):**
> Hey [Name] — one more thought and then I'll leave you alone: [one specific idea for their property — e.g., "your patio season content from last year would cut into great Reels for this summer"]. If creative bandwidth's ever the bottleneck, that's exactly what I do.

**Soft close (after trial/examples, day 2–3):**
> Hey [Name] — hope the pieces landed well. If you want that output monthly, the setup is simple: same style, steady cadence, runs well under what a part-time hire costs. Want me to send a one-page plan for [Property/Group]?

---

## 12. Open Questions / Decisions Needed (before scaling)

1. **Pricing consistency** — packages table (DB), package-pricing-notes.md, and the website calculator must say the same numbers. The seeded DB has $2,999 Growth Pilot and $4,499 bundle-high not in the notes file. Reconcile once, declare the DB the source of truth.
2. **Partner commission %** — still `[confirm %]` everywhere. You can't recruit partners until this is a number. Decide (10–15% of net recurring is the common band) and write it into partner-offer.md.
3. **Free trial vs. paid pilot** — about-me.md calls the trial "the front door to every direct-buyer conversation"; pricing notes say "do NOT auto-offer to every cold lead." Resolve: trial = warm/engaged leads only; cold leads get examples. Write the rule in one place.
4. **Commitment terms** — homepage FAQ still says "ask us." Decide month-to-month vs 3-month minimum; it affects every proposal.
5. **Stripe / RoomsRelay** — flagged in your prompt, but **no file in the repo mentions either**. I can't assess this risk; document what it refers to (payment rails? a domain? a side project?) before building billing.
6. **Email domain & deliverability** — biggest unbuilt dependency for Phases 6+. Decide: send from archerdesign.shop or a separate sending domain (recommended: separate, e.g. archerdesign-creative.com) with SPF/DKIM/DMARC + 2–4 week warmup before any volume. sending_inboxes table is ready; nothing is configured.
7. **US-only vs Canada** — Canada means CASL (consent-based, much stricter than CAN-SPAM; cold email is legally risky). Recommendation: US-only for cold email; Canada via LinkedIn-manual only. Encode as a compliance-gate rule when decided.
8. **Contractor plan** — at ~6–8 retained accounts you hit delivery ceiling. Decide trigger (e.g., $12K MRR) and first hire (motion editor most likely, since short-form video is the heaviest deliverable). Not urgent; write the trigger down so growth doesn't stall delivery.

---

## 13. Final Handoff — Start Here Tomorrow

1. **First:** run the growth migration, then open the app. Paste `supabase/migrations/20260609_growth_command_center.sql` into the Supabase SQL editor → `npm run dev` → check `/growth` loads and "Generate this week's tasks" creates 5 tasks (idempotent — click twice, still 5). Also confirm `/settings` shows Test Mode ON.
2. **Second:** paste the Codex prompt from §9 to build the Approval Queue (Phase 2). That's the highest-leverage build: every later phase (discovery, Hunter, batches) drains into it.
3. **Third:** do the 90-minute sales routine (§10) with the Philadelphia list (§6): 5 comments, 10 connections from queries 1–5, DMs to any accepts using the question-led opener. Tag everything `philadelphia` in the CRM.
4. **Command to check:** `npm run build` after any code change; route to check: `/growth`, then `/approval-queue` once built.
5. **Exact outreach action:** send 10 connection requests today from query #1 ("director of sales and marketing" hotel Philadelphia) and #9 (HHM Hotels marketing). When the first one accepts, the DM is already written — §11, direct buyer. Log the first reply you get into `best-performing-messages.md`; that file is empty and it's supposed to be your compounding asset.

*Unverified/missing files flagged: lead-research-notes.md and best-performing-messages.md are empty (no lead/message history exists anywhere in the repo); no file documents Stripe or RoomsRelay; Philly company names above are general knowledge, not from your files — verify each.*
