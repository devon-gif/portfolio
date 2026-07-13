// HSC × Archer Design — Hotel Portfolio Strategy Call booking.
// Central config, URL builder, and sales-team/round-robin logic for the
// dedicated booking flow used by every "Book a Strategy Call" button on
// /revenue-activation. See STRATEGY_CALL_BOOKING_SETUP.md for full setup.
//
// Mirrors the existing lib/scorecard.ts buildCalendlyUrl() pattern used by
// the Creative Gap Review funnel, but scoped to this website's own event
// and lead-source values.

/* ------------------------------------------------------------------ */
/* Permanent attribution constants — do not change these values. They  */
/* are the immutable identifiers that mark a lead as originating from  */
/* this website, independent of who ends up handling the call.         */
/* ------------------------------------------------------------------ */

export const STRATEGY_CALL_LEAD_SOURCE = "HSC_ARCHER_WEBSITE" as const;
export const STRATEGY_CALL_LEAD_SOURCE_LABEL = "HSC × Archer Design Website" as const;
export const STRATEGY_CALL_CAMPAIGN = "HOTEL_PORTFOLIO_PILOT" as const;

export const STRATEGY_CALL_UTM = {
  source: "hsc_archer_site",
  medium: "website",
  campaign: "hotel_portfolio_pilot",
} as const;

export const STRATEGY_CALL_EVENT_NAME =
  "HSC × Archer Design — Hotel Portfolio Strategy Call" as const;
export const STRATEGY_CALL_EVENT_SLUG = "hotel-portfolio-strategy" as const;

/** Base booking URL. Empty until Devon creates the dedicated Calendly event
 *  and sets NEXT_PUBLIC_STRATEGY_CALL_URL — every caller must handle "". */
export const STRATEGY_CALL_BASE_URL = (process.env.NEXT_PUBLIC_STRATEGY_CALL_URL ?? "").trim();

/* ------------------------------------------------------------------ */
/* Booking form / prefill                                              */
/* ------------------------------------------------------------------ */

export const PRIMARY_INTEREST_OPTIONS = [
  "Hotel sales and pipeline generation",
  "Creative and social support",
  "Restaurant and F&B promotion",
  "Meetings, weddings, and events",
  "Multi-property portfolio support",
  "Full sales and creative pilot",
  "Other",
] as const;

export type PrimaryInterest = (typeof PRIMARY_INTEREST_OPTIONS)[number];

export type CalculatorAttribution = {
  hotelCount?: number | null;
  perHotelMonthly?: number | null;
  estimatedMonthlyTotal?: number | null;
  ninetyDayEstimate?: number | null;
  estimatedSavings?: number | null;
  calculatorSource?: string | null; // e.g. "portfolio_calculator"
};

export type StrategyCallPrefill = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  companyWebsite?: string | null;
  phone?: string | null;
  hotelCount?: string | null;
  primaryInterest?: string | null;
  challenge?: string | null;
  notes?: string | null;
  landingPageUrl?: string | null;
  referrerUrl?: string | null;
  calculator?: CalculatorAttribution | null;
};

/**
 * Encode calculator attribution into a compact pipe-delimited string:
 * "hotelCount|estimatedMonthlyTotal|ninetyDayEstimate|estimatedSavings".
 * This rides in the Calendly `utm_term` param (see buildStrategyCallUrl)
 * because Calendly only reliably forwards utm_* fields, name/email, and
 * configured custom-question answers back through its webhook payload —
 * arbitrary extra query params are not stored or echoed. utm_content /
 * utm_term are standard UTM slots Calendly always captures, so reusing
 * them avoids needing an extra visible (if locked) custom question.
 */
export function encodeCalculatorAttribution(c: CalculatorAttribution): string {
  return [c.hotelCount ?? "", c.estimatedMonthlyTotal ?? "", c.ninetyDayEstimate ?? "", c.estimatedSavings ?? ""].join("|");
}

