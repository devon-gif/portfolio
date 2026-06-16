// AI website audit — SERVER ONLY. Never import into a client component.
// Fetches a public hospitality website, extracts visible content, and asks an
// AI model for a conservative, public-read-only creative bandwidth score.
//
// Safety: strict SSRF guard, http(s) only, text/html only, size + time caps,
// max 3 source pages, no recursive crawling. The AI prompt forbids claims about
// internal team capacity, bookings, revenue, or private analytics.
import { lookup } from "node:dns/promises";
import { normalizeUrl } from "@/lib/url";

export const AI_AUDIT_ENABLED = (process.env.AI_AUDIT_ENABLED ?? "true").toLowerCase() !== "false";
export const AI_AUDIT_MODEL = (process.env.AI_AUDIT_MODEL ?? "gpt-5-nano").trim();
export const AI_AUDIT_CACHE_DAYS = Number(process.env.AI_AUDIT_CACHE_DAYS ?? "7") || 7;

const FETCH_TIMEOUT_MS = 9000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 1_500_000; // ~1.5MB per page
const MAX_TOTAL_TEXT = 14_000; // cap extracted text sent to the AI
const INTERNAL_KEYWORDS = [
  "dining", "restaurant", "events", "meetings", "weddings", "groups",
  "spa", "amenities", "offers", "local",
];

export const AUDIT_CATEGORIES = [
  "visual_consistency", "photo_quality", "fb_event_visibility",
  "meetings_weddings_groups", "local_seasonal_campaigns", "cta_clarity",
  "social_visibility", "local_seo_content", "tracking_reporting_confidence",
  "creative_bandwidth_risk",
] as const;

export type AuditAiResult = {
  score_total: number;
  score_band: string;
  confidence: "low" | "medium" | "high";
  summary: string;
  what_ai_saw: string[];
  strongest_gaps: string[];
  quick_wins: string[];
  category_scores: Record<string, number>;
  questions_to_confirm: string[];
  recommended_next_step: string;
};

export type ExtractedSite = {
  normalizedUrl: string;
  domain: string;
  sourceUrls: string[];
  title: string;
  meta: string;
  text: string;
  socialLinks: string[];
};

/* --------------------------- SSRF protection --------------------------- */

function isPrivateIpv4(ip: string): boolean {
  const m = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 10) return true;
  if (a === 127) return true; // loopback
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true; // link-local + metadata 169.254.169.254
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast/reserved
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const v = ip.toLowerCase();
  return v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v === "::";
}

/** Throws if the URL is unsafe to fetch (SSRF). Resolves DNS and checks the IP. */
async function assertSafeUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Only http/https URLs are allowed.");
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".internal") ||
    host.endsWith(".local")
  ) {
    throw new Error("Blocked host.");
  }
  // If the host is an IP literal, check directly.
  if (isPrivateIpv4(host) || isPrivateIpv6(host)) throw new Error("Blocked private address.");
  // Otherwise resolve and check every returned address.
  try {
    const results = await lookup(host, { all: true });
    for (const r of results) {
      if (r.family === 4 && isPrivateIpv4(r.address)) throw new Error("Blocked private address.");
      if (r.family === 6 && isPrivateIpv6(r.address)) throw new Error("Blocked private address.");
    }
  } catch (e) {
    // DNS failure or a blocked address — fail closed.
    throw e instanceof Error ? e : new Error("DNS resolution failed.");
  }
  return u;
}

/* ------------------------------ Fetching ------------------------------ */

async function readCapped(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      chunks.push(value);
      if (total >= maxBytes) {
        try { await reader.cancel(); } catch { /* ignore */ }
        break;
      }
    }
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
}

