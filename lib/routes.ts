// ─────────────────────────────────────────────────────────────────────────────
// routes.ts — the single source of truth for which routes are public, which
// belong to the owner CRM, and which belong to the client portal.
//
// This used to live only inside components/AppChrome.tsx, which meant the
// browser was the only thing that knew a route was private. middleware.ts now
// enforces the same lists server-side, so the two can never disagree: if you
// add a page, you add it here once.
//
// IMPORTANT: this module is imported by middleware.ts and therefore runs on the
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

/**
 * Owner-only pages rendered without the CRM sidebar, so they read as a
 * client-facing experience while still being owner-gated.
 */
export const OWNER_FULL_BLEED_PREFIXES = ["/client-preview"] as const;

export function isAuthRoute(pathname: string): boolean {
  return (AUTH_ROUTES as readonly string[]).includes(pathname);
}

export function isPublicRoute(pathname: string): boolean {
  if ((PUBLIC_ROUTES as readonly string[]).includes(pathname)) return true;
  if (isAuthRoute(pathname)) return true;
  return (PUBLIC_PREFIXES as readonly string[]).some((p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}?`));
}

export function isPortalRoute(pathname: string): boolean {
  return pathname === PORTAL_PREFIX || pathname.startsWith(`${PORTAL_PREFIX}/`);
}

/** Owner-only, but rendered full-bleed so it reads as the client experience. */
export function isOwnerFullBleed(pathname: string): boolean {
  return (OWNER_FULL_BLEED_PREFIXES as readonly string[]).some((p) => pathname.startsWith(p));
}

/** Anything not public and not the client portal is owner-only CRM. */
export function isOwnerRoute(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isPortalRoute(pathname);
}
