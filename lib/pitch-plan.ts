// ─────────────────────────────────────────────────────────────────────────────
// Account Pitch Plan generator — pure functions, no I/O, no sending.
// Builds a tailored outreach + pitch plan from facts DEVON enters. It never
// claims facts that weren't entered. Used by /account-pitch-planner.
// ─────────────────────────────────────────────────────────────────────────────

export const ACCOUNT_TYPES = [
  "hotel management company", "hotel group", "resort group", "boutique/lifestyle group",
  "restaurant group", "spa/wellness group", "event/wedding venue", "hospitality vendor",
  "consultant/referral source",
] as const;

export const CONTACT_TYPES = [
  "direct buyer", "router", "executive sponsor", "referral partner", "vendor partner", "hiring signal",
] as const;

export const CREATIVE_QUALITY = ["unknown", "weak", "average", "strong", "inconsistent"] as const;
export const WARM_PATH = ["yes", "no", "unknown"] as const;

export const RELATIONSHIP_STATUS = [
  "not connected", "connection sent", "connected", "messaged", "replied",
  "call booked", "deck sent", "proposal sent", "won", "nurture",
] as const;

export interface PitchPlanInputs {
  company: string;
  website: string;
  accountType: string;
  propertyCount: string;
  brands: string;
  hasFnb: boolean;
  hasEvents: boolean;
  hasSpa: boolean;
  hasMeetings: boolean;
  creativeQuality: string;
  warmPath: string;
  hiringSignal: boolean;
  activePoster: boolean;
  dmVisible: boolean;
  revLeaderVisible: boolean;
  contactName: string;
  contactTitle: string;
  contactType: string;
  notes: string;
  relationshipStatus: string;
}

export interface PitchPlanSection {
  heading: string;
  body: string;
  copyable?: boolean; // render with a copy button (messages)
}

// ── Scoring (spec rules, capped at 10) ───────────────────────────────────────
export function scorePlan(i: PitchPlanInputs): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const n = parseInt(i.propertyCount, 10);
  if (!isNaN(n) && n >= 2) { score += 2; reasons.push(`Multi-property company (${n} properties): +2`); }
  if (i.hasFnb || i.hasEvents || i.hasSpa || i.hasMeetings) {
    score += 2;
    const surfaces = [i.hasFnb && "F&B", i.hasEvents && "events/weddings", i.hasSpa && "spa", i.hasMeetings && "meetings/groups"].filter(Boolean).join(", ");
    reasons.push(`Revenue surfaces beyond rooms (${surfaces}): +2`);
  }
  if (i.dmVisible) { score += 1; reasons.push("Marketing/digital decision-maker visible: +1"); }
  if (i.revLeaderVisible) { score += 1; reasons.push("Revenue/commercial leader visible: +1"); }
  if (i.creativeQuality === "weak" || i.creativeQuality === "inconsistent") {
    score += 1; reasons.push(`Creative quality is ${i.creativeQuality}: +1`);
  }
  if (i.warmPath === "yes") { score += 1; reasons.push("Warm intro path exists: +1"); }
  if (i.hiringSignal) { score += 1; reasons.push("Hiring marketing/social/content role: +1"); }
  if (i.activePoster) { score += 1; reasons.push("Contact is an active LinkedIn poster: +1"); }
  return { score: Math.min(score, 10), reasons };
}

// ── Persona guidance ─────────────────────────────────────────────────────────
const PERSONA_RULES: [RegExp, string][] = [
  [/digital/i, "Director of Digital Marketing — best primary target; closest to the creative gap."],
  [/vp.*(sales|marketing)|chief (marketing|commercial)/i, "VP Sales & Marketing — strong buyer/router; structural questions land best."],
  [/area.*dosm|area director|regional director/i, "Area/Regional DOSM — strong buyer/router for property clusters."],
  [/commercial/i, "VP Commercial Strategy — executive strategy angle; ask who owns creative consistency."],
  [/revenue/i, "Revenue leader — use the demand/perceived-value angle, not a creative pitch."],
  [/operat/i, "Operations leader — headcount/workflow angle: output without another role to manage."],
  [/procure|purchas/i, "Purchasing/procurement — vendor-approval route only; do NOT pitch here first."],
  [/hr|recruit|talent|people/i, "HR/recruiting — hiring/headcount angle only; respect the hire."],
  [/consult|advis|vendor|task ?force/i, "Consultant/vendor — referral partner angle, recurring cut."],
  [/general manager|^gm$/i, "General Manager — property-level pain; good champion, may route up for budget."],
];

