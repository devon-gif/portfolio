import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { Reveal } from "./components/Reveal";
import { PyramidHeader } from "./components/PyramidHeader";
import { SafeVideo } from "./components/SafeVideo";
import { MotionStudyFeature } from "./components/MotionStudyFeature";
import { PyramidPartnerCalculator } from "./components/PyramidPartnerCalculator";
import { HERO_MOTION_STUDY, PYRAMID_MOTION_STUDIES, FB_STUDY, INTERIOR_AMBIENT_STUDY } from "./pyramid-media";
import {
  PYRAMID_PACKAGES,
  monthlyMargin,
  annualMargin,
  marginPct,
  fmtMoney,
  fmtPct,
  PARTNER_ECONOMICS_HEADING,
  PARTNER_ECONOMICS_COPY,
  PARTNER_ECONOMICS_HIGHLIGHT,
  PARTNER_ECONOMICS_QUALIFICATION,
  PARTNER_ECONOMICS_APPROVAL_NOTE,
  MONEY_FLOW_LABEL,
  MONEY_FLOW_STEPS,
  VALUE_COLUMNS,
  HERO_COMMERCIAL_CLARITY,
} from "./pyramid-economics";
import {
  PILOT_CALENDLY_URL,
  PRIVATE_LABEL_EYEBROW,
  PRIVATE_LABEL_SUB,
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_SUPPORTING_COPY,
  HERO_TAGLINE,
  HERO_PRIMARY_CTA,
  HERO_SECONDARY_CTA,
  HERO_DISCLAIMER,
  SCALE_GROUPS,
  SCALE_NOTE,
  PORTFOLIO_HEADING,
  PORTFOLIO_COPY,
  PORTFOLIO_CARDS,
  CREATIVE_SYSTEM_HEADING,
  CREATIVE_SYSTEM_COPY,
  CREATIVE_SYSTEM_SOURCE,
  CREATIVE_SYSTEM_OUTPUTS,
  CREATIVE_SYSTEM_TRANSITION,
  CREATIVE_SYSTEM_NOTE,
  MOTION_STUDIES_HEADING,
  MOTION_STUDIES_COPY,
  MOTION_STUDIES_ATTRIBUTION_NOTE,
  FB_SECTION_EYEBROW,
  FB_SECTION_HEADING,
  FB_SECTION_COPY,
  WORKFLOW_HEADING,
  WORKFLOW_STEPS,
  WORKFLOW_CONTROL_HEADING,
  PYRAMID_RETAINS,
  ARCHER_SUPPLIES,
  MODELS_HEADING,
  OPERATING_MODELS,
  MODELS_NOTE,
  PROOF_STATS,
  PROOF_EXPERIENCE_LABEL,
  PROOF_EXPERIENCE,
  HOTEL_INDIGO_QUOTE,
  PROOF_DISCLAIMER,
  PILOT_HEADING,
  PILOT_RECOMMENDATION,
  PILOT_MIX,
  PILOT_OBJECTIVES_HEADING,
  PILOT_OBJECTIVES,
  PILOT_PRICING_NOTE,
  PILOT_CTA,
  PILOT_COMMERCIAL_HEADING,
  PILOT_COMMERCIAL_QUESTIONS,
  PILOT_COMMERCIAL_NOTE,
  NOTE_SALUTATION,
  NOTE_PARAGRAPHS,
  NOTE_SIGNATURE,
  FINAL_EYEBROW,
  FINAL_HEADING,
  FINAL_COPY,
  FINAL_PRIMARY_CTA,
  FINAL_SECONDARY_CTA,
  FOOTER_DISCLAIMER_LEAD,
  FOOTER_DISCLAIMER,
} from "./pyramid-content";

// Private, speculative creative-production concept prepared by Archer
// Design for Pyramid Global Hospitality. Never indexed, never linked from
// the main nav, sitemap (lib/seo.ts PUBLIC_PAGES intentionally omits this
// route), footer, or any public portfolio grid. Accessible only via the
// direct URL. Same treatment as this project's other private proposal
// microsites (/first-hospitality, /oxford, /tcrm, /topline): per-page
// noindex/nofollow metadata, plus components/AppChrome.tsx PUBLIC_PREFIXES
// so it renders full-bleed instead of the CRM sidebar/owner auth guard.
const PAGE_TITLE = "Pyramid Global Hospitality × Archer Design | Private Creative Concept";
const PAGE_DESCRIPTION =
  "A private motion and hospitality creative-production concept prepared for Pyramid Global Hospitality.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/pyramid") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

