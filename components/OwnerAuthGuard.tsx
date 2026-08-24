"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

/**
 * Client-side owner-only guard for the private CRM. Checks the Supabase session
 * (stored client-side by supabase-js). Only the configured owner email is
 * allowed; anyone else is signed out and sent to /login.
 *
 * The requested path is preserved in ?next= so a successful magic-link or
 * password login returns to the page the owner originally asked for (for
 * example /client-accounts instead of always landing on /dashboard).
 */
export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const [status, setStatus] = useState<"loading" | "authed" | "denied">("loading");

  useEffect(() => {
    let active = true;

    const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;
    const privateLoginUrl = `/login?error=private&next=${encodeURIComponent(pathname)}`;

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
        router.replace(privateLoginUrl);
        return;
      }
      setStatus("denied");
      router.replace(loginUrl);
    }

    evaluate();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      evaluate();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (status === "authed") return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
