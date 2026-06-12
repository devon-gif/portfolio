// ─────────────────────────────────────────────────────────────────────────────
// Proposal generator — pure functions. Builds the 3–5 Property Creative Pilot
// proposal from form inputs. No I/O, no sending. Used by /proposal-generator.
// ─────────────────────────────────────────────────────────────────────────────

export const COMPANY_TYPES = [
  "hotel group", "hotel management company", "restaurant group",
  "spa/wellness group", "resort", "event venue", "other",
] as const;

export const PAIN_POINTS = [
  { key: "inconsistent", label: "Inconsistent property-level creative" },
  { key: "stretched", label: "Internal team stretched" },
  { key: "fnb", label: "F&B/event promos under-supported" },
  { key: "weddings", label: "Meeting/wedding assets needed" },
  { key: "local", label: "Local campaigns not consistent" },
  { key: "motion", label: "Weak social/motion output" },
  { key: "photos", label: "Property photos need polishing" },
  { key: "hiring", label: "Hiring is expensive" },
  { key: "seo", label: "SEO/local visibility needs support" },
] as const;

export const SERVICES = [
  { key: "plan", label: "Monthly creative plan" },
  { key: "graphics", label: "Social graphics" },
  { key: "motion", label: "Short-form motion" },
  { key: "fnb", label: "F&B/event promos" },
  { key: "weddings", label: "Wedding/meeting assets" },
  { key: "seasonal", label: "Seasonal campaign visuals" },
  { key: "polish", label: "Photo polishing/retouching" },
  { key: "branded", label: "New branded graphics" },
  { key: "captions", label: "Captions" },
  { key: "seo", label: "Local SEO content" },
  { key: "gbp", label: "Google Business Profile content" },
  { key: "recap", label: "Monthly recap/reporting" },
] as const;

export const PRICE_OPTIONS = [
  "Single Property Creative System — $2,500/mo",
  "3-Property Creative System — $4,500/mo",
  "3-Property Creative + SEO — $7,500/mo",
  "5-Property Portfolio Pilot — $10,000/mo",
  "5-Property Creative + SEO — $12,500/mo",
  "Custom",
] as const;

export const TIMELINES = ["30-day pilot", "60-day pilot", "90-day pilot"] as const;
export const TONES = ["executive", "friendly", "premium", "direct"] as const;

export interface ProposalInputs {
  company: string;
  contactName: string;
  contactTitle: string;
  companyType: string;
  propertyCount: string;
  pilotCount: string; // "1" | "3" | "5" | custom text
  painPoints: string[]; // keys
  services: string[]; // keys
  price: string;
  timeline: string;
  tone: string;
}

const PAIN_SENTENCES: Record<string, string> = {
  inconsistent: "creative output varies property to property — different templates, quality, and cadence",
  stretched: "the internal team is stretched across more properties and channels than one team can produce for",
  fnb: "F&B and event programming generates real local revenue but gets little dedicated promotion",
  weddings: "meeting and wedding business needs sales-ready creative the team doesn't have time to build",
  local: "local campaigns run inconsistently, so nearby demand drivers pass without dedicated creative",
  motion: "short-form motion is thin or missing, while it out-reaches static content on every platform",
  photos: "existing property photography undersells the in-person experience and needs professional finishing",
  hiring: "adding a full-time creative hire is expensive once salary, benefits, recruiting, and management time are loaded",
  seo: "local search visibility (Google Business Profile, local content) isn't getting consistent support",
};

function toneOpeners(tone: string, contact: string, company: string): string {
  switch (tone) {
    case "executive":
      return `Prepared for ${contact || "[Contact]"} — a concise plan for bringing consistent, premium property-level creative to ${company} without adding headcount.`;
    case "friendly":
      return `${contact ? `${contact.split(" ")[0]}, thanks` : "Thanks"} for the conversation — here's the simple version of what working together would look like.`;
    case "direct":
      return `Here's exactly what the pilot covers, what it costs, and what happens next.`;
    default: // premium
      return `A creative system built to make every ${company} property look as strong online as it does in person.`;
  }
}

