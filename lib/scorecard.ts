// Hotel Creative Bandwidth Scorecard — shared types, content, and scoring logic.
// Used by the public form (/hotel-creative-scorecard), the submission API
// (/api/scorecard), and the admin view (/scorecard-submissions).
//
// Keep all scoring/copy here so the form preview and the server-stored result
// can never drift apart.

export const SCORECARD_TITLE = "Hotel Creative Bandwidth Scorecard";
export const SCORECARD_SUBTITLE =
  "Find out whether your property-level marketing is helping your hotels look as strong online as they do in person.";

/* ------------------------------------------------------------------ */
/* Lead fields                                                         */
/* ------------------------------------------------------------------ */

export const COMPANY_TYPES = [
  { value: "hotel_group", label: "Hotel group" },
  { value: "hotel_management_company", label: "Hotel management company" },
  { value: "single_hotel", label: "Single hotel" },
  { value: "restaurant_group", label: "Restaurant group" },
  { value: "spa_wellness", label: "Spa / wellness" },
  { value: "resort", label: "Resort" },
  { value: "event_venue", label: "Event venue" },
  { value: "vendor_consultant", label: "Vendor / consultant" },
  { value: "other", label: "Other" },
] as const;

export type CompanyType = (typeof COMPANY_TYPES)[number]["value"];

export const PROPERTY_COUNTS = ["1", "2-3", "4-5", "6-10", "11+"] as const;
export type PropertyCount = (typeof PROPERTY_COUNTS)[number];

/* ------------------------------------------------------------------ */
/* Scoring questions                                                   */
/* ------------------------------------------------------------------ */

export type AnswerValue = 0 | 5 | 10;

export const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 0, label: "Weak / not happening" },
  { value: 5, label: "Inconsistent / sometimes" },
  { value: 10, label: "Strong / systemized" },
];

export type ScorecardQuestion = {
  id: string;
  /** Short label used for "strongest gaps" in results + admin. */
  pillar: string;
  prompt: string;
};

export const QUESTIONS: ScorecardQuestion[] = [
  {
    id: "q1",
    pillar: "Visual consistency",
    prompt:
      "Do your properties look visually consistent and professional across social, local campaigns, event promos, and online channels?",
  },
  {
    id: "q2",
    pillar: "Content rhythm",
    prompt:
      "Can each property maintain a steady content rhythm without scrambling every week?",
  },
  {
    id: "q3",
    pillar: "F&B promotion",
    prompt:
      "Are restaurants, bars, specials, menus, brunches, private dining, or F&B events promoted with strong creative?",
  },
  {
    id: "q4",
    pillar: "Events & venue assets",
    prompt:
      "Do your events, weddings, meeting spaces, group offers, and venue features have polished promotional assets?",
  },
  {
    id: "q5",
    pillar: "Local & seasonal campaigns",
    prompt:
      "Does your team consistently turn local events, holidays, nearby attractions, and seasonal demand into campaigns?",
  },
  {
    id: "q6",
    pillar: "Photo quality",
    prompt:
      "Are existing property photos, food photos, amenity photos, and event photos polished enough to represent the property well online?",
  },
  {
    id: "q7",
    pillar: "Short-form motion",
    prompt:
      "Is your team creating short-form motion, Reels, animated graphics, or video-style assets consistently?",
  },
  {
    id: "q8",
    pillar: "Local SEO & GBP",
    prompt:
      "Are your properties regularly updating local content, Google Business Profile posts, service/event information, and search-friendly copy?",
  },
  {
    id: "q9",
    pillar: "Measurable attention",
    prompt:
      "Can your team clearly see which campaigns are creating attention, clicks, engagement, inquiries, or booking-support signals?",
  },
  {
    id: "q10",
    pillar: "Creative bandwidth",
    prompt:
      "Does your team have enough creative bandwidth to keep up without overloading internal marketing, sales, or property teams?",
  },
];

export const MAX_SCORE = QUESTIONS.length * 10; // 100

/* ------------------------------------------------------------------ */
/* Score bands                                                         */
/* ------------------------------------------------------------------ */

export type ScoreBandKey =
  | "critical_gap"
  | "stretched"
  | "strong_foundation"
  | "strong_system";

