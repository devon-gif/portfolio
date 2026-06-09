// POST /api/signals/hiring/save
// Saves one hiring-signal result as an Opportunity OS company for MANUAL review.
// Inserts a companies row only. Never sends email, never runs Hunter, never
// schedules anything. Deduplicates on hiring_job_url.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

interface SaveBody {
  name?: string;
  jobUrl?: string;
  roleTitle?: string;
  platform?: string;
  sourceUrl?: string;
  summary?: string;
}

function deriveWebsite(jobUrl: string): string | null {
  try {
    const u = new URL(jobUrl);
    return `${u.protocol}//${u.hostname}`;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: SaveBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const jobUrl = (body.jobUrl ?? "").trim();
  const roleTitle = (body.roleTitle ?? "").trim();
  const platform = (body.platform ?? "").trim() || null;
  const sourceUrl = (body.sourceUrl ?? "").trim() || jobUrl || null;
  const summary = (body.summary ?? "").trim() || null;

  if (!name) return Response.json({ ok: false, error: "Company name is required." }, { status: 400 });
  if (!jobUrl) return Response.json({ ok: false, error: "A job URL is required." }, { status: 400 });

  const admin = getAdminClient();

  // Dedupe: skip if we've already saved this exact job URL.
  const { data: existing } = await admin
    .from("companies")
    .select("id, name")
    .eq("hiring_job_url", jobUrl)
    .maybeSingle();
  if (existing) {
    return Response.json({ ok: true, company_id: existing.id, already_saved: true });
  }

  const { data: inserted, error } = await admin
    .from("companies")
    .insert({
      name,
      type: "other",
      website: deriveWebsite(jobUrl),
      lead_type: "hiring_signal",
      opportunity_type: "hiring_signal",
      opportunity_trigger: "hiring for marketing/content/social/design role",
      hiring_role_title: roleTitle || null,
      hiring_job_url: jobUrl,
      hiring_platform: platform,
      trigger_source_url: sourceUrl,
      trigger_summary: summary,
      opportunity_status: "new_signal",
      recommended_approach: "contract alternative to full-time creative/social hire",
      recommended_next_action: "find decision maker and draft hiring-signal outreach",
      last_signal_at: new Date().toISOString(),
      notes: "Saved from Hiring Signal Finder. Not enriched by Hunter. No outreach sent.",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return Response.json(
      { ok: false, error: error?.message ?? "Failed to save company." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true, company_id: inserted.id, already_saved: false });
}
