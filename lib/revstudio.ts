// The Revstudio × Archer Design — partner landing page booking config.
// Central attribution constants, booking-URL builder, and content-facing
// helpers for /revstudio. Mirrors lib/strategy-call.ts (the HSC × Archer
// Design booking system) so both programs share the same underlying
// Supabase table, Calendly signature verification, and email-sending
// infrastructure — see app/api/webhooks/strategy-call/route.ts, which
// branches on the UTM pair below to tell the two programs apart, and
// lib/strategy-call-notify.ts, which exposes a Revstudio-specific notify
// function alongside the original HSC one.
//
// This is an early, unapproved partnership page — see
// REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md for what still needs Ghisela's and
// Devon's sign-off before REVSTUDIO_PAGE_APPROVED is flipped to true.

/* ------------------------------------------------------------------ */
/* Permanent attribution constants — do not change these values.       */
/* ------------------------------------------------------------------ */

export const REVSTUDIO_LEAD_SOURCE = "ARCHER_REVSTUDIO_PAGE" as const;
export const REVSTUDIO_LEAD_SOURCE_LABEL = "The Revstudio × Archer Design landing page" as const;
export const REVSTUDIO_CAMPAIGN = "revstudio_joint_offer" as const;

export const REVSTUDIO_UTM = {
  source: "archerdesign_shop",
  medium: "partner_landing_page",
  campaign: "revstudio_joint_offer",
} as const;

/** Base booking URL. Empty until a dedicated Revstudio × Archer Calendly
 *  event exists and NEXT_PUBLIC_REVSTUDIO_BOOKING_URL is set — every caller
 *  must handle "" (fall back to a mailto contact link, never a dead link). */
export const REVSTUDIO_BOOKING_URL = (process.env.NEXT_PUBLIC_REVSTUDIO_BOOKING_URL ?? "").trim();

/** Safe fallback contact used everywhere the booking URL isn't configured
 *  yet. Never expose internal tracking codes in the visible mailto subject. */
export const REVSTUDIO_FALLBACK_MAILTO =
  "mailto:hello@archerdesign.shop?subject=The%20Revstudio%20%C3%97%20Archer%20Design%20%E2%80%94%20Pilot%20Conversation";

/** Public contact email shown in the footer / final CTA. Falls back to the
 *  shared Archer inbox until a dedicated Revstudio address is configured —
 *  see NEXT_PUBLIC_REVSTUDIO_CONTACT_EMAIL in .env.example. */
export const REVSTUDIO_CONTACT_EMAIL = (process.env.NEXT_PUBLIC_REVSTUDIO_CONTACT_EMAIL ?? "hello@archerdesign.shop").trim();

/* ------------------------------------------------------------------ */
/* Booking form / prefill                                              */
/* ------------------------------------------------------------------ */

export const ENTITY_TYPE_OPTIONS = [
  "Hotel",
  "Hotel management group",
  "Revenue-management agency",
  "Other",
] as const;

export type EntityType = (typeof ENTITY_TYPE_OPTIONS)[number];

export const REVSTUDIO_SERVICE_INTEREST_OPTIONS = [
  "Revenue & distribution operations",
  "Creative execution",
  "Both — combined pilot",
  "Not sure yet",
] as const;

export type RevstudioPrefill = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  companyWebsite?: string | null;
  entityType?: string | null;
  propertyCount?: string | null;
  opportunity?: string | null;
  serviceInterest?: string | null;
  landingPageUrl?: string | null;
  referrerUrl?: string | null;
};

/**
 * Build the Revstudio × Archer Design booking URL with permanent UTM +
 * lead-source attribution, plus optional prefilled invitee answers.
 * Configure the dedicated Calendly event's custom questions in this exact
 * order (see setup doc):
 *   a1 = Company or hotel group
 *   a2 = Are you a hotel, hotel group, or revenue-management agency?
 *   a3 = Approximately how many properties are involved?
 *   a4 = What commercial or creative opportunity would you like to discuss?
 *   a5 = Which area needs the most support?
 *   a6 = Company website
 *
 * Returns "" if no base URL is configured yet — callers must fall back to
 * REVSTUDIO_FALLBACK_MAILTO rather than link to nothing.
 */
export function buildRevstudioBookingUrl(p: RevstudioPrefill = {}): string {
  if (!REVSTUDIO_BOOKING_URL) return "";

  const params = new URLSearchParams();

  // Permanent, non-overridable attribution.
  params.set("utm_source", REVSTUDIO_UTM.source);
  params.set("utm_medium", REVSTUDIO_UTM.medium);
  params.set("utm_campaign", REVSTUDIO_UTM.campaign);
  params.set("lead_source", REVSTUDIO_LEAD_SOURCE);

  if (p.name) params.set("name", p.name);
  if (p.email) params.set("email", p.email);

  if (p.company) params.set("a1", p.company);
  if (p.entityType) params.set("a2", p.entityType);
  if (p.propertyCount) params.set("a3", p.propertyCount);
  if (p.opportunity) params.set("a4", p.opportunity);
  if (p.serviceInterest) params.set("a5", p.serviceInterest);
  if (p.companyWebsite) params.set("a6", p.companyWebsite);

  if (p.landingPageUrl) params.set("landing_page_url", p.landingPageUrl);
  if (p.referrerUrl) params.set("referrer_url", p.referrerUrl);

  const sep = REVSTUDIO_BOOKING_URL.includes("?") ? "&" : "?";
  return `${REVSTUDIO_BOOKING_URL}${sep}${params.toString()}`;
}

/* ------------------------------------------------------------------ */
/* Notification recipients                                             */
/* ------------------------------------------------------------------ */

export type NotifyPerson = { label: string; email: string };

export function getRevstudioDevon(): NotifyPerson | null {
  const email = (process.env.REVSTUDIO_DEVON_EMAIL ?? "").trim();
  if (!email) return null;
  return { label: "Devon (Archer Design)", email };
}

export function getRevstudioGhisela(): NotifyPerson | null {
  const email = (process.env.REVSTUDIO_GHISELA_EMAIL ?? "").trim();
  if (!email) return null;
  return { label: "Ghisela (The Revstudio)", email };
}

export function getRevstudioNotificationEmail(): string | null {
  const email = (process.env.REVSTUDIO_NOTIFICATION_EMAIL ?? "").trim();
  return email || null;
}

export function getRevstudioSharedCalendarId(): string | null {
  const id = (process.env.REVSTUDIO_SHARED_CALENDAR_ID ?? "").trim();
  return id || null;
}

/** Page-approval gate. Defaults to false (noindex, not in nav/sitemap) —
 *  requires an explicit "true" to publish. See REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md. */
export function isRevstudioPageApproved(): boolean {
  return (process.env.REVSTUDIO_PAGE_APPROVED ?? "").trim().toLowerCase() === "true";
}

/* ------------------------------------------------------------------ */
/* Event title / description formatting                                */
/* ------------------------------------------------------------------ */

export function formatRevstudioEventTitle(companyName?: string | null, prospectName?: string | null): string {
  const name = (prospectName || "").trim();
  const company = (companyName || "").trim();
  if (company) return `[REVSTUDIO x ARCHER LEAD] — ${company} — ${name || "Unknown prospect"}`;
  return `[REVSTUDIO x ARCHER LEAD] — Pilot conversation with ${name || "Unknown prospect"}`;
}
