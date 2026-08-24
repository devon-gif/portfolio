import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { isOwnerRequest } from "@/lib/api-auth";

const STAGES = new Set([
  "proposal_accepted",
  "agreement_sent",
  "agreement_signed",
  "payment_link_sent",
  "first_payment_completed",
  "intake_sent",
  "intake_completed",
  "kickoff_scheduled",
  "active_client",
  "renewal_expansion",
]);

const BILLING = new Set([
  "not_started",
  "payment_link_sent",
  "subscription_active",
  "invoice_sent",
  "paid",
  "past_due",
  "failed",
  "canceled",
  "manual",
]);

// Owner verification now lives in lib/api-auth.ts, shared with the Stripe
// routes and the task route. It accepts either the session cookie or the
// Authorization: Bearer token this page already sends, so the existing caller
// keeps working unchanged.
async function verifyOwner(request: Request) {
  const admin = getSupabaseAdminClient();
  const ok = await isOwnerRequest(request);
  return { admin, ok };
}

export async function POST(request: Request) {
  const { admin, ok } = await verifyOwner(request);
  if (!admin) return NextResponse.json({ ok: false, error: "Supabase admin is not configured." }, { status: 500 });
  if (!ok) return NextResponse.json({ ok: false, error: "Owner authentication required." }, { status: 401 });

  let body: { record_id?: string; stage?: string; billing_status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.record_id) return NextResponse.json({ ok: false, error: "record_id is required." }, { status: 400 });
  if (!body.stage || !STAGES.has(body.stage)) return NextResponse.json({ ok: false, error: "Invalid client stage." }, { status: 400 });
  if (!body.billing_status || !BILLING.has(body.billing_status)) return NextResponse.json({ ok: false, error: "Invalid billing status." }, { status: 400 });

  const { error } = await admin
    .from("client_onboarding_records")
    .update({
      stage: body.stage,
      billing_status: body.billing_status,
      notes: body.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.record_id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
