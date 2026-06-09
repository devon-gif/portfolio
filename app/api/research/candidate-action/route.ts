export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

// POST /api/research/candidate-action
// { candidate_id, action }
// Manual-only bookkeeping for review workflow; never sends any messages.
export async function POST(req: Request) {
  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });

  let body: { candidate_id?: string; action?: string };
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const candidateId = body.candidate_id?.trim();
  const action = body.action?.trim();
  if (!candidateId || !action) return Response.json({ ok: false, error: "candidate_id and action are required." }, { status: 400 });

  const allowed = new Set([
    "create_email_draft",
    "create_linkedin_draft",
    "create_contact_form_task",
    "verify_with_hunter",
    "manual_review",
    "skip",
  ]);
  if (!allowed.has(action)) return Response.json({ ok: false, error: "Unsupported action." }, { status: 422 });

  const admin = getAdminClient();

  if (action === "skip") {
    await admin
      .from("contact_candidates")
      .update({ status: "rejected", recommended_action: "skip", notes: "Skipped by user." })
      .eq("id", candidateId);
    return Response.json({ ok: true, status: "rejected" });
  }

  await admin
    .from("contact_candidates")
    .update({ recommended_action: action, notes: `Manual action selected: ${action}` })
    .eq("id", candidateId);

  return Response.json({ ok: true, action });
}