/** Fetch one page safely with manual redirect handling + SSRF re-checks. */
async function fetchPageSafe(startUrl: string): Promise<{ finalUrl: string; html: string }> {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = await assertSafeUrl(current);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(u.toString(), {
        method: "GET",
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "User-Agent": "ArcherDesignAuditBot/1.0 (+creative bandwidth scan)", Accept: "text/html" },
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error("Redirect without location.");
      current = new URL(loc, u).toString();
      continue;
    }
    if (!res.ok) throw new Error(`Fetch failed (${res.status}).`);
    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    if (!ct.includes("text/html")) throw new Error("Not an HTML page.");
    const len = Number(res.headers.get("content-length") ?? "0");
    if (len && len > MAX_BYTES) throw new Error("Page too large.");
    const html = await readCapped(res, MAX_BYTES);
    return { finalUrl: u.toString(), html };
  }
  throw new Error("Too many redirects.");
}

/* ----------------------------- Extraction ----------------------------- */

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractOne(html: string, baseUrl: string) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const meta = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "").trim();
  const headings = Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)).map((m) => stripTags(m[1])).filter(Boolean);
  const ctas = Array.from(html.matchAll(/<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)).map((m) => stripTags(m[1])).filter((t) => t && t.length < 40);
  const hrefs = Array.from(html.matchAll(/href=["']([^"']+)["']/gi)).map((m) => m[1]);

  const social: string[] = [];
  const links: string[] = [];
  for (const h of hrefs) {
    let abs: string;
    try { abs = new URL(h, baseUrl).toString(); } catch { continue; }
    if (/(facebook|instagram|linkedin|twitter|x\.com|tiktok|youtube|pinterest)\./i.test(abs)) social.push(abs);
    else links.push(abs);
  }
  const body = stripTags(html);
  return { title, meta, headings, ctas, social: Array.from(new Set(social)).slice(0, 12), links, body };
}

function pickInternalPages(links: string[], origin: string): string[] {
  const picks: string[] = [];
  const seen = new Set<string>();
  for (const l of links) {
    let u: URL;
    try { u = new URL(l); } catch { continue; }
    if (u.origin !== origin) continue;
    const path = u.pathname.toLowerCase();
    if (path === "/" || seen.has(u.toString())) continue;
    if (INTERNAL_KEYWORDS.some((k) => path.includes(k))) {
      seen.add(u.toString());
      picks.push(u.toString());
    }
    if (picks.length >= 2) break;
  }
  return picks;
}

/** Full extraction across the homepage + up to 2 relevant internal pages. */
export async function extractSite(rawUrl: string): Promise<ExtractedSite> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const home = await fetchPageSafe(normalizedUrl);
  const origin = new URL(home.finalUrl).origin;
  const first = extractOne(home.html, home.finalUrl);

  const sourceUrls = [home.finalUrl];
  const social = new Set(first.social);
  const parts: string[] = [
    `# ${first.title}`,
    first.meta ? `Meta: ${first.meta}` : "",
    first.headings.length ? `Headings: ${first.headings.slice(0, 25).join(" | ")}` : "",
    first.ctas.length ? `CTAs: ${Array.from(new Set(first.ctas)).slice(0, 25).join(" | ")}` : "",
    first.body,
  ];

  for (const page of pickInternalPages(first.links, origin)) {
    try {
      const p = await fetchPageSafe(page);
      const ex = extractOne(p.html, p.finalUrl);
      sourceUrls.push(p.finalUrl);
      ex.social.forEach((s) => social.add(s));
      parts.push(`\n## ${ex.title || page}`, ex.headings.slice(0, 15).join(" | "), ex.body);
    } catch {
      // skip a failed internal page; the homepage is enough
    }
  }

  let text = parts.filter(Boolean).join("\n").replace(/\s+\n/g, "\n");
  if (text.length > MAX_TOTAL_TEXT) text = text.slice(0, MAX_TOTAL_TEXT);

  return {
    normalizedUrl: home.finalUrl,
    domain: origin.replace(/^https?:\/\//, ""),
    sourceUrls,
    title: first.title,
    meta: first.meta,
    text,
    socialLinks: Array.from(social),
  };
}

/* ------------------------------- AI call ------------------------------- */

