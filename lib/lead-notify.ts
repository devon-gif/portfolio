// Lead notification emails to Devon — SERVER ONLY. Best-effort: never throws,
// never blocks the request. Uses Resend via lib/sending. Skips silently if the
// notification env vars aren't configured.
import { sendEmail } from "@/lib/sending";
import { SITE_URL } from "@/lib/seo";

export type LeadNotifyKind =
  | "scorecard_completed"
  | "ai_audit_completed"
  | "calendly_clicked"
  | "review_requested";

const KIND_PREFIX: Record<LeadNotifyKind, string> = {
  scorecard_completed: "New Hotel Creative Scorecard",
  ai_audit_completed: "New AI Hotel Creative Audit",
  calendly_clicked: "Creative Gap Review — Calendly clicked",
  review_requested: "Creative Gap Review — property links sent",
};

export type LeadNotifyData = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  role?: string | null;
  website?: string | null;
  companyType?: string | null;
  propertyCount?: string | null;
  scoreTotal?: number | null;
  scoreBand?: string | null;
  confidence?: string | null;
  strongestGaps?: string[] | null;
  quickWins?: string[] | null;
  recommendedNextStep?: string | null;
  propertyLinks?: string[] | null;
  ctaClicked?: boolean;
  reviewRequested?: boolean;
};

/** Sends a lead notification. Returns true if sent, false if skipped/failed. */
export async function sendLeadNotification(kind: LeadNotifyKind, d: LeadNotifyData): Promise<boolean> {
  const to = (process.env.LEAD_NOTIFY_TO ?? "").trim();
  const from = (process.env.LEAD_NOTIFY_FROM ?? process.env.RESEND_FROM_EMAIL ?? "").trim();
  if (!process.env.RESEND_API_KEY || !to || !from) return false;

  const who = d.company || (d.website ? d.website.replace(/^https?:\/\//, "") : "") || "Unknown";
  const score = d.scoreTotal != null ? `${d.scoreTotal}/100` : "—";
  const subject = `${KIND_PREFIX[kind]}: ${who} — ${score}`;

  const lines = [
    `${KIND_PREFIX[kind]}.`,
    "",
    `Name: ${d.name || "—"}`,
    `Email: ${d.email || "—"}`,
    `Role: ${d.role || "—"}`,
    `Website: ${d.website || "—"}`,
    d.companyType ? `Company type: ${d.companyType}` : "",
    d.propertyCount ? `Number of properties: ${d.propertyCount}` : "",
    `Score: ${score}`,
    `Score band: ${d.scoreBand || "—"}`,
    d.confidence ? `Confidence: ${d.confidence}` : "",
    `Strongest gaps: ${(d.strongestGaps ?? []).join(", ") || "—"}`,
    d.quickWins && d.quickWins.length ? `Quick wins: ${d.quickWins.join(", ")}` : "",
    d.recommendedNextStep ? `Recommended next step: ${d.recommendedNextStep}` : "",
    d.propertyLinks && d.propertyLinks.length ? `Property links: ${d.propertyLinks.join(", ")}` : "",
    `CTA clicked: ${d.ctaClicked ? "yes" : "no"}`,
    `Review requested: ${d.reviewRequested ? "yes" : "no"}`,
    "",
    `Admin record: ${SITE_URL}/scorecard-submissions`,
  ].filter(Boolean);

  try {
    await sendEmail({ to, from, subject, text: lines.join("\n"), replyTo: d.email || undefined });
    return true;
  } catch (err) {
    console.error("Lead notification failed:", err);
    return false;
  }
}
