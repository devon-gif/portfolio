import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl, CALENDLY_URL } from "@/lib/seo";
import { Reveal } from "../components/Reveal";
import { ScheduleAction } from "./components/ScheduleAction";
import {
  ACTIVATION_TIERS,
  CUSTOM_PACK_KEY,
  STARTER_PLAN_KEY,
  STARTER_PLAN_COPY,
  CUSTOM_PACK_COPY,
  ASSET_PRICING,
  customPackTotal,
  fmtMoney,
  starterTier,
} from "../tcrm-pricing";

// tcrm.css is already imported once for the whole /tcrm subtree by
// app/tcrm/layout.tsx (this page is nested under it), so it does not need
// to be imported again here.

const PAGE_TITLE = "Request Your TCRM Creative Plan";
const PAGE_DESCRIPTION =
  "Request your selected TCRM Creative Activation plan, delivered by Archer Design.";

// Reached only via the direct plan-selection links on /tcrm.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/tcrm/schedule") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const FALLBACK_MAILTO =
  "mailto:hello@archerdesign.shop?subject=TCRM%20Creative%20Activation%20Request";

type SelectedPlan =
  | { kind: "tier"; name: string; price: number; bestFor: string; motion: number; static: number; captions: number }
  | { kind: "starter"; name: string; price: number; bestFor: string; motion: number; static: number; captions: number }
  | { kind: "custom"; name: string; total$: number | null; staticCount: number; motionCount: number }
  | { kind: "none" };

function resolvePlan(planParam: string | undefined, staticParam: string | undefined, motionParam: string | undefined): SelectedPlan {
  if (!planParam) return { kind: "none" };

  if (planParam === STARTER_PLAN_KEY) {
    const tier = starterTier();
    return {
      kind: "starter",
      name: STARTER_PLAN_COPY.name,
      price: tier.retail,
      bestFor: STARTER_PLAN_COPY.bestFor,
      motion: tier.motionConcepts,
      static: tier.staticConcepts,
      captions: tier.captions,
    };
  }

  if (planParam === CUSTOM_PACK_KEY) {
    const staticCount = Math.max(0, Number(staticParam ?? 0)) || 0;
    const motionCount = Math.max(0, Number(motionParam ?? 0)) || 0;
    return {
      kind: "custom",
      name: CUSTOM_PACK_COPY.name,
      total$: customPackTotal(staticCount, motionCount),
      staticCount,
      motionCount,
    };
  }

  const tier = ACTIVATION_TIERS.find((t) => t.key === planParam);
  if (tier) {
    return {
      kind: "tier",
      name: tier.name,
      price: tier.retail,
      bestFor: tier.bestFor,
      motion: tier.motionConcepts,
      static: tier.staticConcepts,
      captions: tier.captions,
    };
  }

  return { kind: "none" };
}

export default async function TcrmSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; static?: string; motion?: string }>;
}) {
  const { plan: planParam, static: staticParam, motion: motionParam } = await searchParams;
  const plan = resolvePlan(planParam, staticParam, motionParam);

  return (
    <div className={`${fraunces.variable} tcrm-theme archer-studio relative min-h-screen`}>
      {/* Static branding bar only -- intentionally not the full TcrmHeader,
          since that header's nav links are in-page anchors that only exist
          on /tcrm itself. The "Return to your creative plans" text link
          below is the primary way back. */}
      <header className="tl-header">
        <div className="tl-shell flex items-center justify-between gap-4 py-4">
          <Link
            href="/tcrm"
            className="tl-logo-group"
            aria-label="Return to TCRM Creative Activation, powered by Archer Design"
          >
            <Image
              src="/tcrm/logos/tcrm-logo.png"
              alt="Total Customized Revenue Management"
              width={352}
              height={110}
              className="tl-logo-tcrm"
              priority
            />
            <span className="tl-logo-sep" aria-hidden="true" />
            <Image
              src="/tcrm/logos/archer-design-monogram.png"
              alt="Archer Design"
              width={1000}
              height={605}
              className="tl-logo-archer"
            />
          </Link>
          <p className="tl-logo-microcopy hidden sm:block">Creative activation for hotel clients</p>
        </div>
      </header>

      <main>
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal>
              <p className="tl-eyebrow">Request this plan</p>
              <h1 className="mt-4 text-[2rem] leading-[1.15] sm:text-[2.4rem]">
                Let&rsquo;s get your creative started.
              </h1>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Choose a time with Devon Archer, founder of Archer Design, to confirm scope and get your
                property&rsquo;s creative production underway.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Your TCRM contact stays involved throughout. Once activation is confirmed, Archer Design will coordinate the creative brief, property assets, approvals, and production.
              </p>

              <div className="tl-schedule-participants mt-8">
                <div className="tl-schedule-participant tl-schedule-participant--archer">
                  <p className="tl-schedule-participant-name">Devon Archer</p>
                  <p className="tl-schedule-participant-org">Archer Design</p>
                  <p className="tl-schedule-participant-role">Hospitality creative production</p>
                </div>
              </div>

              {/* Selected plan, carried over via ?plan= (and ?static=/?motion=
                  for the custom pack) from the plan CTA on /tcrm. No
                  wholesale cost or internal margin is ever shown here. */}
              {plan.kind !== "none" && (
                <div className="tl-pkg-econ mt-7">
                  <div className="tl-pkg-econ-row">
                    <span>Selected plan</span>
                    <span>{plan.kind === "custom" ? plan.name : plan.name}</span>
                  </div>
                  {(plan.kind === "tier" || plan.kind === "starter") && (
                    <>
                      <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                        <span>Price</span>
                        <span>{fmtMoney(plan.price)}{plan.kind === "starter" ? " one time" : " / month"}</span>
                      </div>
                      <div className="tl-pkg-econ-row">
                        <span>Motion / static / captions</span>
                        <span>
                          {plan.motion} / {plan.static} / {plan.captions}
                        </span>
                      </div>
                    </>
                  )}
                  {plan.kind === "custom" && (
                    <>
                      <div className="tl-pkg-econ-row">
                        <span>Static / motion</span>
                        <span>
                          {plan.staticCount} / {plan.motionCount}
                        </span>
                      </div>
                      <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                        <span>Total</span>
                        <span>
                          {ASSET_PRICING.static != null && ASSET_PRICING.motion != null && plan.total$ != null
                            ? fmtMoney(plan.total$)
                            : "Custom, confirmed before production"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
              <p className="mt-3 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                {plan.kind === "none"
                  ? "No plan selected yet. Devon can help you choose one on the call."
                  : "This selection is confirmed with you before any production begins."}
              </p>

              <p className="tl-schedule-reassurance mt-7">
                No commitment is required to talk. This is an introductory conversation to confirm fit,
                scope, and next steps.
              </p>

              <Link href="/tcrm#plans" className="tl-schedule-return mt-8">
                <span aria-hidden="true">&larr;</span> Return to your creative plans
              </Link>
            </Reveal>

            <Reveal delay={2}>
              <ScheduleAction bookingUrl={CALENDLY_URL} fallbackMailto={FALLBACK_MAILTO} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="tl-footer">
        <div className="tl-shell flex flex-col items-center gap-5 text-center">
          <span className="tl-wordmark" aria-hidden="true">
            <span className="tl-wordmark-prep">TCRM Creative Activation</span>
            Powered by Archer Design
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            Creative production for TCRM hotel clients, delivered through Archer Design. TCRM remains your
            strategy and relationship contact throughout.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Creative production partner to TCRM
          </p>
        </div>
      </footer>
    </div>
  );
}
