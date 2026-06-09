// ─────────────────────────────────────────────────────────────────────────────
// Compliance Gate — Phase 1
// Runs the 9 pre-queue compliance checks from docs/lead-discovery-enrichment.md
// before a draft may be approved. Writes a compliance_checks row and updates the
// outreach_queue item's compliance_check_id + compliance_status.
//
// This module DRAFTS/QUEUES ONLY. It never sends anything. LinkedIn is always
// manual-send. Devon approves before anything goes out.
//
// Matches migration: supabase/migrations/20260607_lead_discovery_enrichment_layer.sql
// ─────────────────────────────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminClient } from "./supabase-admin";
import type { ComplianceResult, OutreachChannel } from "./types";

const DEFAULT_RECONTACT_COOLDOWN_DAYS = 14;
const HIGH_CONFIDENCE_THRESHOLD = 80; // email_confidence ≥ this counts as high-confidence
const VERIFIED_STATUSES = new Set(["verified", "high_confidence"]);

// Contact sources we consider legitimate for cold outreach. Anything else
// (e.g. "linkedin" — possibly scraped — or an unknown source) fails the gate.
const ALLOWED_CONTACT_SOURCES = new Set(["manual", "import", "website", "referral", "other"]);
const DISALLOWED_CONTACT_SOURCES = new Set(["linkedin"]);

export interface ComplianceGateInput {
  contactId: string;
  outreachQueueId?: string | null;
  channel: OutreachChannel; // "email" | "linkedin"
}

export interface ComplianceGateResult {
  result: ComplianceResult; // "pass" | "fail"
  checkId: string | null;
  riskFlags: string[];
  missing: string[];
  recommendedFix: string | null;
  checks: Record<string, boolean | null>;
}

// ─── Small helpers ───────────────────────────────────────────────────────────

/** Cooldown window (days) before a contact may be re-contacted. */
export async function getRecontactCooldownDays(): Promise<number> {
  const admin = getAdminClient();
  const { data } = await admin
    .from("app_settings")
    .select("recontact_cooldown_days")
    .limit(1)
    .maybeSingle();
  const v = (data as { recontact_cooldown_days?: number } | null)?.recontact_cooldown_days;
  return typeof v === "number" && v >= 0 ? v : DEFAULT_RECONTACT_COOLDOWN_DAYS;
}

/** True if the contact is suppressed, opted out, unsubscribed, or bounced. */
export async function isSuppressedContact(contact: AnyRow): Promise<boolean> {
  const email = normalizeEmail(contact.email);
  if (contact.opted_out === true) return true;
  if (contact.email_opt_out === true) return true;
  if (contact.unsubscribed_at) return true;
  if (contact.bounced === true) return true;
  if (contact.opt_out_status) return true;
  if (!email) return false;
  const admin = getAdminClient();
  const { data } = await admin
    .from("suppression_list")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return !!data;
}

/** True if the contact has a usable, trustworthy email for EMAIL outreach. */
export function hasValidEmailForOutreach(contact: AnyRow): boolean {
  const email = normalizeEmail(contact.email);
  if (!email || !email.includes("@")) return false;
  const status = (contact.email_verification_status ?? "").toString();
  if (VERIFIED_STATUSES.has(status)) return true;
  const conf = Number(contact.email_confidence);
  return Number.isFinite(conf) && conf >= HIGH_CONFIDENCE_THRESHOLD;
}

/** True if at least one source URL backs this contact (or its company). */
export async function hasRequiredSourceUrls(
  contactId: string,
  companyId?: string | null
): Promise<{ ok: boolean; noInvented: boolean }> {
  const admin = getAdminClient();
  const ids = [{ type: "contact", id: contactId }];
  if (companyId) ids.push({ type: "company", id: companyId });

  let count = 0;
  let invented = false;
  for (const ref of ids) {
    const { data } = await admin
      .from("source_urls")
      .select("url,is_inference")
      .eq("entity_type", ref.type)
      .eq("entity_id", ref.id);
    for (const row of (data ?? []) as Array<{ url: string | null; is_inference: boolean }>) {
      count += 1;
      // A fact with no URL that isn't explicitly an inference = invented.
      if (!row.url && row.is_inference !== true) invented = true;
    }
  }
  return { ok: count > 0, noInvented: !invented };
}

