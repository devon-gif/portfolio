import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl, CALENDLY_URL } from "@/lib/seo";
import { Reveal } from "../components/Reveal";
import { ScheduleAction } from "./components/ScheduleAction";
import { PILOT_HOTEL_COUNT, fmtMoney, tierByKey } from "../tcrm-pricing";

// tcrm.css is already imported once for the whole /tcrm subtree by
// app/tcrm/layout.tsx (this page is nested under it), so it does not need
// to be imported again here.

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- do not repeat that suffix here.
const PAGE_TITLE = "Schedule a Conversation with Archer Design";
const PAGE_DESCRIPTION =
  "Schedule a conversation with Devon Archer to discuss the proposed TCRM creative-production model.";

// Private, personalized proposal sub-page -- never indexed, never linked
// from the main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which
// intentionally omits both /tcrm and /tcrm/schedule), or footer. Accessible
// only via the direct link from the /tcrm proposal itself.
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
  "mailto:hello@archerdesign.shop?subject=TCRM%20%C3%97%20Archer%20Design%20%E2%80%94%20Pilot%20Conversation";

export default async function TcrmSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier: tierParam } = await searchParams;
  // Falls back to Growth Activation (the recommended starting option) when
  // no tier is present, e.g. when arriving via the hero's generic "Review
  // the 30-day pilot" link rather than a specific pricing-card CTA.
  const tier = tierByKey(tierParam);
  const pilotRetailTotal = tier.retail * PILOT_HOTEL_COUNT;
  const pilotWholesaleTotal = tier.wholesale * PILOT_HOTEL_COUNT;

  return (
    <div className={`${fraunces.variable} tcrm-theme archer-studio relative min-h-screen`}>
      {/* Static branding bar only -- intentionally not the full TcrmHeader,
          since that header's nav links are in-page anchors (#motion,
          #packages, etc.) that only exist on /tcrm itself. The logo lockup
          doubles as a way back to the proposal; the explicit "Return to
          the TCRM proposal" text link below is the primary way back. */}
      <header className="tl-header">
        <div className="tl-shell flex items-center justify-between gap-4 py-4">
          <Link
            href="/tcrm"
            className="tl-logo-group"
            aria-label="Return to the TCRM proposal, prepared for Total Customized Revenue Management, delivered by Archer Design"
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
          <p className="tl-logo-microcopy hidden sm:block">Proposed delivery model</p>
        </div>
      </header>

      <main>
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal>
              <p className="tl-eyebrow">Schedule a conversation</p>
              <h1 className="mt-4 text-[2rem] leading-[1.15] sm:text-[2.4rem]">
                Schedule a call with Devon Archer.
              </h1>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Choose a time with Devon Archer, founder of Archer Design, to review the proposed pilot,
                creative scope, and working terms.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Devon will walk through the pilot structure, the packages, and how delivery would work
                behind TCRM&rsquo;s client relationship, and answer any questions about scope or scheduling.
              </p>

              <div className="tl-schedule-participants mt-8">
                <div className="tl-schedule-participant tl-schedule-participant--archer">
                  <p className="tl-schedule-participant-name">Devon Archer</p>
                  <p className="tl-schedule-participant-org">Archer Design</p>
                  <p className="tl-schedule-participant-role">Hospitality creative production</p>
                </div>
              </div>

              {/* Selected pricing tier, carried over via ?tier= from the
                  pricing-card CTA on /tcrm. Figures are illustrative and
                  recalculated live from the same tier data used everywhere
                  else on the page, never a separate hardcoded number. */}
              <div className="tl-pkg-econ mt-7">
                <div className="tl-pkg-econ-row">
                  <span>Selected pilot</span>
                  <span>{tier.name}</span>
                </div>
                <div className="tl-pkg-econ-row">
                  <span>Properties</span>
                  <span>{PILOT_HOTEL_COUNT}</span>
                </div>
                <div className="tl-pkg-econ-row">
                  <span>Illustrative hotel-facing total</span>
                  <span>{fmtMoney(pilotRetailTotal)}</span>
                </div>
                <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                  <span>Archer Design wholesale total</span>
                  <span>{fmtMoney(pilotWholesaleTotal)}</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                These figures remain illustrative until the pilot scope is approved.
              </p>

              <p className="tl-schedule-reassurance mt-7">
                No commitment is required. This is an introductory conversation to review fit, priorities,
                and the proposed pilot.
              </p>

              <Link href="/tcrm" className="tl-schedule-return mt-8">
                <span aria-hidden="true">&larr;</span> Return to the TCRM proposal
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
            <span className="tl-wordmark-prep">Prepared for</span>
            TCRM
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            This page presents a proposed service model prepared for Total Customized Revenue Management.
            It does not announce or imply an existing partnership, endorsement, or client engagement.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Private proposal &middot; Not for distribution
          </p>
        </div>
      </footer>
    </div>
  );
}
