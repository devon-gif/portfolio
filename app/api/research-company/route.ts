// POST /api/research-company { company_id: string }
// Firecrawl-only company research. Does not send emails or call Hunter.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { runResearch } from "@/lib/research-run";

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }

  let body: { company_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const companyId = body.company_id?.trim();
  if (!companyId) {
    return Response.json({ ok: false, error: "company_id is required." }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data: company, error } = await admin
    .from("companies")
    .select("id, name, website")
    .eq("id", companyId)
    .single();

  if (error || !company) {
    return Response.json({ ok: false, error: "Company not found." }, { status: 404 });
  }

  if (!company.website?.trim()) {
    return Response.json({ ok: false, error: "Add a website before researching this company." }, { status: 400 });
  }

  const result = await runResearch(admin, company.id, company.website, company.name);
  return Response.json(result, { status: result.ok ? 200 : 422 });
}
