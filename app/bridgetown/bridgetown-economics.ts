// Shared pricing data for the /bridgetown private concept: Creative
// Activation packages, reused verbatim from the approved /tcrm economics
// (app/tcrm/tcrm-pricing.ts) -- same three tiers, same retail/wholesale
// figures, same motion/static/caption counts. Nothing here was invented;
// this file only renames the partner-facing labels per the Bridgetown
// brief ("Hotel pays" / "Archer production rate" / "Bridgetown keeps" /
// "Bridgetown gross partner margin") and raises the illustrative property
// ceiling to 150 (Bridgetown's own published "150+ hotels served" scale,
// used only as a slider ceiling -- see the calculator disclaimer, which
// explicitly states this is not a forecast of adoption).
//
// Single source of truth so app/bridgetown/page.tsx and
// BridgetownCalculator.tsx never duplicate a number that could drift.

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
// Identical to the approved TCRM constants.
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
    bestFor: "A hotel with one immediate need period or short-term revenue priority.",
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
    bestFor: "A hotel needing a full month of activation across several pricing, demand or distribution priorities.",
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
  "Promotional messaging incorporated into approved designs",
  "Brand-safe execution using approved property materials",
  "One consolidated round of minor revisions",
  "Human review before delivery",
  "Organized monthly delivery",
];

export const DEFAULT_TIER_KEY: TierKey = "growth";

// Calculator range. 150 matches Bridgetown's own publicly presented
// "150+ hotels served" figure -- used only as an illustrative slider
// ceiling, never as an implied or committed participation count.
export const MAX_PARTICIPATING_PROPERTIES = 150;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;
export const PILOT_PROPERTY_COUNT_RANGE = "three to five";

// Bridgetown's own published client-base size, used only to express
// participation scenarios as a share of that base -- illustrative only,
// never a forecast of adoption.
export const CLIENT_BASE_SIZE = 150;

// "What that looks like across your client base" adoption scenarios, all
// priced at the Growth tier (Bridgetown's recommended tier). Every dollar
// figure in the table is derived live from ACTIVATION_TIERS at render
// time, never hardcoded a second time, so it can never drift from the
// package cards or the calculator.
export const ADOPTION_SCENARIOS: { count: number; isPilot?: boolean }[] = [
  { count: 3, isPilot: true },
  { count: 5 },
  { count: 10 },
  { count: 15 },
  { count: 25 },
  { count: 30 },
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
/** Share of Bridgetown's published client base a given property count represents, rounded to the nearest whole percent -- illustrative only. */
export function adoptionSharePct(count: number, base: number = CLIENT_BASE_SIZE): number {
  return Math.round((count / base) * 100);
}

/* ── Partner economics section copy ─────────────────────────────────────── */
export const PARTNER_ECONOMICS_EYEBROW = "Partner economics";
export const PARTNER_ECONOMICS_HEADING = "What Bridgetown keeps.";
export const PARTNER_ECONOMICS_INTRO =
  "The hotel buys an approved creative package. Archer receives the production rate. Bridgetown keeps the difference.";
export const ADOPTION_HEADING = "What that looks like across your client base";
export const ADOPTION_INTRO = "Bridgetown serves 150+ hotels. At the Growth tier:";
export const ADOPTION_SUPPORTING =
  "No hires. No software licences. No equipment. No capacity risk in a slow quarter. The cost only exists when a property is paying.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Illustrative gross partner margin, before Bridgetown's administrative, billing, sales, legal, tax or internal servicing costs. Not a net-profit figure and not a forecast of client adoption. Final pricing, production rates and commercial structure would be negotiated and documented in writing.";

export const PACKAGES_TABLE_HEADING = "What's in each package";
export const PACKAGES_INCLUDES_LABEL = "Every tier includes:";

/* ── Calculator copy ──────────────────────────────────────────────────── */
export const CALC_SCENARIO_LABEL = "Illustrative participating properties";
export const CALC_DISCLAIMER_1 =
  "The selected count is an exploratory scenario, not a forecast of Bridgetown client adoption or participation.";
export const CALC_DISCLAIMER_2 =
  "Figures represent illustrative gross partner margin before Bridgetown's administrative, billing, sales, legal, tax, or internal servicing costs, and are not a net-profit figure.";
export const CALC_DISCLAIMER_3 =
  "Final pricing, scope, production rates, and commercial structure would be negotiated and documented in writing.";
