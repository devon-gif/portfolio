// Notification email for the /revstudio "Request a strategy call" contact
// modal — SERVER ONLY. Mirrors the pattern already used by
// sendRevstudioNotification (lib/strategy-call-notify.ts, for Calendly
// bookings): same recipient resolution (Devon, Ghisela, shared inbox),
// same "never throw" contract. Kept as its own function/file rather than
// extending sendRevstudioNotification because the data shape is different
// (a raw inquiry, not a scheduled booking) — reusing the *recipients* and
// *sendEmail* infrastructure, not duplicating them.
import { sendEmail } from "@/lib/sending";
import {
  REVSTUDIO_LEAD_SOURCE_LABEL,
  getRevstudioDevon,
  getRevstudioGhisela,
  getRevstudioNotificationEmail,
  getRevstudioLeadRecipients,
} from "@/lib/revstudio";

export type RevstudioContactData = {
  fullName: string;
  email: string;
  companyOrProperty: string;
  role: string;
  phone?: string | null;
  propertyCount?: string | null;
  website?: string | null;
  primaryInterest?: string | null;
  message?: string | null;
  submittedAt: string; // ISO
};

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

/** Minimal HTML escaping — the notification email embeds free-text fields
 *  (message, company, role, etc) submitted by an anonymous visitor, so this
 *  is a hard requirement, not a style choice: without it, a submission could
 *  inject arbitrary markup/links into an email Devon or Ghisela open. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildText(d: RevstudioContactData): string {
  return [
    "A new inquiry came in through the Revstudio × Archer Design website contact form.",
    "Ghisela and Devon need to review this and follow up to coordinate a Microsoft Teams or Google Meet conversation — nothing has been scheduled yet.",
    "",
    `Full name: ${d.fullName}`,
    `Work email: ${d.email}`,
    d.phone ? `Phone: ${d.phone}` : "",
    `Company/property: ${d.companyOrProperty}`,
    `Role/title: ${d.role}`,
    d.propertyCount ? `Number of properties: ${d.propertyCount}` : "",
    d.website ? `Website: ${d.website}` : "",
    `Primary area of interest: ${d.primaryInterest || "—"}`,
    `Message: ${d.message || "—"}`,
    "",
    `Submitted: ${fmtSubmittedAt(d.submittedAt)}`,
    `Source page: ${REVSTUDIO_LEAD_SOURCE_LABEL}`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

function buildHtml(d: RevstudioContactData): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5b5560;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#211d25;font-size:14px;">${value}</td></tr>`;

  const emailLink = `<a href="mailto:${escapeHtml(d.email)}" style="color:#5B21F5;text-decoration:none;">${escapeHtml(d.email)}</a>`;

  const rows = [
    row("Full name", escapeHtml(d.fullName)),
    row("Work email", emailLink),
    d.phone ? row("Phone", escapeHtml(d.phone)) : "",
    row("Company/property", escapeHtml(d.companyOrProperty)),
    row("Role/title", escapeHtml(d.role)),
    d.propertyCount ? row("Number of properties", escapeHtml(d.propertyCount)) : "",
    d.website ? row("Website", escapeHtml(d.website)) : "",
    row("Primary area of interest", escapeHtml(d.primaryInterest || "—")),
    row("Message", escapeHtml(d.message || "—").replace(/\n/g, "<br>")),
    row("Submitted", escapeHtml(fmtSubmittedAt(d.submittedAt))),
    row("Source page", escapeHtml(REVSTUDIO_LEAD_SOURCE_LABEL)),
  ]
    .filter(Boolean)
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f3ff;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 28px;background:#ffffff;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#5B21F5;font-weight:600;font-family:Arial,sans-serif;">New inquiry</p>
      <h1 style="margin:0 0 16px;font-size:20px;color:#211d25;font-weight:400;">The Revstudio × Archer Design</h1>
      <p style="margin:0 0 20px;font-size:13.5px;line-height:1.6;color:#514b56;font-family:Arial,sans-serif;">
        A prospective hotel group, property, or agency submitted the contact form on /revstudio. Review the details below and follow up to coordinate a conversation.
      </p>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
        ${rows}
      </table>
    </div>
  </body>
</html>`;
}

async function safeSend(to: string, subject: string, text: string, html: string, replyTo?: string): Promise<boolean> {
  try {
    await sendEmail({ to, subject, text, html, replyTo });
    return true;
  } catch (err) {
    console.error(`Revstudio contact notification failed for ${to}:`, err);
    return false;
  }
}

/**
 * Notify Ghisela and Devon that a visitor submitted the /revstudio "Request
 * a strategy call" contact form. Never throws. Returns which recipients
 * were sent to / failed so the API route can report accurately without ever
 * silently pretending success.
 *
 * Recipient resolution: REVSTUDIO_LEAD_RECIPIENTS (a single comma-separated
 * env var, e.g. "ghisela@example.com,hello@archerdesign.shop") is the
 * primary source. If that's unset, falls back to the older individual
 * REVSTUDIO_DEVON_EMAIL / REVSTUDIO_GHISELA_EMAIL / REVSTUDIO_NOTIFICATION_EMAIL
 * vars (used by the Calendly-booking notification in
 * lib/strategy-call-notify.ts's sendRevstudioNotification) so nothing breaks
 * for any environment that already had those set.
 */
export async function sendRevstudioContactNotification(
  d: RevstudioContactData
): Promise<{ sent: string[]; failed: string[]; configured: boolean }> {
  const subject = `New Revstudio × Archer inquiry — ${d.companyOrProperty}`;
  const text = buildText(d);
  const html = buildHtml(d);

  const recipients = new Map<string, string>();
  for (const email of getRevstudioLeadRecipients()) {
    recipients.set(email.toLowerCase(), email);
  }
  if (recipients.size === 0) {
    const devon = getRevstudioDevon();
    if (devon) recipients.set(devon.email.toLowerCase(), devon.email);
    const ghisela = getRevstudioGhisela();
    if (ghisela) recipients.set(ghisela.email.toLowerCase(), ghisela.email);
    const shared = getRevstudioNotificationEmail();
    if (shared) recipients.set(shared.toLowerCase(), shared);
  }

  if (recipients.size === 0) {
    console.error(
      "Revstudio contact notification: no REVSTUDIO_LEAD_RECIPIENTS (or REVSTUDIO_DEVON_EMAIL / REVSTUDIO_GHISELA_EMAIL / REVSTUDIO_NOTIFICATION_EMAIL) configured — inquiry was not emailed to anyone:",
      d.companyOrProperty
    );
    return { sent: [], failed: [], configured: false };
  }

  const sent: string[] = [];
  const failed: string[] = [];
  for (const email of recipients.values()) {
    const ok = await safeSend(email, subject, text, html, d.email);
    (ok ? sent : failed).push(email);
  }

  return { sent, failed, configured: true };
}
