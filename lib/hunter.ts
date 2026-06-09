// lib/hunter.ts
// Server-only helper for Hunter API manual enrichment flows.

export interface HunterEmail {
  value?: string;
  type?: string;
  confidence?: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  linkedin?: string;
  sources?: Array<{ uri?: string; extracted_on?: string }>;
}

export interface HunterDomainSearchData {
  domain?: string;
  organization?: string;
  emails?: HunterEmail[];
}

export interface HunterEmailFinderData {
  email?: string;
  score?: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  linkedin_url?: string;
}

export interface HunterEmailVerifierData {
  result?: string;
  status?: string;
  score?: number;
  regexp?: boolean;
  gibberish?: boolean;
  disposable?: boolean;
  webmail?: boolean;
  mx_records?: boolean;
  smtp_server?: boolean;
  smtp_check?: boolean;
  accept_all?: boolean;
  block?: boolean;
}

function key(): string | null {
  const k = process.env.HUNTER_API_KEY?.trim();
  return k ? k : null;
}

export function isHunterConfigured(): boolean {
  return !!key();
}

async function hunterGet<T>(path: string, params: Record<string, string>): Promise<{ ok: boolean; status: number; data?: T; error?: string; raw?: unknown }> {
  const apiKey = key();
  if (!apiKey) return { ok: false, status: 400, error: "HUNTER_API_KEY is not configured." };

  const url = new URL(`https://api.hunter.io/v2/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("api_key", apiKey);

  let res: Response;
  try {
    res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  } catch (e) {
    return { ok: false, status: 502, error: e instanceof Error ? e.message : String(e) };
  }

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return { ok: false, status: res.status, error: `Invalid Hunter response (HTTP ${res.status})` };
  }

  const anyRaw = raw as { data?: T; errors?: Array<{ details?: string; id?: string }>; message?: string };
  if (!res.ok) {
    const msg = anyRaw.errors?.[0]?.details ?? anyRaw.message ?? `Hunter error (HTTP ${res.status})`;
    return { ok: false, status: res.status, error: msg, raw };
  }

  return { ok: true, status: res.status, data: anyRaw.data, raw };
}

export async function hunterDomainSearch(domain: string) {
  return hunterGet<HunterDomainSearchData>("domain-search", { domain, limit: "10" });
}

export async function hunterEmailFinder(domain: string, firstName: string, lastName: string) {
  return hunterGet<HunterEmailFinderData>("email-finder", {
    domain,
    first_name: firstName,
    last_name: lastName,
  });
}

export async function hunterEmailVerifier(email: string) {
  return hunterGet<HunterEmailVerifierData>("email-verifier", { email });
}

export function mapHunterVerifierStatus(status?: string): "verified" | "unverified" | "risky" | "invalid" {
  const s = (status ?? "").toLowerCase();
  if (s === "valid") return "verified";
  if (s === "invalid") return "invalid";
  if (s === "accept_all" || s === "webmail" || s === "unknown") return "risky";
  return "unverified";
}