export type ScoreBand = {
  key: ScoreBandKey;
  label: string;
  min: number;
  max: number;
  /** Short explanation shown on the results page. */
  explanation: string;
  /** Recommended next step stored on the submission. */
  recommendedNextStep: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  {
    key: "critical_gap",
    label: "Critical Creative Gap",
    min: 0,
    max: 35,
    explanation:
      "Right now your properties almost certainly look stronger in person than they do online. Creative is happening in bursts, if at all, and the gap is visible to guests, planners, and local searchers before they ever reach the front desk. This is the highest-leverage place to build a system.",
    recommendedNextStep:
      "Start with a property-level creative audit and a fixed monthly system so every property has consistent social, F&B/event, and local campaign coverage instead of one-off scrambles.",
  },
  {
    key: "stretched",
    label: "Stretched and Inconsistent",
    min: 36,
    max: 60,
    explanation:
      "The foundation is there, but it depends on a few people finding time. Some channels look great, others go quiet, and the quality swings property to property and week to week. The bottleneck is bandwidth, not talent — a steady cadence would close most of the gap.",
    recommendedNextStep:
      "Add a steady monthly creative cadence and a clear content rhythm so the strong work you already do shows up consistently across every property and channel.",
  },
  {
    key: "strong_foundation",
    label: "Strong Foundation, Missing Scale",
    min: 61,
    max: 80,
    explanation:
      "You have real creative strength and most channels are covered. What's missing is scale and repeatability — turning what your best property does into the standard every property hits, plus clearer visibility into what's actually driving attention and action.",
    recommendedNextStep:
      "Systemize what already works: standardize your strongest property's output across the portfolio and add lightweight reporting so you can see measurable attention and action.",
  },
  {
    key: "strong_system",
    label: "Strong Creative System",
    min: 81,
    max: 100,
    explanation:
      "Your property-level creative consistency is genuinely strong. The opportunity now is at the margins — protecting bandwidth during peak season, deepening F&B/event and motion coverage, and tightening the link between creative and measurable booking-support signals where tracking is available.",
    recommendedNextStep:
      "Use a focused review to find the few remaining gaps — peak-season bandwidth, motion, and campaign tracking — and lock in a system that holds up as you grow.",
  },
];

export function bandForScore(score: number): ScoreBand {
  return (
    SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ??
    SCORE_BANDS[SCORE_BANDS.length - 1]
  );
}

/* ------------------------------------------------------------------ */
/* Scoring + derived fields                                            */
/* ------------------------------------------------------------------ */

export type ScorecardAnswers = Record<string, AnswerValue>;

export function totalScore(answers: ScorecardAnswers): number {
  return QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
}

/**
 * The weakest pillars (lowest-scoring answers), used for "strongest gaps".
 * Returns pillar labels for any answer scored 0 or 5, lowest first, capped.
 */
export function topGaps(answers: ScorecardAnswers, limit = 3): string[] {
  return QUESTIONS.map((q) => ({ pillar: q.pillar, value: answers[q.id] ?? 0 }))
    .filter((x) => x.value < 10)
    .sort((a, b) => a.value - b.value)
    .slice(0, limit)
    .map((x) => x.pillar);
}

/* ------------------------------------------------------------------ */
/* Lead score                                                          */
/* ------------------------------------------------------------------ */

const HIGH_INTENT_ROLE =
  /(market|sales|revenue|gm|general manager|owner|operat|commercial|digital|principal|founder|director|vp|chief|cmo|coo)/i;

// Property counts that count as "3+ properties" for fit scoring.
const MULTI_PROPERTY: PropertyCount[] = ["2-3", "4-5", "6-10", "11+"];

export type LeadScoreInput = {
  companyType: CompanyType;
  propertyCount: PropertyCount;
  role: string;
  score: number;
  requestedReview: boolean;
  website: string;
};

/** Lead score out of 10 (capped). See README rules. */
export function leadScore(input: LeadScoreInput): number {
  let s = 0;
  if (
    input.companyType === "hotel_group" ||
    input.companyType === "hotel_management_company"
  )
    s += 3;
  if (MULTI_PROPERTY.includes(input.propertyCount)) s += 2;
  if (HIGH_INTENT_ROLE.test(input.role)) s += 2;
  if (input.score < 70) s += 2;
  if (input.website.trim().length > 0) s += 1;
  if (input.requestedReview) s += 1;
  return Math.min(s, 10);
}

export type LeadTier = {
  key: "hot" | "good" | "nurture" | "low";
  label: string;
  min: number;
  max: number;
};

export const LEAD_TIERS: LeadTier[] = [
  { key: "hot", label: "Hot Lead", min: 8, max: 10 },
  { key: "good", label: "Good Fit", min: 6, max: 7 },
  { key: "nurture", label: "Nurture", min: 3, max: 5 },
  { key: "low", label: "Low Fit", min: 0, max: 2 },
];

export function leadTier(score: number): LeadTier {
  return LEAD_TIERS.find((t) => score >= t.min && score <= t.max) ?? LEAD_TIERS[3];
}

/* ------------------------------------------------------------------ */
/* Admin: statuses + copyable follow-up messages                       */
/* ------------------------------------------------------------------ */

