// POST /api/strategy-call — direct "Request a strategy call" form submitted
// from the modal on /revenue-activation. Completes the existing strategy-call
// infrastructure (lib/strategy-call.ts, lib/strategy-call-notify.ts, the
// strategy_call_bookings table) with a direct-write path alongside the
// existing Calendly + POST /api/webhooks/strategy-call flow, rather than a
// second, separate lead-storage system.
//
// This route does NOT schedule a meeting and does NOT redirect to Calendly —
// it only records the request and notifies people. See
// STRATEGY_CALL_BOOKING_SETUP.md § "Direct request form" for the full flow.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { randomUUID } from "crypto";
import { z } from "zod";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { PRIMARY_INTEREST_OPTIONS, STRATEGY_CALL_LEAD_SOURCE, STRATEGY_CALL_LEAD_SOURCE_LABEL, STRATEGY_CALL_CAMPAIGN, STRATEGY_CALL_UTM } from "@/lib/strategy-call";
import { sendStrategyCallRequestNotification, sendStrategyCallRequestConfirmation } from "@/lib/strategy-call-notify";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const primaryInterestValues = PRIMARY_INTEREST_OPTIONS as unknown as [string, ...string[]];

const requestSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required.").max(200),
  email: z.string().trim().email("Enter a valid work email address.").max(320),
  companyOrProperty: z.string().trim().min(1, "Hotel, property, or management company is required.").max(300),
  role: z.string().trim().min(1, "Role or title is required.").max(200),
  phone: z.string().trim().max(60).optional().default(""),
  propertyCount: z.string().trim().max(60).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  primaryInterest: z.union([z.enum(primaryInterestValues), z.literal("")]).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  // Honeypot — real visitors never see or fill this field (hidden off-screen
  // in the form). Any non-empty value here means a bot filled every input.
  hp_token: z.string().max(500).optional().default(""),
});

function sanitizePlainText(value: string): string {
  // Strip control characters and collapse excessive whitespace. Values are
  // only ever used in plain-text emails and as plain column values (no HTML
  // rendering, so this is not an XSS control) — this guards against header
  // injection / log noise, not markup.
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`strategy-call:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
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

  const parsed = requestSchema.safeParse(body);
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
    console.warn("strategy-call request: honeypot triggered, discarding submission.");
    return Response.json({ ok: true });
  }

  if (!isAdminConfigured) {
    console.error("strategy-call request: Supabase admin client is not configured.");
    return Response.json({ ok: false, error: "Server not configured. Please try again later or email hello@archerdesign.shop directly." }, { status: 500 });
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

  const bookingId = randomUUID();
  const now = new Date().toISOString();

  const admin = getAdminClient();
  const { data: inserted, error: insertError } = await admin
    .from("strategy_call_bookings")
    .insert({
      original_lead_source: STRATEGY_CALL_LEAD_SOURCE,
      lead_source_display: STRATEGY_CALL_LEAD_SOURCE_LABEL,
      campaign: STRATEGY_CALL_CAMPAIGN,
      booking_status: "request_submitted",
      pipeline_stage: "Archer Site Lead",
      booking_provider: "website_form",
      booking_id: bookingId,
      booking_created_at: now,
      prospect_name: fullName,
      prospect_email: email,
      prospect_phone: phone || null,
      company_name: companyOrProperty,
      company_website: website || null,
      hotel_count: propertyCount || null,
      primary_interest: primaryInterest || null,
      notes: message || null,
      utm_source: STRATEGY_CALL_UTM.source,
      utm_medium: STRATEGY_CALL_UTM.medium,
      utm_campaign: STRATEGY_CALL_UTM.campaign,
      landing_page_url: "/revenue-activation",
      referrer_url: req.headers.get("referer") || null,
      raw_payload: { role, submitted_via: "strategy_call_request_form" },
    })
    .select("id")
    .single();

  // The database write is what "successful submission" means here — a
  // failure here must be reported as a failure, never masked as success.
  if (insertError) {
    console.error("strategy-call request: failed to save request:", insertError.message);
    return Response.json(
      { ok: false, error: "We couldn't save your request. Please try again, or email hello@archerdesign.shop directly." },
      { status: 500 }
    );
  }

  // Everything below is best-effort — the request is already saved. Email
  // failures are reported back in the response (not swallowed), but they do
  // not change the overall success of the submission itself.
  let internalNotified: string[] = [];
  let internalFailed: string[] = [];
  let confirmationSent = false;
  try {
    const result = await sendStrategyCallRequestNotification({
      bookingId,
      fullName,
      email,
      phone: phone || null,
      companyOrProperty,
      role,
      propertyCount: propertyCount || null,
      website: website || null,
      primaryInterest: primaryInterest || null,
      message: message || null,
      submittedAt: now,
    });
    internalNotified = result.sent;
    internalFailed = result.failed;
  } catch (err) {
    console.error("strategy-call request: internal notification step threw:", err);
  }

  try {
    confirmationSent = await sendStrategyCallRequestConfirmation({
      email,
      firstName: fullName.split(/\s+/)[0] || fullName,
    });
  } catch (err) {
    console.error("strategy-call request: confirmation email step threw:", err);
  }

  return Response.json({
    ok: true,
    id: inserted.id,
    emails: {
      internalNotified,
      internalFailed,
      confirmationSent,
    },
  });
}
