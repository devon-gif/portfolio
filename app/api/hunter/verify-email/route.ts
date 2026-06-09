export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { hunterEmailVerifier, isHunterConfigured, mapHunterVerifierStatus } from "@/lib/hunter";

// POST /api/hunter/verify-email  { candidate_id }
// Manual-only. Never sends email.
export async function POST(req: Request) {
  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isHunterConfigured()) return Response.json({ ok: false, error: "HUNTER_API_KEY not configured." }, { status: 400 });

  let body: { candidate_id?: string };
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const candidateId = body.candidate_id?.trim();
  if (!candidateId) return Response.json({ ok: false, error: "candidate_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { data: cand, error: cErr } = await admin
    .from("contact_candidates")
    .select("id, email, linkedin_url")
    .eq("id", candidateId)
    .single();
  if (cErr || !cand) return Response.json({ ok: false, error: "Candidate not found." }, { status: 404 });
  if (!cand.email) return Response.json({ ok: false, error: "Candidate has no email to verify." }, { status: 422 });

  const verified = await hunterEmailVerifier(cand.email);
  if (!verified.ok || !verified.data) return Response.json({ ok: false, error: verified.error ?? "Hunter email verifier failed." }, { status: verified.status || 422 });

  const mapped = mapHunterVerifierStatus(verified.data.status);
  const score = typeof verified.data.score === "number" ? verified.data.score : null;

  let recommendedAction = "manual_review";
  let recommendedChannel = "needs_manual_research";

  if (mapped === "verified") {
    recommendedAction = "create_email_draft";
    recommendedChannel = "email";
  } else if (mapped === "risky" || mapped === "unverified") {
    recommendedAction = cand.linkedin_url ? "create_linkedin_draft" : "manual_review";
    recommendedChannel = cand.linkedin_url ? "linkedin" : "needs_manual_research";
  } else if (mapped === "invalid") {
    recommendedAction = cand.linkedin_url ? "create_linkedin_draft" : "manual_review";
    recommendedChannel = cand.linkedin_url ? "linkedin" : "needs_manual_research";
  }

  await admin
    .from("contact_candidates")
    .update({
      email_status: mapped,
      email_confidence: score,
      source_type: "hunter_email_verifier",
      source_excerpt: `Hunter Email Verifier: ${cand.email}`,
      recommended_channel: recommendedChannel,
      recommended_action: recommendedAction,
      hunter_used_at: new Date().toISOString(),
      hunter_raw_result: verified.data,
    })
    .eq("id", candidateId);

  return Response.json({ ok: true, email: cand.email, status: mapped, score });
}
