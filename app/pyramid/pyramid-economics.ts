// ─────────────────────────────────────────────────────────────────────────────
// pyramid-economics.ts — commercial-model data config for /pyramid's Partner
// Economics section and calculator. Same package figures ($800/$500 and
// $1,200/$800 per property per month) already approved and live on
// /first-hospitality (app/first-hospitality/first-hospitality-pricing.ts) --
// this is the same Archer Design production service, reused here with
// Pyramid-specific labels ("gross partner margin," not "keeps"), a wider
// property ceiling (230, matching Pyramid's actual published portfolio
// size), and Pyramid-specific copy. Nothing here imports from or is
// imported by /first-hospitality, so the two pages can never drift into
// each other by accident.
//
// Every formula lives here, once, as a plain function -- both the package
// cards and the calculator read from the same functions so the displayed
// numbers can never disagree with each other.
// ─────────────────────────────────────────────────────────────────────────────

export type PyramidPackageKey = "creative" | "managed";

export type PyramidPackage = {
  key: PyramidPackageKey;
  name: string;
  positioning: string;
  /** Amount the participating owner/property pays, per property per month. */
  ownerPays: number;
  /** Archer Design's agreed production rate, per property per month. */
  archerRate: number;
  includesHeading?: string;
  includes: string[];
  footnote?: string;
};

const CREATIVE_OWNER_PAYS = 800;
const CREATIVE_ARCHER_RATE = 500;
const MANAGED_OWNER_PAYS = 1200;
const MANAGED_ARCHER_RATE = 800;

export const MONTHLY_MOTION_ASSETS = 4;
export const MONTHLY_STATIC_ASSETS = 2;

export const PYRAMID_PACKAGES: PyramidPackage[] = [
  {
    key: "creative",
    name: "Creative Production",
    positioning: "For properties that can publish internally but need a dependable monthly supply of polished motion and campaign creative.",
    ownerPays: CREATIVE_OWNER_PAYS,
    archerRate: CREATIVE_ARCHER_RATE,
    includes: [
      "4 motion concepts per month",
      "2 static campaign graphics per month",
      "Standard social-format exports",
      "Promotional text incorporated into approved designs",
      "Brand-safe production using approved property photography",
      "One consolidated round of minor revisions",
      "Delivery organized through Pyramid",
    ],
    footnote: "Defined monthly production capacity. Additional formats, revisions, complex editing, or campaign requirements would be scoped separately.",
  },
  {
    key: "managed",
    name: "Managed Creative & Social",
    positioning: "For properties that want the same monthly creative production plus planning, writing, scheduling, and reporting support.",
    ownerPays: MANAGED_OWNER_PAYS,
    archerRate: MANAGED_ARCHER_RATE,
    includesHeading: "Everything in Creative Production, plus:",
    includes: [
      "Captions and promotional copy",
      "Monthly content calendar",
      "Scheduling to up to 2 approved social platforms",
      "Monthly performance snapshot",
      "Delivery and workflow organized through Pyramid",
    ],
    footnote: "Creative output remains 4 motion concepts and 2 static graphics per participating property each month.",
  },
];

export const DEFAULT_PACKAGE_KEY: PyramidPackageKey = "creative";

export function packageByKey(key: string | undefined): PyramidPackage {
  return PYRAMID_PACKAGES.find((p) => p.key === key) ?? PYRAMID_PACKAGES.find((p) => p.key === DEFAULT_PACKAGE_KEY)!;
}

export function monthlyMargin(pkg: PyramidPackage): number {
  return pkg.ownerPays - pkg.archerRate;
}
export function annualMargin(pkg: PyramidPackage): number {
  return monthlyMargin(pkg) * 12;
}
export function marginPct(pkg: PyramidPackage): number {
  return (monthlyMargin(pkg) / pkg.ownerPays) * 100;
}

// Calculator range. 230 matches Pyramid Global Hospitality's own publicly
// presented portfolio size (see pyramid-content.ts SCALE_GROUPS) -- used
// only as an illustrative slider ceiling, never as an implied or committed
// participation count.
export const MAX_PARTICIPATING_PROPERTIES = 230;
export const DEFAULT_PARTICIPATING_PROPERTIES = 3;
export const PILOT_PROPERTY_COUNT_RANGE = "three to five";

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
export const PARTNER_ECONOMICS_HEADING = "What Pyramid retains.";
export const PARTNER_ECONOMICS_COPY =
  "For each participating property, the owner purchases an approved monthly creative package. Pyramid pays Archer the agreed production rate and retains the difference as gross partner margin.";
export const PARTNER_ECONOMICS_HIGHLIGHT = "Participating owner pays. Archer produces. Pyramid retains the difference.";
export const PARTNER_ECONOMICS_QUALIFICATION =
  "Amounts shown represent illustrative gross margin before Pyramid's administrative, billing, sales, legal, tax, account-management, or internal servicing costs.";
export const PARTNER_ECONOMICS_APPROVAL_NOTE =
  "Any owner-facing program, pricing structure, billing method, margin, approved-vendor arrangement, or management-service model would require Pyramid's approval and a written agreement.";

/* ── Calculator copy ──────────────────────────────────────────────────── */
export const CALC_SCENARIO_LABEL = "Illustrative commercial scenario";
export const CALC_DISCLAIMER_1 =
  "This scenario assumes that every selected property participates for the full displayed period. It is not a forecast of adoption, revenue, retention, net income, or profit.";
export const CALC_DISCLAIMER_2 =
  "Figures represent illustrative gross partner margin before Pyramid's administrative, billing, sales, account-management, legal, tax, or internal servicing costs.";
export const CALC_DISCLAIMER_3 =
  "Final pricing, scope, production rates, billing structure, owner participation, and company margin would be negotiated and documented in writing.";

/* ── Money-flow diagram ───────────────────────────────────────────────── */
export const MONEY_FLOW_LABEL = "Illustrative structure — subject to approval and written agreement.";
export const MONEY_FLOW_STEPS = [
  { title: "Participating owner or property", body: "Pays the approved monthly package." },
  { title: "Pyramid-administered program", body: "Receives payment and manages the approved commercial relationship." },
  { title: "Archer Design", body: "Receives the agreed production rate and completes the defined deliverables." },
  { title: "Pyramid", body: "Retains the agreed gross partner margin." },
  { title: "Participating property", body: "Receives finished assets under Pyramid's standards." },
];

/* ── Owner / Pyramid / Archer value columns ──────────────────────────── */
export const VALUE_COLUMNS = [
  {
    key: "owner",
    title: "Owner value",
    points: [
      "More commercial use from photography already purchased",
      "Predictable monthly creative output",
      "Motion and campaign assets without hiring internally",
      "Optional participation",
      "Defined scope and pricing",
    ],
  },
  {
    key: "pyramid",
    title: "Pyramid value",
    points: [
      "Stronger property-level creative execution",
      "An additional approved service for owners",
      "Greater consistency and production capacity",
      "Gross partner-margin opportunity",
      "No need to build a new full-time motion department",
    ],
  },
  {
    key: "archer",
    title: "Archer value",
    points: [
      "Repeatable production workflow",
      "Consolidated intake and feedback",
      "Defined monthly deliverables",
      "Access to participating properties through an approved relationship",
    ],
  },
];

/* ── Hero commercial-clarity line ─────────────────────────────────────── */
export const HERO_COMMERCIAL_CLARITY =
  "Pyramid can use Archer as internal production capacity or offer the service to participating owners, who fund the selected package while Pyramid retains an agreed gross partner margin.";
