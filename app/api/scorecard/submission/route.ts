// Scorecard submission handoff endpoint.
//   GET  ?id=<uuid>  → returns prefill data for the gap-review page.
//   POST { submissionId, propertyLinks?, biggestConcern?, calendlyClick? }
//        → saves optional property links + concern, updates status/timestamps,
//          and returns a prefilled Calendly URL built from the stored lead.
// Nothing here sends email or auto-books — it just records intent and hands off.
import { z } from "zod";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { buildCalendlyUrl, bandForScore, SCORE_BANDS } from "@/lib/scorecard";
import { normalizeLinks } from "@/lib/url";
import { sendLeadNotification } from "@/lib/lead-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BAND_LABEL: Record<string, string> = Object.fromEntries(
  SCORE_BANDS.map((b) => [b.key, b.label]),
);

type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  website: string | null;
  company_type: string | null;
  property_count: string | null;
  score_total: number | null;
  score_band: string | null;
  pain_points: string[] | null;
  property_links: string[] | null;
  biggest_concern: string | null;
  status: string;
};

function prefillFrom(row: SubmissionRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    website: row.website,
    companyType: row.company_type,
    propertyCount: row.property_count,
    scoreTotal: row.score_total,
    scoreBand: row.score_band,
    scoreBandLabel: row.score_band ? BAND_LABEL[row.score_band] ?? null : null,
    gaps: row.pain_points ?? [],
    propertyLinks: row.property_links ?? [],
    biggestConcern: row.biggest_concern ?? "",
  };
}

function calendlyFor(row: SubmissionRow, links: string[]): string {
  const base = (process.env.CALENDLY_CREATIVE_REVIEW_URL ?? "").trim();
  const bandLabel = row.score_band ? BAND_LABEL[row.score_band] ?? null : null;
  return buildCalendlyUrl(base, {
    name: row.name,
    email: row.email,
    company: row.company,
    role: row.role,
    website: row.website,
    scoreTotal: row.score_total,
    scoreBandLabel: bandLabel,
    gaps: row.pain_points ?? [],
    propertyLinks: links.length ? links : row.property_links ?? [],
  });
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!z.string().uuid().safeParse(id).success) {
    return Response.json({ ok: false, error: "Invalid id." }, { status: 400 });
  }
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Storage not configured." }, { status: 503 });
  }
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("scorecard_submissions")
    .select("id,name,email,company,role,website,company_type,property_count,score_total,score_band,pain_points,property_links,biggest_concern,status")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) {
    return Response.json({ ok: false, error: "Submission not found." }, { status: 404 });
  }
  return Response.json({ ok: true, prefill: prefillFrom(data as SubmissionRow) });
}

const postSchema = z.object({
  submissionId: z.string().uuid(),
  propertyLinks: z.array(z.string().trim().max(400)).max(3).optional().default([]),
  biggestConcern: z.string().trim().max(2000).optional().default(""),
  calendlyClick: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid request." }, { status: 400 });
  }
  if (!isAdminConfigured) {
    return Response.json({ ok: false, error: "Storage not configured." }, { status: 503 });
  }

  const d = parsed.data;
  const links = normalizeLinks(d.propertyLinks);
  const admin = getAdminClient();

  const { data: row, error: fetchErr } = await admin
    .from("scorecard_submissions")
    .select("id,name,email,company,role,website,company_type,property_count,score_total,score_band,pain_points,property_links,biggest_concern,status")
    .eq("id", d.submissionId)
    .maybeSingle();
  if (fetchErr || !row) {
    return Response.json({ ok: false, error: "Submission not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { updated_at: now };
  const hasLinks = links.length > 0;
  const hasConcern = d.biggestConcern.trim().length > 0;

  if (hasLinks) patch.property_links = links;
  if (hasConcern) patch.biggest_concern = d.biggestConcern.trim();

  // Status progression — never downgrade a lead that's already further along.
  const advanced = new Set(["call_booked", "deck_sent", "proposal_sent", "won"]);
  const current = (row as SubmissionRow).status;
  if (hasLinks || hasConcern) {
    patch.review_requested_at = now;
    if (!advanced.has(current)) patch.status = "review_requested";
  }
  if (d.calendlyClick) {
    patch.calendly_clicked_at = now;
    if (!advanced.has(current) && !(hasLinks || hasConcern)) patch.status = "calendly_clicked";
  }

  const { error: updErr } = await admin.from("scorecard_submissions").update(patch).eq("id", d.submissionId);
  if (updErr) {
    return Response.json({ ok: false, error: updErr.message }, { status: 500 });
  }

  // Ensure score_band is populated for the Calendly label even on older rows.
  const r = row as SubmissionRow;
  if (!r.score_band && r.score_total != null) r.score_band = bandForScore(r.score_total).key;

  // Notify Devon of the handoff event (best-effort).
  if (hasLinks || hasConcern) {
    await sendLeadNotification("review_requested", {
      name: r.name, email: r.email, company: r.company, role: r.role, website: r.website,
      scoreTotal: r.score_total, scoreBand: r.score_band ? BAND_LABEL[r.score_band] ?? r.score_band : null,
      strongestGaps: r.pain_points, propertyLinks: links.length ? links : r.property_links,
      reviewRequested: true, ctaClicked: d.calendlyClick,
    });
  } else if (d.calendlyClick) {
    await sendLeadNotification("calendly_clicked", {
      name: r.name, email: r.email, company: r.company, role: r.role, website: r.website,
      scoreTotal: r.score_total, scoreBand: r.score_band ? BAND_LABEL[r.score_band] ?? r.score_band : null,
      strongestGaps: r.pain_points, ctaClicked: true,
    });
  }

  const calendlyUrl = calendlyFor(r, links);
  return Response.json({ ok: true, calendlyUrl, calendlyConfigured: calendlyUrl.length > 0 });
}
