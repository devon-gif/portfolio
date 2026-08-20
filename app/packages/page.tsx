import type { Metadata } from "next";
import Link from "next/link";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { OnDemandPackBuilder } from "@/components/marketing/OnDemandPackBuilder";
import { StudioHeader } from "@/components/marketing/StudioHeader";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { fraunces } from "@/components/marketing/studioFont";
import { FEATURED_VIDEOS } from "@/components/marketing/media";
import { ARCHER_PRICING, MONTHLY_PLANS, formatMoney } from "./pricing";

const DESCRIPTION =
  "Flexible hospitality creative pricing from Archer Design: one-off static and motion graphics with no contract, a 30-day starter, or ongoing monthly creative support for hotels, restaurants, bars, spas, and event venues.";

export const metadata: Metadata = {
  title: "Pricing & Creative Support",
  description: DESCRIPTION,
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Pricing & Creative Support | Archer Design",
    description: DESCRIPTION,
    url: "/packages",
  },
};

const INCLUDED = [
  {
    t: "Social graphics",
    d: "On-brand feed and story creative for hotels, F&B, spas, and events — consistent, polished, and ready to use.",
  },
  {
    t: "Short-form motion",
    d: "Animated campaign creative built from existing stills and staff clips — polished motion without a full production day.",
  },
  {
    t: "Campaign visuals",
    d: "Seasonal pushes, events, packages, and limited-time offers turned into coordinated assets across channels.",
  },
  {
    t: "Booking-support creative",
    d: "Sales decks, direct-booking visuals, email and social creative, and meeting or event promotions.",
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
    body: "Menu launches, F&B specials, events, and recurring creative that keeps offers visible and tables top of mind.",
    href: "/restaurants",
    video: FEATURED_VIDEOS[2].src,
  },
  {
    title: "Bars",
    body: "Cocktail features, live music and event promos, and late-night creative that keeps the room visible.",
    href: "/bars",
    video: FEATURED_VIDEOS[3]?.src ?? FEATURED_VIDEOS[2].src,
  },
];

const CORE_MONTHLY = [
  "Standard social-format exports",
  "Promotional copy incorporated into designs",
  "Brand-safe execution using approved property materials",
  "One consolidated minor revision round",
  "Human review before delivery",
];

