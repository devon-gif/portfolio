// Strategy-call booking notifications — SERVER ONLY. Best-effort: never
// throws, never blocks the webhook response. Mirrors lib/lead-notify.ts but
// fans out to multiple recipients (assigned salesperson, Wesam, Devon, the
// shared sales inbox) and optionally posts to Slack if SLACK_WEBHOOK_URL is
// configured. Skips silently (per-recipient) when env vars aren't set.
import { sendEmail } from "@/lib/sending";
import { SITE_URL } from "@/lib/seo";
import {
  STRATEGY_CALL_LEAD_SOURCE_LABEL,
  getWesam,
  getDevon,
  getSalesNotificationEmail,
  type SalesPerson,
} from "@/lib/strategy-call";
import {
  REVSTUDIO_LEAD_SOURCE_LABEL,
  getRevstudioDevon,
  getRevstudioGhisela,
  getRevstudioNotificationEmail,
} from "@/lib/revstudio";

export type StrategyCallNotifyData = {
  bookingId: string;
  companyName?: string | null;
  prospectName?: string | null;
  prospectEmail?: string | null;
  hotelCount?: string | null;
  primaryInterest?: string | null;
  challenge?: string | null;
  notes?: string | null;
  scheduledStartAt?: string | null; // ISO
  visitorTimezone?: string | null;
  assignedSalesperson?: SalesPerson | null;
  calendarLink?: string | null;
  crmLeadLink?: string | null;
  calculator?: {
    hotelCount?: number | null;
    estimatedMonthlyTotal?: number | null;
    ninetyDayEstimate?: number | null;
    estimatedSavings?: number | null;
  } | null;
};

function fmtTime(iso?: string | null, tz?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZoneName: "short",
    };
    if (tz) opts.timeZone = tz;
    return d.toLocaleString("en-US", opts);
  } catch {
    return iso;
  }
}

function buildBody(d: StrategyCallNotifyData): string {
  const who = d.companyName || "Unknown company";
  const lines = [
    `New HSC × Archer website lead booked.`,
    "",
    `Prospect: ${d.prospectName || "—"}`,
    `Email: ${d.prospectEmail || "—"}`,
    `Company: ${who}`,
    `Number of properties: ${d.hotelCount || "—"}`,
    `Scheduled: ${fmtTime(d.scheduledStartAt, d.visitorTimezone)}`,
    `Assigned salesperson: ${d.assignedSalesperson ? `${d.assignedSalesperson.name} <${d.assignedSalesperson.email}>` : "UNASSIGNED"}`,
    `Primary interest: ${d.primaryInterest || "—"}`,
    d.challenge ? `Current challenge: ${d.challenge}` : "",
    d.notes ? `Notes: ${d.notes}` : "",
  ];
  if (d.calculator && (d.calculator.hotelCount != null || d.calculator.estimatedMonthlyTotal != null)) {
    lines.push(
      "",
      "Portfolio calculator context:",
      d.calculator.hotelCount != null ? `  Hotels selected: ${d.calculator.hotelCount}` : "",
      d.calculator.estimatedMonthlyTotal != null ? `  Estimated monthly total: $${d.calculator.estimatedMonthlyTotal.toLocaleString()}` : "",
      d.calculator.ninetyDayEstimate != null ? `  90-day pilot estimate: $${d.calculator.ninetyDayEstimate.toLocaleString()}` : "",
      d.calculator.estimatedSavings != null ? `  Estimated volume savings: $${d.calculator.estimatedSavings.toLocaleString()}` : "",
    );
  }
  lines.push(
    "",
    d.calendarLink ? `Calendar link: ${d.calendarLink}` : "",
    d.crmLeadLink ? `CRM lead link: ${d.crmLeadLink}` : `CRM lead link: ${SITE_URL}/scorecard-submissions`,
    `Source: ${STRATEGY_CALL_LEAD_SOURCE_LABEL}`,
    `Booking ID: ${d.bookingId}`,
  );
  return lines.filter((l) => l !== "").join("\n").replace(/\n{3,}/g, "\n\n");
}

