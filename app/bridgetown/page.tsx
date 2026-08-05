import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Eye, Heart, Images, Quote, Users } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { TCRM_VIDEOS, TCRM_IMAGES } from "../tcrm/tcrm-media";
import { Reveal } from "./components/Reveal";
import { BridgetownHeader } from "./components/BridgetownHeader";
import { BridgetownCalculator } from "./components/BridgetownCalculator";
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
  adoptionSharePct,
  annualGrossMargin,
  fmtMoney,
  fmtPct,
  grossMargin,
  marginPct,
  platformFiles,
  tierByKey,
  totalConcepts,
} from "./bridgetown-economics";
import {
  ARCHER_DELIVERS,
  BRIDGETOWN_CONTROLS,
  CONFIDENCE_QUOTE,
  CONFIDENCE_SUPPORTING,
  CONTROL_HEADING,
  CRAFT_CASE_BODY,
  CRAFT_CASE_CLOSING,
  CRAFT_CASE_LABEL,
  CRAFT_CASE_QUOTE_1,
  CRAFT_CASE_QUOTE_2,
  CRAFT_DISCIPLINES,
  CRAFT_EYEBROW,
  CRAFT_HEADING,
  CRAFT_INTRO,
  FINAL_COPY,
  FINAL_EYEBROW,
  FINAL_HEADING,
  FINAL_PRIMARY_CTA,
  FINAL_SECONDARY_CTA,
  FOOTER_DISCLAIMER,
  HERO_DISCLOSURE,
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_PARAGRAPH_1,
  HERO_PARAGRAPH_2,
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
  IDEAL_CLIENT_HEADING,
  IDEAL_CLIENT_ITEMS,
  IDEAL_CLIENT_NOTE,
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
  PILOT_MIX_ITEMS,
  PILOT_QUESTIONS,
  PILOT_QUESTIONS_HEADING,
  PRIVATE_LABEL_EYEBROW,
  PRIVATE_LABEL_SUB,
  PROOF_EYEBROW,
  PROOF_FOOTNOTE,
  PROOF_STATS,
  SCALE_HEADING,
  SCALE_QUALIFIER,
  SCALE_STATS,
  SHARED_RESPONSIBILITIES,
  STRATEGIC_FIT_EYEBROW,
  STRATEGIC_FIT_HEADING,
  STRATEGIC_FIT_INTRO,
  STRATEGIC_FIT_NOTE,
  STRATEGIC_FIT_PAIRS,
  VALUE_COLUMNS,
  VALUE_HEADING,
  WORKFLOW_EYEBROW,
  WORKFLOW_HEADING,
  WORKFLOW_STEPS,
  WORK_EYEBROW,
  WORK_FOOTNOTE,
  WORK_HEADING,
} from "./bridgetown-content";

// Root layout's metadata.title.template appends " | Archer Design" -- this
// string must NOT repeat that suffix, or the rendered <title> duplicates it.
const PAGE_TITLE = "Partnership Concept for Bridgetown Revenue Management Solutions";
const PAGE_DESCRIPTION =
  "An independent, speculative partnership concept prepared by Archer Design, pairing Bridgetown Revenue Management Solutions' revenue strategy with Archer's hospitality creative production.";

// Private, unpublished concept page -- never indexed, never linked from the
// main nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits
// this route), footer, or public portfolio. Accessible only via direct URL.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/bridgetown") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const PROOF_ICONS = [Images, Eye, Users, Heart];
const growthTier = tierByKey("growth");

