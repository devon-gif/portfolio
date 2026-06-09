// POST /api/research/reject  { candidate_id: string, reason?: string }
// Marks a contact_candidate as rejected.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: { candidate_id?: string; reason?: string };
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const candidateId = body.candidate_id?.trim();
  if (!candidateId) return Response.json({ ok: false, error: "candidate_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { error } = await admin
    .from("contact_candidates")
    .update({ status: "rejected", notes: body.reason ? `Rejected: ${body.reason}` : "Rejected by user." })
    .eq("id", candidateId);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 422 });
  return Response.json({ ok: true });
}
