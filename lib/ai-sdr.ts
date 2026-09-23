// Server-only AI SDR orchestrator for Archer Design's Hotel Pipeline OS.
//
// Goal: discover reachable hospitality prospects, enrich them using existing
// Firecrawl research, prepare verified/high-confidence contacts, and create
// personalized EMAIL DRAFTS. It never approves, schedules, or sends email.
//
// This deliberately reuses the existing lead_sources, discovered_companies,
// companies, contact_candidates, contacts, messages, suppression and research
// flows rather than creating a parallel CRM.
import type { SupabaseClient } from "@supabase/supabase-js";
import { runResearch } from "@/lib/research-run";
import {
  hunterEmailFinder,
  hunterEmailVerifier,
  isHunterConfigured,
  mapHunterVerifierStatus,
} from "@/lib/hunter";

type AnyRow = Record<string, any>;

type AiSdrSettings = {
  enabled: boolean;
  autoPromote: boolean;
  autoHunter: boolean;
  autoDraft: boolean;
  dailyProspectLimit: number;
  enrichLimit: number;
  minConfidence: number;
  calendlyUrl: string;
};

type SearchHit = {
  url: string;
  title: string;
  snippet: string;
  provider: "firecrawl" | "google_cse";
};

type RunCounts = {
  prospects_found: number;
  companies_promoted: number;
  companies_enriched: number;
  candidates_found: number;
  hunter_lookups: number;
  contacts_prepared: number;
  drafts_created: number;
};

export type AiSdrRunResult = {
  ok: boolean;
  skipped?: boolean;
  run_id?: string;
  status: "success" | "partial" | "skipped" | "error";
  counts: RunCounts;
  warnings: string[];
  error?: string;
};

const DEFAULT_CALENDLY = "https://calendly.com/devonavich0/30min";
const PORTFOLIO_URL = "https://www.archerdesign.shop/devon";
const DEFAULT_MODEL = (process.env.AI_SDR_MODEL ?? "gpt-5-nano").trim();

const DEFAULT_SOURCES = [
  {
    label: "US hotel management companies",
    query: '"hotel management company" portfolio hotels United States',
    category: "hotel_management_company",
    keywords: ["hotel management", "portfolio", "hotels", "hospitality"],
  },
  {
    label: "US boutique hotel groups",
    query: '"boutique hotel group" "our hotels" United States',
    category: "boutique_hotel_group",
    keywords: ["boutique", "hotel group", "lifestyle", "our hotels"],
  },
  {
    label: "US independent hospitality groups",
    query: '"independent hospitality group" hotels portfolio United States',
    category: "hospitality_group",
    keywords: ["independent", "hospitality group", "portfolio", "hotels"],
  },
  {
    label: "US resort management groups",
    query: '"resort management" company portfolio United States',
    category: "resort_group",
    keywords: ["resort", "management", "portfolio"],
  },
];

const EXCLUDED_HOSTS = [
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "indeed.com",
  "glassdoor.com",
  "ziprecruiter.com",
  "tripadvisor.com",
  "yelp.com",
  "booking.com",
  "expedia.com",
  "hotels.com",
  "wikipedia.org",
  "youtube.com",
  // Industry media / PR domains are useful evidence sources, but they are not
  // prospect company websites. The first scout deliberately prefers owned
  // company domains so downstream contact research stays grounded.
  "hotelmanagement.net",
  "hotelbusiness.com",
  "hospitalitynet.org",
  "lodgingmagazine.com",
  "hotelexecutive.com",
  "prnewswire.com",
  "businesswire.com",
  "globenewswire.com",
];

const ENTERPRISE_HOST_HINTS = [
  "marriott.",
  "hilton.",
  "hyatt.",
  "ihg.",
  "accor.",
  "fourseasons.",
  "wyndham.",
  "choicehotels.",
  "bestwestern.",
];

const BUYER_TITLE_RE =
  /(chief marketing|cmo|vp .*marketing|vice president .*marketing|director .*marketing|sales.*marketing|marketing.*sales|digital|e-?commerce|commercial|revenue|general manager|\bgm\b|owner|founder|president|chief executive|\bceo\b)/i;

