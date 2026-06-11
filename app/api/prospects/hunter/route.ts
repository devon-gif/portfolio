// POST /api/prospects/hunter  { contact_id }
//
// Runs Hunter.io email finder + verifier for a contact directly.
// Updates the contacts table with the found email and verification status.
// Manual-only — never runs automatically.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import {
  hunterEmailFinder,
  hunterEmailVerifier,
  isHunterConfigured,
  mapHunterVerifierStatus,
} from "@/lib/hunter";

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

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Server not configured." }, { status: 500 });
  }
  if (!isHunterConfigured()) {
    return Response.json({ ok: false, error: "HUNTER_API_KEY not configured." }, { status: 400 });
  }

  let body: { contact_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const contactId = body.contact_id?.trim();
  if (!contactId) {
    return Response.json({ ok: false, error: "contact_id is required." }, { status: 400 });
  }

  const admin = getAdminClient();

  // Get contact with company website
  const { data: contact, error: cErr } = await admin
    .from("contacts")
    .select("id, first_name, last_name, email, company_id, companies(website)")
    .eq("id", contactId)
    .single();

  if (cErr || !contact) {
    return Response.json({ ok: false, error: "Contact not found." }, { status: 404 });
  }

  const firstName = contact.first_name?.trim();
  const lastName = contact.last_name?.trim();
  if (!firstName || !lastName) {
    return Response.json({ ok: false, error: "Contact needs a first and last name." }, { status: 422 });
  }

  const company = contact.companies as { website?: string | null } | null;
  const domain = domainFromUrl(company?.website);
  if (!domain) {
    return Response.json({ ok: false, error: "Company has no website — domain unavailable." }, { status: 422 });
  }

  const nowIso = new Date().toISOString();

  // Hunter Email Finder
  const found = await hunterEmailFinder(domain, firstName, lastName);
  if (!found.ok || !found.data) {
    return Response.json(
      { ok: false, error: found.error ?? "Hunter email finder returned no result." },
      { status: found.status ?? 422 },
    );
  }

  const email = found.data.email ?? null;
  const finderScore = typeof found.data.score === "number" ? found.data.score : 0;

  if (!email) {
    return Response.json({
      ok: true,
      email: null,
      email_verification_status: "unknown",
      score: finderScore,
      domain,
      message: "Hunter found no email for this name and domain.",
    });
  }

  // Hunter Email Verifier
  const verified = await hunterEmailVerifier(email);
  const vData = verified.data;
  const verifyStatus = mapHunterVerifierStatus(vData?.status ?? vData?.result);
  const verifyScore = typeof vData?.score === "number" ? vData.score : finderScore;

  // Map to the contacts table column type
  const emailVerificationStatus: string = verifyStatus; // "verified" | "risky" | "invalid" | "unverified"

  // Update the contact
  const { error: updateErr } = await admin
    .from("contacts")
    .update({
      email,
      email_verification_status: emailVerificationStatus,
      email_confidence: verifyScore,
      enrichment_date: nowIso,
    })
    .eq("id", contactId);

  if (updateErr) {
    return Response.json({ ok: false, error: updateErr.message }, { status: 500 });
  }

  return Response.json({
    ok: true,
    email,
    email_verification_status: emailVerificationStatus,
    score: verifyScore,
    finder_score: finderScore,
    domain,
  });
}
