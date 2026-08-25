import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Film,
  UtensilsCrossed,
  PartyPopper,
  Building2,
  Sun,
  Tag,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { TCRM_VIDEOS, TCRM_IMAGES } from "./tcrm-media";
import { Reveal } from "./components/Reveal";
import { LoadingIntro } from "./components/LoadingIntro";
import { TcrmHeader } from "./components/TcrmHeader";
import { TcrmClientHero } from "./components/TcrmClientHero";
import { ClientLogoStrip } from "./components/ClientLogoStrip";
import { HowThisWorks } from "./components/HowThisWorks";
import { CreativeTypePreview } from "./components/CreativeTypePreview";
import { CreativePlans } from "./components/CreativePlans";
import { PlanFlexibilityNotice } from "./components/PlanFlexibilityNotice";
import { StarterPlanCard } from "./components/StarterPlanCard";
import { AssetPackBuilder } from "./components/AssetPackBuilder";
import { CreativePlanComparison } from "./components/CreativePlanComparison";
import { PROOF_STATS, PROOF_DISCLAIMER } from "./tcrm-content";
import { NonHotelWork } from "./components/NonHotelWork";
import { TcrmTestimonials } from "./components/TcrmTestimonials";
import { MotionDesignShowcase } from "./components/MotionDesignShowcase";

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- this string must NOT repeat that
// suffix itself, or the rendered <title> duplicates it.
const PAGE_TITLE = "TCRM Creative Activation";
const PAGE_DESCRIPTION =
  "Specialized hospitality creative production for TCRM hotel clients, powered by Archer Design.";

// Reached only via a direct link shared by a TCRM contact -- never linked
// from the main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which
// intentionally omits this route), or footer.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/tcrm") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/* ── Content ─────────────────────────────────────────────────────────────── */

