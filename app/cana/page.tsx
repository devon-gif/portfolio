import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Film,
  Handshake,
  Megaphone,
  Repeat,
  Sparkles,
  Store,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cana × Archer Design Collaboration Concept",
  description:
    "A private collaboration concept exploring how Archer Design could add flexible restaurant, bar, event, and hospitality creative production around Cana Development’s places, tenants, and operators.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const projects = [
  "Mt. Vernon Marketplace",
  "The Bourse",
  "Cross Street Market",
  "Western Market",
  "High Street Place",
  "Stock + Grain Assembly",
  "Bryant Street Market",
];

const fits = [
  {
    icon: Sparkles,
    number: "01",
    title: "Extend Cana’s creative capacity",
    body: "Archer can support Cana’s existing marketing and activation work when there’s a need for more production bandwidth, specialized motion, campaign volume, or short-term overflow.",
  },
  {
    icon: Store,
    number: "02",
    title: "Support tenants + operators",
    body: "Restaurants, bars, food-hall tenants, hotel operators, and hospitality concepts can tap into additional recurring creative support without adding more production burden to Cana’s core team.",
  },
  {
    icon: Repeat,
    number: "03",
    title: "Create recurring partner value",
    body: "If a Cana-introduced operator becomes an ongoing Archer client, we can explore a simple referral or recurring-value model that rewards the introduction while Archer manages the creative relationship.",
  },
];

const moments = [
  ["F&B", "Menus, specials, restaurant and bar promotions"],
  ["Events", "Programming, live music, gatherings and activations"],
  ["Openings", "Tenant launches, reveals and grand-opening campaigns"],
  ["Seasonal", "Recurring reasons for guests to return"],
  ["Hospitality", "Hotel, meeting, guest-experience and property campaigns"],
  ["B2B", "Case studies, pursuit decks and portfolio storytelling"],
];

export default function CanaPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-white">CANA × ARCHER</p>
            <p className="mt-0.5 text-xs text-zinc-500">Private collaboration concept</p>
          </div>
          <a
            href="mailto:hello@archerdesign.shop?subject=Cana%20x%20Archer%20collaboration"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/40 hover:bg-white/5"
          >
            Discuss the opportunity
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(245,158,11,0.10),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-32">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                Cana × Archer Design · Private collaboration concept
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                From active places to active campaigns.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">
                Cana defines, develops, leases, operates, markets, and activates distinctive places. Archer could add another layer of flexible creative production when a destination, tenant, restaurant, hospitality operator, or event needs more campaign capacity, specialized motion, or ongoing content support.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#opportunity"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  Explore the opportunity <ArrowRight size={16} />
                </a>
                <a
                  href="https://www.archerdesign.shop"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Archer Design <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <aside className="self-end rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/30 lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">The opportunity</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">A living destination creates dozens of campaign-ready moments.</h2>
              <p className="mt-4 leading-7 text-zinc-400">
                Cana’s restaurants, bars, tenants, events, and programming already keep its places active. Archer can add production capacity when that activity needs more output than the core team wants to absorb internally.
              </p>
              <div className="mt-7 border-t border-white/10 pt-5 text-sm leading-6 text-zinc-500">
                This is an extension of capacity — not a replacement for Cana’s existing marketing team.
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#111111]">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Selected public Cana project context</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-300">
              {projects.map((project) => (
                <span key={project}>{project}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f2efe8] text-[#151515]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">The creative opportunity</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                  One destination can create dozens of marketing moments.
                </h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 text-zinc-600">
                A successful hospitality or mixed-use destination rarely has only one thing to promote. Restaurants, bars, events, tenants, openings, seasonal programming, and new concepts continually create demand for finished creative.
              </p>
            </div>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {moments.map(([title, body]) => (
                <article key={title} className="rounded-2xl border border-black/10 bg-white/60 p-6">
                  <p className="text-sm font-semibold text-zinc-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
                </article>
              ))}
            </div>
            <p className="mt-9 text-xl font-semibold">Archer can become the production layer behind those moments.</p>
          </div>
        </section>

        <section id="opportunity" className="border-y border-white/10 bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">Where the overlap gets interesting</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Three ways Archer could fit alongside Cana.</h2>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {fits.map((fit) => {
                const Icon = fit.icon;
                return (
                  <article key={fit.number} className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span className="text-xs tracking-[0.18em]">{fit.number}</span>
                      <Icon size={22} className="text-emerald-400" />
                    </div>
                    <h3 className="mt-10 text-2xl font-semibold tracking-tight">{fit.title}</h3>
                    <p className="mt-4 leading-7 text-zinc-400">{fit.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f2efe8] text-[#151515]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">A simple working model</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em]">Flexible creative capacity when the moment calls for it.</h2>
                <p className="mt-5 leading-7 text-zinc-600">
                  Cana or the operator keeps the strategy and relationship. Archer adds hands-on production capacity and turns priorities into finished campaign assets.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Building2, title: "Pre-opening", body: "Teasers, tenant announcements, opening countdowns and launch assets." },
                  { icon: Megaphone, title: "Opening", body: "Reveal creative, social, email, events and F&B launch campaigns." },
                  { icon: Film, title: "Ongoing", body: "Seasonal campaigns, tenant promotions, motion, programming and hospitality offers." },
                ].map((phase) => {
                  const Icon = phase.icon;
                  return (
                    <article key={phase.title} className="rounded-2xl border border-black/10 bg-white/70 p-6">
                      <Icon size={22} className="text-emerald-700" />
                      <h3 className="mt-6 text-lg font-semibold">{phase.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{phase.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#101010]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-8">
                <Handshake size={24} className="text-emerald-400" />
                <h2 className="mt-6 text-3xl font-semibold tracking-tight">Mutual referrals can work both ways.</h2>
                <p className="mt-4 leading-7 text-zinc-400">
                  Cana can introduce operators that need additional creative capacity. Archer can keep Cana in mind when hotel, restaurant, mixed-use, development, or placemaking opportunities surface in its network.
                </p>
              </article>
              <article className="rounded-3xl border border-emerald-400/30 bg-emerald-400/[0.07] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Discussion concept</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">Start with one useful opportunity.</h2>
                <p className="mt-4 leading-7 text-zinc-300">
                  No complicated partnership structure is needed up front. If there is a tenant, operator, destination, pursuit, or internal project where extra creative capacity would help, Archer can prove the model on a real assignment first.
                </p>
                <a
                  href="mailto:hello@archerdesign.shop?subject=Cana%20x%20Archer%20collaboration"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
                >
                  Continue the conversation <ArrowRight size={16} />
                </a>
              </article>
            </div>

            <div className="mt-14 border-t border-white/10 pt-7 text-xs leading-5 text-zinc-600">
              Private discussion concept prepared by Archer Design. Nothing on this page implies an existing partnership, endorsement, or agreed commercial terms with Cana Development.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
