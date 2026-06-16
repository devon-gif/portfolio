// Shared URL validation + normalization. Used by the scorecard form, the
// gap-review flow, and server routes so behavior stays consistent.

// Full email: requires a dot in the domain. bob@hilton.com ✓ / bob@hilton ✗
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(raw: string): boolean {
  return EMAIL_RE.test((raw || "").trim());
}

/** Prepend https:// when no scheme is present so the URL parser can read it. */
export function normalizeUrl(raw: string): string {
  const v = (raw || "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/** Accepts hilton.com, www.hilton.com, https://www.hilton.com. Empty = valid. */
export function isValidWebsite(raw: string): boolean {
  const v = (raw || "").trim();
  if (!v) return true; // optional
  try {
    const u = new URL(normalizeUrl(v));
    return /^[^\s.]+(\.[^\s.]+)+$/.test(u.hostname) && u.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Empty = valid. Otherwise must be a linkedin.com URL. */
export function isValidLinkedIn(raw: string): boolean {
  const v = (raw || "").trim();
  if (!v) return true; // optional
  try {
    const u = new URL(normalizeUrl(v));
    return u.hostname.toLowerCase().endsWith("linkedin.com");
  } catch {
    return false;
  }
}

/** Normalize a list of property links: trim, https-prefix, drop blanks. */
export function normalizeLinks(links: (string | null | undefined)[]): string[] {
  return links
    .map((l) => (l ? normalizeUrl(l) : ""))
    .filter((l) => l.length > 0);
}
