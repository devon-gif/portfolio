"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Shared magic-link / OAuth callback for the whole project. supabase-js
 * (detectSessionInUrl) auto-parses the token from the URL hash on load; for
 * PKCE we exchange the ?code. Routing after a successful sign-in:
 *
 *   1. The CRM owner email (lib/owner.ts) -> /dashboard, as before.
 *   2. Otherwise, check for a review_profiles row (the client review
 *      portal's own identity table, separate from the CRM owner check):
 *      role "admin" -> /review/admin, role "client" -> /emma.
 *   3. Anything else is signed out and sent back to /login, as before.
 *
 * The optional ?next= param (set by MagicLinkForm) is accepted only for the
 * two known review routes. Their gates perform the role check before any
 * workspace renders, so a signed-in user cannot use this parameter to reach
 * a route or role they have not been granted.
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
      const next = params.get("next");
      const reviewNext = next === "/emma" || next === "/review/admin" ? next : null;

      // The review routes enforce their own role checks. Once the callback
      // has a durable session, send review sign-ins straight to the requested
      // gate instead of launching another profile request while the implicit
      // magic-link session is still settling.
      if (data.session && reviewNext) {
        router.replace(reviewNext);
        return;
      }

      if (data.session && isOwnerEmail(email)) {
        router.replace("/dashboard");
        return;
      }

      if (data.session) {
        const { data: profile } = await supabase
          .from("review_profiles")
          .select("role")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
        if (!active) return;
        if (profile?.role === "admin") {
          router.replace("/review/admin");
          return;
        }
        if (profile?.role === "client") {
          router.replace("/emma");
          return;
        }
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
