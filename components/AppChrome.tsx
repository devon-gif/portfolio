"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OwnerAuthGuard } from "@/components/OwnerAuthGuard";

// Public marketing routes: render full-bleed, NO sidebar, NO auth guard.
const PUBLIC_ROUTES = [
  "/",
  "/hotel-groups",
  "/contact",
  "/packages",
  "/case-studies",
  "/work",
  "/hotels",
  "/restaurants",
  "/bars",
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
  "/promo-rescue",
  // Revstudio × Archer Design partnership landing page — early/unapproved,
  // noindex by default (see lib/revstudio.ts), but still needs to render
  // full-bleed like the other public marketing pages, not the CRM chrome.
  "/revstudio",
  // CoralTree Hospitality × Archer Design private sales proposal — noindex,
  // not linked from any nav, accessible only via direct URL, but still
  // needs to render full-bleed like the other marketing pages, not the
  // CRM sidebar/auth guard.
  "/coraltree",
  "/george",
];
// Auth routes: full-bleed, no sidebar, no guard (these ARE the login flow).
const AUTH_ROUTES = ["/login", "/auth/callback"];
// Public prefixes (e.g. email unsubscribe links).
// "/social-media-work" is a public marketing portfolio page (and any future
// child paths under it) — must render full-bleed with no Supabase/auth/
// sidebar, same as the other public marketing routes above.
// "/review" is the Archer Review client portal — it ships its own login and
// chrome, so it must render full-bleed with no CRM sidebar or owner guard.
// "/topline" is the Topline Revenue Management private, personalized
// proposal microsite — noindex, never linked from nav/sitemap/footer,
// direct URL only. Treated as a prefix (not an exact match) so nested
// routes such as /topline/schedule are automatically public too, without
// needing a matching entry added here every time a new proposal sub-page
// is created.
// "/oxford" is the Oxford Hotels & Resorts private concept microsite —
// noindex and direct-URL only, but intentionally accessible without the
// owner CRM login guard.
const PUBLIC_PREFIXES = [
  "/tcrm",
  "/unsubscribe",
  "/social-media-work",
  "/review",
  "/topline",
  "/oxford",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Chrome wrapper.
 *  - Public marketing + auth routes: full-bleed, no sidebar, no auth.
 *  - Every other (CRM) route: owner-only auth guard + Sidebar + main.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isPublic(pathname)) {
    return <>{children}</>;
  }

  return (
    <OwnerAuthGuard>
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-56 min-h-screen overflow-auto">{children}</main>
      </div>
    </OwnerAuthGuard>
  );
}
