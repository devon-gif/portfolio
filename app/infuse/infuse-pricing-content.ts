// ─────────────────────────────────────────────────────────────────────────────
// infuse-pricing-content.ts — copy for the /infuse pricing/engagement
// section (InfusePricing.tsx). Kept separate from infuse-content.ts because
// it's a distinct, self-contained block of the page with its own data
// shape (tiers, pilot, hourly note) — same split this project uses
// elsewhere for logically separate content (e.g. app/dns/dns-stills-data.ts
// next to app/dns/dns-content.ts).
//
// Pricing-logic note (not shown on the page): each tier step up is meant to
// read as more availability, faster turnaround, and more strategic/social
// responsibility — not simply "more graphics." Copy below is written to
// reflect that; keep that distinction if these numbers or tiers change.
// ─────────────────────────────────────────────────────────────────────────────

// Kept for reference only — every CTA in this section now points to
// CALENDLY_URL (see infuse-content.ts) instead of email.
export const PRICING_CTA_MAILTO =
  "mailto:hello@archerdesign.shop?subject=Infuse%20Hospitality%20Creative%20Support";

export const PRICING_EYEBROW = "ENGAGEMENT OPTIONS";
export const PRICING_HEADLINE_LINE_1 = "Flexible support.";
export const PRICING_HEADLINE_LINE_2 = "Built around the workload.";
export const PRICING_SUBCOPY =
  "Infuse may need anything from occasional creative help to hands-on support across multiple concepts. These options are designed to make it easy to start at the level that makes sense now and expand only where additional support proves useful.";

export const PRICING_PULL_QUOTE =
  "For substantially less than the cost of adding another marketing or creative hire, Infuse gets an experienced hospitality creative partner who can immediately support design, social, motion, campaigns and digital production — and the relationship can scale up or down as the workload changes.";
/** Small clarifying line placed directly beneath the quote wherever it
 * appears (InfuseValueQuote.tsx and here in InfusePricing.tsx) — the quote
 * wording itself stays exactly as written above, unchanged. */
export const PRICING_PULL_QUOTE_NOTE =
  "Not a replacement for Infuse's leadership or strategy — additional execution capacity where the team needs it most.";

/* ── 30-day pilot ──────────────────────────────────────────────────────── */
export const PILOT_EYEBROW = "NOT SURE WHERE TO START?";
export const PILOT_HEADLINE = "Start with a 30-day Infuse Creative Pilot.";
export const PILOT_PRICE = "$3,500";
export const PILOT_PRICE_NOTE = "one-time";
export const PILOT_COPY =
  "A short first engagement designed to help Archer learn Infuse's workflow, take pressure off the current marketing team, and determine what level of ongoing support actually makes sense.";
export const PILOT_INCLUDES = [
  "Up to 30 hours of support",
  "Design and creative production",
  "Social content",
  "Motion / reels",
  "Menus, events, and campaigns",
  "Promotional assets",
  "One weekly check-in",
  "Priority turnaround",
  "Review of current workflow and creative queue",
  "End-of-month recommendation for ongoing support",
] as const;
export const PILOT_FOOTNOTE = "No long-term commitment required.";
export const PILOT_CTA = "Start with the 30-day pilot";

/* ── Standard tiers ────────────────────────────────────────────────────── */
export type PricingTier = {
  number: string;
  name: string;
  price: string;
  cadence: string;
  positioning: string;
  includes: readonly string[];
  caption: string;
  note?: string;
  /** Short "best for Infuse if..." line clarifying where this tier fits in
   * the ladder relative to its neighbors — only the two tiers where that
   * boundary needed spelling out (03 and 04) use it. */
  bestForNote?: string;
  badge?: string;
  ctaLabel: string;
};

