import type { Metadata } from "next";
import Image from "next/image";
import { Allura, Fraunces } from "next/font/google";
import { SeedanceBackground } from "@/components/marketing/SeedanceBackground";
import { ClientLogoStrip } from "@/components/marketing/ClientLogoStrip";
import { HowItWorks } from "@/components/marketing/HowItWorks";
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
import { GOLD_GRADIENT, FEATURED_VIDEOS, GALLERY_IMAGES } from "@/components/marketing/media";
import { JsonLd } from "@/components/marketing/JsonLd";
import { absoluteUrl, faqJsonLd, serviceJsonLd, videoObjectJsonLd } from "@/lib/seo";

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
  title: {
    absolute: "Archer Design | Hotel Social Media & Hospitality Creative Support",
  },
  description:
    "Hospitality creative support for hotels, restaurants, spas, and event venues — social graphics, short-form video, captions, campaign copy, and approval-ready content without adding full-time creative headcount.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Archer Design | Hotel Social Media & Hospitality Creative Support",
    description:
      "Hospitality creative support for hotels, restaurants, spas, and event venues — social graphics, short-form video, captions, campaign copy, and approval-ready content without adding full-time creative headcount.",
    url: "/",
  },
};

// TODO(devon): Fill in real terms for the commitment FAQ answer.
// TODO(devon): Confirm 2024 as the real start year in MetricsStrip.tsx.
const FAQ = [
  {
    q: "Do we need to do a photo or video shoot?",
    a: "No. Everything is built from the assets you already have, property photography, menus, event details, phone photos, past campaign material. If your photography is thin in one area, we'll tell you honestly and work with what performs.",
    open: true,
  },
  {
    q: "What do we get each month?",
    a: "A monthly creative plan, then a steady delivery of finished assets: social graphics, short-form motion, event and F&B promos, and seasonal campaign visuals, with captions included. Ask about your specific asset count during the free trial.",
    open: true,
  },
  {
    q: "How is this lower-overhead than hiring?",
    a: "A single in-house creative, social, or digital hire typically costs $90K–$180K a year once you include salary, insurance, payroll taxes, software, recruiting, and management time. Archer Design delivers the output of that role for a fixed monthly fee, with no employment overhead and no replacement risk. Use the calculator above with your own numbers.",
    open: false,
  },
  {
    q: "Can you support a whole group or management company?",
    a: "Yes, that's the core of what we do. We support multi-property portfolios with consistent group-level branding and property-level customization, on one plan and one invoice. Groups of 5+ properties get a custom-scoped partnership.",
    open: false,
  },
  {
    q: "Can you prove the creative drove bookings?",
    a: "We track what creative can honestly claim: impressions, engagement, reach, profile actions, and direct response to promoted offers and events. Across our hospitality clients, that's 13.9M+ impressions and 543K+ direct engagements to date. Direct booking attribution depends on your property's tracking setup, and during onboarding we'll recommend simple ways (links, codes, GBP tracking) to connect creative to revenue.",
    open: false,
  },
  {
    q: "What's the commitment?",
    // TODO(devon): Replace with your real terms: month-to-month or 3-month minimum.
    a: "Start with the free 5-asset trial, then choose a monthly package. Scale up, down, or pause as your season demands. Ask us about commitment terms during your trial, we'll give you the straight answer.",
    open: false,
  },
];

export default function ArcherDesignHome() {
  return (
    <div
      className={`${fraunces.variable} ${allura.variable} archer-luxury relative min-h-screen text-[#F6F1E7] font-[family-name:var(--font-geist-sans)]`}
    >
      <JsonLd
        data={[
          serviceJsonLd({
            name: "Hotel Social Media & Hospitality Creative Support",
            description:
              "Social graphics, short-form video, captions, and approval-ready content for hotels, restaurants, spas, and event venues.",
            path: "/",
            serviceType: "Hospitality creative and social media content service",
          }),
          faqJsonLd(FAQ.map(({ q, a }) => ({ q, a }))),
          ...videoObjectJsonLd(
            FEATURED_VIDEOS.map((v, i) => ({
              name: v.label,
              description: `Archer Design short-form hospitality video example: ${v.label}.`,
              contentUrl: v.src,
              thumbnailUrl: absoluteUrl(GALLERY_IMAGES[i % GALLERY_IMAGES.length].src),
            }))
          ),
        ]}
      />
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
            <a href="#trial" className="hidden hover:text-[#F6F1E7] sm:inline">Free Trial</a>
            <a
              href="/contact"
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Get 5 Free Sample Assets
            </a>
          </nav>
        </div>
      </header>

      <main>
        <MediaHero />

        {/* Trust bar — client logos only, no keyword tags */}
        <ClientLogoStrip />

        {/* How it works — 3-step process */}
        <HowItWorks />

        {/* Featured short-form motion */}
        <FeaturedMotionShowcase />

        <MetricsStrip />

        {/* ROI calculator + overhead comparison */}
        <RetainerValueSection />

        <div className="mx-auto max-w-6xl px-6 py-2">
          <div className="gold-divider opacity-30" />
        </div>

        {/* Still image gallery */}
        <ImageGallery />

        {/* 3-card value strip + client testimonials */}
        <ValueQuoteRow />

        <div className="mx-auto max-w-6xl px-6 py-2">
          <div className="gold-divider opacity-25" />
        </div>

        {/* Package navigation cards (Hotels / Spas / Restaurants) */}
        <PackagePathCards />

        {/* Full package listing — group leads */}
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
                <details key={f.q} open={f.open} className="group py-5">
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

      <footer className="border-t border-[rgba(201,164,76,0.1)] px-6 py-16 text-center text-[13px] text-[#A9A092]">
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

        <p className="mt-4 font-serif text-[clamp(18px,2.4vw,26px)] text-[#F6F1E7]">
          Your properties already have the raw material.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: GOLD_GRADIENT }}
          >
            Let&apos;s show you what it can do.
          </span>
        </p>

        <div className="mt-5">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Get 5 Free Sample Assets <span aria-hidden>→</span>
          </a>
          <p className="mt-3 text-[13px] text-[#A9A092]">No call. No card. 5 finished pieces in 7 days.</p>
        </div>

        {/* SEO keyword row — moved from trust bar */}
        <p className="mt-8 text-[11px] text-[#A9A092]/50">
          Boutique Spas &middot; Hotel Restaurants &middot; Event Venues &middot; Multi-Property Groups &middot; F&amp;B Campaigns &middot; Local SEO
        </p>

        <AdminLink className="mt-4 inline-block text-[11px] text-[#A9A092]/40 transition-colors hover:text-[#C9A44C]" />
      </footer>
    </div>
  );
}
