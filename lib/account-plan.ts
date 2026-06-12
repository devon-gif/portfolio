// ─────────────────────────────────────────────────────────────────────────────
// Target-account scoring + "account plan" generator (Kiley / Island-style).
// Pure functions, no I/O. Used by /companies. Nothing here sends anything.
// ─────────────────────────────────────────────────────────────────────────────

export const TARGET_PERSONAS = [
  "Director of Digital Marketing",
  "Corporate Director of Marketing",
  "VP Sales & Marketing",
  "Regional Director of Sales & Marketing",
  "VP Commercial Strategy",
  "Revenue Strategy leader",
  "Director of Marketing",
  "Area DOSM",
  "General Manager",
  "Hospitality Consultant",
  "Hotel Revenue Consultant",
  "Former DOSM",
  "Hotel Recruiter",
  "Hotel Tech Vendor",
] as const;

/** The 10 scoring criteria — 1 point each, score = count (1–10). */
export const SCORE_CRITERIA = [
  { key: "multi_property", label: "3+ properties in the portfolio" },
  { key: "fnb_events", label: "Has F&B, events, weddings, or spa" },
  { key: "multi_brand", label: "Multi-brand portfolio" },
  { key: "weak_creative", label: "Signs of weak/inconsistent creative" },
  { key: "dm_visible", label: "Marketing/digital decision-maker visible" },
  { key: "hiring_signal", label: "Hiring a marketing/social/content role" },
  { key: "expansion_news", label: "Recent expansion or news" },
  { key: "local_events", label: "Local events worth promoting" },
  { key: "reachable", label: "Decision-maker is reachable" },
  { key: "warm_path", label: "A warm intro path exists" },
] as const;

export type ScoreChecks = Record<string, boolean>;

export function computeScore(checks: ScoreChecks): number {
  return SCORE_CRITERIA.reduce((n, c) => n + (checks[c.key] ? 1 : 0), 0);
}

interface CompanyLike {
  name: string;
  category?: string | null;
  market?: string | null;
  website?: string | null;
  company_score?: number | null;
  notes?: string | null;
}

/**
 * Generates a copy/paste account plan as plain text. Deliberately template-driven
 * (no invented facts): everything company-specific is bracketed for Devon to fill
 * from real research before use.
 */
export function generateAccountPlan(c: CompanyLike): string {
  const name = c.name;
  const cat = c.category ?? "hospitality group";
  return [
    `ACCOUNT PLAN — ${name}`,
    `Generated ${new Date().toLocaleDateString()} · Score: ${c.company_score ?? "unscored"}/10 · Category: ${cat}${c.market ? ` · Market: ${c.market}` : ""}`,
    ``,
    `WHY THIS COMPANY IS A FIT`,
    `- [Portfolio]: ${name} operates [N] properties${c.website ? ` (verify on ${c.website})` : ""} — property-level creative consistency is exactly the multi-property pain we solve.`,
    `- [Revenue surface]: properties with F&B / events / weddings / spa have more to promote than internal bandwidth covers.`,
    `- [Signal]: [hiring post / inconsistent feeds / expansion news — cite the real thing you found].`,
    ``,
    `BEST PERSON TO MESSAGE FIRST`,
    `- [Name], [title] — pick the most digital/creative-adjacent leader visible (Director of Digital Marketing > Corporate Dir. of Marketing > VP S&M).`,
    `- Why them: closest to the day-to-day creative gap, junior enough to reply, senior enough to route.`,
    ``,
    `SECONDARY ROUTE`,
    `- [Name 2], [title] — only after 3 business days of silence. Do NOT message several executives at once.`,
    `- Alternative: warm path via [intro source] if one exists in /intro-sources.`,
    ``,
    `DECISION-MAKER MAP`,
    TARGET_PERSONAS.slice(0, 9).map((p) => `- ${p}: [name or “not visible”]`).join("\n"),
    ``,
    `FIRST MESSAGE (question-led, no pitch)`,
    `"Hi [First] — saw [specific real detail about ${name}]. Quick question — is property-level creative handled centrally at ${name}, or does each hotel mostly handle social, campaigns, and local promos on its own?"`,
    ``,
    `FOLLOW-UP (day 3–5, adds value)`,
    `"One thing I see with groups like ${name}: plenty to promote — rooms, F&B, events, seasonal offers — but not enough creative bandwidth to keep it consistent across properties. That's the gap I cover. Worth seeing what a 3–5 property pilot would look like?"`,
    ``,
    `PRESENTATION INTRO ANGLE`,
    `- Open with their portfolio, not our deck: "[N] properties, [brands]. Here's how consistent the feeds look today — and what 3–5 of them could look like in 30 days."`,
    ``,
    `3–5 PROPERTY PILOT ANGLE`,
    `- Start with [3–5 named properties — pick the most photogenic + one F&B-heavy].`,
    `- One month, one approval workflow, one invoice. Expansion on evidence.`,
    `- Anchor: 3-property from $4,500/mo · 5-property portfolio from $10,000/mo.`,
    ``,
    `PROOF EXAMPLES TO SHOW (match their category)`,
    `- Hotel Indigo Pittsburgh (boutique flag) · Hampton Inn properties (select-service, brand standards)`,
    `- Eliza Hot Metal Bistro (hotel F&B) · spa/wellness creative (Elements)`,
    `- Stats if asked: 13.9M+ impressions, 543K+ engagements, 3.6M+ reach, 2.4K+ assets delivered.`,
    ``,
    `RISKS / LIKELY OBJECTIONS`,
    `- "We already have a team" → overflow/extension framing, never replacement.`,
    `- "We use brand templates" → templates cover the flag layer; property-level campaigns, F&B, and local moments are where they're thin.`,
    `- "Budget is tight" → loaded cost of one hire vs fixed pilot; start at 3 properties.`,
    `- "Send info" → send 2–3 category-matched examples + pilot one-pager, then book the call.`,
    ``,
    `RULE: one person first → wait 3 business days → second route. Log every touch in the CRM.`,
  ].join("\n");
}
