// POST /api/stripe/webhook — Stripe event receiver.
// Verifies the signature, updates onboarding records' billing state.
// Never sends anything; never logs secrets or full payloads.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { verifyStripeSignature } from "@/lib/stripe";

type StripeObject = {
  id?: string;
  customer?: string;
  subscription?: string;
  status?: string;
  metadata?: Record<string, string>;
};

async function findRecord(admin: ReturnType<typeof getAdminClient>, obj: StripeObject) {
  // Prefer explicit metadata link, fall back to customer id.
  const recordId = obj.metadata?.onboarding_record_id;
  if (recordId) {
    const { data } = await admin.from("client_onboarding_records").select("*").eq("id", recordId).maybeSingle();
    if (data) return data;
  }
  if (obj.customer) {
    const { data } = await admin
      .from("client_onboarding_records").select("*")
      .eq("stripe_customer_id", obj.customer)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }
  return null;
}

export async function POST(req: Request) {
  if (!isAdminConfigured) return Response.json({ ok: false }, { status: 500 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!verifyStripeSignature(payload, sig, secret)) {
    return Response.json({ ok: false, error: "Invalid signature." }, { status: 400 });
  }

  let event: { type: string; data: { object: StripeObject } };
  try { event = JSON.parse(payload); } catch { return Response.json({ ok: false }, { status: 400 }); }

  const admin = getAdminClient();
  const obj = event.data?.object ?? {};
  const record = await findRecord(admin, obj);
  if (!record) return Response.json({ ok: true, ignored: true }); // not one of ours

  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { updated_at: now };

  switch (event.type) {
    case "checkout.session.completed": {
      if (obj.customer) patch.stripe_customer_id = obj.customer;
      if (obj.subscription) patch.stripe_subscription_id = obj.subscription;
      patch.billing_status = "subscription_active";
      if (!record.first_payment_completed_at) {
        patch.first_payment_completed_at = now;
        // Business rule: move stage only if the agreement is signed.
        if (record.agreement_signed_at) patch.stage = "first_payment_completed";
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      if (obj.id) patch.stripe_subscription_id = obj.id;
      if (obj.status === "active" || obj.status === "trialing") patch.billing_status = "subscription_active";
      else if (obj.status === "past_due") patch.billing_status = "past_due";
      else if (obj.status === "canceled") patch.billing_status = "canceled";
      break;
    }
    case "customer.subscription.deleted": {
      patch.billing_status = "canceled";
      break;
    }
    case "invoice.paid": {
      if (obj.id) patch.stripe_latest_invoice_id = obj.id;
      patch.billing_status = record.stripe_subscription_id ? "subscription_active" : "paid";
      if (!record.first_payment_completed_at) {
        patch.first_payment_completed_at = now;
        if (record.agreement_signed_at) patch.stage = "first_payment_completed";
      }
      break;
    }
    case "invoice.payment_failed":
    case "invoice.payment_action_required": {
      if (obj.id) patch.stripe_latest_invoice_id = obj.id;
      patch.billing_status = "past_due";
      patch.notes = [record.notes, `[${now.slice(0, 10)}] Stripe: ${event.type} — follow up on billing.`]
        .filter(Boolean).join("\n");
      break;
    }
    default:
      return Response.json({ ok: true, ignored: true });
  }

  await admin.from("client_onboarding_records").update(patch).eq("id", record.id);
  return Response.json({ ok: true });
}
