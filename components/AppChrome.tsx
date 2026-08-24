"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OwnerAuthGuard } from "@/components/OwnerAuthGuard";

// Public marketing routes: render full-bleed, NO sidebar, NO auth guard.
const PUBLIC_ROUTES = [
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
];
const AUTH_ROUTES = ["/login", "/auth/callback"];
const PUBLIC_PREFIXES = ["/unsubscribe", "/start", "/terms/service"];

// Owner-only pages that should look exactly like a client-facing experience,
// without the internal CRM sidebar.
const OWNER_FULL_BLEED_PREFIXES = ["/client-preview"];

function isPublic(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

function isOwnerFullBleed(pathname: string): boolean {
  return OWNER_FULL_BLEED_PREFIXES.some((p) => pathname.startsWith(p));
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isPublic(pathname)) return <>{children}</>;

  if (isOwnerFullBleed(pathname)) {
    return <OwnerAuthGuard>{children}</OwnerAuthGuard>;
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
