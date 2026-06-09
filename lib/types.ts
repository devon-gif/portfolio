// ─────────────────────────────────────────────────────────────────────────────
// Shared domain types for Hotel Pipeline OS.
// These match the runtime shapes used across the app (mock-data + Supabase rows).
// ─────────────────────────────────────────────────────────────────────────────

export type CompanyType =
  | "hotel_management_company"
  | "hospitality_group"
  | "boutique_hotel_group"
  | "resort_group"
  | "independent_lifestyle_hotel"
  | "branded_hotel"
  | "other";

export type CompanySize = "solo" | "small" | "medium" | "large" | "enterprise";
export type Market = "US" | "Canada" | "UK" | "UAE" | "Other";

export type ContactType =
  | "buyer"
  | "decision_maker"
  | "influencer"
  | "partner"
  | "property_level"
  | "other"
  | "unknown";

export type ContactStatus =
  | "new"
  | "queued"
  | "approved"
  | "sent"
  | "replied"
  | "follow_up_due"
  | "call_booked"
  | "won"
  | "lost"
  | "not_fit"
  | "not_interested"
  | "unsubscribed"
  | "bounced"
  | "opted_out";

export type ContactSource = "manual" | "import" | "linkedin" | "referral" | "website" | "other";

export type FilterKey =
  | "all"
  | "buyer"
  | "partner"
  | "management_company"
  | "property_level"
  | "follow_up_due"
  | "no_email"
  | "linkedin_only";

export type TemplateType = "email" | "linkedin" | "followup";

export type FollowUpStatus = "pending" | "completed" | "cancelled";

export type PartnerType = "referral" | "agency" | "tech" | "co_marketing" | "other";
export type PartnerStatus = "active" | "inactive" | "prospect";
export type CommissionType = "percentage" | "flat" | "retainer";

export type QueueItemStatus = "draft" | "approved" | "sent" | "skipped" | "follow_up";

// Approval-queue statuses (superset) used by the discovery/enrichment layer
// (20260607_lead_discovery_enrichment_layer.sql) for the /outreach/approval UI.
// Kept separate from QueueItemStatus so existing screens are unaffected.
export type ApprovalStatus =
  | QueueItemStatus
  | "needs_review"
  | "rejected"
  | "snoozed";

export type MessageStatus =
  | "draft"
  | "needs_review"
  | "approved"
  | "sent"
  | "replied"
  | "bounced"
  | "failed"
  | "archived";

export type EnrollmentStatus = "active" | "stopped" | "completed";

// ─── Companies ───────────────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  website?: string | null;
  market?: Market | null;
  type?: CompanyType | string | null;
  size?: CompanySize | string | null;
  company_type?: string | null;
  location?: string | null;
  fit_score?: number | null;
  status?: string | null;
  notes?: string | null;
  personalization_angle?: string | null;
  specific_use_cases?: string | null;
  specific_client_type?: string | null;
  // ── Opportunity OS signal fields (20260605b) ──
  lead_type?: string | null;
  opportunity_type?: string | null;
  opportunity_trigger?: string | null;
  trigger_source_url?: string | null;
  trigger_summary?: string | null;
  hiring_role_title?: string | null;
  hiring_job_url?: string | null;
  hiring_platform?: string | null;
  partner_type?: string | null;
  recommended_approach?: string | null;
  recommended_next_action?: string | null;
  priority_score?: number | null;
  opportunity_status?: string | null;
  examples_to_send?: string | null;
  last_signal_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Contacts ────────────────────────────────────────────────────────────────
export interface Contact {
  id: string;
  company_id?: string | null;
  market?: Market | null;
  company?: string | null;
  // legacy/denormalized fields (may come from mock data or older migrations)
  company_name?: string | null;
  company_type?: string | null;
  contact_type?: ContactType | string | null;
  first_name: string;
  last_name: string;
  title?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  phone?: string | null;
  location?: string | null;
  status?: string | null;
  notes?: string | null;
  personalization_angle?: string | null;
  specific_use_cases?: string | null;
  specific_client_type?: string | null;
  source?: ContactSource | string | null;
  suppressed?: boolean;
  bounced?: boolean | null;
  unsubscribed_at?: string | null;
  opt_out_status?: string | null;
  email_opt_out?: boolean | null;
  replied_at?: string | null;
  bounce_count?: number | null;
  last_contacted_at?: string | null;
  opted_out?: boolean;
  // joined
  companies?: { name?: string | null } | null;
  created_at: string;
  updated_at?: string;
}

