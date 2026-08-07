import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Eye, Heart, Images, Quote, Users } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { TCRM_VIDEOS, TCRM_IMAGES } from "../tcrm/tcrm-media";
import { Reveal } from "./components/Reveal";
import { JacarusoHeader } from "./components/JacarusoHeader";
import { JacarusoCalculator } from "./components/JacarusoCalculator";
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
  PARTNER_ECONOMICS_EYEBROW,
  PARTNER_ECONOMICS_HEADING,
  PARTNER_ECONOMICS_INTRO,
  PARTNER_ECONOMICS_QUALIFICATION,
  annualGrossMargin,
  fmtMoney,
  fmtPct,
  grossMargin,
  marginPct,
  platformFiles,
  tierByKey,
  totalConcepts,
} from "./jacaruso-config";
import {
  ARCHER_DELIVERS,
  CONFIDENCE_QUOTE,
  CONFIDENCE_SUPPORTING,
  CONTROL_HEADING,
  FINAL_COPY,
  FINAL_EYEBROW,
  FINAL_HEADING,
  FINAL_PRIMARY_CTA,
  FINAL_SECONDARY_CTA,
  FOOTER_DISCLAIMER,
  HERO_DISCLOSURE_MAIN,
  HERO_DISCLOSURE_NOTE,
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_NOTE_BODY,
  HERO_NOTE_HEADING,
  HERO_PARAGRAPH_1,
  HERO_PARAGRAPH_2,
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
  HOTEL_RETAINS,
  IDEAL_CLIENT_HEADING,
  IDEAL_CLIENT_NOTE,
  JACARUSO_CONTROLS,
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
  POOR_FIT_ITEMS,
  POOR_FIT_LABEL,
  PRIVATE_LABEL_EYEBROW,
  PRIVATE_LABEL_SUB,
  PROOF_EYEBROW,
  PROOF_FOOTNOTE,
  PROOF_STATS,
  SCALE_HEADING,
  SCALE_QUALIFIER,
  SCALE_STATS,
  STRATEGIC_FIT_EYEBROW,
  STRATEGIC_FIT_HEADING,
  STRATEGIC_FIT_INTRO,
  STRATEGIC_FIT_NOTE,
  STRATEGIC_FIT_PAIRS,
  STRONG_FIT_ITEMS,
  STRONG_FIT_LABEL,
  VALUE_COLUMNS,
  VALUE_HEADING,
  WORKFLOW_CLOSING,
  WORKFLOW_EYEBROW,
  WORKFLOW_HEADING,
  WORKFLOW_STEPS,
  WORK_EYEBROW,
  WORK_FOOTNOTE,
  WORK_HEADING,
} from "./jacaruso-content";

// Root layout's metadata.title.template appends " | Archer Design" -- this
// string must NOT repeat that suffix, or the rendered <title> duplicates it.
const PAGE_TITLE = "Partnership Concept for Jacaruso Enterprises";
const PAGE_DESCRIPTION =
  "An independent, speculative partnership concept prepared by Archer Design, pairing Jacaruso Enterprises' hotel sales support with Archer's hospitality creative production.";

// Private, unpublished concept page -- never indexed, never linked from the
// main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits
// this route), footer, or public portfolio. Accessible only via direct URL.
// Same noindex/nofollow/nocache treatment as /bridgetown and /grant-hospitality.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/jacaruso") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const PROOF_ICONS = [Images, Eye, Users, Heart];
const growthTier = tierByKey("growth");

