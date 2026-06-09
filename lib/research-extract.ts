// lib/research-extract.ts
// Pure extraction helpers — no Supabase, no fetch calls.
// Operates on raw markdown/text scraped from pages.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExtractedEmail {
  email: string;
  /** classification/verification state stored on contact_candidates.email_status */
  email_status:
    | "direct_email_public"
    | "generic_role_email"
    | "contact_form"
    | "linkedin_only"
    | "needs_email"
    | "needs_manual_review"
    | "verified"
    | "unverified"
    | "risky"
    | "invalid";
  /** Recommended outreach channel given this email type */
  recommended_channel: "email" | "generic_email" | "contact_form" | "linkedin" | "needs_manual_research";
  recommended_action:
    | "create_email_draft"
    | "create_linkedin_draft"
    | "create_contact_form_task"
    | "verify_with_hunter"
    | "manual_review"
    | "skip";
}

export interface ExtractedPerson {
  name: string;
  title: string;
  email?: string;
  linkedin_url?: string;
  source_excerpt: string;
  confidence_score: number;
  recommended_channel: ExtractedEmail["recommended_channel"];
  recommended_action: ExtractedEmail["recommended_action"];
}

export interface PageIntelligence {
  property_count_estimate: number | null;
  property_names: string[];
  locations: string[];
  amenities: string[];
  contact_form_urls: string[];
  emails: ExtractedEmail[];
  phone_numbers: string[];
  persons: ExtractedPerson[];
  company_type_hint: string | null;
}

// ─── Email classification ─────────────────────────────────────────────────────

const NO_REPLY_PREFIXES = ["no-reply", "noreply", "donotreply", "do-not-reply", "notifications", "bounce", "mailer-daemon"];
const ROLE_PREFIXES = [
  "info", "hello", "hi", "hey", "contact", "enquiries", "enquiry", "inquiries",
  "inquiry", "general", "admin", "office", "support", "help", "team",
];
const MARKETING_PREFIXES = [
  "marketing", "sales", "events", "weddings", "meetings", "groups", "catering",
  "reservations", "reservations", "booking", "bookings", "media", "pr", "press",
  "partnerships", "commercial", "revenue", "digital",
];
const DIRECT_PERSON_PATTERN = /^[a-z][a-z0-9._%+'-]*\.[a-z][a-z0-9._%+'-]*@/i;

export function classifyEmail(email: string): ExtractedEmail {
  const local = email.split("@")[0].toLowerCase();

  if (NO_REPLY_PREFIXES.some((p) => local === p || local.startsWith(p))) {
    return { email, email_status: "needs_manual_review", recommended_channel: "needs_manual_research", recommended_action: "manual_review" };
  }
  if (MARKETING_PREFIXES.some((p) => local === p || local.startsWith(p))) {
    return { email, email_status: "generic_role_email", recommended_channel: "generic_email", recommended_action: "verify_with_hunter" };
  }
  if (ROLE_PREFIXES.some((p) => local === p || local.startsWith(p))) {
    return { email, email_status: "generic_role_email", recommended_channel: "generic_email", recommended_action: "verify_with_hunter" };
  }
  if (DIRECT_PERSON_PATTERN.test(email)) {
    return { email, email_status: "direct_email_public", recommended_channel: "email", recommended_action: "verify_with_hunter" };
  }
  return { email, email_status: "generic_role_email", recommended_channel: "generic_email", recommended_action: "verify_with_hunter" };
}

// ─── Email extraction ─────────────────────────────────────────────────────────

const EMAIL_RE = /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g;
const SKIP_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".pdf", ".css", ".js"];

export function extractEmails(text: string): ExtractedEmail[] {
  const found = new Set<string>();
  const results: ExtractedEmail[] = [];
  for (const match of text.matchAll(EMAIL_RE)) {
    const email = match[1].toLowerCase();
    if (found.has(email)) continue;
    if (SKIP_EXTENSIONS.some((ext) => email.endsWith(ext))) continue;
    if (email.length > 100) continue;
    found.add(email);
    results.push(classifyEmail(email));
  }
  return results;
}

// ─── Phone extraction ─────────────────────────────────────────────────────────

const PHONE_RE = /(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

export function extractPhones(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(PHONE_RE)) {
    const cleaned = match[0].replace(/\s+/g, " ").trim();
    found.add(cleaned);
  }
  return [...found].slice(0, 10);
}

const LOCATION_RE = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\b/g;