export function decodeCalculatorAttribution(raw: string | null | undefined): CalculatorAttribution | null {
  if (!raw) return null;
  const parts = raw.split("|");
  if (parts.length < 4) return null;
  const num = (s: string) => (s.trim() === "" ? null : Number(s));
  const hotelCount = num(parts[0]);
  const estimatedMonthlyTotal = num(parts[1]);
  const ninetyDayEstimate = num(parts[2]);
  const estimatedSavings = num(parts[3]);
  if (hotelCount == null && estimatedMonthlyTotal == null) return null;
  return { hotelCount, estimatedMonthlyTotal, ninetyDayEstimate, estimatedSavings };
}

/**
 * Build the dedicated Hotel Portfolio Strategy Call booking URL, with the
 * permanent UTM + lead-source tracking params plus (optionally) prefilled
 * invitee answers. Calendly reads `name`/`email` for the invitee and
 * `a1..aN` for custom invitee-question answers — configure the Calendly
 * event's custom questions in this exact order (see setup doc):
 *   a1 = Company / hotel group
 *   a2 = Number of hotels or properties
 *   a3 = Company website
 *   a4 = Phone number
 *   a5 = Primary area of interest
 *   a6 = Current marketing or sales challenge (optional)
 *   a7 = Anything we should know before the call? (optional)
 *
 * Calculator attribution (only present when booking from the portfolio
 * calculator) rides in utm_content ("portfolio_calculator") and utm_term
 * (see encodeCalculatorAttribution) rather than a custom question, since
 * those two UTM slots are always captured/forwarded by Calendly.
 *
 * landing_page_url / referrer_url are appended as plain query params for
 * completeness, but are NOT read back from the Calendly webhook payload —
 * Calendly does not forward arbitrary non-UTM, non-answer params. Treat
 * them as best-effort / for future use (e.g. a client-side beacon), not a
 * guaranteed data source. See STRATEGY_CALL_BOOKING_SETUP.md limitations.
 *
 * Returns "" if no base URL is configured yet (caller should fall back to
 * the existing mailto contact link rather than link to nothing).
 */
export function buildStrategyCallUrl(p: StrategyCallPrefill = {}): string {
  if (!STRATEGY_CALL_BASE_URL) return "";

  const params = new URLSearchParams();

  // Permanent, non-overridable attribution.
  params.set("utm_source", STRATEGY_CALL_UTM.source);
  params.set("utm_medium", STRATEGY_CALL_UTM.medium);
  params.set("utm_campaign", STRATEGY_CALL_UTM.campaign);
  params.set("lead_source", STRATEGY_CALL_LEAD_SOURCE);

  if (p.name) params.set("name", p.name);
  if (p.email) params.set("email", p.email);

  if (p.company) params.set("a1", p.company);
  if (p.hotelCount) params.set("a2", p.hotelCount);
  if (p.companyWebsite) params.set("a3", p.companyWebsite);
  if (p.phone) params.set("a4", p.phone);
  if (p.primaryInterest) params.set("a5", p.primaryInterest);
  if (p.challenge) params.set("a6", p.challenge);
  if (p.notes) params.set("a7", p.notes);

  if (p.calculator && (p.calculator.hotelCount != null || p.calculator.estimatedMonthlyTotal != null)) {
    params.set("utm_content", p.calculator.calculatorSource || "portfolio_calculator");
    params.set("utm_term", encodeCalculatorAttribution(p.calculator));
  }

  if (p.landingPageUrl) params.set("landing_page_url", p.landingPageUrl);
  if (p.referrerUrl) params.set("referrer_url", p.referrerUrl);

  const sep = STRATEGY_CALL_BASE_URL.includes("?") ? "&" : "?";
  return `${STRATEGY_CALL_BASE_URL}${sep}${params.toString()}`;
}

/* ------------------------------------------------------------------ */
/* Sales team + round-robin assignment                                 */
/* ------------------------------------------------------------------ */

export type SalesPerson = { name: string; email: string };

function splitEnvList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getWesam(): SalesPerson | null {
  const email = (process.env.WESAM_EMAIL ?? "").trim();
  if (!email) return null;
  return { name: (process.env.WESAM_NAME ?? "Wesam Metwalli").trim(), email };
}

