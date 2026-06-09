export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import {
  hunterEmailFinder,
  hunterEmailVerifier,
  isHunterConfigured,
  mapHunterVerifierStatus,
} from "@/lib/hunter";

function splitName(name?: string | null): { first: string | null; last: string | null } {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return { first: null, last: null };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function domainFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const raw = url.trim();
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

// POST /api/hunter/find-email  { candidate_id, override? }
//
// MANUAL-ONLY enrichment. Never runs automatically. Steps:
//   1. Require first+last name and a company domain.
//   2. Require confidence_score >= 75 unless override === true.
//   3. Hunter Email Finder → if an email is returned, Hunter Email Verifier.
//   4. Only a *verified* email is marked safe (create_email_draft). Everything
//      else stays in review (manual_review / create_linkedin_draft). We never
//      mark a guessed/unverified email as safe to send.
export async function POST(req: Request) {
  if (!isAdminConfigured) return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  if (!isHunterConfigured()) return Response.json({ ok: false, error: "HUNTER_API_KEY not configured." }, { status: 400 });

  let body: { candidate_id?: string; override?: boolean };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const candidateId = body.candidate_id?.trim();
  const override = body.override === true;
  if (!candidateId) return Response.json({ ok: false, error: "candidate_id is required." }, { status: 400 });

  const admin = getAdminClient();
  const { data: cand, error: cErr } = await admin
    .from("contact_candidates")
    .select("id, company_id, name, title, linkedin_url, confidence_score")
    .eq("id", candidateId)
    .single();

  if (cErr || !cand) return Response.json({ ok: false, error: "Candidate not found." }, { status: 404 });

  if (!override && (cand.confidence_score ?? 0) < 75) {
    return Response.json(
      { ok: false, error: "Confidence must be >= 75 for Hunter (or pass override=true)." },
      { status: 422 },
    );
  }

  const { first, last } = splitName(cand.name);
  if (!first || !last) {
    return Response.json({ ok: false, error: "Candidate must include first and last name." }, { status: 422 });
  }

  const { data: company } = await admin
    .from("companies")
    .select("website")
    .eq("id", cand.company_id)
    .maybeSingle();
  const domain = domainFromUrl(company?.website);
  if (!domain) return Response.json({ ok: false, error: "Company website/domain unavailable." }, { status: 422 });

  // ── Step 1: Hunter Email Finder ─────────────────────────────────────────────
  const found = await hunterEmailFinder(domain, first, last);
  if (!found.ok || !found.data) {
    return Response.json(
      { ok: false, error: found.error ?? "Hunter email finder failed." },
      { status: found.status || 422 },
    );
  }

  const email = found.data.email ?? null;
  const finderScore = typeof found.data.score === "number" ? found.data.score : 0;
  const linkedin = found.data.linkedin_url ?? cand.linkedin_url ?? null;
  const nowIso = new Date().toISOString();

  // No email returned → nothing to verify. Leave it in review.
  if (!email) {
    const recommendedAction = linkedin ? "create_linkedin_draft" : "manual_review";
    const recommendedChannel = linkedin ? "linkedin" : "needs_manual_research";
    await admin
      .from("contact_candidates")
      .update({
        email_status: "needs_email",
        email_confidence: finderScore,
        ...(linkedin ? { linkedin_url: linkedin } : {}),
        source_type: "hunter_email_finder",
        source_excerpt: `Hunter Email Finder: no email for ${first} ${last} @ ${domain}`,
        recommended_channel: recommendedChannel,
        recommended_action: recommendedAction,
        hunter_used_at: nowIso,
        hunter_raw_result: { finder: found.data },
      })
      .eq("id", candidateId);

    return Response.json({
      ok: true,
      email: null,
      email_status: "needs_email",
      recommended_action: recommendedAction,
      score: finderScore,
      domain,
    });
  }

  // ── Step 2: Hunter Email Verifier ───────────────────────────────────────────
  const verified = await hunterEmailVerifier(email);
  const vData = verified.data;
  const verifyStatus = mapHunterVerifierStatus(vData?.status ?? vData?.result);
  const verifyScore = typeof vData?.score === "number" ? vData.score : finderScore;

  // Only a verified email is safe enough to draft against. Everything else
  // routes to manual review (or LinkedIn if we have a profile) and is NOT
  // marked safe to send.
  let emailStatus: "verified" | "risky" | "invalid" | "unverified";
  let recommendedAction: string;
  let recommendedChannel: string;

  if (verifyStatus === "verified") {
    emailStatus = "verified";
    recommendedAction = "create_email_draft";
    recommendedChannel = "email";
  } else {
    emailStatus = verifyStatus; // risky | invalid | unverified
    recommendedAction = linkedin ? "create_linkedin_draft" : "manual_review";
    recommendedChannel = linkedin ? "linkedin" : "needs_manual_research";
  }

  await admin
    .from("contact_candidates")
    .update({
      email,
      email_status: emailStatus,
      email_confidence: verifyScore,
      ...(linkedin ? { linkedin_url: linkedin } : {}),
      ...(found.data.position ? { title: found.data.position } : {}),
      source_type: "hunter_email_finder",
      source_excerpt: `Hunter: ${first} ${last} @ ${domain} → ${email} (${emailStatus})`,
      recommended_channel: recommendedChannel,
      recommended_action: recommendedAction,
      hunter_used_at: nowIso,
      hunter_raw_result: { finder: found.data, verifier: vData ?? null },
    })
    .eq("id", candidateId);

  return Response.json({
    ok: true,
    email,
    email_status: emailStatus,
    recommended_action: recommendedAction,
    score: verifyScore,
    finder_score: finderScore,
    domain,
    first,
    last,
  });
}
