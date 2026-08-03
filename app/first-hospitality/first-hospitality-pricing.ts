// ─────────────────────────────────────────────────────────────────────────────
// first-hospitality-pricing.ts — package economics for the /first-hospitality
// owner-service model, reused verbatim from the currently approved /topline
// Creative Activation / Managed Social economics (app/topline/page.tsx,
// CREATIVE_RETAIL_PRICE/CREATIVE_WHOLESALE_COST/MANAGED_RETAIL_PRICE/
// MANAGED_WHOLESALE_COST), because this is the same Archer Design production
// service (a monthly package of original motion + static creative, wholesaled
// through a partner at a fixed per-property rate) being proposed here under
// First Hospitality's own owner-service framing.
//
// Nothing below invents a new dollar figure. Retail price, wholesale cost,
// and the 4-motion/2-static monthly asset count are copied exactly from
// /topline; only descriptions, labels, and "hotel" -> "property" /
// "Topline" -> "First Hospitality" wording were adapted. app/topline/page.tsx
// itself was not read from at runtime and is not imported here, so nothing
// in this file can ever change /topline's behavior, and nothing in /topline
// depends on this file.
//
// Single source of truth for app/first-hospitality/page.tsx (package cards,
// partner-economics cards) and FirstHospitalityRevenueCalculator.tsx, so the
// two can never drift from each other.
// ─────────────────────────────────────────────────────────────────────────────

export type FirstHospitalityPackageKey = "creative" | "managed";

export type FirstHospitalityPackage = {
  key: FirstHospitalityPackageKey;
  name: string;
  /** One-line positioning, adapted from Topline's Creative Activation / Managed Social copy. */
  positioning: string;
  /** Owner-facing (client-facing) price, per property per month. Exact figure reused from /topline. */
  retail: number;
  /** Archer Design's contracted production rate, per property per month. Exact figure reused from /topline. */
  wholesale: number;
  /** Optional lead-in shown above `includes`, e.g. "Everything in Creative Production, plus:" */
  includesHeading?: string;
  includes: string[];
  /** Optional small italic footnote shown below `includes`. */
  footnote?: string;
};

// ── Exact figures reused from /topline (CREATIVE_RETAIL_PRICE = 800, ── //
// CREATIVE_WHOLESALE_COST = 500, MANAGED_RETAIL_PRICE = 1200,
// MANAGED_WHOLESALE_COST = 800). Do not edit these without re-confirming
// against app/topline/page.tsx first -- see file header above.
const CREATIVE_RETAIL = 800;
const CREATIVE_WHOLESALE = 500;
const MANAGED_RETAIL = 1200;
const MANAGED_WHOLESALE = 800;

/* Every participating property receives the same 4 motion + 2 static = 6
   original creative assets each month under either package, exactly as on
   /topline -- the packages differ only in the management layer on top,
   never in creative quantity. */
export const MONTHLY_MOTION_ASSETS = 4;
export const MONTHLY_STATIC_ASSETS = 2;
export const MONTHLY_TOTAL_ASSETS = MONTHLY_MOTION_ASSETS + MONTHLY_STATIC_ASSETS;

export const FIRST_HOSPITALITY_PACKAGES: FirstHospitalityPackage[] = [
  {
    key: "creative",
    name: "Creative Production",
    positioning:
      "For properties that can publish on their own but need a steady supply of high-quality creative.",
    retail: CREATIVE_RETAIL,
    wholesale: CREATIVE_WHOLESALE,
    includes: [
      "4 motion concepts + 2 static graphics",
      "Standard social-format exports",
      "Promotional text built into the designs",
      "Brand-safe execution using approved property imagery",
      "One consolidated round of minor revisions",
      "Delivery organized through First Hospitality",
    ],
  },
  {
    key: "managed",
    name: "Managed Creative & Social",
    positioning:
      "For properties that want the same creative plus the monthly planning, writing, scheduling, and reporting.",
    retail: MANAGED_RETAIL,
    wholesale: MANAGED_WHOLESALE,
    includesHeading: "Everything in Creative Production, plus:",
    includes: [
      "Captions and promotional copy",
      "A monthly content calendar",
      "Scheduling to up to 2 approved social platforms",
      "A monthly performance snapshot",
      "Delivery organized through First Hospitality",
    ],
    footnote: "Creative output is identical to Package 1: 4 motion concepts + 2 static graphics per month.",
  },
];

export const DEFAULT_PACKAGE_KEY: FirstHospitalityPackageKey = "creative";

export function packageByKey(key: string | undefined): FirstHospitalityPackage {
  return (
    FIRST_HOSPITALITY_PACKAGES.find((p) => p.key === key) ??
    FIRST_HOSPITALITY_PACKAGES.find((p) => p.key === DEFAULT_PACKAGE_KEY)!
  );
}

export function monthlyMargin(pkg: FirstHospitalityPackage): number {
  return pkg.retail - pkg.wholesale;
}
export function annualMargin(pkg: FirstHospitalityPackage): number {
  return monthlyMargin(pkg) * 12;
}
export function marginPct(pkg: FirstHospitalityPackage): number {
  return (monthlyMargin(pkg) / pkg.retail) * 100;
}

// Calculator range. First Hospitality's own publicly presented portfolio
// figure (55 hotels, see first-hospitality-content.ts PORTFOLIO_STATS) is
// used as the illustrative slider ceiling, never as an implied or committed
// participation count.
export const MAX_PARTICIPATING_PROPERTIES = 55;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;

// Recommended pilot size (two hotels + one restaurant/bar = 3 properties).
export const PILOT_PROPERTY_COUNT = 3;

export function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
export function fmtPct(n: number): string {
  return `${Math.round(n * 10) / 10}%`;
}