const COMPANY_TYPES = new Set([
  "hotel_management_company",
  "hospitality_group",
  "boutique_hotel_group",
  "resort_group",
  "independent_lifestyle_hotel",
  "branded_hotel",
  "other",
]);

function normalizeCompanyType(raw: unknown): string {
  const value = String(raw || "").trim();
  return COMPANY_TYPES.has(value) ? value : "other";
}

const counts0 = (): RunCounts => ({
  prospects_found: 0,
  companies_promoted: 0,
  companies_enriched: 0,
  candidates_found: 0,
  hunter_lookups: 0,
  contacts_prepared: 0,
  drafts_created: 0,
});

function clamp(n: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(n);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.floor(parsed))) : fallback;
}

function normalizeWebsite(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    u.hash = "";
    u.search = "";
    u.pathname = "/";
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function hostname(raw: string): string | null {
  const normalized = normalizeWebsite(raw);
  if (!normalized) return null;
  try {
    return new URL(normalized).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function isExcludedHost(host: string) {
  return (
    EXCLUDED_HOSTS.some((x) => host === x || host.endsWith(`.${x}`)) ||
    ENTERPRISE_HOST_HINTS.some((x) => host.includes(x))
  );
}

function nameFromTitle(title: string, host: string): string {
  const first = title
    .split(/\s+[|–—-]\s+/)[0]
    .replace(/\b(home|official site|hotels?|hospitality|management company)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (first.length >= 3 && first.length <= 80) return first;
  const stem = host.split(".")[0] || host;
  return stem
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function scoreDiscovery(hit: SearchHit, category: string): { score: number; reason: string; verticals: string[] } {
  const text = `${hit.title} ${hit.snippet} ${hit.url}`.toLowerCase();
  let score = 48;
  const reasons: string[] = [];
  const verticals = new Set<string>(["hotel"]);

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  if (/management company|hotel management|hospitality management/.test(text)) add(14, "hotel management signal");
  if (/portfolio|our hotels|properties|multi-property|collection/.test(text)) add(10, "multi-property/portfolio signal");
  if (/boutique|lifestyle|independent/.test(text)) add(7, "independent/boutique signal");
  if (/resort/.test(text)) {
    add(5, "resort signal");
    verticals.add("resort");
  }
  if (/restaurant|dining|food & beverage|f&b|bar\b/.test(text)) {
    add(4, "F&B signal");
    verticals.add("fnb");
  }
  if (/spa|wellness/.test(text)) {
    add(3, "spa/wellness signal");
    verticals.add("spa");
  }
  if (/meeting|event|wedding|conference/.test(text)) {
    add(3, "meetings/events signal");
    verticals.add("event");
  }
  if (/opening|renovat|rebrand|launch|new hotel|expan/.test(text)) add(7, "current growth/change signal");
  if (/marketing|social|digital|content|creative/.test(text)) add(5, "marketing/creative signal");
  if (/franchise development|investor relations|real estate investment/.test(text)) add(-5, "less-direct creative buyer signal");

  if (category === "hotel_management_company" && /management/.test(text)) score += 4;
  if (category === "boutique_hotel_group" && /boutique|lifestyle/.test(text)) score += 4;

  return {
    score: Math.max(0, Math.min(100, score)),
    reason: reasons.join("; ") || "public hospitality search match",
    verticals: [...verticals],
  };
}

async function loadSettings(admin: SupabaseClient): Promise<AiSdrSettings> {
  const { data } = await admin.from("app_settings").select("*").limit(1).maybeSingle();
  const row = (data ?? {}) as AnyRow;
  const envEnabled = (process.env.AI_SDR_ENABLED ?? "").toLowerCase() === "true";
  return {
    enabled: row.ai_sdr_enabled === true || envEnabled,
    autoPromote: row.ai_sdr_auto_promote !== false,
    autoHunter: row.ai_sdr_auto_hunter === true,
    autoDraft: row.ai_sdr_auto_draft !== false,
    dailyProspectLimit: clamp(row.ai_sdr_daily_prospect_limit, 10, 1, 100),
    enrichLimit: clamp(row.ai_sdr_enrich_limit, 5, 1, 25),
    minConfidence: clamp(row.ai_sdr_min_confidence, 70, 0, 100),
    calendlyUrl: String(row.ai_sdr_calendly_url || DEFAULT_CALENDLY).trim() || DEFAULT_CALENDLY,
  };
}

async function ensureLeadSources(admin: SupabaseClient) {
  const { data } = await admin.from("lead_sources").select("id,label,query,company_category,is_active").eq("is_active", true).limit(50);
  if ((data ?? []).length > 0) return data as AnyRow[];

  const rows = DEFAULT_SOURCES.map((s) => ({
    label: s.label,
    source_type: "firecrawl_search",
    query: s.query,
    target_market: "US",
    company_category: s.category,
    geography: "United States",
    keywords: s.keywords,
    daily_limit: 10,
    is_active: true,
    respect_robots: true,
    notes: "Seeded by Archer AI SDR. Public web discovery only; no LinkedIn scraping.",
  }));

  const { data: inserted, error } = await admin.from("lead_sources").insert(rows).select("*");
  if (error) throw new Error(`Could not seed lead_sources: ${error.message}`);
  return (inserted ?? []) as AnyRow[];
}

async function firecrawlSearch(query: string, limit: number): Promise<SearchHit[]> {
  const key = process.env.FIRECRAWL_API_KEY?.trim();
  if (!key) return [];
  const res = await fetch("https://api.firecrawl.dev/v1/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: Math.min(limit, 10), scrapeOptions: { formats: [] } }),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { success?: boolean; data?: Array<{ url?: string; title?: string; description?: string }> };
  if (!json.success) return [];
  return (json.data ?? [])
    .filter((x) => !!x.url)
    .map((x) => ({
      url: x.url as string,
      title: x.title ?? "",
      snippet: x.description ?? "",
      provider: "firecrawl" as const,
    }));
}

async function googleSearch(query: string, limit: number): Promise<SearchHit[]> {
  const key = process.env.GOOGLE_SEARCH_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_ID?.trim();
  if (!key || !cx) return [];
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", key);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(Math.min(limit, 10)));
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const json = (await res.json()) as { items?: Array<{ link?: string; title?: string; snippet?: string }> };
  return (json.items ?? [])
    .filter((x) => !!x.link)
    .map((x) => ({
      url: x.link as string,
      title: x.title ?? "",
      snippet: x.snippet ?? "",
      provider: "google_cse" as const,
    }));
}

async function searchWeb(query: string, limit: number): Promise<SearchHit[]> {
  const fc = await firecrawlSearch(query, limit);
  if (fc.length > 0) return fc;
  return googleSearch(query, limit);
}

async function safeSourceUrl(
  admin: SupabaseClient,
  payload: { entity_type: string; entity_id: string; field?: string; fact_value?: string; url?: string | null; excerpt?: string; is_inference?: boolean; confidence?: number },
) {
  try {
    await admin.from("source_urls").insert(payload);
  } catch {
    // Provenance table is additive; a missing migration should not corrupt the
    // main CRM flow. The dashboard will surface the migration requirement.
  }
}

async function saveDiscovery(
  admin: SupabaseClient,
  source: AnyRow,
  hit: SearchHit,
): Promise<{ inserted: boolean; row?: AnyRow }> {
  const website = normalizeWebsite(hit.url);
  const host = website ? hostname(website) : null;
  if (!website || !host || isExcludedHost(host)) return { inserted: false };

  const category = String(source.company_category || "hospitality_group");
  const scored = scoreDiscovery(hit, category);
  const name = nameFromTitle(hit.title, host);

  const { data: existing } = await admin
    .from("discovered_companies")
    .select("id,status,company_id,confidence_score")
    .eq("dedupe_key", host)
    .maybeSingle();
  if (existing) return { inserted: false, row: existing as AnyRow };

  const { data, error } = await admin
    .from("discovered_companies")
    .insert({
      lead_source_id: source.id,
      name,
      website,
      source_url: hit.url,
      company_category: category,
      fit_reason: scored.reason,
      verticals: scored.verticals,
      confidence_score: scored.score,
      is_inference: true,
      recommended_next_step: scored.score >= 70 ? "enrich_website" : "manual_review",
      status: "new",
      dedupe_key: host,
      notes: `Search provider: ${hit.provider}. Title: ${hit.title}. Snippet: ${hit.snippet}`.slice(0, 1000),
    })
    .select("*")
    .single();

  if (error || !data) return { inserted: false };
  await safeSourceUrl(admin, {
    entity_type: "discovered_company",
    entity_id: data.id,
    field: "discovery",
    fact_value: hit.title,
    url: hit.url,
    excerpt: hit.snippet.slice(0, 500),
    is_inference: false,
    confidence: scored.score,
  });
  return { inserted: true, row: data as AnyRow };
}

async function promoteCompany(admin: SupabaseClient, discovered: AnyRow): Promise<{ id: string; name: string; website: string } | null> {
  const website = normalizeWebsite(String(discovered.website || ""));
  if (!website) return null;
  const host = hostname(website);

  const { data: existingCompanies } = await admin
    .from("companies")
    .select("id,name,website")
    .limit(1000);
  const existing = ((existingCompanies ?? []) as AnyRow[]).find((c) => c.website && hostname(String(c.website)) === host);
  if (existing?.id) {
    await admin.from("discovered_companies").update({ status: "duplicate", company_id: existing.id }).eq("id", discovered.id);
    return { id: existing.id, name: existing.name, website: existing.website || website };
  }

  const base = {
    name: discovered.name,
    type: normalizeCompanyType(discovered.company_category),
    website,
    notes: `AI SDR discovery. ${discovered.fit_reason || ""}`.trim(),
  };
  const extended = {
    ...base,
    discovered_company_id: discovered.id,
    lead_source_id: discovered.lead_source_id ?? null,
    source: "ai_sdr",
    verticals: discovered.verticals ?? [],
    confidence_score: discovered.confidence_score ?? null,
  };

  let insert = await admin.from("companies").insert(extended).select("id,name,website").single();
  if (insert.error) {
    insert = await admin.from("companies").insert(base).select("id,name,website").single();
  }
  if (insert.error || !insert.data) return null;

  await admin
    .from("discovered_companies")
    .update({ status: "promoted", company_id: insert.data.id })
    .eq("id", discovered.id);

  await safeSourceUrl(admin, {
    entity_type: "company",
    entity_id: insert.data.id,
    field: "website",
    fact_value: website,
    url: discovered.source_url,
    excerpt: discovered.fit_reason || "AI SDR public search discovery",
    is_inference: false,
    confidence: discovered.confidence_score ?? null,
  });
  return insert.data as { id: string; name: string; website: string };
}

function splitName(name: string): { first: string; last: string } | null {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

async function logHunter(
  admin: SupabaseClient,
  payload: AnyRow,
) {
  try {
    await admin.from("hunter_lookups").insert(payload);
  } catch {
    // Audit table is additive; keep the lead in review if unavailable.
  }
}

async function maybePrepareCandidateEmail(
  admin: SupabaseClient,
  candidate: AnyRow,
  company: AnyRow,
  settings: AiSdrSettings,
): Promise<{ candidate: AnyRow; hunterCalls: number }> {
  let hunterCalls = 0;
  const currentEmail = String(candidate.email || "").trim().toLowerCase();
  const currentStatus = String(candidate.email_status || "");

  if (currentEmail && currentStatus === "direct_email_public") {
    if (!settings.autoHunter || !isHunterConfigured()) {
      return {
        candidate: {
          ...candidate,
          email: currentEmail,
          // Keep the existing DB-supported candidate classification. The
          // promoted contact records it as high_confidence instead.
          email_status: "direct_email_public",
          email_confidence: Math.max(Number(candidate.email_confidence || 0), Number(candidate.confidence_score || 0), 85),
        },
        hunterCalls,
      };
    }

    const verified = await hunterEmailVerifier(currentEmail);
    hunterCalls += 1;
    const mapped = mapHunterVerifierStatus(verified.data?.status ?? verified.data?.result);
    await logHunter(admin, {
      company_id: company.id,
      contact_candidate_id: candidate.id,
      endpoint: "email_verifier",
      gate_priority_score: Math.round(Number(candidate.confidence_score || 0) / 10),
      gate_lead_type: "direct buyer",
      gate_reason: "AI SDR verified a public direct email for a high-confidence decision-maker.",
      domain: hostname(company.website || ""),
      full_name: candidate.name,
      email: currentEmail,
      verification_status: mapped === "verified" ? "verified" : mapped === "risky" ? "risky" : mapped === "invalid" ? "invalid" : "unknown",
      confidence_score: verified.data?.score ?? candidate.confidence_score ?? null,
      raw_result: verified.raw ?? verified.data ?? null,
    });
    if (mapped !== "verified") return { candidate, hunterCalls };
    return {
      candidate: {
        ...candidate,
        email: currentEmail,
        email_status: "verified",
        email_confidence: verified.data?.score ?? 100,
      },
      hunterCalls,
    };
  }

  if (currentEmail || !settings.autoHunter || !isHunterConfigured()) {
    return { candidate, hunterCalls };
  }

  const name = splitName(String(candidate.name || ""));
  const domain = hostname(String(company.website || ""));
  if (!name || !domain) return { candidate, hunterCalls };

  const found = await hunterEmailFinder(domain, name.first, name.last);
  hunterCalls += 1;
  await logHunter(admin, {
    company_id: company.id,
    contact_candidate_id: candidate.id,
    endpoint: "email_finder",
    gate_priority_score: Math.round(Number(candidate.confidence_score || 0) / 10),
    gate_lead_type: "direct buyer",
    gate_reason: "AI SDR email finder enabled for a named high-confidence hospitality buyer.",
    domain,
    full_name: candidate.name,
    email: found.data?.email ?? null,
    confidence_score: found.data?.score ?? candidate.confidence_score ?? null,
    raw_result: found.raw ?? found.data ?? null,
  });
  if (!found.ok || !found.data?.email) return { candidate, hunterCalls };

  const verified = await hunterEmailVerifier(found.data.email);
  hunterCalls += 1;
  const mapped = mapHunterVerifierStatus(verified.data?.status ?? verified.data?.result);
  await logHunter(admin, {
    company_id: company.id,
    contact_candidate_id: candidate.id,
    endpoint: "email_verifier",
    gate_priority_score: Math.round(Number(candidate.confidence_score || 0) / 10),
    gate_lead_type: "direct buyer",
    gate_reason: "AI SDR verified an email returned by Hunter before preparing any draft.",
    domain,
    full_name: candidate.name,
    email: found.data.email,
    verification_status: mapped === "verified" ? "verified" : mapped === "risky" ? "risky" : mapped === "invalid" ? "invalid" : "unknown",
    confidence_score: verified.data?.score ?? found.data.score ?? null,
    raw_result: verified.raw ?? verified.data ?? null,
  });
  if (mapped !== "verified") return { candidate, hunterCalls };

  const prepared = {
    ...candidate,
    email: found.data.email.toLowerCase(),
    email_status: "verified",
    email_confidence: verified.data?.score ?? found.data.score ?? 100,
    title: found.data.position || candidate.title,
    linkedin_url: found.data.linkedin_url || candidate.linkedin_url,
  };

  await admin
    .from("contact_candidates")
    .update({
      email: prepared.email,
      email_status: "verified",
      email_confidence: prepared.email_confidence,
      title: prepared.title ?? null,
      linkedin_url: prepared.linkedin_url ?? null,
      source_type: "hunter_email_finder",
      source_excerpt: `Hunter verified ${prepared.email} for ${candidate.name} at ${domain}`,
      recommended_channel: "email",
      recommended_action: "create_email_draft",
      hunter_used_at: new Date().toISOString(),
      hunter_raw_result: { finder: found.data, verifier: verified.data ?? null },
    })
    .eq("id", candidate.id);

  return { candidate: prepared, hunterCalls };
}

async function promoteContact(admin: SupabaseClient, candidate: AnyRow, company: AnyRow): Promise<AnyRow | null> {
  const email = String(candidate.email || "").trim().toLowerCase();
  const status = String(candidate.email_status || "");
  if (!email || !["verified", "direct_email_public"].includes(status)) return null;

  const { data: suppressed } = await admin
    .from("suppression_list")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (suppressed) return null;

  const { data: existing } = await admin.from("contacts").select("*").ilike("email", email).limit(1).maybeSingle();
  if (existing) {
    await admin.from("contact_candidates").update({ status: "promoted", promoted_contact_id: existing.id }).eq("id", candidate.id);
    return existing as AnyRow;
  }

  const name = splitName(String(candidate.name || ""));
  if (!name) return null;

  const base: AnyRow = {
    first_name: name.first,
    last_name: name.last,
    title: candidate.title || "",
    company_id: company.id,
    company_name: company.name || "",
    company_type: normalizeCompanyType(company.company_type || company.type),
    type: "decision_maker",
    status: "new",
    email,
    linkedin_url: candidate.linkedin_url ?? null,
    notes: [candidate.source_excerpt, company.personalization_angle].filter(Boolean).join("\n").slice(0, 1000),
    source: candidate.source_type === "hunter_email_finder" ? "other" : "website",
  };
  const extended = {
    ...base,
    email_verification_status: status === "verified" ? "verified" : "high_confidence",
    email_confidence: Number(candidate.email_confidence || candidate.confidence_score || 0),
    email_source_url: candidate.source_url || null,
    enrichment_date: new Date().toISOString(),
  };

  let insert = await admin.from("contacts").insert(extended).select("*").single();
  if (insert.error) insert = await admin.from("contacts").insert(base).select("*").single();
  if (insert.error || !insert.data) return null;

  await admin
    .from("contact_candidates")
    .update({ status: "promoted", promoted_contact_id: insert.data.id })
    .eq("id", candidate.id);

  await safeSourceUrl(admin, {
    entity_type: "contact",
    entity_id: insert.data.id,
    field: "email",
    fact_value: email,
    url: candidate.source_url || company.website || null,
    excerpt: candidate.source_excerpt || `Public business contact for ${company.name}`,
    is_inference: false,
    confidence: Number(candidate.email_confidence || candidate.confidence_score || 0),
  });

  return insert.data as AnyRow;
}

function fallbackDraft(contact: AnyRow, company: AnyRow, calendlyUrl: string) {
  const detail = String(company.personalization_angle || company.research_summary || "").trim();
  const specific = detail
    ? `I was looking at ${company.name} and noticed ${detail.replace(/^[A-Z]/, (m: string) => m.toLowerCase()).slice(0, 180)}.`
    : `I was looking at ${company.name} and thought there may be a fit with the hospitality creative work I handle through Archer Design.`;

  return {
    subject: `Creative support for ${company.name}`,
    body: [
      `Hi ${contact.first_name},`,
      "",
      specific,
      "",
      "I help hotel and hospitality teams with ongoing social creative, campaign graphics, short-form video and motion, F&B/event promotions, AI-assisted creative production, and digital/UX work without adding another full-time creative hire.",
      "",
      `Portfolio: ${PORTFOLIO_URL}`,
      `If it is useful, you can grab a time here: ${calendlyUrl}`,
      "",
      "Best,",
      "Devon",
      "",
      "{{compliance_block}}",
    ].join("\n"),
  };
}

async function aiDraft(contact: AnyRow, company: AnyRow, calendlyUrl: string) {
  const fallback = fallbackDraft(contact, company, calendlyUrl);
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return fallback;

  const evidence = {
    company_name: company.name,
    website: company.website,
    research_summary: company.research_summary ?? null,
    personalization_angle: company.personalization_angle ?? null,
    specific_use_cases: company.specific_use_cases ?? null,
    property_count_estimate: company.property_count_estimate ?? null,
    amenities: company.amenities ?? null,
    contact_first_name: contact.first_name,
    contact_title: contact.title,
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You write concise B2B outreach for Archer Design to hotel/hospitality decision-makers. Use ONLY the supplied public evidence. Never invent a property, metric, problem, hiring need, revenue claim, or internal fact. Avoid hype and em dashes. Return strict JSON with subject and body. Body must be 80-130 words, human, specific, and low-pressure.",
          },
          {
            role: "user",
            content: [
              "Evidence:",
              JSON.stringify(evidence),
              "",
              "Offer: ongoing social creative, campaign graphics, short-form video/motion, F&B/event promotions, AI-assisted creative production, and digital/UX support.",
              `Portfolio: ${PORTFOLIO_URL}`,
              `Booking link: ${calendlyUrl}`,
              "Close with Devon. Do not include a compliance footer; the app will append the {{compliance_block}} placeholder.",
            ].join("\n"),
          },
        ],
      }),
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(raw) as { subject?: string; body?: string };
    const subject = String(parsed.subject || "").trim();
    let body = String(parsed.body || "").trim();
    if (!subject || !body) return fallback;
    if (!body.includes(PORTFOLIO_URL)) body += `\n\nPortfolio: ${PORTFOLIO_URL}`;
    if (!body.includes(calendlyUrl)) body += `\nIf useful, you can grab a time here: ${calendlyUrl}`;
    if (!body.includes("{{compliance_block}}")) body += "\n\n{{compliance_block}}";
    return { subject: subject.slice(0, 140), body };
  } catch {
    return fallback;
  }
}

async function createDraft(admin: SupabaseClient, contact: AnyRow, company: AnyRow, calendlyUrl: string) {
  const { data: existing } = await admin
    .from("messages")
    .select("id,status")
    .eq("contact_id", contact.id)
    .in("status", ["draft", "needs_review", "approved", "approved_for_today", "scheduled", "sending", "sent"])
    .limit(1)
    .maybeSingle();
  if (existing) return false;

  const draft = await aiDraft(contact, company, calendlyUrl);
  const { error } = await admin.from("messages").insert({
    contact_id: contact.id,
    company_id: company.id,
    channel: "email",
    subject: draft.subject,
    body: draft.body,
    status: "draft",
  });
  return !error;
}

async function startRun(admin: SupabaseClient, triggerType: "manual" | "cron") {
  const { data } = await admin
    .from("ai_sdr_runs")
    .insert({ status: "running", trigger_type: triggerType })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

async function finishRun(
  admin: SupabaseClient,
  runId: string | undefined,
  status: "success" | "partial" | "skipped" | "error",
  counts: RunCounts,
  warnings: string[],
  errorMessage?: string,
) {
  if (!runId) return;
  await admin.from("ai_sdr_runs").update({
    status,
    ...counts,
    warnings,
    error_message: errorMessage ?? null,
    finished_at: new Date().toISOString(),
  }).eq("id", runId);
}

export async function runAiSdr(
  admin: SupabaseClient,
  triggerType: "manual" | "cron",
): Promise<AiSdrRunResult> {
  const counts = counts0();
  const warnings: string[] = [];
  let runId: string | undefined;

  try {
    const settings = await loadSettings(admin);
    try {
      runId = await startRun(admin, triggerType);
    } catch {
      warnings.push("AI SDR run-audit table unavailable. Apply the 20260923 AI SDR migration.");
    }

    if (!settings.enabled) {
      warnings.push("AI SDR is disabled. Enable it in the AI SDR dashboard when you are ready.");
      await finishRun(admin, runId, "skipped", counts, warnings);
      return { ok: true, skipped: true, run_id: runId, status: "skipped", counts, warnings };
    }

    if (!process.env.FIRECRAWL_API_KEY?.trim() && !(process.env.GOOGLE_SEARCH_API_KEY?.trim() && process.env.GOOGLE_CSE_ID?.trim())) {
      throw new Error("No discovery provider is configured. Add FIRECRAWL_API_KEY or Google Search API + CSE credentials.");
    }

    const sources = await ensureLeadSources(admin);
    const perSource = Math.max(2, Math.ceil(settings.dailyProspectLimit / Math.max(1, sources.length)));
    const discovered: AnyRow[] = [];
    const discoveredIds = new Set<string>();

    for (const source of sources) {
      if (discovered.length >= settings.dailyProspectLimit) break;
      const query = String(source.query || "").trim();
      if (!query) continue;
      const hits = await searchWeb(query, Math.min(perSource + 3, 10));
      let sourceCount = 0;
      for (const hit of hits) {
        if (discovered.length >= settings.dailyProspectLimit) break;
        const saved = await saveDiscovery(admin, source, hit);
        if (saved.row && !discoveredIds.has(String(saved.row.id))) {
          // A previously discovered but still-unprocessed prospect is allowed
          // back into today's qualification pass; it is not counted as "new".
          if (saved.inserted || saved.row.status === "new") {
            discovered.push(saved.row);
            discoveredIds.add(String(saved.row.id));
          }
        }
        if (saved.inserted) {
          counts.prospects_found += 1;
          sourceCount += 1;
        }
      }
      await admin.from("lead_sources").update({
        last_run_at: new Date().toISOString(),
        last_run_count: sourceCount,
      }).eq("id", source.id);
    }

    if (!settings.autoPromote) {
      await finishRun(admin, runId, "success", counts, warnings);
      return { ok: true, run_id: runId, status: "success", counts, warnings };
    }

    const qualifying = discovered
      .filter((d) => Number(d.confidence_score || 0) >= settings.minConfidence)
      .sort((a, b) => Number(b.confidence_score || 0) - Number(a.confidence_score || 0))
      .slice(0, settings.enrichLimit);

    for (const discoveredCompany of qualifying) {
      const promoted = await promoteCompany(admin, discoveredCompany);
      if (!promoted) {
        warnings.push(`Could not promote ${discoveredCompany.name}.`);
        continue;
      }
      counts.companies_promoted += 1;

      const research = await runResearch(admin, promoted.id, promoted.website, promoted.name);
      if (!research.ok) {
        warnings.push(`Research failed for ${promoted.name}: ${research.error || "unknown error"}`);
        continue;
      }
      counts.companies_enriched += 1;
      counts.candidates_found += research.candidates_created ?? 0;

      const { data: companyFresh } = await admin.from("companies").select("*").eq("id", promoted.id).single();
      const company = (companyFresh ?? promoted) as AnyRow;

      const { data: candidateRows } = await admin
        .from("contact_candidates")
        .select("*")
        .eq("company_id", promoted.id)
        .eq("status", "needs_review")
        .order("confidence_score", { ascending: false })
        .limit(12);

      const candidates = ((candidateRows ?? []) as AnyRow[])
        .filter((c) => c.name && BUYER_TITLE_RE.test(String(c.title || "")))
        .filter((c) => Number(c.confidence_score || 0) >= Math.max(70, settings.minConfidence))
        .slice(0, 2);

      for (const original of candidates) {
        const prepared = await maybePrepareCandidateEmail(admin, original, company, settings);
        counts.hunter_lookups += prepared.hunterCalls;

        const candidate = prepared.candidate;
        if (!candidate.email || !["verified", "direct_email_public"].includes(String(candidate.email_status || ""))) {
          continue;
        }

        const contact = await promoteContact(admin, candidate, company);
        if (!contact) continue;
        counts.contacts_prepared += 1;

        if (settings.autoDraft && await createDraft(admin, contact, company, settings.calendlyUrl)) {
          counts.drafts_created += 1;
        }
      }
    }

    const status = warnings.length ? "partial" : "success";
    await finishRun(admin, runId, status, counts, warnings);
    return { ok: true, run_id: runId, status, counts, warnings };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnings.push(message);
    await finishRun(admin, runId, "error", counts, warnings, message);
    return { ok: false, run_id: runId, status: "error", counts, warnings, error: message };
  }
}
