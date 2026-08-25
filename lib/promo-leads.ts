// Promo Rescue Lead Finder — SERVER ONLY. Never import into a client component.
//
// Ethical-by-design: this module only ever FINDS, SCRAPES PUBLIC PAGES, and
// SCORES businesses. It never sends a message, never logs into anything,
// never scrapes LinkedIn, and never scrapes Facebook/Instagram content that
// sits behind a login. Every lead this produces is left in status "new" for
// a human to manually review, approve, and send themselves.

export type PromoCategory =
  | "restaurant"
  | "cafe"
  | "bakery"
  | "salon"
  | "spa"
  | "med_spa"
  | "gym"
  | "event_venue"
  | "wedding_venue"
  | "hotel"
  | "local_service";

export const PROMO_CATEGORIES: { value: PromoCategory; label: string; placesQuery: string }[] = [
  { value: "restaurant", label: "Restaurant", placesQuery: "restaurant" },
  { value: "cafe", label: "Cafe", placesQuery: "cafe" },
  { value: "bakery", label: "Bakery", placesQuery: "bakery" },
  { value: "salon", label: "Salon", placesQuery: "hair salon" },
  { value: "spa", label: "Spa", placesQuery: "spa" },
  { value: "med_spa", label: "Med spa", placesQuery: "med spa" },
  { value: "gym", label: "Gym", placesQuery: "gym" },
  { value: "event_venue", label: "Event venue", placesQuery: "event venue" },
  { value: "wedding_venue", label: "Wedding venue", placesQuery: "wedding venue" },
  { value: "hotel", label: "Hotel", placesQuery: "small hotel" },
  { value: "local_service", label: "Local service business", placesQuery: "local service business" },
];

export type LeadStatus = "new" | "reviewed" | "approved" | "contacted" | "not_fit";

export interface DiscoveredBusiness {
  place_id: string | null;
  business_name: string;
  category: string;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
  rating: number | null;
  review_count: number | null;
}

export interface WebsiteSignals {
  scraped: boolean;
  mentionsPromo: boolean;
  promoExcerpt: string | null;
  hasMenuOrServicesPage: boolean;
  hasSocialLinks: boolean;
  hasClearCta: boolean;
  weakMetaDescription: boolean;
  weakHeadline: boolean;
  oldCopyrightYear: number | null;
  outdatedLanguage: boolean;
  ownerOperatedSignal: boolean;
  chainSignal: boolean;
  agencyPolishSignal: boolean;
  pagesScraped: string[];
}

export interface ScoredLead extends DiscoveredBusiness {
  source_url: string | null;
  fit_score: number;
  fit_reason: string;
  visible_promo_signal: string;
  website_issue_summary: string;
  suggested_angle: string;
  suggested_message: string;
  signals_json: WebsiteSignals | null;
  status: LeadStatus;
}

/* ───────────────────────────── Google Places search ───────────────────────────── */

interface PlacesTextSearchResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

interface PlacesTextSearchResponse {
  results?: PlacesTextSearchResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

interface PlaceDetailsResponse {
  result?: {
    formatted_phone_number?: string;
    website?: string;
    url?: string;
  };
  status: string;
  error_message?: string;
}

function getPlacesApiKey(): string | null {
  const key = (process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY ?? "").trim();
  return key || null;
}

function splitCityState(formattedAddress: string | undefined, fallbackState: string): { city: string | null; state: string | null } {
  if (!formattedAddress) return { city: null, state: fallbackState || null };
  // Typical Google formatted_address: "123 Main St, Pittsburgh, PA 15222, USA"
  const parts = formattedAddress.split(",").map((p) => p.trim());
  const city = parts.length >= 3 ? parts[parts.length - 3] : parts.length >= 2 ? parts[0] : null;
  const stateZip = parts.length >= 2 ? parts[parts.length - 2] : "";
  const stateMatch = stateZip.match(/^([A-Za-z]{2})\b/);
  return { city, state: stateMatch?.[1]?.toUpperCase() ?? fallbackState ?? null };
}

/**
 * Search Google Places (Text Search) for businesses, then fetch Place
 * Details for phone/website on each result. Respects maxResults (caps the
 * number of Details calls). Does not paginate beyond one page in the MVP.
 */
export async function searchBusinesses(params: {
  state: string;
  city?: string;
  category: PromoCategory;
  maxResults?: number;
  minRating?: number;
  hasWebsite?: boolean;
}): Promise<{ ok: boolean; error?: string; results: DiscoveredBusiness[] }> {
  const apiKey = getPlacesApiKey();
  if (!apiKey) {
    return { ok: false, error: "GOOGLE_PLACES_API_KEY (or GOOGLE_MAPS_API_KEY) is not configured.", results: [] };
  }

  const categoryMeta = PROMO_CATEGORIES.find((c) => c.value === params.category);
  if (!categoryMeta) {
    return { ok: false, error: `Unknown category: ${params.category}`, results: [] };
  }

  const maxResults = Math.max(1, Math.min(60, params.maxResults ?? 25));
  const locationQuery = params.city ? `${params.city}, ${params.state}` : params.state;
  const query = `${categoryMeta.placesQuery} in ${locationQuery}`;

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query);
  url.searchParams.set("key", apiKey);

