import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Allura, Fraunces } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
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
import { StarterSprintSection } from "@/components/marketing/StarterSprintSection";
import { BeforeAfterSection } from "@/components/marketing/BeforeAfterSection";
import { FitSection } from "@/components/marketing/FitSection";
import { CampaignResults } from "@/components/marketing/CampaignResults";
import { TopCampaignMoments } from "@/components/marketing/TopCampaignMoments";
import { WhatWeTrack } from "@/components/marketing/WhatWeTrack";
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
    "Hospitality creative support for hotels, restaurants, spas, and event venues, social graphics, short-form video, captions, campaign copy, and approval-ready content without adding full-time creative headcount.",
  alternates: { canonical: "/hotel-groups" },
  openGraph: {
    title: "Archer Design | Hotel Social Media & Hospitality Creative Support",
    description:
      "Hospitality creative support for hotels, restaurants, spas, and event venues, social graphics, short-form video, captions, campaign copy, and approval-ready content without adding full-time creative headcount.",
    url: "/hotel-groups",
  },
};

// TODO(devon): Fill in real terms for the commitment FAQ answer.
const FAQ = [
  {
    q: "What is a Creative Gap Review?",
    a: "A short review of how your property, restaurant, spa, or event offer shows up online. We look at your website, social, Google Business content, and visible campaigns, then send 3-5 practical ideas to improve how your offers are packaged.",
    open: true,
  },
  {
    q: "Do we need a photo/video shoot?",
    a: "No. The starting point is the assets you already have: property photos, menus, event details, spa services, phone photos, and past campaign material. If new photo or video support is needed later, we can scope that in separately.",
    open: true,
  },
  {
    q: "Is this for one property or a group?",
    a: "Both. Single-property support is available, but the strongest fit is hotel groups, management companies, or hospitality teams that need consistent creative across multiple properties or revenue centers.",
    open: false,
  },
  {
    q: "Are you a full-service marketing agency?",
    a: "No. Archer Design focuses on the creative execution layer: social graphics, short-form motion, campaign visuals, Google Business content support, captions, and offer packaging. We can support marketing teams, agencies, or operators who already have strategy but need better creative output.",
    open: false,
  },
  {
    q: "What do we get each month?",
    a: "A monthly creative plan, then a steady delivery of finished assets: social graphics, short-form motion, event and F&B promos, and seasonal campaign visuals, with captions included. Ask about your specific asset count during onboarding.",
    open: true,
  },
  {
    q: "Do you replace our internal team?",
    a: "No. Most groups we work with already have internal marketing support. Archer Design is usually the outside creative extension that helps with overflow, property-level consistency, F&B/event campaigns, short-form motion, and local content.",
    open: false,
  },
  {
    q: "Do you manage social accounts?",
    a: "The core service is creative production and campaign support. We create the assets, captions, and creative direction your team can publish. Full account management can be discussed separately for the right long-term partnership.",
    open: false,
  },
  {
    q: "How is this lower-overhead than hiring?",
    a: "A single in-house creative, social, or digital hire typically costs $90K–$180K a year once you include salary, insurance, payroll taxes, software, recruiting, and management time. The usual workaround, juggling several freelancers, often leads to inconsistent monthly output and last-minute graphics right before a key event or season. Archer Design delivers the output of that role on a steady monthly cadence for a fixed fee, with no employment overhead and no replacement risk. Use the calculator above with your own numbers.",
    open: false,
  },
  {
    q: "Why start with 3–5 properties?",
    a: "It gives both sides a low-risk way to prove workflow, approvals, creative quality, and monthly cadence before expanding across more of the portfolio. We build the creative workflow, brand rules, motion style, and reporting structure on a manageable footprint first. Larger groups then expand on evidence, not promises.",
    open: false,
  },
  {
    q: "What's the difference between the free samples and the Starter Sprint?",
    a: "The 5 free sample assets are a small taste, enough to judge quality on your brand. The Starter Sprint is a full working engagement: 15 finished assets, a real campaign's worth of creative, delivered in 7 days. It's the fastest way to experience what a monthly partnership feels like, and the full $950 is credited toward your first month if you continue.",
    open: false,
  },
  {
    q: "Can you prove this drove bookings?",
    a: "We track what creative can honestly claim: impressions, reach, engagement, post clicks, profile actions, campaign response, and inquiry/booking-support signals where tracking is available. Direct booking attribution depends on your property's setup, and we can recommend simple tracking links, UTMs, Google Business tracking, and campaign codes during onboarding.",
    open: false,
  },
  {
    q: "What do you measure during a pilot?",
    a: "We measure creative output, impressions, reach, direct engagements, reactions, comments, shares, reported post clicks, link clicks where available, website traffic where access is available, Google Business Profile actions, Search Console visibility, and any inquiry or booking data the property is able to share. Weekly performance pulse checks and a monthly performance recap are included for pilots and ongoing retainers.",
    open: false,
  },
  {
    q: "Is this only social media?",
    a: "No. Social is one distribution channel. Archer Design supports the creative system behind property-level hospitality marketing: F&B and event promos, meeting and wedding assets, seasonal campaigns, spa and wellness campaigns, short-form motion, photo polishing, new branded creative, local SEO support, Google Business Profile support, and performance reporting. The assets live on social because that's where most hospitality audiences are, but the creative scope is broader.",
    open: false,
  },
  {
    q: "What's the commitment?",
    // TODO(devon): Replace with your real terms: month-to-month or 3-month minimum.
    a: "Most partnerships start monthly and can scale based on seasonality, property count, and campaign volume. Ask us about commitment terms during your pilot, we'll give you the straight answer.",
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
            path: "/hotel-groups",
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
          <nav className="flex items-center gap-5 text-sm text-[#A9A092]">
            <Link href="/" className="hidden hover:text-[#F6F1E7] sm:inline">Home</Link>
            <span className="hidden text-[#F6F1E7] sm:inline">Hotels</span>
            <a href="/restaurant-creative-support" className="hidden hover:text-[#F6F1E7] sm:inline">Restaurants</a>
            <a href="/spa-salon-creative-support" className="hidden hover:text-[#F6F1E7] sm:inline">Spas</a>
            <a href="/case-studies" className="hidden hover:text-[#F6F1E7] sm:inline">Proof</a>
            <a href="#packages" className="hidden hover:text-[#F6F1E7] sm:inline">Packages</a>
            <a
              href={siteConfig.creativeGapReviewUrl}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[#1a1407]"
              style={{ background: GOLD_GRADIENT }}
            >
              Request a Creative Gap Review →
            </a>
          </nav>
        </div>
      </header>

      <main>
        <MediaHero />

        {/* Trust bar, client logos only, no keyword tags */}
        <ClientLogoStrip />

        {/* What we help promote */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                What we help promote
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Built around the revenue moments hospitality teams already need to promote.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Hotels",
                  body: "Rooms, amenities, packages, local campaigns, guest experience, seasonal offers.",
                },
                {
                  title: "Restaurants & F&B",
                  body: "Menus, cocktails, brunch, rooftops, private dining, chef/event nights, seasonal offers.",
                },
                {
                  title: "Events, Meetings & Weddings",
                  body: "Meeting rooms, wedding spaces, corporate events, private dining, holiday parties, group sales moments.",
                },
                {
                  title: "Spas & Wellness",
                  body: "Treatments, gift cards, seasonal services, local awareness, openings, wellness experiences.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="glass-card flex flex-col gap-2 rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
                >
                  <h3 className="font-serif text-[17px] font-semibold text-[#F6F1E7]">{c.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-[#A9A092]">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Where hospitality creative breaks down */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                The real problem
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Where hospitality creative breaks down.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#A9A092]">
                Most hospitality teams are not short on things to promote. They are short on time,
                design support, motion assets, and a repeatable system for turning all those offers
                into polished creative.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Restaurant promos get rushed",
                  "Events are posted late",
                  "Meeting spaces are underused visually",
                  "Google Business updates fall behind",
                  "Seasonal offers do not get packaged clearly",
                  "Property teams rely on mismatched one-off graphics",
                  "Corporate marketing is stretched across too many properties",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.12)] bg-[rgba(5,5,5,0.28)] p-4 text-[14px] text-[#D8CFBE]"
                  >
                    <span className="mt-[5px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Creative support tied to real revenue moments */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                Why this works
              </span>
              <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                Creative support tied to real revenue moments.
              </h2>
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#A9A092]">
                Most hospitality businesses already have things worth promoting. The challenge is
                keeping those offers visible, polished, and consistent every month.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                We help turn those revenue moments into stronger creative:
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {[
                  "Hotel packages",
                  "Restaurant offers",
                  "Private dining",
                  "F&B events",
                  "Spa services",
                  "Gift cards",
                  "Wedding and meeting inquiries",
                  "Seasonal campaigns",
                  "Local events",
                  "Google Business updates",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[rgba(201,164,76,0.16)] bg-[rgba(201,164,76,0.04)] px-4 py-3 text-center text-[13px] text-[#D8CFBE]"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-7 text-[15px] leading-relaxed text-[#A9A092]">
                The goal is not more random content.
              </p>
              <p className="mt-2 font-serif text-[18px] text-[#F6F1E7]">
                The goal is cleaner creative output that helps people notice, click, inquire, book,
                or come back.
              </p>
            </div>
          </div>
        </section>

        {/* Pilot section, group pitch */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 md:items-start">
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                    Group partnerships
                  </span>
                  <h2 className="mt-3 font-serif text-[clamp(26px,3.5vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
                    Start with a focused 3–5 property pilot.
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                    For hotel groups, we don&apos;t recommend rolling creative support across the
                    entire portfolio on day one. The cleanest path is a focused pilot across 3–5
                    properties.
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                    That gives us time to build the creative workflow, approval process, brand rules,
                    motion style, campaign cadence, and reporting structure before expanding.
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                    It lowers risk for both sides: you judge real output on real properties for one
                    monthly fee, and expansion across the portfolio happens on evidence, property by
                    property, when the cadence is proven.
                  </p>
                  <div className="mt-6">
                    <a
                      href={siteConfig.creativeGapReviewUrl}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
                      style={{ background: GOLD_GRADIENT }}
                    >
                      Request a Creative Gap Review <span aria-hidden>→</span>
                    </a>
                    <p className="mt-3 text-[13px] text-[#A9A092]">
                      3-property pilots run $4,500–$5,500/month; 5-property pilots run $7,500–$8,500/month.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#A9A092]">
                    Best fit
                  </p>
                  {[
                    "Hotel groups with multiple properties",
                    "Properties with active F&B, events, meetings, weddings, or spa offerings",
                    "Teams that need more creative output without adding another hire",
                    "Groups that want better portfolio consistency",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[14.5px] text-[#A9A092]">
                      <span className="mt-[6px] shrink-0 text-[9px] text-[#C9A44C]">◆</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works, 3-step process */}
        <HowItWorks />

        {/* Featured short-form motion */}
        <FeaturedMotionShowcase />

        {/* Before/after positioning: everyday moments → premium campaign assets */}
        <BeforeAfterSection />

        <MetricsStrip />

        {/* Campaign results — 4 property cards with SHAIPE proof data */}
        <CampaignResults />

        {/* Top campaign moments — individual campaign highlights */}
        <TopCampaignMoments />

        {/* What we track + honest booking attribution + pilot framing */}
        <WhatWeTrack />

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

        {/* Sample assets (free) — first rung of the ladder */}
        <TrialCTA />

        {/* Starter Sprint (paid pilot) — second rung */}
        <StarterSprintSection />

        {/* Package navigation cards (Hotels / Spas / Restaurants) */}
        <PackagePathCards />

        {/* Full package listing, group leads */}
        <PackageCards />

        {/* Qualification: best fit / not a fit */}
        <FitSection />

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
            href={siteConfig.creativeGapReviewUrl}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Request a Creative Gap Review <span aria-hidden>→</span>
          </a>
          <p className="mt-3 text-[13px] text-[#A9A092]">Or request 5 sample assets, no card, 7 days, approval-ready.</p>
        </div>

        {/* SEO keyword row, moved from trust bar */}
        <p className="mt-8 text-[11px] text-[#A9A092]/50">
          Boutique Spas &middot; Hotel Restaurants &middot; Event Venues &middot; Multi-Property Groups &middot; F&amp;B Campaigns &middot; Local SEO
        </p>

        <AdminLink className="mt-4 inline-block text-[11px] text-[#A9A092]/40 transition-colors hover:text-[#C9A44C]" />
      </footer>
    </div>
  );
}
