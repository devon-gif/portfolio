"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "private" ? "This CRM is private." : null
  );
  const [notice, setNotice] = useState<string | null>(null);

  // If already signed in as the owner, skip the login page and return to the
  // originally requested CRM route.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session && isOwnerEmail(data.session.user?.email)) {
        router.replace(nextPath);
      }
    });
    return () => {
      active = false;
    };
  }, [nextPath, router]);

  function guardOwner(): boolean {
    if (!isOwnerEmail(email)) {
      setError("This CRM is private.");
      setNotice(null);
      return false;
    }
    return true;
  }

  async function sendMagicLink() {
    setError(null);
    setNotice(null);
    if (!guardOwner()) return;
    setBusy(true);
    try {
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", nextPath);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: callback.toString(),
          shouldCreateUser: false,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      setNotice("Check your email for a secure login link. It will return you to this local page.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithPassword() {
    setError(null);
    setNotice(null);
    if (!guardOwner()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (!isOwnerEmail(data.user?.email)) {
        await supabase.auth.signOut();
        setError("This CRM is private.");
        return;
      }
      router.replace(nextPath);
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
            <p className="text-[11px] text-zinc-500">Private CRM, owner access only.</p>
          </div>
        </div>

        <label className="text-xs text-zinc-500">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 ${inputCls}`}
            autoComplete="email"
          />
        </label>

        {mode === "password" && (
          <label className="mt-3 block text-xs text-zinc-500">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 ${inputCls}`}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") void signInWithPassword();
              }}
            />
          </label>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {notice}
          </p>
        )}

        {mode === "magic" ? (
          <button
            type="button"
            onClick={() => void sendMagicLink()}
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send magic link
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void signInWithPassword()}
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Sign in
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "magic" ? "password" : "magic"));
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center text-xs text-zinc-500 hover:text-zinc-300"
        >
          {mode === "magic" ? "Use password instead" : "Use a magic link instead"}
        </button>

        <p className="mt-5 text-center text-[11px] text-zinc-600">
          Access is limited to the owner account.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
