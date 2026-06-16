import type { Metadata } from "next";
import Image from "next/image";
import { Allura, Fraunces } from "next/font/google";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { GOLD_GRADIENT } from "@/components/marketing/media";

const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const allura = Allura({
  variable: "--font-wordmark-script",
  subsets: ["latin"],
  weight: ["400"],
});

const DESCRIPTION =
  "Monthly creative support for restaurants, hotel restaurants, bars, brunch spots, catering teams, and private dining spaces. Social graphics, menu promos, event campaigns, seasonal offers, gift card promos, and Google Business updates.";

export const metadata: Metadata = {
  title: "Restaurant Creative Support | Monthly Social & Promo Design",
  description: DESCRIPTION,
  alternates: { canonical: "/restaurant-creative-support" },
  openGraph: {
    title: "Restaurant Creative Support | Monthly Social & Promo Design",
    description: DESCRIPTION,
    url: "/restaurant-creative-support",
  },
};

const INCLUDES = [
  "Monthly promo calendar",
  "10 branded social graphics",
  "4 motion / promo assets",
  "4 Google Business posts",
  "Captions included",
  "Menu, event & private dining promo support",
  "Monthly mini-report",
];

export default function RestaurantCreativeSupportPage() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <SeedanceBackground />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.68)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_22px_rgba(201,164,76,0.16)]">
              <Image
                src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
                alt="Archer Design logo"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="wordmark-font text-[0.88rem] sm:text-[0.96rem]">
              <span className="text-[#F6F1E7]">Archer</span>
              <span className="text-[#C9A44C]">Design</span>
            </div>
          </a>
          <nav className="flex items-center gap-5 text-sm text-[#A9A092]">
            <a href="/" className="hidden hover:text-[#F6F1E7] sm:inline">Hotels</a>
            <a href="/restaurant-creative-support" className="hidden text-[#F6F1E7] sm:inline">Restaurants</a>
            <a href="/spa-salon-creative-support" className="hidden hover:text-[#F6F1E7] sm:inline">Spas</a>
            <a
              href="#offer"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Request a Sprint →
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 pb-12 pt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C9A44C]">
              Restaurant Creative Support
            </span>
            <h1 className="mt-4 font-serif text-[clamp(32px,5.5vw,62px)] font-semibold leading-tight text-[#F6F1E7]">
              Make your restaurant promos look as good as the food.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[#A9A092]">
              Monthly creative support for restaurants, hotel restaurants, bars, brunch spots,
              catering teams, and private dining spaces that need stronger social graphics, menu
              promos, event campaigns, seasonal offers, gift card promos, and Google Business
              updates.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="#offer"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                style={{ background: GOLD_GRADIENT }}
              >
                Request a Restaurant Promo Sprint <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Metrics strip */}
        <section className="px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-2xl px-6 py-8">
              <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Across tracked hospitality campaigns
              </p>
              <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                {[
                  { value: "14.8M+", label: "Impressions" },
                  { value: "565K+", label: "Engagements" },
                  { value: "4.3M+", label: "Reach" },
                  { value: "670K+", label: "Reported post clicks" },
                ].map((m) => (
                  <div key={m.label}>
                    <div
                      className="font-serif text-[clamp(26px,3.5vw,38px)] font-semibold leading-none bg-clip-text text-transparent"
                      style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                      {m.value}
                    </div>
                    <div className="mt-1.5 text-[12px] text-[#A9A092]">{m.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-[12px] text-[#A9A092]">
                2,500+ creative pieces and posts tracked across active client accounts.
              </p>
            </div>
          </div>
        </section>

        {/* Restaurant-specific proof */}
        <section className="px-6 py-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-[rgba(201,164,76,0.18)] bg-[rgba(201,164,76,0.05)] p-7">
              <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                Client spotlight: Eliza PGH
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#D8CFBE]">
                Eliza PGH campaigns helped generate{" "}
                <strong className="text-[#F6F1E7]">5.88M+ page impressions</strong>,{" "}
                <strong className="text-[#F6F1E7]">392K+ page engagements</strong>,{" "}
                <strong className="text-[#F6F1E7]">608K+ post engagements</strong>, and{" "}
                <strong className="text-[#F6F1E7]">496K+ reported post clicks</strong> across
                tracked Facebook campaigns.
              </p>
            </div>
          </div>
        </section>

        {/* What this helps you promote */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              What this helps you promote
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3vw,36px)] font-semibold leading-tight text-[#F6F1E7]">
              Real menu moments, turned into consistent creative.
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {[
                "Seasonal menus",
                "Brunch",
                "Private dining",
                "Catering",
                "Gift cards",
                "Events",
                "Holiday offers",
                "Chef features",
                "Local campaigns",
                "Restaurant openings",
                "Hotel restaurant promos",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] px-4 py-3 text-center text-[13.5px] text-[#D8CFBE]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What makes this different */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  Why restaurants work with us
                </span>
                <h2 className="mt-3 font-serif text-[clamp(24px,3vw,36px)] font-semibold leading-tight text-[#F6F1E7]">
                  Your food is stunning. Your promos should match.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                  Most restaurants have a phone full of great food photos and no time to turn them
                  into finished content. The menu changes, a private event books, happy hour runs on
                  Thursday. None of it gets promoted the way it deserves.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                  We handle the whole creative loop: plan the month, design the graphics, write the
                  captions, format the Google posts. You forward us what&apos;s coming up, approve
                  what comes back, and post. That&apos;s the entire relationship.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                  No new hire, no creative direction meetings, no blank Canva template at 9pm before
                  a holiday weekend.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A9A092]">
                  Best fit
                </p>
                {[
                  "Independent restaurants and neighborhood staples",
                  "Hotel restaurants and F&B programs",
                  "Bars, brunch spots, and cocktail-forward concepts",
                  "Private dining and catering teams",
                  "Seasonal or event-heavy menus that need ongoing promotion",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[14.5px] text-[#A9A092]">
                    <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What this replaces */}
        <section className="px-6 py-6">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.35)] p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">
                What this replaces
              </p>
              <div className="mt-4 space-y-2.5">
                {[
                  "Another full-time creative hire",
                  "Juggling several freelancers",
                  "Inconsistent monthly promo output",
                  "Last-minute event and menu graphics",
                  "Weak visibility for offers already worth promoting",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[14.5px] text-[#A9A092]">
                    <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Offer card */}
        <section id="offer" className="px-6 py-14">
          <div className="mx-auto max-w-xl">
            <div className="glass-card-strong rounded-3xl p-8 md:p-10 ring-1 ring-[rgba(201,164,76,0.3)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Monthly retainer
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Restaurant Promo Sprint
              </h2>
              <p
                className="mt-2 font-serif text-[22px] font-semibold bg-clip-text text-transparent"
                style={{ backgroundImage: GOLD_GRADIENT }}
              >
                Starting at $1,250/month
              </p>
              <div className="mt-6 space-y-3">
                {INCLUDES.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-[14.5px] text-[#D8CFBE]">
                    <span className="shrink-0 text-[#C9A44C]">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                  style={{ background: GOLD_GRADIENT }}
                >
                  Request a Restaurant Promo Sprint <span aria-hidden>→</span>
                </a>
                <p className="mt-3 text-center text-[12px] text-[#A9A092]">
                  No long contracts. Month-to-month after the first engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">FAQ</span>
              <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,38px)] font-semibold leading-tight text-[#F6F1E7]">
                Good questions.
              </h2>
            </div>
            <div className="divide-y divide-[rgba(201,164,76,0.18)]">
              {[
                {
                  q: "Do you only work with hotel restaurants?",
                  a: "No. Hotels are our anchor, but the same model covers independent restaurants, bars, brunch spots, catering operations, and private dining programs. The deliverables shift to match your calendar: menu launches, seasonal offers, event nights, private dining campaigns. The workflow stays identical.",
                },
                {
                  q: "What do you actually need from us?",
                  a: "Whatever's coming up: a menu change, a weekend special, a new cocktail, a private event booking. Plus any photos you have, even phone photos work. We handle the rest: planning, design, motion, captions, and Google Business posts.",
                },
                {
                  q: "Can this help with private dining and event bookings?",
                  a: "Yes. Private dining and event promo support is built into the package. We create the graphics, offers, and posts designed to keep the inquiry calendar moving.",
                },
                {
                  q: "What are the 4 motion / promo assets?",
                  a: "Short-form animated graphics or video edits built from your existing stills or footage, the kind of content that performs well as Reels, Stories, or paid social. We scope the specific formats during onboarding.",
                },
                {
                  q: "Is there a commitment?",
                  a: "Most partnerships start month-to-month. Ask us about terms when you reach out, and we'll give you a straight answer based on what you need.",
                },
              ].map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[18px] text-[#F6F1E7] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-2xl text-[#C9A44C] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[15px] text-[#A9A092]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-14 text-center text-[13px] text-[#A9A092]">
        <div className="mx-auto flex w-fit items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(201,164,76,0.22)] bg-black shadow-[0_0_18px_rgba(201,164,76,0.14)]">
            <Image
              src="/ChatGPT%20Image%20Jun%207,%202026,%2004_28_24%20PM.png"
              alt="Archer Design logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="wordmark-font text-[0.74rem] text-[#F6F1E7]">
            <span className="text-[#F6F1E7]">Archer</span>
            <span className="text-[#C9A44C]">Design</span>
          </div>
        </div>
        <p className="mt-4 font-serif text-[clamp(16px,2.2vw,24px)] text-[#F6F1E7]">
          Great food deserves{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD_GRADIENT }}>
            great creative to match.
          </span>
        </p>
        <div className="mt-5">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Request a Restaurant Promo Sprint <span aria-hidden>→</span>
          </a>
        </div>
        <p className="mt-8 text-[11px] text-[#A9A092]/50">
          Restaurants &middot; Hotel F&amp;B &middot; Bars &middot; Brunch &middot; Private Dining &middot; Catering &middot; Google Business
        </p>
      </footer>
    </div>
  );
}
