import type { Metadata } from "next";
import { ArrowRight, Eye, Heart, Images, Quote, Users } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { Reveal } from "./components/Reveal";
import { RebelHeader } from "./components/RebelHeader";
import { RebelCalculator } from "./components/RebelCalculator";
import { RebelMotion } from "./components/RebelMotion";
import { RebelMotionGrid } from "./components/RebelMotionGrid";
import { RebelWorkCarousel } from "./components/RebelWorkCarousel";
import { REBEL_CLIPS, getMotionForCategory, type RebelMotionCategory } from "./rebel-motion-data";
import { MOTION_WORK_ITEMS, DESIGN_WORK_ITEMS } from "./rebel-work-carousel-data";
import {
  ACTIVATION_TIERS,
  ADOPTION_HEADING,
  ADOPTION_INTRO,
  ADOPTION_SCENARIOS,
  ADOPTION_SUPPORTING,
  CORE_INCLUDES,
  DEFAULT_PARTICIPATING_PROPERTIES,
  DEFAULT_TIER_KEY,
  MAX_PARTICIPATING_PROPERTIES,
  PACKAGES_INCLUDES_LABEL,
  PACKAGES_TABLE_HEADING,
  PARTNER_ECONOMICS_ALT_MODEL,
  PARTNER_ECONOMICS_EYEBROW,
  PARTNER_ECONOMICS_HEADING,
  PARTNER_ECONOMICS_INTRO,
  PARTNER_ECONOMICS_QUALIFICATION,
  SERVICE_MODES,
  SERVICE_MODES_HEADING,
  annualGrossMargin,
  fmtMoney,
  fmtPct,
  grossMargin,
  marginPct,
  platformFiles,
  tierByKey,
  totalConcepts,
} from "./rebel-config";
import {
  ARCHER_DELIVERS,
  CAPACITY_BODY,
  CAPACITY_EYEBROW,
  CAPACITY_HEADING,
  CAPACITY_INTRO,
  CAPACITY_POINTS,
  CONFIDENCE_QUOTE,
  CONFIDENCE_SUPPORTING,
  CONNECT_EYEBROW,
  CONNECT_HEADING,
  CONNECT_INTRO,
  CONNECT_NOTE,
  CONNECT_PAIRS,
  CONTROL_HEADING,
  FINAL_COPY,
  FINAL_EYEBROW,
  FINAL_HEADING,
  FINAL_PRIMARY_CTA,
  FOOTER_DISCLAIMER,
  HERO_BODY,
  HERO_DISCLOSURE,
  HERO_EYEBROW,
  HERO_HEADLINE_LINE_1,
  HERO_HEADLINE_LINE_2,
  HERO_PRIMARY_CTA,
  NOTE_PARAGRAPHS,
  NOTE_SALUTATION,
  NOTE_SIGNATURE,
  OPERATING_MODELS,
  OPERATING_MODELS_HEADING,
  OPERATING_MODELS_NOTE,
  PILOT_CALENDLY_URL,
  PILOT_CTA,
  PILOT_EYEBROW,
  PILOT_HEADING,
  PILOT_NOTE,
  PILOT_PHASES,
  PORTFOLIO_EYEBROW,
  PORTFOLIO_HEADING,
  PORTFOLIO_INTRO,
  PORTFOLIO_NOTE,
  PRIVATE_LABEL_EYEBROW,
  PRIVATE_LABEL_SUB,
  PROOF_EYEBROW,
  PROOF_FOOTNOTE,
  PROOF_STATS,
  PROPERTY_RETAINS,
  REBEL_CONTROLS,
  SCALE_HEADING,
  SCALE_QUALIFIER,
  SCALE_STATS,
  WORKFLOW_CLOSING,
  WORKFLOW_EYEBROW,
  WORKFLOW_HEADING,
  WORKFLOW_STEPS,
} from "./rebel-content";

// Root layout's metadata.title.template appends " | Archer Design" -- this
// string must NOT repeat that suffix, or the rendered <title> duplicates it.
const PAGE_TITLE = "Partnership Concept for Rebel Hotel Company";
const PAGE_DESCRIPTION =
  "Private speculative concept exploring additional property-level creative-production capacity for Rebel Hotel Company.";

