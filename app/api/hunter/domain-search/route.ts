export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { hunterDomainSearch, isHunterConfigured } from "@/lib/hunter";

function domainFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function actionForConfidence(confidence?: number, hasLinkedIn?: boolean): { action: string; channel: string } {
  const c = typeof confidence === "number" ? confidence : 0;
  if (c >= 85) return { action: "create_email_draft", channel: "email" };
  if (c >= 60) return { action: "verify_with_hunter", channel: "email" };
  if (hasLinkedIn) return { action: "create_linkedin_draft", channel: "linkedin" };
  return { action: "manual_review", channel: "needs_manual_research" };
}

// POST /api/hunter/domain-search  { company_id }
// Manual-only hunter enrichment. Never sends email.
export async function POST(req: Request) {
  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isHunterConfigured()) return Response.json({ ok: false, error: "HUNTER_API_KEY not configured." }, { status: 400 });

  let body: { company_id?: string };
  try { body = await req.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const companyId = body.company_id?.trim();
  if (!companyId) return Response.json({ ok: false, error: "company_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { data: company, error: cErr } = await admin
    .from("companies")
    .select("id, name, website")
    .eq("id", companyId)
    .single();
  if (cErr || !company) return Response.json({ ok: false, error: "Company not found." }, { status: 404 });
  if (!company.website) return Response.json({ ok: false, error: "Company has no website." }, { status: 400 });

  const domain = domainFromUrl(company.website);
  if (!domain) return Response.json({ ok: false, error: "Invalid company website URL." }, { status: 400 });

  const result = await hunterDomainSearch(domain);
  if (!result.ok || !result.data) return Response.json({ ok: false, error: result.error ?? "Hunter domain search failed." }, { status: result.status || 422 });

  const entries = result.data.emails ?? [];
  const now = new Date().toISOString();
  const rows = entries.slice(0, 25).map((e) => {
    const fullName = [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || null;
    const { action, channel } = actionForConfidence(e.confidence, !!e.linkedin);
    const emailStatus = e.confidence && e.confidence >= 85 ? "verified" : e.confidence && e.confidence >= 60 ? "unverified" : "risky";
    const sourceUrl = e.sources?.[0]?.uri || company.website;
    return {
      run_id: null,
      company_id: company.id,
      name: fullName,
      title: e.position ?? null,
      email: e.value ?? null,
      email_status: emailStatus,
      email_confidence: e.confidence ?? null,
      linkedin_url: e.linkedin ?? null,
      source_url: sourceUrl,
      source_type: "hunter_domain_search",
      source_excerpt: `Hunter domain search (${domain})`,
      confidence_score: Math.max(0, Math.min(100, e.confidence ?? 0)),
      recommended_channel: channel,
      recommended_action: action,
      status: "needs_review",
      hunter_used_at: now,
      hunter_raw_result: e,
      notes: `Hunter Domain Search manual run for ${domain}`,
    };
  });

  if (rows.length > 0) {
    await admin.from("contact_candidates").insert(rows);
  }

  return Response.json({ ok: true, inserted: rows.length, domain });
}
