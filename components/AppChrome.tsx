"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OwnerAuthGuard } from "@/components/OwnerAuthGuard";

// Public marketing routes render full-bleed with no CRM sidebar or owner auth.
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
  "/revstudio",
  "/coraltree",
];

const AUTH_ROUTES = ["/login", "/auth/callback"];

// Prefixes cover public portals, personalized proposal pages, and the
// shareable Archer Design self-serve checkout flow at /start.
const PUBLIC_PREFIXES = [
  "/unsubscribe",
  "/social-media-work",
  "/review",
  "/start",
  "/topline",
  "/george",
  "/emma",
  "/vision",
  "/tcrm",
  "/oxford",
  "/first-hospitality",
  "/pyramid",
  "/bridgetown",
  "/hotel-commercial-growth",
  "/grant-hospitality",
  "/jacaruso",
  "/clientconcierge",
  "/commercial-growth",
  "/rebel",
  "/devon",
  "/dns",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isPublic(pathname)) return <>{children}</>;

  return (
    <OwnerAuthGuard>
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <main className="ml-56 min-h-screen flex-1 overflow-auto">{children}</main>
      </div>
    </OwnerAuthGuard>
  );
}