// Private, unpublished concept page -- never indexed, never linked from the
// main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits
// this route), footer, or public portfolio. Accessible only via direct URL.
// Same noindex/nofollow/nocache treatment as /jacaruso, /bridgetown, and
// /grant-hospitality.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/rebel") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const PROOF_ICONS = [Images, Eye, Users, Heart];
const growthTier = tierByKey("growth");

// Motion moment 2 -- one clip per portfolio type discussed in "One
// portfolio, many different stories to tell": independent/lifestyle,
// branded/full-service, focused-service. None of these three slots is one
// of the seven real Rebel clips (those are placed explicitly elsewhere on
// the page), so this grid keeps the graceful Archer spotlight fallback
// (see rebel-motion-data.ts) -- it becomes automatically property-specific
// the moment real, named-property footage is added later.
const PORTFOLIO_MOTION = [
  ...getMotionForCategory("independent-lifestyle", 1),
  ...getMotionForCategory("branded-full-service", 1),
  ...getMotionForCategory("focused-service", 1),
];

// "Where Rebel + Archer connect" pairs three of its six motionCategory
// slots directly to real Rebel clips (Noodles/Room/Wedding); the other
// three (destination, independent-lifestyle, focused-service) keep the
// graceful Archer spotlight fallback via getMotionForCategory below, so
// no clip is ever duplicated across the page.
const CONNECT_CLIP_OVERRIDES: Partial<Record<RebelMotionCategory, { src: string; alt: string }>> = {
  fb: REBEL_CLIPS.noodles,
  "branded-full-service": REBEL_CLIPS.room,
  campaigns: REBEL_CLIPS.wedding,
};

