import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { existsSync } from "node:fs";
import { join } from "node:path";
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
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { TOPLINE_VIDEOS, TOPLINE_IMAGES } from "./topline-media";
import { Reveal } from "./components/Reveal";
import { LoadingIntro } from "./components/LoadingIntro";
import { PortfolioCalculator } from "./components/PortfolioCalculator";
import { ToplineInterestModalProvider, ToplineCtaButton } from "./components/ToplineInterestModal";
import { ToplineHeader } from "./components/ToplineHeader";
import { HeroVideoBackground } from "./components/HeroVideoBackground";

// Root layout's metadata.title.template appends " | Archer Design"
// automatically (see app/layout.tsx) -- this string must NOT repeat that
// suffix itself, or the rendered <title> duplicates it
// ("... | Archer Design | Archer Design"). The final rendered title is
// exactly "Proposed Revenue Activation Model for Topline | Archer Design",
// matching spec.
const PAGE_TITLE = "Proposed Revenue Activation Model for Topline";
const PAGE_DESCRIPTION =
  "A proposed white-label hotel creative-production model prepared for Topline Revenue Management.";

// Private, personalized proposal — never indexed, never linked from the main
// nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits this
// route), footer, or public portfolio. Accessible only via the direct URL.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/topline") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

// Official Topline wordmark, supplied directly by the user and stored at
// public/topline/logos/topline-logo.png. Detected at build/request time so
// the header can fall back to a text wordmark if it's ever removed.
const hasToplineLogo = existsSync(join(process.cwd(), "public/topline/logos/topline-logo.png"));

/* ── Content ─────────────────────────────────────────────────────────────── */

const TRUST_BAR = ["White-label available", "Topline retains the client", "Brand-safe creative"];
const TRUST_ICONS = [ShieldCheck, Lock, CheckCircle2];

// Real, already-approved aggregate results reused verbatim from
// lib/revstudio-content.ts's ARCHER.stats (read-only reference, not edited
// here), the same figures already shown on the live /revstudio page.
// Nothing here is Topline-specific; it demonstrates Archer Design's
// existing body of hospitality creative work.
const PROOF_STATS = [
  { value: "2.7K+", label: "Creative pieces delivered", icon: Images },
  { value: "18.6M+", label: "Impressions delivered", icon: Eye },
  { value: "4.9M+", label: "People reached", icon: Users },
  { value: "612K+", label: "Engagements generated", icon: Heart },
];
const PROOF_DISCLAIMER =
  "Tracked across supported hospitality campaigns. Built to demonstrate the body of work, not to guarantee a future result.";

/* ── Packages & Topline economics ───────────────────────────────────────────
   Illustrative-only pricing model. Editable constants (base retail price and
   Archer Design wholesale cost per package) drive every derived figure below
   — monthly/annual Topline gross profit, gross margin percentage, and the
   scale examples — so the whole section stays internally consistent if a
   number changes. Nothing here implies a committed hotel count, revenue
   figure, or guaranteed result. */
const CREATIVE_RETAIL_PRICE = 800;
const CREATIVE_WHOLESALE_COST = 500;
const MANAGED_RETAIL_PRICE = 1200;
const MANAGED_WHOLESALE_COST = 800;

/* Topline's About page publicly states 190+ supported hotels across its
   services. Used only as the portfolio calculator's illustrative slider
   ceiling below, never as an implied or committed participation count. */
const MAX_SUPPORTED_HOTELS = 190;

const CREATIVE_MONTHLY_MARGIN = CREATIVE_RETAIL_PRICE - CREATIVE_WHOLESALE_COST;
const MANAGED_MONTHLY_MARGIN = MANAGED_RETAIL_PRICE - MANAGED_WHOLESALE_COST;
const CREATIVE_ANNUAL_MARGIN = CREATIVE_MONTHLY_MARGIN * 12;
const MANAGED_ANNUAL_MARGIN = MANAGED_MONTHLY_MARGIN * 12;
const CREATIVE_MARGIN_PCT = (CREATIVE_MONTHLY_MARGIN / CREATIVE_RETAIL_PRICE) * 100;
const MANAGED_MARGIN_PCT = (MANAGED_MONTHLY_MARGIN / MANAGED_RETAIL_PRICE) * 100;