export const SUBMISSION_STATUSES = [
  "new",
  "scorecard_completed",
  "reviewed",
  "follow_up_sent",
  "creative_gap_review_requested",
  "calendly_clicked",
  "review_requested",
  "call_booked",
  "deck_sent",
  "proposal_sent",
  "won",
  "lost",
  "nurture",
  "archived",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "New",
  scorecard_completed: "Scorecard completed",
  reviewed: "Reviewed",
  follow_up_sent: "Follow-up sent",
  creative_gap_review_requested: "Gap review requested",
  calendly_clicked: "Calendly clicked",
  review_requested: "Review requested",
  call_booked: "Call booked",
  deck_sent: "Deck sent",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  nurture: "Nurture",
  archived: "Archived",
};

/**
 * Manual, copy/paste follow-up message generator. Mentions the score and 1–2
 * weak categories, offers a 3-Property Creative Gap Review, and reads like
 * Devon: human, direct, professional. Nothing auto-sends.
 */
export function renderFollowup(args: {
  band: ScoreBandKey;
  name: string;
  company: string;
  score: number;
  gaps: string[];
}): string {
  const first = args.name?.split(" ")[0] || "there";
  const co = args.company || "your properties";
  const weak = args.gaps.slice(0, 2);
  const weakPhrase =
    weak.length === 2
      ? `${weak[0].toLowerCase()} and ${weak[1].toLowerCase()}`
      : weak.length === 1
        ? weak[0].toLowerCase()
        : "a few areas";

  const openings: Record<ScoreBandKey, string> = {
    critical_gap: `your ${args.score}/100 points to a real gap between how the properties look in person and how they show up online. Right now ${weakPhrase} look like the areas costing you the most attention.`,
    stretched: `your ${args.score}/100 says the activity is there, but the system is stretched — strong work in places, quiet stretches in others. ${capitalize(weakPhrase)} stood out as where it slips first.`,
    strong_foundation: `your ${args.score}/100 is a strong foundation. The opportunity now is scaling that consistency across every property — ${weakPhrase} are where I'd start.`,
    strong_system: `your ${args.score}/100 is genuinely strong. At this level it's about overflow, special campaigns, and multi-property support — ${weakPhrase} are the few places with room left.`,
  };

  return [
    `Hi ${first} — thanks for running the Hotel Creative Bandwidth Scorecard for ${co}. A quick read: ${openings[args.band]}`,
    ``,
    `If it's useful, I'll do a free 3-Property Creative Gap Review — send me 3 property links and I'll map the biggest creative opportunities around social, F&B/events, local campaigns, and reporting. No pitch, just a clear picture of where the gains are.`,
    ``,
    `Want me to send over a Google Meet link?`,
    ``,
    `— Devon, Archer Design`,
  ].join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ */
/* CTA copy                                                            */
/* ------------------------------------------------------------------ */

export const CTA_LABEL = "Request a 3-Property Creative Gap Review";
export const CTA_SUBTEXT =
  "Send over 3 property links and I'll map the biggest creative opportunities around social, F&B/events, local campaigns, and reporting.";

// Optional booking link. Leave empty to show the manual-request placeholder.
export const BOOKING_URL = process.env.NEXT_PUBLIC_SCORECARD_BOOKING_URL ?? "";

export type SubmissionResult = {
  scoreTotal: number;
  band: ScoreBand;
  gaps: string[];
};

/* ------------------------------------------------------------------ */
/* Calendly handoff                                                    */
/* ------------------------------------------------------------------ */

export type CalendlyPrefill = {
  name: string;
  email: string;
  company?: string | null;
  role?: string | null;
  website?: string | null;
  scoreTotal?: number | null;
  scoreBandLabel?: string | null;
  gaps?: string[] | null;
  propertyLinks?: string[] | null;
};

/**
 * Build a prefilled Calendly booking URL. Calendly reads `name`/`email` for the
 * invitee and `a1..aN` for custom invitee-question answers. The a-index mapping
 * below should match the question order configured on the Calendly event type.
 * All values are URL-encoded. Returns "" if no base URL is configured.
 */
export function buildCalendlyUrl(baseUrl: string, p: CalendlyPrefill): string {
  if (!baseUrl) return "";
  const params = new URLSearchParams();
  if (p.name) params.set("name", p.name);
  if (p.email) params.set("email", p.email);
  // Custom invitee questions (configure these on the Calendly event in this order):
  if (p.company) params.set("a1", p.company);              // a1 = company
  if (p.website) params.set("a2", p.website);              // a2 = website
  if (p.scoreBandLabel) params.set("a3", p.scoreBandLabel); // a3 = score band
  if (p.scoreTotal != null) params.set("a4", `${p.scoreTotal}/100`); // a4 = score
  if (p.gaps && p.gaps.length) params.set("a5", p.gaps.join(", "));  // a5 = strongest gaps
  if (p.role) params.set("a6", p.role);                    // a6 = role
  if (p.propertyLinks && p.propertyLinks.length) params.set("a7", p.propertyLinks.join("\n")); // a7 = property links
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}${params.toString()}`;
}
