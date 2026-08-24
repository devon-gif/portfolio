// POST /api/stripe/checkout-link  { record_id, price_id, setup_price_id? }
// Creates a Stripe Checkout subscription session for an onboarding record and
// returns the URL. Manual action only — Devon sends the link himself.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { ensureCustomer, isStripeConfigured, stripePost } from "@/lib/stripe";
import { requireOwner } from "@/lib/api-auth";

export async function POST(req: Request) {
  // OWNER ONLY — this creates a Stripe Checkout session against an existing
  // customer and mutates the onboarding record's billing state. Public
  // self-serve checkout is a different route (/api/stripe/public-checkout),
  // which validates its own input and is deliberately unauthenticated.
  const denied = await requireOwner(req);
  if (denied) return denied;

  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isStripeConfigured) return Response.json({ ok: false, error: "STRIPE_SECRET_KEY is not set." }, { status: 500 });

  let body: { record_id?: string; price_id?: string; setup_price_id?: string };
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }
  if (!body.record_id || !body.price_id) {
    return Response.json({ ok: false, error: "record_id and price_id are required." }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data: record, error } = await admin
    .from("client_onboarding_records").select("*").eq("id", body.record_id).single();
  if (error || !record) return Response.json({ ok: false, error: "Onboarding record not found." }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PUBLIC_APP_URL;
  if (!appUrl) return Response.json({ ok: false, error: "NEXT_PUBLIC_APP_URL is not set." }, { status: 500 });

  try {
    const customerId = await ensureCustomer({
      existingId: record.stripe_customer_id,
      email: record.contact_email,
      name: record.company_name,
      recordId: record.id,
    });

    const params: Record<string, string> = {
      mode: "subscription",
      customer: customerId,
      "line_items[0][price]": body.price_id,
      "line_items[0][quantity]": "1",
      success_url: `${appUrl}/client-onboarding?paid=1`,
      cancel_url: `${appUrl}/client-onboarding?canceled=1`,
      "metadata[onboarding_record_id]": record.id,
      "subscription_data[metadata][onboarding_record_id]": record.id,
    };
    if (body.setup_price_id) {
      params["line_items[1][price]"] = body.setup_price_id;
      params["line_items[1][quantity]"] = "1";
    }

    const session = await stripePost<{ id: string; url: string }>("checkout/sessions", params);

    await admin.from("client_onboarding_records").update({
      stripe_customer_id: customerId,
      billing_status: "payment_link_sent",
      payment_link_sent_at: new Date().toISOString(),
      stage: record.stage === "agreement_signed" ? "payment_link_sent" : record.stage,
      updated_at: new Date().toISOString(),
    }).eq("id", record.id);

    return Response.json({ ok: true, url: session.url });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Stripe error." }, { status: 502 });
  }
}
