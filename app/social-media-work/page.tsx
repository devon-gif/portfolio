import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/marketing/JsonLd";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import { StudioFooter } from "@/components/marketing/StudioFooter";
import { StudioCTA } from "@/components/marketing/StudioCTA";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { fraunces } from "@/components/marketing/studioFont";
import { FEATURED_MOTION, BRAND_PROOF_LOGOS } from "@/components/marketing/media";
import { WORK_PAGE_VIDEOS, WORK_PAGE_IMAGES } from "@/components/marketing/work-page-media";
import { CostComparisonCalculator } from "@/components/marketing/CostComparisonCalculator";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Note: this page is intentionally public with zero auth/DB dependency.
// It does not import lib/supabase, OwnerAuthGuard, or Sidebar, and does not
// call any Supabase client method.

const DESCRIPTION =
  "Real hospitality social media, motion, and campaign work from Archer Design. Short-form video, feed graphics, and event creative for hotel, restaurant, and hospitality clients, shown in slideshow form.";

export const metadata: Metadata = {
  title: "Social Media Portfolio",
  description: DESCRIPTION,
  alternates: { canonical: "/social-media-work" },
  openGraph: {
    title: "Social Media Portfolio | Archer Design",
    description: DESCRIPTION,
    url: "/social-media-work",
  },
};

// Real, already-approved client metrics reused verbatim from
// app/case-studies/page.tsx (read-only reference, not edited here).
const PROOF = [
  {
    name: "Hampton Inn Greensburg",
    posts: "338 posts tracked",
    stats: "3.24M impressions, 78.3K direct engagements, 734K reach",
  },
  {
    name: "Hotel Indigo Pittsburgh",
    posts: "408 posts tracked",
    stats: "1.91M impressions, 54.7K direct engagements, 210K reach",
  },
  {
    name: "Eliza PGH / Eliza Hot Metal Bistro",
    posts: "444 posts tracked",
    stats: "5.88M impressions, 323K direct engagements, 1.15M reach",
  },
];

// ── Reporting & optimization ─────────────────────────────────────────────────
const WEEKLY_ANALYTICS = [
  "Reach and impressions",
  "Engagement",
  "Content performance",
  "Follower and audience movement",
  "Clicks or inquiries where available",
  "Strongest posts and formats",
  "Emerging patterns or issues",
];

const MONTHLY_REVIEW = [
  "Review what generated the strongest response",
  "Identify content that underperformed",
  "Compare creative formats and subject matter",
  "Adjust timing and publishing cadence",
  "Refine upcoming property priorities",
  "Decide what should continue, change, or stop",
  "Update the next month's calendar accordingly",
];

// ── Hotel Indigo proof callout ───────────────────────────────────────────────
// Exact wording, do not alter. See SOCIAL_MEDIA_WORK_PAGE_SETUP.md.
const HOTEL_INDIGO_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
const HOTEL_INDIGO_SUPPORTING_COPY =
  "The approach connected events, F&B, meetings, local demand drivers, seasonal priorities, and property storytelling to a consistent creative and social-media calendar.";
// DO NOT REMOVE THIS QUALIFICATION.
const HOTEL_INDIGO_QUALIFICATION =
  "Performance statement reflects reporting shared by the property during the engagement and should not be interpreted as an independently audited brand-wide claim.";
const INDIGO_LOGO =
  BRAND_PROOF_LOGOS.find((logo) => logo.alt.includes("Indigo")) ?? BRAND_PROOF_LOGOS[1];

// Page-local logo row for the Clients section. Extends the shared
// BRAND_PROOF_LOGOS (used by other pages) with two more approved,
// already-in-repo assets rather than editing that shared array, so this
// change stays scoped to /social-media-work only.
const CLIENT_LOGOS = [
  ...BRAND_PROOF_LOGOS,
  { src: "/Untitled.png", alt: "Eliza Hot Metal Bistro logo" },
  { src: "/archer-preview/logos/ihg-logo.png", alt: "IHG Hotels & Resorts logo" },
] as const;

