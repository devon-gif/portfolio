"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Client-side owner-only guard for the private CRM. Checks the Supabase session
 * (stored client-side by supabase-js). Only devonavich0@gmail.com is allowed;
 * anyone else is signed out and sent to /login. Suitable for a local/private,
 * single-user CRM. (For a public deployment, add @supabase/ssr + middleware and
 * tighten RLS — see README.)
 */
export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authed" | "denied">("loading");

  useEffect(() => {
    let active = true;

    async function evaluate() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;
      if (!active) return;

      if (data.session && isOwnerEmail(email)) {
        setStatus("authed");
        return;
      }
      if (data.session && !isOwnerEmail(email)) {
        // Wrong account — sign out and bounce to login.
        await supabase.auth.signOut();
        if (!active) return;
        setStatus("denied");
        router.replace("/login?error=private");
        return;
      }
      setStatus("denied");
      router.replace("/login");
    }

    evaluate();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      evaluate();
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
