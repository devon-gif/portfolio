"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  getCurrentProfile,
  isReviewProductionEnvironment,
  isReviewSupabaseConfigured,
  type ReviewProfile,
} from "@/lib/review";
import { MagicLinkForm } from "./MagicLinkForm";
import { ReviewConfigurationError } from "./ReviewConfigurationError";
import SimpleClientReview from "./SimpleClientReview";

type Status = "checking" | "signed-out" | "pending" | "wrong-role" | "approved" | "unconfigured";

const VALENCIA_LOGO_SRC = "/review/valencia-hotel-collection-logo.jpeg";

const PAGE_BG = "#fdfbf6";

const PAGE_BLOOM: CSSProperties = {
  background:
    "radial-gradient(circle at 78% 4%, rgba(169,129,47,0.14), transparent 34%), " +
    "radial-gradient(circle at 8% 92%, rgba(216,189,184,0.18), transparent 40%), " +
    "#fdfbf6",
};

const GLASS: CSSProperties = {
  background: "rgba(255, 252, 247, 0.68)",
  backdropFilter: "blur(28px) saturate(135%)",
  WebkitBackdropFilter: "blur(28px) saturate(135%)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  boxShadow: "0 24px 70px rgba(79, 60, 47, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.88)",
};

/**
 * Gate for /emma. In LOCAL DEVELOPMENT ONLY, unauthenticated visitors see
 * the polished magic-link login screen below even when Supabase isn't
 * configured yet (so this route is at least visually testable before a
 * real Supabase project is wired up). In a real deployment
 * (isReviewProductionEnvironment()) with Supabase still unconfigured, this
 * fails closed with a clear configuration error instead — a login screen
 * that can never actually complete a sign-in is a worse, more confusing
 * failure mode than telling the truth.
 *
 * Once a session exists, this checks for a review_profiles row with role
 * "client" — anything else (no profile yet, or an admin account landing
 * here by mistake) shows a calm "not yet set up" state rather than the
 * portal, and never reveals account existence to a signed-out visitor.
 */
export function EmmaPortalGate() {
  const [status, setStatus] = useState<Status>("checking");
  const [profile, setProfile] = useState<ReviewProfile | null>(null);
  const configured = isReviewSupabaseConfigured();

  useEffect(() => {
    let active = true;

    async function evaluate() {
      if (!configured) {
        if (isReviewProductionEnvironment()) {
          if (active) setStatus("unconfigured");
          return;
        }
        if (active) setStatus("signed-out");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session) {
        setStatus("signed-out");
        return;
      }

      const p = await getCurrentProfile();
      if (!active) return;

      if (!p) {
        setStatus("pending");
        return;
      }
      if (p.role !== "client") {
        setStatus("wrong-role");
        return;
      }
      setProfile(p);
      setStatus("approved");
    }

    void evaluate();

    if (!configured) return;
    // Keep the auth callback synchronous. Supabase may hold an internal auth
    // lock while this callback runs, so awaiting getSession/profile work here
    // can deadlock or race with session persistence. Run the access check on
    // the next task after the auth event has fully settled instead.
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        if (active) void evaluate();
      }, 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [configured]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-[#8a8071]" style={{ background: PAGE_BG }}>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (status === "approved" && profile) {
    return <SimpleClientReview />;
  }

  if (status === "unconfigured") {
    return <ReviewConfigurationError />;
  }

  if (status === "pending" || status === "wrong-role") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={PAGE_BLOOM}>
        <section className="w-full max-w-sm rounded-2xl p-8 text-center" style={GLASS}>
          <div className="mx-auto mb-4 flex justify-center">
            <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" className="h-8 w-auto rounded-md" />
          </div>
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e6d2] text-[#8a6a24]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-[17px] font-medium text-[#2b241f]">This account isn&apos;t set up yet</h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#6d6155]">
            You&apos;re signed in, but this workspace hasn&apos;t been enabled for this account. Reach out to
            Devon at Archer Design and he can get this connected.
          </p>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="mt-6 text-[12.5px] font-medium text-[#8a6a24] underline underline-offset-2 hover:text-[#7c3338]"
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-16" style={PAGE_BLOOM}>
      <div className="grid w-full max-w-4xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-xl p-2" style={GLASS}>
            <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" className="h-8 w-auto rounded-md" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a9812f]">Private creative preview</p>
          <h1 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[#2b241f]">
            Sign in to review Archer Design&apos;s work for Valencia Hotel Group.
          </h1>
          <p className="mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-[#6d6155]">
            Approve finished creative, request changes, and message Devon directly — all from one place. No
            password to remember: we&apos;ll email you a secure sign-in link instead.
          </p>
        </div>

        <div className="rounded-2xl p-7 sm:p-8" style={GLASS}>
          <MagicLinkForm redirectPath="/emma" accent="client" />
        </div>
      </div>
    </main>
  );
}
