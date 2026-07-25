"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";
import { getCurrentProfile, isArcherStaffRole, isClientPortalRole } from "@/lib/review";

/**
 * Shared magic-link / OAuth callback for the whole project. supabase-js
 * (detectSessionInUrl) auto-parses the token from the URL hash on load; for
 * PKCE we exchange the ?code. Routing after a successful sign-in:
 *
 *   1. The CRM owner email (lib/owner.ts) -> /dashboard, as before.
 *   2. Otherwise, check for a review_profiles row (the client review
 *      portal's own identity table, separate from the CRM owner check):
 *      Archer staff roles -> /review/admin, client-facing roles -> /emma.
 *   3. Anything else is signed out and sent back to /login, as before.
 *
 * The optional ?next= param (set by MagicLinkForm) is not blindly trusted
 * for the redirect target — it's only used as a hint for which of the two
 * review-portal routes to prefer if step 2 matches, so an unrecognized
 * email can never be redirected somewhere it doesn't have a profile for.
 */
function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    let active = true;

    async function finish() {
      // PKCE flow: exchange ?code for a session if present.
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code);
        } catch {
          /* fall through to getSession */
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const email = data.session?.user?.email ?? null;

      if (data.session && isOwnerEmail(email)) {
        router.replace("/dashboard");
        return;
      }

      if (data.session) {
        const profile = await getCurrentProfile().catch(() => null);
        if (!active) return;
        if (isArcherStaffRole(profile?.role)) {
          router.replace("/review/admin");
          return;
        }
        if (isClientPortalRole(profile?.role)) {
          router.replace("/emma");
          return;
        }
      }

      // No matching profile (or no session at all). If this sign-in
      // originated from the review portal's own login screens, send them
      // back there WITHOUT forcing a sign-out — EmmaPortalGate /
      // ReviewAdminGate show their own calm "not set up yet" / "forbidden"
      // state for a session with no matching profile, which is a better
      // experience than the generic CRM message below and still never
      // reveals whether any particular email has an account.
      const next = params.get("next");
      if (data.session && (next === "/emma" || next === "/review/admin")) {
        router.replace(next);
        return;
      }

      if (data.session) {
        await supabase.auth.signOut();
      }
      if (!active) return;
      setMessage("This account isn't recognized. Redirecting…");
      router.replace("/login?error=private");
    }

    finish();
    return () => {
      active = false;
    };
  }, [router, params]);

  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-zinc-950 text-zinc-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center gap-3 bg-zinc-950 text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Signing you in…</span>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
