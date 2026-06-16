import { createServerSupabaseClient } from "@/lib/server-supabase";

export type AuditGuideline = {
  version: string;
  title: string;
  system_prompt: string;
  scoring_rubric: any;
  guardrails: any;
  blocked_site_rules: any;
};

export const fallbackAuditGuideline: AuditGuideline = {
  version: "fallback-v1",
  title: "Fallback Archer Design Hospitality Creative Audit Guideline",
  system_prompt: `
You are running a preliminary public-facing hospitality creative audit for Archer Design.

Only use visible evidence. Do not claim bookings, revenue, occupancy, ad spend, staffing, private analytics, or internal workflow.

Focus on hospitality creative bandwidth: social creative, F&B/event promos, local campaigns, photo polish, meetings/weddings, Google Business Profile/local SEO content, CTA clarity, and reporting readiness.

If the scan is blocked, incomplete, or thin, confidence must be low and the next step should be a manual Creative Gap Review.
  `.trim(),
  scoring_rubric: {},
  guardrails: {
    rules: [
      "Do not claim bookings or revenue impact.",
      "Do not claim internal staffing problems unless stated.",
      "Do not over-score thin or blocked scans.",
      "Tie every gap to visible evidence or say it needs manual confirmation.",
    ],
  },
  blocked_site_rules: {
    blocked_site_score_label: "Limited Scan — Manual Review Recommended",
    blocked_site_confidence: "low",
  },
};

export async function getActiveAuditGuideline(): Promise<AuditGuideline> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return fallbackAuditGuideline;
  }

  const { data, error } = await supabase
    .from("audit_guidelines")
    .select("version,title,system_prompt,scoring_rubric,guardrails,blocked_site_rules")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return fallbackAuditGuideline;
  }

  return data as AuditGuideline;
}
