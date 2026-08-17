// Shared pricing data for the /rebel private concept.
//
// SOURCE OF TRUTH: every tier, price and quantity below is copied verbatim
// from app/jacaruso/jacaruso-config.ts (itself copied verbatim from the live
// app/bridgetown/bridgetown-economics.ts), per Devon's brief: "Reuse/adapt
// the existing Jacaruso economics model." Nothing here is a new or invented
// Archer production rate -- only the partner-facing labels change
// ("Property pays" / "Archer wholesale" / "Rebel retains" / "Rebel gross
// partner margin") to fit Rebel's multi-platform portfolio (independent,
// branded, full-service, focused-service) instead of Jacaruso's
// single-relationship hotel-sales framing.
//
// The illustrative property ceiling is 25 (not 50, and not Renegade
// Hotels' verified ~10-property count or any total Rebel portfolio
// figure) -- an intentionally modest, clearly-illustrative range that
// never reads as a claim about Rebel's actual footprint. See
// rebel-content.ts for the verified Renegade Hotels count and its source.

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
// Identical to the approved Bridgetown/GRANT/Jacaruso constants.
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
    bestFor: "One immediate F&B, event or need-period priority.",
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
    features: ["30-day activation calendar", "One rapid-turn campaign adaptation"],
    bestFor: "A full month of activation across several priorities.",
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
    features: ["30-day activation calendar", "Two rapid-turn campaign adaptations", "Priority production scheduling"],
    bestFor: "Full-service or resort with heavy F&B, meetings, events or seasonal demand.",
  },
];

// Shared across every tier.
export const CORE_INCLUDES = [
  "Standard social-format exports",
  "Approved property messaging built into the design",
  "Brand-safe execution from approved materials",
  "One consolidated round of revisions",
  "Human review before delivery",
  "Organized monthly delivery",
];

export const DEFAULT_TIER_KEY: TierKey = "growth";

// Calculator range for Rebel, illustrative only: minimum 1, default 3
// (matching the pilot's "two or three properties" framing), maximum 25 --
// deliberately modest and not a reflection of Rebel's actual portfolio
// size or Renegade Hotels' verified ~10-property count.
export const MAX_PARTICIPATING_PROPERTIES = 25;
export const MIN_PARTICIPATING_PROPERTIES = 1;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;
export const PILOT_PROPERTY_COUNT_RANGE = "two or three";

// Adoption-scenario table: same test-point pattern as /jacaruso, scaled to
// this page's smaller illustrative ceiling. Priced at the Growth tier (the
// recommended tier). Every dollar figure is derived live from
// ACTIVATION_TIERS at render time, never hardcoded a second time.
export const ADOPTION_SCENARIOS: { count: number; isPilot?: boolean }[] = [
  { count: 1 },
  { count: 3, isPilot: true },
  { count: 5 },
  { count: 10 },
  { count: 25 },
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
export const PARTNER_ECONOMICS_HEADING = "What Rebel keeps.";
export const PARTNER_ECONOMICS_INTRO = "Property pays. Archer produces. Rebel keeps the difference.";
export const ADOPTION_HEADING = "Across a participating portfolio";
export const ADOPTION_INTRO = "At the Growth tier, illustrative gross margin scales like this:";
export const ADOPTION_SUPPORTING =
  "No hires. No equipment. No risk in a slow quarter. The cost only exists when a property is paying.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Illustrative gross margins before Rebel's internal labor, servicing, payment, tax and administrative costs. Not a net-profit figure and not an adoption forecast. For discussion only — final property pricing, wholesale rates and payment terms require written approval.";
export const PARTNER_ECONOMICS_ALT_MODEL =
  "Rebel can also set its own client-facing price. These figures show one possible structure — wholesale, white-label, referral and direct-vendor arrangements all work.";

export const PACKAGES_TABLE_HEADING = "What's in each package";
export const PACKAGES_INCLUDES_LABEL = "Every tier includes:";

/* ── Service modes ───────────────────────────────────────────────────────── */
export const SERVICE_MODES_HEADING = "Two ways to use it";
export const SERVICE_MODES = [
  {
    key: "recurring",
    title: "Monthly / Recurring",
    body: "Ongoing F&B, social, events, meetings and seasonal production for properties with a steady calendar.",
  },
  {
    key: "campaign",
    title: "Campaign / As Needed",
    body: "One-off production for an opening, promotion, event series, sales push or need period.",
  },
];

/* ── Calculator copy ──────────────────────────────────────────────────── */
export const CALC_SCENARIO_LABEL = "Illustrative participating properties";
export const CALC_DISCLAIMER_1 = "Not Rebel Hotel Company's current property count or expected adoption.";
export const CALC_DISCLAIMER_2 =
  "Illustrative gross partner margin before Rebel's administrative, billing, sales, legal, tax and servicing costs. Not a net-profit figure.";
export const CALC_DISCLAIMER_3 = "Final pricing, scope, rates and structure would be negotiated and documented in writing.";