export default function PyramidPage() {
  const heroLabel = `${HERO_MOTION_STUDY.property} — ${HERO_MOTION_STUDY.location}`;

  return (
    <div className={`${fraunces.variable} pyr-theme relative min-h-screen`} id="top">
      <PyramidHeader />

      {/* ============================================================
          PRIVATE CONCEPT LABEL
          ============================================================ */}
      <div className="pyr-private-bar">
        <div className="pyr-shell pyr-private-bar-inner">
          <p className="pyr-private-label">
            {PRIVATE_LABEL_EYEBROW}
            <span>{PRIVATE_LABEL_SUB}</span>
          </p>
        </div>
      </div>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="pyr-hero">
        <div className="pyr-hero-media">
          <SafeVideo videoSrc={HERO_MOTION_STUDY.videoSrc} posterSrc={HERO_MOTION_STUDY.posterSrc} alt={`${heroLabel} motion study`} eager />
        </div>
        <div className="pyr-hero-overlay" aria-hidden="true" />
        <svg className="pyr-hero-contour" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,320 C160,260 260,360 420,300 C560,250 660,320 800,260" fill="none" stroke="rgba(230,197,129,0.32)" strokeWidth="1" />
          <path d="M0,360 C180,300 300,390 460,330 C600,280 700,350 800,300" fill="none" stroke="rgba(186,152,214,0.16)" strokeWidth="1" />
          <path d="M0,200 C140,150 240,230 400,180 C540,140 660,200 800,150" fill="none" stroke="rgba(247,242,231,0.08)" strokeWidth="1" />
        </svg>
        <div className="pyr-shell">
          <div className="pyr-hero-inner">
            <div className="pyr-hero-copy">
              <span className="pyr-eyebrow">{HERO_EYEBROW}</span>
              <h1 className="pyr-serif">{HERO_HEADLINE}</h1>
              <p className="pyr-sub">{HERO_SUPPORTING_COPY}</p>
              <p className="pyr-hero-tagline">{HERO_TAGLINE}</p>
              <div className="pyr-hero-actions">
                <a href="#motion-studies" className="pyr-btn pyr-btn-primary">
                  {HERO_PRIMARY_CTA}
                </a>
                <a href="#pilot" className="pyr-btn pyr-btn-ghost-light">
                  {HERO_SECONDARY_CTA}
                </a>
              </div>
              <p className="pyr-hero-disclaimer">{HERO_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SCALE STRIP
          ============================================================ */}
      <section className="pyr-on-ocean pyr-section-pad" id="scale">
        <div className="pyr-shell">
          <Reveal className="pyr-scale-groups">
            {SCALE_GROUPS.map((group) => (
              <div key={group.key}>
                <span className="pyr-scale-group-title">{group.title}</span>
                <div className="pyr-scale-group-grid">
                  {group.stats.map((stat) => (
                    <div key={stat.label} className="pyr-scale-stat">
                      <span className="pyr-num pyr-serif">{stat.value}</span>
                      <span className="pyr-lbl">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={1}>
            <p className="pyr-scale-note">{SCALE_NOTE}</p>
          </Reveal>
          <Reveal delay={2}>
            <p className="pyr-scale-commercial-clarity">{HERO_COMMERCIAL_CLARITY}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PORTFOLIO BREADTH
          ============================================================ */}
      <section className="pyr-on-ivory pyr-section-pad" id="portfolio">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Portfolio breadth</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{PORTFOLIO_HEADING}</h2>
              <p>{PORTFOLIO_COPY}</p>
            </div>
          </Reveal>
          <Reveal delay={1} className="pyr-portfolio-grid">
            {PORTFOLIO_CARDS.map((card) => (
              <div key={card.key} className="pyr-portfolio-card">
                <h3 className="pyr-serif">{card.title}</h3>
                <p>{card.note}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          THE CREATIVE SYSTEM — now precedes the motion studies, since
          it's the idea that makes the five studies legible.
          ============================================================ */}
      <section className="pyr-on-stone pyr-section-pad pyr-system-section">
        <div className="pyr-system-ambient" aria-hidden="true">
          <SafeVideo videoSrc={INTERIOR_AMBIENT_STUDY.videoSrc} posterSrc={INTERIOR_AMBIENT_STUDY.posterSrc} alt="" />
        </div>
        <div className="pyr-shell pyr-system-content">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">The creative system</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{CREATIVE_SYSTEM_HEADING}</h2>
              <p>{CREATIVE_SYSTEM_COPY}</p>
            </div>
          </Reveal>
          <Reveal delay={1} className="pyr-system-diagram">
            <span className="pyr-system-source">
              <span aria-hidden="true" />
              {CREATIVE_SYSTEM_SOURCE}
            </span>
            <span className="pyr-system-arrow" aria-hidden="true" />
            <div className="pyr-system-outputs">
              {CREATIVE_SYSTEM_OUTPUTS.map((item) => (
                <div key={item} className="pyr-system-output-card">
                  {item}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="pyr-system-transition">{CREATIVE_SYSTEM_TRANSITION}</p>
            <p className="pyr-system-note">{CREATIVE_SYSTEM_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FIVE PYRAMID MOTION STUDIES
          ============================================================ */}
      <section className="pyr-on-ivory pyr-studies-pad" id="motion-studies">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Custom motion studies</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{MOTION_STUDIES_HEADING}</h2>
              <p>{MOTION_STUDIES_COPY}</p>
            </div>
          </Reveal>

          <div className="pyr-studies-list">
            {PYRAMID_MOTION_STUDIES.map((study) => (
              <Reveal key={study.key}>
                <MotionStudyFeature study={study} number={String(study.order).padStart(2, "0")} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="pyr-studies-attribution">{MOTION_STUDIES_ATTRIBUTION_NOTE}</p>
          </Reveal>

          {/* Food & beverage supporting feature — pancake.mp4, a dedicated,
              polished treatment rather than a sixth identical study card. */}
          <Reveal className="pyr-fb-feature">
            <div className="pyr-study-media">
              <SafeVideo videoSrc={FB_STUDY.videoSrc} posterSrc={FB_STUDY.posterSrc} alt={`${FB_STUDY.category} motion study`} />
            </div>
            <div className="pyr-fb-feature-copy">
              <span className="pyr-eyebrow">{FB_SECTION_EYEBROW}</span>
              <h3 className="pyr-serif">{FB_SECTION_HEADING}</h3>
              <p>{FB_SECTION_COPY}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          HOW THE WORKFLOW FITS
          ============================================================ */}
      <section className="pyr-on-ivory pyr-section-pad" id="workflow">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">How it works</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{WORKFLOW_HEADING}</h2>
            </div>
          </Reveal>
          <Reveal delay={1} className="pyr-workflow-steps">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.idx} className="pyr-workflow-step">
                <span className="pyr-idx">{step.idx}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </Reveal>
          <span className="pyr-columns-heading">{WORKFLOW_CONTROL_HEADING}</span>
          <Reveal delay={2} className="pyr-columns">
            <div className="pyr-column pyr-column--retains">
              <h3>Pyramid controls</h3>
              <ul className="pyr-column-list">
                {PYRAMID_RETAINS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="pyr-column pyr-column--supplies">
              <h3>Archer delivers</h3>
              <ul className="pyr-column-list">
                {ARCHER_SUPPLIES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          TWO POTENTIAL OPERATING MODELS
          ============================================================ */}
      <section className="pyr-on-stone pyr-section-pad">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Operating models</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{MODELS_HEADING}</h2>
            </div>
          </Reveal>
          <Reveal delay={1} className="pyr-models-grid">
            {OPERATING_MODELS.map((model) => (
              <div key={model.key} className="pyr-model-card">
                <span className="pyr-model-subtitle">{model.subtitle}</span>
                <h3 className="pyr-serif">{model.title}</h3>
                <p className="pyr-model-intro">{model.intro}</p>
                <ul className="pyr-model-list">
                  {model.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          <Reveal delay={2}>
            <p className="pyr-models-note">{MODELS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PARTNER ECONOMICS — package cards, money-flow, value columns,
          and the illustrative commercial-scenario calculator.
          ============================================================ */}
      <section className="pyr-on-ivory pyr-section-pad" id="partner-economics">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Partner economics</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{PARTNER_ECONOMICS_HEADING}</h2>
              <p>{PARTNER_ECONOMICS_COPY}</p>
            </div>
            <p className="pyr-econ-highlight-line">{PARTNER_ECONOMICS_HIGHLIGHT}</p>
          </Reveal>

          <Reveal delay={1}>
            <div className="pyr-econ-cards">
              {PYRAMID_PACKAGES.map((pkg) => (
                <div key={pkg.key} className="pyr-econ-card">
                  <h3 className="pyr-serif">{pkg.name}</h3>
                  <p className="pyr-econ-positioning">{pkg.positioning}</p>
                  <div className="pyr-econ-rows">
                    <div className="pyr-econ-row">
                      <span>Owner pays</span>
                      <span>{fmtMoney(pkg.ownerPays)} / month</span>
                    </div>
                    <div className="pyr-econ-row">
                      <span>Archer&rsquo;s production rate</span>
                      <span>{fmtMoney(pkg.archerRate)} / month</span>
                    </div>
                    <div className="pyr-econ-row pyr-econ-row--highlight">
                      <span>Pyramid retains</span>
                      <span className="pyr-econ-margin-figure">
                        {fmtMoney(monthlyMargin(pkg))} / month{" "}
                        <span className="pyr-econ-margin-pct">&mdash; a {fmtPct(marginPct(pkg))} gross margin</span>
                      </span>
                    </div>
                  </div>
                  {pkg.includesHeading && <p className="pyr-econ-includes-heading">{pkg.includesHeading}</p>}
                  <ul className="pyr-econ-includes">
                    {pkg.includes.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {pkg.footnote && <p className="pyr-econ-footnote">{pkg.footnote}</p>}
                  <p className="pyr-econ-annual">Illustrative annual gross margin: {fmtMoney(annualMargin(pkg))} per participating property</p>
                </div>
              ))}
            </div>
            <p className="pyr-econ-qualification">{PARTNER_ECONOMICS_QUALIFICATION}</p>
            <p className="pyr-econ-approval-note">{PARTNER_ECONOMICS_APPROVAL_NOTE}</p>
          </Reveal>

          <Reveal delay={2}>
            <div className="pyr-flow" role="list" aria-label="How payment and production flow between the owner, Pyramid, and Archer">
              {MONEY_FLOW_STEPS.map((step, i) => (
                <Fragment key={step.title}>
                  {i > 0 && (
                    <span className="pyr-flow-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                  <div className="pyr-flow-step" role="listitem">
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </Fragment>
              ))}
            </div>
            <p className="pyr-flow-label">{MONEY_FLOW_LABEL}</p>
          </Reveal>

          <Reveal delay={3}>
            <div className="pyr-value-columns">
              {VALUE_COLUMNS.map((col) => (
                <div key={col.key} className="pyr-value-column">
                  <h4 className="pyr-serif">{col.title}</h4>
                  <ul className="pyr-value-list">
                    {col.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="pyr-calc-shell">
              <PyramidPartnerCalculator />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ARCHER DESIGN PROOF
          ============================================================ */}
      <section className="pyr-on-ink pyr-section-pad" id="proof">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Archer Design proof</span></div>
          </Reveal>
          <Reveal delay={1}>
            <div className="pyr-proof-metrics">
              {PROOF_STATS.map((stat) => (
                <div key={stat.label} className="pyr-proof-metric">
                  <span className="pyr-num pyr-serif">{stat.value}</span>
                  <span className="pyr-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
            <span className="pyr-experience-label">{PROOF_EXPERIENCE_LABEL}</span>
            <div className="pyr-experience-chips">
              {PROOF_EXPERIENCE.map((name) => (
                <span key={name} className="pyr-experience-chip">
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="pyr-indigo-card">
              <blockquote className="pyr-indigo-quote pyr-serif">&ldquo;{HOTEL_INDIGO_QUOTE}&rdquo;</blockquote>
              <p className="pyr-indigo-name">Hotel Indigo Pittsburgh, University-Oakland</p>
            </div>
            <p className="pyr-proof-disclaimer">{PROOF_DISCLAIMER}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          RECOMMENDED PILOT
          ============================================================ */}
      <section className="pyr-on-ivory pyr-section-pad" id="pilot">
        <div className="pyr-shell">
          <Reveal>
            <div className="pyr-label-row"><span className="pyr-rule" /><span className="pyr-eyebrow">Getting started</span></div>
            <div className="pyr-section-head">
              <h2 className="pyr-serif">{PILOT_HEADING}</h2>
            </div>
            <div className="pyr-pilot-recommend">
              <span aria-hidden="true" />
              {PILOT_RECOMMENDATION}
            </div>
          </Reveal>
          <Reveal delay={1} className="pyr-pilot-cols">
            <div>
              <h3>Possible mix</h3>
              <ul className="pyr-pilot-list">
                {PILOT_MIX.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{PILOT_OBJECTIVES_HEADING}</h3>
              <ul className="pyr-pilot-list">
                {PILOT_OBJECTIVES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="pyr-pilot-pricing-note">{PILOT_PRICING_NOTE}</p>
          </Reveal>
          <Reveal delay={3} className="pyr-pilot-commercial">
            <h3>{PILOT_COMMERCIAL_HEADING}</h3>
            <ul className="pyr-pilot-list pyr-pilot-list--commercial">
              {PILOT_COMMERCIAL_QUESTIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="pyr-pilot-commercial-note">{PILOT_COMMERCIAL_NOTE}</p>
          </Reveal>
          <Reveal delay={4} className="pyr-pilot-cta-row">
            <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener" className="pyr-btn pyr-btn-primary">
              {PILOT_CTA}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PERSONALIZED NOTE — direct address, positioned just above the
          final CTA.
          ============================================================ */}
      <section className="pyr-on-stone pyr-section-pad">
        <div className="pyr-shell">
          <Reveal className="pyr-note-card">
            <p className="pyr-note-salutation pyr-serif">{NOTE_SALUTATION}</p>
            {NOTE_PARAGRAPHS.map((para) => (
              <p key={para} className="pyr-note-body">{para}</p>
            ))}
            <p className="pyr-note-signature">{NOTE_SIGNATURE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="pyr-on-ink-deep pyr-section-pad">
        <div className="pyr-shell pyr-final-inner">
          <div className="pyr-final-panel">
            <Reveal>
              <span className="pyr-eyebrow" style={{ display: "block", marginBottom: "22px" }}>{FINAL_EYEBROW}</span>
              <h2 className="pyr-serif">{FINAL_HEADING}</h2>
              <p>{FINAL_COPY}</p>
            </Reveal>
            <Reveal delay={1}>
              <div className="pyr-final-actions">
                <a href={PILOT_CALENDLY_URL} target="_blank" rel="noopener" className="pyr-btn pyr-btn-primary">
                  {FINAL_PRIMARY_CTA}
                </a>
                <Link href="/social-media-work" className="pyr-btn pyr-btn-ghost-light">
                  {FINAL_SECONDARY_CTA}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="pyr-on-ink-deep pyr-footer">
        <div className="pyr-shell pyr-footer-inner">
          <span className="pyr-footer-logo-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- local static brand asset, no remote hotlinking */}
            <img
              src="/pyramid/pyramid-global-hospitality-logo-white.png"
              alt="Pyramid Global Hospitality"
              className="pyr-footer-logo-image"
              width={400}
              height={83}
            />
            <span className="pyr-footer-logo-x" aria-hidden="true">&times;</span>
            <span className="pyr-footer-logo-word">ARCHER DESIGN</span>
          </span>
          <p className="pyr-footer-note">
            Archer Design LLC &middot;{" "}
            <a href="https://www.archerdesign.shop" className="pyr-footer-link" target="_blank" rel="noopener">
              www.archerdesign.shop
            </a>
          </p>
          <p className="pyr-footer-legal">
            <span className="pyr-footer-legal-lead">{FOOTER_DISCLAIMER_LEAD}</span> {FOOTER_DISCLAIMER}
          </p>
        </div>
      </footer>
    </div>
  );
}
