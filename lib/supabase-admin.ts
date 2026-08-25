// Server-only Supabase client using the service-role key.
// NEVER import this into a client component — it bypasses RLS.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isAdminConfigured = !!url && !!serviceKey;

let _admin: SupabaseClient | null = null;

/** Returns the privileged client, or throws if it isn't configured. */
export function getAdminClient(): SupabaseClient {
  if (!isAdminConfigured) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!_admin) {
    _admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _admin;
}
