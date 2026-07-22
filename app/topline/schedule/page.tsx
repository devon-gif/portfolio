import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { REVSTUDIO_BOOKING_URL, REVSTUDIO_FALLBACK_MAILTO } from "@/lib/revstudio";
import { Reveal } from "../components/Reveal";
import { ScheduleAction } from "./components/ScheduleAction";

// topline.css is already imported once for the whole /topline subtree by
// app/topline/layout.tsx (this page is nested under it), so it does not
// need to be imported again here.

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- do not repeat that suffix here.
const PAGE_TITLE = "Schedule a Conversation with Topline";
const PAGE_DESCRIPTION =
  "Schedule a conversation with Ghisela Angulo Castro to meet Devon Archer and discuss the proposed Topline creative partnership.";

// Private, personalized proposal sub-page -- never indexed, never linked
// from the main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which
// intentionally omits both /topline and /topline/schedule), or footer.
// Accessible only via the direct link from the /topline proposal itself.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/topline/schedule") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const hasToplineLogo = existsSync(join(process.cwd(), "public/topline/logos/topline-logo.png"));

const PARTICIPANTS = [
  {
    name: "Ghisela Angulo Castro",
    org: "The Revstudio",
    role: "Commercial and distribution strategy",
    accent: "revstudio" as const,
  },
  {
    name: "Devon Archer",
    org: "Archer Design",
    role: "Hospitality creative production",
    accent: "archer" as const,
  },
];

export default function ToplineSchedulePage() {
  return (
    <div className={`${fraunces.variable} topline-theme archer-studio relative min-h-screen`}>
      {/* Static branding bar only -- intentionally not the full ToplineHeader,
          since that header's nav links are in-page anchors (#motion,
          #packages, etc.) that only exist on /topline itself. The logo
          lockup doubles as a way back to the proposal; the explicit
          "Return to the Topline proposal" text link below is the primary,
          spec-required way back. */}
      <header className="tl-header">
        <div className="tl-shell flex items-center justify-between gap-4 py-4">
          <Link
            href="/topline"
            className="tl-logo-group"
            aria-label="Return to the Topline proposal, prepared for Topline Revenue Management, delivered with The Revstudio and Archer Design"
          >
            {hasToplineLogo ? (
              <Image
                src="/topline/logos/topline-logo.png"
                alt="Topline Revenue Management"
                width={140}
                height={44}
                className="tl-logo-topline"
                priority
              />
            ) : (
              <span className="tl-wordmark">
                <span className="tl-wordmark-prep">Prepared for</span>
                TOPLINE
              </span>
            )}
            <span className="tl-logo-sep" aria-hidden="true" />
            <Image
              src="/topline/logos/trs-archer-logo.png"
              alt="The Revstudio and Archer Design"
              width={354}
              height={116}
              className="tl-logo-trs-ad"
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
                Schedule with Ghisela to meet Devon Archer.
              </h1>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Choose a time with Ghisela Angulo Castro to discuss the proposed creative partnership and
                meet Devon Archer, founder of Archer Design.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Ghisela will help coordinate the conversation, provide the relevant commercial context, and
                introduce Devon so the group can review the pilot, creative scope, workflow, and next steps
                together.
              </p>

              <div className="tl-schedule-participants mt-8">
                {PARTICIPANTS.map((p) => (
                  <div key={p.name} className={`tl-schedule-participant tl-schedule-participant--${p.accent}`}>
                    <p className="tl-schedule-participant-name">{p.name}</p>
                    <p className="tl-schedule-participant-org">{p.org}</p>
                    <p className="tl-schedule-participant-role">{p.role}</p>
                  </div>
                ))}
              </div>

              <p className="tl-schedule-reassurance mt-7">
                No commitment is required. This is an introductory conversation to review fit, priorities,
                and the proposed pilot.
              </p>

              <Link href="/topline" className="tl-schedule-return mt-8">
                <span aria-hidden="true">&larr;</span> Return to the Topline proposal
              </Link>
            </Reveal>

            <Reveal delay={2}>
              <ScheduleAction bookingUrl={REVSTUDIO_BOOKING_URL} fallbackMailto={REVSTUDIO_FALLBACK_MAILTO} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="tl-footer">
        <div className="tl-shell flex flex-col items-center gap-5 text-center">
          <span className="tl-wordmark" aria-hidden="true">
            <span className="tl-wordmark-prep">Prepared for</span>
            TOPLINE
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            This page presents a proposed service model prepared for Topline Revenue Management. It does
            not announce or imply an existing partnership, endorsement, or client engagement.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Private proposal &middot; Not for distribution
          </p>
        </div>
      </footer>
    </div>
  );
}
