import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  X,
  ArrowRight,
  Layers,
  CalendarRange,
  TrendingUp,
  Film,
  UtensilsCrossed,
  PartyPopper,
  Building2,
  Sun,
  Tag,
  Images,
  Eye,
  Users,
  Heart,
  Quote,
  Smartphone,
  Target,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { TCRM_VIDEOS, TCRM_IMAGES } from "./tcrm-media";
import { Reveal } from "./components/Reveal";
import { LoadingIntro } from "./components/LoadingIntro";
import { PortfolioCalculator } from "./components/PortfolioCalculator";
import { TcrmHeader } from "./components/TcrmHeader";
import { HeroVideoBackground } from "./components/HeroVideoBackground";
import {
  ACTIVATION_TIERS,
  CORE_INCLUDES,
  DEFAULT_TIER_KEY,
  MAX_SUPPORTED_HOTELS,
  PILOT_HOTEL_COUNT,
  fmtMoney,
  fmtPct,
  grossProfit,
  marginPct,
  platformFiles,
  totalConcepts,
  type ActivationTier,
} from "./tcrm-pricing";

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- this string must NOT repeat that
// suffix itself, or the rendered <title> duplicates it. The final rendered
// title is exactly "Proposed Creative Production Model for TCRM | Archer
// Design", matching spec.
const PAGE_TITLE = "Proposed Creative Production Model for TCRM";
const PAGE_DESCRIPTION =
  "A proposed white-label hotel creative-production model prepared for Total Customized Revenue Management.";

// Private, personalized proposal -- never indexed, never linked from the main
// nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits this
// route), footer, or public portfolio. Accessible only via the direct URL.
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

const TRUST_BAR = ["White-label available", "TCRM retains the client", "Brand-safe creative"];
const TRUST_ICONS = [ShieldCheck, Lock, CheckCircle2];

// Real, already-approved aggregate results reused verbatim from the same
// figures shown on this project's other private proposal pages. Nothing
// here is TCRM-specific; it demonstrates Archer Design's existing body of
// hospitality creative work.
const PROOF_STATS = [
  { value: "2.7K+", label: "Creative pieces delivered", icon: Images },
  { value: "18.6M+", label: "Impressions delivered", icon: Eye },
  { value: "4.9M+", label: "People reached", icon: Users },
  { value: "612K+", label: "Engagements generated", icon: Heart },
];
const PROOF_DISCLAIMER =
  "Tracked across supported hospitality campaigns. Built to demonstrate the body of work, not to guarantee a future result.";

/* ── Revenue Priority Creative Activation: three pricing tiers ────────────
   All pricing/deliverable data lives in ./tcrm-pricing.ts (shared with the
   calculator and the schedule page) so a number can never drift between
   the three places it appears. Every derived figure here (gross profit,
   margin, platform-ready file counts, pilot totals) is computed from that
   shared data, never hardcoded a second time. */
function fmtAssetPrice(n: number) {
  return `$${n.toFixed(2)}/asset`;
}

// Comparison-row definitions for the three-tier table below the pricing
// cards. Each row's cells are computed live from the tier data (via the
// `cell` function) rather than hardcoded per tier, so the table can never
// drift from the pricing cards above it.
const TIER_COMPARISON_ROWS: { label: string; cell: (t: ActivationTier) => string }[] = [
  {
    label: "Original creative concepts",
    cell: (t) => `${totalConcepts(t)} (${t.motionConcepts} motion + ${t.staticConcepts} static)`,
  },
  { label: "Platform-ready files", cell: (t) => `${platformFiles(t)} files` },
  { label: "Promotional captions", cell: (t) => `${t.captions} captions` },
  { label: "Suggested hotel-facing retail", cell: (t) => `${fmtMoney(t.retail)} / property / month` },
  { label: "Archer Design wholesale", cell: (t) => `${fmtMoney(t.wholesale)} / property / month` },
  {
    label: "Illustrative TCRM gross profit",
    cell: (t) => `${fmtMoney(grossProfit(t))} / property / month`,
  },
];

/** Compact "5 + 3 = 8" style visual breakdown, reused on the package cards
 * and the pilot section so the concept count is unmistakable everywhere it
 * appears. */
function AssetEquation({
  parts,
  total,
  totalLabel,
  size = "md",
}: {
  parts: { value: number; label: string; op?: string }[];
  total: number;
  totalLabel: string;
  size?: "md" | "lg";
}) {
  return (
    <div className={`tl-asset-eq${size === "lg" ? " tl-asset-eq--lg" : ""}`}>
      {parts.map((p, i) => (
        <Fragment key={p.label}>
          {i > 0 && (
            <span className="tl-asset-eq-op" aria-hidden="true">
              {p.op ?? "+"}
            </span>
          )}
          <div className="tl-asset-eq-part">
            <span className="tl-asset-eq-num">{p.value}</span>
            <span className="tl-asset-eq-label">{p.label}</span>
          </div>
        </Fragment>
      ))}
      <span className="tl-asset-eq-op tl-asset-eq-op--equals" aria-hidden="true">
        =
      </span>
      <div className="tl-asset-eq-part tl-asset-eq-part--total">
        <span className="tl-asset-eq-num">{total}</span>
        <span className="tl-asset-eq-label">{totalLabel}</span>
      </div>
    </div>
  );
}

