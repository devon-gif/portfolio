"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/login") || value.startsWith("/auth/")) return "/dashboard";
  return value;
}

/**
 * Magic-link / OAuth callback. supabase-js (detectSessionInUrl) auto-parses the
 * token from the URL hash on load; for PKCE we exchange the ?code. We then
 * verify the owner email and return to the CRM route that initiated login.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    let active = true;

    async function finish() {
      const url = new URL(window.location.href);
      const nextPath = safeNext(url.searchParams.get("next"));
      const code = url.searchParams.get("code");
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code);
        } catch {
          // fall through to getSession; implicit magic-link flows are parsed by
          // supabase-js automatically from the URL hash.
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const email = data.session?.user?.email ?? null;

      if (data.session && isOwnerEmail(email)) {
        router.replace(nextPath);
        return;
      }
      if (data.session && !isOwnerEmail(email)) {
        await supabase.auth.signOut();
      }
      if (!active) return;
      setMessage("This CRM is private. Redirecting…");
      router.replace(`/login?error=private&next=${encodeURIComponent(nextPath)}`);
    }

    void finish();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center gap-3 bg-zinc-950 text-zinc-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