/* Three-property pilot economics. Derived entirely from the same Creative
   Activation constants above (never a separate hardcoded price), so the
   pilot figures can never drift from the ongoing package pricing. */
const PILOT_HOTEL_COUNT = 3;
const PILOT_WHOLESALE_TOTAL = CREATIVE_WHOLESALE_COST * PILOT_HOTEL_COUNT;
const PILOT_RETAIL_TOTAL = CREATIVE_RETAIL_PRICE * PILOT_HOTEL_COUNT;
const PILOT_GROSS_PROFIT = PILOT_RETAIL_TOTAL - PILOT_WHOLESALE_TOTAL;

function fmtMoney(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
function fmtPct(n: number) {
  return `${Math.round(n * 10) / 10}%`;
}

/* Every participating hotel receives the same 6 original creative assets
   each month (4 motion + 2 static) under both packages. The packages differ
   only in management support layered on top, never in creative quantity. */
const MONTHLY_MOTION_ASSETS = 4;
const MONTHLY_STATIC_ASSETS = 2;
const MONTHLY_TOTAL_ASSETS = MONTHLY_MOTION_ASSETS + MONTHLY_STATIC_ASSETS;

/** Compact "4 + 2 = 6" style visual breakdown, reused on the package cards
 * and the pilot section so the asset count is unmistakable everywhere it
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

const PACKAGES = [
  {
    key: "creative" as const,
    name: "Creative Activation",
    price: `${fmtMoney(CREATIVE_RETAIL_PRICE)} per hotel / month`,
    positioning:
      "For hotels that can publish internally but need a consistent monthly supply of high-quality hospitality creative.",
    summary: "6 original campaign assets every month",
    distinction: "Topline or the hotel publishes the 6 finished assets.",
    creativeLabel: "Creative production",
    creativeIncludes: [
      "Standard social-format exports",
      "Promotional text incorporated into the designs",
      "Brand-safe execution using approved property imagery",
      "One consolidated minor revision round",
      "Organized white-label delivery through Topline",
    ],
    managementIncludes: null as string[] | null,
    excludes: [
      "Caption writing",
      "Content-calendar management",
      "Posting or scheduling",
      "Analytics",
      "Community management",
      "Paid-media management",
      "Photography or on-site production",
    ],
    retail: CREATIVE_RETAIL_PRICE,
    wholesale: CREATIVE_WHOLESALE_COST,
    monthlyMargin: CREATIVE_MONTHLY_MARGIN,
    annualMargin: CREATIVE_ANNUAL_MARGIN,
    marginPct: CREATIVE_MARGIN_PCT,
  },
  {
    key: "managed" as const,
    name: "Managed Social",
    price: `${fmtMoney(MANAGED_RETAIL_PRICE)} per hotel / month`,
    positioning:
      "For hotels that need the same premium creative output plus the monthly planning, writing, scheduling, and reporting workflow.",
    summary: "6 original campaign assets plus managed monthly delivery",
    distinction: "Archer Design helps plan, write, schedule, and report on the same 6 premium assets.",
    creativeLabel: "Creative production (identical to Creative Activation)",
    creativeIncludes: [
      "Standard social-format exports",
      "Promotional text incorporated into the designs",
      "Brand-safe execution using approved property imagery",
      "One consolidated minor revision round",
    ],
    managementIncludes: [
      "Captions and promotional verbiage",
      "Monthly content calendar",
      "Scheduling to up to 2 approved social platforms",
      "Basic hashtag and keyword support",
      "Monthly performance snapshot",
      "White-label delivery through Topline",
    ] as string[] | null,
    excludes: [
      "Comment or direct-message management",
      "Review or reputation management",
      "Paid-ad management or advertising spend",
      "Daily Stories",
      "Influencer management",
      "Photography or on-site production",
      "More than two platforms",
      "Emergency or same-day posting",
      "Guaranteed booking or revenue outcomes",
    ],
    retail: MANAGED_RETAIL_PRICE,
    wholesale: MANAGED_WHOLESALE_COST,
    monthlyMargin: MANAGED_MONTHLY_MARGIN,
    annualMargin: MANAGED_ANNUAL_MARGIN,
    marginPct: MANAGED_MARGIN_PCT,
  },
];

const PACKAGE_COMPARISON_ROWS = [
  { label: "Original assets", creative: "6 original assets monthly", managed: "6 original assets monthly" },
  { label: "Motion graphics", creative: "4 motion graphics", managed: "4 motion graphics" },
  { label: "Static graphics", creative: "2 static graphics", managed: "2 static graphics" },
  { label: "Scope", creative: "Creative production only", managed: "Creative, captions, calendar, scheduling, and reporting" },
  { label: "Publishing", creative: "Hotel or Topline publishes", managed: "Scheduling to up to 2 platforms" },
  { label: "Reporting", creative: "Not included", managed: "Monthly performance snapshot" },
  { label: "Proposed retail", creative: fmtMoney(CREATIVE_RETAIL_PRICE), managed: fmtMoney(MANAGED_RETAIL_PRICE) },
  {
    label: "Illustrative Topline monthly gross profit",
    creative: fmtMoney(CREATIVE_MONTHLY_MARGIN),
    managed: fmtMoney(MANAGED_MONTHLY_MARGIN),
  },
];

// Selected hospitality work — real stills/motion already in the project
// (components/marketing/work-page-media.ts, the same manifest behind
// archerdesign.shop/social-media-work). One representative piece per
// commercial category Topline's revenue priorities tend to fall into.
const WORK_CATEGORIES = [
  {
    icon: Film,
    label: "Motion & short-form reels",
    desc: "Short-form video built to carry a revenue priority across social and paid placements.",
    media: {
      type: "video" as const,
      src: "/topline/videos/hotel-arrival-vintage-car.mp4",
      alt: "Hotel arrival motion clip",
    },
  },
  {
    icon: UtensilsCrossed,
    label: "F&B & restaurant promotions",
    desc: "Menu, happy-hour, and restaurant-push creative built to move on-property F&B revenue.",
    media: { type: "image" as const, src: "/topline/images/eliza-hot-metal-bistro-july-menu.png", alt: "Eliza Hot Metal Bistro monthly menu graphic", width: 1322, height: 1792 },
  },
  {
    icon: PartyPopper,
    label: "Meetings, weddings & events",
    desc: "Room-block, wedding, and group-event visuals that support meetings and catering revenue.",
    media: { type: "image" as const, src: "/topline/images/hotel-indigo-pittsburgh-wedding-room-block.png", alt: "Hotel Indigo Pittsburgh wedding room block visual", width: 1326, height: 1792 },
  },
  {
    icon: Building2,
    label: "Branded hotel campaign adaptations",
    desc: "Brand-safe creative adapted to a flagged hotel's standards, built for franchise/brand review.",
    media: { type: "image" as const, src: "/topline/images/hampton-inn-johnstown-flood-city-music-festival.png", alt: "Hampton Inn Johnstown Flood City Music Festival campaign", width: 1334, height: 1576 },
  },
  {
    icon: Sun,
    label: "Seasonal & local-demand campaigns",
    desc: "Property-level assets built around a seasonal amenity or local demand driver.",
    media: { type: "image" as const, src: "/topline/images/hampton-inn-johnstown-pool-and-patio.png", alt: "Hampton Inn Johnstown pool and patio seasonal visual", width: 1346, height: 1816 },
  },
  {
    icon: Tag,
    label: "Package & portfolio-consistent creative",
    desc: "A repeatable visual system that keeps package and offer creative consistent across a feed.",
    media: { type: "image" as const, src: "/topline/images/hotel-indigo-pittsburgh-instagram-grid.png", alt: "Hotel Indigo Pittsburgh Instagram grid showing consistent creative system", width: 3024, height: 2202 },
  },
];

const ROLES = [
  {
    key: "topline" as const,
    name: "Topline",
    tag: "Revenue strategy and client leadership",
    items: [
      "Identifies the commercial opportunity",
      "Defines the revenue objective",
      "Controls the hotel relationship",
      "Approves the strategy and messaging",
      "Retains final client approval",
    ],
  },
  {
    key: "revstudio" as const,
    name: "The Revstudio",
    tag: "Authorized commercial support",
    items: [
      "Confirms rates, dates, and restrictions",
      "Supports distribution and channel execution",
      "Verifies rate codes and booking paths",
      "Helps ensure commercial accuracy",
      "Works only within Topline-authorized scope",
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
      "Property adaptations and exports",
    ],
  },
];

const COMMITMENTS = [
  "Topline owns and manages the client relationship",
  "Fully white-label delivery is available",
  "No independent solicitation of Topline clients",
  "No direct hotel communication without authorization",
  "Topline controls strategy and final approval",
  "Responsibilities are documented before work begins",
];

const PILOT_MIX = [
  "One branded select-service hotel",
  "One independent or lifestyle hotel",
  "One property with F&B, meeting, event, or wedding demand",
];

const PILOT_SCOPE = [
  "4 original motion graphics",
  "2 original static campaign graphics",
  "Standard social-format exports",
  "Promotional copy incorporated into the designs",
  "Brand-safe execution using approved property materials",
  "One consolidated minor revision round",
  "Human review before delivery",
  "Organized white-label delivery through Topline",
];

const PILOT_WORKFLOW = [
  "Topline selects the properties and priorities",
  "Approved source materials and commercial details are supplied",
  "The Revstudio verifies relevant rates, dates, restrictions, and booking details",
  "Archer Design produces the creative",
  "Topline reviews before hotel delivery",
];

const PILOT_TERMS = [
  "Topline retains the hotel relationship",
  "Topline approves every commercial priority",
  "Existing approved photography and brand materials must be supplied",
  "Turnaround begins after the brief and source assets are complete",
  "Creative Activation does not include publishing, account management, paid media, photography, analytics, comment management, or direct-message management",
  "Managed Social services may be added separately",
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
    body: "A defined production capacity Topline can allocate across the hotels with the greatest current need.",
  },
  {
    icon: CalendarRange,
    title: "Seasonal and onboarding support",
    body: "Temporary capacity for launches, seasonal campaigns, transitions, and unusually heavy request periods.",
  },
];

// Real, already-approved language reused verbatim from
// app/social-media-work/page.tsx (read-only reference, not edited here).
// This is proof of Archer Design's own execution quality on an existing,
// unrelated client relationship -- it is NOT a Topline endorsement, and is
// framed that way below. Do not alter the qualification line.
const CONFIDENCE_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
const CONFIDENCE_SUPPORTING =
  "That result came from connecting events, F&B, meetings, local demand drivers, seasonal priorities, and property storytelling to one consistent creative and content calendar -- the same kind of execution this proposed model would bring to a Topline-identified priority.";
const CONFIDENCE_QUALIFICATION =
  "Performance statement reflects reporting shared by the property during the engagement and should not be interpreted as an independently audited brand-wide claim. Shown as existing Archer Design work, unrelated to Topline, and not a Topline endorsement.";

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function ToplinePage() {
  return (
    <div id="top" className={`${fraunces.variable} topline-theme archer-studio relative min-h-screen`}>
      <ToplineInterestModalProvider>
      <LoadingIntro />
      <ToplineHeader hasLogo={hasToplineLogo} />

      <main>
        {/* ══════════════════════ HERO (video-background) ══════════════════════
            Rebuilt from scratch: the two-column framework-card + photo-stack
            layout is gone. Full-bleed real hospitality footage (the same
            flagship clip used on /revstudio's own hero) sits behind a warm
            espresso scrim, with proof, partnership, and next-step all visible
            in the first screen instead of buried below the fold. */}
        <section className="tl-hero--video">
          <HeroVideoBackground
            src="/topline/videos/topline-hero.mp4"
            poster="/topline/images/topline-hero-poster.webp"
            alt="Hotel arrival with vintage car, The Wayfinder"
          />
          <div className="tl-hero-overlay" aria-hidden="true" />

          <div className="tl-shell relative z-[3]">
            <Reveal className="tl-hero-content">
              <p className="tl-eyebrow">Prepared for Topline Revenue Management</p>
              <span className="mt-4 block h-px w-12 bg-[#7fe0d0] opacity-80" aria-hidden="true" />
              <h1 className="mt-5 text-[2.05rem] leading-[1.14] sm:text-[2.5rem] lg:text-[2.75rem]">
                The revenue opportunity is clear.
                <br />
                The creative execution should be ready.
              </h1>
              <p className="tl-hero-copy mt-5 max-w-[42ch] text-[14.5px] leading-[1.65]">
                Topline identifies where revenue can be won. The Revstudio carries the commercial and
                distribution setup. Archer Design turns that priority into finished, brand-safe guest-facing
                creative, ready to run behind Topline&rsquo;s client relationship.
              </p>

              {/* Partnership proof, surfaced here rather than buried below the
                  fold. Real supplied combined logo (same file used in the
                  header and on the live /revstudio page), not an invented
                  text treatment. The source file has an opaque white
                  background, so it sits on a small light chip rather than
                  directly on the dark hero glass. */}
              <div className="tl-partnership-card mt-5">
                <span className="tl-partnership-logo-chip">
                  <Image
                    src="/topline/logos/trs-archer-logo.png"
                    alt="Archer Design and The Revstudio"
                    width={354}
                    height={116}
                    className="tl-partnership-logo"
                  />
                </span>
                <p className="tl-partnership-card-text">
                  Creative execution by Archer Design, paired with commercial and distribution support
                  from The Revstudio.
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
                <ToplineCtaButton className="tl-btn">
                  Review the 30-day pilot
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                </ToplineCtaButton>
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
                highlighted as its own card rather than a line of copy.
                Reuses the exact, already-approved wording defined below with
                CONFIDENCE_QUOTE/QUALIFICATION. Nothing new invented here. */}
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
                <MotionPortfolioGallery items={TOPLINE_VIDEOS} />
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
                <WorkPageStillsGallery items={TOPLINE_IMAGES} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════ PACKAGES & TOPLINE ECONOMICS ══════════════════════ */}
        <section id="packages" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Illustrative white-label service model</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                Two ways Topline could add recurring value, and margin, per hotel.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Some hotels already have someone available to publish content but need consistent
                creative production. Others need the complete monthly workflow: planning, creative, copy,
                scheduling, and reporting. The proposed model gives Topline a clear option for each.
              </p>
            </Reveal>

            <div className="mt-11 grid gap-6 lg:grid-cols-2">
              {PACKAGES.map((pkg, i) => (
                <Reveal
                  key={pkg.key}
                  delay={(i + 1) as 1 | 2}
                  className={`tl-panel tl-panel--${pkg.key === "creative" ? "topline" : "archer"} flex flex-col p-7 sm:p-8`}
                >
                  <p className={`tl-role-tag tl-role-tag--${pkg.key === "creative" ? "topline" : "archer"}`}>
                    Package {i + 1}
                  </p>
                  <h3 className="mt-2 text-[21px] text-[var(--tl-ink)]">{pkg.name}</h3>
                  <p className="tl-pkg-price mt-2">{pkg.price}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                    {pkg.positioning}
                  </p>

                  <p className="tl-pkg-summary mt-5">{pkg.summary}</p>

                  <AssetEquation
                    parts={[
                      { value: MONTHLY_MOTION_ASSETS, label: "Motion graphics" },
                      { value: MONTHLY_STATIC_ASSETS, label: "Static graphics" },
                    ]}
                    total={MONTHLY_TOTAL_ASSETS}
                    totalLabel="Original monthly assets"
                  />

                  <p className="tl-pkg-distinction mt-4">{pkg.distinction}</p>

                  <span className="tl-hline my-6" aria-hidden="true" />

                  <p className="tl-pkg-subhead">{pkg.creativeLabel}</p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {pkg.creativeIncludes.map((item) => (
                      <li key={item} className="tl-check">
                        <span className="tl-check-icon" aria-hidden="true">
                          <CheckCircle2 size={11} strokeWidth={2} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {pkg.managementIncludes && (
                    <>
                      <p className="tl-pkg-subhead mt-6">Management support</p>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {pkg.managementIncludes.map((item) => (
                          <li key={item} className="tl-check">
                            <span className="tl-check-icon" aria-hidden="true">
                              <CheckCircle2 size={11} strokeWidth={2} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <p className="tl-pkg-subhead mt-6">Not included</p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {pkg.excludes.map((item) => (
                      <li key={item} className="tl-excl">
                        <span className="tl-excl-icon" aria-hidden="true">
                          <X size={10} strokeWidth={2.25} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className="tl-hline my-6" aria-hidden="true" />

                  <p className="tl-pkg-subhead">Illustrative economics</p>
                  <div className="tl-pkg-econ mt-3">
                    <div className="tl-pkg-econ-row">
                      <span>Hotel pays Topline</span>
                      <span>{fmtMoney(pkg.retail)} monthly</span>
                    </div>
                    <div className="tl-pkg-econ-row">
                      <span>Archer Design wholesale</span>
                      <span>{fmtMoney(pkg.wholesale)} monthly</span>
                    </div>
                    <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                      <span>Topline retains</span>
                      <span>{fmtMoney(pkg.monthlyMargin)} monthly</span>
                    </div>
                    <div className="tl-pkg-econ-row">
                      <span>Topline annual gross profit / hotel</span>
                      <span>{fmtMoney(pkg.annualMargin)}</span>
                    </div>
                    <div className="tl-pkg-econ-row">
                      <span>Illustrative Topline gross margin</span>
                      <span>{fmtPct(pkg.marginPct)}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Package comparison */}
            <Reveal delay={3} className="mt-10">
              <p className="tl-pkg-subhead">Package comparison</p>
              <p className="tl-pkg-framing mt-3">
                Both packages include the same premium monthly creative output. Managed Social adds the
                planning, publishing, and reporting workflow.
              </p>
              <div className="tl-compare mt-4">
                <div className="tl-compare-row tl-compare-row--head">
                  <span />
                  <span>Creative Activation</span>
                  <span>Managed Social</span>
                </div>
                {PACKAGE_COMPARISON_ROWS.map((row) => (
                  <div key={row.label} className="tl-compare-row">
                    <span className="tl-compare-label">{row.label}</span>
                    <span>{row.creative}</span>
                    <span>{row.managed}</span>
                  </div>
                ))}
              </div>
            </Reveal>

          </div>
        </section>

        {/* ══════════════════════ PORTFOLIO EARNINGS CALCULATOR ══════════════════════
            Replaces the old static "Portfolio scale example" cards (three
            fixed 10-hotel scenarios) with a live, interactive calculator
            spanning Topline's full publicly reported portfolio range. */}
        <section id="calculator" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">Portfolio earnings calculator</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                See what the creative layer could add across Topline&rsquo;s portfolio.
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                Choose a participating-hotel count and compare the proposed client revenue, white-label
                production cost, and gross profit available to Topline under each service model.
              </p>
              <p className="mt-4 text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
                Topline publicly reports 190+ supported hotels across its services. This calculator uses
                190 properties as an illustrative upper limit only; no participation level or revenue is
                guaranteed.
              </p>
            </Reveal>

            <Reveal delay={2} className="mt-10">
              <PortfolioCalculator
                maxHotels={MAX_SUPPORTED_HOTELS}
                defaultHotels={10}
                creativeRetail={CREATIVE_RETAIL_PRICE}
                creativeWholesale={CREATIVE_WHOLESALE_COST}
                managedRetail={MANAGED_RETAIL_PRICE}
                managedWholesale={MANAGED_WHOLESALE_COST}
              />
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
                Not projections for Topline, but the tracked body of work Archer Design has already produced
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
                  A revenue manager identifies a soft period, package opportunity, local demand driver,
                  restaurant push, meeting need, or direct-booking priority. The recommendation is sound
                  and the commercial details are ready. What often slows the launch is the final
                  production work: the reel, campaign graphic, offer visual, property adaptation, email
                  asset, or sales collateral the hotel still needs.
                </p>
                <p className="mt-6 text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink)]">
                  This proposed model closes that execution gap without asking Topline to build another
                  internal production team.
                </p>
              </div>
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
                Real, already-produced work spanning the commercial situations a Topline revenue
                priority tends to fall into.
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

        {/* ══════════════════════ THREE ROLES ══════════════════════ */}
        <section id="model" className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-2xl">
              <p className="tl-eyebrow">The proposed model</p>
              <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
                One Topline priority. Two optional execution layers.
              </h2>
            </Reveal>

            <div className="mt-12 flex flex-col items-stretch gap-6 lg:flex-row lg:gap-0">
              {ROLES.map((role, i) => (
                <Fragment key={role.key}>
                  {i > 0 && (
                    <span
                      className={`tl-card-connector${i === 2 ? " tl-card-connector--second" : ""}`}
                      aria-hidden="true"
                    />
                  )}
                  <Reveal delay={(i + 1) as 1 | 2 | 3} className={`tl-panel tl-panel--${role.key} flex-1 p-7 sm:p-8`}>
                    <h3 className="text-[19px] text-[var(--tl-ink)]">{role.name}</h3>
                    <p className={`tl-role-tag tl-role-tag--${role.key} mt-2`}>{role.tag}</p>
                    <span className="tl-hline my-5" aria-hidden="true" />
                    <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">
                      {role.items.map((item) => (
                        <li key={item} className="flex gap-2.5">
                          <span className={`tl-dot${role.key !== "topline" ? ` tl-dot--${role.key}` : ""}`} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </Fragment>
              ))}
            </div>

            <Reveal delay={4} className="mt-10 text-center">
              <p className="mx-auto max-w-2xl text-[1.05rem] italic leading-relaxed tl-serif text-[var(--tl-ink-soft)]">
                Topline determines what needs to move. We help make it launch-ready.
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
                Archer Design would not replace Topline&rsquo;s revenue strategy, digital partners, or hotel
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
                  <em>Three</em> properties. <em>Thirty</em> days. <em>Eighteen</em> finished assets.
                </h2>
                <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
                  A focused pilot gives three different hotels a complete month of Creative Activation
                  while testing the white-label request, approval, and delivery workflow before any wider
                  rollout.
                </p>
              </Reveal>

              {/* Core pilot summary: 3 hotels / 12 motion / 6 static / 18 total */}
              <Reveal delay={1} className="tl-pilot-stats mt-9">
                <div className="tl-pilot-stat">
                  <p className="tl-pilot-stat-value">{PILOT_HOTEL_COUNT}</p>
                  <p className="tl-pilot-stat-label">Participating hotels</p>
                </div>
                <div className="tl-pilot-stat">
                  <p className="tl-pilot-stat-value">{MONTHLY_MOTION_ASSETS * PILOT_HOTEL_COUNT}</p>
                  <p className="tl-pilot-stat-label">Original motion graphics</p>
                </div>
                <div className="tl-pilot-stat">
                  <p className="tl-pilot-stat-value">{MONTHLY_STATIC_ASSETS * PILOT_HOTEL_COUNT}</p>
                  <p className="tl-pilot-stat-label">Original static graphics</p>
                </div>
                <div className="tl-pilot-stat tl-pilot-stat--total">
                  <p className="tl-pilot-stat-value">{MONTHLY_TOTAL_ASSETS * PILOT_HOTEL_COUNT}</p>
                  <p className="tl-pilot-stat-label">Finished assets total</p>
                </div>
              </Reveal>

              {/* 4 + 2 = 6 per hotel, then 6 x 3 = 18 across the pilot */}
              <Reveal delay={2} className="tl-pilot-totals mt-8">
                <div className="tl-pilot-total-card">
                  <p className="tl-pilot-total-label">Per hotel</p>
                  <AssetEquation
                    size="lg"
                    parts={[
                      { value: MONTHLY_MOTION_ASSETS, label: "Motion" },
                      { value: MONTHLY_STATIC_ASSETS, label: "Static" },
                    ]}
                    total={MONTHLY_TOTAL_ASSETS}
                    totalLabel="Original assets per hotel"
                  />
                </div>
                <div className="tl-pilot-total-card">
                  <p className="tl-pilot-total-label">Across 3 hotels</p>
                  <AssetEquation
                    size="lg"
                    parts={[
                      { value: MONTHLY_TOTAL_ASSETS, label: "Assets per hotel" },
                      { value: PILOT_HOTEL_COUNT, label: "Hotels", op: "×" },
                    ]}
                    total={MONTHLY_TOTAL_ASSETS * PILOT_HOTEL_COUNT}
                    totalLabel="Original pilot assets"
                  />
                </div>
              </Reveal>

              {/* Pilot investment */}
              <Reveal delay={3} className="tl-pilot-investment mt-8">
                <div className="tl-pilot-investment-figure">
                  <p className="tl-pilot-investment-value">{fmtMoney(PILOT_WHOLESALE_TOTAL)}</p>
                  <p className="tl-pilot-investment-label">Total wholesale pilot investment</p>
                  <p className="tl-pilot-investment-note">
                    Equivalent to {fmtMoney(CREATIVE_WHOLESALE_COST)} per participating hotel for one
                    complete month of Creative Activation.
                  </p>
                </div>
                <div className="tl-pilot-econ-card">
                  <p className="tl-pkg-subhead">Illustrative economics if sold at retail</p>
                  <div className="tl-pkg-econ mt-3">
                    <div className="tl-pkg-econ-row">
                      <span>Total hotel revenue (3 &times; {fmtMoney(CREATIVE_RETAIL_PRICE)})</span>
                      <span>{fmtMoney(PILOT_RETAIL_TOTAL)}</span>
                    </div>
                    <div className="tl-pkg-econ-row">
                      <span>Archer Design wholesale cost</span>
                      <span>{fmtMoney(PILOT_WHOLESALE_TOTAL)}</span>
                    </div>
                    <div className="tl-pkg-econ-row tl-pkg-econ-row--highlight">
                      <span>Illustrative Topline gross profit</span>
                      <span>{fmtMoney(PILOT_GROSS_PROFIT)}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                    Illustrative only. Selling the pilot to hotels at retail is optional and not guaranteed.
                  </p>
                </div>
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

              {/* Per-property scope, compact two-column grid instead of a tall card */}
              <Reveal delay={1} className="mt-9">
                <p className="tl-pkg-subhead">Each participating hotel receives</p>
                <ul className="tl-pilot-scope-grid mt-3">
                  {PILOT_SCOPE.map((s) => (
                    <li key={s} className="tl-check">
                      <span className="tl-check-icon" aria-hidden="true">
                        <CheckCircle2 size={11} strokeWidth={2} />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Five-step operating workflow, horizontal strip instead of a tall card */}
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

        {/* ══════════════════════ FINAL CTA ══════════════════════ */}
        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-glow-cyan" aria-hidden="true" />
          <Reveal className="tl-shell relative mx-auto max-w-3xl text-center">
            <span className="tl-hline mx-auto mb-9 max-w-xs" aria-hidden="true" />
            <p className="tl-eyebrow">Next step</p>
            <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.5rem]">
              Turn the next Topline revenue priority into a finished campaign.
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
              Select three different property types and one real commercial opportunity for each. We will
              map the workflow, define the production scope, and show exactly how a white-label pilot
              could operate.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <ToplineCtaButton className="tl-btn">Discuss the three-property pilot</ToplineCtaButton>
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
            TOPLINE
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            This page presents a proposed service model prepared for Topline Revenue Management. It does
            not announce or imply an existing partnership, endorsement, or client engagement.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design &middot; Private proposal &middot; Not for distribution
          </p>
        </div>
      </footer>
      </ToplineInterestModalProvider>
    </div>
  );
}
