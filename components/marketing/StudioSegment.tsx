import Link from "next/link";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { StudioHeroMedia, type StudioClip } from "@/components/marketing/StudioHeroMedia";
import { fraunces } from "@/components/marketing/studioFont";

export type SegmentConfig = {
  active: "hotels" | "restaurants" | "bars";
  kicker: string;
  h1: string;
  subhead: string;
  heroClips: readonly StudioClip[];
  intro: string;
  useCases: { t: string; d: string }[];
  sendList: string[];
  proof: { value: string; label: string }[];
  ctaHeading: string;
  ctaBody: string;
};

/**
 * Reusable light segment page (Hotels / Restaurants / Bars). All content is
 * passed via config so each route stays a thin file and the layout stays
 * consistent across the marketing system.
 */
export function StudioSegment(cfg: SegmentConfig) {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <StudioHeader active={cfg.active} />

      <main>
        {/* Hero */}
        <section className="px-6 pt-16 pb-14 lg:pt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="st-kicker">{cfg.kicker}</span>
              <h1 className="mt-5 font-serif text-[clamp(32px,4.8vw,56px)] leading-[1.05] text-[var(--st-ink)]">
                {cfg.h1}
              </h1>
              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-[var(--st-ink-soft)]">
                {cfg.subhead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="st-btn">
                  Send a property link <span aria-hidden>→</span>
                </Link>
                <Link href="/case-studies" className="st-btn-ghost">
                  View hospitality work
                </Link>
              </div>
            </div>
            <div className="lg:pl-4">
              <StudioHeroMedia clips={cfg.heroClips} />
            </div>
          </div>
        </section>

        {/* Intro / positioning */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-serif text-[clamp(20px,2.6vw,30px)] leading-snug text-[var(--st-ink)]">
              {cfg.intro}
            </p>
          </div>
        </section>

        {/* Use cases */}
        <section className="bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Where we help</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                Creative that fits the way you operate.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cfg.useCases.map((u) => (
                <div key={u.t} className="st-card p-7">
                  <h3 className="font-serif text-[20px] text-[var(--st-ink)]">{u.t}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{u.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Send list + proof */}
        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="st-kicker">How it starts</span>
              <h2 className="mt-4 font-serif text-[clamp(24px,3.2vw,38px)] leading-[1.12] text-[var(--st-ink)]">
                Send the raw ingredients. We handle the rest.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--st-ink-soft)]">
                Think of Archer Design as your remote hospitality post-production
                studio. You send what you already have:
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {cfg.sendList.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[14px] text-[var(--st-ink-soft)]">
                    <span className="mt-[3px] shrink-0 text-[var(--st-gold)]">✦</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-panel flex flex-col justify-center p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">
                Tracked results to date
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
                {cfg.proof.map((m) => (
                  <div key={m.label}>
                    <div className="font-serif text-[clamp(26px,3.2vw,38px)] leading-none text-[var(--st-ink)]">
                      {m.value}
                    </div>
                    <div className="mt-2 text-[12.5px] leading-snug text-[var(--st-ink-muted)]">{m.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[11.5px] leading-relaxed text-[var(--st-ink-muted)]">
                Cumulative across tracked hotel, restaurant, bar, spa, and event
                campaigns — not the result of any single client. Results depend on
                offer, audience, timing, and many other factors.
              </p>
            </div>
          </div>
        </section>
      </main>

      <StudioCTA heading={cfg.ctaHeading} body={cfg.ctaBody} primaryLabel="Send a property link" />
      <StudioFooter />
    </div>
  );
}