export function extractLocations(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(LOCATION_RE)) {
    found.add(`${match[1]}, ${match[2]}`);
  }
  return [...found].slice(0, 25);
}

// ─── Contact form URL extraction ──────────────────────────────────────────────

const CONTACT_FORM_PATTERNS = [/contact/i, /reach-us/i, /reach_us/i, /get-in-touch/i, /getintouch/i, /request/i, /inquiry/i, /enquiry/i, /submit/i];
const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;
const BARE_URL_RE = /https?:\/\/[^\s"'<>]+/g;

export function extractContactFormUrls(text: string, baseUrl: string): string[] {
  const base = (() => { try { return new URL(baseUrl); } catch { return null; } })();
  const found = new Set<string>();

  const check = (href: string) => {
    if (!href.startsWith("http")) {
      if (base && href.startsWith("/")) href = `${base.origin}${href}`;
      else return;
    }
    try { new URL(href); } catch { return; }
    if (CONTACT_FORM_PATTERNS.some((p) => p.test(href))) found.add(href);
  };

  for (const m of text.matchAll(MD_LINK_RE)) check(m[2]);
  for (const m of text.matchAll(BARE_URL_RE)) check(m[0]);
  return [...found].slice(0, 5);
}

// ─── Person / leadership extraction ──────────────────────────────────────────

// Buyer-title scoring (0–100). Higher = stronger hotel decision-maker.
export function scorePersonTitle(title: string): number {
  const t = title.toLowerCase();
  if (["vp marketing", "vp of marketing", "vice president of marketing", "vp sales & marketing", "vp sales and marketing", "corporate director of marketing", "director of marketing", "director of sales and marketing", "director of sales & marketing", "cmo", "chief marketing officer"].some((x) => t.includes(x))) return 95;
  if (["vp commercial", "vice president commercial", "commercial strategy", "chief commercial"].some((x) => t.includes(x))) return 92;
  if (["director digital", "director ecommerce", "director of digital", "director of ecommerce"].some((x) => t.includes(x))) return 88;
  if (["director of revenue", "director of commercial", "commercial director", "revenue strategy", "regional director", "area director"].some((x) => t.includes(x))) return 84;
  if (["vp sales", "vp of sales", "vice president sales", "director of sales"].some((x) => t.includes(x))) return 80;
  if (["general manager", " gm", "owner", "founder", "president", "ceo", "coo", "principal", "managing director"].some((x) => t.includes(x))) return 75;
  // Department heads relevant to hospitality creative.
  if (["director of f&b", "director of food", "food & beverage director", "f&b director", "director of events", "events director", "director of catering", "catering director", "spa director", "wellness director", "director of spa", "director of wellness"].some((x) => t.includes(x))) return 70;
  // Influencers / doers.
  if (["marketing manager", "social media manager", "social media", "content manager", "brand manager", "digital marketing"].some((x) => t.includes(x))) return 60;
  if (t.includes("director")) return 50;
  return 0;
}

function isBadTitle(title: string): boolean {
  const t = title.toLowerCase();
  return ["human resources", "recruit", "talent acquisition", "student", "intern", "engineer", "developer", "legal", "finance", "accounts payable", "accounting", "procurement", "maintenance", "housekeeping", "front desk", "concierge"].some((x) => t.includes(x));
}

const PERSON_LINKEDIN_RE = /https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/(?:in|pub)\/[A-Za-z0-9\-_%.]+/i;
const PERSON_EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const NAME_TOKEN = "[A-Z][a-z]+(?:\\s+(?:[A-Z]\\.|[A-Z][a-z'’.-]+)){1,3}";

// Strip markdown so names/titles parse cleanly; keep link text, drop the URL.
function cleanLine(s: string): string {
  return (s ?? "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#~]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Extract named people + titles from a scraped (markdown) page. Handles the
 * common team/leadership layouts: "Name | Title", "Name, Title", "Title: Name",
 * a heading name with the title on the next line, and a title line with the name
 * on an adjacent line. Captures a nearby LinkedIn URL / email when present.
 * Only keeps recognizable hotel buyer titles.
 */
export function extractPersons(text: string, pageUrl: string): ExtractedPerson[] {
  void pageUrl;
  const out: ExtractedPerson[] = [];
  const seen = new Set<string>();
  // Split on single newlines so blank lines remain as natural separators
  // between team-card blocks (prevents one person's link/email bleeding to the next).
  const raw = text.split(/\n/);
  const lines = raw.map(cleanLine);

  // A LinkedIn URL / email is attached to at most ONE person (claimed once),
  // and only when it sits on the same line or an immediately adjacent line.
  const claimedLinkedIn = new Set<string>();
  const claimedEmail = new Set<string>();
  const nearby = (i: number, re: RegExp, claimed: Set<string>): string | undefined => {
    // Search the person's own block (name/title/link usually within 2 lines).
    // Blank-line separators + the claimed-once guard keep this from bleeding
    // a link/email onto the wrong person.
    for (let j = Math.max(0, i - 1); j <= Math.min(raw.length - 1, i + 2); j++) {
      const m = (raw[j] ?? "").match(re);
      if (m && !claimed.has(m[0].toLowerCase())) {
        claimed.add(m[0].toLowerCase());
        return m[0];
      }
    }
    return undefined;
  };

  const add = (name: string, title: string, excerpt: string, linkedin?: string, email?: string) => {
    const n = name.trim();
    const parts = n.split(/\s+/);
    if (!n || parts.length < 2 || parts.length > 4) return;
    if (seen.has(n.toLowerCase())) return;
    const cleanTitle = title.trim().slice(0, 90);
    const score = scorePersonTitle(cleanTitle);
    if (score <= 0 || isBadTitle(cleanTitle)) return;
    seen.add(n.toLowerCase());
    out.push({
      name: n,
      title: cleanTitle,
      email,
      linkedin_url: linkedin,
      source_excerpt: excerpt.slice(0, 220),
      confidence_score: score,
      recommended_channel: email ? "email" : linkedin ? "linkedin" : "needs_manual_research",
      recommended_action: email ? "create_email_draft" : linkedin ? "create_linkedin_draft" : "manual_review",
    });
  };

  const nameTitleRe = new RegExp(`^(${NAME_TOKEN})\\s*[|,\\-–—:]\\s*(.{4,90})$`);
  const titleNameRe = new RegExp(`^(.{4,90}?)\\s*[:|\\-–]\\s*(${NAME_TOKEN})$`);
  const nameOnlyRe = new RegExp(`^(${NAME_TOKEN})$`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // A) "Name | Title" / "Name, Title" / "Name - Title"
    let m = line.match(nameTitleRe);
    if (m && scorePersonTitle(m[2]) > 0) {
      add(m[1], m[2], line, nearby(i, PERSON_LINKEDIN_RE, claimedLinkedIn), nearby(i, PERSON_EMAIL_RE, claimedEmail));
      continue;
    }

    // B) "Title: Name"
    m = line.match(titleNameRe);
    if (m && scorePersonTitle(m[1]) > 0) {
      add(m[2], m[1], line, nearby(i, PERSON_LINKEDIN_RE, claimedLinkedIn), nearby(i, PERSON_EMAIL_RE, claimedEmail));
      continue;
    }

    // C) A title line with a name on an adjacent line.
    if (scorePersonTitle(line) > 0) {
      for (const k of [i - 1, i + 1, i - 2, i + 2]) {
        const cand = lines[k];
        if (cand && nameOnlyRe.test(cand)) {
          add(cand, line, `${cand} — ${line}`, nearby(i, PERSON_LINKEDIN_RE, claimedLinkedIn), nearby(i, PERSON_EMAIL_RE, claimedEmail));
          break;
        }
      }
      continue;
    }

    // D) A name line with the title on the next line.
    if (nameOnlyRe.test(line)) {
      const next = lines[i + 1];
      if (next && scorePersonTitle(next) > 0) {
        add(line, next, `${line} — ${next}`, nearby(i, PERSON_LINKEDIN_RE, claimedLinkedIn), nearby(i, PERSON_EMAIL_RE, claimedEmail));
      }
    }
  }

  return out.slice(0, 25);
}

// ─── Property / amenity extraction ───────────────────────────────────────────

const PROPERTY_NAME_RE = /(?:hotel|inn|resort|suites|lodge|retreat|spa|club|manor|house)\b[^.\n]{0,40}/gi;
const AMENITY_KEYWORDS: Record<string, string> = {
  restaurant: "restaurant", bar: "bar", "f&b": "f&b", "food & beverage": "f&b",
  spa: "spa", wellness: "wellness", fitness: "fitness",
  "meeting room": "meetings", conference: "meetings", boardroom: "meetings",
  event: "events", wedding: "weddings", banquet: "banquet",
  rooftop: "rooftop", pool: "pool",
};
const COUNT_RE = /\b(\d{1,3})\s+(?:hotel|property|properties|resort|location|destination)s?\b/gi;

export function extractPropertyIntel(text: string): {
  property_count_estimate: number | null;
  property_names: string[];
  amenities: string[];
} {
  // Property count
  let best_count: number | null = null;
  for (const m of text.matchAll(COUNT_RE)) {
    const n = parseInt(m[1], 10);
    if (n > 0 && n < 1000 && (best_count === null || n > best_count)) best_count = n;
  }

  // Property names
  const nameSet = new Set<string>();
  for (const m of text.matchAll(PROPERTY_NAME_RE)) {
    const name = m[0].trim().slice(0, 60);
    if (name.split(" ").length >= 2) nameSet.add(name);
  }

  // Amenities
  const amenitySet = new Set<string>();
  const lower = text.toLowerCase();
  for (const [kw, label] of Object.entries(AMENITY_KEYWORDS)) {
    if (lower.includes(kw)) amenitySet.add(label);
  }

  return {
    property_count_estimate: best_count,
    property_names: [...nameSet].slice(0, 30),
    amenities: [...amenitySet],
  };
}

// ─── Company type inference ───────────────────────────────────────────────────

export function inferCompanyType(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("management company") || t.includes("hotel management")) return "hotel_management_company";
  if (t.includes("boutique") || t.includes("lifestyle")) return "boutique_hotel_group";
  if (t.includes("resort") && (t.includes("portfolio") || t.includes("collection"))) return "resort_group";
  if (t.includes("hospitality group") || t.includes("portfolio")) return "hospitality_group";
  if (t.includes("independent")) return "independent_lifestyle_hotel";
  return null;
}

// ─── Fit scoring ──────────────────────────────────────────────────────────────

export function scoreCompanyFit(intel: {
  property_count_estimate: number | null;
  company_type: string | null;
  amenities: string[];
}): number {
  let score = 0;
  const { property_count_estimate: count, company_type: type, amenities } = intel;

  if (type === "hotel_management_company") score += 5;
  else if (type === "boutique_hotel_group" || type === "resort_group") score += 4;
  else if (type === "hospitality_group") score += 3;

  if (count !== null) {
    if (count >= 10) score += 5;
    else if (count >= 3) score += 3;
    else if (count === 1) score -= 5;
  }

  if (amenities.includes("restaurant") || amenities.includes("bar") || amenities.includes("f&b")) score += 4;
  if (amenities.includes("meetings") || amenities.includes("events") || amenities.includes("weddings")) score += 3;
  if (amenities.includes("spa") || amenities.includes("wellness")) score += 3;

  return Math.max(0, Math.min(15, score));
}

// ─── Personalization generation ───────────────────────────────────────────────

export function generatePersonalization(intel: {
  company_type: string | null;
  property_count_estimate: number | null;
  amenities: string[];
  property_names: string[];
}): { personalization_angle: string; specific_use_cases: string } {
  const parts: string[] = [];
  const uses: string[] = [];

  if (intel.company_type === "hotel_management_company") parts.push("multi-property hotel management company");
  else if (intel.company_type === "boutique_hotel_group") parts.push("boutique hotel group");
  else if (intel.company_type === "resort_group") parts.push("resort group");
  else if (intel.company_type === "hospitality_group") parts.push("hospitality group");

  if (intel.property_count_estimate && intel.property_count_estimate > 1) {
    parts.push(`manages ${intel.property_count_estimate}+ properties`);
  }

  if (intel.amenities.includes("restaurant") || intel.amenities.includes("f&b")) {
    parts.push("with F&B");
    uses.push("restaurant & bar content", "F&B campaigns");
  }
  if (intel.amenities.includes("meetings") || intel.amenities.includes("events")) {
    parts.push("events & meetings focus");
    uses.push("meetings & events marketing", "group sales materials");
  }
  if (intel.amenities.includes("weddings")) {
    uses.push("wedding marketing content");
  }
  if (intel.amenities.includes("spa") || intel.amenities.includes("wellness")) {
    uses.push("spa & wellness content");
  }

  if (uses.length === 0) uses.push("social media content", "paid campaigns", "brand creative");

  return {
    personalization_angle: parts.length ? parts.join(", ") : "hospitality company",
    specific_use_cases: uses.join(", "),
  };
}
