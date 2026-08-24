"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { isOwnerEmail } from "@/lib/owner";

export function OwnerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/dashboard";
  const [status, setStatus] = useState<"loading" | "authed" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const client = getSupabaseClient();
    const loginUrl = `/login?next=${encodeURIComponent(pathname)}`;
    const privateLoginUrl = `/login?error=private&next=${encodeURIComponent(pathname)}`;

    if (!client) {
      setError("Supabase is not configured in this local environment.");
      setStatus("error");
      return () => {
        active = false;
      };
    }

    async function checkSession() {
      try {
        const { data, error: sessionError } = await client.auth.getSession();
        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
          setStatus("error");
          return;
        }

        const email = data.session?.user?.email ?? null;
        if (data.session && isOwnerEmail(email)) {
          setStatus("authed");
          return;
        }

        if (data.session && !isOwnerEmail(email)) {
          await client.auth.signOut();
          if (!active) return;
          router.replace(privateLoginUrl);
          return;
        }

        router.replace(loginUrl);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not verify your login session.");
        setStatus("error");
      }
    }

    void checkSession();

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const email = session?.user?.email ?? null;
      if (session && isOwnerEmail(email)) {
        setStatus("authed");
      } else if (!session) {
        router.replace(loginUrl);
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (status === "authed") return <>{children}</>;

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-amber-500/20 bg-zinc-900/70 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h1 className="text-sm font-semibold">Could not verify your login</h1>
              <p className="mt-1 text-sm text-zinc-400">{error}</p>
              <button
                type="button"
                onClick={() => router.replace(`/login?next=${encodeURIComponent(pathname)}`)}
                className="mt-4 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-zinc-950"
              >
                Go to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-5 w-5 animate-spin" /> Checking login…
      </div>
    </div>
  );
}
