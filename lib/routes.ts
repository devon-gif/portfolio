// ─────────────────────────────────────────────────────────────────────────────
// routes.ts — the single source of truth for which routes are public, which
// belong to the owner CRM, and which belong to the client portal.
//
// This used to live only inside components/AppChrome.tsx, which meant the
// browser was the only thing that knew a route was private. proxy.ts now
// enforces the same lists server-side, so the two can never disagree: if you
// add a page, you add it here once.
//
// IMPORTANT: this module is imported by proxy.ts and therefore runs on the
// Edge runtime. Keep it free of Node APIs, React, and any Supabase import.
// ─────────────────────────────────────────────────────────────────────────────

/** Public marketing pages: no sidebar, no auth, indexable. */
export const PUBLIC_ROUTES = [
  "/",
  "/contact",
  "/packages",
  "/case-studies",
  "/hotel-social-media-management",
  "/hotel-video-marketing",
  "/hospitality-creative-support",
  "/hotel-restaurant-event-promos",
  "/hotel-marketing-cost-savings",
  "/hotel-creative-scorecard",
  "/hospitality-resource-vault",
  "/creative-gap-review",
  "/restaurant-creative-support",
  "/spa-salon-creative-support",
  "/hotel-creative-without-adding-headcount",
] as const;

/** Sign-in surfaces. Reachable signed-out by definition. */
export const AUTH_ROUTES = ["/login", "/auth/callback", "/portal/login", "/portal/set-password"] as const;

/**
 * Public by prefix. `/start` is the self-serve checkout and MUST stay
 * reachable by anonymous visitors — it is how new clients buy.
 */
export const PUBLIC_PREFIXES = ["/unsubscribe", "/start", "/terms/service"] as const;

/** The client-facing portal. Requires a session, but NOT an owner session. */
export const PORTAL_PREFIX = "/portal";

export function isAuthRoute(pathname: string): boolean {
  return (AUTH_ROUTES as readonly string[]).includes(pathname);
}

export function isPublicRoute(pathname: string): boolean {
  if ((PUBLIC_ROUTES as readonly string[]).includes(pathname)) return true;
  if (isAuthRoute(pathname)) return true;
  return (PUBLIC_PREFIXES as readonly string[]).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`)
  );
}

export function isPortalRoute(pathname: string): boolean {
  return pathname === PORTAL_PREFIX || pathname.startsWith(`${PORTAL_PREFIX}/`);
}

/**
 * Owner-only pages rendered without the CRM sidebar so Devon can inspect the
 * exact client-facing experience. The legacy /client-preview route remains
 * full-bleed while it redirects to the canonical nested preview route.
 */
export function isOwnerFullBleed(pathname: string): boolean {
  if (pathname.startsWith("/client-preview")) return true;
  return /^\/client-accounts\/[^/]+\/preview\/?$/.test(pathname);
}

/** Anything not public and not the client portal is owner-only CRM. */
export function isOwnerRoute(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isPortalRoute(pathname);
}
