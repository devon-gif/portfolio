"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const [status, setStatus] = useState<"loading" | "authed">("loading");

  useEffect(() => {
    let active = true;
    const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;
    const privateLoginUrl = `/login?error=private&next=${encodeURIComponent(pathname)}`;

    const fallback = window.setTimeout(() => {
      if (active) router.replace(loginUrl);
    }, 4000);

    async function evaluate() {
      try {
        const client = getSupabaseClient();
        if (!client) {
          window.clearTimeout(fallback);
          if (active) router.replace(loginUrl);
          return;
        }

        const { data, error } = await client.auth.getSession();
        if (!active) return;

        if (error) {
          window.clearTimeout(fallback);
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
          await client.auth.signOut();
          if (!active) return;
          window.clearTimeout(fallback);
          router.replace(privateLoginUrl);
          return;
        }

        window.clearTimeout(fallback);
        router.replace(loginUrl);
      } catch {
        if (!active) return;
        window.clearTimeout(fallback);
        router.replace(loginUrl);
      }
    }

    void evaluate();

    const listenerClient = getSupabaseClient();
    const subscription = listenerClient
      ? listenerClient.auth.onAuthStateChange((_event, session) => {
          if (!active) return;
          const email = session?.user?.email ?? null;
          if (session && isOwnerEmail(email)) {
            window.clearTimeout(fallback);
            setStatus("authed");
          } else if (!session) {
            router.replace(loginUrl);
          }
        }).data.subscription
      : null;

    return () => {
      active = false;
      window.clearTimeout(fallback);
      subscription?.unsubscribe();
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
