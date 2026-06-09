// GET /api/research/status?company_id=<uuid>
// Returns the latest research run for a company, plus candidate count.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  const url = new URL(req.url);
  const companyId = url.searchParams.get("company_id")?.trim();
  if (!companyId) return Response.json({ ok: false, error: "company_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { data: run } = await admin
    .from("research_runs")
    .select("id, status, error_msg, pages_scraped, fit_score, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { count } = await admin
    .from("contact_candidates")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .eq("status", "needs_review");

  return Response.json({ ok: true, run: run ?? null, candidate_count: count ?? 0 });
}