export const TIERS: PricingTier[] = [
  {
    number: "01",
    name: "Essential Creative",
    price: "$1,299",
    cadence: "/ month",
    positioning: "Still primarily production — reliable creative help without a large ongoing commitment.",
    includes: [
      "Up to 10 hours of creative support per month",
      "Social graphics",
      "Menu updates",
      "Flyers and event creative",
      "Email graphics",
      "Digital signage",
      "Existing-template updates",
      "Light motion / simple animated assets where appropriate",
      "One active request at a time",
      "Standard turnaround",
      "Monthly check-in",
    ],
    caption: "A simple way to add dependable creative capacity.",
    ctaLabel: "Discuss this level",
  },
  {
    number: "02",
    name: "Creative Support",
    price: "$2,500",
    cadence: "/ month",
    positioning: "Broader production capacity — ongoing overflow creative across more categories.",
    includes: [
      "Approximately 20 hours of support per month",
      "Graphic design",
      "Menus",
      "Social creative",
      "Campaign assets",
      "Event promotion",
      "Digital signage",
      "Email creative",
      "Sales collateral",
      "Photo retouching and cleanup",
      "Turning existing stills into short-form motion",
      "Quick-turn marketing requests",
      "Up to 2 active requests at a time",
      "Regular monthly planning call",
    ],
    caption: "Best for steady creative overflow.",
    ctaLabel: "Discuss this level",
  },
  {
    number: "03",
    name: "Creative + Marketing Partner",
    price: "$4,500",
    cadence: "/ month",
    positioning: "For teams that want Archer involved in both production and ongoing marketing execution.",
    includes: [
      "Approximately 40 hours of monthly support",
      "Everything in Creative Support",
      "Social media management for up to 3 selected concepts/accounts",
      "Monthly content calendars",
      "Caption writing",
      "Scheduling and publishing",
      "Campaign planning and campaign execution",
      "Seasonal promotions",
      "Menu launches",
      "Events and activations",
      "Photo retouching, compositing and enhancement",
      "Motion graphics and reels, including turning existing stills into motion",
      "Email marketing support",
      "Landing-page creative",
      "Sales / proposal support",
      "Light analytics / monthly performance review",
      "Content repurposing",
      "Priority turnaround",
      "Up to 2–3 active projects at once",
      "Weekly or biweekly marketing check-in",
    ],
    note: "Additional managed social account / concept: +$750–$1,000 per month depending on volume.",
    bestForNote: "Best for Infuse if the need is broader than production design and includes ongoing marketing execution.",
    caption: "Best for ongoing creative + marketing execution.",
    badge: "Recommended",
    ctaLabel: "Talk through scope",
  },
  {
    number: "04",
    name: "Embedded Creative Partner",
    price: "$7,500",
    cadence: "/ month",
    positioning: "A fractional extension of the marketing team.",
    includes: [
      "Approximately 65–70 hours of monthly capacity",
      "Multi-concept creative support",
      "Ongoing social media management",
      "Ongoing campaign execution",
      "Advanced photo retouching and compositing",
      "VFX-driven motion built from existing still photography",
      "Motion / reels",
      "Menu and promotional creative",
      "Events and activations",
      "Email / digital / web creative",
      "Landing pages when reasonably scoped",
      "Sales enablement / proposal support",
      "Lightweight monthly reporting",
      "Content repurposing across formats",
      "Asset / workflow organization",
      "Multi-brand template systems",
      "Priority production capacity",
      "Faster turnaround",
      "Up to 3 active projects at once",
      "Weekly planning call",
      "Direct collaboration with Infuse marketing / operations",
      "Support across multiple selected concepts",
    ],
    note: "Designed for periods when Infuse needs meaningful additional marketing capacity without adding another full-time role.",
    caption: "Best for deeper multi-concept support.",
    ctaLabel: "Talk through scope",
  },
];

/* ── Custom / high-volume ──────────────────────────────────────────────── */
export const CUSTOM_EYEBROW = "HIGH-VOLUME / MULTI-CONCEPT";
export const CUSTOM_NAME = "Priority Creative Partnership";
export const CUSTOM_PRICE = "Starting at $10,000 / month";
export const CUSTOM_PRICE_RANGE = "$10K–$12K+ / month depending on scope";
export const CUSTOM_POSITIONING =
  "For high-volume, multi-concept teams that want Archer functioning as an embedded external creative department.";
export const CUSTOM_PHRASE = "Unlimited requests. Managed production capacity.";
export const CUSTOM_EXPLANATION =
  "Infuse can submit as many requests as needed. Archer manages those requests through a priority production queue, with a limited number actively in production at one time.";
export const CUSTOM_INCLUDES = [
  "Unlimited request queue",
  "2–3 active projects at a time",
  "Priority turnaround",
  "Creative direction",
  "Design",
  "High-volume, multiple-concept creative",
  "Social media execution",
  "Advanced image enhancement and VFX",
  "Motion built from existing still photography",
  "Campaign production",
  "Menu creative",
  "Event promotion",
  "Digital signage and digital creative",
  "Landing-page creative",
  "Sales enablement / proposal support",
  "Ongoing marketing execution",
  "Multi-concept production systems",
  "Weekly coordination",
  "High-priority access",
] as const;
export const CUSTOM_SCOPE_NOTE =
  "Large website builds, full brand-development projects, extensive video production, paid media spend, printing, photography, travel, specialized technical services, and other major production costs are scoped separately.";
export const CUSTOM_QUEUE_NOTE =
  "“Unlimited requests” refers to the request queue, not unlimited simultaneous production.";
export const CUSTOM_CTA = "Talk through scope";

/* ── Hourly / outside-scope ────────────────────────────────────────────── */
export const HOURLY_LABEL = "Additional or outside-scope support:";
export const HOURLY_RATE = "$125/hour";
export const HOURLY_NOTE =
  "Major one-off projects or needs outside the selected monthly scope can either be quoted separately or handled at $125/hour with approval.";

/* ── Scope footnotes (revisions / turnaround — no overpromising) ─────────── */
export const SCOPE_REVISIONS_NOTE = "Reasonable revisions within the approved project scope are included.";
export const SCOPE_TURNAROUND_NOTE = "Turnaround depends on complexity and the active production queue.";

/* ── Closing CTA (pricing-specific) ───────────────────────────────────── */
export const PRICING_CLOSING_EYEBROW = "NOT SURE WHICH LEVEL FITS?";
export const PRICING_CLOSING_COPY =
  "That is completely fine. The first conversation is really about understanding what the current marketing transition has left uncovered and where another set of hands would create the most value.";
export const PRICING_CLOSING_CTA_PRIMARY = "Talk through the workload";
export const PRICING_CLOSING_CTA_SECONDARY = "Start with the 30-day pilot";
