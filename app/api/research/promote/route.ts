// POST /api/research/promote  { candidate_id: string }
// Promotes a contact_candidate to a real contact in the contacts table.
// Never sends any emails. Creates an outreach queue item in 'draft' status only.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: { candidate_id?: string };
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const candidateId = body.candidate_id?.trim();
  if (!candidateId) return Response.json({ ok: false, error: "candidate_id is required." }, { status: 400 });

  const admin = getAdminClient();

  const { data: cand, error: cErr } = await admin
    .from("contact_candidates")
    .select("*")
    .eq("id", candidateId)
    .single();
  if (cErr || !cand) return Response.json({ ok: false, error: "Candidate not found." }, { status: 404 });

  if (cand.status === "promoted" && cand.promoted_contact_id) {
    return Response.json({ ok: true, contact_id: cand.promoted_contact_id, already_promoted: true });
  }

  // Check suppression list before creating a contact
  if (cand.email) {
    const { data: suppressed } = await admin
      .from("suppression_list")
      .select("id")
      .eq("email", cand.email.toLowerCase())
      .maybeSingle();
    if (suppressed) {
      await admin.from("contact_candidates").update({ status: "rejected", notes: "Email on suppression list." }).eq("id", candidateId);
      return Response.json({ ok: false, error: "Email is on the suppression list. Candidate rejected." }, { status: 422 });
    }
  }

  // Parse name
  const nameParts = (cand.name ?? "").trim().split(/\s+/);
  const firstName = nameParts[0] ?? "Unknown";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Insert contact — only columns that exist in the live schema
  const { data: contact, error: insertErr } = await admin
    .from("contacts")
    .insert({
      first_name: firstName,
      last_name: lastName,
      title: cand.title ?? null,
      email: cand.email ?? null,
      linkedin_url: cand.linkedin_url ?? null,
      company_id: cand.company_id ?? null,
      type: "unknown",
      status: "new",
      source: "import",
      notes: [cand.notes, cand.source_excerpt].filter(Boolean).join("\n").slice(0, 500),
    })
    .select("id")
    .single();

  if (insertErr || !contact) {
    return Response.json({ ok: false, error: insertErr?.message ?? "Failed to create contact." }, { status: 422 });
  }

  // Mark candidate as promoted
  await admin.from("contact_candidates")
    .update({ status: "promoted", promoted_contact_id: contact.id })
    .eq("id", candidateId);

  return Response.json({ ok: true, contact_id: contact.id });
}