// Selected hospitality work -- real stills/motion already in the project.
// One representative piece per commercial category a property's creative
// needs tend to fall into.
const WORK_CATEGORIES = [
  {
    icon: Film,
    label: "Motion & short-form reels",
    desc: "Short-form video built to carry a revenue priority across social and paid placements.",
    media: {
      type: "video" as const,
      src: "/tcrm/videos/hotel-arrival-vintage-car.mp4",
      alt: "Hotel arrival motion clip",
    },
  },
  {
    icon: UtensilsCrossed,
    label: "F&B & restaurant promotions",
    desc: "Menu, happy-hour, and restaurant-push creative built to move on-property F&B revenue.",
    media: { type: "image" as const, src: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png", alt: "Eliza Hot Metal Bistro monthly menu graphic", width: 1322, height: 1792 },
  },
  {
    icon: PartyPopper,
    label: "Meetings, weddings & events",
    desc: "Room-block, wedding, and group-event visuals that support meetings and catering revenue.",
    media: { type: "image" as const, src: "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png", alt: "Hotel Indigo Pittsburgh wedding room block visual", width: 1326, height: 1792 },
  },
  {
    icon: Building2,
    label: "Branded hotel campaign adaptations",
    desc: "Brand-safe creative adapted to a flagged hotel's standards, built for franchise/brand review.",
    media: { type: "image" as const, src: "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png", alt: "Hampton Inn Johnstown Flood City Music Festival campaign", width: 1334, height: 1576 },
  },
  {
    icon: Sun,
    label: "Seasonal & local-demand campaigns",
    desc: "Property-level assets built around a seasonal amenity or local demand driver.",
    media: { type: "image" as const, src: "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png", alt: "Hampton Inn Johnstown pool and patio seasonal visual", width: 1346, height: 1816 },
  },
  {
    icon: Tag,
    label: "Package & portfolio-consistent creative",
    desc: "A repeatable visual system that keeps package and offer creative consistent across a feed.",
    media: { type: "image" as const, src: "/tcrm/images/hotel-indigo-pittsburgh-instagram-grid.png", alt: "Hotel Indigo Pittsburgh Instagram grid showing consistent creative system", width: 3024, height: 2202 },
  },
];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function TcrmPage() {
  return (
    <div id="top" className={`${fraunces.variable} tcrm-theme archer-studio relative min-h-screen`}>
      <LoadingIntro />
      <TcrmHeader />

      <main>
        <TcrmClientHero />

        <ClientLogoStrip />

        {/* ══════════════════════ CREATIVE PRODUCTION PARTNER ══════════════════════ */}
                <MotionDesignShowcase />


        {/* ══════════════════════ STILLS & CAMPAIGNS ══════════════════════ */}
        <section id="stills" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Stills &amp; campaigns</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Feed-ready creative from real properties.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Hospitality graphics covering hotels, restaurants, spas, meetings, events, packages, and
                seasonal campaigns, shown large and true to their original proportions.
              </p>
            </Reveal>
            <Reveal delay={2} className="tl-gallery-frame mt-10">
              <div className="archer-studio">
                <WorkPageStillsGallery items={TCRM_IMAGES} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ SELECTED HOSPITALITY WORK ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Selected hospitality work</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Guest-facing creative in action.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Real, already-produced work spanning the commercial situations a property's revenue
                priorities tend to fall into.
              </p>
            </Reveal>

            <div className="tl-work-grid mt-10">
              {WORK_CATEGORIES.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Reveal key={cat.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="tl-work-card">
                    <div className="tl-work-media">
                      {cat.media.type === "video" ? (
                        <LazyVideo src={cat.media.src} label={cat.media.alt} className="h-full w-full object-cover" />
                      ) : (
                        <Image
                          src={cat.media.src}
                          alt={cat.media.alt}
                          width={cat.media.width}
                          height={cat.media.height}
                          sizes="(min-width: 768px) 33vw, 50vw"
                          loading="lazy"
                        />
                      )}
                      <span className="tl-work-media-badge">
                        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                        {cat.media.type === "video" ? "Motion" : "Still"}
                      </span>
                    </div>
                    <div className="tl-work-body">
                      <h3 className="tl-work-label tl-serif">{cat.label}</h3>
                      <p className="tl-work-desc">{cat.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <NonHotelWork />

        <HowThisWorks />

        <CreativeTypePreview />

        <PlanFlexibilityNotice />

        <CreativePlans />

        {/* ══════════════════════ FLEXIBLE WAYS TO START ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Flexible ways to start</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Not ready for a monthly program? Start smaller.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Two lower-commitment ways to try the workflow or cover a single creative need, no ongoing
                program required.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <StarterPlanCard />
              <AssetPackBuilder />
            </div>
          </div>
        </section>

        <CreativePlanComparison />

        {/* ══════════════════════ FINAL CTA ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-glow-cyan" aria-hidden="true" />
          <Reveal className="tl-shell relative mx-auto max-w-3xl text-center">
            <span className="tl-hline mx-auto mb-9 max-w-xs" aria-hidden="true" />
            <p className="tl-eyebrow">Next step</p>
            <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.5rem]">
              Turn your next revenue priority into finished creative.
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
              Choose a monthly plan, start a 30-day creative month, or build a one-off pack. Whatever you
              select, your TCRM contact stays involved throughout. Monthly plans
              remain flexible, with optional longer-term agreement savings
              available through TCRM.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="#plans" className="tl-btn">
                Choose Your Creative Plan
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </a>
              <Link href="/tcrm/schedule" className="tl-btn-ghost">
                Talk With Your TCRM Contact
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="tl-footer">
        <div className="tl-shell flex flex-col items-center gap-5 text-center">
          <span className="tl-wordmark" aria-hidden="true">
            <span className="tl-wordmark-prep">TCRM Creative Activation</span>
            Powered by Archer Design
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            Creative production for TCRM hotel clients, delivered through Archer Design. TCRM remains your
            strategy and relationship contact throughout.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Creative production partner to TCRM
          </p>
        </div>
      </footer>
    </div>
  );
}
