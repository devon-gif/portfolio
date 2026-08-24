import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Support both env naming patterns (NEXT_PUBLIC_* for client-exposed vars,
// plain SUPABASE_* as a fallback for server-only contexts/tooling).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function hasSupabaseEnv(): boolean {
  return Boolean(isValidHttpUrl(supabaseUrl) && supabaseAnonKey);
}

// Back-compat alias used throughout the app.
export const isSupabaseConfigured = hasSupabaseEnv();

let _client: SupabaseClient | null = null;

/**
 * Returns a configured Supabase client, or null if env vars are missing/invalid.
 *
 * Uses createBrowserClient from @supabase/ssr rather than the plain
 * createClient. Same API surface — every existing `supabase.from(...)` /
 * `supabase.auth...` call site is unaffected — but the session is persisted to
 * COOKIES instead of localStorage. That is what lets middleware.ts and
 * lib/auth/server.ts see the signed-in user at all; with localStorage the
 * server had no way to know anyone was logged in, which is the root cause of
 * this app having had no server-side route protection.
 *
 * One consequence worth knowing: existing localStorage sessions are not
 * migrated, so everyone signs in once more after this ships.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseEnv()) return null;
  if (!_client) {
    _client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

/** Returns a privileged (service-role) Supabase client, or null if not configured. */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!isValidHttpUrl(url) || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Back-compat `supabase` export. Many existing call sites do
// `supabase.from(...)` / `supabase.auth...` directly. To avoid touching every
// one of those imports, `supabase` is a lazy Proxy: it never constructs the
// real client (and therefore never throws) at module-load time, which is
// what made static prerendering / build fail when env vars were absent. The
// real client is only created the first time a property is actually accessed
// at runtime. If Supabase still isn't configured at that point, accessing it
// throws a clear error instead of a cryptic "supabaseUrl is required" during
// build. Code paths that already gate on `isSupabaseConfigured` before using
// `supabase` are unaffected.
// ─────────────────────────────────────────────────────────────────────────────
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) to a valid http(s) URL and set NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY)."
      );
    }
    return Reflect.get(client, prop, receiver);
  },
});
