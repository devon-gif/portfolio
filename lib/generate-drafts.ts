// Generate today's email drafts from REAL Supabase contacts → insert into
// `messages` as status='draft'. No sending, no Hunter, no scheduling here.
// Shared by the Command Center (/daily). Returns counts so the UI can show a
// clear result, and signals when there are no real contacts (no mock fallback).
import { supabase } from "./supabase";
import { renderTemplate, isUuid, type RenderTemplate } from "./render";

const BLOCKED_STATUSES = new Set([
  "sent",
  "replied",
  "not_interested",
  "do_not_contact",
  "unsubscribed",
]);

// Built-in default email template (used only if no email template exists in the
// DB). Positions Archer as a lean hospitality social-content partner — full
// workflow, no price lead, not "just a designer".
const DEFAULT_TEMPLATE: RenderTemplate = {
  name: "Default — hotel social-content partner",
  subject: "A lean social-content partner for {{company_name}}",
  body: [
    "Hi {{first_name}},",
    "",
    "I work with hotel and hospitality teams as a lean social-content partner — handling the full workflow so your team doesn't have to add headcount: concept, graphics and short-form motion, captions and channel-specific post copy, all approval-ready and scheduling-ready across ongoing hotel, restaurant, spa, F&B, event, and seasonal content.",
    "",
    "A snapshot of recent work:",
    "{{stats_block}}",
    "",
    "If it's useful, I can put together a few sample pieces for {{company_name}} so you can see the quality before any commitment. Worth a quick look?",
    "",
    "Best,",
    "{{sender_name}}",
    "",
    "{{compliance_block}}",
  ].join("\n"),
  type: "email",
};

export interface SkippedBreakdown {
  noEmail: number;
  alreadyDrafted: number;
  suppressed: number;
  optedOut: number;
  bounced: number;
  blockedStatus: number;
  missingCompany: number; // informational — does not block drafting
}

export interface GenerateResult {
  noContacts: boolean; // true when there are zero real contacts in Supabase
  found: number; // eligible contacts with an email
  made: number; // drafts actually inserted
  reason?: string; // human-readable note when made === 0
  // Breakdown of why contacts were skipped (always populated)
  skipped?: SkippedBreakdown;
}

/** Human-readable "x skipped: …" summary from a breakdown. */
export function describeSkipped(s: SkippedBreakdown): string {
  const parts: string[] = [];
  if (s.alreadyDrafted > 0) parts.push(`${s.alreadyDrafted} already drafted/contacted`);
  if (s.noEmail > 0) parts.push(`${s.noEmail} no email`);
  if (s.suppressed > 0) parts.push(`${s.suppressed} suppressed`);
  if (s.optedOut > 0) parts.push(`${s.optedOut} opted out`);
  if (s.bounced > 0) parts.push(`${s.bounced} bounced`);
  if (s.blockedStatus > 0) parts.push(`${s.blockedStatus} blocked status`);
  return parts.join(", ");
}