// ── Simple workflow ──────────────────────────────────────────────────────────
const workflowIconStroke = {
  fill: "none",
  stroke: "#a98a4c",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Priorities",
    body: "The hotel shares upcoming events, offers, need periods, restaurant priorities, meetings, packages, and property updates.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <path d="M9 3v2h6V3M9 9h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Calendar",
    body: "A shared content calendar organizes what is planned, in production, awaiting approval, and scheduled.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Creative",
    body: "Archer Design produces the graphics, social assets, motion, captions, campaign materials, and supporting formats.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Slack review",
    body: "The team uploads property assets, requests changes, leaves feedback, and communicates approvals in one shared Slack channel.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Publishing",
    body: "For full-management clients, approved work is scheduled and published across the agreed platforms.",
    badge: "Full-management package only",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Reporting",
    body: "Weekly analytics provide visibility, and the monthly review determines what should continue, change, or stop.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...workflowIconStroke}>
        <path d="M3 3v18h18" />
        <path d="M7 15v3M12 10v8M17 6v12" />
      </svg>
    ),
  },
];

// ── The business case ────────────────────────────────────────────────────────
const IN_HOUSE_OR_MULTI_VENDOR = [
  "Full-time designer or content specialist salary",
  "Employer payroll costs",
  "Health-insurance contribution",
  "Paid time off",
  "Retirement or 401(k) contribution",
  "Recruiting and onboarding time",
  "Equipment and software",
  "Training and management",
  "Separate video-editing support",
  "Separate social-media support",
  "Separate reporting or analytics work",
  "Internal coordination across multiple departments",
];

// Exact wording required for the benefits-administration line item, do not
// change to an unqualified "no benefits required" claim.
const ARCHER_FLAT_RATE_SUPPORT = [
  "Predictable monthly fee",
  "Graphic design",
  "Short-form motion",
  "Social campaign production",
  "F&B and event creative",
  "Caption and calendar support where included",
  "Publishing and analytics in the managed package",
  "Shared Slack workflow",
  "Monthly review and optimization",
  "No hourly billing for every small revision",
  "No employee-benefits package administered by the client",
  "No separate creative software or production setup",
  "Scalable scope without immediately adding another full-time employee",
];

const FLAT_RATE_COVERS = [
  "Monthly campaign planning",
  "Social graphics",
  "Story formats",
  "Resizing and platform adaptation",
  "Approved revision rounds",
  "Motion and Reel production",
  "Restaurant and event promotions",
  "Content-calendar updates",
  "Reporting in the managed package",
  "Ongoing coordination",
];

// Exact wording, used verbatim wherever managed-package revisions are
// described. Never shorten to an unqualified "unlimited revisions."
const UNLIMITED_REVISIONS_LANGUAGE =
  "Unlimited reasonable revisions within the agreed monthly scope and approval window.";

const BUSINESS_CASE_PULL_QUOTE =
  "One predictable monthly investment consolidates creative, motion, social production, workflow coordination, and, on the managed plan, publishing, analytics, and optimization.";

// ── Pricing ───────────────────────────────────────────────────────────────────
const CREATIVE_PRODUCTION_INCLUDES = [
  "Shared monthly content and campaign calendar",
  "Social graphics and story assets",
  "Short-form motion and Reels",
  "F&B, event, package, meeting, and seasonal campaigns",
  "Property and destination storytelling",
  "Captions and campaign messaging where included in scope",
  "Correctly sized publishing files",
  "Two revision rounds per monthly batch",
];

const CREATIVE_AND_SOCIAL_MANAGEMENT_INCLUDES = [
  "Everything in Creative Production",
  "Instagram and Facebook scheduling and publishing",
  "Caption preparation",
  "Content-calendar management",
  "Weekly analytics updates",
  "Monthly performance and strategy review",
  "Ongoing content optimization",
  "Shared Slack channel",
  "Priority and campaign coordination",
  UNLIMITED_REVISIONS_LANGUAGE,
];

