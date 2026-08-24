import { createClient } from "@supabase/supabase-js";

/**
 * A privileged (service-role) Supabase client for server-side work.
 *
 * This used to fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY when no service key
 * was set, so a caller believing it held a privileged, RLS-bypassing client
 * silently got an RLS-bound anon one — nothing threw, it just returned zero
 * rows. The fallback is removed: with no real service-role key this returns
 * null and callers deal with it.
 *
 * Server-only. Never import from a client component.
 */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