export function generateProposal(i: ProposalInputs): { title: string; sections: { heading: string; body: string }[] } {
  const company = i.company.trim() || "[Company]";
  const pilotN = i.pilotCount || "3–5";
  const title = `3–5 Property Creative Pilot for ${company}`;

  const pains = i.painPoints.map((k) => PAIN_SENTENCES[k]).filter(Boolean);
  const situation = [
    `${company} is a ${i.companyType || "hospitality group"}${i.propertyCount ? ` operating ${i.propertyCount} properties` : ""}.`,
    pains.length > 0
      ? `From our conversation, the current gaps: ${pains.join("; ")}.`
      : `Like most groups its size, the gap isn't talent — it's creative bandwidth at the property level.`,
    `The team is capable; the production layer is what's missing.`,
  ].join(" ");

  const opportunity =
    `The properties have more to promote than the current setup can produce: rooms, F&B, weddings, meetings, ` +
    `seasonal pushes, local events. Consistent premium creative at the property level supports perceived value, ` +
    `rate integrity, direct-booking interest, and local F&B/event revenue — and it removes the pressure to solve ` +
    `this with another full-time hire.`;

  const why =
    `Archer Design is a dedicated outside creative system built for hospitality — brand-standard-aware for flagged ` +
    `properties, custom for independents. Current and past work includes Hotel Indigo Pittsburgh, Hampton Inn ` +
    `properties, Eliza Hot Metal Bistro, and spa/wellness brands. The numbers across that work: 13.9M+ impressions, ` +
    `543K+ direct engagements, 3.6M+ reach, and 2.4K+ creative assets delivered.`;

  const recommended =
    `We recommend starting with ${pilotN} propert${pilotN === "1" ? "y" : "ies"} rather than a full rollout. ` +
    `A focused ${i.timeline || "30-day pilot"} proves the workflow, the approval process, the creative quality, and the ` +
    `monthly cadence on real properties — so expanding across the portfolio is a decision based on output, not promises.`;

  const chosenServices = SERVICES.filter((s) => i.services.includes(s.key)).map((s) => s.label);
  const scope = chosenServices.length > 0
    ? `Per property, per month: ${chosenServices.join(" · ")}. Exact asset counts are confirmed at kickoff based on the property mix.`
    : `Per property, per month: monthly creative plan · social graphics · short-form motion · F&B/event promos · seasonal visuals · photo polishing · captions. Exact asset counts are confirmed at kickoff.`;

  const workflow =
    `Each month starts with a creative plan tied to each property's calendar. Your team shares assets and ` +
    `upcoming priorities through a shared intake (folder or email — whatever your team already uses). We produce ` +
    `on a weekly/biweekly cadence, deliver finished, labeled, approval-ready assets, and include one light revision ` +
    `round per asset. ${i.services.includes("recap") ? "A monthly recap summarizes what shipped and what performed." : "An optional monthly recap is available."}`;

  const investment =
    `${i.price || "Custom — scoped to the property list"}. This is fixed monthly creative capacity: no salary, benefits, ` +
    `software stack, recruiting cost, or vacancy risk. Compared with the loaded cost of one full-time creative hire ` +
    `($90K+ annually), the pilot delivers multi-property output at a fraction of the commitment — and it can start this week.`;

  const expansion =
    `After the pilot${i.timeline ? ` (${i.timeline})` : ""}, three paths: keep the pilot set, add properties in waves of 3–5, ` +
    `or scope a portfolio partnership. Per-property pricing improves with scale, and every expansion decision is backed ` +
    `by the pilot's actual output.`;

  const needs =
    `• Property list for the pilot\n• Brand guidelines (if available)\n• Access to existing photos/assets\n` +
    `• Event, F&B, and seasonal priorities for the next 60–90 days\n• One approval contact\n• Preferred deadlines or blackout dates`;

  const next =
    `Pick the pilot properties and schedule a 30-minute kickoff. First assets are delivered within the first week.`;

  return {
    title,
    sections: [
      { heading: "Overview", body: toneOpeners(i.tone, i.contactName ? `${i.contactName}${i.contactTitle ? `, ${i.contactTitle}` : ""}` : "", company) },
      { heading: "Situation", body: situation },
      { heading: "Opportunity", body: opportunity },
      { heading: "Why Archer Design", body: why },
      { heading: "Recommended Pilot", body: recommended },
      { heading: "Scope", body: scope },
      { heading: "Workflow", body: workflow },
      { heading: "Investment", body: investment },
      { heading: "Expansion Path", body: expansion },
      { heading: "What We Need From You", body: needs },
      { heading: "Next Step", body: next },
    ],
  };
}

export function proposalToText(p: { title: string; sections: { heading: string; body: string }[] }): string {
  return [`${p.title}\n${"=".repeat(p.title.length)}`, ...p.sections.map((s) => `${s.heading.toUpperCase()}\n${s.body}`)].join("\n\n");
}
