// Public Hotel Creative Bandwidth Scorecard submission endpoint.
// Validates input, scores it server-side (single source of truth), stores the
// lead, and returns the result so the page can render it. Nothing auto-sends.
import { z } from "zod";
import { getAdminClient, isAdminConfigured } from "@/lib/supabase-admin";
import { sendLeadNotification } from "@/lib/lead-notify";
import {
  COMPANY_TYPES,
  PROPERTY_COUNTS,
  QUESTIONS,
  bandForScore,
  leadScore,
  topGaps,
  totalScore,
  type AnswerValue,
  type CompanyType,
  type PropertyCount,
} from "@/lib/scorecard";

const COMPANY_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  COMPANY_TYPES.map((c) => [c.value, c.label]),
);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const companyTypeValues = COMPANY_TYPES.map((c) => c.value) as [string, ...string[]];

const answersShape = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, z.union([z.literal(0), z.literal(5), z.literal(10)])]),
) as Record<string, z.ZodTypeAny>;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  website: z.string().trim().max(300).optional().default(""),
  linkedinUrl: z.string().trim().max(300).optional().default(""),
  companyType: z.enum(companyTypeValues),
  propertyCount: z.enum(PROPERTY_COUNTS as unknown as [string, ...string[]]),
  answers: z.object(answersShape),
  requestedReview: z.boolean().optional().default(false),
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
      { ok: false, error: parsed.error.issues[0]?.message || "Please complete the scorecard." },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const answers = d.answers as Record<string, AnswerValue>;
  const score = totalScore(answers);
  const band = bandForScore(score);
  const gaps = topGaps(answers);
  const lead = leadScore({
    companyType: d.companyType as CompanyType,
    propertyCount: d.propertyCount as PropertyCount,
    role: d.role,
    score,
    requestedReview: d.requestedReview,
    website: d.website,
  });

  const result: {
    scoreTotal: number;
    band: { key: string; label: string; explanation: string };
    gaps: string[];
    recommendedNextStep: string;
    submissionId: string | null;
  } = {
    scoreTotal: score,
    band: { key: band.key, label: band.label, explanation: band.explanation },
    gaps,
    recommendedNextStep: band.recommendedNextStep,
    submissionId: null,
  };

  // Best-effort persistence. If Supabase isn't configured (e.g. local preview),
  // still return the result so the visitor sees their score.
  if (isAdminConfigured) {
    try {
      const admin = getAdminClient();
      const { data: inserted, error } = await admin.from("scorecard_submissions").insert({
        name: d.name,
        email: d.email,
        company: d.company,
        role: d.role,
        website: d.website || null,
        linkedin_url: d.linkedinUrl || null,
        company_type: d.companyType,
        property_count: d.propertyCount,
        score_total: score,
        score_band: band.key,
        answers_json: answers,
        pain_points: gaps,
        recommended_next_step: band.recommendedNextStep,
        lead_score: lead,
        status: "scorecard_completed",
      }).select("id").single();
      if (error) {
        return Response.json(
          { ok: true, persisted: false, result, warning: error.message },
          { status: 200 },
        );
      }
      result.submissionId = (inserted?.id as string) ?? null;
    } catch (error) {
      return Response.json(
        {
          ok: true,
          persisted: false,
          result,
          warning: error instanceof Error ? error.message : "Could not store submission.",
        },
        { status: 200 },
      );
    }
  }

  // Best-effort lead notification (after persistence so the admin link is valid).
  await sendLeadNotification("scorecard_completed", {
    name: d.name,
    email: d.email,
    company: d.company,
    role: d.role,
    website: d.website,
    companyType: COMPANY_TYPE_LABEL[d.companyType] ?? d.companyType,
    propertyCount: d.propertyCount,
    scoreTotal: score,
    scoreBand: band.label,
    strongestGaps: gaps,
    recommendedNextStep: band.recommendedNextStep,
    reviewRequested: d.requestedReview,
  });

  return Response.json({ ok: true, persisted: isAdminConfigured, result });
}