// "More than a folder of graphics" section, immediately after the pricing
// cards -- explains why an original concept is worth more than its file
// count implies.
const SWEETENING_CARDS = [
  {
    icon: Smartphone,
    title: "Platform ready",
    body: "Vertical, feed, Story, and cover-frame versions are organized for immediate use.",
  },
  {
    icon: Target,
    title: "Commercially accurate",
    body: "Rates, dates, restrictions, booking paths, and promotional details are based on information approved by TCRM.",
  },
  {
    icon: ShieldCheck,
    title: "Brand safe",
    body: "Creative is produced using approved hotel materials, franchise standards, and established property direction.",
  },
  {
    icon: Tag,
    title: "White-label organized",
    body: "Files are clearly labeled and delivered through TCRM without introducing another visible agency relationship.",
  },
];

/* ── Track B: capacity for network partners ─────────────────────────────
   A second, separate offer: fixed monthly asset banks, priced per asset,
   available to TCRM directly or to any partner agency already inside
   TCRM's network. Per-asset price is computed from the bank price and
   asset count below, never hardcoded, so it can never drift. */
const ASSET_BANK_TIERS = [
  { assets: 12, price: 1050 },
  { assets: 24, price: 1920 },
  { assets: 48, price: 3360 },
];

const ASSET_BANK_NOTES = [
  "Assets are allocated from the bank across whichever properties need them that month",
  "Unused assets do not roll over to the following month",
  "All execution remains brand-safe and subject to the same approval workflow as every other package",
  "Delivery is white-label, with no Archer Design attribution visible to the partner's client",
  "The partner agency retains its own client relationships throughout",
];

// Selected hospitality work -- real stills/motion already in the project.
// One representative piece per commercial category a TCRM revenue priority
// tends to fall into.
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

/* Two-column proposed model: TCRM's revenue-strategy layer and Archer
   Design's creative-production layer are the only two columns. */
const ROLES = [
  {
    key: "tcrm" as const,
    name: "TCRM",
    tag: "Revenue strategy and client leadership",
    items: [
      "Identifies the commercial opportunity",
      "Defines the revenue objective",
      "Confirms rates, dates, restrictions, and booking paths",
      "Controls the hotel relationship",
      "Approves strategy and messaging",
      "Retains final client approval",
    ],
  },
  {
    key: "archer" as const,
    name: "Archer Design",
    tag: "Guest-facing creative production",
    items: [
      "Short-form motion and reels",
      "Social and campaign graphics",
      "Package and direct-booking visuals",
      "F&B, event, meeting, and wedding assets",
      "Property adaptations and platform exports",
    ],
  },
];

const COMMITMENTS = [
  "TCRM owns and manages the client relationship",
  "Fully white-label delivery is available",
  "No independent solicitation of TCRM clients",
  "No direct hotel communication without authorization",
  "TCRM controls strategy and final approval",
  "Responsibilities are documented before work begins",
];

const PILOT_MIX = [
  "One branded select-service hotel",
  "One independent, lifestyle, or boutique hotel",
  "One resort or property with significant F&B, meeting, event, or wedding demand",
];

/* Four-step operating workflow, numbered 1-4. */
const PILOT_WORKFLOW = [
  "TCRM selects the properties and priorities",
  "TCRM supplies approved source materials, brand standards, and confirmed commercial details",
  "Archer Design produces the creative",
  "TCRM reviews before hotel delivery",
];

const PILOT_TERMS = [
  "TCRM retains the hotel relationship",
  "TCRM approves every commercial priority",
  "Existing approved photography and brand materials must be supplied",
  "Turnaround begins after the brief and source assets are complete",
  "Revenue Priority Creative Activation does not include publishing, account management, paid media, photography, analytics, comment management, or direct-message management",
  "A different activation level may be selected for the pilot or after conversion by mutual agreement",
  "Rush work and additional concepts require separate approval",
  "No booking, engagement, occupancy, RevPAR, or revenue result is guaranteed",
];

const SUCCESS_CRITERIA = [
  "Revenue recommendations became easier to activate",
  "Assets were commercially accurate",
  "Creative met property and brand requirements",
  "Approvals were simple and centralized",
  "Hotels used the finished work",
  "The process reduced production pressure",
  "Enough recurring demand exists for a monthly asset bank",
];

const EXPANSION = [
  {
    icon: Layers,
    title: "Property activation add-on",
    body: "Recurring creative support for selected hotels.",
  },
  {
    icon: TrendingUp,
    title: "Monthly portfolio asset bank",
    body: "A defined production capacity TCRM can allocate across the hotels with the greatest current need.",
  },
  {
    icon: CalendarRange,
    title: "Seasonal and onboarding support",
    body: "Temporary capacity for launches, seasonal campaigns, transitions, and unusually heavy request periods.",
  },
];

