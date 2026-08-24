export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { ensureCustomer, isStripeConfigured, stripeGet, stripePost } from "@/lib/stripe";
import { KICKOFF_CHECKLIST } from "@/lib/onboarding";
import {
  getCheckoutPlan,
  monthlyTotal,
  normalizePropertyCount,
} from "@/lib/checkout-offers";

type CheckoutBody = {
  offer_id?: string;
  plan_id?: string;
  property_count?: number;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  accepted_terms?: boolean;
  website?: string;
};

type StripePrice = {
  id: string;
  active: boolean;
  unit_amount: number | null;
  recurring?: { interval?: string } | null;
};

type StripeList<T> = { data: T[] };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value?: string, max = 180): string {
  return (value ?? "").trim().slice(0, max);
}

function stripeLookupKey(offerId: string, planId: string) {
  return `archer_${offerId}_${planId.replace(/-/g, "_")}_monthly`;
}

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Onboarding is not configured." }, { status: 500 });
  }
  if (!isStripeConfigured) {
    return Response.json({ ok: false, error: "Secure checkout is not configured yet." }, { status: 500 });
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.website) return Response.json({ ok: true, url: "/" });

  const offerId = clean(body.offer_id, 60);
  const planId = clean(body.plan_id, 80);
  const companyName = clean(body.company_name, 160);
  const contactName = clean(body.contact_name, 160);
  const contactEmail = clean(body.contact_email, 220).toLowerCase();

  if (!offerId || !planId || !companyName || !contactName || !EMAIL_RE.test(contactEmail)) {
    return Response.json({ ok: false, error: "Please provide a valid company, name, email, and plan." }, { status: 400 });
  }
  if (body.accepted_terms !== true) {
    return Response.json({ ok: false, error: "Service terms must be accepted before checkout." }, { status: 400 });
  }

  const plan = getCheckoutPlan(offerId, planId);
  if (!plan) {
    return Response.json({ ok: false, error: "That package is no longer available." }, { status: 400 });
  }

  const propertyCount = normalizePropertyCount(plan, Number(body.property_count));
  const monthlyTotalCents = monthlyTotal(plan, propertyCount);
  const quantity = plan.pricingModel === "per_property" ? propertyCount : 1;
  const acceptedAt = new Date().toISOString();
  const admin = getAdminClient();

  const { data: record, error: recordError } = await admin
    .from("client_onboarding_records")
    .insert({
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      package_name: plan.name,
      agreement_type: "custom",
      monthly_fee: monthlyTotalCents / 100,
      property_count: propertyCount,
      stage: "agreement_signed",
      billing_status: "not_started",
      agreement_signed_at: acceptedAt,
      notes: [
        `Self-serve checkout offer: ${offerId}`,
        `Plan: ${plan.id}`,
        `Pricing model: ${plan.pricingModel}`,
        `Properties / brands selected: ${propertyCount}`,
        `Monthly total accepted: $${(monthlyTotalCents / 100).toLocaleString("en-US")}`,
        `Monthly service terms accepted online: ${acceptedAt}`,
      ].join("\n"),
    })
    .select("id")
    .single();

  if (recordError || !record) {
    return Response.json({ ok: false, error: "Could not create the onboarding record." }, { status: 500 });
  }

  try {
    await admin.from("client_onboarding_tasks").upsert(
      KICKOFF_CHECKLIST.map((title, index) => ({
        onboarding_record_id: record.id,
        title,
        sort_order: index,
      })),
      { onConflict: "onboarding_record_id,title", ignoreDuplicates: true }
    );

    const customerId = await ensureCustomer({
      email: contactEmail,
      name: companyName,
      recordId: record.id,
    });

    const requestUrl = new URL(req.url);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PUBLIC_APP_URL ?? requestUrl.origin;
    const lookupKey = stripeLookupKey(offerId, plan.id);
    const priceResult = await stripeGet<StripeList<StripePrice>>("prices", {
      "lookup_keys[0]": lookupKey,
      active: true,
      limit: 10,
    });
    const catalogPrice = priceResult.data.find(
      (price) => price.unit_amount === plan.monthlyUnitAmount && price.recurring?.interval === "month"
    );

    const params: Record<string, string | number | boolean | undefined> = {
      mode: "subscription",
      customer: customerId,
      "line_items[0][quantity]": quantity,
      client_reference_id: record.id,
      success_url: `${appUrl}/start/success?offer=${encodeURIComponent(offerId)}`,
      cancel_url: `${appUrl}/start?offer=${encodeURIComponent(offerId)}&canceled=1`,
      "metadata[onboarding_record_id]": record.id,
      "metadata[offer_id]": offerId,
      "metadata[plan_id]": plan.id,
      "metadata[property_count]": propertyCount,
      "subscription_data[metadata][onboarding_record_id]": record.id,
      "subscription_data[metadata][offer_id]": offerId,
      "subscription_data[metadata][plan_id]": plan.id,
      "subscription_data[metadata][property_count]": propertyCount,
    };

    if (catalogPrice) {
      params["line_items[0][price]"] = catalogPrice.id;
    } else {
      params["line_items[0][price_data][currency]"] = "usd";
      params["line_items[0][price_data][product_data][name]"] = `Archer Design — ${plan.name}`;
      params["line_items[0][price_data][product_data][description]"] = `${propertyCount} ${propertyCount === 1 ? "property / brand" : "properties / brands"} in scope`;
      params["line_items[0][price_data][recurring][interval]"] = "month";
      params["line_items[0][price_data][unit_amount]"] = plan.monthlyUnitAmount;
    }

    const session = await stripePost<{ id: string; url: string }>("checkout/sessions", params);

    await admin
      .from("client_onboarding_records")
      .update({
        stripe_customer_id: customerId,
        billing_status: "payment_link_sent",
        payment_link_sent_at: new Date().toISOString(),
        stage: "payment_link_sent",
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id);

    return Response.json({ ok: true, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe checkout error.";
    await admin
      .from("client_onboarding_records")
      .update({
        notes: `Self-serve checkout failed after onboarding record creation. ${message}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
