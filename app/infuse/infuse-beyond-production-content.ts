// ─────────────────────────────────────────────────────────────────────────────
// infuse-beyond-production-content.ts — copy for the "Beyond Creative
// Production" section (InfuseBeyondProduction.tsx). Sits after Capabilities
// and before the content-repurposing/AI section, broadening the pitch from
// graphic design + motion into day-to-day marketing execution — without
// reading as a full-service agency, a strategy replacement, a paid-media
// specialist, or an enterprise CRM consultant. Six editorial rows, not a
// SaaS icon grid.
// ─────────────────────────────────────────────────────────────────────────────

export const BEYOND_EYEBROW = "BEYOND CREATIVE PRODUCTION";
export const BEYOND_HEADLINE_LINE_1 = "More than design.";
export const BEYOND_HEADLINE_LINE_2 = "More execution capacity.";
export const BEYOND_COPY =
  "When the need goes beyond graphics or motion, I can also support the day-to-day marketing work around a campaign — from social and email to landing pages, sales materials and performance reporting.";
/** The second recurring positioning line, paired with POSITIONING_HEADLINE
 * ("An extension of your marketing team — not another agency layer.") in
 * the Capabilities section above. Placed here because this is exactly the
 * section broadening scope — the reassurance belongs right next to it. */
export const BEYOND_STRATEGY_LINE = "Strategy can stay with Infuse. I can help turn it into finished work.";

export type BeyondItem = {
  number: string;
  title: string;
  copy: string;
  examples: readonly string[];
  /** Sales Enablement only — the one item explicitly called out as one of
   * the strongest, with its own emphasized closing line. */
  emphasis?: string;
};

export const BEYOND_ITEMS: BeyondItem[] = [
  {
    number: "01",
    title: "Social Media Management",
    copy: "Content calendars, captions, scheduling, publishing, campaign rollouts, short-form motion and ongoing creative support for selected concepts or accounts.",
    examples: ["Calendars", "Captions", "Scheduling", "Publishing", "Reels", "Campaign support"],
  },
  {
    number: "02",
    title: "Campaign Execution",
    copy: "Turn a menu launch, new concept, seasonal promotion, event or activation into a coordinated campaign across social, email, signage, motion and digital creative.",
    examples: ["Launch campaigns", "Seasonal promotions", "Events", "Activations", "Multi-channel rollout"],
  },
  {
    number: "03",
    title: "Email + CRM Creative",
    copy: "Promotional emails, newsletters, nurture content, campaign graphics, templates and messaging support that keep customer communication moving.",
    examples: ["Newsletters", "Promotions", "Email graphics", "Templates", "Messaging", "Nurture content"],
  },
  {
    number: "04",
    title: "Landing Pages + Digital Support",
    copy: "Campaign landing pages, website updates, promotional pages, digital content and lightweight conversion-focused experiences built around specific marketing initiatives.",
    examples: ["Landing pages", "Website updates", "Campaign pages", "Digital promotions", "Conversion creative"],
  },
  {
    number: "05",
    title: "Sales Enablement",
    copy: "Proposal decks, RFP visuals, case studies, concept presentations, one-sheets and personalized digital experiences that help Infuse present its capabilities beautifully when pursuing new business.",
    examples: ["Proposal decks", "RFP creative", "Case studies", "Concept mockups", "Sales one-sheets", "Personalized microsites"],
    emphasis: "Creative support for winning the next account — not just marketing the current one.",
  },
  {
    number: "06",
    title: "Reporting + Insights",
    copy: "Lightweight monthly reporting that turns social, campaign and digital performance into clear takeaways about what worked, what changed and what should be tested next.",
    examples: ["Monthly reporting", "Campaign recap", "Social insights", "Content performance", "Next-step recommendations"],
  },
];
