"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const [status, setStatus] = useState<"loading" | "authed" | "denied">("loading");

  useEffect(() => {
    let active = true;
    const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;
    const privateLoginUrl = `/login?error=private&next=${encodeURIComponent(pathname)}`;

    // Never leave the private shell spinning forever. If auth cannot resolve,
    // return to the password login page and preserve the requested route.
    const fallback = window.setTimeout(() => {
      if (!active) return;
      setStatus("denied");
      router.replace(loginUrl);
    }, 4000);

    async function evaluate() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;

        if (error) {
          window.clearTimeout(fallback);
          setStatus("denied");
          router.replace(loginUrl);
          return;
        }

        const email = data.session?.user?.email ?? null;
        if (data.session && isOwnerEmail(email)) {
          window.clearTimeout(fallback);
          setStatus("authed");
          return;
        }

        if (data.session && !isOwnerEmail(email)) {
          await supabase.auth.signOut();
          if (!active) return;
          window.clearTimeout(fallback);
          setStatus("denied");
          router.replace(privateLoginUrl);
          return;
        }

        window.clearTimeout(fallback);
        setStatus("denied");
        router.replace(loginUrl);
      } catch {
        if (!active) return;
        window.clearTimeout(fallback);
        setStatus("denied");
        router.replace(loginUrl);
      }
    }

    void evaluate();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void evaluate();
    });

    return () => {
      active = false;
      window.clearTimeout(fallback);
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (status === "authed") return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-5 w-5 animate-spin" /> Checking login…
      </div>
    </div>
  );
}
