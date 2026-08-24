// POST /api/stripe/invoice-link  { record_id, amount, description?, days_until_due? }
// Creates a one-time Stripe invoice (setup fee / custom amount) and returns the
// hosted invoice URL. Manual action only — Devon sends the link himself.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { ensureCustomer, isStripeConfigured, stripePost } from "@/lib/stripe";
import { requireOwner } from "@/lib/api-auth";

export async function POST(req: Request) {
  // OWNER ONLY — and the most dangerous of the three: it finalizes an invoice
  // for a caller-supplied amount against a real Stripe customer. Unauthenticated,
  // that is an arbitrary charge request aimed at your clients.
  const denied = await requireOwner(req);
  if (denied) return denied;

  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isStripeConfigured) return Response.json({ ok: false, error: "STRIPE_SECRET_KEY is not set." }, { status: 500 });

  let body: { record_id?: string; amount?: number; description?: string; days_until_due?: number };
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 }); }
  const amount = Number(body.amount);
  if (!body.record_id || !Number.isFinite(amount) || amount <= 0) {
    return Response.json({ ok: false, error: "record_id and a positive amount (USD) are required." }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data: record, error } = await admin
    .from("client_onboarding_records").select("*").eq("id", body.record_id).single();
  if (error || !record) return Response.json({ ok: false, error: "Onboarding record not found." }, { status: 404 });

  try {
    const customerId = await ensureCustomer({
      existingId: record.stripe_customer_id,
      email: record.contact_email,
      name: record.company_name,
      recordId: record.id,
    });

    // Draft invoice first so the invoice item attaches to it (avoids races).
    const invoice = await stripePost<{ id: string }>("invoices", {
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: body.days_until_due ?? 7,
      "metadata[onboarding_record_id]": record.id,
    });
    await stripePost("invoiceitems", {
      customer: customerId,
      invoice: invoice.id,
      amount: Math.round(amount * 100),
      currency: "usd",
      description: body.description ?? `Archer Design — ${record.package_name ?? "creative services"} (one-time)`,
    });
    const finalized = await stripePost<{ id: string; hosted_invoice_url: string }>(
      `invoices/${invoice.id}/finalize`, {}
    );

    await admin.from("client_onboarding_records").update({
      stripe_customer_id: customerId,
      stripe_latest_invoice_id: finalized.id,
      billing_status: "invoice_sent",
      updated_at: new Date().toISOString(),
    }).eq("id", record.id);

    return Response.json({ ok: true, url: finalized.hosted_invoice_url, invoice_id: finalized.id });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "Stripe error." }, { status: 502 });
  }
}