const PRICING_EXCLUSIONS = [
  "Paid advertising and media spend",
  "Daily comment or direct-message community management",
  "On-site photography",
  "On-site filming",
  "Influencer management",
  "Travel",
  "Major website development",
  "Full brand redesigns",
  "Crisis communications",
];

export default function SocialMediaWorkPage() {
  return (
    <div className={`${fraunces.variable} archer-studio min-h-screen`}>
      <JsonLd data={organizationJsonLd()} />

      {/* No site header/nav on this page by design: it opens directly on
          the portfolio hero, independent of the main Archer Studio nav. */}
      <main className="mx-auto max-w-6xl px-6 pb-8">
        {/* Hero */}
        <section className="grid grid-cols-1 gap-10 pt-14 md:pt-24 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <span className="st-kicker">Social media portfolio</span>
            <h1 className="mt-4 font-serif text-[clamp(30px,4.5vw,52px)] leading-[1.06] text-[var(--st-ink)]">
              Real hospitality social content, in motion.
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
              A look at the short-form video, feed content, and campaign
              creative Archer Design has produced for hotel, restaurant, and
              event clients. Browse the slideshow below to see the range:
              poolside and lobby motion, bar and bistro promotion, weddings
              and events, and seasonal campaigns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#motion" className="st-btn">
                See the slideshow <span aria-hidden>→</span>
              </a>
              <a href="/contact" className="st-btn-ghost">
                Ask about your property
              </a>
            </div>
          </div>

          <div className="st-media-frame">
            <div className="st-media-inner aspect-video">
              <LazyVideo
                src={FEATURED_MOTION.src}
                eager
                label={FEATURED_MOTION.label}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 flex items-center justify-between px-1 pb-1 text-[13px] text-[var(--st-ink-soft)]">
              <span>{FEATURED_MOTION.label}</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-gold)]">
                {FEATURED_MOTION.category}
              </span>
            </p>
          </div>
        </section>

        {/* Motion slideshow */}
        <section id="motion" className="scroll-mt-24 pt-20">
          <span className="st-kicker">Motion library</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            Still photography, brought to life for ads, websites, and
            campaigns.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            Many of these pieces began as still photographs. Archer Design
            used motion design, compositing, environmental animation, and
            VFX techniques to turn them into cinematic assets for hotel
            websites, commercials, digital ads, social campaigns, and
            property storytelling.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            The clips are intentionally shown without permanent text
            overlays because they were designed as flexible visual
            foundations. Headlines, offers, logos, buttons, and calls to
            action can be added later based on the final website,
            advertisement, or campaign placement.
          </p>

          <div
            className="mt-8 max-w-2xl rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] px-5 py-4"
            style={{ borderLeft: "3px solid var(--st-gold)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--st-gold)]">
              Why there is no text
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--st-ink-soft)]">
              These are clean motion assets created for websites,
              commercials, and advertisements. Final campaign copy and
              branding are applied according to the intended placement.
            </p>
          </div>

          <div className="mt-8">
            <MotionPortfolioGallery items={WORK_PAGE_VIDEOS} />
          </div>
        </section>

        {/* Stills */}
        <section className="pt-20">
          <span className="st-kicker">Stills &amp; campaigns</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            Feed-ready photography from real properties.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            {WORK_PAGE_IMAGES.length} stills covering hotel, spa,
            restaurant, and event work, from monthly menu graphics to full
            campaign posters. Shown large and true to their real proportions.
          </p>
          <div className="mt-8">
            <WorkPageStillsGallery items={WORK_PAGE_IMAGES} />
          </div>
        </section>

        {/* Proof band */}
        <section className="pt-20">
          <span className="st-kicker">Results</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            What this kind of consistent posting adds up to.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PROOF.map((p) => (
              <div key={p.name} className="st-card p-6">
                <h3 className="font-serif text-[18px] text-[var(--st-ink)]">{p.name}</h3>
                <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[var(--st-gold)]">
                  {p.posts}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                  {p.stats}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-[var(--st-ink-muted)]">
            Metrics reflect tracked profile data (impressions, reach, and
            engagement) for these client accounts. Direct booking
            attribution depends on property-level tracking and is not
            claimed here.
          </p>
        </section>

        {/* Brand proof logos */}
        <section className="pt-20 pb-4">
          <span className="st-kicker">Clients</span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:justify-start">
            {CLIENT_LOGOS.map((logo) => (
              <div
                key={logo.src}
                className="relative h-12 w-32 shrink-0 opacity-80 transition hover:opacity-100 sm:h-14 sm:w-36"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  sizes="160px"
                  loading="lazy"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Reporting & optimization */}
        <section id="reporting" className="scroll-mt-24 pt-20">
          <span className="st-kicker">Reporting &amp; optimization</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            Creative decisions backed by a clear reporting rhythm.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            The work does not stop when a post is published. Weekly
            analytics show what is gaining attention, while a monthly
            review turns those results into practical changes for the next
            campaign and content calendar.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
            {/* Report frame */}
            <div>
              <div className="mb-3 flex gap-2" aria-hidden="true">
                <span className="rounded-full border border-[var(--st-line)] bg-[var(--st-white)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--st-ink-soft)]">
                  Overview
                </span>
                <span className="rounded-full border border-[var(--st-line)] bg-[var(--st-white)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--st-ink-soft)]">
                  Weekly
                </span>
              </div>
              <div
                className="overflow-hidden rounded-2xl border p-2 shadow-[var(--st-shadow)]"
                style={{ borderColor: "rgba(53,91,153,0.28)", background: "var(--st-white)" }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-xl bg-[var(--st-sand)]"
                  style={{ aspectRatio: "3036 / 1998" }}
                >
                  <Image
                    src="/social-media-work/analytics/weekly-social-performance-report.png"
                    alt="Example weekly social-media performance dashboard showing reach, impressions, engagement, and audience growth metrics. Shown as a representative example, with the analytics tool's workspace branding and the specific client account name redacted for confidentiality."
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-3 text-[13px] text-[var(--st-ink-soft)]">
                Example weekly social-media performance report
              </p>
              <p className="mt-1 text-[12px] text-[var(--st-ink-muted)]">
                Reporting format and metrics are adapted to the channels and
                goals included in each engagement.
              </p>
            </div>

            {/* Weekly + monthly process lists */}
            <div className="grid gap-10">
              <div>
                <h3 className="font-serif text-xl text-[var(--st-ink)]">
                  Weekly analytics
                </h3>
                <ul className="mt-4 space-y-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  {WEEKLY_ANALYTICS.map((item) => (
                    <li key={item} className="relative pl-5">
                      <span
                        className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[var(--st-ink)]">
                  Monthly performance review
                </h3>
                <ul className="mt-4 space-y-2.5 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  {MONTHLY_REVIEW.map((item) => (
                    <li key={item} className="relative pl-5">
                      <span
                        className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Indigo proof callout */}
        <section className="pt-20">
          <div
            className="rounded-[22px] p-8 md:p-12"
            style={{
              background: "var(--st-cream)",
              border: "1px solid var(--st-line)",
              borderLeft: "4px solid var(--st-gold)",
            }}
          >
            <blockquote className="font-serif text-[clamp(22px,3.2vw,34px)] leading-snug text-[var(--st-ink)]">
              &ldquo;{HOTEL_INDIGO_QUOTE}&rdquo;
            </blockquote>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
              {HOTEL_INDIGO_SUPPORTING_COPY}
            </p>
            <div className="mt-7 flex items-center gap-3">
              <div className="relative h-10 w-24 shrink-0 sm:h-12 sm:w-28">
                <Image
                  src={INDIGO_LOGO.src}
                  alt={INDIGO_LOGO.alt}
                  fill
                  sizes="112px"
                  className="object-contain object-left"
                />
              </div>
              <span className="text-[12px] uppercase tracking-[0.14em] text-[var(--st-ink-muted)]">
                Hotel Indigo Pittsburgh, University-Oakland
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-[11px] leading-relaxed text-[var(--st-ink-muted)]">
              {HOTEL_INDIGO_QUALIFICATION}
            </p>
          </div>
        </section>

        {/* Simple workflow */}
        <section className="pt-20">
          <span className="st-kicker">A simple working rhythm</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            One calendar. One Slack channel. Clear approvals.
          </h2>

          <div className="mt-10 max-w-2xl">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.number} className="relative flex gap-5 pb-9 last:pb-0">
                {index < WORKFLOW_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-[46px] bottom-[-4px] w-px bg-[var(--st-line)]"
                  />
                )}
                <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--st-line)] bg-[var(--st-white)] text-[var(--st-gold)]">
                  {step.icon}
                </span>
                <div className="pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--st-gold)]">
                      {step.number}
                    </span>
                    <h3 className="font-serif text-lg text-[var(--st-ink)]">
                      {step.title}
                    </h3>
                    {step.badge && (
                      <span className="rounded-full border border-[var(--st-line)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--st-ink-muted)]">
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The business case */}
        <section id="business-case" className="scroll-mt-24 pt-20">
          <span className="st-kicker">The business case</span>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
            One monthly rate. Fewer vendors. Less internal overhead.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            Archer Design gives hospitality teams access to recurring
            design, motion, social content, campaign production, reporting,
            and coordination through a predictable monthly structure. The
            goal is not simply to replace an hourly designer. It is to
            reduce the number of roles, invoices, tools, and internal hours
            required to keep the property visible.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="st-card p-7">
              <h3 className="font-serif text-lg text-[var(--st-ink)]">
                In-house or multiple vendors
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                {IN_HOUSE_OR_MULTI_VENDOR.map((item) => (
                  <li key={item} className="relative pl-5">
                    <span
                      className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-taupe)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="st-card p-7" style={{ borderColor: "var(--st-gold)" }}>
              <h3 className="font-serif text-lg text-[var(--st-ink)]">
                Archer Design flat-rate support
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                {ARCHER_FLAT_RATE_SUPPORT.map((item) => (
                  <li key={item} className="relative pl-5">
                    <span
                      className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Flat rate vs hourly */}
          <div className="mt-14">
            <h3 className="font-serif text-2xl text-[var(--st-ink)]">
              Predictable work without a meter running on every request.
            </h3>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
              Hourly creative work can make every revision, resize, caption
              change, new promotion, urgent event, and additional format
              feel like a separate expense. Archer Design&apos;s monthly
              structure is designed around an agreed scope, recurring
              priorities, and a clear approval process so the client can
              plan its creative spend more predictably.
            </p>
            <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--st-ink-muted)]">
              The flat rate may cover
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)] sm:grid-cols-2">
              {FLAT_RATE_COVERS.map((item) => (
                <li key={item} className="relative pl-5">
                  <span
                    className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
              On the managed package, this includes: {UNLIMITED_REVISIONS_LANGUAGE}
            </p>
          </div>

          {/* Illustrative cost model */}
          <div className="mt-14">
            <CostComparisonCalculator />
          </div>

          {/* Closing pull quote */}
          <div className="mt-14 border-t border-[var(--st-line)] pt-14 text-center">
            <p className="mx-auto max-w-3xl font-serif text-[clamp(22px,3.2vw,32px)] leading-snug text-[var(--st-ink)]">
              {BUSINESS_CASE_PULL_QUOTE}
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 pt-20 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="st-kicker">Two ways to work together</span>
              <h2 className="mt-3 max-w-2xl font-serif text-[clamp(26px,3.8vw,42px)] leading-[1.1] text-[var(--st-ink)]">
                Clear scope, clear pricing, no meter running.
              </h2>
            </div>
            <a href={siteConfig.contactUrl} className="st-btn-ghost">
              Compare the two options <span aria-hidden>→</span>
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Option one */}
            <div className="st-card flex h-full flex-col p-8">
              <span className="st-kicker">Option one</span>
              <h3 className="mt-2 font-serif text-2xl text-[var(--st-ink)]">
                Creative Production
              </h3>
              <p className="mt-2 font-serif text-xl text-[var(--st-gold)]">
                $1,000 per property / month
              </p>
              <p className="mt-1 text-[13px] text-[var(--st-ink-muted)]">Starting at</p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                For hotel and hospitality teams that manage their own
                publishing but need consistent, finished creative.
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                {CREATIVE_PRODUCTION_INCLUDES.map((item) => (
                  <li key={item} className="relative pl-5">
                    <span
                      className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-[var(--st-line)] bg-[var(--st-cream)] px-4 py-3 text-[13px] leading-relaxed text-[var(--st-ink-soft)]">
                The client retains responsibility for scheduling,
                publishing, community engagement, and platform reporting.
              </p>
              <a href={siteConfig.contactUrl} className="st-btn mt-6 self-start">
                Discuss creative support <span aria-hidden>→</span>
              </a>
            </div>

            {/* Option two */}
            <div
              className="st-card flex h-full flex-col p-8"
              style={{ borderColor: "var(--st-gold)" }}
            >
              <span className="st-kicker">Option two</span>
              <h3 className="mt-2 font-serif text-2xl text-[var(--st-ink)]">
                Creative + Social Management
              </h3>
              <p className="mt-2 font-serif text-xl text-[var(--st-gold)]">
                $1,700 per property / month
              </p>
              <p className="mt-1 text-[13px] text-[var(--st-ink-muted)]">Starting at</p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
                For teams that want both ongoing creative production and
                management of the agreed social channels.
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                {CREATIVE_AND_SOCIAL_MANAGEMENT_INCLUDES.map((item) => (
                  <li key={item} className="relative pl-5">
                    <span
                      className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-gold)]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={siteConfig.contactUrl} className="st-btn mt-6 self-start">
                Discuss creative support <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Exclusions */}
          <div className="mt-10 st-panel p-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--st-ink-muted)]">
              The following are separately scoped unless included in writing
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[14px] leading-relaxed text-[var(--st-ink-soft)] sm:grid-cols-3">
              {PRICING_EXCLUSIONS.map((item) => (
                <li key={item} className="relative pl-5">
                  <span
                    className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-[var(--st-taupe)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio pricing + pilot */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="st-card p-7">
              <h3 className="font-serif text-lg text-[var(--st-ink)]">
                Portfolio pricing
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                Multi-property portfolios are quoted through a custom
                portfolio structure based on the number of unique property
                calendars, channels, monthly deliverables, approval
                process, and level of centralized or property-level
                coordination.
              </p>
              <a
                href={siteConfig.contactUrl}
                className="st-btn-ghost mt-5 self-start"
              >
                Request a portfolio recommendation <span aria-hidden>→</span>
              </a>
            </div>
            <div className="st-card p-7">
              <h3 className="font-serif text-lg text-[var(--st-ink)]">
                90-day pilot
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">
                Begin with one or two properties to establish the calendar,
                approval workflow, reporting rhythm, and creative cadence
                before considering a wider portfolio rollout.
              </p>
              <a href={siteConfig.contactUrl} className="st-btn-ghost mt-5 self-start">
                Start with a pilot <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <StudioCTA
        heading="Ready to talk through creative support for your property?"
        body="Send a property, restaurant, or event link and we'll show you what a similar creative and reporting rhythm could look like for your team."
        primaryLabel="Discuss creative support"
        primaryHref={siteConfig.contactUrl}
      />

      <StudioFooter />
    </div>
  );
}
