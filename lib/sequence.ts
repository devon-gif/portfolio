// 3-step cold outreach sequence.
// Step 1 requires normal manual approval. Steps 2-3 can be auto-approved
// only after the contact was enrolled and the prior step was sent.

export interface DripStep {
  step: number; // 1-based
  templateTag: string; // tag on templates row
  intervalDays: number; // days after previous sent step
  label: string;
  fallbackSubject: string;
  fallbackBody: string;
}

export const DRIP_SEQUENCE: DripStep[] = [
  {
    step: 1,
    templateTag: "drip-1",
    intervalDays: 0,
    label: "Intro",
    fallbackSubject: "Creative support for {{company_name}}",
    fallbackBody: [
      "Hi {{first_name}},",
      "",
      "I help hotel and hospitality teams keep social content moving without adding more creative headcount — graphics, short-form motion, captions, and approval-ready campaign content for rooms, restaurants, events, spa, and seasonal promos.",
      "",
      "I currently support a western PA hospitality group with Hotel Indigo Pittsburgh, two Hampton Inns, a restaurant, and spa content.",
      "",
      "Would it be worth taking a quick look at a few examples for {{company_name}}?",
      "",
      "Best,",
      "{{sender_name}}",
      "",
      "{{compliance_block}}",
    ].join("\\n"),
  },
  {
    step: 2,
    templateTag: "drip-2",
    intervalDays: 4,
    label: "Proof bump",
    fallbackSubject: "Quick example for {{company_name}}",
    fallbackBody: [
      "Hi {{first_name}},",
      "",
      "Quick follow-up — the biggest value for hotel groups is usually not one-off design. It is consistent creative output across property-level needs: F&B promos, local events, rooms, meetings, spa/wellness, and seasonal campaigns.",
      "",
      "Recent proof points include {{impressions}} impressions, {{engagements}} direct engagements, {{assets}} creative assets, and {{engagement_growth}} engagement growth.",
      "",
      "Happy to send a few relevant examples if useful.",
      "",
      "Best,",
      "{{sender_name}}",
      "",
      "{{compliance_block}}",
    ].join("\\n"),
  },
  {
    step: 3,
    templateTag: "drip-3",
    intervalDays: 6,
    label: "Soft close",
    fallbackSubject: "Should I close the loop?",
    fallbackBody: [
      "Hi {{first_name}},",
      "",
      "Last note from me — I know timing may not be right.",
      "",
      "If {{company_name}} ever needs a lower-overhead way to support property-level social creative, short-form video, restaurant/event promos, or seasonal hotel campaigns, I would be glad to show what a small pilot could look like.",
      "",
      "Should I close the loop for now?",
      "",
      "Best,",
      "{{sender_name}}",
      "",
      "{{compliance_block}}",
    ].join("\\n"),
  },
];

export const TOTAL_DRIP_STEPS = DRIP_SEQUENCE.length;

export function getStep(step: number): DripStep | undefined {
  return DRIP_SEQUENCE.find((s) => s.step === step);
}

/** Given the last successfully sent step, return when the next step is due. */
export function nextSendAt(lastSentStep: number, from: Date = new Date()): Date | null {
  const next = getStep(lastSentStep + 1);
  if (!next) return null;
  const d = new Date(from);
  d.setDate(d.getDate() + next.intervalDays);
  return d;
}