export function personaGuidance(title: string): string {
  for (const [re, advice] of PERSONA_RULES) if (re.test(title)) return advice;
  return "Title not matched to a persona rule — default to the question-led buyer opener and let their reply route you.";
}

// ── Messaging by contact type ────────────────────────────────────────────────
function firstMessage(i: PitchPlanInputs): string {
  const co = i.company || "[Company]";
  const first = i.contactName ? i.contactName.split(" ")[0] : "[First]";
  switch (i.contactType) {
    case "executive sponsor":
      return `Hi ${first} — one question about ${co}: who owns creative consistency and property-level marketing output across the portfolio? Most groups your size either centralize it thin or let each property improvise. Happy to send a short thought-starter on what I noticed before asking for any time.`;
    case "referral partner":
      return `Hi ${first} — you're closer to hotel owners and operators than I am, so a direct question: do you see many groups struggling with creative bandwidth at the property level? I run the system that covers that gap, and I pay a recurring referral percentage when an intro becomes a monthly client.`;
    case "hiring signal":
      return `Hi ${first} — saw ${co} is hiring for [Role]. That role usually covers a lot: social content, design, campaigns, video, local promos. Archer Design can carry that creative output as an outside partner while you hire, or instead of adding headcount. Worth seeing a few examples?`;
    case "vendor partner":
      return `Hi ${first} — you're in front of hotel decision-makers every week. Quick question: do you see properties struggling to keep creative consistent? I cover that as an outside system and pay recurring referral fees on intros that become clients. Worth comparing notes?`;
    case "router":
      return `Hi ${first} — trying to find the right door at ${co}: who owns property-level creative and social? Happy to send them two examples so the handoff has substance instead of just a pitch.`;
    default: // direct buyer
      return `Hi ${first} — quick question about ${co}: is property-level creative handled centrally, or does each hotel mostly handle social, campaigns, and local promos on its own?`;
  }
}

function followUp(i: PitchPlanInputs): string {
  const co = i.company || "[Company]";
  if (i.contactType === "referral partner" || i.contactType === "vendor partner") {
    return `No pressure on this, but one nudge: if even one of your hotel relationships has the creative-bandwidth problem, it's worth a two-line intro — recurring cut for you, zero delivery work. Anyone come to mind since we talked?`;
  }
  return `One thing I see with groups like ${co}: plenty to promote — rooms${i.hasFnb ? ", F&B" : ""}${i.hasEvents ? ", events/weddings" : ""}${i.hasSpa ? ", spa" : ""} — but not enough creative bandwidth to keep it consistent across properties. That's the gap I cover. Worth seeing what a 3–5 property pilot would look like?`;
}

// ── Island-style detection ───────────────────────────────────────────────────
function isIslandStyle(i: PitchPlanInputs): boolean {
  const n = parseInt(i.propertyCount, 10);
  return (
    /island/i.test(i.company) ||
    (i.accountType === "hotel management company" && !isNaN(n) && n >= 10)
  );
}