/* Working terms, placed before the final CTA. */
const COMMERCIAL_TERMS = [
  { term: "Pilot", detail: "Thirty days, fixed scope, no ongoing commitment" },
  { term: "Initial term after conversion", detail: "Ninety days, then month to month" },
  { term: "Notice", detail: "Thirty days written, either side" },
  { term: "Invoicing", detail: "Monthly in advance, net fifteen" },
  { term: "Turnaround", detail: "Begins when brief, brand standards, and approved source assets are complete" },
  { term: "Rush and additional concepts", detail: "Scoped and approved separately" },
  { term: "Exclusivity", detail: "None in either direction unless agreed in writing" },
  { term: "Documentation", detail: "Responsibilities, approval chain, and escalation path documented before work begins" },
];

// Real, already-approved language reused verbatim from
// app/social-media-work/page.tsx (read-only reference, not edited here).
// This is proof of Archer Design's own execution quality on an existing,
// unrelated client relationship -- it is NOT a TCRM endorsement, and is
// framed that way below. Do not alter the qualification line.
const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
const CONFIDENCE_SUPPORTING =
  "That result came from connecting events, F&B, meetings, local demand drivers, seasonal priorities, and property storytelling to one consistent creative and content calendar -- the same kind of execution this proposed model would bring to a TCRM-identified priority.";
