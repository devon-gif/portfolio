// Shared pricing data for /tcrm. Single source of truth so
// app/tcrm/page.tsx, app/tcrm/schedule/page.tsx, and every package/chooser
// component never duplicate a number that could drift. Every derived
// figure (platform-ready file counts, custom-pack totals) is computed
// from these base inputs rather than hardcoded a second time.
//
// TCRM_CLIENT_PRICING is the one place the OFFICIAL, approved, client-
// facing prices live -- these are what the hotel pays. This file
// separately tracks Archer Design's internal wholesale cost per tier
// (ActivationTier.wholesale) purely for Archer's own historical
// record-keeping; it is never read by any client-facing component and
// must never be rendered. No commission/margin split percentage is
// stored anywhere in this codebase.
export const TCRM_CLIENT_PRICING = {
  static: 75,
  motion: 95,
  starter: 895,
  essential: 895,
  growth: 1295,
  fullCampaign: 1695,
} as const;

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
    name: "Essential",
    retail: TCRM_CLIENT_PRICING.essential,
    wholesale: 625,
    motionConcepts: 6,
    staticConcepts: 6,
    captions: 12,
    features: ["Recommended posting order"],
    bestFor: "For properties that need a dependable monthly stream of polished creative.",
  },
  {
    key: "growth",
    name: "Growth",
    badge: "Recommended",
    retail: TCRM_CLIENT_PRICING.growth,
    wholesale: 750,
    motionConcepts: 9,
    staticConcepts: 9,
    captions: 18,
    features: ["Recommended 30-day activation calendar", "One rapid-turn campaign adaptation during the month"],
    bestFor: "For active hotels with multiple revenue moments to promote each month.",
  },
  {
    key: "full",
    name: "Full Campaign",
    retail: TCRM_CLIENT_PRICING.fullCampaign,
    wholesale: 950,
    motionConcepts: 12,
    staticConcepts: 12,
    captions: 24,
    features: [
      "Recommended 30-day activation calendar",
      "Two rapid-turn campaign adaptations during the month",
      "Priority production scheduling",
    ],
    bestFor: "For properties with F&B, meetings, events, seasonal campaigns and higher creative volume.",
  },
];

/* ── Client-facing purchase options beyond the three monthly plans ────────
   Two flexible, lower-commitment ways to start, shown in their own
   "Flexible ways to start" row on /tcrm. Neither one invents pricing:
   both read from TCRM_CLIENT_PRICING above. */

export const STARTER_PLAN_KEY = "starter" as const;

/** The 30-Day Creative Starter is priced and scoped identically to one
 * month of Essential ($895) -- this is intentional, not a bug. The
 * distinction between the two is duration/commitment, not price: Starter
 * is one time with no continuation required, Essential is the ongoing
 * monthly program. Never a separately hardcoded number here. */
export function starterTier(): ActivationTier {
  return ACTIVATION_TIERS.find((t) => t.key === "essential")!;
}

export const STARTER_PLAN_COPY = {
  name: "30-Day Creative Starter",
  microLabel: "No ongoing commitment required",
  bestFor: "Hotels that want to try the creative workflow on their actual property before deciding whether to continue monthly.",
  bullets: [
    "One property",
    "One defined 30-day creative period",
    "Essential-level production scope for that period",
    "Built from your property's real assets and offers",
    "No ongoing commitment required",
  ],
  continueNote: "Option to continue afterward into Essential, Growth, or Full Campaign, whenever you're ready.",
};

export const CUSTOM_PACK_KEY = "custom" as const;
export const CUSTOM_PACK_BOUNDS = { min: 1, max: 10, defaultTotal: 6, defaultMotion: 2 };

export const CUSTOM_PACK_COPY = {
  name: "Build Your Own Creative Pack",
  intro: "Need only a few pieces right now? Choose the exact mix of static and motion creative your property needs.",
  bestFor: "Hotels that need a defined set of finished assets without a monthly program.",
  summaryPoints: [
    "Built for one property",
    "One defined campaign period",
    "One revision round",
    "Finished, campaign-ready files",
  ],
};

// OFFICIAL, approved, client-facing per-asset pricing. The hotel pays
// exactly these two numbers -- no wholesale cost, margin, or commission
// split is stored here or anywhere else in this file.
export const ASSET_PRICING: { static: number; motion: number } = {
  static: TCRM_CLIENT_PRICING.static,
  motion: TCRM_CLIENT_PRICING.motion,
};

export function customPackTotal(staticCount: number, motionCount: number): number {
  return staticCount * ASSET_PRICING.static + motionCount * ASSET_PRICING.motion;
}

// When a custom pack's total approaches the Essential monthly price, it's
// worth surfacing the ongoing plan as a possibly better-value option.
// This is a suggestion only -- it never blocks the purchase or changes
// the client's selection.
export const CUSTOM_PACK_UPSELL_THRESHOLD = 800;

/** One-line "which option fits" comparison scale, in display order:
 * flexible starters first, then the three ongoing monthly plans. */
export const PLAN_COMPARISON: {
  key: string;
  name: string;
  blurb: string;
  recommended?: boolean;
}[] = [
  { key: STARTER_PLAN_KEY, name: "30-Day Starter", blurb: "Best for testing the workflow" },
  { key: CUSTOM_PACK_KEY, name: "Build Your Own", blurb: "Best for one-off needs" },
  { key: "essential", name: "Essential", blurb: "Best for consistent monthly visibility" },
  { key: "growth", name: "Growth", blurb: "Best for active properties", recommended: true },
  { key: "full", name: "Full Campaign", blurb: "Best for high-volume, multi-revenue-center properties" },
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

/* ── Client journey / CTA plan parameters ──────────────────────────────────
   Choose plan -> TCRM checkout -> payment to TCRM -> property onboarding ->
   creative kickoff. These helpers build/parse the ?tcrmPlan= query param
   so a selected plan (and, for the custom pack, its static/motion mix and
   total) can be carried forward into that flow even before checkout is
   fully connected. Only the client-facing total is ever put in the URL --
   no wholesale cost, margin, or commission data. */
export type TcrmPlanSlug = "essential" | "growth" | "full-campaign" | "starter" | "custom";

export function tcrmPlanSlug(key: TierKey | "starter" | "custom"): TcrmPlanSlug {
  if (key === "full") return "full-campaign";
  return key as TcrmPlanSlug;
}

export function tierKeyFromSlug(slug: string | undefined): TierKey | undefined {
  if (slug === "full-campaign") return "full";
  if (slug === "essential" || slug === "growth") return slug;
  return undefined;
}

// Shown near the recurring plans and in the footer -- hotels are never
// locked into a long-term agreement they can't get out of.
export const CANCELLATION_NOTE = "Cancel your recurring plan anytime through your TCRM contact. No long-term contract required.";
