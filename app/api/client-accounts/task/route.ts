import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { isOwnerRequest } from "@/lib/api-auth";

// Shared with the update route and the Stripe routes — see lib/api-auth.ts.
// Accepts the session cookie or a Bearer token, so the existing caller works.
async function verifyOwner(request: Request) {
  const admin = getSupabaseAdminClient();
  const ok = await isOwnerRequest(request);
  return { admin, ok };
}

export async function POST(request: Request) {
  const { admin, ok } = await verifyOwner(request);
  if (!admin) return NextResponse.json({ ok: false, error: "Supabase admin is not configured." }, { status: 500 });
  if (!ok) return NextResponse.json({ ok: false, error: "Owner authentication required." }, { status: 401 });

  let body: { task_id?: string; status?: "pending" | "done" | "skipped" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!body.task_id || !body.status || !["pending", "done", "skipped"].includes(body.status)) {
    return NextResponse.json({ ok: false, error: "task_id and a valid status are required." }, { status: 400 });
  }

  const completedAt = body.status === "done" ? new Date().toISOString() : null;
  const { error } = await admin
    .from("client_onboarding_tasks")
    .update({ status: body.status, completed_at: completedAt, updated_at: new Date().toISOString() })
    .eq("id", body.task_id);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
