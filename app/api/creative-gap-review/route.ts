// 3-Property Creative Gap Review request endpoint.
// Validates, stores the request, and links it to a prior scorecard submission
// (by email) when one exists. Nothing auto-sends.
import { z } from "zod";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  property1: z.string().trim().min(1, "Add at least one property link."),
  property2: z.string().trim().optional().default(""),
  property3: z.string().trim().optional().default(""),
  biggestConcern: z.string().trim().optional().default(""),
  preferredCallTime: z.string().trim().optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  submissionId: z.string().trim().uuid().optional().or(z.literal("")).default(""),
  source: z.string().trim().max(60).optional().default(""),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Please complete the form." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const propertyUrls = [d.property1, d.property2, d.property3].map((u) => u.trim()).filter(Boolean);

  if (!isAdminConfigured) {
    return Response.json({ ok: true, persisted: false });
  }

  try {
    const admin = getAdminClient();

    // Link to a scorecard lead: prefer the explicit submission_id passed from
    // the scorecard CTA, otherwise fall back to matching by email.
    let linkedId: string | null = null;
    if (d.submissionId) {
      const { data: byId } = await admin
        .from("scorecard_submissions")
        .select("id")
        .eq("id", d.submissionId)
        .maybeSingle();
      if (byId?.id) linkedId = byId.id as string;
    }
    if (!linkedId) {
      const { data: prior } = await admin
        .from("scorecard_submissions")
        .select("id")
        .eq("email", d.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (prior?.id) linkedId = prior.id as string;
    }

    const { error } = await admin.from("creative_gap_reviews").insert({
      name: d.name,
      email: d.email,
      company: d.company,
      role: d.role || null,
      website: d.website || null,
      property_urls: propertyUrls,
      biggest_concern: d.biggestConcern || null,
      preferred_call_time: d.preferredCallTime || null,
      notes: d.notes || null,
      status: "new",
      linked_scorecard_submission_id: linkedId,
    });
    if (error) {
      return Response.json({ ok: true, persisted: false, warning: error.message }, { status: 200 });
    }

    // If linked, advance the scorecard lead to "gap review requested".
    if (linkedId) {
      await admin
        .from("scorecard_submissions")
        .update({ status: "creative_gap_review_requested", updated_at: new Date().toISOString() })
        .eq("id", linkedId);
    }
  } catch (error) {
    return Response.json(
      { ok: true, persisted: false, warning: error instanceof Error ? error.message : "Could not store request." },
      { status: 200 },
    );
  }

  return Response.json({ ok: true, persisted: true });
}