const CONFIDENCE_QUALIFICATION =
  "Performance statement reflects reporting shared by the property during the engagement and should not be interpreted as an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to TCRM, and not a TCRM endorsement.";

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function TcrmPage() {
  return (
    <div id="top" className={`${fraunces.variable} tcrm-theme archer-studio relative min-h-screen`}>
      <LoadingIntro />
      <TcrmHeader />

      <main>
        {/* ══════════════════════ HERO (video-background) ══════════════════════ */}
        <section className="tl-hero--video">
          <HeroVideoBackground
            src="/tcrm/videos/tcrm-hero.mp4"
            poster="/tcrm/images/tcrm-hero-poster.webp"
            alt="Hotel arrival with vintage car, The Wayfinder"
          />
          <div className="tl-hero-overlay" aria-hidden="true" />

          <div className="tl-shell relative z-[3]">
            <Reveal className="tl-hero-content">
              <p className="tl-eyebrow">Prepared for Total Customized Revenue Management</p>
              <span className="mt-4 block h-px w-12 bg-[#7fe0d0] opacity-80" aria-hidden="true" />
              <h1 className="mt-5 text-[2.05rem] leading-[1.14] sm:text-[2.5rem] lg:text-[2.75rem]">
                The revenue opportunity is identified.
                <br />
                The creative should be ready to run.
              </h1>
              <p className="tl-hero-copy mt-5 max-w-[42ch] text-[14.5px] leading-[1.65]">
                TCRM identifies where revenue can be won and owns the client relationship. Archer Design
                turns that priority into finished, brand-safe, guest-facing creative, delivered white-label
                behind TCRM.
              </p>

              {/* Partnership proof: TCRM's mark and Archer Design's mark
                  side by side, not a combined lockup. */}
              <div className="tl-partnership-card mt-5">
                <span className="tl-partnership-logo-chip">
                  <Image
                    src="/tcrm/logos/tcrm-logo.png"
                    alt="Total Customized Revenue Management"
                    width={352}
                    height={110}
                    className="tl-partnership-logo"
                  />
                </span>
                <p className="tl-partnership-card-text">
                  Creative production by Archer Design, delivered behind TCRM&rsquo;s client relationship.
                </p>
              </div>

              {/* Real, already-approved proof numbers, same figures as the
                  Proof of Execution section below, surfaced immediately. */}
              <div className="tl-metrics-band mt-5">
                {PROOF_STATS.map((s) => (
                  <div key={s.label} className="tl-metric">
                    <s.icon className="tl-metric-icon" size={15} strokeWidth={1.75} aria-hidden="true" />
                    <p className="tl-metric-value">{s.value}</p>
                    <p className="tl-metric-label">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-stretch gap-3.5">
                <Link href="/tcrm/schedule" className="tl-btn">
                  Review the 30-day pilot
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </Link>
                <a href="#work" className="tl-btn-ghost tl-btn-ghost--on-dark">
                  See selected hospitality work
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>

              <div className="tl-trust-bar mt-6">
                {TRUST_BAR.map((label, i) => {
                  const Icon = TRUST_ICONS[i] ?? ShieldCheck;
                  return (
                    <span key={label} className="tl-trust-chip tl-trust-chip--on-dark">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </span>
                  );
                })}
              </div>
            </Reveal>

            {/* Hotel Indigo, the single strongest existing proof point,
                highlighted as its own card rather than a line of copy. */}
            <Reveal delay={2} className="tl-proof-float">
              <Quote className="tl-proof-float-mark" size={22} strokeWidth={0} fill="currentColor" aria-hidden="true" />
              <p className="tl-proof-float-text">{CONFIDENCE_QUOTE}</p>
              <span className="tl-hline my-4" aria-hidden="true" />
              <p className="tl-proof-float-qualifier">{CONFIDENCE_QUALIFICATION}</p>
            </Reveal>
          </div>

          <div className="tl-hero-fade" aria-hidden="true" />
        </section>

        {/* ══════════════════════ MOTION LIBRARY ══════════════════════ */}
        <section id="motion" className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Motion library</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Still photography, brought to life for ads, websites, and campaigns.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Many of these pieces began as still photographs. Archer Design used motion design,
                compositing, environmental animation, and VFX techniques to turn them into cinematic assets
                for hotel websites, commercials, digital ads, social campaigns, and property storytelling.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                The clips are intentionally shown without permanent text overlays because they were
                designed as flexible visual foundations. Headlines, offers, logos, buttons, and calls to
                action can be added later based on the final website, advertisement, or campaign placement.
              </p>
              <div className="tl-callout mt-6">
                <p className="tl-callout-label">Why there is no text</p>
                <p className="tl-callout-copy">
                  These are clean motion assets created for websites, commercials, and advertisements.
                  Final campaign copy and branding are applied according to the intended placement.
                </p>
              </div>
            </Reveal>
            <Reveal delay={2} className="tl-gallery-frame mt-10">
              <div className="archer-studio">
                <MotionPortfolioGallery items={TCRM_VIDEOS} />
              </div>
            </Reveal>
          </div>
        </section>

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

        {/* ══════════════════════ PACKAGES: REVENUE PRIORITY CREATIVE ACTIVATION ══════════════════════ */}
        <section id="packages" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Revenue Priority Creative Activation</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Choose the activation level.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Different hotels have different commercial needs. A select-service property promoting one
                seasonal offer should not require the same production capacity as a resort managing F&amp;B,
                weddings, meetings, events, and multiple revenue priorities.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Each level gives TCRM a defined amount of white-label creative production that can be
                matched to the property&rsquo;s current need.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                TCRM retains control of the hotel relationship, final pricing, strategy, approvals, and
                delivery.
              </p>
            </Reveal>

            <div className="mt-11 grid gap-6 lg:grid-cols-3">
              {ACTIVATION_TIERS.map((tier, i) => (
                <Reveal
                  key={tier.key}
                  delay={(i + 1) as 1 | 2 | 3}
                  className={`tl-panel${tier.badge ? " tl-panel--featured" : ""} flex flex-col p-7 sm:p-8`}
                >
                  {tier.badge ? <span className="tl-pkg-badge">{tier.badge}</span> : null}
                  <h3 className="mt-1 text-[21px] text-[var(--tl-ink)]">{tier.name}</h3>
                  <p className="tl-pkg-price mt-2">{fmtMoney(tier.retail)} per property / month</p>
                  <p className="mt-1 text-[12px] text-[var(--tl-ink-muted)]">
                    Archer Design wholesale {fmtMoney(tier.wholesale)} &middot; TCRM keeps{" "}
                    {fmtMoney(grossProfit(tier))}
                  </p>

                  <span className="tl-hline my-6" aria-hidden="true" />

                  <AssetEquation
                    parts={[
                      { value: tier.motionConcepts, label: "Motion concepts" },
                      { value: tier.staticConcepts, label: "Static concepts" },
                    ]}
                    total={totalConcepts(tier)}
                    totalLabel="Original concepts"
                  />

                  <div className="tl-pkg-econ mt-5">
                    <div className="tl-pkg-econ-row">
                      <span>Platform-ready files</span>
                      <span>{platformFiles(tier)}</span>
                    </div>
                    <div className="tl-pkg-econ-row">
                      <span>Promotional captions</span>
                      <span>{tier.captions}</span>
                    </div>
                  </div>

                  <span className="tl-hline my-6" aria-hidden="true" />

                  <ul className="flex flex-col gap-2.5">
                    {tier.features.map((item) => (
                      <li key={item} className="tl-check">
                        <span className="tl-check-icon" aria-hidden="true">
                          <CheckCircle2 size={11} strokeWidth={2} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="tl-pkg-bestfor">Best for: {tier.bestFor}</p>

                  <Link href={`/tcrm/schedule?tier=${tier.key}`} className="tl-btn mt-6">
                    Choose a three-property pilot
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* Pricing footer note, required directly beneath the three cards. */}
            <Reveal delay={2} className="mt-8">
              <p className="text-[11.5px] leading-relaxed text-[var(--tl-ink-muted)]">
                Suggested retail pricing is illustrative only. TCRM retains control of the final
                hotel-facing price, client presentation, and commercial relationship. Archer Design
                invoices TCRM only for the selected wholesale production level.
              </p>
            </Reveal>

            {/* Best-starting-point callout, near the pricing cards. */}
            <Reveal delay={2} className="tl-callout mt-6">
              <p className="tl-callout-label">Best starting point</p>
              <p className="tl-callout-copy">
                Growth Activation gives each property more than one original motion concept per week,
                supporting static campaign creative, platform adaptations, captions, and a simple
                activation calendar without creating unnecessary production volume.
              </p>
            </Reveal>

            {/* Tier comparison, clean rows instead of a third repetition of the bullet lists above. */}
            <Reveal delay={3} className="mt-10">
              <p className="tl-pkg-subhead">Activation level comparison</p>
              <div className="tl-compare mt-4">
                <div className="tl-compare-row tl-compare-row--tiers tl-compare-row--head">
                  <span />
                  {ACTIVATION_TIERS.map((t) => (
                    <span key={t.key}>{t.name}</span>
                  ))}
                </div>
                {TIER_COMPARISON_ROWS.map((row) => (
                  <div key={row.label} className="tl-compare-row tl-compare-row--tiers">
                    <span className="tl-compare-label">{row.label}</span>
                    {ACTIVATION_TIERS.map((t) => (
                      <span key={t.key}>{row.cell(t)}</span>
                    ))}
                  </div>
                ))}
              </div>
              <p className="tl-pkg-framing mt-4">Every activation level also includes:</p>
              <ul className="mt-3 flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-x-8">
                {CORE_INCLUDES.map((item) => (
                  <li key={item} className="tl-check">
                    <span className="tl-check-icon" aria-hidden="true">
                      <CheckCircle2 size={11} strokeWidth={2} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ MORE THAN A FOLDER OF GRAPHICS ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <h2 className="text-[1.6rem] leading-[1.2] sm:text-[1.9rem]">
                More than a folder of graphics.
              </h2>
              <p className="mt-4 text-[14.5px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Every original concept is prepared as a practical campaign asset that a hotel team can
                actually use. Motion is delivered for vertical and feed placements, static cover frames are
                included, campaign graphics are adapted for both feed and Story use, and concise
                promotional captions help the property activate the work without starting from a blank
                page.
              </p>
            </Reveal>

            <Reveal delay={2} className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SWEETENING_CARDS.map((c) => (
                <div key={c.title} className="tl-commit">
                  <span className="tl-commit-icon" aria-hidden="true">
                    <c.icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-[var(--tl-ink)]">{c.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--tl-ink-soft)]">{c.body}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ TRACK B: CAPACITY FOR NETWORK PARTNERS ══════════════════════
            New section, placed immediately after the two packages per spec.
            A separate, fixed-price asset-bank offer for boutique or regional
            agencies already inside TCRM's own partner network. */}
        <section id="track-b" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">A second track</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                A second option: production capacity for the partners already in your network.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Some of the boutique and regional agencies already inside TCRM&rsquo;s partner network are
                strong on strategy and account management but run out of internal production capacity
                during peak season, launches, or unusually heavy request periods.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Rather than TCRM sourcing a new production vendor for those partners individually, Archer
                Design can sit behind them the same way it sits behind TCRM: white-label, brand-safe, and
                never visible to the partner&rsquo;s own client relationship.
              </p>
            </Reveal>

            <div className="mt-11 grid gap-6 md:grid-cols-3">
              {ASSET_BANK_TIERS.map((tier, i) => (
                <Reveal key={tier.assets} delay={(i + 1) as 1 | 2 | 3} className="tl-panel flex flex-col p-7 sm:p-8">
                  <p className="tl-role-tag">Bank {tier.assets}</p>
                  <h3 className="mt-2 text-[21px] text-[var(--tl-ink)]">{tier.assets} assets / month</h3>
                  <p className="tl-pkg-price mt-2">{fmtMoney(tier.price)} monthly</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                    {fmtAssetPrice(tier.price / tier.assets)}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={2} className="mt-10">
              <p className="tl-pkg-subhead">How the asset bank works</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {ASSET_BANK_NOTES.map((note) => (
                  <li key={note} className="tl-check">
                    <span className="tl-check-icon" aria-hidden="true">
                      <CheckCircle2 size={11} strokeWidth={2} />
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink)]">
                This track is available directly to TCRM or to any partner agency TCRM chooses to
                introduce.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ PORTFOLIO EARNINGS CALCULATOR ══════════════════════ */}
        <section id="calculator" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Portfolio earnings calculator</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                See what the creative layer could add across TCRM&rsquo;s portfolio.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Select an activation level and a participating-property count to see the suggested
                hotel-facing revenue, Archer Design wholesale cost, and illustrative TCRM gross profit
                update instantly.
              </p>
              <p className="mt-4 text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
                TCRM publicly reports supporting 700+ hotels historically, with daily revenue management
                support for 70+ properties. This calculator uses 70 properties as an illustrative upper
                limit only; no participation level or revenue is guaranteed.
              </p>
            </Reveal>

            <Reveal delay={2} className="mt-10">
              <PortfolioCalculator
                maxHotels={MAX_SUPPORTED_HOTELS}
                defaultHotels={10}
                defaultTierKey={DEFAULT_TIER_KEY}
              />
            </Reveal>

            {/* Neutral capacity note, replacing any implied maximum monthly
                capacity figure. */}
            <Reveal delay={3} className="tl-callout mt-8">
              <p className="tl-callout-label">Capacity and rollout</p>
              <p className="tl-callout-copy">
                Final production capacity and rollout timing would be confirmed jointly before a
                portfolio-wide launch. Larger portfolios may be activated in phases to protect quality,
                turnaround, and approval consistency.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ PROOF OF EXECUTION ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Proof of execution</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Existing Archer Design hospitality results.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Not projections for TCRM, but the tracked body of work Archer Design has already produced
                for hotel and hospitality clients.
              </p>
            </Reveal>
            <Reveal delay={2} className="tl-stat-band mt-10">
              {PROOF_STATS.map((s) => (
                <div key={s.label} className="tl-stat">
                  <p className="tl-stat-value">{s.value}</p>
                  <p className="tl-stat-label">{s.label}</p>
                </div>
              ))}
            </Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-center text-[11.5px] leading-relaxed text-[var(--tl-ink-muted)]">
              {PROOF_DISCLAIMER}
            </p>
          </div>
        </section>

        {/* ══════════════════════ THE EXECUTION GAP ══════════════════════ */}
        <section id="gap" className="tl-section">
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal>
              <p className="tl-eyebrow">The execution gap</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Your strategy should not stall at &ldquo;the hotel should promote this.&rdquo;
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <div className="tl-gap-band">
                <p className="text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                  TCRM&rsquo;s task force, remote revenue management, and system configuration and audit
                  engagements consistently surface a similar finding: a package needs a graphic, a soft
                  period needs a push, a property needs its offer visuals brought current. The
                  recommendation is documented and the commercial details are confirmed.
                </p>
                <p className="mt-5 text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                  What often stalls between the recommendation and the launch is the last mile: the reel
                  that turns the offer into something guests actually see, the graphic built to the
                  property&rsquo;s brand standards, the adapted asset for a franchise-flagged hotel, the F&amp;B
                  or event visual tied to a real date, the sales collateral a property team can hand a
                  group or corporate account.
                </p>
                <p className="mt-6 text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink)]">
                  This model closes that gap without asking TCRM to build an internal production team or
                  add another full-service agency to the network.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ PARTNER NETWORK BOUNDARIES ══════════════════════
            New section, placed immediately after The Execution Gap (see the
            final report's flagged judgment calls for why it sits here
            rather than immediately before Packages). */}
        <section id="boundaries-network" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">The most important boundary</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Built to sit alongside the TCRM partner network, not compete with it.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                TCRM already works with a network of digital, marketing, and agency partners across its
                managed portfolio. This model is scoped narrowly on purpose: guest-facing creative
                production only, delivered white-label, with clear boundaries around everything that
                belongs to TCRM, the hotel, or an existing partner.
              </p>
            </Reveal>

            <div className="mt-11 grid gap-6 lg:grid-cols-2">
              <Reveal delay={1} className="tl-panel p-7 sm:p-8">
                <h3 className="text-[17px] text-[var(--tl-ink)]">Outside Archer Design&rsquo;s scope by design</h3>
                <span className="tl-hline my-5" aria-hidden="true" />
                <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                  {[
                    "Paid advertising and media spend",
                    "On-site photography",
                    "On-site filming or crew production",
                    "Community, comment, and inbox management",
                    "Review and reputation management",
                    "Influencer management",
                    "Website design and development",
                    "SEO and local listings management",
                    "Brand strategy and full brand redesigns",
                    "Crisis communications",
                  ].map((item) => (
                    <li key={item} className="tl-excl">
                      <span className="tl-excl-icon" aria-hidden="true">
                        <X size={10} strokeWidth={2.25} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={2} className="tl-panel tl-panel--archer p-7 sm:p-8">
                <h3 className="text-[17px] text-[var(--tl-ink)]">Inside Archer Design&rsquo;s scope</h3>
                <span className="tl-hline my-5" aria-hidden="true" />
                <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                  {[
                    "Short-form motion from existing assets",
                    "Social and campaign graphics",
                    "F&B, event, meeting, and wedding creative",
                    "Package and direct-booking visuals",
                    "Property-level adaptations and platform exports",
                    "Franchise and brand-standard compliant execution",
                    "Sales-support and collateral assets",
                  ].map((item) => (
                    <li key={item} className="tl-check">
                      <span className="tl-check-icon" aria-hidden="true">
                        <CheckCircle2 size={11} strokeWidth={2} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={3} className="mt-10 text-center">
              <p className="mx-auto max-w-2xl text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink-soft)]">
                If a request falls outside this list, it is out of scope by default until TCRM and Archer
                Design agree otherwise in writing.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ SELECTED HOSPITALITY WORK ══════════════════════ */}
        <section id="work" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Selected hospitality work</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Guest-facing creative in action.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Real, already-produced work spanning the commercial situations a TCRM revenue priority
                tends to fall into.
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

        {/* ══════════════════════ THE PROPOSED MODEL (two columns) ══════════════════════ */}
        <section id="model" className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">The proposed model</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                One TCRM priority. One execution partner.
              </h2>
            </Reveal>

            <div className="mt-12 flex flex-col items-stretch gap-6 lg:flex-row lg:gap-0">
              {ROLES.map((role, i) => (
                <Fragment key={role.key}>
                  {i > 0 && <span className="tl-card-connector" aria-hidden="true" />}
                  <Reveal delay={(i + 1) as 1 | 2} className={`tl-panel tl-panel--${role.key} flex-1 p-7 sm:p-8`}>
                    <h3 className="text-[19px] text-[var(--tl-ink)]">{role.name}</h3>
                    <p className={`tl-role-tag tl-role-tag--${role.key} mt-2`}>{role.tag}</p>
                    <span className="tl-hline my-5" aria-hidden="true" />
                    <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                      {role.items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span className={`tl-dot${role.key !== "tcrm" ? ` tl-dot--${role.key}` : ""}`} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </Fragment>
              ))}
            </div>

            <Reveal delay={3} className="mt-10 text-center">
              <p className="mx-auto max-w-2xl text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink-soft)]">
                TCRM determines what needs to move. Archer Design makes it launch-ready.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ NOT ANOTHER AGENCY ══════════════════════ */}
        <section id="commitments" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Working boundaries</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Not another agency competing for the account.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Archer Design would not replace TCRM&rsquo;s revenue strategy, digital partners, or hotel
                relationships. It would serve as an additional hospitality production resource when a
                property needs finished creative, motion, or property-level adaptations and does not have
                enough internal capacity to produce them quickly.
              </p>
            </Reveal>

            <Reveal delay={2} className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COMMITMENTS.map((c) => (
                <div key={c} className="tl-commit">
                  <span className="tl-commit-icon" aria-hidden="true">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{c}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ PILOT ══════════════════════ */}
        <section id="pilot" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative">
            <div className="tl-pilot-frame">
              <Reveal className="max-w-3xl">
                <p className="tl-eyebrow">Recommended starting point</p>
                <h2 className="tl-pilot-figure mt-4">
                  <em>Three</em> properties. <em>Thirty</em> days. One selected activation level.
                </h2>
                <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                  A focused pilot allows TCRM to select three different hotel types, identify one or more
                  real commercial priorities for each property, and test the white-label request, approval,
                  production, and delivery workflow before any wider rollout.
                </p>
              </Reveal>

              {/* Three pilot-economics options, one per activation level. Every
                  figure here is 3x the corresponding tier value from
                  tcrm-pricing.ts, never a separate hardcoded number. */}
              <Reveal delay={1} className="mt-9 grid gap-6 lg:grid-cols-3">
                {ACTIVATION_TIERS.map((tier) => (
                  <div
                    key={tier.key}
                    className={`tl-panel${tier.badge ? " tl-panel--featured" : ""} flex flex-col p-6 sm:p-7`}
                  >
                    {tier.badge ? <span className="tl-pkg-badge">Recommended pilot</span> : null}
                    <h3 className="mt-1 text-[17px] text-[var(--tl-ink)]">{tier.name}</h3>
                    <div className="tl-pkg-econ mt-4">
                      <div className="tl-pkg-econ-row">
                        <span>
                          3 &times; {fmtMoney(tier.retail)} retail
                        </span>
                        <span>{fmtMoney(tier.retail * PILOT_HOTEL_COUNT)}</span>
                      </div>
                      <div className="tl-pkg-econ-row">
                        <span>
                          3 &times; {fmtMoney(tier.wholesale)} wholesale
                        </span>
                        <span>{fmtMoney(tier.wholesale * PILOT_HOTEL_COUNT)}</span>
                      </div>
                      <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                        <span>Illustrative TCRM gross profit</span>
                        <span>{fmtMoney(grossProfit(tier) * PILOT_HOTEL_COUNT)}</span>
                      </div>
                      <div className="tl-pkg-econ-row">
                        <span>Original concepts</span>
                        <span>{totalConcepts(tier) * PILOT_HOTEL_COUNT}</span>
                      </div>
                      <div className="tl-pkg-econ-row">
                        <span>Platform-ready files</span>
                        <span>{platformFiles(tier) * PILOT_HOTEL_COUNT}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Reveal>
              <Reveal delay={2} className="mt-5">
                <p className="text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                  Illustrative economics only. Hotel-facing pricing, markup, packaging, and participation
                  are controlled by TCRM and are not guaranteed.
                </p>
              </Reveal>

              {/* Recommended property mix, compact row instead of a tall card */}
              <Reveal delay={4} className="mt-9">
                <p className="tl-pkg-subhead">Recommended property mix</p>
                <ul className="tl-pilot-mix-row mt-3">
                  {PILOT_MIX.map((m) => (
                    <li key={m} className="tl-pilot-mix-item">
                      <CheckCircle2 size={12} strokeWidth={2} className="tl-pilot-mix-icon" aria-hidden="true" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Every activation level shares the same operating inclusions,
                  regardless of which one is selected for the pilot. */}
              <Reveal delay={1} className="mt-9">
                <p className="tl-pkg-subhead">Every participating hotel also receives</p>
                <ul className="tl-pilot-scope-grid mt-3">
                  {CORE_INCLUDES.map((s) => (
                    <li key={s} className="tl-check">
                      <span className="tl-check-icon" aria-hidden="true">
                        <CheckCircle2 size={11} strokeWidth={2} />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Four-step operating workflow, horizontal strip instead of a tall card */}
              <Reveal delay={2} className="mt-9">
                <p className="tl-pkg-subhead">Operating workflow</p>
                <ol className="tl-pilot-workflow mt-4">
                  {PILOT_WORKFLOW.map((step, i) => (
                    <li key={step} className="tl-pilot-workflow-step">
                      <span className="tl-pilot-workflow-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              {/* Detailed terms, collapsed by default so they no longer dominate the section */}
              <Reveal delay={3} className="mt-9">
                <details className="tl-pilot-terms">
                  <summary className="tl-pilot-terms-summary">Pilot terms and exclusions</summary>
                  <ul className="tl-pilot-terms-list mt-4">
                    {PILOT_TERMS.map((t) => (
                      <li key={t} className="tl-check">
                        <span className="tl-check-icon" aria-hidden="true">
                          <CheckCircle2 size={11} strokeWidth={2} />
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════════════ SUCCESS CRITERIA ══════════════════════ */}
        <section id="success" className="tl-section">
          <div className="tl-shell relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <p className="tl-eyebrow">Evaluation</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                What the pilot should prove.
              </h2>
              <p className="mt-6 text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
                The pilot is intended to test execution quality, adoption, workflow, and usefulness. It
                does not guarantee a particular RevPAR, occupancy, engagement, or booking result.
              </p>
            </Reveal>
            <Reveal delay={2} className="tl-panel tl-panel--static p-7 sm:p-9">
              <ul className="flex flex-col gap-4">
                {SUCCESS_CRITERIA.map((s) => (
                  <li key={s} className="tl-check">
                    <span className="tl-check-icon" aria-hidden="true">
                      <CheckCircle2 size={11} strokeWidth={2} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ WHY THIS MODEL WORKS ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Why this model works</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Evidence from Archer Design&rsquo;s own hospitality work.
              </h2>
            </Reveal>
            <Reveal delay={2} className="tl-quote-panel mt-9">
              <blockquote className="tl-quote-mark">&ldquo;{CONFIDENCE_QUOTE}&rdquo;</blockquote>
              <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                {CONFIDENCE_SUPPORTING}
              </p>
              <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                {CONFIDENCE_QUALIFICATION}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ EXPANSION ══════════════════════ */}
        <section id="expansion" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Beyond the pilot</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                If the pilot works, capacity can scale with demand.
              </h2>
            </Reveal>

            <div className="mt-11 grid gap-6 md:grid-cols-3">
              {EXPANSION.map((e, i) => {
                const Icon = e.icon;
                return (
                  <Reveal key={e.title} delay={(i + 1) as 1 | 2 | 3} className="tl-panel p-7 sm:p-8">
                    <span className="tl-commit-icon" aria-hidden="true">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 text-[17px] text-[var(--tl-ink)]">{e.title}</h3>
                    <span className="tl-hline my-4" aria-hidden="true" />
                    <p className="text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{e.body}</p>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={4} className="mt-10 text-center">
              <p className="mx-auto max-w-2xl text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink-soft)]">
                Start with three properties. Build the workflow. Expand only when the model proves useful.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ COMMERCIAL TERMS ══════════════════════
            New section, placed before the final CTA. */}
        <section id="terms" className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Commercial terms</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Working terms.
              </h2>
            </Reveal>

            <Reveal delay={2} className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {COMMERCIAL_TERMS.map((t) => (
                <div key={t.term}>
                  <p className="tl-pkg-subhead">{t.term}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{t.detail}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ FINAL CTA ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-glow-cyan" aria-hidden="true" />
          <Reveal className="tl-shell relative mx-auto max-w-3xl text-center">
            <span className="tl-hline mx-auto mb-9 max-w-xs" aria-hidden="true" />
            <p className="tl-eyebrow">Next step</p>
            <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.5rem]">
              Turn the next TCRM revenue priority into a finished campaign.
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
              Select three property types, choose the appropriate activation level, and identify one real
              commercial priority for each hotel. We will map the white-label workflow, confirm the
              production scope, and show how the model can scale only after it proves useful.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/tcrm/schedule" className="tl-btn">
                Choose a three-property pilot
              </Link>
              <a href="https://www.archerdesign.shop/social-media-work" className="tl-btn-ghost">
                View Archer Design&rsquo;s hospitality work
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ══════════════════════ FOOTER / DISCLAIMER ══════════════════════ */}
      <footer className="tl-footer">
        <div className="tl-shell flex flex-col items-center gap-5 text-center">
          <span className="tl-wordmark" aria-hidden="true">
            <span className="tl-wordmark-prep">Prepared for</span>
            TCRM
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            This page presents a proposed service model prepared for Total Customized Revenue Management.
            It does not announce or imply an existing partnership, endorsement, or client engagement.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Private proposal &middot; Not for distribution
          </p>
        </div>
      </footer>
    </div>
  );
}
