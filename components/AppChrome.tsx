"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OwnerAuthGuard } from "@/components/OwnerAuthGuard";
import { isOwnerFullBleed, isPortalRoute, isPublicRoute } from "@/lib/routes";

// The route lists this file used to own now live in lib/routes.ts, so
// middleware.ts enforces server-side exactly what this renders client-side.
// Adding a page means editing one list, not two that silently drift apart.
//
// OwnerAuthGuard remains here for the signed-out flash and the redirect, but it
// is no longer the security boundary — middleware.ts is, and RLS is underneath
// that.

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (isPublicRoute(pathname)) return <>{children}</>;

  // The client portal has its own chrome and its own non-owner auth. It must
  // never be wrapped in OwnerAuthGuard, which would sign real clients out and
  // bounce them to the CRM login.
  if (isPortalRoute(pathname)) return <>{children}</>;

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
