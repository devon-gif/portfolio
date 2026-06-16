// LinkedIn Scorecard Launch Board — constants, manual message library, daily
// next-action logic, and example target titles.
//
// IMPORTANT: This module supports MANUAL outreach only. Nothing here sends,
// scrapes, or automates LinkedIn. Every message is a copy block Devon pastes
// himself. Voice follows ABOUT ME/voice-profile.md: short, human, direct,
// low-pressure, easy out. The CTA is always a 3-Property Creative Gap Review.

export type TargetType =
  | "direct_buyer"
  | "internal_champion"
  | "referral_partner"
  | "consultant"
  | "vendor_partner"
  | "local_hospitality"
  | "existing_connection"
  | "other";

export const TARGET_TYPES: { value: TargetType; label: string }[] = [
  { value: "direct_buyer", label: "Direct buyer" },
  { value: "internal_champion", label: "Internal champion" },
  { value: "referral_partner", label: "Referral partner" },
  { value: "consultant", label: "Consultant" },
  { value: "vendor_partner", label: "Vendor partner" },
  { value: "local_hospitality", label: "Local hospitality" },
  { value: "existing_connection", label: "Existing connection" },
  { value: "other", label: "Other" },
];

export type Priority = "high" | "medium" | "low";
export const PRIORITIES: Priority[] = ["high", "medium", "low"];

export type ConnectionStatus =
  | "not_connected"
  | "connection_requested"
  | "connected"
  | "message_sent"
  | "scorecard_sent"
  | "responded"
  | "not_interested"
  | "call_booked"
  | "archived";

export const CONNECTION_STATUSES: { value: ConnectionStatus; label: string }[] = [
  { value: "not_connected", label: "Not connected" },
  { value: "connection_requested", label: "Connection requested" },
  { value: "connected", label: "Connected" },
  { value: "message_sent", label: "Message sent" },
  { value: "scorecard_sent", label: "Scorecard sent" },
  { value: "responded", label: "Responded" },
  { value: "not_interested", label: "Not interested" },
  { value: "call_booked", label: "Call booked" },
  { value: "archived", label: "Archived" },
];

export const STATUS_LABEL: Record<ConnectionStatus, string> = Object.fromEntries(
  CONNECTION_STATUSES.map((s) => [s.value, s.label]),
) as Record<ConnectionStatus, string>;

export const TARGET_TYPE_LABEL: Record<TargetType, string> = Object.fromEntries(
  TARGET_TYPES.map((t) => [t.value, t.label]),
) as Record<TargetType, string>;

/* ------------------------------------------------------------------ */
/* Daily action queue — map a target to its single next action.        */
/* ------------------------------------------------------------------ */

export type NextAction =
  | "add_connection"
  | "send_first_message"
  | "send_scorecard"
  | "follow_up"
  | "ask_gap_review"
  | "nurture"
  | "none";

export const ACTION_GROUPS: { key: NextAction; label: string; hint: string }[] = [
  { key: "add_connection", label: "Add connection", hint: "Send a personal connection request." },
  { key: "send_first_message", label: "Send first message", hint: "Newly connected — open with something real." },
  { key: "send_scorecard", label: "Send scorecard link", hint: "Share the scorecard as a helpful tool." },
  { key: "follow_up", label: "Follow up", hint: "Scorecard sent — check back in, no pressure." },
  { key: "ask_gap_review", label: "Ask for Creative Gap Review", hint: "They responded — offer the review." },
  { key: "nurture", label: "Nurture", hint: "Keep warm. Revisit later." },
];

/** A target's single next action, derived from its connection status. */
export function nextActionFor(t: {
  connection_status: ConnectionStatus;
  creative_gap_review_requested?: boolean;
  call_booked?: boolean;
}): NextAction {
  if (t.call_booked || t.connection_status === "call_booked") return "none";
  if (t.connection_status === "archived" || t.connection_status === "not_interested") return "nurture";
  if (t.creative_gap_review_requested) return "ask_gap_review";
  switch (t.connection_status) {
    case "not_connected":
      return "add_connection";
    case "connection_requested":
      return "nurture"; // waiting on them to accept
    case "connected":
      return "send_first_message";
    case "message_sent":
      return "send_scorecard";
    case "scorecard_sent":
      return "follow_up";
    case "responded":
      return "ask_gap_review";
    default:
      return "nurture";
  }
}

/* ------------------------------------------------------------------ */
/* Example target titles (helper panel — NOT seeded as real records).  */
/* ------------------------------------------------------------------ */

export const EXAMPLE_TARGETS: { title: string; type: TargetType; note: string }[] = [
  { title: "Director of Digital Marketing", type: "internal_champion", note: "Owns the feeds — feels the bandwidth gap daily." },
  { title: "VP Sales & Marketing", type: "direct_buyer", note: "Budget + portfolio view. Strong direct buyer." },
  { title: "Area Director of Sales & Marketing", type: "direct_buyer", note: "Multi-property scope; good pilot fit." },
  { title: "VP Revenue Strategy", type: "direct_buyer", note: "Cares about attention → action signals." },
  { title: "Commercial Strategy Leader", type: "direct_buyer", note: "Ties creative to commercial goals." },
  { title: "Hotel GM", type: "direct_buyer", note: "Single-property decision maker." },
  { title: "F&B Director", type: "internal_champion", note: "Restaurant/bar/event promos pain point." },
  { title: "Hospitality consultant", type: "consultant", note: "Can refer multiple properties." },
  { title: "Hotel vendor / referral partner", type: "referral_partner", note: "Adjacent vendor who shares clients." },
  { title: "HSMAI chapter leader", type: "referral_partner", note: "Network hub for marketing/sales leaders." },
];

