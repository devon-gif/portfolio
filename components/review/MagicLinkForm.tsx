"use client";

import { useState, type CSSProperties } from "react";
import { Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { isReviewSupabaseConfigured } from "@/lib/review";

/**
 * Shared "send me a magic link" form used by both /emma (client) and the
 * admin sign-in prompt on /review/admin. Deliberately does not confirm or
 * deny whether the typed email has an account — every submission (existing
 * profile or not) gets the same calm confirmation message, and only a real
 * review_profiles + membership row (created by the service-role invite
 * script — see scripts/seed-review-portal.ts) actually grants entry once the
 * link is clicked and /auth/callback resolves the session.
 */
export function MagicLinkForm({
  redirectPath,
  accent = "client",
}: {
  redirectPath: string;
  accent?: "client" | "admin";
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isReviewSupabaseConfigured();

  async function sendLink() {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (!configured) {
      setError("Supabase isn't configured in this environment yet. See the project README for setup steps.");
      return;
    }
    setBusy(true);
    try {
      const { error: sendError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}` },
      });
      // Deliberately show the same calm confirmation regardless of whether
      // Supabase reports an error here (e.g. rate limiting) vs success, so
      // the response never hints at whether the address has an account.
      if (sendError) {
        console.error("signInWithOtp error:", sendError.message);
      }
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  const buttonStyle =
    accent === "admin"
      ? { background: "linear-gradient(150deg, #3a322b, #2b241f 70%)", color: "#f6f0e4" }
      : { background: "linear-gradient(150deg, #cda85c, #a9812f 70%)", color: "#2b2114" };

  const glass: CSSProperties = {
    background: "rgba(255, 252, 247, 0.62)",
    backdropFilter: "blur(28px) saturate(135%)",
    WebkitBackdropFilter: "blur(28px) saturate(135%)",
    border: "1px solid rgba(255, 255, 255, 0.7)",
    boxShadow: "0 24px 70px rgba(79, 60, 47, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
  };

  if (sent) {
    return (
      <div className="rounded-2xl px-6 py-8 text-center" style={glass}>
        <p className="text-[15px] font-medium text-[#2b241f]">Check your email</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#6d6155]">
          If {email.trim()} has access to this workspace, a secure sign-in link is on its way. It may take a
          minute to arrive — the link expires after a short time, so request a new one if it doesn&apos;t work.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setEmail("");
          }}
          className="mt-5 text-[12.5px] font-medium text-[#8a6a24] underline underline-offset-2 hover:text-[#7c3338]"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[12.5px] font-medium text-[#6d6155]">
        Work email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendLink();
          }}
          placeholder="you@company.com"
          autoComplete="email"
          className="mt-1.5 w-full rounded-lg border border-[#ddd3c4] bg-white/70 px-3.5 py-2.5 text-[14px] text-[#2b241f] outline-none focus:border-[#a9812f] focus:ring-2 focus:ring-[#a9812f]/15"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-[#e6c48c] bg-[#f6f0e4] px-3 py-2 text-[13px] text-[#8a5a1f]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={sendLink}
        disabled={busy}
        style={buttonStyle}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-semibold shadow-[0_12px_28px_rgba(169,129,47,0.22)] transition hover:-translate-y-px disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        Send magic link
      </button>

      <p className="mt-4 text-center text-[11.5px] text-[#8a8071]">No passwords. We&apos;ll email you a one-time secure link.</p>
    </div>
  );
}
