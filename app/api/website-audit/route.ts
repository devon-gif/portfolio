import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/server-supabase";
import {
  buildCalendlyUrl,
  extractWebsiteForAudit,
  runHospitalityAudit,
} from "@/lib/hospitality-ai-audit";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendLeadNotification(params: {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  website?: string;
  score?: number;
  scoreBand?: string;
  confidence?: string;
  strongestGaps?: string[];
  quickWins?: string[];
  adminPath?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;

  if (!apiKey || !to || !from) {
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const subject = `New AI Hotel Creative Audit: ${
    params.company || params.website || "New lead"
  } — ${params.score || "?"}/100`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5;">
      <h2>New AI Hotel Creative Audit</h2>
      <p><strong>Name:</strong> ${params.name || ""}</p>
      <p><strong>Email:</strong> ${params.email || ""}</p>
      <p><strong>Company:</strong> ${params.company || ""}</p>
      <p><strong>Role:</strong> ${params.role || ""}</p>
      <p><strong>Website:</strong> ${params.website || ""}</p>
      <p><strong>Score:</strong> ${params.score || ""}/100</p>
      <p><strong>Score band:</strong> ${params.scoreBand || ""}</p>
      <p><strong>Confidence:</strong> ${params.confidence || ""}</p>
      <p><strong>Strongest gaps:</strong> ${(params.strongestGaps || []).join(", ")}</p>
      <p><strong>Quick wins:</strong> ${(params.quickWins || []).join(", ")}</p>
      ${
        params.adminPath && siteUrl
          ? `<p><a href="${siteUrl}${params.adminPath}">Open in admin</a></p>`
          : ""
      }
    </div>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: params.email || undefined,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.AI_AUDIT_ENABLED === "false") {
      return NextResponse.json(
        { error: "AI audit is currently disabled." },
        { status: 503 }
      );
    }

    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim();
    const role = String(body.role || "").trim();
    const websiteRaw = String(body.website || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid work email is required." },
        { status: 400 }
      );
    }

    if (!websiteRaw) {
      return NextResponse.json({ error: "Website is required." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const extracted = await extractWebsiteForAudit(websiteRaw);

    const cacheDays = Number(process.env.AI_AUDIT_CACHE_DAYS || 7);
    const cacheCutoff = new Date(
      Date.now() - cacheDays * 24 * 60 * 60 * 1000
    ).toISOString();

    let auditRecord: any = null;
    let auditResult: any = null;
    let aiModel = process.env.AI_AUDIT_MODEL || "gpt-5-nano";

    if (supabase) {
      const { data: cached } = await supabase
        .from("website_audits")
        .select("*")
        .eq("normalized_domain", extracted.normalizedDomain)
        .gte("created_at", cacheCutoff)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cached?.ai_result) {
        auditRecord = cached;
        auditResult = cached.ai_result;
        aiModel = cached.ai_model || aiModel;
      }
    }

    if (!auditResult) {
      const ai = await runHospitalityAudit({
        website: extracted,
        company,
        role,
      });

      aiModel = ai.model;
      auditResult = ai.result;

      if (supabase) {
        const { data, error } = await supabase
          .from("website_audits")
          .insert({
            website_url: extracted.normalizedUrl,
            normalized_domain: extracted.normalizedDomain,
            source_urls: extracted.sourceUrls,
            extracted_title: extracted.title,
            extracted_meta: extracted.meta,
            extracted_text: extracted.text,
            social_links: extracted.socialLinks,
            ai_model: aiModel,
            ai_result: auditResult,
            score_total: auditResult.score_total,
            score_band: auditResult.score_band,
            confidence: auditResult.confidence,
            status: "completed",
          })
          .select()
          .single();

        if (!error) auditRecord = data;
      }
    }

    let submission: any = null;

    if (supabase) {
      const { data } = await supabase
        .from("scorecard_submissions")
        .insert({
          name,
          email,
          company,
          role,
          website: extracted.normalizedUrl,
          source: body.source || "ai_website_audit",
          utm_source: body.utm_source || null,
          utm_medium: body.utm_medium || null,
          utm_campaign: body.utm_campaign || null,
          utm_content: body.utm_content || null,
          score_total: auditResult.score_total,
          score_band: auditResult.score_band,
          confidence: auditResult.confidence,
          strongest_gaps: auditResult.strongest_gaps || [],
          quick_wins: auditResult.quick_wins || [],
          recommended_next_step: auditResult.recommended_next_step,
          ai_audit_id: auditRecord?.id || null,
          status: "ai_audit_completed",
        })
        .select()
        .single();

      submission = data;
    }

    const calendlyUrl = buildCalendlyUrl({
      name,
      email,
      company,
      website: extracted.normalizedUrl,
      score: auditResult.score_total,
      scoreBand: auditResult.score_band,
      strongestGaps: auditResult.strongest_gaps || [],
      recommendedNextStep: auditResult.recommended_next_step,
    });

    await sendLeadNotification({
      name,
      email,
      company,
      role,
      website: extracted.normalizedUrl,
      score: auditResult.score_total,
      scoreBand: auditResult.score_band,
      confidence: auditResult.confidence,
      strongestGaps: auditResult.strongest_gaps || [],
      quickWins: auditResult.quick_wins || [],
      adminPath: submission?.id ? `/scorecard-submissions` : undefined,
    });

    return NextResponse.json({
      ok: true,
      submission_id: submission?.id || null,
      audit_id: auditRecord?.id || null,
      website: extracted.normalizedUrl,
      domain: extracted.normalizedDomain,
      result: auditResult,
      calendlyUrl,
    });
  } catch (error: any) {
    console.error("[website-audit]", error);

    const message = String(error?.message || "");

    const isOpenAIQuotaError =
      message.includes("insufficient_quota") ||
      message.includes("exceeded your current quota") ||
      message.includes("monthly usage limit") ||
      message.includes("billing details");

    if (isOpenAIQuotaError) {
      return NextResponse.json(
        {
          error:
            "The AI audit is temporarily unavailable while we finish connecting billing. You can still request a manual Creative Gap Review.",
          code: "ai_quota_unavailable",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          "The AI audit could not complete this scan. You can still request a manual Creative Gap Review.",
        debug:
          process.env.NODE_ENV !== "production"
            ? String(error?.message || error).slice(0, 1500)
            : undefined,
      },
      { status: 500 }
    );
  }
}