/* ------------------------------------------------------------------ */
/* Manual message library (copy/paste). Voice: Devon.                  */
/* {{name}} / {{property}} = personalize before sending.               */
/* ------------------------------------------------------------------ */

export type MessageBlock = {
  id: string;
  letter: string;
  title: string;
  whenToUse: string;
  body: string;
};

// Built with the public links so the copy always matches the live routes.
export function buildMessageLibrary(scorecardUrl: string, gapReviewUrl: string): MessageBlock[] {
  return [
    {
      id: "connection_buyer",
      letter: "A",
      title: "Connection request — hotel marketing / sales leaders",
      whenToUse: "Cold connect to a marketing, sales, revenue, or GM leader.",
      body: `Hi {{name}} — I work with a few hotels on the creative side (social, F&B/event promos, the stuff that keeps a property looking sharp online). Always glad to connect with people doing the marketing/sales side of hospitality. No pitch — just like staying close to the work.`,
    },
    {
      id: "connection_partner",
      letter: "B",
      title: "Connection request — referral partners",
      whenToUse: "Connect to consultants, vendors, or network leaders who share clients.",
      body: `Hi {{name}} — looks like we run in the same hospitality circles. I handle property-level creative for a few hotels and restaurants, so I tend to overlap with folks like you a lot. Happy to connect and trade notes when it's useful.`,
    },
    {
      id: "first_message",
      letter: "C",
      title: "First message after connecting",
      whenToUse: "Right after they accept. Open with something real, leave an easy out.",
      body: `Thanks for connecting, {{name}}. Quick context, no agenda: I help hotels turn the photos and events they already have into steady social, F&B, and local campaign creative — basically an extra set of hands so the feeds don't go quiet. What does the creative side look like for {{property}} right now — handled in-house, or kind of squeezed in between everything else?`,
    },
    {
      id: "scorecard_send",
      letter: "D",
      title: "Scorecard send message",
      whenToUse: "Share the scorecard as a helpful tool, not a sales trap.",
      body: `Made a quick thing you might find useful — a Hotel Creative Bandwidth Scorecard. It's 10 questions, takes about 3–5 minutes, and tells you where your property-level marketing is strong vs stretched (social, F&B/events, local, reporting). No email wall to see your score. Here if you want it: ${scorecardUrl} — curious what you land on.`,
    },
    {
      id: "follow_up",
      letter: "E",
      title: "Follow-up after scorecard sent",
      whenToUse: "A few days later if they went quiet. Soft, no pressure.",
      body: `No pressure at all, {{name}} — just circling back on that scorecard in case it got buried. If you did run it, happy to tell you what the score usually means and where the quickest wins are. If now's not the time, all good. Worth a quick look? ${scorecardUrl}`,
    },
    {
      id: "gap_review_invite",
      letter: "F",
      title: "Creative Gap Review invite",
      whenToUse: "They responded or completed the scorecard — offer the review.",
      body: `Want me to put eyes on it directly? I do a free 3-Property Creative Gap Review — send me 3 property links and I'll map the biggest creative opportunities across social, F&B/events, local campaigns, and reporting. No deck, no pitch, just where the gains are. You can send links here: ${gapReviewUrl} — or I can pull a short Google Meet together if that's easier.`,
    },
    {
      id: "nurture",
      letter: "G",
      title: "Soft no-pressure nurture",
      whenToUse: "Keep a warm-but-not-now target alive without bugging them.",
      body: `All good, {{name}} — I'll leave it with you. If the creative bandwidth thing ever gets loud (peak season, a new property, F&B push), the scorecard's a fast gut-check and I'm easy to reach. Either way, glad we're connected.`,
    },
  ];
}

/** Public LinkedIn post promoting the scorecard. */
export function buildLinkedInPost(scorecardUrl: string): string {
  return [
    `Most hotels don't have a marketing problem. They have a creative bandwidth problem.`,
    ``,
    `The photos exist. The events are booked. The menus change every season. But the person posting is usually a GM or a marketing lead already covering five other jobs — so the feed goes quiet for two weeks, then three posts land in a day, then quiet again.`,
    ``,
    `I built a quick Hotel Creative Bandwidth Scorecard to help hospitality teams see where their property-level marketing is strong vs stretched — social, F&B/events, local campaigns, and what you can actually see in reporting.`,
    ``,
    `10 questions, ~3–5 minutes, no email wall to get your score.`,
    ``,
    `If you run hotels, restaurants, spas, or venues, it's a useful gut-check: ${scorecardUrl}`,
    ``,
    `Curious what you land on.`,
  ].join("\n");
}

/** Short DM version for sharing the scorecard 1:1. */
export function buildShortDM(scorecardUrl: string): string {
  return `Made a quick Hotel Creative Bandwidth Scorecard — 10 questions, ~3–5 min, no email wall. Tells you where your property marketing is strong vs stretched. Worth a look: ${scorecardUrl}`;
}