async function safeSend(to: string, subject: string, text: string): Promise<boolean> {
  try {
    await sendEmail({ to, subject, text });
    return true;
  } catch (err) {
    console.error(`Strategy-call notification failed for ${to}:`, err);
    return false;
  }
}

async function postSlack(text: string): Promise<void> {
  const url = (process.env.SLACK_WEBHOOK_URL ?? "").trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("Strategy-call Slack notification failed:", err);
  }
}

/**
 * Notify the assigned salesperson, Wesam, Devon, and the shared sales inbox
 * (whichever of those are configured) that a new website lead booked a
 * strategy call. Never throws — a notification failure must not lose the
 * booking record, which is already saved by the caller before this runs.
 */
export async function sendStrategyCallNotification(d: StrategyCallNotifyData): Promise<{ sent: string[]; failed: string[] }> {
  const who = d.companyName || d.prospectName || "Unknown";
  const subject = `NEW ARCHER WEBSITE LEAD — Strategy Call Booked — ${who}`;
  const text = buildBody(d);

  const recipients = new Map<string, string>(); // email -> label, de-duped
  if (d.assignedSalesperson?.email) recipients.set(d.assignedSalesperson.email.toLowerCase(), d.assignedSalesperson.email);
  const wesam = getWesam();
  if (wesam) recipients.set(wesam.email.toLowerCase(), wesam.email);
  const devon = getDevon();
  if (devon) recipients.set(devon.email.toLowerCase(), devon.email);
  const shared = getSalesNotificationEmail();
  if (shared) recipients.set(shared.toLowerCase(), shared);

  const sent: string[] = [];
  const failed: string[] = [];
  for (const email of recipients.values()) {
    const ok = await safeSend(email, subject, text);
    (ok ? sent : failed).push(email);
  }

  await postSlack(
    [
      "New HSC × Archer website lead booked",
      `Company: ${d.companyName || "—"}`,
      `Prospect: ${d.prospectName || "—"}`,
      `Hotels: ${d.hotelCount || "—"}`,
      `Interest: ${d.primaryInterest || "—"}`,
      `Call time: ${fmtTime(d.scheduledStartAt, d.visitorTimezone)}`,
      `Assigned to: ${d.assignedSalesperson ? d.assignedSalesperson.name : "UNASSIGNED"}`,
      `Source: ${STRATEGY_CALL_LEAD_SOURCE_LABEL}`,
    ].join("\n")
  );

  return { sent, failed };
}

/**
 * Fallback alert when no salesperson could be assigned (sales team +
 * Wesam both unconfigured, or another assignment failure). Always targets
 * Wesam and Devon directly so the lead is never silently unassigned.
 */
export async function sendUnassignedBookingAlert(d: StrategyCallNotifyData): Promise<void> {
  const subject = "ACTION REQUIRED — Unassigned Archer Website Strategy Call";
  const text = [
    "A new HSC × Archer website strategy call booked, but no salesperson could be automatically assigned.",
    "Check WESAM_EMAIL / SALES_TEAM_EMAILS / SALES_TEAM_NAMES configuration.",
    "",
    buildBody(d),
  ].join("\n");

  const wesam = getWesam();
  const devon = getDevon();
  const targets = [wesam?.email, devon?.email].filter((e): e is string => !!e);
  if (targets.length === 0) {
    console.error("Unassigned strategy-call booking, and no WESAM_EMAIL/DEVON_EMAIL configured to alert:", d.bookingId);
    return;
  }
  for (const email of targets) {
    await safeSend(email, subject, text);
  }
  await postSlack(`:rotating_light: ${subject}\n${d.companyName || d.prospectName || "Unknown"} — booking ID ${d.bookingId}`);
}

/* ------------------------------------------------------------------ */
/* Direct strategy-call REQUEST form (POST /api/strategy-call) —       */
/* /revenue-activation's "Book a Strategy Call" modal. Distinct from   */
/* sendStrategyCallNotification above, which fires from the Calendly   */
/* webhook once a specific call time has been scheduled. This fires    */
/* immediately on form submit, before any call time exists — the       */
/* wording below makes clear a human still needs to reach out.         */
/* ------------------------------------------------------------------ */