/** True if an email draft contains both an opt-out cue and a physical address. */
export function emailDraftHasComplianceFooter(
  draft: string | null | undefined,
  mailingAddress: string | null | undefined
): boolean {
  const body = (draft ?? "").toLowerCase();
  if (!body.trim()) return false;
  const hasOptOut =
    body.includes("unsubscribe") ||
    body.includes("opt out") ||
    body.includes("opt-out") ||
    body.includes("{{unsubscribe_url}}") ||
    body.includes("{{compliance_block}}");
  const addr = (mailingAddress ?? "").trim().toLowerCase();
  const hasAddress =
    body.includes("{{mailing_address}}") ||
    body.includes("{{compliance_block}}") ||
    body.includes("[physical address]") ||
    (!!addr && body.includes(addr)) ||
    // generic placeholder cue
    body.includes("address:");
  return hasOptOut && hasAddress;
}

/** True if the contact's source is an allowed (non-scraped) origin. */
export function isAllowedContactSource(contact: AnyRow): boolean {
  const src = (contact.source ?? "").toString().toLowerCase();
  if (!src) return false; // unknown source → fail
  if (DISALLOWED_CONTACT_SOURCES.has(src)) return false;
  return ALLOWED_CONTACT_SOURCES.has(src);
}

/** Build a single actionable fix string from the missing items. */
export function buildComplianceRecommendedFix(missing: string[]): string | null {
  if (missing.length === 0) return null;
  return `Fix before approving: ${missing.join("; ")}.`;
}

