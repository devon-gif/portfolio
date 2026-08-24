// POST /api/stripe/portal-link  { record_id }
// Returns a Stripe Customer Portal URL so the client can manage billing.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { isStripeConfigured, stripePost } from "@/lib/stripe";
import { requireOwner } from "@/lib/api-auth";

export async function POST(req: Request) {
  // OWNER ONLY. This endpoint takes a caller-supplied record_id, so without an
  // authorization check anyone holding a record UUID could mint a live Stripe
  // Customer Portal session for that client — payment methods, invoice history,
  // and subscription cancellation.
  //
  // When the client portal needs a billing link, it must NOT reuse this route.
  // It gets its own endpoint that derives the record from the caller's
  // membership and accepts no id at all.
  const denied = await requireOwner(req);
  if (denied) return denied;

  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isStripeConfigured) return Response.json({ ok: false, error: "STRIPE_SECRET_KEY is not set." }, { status: 500 });

  let body: { record_id?: string };
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }
  if (!body.record_id) return Response.json({ ok: false, error: "record_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { data: record } = await admin
    .from("client_onboarding_records").select("stripe_customer_id").eq("id", body.record_id).single();
  if (!record?.stripe_customer_id) {
    return Response.json({ ok: false, error: "No Stripe customer yet — create a payment link or invoice first." }, { status: 422 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.PUBLIC_APP_URL;
  try {
    const session = await stripePost<{ url: string }>("billing_portal/sessions", {
      customer: record.stripe_customer_id,
      return_url: appUrl ? `${appUrl}/client-onboarding` : undefined,
    });
    return Response.json({ ok: true, url: session.url });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Stripe error." }, { status: 502 });
  }
}
