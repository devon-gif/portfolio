"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";
import { OWNER_EMAIL, isOwnerEmail } from "@/lib/owner";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/login") || value.startsWith("/auth/")) return "/dashboard";
  return value;
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = useMemo(() => safeNext(params.get("next")), [params]);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(
    params.get("error") === "private" ? "This CRM is private." : null
  );

  useEffect(() => {
    let active = true;
    const client = getSupabaseClient();

    if (!client) {
      setError("Supabase is not configured in this local environment.");
      setChecking(false);
      return () => {
        active = false;
      };
    }

    client.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError) {
          setError(sessionError.message);
          setChecking(false);
          return;
        }
        if (data.session && isOwnerEmail(data.session.user?.email)) {
          router.replace(nextPath);
          return;
        }
        setChecking(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not check your login session.");
        setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [nextPath, router]);

  async function signInWithPassword() {
    setError(null);
    if (!password) {
      setError("Enter your password.");
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setError("Supabase is not configured in this local environment.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: OWNER_EMAIL,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!isOwnerEmail(data.user?.email)) {
        await client.auth.signOut();
        setError("This CRM is private.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500/60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-zinc-950">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100">Hotel Pipeline OS</h1>
            <p className="text-[11px] text-zinc-500">Private CRM · owner access only</p>
          </div>
        </div>

        <label className="block text-xs text-zinc-500">
          Email
          <input
            type="email"
            value={OWNER_EMAIL}
            readOnly
            className={`mt-1 ${inputCls} cursor-not-allowed opacity-80`}
            autoComplete="username"
          />
        </label>

        <label className="mt-3 block text-xs text-zinc-500">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`mt-1 ${inputCls}`}
            autoComplete="current-password"
            autoFocus
            disabled={checking || busy}
            onKeyDown={(event) => {
              if (event.key === "Enter") void signInWithPassword();
            }}
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => void signInWithPassword()}
          disabled={checking || busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking || busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {checking ? "Checking session…" : busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-5 text-center text-[11px] leading-5 text-zinc-600">
          Password login does not send email and does not use Supabase magic-link email limits.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <LoginInner />
    </Suspense>
  );
}
