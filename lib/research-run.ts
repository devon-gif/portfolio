// Server-only: Firecrawl-powered company research.
// Never sends emails. Never calls Hunter. Never auto-promotes candidates.

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  extractEmails,
  extractPhones,
  extractLocations,
  extractContactFormUrls,
  extractPersons,
  extractPropertyIntel,
  inferCompanyType,
  generatePersonalization,
} from "./research-extract";
import { scoreBuyerTitle, TIER_LABEL } from "./buyer-titles";

interface FirecrawlScrapeResult {
  success?: boolean;
  data?: {
    markdown?: string;
    content?: string;
    metadata?: { title?: string; sourceURL?: string; description?: string };
  };
  error?: string;
}

type ResearchRunStatus = "running" | "success" | "error";

type ScrapedPage = {
  markdown: string;
  sourceUrl: string;
  pageType: string;
};

const DISCOVERY_PATHS = [
  // Leadership / team pages first — most likely to list named buyers.
  "/leadership",
  "/our-leadership",
  "/team",
  "/our-team",
  "/meet-the-team",
  "/people",
  "/our-people",
  "/management",
  "/executive-team",
  "/who-we-are",
  "/about",
  "/about-us",
  "/our-company",
  "/contact",
  "/contact-us",
  "/sales",
  // Property / amenity signal pages.
  "/portfolio",
  "/properties",
  "/hotels",
  "/restaurants",
  "/events",
  "/meetings",
  "/weddings",
];

const COLUMN_CANDIDATES = {
  companies: [
    "company_type",
    "fit_score",
    "company_score",
    "research_summary",
    "property_count_estimate",
    "property_names",
    "locations",
    "amenities",
    "generic_emails",
    "public_emails",
    "contact_form_urls",
    "phone_numbers",
    "leadership_names",
    "marketing_sales_people",
    "restaurant_bar_mentions",
    "spa_wellness_mentions",
    "meetings_events_weddings_mentions",
    "personalization_angle",
    "specific_use_cases",
    "specific_client_type",
    "last_researched_at",
  ],
  research_runs: [
    "company_id",
    "company_name",
    "website_url",
    "status",
    "error_msg",
    "property_count_estimate",
    "company_type",
    "property_names",
    "amenities",
    "generic_emails",
    "contact_form_urls",
    "personalization_angle",
    "specific_use_cases",
    "fit_score",
    "pages_scraped",
    "sources_used",
  ],
  research_sources: [
    "run_id",
    "source_type",
    "url",
    "page_type",
    "raw_content",
    "metadata",
  ],
  contact_candidates: [
    "run_id",
    "company_id",
    "name",
    "title",
    "email",
    "email_status",
    "linkedin_url",
    "source_url",
    "source_type",
    "source_excerpt",
    "confidence_score",
    "recommended_channel",
    "recommended_action",
    "status",
    "notes",
  ],
} as const;

const columnCache = new Map<string, Set<string>>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeWebsite(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getOrigin(url: string): string {
  return new URL(normalizeWebsite(url)).origin;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

async function getExistingColumns(
  admin: SupabaseClient,
  table: keyof typeof COLUMN_CANDIDATES,
): Promise<Set<string>> {
  const cached = columnCache.get(table);
  if (cached) return cached;

  const existing = new Set<string>();
  for (const column of COLUMN_CANDIDATES[table]) {
    const { error } = await admin.from(table).select(column).limit(0);
    if (!error) existing.add(column);
  }

  columnCache.set(table, existing);
  return existing;
}

async function columnSafePayload(
  admin: SupabaseClient,
  table: keyof typeof COLUMN_CANDIDATES,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const existing = await getExistingColumns(admin, table);
  return Object.fromEntries(Object.entries(payload).filter(([key]) => existing.has(key)));
}

async function insertSafe(
  admin: SupabaseClient,
  table: keyof typeof COLUMN_CANDIDATES,
  payload: Record<string, unknown>,
) {
  const safe = await columnSafePayload(admin, table, payload);
  if (Object.keys(safe).length === 0) return { data: null, error: null };
  return admin.from(table).insert(safe);
}

async function updateSafe(
  admin: SupabaseClient,
  table: keyof typeof COLUMN_CANDIDATES,
  payload: Record<string, unknown>,
  id: string,
) {
  const safe = await columnSafePayload(admin, table, payload);
  if (Object.keys(safe).length === 0) return;
  await admin.from(table).update(safe).eq("id", id);
}

async function setRunStatus(
  admin: SupabaseClient,
  runId: string,
  status: ResearchRunStatus,
  extra: Record<string, unknown> = {},
) {
  const preferred = status === "success" ? "success" : status;
  const payload = await columnSafePayload(admin, "research_runs", { status: preferred, ...extra });
  if (Object.keys(payload).length === 0) return;

  const { error } = await admin.from("research_runs").update(payload).eq("id", runId);
  if (error && status === "success") {
    await admin.from("research_runs").update({ ...payload, status: "done" }).eq("id", runId);
  }
}

async function scrapeUrl(apiKey: string, url: string, pageType: string): Promise<ScrapedPage | null> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 0,
      }),
    });
    if (!res.ok) return null;

    const data: FirecrawlScrapeResult = await res.json();
    if (!data.success || !data.data) return null;

    const markdown = data.data.markdown ?? data.data.content ?? "";
    if (!markdown.trim()) return null;

    return {
      markdown,
      sourceUrl: data.data.metadata?.sourceURL ?? url,
      pageType,
    };
  } catch {
    return null;
  }
}