export default function PackagesPage() {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <StudioHeader active="packages" />

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-16 md:pt-20">
          <span className="st-kicker">Pricing & creative support</span>
          <h1 className="mt-4 max-w-4xl font-serif text-[clamp(32px,4.8vw,56px)] leading-[1.04] text-[var(--st-ink)]">
            Creative when you need it. Ongoing support when you want it.
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            Start with one graphic, build a custom one-off pack, try a focused 30-day sprint, or move into a monthly creative rhythm. You do not need a contract just to get a few pieces made.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#on-demand" className="st-btn">
              Build a creative pack <span aria-hidden>→</span>
            </a>
            <a href="#monthly" className="st-btn-ghost">
              See monthly plans
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="st-kicker">Three ways to start</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
              Choose the level of commitment that fits the work.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <a href="#on-demand" className="st-card group p-7 transition duration-300 hover:-translate-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">No contract</span>
              <h3 className="mt-4 font-serif text-[24px] text-[var(--st-ink)]">On-Demand Creative</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                Pick exactly how many static and motion graphics you need for one project or campaign.
              </p>
              <p className="mt-6 font-serif text-[26px] text-[var(--st-ink)]">
                {formatMoney(ARCHER_PRICING.static)} <span className="text-[13px] font-sans text-[var(--st-ink-muted)]">static</span>
                <br />
                {formatMoney(ARCHER_PRICING.motion)} <span className="text-[13px] font-sans text-[var(--st-ink-muted)]">motion</span>
              </p>
              <span className="mt-6 inline-flex text-[13px] font-semibold text-[var(--st-gold)]">Build your pack →</span>
            </a>

            <a href="#starter" className="st-card group p-7 transition duration-300 hover:-translate-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">One-time 30 days</span>
              <h3 className="mt-4 font-serif text-[24px] text-[var(--st-ink)]">30-Day Creative Starter</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                A full month of Essential-level production on your actual property, with no ongoing commitment required.
              </p>
              <p className="mt-6 font-serif text-[32px] text-[var(--st-ink)]">{formatMoney(ARCHER_PRICING.starter)}</p>
              <span className="mt-6 inline-flex text-[13px] font-semibold text-[var(--st-gold)]">See the starter →</span>
            </a>

            <a href="#monthly" className="st-card group border-[var(--st-gold-soft)] p-7 transition duration-300 hover:-translate-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Best ongoing value</span>
              <h3 className="mt-4 font-serif text-[24px] text-[var(--st-ink)]">Monthly Creative Support</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                Higher-volume production for properties that need a steady stream of campaign-ready creative.
              </p>
              <p className="mt-6 font-serif text-[32px] text-[var(--st-ink)]">
                From {formatMoney(ARCHER_PRICING.essential)}<span className="text-[13px] font-sans text-[var(--st-ink-muted)]">/mo</span>
              </p>
              <span className="mt-6 inline-flex text-[13px] font-semibold text-[var(--st-gold)]">Compare plans →</span>
            </a>
          </div>
        </section>

        <section id="on-demand" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <span className="st-kicker">Flexible / one-off</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                Need a few graphics? Just buy the work you need.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                No retainer and no monthly contract. Build a pack for an event, menu launch, seasonal offer, wedding push, meeting-space campaign, social refresh, or any other defined need.
              </p>
            </div>
            <OnDemandPackBuilder />
          </div>
        </section>

        <section id="starter" className="scroll-mt-24 mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
            <div className="st-panel p-8 lg:p-10">
              <span className="st-kicker">Try the workflow</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.4vw,40px)] leading-[1.08] text-[var(--st-ink)]">30-Day Creative Starter</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
                Best for a property that wants to see what a real month with Archer looks like before deciding whether to continue.
              </p>
              <div className="mt-7 flex items-end gap-2">
                <span className="font-serif text-[42px] leading-none text-[var(--st-ink)]">{formatMoney(ARCHER_PRICING.starter)}</span>
                <span className="pb-1 text-[12px] text-[var(--st-ink-muted)]">one-time</span>
              </div>
              <p className="mt-3 text-[12px] font-semibold text-[var(--st-gold)]">No ongoing commitment required.</p>
              <Link href="/contact?plan=starter" className="st-btn mt-7">Start a 30-day sprint <span aria-hidden>→</span></Link>
            </div>

            <div className="st-card p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">Included for one property</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-[var(--st-cream)] p-5">
                  <p className="font-serif text-[30px] text-[var(--st-ink)]">6</p>
                  <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">motion concepts</p>
                </div>
                <div className="rounded-xl bg-[var(--st-cream)] p-5">
                  <p className="font-serif text-[30px] text-[var(--st-ink)]">6</p>
                  <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">static concepts</p>
                </div>
                <div className="rounded-xl bg-[var(--st-cream)] p-5">
                  <p className="font-serif text-[30px] text-[var(--st-ink)]">12</p>
                  <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">concise captions</p>
                </div>
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "One defined 30-day creative period",
                  "Built from your real property assets and offers",
                  "Standard social-format exports",
                  "One consolidated minor revision round",
                  "Human review before delivery",
                  "Option to continue afterward — only if it makes sense",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--st-ink-soft)]">
                    <span className="mt-[2px] shrink-0 text-[var(--st-gold)]">✦</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="monthly" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="st-kicker">Ongoing support</span>
              <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                More output when creative is an every-month need.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
                The monthly plans are for properties with enough promotions, events, F&B, meetings, packages, and seasonal moments to benefit from an ongoing production rhythm.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {MONTHLY_PLANS.map((plan) => (
                <div key={plan.key} className={`st-card relative flex flex-col p-7 ${plan.badge ? "border-[var(--st-gold)]" : ""}`}>
                  {plan.badge ? (
                    <span className="absolute right-5 top-5 rounded-full bg-[var(--st-ink)] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--st-ivory)]">{plan.badge}</span>
                  ) : null}
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Monthly</p>
                  <h3 className="mt-3 font-serif text-[25px] text-[var(--st-ink)]">{plan.name}</h3>
                  <p className="mt-5 font-serif text-[38px] leading-none text-[var(--st-ink)]">
                    {formatMoney(plan.price)}<span className="text-[13px] font-sans text-[var(--st-ink-muted)]">/mo</span>
                  </p>
                  <p className="mt-4 min-h-[62px] text-[13px] leading-relaxed text-[var(--st-ink-soft)]">{plan.bestFor}</p>

                  <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[var(--st-line)] py-5 text-center">
                    <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.motion}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">motion</p></div>
                    <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.static}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">static</p></div>
                    <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.captions}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">captions</p></div>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[var(--st-ink-soft)]">
                        <span className="mt-[1px] shrink-0 text-[var(--st-gold)]">✦</span>{item}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/contact?plan=${plan.key}`} className={plan.badge ? "st-btn mt-7 justify-center" : "st-btn-ghost mt-7 justify-center"}>
                    Ask about {plan.name} <span aria-hidden>→</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="st-panel mt-8 p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">Included across monthly plans</p>
              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {CORE_MONTHLY.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 text-[12.5px] text-[var(--st-ink-soft)]"><span className="text-[var(--st-gold)]">✦</span>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <span className="st-kicker">What we can make</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3.6vw,42px)] leading-[1.1] text-[var(--st-ink)]">
              The same production quality, whether you need one piece or a full month.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {INCLUDED.map((item) => (
              <div key={item.t} className="st-card p-7">
                <h3 className="font-serif text-[20px] text-[var(--st-ink)]">{item.t}</h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{item.d}</p>
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
                <Link key={p.title} href={p.href} className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl border border-[var(--st-line)] p-6 shadow-[var(--st-shadow-soft)] transition duration-300 hover:-translate-y-0.5">
                  <LazyVideo src={p.video} label={p.title} className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,17,14,0.12),rgba(20,17,14,0.78))]" />
                  <h3 className="font-serif text-[24px] text-white">{p.title}</h3>
                  <p className="mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-white/85">{p.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">Explore <span aria-hidden className="transition group-hover:translate-x-1">→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StudioCTA
        heading="Start with exactly what you need."
        body="Build a one-off pack with no contract, try a 30-day starter, or choose monthly support when your property needs a steady creative rhythm."
        primaryLabel="Send your project"
      />

      <StudioFooter />
    </div>
  );
}