export default function BridgetownPage() {
  return (
    <div id="top" className="bridgetown-theme">
      <BridgetownHeader />

      {/* Private-concept label -- short, unobtrusive; the full legal
          disclosure appears again below, near the hero, and once more in
          the footer. */}
      <div className="bt-private-bar">
        <div className="bt-shell bt-private-bar-inner">
          <p className="bt-private-label">
            {PRIVATE_LABEL_EYEBROW}
            <span>{PRIVATE_LABEL_SUB}</span>
          </p>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bt-hero--video">
        <video
          className="bt-hero-video"
          src="/tcrm/videos/hotel-arrival-vintage-car.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="bt-hero-overlay" aria-hidden="true" />
        <div className="bt-hero-fade" aria-hidden="true" />

        <div className="bt-shell">
          <div className="bt-hero-content">
            <p className="bt-eyebrow">{HERO_EYEBROW}</p>
            <h1 className="mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.12]">{HERO_HEADLINE}</h1>
            <p className="bt-hero-copy mt-6 max-w-[54ch] text-[15px] leading-relaxed">{HERO_PARAGRAPH_1}</p>
            <p className="bt-hero-copy mt-3 max-w-[52ch] text-[14px] leading-relaxed">{HERO_PARAGRAPH_2}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="bt-btn">
                {HERO_PRIMARY_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="bt-btn-ghost bt-btn-ghost--on-dark">
                {HERO_SECONDARY_CTA}
              </a>
            </div>

            <div className="bt-partnership-card mt-8">
              <span className="bt-partnership-logo-chip">
                <Image
                  src="/bridgetown/bridgetown-rms-logo.png"
                  alt="Bridgetown Revenue Management Solutions"
                  width={500}
                  height={220}
                  className="bt-partnership-logo"
                />
              </span>
              <p className="bt-partnership-card-text">
                A speculative partnership model pairing Bridgetown&rsquo;s revenue strategy with Archer Design&rsquo;s
                hospitality creative production.
              </p>
            </div>

            <p className="bt-hero-disclosure">{HERO_DISCLOSURE}</p>
          </div>
        </div>
      </section>

      {/* ── Proof of execution ───────────────────────────────────────────── */}
      <section id="proof" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{PROOF_EYEBROW}</p>
          </Reveal>

          <Reveal delay={1} className="mt-6">
            <div className="bt-stat-band bt-stat-band--proof">
              {PROOF_STATS.map((s, i) => {
                const Icon = PROOF_ICONS[i];
                return (
                  <div key={s.label} className="bt-stat">
                    <Icon size={16} className="mx-auto mb-2 text-[var(--bridgetown-primary)]" aria-hidden="true" />
                    <p className="bt-stat-value">{s.value}</p>
                    <p className="bt-stat-label">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-10">
            <div className="bt-quote-panel">
              <Quote size={22} className="mb-4 text-[var(--bridgetown-secondary)]" aria-hidden="true" />
              <p className="bt-quote-mark">&ldquo;{CONFIDENCE_QUOTE}&rdquo;</p>
              <p className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-[var(--bridgetown-ink-soft)]">
                {CONFIDENCE_SUPPORTING}
              </p>
              <p className="bt-qualifier mt-4">{PROOF_FOOTNOTE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Selected hospitality work: motion library ────────────────────────
          Existing, already-approved Archer Design body-of-work assets (the
          same generic /tcrm media library referenced from ./tcrm-media.ts,
          none of it TCRM-branded), shown here via the same reusable gallery
          component and source library as /tcrm's "Motion Library" section,
          wrapped in the shared .archer-studio module scope (app/globals.css)
          so it never depends on any /tcrm-specific styling. ──────────────── */}
      <section id="work" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{WORK_EYEBROW}</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{WORK_HEADING}</h2>
          </Reveal>

          <Reveal delay={1} className="bt-gallery-frame mt-10">
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
      <section id="economics" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{PARTNER_ECONOMICS_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{PARTNER_ECONOMICS_HEADING}</h2>
            <p className="mt-4 max-w-[64ch] text-[14.5px] leading-relaxed text-[var(--bridgetown-ink-soft)]">
              {PARTNER_ECONOMICS_INTRO}
            </p>
          </Reveal>

          <Reveal delay={1} className="bt-table-wrap">
            <table className="bt-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Hotel pays</th>
                  <th>Archer rate</th>
                  <th>Bridgetown keeps</th>
                  <th>Margin</th>
                  <th>Annual</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVATION_TIERS.map((tier) => (
                  <tr key={tier.key} className={tier.key === DEFAULT_TIER_KEY ? "bt-table-row--highlight" : undefined}>
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
            <h3 className="text-[1.15rem] text-[var(--bridgetown-primary-deep)]">{ADOPTION_HEADING}</h3>
            <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-[var(--bridgetown-ink-soft)]">{ADOPTION_INTRO}</p>

            <div className="bt-table-wrap">
              <table className="bt-table">
                <thead>
                  <tr>
                    <th>Participating properties</th>
                    <th>Share of client base</th>
                    <th>Monthly margin</th>
                    <th>Annual margin</th>
                  </tr>
                </thead>
                <tbody>
                  {ADOPTION_SCENARIOS.map((s) => (
                    <tr key={s.count} className={s.count === 15 ? "bt-table-row--highlight" : undefined}>
                      <td>
                        {s.count}
                        {s.isPilot ? " (pilot)" : ""}
                      </td>
                      <td>{adoptionSharePct(s.count)}%</td>
                      <td>{fmtMoney(grossMargin(growthTier) * s.count)}</td>
                      <td>{fmtMoney(annualGrossMargin(growthTier) * s.count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="bt-adoption-callout">
              Ten percent adoption is a {fmtMoney(annualGrossMargin(growthTier) * 15)} annual margin line with zero
              production headcount.
            </p>
            <p className="bt-adoption-supporting">{ADOPTION_SUPPORTING}</p>
          </Reveal>

          <Reveal delay={3}>
            <p className="bt-qualifier mt-8">{PARTNER_ECONOMICS_QUALIFICATION}</p>
          </Reveal>

          {/* ── What's in each package ──────────────────────────────────── */}
          <Reveal delay={1} className="mt-14">
            <h3 className="text-[1.15rem] text-[var(--bridgetown-primary-deep)]">{PACKAGES_TABLE_HEADING}</h3>
            <div className="bt-table-wrap">
              <table className="bt-table">
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
                      <td key={t.key}>{t.rapidTurnAdaptations > 0 ? t.rapidTurnAdaptations : <span className="bt-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>30-day activation calendar</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasCalendar ? <span className="bt-table-check">✓</span> : <span className="bt-table-dash">-</span>}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>Priority scheduling</td>
                    {ACTIVATION_TIERS.map((t) => (
                      <td key={t.key}>{t.hasPriority ? <span className="bt-table-check">✓</span> : <span className="bt-table-dash">-</span>}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="bt-packages-includes">
              <strong className="text-[var(--bridgetown-ink)]">{PACKAGES_INCLUDES_LABEL}</strong> {CORE_INCLUDES.join(" · ")}.
            </p>

            <div className="bt-packages-bestfor-grid">
              {ACTIVATION_TIERS.map((t) => (
                <div key={t.key} className="bt-packages-bestfor-item">
                  <strong>{t.name}</strong>
                  {t.bestFor}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={4} className="mt-10">
            <BridgetownCalculator
              maxProperties={MAX_PARTICIPATING_PROPERTIES}
              defaultProperties={DEFAULT_PARTICIPATING_PROPERTIES}
              defaultTierKey={DEFAULT_TIER_KEY}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Selected hospitality work: stills & campaigns ───────────────────
          Second half of the same gallery pair, positioned here per Devon's
          request so the static-image slideshow follows Partner Economics
          rather than sitting back-to-back with the motion gallery. Same
          .archer-studio-scoped, /tcrm-independent component as above. ──── */}
      <section id="stills" className="bt-section">
        <div className="bt-shell">
          <Reveal delay={1} className="bt-gallery-frame">
            <div className="archer-studio">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--st-gold)]">Stills &amp; campaigns</p>
              <h3 className="mt-2 text-[1.4rem] leading-[1.2] text-[var(--st-ink)]">Feed-ready creative from real properties.</h3>
              <div className="mt-6">
                <WorkPageStillsGallery items={TCRM_IMAGES} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="bt-qualifier mt-6">{WORK_FOOTNOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Note to Vicki ────────────────────────────────────────────────── */}
      <section className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <div className="bt-note-panel">
              <p className="bt-note-salutation">{NOTE_SALUTATION}</p>
              {NOTE_PARAGRAPHS.map((p, i) => (
                <p key={i} className="bt-note-body">
                  {p}
                </p>
              ))}
              <p className="bt-note-signature">{NOTE_SIGNATURE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The Craft ────────────────────────────────────────────────────── */}
      <section id="craft" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{CRAFT_EYEBROW}</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{CRAFT_HEADING}</h2>
            <p className="bt-craft-intro mt-4">{CRAFT_INTRO}</p>
          </Reveal>

          <div className="bt-craft-disciplines">
            {CRAFT_DISCIPLINES.map((d, i) => (
              <Reveal key={d.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="bt-panel bt-craft-discipline">
                  <h3>{d.title}</h3>
                  {d.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {d.items && d.items.length > 0 ? (
                    <ul className="bt-craft-list">
                      {d.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  ) : null}
                  {d.closing ? <p className="bt-craft-closing">{d.closing}</p> : null}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={2}>
            <div className="bt-case">
              <p className="bt-case-label">{CRAFT_CASE_LABEL}</p>
              <p className="bt-case-quote">{CRAFT_CASE_QUOTE_1}</p>
              <p className="bt-case-quote bt-case-quote--emph">{CRAFT_CASE_QUOTE_2}</p>
              <p className="bt-case-body">{CRAFT_CASE_BODY}</p>
              <p className="bt-case-closing">{CRAFT_CASE_CLOSING}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Bridgetown at scale ──────────────────────────────────────────── */}
      <section id="scale" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{SCALE_HEADING}</p>
          </Reveal>
          <Reveal delay={1} className="mt-6">
            <div className="bt-stat-band">
              {SCALE_STATS.map((s) => (
                <div key={s.label} className="bt-stat">
                  <p className="bt-stat-value">{s.value}</p>
                  <p className="bt-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="bt-qualifier mt-6">{SCALE_QUALIFIER}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Strategic fit ────────────────────────────────────────────────── */}
      <section id="fit" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{STRATEGIC_FIT_EYEBROW}</p>
            <h2 className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{STRATEGIC_FIT_HEADING}</h2>
            <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-[var(--bridgetown-ink-soft)]">
              {STRATEGIC_FIT_INTRO}
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="bt-fit-pairs">
              {STRATEGIC_FIT_PAIRS.map((pair) => (
                <div key={pair.identifies} className="bt-fit-pair">
                  <div className="bt-fit-col bt-fit-col--identifies">
                    <span className="bt-fit-col-label">Bridgetown identifies</span>
                    <p>{pair.identifies}</p>
                  </div>
                  <span className="bt-fit-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                  <div className="bt-fit-col bt-fit-col--produces">
                    <span className="bt-fit-col-label">Archer produces</span>
                    <p>{pair.produces}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="bt-qualifier mt-6">{STRATEGIC_FIT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="workflow" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <p className="bt-eyebrow">{WORKFLOW_EYEBROW}</p>
            <h2 className="mt-3 max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{WORKFLOW_HEADING}</h2>
          </Reveal>
          <Reveal delay={1} className="mt-9">
            <div className="bt-workflow-steps">
              {WORKFLOW_STEPS.map((s) => (
                <div key={s.idx} className="bt-workflow-step">
                  <span className="bt-workflow-num">{s.idx}</span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-12">
            <h3 className="text-[1.15rem] text-[var(--bridgetown-primary-deep)]">{CONTROL_HEADING}</h3>
            <div className="bt-columns mt-6">
              <div className="bt-panel bt-column bt-column--bridgetown">
                <h3>Bridgetown controls</h3>
                <ul className="bt-column-list">
                  {BRIDGETOWN_CONTROLS.map((c) => (
                    <li key={c}>
                      <span className="bt-dot" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bt-panel bt-column bt-column--archer">
                <h3>Archer delivers</h3>
                <ul className="bt-column-list">
                  {ARCHER_DELIVERS.map((c) => (
                    <li key={c}>
                      <span className="bt-dot bt-dot--archer" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bt-panel bt-column bt-column--shared">
                <h3>Shared</h3>
                <ul className="bt-column-list">
                  {SHARED_RESPONSIBILITIES.map((c) => (
                    <li key={c}>
                      <span className="bt-dot bt-dot--shared" aria-hidden="true" />
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
      <section id="models" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{OPERATING_MODELS_HEADING}</h2>
          </Reveal>
          <div className="bt-models-grid mt-9">
            {OPERATING_MODELS.map((m, i) => (
              <Reveal key={m.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className={`bt-panel bt-model-card h-full${m.badge ? " bt-panel--featured" : ""}`}>
                  {m.badge ? <span className="bt-panel-badge">{m.badge}</span> : null}
                  <p className="bt-model-subtitle">{m.subtitle}</p>
                  <h3>{m.title}</h3>
                  <p className="bt-model-intro">{m.intro}</p>
                  <p className="bt-craft-closing">{m.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={2}>
            <p className="bt-qualifier mt-8">{OPERATING_MODELS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Why each side says yes ───────────────────────────────────────── */}
      <section id="value" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <h2 className="max-w-[20ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{VALUE_HEADING}</h2>
          </Reveal>
          <div className="bt-value-inline-grid">
            {VALUE_COLUMNS.map((col, i) => (
              <Reveal key={col.key} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="bt-panel bt-value-inline-card h-full">
                  <p className="bt-inline-heading">{col.title}</p>
                  <p className="bt-inline-list">{col.points.join(" · ")}.</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Best fit ──────────────────────────────────────────────────────── */}
      <section id="ideal-client" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.14]">{IDEAL_CLIENT_HEADING}</h2>
          </Reveal>
          <Reveal delay={1} className="mt-6">
            <p className="bt-inline-list max-w-[86ch]">{IDEAL_CLIENT_ITEMS.join(" · ")}.</p>
          </Reveal>
          <Reveal delay={2}>
            <p className="bt-qualifier mt-6">{IDEAL_CLIENT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ── The pilot ─────────────────────────────────────────────────────── */}
      <section id="pilot" className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <div className="bt-pilot-frame">
              <p className="bt-eyebrow">{PILOT_EYEBROW}</p>
              <h2 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.14]">{PILOT_HEADING}</h2>

              <p className="bt-inline-list mt-6">
                <strong className="text-[var(--bridgetown-ink)]">A suggested mix:</strong> {PILOT_MIX_ITEMS.join(" · ")}.
              </p>

              <h3 className="mt-9 text-[15px] font-semibold text-[var(--bridgetown-primary-deep)]">{PILOT_QUESTIONS_HEADING}</h3>
              <div className="bt-pilot-questions-grid">
                {PILOT_QUESTIONS.map((q) => (
                  <div key={q} className="bt-check">
                    <span className="bt-check-icon">
                      <Check size={10} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {q}
                  </div>
                ))}
              </div>

              <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="bt-btn mt-8">
                {PILOT_CTA}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────────── */}
      <section className="bt-section">
        <div className="bt-shell">
          <Reveal>
            <div className="bt-final-panel">
              <p className="bt-eyebrow mx-auto">{FINAL_EYEBROW}</p>
              <h2 className="mx-auto mt-4 max-w-[30ch] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.14]">{FINAL_HEADING}</h2>
              <p className="mx-auto mt-5 max-w-[60ch] text-[14.5px] leading-relaxed text-[var(--bridgetown-ink-soft)]">
                {FINAL_COPY}
              </p>
              <div className="bt-final-actions">
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="bt-btn">
                  {FINAL_PRIMARY_CTA}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="bt-btn-ghost">
                  {FINAL_SECONDARY_CTA}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bt-footer">
        <div className="bt-shell flex flex-col gap-5">
          <p className="bt-footer-wordmark">ARCHER DESIGN</p>
          <p className="bt-footer-legal">{FOOTER_DISCLAIMER}</p>
        </div>
      </footer>
    </div>
  );
}
