# SEO Landing Page Drafts — Index & Implementation Plan

20 draft pages in this folder. None are published. Each implements with
`components/marketing/SeoLandingPage.tsx` (H1/body/FAQ/videos/Service+FAQPage
JSON-LD come free). Publishing checklist per page: expand body to 700+ words from
the draft sections → create `app/<slug>/page.tsx` → add slug to `AppChrome.tsx`
PUBLIC_ROUTES → add to `lib/seo.ts` PUBLIC_PAGES (sitemap) → interlink.

## All pages (priority order)

| # | Slug | Priority | Notes |
|---|---|---|---|
| 1 | /hotel-creative-without-adding-headcount | PUBLISH FIRST | Keyword-exact version of the core promise |
| 2 | /3-5-property-creative-pilot | PUBLISH FIRST | The offer page — every outreach link can point here |
| 3 | /hotel-group-marketing-support | PUBLISH FIRST | Primary buyer segment |
| 4 | /hotel-fb-marketing-creative | PUBLISH FIRST | Strongest proof (Eliza), strong local intent |
| 5 | /hotel-local-seo-support | PUBLISH FIRST | Supports the +SEO pricing tiers |
| 6 | /hotel-creative-agency | High | Comparison-intent searchers |
| 7 | /multi-property-hotel-marketing-support | High | Check overlap with #3 — consider folding |
| 8 | /boutique-hotel-creative-services | High | Indigo proof |
| 9 | /hotel-short-form-motion-content | Medium | Interlink with live /hotel-video-marketing |
| 10 | /hotel-event-marketing-creative | Medium | |
| 11 | /hotel-wedding-marketing-creative | Medium | Seasonal — publish before booking season |
| 12 | /spa-wellness-marketing-hotels | Medium | Elements proof |
| 13 | /google-business-profile-support-hotels | Medium | Pairs with #5 |
| 14 | /hospitality-brand-creative-system | Medium | The "how it works" page |
| 15 | /hotel-campaign-visuals | Low | |
| 16 | /restaurant-marketing-for-hotels | Low | Pairs with #4 |
| 17 | /resort-marketing-creative-support | Low | |
| 18 | /hotel-meeting-group-sales-creative | Low | |
| 19 | /hotel-social-media-creative-support | Low | Near-duplicate of live /hotel-social-media-management — differentiate or skip |
| 20 | /hospitality-creative-agency | Low | Near-duplicate of live /hospitality-creative-support — differentiate or skip |

## Internal linking map
- Every new page → /packages, /case-studies, /contact (CTA), plus 3–4 topical siblings (listed per draft).
- Hub pages: /3-5-property-creative-pilot (every page links to it) and /hotel-group-marketing-support (all multi-property pages link to it).
- Existing live pages (/hotel-social-media-management, /hotel-video-marketing, /hospitality-creative-support, /hotel-restaurant-event-promos, /hotel-marketing-cost-savings) should each add 2–3 links into the new pages once published.
- Watch duplication: #19/#20 vs live pages, and #3 vs #7 — one strong page beats two thin ones.

## Recommended metadata
Titles ≤ 60 chars where possible, brand-suffixed via the layout template. Descriptions 140–160 chars (in each draft). Canonicals automatic per page. OG inherits the site default; add a category-specific OG image when before/after pairs are exported.