// ── Plan generation ──────────────────────────────────────────────────────────
export function generatePitchPlan(i: PitchPlanInputs): { score: number; sections: PitchPlanSection[] } {
  const { score, reasons } = scorePlan(i);
  const co = i.company || "[Company]";
  const island = isIslandStyle(i);
  const surfaces = [i.hasFnb && "F&B", i.hasEvents && "events/weddings", i.hasSpa && "spa/wellness", i.hasMeetings && "meeting/group business"].filter(Boolean).join(", ");

  const angle =
    i.contactType === "referral partner" || i.contactType === "vendor partner"
      ? "Referral partner: recurring cut for warm intros, zero delivery work."
      : i.contactType === "hiring signal" || i.hiringSignal
      ? "Contract alternative: cover the creative output while they hire, or instead of the hire."
      : i.creativeQuality === "weak" || i.creativeQuality === "inconsistent"
      ? "Portfolio consistency: the feeds don't match the properties — a creative system fixes the layer templates miss."
      : "Creative bandwidth: more to promote than the team can produce; fixed-fee system instead of headcount.";

  const sections: PitchPlanSection[] = [
    {
      heading: "1. Fit score",
      body: `${score}/10${score >= 8 ? " — Priority 8+. Work this account this week." : score >= 5 ? " — solid; worth a structured sequence." : " — low; comment/warm only, don't spend prime outreach time."}\n${reasons.map((r) => `• ${r}`).join("\n") || "• No scoring signals entered yet — fill in the account facts."}`,
    },
    {
      heading: "2. Why this account is a fit",
      body: [
        `${co} is a ${i.accountType}${i.propertyCount ? ` with ${i.propertyCount} properties` : ""}${i.brands ? ` (${i.brands})` : ""}.`,
        surfaces ? `Revenue surfaces beyond rooms: ${surfaces} — more to promote than internal bandwidth covers.` : "",
        i.creativeQuality !== "unknown" ? `Current creative quality: ${i.creativeQuality}.` : "",
        i.notes ? `Research notes: ${i.notes}` : "",
      ].filter(Boolean).join(" "),
    },
    { heading: "3. Best angle", body: angle },
    {
      heading: "4. Best first person to message",
      body: i.contactName
        ? `${i.contactName}${i.contactTitle ? ` (${i.contactTitle})` : ""} — ${personaGuidance(i.contactTitle)}${island ? "\nIsland-style account: use a short, permission-based first message and offer a thought-starter BEFORE asking for a Google Meet." : ""}`
        : "No contact entered. Target order: Director of Digital Marketing > Corporate Director of Marketing > VP Sales & Marketing > Area DOSM. Find the person closest to day-to-day creative who is senior enough to route.",
    },
    {
      heading: "5. Secondary route if no reply",
      body: island
        ? `Hold the primary route for 3 full business days. Only then route through ONE secondary executive (e.g. a Mark George / Michelle Westbrook-level leader on an Island-style org chart) with a short routing note — never a re-pitch. Do not message multiple executives at once.`
        : `Wait 3 business days, then ONE secondary: a routing message to the next-closest persona (VP S&M ↔ Area DOSM ↔ GM). Reference that you reached out to [primary] so it reads as routing, not blasting.`,
    },
    {
      heading: "6. Do-not-message-yet contacts",
      body: "Everyone except the primary. Specifically hold: procurement/purchasing (vendor route only), HR (unless hiring-signal angle), and all other executives until the 3-business-day window passes. One thread per company at a time.",
    },
    { heading: "7. Best first message", body: firstMessage(i), copyable: true },
    { heading: "8. Follow-up message", body: followUp(i), copyable: true },
    {
      heading: "9. “Send info” response",
      body: `Absolutely. Short version: Archer Design gives hospitality groups a fixed monthly creative system — social graphics, short-form motion, campaign visuals, F&B/event promos, photo polishing, new branded creative, optional local SEO — without adding another full-time hire. The best starting point for ${co} is usually a 3–5 property pilot. I'll send a few examples and the pilot breakdown — is the interest more rooms-level creative${i.hasFnb ? ", F&B" : ""}, or portfolio consistency?`,
      copyable: true,
    },
    {
      heading: "10. Meeting ask",
      body: `Want to do 25 minutes on Google Meet this week? I'll walk through what I noticed across ${co}'s properties and what a 3–5 property pilot would look like with your actual property list. If it's not a fit, we'll know fast. [Calendly link]`,
      copyable: true,
    },
    {
      heading: "11. Deck intro slide copy",
      body: `${co} — ${i.propertyCount || "[N]"} properties, one creative standard.\n"You operate ${i.propertyCount || "[N]"} properties${i.brands ? ` across ${i.brands}` : ""}. We looked at how the portfolio shows up online — here's what we noticed, and what 3–5 of your properties could look like with a dedicated creative system behind them."`,
      copyable: true,
    },
    {
      heading: "12. 3–5 property pilot recommendation",
      body: `Recommend a ${score >= 7 ? "5-property portfolio pilot (from $10,000/mo)" : "3-property pilot (from $4,500/mo)"}${i.hasFnb ? ", weighted toward F&B promos" : ""}${i.hasEvents ? ", with event/wedding campaign coverage" : ""}. Pick the most photogenic properties plus one F&B- or event-heavy one. One month, one approval workflow, one invoice; expansion on evidence.`,
    },
    {
      heading: "13. Proof examples to show",
      body: [
        "Hotel Indigo Pittsburgh (boutique flag) · Hampton Inn properties (select-service, brand standards)",
        i.hasFnb ? "Eliza Hot Metal Bistro (hotel F&B promos)" : "",
        i.hasSpa ? "Elements (spa/wellness creative)" : "",
        "Stats if asked: 13.9M+ impressions · 543K+ engagements · 3.6M+ reach · 2.4K+ assets delivered.",
      ].filter(Boolean).join("\n"),
    },
    {
      heading: "14. Likely objections",
      body: [
        `"We already have a team" → extension/overflow, never replacement.`,
        i.brands ? `"We use brand templates" → templates cover the flag layer; property-level F&B, events, and local moments are where they're thin.` : "",
        `"Budget is tight" → loaded cost of one hire ($90K+) vs a fixed pilot; start at 3 properties.`,
        `"Send info" → send 2–3 matched examples + pilot one-pager, attach a question, then book the call.`,
      ].filter(Boolean).join("\n"),
    },
    {
      heading: "15. Suggested next action",
      body: nextAction(i, score),
    },
    {
      heading: "16. CRM stage recommendation",
      body: stageRecommendation(i),
    },
  ];

  return { score, sections };
}

