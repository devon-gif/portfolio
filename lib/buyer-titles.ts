// Buyer-title prioritization for hotel outreach. Pure helpers (no I/O) so they
// can be used in any client/server component. Used to surface the best
// decision-maker contacts in the Email Command Center.

export type BuyerTier = "top" | "high" | "mid" | "other";

export interface BuyerMatch {
  tier: BuyerTier;
  score: number; // higher = better buyer
  label: string; // normalized label for the badge
}

// Ordered by priority. First keyword match wins. Keywords are matched against a
// lowercased title string.
const RULES: { keywords: string[]; tier: BuyerTier; score: number; label: string }[] = [
  // ── Top buyers (own the marketing/commercial decision) ──
  { keywords: ["director of sales & marketing", "director of sales and marketing", "dosm"], tier: "top", score: 10, label: "Director of Sales & Marketing" },
  { keywords: ["corporate director of marketing"], tier: "top", score: 10, label: "Corporate Director of Marketing" },
  { keywords: ["vp commercial", "vice president commercial", "commercial strategy"], tier: "top", score: 10, label: "VP Commercial Strategy" },
  { keywords: ["vp marketing", "vp of marketing", "vice president of marketing", "vice president marketing"], tier: "top", score: 10, label: "VP Marketing" },
  { keywords: ["director of revenue", "director of commercial", "revenue strategy", "commercial director"], tier: "top", score: 9, label: "Director of Revenue / Commercial" },
  { keywords: ["general manager", "gm,", " gm", "owner", "president", "principal", "managing director"], tier: "top", score: 9, label: "GM / Owner / President" },
  // ── High-value department heads ──
  { keywords: ["director of f&b", "director of food", "food & beverage director", "f&b director"], tier: "high", score: 7, label: "Director of F&B" },
  { keywords: ["director of events", "events director", "catering & events", "director of catering"], tier: "high", score: 7, label: "Director of Events" },
  { keywords: ["spa director", "wellness director", "director of spa", "director of wellness"], tier: "high", score: 7, label: "Spa / Wellness Director" },
  { keywords: ["director of marketing", "marketing director"], tier: "high", score: 8, label: "Director of Marketing" },
  // ── Mid (influencers / doers) ──
  { keywords: ["marketing manager"], tier: "mid", score: 5, label: "Marketing Manager" },
  { keywords: ["social media manager", "social media", "content manager", "content creator", "digital marketing"], tier: "mid", score: 5, label: "Social / Content Manager" },
];

export function scoreBuyerTitle(title: string | null | undefined): BuyerMatch {
  const t = (title ?? "").toLowerCase();
  if (t.trim()) {
    for (const rule of RULES) {
      if (rule.keywords.some((k) => t.includes(k))) {
        return { tier: rule.tier, score: rule.score, label: rule.label };
      }
    }
  }
  return { tier: "other", score: 2, label: title?.trim() || "Unknown role" };
}

export const TIER_BADGE: Record<BuyerTier, string> = {
  top: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  high: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  mid: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  other: "bg-zinc-700/40 text-zinc-400 ring-zinc-600/40",
};

export const TIER_LABEL: Record<BuyerTier, string> = {
  top: "Top buyer",
  high: "Dept. head",
  mid: "Influencer",
  other: "Low priority",
};

// Friendly labels for the workflow's recommended_action values, plus the
// plain-language actions used across the pipeline.
const ACTION_LABELS: Record<string, string> = {
  research_company: "Research company",
  verify_with_hunter: "Find/verify email with Hunter",
  create_email_draft: "Generate email draft",
  create_linkedin_draft: "Draft LinkedIn (manual send)",
  create_contact_form_task: "Use contact form",
  promote: "Promote to Contact",
  manual_review: "Needs manual review",
  ready_to_approve: "Ready to approve",
  schedule_today: "Schedule today",
  skip: "Skip",
};

export function actionLabel(action: string | null | undefined): string {
  if (!action) return "Needs manual review";
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ");
}