  let res: Response;
  try {
    res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  } catch (e) {
    return { ok: false, error: `Network error: ${e instanceof Error ? e.message : String(e)}`, results: [] };
  }

  const data: PlacesTextSearchResponse = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return { ok: false, error: data.error_message ?? `Places API status: ${data.status}`, results: [] };
  }

  const rawResults = (data.results ?? []).slice(0, maxResults);

  const businesses: DiscoveredBusiness[] = [];
  for (const place of rawResults) {
    if (params.minRating && (place.rating ?? 0) < params.minRating) continue;

    const { city, state } = splitCityState(place.formatted_address, params.state);

    let phone: string | null = null;
    let website: string | null = null;
    let mapsUrl: string | null = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

    // One Details call per result to get phone + website (not returned by Text Search).
    try {
      const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      detailsUrl.searchParams.set("place_id", place.place_id);
      detailsUrl.searchParams.set("fields", "formatted_phone_number,website,url");
      detailsUrl.searchParams.set("key", apiKey);
      const detailsRes = await fetch(detailsUrl.toString(), { headers: { Accept: "application/json" } });
      const details: PlaceDetailsResponse = await detailsRes.json();
      if (details.status === "OK" && details.result) {
        phone = details.result.formatted_phone_number ?? null;
        website = details.result.website ?? null;
        mapsUrl = details.result.url ?? mapsUrl;
      }
    } catch {
      // Details lookup is best-effort; keep going without phone/website.
    }

    if (params.hasWebsite === true && !website) continue;
    if (params.hasWebsite === false && website) continue;

    businesses.push({
      place_id: place.place_id,
      business_name: place.name,
      category: categoryMeta.label,
      city,
      state,
      address: place.formatted_address ?? null,
      phone,
      website,
      google_maps_url: mapsUrl,
      rating: place.rating ?? null,
      review_count: place.user_ratings_total ?? null,
    });
  }

  return { ok: true, results: businesses };
}

/* ───────────────────────────── Firecrawl scraping ───────────────────────────── */

interface FirecrawlScrapeResult {
  success?: boolean;
  data?: {
    markdown?: string;
    metadata?: { title?: string; description?: string; sourceURL?: string };
  };
}

const SIGNAL_PATHS = ["", "/menu", "/events", "/specials", "/services", "/contact", "/about"];

const PROMO_KEYWORDS =
  /\b(special|specials|promo|promotion|promotions|offer|offers|deal|deals|happy hour|event|events|sale|discount|% off|grand opening|new menu|seasonal|limited time|book now|reserve now|class(es)?|package(s)?)\b/i;

const CTA_KEYWORDS = /\b(order now|book now|book a|reserve|reserve now|call now|call us|shop now|view menu|see menu|schedule|sign up|get started|contact us|learn more|buy now|order online)\b/i;

const CHAIN_KEYWORDS = /\b(franchise|locations nationwide|find a location near you|find a location|over \d{2,} locations|\d{3,}\+? locations)\b/i;

const OWNER_OPERATED_KEYWORDS = /\b(family[- ]owned|locally owned|owner[- ]operated|small business|est\.? \d{4}|founded in \d{4}|independently owned)\b/i;

const AGENCY_POLISH_KEYWORDS = /\b(branding by|designed by|web design by|creative agency|award[- ]winning design)\b/i;

async function scrapeOne(apiKey: string, url: string): Promise<{ markdown: string; meta: { title?: string; description?: string } } | null> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
    });
    if (!res.ok) return null;
    const data: FirecrawlScrapeResult = await res.json();
    if (!data.success || !data.data?.markdown) return null;
    return {
      markdown: data.data.markdown,
      meta: { title: data.data.metadata?.title, description: data.data.metadata?.description },
    };
  } catch {
    return null;
  }
}

