"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { OwnerAuthGuard } from "@/components/OwnerAuthGuard";

// Public marketing routes: render full-bleed, NO sidebar, NO auth guard.
const PUBLIC_ROUTES = ["/", "/contact"];
// Auth routes: full-bleed, no sidebar, no guard (these ARE the login flow).
const AUTH_ROUTES = ["/login", "/auth/callback"];
// Public prefixes (e.g. email unsubscribe links).
const PUBLIC_PREFIXES = ["/unsubscribe"];

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