export function getDevon(): SalesPerson | null {
  const email = (process.env.DEVON_EMAIL ?? "").trim();
  if (!email) return null;
  return { name: (process.env.DEVON_NAME ?? "Devon Archer").trim(), email };
}

/** Parallel SALES_TEAM_NAMES / SALES_TEAM_EMAILS env lists, zipped together.
 *  Falls back to [] (not Wesam) — callers decide the Wesam-only fallback so
 *  "no team configured" and "team configured but empty" stay distinguishable. */
export function getSalesTeam(): SalesPerson[] {
  const names = splitEnvList(process.env.SALES_TEAM_NAMES);
  const emails = splitEnvList(process.env.SALES_TEAM_EMAILS);
  const team: SalesPerson[] = [];
  emails.forEach((email, i) => {
    team.push({ name: names[i] || email, email });
  });
  return team;
}

export function getSalesNotificationEmail(): string | null {
  const email = (process.env.SALES_NOTIFICATION_EMAIL ?? "").trim();
  return email || null;
}

/**
 * Stateless round-robin: pick the assignee from SALES_TEAM_EMAILS by
 * position, cycling based on how many bookings already exist. Stateless on
 * purpose — no counter row to get out of sync, just
 * `existingBookingCount % teamSize`. Falls back to Wesam when no sales team
 * is configured. Returns null only if neither a sales team nor Wesam is
 * configured (caller must trigger the unassigned-booking fallback alert).
 */
export function assignSalesperson(existingBookingCount: number): SalesPerson | null {
  const team = getSalesTeam();
  if (team.length > 0) {
    const idx = ((existingBookingCount % team.length) + team.length) % team.length;
    return team[idx];
  }
  return getWesam();
}

/* ------------------------------------------------------------------ */
/* Booking status / pipeline vocabulary                                 */
/* ------------------------------------------------------------------ */

export const BOOKING_STATUSES = [
  "strategy_call_booked",
  "call_completed",
  "pilot_proposed",
  "pilot_signed",
  "expansion_opportunity",
  "closed_lost",
  "canceled",
  "rescheduled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PIPELINE_STAGES = [
  "Archer Site Lead",
  "Strategy Call Booked",
  "Call Completed",
  "Pilot Proposed",
  "Pilot Signed",
  "Expansion Opportunity",
  "Closed Lost",
] as const;

/* ------------------------------------------------------------------ */
/* Event title / description formatting                                */
/* ------------------------------------------------------------------ */

export function formatEventTitle(companyName?: string | null, prospectName?: string | null): string {
  const name = (prospectName || "").trim();
  const company = (companyName || "").trim();
  if (company) return `[ARCHER SITE LEAD] — ${company} — ${name || "Unknown prospect"}`;
  return `[ARCHER SITE LEAD] — Strategy Call with ${name || "Unknown prospect"}`;
}

export function formatEventDescription(d: {
  assignedName?: string | null;
  prospectName?: string | null;
  prospectEmail?: string | null;
  company?: string | null;
  companyWebsite?: string | null;
  hotelCount?: string | null;
  primaryInterest?: string | null;
  landingPageUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  bookingId?: string | null;
}): string {
  return [
    `Lead source: ${STRATEGY_CALL_LEAD_SOURCE_LABEL}`,
    `Original source code: ${STRATEGY_CALL_LEAD_SOURCE}`,
    `Campaign: Hotel Portfolio Pilot`,
    `Assigned sales owner: ${d.assignedName || "Unassigned"}`,
    `Prospect name: ${d.prospectName || "—"}`,
    `Prospect email: ${d.prospectEmail || "—"}`,
    `Company or hotel group: ${d.company || "—"}`,
    `Company website: ${d.companyWebsite || "—"}`,
    `Number of hotels: ${d.hotelCount || "—"}`,
    `Primary interest: ${d.primaryInterest || "—"}`,
    `Booking page URL: ${d.landingPageUrl || "—"}`,
    `UTM source: ${d.utmSource || "—"}`,
    `UTM medium: ${d.utmMedium || "—"}`,
    `UTM campaign: ${d.utmCampaign || "—"}`,
    `Booking ID: ${d.bookingId || "—"}`,
  ].join("\n");
}
