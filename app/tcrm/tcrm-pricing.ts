// Shared pricing data for the /tcrm proposal: Revenue Priority Creative
// Activation, three tiers. Single source of truth so app/tcrm/page.tsx,
// app/tcrm/schedule/page.tsx, and PortfolioCalculator.tsx never duplicate a
// number that could drift. Every derived figure (gross profit, margin,
// platform-ready file counts, pilot totals) is computed from these base
// inputs rather than hardcoded a second time.

export type TierKey = "essential" | "growth" | "full";

export type ActivationTier = {
  key: TierKey;
  name: string;
  badge?: string;
  /** Hotel-facing suggested retail, per property per month. */
  retail: number;
  /** Archer Design wholesale cost, per property per month. */
  wholesale: number;
  /** Original short-form motion concepts, per property per month. */
  motionConcepts: number;
  /** Original static campaign concepts, per property per month. */
  staticConcepts: number;
  /** Concise promotional captions, per property per month. */
  captions: number;
  /** Tier-specific deliverables, beyond the CORE_INCLUDES shared by all three. */
  features: string[];
  bestFor: string;
};

// Every motion concept is delivered as a 9:16 vertical version, a 4:5 feed
// version, and a branded static cover frame (3 files). Every static concept
// is delivered as a 4:5 feed version and a 9:16 Story version (2 files).
// Platform-ready file totals are derived from these two constants, never
// hardcoded a second time.
export const MOTION_FILES_PER_CONCEPT = 3;
export const STATIC_FILES_PER_CONCEPT = 2;

export const ACTIVATION_TIERS: ActivationTier[] = [
  {
    key: "essential",
    name: "Essential Activation",
    retail: 895,
    wholesale: 625,
    motionConcepts: 3,
    staticConcepts: 2,
    captions: 5,
    features: ["Recommended posting order"],
    bestFor: "A hotel with one immediate package, seasonal push, event, or short-term revenue priority.",
  },
  {
    key: "growth",
    name: "Growth Activation",
    badge: "Recommended",
    retail: 1095,
    wholesale: 750,
    motionConcepts: 5,
    staticConcepts: 3,
    captions: 8,
    features: ["Recommended 30-day activation calendar", "One rapid-turn campaign adaptation during the month"],
    bestFor: "A hotel that needs a complete month of creative activation across multiple commercial priorities.",
  },
  {
    key: "full",
    name: "Full Campaign Activation",
    retail: 1395,
    wholesale: 950,
    motionConcepts: 7,
    staticConcepts: 4,
    captions: 11,
    features: [
      "Recommended 30-day activation calendar",
      "Two rapid-turn campaign adaptations during the month",
      "Priority production scheduling",
    ],
    bestFor: "A resort, lifestyle hotel, full-service property, or hotel with significant F&B, wedding, meeting, event, or seasonal demand.",
  },
];

// Shared across every tier -- shown once rather than repeated on all three
// cards, so the cards stay comparison-row-clean instead of dense bullet
// lists.
export const CORE_INCLUDES = [
  "Standard social-format exports",
  "Promotional copy incorporated into the designs",
  "Brand-safe execution using approved property materials",
  "One consolidated minor revision round",
  "Human review before delivery",
  "Organized white-label delivery through TCRM",
];

export const DEFAULT_TIER_KEY: TierKey = "growth";

// TCRM publicly reports supporting 700+ hotels historically, with daily
// revenue management support for 70+ properties currently. Used only as
// the portfolio calculator's illustrative slider ceiling, never as an
// implied or committed participation count.
export const MAX_SUPPORTED_HOTELS = 70;

// Recommended three-property pilot.
export const PILOT_HOTEL_COUNT = 3;

export function totalConcepts(tier: ActivationTier): number {
  return tier.motionConcepts + tier.staticConcepts;
}

export function platformFiles(tier: ActivationTier): number {
  return tier.motionConcepts * MOTION_FILES_PER_CONCEPT + tier.staticConcepts * STATIC_FILES_PER_CONCEPT;
}

export function grossProfit(tier: ActivationTier): number {
  return tier.retail - tier.wholesale;
}

export function marginPct(tier: ActivationTier): number {
  return (grossProfit(tier) / tier.retail) * 100;
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
