// 5-email nurture sequence for scorecard leads. Copy/paste only — nothing here
// auto-sends. Voice: Devon — human, direct, premium, no buzzwords.
// [brackets] = personalize before sending.

export type NurtureEmail = {
  step: number;
  id: string;
  name: string;
  subject: string;
  body: string;
};

export const NURTURE_SEQUENCE: NurtureEmail[] = [
  {
    step: 1,
    id: "nurture_1_results",
    name: "Scorecard results + resources",
    subject: "Your Hotel Creative Bandwidth score + a couple of resources",
    body: [
      `Hi [First name],`,
      ``,
      `Thanks for running the Hotel Creative Bandwidth Scorecard. You landed at [score]/100 — [band], which usually means [one-line read of their situation].`,
      ``,
      `A couple of things that might be useful based on where you scored:`,
      `- The 3–5 Property Creative Pilot Map (how a small pilot is scoped)`,
      `- Before/after hospitality creative examples`,
      `- What we track beyond likes`,
      ``,
      `They all live here: [resource vault link].`,
      ``,
      `If you want, I'll do a free 3-Property Creative Gap Review — send me 3 property links and I'll map the biggest opportunities. No pitch.`,
      ``,
      `— Devon, Archer Design`,
    ].join("\n"),
  },
  {
    step: 2,
    id: "nurture_2_why",
    name: "Why hotel groups struggle with creative bandwidth",
    subject: "The real reason property creative goes quiet",
    body: [
      `Hi [First name],`,
      ``,
      `Most hotel groups don't have a creative talent problem. They have a bandwidth problem.`,
      ``,
      `The photos exist. The events are booked. The menus change with the season. But the person responsible for posting is usually a GM, a sales manager, or a marketing lead already covering five other jobs. So the feed goes quiet for two weeks, then three posts land in one day, then quiet again.`,
      ``,
      `That's exactly the pattern the scorecard tends to surface — strong work in bursts, no steady system underneath it. The fix isn't more effort from your team. It's property-level creative consistency that doesn't depend on someone finding time.`,
      ``,
      `More on how we think about it here: [resource vault link].`,
      ``,
      `— Devon`,
    ].join("\n"),
  },
  {
    step: 3,
    id: "nurture_3_pilot",
    name: "How a 3–5 property pilot works",
    subject: "How a 3–5 property creative pilot actually works",
    body: [
      `Hi [First name],`,
      ``,
      `Quick one on how we usually start, since a full rollout across every property at once rarely makes sense.`,
      ``,
      `We take 3–5 properties and run a focused creative pilot: a steady monthly stream of finished social, F&B/event, and local campaign assets, built from the photography and details you already have — approval-ready so your team only reviews and schedules.`,
      ``,
      `It's enough scope to see real property-level consistency and measurable attention and action, without committing the whole portfolio before you've seen the output.`,
      ``,
      `The pilot map walks the scope step by step: [resource vault link].`,
      ``,
      `— Devon`,
    ].join("\n"),
  },
  {
    step: 4,
    id: "nurture_4_proof",
    name: "Proof",
    subject: "What the work has driven",
    body: [
      `Hi [First name],`,
      ``,
      `Short proof note, no spin.`,
      ``,
      `Across the hospitality creative work, the content has driven 14.8M+ impressions, 565K+ engagements, and 670K+ reported post clicks. Those are attention and action numbers — the booking-support signals we can see where tracking is available.`,
      ``,
      `The point isn't the totals. It's that consistent, property-level creative compounds: every month of steady output keeps properties visible to guests, planners, and local searchers instead of going dark between pushes.`,
      ``,
      `Before/after examples here: [resource vault link].`,
      ``,
      `— Devon`,
    ].join("\n"),
  },
  {
    step: 5,
    id: "nurture_5_invite",
    name: "Invitation to request a gap review",
    subject: "Want me to map your top 3 properties?",
    body: [
      `Hi [First name],`,
      ``,
      `Last note from me for now.`,
      ``,
      `If the scorecard result has been sitting with you, the easiest next step is a free 3-Property Creative Gap Review. Send me 3 property links and I'll map the biggest creative opportunities around social, F&B/events, local campaigns, and reporting — then we can talk through it on a short Google Meet if it's useful.`,
      ``,
      `Request it here: [creative gap review link].`,
      ``,
      `Either way, glad you ran the scorecard.`,
      ``,
      `— Devon, Archer Design`,
    ].join("\n"),
  },
];
