// 3-Property Creative Gap Review — request type, statuses, and the admin
// prep-outline generator. Submissions land in `creative_gap_reviews`.

export const GAP_REVIEW_STATUSES = [
  "new",
  "reviewing",
  "review_prepared",
  "call_requested",
  "call_booked",
  "completed",
  "proposal_sent",
  "won",
  "lost",
  "archived",
] as const;

export type GapReviewStatus = (typeof GAP_REVIEW_STATUSES)[number];

export const GAP_REVIEW_STATUS_LABELS: Record<GapReviewStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  review_prepared: "Review prepared",
  call_requested: "Call requested",
  call_booked: "Call booked",
  completed: "Completed",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};

export type GapReview = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  website: string | null;
  property_urls: string[] | null;
  biggest_concern: string | null;
  preferred_call_time: string | null;
  status: GapReviewStatus;
  notes: string | null;
  linked_scorecard_submission_id: string | null;
};

/** Status-driven "next action" suggestion shown in the admin. */
export function gapReviewNextAction(status: GapReviewStatus): string {
  const map: Record<GapReviewStatus, string> = {
    new: "Open the property links and start the review prep outline.",
    reviewing: "Finish the prep outline and mark it review prepared.",
    review_prepared: "Send the manual follow-up and offer 2–3 Google Meet times.",
    call_requested: "Confirm a time and mark the call booked.",
    call_booked: "Run the call from the prep outline, then mark completed.",
    completed: "Send the 3–5 property pilot proposal.",
    proposal_sent: "Follow up on the proposal; move to won or lost.",
    won: "Hand off to onboarding.",
    lost: "Move to nurture or archive.",
    archived: "No action needed.",
  };
  return map[status];
}

/**
 * Copyable follow-up for a gap review request. Human, direct, no booking
 * claims. Mentions the review and offers to find a Google Meet time.
 */
export function gapReviewFollowup(r: {
  name?: string | null;
  company?: string | null;
  property_urls?: string[] | null;
}): string {
  const first = r.name?.split(" ")[0] || "there";
  const co = r.company || "your properties";
  const count = (r.property_urls ?? []).filter(Boolean).length || 3;
  return [
    `Hi ${first} — thanks for sending the ${count} property links for ${co}.`,
    ``,
    `I went through them and pulled together where the biggest creative opportunities are — across social consistency, F&B/events, local campaigns, and what you can see in reporting (the booking-support signals we can track where the data is available).`,
    ``,
    `Easiest next step is a short Google Meet so I can walk you through it. Do any of these work? [option 1] / [option 2] / [option 3] — or send a couple of windows that suit you.`,
    ``,
    `— Devon, Archer Design`,
  ].join("\n");
}

/**
 * Copyable prep outline Devon fills in before the Google Meet. Pre-seeds the
 * known facts and leaves clear prompts for the manual review work.
 */
export function reviewPrepOutline(r: {
  company?: string | null;
  name?: string | null;
  role?: string | null;
  website?: string | null;
  property_urls?: string[] | null;
  biggest_concern?: string | null;
  preferred_call_time?: string | null;
}): string {
  const co = r.company || "[Company]";
  const props = (r.property_urls ?? []).filter(Boolean);
  const propLines =
    props.length > 0
      ? props.map((p, i) => `   ${i + 1}. ${p}`).join("\n")
      : "   1. [property link]\n   2. [property link]\n   3. [property link]";

  return [
    `3-PROPERTY CREATIVE GAP REVIEW — PREP`,
    `${co}${r.name ? ` · ${r.name}` : ""}${r.role ? ` (${r.role})` : ""}`,
    ``,
    `1. COMPANY OVERVIEW`,
    `   - Type / size: [hotel group / resort / restaurant group …]`,
    `   - Website: ${r.website || "[none provided]"}`,
    `   - Stated biggest concern: ${r.biggest_concern || "[none provided]"}`,
    ``,
    `2. PROPERTY LINKS`,
    propLines,
    ``,
    `3. FIRST IMPRESSION`,
    `   - What a guest/planner sees in the first 5 seconds online:`,
    `   - Does it match the quality of the property in person?`,
    ``,
    `4. CREATIVE CONSISTENCY NOTES`,
    `   - Visual consistency across properties and channels:`,
    `   - Posting rhythm / quiet stretches:`,
    ``,
    `5. F&B / EVENT OPPORTUNITY`,
    `   - Restaurants, bars, specials, private dining, weddings, meetings:`,
    `   - Strongest untapped promo:`,
    ``,
    `6. LOCAL CAMPAIGN OPPORTUNITY`,
    `   - Seasonal demand, local events, nearby attractions to build around:`,
    ``,
    `7. PHOTO / MOTION OPPORTUNITY`,
    `   - Photo polish/retouch needs:`,
    `   - Short-form motion / Reels gaps:`,
    ``,
    `8. TRACKING / REPORTING OPPORTUNITY`,
    `   - What they can / can't currently see (booking-support signals where tracking is available):`,
    ``,
    `9. RECOMMENDED PILOT ANGLE`,
    `   - 3–5 property creative pilot focus:`,
    `   - Why these properties / this scope first:`,
    ``,
    `10. SUGGESTED GOOGLE MEET TALKING POINTS`,
    `   - Open with their score + the 1–2 weakest categories`,
    `   - Show 1 before/after that maps to their gap`,
    `   - Walk the 3–5 property pilot map`,
    `   - Proof: 14.8M+ impressions, 565K+ engagements, 670K+ reported post clicks`,
    `   - Next step: scope the pilot, confirm timeline`,
    r.preferred_call_time ? `\n   Preferred call time: ${r.preferred_call_time}` : ``,
  ].join("\n");
}