function nextAction(i: PitchPlanInputs, score: number): string {
  switch (i.relationshipStatus) {
    case "not connected": return i.warmPath === "yes"
      ? "Ask the warm source for the intro FIRST (see /intro-sources) — a warm intro beats a cold connect. If no movement in a week, send the connection request."
      : `Send the connection request today${score >= 8 ? " — this is a priority account" : ""}. No note, or one real line about their property.`;
    case "connection sent": return "Wait for the accept. Meanwhile: comment on their last 1–2 posts so your name is familiar when it lands.";
    case "connected": return "Send the first message (section 7) today. Question-led, no pitch, no links.";
    case "messaged": return "Hold 3 business days, then the follow-up (section 8). Comment on their content in between.";
    case "replied": return "Reply within hours. If positive: examples matched to their category, then the meeting ask (section 10). Log the reply to Winning Messages.";
    case "call booked": return "Prep: portfolio screenshots, 2–3 before/afters in their category, the pilot slide with plausible properties pre-filled. Use the Google Meet script (docs/sales).";
    case "deck sent": return "Same-day touch: 'the part most groups react to is the pilot scope — which 3–5 properties would you pick?' Then the 2/5-day deck follow-up sequence.";
    case "proposal sent": return "Follow up in 2 business days with one specific scope question. Don't re-sell — help them decide.";
    case "won": return "Deliver brilliantly, then ask for the case-study permission and one referral intro at day 30.";
    default: return "Nurture: comment monthly, re-approach at their next season/event/hiring signal.";
  }
}

function stageRecommendation(i: PitchPlanInputs): string {
  const map: Record<string, string> = {
    "not connected": "Identified → Warming (start commenting before connecting)",
    "connection sent": "Connection Sent",
    "connected": "Connected → DM1 Sent (after section 7 goes out)",
    "messaged": "DM1 Sent",
    "replied": "Engaged — consider Sample Requested if they asked to see work",
    "call booked": "Call Booked",
    "deck sent": "Engaged → Pilot Offered once the proposal goes out",
    "proposal sent": "Pilot Offered",
    "won": "Won",
    "nurture": "Nurture",
  };
  return map[i.relationshipStatus] ?? "Identified";
}
