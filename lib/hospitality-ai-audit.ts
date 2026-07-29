import dns from "node:dns/promises";
import net from "node:net";

export type AuditResult = {
  score_total: number;
  score_band: string;
  confidence: "low" | "medium" | "high";
  summary: string;
  what_ai_saw: string[];
  strongest_gaps: string[];
  quick_wins: string[];
  category_scores: {
    visual_consistency: number;
    photo_quality: number;
    fb_event_visibility: number;
    meetings_weddings_groups: number;
    local_seasonal_campaigns: number;
    cta_clarity: number;
    social_visibility: number;
    local_seo_content: number;
    tracking_reporting_confidence: number;
    creative_bandwidth_risk: number;
  };
  questions_to_confirm: string[];
  recommended_next_step: string;
};

export type ExtractedWebsite = {
  normalizedUrl: string;
  normalizedDomain: string;
  sourceUrls: string[];
  title: string;
  meta: string;
  text: string;
  links: string[];
  socialLinks: Record<string, string[]>;
};

const RELEVANT_PATH_HINTS = [
  "dining",
  "restaurant",
  "bar",
  "events",
  "meetings",
  "weddings",
  "groups",
  "spa",
  "amenities",
  "offers",
  "local",
  "area",
];

export function normalizeWebsiteUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Website is required.");

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const url = new URL(withProtocol);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Website must use http or https.");
  }

  url.hash = "";
  return url.toString();
}

function isPrivateIPv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;

  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    a === 0
  );
}

function isBlockedHostname(hostname: string) {
  const h = hostname.toLowerCase();
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h === "0.0.0.0" ||
    h === "127.0.0.1" ||
    h === "169.254.169.254"
  );
}

async function assertPublicUrl(urlString: string) {
  const url = new URL(urlString);

  if (isBlockedHostname(url.hostname)) {
    throw new Error("This website address is not allowed.");
  }

  const directIpVersion = net.isIP(url.hostname);
  if (directIpVersion === 4 && isPrivateIPv4(url.hostname)) {
    throw new Error("Private IP addresses are not allowed.");
  }

  if (!directIpVersion) {
    const records = await dns.lookup(url.hostname, { all: true });
    for (const record of records) {
      if (net.isIP(record.address) === 4 && isPrivateIPv4(record.address)) {
        throw new Error("This website resolves to a private IP address.");
      }
    }
  }
}

async function fetchHtml(url: string, timeoutMs = 9000): Promise<string> {
  await assertPublicUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "ArcherDesignAIWebsiteAudit/1.0 (+https://www.archerdesign.shop)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`Website returned ${res.status}.`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error("Website did not return HTML.");
    }

    const text = await res.text();
    return text.slice(0, 400_000);
  } finally {
    clearTimeout(timeout);
  }
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function matchFirst(html: string, regex: RegExp) {
  const match = html.match(regex);
  return match?.[1]?.trim() || "";
}

function extractLinks(html: string, baseUrl: string) {
  const links: string[] = [];
  const regex = /href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html))) {
    const href = match[1];
    try {
      const url = new URL(href, baseUrl);
      if (url.protocol === "http:" || url.protocol === "https:") {
        url.hash = "";
        links.push(url.toString());
      }
    } catch {
      // ignore malformed links
    }
  }

  return Array.from(new Set(links)).slice(0, 120);
}

function extractSocialLinks(links: string[]) {
  const social: Record<string, string[]> = {};

  for (const link of links) {
    const lower = link.toLowerCase();
    const key = lower.includes("facebook.com")
      ? "facebook"
      : lower.includes("instagram.com")
        ? "instagram"
        : lower.includes("linkedin.com")
          ? "linkedin"
          : lower.includes("tiktok.com")
            ? "tiktok"
            : lower.includes("youtube.com") || lower.includes("youtu.be")
              ? "youtube"
              : "";

    if (key) {
      social[key] ||= [];
      social[key].push(link);
    }
  }

  return social;
}

function pickRelevantInternalLinks(links: string[], baseUrl: string) {
  const base = new URL(baseUrl);
  return links
    .filter((link) => {
      try {
        const url = new URL(link);
        if (url.hostname !== base.hostname) return false;
        const path = url.pathname.toLowerCase();
        return RELEVANT_PATH_HINTS.some((hint) => path.includes(hint));
      } catch {
        return false;
      }
    })
    .slice(0, 2);
}

export async function extractWebsiteForAudit(rawWebsite: string): Promise<ExtractedWebsite> {
  const normalizedUrl = normalizeWebsiteUrl(rawWebsite);
  const url = new URL(normalizedUrl);
  const normalizedDomain = url.hostname.replace(/^www\./, "");

  let html = "";

  try {
    html = await fetchHtml(normalizedUrl);
  } catch (error: any) {
    const message = String(error?.message || "");

    const blocked =
      message.includes("403") ||
      message.includes("401") ||
      message.toLowerCase().includes("forbidden") ||
      message.toLowerCase().includes("blocked");

    if (!blocked) {
      throw error;
    }

    return {
      normalizedUrl,
      normalizedDomain,
      sourceUrls: [normalizedUrl],
      title: "",
      meta: "",
      text: `
The public website scan was blocked by the hotel website server.

Website submitted:
${normalizedUrl}

Domain:
${normalizedDomain}

Important context:
This is a limited audit because the hotel website returned a blocked/forbidden response to the server-side scan. The AI should still give a useful preliminary read, but confidence must be low. Do not pretend the website content was fully reviewed. Focus on what should be checked manually for a hotel property or hotel group: visual consistency, social creative, F&B/event promotion, meeting/wedding visibility, local campaign support, Google Business Profile/local SEO content, CTA clarity, reporting, and property-level creative bandwidth.
      `.trim(),
      links: [],
      socialLinks: {},
    };
  }

  const title = matchFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const meta = matchFirst(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );

  const links = extractLinks(html, normalizedUrl);
  const relevantLinks = pickRelevantInternalLinks(links, normalizedUrl);

  const pageTexts = [stripHtml(html)];
  const sourceUrls = [normalizedUrl];

  for (const link of relevantLinks) {
    try {
      const extraHtml = await fetchHtml(link, 7000);
      pageTexts.push(stripHtml(extraHtml));
      sourceUrls.push(link);
    } catch {
      // ignore secondary page failures
    }
  }

  return {
    normalizedUrl,
    normalizedDomain,
    sourceUrls,
    title,
    meta,
    text: pageTexts.join("\n\n--- PAGE ---\n\n").slice(0, 15000),
    links,
    socialLinks: extractSocialLinks(links),
  };
}

const auditSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "score_total",
    "score_band",
    "confidence",
    "summary",
    "what_ai_saw",
    "strongest_gaps",
    "quick_wins",
    "category_scores",
    "questions_to_confirm",
    "recommended_next_step",
  ],
  properties: {
    score_total: { type: "number" },
    score_band: { type: "string" },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    what_ai_saw: { type: "array", items: { type: "string" } },
    strongest_gaps: { type: "array", items: { type: "string" } },
    quick_wins: { type: "array", items: { type: "string" } },
    category_scores: {
      type: "object",
      additionalProperties: false,
      required: [
        "visual_consistency",
        "photo_quality",
        "fb_event_visibility",
        "meetings_weddings_groups",
        "local_seasonal_campaigns",
        "cta_clarity",
        "social_visibility",
        "local_seo_content",
        "tracking_reporting_confidence",
        "creative_bandwidth_risk",
      ],
      properties: {
        visual_consistency: { type: "number" },
        photo_quality: { type: "number" },
        fb_event_visibility: { type: "number" },
        meetings_weddings_groups: { type: "number" },
        local_seasonal_campaigns: { type: "number" },
        cta_clarity: { type: "number" },
        social_visibility: { type: "number" },
        local_seo_content: { type: "number" },
        tracking_reporting_confidence: { type: "number" },
        creative_bandwidth_risk: { type: "number" },
      },
    },
    questions_to_confirm: { type: "array", items: { type: "string" } },
    recommended_next_step: { type: "string" },
  },
} as const;

function extractOutputText(responseJson: any) {
  if (typeof responseJson.output_text === "string") {
    return responseJson.output_text;
  }

  const chunks: string[] = [];
  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n");
}

export async function runHospitalityAudit(params: {
  website: ExtractedWebsite;
  company?: string;
  role?: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing.");

  const model = process.env.AI_AUDIT_MODEL || "gpt-5-nano";

  const userPrompt = `
Website URL:
${params.website.normalizedUrl}

Company / property:
${params.company || "Unknown"}

Submitter role:
${params.role || "Unknown"}

Page title:
${params.website.title}

Meta description:
${params.website.meta}

Social links:
${JSON.stringify(params.website.socialLinks, null, 2)}

Extracted public website text:
${params.website.text}

Score this as a preliminary public-website creative bandwidth read for a hotel/hospitality buyer.

Important:
- Do not claim to know internal team capacity.
- Do not claim bookings, revenue, ad spend, or private analytics.
- Use "appears", "may indicate", "public website read", and "needs confirmation" where appropriate.
- Be helpful, not insulting.
- Score out of 100.
`;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are analyzing a hotel, restaurant, spa, resort, or hospitality website for public-facing creative bandwidth signals. You are not doing a full business audit. Only use evidence visible in the provided website text. Do not claim to know internal team capacity, booking performance, ad spend, revenue, or private analytics. Return strict JSON only.",
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_output_tokens: 6000,
      reasoning: {
        effort: "minimal",
      },
      text: {
        format: {
          type: "json_schema",
          name: "hospitality_website_audit",
          schema: auditSchema,
          strict: true,
        },
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI audit failed: ${errorText}`);
  }

  const json = await res.json();

  if (json.status === "incomplete") {
    throw new Error(
      `OpenAI response incomplete: ${
        json.incomplete_details?.reason || "unknown_reason"
      }`
    );
  }

  const outputText = extractOutputText(json);

  if (!outputText) {
    console.error("OpenAI audit returned no output text.", {
      status: json.status,
      incomplete_reason: json.incomplete_details?.reason,
      model: json.model,
      usage: json.usage,
      output_item_types: Array.isArray(json.output)
        ? json.output.map((item: any) => item?.type)
        : undefined,
    });

    throw new Error("OpenAI returned no output text.");
  }

  const parsed = JSON.parse(outputText) as AuditResult;

  parsed.score_total = Math.max(0, Math.min(100, Math.round(parsed.score_total)));

  return {
    model,
    result: parsed,
  };
}

export function buildCalendlyUrl(params: {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  score?: number;
  scoreBand?: string;
  strongestGaps?: string[];
  recommendedNextStep?: string;
}) {
  const base = process.env.CALENDLY_CREATIVE_REVIEW_URL;
  if (!base) return "";

  const url = new URL(base);

  if (params.name) url.searchParams.set("name", params.name);
  if (params.email) url.searchParams.set("email", params.email);

  url.searchParams.set("a1", `${params.company || ""} — ${params.website || ""}`.trim());
  url.searchParams.set("a2", params.score ? `${params.score}/100` : "");
  url.searchParams.set("a3", params.scoreBand || "");
  url.searchParams.set("a4", (params.strongestGaps || []).join(", "));
  url.searchParams.set("a5", params.recommendedNextStep || "");

  return url.toString();
}
