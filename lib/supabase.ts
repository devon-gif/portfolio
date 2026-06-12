import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  !!supabaseUrl &&
  supabaseUrl.trim() !== "" &&
  !!supabaseAnonKey &&
  supabaseAnonKey.trim() !== "";

/**
 * Supabase's createClient throws if the URL is empty.
 * During Vercel preview/prerender builds, env vars can be missing,
 * so use a harmless placeholder client and let pages check isSupabaseConfigured.
 */
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key",
);
