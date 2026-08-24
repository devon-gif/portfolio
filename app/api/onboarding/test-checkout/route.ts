export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { KICKOFF_CHECKLIST } from "@/lib/onboarding";
import { getCheckoutPlan, monthlyTotal, normalizePropertyCount } from "@/lib/checkout-offers";

type Body = {
  offer_id?: string;
  plan_id?: string;
  property_count?: number;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  accepted_terms?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value?: string, max = 180) {
  return (value ?? "").trim().slice(0, max);
}

function isLocal(req: Request) {
  const host = new URL(req.url).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

export async function POST(req: Request) {
  if (!isLocal(req) || process.env.NODE_ENV === "production") {
    return Response.json({ ok: false, error: "No-charge onboarding tests are only available in local development." }, { status: 403 });
  }
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Supabase onboarding is not configured locally yet." }, { status: 500 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const offerId = clean(body.offer_id, 60);
  const planId = clean(body.plan_id, 80);
  const companyName = clean(body.company_name, 160);
  const contactName = clean(body.contact_name, 160);
  const contactEmail = clean(body.contact_email, 220).toLowerCase();

  if (!offerId || !planId || !companyName || !contactName || !EMAIL_RE.test(contactEmail)) {
    return Response.json({ ok: false, error: "Please provide a valid company, name, email, and plan." }, { status: 400 });
  }
  if (body.accepted_terms !== true) {
    return Response.json({ ok: false, error: "Accept the service terms so the test follows the real checkout path." }, { status: 400 });
  }

  const plan = getCheckoutPlan(offerId, planId);
  if (!plan) {
    return Response.json({ ok: false, error: "That package is no longer available." }, { status: 400 });
  }

  const propertyCount = normalizePropertyCount(plan, Number(body.property_count));
  const monthlyTotalCents = monthlyTotal(plan, propertyCount);
  const now = new Date().toISOString();
  const admin = getAdminClient();

  const { data: record, error } = await admin
    .from("client_onboarding_records")
    .insert({
      company_name: `[TEST] ${companyName}`,
      contact_name: contactName,
      contact_email: contactEmail,
      package_name: plan.name,
      agreement_type: "custom",
      monthly_fee: monthlyTotalCents / 100,
      property_count: propertyCount,
      stage: "first_payment_completed",
      billing_status: "not_started",
      agreement_signed_at: now,
      first_payment_completed_at: now,
      notes: [
        "LOCAL TEST ONBOARDING — NO CHARGE — NO STRIPE CUSTOMER OR SUBSCRIPTION CREATED",
        `Self-serve checkout offer: ${offerId}`,
        `Plan: ${plan.id}`,
        `Pricing model: ${plan.pricingModel}`,
        `Properties / brands selected: ${propertyCount}`,
        `Simulated monthly total: $${(monthlyTotalCents / 100).toLocaleString("en-US")}`,
        `Test completed: ${now}`,
      ].join("\n"),
    })
    .select("id")
    .single();

  if (error || !record) {
    return Response.json({ ok: false, error: error?.message ?? "Could not create the test onboarding record." }, { status: 500 });
  }

  await admin.from("client_onboarding_tasks").upsert(
    KICKOFF_CHECKLIST.map((title, index) => ({
      onboarding_record_id: record.id,
      title,
      sort_order: index,
    })),
    { onConflict: "onboarding_record_id,title", ignoreDuplicates: true }
  );

  return Response.json({
    ok: true,
    record_id: record.id,
    url: `/start/success?offer=${encodeURIComponent(offerId)}&test=1`,
  });
}
