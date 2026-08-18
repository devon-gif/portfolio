import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Gauge,
  Layers3,
  MessageSquareText,
  Palette,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { absoluteUrl, CALENDLY_URL } from "@/lib/seo";
import { fraunces } from "@/components/marketing/studioFont";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { TCRM_IMAGES, TCRM_VIDEOS } from "../tcrm/tcrm-media";
import { Reveal } from "../tcrm/components/Reveal";
import { HawkinsHeader } from "./components/HawkinsHeader";

const PAGE_TITLE = "Hawkins Hospitality × Archer Design";
const PAGE_DESCRIPTION =
  "Private speculative partnership concept exploring a creative-production layer for Hawkins Hospitality hotel clients.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/hawkins") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const HAWKINS_STATS = [
  { value: "50+", label: "Luxury hotels & resorts under management", icon: Building2 },
  { value: "$600M+", label: "Annual revenue managed", icon: TrendingUp },
  { value: "25+", label: "Hotels opened", icon: Rocket },
  { value: "100%", label: "Luxury & lifestyle focus", icon: Sparkles },
];

const CONNECT = [
  {
    signal: "Soft need period",
    creative: "Direct-booking campaign assets, motion, social, paid creative, and offer visuals.",
  },
  {
    signal: "Room-type or package opportunity",
    creative: "A visual campaign system that makes the revenue strategy easy for the guest to understand.",
  },
  {
    signal: "Hotel opening or repositioning",
    creative: "Launch creative, property storytelling, motion, social systems, F&B, and opening-period campaigns.",
  },
  {
    signal: "F&B or ancillary priority",
    creative: "Restaurant, bar, spa, event, and experience-led assets built around incremental spend.",
  },
  {
    signal: "Shoulder-season / local demand",
    creative: "Destination and experience creative designed around the exact audience Hawkins wants to move.",
  },
  {
    signal: "Commercial team needs more output",
    creative: "Flexible production capacity without adding permanent creative headcount at the property or agency level.",
  },
];

const OPERATING_MODEL = [
  {
    title: "Hawkins sets the commercial priority",
    body: "Pricing, segmentation, need periods, booking behavior, positioning, and the revenue opportunity stay with Hawkins.",
    icon: Gauge,
  },
  {
    title: "Archer turns it into finished creative",
    body: "Campaign concepts, design, motion, social, F&B, event, package, and property-level assets are produced on demand.",
    icon: Palette,
  },
  {
    title: "The hotel keeps brand approval",
    body: "The property retains final approval. Archer operates as a production layer underneath the existing commercial relationship.",
    icon: MessageSquareText,
  },
];

const TIERS = [
  { name: "Essential", property: 895, archer: 625, hawkins: 270, note: "Light recurring production" },
  { name: "Growth", property: 1095, archer: 750, hawkins: 345, note: "Ongoing campaigns + motion" },
  { name: "Full", property: 1395, archer: 950, hawkins: 445, note: "Higher-volume property support" },
];