export async function generateTodaysDrafts(): Promise<GenerateResult> {
  // 1. Template (real first, else built-in default).
  let tpl: RenderTemplate = DEFAULT_TEMPLATE;
  const { data: tplRows } = await supabase
    .from("templates")
    .select("id, name, subject, body, type, tags")
    .eq("type", "email")
    .limit(1);
  if (tplRows && tplRows.length > 0) tpl = tplRows[0] as unknown as RenderTemplate;

  // 2. Settings for rendering (sender name, signature, opt-out, address).
  const { data: settings } = await supabase
    .from("app_settings")
    .select("sender_name, email_signature, opt_out_line, portfolio_url, mailing_address")
    .limit(1)
    .single();

  // 3. Contacts (full select; fall back to minimal if personalization columns absent).
  const FULL =
    "id, company_id, first_name, last_name, title, email, linkedin_url, status, email_opt_out, bounced, personalization_angle, specific_use_cases, specific_client_type, companies(name, personalization_angle, specific_use_cases, specific_client_type)";
  const MINIMAL =
    "id, company_id, first_name, last_name, title, email, linkedin_url, status, email_opt_out, companies(name)";

  let { data: contacts, error: contactsError } = await supabase.from("contacts").select(FULL);
  if (contactsError) {
    ({ data: contacts, error: contactsError } = await supabase.from("contacts").select(MINIMAL));
  }
  if (contactsError) {
    throw new Error(
      `Loading contacts failed: ${(contactsError as { message?: string }).message ?? "database error"}`
    );
  }
  if (!contacts || contacts.length === 0) {
    return { noContacts: true, found: 0, made: 0 };
  }

  // 4. Suppression pre-filter (also enforced at send time).
  let supp: { email?: string | null; domain?: string | null; company_name?: string | null }[] = [];
  const suppFull = await supabase.from("suppression_list").select("email, domain, company_name");
  if (suppFull.error) {
    const fb = await supabase.from("suppression_list").select("email");
    supp = (fb.data as unknown as typeof supp) ?? [];
  } else {
    supp = (suppFull.data as unknown as typeof supp) ?? [];
  }
  const suppEmails = new Set(supp.map((s) => (s.email ?? "").toLowerCase()).filter(Boolean));
  const suppDomains = new Set(supp.map((s) => (s.domain ?? "").toLowerCase()).filter(Boolean));
  const suppCompanies = new Set(supp.map((s) => (s.company_name ?? "").toLowerCase()).filter(Boolean));

  // 5. Skip contacts that already have a pending/sent message.
  const { data: existing } = await supabase
    .from("messages")
    .select("contact_id")
    .in("status", ["draft", "needs_review", "approved", "approved_for_today", "scheduled", "sending", "sent"]);
  const alreadyHasMsg = new Set((existing ?? []).map((m) => m.contact_id).filter(Boolean));

  type Rec = {
    id: string;
    company_id?: string | null;
    email?: string | null;
    linkedin_url?: string | null;
    status?: string | null;
    email_opt_out?: boolean | null;
    bounced?: boolean | null;
    companies?: { name?: string } | null;
  };

  // Track skip reasons for UI feedback
  const skipped: SkippedBreakdown = {
    noEmail: 0, alreadyDrafted: 0, suppressed: 0, optedOut: 0, bounced: 0, blockedStatus: 0, missingCompany: 0,
  };

  const eligible = (contacts as unknown as Rec[]).filter((rec) => {
    if (!rec.email && !rec.linkedin_url) { skipped.noEmail++; return false; }
    if (rec.email_opt_out === true) { skipped.optedOut++; return false; }
    if (rec.bounced === true) { skipped.bounced++; return false; }
    if (rec.status && BLOCKED_STATUSES.has(rec.status)) { skipped.blockedStatus++; return false; }
    if (alreadyHasMsg.has(rec.id)) { skipped.alreadyDrafted++; return false; }
    const email = (rec.email ?? "").toLowerCase();
    const domain = email.includes("@") ? email.split("@")[1] : "";
    const coName = (rec.companies?.name ?? "").toLowerCase();
    if ((email && suppEmails.has(email)) || (domain && suppDomains.has(domain)) || (coName && suppCompanies.has(coName))) {
      skipped.suppressed++;
      return false;
    }
    if (!rec.company_id) skipped.missingCompany++; // informational only — generic company fallback is used
    return true;
  });

  // Email drafts need an email address. LinkedIn-only contacts are skipped here.
  const withEmail = eligible.filter((c) => {
    if (!c.email) { skipped.noEmail++; return false; }
    return true;
  }).slice(0, 50);

  // Dev-only eligibility diagnostics (no PII beyond counts, no secrets).
  if (process.env.NODE_ENV === "development") {
    console.info("[generate-drafts] contacts:", contacts.length, "eligible w/ email:", withEmail.length, "skipped:", skipped);
  }

  if (withEmail.length === 0) {
    const summary = describeSkipped(skipped);
    const reason = summary
      ? `No eligible contacts: ${summary}.`
      : "No new eligible contacts to draft.";
    return { noContacts: false, found: 0, made: 0, reason, skipped };
  }

  let made = 0;
  let firstInsertError: string | null = null;
  for (const c of withEmail) {
    const full = c as unknown as Record<string, unknown>;
    const { subject, body } = renderTemplate(tpl, {
      contact: full,
      company: (full.companies as Record<string, unknown> | null) ?? null,
      settings: settings ?? undefined,
    });
    const { error } = await supabase.from("messages").insert({
      contact_id: c.id,
      company_id: c.company_id ?? null,
      channel: "email",
      subject,
      body,
      status: "draft",
      template_id: isUuid(String((tpl as { id?: unknown }).id)) ? (tpl as { id?: string }).id : null,
    });
    if (!error) made++;
    else if (!firstInsertError) firstInsertError = error.message;
  }

  if (made === 0 && firstInsertError) {
    throw new Error(`Saving drafts failed: ${firstInsertError}`);
  }

  return { noContacts: false, found: withEmail.length, made, skipped };
}
