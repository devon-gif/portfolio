import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sending";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

type RateEntry = { count: number; startedAt: number };

const globalForReferralRateLimit = globalThis as typeof globalThis & {
  __archerReferralRateLimit?: Map<string, RateEntry>;
};

const rateLimit =
  globalForReferralRateLimit.__archerReferralRateLimit ?? new Map<string, RateEntry>();

globalForReferralRateLimit.__archerReferralRateLimit = rateLimit;

function clean(value: unknown, max = 600) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max)
    : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function allowed(ip: string) {
  const now = Date.now();
  const current = rateLimit.get(ip);

  if (!current || now - current.startedAt > WINDOW_MS) {
    rateLimit.set(ip, { count: 1, startedAt: now });
    return true;
  }

  if (current.count >= MAX_SUBMISSIONS_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!allowed(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot: bots commonly fill hidden fields. Return success without sending.
  if (clean(payload.websiteConfirm, 200)) {
    return NextResponse.json({ ok: true });
  }

  const referrerName = clean(payload.referrerName, 120);
  const referrerEmail = clean(payload.referrerEmail, 180).toLowerCase();
  const referrerCompany = clean(payload.referrerCompany, 180);
  const referrerPhone = clean(payload.referrerPhone, 80);
  const prospectName = clean(payload.prospectName, 120);
  const prospectEmail = clean(payload.prospectEmail, 180).toLowerCase();
  const prospectTitle = clean(payload.prospectTitle, 160);
  const companyName = clean(payload.companyName, 180);
  const companyWebsite = clean(payload.companyWebsite, 300);
  const propertyCount = clean(payload.propertyCount, 80);
  const opportunityType = clean(payload.opportunityType, 120);
  const relationship = clean(payload.relationship, 600);
  const notes = clean(payload.notes, 2000);

  if (!referrerName || !referrerEmail || !prospectName || !companyName || !opportunityType) {
    return NextResponse.json(
      { ok: false, error: "Please complete the required fields." },
      { status: 400 }
    );
  }

  if (!validEmail(referrerEmail) || (prospectEmail && !validEmail(prospectEmail))) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const to = (
    process.env.REFERRAL_NOTIFY_TO ||
    process.env.LEAD_NOTIFY_TO ||
    "hello@archerdesign.shop"
  ).trim();

  const subject = `New Archer referral: ${companyName} — ${prospectName}`;
  const text = [
    "New Archer Design referral submission",
    "",
    "REFERRER",
    `Name: ${referrerName}`,
    `Email: ${referrerEmail}`,
    `Company / role: ${referrerCompany || "—"}`,
    `Phone: ${referrerPhone || "—"}`,
    "",
    "REFERRED OPPORTUNITY",
    `Contact: ${prospectName}`,
    `Email: ${prospectEmail || "—"}`,
    `Title: ${prospectTitle || "—"}`,
    `Company / hotel group: ${companyName}`,
    `Website: ${companyWebsite || "—"}`,
    `Property count: ${propertyCount || "—"}`,
    `Opportunity type: ${opportunityType}`,
    "",
    `Relationship / context: ${relationship || "—"}`,
    "",
    `Notes: ${notes || "—"}`,
    "",
    "Referral economics shown on the page: one-time 20% of the first month of service fees actually collected, unless a different structure is agreed in writing before the introduction.",
  ].join("\n");

  try {
    await sendEmail({
      to,
      subject,
      text,
      replyTo: referrerEmail,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Referral notification failed:", error);
    return NextResponse.json(
      { ok: false, error: "The referral could not be sent. Please email hello@archerdesign.shop." },
      { status: 500 }
    );
  }
}
