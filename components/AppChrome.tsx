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
  "/auto",
];

// Auth routes: full-bleed, no sidebar, no guard (these ARE the login flow).
const AUTH_ROUTES = ["/login", "/auth/callback"];

// Public shells that provide their own access controls. /review and /emma
// render full-bleed, but their contents are protected by ReviewAdminGate /
// EmmaPortalGate and Supabase RLS rather than the private CRM owner guard.
const PUBLIC_PREFIXES = [
  "/unsubscribe",
  "/social-media-work",
  "/review",
  "/topline",
  "/emma",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
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
        <main className="ml-56 min-h-screen flex-1 overflow-auto">{children}</main>
      </div>
    </OwnerAuthGuard>
  );
}