export default function RebelPage() {
  return (
    <div id="top" className="rebel-theme">
      <RebelHeader />

      {/* Private-concept label -- short, unobtrusive; the full legal
          disclosure appears again below, near the hero, and once more in
          the footer. */}
      <div className="rb-private-bar">
        <div className="rb-shell rb-private-bar-inner">
          <p className="rb-private-label">
            {PRIVATE_LABEL_EYEBROW}
            <span>{PRIVATE_LABEL_SUB}</span>
          </p>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="rb-hero--video">
        {/* The actual Rebel-specific hero clip -- explicit, hard-wired,
            no fallback/config layer between this path and the rendered
            <video>. See rebel-motion-data.ts REBEL_CLIPS.hero. */}
        <video
          className="rb-hero-video"
          src={REBEL_CLIPS.hero.src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="rb-hero-overlay" aria-hidden="true" />
        <div className="rb-hero-fade" aria-hidden="true" />

        <div className="rb-shell">
          <div className="rb-hero-content">
            <p className="rb-eyebrow">{HERO_EYEBROW}</p>
            <h1 className="mt-5 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.16]">
              {HERO_HEADLINE_LINE_1}
              <br />
              {HERO_HEADLINE_LINE_2}
            </h1>
            <p className="rb-hero-copy mt-5 max-w-[42ch] text-[14.5px] leading-relaxed">{HERO_BODY}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="rb-btn">
                {HERO_PRIMARY_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Small, unobtrusive single-line disclosure directly below the hero --
          the full disclaimer still lives in the footer. */}
      <div className="rb-hero-disclosure-bar">
        <div className="rb-shell">
          <p className="rb-hero-disclosure-line">{HERO_DISCLOSURE}</p>
        </div>
      </div>

      {/* ── Archer proof ─────────────────────────────────────────────────── */}
      <section id="proof" className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow">{PROOF_EYEBROW}</p>
          </Reveal>

          <Reveal delay={1} className="mt-6">
            <div className="rb-stat-band rb-stat-band--proof">
              {PROOF_STATS.map((s, i) => {
                const Icon = PROOF_ICONS[i];
                return (
                  <div key={s.label} className="rb-stat">
                    <Icon size={16} className="mx-auto mb-2 text-[var(--rb-gold-soft)]" aria-hidden="true" />
                    <p className="rb-stat-value">{s.value}</p>
                    <p className="rb-stat-label">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-10">
            <div className="rb-quote-panel">
              <Quote size={22} className="mb-4 text-[var(--rb-gold-soft)]" aria-hidden="true" />
              <p className="rb-quote-mark">&ldquo;{CONFIDENCE_QUOTE}&rdquo;</p>
              <p className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-[rgba(248,245,239,0.7)]">
                {CONFIDENCE_SUPPORTING}
              </p>
              <p className="rb-qualifier mt-4">{PROOF_FOOTNOTE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Motion moment 1: large early-page portfolio motion feature ─────
          cityscape.mp4 -- one of the seven real Rebel clips -- leads
          directly into "One portfolio. Many different stories to tell."
          below, the early luxury/portfolio section it was shot for. ──── */}
      <section className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow">What Archer makes</p>
            <h2 className="mt-3 max-w-[26ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">
              Still photos, brought to life.
            </h2>
          </Reveal>
          <Reveal delay={1} className="rb-motion-feature mt-9">
            <RebelMotion
              videoSrc={REBEL_CLIPS.cityscape.src}
              alt={REBEL_CLIPS.cityscape.alt}
              caption={REBEL_CLIPS.cityscape.caption}
              eager
            />
          </Reveal>
        </div>
      </section>

      {/* ── One portfolio. Many different stories to tell. ─────────────────
          Motion moment 2 (three-property grid) lives inside this section. */}
      <section id="portfolio" className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow rb-eyebrow--on-light">{PORTFOLIO_EYEBROW}</p>
            <h2 className="mt-3 max-w-[26ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{PORTFOLIO_HEADING}</h2>
            <p className="rb-portfolio-copy mt-5 text-[14.5px] leading-relaxed text-[var(--rb-ink-soft)]">
              {PORTFOLIO_INTRO}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <RebelMotionGrid items={PORTFOLIO_MOTION} />
          </Reveal>

          <Reveal delay={2}>
            <p className="rb-qualifier mt-8">{PORTFOLIO_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Creative capacity without another department ───────────────────── */}
      <section id="capacity" className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow">{CAPACITY_EYEBROW}</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{CAPACITY_HEADING}</h2>
            <p className="mt-5 max-w-[68ch] text-[14.5px] leading-relaxed text-[rgba(248,245,239,0.82)]">{CAPACITY_INTRO}</p>
            <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-[rgba(248,245,239,0.82)]">{CAPACITY_BODY}</p>
          </Reveal>
          <Reveal delay={1}>
            <div className="rb-capacity-points">
              {CAPACITY_POINTS.map((p) => (
                <div key={p} className="rb-capacity-point">
                  <span className="rb-dot" aria-hidden="true" />
                  {p}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partner economics ────────────────────────────────────────────── */}
      <section id="economics" className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow rb-eyebrow--on-light">{PARTNER_ECONOMICS_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{PARTNER_ECONOMICS_HEADING}</h2>
            <p className="rb-econ-highlight-line mt-4">{PARTNER_ECONOMICS_INTRO}</p>
          </Reveal>

          <Reveal delay={1} className="rb-table-wrap">
            <table className="rb-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Property pays</th>
                  <th>Archer wholesale</th>
                  <th>Rebel retains</th>
                  <th>Margin</th>
                  <th>Annual</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVATION_TIERS.map((tier) => (
                  <tr key={tier.key} className={tier.key === DEFAULT_TIER_KEY ? "rb-table-row--highlight" : undefined}>
                    <td>
                      {tier.name}
                      {tier.badge ? " ⭐" : ""}
                    </td>
                    <td>{fmtMoney(tier.propertyPays)}</td>
                    <td>{fmtMoney(tier.archerRate)}</td>
                    <td>{fmtMoney(grossMargin(tier))}</td>
                    <td>{fmtPct(marginPct(tier))}</td>
                    <td>{fmtMoney(annualGrossMargin(tier))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal delay={2}>
            <p className="rb-econ-alt-model">{PARTNER_ECONOMICS_ALT_MODEL}</p>
          </Reveal>

          <Reveal delay={2} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--rb-ink)]">{SERVICE_MODES_HEADING}</h3>
            <div className="rb-service-modes">
              {SERVICE_MODES.map((m) => (
                <div key={m.key} className="rb-panel rb-panel--light rb-service-mode">
                  <h4>{m.title}</h4>
                  <p>{m.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={3} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--rb-ink)]">{ADOPTION_HEADING}</h3>
            <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-[var(--rb-ink-soft)]">{ADOPTION_INTRO}</p>

            <div className="rb-table-wrap">
              <table className="rb-table">
                <thead>
                  <tr>
                    <th>Participating properties</th>
                    <th>Monthly margin</th>
                    <th>Annual margin</th>
                  </tr>
                </thead>
                <tbody>
                  {ADOPTION_SCENARIOS.map((s) => (
                    <tr key={s.count} className={s.count === 10 ? "rb-table-row--highlight" : undefined}>
                      <td>
                        {s.count}
                        {s.isPilot ? " (pilot)" : ""}
                      </td>
                      <td>{fmtMoney(grossMargin(growthTier) * s.count)}</td>
                      <td>{fmtMoney(annualGrossMargin(growthTier) * s.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="rb-adoption-callout">
              Ten participating properties is a {fmtMoney(annualGrossMargin(growthTier) * 10)} annual margin line
              with zero production headcount.
            </p>
            <p className="rb-adoption-supporting">{ADOPTION_SUPPORTING}</p>
          </Reveal>

          <Reveal delay={4}>
            <p className="rb-qualifier mt-8">{PARTNER_ECONOMICS_QUALIFICATION}</p>
          </Reveal>

          {/* ── What's in each package ──────────────────────────────────── */}
          <Reveal delay={1} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--rb-ink)]">{PACKAGES_TABLE_HEADING}</h3>
            <div className="rb-table-wrap">
              <table className="rb-table">
                <thead>
                  <tr>
                    <th></th>
                    {ACTIVATION_TIERS.map((t) => (
                      <th key={t.key}>{t.key === "essential" ? "Essential" : t.key === "growth" ? "Growth ⭐" : "Full"}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Creative concepts / month</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{totalConcepts(t)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Platform-ready files</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{platformFiles(t)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Promotional captions</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.captions}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Rapid-turn adaptations</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.rapidTurnAdaptations > 0 ? t.rapidTurnAdaptations : <span className="rb-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>30-day activation calendar</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasCalendar ? <span className="rb-table-check">✓</span> : <span className="rb-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Priority scheduling</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasPriority ? <span className="rb-table-check">✓</span> : <span className="rb-table-dash">-</span>}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="rb-packages-includes">
              <strong className="text-[var(--rb-ink)]">{PACKAGES_INCLUDES_LABEL}</strong> {CORE_INCLUDES.join(" · ")}.
            </p>

            <div className="rb-packages-bestfor-grid">
              {ACTIVATION_TIERS.map((t) => (
                <div key={t.key} className="rb-packages-bestfor-item">
                  <strong>{t.name}</strong>
                  {t.bestFor}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={4} className="mt-10">
            <RebelCalculator
              maxProperties={MAX_PARTICIPATING_PROPERTIES}
              defaultProperties={DEFAULT_PARTICIPATING_PROPERTIES}
              defaultTierKey={DEFAULT_TIER_KEY}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Where Rebel + Archer connect ──────────────────────────────────
          Motion moment 3 (inline swatches integrated into each use case)
          lives inside this section. Three of the six pairings use real
          Rebel clips (Noodles/F&B, Room/direct-booking, Wedding/events);
          the rest keep the graceful Archer spotlight fallback. ─────────── */}
      <section id="connect" className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow rb-eyebrow--on-light">{CONNECT_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{CONNECT_HEADING}</h2>
            <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-[var(--rb-ink-soft)]">{CONNECT_INTRO}</p>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="rb-fit-pairs">
              {CONNECT_PAIRS.map((pair) => {
                const override = CONNECT_CLIP_OVERRIDES[pair.motionCategory];
                const fallback = override ? undefined : getMotionForCategory(pair.motionCategory, 1)[0];
                const videoSrc = override?.src ?? fallback?.videoSrc;
                const alt = override?.alt ?? fallback?.alt ?? pair.produces;
                const posterSrc = override ? undefined : fallback?.posterSrc || undefined;
                return (
                  <div key={pair.identifies} className="rb-fit-pair">
                    <div className="rb-fit-col rb-fit-col--identifies">
                      <span className="rb-fit-col-label">Rebel priority</span>
                      <p>{pair.identifies}</p>
                    </div>
                    <span className="rb-fit-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                    <div className="rb-fit-col rb-fit-col--produces">
                      <span className="rb-fit-col-label">Archer output</span>
                      <p>{pair.produces}</p>
                      {videoSrc ? (
                        <div className="rb-fit-motion mt-3">
                          <RebelMotion videoSrc={videoSrc} posterSrc={posterSrc} alt={alt} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="rb-qualifier mt-6">{CONNECT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Public Rebel facts ───────────────────────────────────────────── */}
      <section id="facts" className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow">{SCALE_HEADING}</p>
          </Reveal>
          {/* Pool.mp4 -- one of the seven real Rebel clips -- illustrates the
              "Urban, resort & lifestyle" portfolio markets called out in the
              stat band just below. */}
          <Reveal delay={1} className="rb-motion-feature mt-6">
            <RebelMotion videoSrc={REBEL_CLIPS.pool.src} alt={REBEL_CLIPS.pool.alt} caption={REBEL_CLIPS.pool.caption} />
          </Reveal>
          <Reveal delay={2} className="mt-8">
            <div className="rb-stat-band">
              {SCALE_STATS.map((s) => (
                <div key={s.label} className="rb-stat">
                  <p className="rb-stat-value">{s.value}</p>
                  <p className="rb-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={3}>
            <p className="rb-qualifier mt-6">{SCALE_QUALIFIER}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Note to the Rebel team ────────────────────────────────────────── */}
      <section className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <div className="rb-note-panel">
              <p className="rb-note-salutation">{NOTE_SALUTATION}</p>
              {NOTE_PARAGRAPHS.map((p, i) => (
                <p key={i} className="rb-note-body">
                  {p}
                </p>
              ))}
              <p className="rb-note-signature">{NOTE_SIGNATURE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="workflow" className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow">{WORKFLOW_EYEBROW}</p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{WORKFLOW_HEADING}</h2>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="rb-workflow-steps">
              {WORKFLOW_STEPS.map((s) => (
                <div key={s.idx} className="rb-workflow-step">
                  <span className="rb-workflow-num">{s.idx}</span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
            <p className="rb-workflow-closing">&ldquo;{WORKFLOW_CLOSING}&rdquo;</p>
          </Reveal>

          <Reveal delay={2} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--rb-ivory)]">{CONTROL_HEADING}</h3>
            <div className="rb-columns mt-6">
              <div className="rb-panel rb-column rb-column--rebel">
                <h3>Rebel controls</h3>
                <ul className="rb-column-list">
                  {REBEL_CONTROLS.map((c) => (
                    <li key={c}>
                      <span className="rb-dot" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rb-panel rb-column rb-column--archer">
                <h3>Archer delivers</h3>
                <ul className="rb-column-list">
                  {ARCHER_DELIVERS.map((c) => (
                    <li key={c}>
                      <span className="rb-dot rb-dot--archer" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rb-panel rb-column rb-column--shared">
                <h3>Property / brand retains</h3>
                <ul className="rb-column-list">
                  {PROPERTY_RETAINS.map((c) => (
                    <li key={c}>
                      <span className="rb-dot rb-dot--shared" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partnership models ───────────────────────────────────────────── */}
      <section id="models" className="rb-section">
        <div className="rb-shell">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{OPERATING_MODELS_HEADING}</h2>
          </Reveal>
          <div className="rb-models-grid mt-9">
            {OPERATING_MODELS.map((m, i) => (
              <Reveal key={m.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className={`rb-panel rb-model-card h-full${m.badge ? " rb-panel--featured" : ""}`}>
                  {m.badge ? <span className="rb-panel-badge">{m.badge}</span> : null}
                  <p className="rb-model-subtitle">{m.subtitle}</p>
                  <h3>{m.title}</h3>
                  <p className="rb-model-intro">{m.intro}</p>
                  <p className="rb-qualifier">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2}>
            <p className="rb-qualifier mt-8">{OPERATING_MODELS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── The pilot ─────────────────────────────────────────────────────── */}
      <section id="pilot" className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <div className="rb-pilot-frame">
              <p className="rb-eyebrow rb-eyebrow--on-light">{PILOT_EYEBROW}</p>
              <h2 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.14] text-[var(--rb-ink)]">{PILOT_HEADING}</h2>

              <div className="rb-pilot-phases">
                {PILOT_PHASES.map((phase) => (
                  <div key={phase.idx} className="rb-pilot-phase">
                    <span className="rb-pilot-phase-num">{phase.idx}</span>
                    <h4>{phase.title}</h4>
                    <ul>
                      {phase.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="rb-pilot-note">{PILOT_NOTE}</p>

              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="rb-btn mt-8">
                {PILOT_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────────
          Motion moment 4: timelapse-fire.mp4 -- one of the seven real
          Rebel clips -- as a large cinematic feature near the final
          partnership CTA. ────────────────────────────────────────────── */}
      <section className="rb-section">
        <div className="rb-shell">
          <Reveal className="rb-motion-feature">
            <RebelMotion
              videoSrc={REBEL_CLIPS.timelapseFire.src}
              alt={REBEL_CLIPS.timelapseFire.alt}
              caption={REBEL_CLIPS.timelapseFire.caption}
            />
          </Reveal>

          <Reveal delay={1} className="mt-14">
            <div className="rb-final-panel">
              <p className="rb-eyebrow mx-auto">{FINAL_EYEBROW}</p>
              <h2 className="mx-auto mt-4 max-w-[32ch] text-[clamp(1.8rem,3.8vw,2.6rem)] leading-[1.14]">{FINAL_HEADING}</h2>
              <p className="mx-auto mt-5 max-w-[62ch] text-[14.5px] leading-relaxed text-[rgba(248,245,239,0.78)]">
                {FINAL_COPY}
              </p>
              <div className="rb-final-actions">
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="rb-btn">
                  {FINAL_PRIMARY_CTA}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MORE ARCHER WORK: the page's two broader Archer portfolio
          slideshows (Motion Work, Design Work) -- distinct from the seven
          Rebel-specific clips used as storytelling media above. Media,
          ordering and carousel behavior (prev/next, portrait/landscape
          sizing, active-slide autoplay, lazy loading) are reused directly
          from the live homepage's carousels in
          public/archer-preview/index.html. Exactly these two -- no third
          portfolio carousel. ────────────────────────────────────────── */}
      <section id="more-work" className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <p className="rb-eyebrow rb-eyebrow--on-light">MORE ARCHER WORK</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">Motion Work</h2>
            <p className="rb-portfolio-copy mt-5 text-[14.5px] leading-relaxed text-[var(--rb-ink-soft)]">
              Short-form motion for hotels, F&amp;B, rooms, events and property storytelling.
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <RebelWorkCarousel kind="video" items={MOTION_WORK_ITEMS} ariaLabel="Motion work" />
          </Reveal>
        </div>
      </section>

      <section className="rb-section rb-section--light">
        <div className="rb-shell">
          <Reveal>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">Design Work</h2>
            <p className="rb-portfolio-copy mt-5 text-[14.5px] leading-relaxed text-[var(--rb-ink-soft)]">
              Social graphics, promos and campaign visuals built for real property needs.
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <RebelWorkCarousel kind="image" items={DESIGN_WORK_ITEMS} ariaLabel="Design work" />
          </Reveal>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="rb-footer">
        <div className="rb-shell flex flex-col gap-5">
          <p className="rb-footer-wordmark">ARCHER DESIGN</p>
          <p className="rb-footer-legal">{FOOTER_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
