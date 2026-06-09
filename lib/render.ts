// ─────────────────────────────────────────────────────────────────────────────
// Template render engine
// Substitutes {{variables}} in a template's subject + body using a
// contact → company → sensible-fallback resolution chain.
//
// Design notes:
//  - This NEVER injects a price. Price only appears if the chosen template body
//    already contains it (or the user types it into the draft).
//  - Inputs are intentionally permissive (Record-like) so this works with both
//    the live Supabase row shapes and the in-memory mock objects.
// ─────────────────────────────────────────────────────────────────────────────

/** Loose row types — only the fields we touch, all optional. */
type Loose = Record<string, unknown>;
export type RenderContact = Loose;
export type RenderCompany = Loose | null | undefined;
export type RenderTemplate = {
  name?: string | null;
  subject?: string | null;
  body?: string | null;
  // accept either naming convention
  channel?: string | null;
  template_type?: string | null;
  type?: string | null;
} & Loose;

export interface RenderSettings {
  sender_name?: string | null;
  email_signature?: string | null;
  opt_out_line?: string | null;
  portfolio_url?: string | null;
}

// ─── Performance proof points (the email's emphasis) ─────────────────────────
export const PERFORMANCE_STATS = {
  impressions: "13.9M+",
  engagements: "543K+",
  reach: "3.6M+",
  shares: "11K+",
  assets: "2.4K+",
  engagement_growth: "700%",
} as const;

/** A ready-to-drop proof block templates can reference via {{stats_block}}. */
export const STATS_BLOCK = [
  `• ${PERFORMANCE_STATS.impressions} impressions generated`,
  `• ${PERFORMANCE_STATS.engagements} direct engagements`,
  `• ${PERFORMANCE_STATS.reach} unique reach`,
  `• ${PERFORMANCE_STATS.shares} organic shares`,
  `• ${PERFORMANCE_STATS.assets} creative assets deployed`,
  `• ${PERFORMANCE_STATS.engagement_growth} engagement growth`,
].join("\n");

/** Positioning line (no price mentioned). Frames Archer as a lean hospitality
 * social-content partner that handles the full workflow, not just graphics. */
export const VALUE_PROP =
  "a lean hospitality social-content partner that handles the full workflow: " +
  "graphics and short-form motion, captions and channel-specific post copy, " +
  "approval-ready and scheduling-ready, across ongoing hotel, restaurant, spa, " +
  "F&B, event, and seasonal content, without adding in-house headcount";

// ─── Sensible fallbacks ──────────────────────────────────────────────────────
const FALLBACKS = {
  first_name: "there",
  company_name: "your team",
  personalization_angle: "the brand and guest experience you're building",
  specific_use_cases:
    "social content end to end: graphics and short-form motion, captions and " +
    "channel-specific post copy, approval-ready and scheduling-ready, across your properties",
  specific_client_type: "hospitality brands like yours",
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** First non-empty string among the candidates, else fallback. */
function pick(fallback: string, ...candidates: unknown[]): string {
  for (const c of candidates) {
    const s = str(c);
    if (s) return s;
  }
  return fallback;
}

/** Resolve the full variable map for a contact (+ optional company/settings). */
export function buildVariables(
  contact: RenderContact,
  company?: RenderCompany,
  settings?: RenderSettings
): Record<string, string> {
  const co = company ?? {};

  const first_name = pick(FALLBACKS.first_name, contact.first_name);
  const company_name = pick(
    FALLBACKS.company_name,
    contact.company_name,
    co.name,
    contact.company
  );

  // contact field → company field → fallback
  const personalization_angle = pick(
    FALLBACKS.personalization_angle,
    contact.personalization_angle,
    co.personalization_angle
  );
  const specific_use_cases = pick(
    FALLBACKS.specific_use_cases,
    contact.specific_use_cases,
    co.specific_use_cases
  );
  const specific_client_type = pick(
    FALLBACKS.specific_client_type,
    contact.specific_client_type,
    co.specific_client_type
  );

  // ── Opportunity OS fields (contact field → company field → fallback) ──
  const hiring_role_title = pick("the role", contact.hiring_role_title, co.hiring_role_title);
  const opportunity_trigger = pick(
    personalization_angle || "your current hotel marketing needs",
    contact.opportunity_trigger,
    co.opportunity_trigger
  );
  const recommended_approach = pick(VALUE_PROP, contact.recommended_approach, co.recommended_approach);
  const recommended_next_action = pick(
    "share a few relevant examples",
    contact.recommended_next_action,
    co.recommended_next_action
  );
  const examples_to_send = pick(
    "hotel social, F&B/event, and short-form motion examples",
    contact.examples_to_send,
    co.examples_to_send
  );

  return {
    // ── the five core variables ──
    first_name,
    company_name,
    personalization_angle,
    specific_use_cases,
    specific_client_type,

    // ── convenience / legacy aliases ──
    company: company_name,
    last_name: str(contact.last_name),
    title: str(contact.title),

    // ── Opportunity OS fields (with sensible fallbacks) ──
    lead_type: pick("", contact.lead_type, co.lead_type),
    opportunity_type: pick("", contact.opportunity_type, co.opportunity_type),
    opportunity_trigger,
    trigger_source_url: pick("", contact.trigger_source_url, co.trigger_source_url),
    trigger_summary: pick("", contact.trigger_summary, co.trigger_summary),
    hiring_role_title,
    hiring_job_url: pick("", contact.hiring_job_url, co.hiring_job_url),
    hiring_platform: pick("", contact.hiring_platform, co.hiring_platform),
    partner_type: pick("", contact.partner_type, co.partner_type),
    recommended_approach,
    recommended_next_action,
    opportunity_status: pick("", contact.opportunity_status, co.opportunity_status),
    examples_to_send,

    // ── proof points ──
    impressions: PERFORMANCE_STATS.impressions,
    engagements: PERFORMANCE_STATS.engagements,
    reach: PERFORMANCE_STATS.reach,
    shares: PERFORMANCE_STATS.shares,
    assets: PERFORMANCE_STATS.assets,
    engagement_growth: PERFORMANCE_STATS.engagement_growth,
    stats_block: STATS_BLOCK,
    value_prop: VALUE_PROP,

    // ── sender / settings ──
    sender_name: pick("", settings?.sender_name),
    email_signature: pick("", settings?.email_signature),
    opt_out_line: pick("", settings?.opt_out_line),
    portfolio_url: pick("", settings?.portfolio_url),
  };
}

/** Replace every {{ var }} token present in the map. Unknown tokens are left intact. */
export function applyVariables(
  text: string | null | undefined,
  vars: Record<string, string>
): string {
  if (!text) return "";
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (whole, key: string) => {
    const v = vars[key];
    return v === undefined ? whole : v;
  });
}

export interface RenderedDraft {
  subject: string;
  body: string;
}

/** Render a template into an editable subject + body for a given contact. */
export function renderTemplate(
  template: RenderTemplate,
  ctx: {
    contact: RenderContact;
    company?: RenderCompany;
    settings?: RenderSettings;
  }
): RenderedDraft {
  const vars = buildVariables(ctx.contact, ctx.company, ctx.settings);
  return {
    subject: applyVariables(template.subject, vars),
    body: applyVariables(template.body, vars),
  };
}

/** The channel for a template, tolerant of `channel` / `template_type` / `type`. */
export function templateChannel(t: RenderTemplate): string {
  return (str(t.channel) || str(t.template_type) || str(t.type) || "email").toLowerCase();
}

/** UUID guard — used so mock (non-UUID) ids don't trip Supabase FK constraints. */
export function isUuid(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
  );
}
