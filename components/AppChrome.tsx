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
// "/george" is The George private, personalized proposal microsite —
// same treatment as /topline: noindex, never linked from nav/sitemap/
// footer, direct URL only, treated as a prefix for the same reason.
// "/emma" is Emma Stinson's (Valencia Hotel Group) dedicated review-portal
// entry point — ships its own magic-link auth (EmmaPortalGate), never the
// CRM owner guard. Noindex, direct URL only, treated as a prefix for the
// same reason as /topline/george above.
// "/tcrm" is the Total Customized Revenue Management (TCRM Services)
// private, personalized proposal microsite — same treatment as /topline:
// noindex, never linked from nav/sitemap/footer, direct URL only, treated
// as a prefix so /tcrm/schedule is automatically public too.
// "/oxford" is the Oxford Hotels & Resorts private, personalized outreach
// page prepared for George Jordan — same treatment as /tcrm/topline/george:
// noindex, never linked from nav/sitemap/footer, direct URL only.
// "/first-hospitality" is the First Hospitality × Archer Design private
// partnership concept — same treatment: noindex, never linked from
// nav/sitemap/footer, direct URL only.
// "/pyramid" is the Pyramid Global Hospitality × Archer Design private
// creative-production concept — same treatment: noindex, never linked from
// nav/sitemap/footer, direct URL only.
// "/bridgetown" is the Bridgetown Revenue Management Solutions × Archer
// Design private, speculative partnership concept — same treatment:
// noindex, never linked from nav/sitemap/footer, direct URL only.
// "/hotel-commercial-growth" is the joint HSC × The RevStudio × Archer
// Design partner-review page — same treatment: noindex, never linked from
// nav/sitemap/footer, direct URL only, until all three partners approve.
// "/grant-hospitality" is the GRANT Hospitality × Archer Design private,
// speculative partnership concept — same treatment as /bridgetown:
// noindex, never linked from nav/sitemap/footer, direct URL only.
// "/jacaruso" is the Jacaruso Enterprises × Archer Design private,
// speculative partnership concept — same treatment as /bridgetown and
// /grant-hospitality: noindex, never linked from nav/sitemap/footer,
// direct URL only.
// "/clientconcierge" is the Client Concierge Sales Management Group
// (CCSMG) × Archer Design partnership concept — same treatment as
// /jacaruso: noindex, never linked from nav/sitemap/footer, direct URL
// only.
// "/commercial-growth" is a second, separate HSC × The Revstudio × Archer
// Design "Hotel Commercial Growth System" concept page — same treatment as
// /hotel-commercial-growth: noindex, never linked from nav/sitemap/footer,
// direct URL only, until approved. Distinct route, distinct files; does not
// touch /hotel-commercial-growth.
const PUBLIC_PREFIXES = ["/unsubscribe", "/social-media-work", "/review", "/topline", "/george", "/emma", "/vision", "/tcrm", "/oxford", "/first-hospitality", "/pyramid", "/bridgetown", "/hotel-commercial-growth", "/grant-hospitality", "/jacaruso", "/clientconcierge", "/commercial-growth"];

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
