"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getCurrentProfile, isReviewProductionEnvironment, isReviewSupabaseConfigured } from "@/lib/review";
import { MagicLinkForm } from "./MagicLinkForm";
import { ReviewConfigurationError } from "./ReviewConfigurationError";

type Status = "checking" | "signed-out" | "forbidden" | "approved" | "unconfigured";

const VALENCIA_LOGO_SRC = "/review/valencia-hotel-collection-logo.jpeg";

const PAGE_BLOOM: CSSProperties = {
  background:
    "radial-gradient(circle at 74% 6%, rgba(169,129,47,0.16), transparent 34%), " +
    "radial-gradient(circle at 12% 90%, rgba(216,189,184,0.18), transparent 40%), " +
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
 * Gate for /review/admin. When Supabase isn't configured during LOCAL
 * DEVELOPMENT ONLY, renders children directly — SimpleAdminReview keeps its
 * own local "Continue as Devon" demo gate in that case, exactly as it did
 * before this migration, so local development without a Supabase project
 * still works. In a real deployment (isReviewProductionEnvironment()) with
 * Supabase still unconfigured, this must NOT fall through to that local
 * demo gate — that would hand out full admin access to anyone who finds the
 * URL, with zero real auth. It shows a clear configuration error instead.
 *
 * Once Supabase IS configured, this performs the real check: a session must
 * exist AND the signed-in user's review_profiles row must have role
 * "admin" — a client role (Emma) is explicitly rejected here, never just
 * hidden in the UI.
 */
export function ReviewAdminGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const configured = isReviewSupabaseConfigured();

  useEffect(() => {
    let active = true;

    async function evaluate() {
      if (!configured) {
        if (isReviewProductionEnvironment()) {
          if (active) setStatus("unconfigured");
          return;
        }
        if (active) setStatus("approved");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;

      if (!data.session) {
        setStatus("signed-out");
        return;
      }

      const profile = await getCurrentProfile();
      if (!active) return;

      if (!profile || profile.role !== "admin") {
        setStatus("forbidden");
        return;
      }
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
      <div className="flex min-h-screen items-center justify-center gap-3 text-[#8a8071]" style={{ background: "#fdfbf6" }}>
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Checking access…</span>
      </div>
    );
  }

  if (status === "approved") {
    return <>{children}</>;
  }

  if (status === "unconfigured") {
    return <ReviewConfigurationError />;
  }

  if (status === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={PAGE_BLOOM}>
        <section className="w-full max-w-sm rounded-2xl p-8 text-center" style={GLASS}>
          <div className="mx-auto mb-4 flex justify-center">
            <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" className="h-8 w-auto rounded-md" />
          </div>
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f1d9c9] text-[#7c3338]">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-[16px] font-medium text-[#2b241f]">This account can&apos;t access admin</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-[#6d6155]">
            This sign-in is recognized, but it doesn&apos;t have Archer Design admin access. Client accounts are
            reviewed at <span className="text-[#2b241f]">/emma</span>, not here.
          </p>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="mt-6 text-[12px] font-medium text-[#8a6a24] underline underline-offset-2 hover:text-[#7c3338]"
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6" style={PAGE_BLOOM}>
      <section className="w-full max-w-sm rounded-2xl p-7" style={GLASS}>
        <div className="mb-5 flex items-center gap-3">
          <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" className="h-7 w-auto rounded-md" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-[#2b241f]">Archer Review — Admin</h1>
            <p className="text-[11px] text-[#8a8071]">Archer Design team access only.</p>
          </div>
        </div>
        <div className="mt-6">
          <MagicLinkForm redirectPath="/review/admin" accent="admin" />
        </div>
      </section>
    </main>
  );
}
