// ─────────────────────────────────────────────────────────────────────────────
// auth/server.ts — server-side session and role resolution.
//
// Why this exists: before it, every auth decision in this app happened in the
// browser (components/OwnerAuthGuard.tsx, a useEffect reading localStorage).
// The server could not see a session at all, so no server component, route
// handler, or middleware could authorize anything — which is why the Stripe
// admin endpoints shipped with no auth check: there was nothing to check with.
//
// The browser client now stores its session in cookies (see lib/supabase.ts),
// so the same session is readable here. Everything in this module runs with the
// ANON key plus the user's cookies, which means RLS still applies exactly as it
// would in the browser. It is not a privilege escalation path — for that, use
// lib/supabase-admin.ts deliberately, and only after authorizing the caller.
// ─────────────────────────────────────────────────────────────────────────────
import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isOwnerEmail } from "@/lib/owner";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

export function hasServerSupabaseEnv(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * A Supabase client bound to the caller's cookies. RLS applies.
 *
 * Returns null when Supabase isn't configured, so callers fail closed rather
 * than throwing during a build or a prerender.
 */
export async function getServerSupabase(): Promise<SupabaseClient | null> {
  if (!hasServerSupabaseEnv()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Server Components cannot set cookies. Middleware refreshes the
        // session instead (see middleware.ts), so swallowing this is correct
        // rather than a silent bug.
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a Server Component — middleware handles refresh */
        }
      },
    },
  });
}

export type SessionUser = {
  id: string;
  email: string | null;
};

/**
 * The authenticated user, verified against Supabase.
 *
 * Uses getUser() rather than getSession(): getSession() only decodes the cookie
 * and trusts its contents, which is not safe on the server. getUser() validates
 * the token with the auth server.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

export type PortalRole = "owner" | "client" | "none";

export type AuthContext = {
  user: SessionUser | null;
  role: PortalRole;
  /** Organizations this user is a member of. Empty for the owner. */
  organizationIds: string[];
};

/**
 * Resolves who the caller is.
 *
 * Owner is decided by the allowlisted email in lib/owner.ts — unchanged, so the
 * existing owner login keeps working exactly as before. Client is decided by an
 * actual review_memberships row, never by anything in a URL.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const user = await getSessionUser();
  if (!user) return { user: null, role: "none", organizationIds: [] };

  if (isOwnerEmail(user.email)) {
    return { user, role: "owner", organizationIds: [] };
  }

  const supabase = await getServerSupabase();
  if (!supabase) return { user, role: "none", organizationIds: [] };

  // RLS on review_memberships is "your own row, or you are an admin", so this
  // returns only the caller's memberships even though the query is unfiltered.
  const { data, error } = await supabase.from("review_memberships").select("organization_id");
  if (error || !data || data.length === 0) {
    return { user, role: "none", organizationIds: [] };
  }

  return {
    user,
    role: "client",
    organizationIds: data.map((row) => row.organization_id as string),
  };
}

/** True when the caller is the owner. Use in route handlers before privileged work. */
export async function isOwnerRequest(): Promise<boolean> {
  const user = await getSessionUser();
  return isOwnerEmail(user?.email);
}
