// Shared pricing data for the /grant-hospitality private concept.
//
// SOURCE OF TRUTH: every tier, price, quantity and formula below is copied
// verbatim from the live app/bridgetown/bridgetown-economics.ts (itself
// reused unchanged from the approved app/tcrm/tcrm-pricing.ts). Nothing
// here is a new or invented price -- only the partner-facing labels change
// ("Hotel pays" / "Archer production rate" / "GRANT retains" / "GRANT
// gross partner margin"), per the brief's explicit instruction not to
// invent new Archer prices or change the production rate.
//
// The illustrative property ceiling is lowered from Bridgetown's 150 (which
// mirrors Bridgetown's own published "150+ hotels served" figure) to 50,
// because GRANT Hospitality does not publish a client count anywhere on its
// official site, and the brief explicitly prohibits implying one. See
// MAX_PARTICIPATING_PROPERTIES below.

export type TierKey = "essential" | "growth" | "full";

export type ActivationTier = {
  key: TierKey;
  name: string;
  badge?: string;
  /** Amount the participating property pays, per property per month. */
  propertyPays: number;
  /** Archer Design's agreed production rate, per property per month. */
  archerRate: number;
  motionConcepts: number;
  staticConcepts: number;
  captions: number;
  /** Number of rapid-turn campaign adaptations included that month. */
  rapidTurnAdaptations: number;
  hasCalendar: boolean;
  hasPriority: boolean;
  features: string[];
  bestFor: string;
};

// Every motion concept ships as a 9:16 vertical version, a 4:5 feed
// version, and a branded static cover frame (3 files). Every static
// concept ships as a 4:5 feed version and a 9:16 Story version (2 files).
// Identical to the approved Bridgetown/TCRM constants.
export const MOTION_FILES_PER_CONCEPT = 3;
export const STATIC_FILES_PER_CONCEPT = 2;

export const ACTIVATION_TIERS: ActivationTier[] = [
  {
    key: "essential",
    name: "Essential Creative Activation",
    propertyPays: 895,
    archerRate: 625,
    motionConcepts: 3,
    staticConcepts: 2,
    captions: 5,
    rapidTurnAdaptations: 0,
    hasCalendar: false,
    hasPriority: false,
    features: ["Recommended posting order"],
    bestFor: "A hotel with one immediate need period or short-term sales priority.",
  },
  {
    key: "growth",
    name: "Growth Creative Activation",
    badge: "Recommended",
    propertyPays: 1095,
    archerRate: 750,
    motionConcepts: 5,
    staticConcepts: 3,
    captions: 8,
    rapidTurnAdaptations: 1,
    hasCalendar: true,
    hasPriority: false,
    features: ["Recommended 30-day activation calendar", "One rapid-turn campaign adaptation during the month"],
    bestFor: "A hotel needing a full month of activation across several sales priorities.",
  },
  {
    key: "full",
    name: "Full Campaign Activation",
    propertyPays: 1395,
    archerRate: 950,
    motionConcepts: 7,
    staticConcepts: 4,
    captions: 11,
    rapidTurnAdaptations: 2,
    hasCalendar: true,
    hasPriority: true,
    features: [
      "Recommended 30-day activation calendar",
      "Two rapid-turn campaign adaptations during the month",
      "Priority production scheduling",
    ],
    bestFor: "A resort or full-service property with significant F&B, meetings, events or seasonal demand.",
  },
];

// Shared across every tier.
export const CORE_INCLUDES = [
  "Standard social-format exports",
  "Sales-approved messaging incorporated into approved designs",
  "Brand-safe execution using approved property materials",
  "One consolidated round of minor revisions",
  "Human review before delivery",
  "Organized monthly delivery",
];

export const DEFAULT_TIER_KEY: TierKey = "growth";

// Calculator range for GRANT: 1-50, not Bridgetown's 1-150. GRANT does not
// publish a hotel-count figure anywhere on its official site, so this
// ceiling is a round illustrative number only, per the brief.
export const MAX_PARTICIPATING_PROPERTIES = 50;
export const MIN_PARTICIPATING_PROPERTIES = 1;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;
export const PILOT_PROPERTY_COUNT_RANGE = "three to five";

// Adoption-scenario table: shows the same test points requested for manual
// verification (1, 3, 5, 10, 25, 50), all priced at the Growth tier
// (GRANT's recommended tier). Every dollar figure is derived live from
// ACTIVATION_TIERS at render time, never hardcoded a second time. Unlike
// Bridgetown's table, this one has no "share of client base" column --
// GRANT does not publish a client count, so no such share can be computed
// or implied.
export const ADOPTION_SCENARIOS: { count: number; isPilot?: boolean }[] = [
  { count: 1 },
  { count: 3, isPilot: true },
  { count: 5 },
  { count: 10 },
  { count: 25 },
  { count: 50 },
];

export function totalConcepts(tier: ActivationTier): number {
  return tier.motionConcepts + tier.staticConcepts;
}
export function platformFiles(tier: ActivationTier): number {
  return tier.motionConcepts * MOTION_FILES_PER_CONCEPT + tier.staticConcepts * STATIC_FILES_PER_CONCEPT;
}
export function grossMargin(tier: ActivationTier): number {
  return tier.propertyPays - tier.archerRate;
}
export function annualGrossMargin(tier: ActivationTier): number {
  return grossMargin(tier) * 12;
}
export function marginPct(tier: ActivationTier): number {
  return (grossMargin(tier) / tier.propertyPays) * 100;
}
export function tierByKey(key: string | undefined): ActivationTier {
  return ACTIVATION_TIERS.find((t) => t.key === key) ?? ACTIVATION_TIERS.find((t) => t.key === DEFAULT_TIER_KEY)!;
}
export function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
export function fmtPct(n: number): string {
  return `${Math.round(n * 10) / 10}%`;
}
export function pluralizeProperty(n: number): string {
  return n === 1 ? "property" : "properties";
}

/* ── Partner economics section copy ─────────────────────────────────────── */
export const PARTNER_ECONOMICS_EYEBROW = "Partner economics";
export const PARTNER_ECONOMICS_HEADING = "What GRANT retains.";
export const PARTNER_ECONOMICS_INTRO = "Hotel pays. Archer produces. GRANT retains the agreed difference.";
export const ADOPTION_HEADING = "What that looks like across a participating portfolio";
export const ADOPTION_INTRO = "At the Growth tier, illustrative gross margin scales like this as more properties participate:";
export const ADOPTION_SUPPORTING =
  "No hires. No software licenses. No equipment. No capacity risk in a slow quarter. The cost only exists when a property is paying.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Figures are illustrative gross margins before GRANT's internal labor, sales, servicing, payment, tax and administrative costs. Not a net-profit figure and not a forecast of client adoption. Proposed economics for discussion only. Final client pricing, wholesale rates and payment terms require written approval.";

export const PACKAGES_TABLE_HEADING = "What's in each package";
export const PACKAGES_INCLUDES_LABEL = "Every tier includes:";

/* ── Calculator copy ──────────────────────────────────────────────────── */
export const CALC_SCENARIO_LABEL = "Illustrative participating properties";
export const CALC_DISCLAIMER_1 = "This does not represent GRANT Hospitality's current client count or expected adoption.";
export const CALC_DISCLAIMER_2 =
  "Figures represent illustrative gross partner margin before GRANT's administrative, billing, sales, legal, tax, or internal servicing costs, and are not a net-profit figure.";
export const CALC_DISCLAIMER_3 = "Final pricing, scope, production rates, and commercial structure would be negotiated and documented in writing.";
