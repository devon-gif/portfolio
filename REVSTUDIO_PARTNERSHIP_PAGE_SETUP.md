# The Revstudio × Archer Design — partnership page setup

Early, **unapproved** partnership page. Live at `/revstudio` for internal
review only — noindex by default, not in the main site navigation. See
"How to approve indexing" below before treating this as public.

## 1. Page route

- Local: `http://localhost:3000/revstudio`
- Production (once deployed + approved): `https://www.archerdesign.shop/revstudio`
- Implemented as a real Next.js App Router route: `app/revstudio/page.tsx`
  (not a static HTML file like `/revenue-activation` — that pattern is
  reserved for one-off bespoke prospect pages; `/revstudio` is meant to be
  a permanent, indexable site page, so it uses the same App Router +
  Tailwind v4 system as `/hospitality-creative-support`,
  `/hotel-social-media-management`, etc.)

## 2. Main components

| File | Purpose |
|---|---|
| `app/revstudio/page.tsx` | The page itself — all 12 sections, pulling copy from `lib/revstudio-content.ts` |
| `components/marketing/revstudio/JointPartnerHeader.tsx` | Sticky partnership header, unique to this page (not the standard Archer nav), with mobile menu + "Back to Archer Design" link |
| `components/marketing/revstudio/JointFooter.tsx` | Joint footer — both companies, both site links, independent-companies disclaimer |
| `components/marketing/revstudio/TrackedBookingLink.tsx` | The one reusable CTA component every "Discuss a pilot" / "Talk through a pilot" button uses — always carries attribution, falls back to a mailto link if no booking URL is configured |
| `components/marketing/revstudio/PartnershipFAQ.tsx` | Accordion FAQ block |
| `lib/revstudio.ts` | Attribution constants, booking-URL builder, notification-recipient env readers, the `REVSTUDIO_PAGE_APPROVED` gate |
| `lib/revstudio-content.ts` | All page copy in one config object (hero, execution gap, model, process, use cases, audiences, pilot, partner intro, FAQ, final CTA) |
| `app/globals.css` | New `.revstudio-theme` scoped CSS block (palette, `.rv-*` component classes) — appended after the existing `.archer-studio` theme, same pattern, new tokens |

Reused, not duplicated:

- `components/marketing/studioFont.ts` (`fraunces` — same serif used sitewide)
- `components/marketing/JsonLd.tsx` + `lib/seo.ts` (`serviceJsonLd`, `faqJsonLd`)
- `lib/proof-stats.ts` (Archer's real, approved proof numbers — nothing invented)
- The HSC × Archer Design booking pipeline: same Supabase table
  (`strategy_call_bookings`, additive migration below), same webhook route
  (`app/api/webhooks/strategy-call/route.ts`, now branches on UTM pair),
  same Calendly signature verification (`lib/calendly.ts`), same email
  sending (`lib/sending.ts`) — extended via a second exported function in
  `lib/strategy-call-notify.ts` (`sendRevstudioNotification`), not forked
  into a parallel system.

## 3. Asset files needed

See `public/revstudio/README.md` for the live version of this list. Summary:

**Currently in use (already existed in the repo — reused, not duplicated):**
- Archer Design mark: `/archer-preview/brand/ad-logo.png`
- Hero background: `/revenue-activation/media/background-winter.png` (an
  existing licensed hospitality resort image already used elsewhere on
  the site — given a navy overlay treatment distinct from its use on
  `/revenue-activation`)

**Not yet provided — currently a text lockup, not an image file:**
- `revstudio-logo.svg` / `.png` — The Revstudio's real logo. Until
  provided, `JointPartnerHeader` renders "The Revstudio" as styled serif
  text next to the real Archer mark. **Do not replace this with an
  AI-generated approximation** — swap in the real file when Ghisela
  provides it, at `public/revstudio/revstudio-logo.svg`, then update the
  `<Image>`/text in `JointPartnerHeader.tsx`.
- `joint-logo-lockup.svg` / `.png` — optional, once a real Revstudio mark exists.
- Dedicated hero photo — optional; current hero reuses an existing asset.
- `ghisela.jpg`, `devon.jpg` — no headshots or bios are shown; see item 13.

## 4. Current placeholder content

- **"The Revstudio" wordmark** in the header/footer is live styled text, not a logo file.
- **Partner Introduction section** is company-focused only — no founder
  bios, titles, or headshots (none were provided; see item 13).
- **Hero background image** reuses an existing repo asset rather than a
  dedicated Revstudio × Archer photo shoot.
- **Booking link** falls back to a plain `mailto:hello@archerdesign.shop`
  link on every CTA until `NEXT_PUBLIC_REVSTUDIO_BOOKING_URL` is set —
  clearly marked here per your instruction not to silently point at a
  generic/unmarked link.

## 5. Booking URL configuration

```
NEXT_PUBLIC_REVSTUDIO_BOOKING_URL=
```

Empty by default. Every CTA (`TrackedBookingLink`) falls back to
`mailto:hello@archerdesign.shop?subject=The%20Revstudio%20×%20Archer%20Design%20—%20Pilot%20Conversation`
until this is set. Set it to the dedicated Calendly event URL once it
exists, e.g. `https://calendly.com/YOUR-ORG/revstudio-archer-pilot`.

Configure that Calendly event's **custom questions in this exact order**
(see `lib/revstudio.ts` → `buildRevstudioBookingUrl`):

1. `a1` — Company or hotel group
2. `a2` — Are you a hotel, hotel group, or revenue-management agency?
3. `a3` — Approximately how many properties are involved?
4. `a4` — What commercial or creative opportunity would you like to discuss?
5. `a5` — Which area needs the most support?
6. `a6` — Company website

(`name` / `email` are Calendly's native invitee fields — no custom
question needed for those.)

## 6. Attribution values

Permanent, non-overridable, defined in `lib/revstudio.ts`:

| Value | |
|---|---|
| `lead_source` | `ARCHER_REVSTUDIO_PAGE` |
| Display label | "The Revstudio × Archer Design landing page" |
| `utm_source` | `archerdesign_shop` |
| `utm_medium` | `partner_landing_page` |
| `utm_campaign` | `revstudio_joint_offer` |

Every `TrackedBookingLink` click carries all four. `landing_page_url` and
`referrer_url` are also appended best-effort (enriched client-side after
mount) but — like the HSC flow — are **not** reliably forwarded back
through Calendly's webhook payload; treat them as not guaranteed.
Internal tracking codes are never shown to the visitor (they only appear
in the outgoing URL's query string, not in any visible page copy).

`original_lead_source` is protected from being overwritten after booking
by the same Postgres trigger that already protects the HSC flow
(`strategy_call_bookings_protect_source_trg` — see the original migration).

## 7. Notification configuration

Server-only env vars (never exposed to the client):

```
REVSTUDIO_DEVON_EMAIL=
REVSTUDIO_GHISELA_EMAIL=
REVSTUDIO_NOTIFICATION_EMAIL=      # optional shared inbox, also notified
REVSTUDIO_BOOKING_WEBHOOK_SECRET=  # optional — only needed if the Revstudio
                                    # Calendly event lives in a different
                                    # Calendly org than HSC's (separate
                                    # signing secret). The webhook checks
                                    # both BOOKING_WEBHOOK_SECRET and this
                                    # one; leave empty if same org.
```

No round-robin — `sendRevstudioNotification` (in `lib/strategy-call-notify.ts`)
notifies Devon and Ghisela directly (whichever emails are configured),
plus the shared inbox if set. If none are configured, the booking is
still saved; a `console.error` is logged so it doesn't fail silently in
your server logs.

## 8. Shared-calendar configuration

```
REVSTUDIO_SHARED_CALENDAR_ID=
```

Same pattern as the HSC flow's `SHARED_CALENDAR_ID`: this is for
reference/documentation only. No direct Google Calendar API integration
exists — configure Calendly itself to write new bookings directly to
this shared calendar (Calendly account settings → Availability → connect
the calendar you want events written to).

## 9. How to approve indexing

```
REVSTUDIO_PAGE_APPROVED=false   # current default
```

Set to the literal string `true` once Ghisela and Devon have signed off
on the copy (see item 13). This flips two things automatically, no code
changes required:

- `app/revstudio/page.tsx` — per-page `<meta name="robots">` switches from
  `noindex,nofollow` to `index,follow`.
- `app/sitemap.ts` — `/revstudio` is added to `sitemap.xml`.

The route stays reachable at `/revstudio` either way — approval only
controls indexing/crawling signals, not access (no auth wall was added,
matching your instruction not to gate it behind auth unless the project
already supports password-protected previews — it doesn't).

## 10. How to add the page to navigation

Not done yet, per your instruction. When ready:

- Add a nav entry to `components/marketing/StudioHeader.tsx` (the shared
  Archer Design site header) pointing at `/revstudio`.
- Optionally add a link from the homepage (`app/page.tsx`) or another
  relevant marketing page.
- `/revstudio` is already in `components/AppChrome.tsx`'s `PUBLIC_ROUTES`
  list so it renders full-bleed (no CRM sidebar) — that part needed no
  further change.

## 11. How to update partner copy

All copy lives in one file: `lib/revstudio-content.ts`. Each section
(`HERO`, `EXECUTION_GAP`, `MODEL`, `PROCESS`, `USE_CASES`, `AUDIENCES`,
`PILOT`, `PARTNERS`, `FAQ`, `FINAL_CTA`) is a plain exported object/array
— edit values there; `app/revstudio/page.tsx` re-renders automatically.
No copy is hardcoded inline in the page or components (aside from a few
structural labels like section eyebrows that reuse the same objects).

## 12. How to replace logos and imagery

- Real Revstudio logo: drop the file at `public/revstudio/revstudio-logo.svg`
  (or `.png`), then swap the text wordmark for an `<Image>` in
  `components/marketing/revstudio/JointPartnerHeader.tsx` (same pattern
  already used there for the Archer mark).
- Hero image: replace the `src` on the `<Image>` in the hero section of
  `app/revstudio/page.tsx` (currently
  `/revenue-activation/media/background-winter.png`) with a new file
  placed in `public/revstudio/`.
- Founder photos: add to `public/revstudio/` and extend the Partner
  Introduction section in `app/revstudio/page.tsx` once approved (see item 13).

## 13. Statements still requiring Ghisela's approval

Everything on this page describing The Revstudio's services, positioning,
or the partnership itself was written from the brief you provided, not
from Revstudio-approved marketing copy — Ghisela should review before
`REVSTUDIO_PAGE_APPROVED=true`:

- The full **"The Revstudio" column** in the Combined Model section
  (service list: revenue-management support, OTA/distribution ops,
  channel management, rate-parity support, reporting, pricing/promotion
  coordination, white-label support for agencies).
- The **Partner Introduction** description of The Revstudio.
- Whether **"The Revstudio × Archer Design"** is the correct/approved way
  to refer to the partnership in copy (used throughout as the eyebrow,
  header wordmark, and page title).
- Any statement implying what Ghisela's team **will or won't do**
  operationally (e.g. "white-label operational support," "reporting and
  commercial visibility") — confirm these match how Revstudio actually
  scopes engagements.
- The **pilot framework** language (open to a joint pilot, "custom pilot
  scope," no fixed pricing shown) — confirm Ghisela is aligned before
  this goes live, since it implies availability to take on pilot work.
- Whether Ghisela wants to be named/notified by first name only
  (`REVSTUDIO_GHISELA_EMAIL` label reads "Ghisela (The Revstudio)" in
  internal notification emails — not shown to visitors) or with a full
  name/title once available.

No specific claims about hotel counts, client names, revenue,
geographic coverage, team size, exclusivity, or guaranteed results were
made anywhere on the page — those were explicitly excluded per your
brief, not just deferred for approval.

## 14. Testing checklist

| Check | Result |
|---|---|
| `/revstudio` route exists, renders all 12 sections | ✅ Built — see `app/revstudio/page.tsx` |
| All booking CTAs use `TrackedBookingLink` | ✅ 5 CTAs (header, hero, model→#model anchor, pilot, final-cta) all route through the one component |
| Tracking parameters present on every CTA | ✅ `utm_source/medium/campaign` + `lead_source` always set; verified in `buildRevstudioBookingUrl` |
| Mobile navigation works | ✅ `JointPartnerHeader` has a client-side toggle + mobile panel; not live-clicked in a browser (see limitations) |
| No content overflows | ⚠️ Built with fluid `clamp()` type + Tailwind responsive classes matching the existing marketing pages' conventions; not visually verified at each breakpoint in a real browser (see limitations) |
| Images optimized | ✅ Uses `next/image` with `fill`/`sizes` for the hero and header mark |
| Reduced-motion respected | ✅ The one animated element (`.rv-connector` sweep line) is wrapped in `@media (prefers-reduced-motion: reduce)` to disable |
| Keyboard navigation | ✅ Semantic `<a>`/`<button>`/`<details>` throughout; mobile toggle has `aria-expanded`/`aria-controls`; no custom click-only widgets |
| Metadata renders correctly | ✅ `title`, `description`, OpenGraph, Twitter, canonical all set in `app/revstudio/page.tsx` |
| Noindex while unapproved | ✅ `robots: { index: false, follow: false }` when `REVSTUDIO_PAGE_APPROVED` is unset/false (default) |
| Existing Archer pages unaffected | ✅ `git status` confirms only new files + 4 modified files: `app/globals.css` (additive CSS block appended), `app/sitemap.ts` (additive conditional), `components/AppChrome.tsx` (one route string added), `app/api/webhooks/strategy-call/route.ts` (branched, HSC path logic unchanged) |
| `npx tsc --noEmit` | ✅ Clean, no errors |
| `npx eslint` (scoped to changed/new files) | ✅ Clean, no errors or warnings |
| `npm run build` | ⚠️ Could not complete in this sandbox — `next build` fails with `EPERM: operation not permitted, unlink '.next/...'` against this session's mounted filesystem. This is the same environment limitation hit during the original HSC booking-system build (documented in that session) — not caused by this page's code. Recommend running `npm run build` locally or in CI before deploying. |

## 15. Deployment instructions

1. Run `npm run build` locally/in CI (not verified end-to-end in this
   sandbox — see limitation above) and confirm it succeeds.
2. Set the new environment variables in Vercel (or wherever this deploys)
   — see the `.env.example` block added under "Revstudio x Archer Design
   partnership page (/revstudio)" for the full list with inline docs.
   At minimum, leave `REVSTUDIO_PAGE_APPROVED` unset or `false` until
   Ghisela signs off.
3. Apply the new Supabase migration:
   `supabase/migrations/20260713_strategy_call_bookings_add_entity_type.sql`
   (additive — one nullable column, safe to run anytime, doesn't touch
   existing HSC booking rows).
4. Deploy. The route is live at `/revstudio` but noindex and not linked
   from anywhere on the site — safe for internal review via direct link.
5. Once Ghisela/Devon approve: set `REVSTUDIO_PAGE_APPROVED=true`,
   redeploy, then optionally add a nav link (see item 10).
6. **Per your instruction, this has not been deployed, merged, or pushed
   to production — all of the above is written for you to run when ready.**