function normalizeWebsite(raw: string): string {
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Scrape a business's public homepage + a handful of common public pages via
 * Firecrawl, and extract lightweight signals used for fit scoring. Respects
 * Firecrawl's own rate limits / robots.txt handling — this module does not
 * bypass anything. If FIRECRAWL_API_KEY is missing or the site can't be
 * reached, returns a "not scraped" signal set rather than throwing.
 */
export async function scrapeWebsiteSignals(websiteRaw: string): Promise<WebsiteSignals> {
  const empty: WebsiteSignals = {
    scraped: false,
    mentionsPromo: false,
    promoExcerpt: null,
    hasMenuOrServicesPage: false,
    hasSocialLinks: false,
    hasClearCta: false,
    weakMetaDescription: true,
    weakHeadline: true,
    oldCopyrightYear: null,
    outdatedLanguage: false,
    ownerOperatedSignal: false,
    chainSignal: false,
    agencyPolishSignal: false,
    pagesScraped: [],
  };

  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey || !websiteRaw) return empty;

  const base = normalizeWebsite(websiteRaw);
  let origin: string;
  try {
    origin = new URL(base).origin;
  } catch {
    return empty;
  }

  const scrapedMarkdowns: string[] = [];
  const pagesScraped: string[] = [];
  let title = "";
  let description = "";

  for (const path of SIGNAL_PATHS) {
    if (scrapedMarkdowns.length >= 5) break;
    const target = `${origin}${path}`;
    const page = await scrapeOne(apiKey, target);
    if (!page) continue;
    scrapedMarkdowns.push(page.markdown);
    pagesScraped.push(target);
    if (path === "") {
      title = page.meta.title ?? "";
      description = page.meta.description ?? "";
    }
  }

  if (scrapedMarkdowns.length === 0) return empty;

  const fullText = scrapedMarkdowns.join("\n\n");
  const promoMatch = fullText.match(PROMO_KEYWORDS);
  const currentYear = new Date().getFullYear();
  const copyrightMatch = fullText.match(/(?:©|\(c\)|copyright)\s*(\d{4})/i);
  const copyrightYear = copyrightMatch ? Number(copyrightMatch[1]) : null;

  const socialLinkMatch = /(facebook\.com|instagram\.com|tiktok\.com)\//i.test(fullText);
  const menuOrServicesScraped = pagesScraped.some((p) => /\/(menu|services)$/.test(p));

  return {
    scraped: true,
    mentionsPromo: !!promoMatch,
    promoExcerpt: promoMatch
      ? fullText
          .slice(Math.max(0, fullText.indexOf(promoMatch[0]) - 60), fullText.indexOf(promoMatch[0]) + 140)
          .replace(/\s+/g, " ")
          .trim()
      : null,
    hasMenuOrServicesPage: menuOrServicesScraped,
    hasSocialLinks: socialLinkMatch,
    hasClearCta: CTA_KEYWORDS.test(fullText),
    weakMetaDescription: !description || description.trim().length < 50,
    weakHeadline: !title || title.trim().length < 8,
    oldCopyrightYear: copyrightYear && copyrightYear < currentYear - 1 ? copyrightYear : null,
    // Heuristic only — short, sparse page text after scraping several pages
    // often indicates a stale/unmaintained site. Flagged for human review,
    // never asserted as fact in outreach copy.
    outdatedLanguage: fullText.replace(/\s+/g, " ").trim().length < 600,
    ownerOperatedSignal: OWNER_OPERATED_KEYWORDS.test(fullText),
    chainSignal: CHAIN_KEYWORDS.test(fullText),
    agencyPolishSignal: AGENCY_POLISH_KEYWORDS.test(fullText),
    pagesScraped,
  };
}

/* ───────────────────────────── Scoring ───────────────────────────── */

const FIT_CATEGORY_VALUES: PromoCategory[] = [
  "restaurant", "cafe", "bakery", "salon", "spa", "med_spa", "gym", "event_venue", "wedding_venue", "hotel", "local_service",
];