// ─── Main gate ───────────────────────────────────────────────────────────────
export async function runComplianceGate(
  input: ComplianceGateInput
): Promise<ComplianceGateResult> {
  const admin = getAdminClient();
  const { contactId, outreachQueueId, channel } = input;
  const isEmail = channel === "email";

  // ── Load everything ──
  const { data: contact } = await admin.from("contacts").select("*").eq("id", contactId).maybeSingle();
  if (!contact) {
    return failFast("Contact not found.");
  }
  const companyId: string | null = (contact as AnyRow).company_id ?? null;

  const { data: queueItem } = outreachQueueId
    ? await admin.from("outreach_queue").select("*").eq("id", outreachQueueId).maybeSingle()
    : { data: null as AnyRow | null };

  const { data: settings } = await admin
    .from("app_settings")
    .select("mailing_address,recontact_cooldown_days")
    .limit(1)
    .maybeSingle();
  const mailingAddress = (settings as AnyRow | null)?.mailing_address ?? "";

  // ── Run checks ──
  const cooldownDays = await getRecontactCooldownDays();
  const suppressed = await isSuppressedContact(contact as AnyRow);
  const { ok: hasSources, noInvented } = await hasRequiredSourceUrls(contactId, companyId);

  const not_suppressed = !suppressed;
  const not_recently_contacted = withinCooldownOk((contact as AnyRow).last_contacted_at, cooldownDays);
  const email_verified_or_high_conf = isEmail ? hasValidEmailForOutreach(contact as AnyRow) : true; // n/a for LinkedIn
  const has_source_urls = hasSources;
  const no_invented_fields = noInvented;
  const has_specific_detail = hasSpecificDetail(contact as AnyRow, queueItem);
  const email_has_optout_and_address = isEmail
    ? emailDraftHasComplianceFooter((queueItem as AnyRow | null)?.email_draft, mailingAddress)
    : true; // n/a for LinkedIn
  // LinkedIn is ALWAYS manual-send in this system; record it as satisfied.
  const linkedin_manual_only = true;
  const allowed_contact_source = isAllowedContactSource(contact as AnyRow);

  const checks: Record<string, boolean | null> = {
    not_suppressed,
    not_recently_contacted,
    email_verified_or_high_conf: isEmail ? email_verified_or_high_conf : null,
    has_source_urls,
    no_invented_fields,
    has_specific_detail,
    email_has_optout_and_address: isEmail ? email_has_optout_and_address : null,
    linkedin_manual_only,
    allowed_contact_source,
  };

  // ── Determine pass/fail (only applicable checks count) ──
  const failures: Array<[string, string]> = [];
  if (!not_suppressed) failures.push(["not_suppressed", "contact is suppressed / opted out / bounced"]);
  if (!not_recently_contacted)
    failures.push(["not_recently_contacted", `contacted within the last ${cooldownDays} days`]);
  if (isEmail && !email_verified_or_high_conf)
    failures.push(["email_verified_or_high_conf", "no verified or high-confidence email for the email channel"]);
  if (!has_source_urls) failures.push(["has_source_urls", "no source URL on file for this lead's facts"]);
  if (!no_invented_fields)
    failures.push(["no_invented_fields", "a fact has no source URL and is not marked is_inference"]);
  if (!has_specific_detail)
    failures.push(["has_specific_detail", "no specific real detail for personalization"]);
  if (isEmail && !email_has_optout_and_address)
    failures.push(["email_has_optout_and_address", "email draft is missing the opt-out line and/or physical address"]);
  if (!allowed_contact_source)
    failures.push(["allowed_contact_source", "contact source is LinkedIn-scraped or unknown"]);
  // linkedin_manual_only is always true here; included for completeness.

  const result: ComplianceResult = failures.length === 0 ? "pass" : "fail";
  const riskFlags = failures.map(([k]) => k);
  const missing = failures.map(([, m]) => m);
  const recommendedFix = buildComplianceRecommendedFix(missing);

  // ── Persist compliance_checks row ──
  const { data: inserted } = await admin
    .from("compliance_checks")
    .insert({
      contact_id: contactId,
      outreach_queue_id: outreachQueueId ?? null,
      result,
      not_suppressed,
      not_recently_contacted,
      email_verified_or_high_conf: isEmail ? email_verified_or_high_conf : null,
      has_source_urls,
      no_invented_fields,
      has_specific_detail,
      email_has_optout_and_address: isEmail ? email_has_optout_and_address : null,
      linkedin_manual_only,
      allowed_contact_source,
      risk_flags: riskFlags,
      missing,
      recommended_fix: recommendedFix,
    })
    .select("id")
    .single();

  const checkId = (inserted as { id: string } | null)?.id ?? null;

  // ── Update the queue item ──
  if (outreachQueueId && checkId) {
    await admin
      .from("outreach_queue")
      .update({ compliance_check_id: checkId, compliance_status: result })
      .eq("id", outreachQueueId);
  }

  return { result, checkId, riskFlags, missing, recommendedFix, checks };
}

// ─── Internal utilities ──────────────────────────────────────────────────────
type AnyRow = Record<string, any>;

function normalizeEmail(email: unknown): string {
  return (typeof email === "string" ? email : "").trim().toLowerCase();
}

function withinCooldownOk(lastContactedAt: unknown, cooldownDays: number): boolean {
  if (!lastContactedAt) return true; // never contacted
  const last = new Date(lastContactedAt as string).getTime();
  if (Number.isNaN(last)) return true;
  const days = (Date.now() - last) / (1000 * 60 * 60 * 24);
  return days >= cooldownDays;
}

/** ≥1 real personalization detail: a source excerpt, a stored angle, or notes. */
function hasSpecificDetail(contact: AnyRow, queueItem: AnyRow | null): boolean {
  if ((contact.personalization_angle ?? "").toString().trim()) return true;
  if ((contact.specific_use_cases ?? "").toString().trim()) return true;
  if (queueItem && (queueItem.best_angle ?? "").toString().trim()) return true;
  return false;
}

async function failFast(reason: string): Promise<ComplianceGateResult> {
  return {
    result: "fail",
    checkId: null,
    riskFlags: ["lookup_error"],
    missing: [reason],
    recommendedFix: reason,
    checks: {},
  };
}