export type StrategyCallRequestData = {
  bookingId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  companyOrProperty: string;
  role: string;
  propertyCount?: string | null;
  website?: string | null;
  primaryInterest?: string | null;
  message?: string | null;
  submittedAt: string; // ISO
};

// Exact recipients required for every direct strategy-call request,
// regardless of SALES_TEAM_EMAILS/SALES_NOTIFICATION_EMAIL configuration —
// mirrors the literal addresses used by the page's "Book a Strategy Call"
// mailto CTAs elsewhere on this site.
const REQUEST_INTERNAL_RECIPIENTS = ["wesam@hotelsalesconsultants.com", "hello@archerdesign.shop"] as const;

function fmtSubmittedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

function buildRequestInternalBody(d: StrategyCallRequestData): string {
  return [
    "A new strategy call request came in through the HSC × Archer Design website form.",
    "Wesam and Devon need to review this request and reach out to coordinate a Microsoft Teams or Google Meet conversation — no call time has been scheduled yet.",
    "",
    `Full name: ${d.fullName}`,
    `Email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : "",
    `Hotel, property, or management company: ${d.companyOrProperty}`,
    `Role: ${d.role}`,
    d.propertyCount ? `Number of properties: ${d.propertyCount}` : "",
    d.website ? `Website: ${d.website}` : "",
    `Primary area of interest: ${d.primaryInterest || "—"}`,
    `Message: ${d.message || "—"}`,
    "",
    `Submitted: ${fmtSubmittedAt(d.submittedAt)}`,
    "Source page: HSC × Archer Design Revenue Activation",
    `Request ID: ${d.bookingId}`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

/**
 * Notify Wesam and Devon (and, if configured, the shared sales inbox) that a
 * visitor submitted the direct strategy-call request form. Never throws — a
 * notification failure must not undo the already-saved database row.
 */
export async function sendStrategyCallRequestNotification(
  d: StrategyCallRequestData
): Promise<{ sent: string[]; failed: string[] }> {
  const subject = `New HSC × Archer Design strategy call request — ${d.companyOrProperty}`;
  const text = buildRequestInternalBody(d);

  const recipients = new Set<string>(REQUEST_INTERNAL_RECIPIENTS);
  const shared = getSalesNotificationEmail();
  if (shared) recipients.add(shared);

  const sent: string[] = [];
  const failed: string[] = [];
  for (const email of recipients) {
    const ok = await safeSend(email, subject, text);
    (ok ? sent : failed).push(email);
  }

  await postSlack(
    [
      "New HSC × Archer Design strategy call request (website form)",
      `Company: ${d.companyOrProperty}`,
      `Name: ${d.fullName}`,
      `Email: ${d.email}`,
      `Interest: ${d.primaryInterest || "—"}`,
      `Submitted: ${fmtSubmittedAt(d.submittedAt)}`,
    ].join("\n")
  );

  return { sent, failed };
}

/**
 * Confirmation email to the person who submitted the strategy-call request
 * form. Returns true if sent, false if it failed — callers should surface
 * delivery failures in the API response rather than swallow them, since this
 * is the visitor's own receipt, not an internal notification.
 */
export async function sendStrategyCallRequestConfirmation(d: {
  email: string;
  firstName: string;
}): Promise<boolean> {
  const subject = "We received your strategy call request";
  const text = [
    `Hi ${d.firstName},`,
    "",
    "Thank you for reaching out to Hotel Sales Consultants and Archer Design.",
    "",
    "Wesam and Devon have received your request and will review the information you shared. One of us will follow up to coordinate a convenient time to connect through Microsoft Teams or Google Meet.",
    "",
    "Best,",
    "Hotel Sales Consultants × Archer Design",
  ].join("\n");

  try {
    await sendEmail({ to: d.email, subject, text });
    return true;
  } catch (err) {
    console.error("Strategy-call request confirmation email failed:", err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* The Revstudio × Archer Design — /revstudio booking notifications.   */
/* Separate recipients (Devon + Ghisela, not the HSC sales team), same  */
/* underlying send/Slack helpers. See lib/revstudio.ts for attribution. */
/* ------------------------------------------------------------------ */

export type RevstudioNotifyData = {
  bookingId: string;
  companyName?: string | null;
  prospectName?: string | null;
  prospectEmail?: string | null;
  entityType?: string | null;
  propertyCount?: string | null;
  opportunity?: string | null;
  serviceInterest?: string | null;
  scheduledStartAt?: string | null; // ISO
  visitorTimezone?: string | null;
  calendarLink?: string | null;
};

function buildRevstudioBody(d: RevstudioNotifyData): string {
  const who = d.companyName || "Unknown company";
  const lines = [
    `New Revstudio × Archer Design landing page lead booked a pilot conversation.`,
    "",
    `Prospect: ${d.prospectName || "—"}`,
    `Email: ${d.prospectEmail || "—"}`,
    `Company: ${who}`,
    `Are they a hotel, group, or agency: ${d.entityType || "—"}`,
    `Approx. properties involved: ${d.propertyCount || "—"}`,
    `Scheduled: ${fmtTime(d.scheduledStartAt, d.visitorTimezone)}`,
    `Opportunity to discuss: ${d.opportunity || "—"}`,
    `Area needing most support: ${d.serviceInterest || "—"}`,
    "",
    d.calendarLink ? `Calendar link: ${d.calendarLink}` : "",
    `Source: ${REVSTUDIO_LEAD_SOURCE_LABEL}`,
    `Booking ID: ${d.bookingId}`,
  ];
  return lines.filter((l) => l !== "").join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * Notify Devon and Ghisela (whichever of REVSTUDIO_DEVON_EMAIL /
 * REVSTUDIO_GHISELA_EMAIL / REVSTUDIO_NOTIFICATION_EMAIL are configured)
 * that a new /revstudio lead booked a pilot conversation. No round-robin —
 * this is a two-person partnership review, not a sales queue. Never
 * throws; a notification failure must not lose the already-saved booking.
 */
export async function sendRevstudioNotification(d: RevstudioNotifyData): Promise<{ sent: string[]; failed: string[] }> {
  const who = d.companyName || d.prospectName || "Unknown";
  const subject = `NEW REVSTUDIO × ARCHER LEAD — Pilot Conversation Booked — ${who}`;
  const text = buildRevstudioBody(d);

  const recipients = new Map<string, string>();
  const devon = getRevstudioDevon();
  if (devon) recipients.set(devon.email.toLowerCase(), devon.email);
  const ghisela = getRevstudioGhisela();
  if (ghisela) recipients.set(ghisela.email.toLowerCase(), ghisela.email);
  const shared = getRevstudioNotificationEmail();
  if (shared) recipients.set(shared.toLowerCase(), shared);

  const sent: string[] = [];
  const failed: string[] = [];
  for (const email of recipients.values()) {
    const ok = await safeSend(email, subject, text);
    (ok ? sent : failed).push(email);
  }

  if (recipients.size === 0) {
    console.error("Revstudio booking notification: no REVSTUDIO_DEVON_EMAIL / REVSTUDIO_GHISELA_EMAIL / REVSTUDIO_NOTIFICATION_EMAIL configured:", d.bookingId);
  }

  await postSlack(
    [
      "New Revstudio × Archer Design landing page lead booked",
      `Company: ${d.companyName || "—"}`,
      `Prospect: ${d.prospectName || "—"}`,
      `Entity type: ${d.entityType || "—"}`,
      `Properties: ${d.propertyCount || "—"}`,
      `Call time: ${fmtTime(d.scheduledStartAt, d.visitorTimezone)}`,
      `Source: ${REVSTUDIO_LEAD_SOURCE_LABEL}`,
    ].join("\n")
  );

  return { sent, failed };
}