export default function JacarusoPage() {
  return (
    <div id="top" className="jacaruso-theme">
      <JacarusoHeader />

      {/* Private-concept label -- short, unobtrusive; the full legal
          disclosure appears again below, near the hero, and once more in
          the footer. */}
      <div className="jac-private-bar">
        <div className="jac-shell jac-private-bar-inner">
          <p className="jac-private-label">
            {PRIVATE_LABEL_EYEBROW}
            <span>{PRIVATE_LABEL_SUB}</span>
          </p>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="jac-hero--video">
        {/* Reused directly from Bridgetown's existing working asset path,
            per the brief's instruction not to duplicate large video files
            for content that is not brand-specific. */}
        <video
          className="jac-hero-video"
          src="/tcrm/videos/hotel-arrival-vintage-car.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="jac-hero-overlay" aria-hidden="true" />
        <div className="jac-hero-fade" aria-hidden="true" />

        <div className="jac-shell">
          <div className="jac-hero-content">
            <p className="jac-eyebrow">{HERO_EYEBROW}</p>
            <h1 className="mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.12]">{HERO_HEADLINE}</h1>
            <p className="jac-hero-copy mt-6 max-w-[56ch] text-[15px] leading-relaxed">{HERO_PARAGRAPH_1}</p>
            <p className="jac-hero-copy mt-3 max-w-[52ch] text-[14px] leading-relaxed">{HERO_PARAGRAPH_2}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="jac-btn">
                {HERO_PRIMARY_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="jac-btn-ghost jac-btn-ghost--on-dark">
                {HERO_SECONDARY_CTA}
              </a>
            </div>

            <div className="jac-partnership-card mt-8">
              <Image
                src="/jacaruso/logos/jacaruso-logo-white.png"
                alt="Jacaruso Enterprises"
                width={300}
                height={183}
                className="jac-partnership-logo"
              />
              <p className="jac-partnership-card-text">
                A speculative partnership model pairing Jacaruso Enterprises&rsquo; hotel sales support with Archer
                Design&rsquo;s hospitality creative production.
              </p>
            </div>

            <div className="jac-hero-note">
              <p className="jac-hero-note-heading">{HERO_NOTE_HEADING}</p>
              <p className="jac-hero-note-body">{HERO_NOTE_BODY}</p>
            </div>

            <div className="jac-hero-disclosure">
              <p>{HERO_DISCLOSURE_MAIN}</p>
              <p className="jac-hero-disclosure-note">{HERO_DISCLOSURE_NOTE}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Archer proof ─────────────────────────────────────────────────── */}
      <section id="proof" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{PROOF_EYEBROW}</p>
          </Reveal>

          <Reveal delay={1} className="mt-6">
            <div className="jac-stat-band jac-stat-band--proof">
              {PROOF_STATS.map((s, i) => {
                const Icon = PROOF_ICONS[i];
                return (
                  <div key={s.label} className="jac-stat">
                    <Icon size={16} className="mx-auto mb-2 text-[var(--jac-primary)]" aria-hidden="true" />
                    <p className="jac-stat-value">{s.value}</p>
                    <p className="jac-stat-label">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-10">
            <div className="jac-quote-panel">
              <Quote size={22} className="mb-4 text-[var(--jac-secondary)]" aria-hidden="true" />
              <p className="jac-quote-mark">&ldquo;{CONFIDENCE_QUOTE}&rdquo;</p>
              <p className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-[var(--jac-ink-soft)]">
                {CONFIDENCE_SUPPORTING}
              </p>
              <p className="jac-qualifier mt-4">{PROOF_FOOTNOTE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Selected hospitality work: motion library ────────────────────────
          Existing, already-approved Archer Design body-of-work assets (the
          same generic /tcrm media library, none of it Jacaruso-branded),
          shown via the same reusable gallery component and source library
          as /bridgetown's and /grant-hospitality's "The Work" section,
          wrapped in the shared .archer-studio module scope
          (app/globals.css). ────────────────────────────────────────────── */}
      <section id="work" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{WORK_EYEBROW}</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{WORK_HEADING}</h2>
          </Reveal>

          <Reveal delay={1} className="jac-gallery-frame mt-10">
            <div className="archer-studio">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--st-gold)]">Motion library</p>
              <h3 className="mt-2 text-[1.4rem] leading-[1.2] text-[var(--st-ink)]">Still photography, brought to life.</h3>
              <div className="mt-6">
                <MotionPortfolioGallery items={TCRM_VIDEOS} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Partner economics ────────────────────────────────────────────── */}
      <section id="economics" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{PARTNER_ECONOMICS_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{PARTNER_ECONOMICS_HEADING}</h2>
            <p className="jac-econ-highlight-line mt-4">{PARTNER_ECONOMICS_INTRO}</p>
          </Reveal>

          <Reveal delay={1} className="jac-table-wrap">
            <table className="jac-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Hotel pays</th>
                  <th>Archer rate</th>
                  <th>Jacaruso retains</th>
                  <th>Margin</th>
                  <th>Annual</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVATION_TIERS.map((tier) => (
                  <tr key={tier.key} className={tier.key === DEFAULT_TIER_KEY ? "jac-table-row--highlight" : undefined}>
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

          <Reveal delay={2} className="mt-12">
            <h3 className="text-[1.15rem] text-[var(--jac-primary-deep)]">{ADOPTION_HEADING}</h3>
            <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-[var(--jac-ink-soft)]">{ADOPTION_INTRO}</p>

            <div className="jac-table-wrap">
              <table className="jac-table">
                <thead>
                  <tr>
                    <th>Participating properties</th>
                    <th>Monthly margin</th>
                    <th>Annual margin</th>
                  </tr>
                </thead>
                <tbody>
                  {ADOPTION_SCENARIOS.map((s) => (
                    <tr key={s.count} className={s.count === 10 ? "jac-table-row--highlight" : undefined}>
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

            <p className="jac-adoption-callout">
              Ten participating properties is a {fmtMoney(annualGrossMargin(growthTier) * 10)} annual margin line
              with zero production headcount.
            </p>
            <p className="jac-adoption-supporting">{ADOPTION_SUPPORTING}</p>
          </Reveal>

          <Reveal delay={3}>
            <p className="jac-qualifier mt-8">{PARTNER_ECONOMICS_QUALIFICATION}</p>
          </Reveal>

          {/* ── What's in each package ──────────────────────────────────── */}
          <Reveal delay={1} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--jac-primary-deep)]">{PACKAGES_TABLE_HEADING}</h3>
            <div className="jac-table-wrap">
              <table className="jac-table">
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
                      <td key={t.key}>{t.rapidTurnAdaptations > 0 ? t.rapidTurnAdaptations : <span className="jac-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>30-day activation calendar</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasCalendar ? <span className="jac-table-check">✓</span> : <span className="jac-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Priority scheduling</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasPriority ? <span className="jac-table-check">✓</span> : <span className="jac-table-dash">-</span>}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="jac-packages-includes">
              <strong className="text-[var(--jac-ink)]">{PACKAGES_INCLUDES_LABEL}</strong> {CORE_INCLUDES.join(" · ")}.
            </p>

            <div className="jac-packages-bestfor-grid">
              {ACTIVATION_TIERS.map((t) => (
                <div key={t.key} className="jac-packages-bestfor-item">
                  <strong>{t.name}</strong>
                  {t.bestFor}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={4} className="mt-10">
            <JacarusoCalculator
              maxProperties={MAX_PARTICIPATING_PROPERTIES}
              defaultProperties={DEFAULT_PARTICIPATING_PROPERTIES}
              defaultTierKey={DEFAULT_TIER_KEY}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Selected hospitality work: stills & campaigns ───────────────────
          Second half of the same gallery pair, positioned here exactly as
          on /bridgetown and /grant-hospitality, so the static-image
          slideshow follows Partner Economics rather than sitting
          back-to-back with the motion gallery. ─────────────────────────── */}
      <section id="stills" className="jac-section">
        <div className="jac-shell">
          <Reveal delay={1} className="jac-gallery-frame">
            <div className="archer-studio">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--st-gold)]">Stills &amp; campaigns</p>
              <h3 className="mt-2 text-[1.4rem] leading-[1.2] text-[var(--st-ink)]">Feed-ready creative from real properties.</h3>
              <div className="mt-6">
                <WorkPageStillsGallery items={TCRM_IMAGES} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="jac-qualifier mt-6">{WORK_FOOTNOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Note to the Jacaruso team ─────────────────────────────────────── */}
      <section className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <div className="jac-note-panel">
              <p className="jac-note-salutation">{NOTE_SALUTATION}</p>
              {NOTE_PARAGRAPHS.map((p, i) => (
                <p key={i} className="jac-note-body">
                  {p}
                </p>
              ))}
              <p className="jac-note-signature">{NOTE_SIGNATURE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Public Jacaruso facts ────────────────────────────────────────── */}
      <section id="facts" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{SCALE_HEADING}</p>
          </Reveal>
          <Reveal delay={1} className="mt-6">
            <div className="jac-stat-band">
              {SCALE_STATS.map((s) => (
                <div key={s.label} className="jac-stat">
                  <p className="jac-stat-value">{s.value}</p>
                  <p className="jac-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="jac-qualifier mt-6">{SCALE_QUALIFIER}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Partnership fit / opportunity ────────────────────────────────── */}
      <section id="fit" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{STRATEGIC_FIT_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{STRATEGIC_FIT_HEADING}</h2>
            <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-[var(--jac-ink-soft)]">
              {STRATEGIC_FIT_INTRO}
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="jac-fit-pairs">
              {STRATEGIC_FIT_PAIRS.map((pair) => (
                <div key={pair.identifies} className="jac-fit-pair">
                  <div className="jac-fit-col jac-fit-col--identifies">
                    <span className="jac-fit-col-label">Jacaruso identifies</span>
                    <p>{pair.identifies}</p>
                  </div>
                  <span className="jac-fit-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                  <div className="jac-fit-col jac-fit-col--produces">
                    <span className="jac-fit-col-label">Archer produces</span>
                    <p>{pair.produces}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="jac-qualifier mt-6">{STRATEGIC_FIT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="workflow" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <p className="jac-eyebrow">{WORKFLOW_EYEBROW}</p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{WORKFLOW_HEADING}</h2>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="jac-workflow-steps">
              {WORKFLOW_STEPS.map((s) => (
                <div key={s.idx} className="jac-workflow-step">
                  <span className="jac-workflow-num">{s.idx}</span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
            <p className="jac-workflow-closing">{WORKFLOW_CLOSING}</p>
          </Reveal>

          <Reveal delay={2} className="mt-12">
            <h3 className="text-[1.15rem] text-[var(--jac-primary-deep)]">{CONTROL_HEADING}</h3>
            <div className="jac-columns mt-6">
              <div className="jac-panel jac-column jac-column--jacaruso">
                <h3>Jacaruso controls</h3>
                <ul className="jac-column-list">
                  {JACARUSO_CONTROLS.map((c) => (
                    <li key={c}>
                      <span className="jac-dot" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="jac-panel jac-column jac-column--archer">
                <h3>Archer delivers</h3>
                <ul className="jac-column-list">
                  {ARCHER_DELIVERS.map((c) => (
                    <li key={c}>
                      <span className="jac-dot jac-dot--archer" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="jac-panel jac-column jac-column--shared">
                <h3>Hotel retains</h3>
                <ul className="jac-column-list">
                  {HOTEL_RETAINS.map((c) => (
                    <li key={c}>
                      <span className="jac-dot jac-dot--shared" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Operating models ─────────────────────────────────────────────── */}
      <section id="models" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{OPERATING_MODELS_HEADING}</h2>
          </Reveal>
          <div className="jac-models-grid mt-9">
            {OPERATING_MODELS.map((m, i) => (
              <Reveal key={m.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className={`jac-panel jac-model-card h-full${m.badge ? " jac-panel--featured" : ""}`}>
                  {m.badge ? <span className="jac-panel-badge">{m.badge}</span> : null}
                  <p className="jac-model-subtitle">{m.subtitle}</p>
                  <h3>{m.title}</h3>
                  <p className="jac-model-intro">{m.intro}</p>
                  <p className="jac-qualifier">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2}>
            <p className="jac-qualifier mt-8">{OPERATING_MODELS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Why each side says yes ───────────────────────────────────────── */}
      <section id="value" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <h2 className="max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{VALUE_HEADING}</h2>
          </Reveal>
          <div className="jac-value-inline-grid">
            {VALUE_COLUMNS.map((col, i) => (
              <Reveal key={col.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="jac-panel jac-value-inline-card h-full">
                  <p className="jac-inline-heading">{col.title}</p>
                  <p className="jac-inline-list">{col.points.join(" · ")}.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best fit ──────────────────────────────────────────────────────── */}
      <section id="ideal-client" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{IDEAL_CLIENT_HEADING}</h2>
          </Reveal>
          <Reveal delay={1} className="mt-6">
            <p className="jac-inline-heading">{STRONG_FIT_LABEL}</p>
            <p className="jac-inline-list max-w-[86ch]">{STRONG_FIT_ITEMS.join(" · ")}.</p>
          </Reveal>
          <Reveal delay={2} className="mt-6">
            <p className="jac-inline-heading">{POOR_FIT_LABEL}</p>
            <p className="jac-inline-list max-w-[86ch]">{POOR_FIT_ITEMS.join(" · ")}.</p>
          </Reveal>
          <Reveal delay={3}>
            <p className="jac-qualifier mt-6">{IDEAL_CLIENT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── The pilot ─────────────────────────────────────────────────────── */}
      <section id="pilot" className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <div className="jac-pilot-frame">
              <p className="jac-eyebrow">{PILOT_EYEBROW}</p>
              <h2 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.14]">{PILOT_HEADING}</h2>

              <div className="jac-pilot-phases">
                {PILOT_PHASES.map((phase) => (
                  <div key={phase.idx} className="jac-pilot-phase">
                    <span className="jac-pilot-phase-num">{phase.idx}</span>
                    <h4>{phase.title}</h4>
                    <ul>
                      {phase.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="jac-pilot-note">{PILOT_NOTE}</p>

              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="jac-btn mt-8">
                {PILOT_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────────── */}
      <section className="jac-section">
        <div className="jac-shell">
          <Reveal>
            <div className="jac-final-panel">
              <p className="jac-eyebrow mx-auto">{FINAL_EYEBROW}</p>
              <h2 className="mx-auto mt-4 max-w-[30ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{FINAL_HEADING}</h2>
              <p className="mx-auto mt-5 max-w-[60ch] text-[14.5px] leading-relaxed text-[var(--jac-ink-soft)]">
                {FINAL_COPY}
              </p>
              <div className="jac-final-actions">
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="jac-btn">
                  {FINAL_PRIMARY_CTA}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="jac-btn-ghost">
                  {FINAL_SECONDARY_CTA}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="jac-footer">
        <div className="jac-shell flex flex-col gap-5">
          <p className="jac-footer-wordmark">ARCHER DESIGN</p>
          <p className="jac-footer-legal">{FOOTER_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
