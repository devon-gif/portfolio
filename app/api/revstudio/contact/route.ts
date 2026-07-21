// POST /api/revstudio/contact — the "Request a strategy call" modal on
// /revstudio (components/marketing/revstudio/RevstudioStrategyCallModal.tsx).
// Validates + rate-limits server-side, then emails Ghisela and Devon via the
// project's existing Resend infrastructure (lib/sending.ts) — no database
// write, no Calendly redirect. Recipients come from REVSTUDIO_LEAD_RECIPIENTS
// (comma-separated), falling back to the individual REVSTUDIO_DEVON_EMAIL /
// REVSTUDIO_GHISELA_EMAIL / REVSTUDIO_NOTIFICATION_EMAIL vars — see
// lib/revstudio-contact-notify.ts / lib/revstudio.ts's getRevstudioLeadRecipients.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { REVSTUDIO_CONTACT_INTEREST_OPTIONS } from "@/lib/revstudio";
import { sendRevstudioContactNotification } from "@/lib/revstudio-contact-notify";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const interestValues = REVSTUDIO_CONTACT_INTEREST_OPTIONS as unknown as [string, ...string[]];

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(200),
  email: z.string().trim().email("Enter a valid work email address.").max(320),
  companyOrProperty: z.string().trim().min(1, "Hotel, property, agency, or management company is required.").max(300),
  role: z.string().trim().min(1, "Role or title is required.").max(200),
  phone: z.string().trim().max(60).optional().default(""),
  propertyCount: z.string().trim().max(60).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  primaryInterest: z.union([z.enum(interestValues), z.literal("")]).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  // Honeypot — real visitors never see or fill this field (hidden off-screen
  // in the modal). Any non-empty value means a bot filled every input.
  hp_token: z.string().max(500).optional().default(""),
});

// Strips control characters and collapses excess whitespace. Values only
// ever land in plain-text/escaped-HTML email bodies (see
// lib/revstudio-contact-notify.ts's escapeHtml), so this guards against
// header injection / log noise, not markup — it is not itself an XSS control.
function sanitizePlainText(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`revstudio-contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rate.ok) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Please complete the required fields." },
      { status: 400 }
    );
  }
  const d = parsed.data;

  // Silently pretend success to the bot, without doing any work — never
  // reveal that a honeypot check exists.
  if (d.hp_token.trim() !== "") {
    console.warn("revstudio contact: honeypot triggered, discarding submission.");
    return Response.json({ ok: true });
  }

  const fullName = sanitizePlainText(d.fullName);
  const email = d.email.trim().toLowerCase();
  const companyOrProperty = sanitizePlainText(d.companyOrProperty);
  const role = sanitizePlainText(d.role);
  const phone = sanitizePlainText(d.phone);
  const propertyCount = sanitizePlainText(d.propertyCount);
  const website = sanitizePlainText(d.website);
  const primaryInterest = d.primaryInterest;
  const message = sanitizePlainText(d.message).slice(0, 4000);
  const now = new Date().toISOString();

  let result: { sent: string[]; failed: string[]; configured: boolean };
  try {
    result = await sendRevstudioContactNotification({
      fullName,
      email,
      companyOrProperty,
      role,
      phone: phone || null,
      propertyCount: propertyCount || null,
      website: website || null,
      primaryInterest: primaryInterest || null,
      message: message || null,
      submittedAt: now,
    });
  } catch (err) {
    // sendRevstudioContactNotification is designed to never throw — this is
    // a final backstop so a genuinely unexpected error still returns a safe,
    // generic message rather than leaking internals to the client.
    console.error("revstudio contact: notification step threw unexpectedly:", err);
    return Response.json(
      { ok: false, error: "We couldn't send your request. Please try again, or email hello@archerdesign.shop directly." },
      { status: 500 }
    );
  }

  // Email delivery IS the success criterion here (no database row backs
  // this form) — if nothing is configured, or every send failed, the
  // visitor's submission genuinely did not reach anyone and must not be
  // reported as a success.
  if (result.sent.length === 0) {
    return Response.json(
      { ok: false, error: "We couldn't send your request right now. Please try again, or email hello@archerdesign.shop directly." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, emails: { sent: result.sent, failed: result.failed } });
}
