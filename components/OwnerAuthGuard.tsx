"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Client-side owner-only guard for the private CRM. Checks the Supabase session
 * (stored client-side by supabase-js). Only the configured owner account is
 * allowed in normal environments.
 *
 * Localhost-only development fallback: if Supabase is missing or malformed,
 * allow the private UI to render so design work can continue locally. This does
 * not apply to production or preview hostnames.
 */
export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authed" | "denied">("loading");

  useEffect(() => {
    let active = true;
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (isLocalhost && !isSupabaseConfigured) {
      setStatus("authed");
      return () => {
        active = false;
      };
    }

    async function evaluate() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;
      if (!active) return;

      if (data.session && isOwnerEmail(email)) {
        setStatus("authed");
        return;
      }
      if (data.session && !isOwnerEmail(email)) {
        await supabase.auth.signOut();
        if (!active) return;
        setStatus("denied");
        router.replace("/login?error=private");
        return;
      }
      setStatus("denied");
      router.replace("/login");
    }

    void evaluate();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void evaluate();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (status === "authed") return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