const HAWKINS_MOTION = TCRM_VIDEOS.slice(0, 12);

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function HawkinsPage() {
  return (
    <div id="top" className={`${fraunces.variable} tcrm-theme archer-studio relative min-h-screen`}>
      <HawkinsHeader />

      <div className="border-b border-[var(--tl-line)] bg-[rgba(169,138,76,0.08)]">
        <div className="tl-shell py-2.5 text-center text-[10.5px] font-medium uppercase tracking-[0.15em] text-[var(--tl-ink-muted)]">
          Private speculative concept prepared by Archer Design · not commissioned or approved by Hawkins Hospitality
        </div>
      </div>

      <main>
        {/* HERO */}
        <section className="tl-hero--video">
          <video
            className="tl-hero-video"
            src="/tcrm/videos/hotel-arrival-vintage-car.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="tl-hero-overlay" aria-hidden="true" />
          <div className="tl-hero-fade" aria-hidden="true" />

          <div className="tl-shell relative z-[3]">
            <div className="tl-hero-content">
              <p className="tl-eyebrow">HAWKINS HOSPITALITY × ARCHER DESIGN</p>
              <h1 className="mt-5 text-[clamp(2.1rem,5vw,4.3rem)] leading-[0.98] tracking-[-0.035em]">
                Hawkins finds the revenue opportunity.
                <br />
                Archer turns it into finished creative.
              </h1>
              <p className="tl-hero-copy mt-6 max-w-[48ch] text-[15px] leading-[1.75]">
                A flexible production layer for Hawkins-managed hotels — campaign design, motion, social, F&amp;B,
                openings, packages, experiences, and property-level creative without adding another department.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pilot" className="tl-btn">
                  Discuss a Pilot
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a href="#connect" className="tl-btn-ghost tl-btn-ghost--on-dark">
                  See Where It Fits
                </a>
              </div>

              <div className="tl-metrics-band mt-10">
                {HAWKINS_STATS.map(({ value, label, icon: Icon }) => (
                  <div className="tl-metric" key={label}>
                    <Icon className="tl-metric-icon h-4 w-4" aria-hidden="true" />
                    <p className="tl-metric-value">{value}</p>
                    <p className="tl-metric-label">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10.5px] leading-relaxed text-white/45">
                Public Hawkins Hospitality figures, accessed August 2026. Shown only to frame the scale of the opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* FIT */}
        <section id="fit" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Capacity, not another agency</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.35rem)] leading-[1.04]">
                Hawkins keeps the commercial strategy. Archer adds the production capacity.
              </h2>
              <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                Hawkins already operates as an embedded revenue partner — identifying pricing, segmentation,
                distribution, demand, and commercial opportunities. Archer would sit underneath that work as a flexible
                creative-production resource for participating hotels.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <Reveal className="tl-panel p-7" delay={1}>
                <BarChart3 className="h-5 w-5 text-[var(--tl-teal-deep)]" aria-hidden="true" />
                <h3 className="mt-5 text-[1.35rem]">Revenue strategy stays with Hawkins</h3>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-[var(--tl-ink-soft)]">
                  No competing commercial voice. Hawkins remains the strategic lead and primary client relationship.
                </p>
              </Reveal>
              <Reveal className="tl-panel p-7" delay={2}>
                <Layers3 className="h-5 w-5 text-[var(--tl-gold)]" aria-hidden="true" />
                <h3 className="mt-5 text-[1.35rem]">Creative scales with the need</h3>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-[var(--tl-ink-soft)]">
                  Two assets one month, twenty the next. Hotels use only the production capacity they actually need.
                </p>
              </Reveal>
              <Reveal className="tl-panel p-7" delay={3}>
                <Sparkles className="h-5 w-5 text-[var(--tl-teal-deep)]" aria-hidden="true" />
                <h3 className="mt-5 text-[1.35rem]">Built for luxury &amp; lifestyle nuance</h3>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-[var(--tl-ink-soft)]">
                  Each property keeps its own visual character instead of being forced into a generic portfolio template.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CONNECTION */}
        <section id="connect" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Where Hawkins + Archer connect</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">
                What Hawkins identifies. What Archer makes.
              </h2>
              <p className="mt-5 max-w-[66ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                The handoff is deliberately simple: commercial insight becomes a clear production brief, then finished
                guest-facing creative.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {CONNECT.map((item, index) => (
                <Reveal key={item.signal} className="tl-panel p-6 sm:p-7" delay={((index % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="grid gap-5 sm:grid-cols-[0.9fr_1.25fr] sm:items-start">
                    <div>
                      <p className="tl-role-tag tl-role-tag--tcrm">Hawkins identifies</p>
                      <h3 className="mt-2 text-[1.25rem]">{item.signal}</h3>
                    </div>
                    <div className="border-t border-[var(--tl-line)] pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                      <p className="tl-role-tag tl-role-tag--archer">Archer produces</p>
                      <p className="mt-2 text-[13.5px] leading-[1.7] text-[var(--tl-ink-soft)]">{item.creative}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* OPERATING MODEL */}
        <section id="model" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">A clean operating model</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">One strategy. One brief. One production layer.</h2>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {OPERATING_MODEL.map(({ title, body, icon: Icon }, index) => (
                <Reveal key={title} className="tl-panel p-7" delay={(index + 1) as 1 | 2 | 3}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tl-line)] bg-white/60">
                    <Icon className="h-4.5 w-4.5 text-[var(--tl-teal-deep)]" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tl-ink-muted)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-[1.35rem]">{title}</h3>
                  <p className="mt-3 text-[13.5px] leading-[1.75] text-[var(--tl-ink-soft)]">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ECONOMICS */}
        <section id="economics" className="tl-section">
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Illustrative partner economics</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">A creative add-on Hawkins can offer without building the department.</h2>
              <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                One possible structure is a Hawkins-managed creative program with a defined property fee and Archer
                wholesale production rate. These figures are proposed only and would be finalized together in writing.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {TIERS.map((tier, index) => (
                <Reveal
                  key={tier.name}
                  className={`tl-panel p-7 ${index === 1 ? "tl-panel--featured" : ""}`}
                  delay={(index + 1) as 1 | 2 | 3}
                >
                  {index === 1 && <span className="tl-pkg-badge">Suggested starting point</span>}
                  <p className="tl-eyebrow">{tier.name}</p>
                  <p className="mt-4 text-[2rem] font-medium tracking-[-0.03em] text-[var(--tl-ink)]">{money(tier.property)}<span className="ml-1 text-[12px] font-normal tracking-normal text-[var(--tl-ink-muted)]">/mo</span></p>
                  <p className="mt-2 text-[13px] text-[var(--tl-ink-soft)]">{tier.note}</p>
                  <span className="tl-hline my-6" aria-hidden="true" />
                  <div className="space-y-3 text-[12.5px] text-[var(--tl-ink-soft)]">
                    <div className="flex items-center justify-between gap-4"><span>Archer wholesale</span><strong className="text-[var(--tl-ink)]">{money(tier.archer)}</strong></div>
                    <div className="flex items-center justify-between gap-4"><span>Hawkins retains</span><strong className="text-[var(--tl-teal-deep)]">{money(tier.hawkins)}</strong></div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 max-w-[74ch] text-[11px] leading-[1.65] text-[var(--tl-ink-muted)]">
              Illustrative proposed economics only. Scope, volume, approval process, ownership, billing, client-facing pricing,
              and partner compensation would be subject to a written agreement between Hawkins Hospitality and Archer Design.
            </p>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="tl-section">
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Motion work</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">Hospitality imagery, turned into movement.</h2>
              <p className="mt-5 max-w-[68ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                Examples of Archer motion and hospitality production. Shown as capability examples only — not work commissioned by Hawkins Hospitality.
              </p>
            </Reveal>
            <Reveal delay={1} className="tl-gallery-frame mt-10">
              <div className="archer-studio">
                <MotionPortfolioGallery items={HAWKINS_MOTION} />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Design work</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]">Property-level creative built to move quickly.</h2>
              <p className="mt-5 max-w-[68ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                Real hotel, restaurant, event, package, and seasonal creative from Archer&apos;s existing portfolio.
              </p>
            </Reveal>
            <Reveal delay={1} className="tl-gallery-frame mt-10">
              <div className="archer-studio">
                <WorkPageStillsGallery items={TCRM_IMAGES} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* PILOT */}
        <section id="pilot" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="tl-eyebrow">A low-risk way to test it</p>
              <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.03]">Start with 2–3 hotels for 90 days.</h2>
              <p className="mx-auto mt-6 max-w-[62ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                Pick a small group of hotels where Hawkins already sees clear commercial opportunities. Archer handles the
                production layer, Hawkins keeps the strategy and relationship, and the pilot is judged on speed, quality,
                usefulness, and whether the workflow removes a real execution bottleneck.
              </p>
            </Reveal>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {["Select 2–3 properties", "Run the workflow for 90 days", "Review adoption + expand only if useful"].map((step, i) => (
                <Reveal key={step} className="tl-panel p-6 text-center" delay={(i + 1) as 1 | 2 | 3}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tl-teal-deep)]">0{i + 1}</p>
                  <p className="mt-3 text-[13.5px] font-medium text-[var(--tl-ink)]">{step}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={2} className="mx-auto mt-10 max-w-3xl text-center">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="tl-btn">
                Discuss a Pilot
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <p className="mt-5 text-[11px] leading-relaxed text-[var(--tl-ink-muted)]">
                No exclusivity implied. Any pilot, pricing, referral structure, or client-facing arrangement would require mutual written agreement.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="tl-footer">
        <div className="tl-shell flex flex-col items-center gap-5 text-center">
          <span className="tl-wordmark" aria-hidden="true">
            <span className="tl-wordmark-prep">Hawkins Hospitality × Archer Design</span>
            Creative production concept
          </span>
          <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--tl-ink-muted)]">
            Private speculative partnership concept prepared independently by Archer Design. Hawkins Hospitality has not commissioned, approved, or endorsed this page.
          </p>
          <p className="text-[11.5px] text-[var(--tl-ink-muted)]">
            &copy; {new Date().getFullYear()} Archer Design
          </p>
        </div>
      </footer>
    </div>
  );
}
