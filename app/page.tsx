import type { Metadata } from "next";
import Image from "next/image";
import { Allura, Fraunces } from "next/font/google";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { ClientLogoStrip } from "@/components/marketing/ClientLogoStrip";
import { MediaHero } from "@/components/marketing/MediaHero";
import { MetricsStrip } from "@/components/marketing/MetricsStrip";
import { FeaturedMotionShowcase } from "@/components/marketing/FeaturedMotionShowcase";
import { ImageGallery } from "@/components/marketing/ImageGallery";
import { ValueQuoteRow } from "@/components/marketing/ValueQuoteRow";
import { PackagePathCards } from "@/components/marketing/PackagePathCards";
import { RetainerValueSection } from "@/components/marketing/RetainerValueSection";
import { PackageCards } from "@/components/marketing/PackageCards";
import { TrialCTA } from "@/components/marketing/TrialCTA";
import { AdminLink } from "@/components/AdminLink";
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

export const metadata: Metadata = {
  title: "Archer Design, Luxury hospitality creative that drives bookings",
  description:
    "Social content, design, motion, and SEO for hotels, spas, and restaurants, delivered for far less than building an in-house team.",
};

const FAQ = [
  { q: "Do you need us to do a photo or video shoot?", a: "No. We work from the assets you already have, like property photos, menus, event content, and brand files. That's what keeps it efficient and affordable." },
  { q: "What do we get each month?", a: "A consistent set of finished, on-brand assets like social graphics, short-form motion, F&B/event promos, and seasonal campaigns, plus a simple monthly plan. SEO packages add local search content." },
  { q: "How is this lower-overhead than hiring?", a: "An in-house creative hire carries salary, benefits, software, recruiting, and management. A monthly package gives you the output without carrying any of that." },
  { q: "Can you support a whole group?", a: "Yes. The hotel packages cover up to 3 properties; for 5+ we build a custom group package with one plan and one point of contact." },
  { q: "Can you prove the creative drove bookings?", a: "We can prove reach, engagement, shares, creative output, and campaign visibility. Direct booking or event attribution depends on the tracking a property has in place, such as booking links, UTMs, promo codes, RSVP data, POS data, or Google Business Profile reporting. When that tracking is available, we can help structure campaigns around it. Without it, we use careful language: our work supports booking interest, local demand, event visibility, and guest action." },
];

export default function ArcherDesignHome() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <SeedanceBackground />

      {/* Slim header */}
      <header className="sticky top-0 z-40 border-b border-[rgba(201,164,76,0.14)] bg-[rgba(5,5,5,0.68)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
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
          </div>
          <nav className="flex items-center gap-7 text-sm text-[#A9A092]">
            <a href="#work" className="hidden hover:text-[#F6F1E7] sm:inline">Work</a>
            <a href="#packages" className="hidden hover:text-[#F6F1E7] sm:inline">Packages</a>
            <a href="/contact" className="hidden hover:text-[#F6F1E7] sm:inline">7-Day Trial</a>
            <a
              href="/contact"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Request a Trial
            </a>
          </nav>
        </div>
      </header>

      <main>
        <MediaHero />

        {/* Thin client logo ticker - directly beneath the hero */}
        <ClientLogoStrip />

        {/* Featured short-form motion */}
        <FeaturedMotionShowcase />

        <MetricsStrip />

        {/* ROI / cost-savings - obvious savings before packages */}
        <RetainerValueSection />

        <div className="mx-auto max-w-6xl px-6 py-2">
          <div className="gold-divider opacity-30" />
        </div>

        {/* Still image gallery (masonry, real aspect ratios) */}
        <ImageGallery />

        {/* Testimonials */}
        <ValueQuoteRow />

        <div className="mx-auto max-w-6xl px-6 py-2">
          <div className="gold-divider opacity-25" />
        </div>

        {/* Packages */}
        <PackagePathCards />
        <PackageCards />

        <TrialCTA />

        {/* FAQ */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">FAQ</span>
              <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
                Good questions.
              </h2>
            </div>
            <div className="divide-y divide-[rgba(201,164,76,0.18)]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl text-[#F6F1E7] [&::-webkit-details-marker]:hidden">
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

      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-10 text-center text-[13px] text-[#A9A092]">
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
          <div className="wordmark-font text-[0.68rem] text-[#F6F1E7] sm:text-[0.74rem]">
            <span className="text-[#F6F1E7]">Archer</span>
            <span className="text-[#C9A44C]">Design</span>
          </div>
        </div>
        <p className="mt-2">Luxury hospitality creative, without adding headcount.</p>
        <AdminLink className="mt-4 inline-block text-[11px] text-[#A9A092]/40 transition-colors hover:text-[#C9A44C]" />
      </footer>
    </div>
  );
}