function findLinkedInUrls(text: string): string[] {
  const urls = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/(?:in|pub|company)\/[^\s)"'<>]+/gi) ?? [];
  return unique(urls.map((url) => url.replace(/[),.;]+$/, ""))).slice(0, 25);
}

function pageUrls(websiteUrl: string): { url: string; pageType: string }[] {
  const normalized = normalizeWebsite(websiteUrl);
  const base = getOrigin(normalized);
  return [
    { url: normalized, pageType: "homepage" },
    ...DISCOVERY_PATHS.map((path) => ({
      url: `${base}${path}`,
      pageType: path.replace(/^\//, "").replace(/-/g, "_"),
    })),
  ];
}

function classifyCompanyScore(input: {
  text: string;
  companyType: string | null;
  propertyCount: number | null;
  amenities: string[];
  pages: ScrapedPage[];
}) {
  const t = input.text.toLowerCase();
  const pages = input.pages.map((page) => page.pageType);
  const hasHotelSignal = /hotel|hospitality|resort|inn|lodging|property|properties/.test(t);
  let score = 0;

  if (input.companyType === "hotel_management_company") score += 5;
  if ((input.propertyCount ?? 0) > 1 || /manage[sd]? multiple|own[sd]? multiple|portfolio of/.test(t)) score += 5;
  if (/boutique|lifestyle|resort/.test(t)) score += 4;
  if (input.amenities.some((a) => ["restaurant", "bar", "f&b"].includes(a))) score += 4;
  if (input.amenities.some((a) => ["meetings", "events", "weddings"].includes(a))) score += 3;
  if (input.amenities.some((a) => ["spa", "wellness"].includes(a))) score += 3;
  if (pages.some((page) => ["portfolio", "properties", "hotels"].includes(page))) score += 3;
  if (input.propertyCount === 1) score -= 5;
  if (!hasHotelSignal) score -= 5;

  return score;
}

function titleScore(title: string) {
  const t = title.toLowerCase();
  let score = 0;
  if (/vp .*marketing|vice president .*marketing|director of marketing|cmo/.test(t)) score += 5;
  if (/vp .*sales.*marketing|vice president .*sales.*marketing/.test(t)) score += 5;
  if (/director .*digital|director .*e-?commerce/.test(t)) score += 4;
  if (/director .*sales.*marketing/.test(t)) score += 4;
  if (/regional director .*sales|regional director .*marketing|area director .*sales|area director .*marketing/.test(t)) score += 4;
  if (/commercial|revenue strategy|revenue management/.test(t)) score += 3;
  if (/\bgm\b|general manager|owner|president|founder|ceo|chief executive/.test(t)) score += 2;
  if (/hr|human resources|recruit|student|intern|engineer|developer|unrelated/.test(t)) score -= 5;
  return score;
}

function scoreCandidate(input: { title?: string | null; emailStatus?: string | null; linkedinUrl?: string | null }) {
  let score = titleScore(input.title ?? "");
  if (input.linkedinUrl) score += 2;
  if (input.emailStatus === "direct_email_public") score += 3;
  if (input.emailStatus === "generic_role_email") score += 1;
  return Math.max(0, Math.min(100, 50 + score * 5));
}

function sourceExcerpt(text: string, needle: string) {
  const index = text.toLowerCase().indexOf(needle.toLowerCase());
  if (index < 0) return text.replace(/\s+/g, " ").trim().slice(0, 260);
  const start = Math.max(0, index - 120);
  return text.slice(start, index + needle.length + 140).replace(/\s+/g, " ").trim().slice(0, 300);
}

function inferRecommendedAction(emailStatus: string) {
  if (emailStatus === "direct_email_public") return "create_email_draft";
  if (emailStatus === "generic_role_email") return "create_email_draft";
  if (emailStatus === "contact_form") return "create_contact_form_task";
  if (emailStatus === "linkedin_only") return "create_linkedin_draft";
  if (emailStatus === "needs_email") return "verify_with_hunter";
  return "manual_review";
}

function inferRecommendedChannel(emailStatus: string) {
  if (emailStatus === "direct_email_public") return "email";
  if (emailStatus === "generic_role_email") return "generic_email";
  if (emailStatus === "contact_form") return "contact_form";
  if (emailStatus === "linkedin_only") return "linkedin";
  return "needs_manual_research";
}

function candidateKey(candidate: Record<string, unknown>) {
  if (candidate.email) return `email:${String(candidate.email).toLowerCase()}`;
  if (candidate.linkedin_url) return `linkedin:${String(candidate.linkedin_url).toLowerCase()}`;
  return `person:${String(candidate.name ?? "").toLowerCase()}:${String(candidate.title ?? "").toLowerCase()}:${String(candidate.source_url ?? "").toLowerCase()}`;
}

function buildResearchSummary(input: {
  companyType: string | null;
  propertyCount: number | null;
  propertyNames: string[];
  locations: string[];
  amenities: string[];
  emails: number;
  people: number;
  forms: number;
}) {
  const parts: string[] = [];
  if (input.companyType) parts.push(input.companyType.replace(/_/g, " "));
  if (input.propertyCount) parts.push(`~${input.propertyCount} properties`);
  else if (input.propertyNames.length) parts.push(`${input.propertyNames.length} property name signals`);
  if (input.locations.length) parts.push(`locations: ${input.locations.slice(0, 4).join(", ")}`);
  if (input.amenities.length) parts.push(`signals: ${input.amenities.join(", ")}`);
  if (input.people) parts.push(`${input.people} named people found`);
  if (input.emails) parts.push(`${input.emails} public emails found`);
  if (input.forms) parts.push(`${input.forms} contact forms found`);
  return parts.join(" · ") || "Firecrawl completed; no strong hotel/company/contact signals found.";
}

export async function runResearch(
  admin: SupabaseClient,
  companyId: string,
  websiteUrl: string,
  companyName: string,
): Promise<{ ok: boolean; run_id?: string; error?: string; candidates_created?: number; pages_scraped?: number }> {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "FIRECRAWL_API_KEY is not configured." };

  const normalizedWebsite = normalizeWebsite(websiteUrl);
  const runPayload = await columnSafePayload(admin, "research_runs", {
    company_id: companyId,
    company_name: companyName,
    website_url: normalizedWebsite,
    status: "running",
  });

  let { data: run, error: runErr } = await admin.from("research_runs").insert(runPayload).select("id").single();
  if (runErr && "status" in runPayload) {
    const fallbackPayload = { ...runPayload };
    delete fallbackPayload.status;
    const fallback = await admin.from("research_runs").insert(fallbackPayload).select("id").single();
    run = fallback.data;
    runErr = fallback.error;
  }
  if (runErr || !isRecord(run) || typeof run.id !== "string") {
    return { ok: false, error: runErr?.message ?? "Failed to create research run." };
  }
  const runId = run.id;

  try {
    const scrapedPages: ScrapedPage[] = [];
    const tried = new Set<string>();

    for (const target of pageUrls(normalizedWebsite)) {
      if (scrapedPages.length >= 8) break;
      if (tried.has(target.url)) continue;
      tried.add(target.url);

      const page = await scrapeUrl(apiKey, target.url, target.pageType);
      if (!page) continue;
      scrapedPages.push(page);

      await insertSafe(admin, "research_sources", {
        run_id: runId,
        source_type: "firecrawl",
        url: page.sourceUrl,
        page_type: page.pageType,
        raw_content: page.markdown.slice(0, 12000),
        metadata: { requested_url: target.url },
      });
    }

    const fullText = scrapedPages.map((page) => page.markdown).join("\n\n");
    const propertyIntel = extractPropertyIntel(fullText);
    const companyType = inferCompanyType(fullText);
    const emails = extractEmails(fullText).filter((email) => email.email_status !== "needs_manual_review");
    const phones = extractPhones(fullText);
    const locations = extractLocations(fullText);
    const contactForms = unique(
      scrapedPages.flatMap((page) => extractContactFormUrls(page.markdown, page.sourceUrl)),
    ).slice(0, 20);
    const linkedinUrls = unique(scrapedPages.flatMap((page) => findLinkedInUrls(page.markdown))).slice(0, 25);
    const persons = scrapedPages.flatMap((page) =>
      extractPersons(page.markdown, page.sourceUrl).map((person) => ({
        ...person,
        source_url: page.sourceUrl,
        source_excerpt: person.source_excerpt || sourceExcerpt(page.markdown, person.name),
      })),
    );

    const leadershipNames = persons
      .filter((person) => /owner|founder|president|ceo|coo|general manager|gm|leadership/i.test(person.title))
      .map((person) => person.name)
      .slice(0, 30);
    const marketingSalesPeople = persons
      .filter((person) => /marketing|sales|digital|e-?commerce|commercial|revenue/i.test(person.title))
      .map((person) => `${person.name}${person.title ? ` - ${person.title}` : ""}`)
      .slice(0, 50);

    const restaurantBarMentions = propertyIntel.amenities.some((a) => ["restaurant", "bar", "f&b"].includes(a));
    const spaWellnessMentions = propertyIntel.amenities.some((a) => ["spa", "wellness"].includes(a));
    const meetingsEventsWeddingsMentions = propertyIntel.amenities.some((a) =>
      ["meetings", "events", "weddings"].includes(a),
    );

    const companyScore = classifyCompanyScore({
      text: fullText,
      companyType,
      propertyCount: propertyIntel.property_count_estimate,
      amenities: propertyIntel.amenities,
      pages: scrapedPages,
    });
    const personalization = generatePersonalization({
      company_type: companyType,
      property_count_estimate: propertyIntel.property_count_estimate,
      amenities: propertyIntel.amenities,
      property_names: propertyIntel.property_names,
    });
    const specificClientType =
      companyType === "hotel_management_company"
        ? "hotel management companies"
        : companyType === "boutique_hotel_group"
          ? "boutique/lifestyle hotel groups"
          : companyType === "resort_group"
            ? "resort groups"
            : "hospitality companies";
    const researchSummary = buildResearchSummary({
      companyType,
      propertyCount: propertyIntel.property_count_estimate,
      propertyNames: propertyIntel.property_names,
      locations,
      amenities: propertyIntel.amenities,
      emails: emails.length,
      people: persons.length,
      forms: contactForms.length,
    });

    await updateSafe(admin, "companies", {
      company_type: companyType,
      fit_score: companyScore,
      company_score: companyScore,
      research_summary: researchSummary,
      property_count_estimate: propertyIntel.property_count_estimate,
      property_names: propertyIntel.property_names,
      locations,
      amenities: propertyIntel.amenities,
      generic_emails: emails.map((email) => email.email),
      public_emails: emails.map((email) => email.email),
      contact_form_urls: contactForms,
      phone_numbers: phones,
      leadership_names: leadershipNames,
      marketing_sales_people: marketingSalesPeople,
      restaurant_bar_mentions: restaurantBarMentions,
      spa_wellness_mentions: spaWellnessMentions,
      meetings_events_weddings_mentions: meetingsEventsWeddingsMentions,
      personalization_angle: personalization.personalization_angle,
      specific_use_cases: personalization.specific_use_cases,
      specific_client_type: specificClientType,
      last_researched_at: new Date().toISOString(),
    }, companyId);

    const candidates: Record<string, unknown>[] = [];

    for (const person of persons) {
      // Prefer a LinkedIn URL captured next to the person; else try to match one
      // from the page by name slug.
      const linkedin =
        person.linkedin_url ??
        linkedinUrls.find((url) => url.toLowerCase().includes(person.name.toLowerCase().replace(/\s+/g, "-"))) ??
        null;
      const personEmail = person.email ?? null;
      const emailStatus = personEmail ? "direct_email_public" : linkedin ? "linkedin_only" : "needs_email";
      const buyer = scoreBuyerTitle(person.title);
      candidates.push({
        run_id: runId,
        company_id: companyId,
        name: person.name,
        title: person.title,
        email: personEmail,
        email_status: emailStatus,
        linkedin_url: linkedin,
        source_url: person.source_url,
        source_type: "scraped_page",
        source_excerpt: person.source_excerpt,
        confidence_score: scoreCandidate({ title: person.title, emailStatus, linkedinUrl: linkedin ?? undefined }),
        recommended_channel: personEmail ? "email" : inferRecommendedChannel(emailStatus),
        recommended_action: personEmail ? "create_email_draft" : inferRecommendedAction(emailStatus),
        status: "needs_review",
        notes: `${buyer.label} (${TIER_LABEL[buyer.tier]}) — named contact found on ${person.source_url}.${personEmail ? "" : " Approve a Hunter lookup to find/verify an email."}`,
      });
    }

    for (const email of emails) {
      candidates.push({
        run_id: runId,
        company_id: companyId,
        name: null,
        title: null,
        email: email.email,
        email_status: email.email_status,
        linkedin_url: null,
        source_url: normalizedWebsite,
        source_type: "email_regex",
        source_excerpt: `Public email found on scraped site: ${email.email}`,
        confidence_score: scoreCandidate({ emailStatus: email.email_status }),
        recommended_channel: inferRecommendedChannel(email.email_status),
        recommended_action: inferRecommendedAction(email.email_status),
        status: "needs_review",
        notes: "Public email found by Firecrawl scrape. Not verified by Hunter.",
      });
    }

    for (const formUrl of contactForms) {
      candidates.push({
        run_id: runId,
        company_id: companyId,
        name: null,
        title: null,
        email: null,
        email_status: "contact_form",
        linkedin_url: null,
        source_url: formUrl,
        source_type: "scraped_page",
        source_excerpt: `Contact form URL found: ${formUrl}`,
        confidence_score: scoreCandidate({ emailStatus: "contact_form" }),
        recommended_channel: "contact_form",
        recommended_action: "create_contact_form_task",
        status: "needs_review",
        notes: "Contact form discovered during Firecrawl scrape.",
      });
    }

    for (const linkedinUrl of linkedinUrls) {
      if (candidates.some((candidate) => candidate.linkedin_url === linkedinUrl)) continue;
      candidates.push({
        run_id: runId,
        company_id: companyId,
        name: null,
        title: null,
        email: null,
        email_status: "linkedin_only",
        linkedin_url: linkedinUrl,
        source_url: linkedinUrl,
        source_type: "scraped_page",
        source_excerpt: `LinkedIn URL found on scraped site: ${linkedinUrl}`,
        confidence_score: scoreCandidate({ emailStatus: "linkedin_only", linkedinUrl }),
        recommended_channel: "linkedin",
        recommended_action: "create_linkedin_draft",
        status: "needs_review",
        notes: "LinkedIn URL found by Firecrawl scrape.",
      });
    }

    const deduped = [...new Map(candidates.map((candidate) => [candidateKey(candidate), candidate])).values()];
    let candidatesCreated = 0;

    if (deduped.length > 0) {
      const safeCandidates = await Promise.all(
        deduped.map((candidate) => columnSafePayload(admin, "contact_candidates", candidate)),
      );
      const rows = safeCandidates.filter((candidate) => Object.keys(candidate).length > 0);
      if (rows.length > 0) {
        const { data: existing } = await admin
          .from("contact_candidates")
          .select("email, linkedin_url, name, title, source_url")
          .eq("company_id", companyId)
          .limit(500);
        const existingKeys = new Set(((existing ?? []) as Record<string, unknown>[]).map(candidateKey));
        const newRows = rows.filter((row) => !existingKeys.has(candidateKey(row)));
        if (newRows.length > 0) {
          const { error } = await admin.from("contact_candidates").insert(newRows);
          if (error) throw error;
          candidatesCreated = newRows.length;
        }
      }
    }

    await setRunStatus(admin, runId, "success", {
      property_count_estimate: propertyIntel.property_count_estimate,
      company_type: companyType,
      property_names: propertyIntel.property_names,
      amenities: propertyIntel.amenities,
      generic_emails: emails.map((email) => email.email),
      contact_form_urls: contactForms,
      personalization_angle: personalization.personalization_angle,
      specific_use_cases: personalization.specific_use_cases,
      fit_score: companyScore,
      pages_scraped: scrapedPages.length,
      sources_used: scrapedPages.map((page) => page.sourceUrl),
      error_msg: null,
    });

    return {
      ok: true,
      run_id: runId,
      candidates_created: candidatesCreated,
      pages_scraped: scrapedPages.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (runId) await setRunStatus(admin, runId, "error", { error_msg: message });
    return { ok: false, run_id: runId, error: message };
  }
}
