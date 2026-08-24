"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Client sign-in — email + password.
 *
 * Deliberately NOT a magic link. The existing review portal used
 * signInWithOtp exclusively and swallowed the send error, so when Supabase hit
 * its email rate limit the client saw "Check your email" for a message that was
 * never sent, with nothing surfaced to Archer either. Passwords have no send
 * quota and fail loudly.
 *
 * New clients are provisioned by the owner, who sets an initial password and
 * shares it; the client can change it from their account settings. There is no
 * public sign-up: a password alone grants nothing without a review_memberships
 * row, and RLS returns no data without one.
 */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/portal";
  if (value.startsWith("/portal/login")) return "/portal";
  // A client must never be redirected into the CRM.
  if (!value.startsWith("/portal")) return "/portal";
  return value;
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = useMemo(() => safeNext(params.get("next")), [params]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const client = getSupabaseClient();
    if (!client) {
      setError("This workspace isn't connected right now. Please try again shortly.");
      return;
    }

    setBusy(true);
    const { error: signInError } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setBusy(false);
      // Deliberately generic: never reveal whether an account exists.
      setError("That email and password don't match. Please try again.");
      return;
    }

    // Full refresh so the server re-reads the new session cookie.
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <div className="ap-shell">
      <div style={{ maxWidth: 460, margin: "0 auto", paddingTop: "12vh", paddingBottom: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <span className="ap-brand-name" style={{ fontSize: 24 }}>
            Archer Design
          </span>
          <div className="ap-brand-sub" style={{ marginTop: 6 }}>
            Client Portal
          </div>
        </div>

        <form className="ap-card" onSubmit={submit}>
          <h1 className="ap-section-title" style={{ marginBottom: 8 }}>
            Sign in
          </h1>
          <p className="ap-muted" style={{ marginBottom: 22 }}>
            Use the email address Archer set your workspace up with.
          </p>

          <label className="ap-label" htmlFor="portal-email">
            Email
          </label>
          <input
            id="portal-email"
            type="email"
            autoComplete="email"
            required
            className="ap-input"
            style={{ marginTop: 8, marginBottom: 16 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourhotel.com"
          />

          <label className="ap-label" htmlFor="portal-password">
            Password
          </label>
          <input
            id="portal-password"
            type="password"
            autoComplete="current-password"
            required
            className="ap-input"
            style={{ marginTop: 8 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "var(--ap-changes)", fontSize: 13, marginTop: 14, marginBottom: 0 }} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="ap-btn ap-btn--primary" style={{ width: "100%", marginTop: 22 }} disabled={busy}>
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <KeyRound size={15} aria-hidden="true" />}
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p className="ap-muted" style={{ fontSize: 12, marginTop: 18, marginBottom: 0, textAlign: "center" }}>
            Trouble signing in? Contact Devon at Archer Design and he&apos;ll get you back in.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
