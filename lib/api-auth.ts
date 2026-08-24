// ─────────────────────────────────────────────────────────────────────────────
// api-auth.ts — owner authorization for route handlers.
//
// Route handlers are excluded from middleware.ts on purpose: a redirect is the
// wrong answer to a fetch. They authorize here and return 401 JSON instead.
//
// Two credential sources are accepted, because the app uses both patterns:
//   1. The session cookie (any page doing a plain fetch), and
//   2. An `Authorization: Bearer <access_token>` header, which the existing
//      client-accounts pages already send after supabase.auth.getSession().
// Either proves the caller is the owner; neither can be forged without a valid
// Supabase token, since both are verified against the auth server.
//
// NOTE: this authorizes the CALLER. It does not make the handler safe on its
// own — a handler that then acts on a caller-supplied record id still has to
// mean to let the owner do that. For owner-only endpoints that is the point.
// ─────────────────────────────────────────────────────────────────────────────
import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSessionUser } from "@/lib/auth/server";
import { isOwnerEmail } from "@/lib/owner";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

async function ownerFromBearer(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return false;

  // Anon key + the caller's token: getUser() validates it server-side.
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return false;
  return isOwnerEmail(data.user.email);
}

/** True when the request carries a valid owner session, by cookie or bearer token. */
export async function isOwnerRequest(request: Request): Promise<boolean> {
  if (await ownerFromBearer(request)) return true;
  const user = await getSessionUser();
  return isOwnerEmail(user?.email);
}

/**
 * Guard for owner-only route handlers.
 *
 * Returns a 401 NextResponse to return immediately, or null to continue:
 *
 *   const denied = await requireOwner(request);
 *   if (denied) return denied;
 */
export async function requireOwner(request: Request): Promise<NextResponse | null> {
  if (await isOwnerRequest(request)) return null;
  return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
}
