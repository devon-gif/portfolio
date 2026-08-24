// ─────────────────────────────────────────────────────────────────────────────
// proxy.ts — server-side route protection.
//
// Previously no such file existed: every private page was protected only by
// components/OwnerAuthGuard.tsx, a client-side useEffect. That meant the page's
// JS and RSC payload were served to anyone who asked, and nothing at all
// guarded the API routes. This runs before the response is produced.
//
// This file was middleware.ts until Next 16 renamed the convention to proxy.ts.
// It also refreshes the Supabase session cookie on every request, which is what
// keeps server components able to read the session at all.
//
// Note this is a UX and defence-in-depth boundary, not the only one. Row-level
// security in Postgres remains the real guarantee: a client's data is scoped by
// review_memberships regardless of what any route lets them load.
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isOwnerRoute, isPortalRoute, isPublicRoute } from "@/lib/routes";
import { isOwnerEmail } from "@/lib/owner";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (next && next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public pages and sign-in surfaces never require a session. Checked first so
  // an unconfigured or unreachable Supabase can never take the marketing site
  // or the /start checkout offline.
  if (isPublicRoute(pathname)) return NextResponse.next();

  // Without Supabase env there is no session to read. Fail OPEN only on
  // localhost, so local design work continues; fail CLOSED anywhere else.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const host = request.nextUrl.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (isLocal) return NextResponse.next();
    return redirectTo(request, "/login");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the token with the auth server rather than trusting the
  // cookie's contents, and refreshes it when needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPortalRoute(pathname)) {
    if (!user) return redirectTo(request, "/portal/login");
    // Membership is enforced by RLS and re-checked in the portal itself; the
    // owner is allowed through so "View as client" previews work.
    return response;
  }

  if (isOwnerRoute(pathname)) {
    if (!user) return redirectTo(request, "/login");
    if (!isOwnerEmail(user.email)) {
      // A signed-in client who wanders into the CRM goes to their own portal
      // rather than being told the CRM exists.
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, static assets, and /api.
     *
     * /api is deliberately excluded: a redirect is the wrong response to a
     * fetch. Those routes authorize individually and return 401 JSON — see
     * lib/api-auth.ts.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff|woff2|ttf|otf|css|js|txt|xml)$).*)",
  ],
};
