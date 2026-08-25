import type { Metadata } from "next";
import Link from "next/link";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { HomePricingSection } from "@/components/marketing/HomePricingSection";
import { fraunces } from "@/components/marketing/studioFont";
import { FEATURED_VIDEOS } from "@/components/marketing/media";

const DESCRIPTION =
  "Flexible hospitality creative support from one-off graphics and a $299.99 monthly starter plan through $800, $1,000, and $1,200 property-level creative partnerships.";

export const metadata: Metadata = {
  title: "Packages & Creative Support",
  description: DESCRIPTION,
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Packages & Creative Support | Archer Design",
    description: DESCRIPTION,
    url: "/packages",
  },
};

const INCLUDED = [
  {
    t: "Social graphics",
    d: "On-brand feed and story creative for hotels, F&B, spas, and events — consistent, polished, and ready to post.",
  },
  {
    t: "Short-form motion",
    d: "Reels and campaign video built from existing stills and staff clips. Polished motion without a full production day.",
  },
  {
    t: "Campaign visuals",
    d: "Seasonal pushes, events, and limited-time offers turned into a coordinated set of assets across channels.",
  },
  {
    t: "Booking-support creative",
    d: "Sales decks, direct-booking visuals, email / Google / Facebook creative, and meeting and event promos.",
  },
];

const PATHS = [
  {
    title: "Hotels & Resorts",
    body: "Creative systems for boutique properties, multi-property groups, meetings, F&B, and seasonal campaigns.",
    href: "/hotels",
    video: FEATURED_VIDEOS[0].src,
  },
  {
    title: "Restaurants",
    body: "Menu launches, F&B specials, events, and weekly content that keeps offers visible and tables top of mind.",
    href: "/restaurants",
    video: FEATURED_VIDEOS[2].src,
  },
  {
    title: "Bars",
    body: "Cocktail features, live music and event promos, and late-night social that keeps the room full.",
    href: "/bars",
    video: FEATURED_VIDEOS[3]?.src ?? FEATURED_VIDEOS[2].src,
  },
];

const OLD_WAY = [
  "Freelance designer",
  "Video editor",
  "Social content support",
  "Photographer / production crew",
  "Agency support",
  "Internal coordination time",
];

const ARCHER_WAY = [
  "One hospitality creative studio",
  "A steady monthly creative rhythm",
  "A remote post-production workflow",
  "Scalable support for one property or many",
  "Lower overhead than building a full creative team",
];

export default function PackagesPage() {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <StudioHeader active="packages" />

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-20">
          <span className="st-kicker">Packages</span>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,52px)] leading-[1.06] text-[var(--st-ink)]">
            Premium hospitality creative, with a starting point for almost any budget.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            Buy a single graphic when you need it, keep a small monthly creative lane open, or use Archer as a fuller property-level creative partner. No need to overbuy before the workload is there.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#pricing" className="st-btn">
              See pricing <span aria-hidden>→</span>
            </a>
            <Link href="/case-studies" className="st-btn-ghost">
              See the work
            </Link>
          </div>
        </section>

        <HomePricingSection />

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="st-kicker">What you get</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
              Finished creative, scoped to the level you choose.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <div key={item.t} className="st-card p-7">
                <h3 className="font-serif text-[20px] text-[var(--st-ink)]">{item.t}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Tailored by property</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                Built around how your property actually operates.
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {PATHS.map((p) => (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl border border-[var(--st-line)] p-6 shadow-[var(--st-shadow-soft)] transition duration-300 hover:-translate-y-0.5"
                >
                  <LazyVideo
                    src={p.video}
                    label={p.title}
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,17,14,0.12),rgba(20,17,14,0.78))]" />
                  <h3 className="font-serif text-[24px] text-white">{p.title}</h3>
                  <p className="mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-white/85">{p.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Explore <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="st-kicker">The advantage</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
              More creative output. Less overhead.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              Instead of stacking multiple vendors and in-house hires, one studio
              keeps the creative moving — at a fraction of the cost of building a
              full team.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="st-panel p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">
                The old way
              </p>
              <ul className="mt-5 space-y-3">
                {OLD_WAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--st-ink-soft)]">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--st-taupe)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-card border-[var(--st-gold-soft)] p-8">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">
                With Archer Design
              </p>
              <ul className="mt-5 space-y-3">
                {ARCHER_WAY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--st-ink)]">
                    <span className="mt-[3px] shrink-0 text-[var(--st-gold)]">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="st-panel mt-8 p-8">
            <h3 className="font-serif text-[22px] text-[var(--st-ink)]">How pricing works</h3>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
              One-off creative is priced per asset. Creative Lite is $299.99 per month. The core property-level plans are $800, $1,000, and $1,200 per active property or brand per month. Multi-property teams can coordinate several properties under one workflow and invoice, with final scope confirmed before kickoff.
            </p>
          </div>
        </section>
      </main>

      <StudioCTA
        heading="Let's scope the right creative rhythm."
        body="Start with one asset, Creative Lite, or a fuller monthly partnership. Send a property, restaurant, bar, spa, or event link and we'll help you choose the right level."
        primaryLabel="Send a property link"
      />

      <StudioFooter />
    </div>
  );
}
