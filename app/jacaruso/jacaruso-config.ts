// Shared pricing data for the /jacaruso private concept.
//
// SOURCE OF TRUTH: every tier, price, quantity and formula below is copied
// verbatim from the live app/bridgetown/bridgetown-economics.ts (the same
// module already reused unchanged for app/grant-hospitality/grant-hospitality-economics.ts).
// Nothing here is a new or invented price -- only the partner-facing labels
// change ("Hotel pays" / "Archer production rate" / "Jacaruso retains" /
// "Jacaruso gross partner margin"), per the brief's explicit instruction not
// to invent new Archer prices or change the production rate.
//
// The illustrative property ceiling is 50, per the brief's explicit
// instruction (minimum 1, default 3, maximum 50), not Jacaruso's published
// "3,500+ hotels" figure -- that figure describes Jacaruso's entire existing
// client base, not a projection of Archer partnership adoption, and the
// brief explicitly prohibits implying Jacaruso's current active client
// count from the calculator.

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
// Identical to the approved Bridgetown/GRANT/TCRM constants.
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

// Calculator range for Jacaruso, per the brief: minimum 1, default 3,
// maximum 50 participating properties -- an illustrative ceiling only, not
// a reflection of Jacaruso's actual 3,500+ hotel client base.
export const MAX_PARTICIPATING_PROPERTIES = 50;
export const MIN_PARTICIPATING_PROPERTIES = 1;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;
export const PILOT_PROPERTY_COUNT_RANGE = "three to five";

// Adoption-scenario table: shows the same test points requested for manual
// verification (1, 3, 5, 10, 25, 50), all priced at the Growth tier
// (the recommended tier). Every dollar figure is derived live from
// ACTIVATION_TIERS at render time, never hardcoded a second time.
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
export const PARTNER_ECONOMICS_HEADING = "What Jacaruso retains.";
export const PARTNER_ECONOMICS_INTRO = "Hotel pays. Archer produces. Jacaruso retains the agreed difference.";
export const ADOPTION_HEADING = "What that looks like across a participating portfolio";
export const ADOPTION_INTRO = "At the Growth tier, illustrative gross margin scales like this as more properties participate:";
export const ADOPTION_SUPPORTING =
  "No hires. No software licenses. No equipment. No capacity risk in a slow quarter. The cost only exists when a property is paying.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Figures are illustrative gross margins before Jacaruso's internal labor, servicing, payment, tax and administrative costs. Not a net-profit figure and not a forecast of client adoption. Proposed economics for discussion only. Final hotel pricing, wholesale rates and payment terms require written approval.";

export const PACKAGES_TABLE_HEADING = "What's in each package";
export const PACKAGES_INCLUDES_LABEL = "Every tier includes:";

/* ── Calculator copy ──────────────────────────────────────────────────── */
export const CALC_SCENARIO_LABEL = "Illustrative participating properties";
export const CALC_DISCLAIMER_1 = "This does not represent Jacaruso Enterprises' current active client count or expected adoption.";
export const CALC_DISCLAIMER_2 =
  "Figures represent illustrative gross partner margin before Jacaruso's administrative, billing, sales, legal, tax, or internal servicing costs, and are not a net-profit figure.";
export const CALC_DISCLAIMER_3 = "Final pricing, scope, production rates, and commercial structure would be negotiated and documented in writing.";