const SYSTEM_PROMPT =
  "You are analyzing a hotel, restaurant, spa, resort, or hospitality website for public-facing creative bandwidth signals. You are not doing a full business audit. Only use evidence visible in the provided website text. Do not claim to know internal team capacity, booking performance, ad spend, revenue, or private analytics. Return strict JSON only.";

function buildUserPrompt(site: ExtractedSite, company: string): string {
  return [
    `Website URL: ${site.normalizedUrl}`,
    company ? `Company name: ${company}` : "",
    `Social links found: ${site.socialLinks.join(", ") || "none found"}`,
    ``,
    `SCORING RUBRIC:`,
    `- Score out of 100. Be conservative. This is a preliminary PUBLIC WEBSITE READ.`,
    `- Use language like "public website read", "preliminary", "appears", "may indicate".`,
    `- Penalize obvious public gaps: no F&B/event visibility, weak/unclear CTAs, stale content, poor local campaign clarity, no social links, unclear meetings/weddings/group content, low visual polish.`,
    `- If something cannot be determined from the public site, put it in questions_to_confirm and reflect uncertainty in confidence.`,
    `- Do not claim bookings, revenue, conversion, or internal bandwidth. Do not be insulting. Keep tone helpful and premium.`,
    `- score_band must be one of: "Critical Creative Gap" (0-35), "Stretched and Inconsistent" (36-60), "Strong Foundation, Missing Scale" (61-80), "Strong Creative System" (81-100).`,
    `- category_scores keys (each 0-10): ${AUDIT_CATEGORIES.join(", ")}.`,
    ``,
    `Return strict JSON with this exact shape:`,
    `{"score_total":number,"score_band":string,"confidence":"low"|"medium"|"high","summary":string,"what_ai_saw":string[],"strongest_gaps":string[],"quick_wins":string[],"category_scores":{${AUDIT_CATEGORIES.map((c) => `"${c}":number`).join(",")}},"questions_to_confirm":string[],"recommended_next_step":string}`,
    ``,
    `WEBSITE TEXT (truncated):`,
    site.text,
  ].filter(Boolean).join("\n");
}

function clampScore(n: unknown, max = 100): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(max, Math.round(v)));
}

function coerceResult(raw: unknown): AuditAiResult {
  const o = (raw ?? {}) as Record<string, unknown>;
  const arr = (x: unknown): string[] => Array.isArray(x) ? x.filter((s): s is string => typeof s === "string").slice(0, 8) : [];
  const cats: Record<string, number> = {};
  const rawCats = (o.category_scores ?? {}) as Record<string, unknown>;
  for (const c of AUDIT_CATEGORIES) cats[c] = clampScore(rawCats[c], 10);
  const conf = ["low", "medium", "high"].includes(String(o.confidence)) ? (o.confidence as "low" | "medium" | "high") : "low";
  return {
    score_total: clampScore(o.score_total),
    score_band: typeof o.score_band === "string" && o.score_band ? o.score_band : "Stretched and Inconsistent",
    confidence: conf,
    summary: typeof o.summary === "string" ? o.summary : "Preliminary public website read.",
    what_ai_saw: arr(o.what_ai_saw),
    strongest_gaps: arr(o.strongest_gaps),
    quick_wins: arr(o.quick_wins),
    category_scores: cats,
    questions_to_confirm: arr(o.questions_to_confirm),
    recommended_next_step: typeof o.recommended_next_step === "string" ? o.recommended_next_step : "Book a 3-Property Creative Gap Review to confirm the read.",
  };
}

/** Calls OpenAI for the audit. Throws on failure so the caller can fall back. */
export async function runAiAudit(site: ExtractedSite, company: string): Promise<AuditAiResult> {
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!key) throw new Error("OPENAI_API_KEY is not set.");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30_000);
  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: AI_AUDIT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(site, company) },
        ],
        response_format: { type: "json_object" },
      }),
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`AI request failed (${res.status}): ${errText.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI returned non-JSON content.");
  }
  return coerceResult(parsed);
}
