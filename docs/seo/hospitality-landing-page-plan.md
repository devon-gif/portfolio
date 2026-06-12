# Hospitality SEO Landing Page Plan

> 10 target pages. Five topics are ALREADY LIVE on archerdesign.shop — extend
> those rather than duplicating (duplicates split ranking). Five are new builds
> using `components/marketing/SeoLandingPage.tsx` (gives you H1, body sections,
> FAQ + FAQPage/Service JSON-LD, video proof, internal links automatically).
> New pages must be added to `AppChrome.tsx` PUBLIC_ROUTES, `lib/seo.ts`
> PUBLIC_PAGES (sitemap), and interlinked from the existing landing pages.

## Coverage map

| Topic | Status | Route |
|---|---|---|
| Hotel social media creative support | LIVE | /hotel-social-media-management |
| Hospitality creative agency (broad) | LIVE | /hospitality-creative-support |
| Restaurant and hotel F&B marketing | LIVE | /hotel-restaurant-event-promos |
| Hospitality marketing without adding headcount | LIVE | /hotel-marketing-cost-savings |
| Hotel video/motion | LIVE | /hotel-video-marketing |
| Hotel creative agency | NEW | /hotel-creative-agency |
| Hotel group marketing support | NEW | /hotel-group-marketing-support |
| Spa and wellness marketing for hotels | NEW | /hotel-spa-wellness-marketing |
| Hotel event and wedding marketing creative | NEW | /hotel-event-wedding-marketing |
| Hotel local SEO support | NEW | /hotel-local-seo-support |
| Hotel group creative system | NEW (or fold into group page) | /hotel-group-creative-system |

All pages: Service + FAQPage JSON-LD via the existing template; proof block (13.9M+ impressions, 543K+ engagements, 3.6M+ reach, 2.4K+ assets); CTAs "Request a 3–5 Property Pilot" + "Request 5 Sample Assets"; internal links to /packages, /case-studies, /contact and 3–4 sibling pages.

---

## 1. /hotel-creative-agency
- **Title:** Hotel Creative Agency Alternative | Archer Design
- **Meta:** A premium alternative to hiring a hotel creative agency: fixed-fee property-level creative systems for hotel groups — graphics, motion, campaigns, F&B promos — without the agency retainer.
- **H1:** The hotel creative agency model, rebuilt for how groups actually buy.
- **Subhead:** Agency-grade creative output at a fixed monthly fee, scoped per property — no account teams, no bundled media buying, no retainer scoped for brands twice your size.
- **Body:** what "agency" usually gets a hotel (strategy decks + junior production) → what properties actually need (consistent finished assets) → the system model → who it fits (groups 3+) → pilot path.
- **FAQ:** Are you an agency? / What does it cost vs an agency retainer? / Who does the work? / Can you handle flag brand standards? / How fast is onboarding?

## 2. /hotel-group-marketing-support
- **Title:** Hotel Group Marketing Support | Creative for Multi-Property Portfolios
- **Meta:** Marketing support built for hotel management companies and multi-property groups: portfolio-consistent creative, property-level campaigns, one partner, one invoice.
- **H1:** Marketing support that scales across a hotel portfolio.
- **Subhead:** Corporate sets the strategy. We produce the property-level creative that strategy needs — consistently, across every property, without a hire in every building.
- **Body:** the multi-property creative problem → group-level consistency vs property personality → how the system plugs into corporate marketing → the 3–5 property pilot → expansion economics (price per property improves with scale).
- **FAQ:** Do you work with management companies? / How do approvals work across properties? / Can corporate keep control of brand? / What if properties have different flags?

## 3. /hotel-spa-wellness-marketing
- **Title:** Hotel Spa & Wellness Marketing Creative | Archer Design
- **Meta:** Calm, premium creative for hotel spas and wellness brands — treatment promos, seasonal campaigns, gift-card pushes — produced monthly without pulling your team off the floor.
- **H1:** Wellness creative as calm as the treatment room.
- **Subhead:** The spa is a margin line that books on feeling. We produce the serene, premium creative that matches the in-person experience — inside hotels and standalone.
- **Body:** why spa creative is hardest to make in-house (aesthetic + time) → what monthly coverage looks like → gift seasons and retail → Elements case → hotel-spa integration with rooms content.
- **FAQ:** Do you understand spa brand tone? / What about gift-card season? / Can this bundle with our hotel's creative plan?

## 4. /hotel-event-wedding-marketing
- **Title:** Hotel Event & Wedding Marketing Creative | Fill the Calendar
- **Meta:** Promo creative for hotel weddings, meetings, and events: open-date campaigns, venue showcases, seasonal pushes — built to fill next season's calendar.
- **H1:** Creative that fills wedding dates and event calendars.
- **Subhead:** Open Saturdays next spring are a promotion problem, not a venue problem. We build the campaign creative your events team runs while couples are still deciding.
- **Body:** the booking-window problem → wedding promo creative (dates, seasons, showcases) → meetings/corporate events → branded event calendars → event-tied room campaigns.
- **FAQ:** How far ahead should event creative run? / Can you support the wedding sales team directly? / Do you do event photography? (no — creative from existing/scoped assets)

## 5. /hotel-local-seo-support
- **Title:** Hotel Local SEO Support | Google Business Profile + Local Content
- **Meta:** Local SEO support for hotels and hotel groups: Google Business Profile content, local landing copy, review responses, and monthly local content — bundled with your creative system.
- **Meta note:** position as the ADD-ON it is (+$ creative+SEO tiers), not standalone cheap SEO.
- **H1:** Be the obvious local answer when guests search.
- **Subhead:** GBP content, local pages, review responses, and monthly local content — attached to the same creative system that produces your campaigns.
- **Body:** what local search decides for hotels (F&B + events especially) → GBP as the second homepage → what monthly support includes → why creative + SEO together outperform either alone → pricing tier pointer ($7,500+ bundles).
- **FAQ:** Is this standalone? (bundled with creative tiers) / Do you do paid search? (no) / How do you measure it?

## 6. /hotel-group-creative-system
- **Title:** The Hotel Group Creative System | One Partner, Every Property
- **Meta:** A fixed-fee creative system for hotel groups: monthly plans, social graphics, motion, F&B/event promos, and photo polishing across 3–40 properties.
- **H1:** One creative system. Every property covered.
- **Subhead:** The operating model behind everything we do: plan monthly, produce per property, approve once, expand on evidence.
- **Body:** anatomy of the system (plan → produce → approve → report) → what's in a property's month → consistency mechanics (templates, motion language, brand rules) → pilot → partnership tiers up to custom $15K+.
- **FAQ:** How is a "system" different from a retainer? / What's the minimum property count? / Contract terms?
- **Note:** check overlap with /hotel-group-marketing-support — if thin, fold into one stronger page rather than shipping two weak ones.

## Schema notes (all pages)
Service (provider → Organization @id) + FAQPage are automatic via the template. Add `OfferCatalog` to /packages later if pricing stays public. Keep VideoObject only where real portfolio videos appear.
