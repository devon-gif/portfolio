import type { Metadata } from "next";
import {
  TrendingUp,
  Megaphone,
  DoorOpen,
  Quote,
  Flag,
  Workflow,
  BarChart3,
  CheckCircle2,
  Gauge,
  Palette,
  Layers,
  Network,
  Building2,
  Eye,
  Users,
  ArrowDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { JsonLd } from "@/components/marketing/JsonLd";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { isRevstudioPageApproved, REVSTUDIO_FALLBACK_MAILTO } from "@/lib/revstudio";
import { JointPartnerHeader } from "@/components/marketing/revstudio/JointPartnerHeader";
import { JointFooter } from "@/components/marketing/revstudio/JointFooter";
import { TrackedBookingLink } from "@/components/marketing/revstudio/TrackedBookingLink";
import { PartnershipFAQ } from "@/components/marketing/revstudio/PartnershipFAQ";
import { Reveal } from "@/components/marketing/revstudio/Reveal";
import { ProcessFlow } from "@/components/marketing/revstudio/ProcessFlow";
import { ScenarioFlow } from "@/components/marketing/revstudio/ScenarioFlow";
import {
  HERO,
  OPPORTUNITY,
  RESULTS,
  MODEL,
  PROCESS,
  USE_CASES,
  AGENCIES,
  HOTELS,
  PORTFOLIO,
  PRICING,
  PILOT,
  PARTNERS,
  PRINCIPALS,
  FAQ,
  FINAL_CTA,
} from "@/lib/revstudio-content";
import { HOSPITALITY_LOGOS } from "@/lib/revstudio-logos";

const PAGE_TITLE = "The Revstudio × Archer Design | Hotel Revenue Operations & Creative Execution";
const PAGE_DESCRIPTION =
  "The Revstudio keeps a hotel's commercial side moving: distribution, channels, rate parity, and reporting. Archer Design turns those priorities into finished campaigns. One connected path from revenue priority to finished campaign.";
const OG_IMAGE = absoluteUrl("/revstudio/media/revstudio-hotel-hero-poster.jpg");

const approved = isRevstudioPageApproved();

// Renders one stage of the Opportunity section's execution-gap process.
// Stage 04 gets a two-tone "meeting" node since it's where the two
// partners' work converges back into one guest-facing result.
// Wraps a single word of the hero headline in the purple accent color,
// leaving the rest of the copy exactly as authored in lib/revstudio-content.
function renderAccentedHeadline(headline: string, accentWord: string) {
  const idx = headline.indexOf(accentWord);
  if (idx === -1) return headline;
  return (
    <>
      {headline.slice(0, idx)}
      <span className="text-[var(--rv-blue-bright)]">{accentWord}</span>
      {headline.slice(idx + accentWord.length)}
    </>
  );
}

function renderOpStage(s: (typeof OPPORTUNITY.stages)[number]) {
  const nodeClass = s.index === "04" ? "op-node-meeting" : `op-node-${s.owner}`;
  return (
    <div key={s.index} className={`op-stage op-stage-${s.owner}`}>
      <span className={`op-node ${nodeClass}`} aria-hidden="true" />
      <p className="op-stage-index">{s.index}</p>
      <h3 className="op-stage-label">{s.label}</h3>
      <p className="op-stage-desc">{s.description}</p>
      {s.owner !== "shared" && (
        <p className="op-stage-owner">
          <span className="op-owner-dot" aria-hidden="true" />
          {s.owner === "revstudio" ? "The Revstudio · Commercial execution" : "Archer Design · Creative execution"}
        </p>
      )}
    </div>
  );
}

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/revstudio") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/revstudio"),
    images: [{ url: OG_IMAGE, width: 1664, height: 1248, alt: "A hotel property, isolated at night, from The Revstudio's hero video" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  // Early/unapproved page, noindex until REVSTUDIO_PAGE_APPROVED=true.
  robots: approved
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

const HERO_BENEFIT_ICONS = [TrendingUp, Megaphone, DoorOpen];
const PILOT_FLOW_ICONS = [Flag, Workflow, BarChart3];

export default function RevstudioPage() {
  return (
    <div id="top" className={`${fraunces.variable} revstudio-theme relative min-h-screen`}>
      <JsonLd
        data={[
          serviceJsonLd({
            name: "The Revstudio × Archer Design, Hotel Revenue Operations & Creative Execution",
            description: PAGE_DESCRIPTION,
            path: "/revstudio",
            serviceType: "Hotel revenue management, distribution operations, and hospitality creative execution",
          }),
          faqJsonLd(FAQ),
        ]}
      />

      <div className="rv-ops-field pointer-events-none absolute inset-x-0 top-0 h-[900px]" aria-hidden="true" />

      <JointPartnerHeader />

      {/* ============================================================
          HERO — stable, fixed-width composition (see .rv-hero-grid,
          .rv-shell in globals.css). Left edge locked to the header logo
          via the same .rv-shell padding.
          ============================================================ */}
      <section className="relative overflow-hidden pb-14 pt-16 md:pb-20 md:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-[1]"
          style={{ background: "radial-gradient(52% 58% at 72% 32%, rgba(150,104,215,0.12), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="rv-shell rv-hero-grid">
          <Reveal className="rv-hero-copy">
            <p className="rv-kicker">{HERO.eyebrow}</p>
            <span className="mt-3 block h-px w-10 bg-[var(--rv-blue-bright)] opacity-60" aria-hidden="true" />
            <h1 className="mt-5 font-serif text-[2.2rem] leading-[1.12] text-[var(--rv-ink)] sm:text-[2.7rem] lg:text-[2.85rem]">
              {renderAccentedHeadline(HERO.headline, "finished")}
            </h1>
            <p className="mt-5 max-w-[38ch] text-[14.5px] leading-[1.7] text-[var(--rv-ink-soft)]">{HERO.supporting}</p>

            <div className="mt-7 flex flex-wrap items-stretch gap-4">
              <TrackedBookingLink variant="hero" className="rv-btn px-6 py-3.5 text-[13.5px]">
                {HERO.primaryCta}
              </TrackedBookingLink>
              <a href="#model" className="rv-btn-ghost px-6 py-3.5 text-[13.5px]">
                {HERO.secondaryCta}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </a>
            </div>

            <div className="rv-hero-benefits mt-7">
              {HERO.benefits.map((b, i) => {
                const Icon = HERO_BENEFIT_ICONS[i] ?? TrendingUp;
                return (
                  <div key={b.label} className="rv-hero-benefit">
                    <span className="rv-icon-badge rv-icon-badge--sm" aria-hidden="true">
                      <Icon strokeWidth={1.75} />
                    </span>
                    <p className="rv-hero-benefit-label">{b.label}</p>
                    <p className="rv-hero-benefit-support">{b.support}</p>
                  </div>
                );
              })}
            </div>

            <div className="rv-proof-strip mt-6">
              <Quote className="rv-proof-mark" aria-hidden="true" strokeWidth={1.5} />
              <div>
                <p className="rv-proof-lead">{HERO.proof.lead}</p>
                <p className="rv-proof-attribution">{HERO.proof.attribution}</p>
              </div>
            </div>

            <div className="rv-hero-connector mt-5">
              <span className="rv-hero-connector-line" aria-hidden="true" />
              <span className="rv-hero-connector-node" aria-hidden="true" />
              <p className="text-[12px] italic text-[var(--rv-ink-muted)]">{HERO.italicLine}</p>
            </div>
          </Reveal>

          <Reveal delay={2} className="rv-hero-visual">
            <div className="rv-hero-stage rv-hero-stage--pad">
              <span className="rv-hero-corner rv-hero-corner-tl" aria-hidden="true" />
              <span className="rv-hero-corner rv-hero-corner-br" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/revstudio/media/new-building-trs.png"
                alt="The Revstudio's hotel property, an isolated architectural rendering"
                className="rv-hero-building-image"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={3} className="rv-shell mt-14 md:mt-16">
          <p className="rv-kicker text-center">{RESULTS.logosHeading}</p>
          <div className="rs-logos mt-6">
            {HOSPITALITY_LOGOS.filter((logo) => logo.approved).map((logo) => (
              <span key={logo.name} className="rs-logo-item">
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </span>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-[var(--rv-ink-muted)]">{RESULTS.logosDisclaimer}</p>
        </Reveal>
      </section>

      {/* ============================================================
          THE OPPORTUNITY: editorial intro + execution-gap infographic
          ============================================================ */}
      <section id="opportunity" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="rv-opportunity-grid">
            <Reveal>
              <p className="rv-kicker">{OPPORTUNITY.eyebrow}</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">{OPPORTUNITY.headline}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{OPPORTUNITY.body}</p>
              <p className="mt-6 font-serif text-[1.05rem] italic leading-relaxed text-[var(--rv-ink)] sm:text-[1.2rem]">{OPPORTUNITY.bridge}</p>
            </Reveal>

            {/* The isolated hotel-entrance "light fade" loop, framed like the
                hero's architectural stage. Purely decorative, so it's
                aria-hidden and never receives focus. */}
            <Reveal delay={1} className="rv-opportunity-visual">
              <div className="rv-hero-stage">
                <span className="rv-hero-corner rv-hero-corner-tl" aria-hidden="true" />
                <span className="rv-hero-corner rv-hero-corner-br" aria-hidden="true" />
                <video
                  className="rv-opportunity-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <source src="/revstudio/media/light%20fade.mp4" type="video/mp4" />
                </video>
              </div>
            </Reveal>
          </div>

          <Reveal delay={1} className="op-frame mt-12 p-7 sm:p-9 lg:p-10">
            <div className="op-track">
              {renderOpStage(OPPORTUNITY.stages[0])}
              <span className="op-connector op-connector-revstudio" aria-hidden="true" />
              {renderOpStage(OPPORTUNITY.stages[1])}

              <div className="op-gap">
                <span className="op-gap-node op-gap-fade" aria-hidden="true" />
                <p className="op-gap-label op-gap-fade">{OPPORTUNITY.gap.label}</p>
                <p className="op-gap-body op-gap-fade">{OPPORTUNITY.gap.body}</p>
              </div>

              {renderOpStage(OPPORTUNITY.stages[2])}
              <span className="op-connector op-connector-archer" aria-hidden="true" />
              {renderOpStage(OPPORTUNITY.stages[3])}
            </div>
          </Reveal>

          <Reveal delay={2} className="op-frame mt-8 p-7 sm:p-9">
            <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="op-conclusion-revstudio">
                <p className="rv-kicker">The Revstudio</p>
                <p className="op-conclusion-text">{OPPORTUNITY.conclusion.revstudio}</p>
              </div>
              <div className="op-conclusion-center">
                <span className="op-conclusion-line" aria-hidden="true" />
                <span className="op-badge">{OPPORTUNITY.conclusion.badge}</span>
              </div>
              <div className="op-conclusion-archer">
                <p className="rv-kicker">Archer Design</p>
                <p className="op-conclusion-text">{OPPORTUNITY.conclusion.archer}</p>
              </div>
            </div>
            <p className="op-conclusion-closing">{OPPORTUNITY.conclusion.closing}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          RESULTS: two separately attributed proof sets
          ============================================================ */}
      <section id="results" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(55% 55% at 50% 0%, rgba(150,104,215,0.06), transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="rs-header-row">
            <div className="max-w-2xl">
              <p className="rv-kicker">{RESULTS.eyebrow}</p>
              <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">{RESULTS.headline}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{RESULTS.body}</p>
            </div>
            <div className="rs-header-visual" aria-hidden="true">
              <img src="/revstudio/media/bell.png" alt="" loading="lazy" />
            </div>
          </Reveal>

          <Reveal delay={1} className="rs-frame mt-12 p-7 sm:p-9 lg:p-10">
            <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
              <div className="rs-revstudio">
                <p className="rv-kicker">{RESULTS.revstudio.name}</p>
                <p className="rs-side-tag">{RESULTS.revstudio.tag}</p>
                <div className="rs-stats">
                  {RESULTS.revstudio.stats.map((stat) => (
                    <div key={stat.label} className="rs-stat">
                      <p className="rs-value">{stat.value}</p>
                      <span className="rs-rule" aria-hidden="true" />
                      <p className="rs-label">{stat.label}</p>
                      {stat.sublabel && <p className="rs-sublabel">{stat.sublabel}</p>}
                    </div>
                  ))}
                </div>
                <p className="rs-disclaimer">{RESULTS.revstudio.disclaimer}</p>
              </div>

              <div className="rs-bridge">
                <span className="rs-bridge-line" aria-hidden="true" />
                <span className="rs-bridge-word rs-bridge-word-revstudio">{RESULTS.bridge.top}</span>
                <span className="rs-bridge-plus" aria-hidden="true">+</span>
                <span className="rs-bridge-word rs-bridge-word-archer">{RESULTS.bridge.bottom}</span>
              </div>

              <div className="rs-archer">
                <p className="rv-kicker">{RESULTS.archer.name}</p>
                <p className="rs-side-tag">{RESULTS.archer.tag}</p>
                <div className="rs-stats">
                  {RESULTS.archer.stats.map((stat) => (
                    <div key={stat.label} className="rs-stat">
                      <p className="rs-value">{stat.value}</p>
                      <span className="rs-rule" aria-hidden="true" />
                      <p className="rs-label">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="rs-disclaimer">{RESULTS.archer.disclaimer}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-6 text-center">
            <p className="mx-auto max-w-2xl text-[12.5px] leading-relaxed text-[var(--rv-ink-muted)]">{RESULTS.bridgeNote}</p>
          </Reveal>

        </div>
      </section>

      {/* ============================================================
          THE COMBINED MODEL
          ============================================================ */}
      <section id="model" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">{MODEL.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">{MODEL.headline}</h2>
          </Reveal>

          <div className="mt-14 grid items-stretch gap-10 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal delay={1} id="revenue-operations" className="scroll-mt-24 rv-model-card rv-model-card--revstudio p-7 sm:p-8">
              <h3 className="font-serif text-[18px] text-[var(--rv-ink)]">{MODEL.revstudio.name}</h3>
              <p className="rv-kicker mt-1">{MODEL.revstudio.tag}</p>
              <span className="rv-hline my-5" aria-hidden="true" />
              <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--rv-ink-soft)]">
                {MODEL.revstudio.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--rv-blue-bright)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="hidden lg:block rv-vline" aria-hidden="true" />
            <div className="rv-hline lg:hidden" aria-hidden="true" />

            <Reveal delay={2} id="creative-execution" className="scroll-mt-24 rv-model-card rv-model-card--archer p-7 sm:p-8">
              <h3 className="font-serif text-[18px] text-[var(--rv-ink)]">{MODEL.archer.name}</h3>
              <p className="rv-kicker mt-1">{MODEL.archer.tag}</p>
              <span className="rv-hline my-5" aria-hidden="true" />
              <ul className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-[var(--rv-ink-soft)]">
                {MODEL.archer.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--rv-blue-bright)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={3} className="mt-10 text-center">
            <p className="mx-auto max-w-2xl font-serif text-[1.15rem] italic leading-relaxed text-[var(--rv-ink-soft)]">{MODEL.bridge}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
          ============================================================ */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">{PROCESS.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">{PROCESS.headline}</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--rv-ink-soft)]">{PROCESS.subheading}</p>
          </Reveal>

          <ProcessFlow stages={PROCESS.stages} centralBadge={PROCESS.centralBadge} />
        </div>
      </section>

      {/* ============================================================
          IN PRACTICE
          ============================================================ */}
      <section id="practice" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">{USE_CASES.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">{USE_CASES.headline}</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--rv-ink-soft)]">{USE_CASES.subheading}</p>
          </Reveal>

          <ScenarioFlow items={USE_CASES.items} />
        </div>
      </section>

      {/* ============================================================
          THE ACTIVATION LAYER, visual proof that commercial signal
          becomes guest-facing creative. Real local Archer Design work
          only; no invented clients, no invented performance claims.
          ============================================================ */}
      <section id="activation-layer" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">The activation layer</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.5rem]">
              When the commercial priority is clear, the creative should be ready.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">
              Revenue operations surfaces where the demand is. Archer Design turns that signal into the property
              motion, campaign visuals, and seasonal creative a hotel actually runs, on-site, on social, and in
              print. A sample of that work, drawn from active engagements across the portfolio.
            </p>
          </Reveal>

          <Reveal delay={2} className="am-mosaic mt-12">
            <div className="am-item am-feature">
              <video src="/archer-preview/motion/pendry-hotel-entrance-night.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Property motion, hotel entrance at night" />
              <div className="am-cap">
                <span className="am-cap-idx">01</span>
                <span className="am-cap-label">Property motion</span>
              </div>
            </div>

            <div className="am-item am-tall">
              <img src="/Work%20page/Image%202.png" alt="Hotel Indigo direct-booking campaign design" loading="lazy" />
              <div className="am-cap">
                <span className="am-cap-idx">02</span>
                <span className="am-cap-label">Direct-booking campaign</span>
              </div>
            </div>

            <div className="am-item am-small-a">
              <img src="/Work%20page/Image%204.png" alt="Hampton by Hilton event activation poster" loading="lazy" />
              <div className="am-cap">
                <span className="am-cap-idx">03</span>
                <span className="am-cap-label">Event activation</span>
              </div>
            </div>

            <div className="am-item am-small-b">
              <video src="/lark/media/03-property/property.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Hotel lounge and meeting space" />
              <div className="am-cap">
                <span className="am-cap-idx">04</span>
                <span className="am-cap-label">Meetings &amp; weddings</span>
              </div>
            </div>

            <div className="am-item am-medium">
              <img src="/Work%20page/Image%205.png" alt="Restaurant food and beverage promotional design" loading="lazy" />
              <div className="am-cap">
                <span className="am-cap-idx">05</span>
                <span className="am-cap-label">F&amp;B storytelling</span>
              </div>
            </div>

            <div className="am-item am-wide-a">
              <img src="/Work%20page/Image%203.png" alt="Seasonal restaurant billboard campaign" loading="lazy" />
              <div className="am-cap">
                <span className="am-cap-idx">06</span>
                <span className="am-cap-label">Seasonal campaign</span>
              </div>
            </div>

            <div className="am-item am-wide-b">
              <video src="/dovetail/media/05-wayfinder/wayfinder.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Boutique hotel exterior, local demand" />
              <div className="am-cap">
                <span className="am-cap-idx">07</span>
                <span className="am-cap-label">Local demand</span>
              </div>
            </div>

            <div className="am-item am-motion">
              <video src="/valencia/media/george-exterior.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Boutique hotel entrance at night, property-level creative" />
              <div className="am-cap">
                <span className="am-cap-idx">08</span>
                <span className="am-cap-label">Property-level creative</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={3} className="mt-10 text-center">
            <a
              href="https://www.archerdesign.shop/social-media-work"
              className="rv-btn px-7 py-3.5 text-[13.5px]"
            >
              See more design work
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FOR AGENCIES
          ============================================================ */}
      <section id="agencies" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <p className="rv-kicker">{AGENCIES.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">{AGENCIES.headline}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{AGENCIES.body}</p>
            <p className="mt-5 text-[11.5px] leading-relaxed text-[var(--rv-ink-muted)]">{AGENCIES.disclaimer}</p>
          </Reveal>

          <Reveal delay={2} className="rv-model-card rv-model-card--revstudio p-7 sm:p-8">
            <p className="rv-kicker leading-relaxed">{AGENCIES.cardLabel}</p>
            <span className="rv-hline mt-5 mb-1" aria-hidden="true" />
            {AGENCIES.groups.map((g, i) => {
              const Icon = i === 0 ? Gauge : i === 1 ? Palette : Users;
              return (
                <div key={g.title} className="rv-group-block">
                  <div className="flex items-center gap-3">
                    <span className="rv-icon-badge rv-icon-badge--sm" aria-hidden="true">
                      <Icon strokeWidth={1.75} />
                    </span>
                    <p className="rv-group-title">{g.title}</p>
                  </div>
                  <ul className="rv-check-list mt-3.5">
                    {g.items.map((item) => (
                      <li key={item} className="rv-check-item">
                        <span className="rv-check-icon" aria-hidden="true">
                          <CheckCircle2 strokeWidth={2} size={11} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FOR HOTELS
          ============================================================ */}
      <section id="hotels" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">{HOTELS.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">{HOTELS.headline}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{HOTELS.body}</p>
            <p className="rv-kicker mt-6">{HOTELS.summaryLabel}</p>
          </Reveal>

          <div className="rv-compare-grid mt-6">
            <Reveal delay={1} className="rv-model-card rv-model-card--revstudio p-7 sm:p-8">
              <span className="rv-icon-badge" aria-hidden="true">
                <Eye strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-serif text-[15px] text-[var(--rv-ink)]">{MODEL.revstudio.name} handles</h3>
              <span className="rv-hline my-4" aria-hidden="true" />
              <div className="flex flex-wrap gap-2">
                {HOTELS.revstudioHandles.map((h) => (
                  <span key={h} className="rv-chip">
                    {h}
                  </span>
                ))}
              </div>
            </Reveal>

            <div className="rv-compare-connector">
              <span className="rv-compare-connector-line" aria-hidden="true" />
              <span className="rv-compare-connector-line" aria-hidden="true" />
            </div>

            <Reveal delay={2} className="rv-model-card rv-model-card--archer p-7 sm:p-8">
              <span className="rv-icon-badge rv-icon-badge--archer" aria-hidden="true">
                <Sparkles strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-serif text-[15px] text-[var(--rv-ink)]">{MODEL.archer.name} handles</h3>
              <span className="rv-hline my-4" aria-hidden="true" />
              <div className="flex flex-wrap gap-2">
                {HOTELS.archerHandles.map((h) => (
                  <span key={h} className="rv-chip">
                    {h}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={3} className="mt-8 text-center">
            <span className="rv-banner">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              {HOTELS.summaryBanner}
            </span>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PORTFOLIO / MULTI-PROPERTY
          ============================================================ */}
      <section id="portfolio" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">Portfolio</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">{PORTFOLIO.headline}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{PORTFOLIO.body}</p>
          </Reveal>

          <Reveal delay={1} className="rv-model-card rv-model-card--revstudio mt-10 p-7 sm:p-9">
            <span className="rv-icon-badge" aria-hidden="true">
              <Network strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-serif text-[17px] text-[var(--rv-ink)]">{PORTFOLIO.portfolioTitle}</h3>
            <span className="rv-hline my-4" aria-hidden="true" />
            <div className="flex flex-wrap gap-2">
              {PORTFOLIO.portfolioLevel.map((p) => (
                <span key={p} className="rv-chip">
                  {p}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mx-auto my-3 flex flex-col items-center gap-2" aria-hidden="true">
            <span className="h-8 w-px bg-gradient-to-b from-[var(--rv-blue-bright)] to-[var(--rv-champagne)]" />
            <ArrowDown className="h-4 w-4 text-[var(--rv-ink-muted)]" strokeWidth={1.75} />
          </div>
          <p className="mx-auto max-w-md text-center text-[12px] italic text-[var(--rv-ink-muted)]">{PORTFOLIO.connector}</p>

          <Reveal delay={2} className="rv-model-card rv-model-card--archer mt-6 p-7 sm:p-9">
            <span className="rv-icon-badge rv-icon-badge--archer" aria-hidden="true">
              <Building2 strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 font-serif text-[17px] text-[var(--rv-ink)]">{PORTFOLIO.propertyTitle}</h3>
            <span className="rv-hline my-4" aria-hidden="true" />
            <div className="flex flex-wrap gap-2">
              {PORTFOLIO.propertyLevel.map((p) => (
                <span key={p} className="rv-chip">
                  {p}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PRICING
          ============================================================ */}
      <section id="pricing" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl rv-model-card rv-model-card--revstudio p-8 sm:p-10">
          <Reveal>
            <span className="rv-icon-badge" aria-hidden="true">
              <Layers strokeWidth={1.75} />
            </span>
            <p className="rv-kicker mt-4">{PRICING.eyebrow}</p>
            <h2 className="mt-3 font-serif text-[1.9rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.2rem]">{PRICING.headline}</h2>

            <div className="rv-price-callout">
              <span className="rv-price-number">{PRICING.primaryCallout}</span>
              <span className="rv-price-unit">{PRICING.calloutUnit}</span>
            </div>
            <p className="rv-price-sublabel">{PRICING.calloutSubLabel}</p>

            <span className="rv-hline my-6" aria-hidden="true" />

            <ul className="grid gap-3 sm:grid-cols-2">
              {PRICING.detailLines.map((d) => (
                <li key={d} className="rv-check-item">
                  <span className="rv-check-icon" aria-hidden="true">
                    <CheckCircle2 strokeWidth={2} size={11} />
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            <p className="rv-price-row">{PRICING.visualRow}</p>

            <p className="mt-6 text-[11px] leading-relaxed text-[var(--rv-ink-muted)]">{PRICING.smallPrint}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          THE PILOT
          ============================================================ */}
      <section id="pilot" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <p className="rv-kicker">{PILOT.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">{PILOT.headline}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{PILOT.body}</p>
            <TrackedBookingLink variant="pilot" className="rv-btn mt-8 px-6 py-3.5 text-[13.5px]">
              {PILOT.cta}
            </TrackedBookingLink>

            <div className="rv-flow mt-8">
              {PILOT.flow.map((f, i) => {
                const Icon = PILOT_FLOW_ICONS[i] ?? Flag;
                return (
                  <span key={f.label} className="flex items-center gap-2">
                    <span className="rv-flow-step">
                      <Icon className="rv-flow-step-num" strokeWidth={2} size={13} aria-hidden="true" />
                      {f.label}
                    </span>
                    {i < PILOT.flow.length - 1 && <span className="rv-flow-arrow" aria-hidden="true">&rarr;</span>}
                  </span>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={2} className="rv-model-card rv-model-card--revstudio p-7 sm:p-8">
            <h3 className="font-serif text-[16px] text-[var(--rv-ink)]">{PILOT.checklistTitle}</h3>
            <span className="rv-hline my-4" aria-hidden="true" />
            <ul className="rv-check-list">
              {PILOT.structure.map((s) => (
                <li key={s} className="rv-check-item">
                  <span className="rv-check-icon" aria-hidden="true">
                    <CheckCircle2 strokeWidth={2} size={11} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          THE PARTNERS
          ============================================================ */}
      <section id="partners" className="scroll-mt-24 relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="rv-model-atmosphere pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="rv-model-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="rv-kicker">{PARTNERS.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">{PARTNERS.headline}</h2>
          </Reveal>

          <div className="rv-compare-grid mt-10">
            <Reveal delay={1} className="rv-model-card rv-model-card--revstudio p-7 sm:p-8">
              <span className="rv-icon-badge" aria-hidden="true">
                <Gauge strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-serif text-[17px] text-[var(--rv-ink)]">{PARTNERS.revstudio.name}</h3>
              <p className="rv-kicker mt-1">{PARTNERS.revstudio.tag}</p>
              <span className="rv-hline my-4" aria-hidden="true" />
              <ul className="rv-check-list">
                {PARTNERS.revstudio.bullets.map((b) => (
                  <li key={b} className="rv-check-item">
                    <span className="rv-check-icon" aria-hidden="true">
                      <CheckCircle2 strokeWidth={2} size={11} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="rv-compare-connector">
              <span className="rv-compare-connector-line" aria-hidden="true" />
              <p className="rv-compare-connector-label">{PARTNERS.connectorLabel}</p>
              <span className="rv-compare-connector-line" aria-hidden="true" />
            </div>

            <Reveal delay={2} className="rv-model-card rv-model-card--archer p-7 sm:p-8">
              <span className="rv-icon-badge rv-icon-badge--archer" aria-hidden="true">
                <Palette strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-serif text-[17px] text-[var(--rv-ink)]">{PARTNERS.archer.name}</h3>
              <p className="rv-kicker mt-1">{PARTNERS.archer.tag}</p>
              <span className="rv-hline my-4" aria-hidden="true" />
              <ul className="rv-check-list">
                {PARTNERS.archer.bullets.map((b) => (
                  <li key={b} className="rv-check-item">
                    <span className="rv-check-icon" aria-hidden="true">
                      <CheckCircle2 strokeWidth={2} size={11} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="rv-mini-stats">
                {PARTNERS.archer.stats.map((s) => (
                  <div key={s.label}>
                    <p className="rv-mini-stat-value">{s.value}</p>
                    <p className="rv-mini-stat-label">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={3} className="mt-8 max-w-3xl">
            <p className="text-[11.5px] leading-relaxed text-[var(--rv-ink-muted)]">{PARTNERS.independenceLine}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FAQ
          ============================================================ */}
      <section id="faq" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="rv-kicker">FAQ</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.4rem]">Common questions.</h2>
          </Reveal>
          <Reveal delay={1} className="mt-8">
            <PartnershipFAQ items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="relative overflow-hidden border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-24 md:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(150,104,215,0.09), transparent 70%)" }}
          aria-hidden="true"
        />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="rv-hline mx-auto mb-8 max-w-xs" aria-hidden="true" />
          <h2 className="font-serif text-[2rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.6rem]">{FINAL_CTA.headline}</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--rv-ink-soft)]">{FINAL_CTA.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <TrackedBookingLink variant="final-cta" className="rv-btn px-7 py-3.5 text-[13.5px]">
              {FINAL_CTA.primaryCta}
            </TrackedBookingLink>
            <a href={REVSTUDIO_FALLBACK_MAILTO} className="rv-btn-ghost px-7 py-3.5 text-[13.5px]">
              {FINAL_CTA.secondaryCta}
            </a>
          </div>
        </Reveal>
      </section>

      {/* ============================================================
          THE PEOPLE — the two business owners behind the partnership
          ============================================================ */}
      <section id="people" className="scroll-mt-24 border-t border-[var(--rv-line)] px-6 sm:px-8 lg:px-10 py-20 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="rv-kicker">{PRINCIPALS.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[1.8rem] leading-[1.15] text-[var(--rv-ink)] sm:text-[2.2rem]">{PRINCIPALS.headline}</h2>
          </Reveal>

          <Reveal delay={1} className="rv-people-row mt-12">
            {PRINCIPALS.people.map((person) => (
              <div key={person.name} className={`rv-people-card rv-people-card--${person.side}`}>
                <span className="rv-people-avatar">
                  <img src={person.photo} alt={person.name} loading="lazy" />
                </span>
                <p className="rv-people-name">{person.name}</p>
                <p className="rv-people-company">{person.company}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <JointFooter />
    </div>
  );
}
