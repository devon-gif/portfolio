// Archer Review — access configuration. No secrets here: just the two known
// people this first version of the portal is for, and a re-export of the
// project's existing "is Supabase configured" check.
import { hasSupabaseEnv } from "@/lib/supabase";

export const REVIEW_ADMIN_EMAIL = "heydevon@gmail.com";
export const REVIEW_ADMIN_NAME = "Devon Archer";

export const REVIEW_CLIENT_EMAIL = "estinson@valenciagroup.com";
export const REVIEW_CLIENT_NAME = "Emma Stinson";
export const REVIEW_CLIENT_ORGANIZATION = "Valencia Hotel Group";

/**
 * True once NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 * When false, the whole review portal runs on the local-only demo fallback
 * (localStorage + IndexedDB) instead of Supabase — see lib/review/index.ts.
 */
export function isReviewSupabaseConfigured(): boolean {
  return hasSupabaseEnv();
}

/**
 * Interview-only browser demo. The query string is intentionally explicit
 * and never grants access to Supabase: lib/review/index.ts routes every data
 * operation to the localStorage/IndexedDB demo backend while this is true.
 *
 * Remove ?demo=1 from the URL to return to the normal authenticated portal.
 */
export function isReviewDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("demo") === "1";
}

export function isReviewAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === REVIEW_ADMIN_EMAIL;
}

/**
 * True when this code is running as a built/deployed app (a real Vercel
 * production or preview deployment, or `next build && next start` anywhere)
 * rather than the local `next dev` server. Next.js sets NODE_ENV to
 * "production" for both of those cases and "development" only for `next
 * dev`, which makes it a reliable signal for "am I actually deployed."
 *
 * Used so the review portal can fail closed instead of silently falling
 * back to the local-only localStorage/IndexedDB demo when Supabase isn't
 * configured — that fallback exists purely so the portal keeps rendering
 * during local development with no Supabase project connected, and must
 * never be reachable in a real deployment.
 */
export function isReviewProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production";
}