// ─── Partners ────────────────────────────────────────────────────────────────
export interface Partner {
  id: string;
  name: string;
  company?: string | null;
  title?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  phone?: string | null;
  partnership_type?: PartnerType | string | null;
  partner_type?: string | null;
  commission_type?: CommissionType | string | null;
  commission_value?: number | null;
  referral_count?: number;
  status?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Templates ───────────────────────────────────────────────────────────────
export interface Template {
  id: string;
  name: string;
  type?: TemplateType | string | null;
  channel?: string | null;
  template_type?: string | null;
  subject?: string | null;
  body: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

// ─── Outreach Queue (in-memory daily queue) ──────────────────────────────────
export interface OutreachQueueItem {
  id: string;
  contact_id: string;
  status: QueueItemStatus;
  // legacy fields used by outreach page queue
  contact?: Contact | null;
  date?: string;
  score?: number;
  email_draft?: string | null;
  linkedin_draft?: string | null;
  sent_at?: string | null;
  updated_at?: string;
  created_at: string;
  // joined (used by dashboard)
  contacts?: { first_name?: string; last_name?: string; title?: string; company?: string; email?: string } | null;
}

// ─── Messages (persisted drafts / sent emails) ───────────────────────────────
export interface Message {
  id: string;
  contact_id: string | null;
  queue_item_id?: string | null;
  enrollment_id?: string | null;
  template_id?: string | null;
  channel: "email" | "linkedin" | "other" | string;
  subject: string | null;
  body: string;
  status: MessageStatus | string;
  sequence_step?: number | null;
  scheduled_for?: string | null;
  unsubscribe_token?: string | null;
  resend_email_id?: string | null;
  sent_at?: string | null;
  opened_at?: string | null;
  replied_at?: string | null;
  created_at: string;
  // joined
  contacts?: Contact | null;
}

// ─── Enrollments (drip sequence membership) ──────────────────────────────────
export interface Enrollment {
  id: string;
  contact_id: string;
  status: EnrollmentStatus | string;
  current_step: number;
  next_send_at: string | null;
  stopped_reason: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Send events (Resend webhook log) ────────────────────────────────────────
export interface SendEvent {
  id: string;
  message_id: string | null;
  contact_id: string | null;
  type: string;
  payload: unknown;
  created_at: string;
}

// ─── Follow-ups ──────────────────────────────────────────────────────────────
export interface FollowUp {
  id: string;
  contact_id: string;
  due_date?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at: string;
  contact?: Contact;
  updated_at?: string;
  // joined
  contacts?: { first_name?: string; last_name?: string; company?: string } | null;
}

// ─── Suppression List ────────────────────────────────────────────────────────
export interface SuppressionEntry {
  id: string;
  email: string;
  reason: string | null;
  source: string | null;
  added_at: string;
}

// ─── App Settings (single row) ───────────────────────────────────────────────
export interface AppSettings {
  id: string;
  portfolio_url: string;
  sender_name: string;
  email_signature: string;
  mailing_address: string;
  opt_out_line: string;
  daily_send_goal: number;
  // sending / Resend config (optional — added by migration)
  resend_from?: string;
  resend_reply_to?: string;
  daily_send_limit?: number;
  drip_send_limit?: number;
  require_drip_approval?: boolean;
  auto_enroll?: boolean;
  updated_at: string;
}

// ═════════════════════════════════════════════════════════════════════════════
// Lead Discovery + Enrichment Layer
// Matches: supabase/migrations/20260607_lead_discovery_enrichment_layer.sql
// Additive only. Existing interfaces above are extended below via declaration
// merging (re-declaring an interface in the same module merges its members).
// ═════════════════════════════════════════════════════════════════════════════

// ─── Shared union types ──────────────────────────────────────────────────────
/** Company category vocabulary used across discovery + classification. */
export type CompanyCategory =
  | "hotel"
  | "select_service_hotel"
  | "restaurant"
  | "fnb_group"
  | "spa"
  | "resort"
  | "wedding_event_venue"
  | "hospitality_group";

/** Lead classification (mirrors the Lead Classifier Skill + companies.lead_type). */
export type LeadType =
  | "direct_buyer"
  | "partner"
  | "hiring_signal"
  | "property_level_champion"
  | "enterprise_router"
  | "low_priority";

/** What to lead with. The free trial is intentionally NOT a cold-blast default. */
export type SuggestedOffer =
  | "free_trial"
  | "examples"
  | "1_month_pilot"
  | "6_month_retainer"
  | "multi_property_pilot"
  | "restaurant_fnb"
  | "event_wedding"
  | "spa_wellness"
  | "select_service"
  | "partner_deal"
  | "right_person_ask"
  | "contract_alternative"
  | "none";

export type ComplianceResult = "pass" | "fail" | "pending";

export type DiscoveredCompanyStatus =
  | "new"
  | "enriching"
  | "enriched"
  | "promoted"
  | "duplicate"
  | "rejected";

export type DiscoveryRecommendedStep =
  | "enrich_website"
  | "find_contacts"
  | "check_job_signals"
  | "skip"
  | "manual_review";

export type JobSignalStatus = "new" | "reviewed" | "queued" | "dismissed";

export type LeadSourceType =
  | "web_search"
  | "google_cse"
  | "firecrawl_search"
  | "company_website"
  | "public_career_page"
  | "press_release"
  | "job_board"
  | "manual"
  | "referral";

export type HunterEndpoint = "domain_search" | "email_finder" | "email_verifier";

export type HunterVerificationStatus =
  | "verified"
  | "accept_all"
  | "webmail"
  | "disposable"
  | "unknown"
  | "invalid"
  | "risky";

export type SourceEntityType =
  | "company"
  | "contact"
  | "discovered_company"
  | "job_signal"
  | "contact_candidate"
  | "outreach_queue";

export type Vertical =
  | "hotel"
  | "restaurant"
  | "fnb"
  | "spa"
  | "wellness"
  | "resort"
  | "wedding"
  | "event";

/** Channel for outreach drafting + the compliance gate. */
export type OutreachChannel = "email" | "linkedin";

// ─── New tables ──────────────────────────────────────────────────────────────
export interface LeadSource {
  id: string;
  label: string;
  source_type: LeadSourceType | string;
  query?: string | null;
  target_market?: Market | null;
  company_category?: string | null;
  geography?: string | null;
  keywords: string[];
  daily_limit: number;
  is_active: boolean;
  respect_robots: boolean;
  notes: string;
  last_run_at?: string | null;
  last_run_count: number;
  created_at: string;
  updated_at?: string;
}

export interface DiscoveredCompany {
  id: string;
  lead_source_id?: string | null;
  company_id?: string | null;
  name: string;
  website?: string | null;
  source_url: string; // required — provenance
  company_category?: string | null;
  fit_reason?: string | null;
  possible_property_count?: number | null;
  verticals: string[];
  confidence_score: number;
  is_inference: boolean;
  recommended_next_step?: DiscoveryRecommendedStep | null;
  status: DiscoveredCompanyStatus | string;
  dedupe_key?: string | null;
  notes: string;
  discovered_at: string;
  created_at: string;
  updated_at?: string;
}

export interface JobSignal {
  id: string;
  company_id?: string | null;
  discovered_company_id?: string | null;
  company_name: string;
  job_title: string;
  job_post_url: string; // required — provenance
  job_platform?: string | null;
  role_summary?: string | null;
  keywords: string[];
  why_buying_signal?: string | null;
  likely_decision_maker?: string | null;
  contract_alternative_angle?: string | null;
  suggested_offer: string;
  priority_score: number;
  is_inference: boolean;
  status: JobSignalStatus | string;
  found_at: string;
  created_at: string;
  updated_at?: string;
}

export interface HunterLookup {
  id: string;
  company_id?: string | null;
  contact_candidate_id?: string | null;
  contact_id?: string | null;
  endpoint: HunterEndpoint | string;
  gate_priority_score?: number | null;
  gate_lead_type?: string | null;
  gate_reason?: string | null;
  domain?: string | null;
  full_name?: string | null;
  email?: string | null;
  verification_status?: HunterVerificationStatus | null;
  confidence_score?: number | null;
  hunter_source_urls: string[];
  raw_result?: unknown;
  enrichment_date: string;
  created_at: string;
}

export interface SourceUrl {
  id: string;
  entity_type: SourceEntityType | string;
  entity_id: string;
  field?: string | null;
  fact_value?: string | null;
  url?: string | null; // null only when is_inference = true (DB-enforced)
  excerpt?: string | null;
  is_inference: boolean;
  confidence?: number | null;
  fetched_at: string;
  created_at: string;
}

export interface ComplianceCheck {
  id: string;
  contact_id?: string | null;
  contact_candidate_id?: string | null;
  outreach_queue_id?: string | null;
  result: ComplianceResult;
  not_suppressed?: boolean | null;
  not_recently_contacted?: boolean | null;
  email_verified_or_high_conf?: boolean | null;
  has_source_urls?: boolean | null;
  no_invented_fields?: boolean | null;
  has_specific_detail?: boolean | null;
  email_has_optout_and_address?: boolean | null;
  linkedin_manual_only?: boolean | null;
  allowed_contact_source?: boolean | null;
  risk_flags: string[];
  missing: string[];
  recommended_fix?: string | null;
  checked_at: string;
  created_at: string;
}

// ─── Views (spec aliases) ────────────────────────────────────────────────────
/** enrichment_runs view → research_runs. */
export interface EnrichmentRunView {
  id: string;
  company_id?: string | null;
  company_name: string;
  website_url?: string | null;
  status: string;
  error_msg?: string | null;
  property_count_estimate?: number | null;
  company_type?: string | null;
  property_names: string[];
  amenities: string[];
  generic_emails: string[];
  contact_form_urls: string[];
  personalization_angle?: string | null;
  specific_use_cases?: string | null;
  fit_score: number;
  pages_scraped: number;
  sources_used: string[];
  created_at: string;
  updated_at?: string;
}

/** contact_enrichment view → contact_candidates. */
export interface ContactEnrichmentView {
  id: string;
  run_id?: string | null;
  company_id?: string | null;
  name?: string | null;
  title?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  source_url?: string | null;
  source_excerpt?: string | null;
  confidence_score: number;
  email_confidence?: number | null;
  email_status?: string | null;
  source_type?: string | null;
  recommended_channel?: string | null;
  recommended_action?: string | null;
  status: string;
  hunter_lookup_id?: string | null;
  is_inference: boolean;
  promoted_contact_id?: string | null;
  created_at: string;
  updated_at?: string;
}

/** approval_queue view → outreach_queue + contact/company joins. */
export interface ApprovalQueueRow {
  id: string;
  contact_id: string | null;
  company_id: string | null;
  company_name?: string | null;
  contact_name?: string | null;
  contact_role?: string | null;
  lead_type?: LeadType | string | null;
  priority_score?: number | null;
  best_angle?: string | null;
  suggested_offer?: SuggestedOffer | string | null;
  linkedin_draft?: string | null;
  email_draft?: string | null;
  quality_result?: unknown;
  compliance_status?: ComplianceResult | null;
  compliance_check_id?: string | null;
  status: ApprovalStatus | string;
  follow_up_date?: string | null;
  snoozed_until?: string | null;
  rejected_reason?: string | null;
  source_count?: number;
  contact_email?: string | null;
  contact_linkedin_url?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Extensions to existing interfaces (declaration merging) ─────────────────
export interface Company {
  discovered_company_id?: string | null;
  lead_source_id?: string | null;
  source?: string | null;
  verticals?: string[];
  confidence_score?: number | null;
}

export interface Contact {
  email_verification_status?:
    | "verified"
    | "accept_all"
    | "webmail"
    | "unknown"
    | "invalid"
    | "risky"
    | "high_confidence"
    | null;
  email_confidence?: number | null;
  email_source_url?: string | null;
  hunter_lookup_id?: string | null;
  enrichment_date?: string | null;
}

export interface OutreachQueueItem {
  company_id?: string | null;
  lead_type?: LeadType | string | null;
  priority_score?: number | null;
  best_angle?: string | null;
  suggested_offer?: SuggestedOffer | string | null;
  quality_result?: unknown;
  compliance_check_id?: string | null;
  compliance_status?: ComplianceResult | null;
  follow_up_date?: string | null;
  snoozed_until?: string | null;
  rejected_reason?: string | null;
  source_count?: number;
}

export interface AppSettings {
  discovery_daily_limit?: number;
  enrich_daily_limit?: number;
  hunter_daily_limit?: number;
  hunter_min_priority?: number;
  recontact_cooldown_days?: number;
}