export function scoreLead(input: {
  business: DiscoveredBusiness;
  category: PromoCategory;
  signals: WebsiteSignals;
}): { score: number; reasons: string[] } {
  const { business, category, signals } = input;
  let score = 0;
  const reasons: string[] = [];

  if (signals.mentionsPromo) {
    score += 3;
    reasons.push("Site mentions specials/events/promos (+3)");
  }
  if (FIT_CATEGORY_VALUES.includes(category)) {
    score += 3;
    reasons.push("Category is a strong Promo Rescue fit (+3)");
  }
  if ((business.state ?? "").toUpperCase() === "PA") {
    score += 2;
    reasons.push("Located in Pennsylvania (+2)");
  }
  if (business.website || signals.hasSocialLinks) {
    score += 2;
    reasons.push("Has a website or social link (+2)");
  }
  if (signals.ownerOperatedSignal) {
    score += 2;
    reasons.push("Owner-operated/local-brand signal detected (+2)");
  }
  if (signals.scraped && (signals.outdatedLanguage || signals.oldCopyrightYear)) {
    score += 2;
    reasons.push("Website copy looks outdated or unclear (+2)");
  }
  if (signals.scraped && !signals.hasClearCta) {
    score += 2;
    reasons.push("No clear call-to-action found (+2)");
  }
  if (business.google_maps_url) {
    score += 2;
    reasons.push("Has a Google Business / local profile (+2)");
  }
  if ((business.rating ?? 0) > 4.0 && (business.review_count ?? 0) >= 10) {
    score += 1;
    reasons.push("Rating above 4.0 with enough reviews (+1)");
  }
  if (signals.chainSignal) {
    score -= 3;
    reasons.push("Looks like a corporate chain (-3)");
  }
  if (signals.agencyPolishSignal) {
    score -= 3;
    reasons.push("Website looks agency-polished already (-3)");
  }
  if (!business.website && !business.phone) {
    score -= 2;
    reasons.push("No website and no useful contact method (-2)");
  }
  if (signals.scraped && !signals.mentionsPromo) {
    score -= 2;
    reasons.push("No visible signs of active promotions (-2)");
  }
  if (!FIT_CATEGORY_VALUES.includes(category)) {
    score -= 2;
    reasons.push("Business type may be unrelated to visual/social promo needs (-2)");
  }

  return { score, reasons };
}

/* ───────────────────────────── Suggested outreach ───────────────────────────── */

export function buildSuggestedAngle(signals: WebsiteSignals): string {
  if (signals.promoExcerpt) return `They're already promoting something — turn it into a polished graphic: "${signals.promoExcerpt.slice(0, 90)}..."`;
  if (signals.outdatedLanguage || signals.oldCopyrightYear) return "Website looks stale — offer a quick, current promo refresh.";
  if (!signals.hasClearCta) return "No clear call-to-action on the site — a clean promo graphic with a CTA could help.";
  return "General creative refresh — one polished promo to post this week.";
}

export function buildWebsiteIssueSummary(signals: WebsiteSignals): string {
  if (!signals.scraped) return "Website not scraped (no website on file, or Firecrawl unavailable).";
  const issues: string[] = [];
  if (signals.oldCopyrightYear) issues.push(`copyright year shows ${signals.oldCopyrightYear}`);
  if (signals.outdatedLanguage) issues.push("thin/likely outdated page content");
  if (signals.weakMetaDescription) issues.push("weak or missing meta description");
  if (signals.weakHeadline) issues.push("weak or missing page title/headline");
  if (!signals.hasClearCta) issues.push("no clear call-to-action found");
  if (!signals.hasSocialLinks) issues.push("no social links found");
  return issues.length ? issues.join("; ") : "No notable issues detected from the public site read.";
}

export function buildSuggestedMessage(input: { businessName: string; signals: WebsiteSignals }): string {
  const specific = input.signals.promoExcerpt
    ? input.signals.promoExcerpt.replace(/\s+/g, " ").trim().slice(0, 80)
    : "something coming up";
  return `Hey — quick one. I saw ${input.businessName} has ${specific} and I'm doing a limited $59.99 Promo Rescue for PA small businesses. I can turn one promo into a cleaner feed graphic, story version, caption, and Google/Facebook post version within 24 hours. Thought it might be useful if you have something coming up.`;
}

export function scoreAndDraftLead(input: {
  business: DiscoveredBusiness;
  category: PromoCategory;
  signals: WebsiteSignals;
}): ScoredLead {
  const { business, signals } = input;
  const { score, reasons } = scoreLead(input);

  return {
    ...business,
    source_url: business.website ?? business.google_maps_url ?? null,
    fit_score: score,
    fit_reason: reasons.join("; "),
    visible_promo_signal: signals.promoExcerpt ?? (signals.mentionsPromo ? "Promo language detected on site." : "None detected from public site read."),
    website_issue_summary: buildWebsiteIssueSummary(signals),
    suggested_angle: buildSuggestedAngle(signals),
    suggested_message: buildSuggestedMessage({ businessName: business.business_name, signals }),
    signals_json: signals,
    status: "new",
  };
}
