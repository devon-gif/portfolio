import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Film,
  ImageIcon,
  Info,
  PartyPopper,
  Presentation,
  Smartphone,
  UtensilsCrossed,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { Reveal } from "./components/Reveal";
import { FirstHospitalityHeader } from "./components/FirstHospitalityHeader";
import { FirstHospitalityConceptCard } from "./components/FirstHospitalityConceptCard";
import { FirstHospitalityFeature } from "./components/FirstHospitalityFeature";
import { FirstHospitalityGallery } from "./components/FirstHospitalityGallery";
import { FirstHospitalityRevenueCalculator } from "./components/FirstHospitalityRevenueCalculator";
import {
  HERO_CONCEPT,
  CONCEPT_GALAXY,
  CONCEPT_ROOM,
  CONCEPT_DRINK,
  CONCEPT_LADY,
  CONCEPT_DISCLAIMER_FULL,
  CONCEPT_DISCLAIMER_SHORT,
} from "./first-hospitality-media";
import { EXISTING_WORK_SLIDES, EXISTING_WORK_FILTERS, FIRST_HOSPITALITY_PROOF_LOGOS } from "./first-hospitality-existing-work";
import {
  FIRST_HOSPITALITY_PACKAGES,
  monthlyMargin,
  annualMargin,
  marginPct,
  fmtMoney,
  fmtPct,
} from "./first-hospitality-pricing";
import {
  PILOT_MAILTO,
  HERO_EYEBROW,
  HERO_HEADLINE,
  HERO_SUPPORTING_COPY,
  HERO_SUPPORTING_LINE,
  HERO_NOTE,
  PORTFOLIO_STATS,
  PORTFOLIO_SOURCE_NOTE,
  OPPORTUNITY_HEADING,
  OPPORTUNITY_COPY,
  OPPORTUNITY_POINTS,
  OPPORTUNITY_SUPPORT_COPY,
  SHARED_OPPORTUNITY_EYEBROW,
  SHARED_OPPORTUNITY_HEADING,
  SHARED_OPPORTUNITY_COPY,
  SHARED_VALUE_COLUMNS,
  MONEY_FLOW_HEADING,
  COMMERCIAL_FLOW_STEPS,
  BILLING_STRUCTURE_NOTE,
  CUSTOM_FEATURES,
  EXISTING_WORK_EYEBROW,
  EXISTING_WORK_HEADING,
  EXISTING_WORK_SUPPORTING_COPY,
  EXISTING_WORK_INTRO,
  EXISTING_WORK_NOTE,
  SERVICE_OUTPUTS_HEADING,
  SERVICE_OUTPUTS_COPY,
  SERVICE_OUTPUTS,
  WORKFLOW_STEPS,
  WORKFLOW_SUMMARY,
  PARTNERSHIP_HEADING,
  PARTNERSHIP_COPY,
  PARTNERSHIP_MODELS,
  PARTNERSHIP_QUOTE,
  COMMERCIAL_TERMS_NOTE,
  PARTNER_ECONOMICS_HEADING,
  PARTNER_ECONOMICS_COPY,
  PARTNER_ECONOMICS_QUALIFICATION,
  WHY_EACH_SIDE_EYEBROW,
  WHY_EACH_SIDE_HEADING,
  WHY_OWNER_HEADING,
  WHY_OWNER_POINTS,
  WHY_PLATFORM_HEADING,
  WHY_PLATFORM_POINTS,
  PROOF_STATS,
  PROOF_NOTE,
  HOTEL_INDIGO_QUOTE,
  HOTEL_INDIGO_SUPPORTING_COPY,
  HOTEL_INDIGO_QUALIFICATION,
  PILOT_HEADING,
  PILOT_SETUP_HEADING,
  PILOT_ITEMS,
  PILOT_STRUCTURE,
  PILOT_REVIEW_HEADING,
  PILOT_REVIEW_CRITERIA,
  PILOT_CLOSING_COPY,
  PILOT_SCOPE_NOTE,
  FINAL_CTA_HEADING,
  FINAL_CTA_COPY,
  FOOTER_IMPORTANT_NOTE,
} from "./first-hospitality-content";

// Private, personalized partnership concept prepared for First Hospitality.
// Never indexed, never linked from the main nav, sitemap (see lib/seo.ts
// PUBLIC_PAGES, which intentionally omits this route), or footer. Accessible
// only via the direct URL. Same treatment as this project's other private
// proposal microsites (/oxford, /tcrm, /topline, /george): per-page
// noindex/nofollow metadata, plus components/AppChrome.tsx PUBLIC_PREFIXES
// so it renders full-bleed instead of the CRM sidebar.
const PAGE_TITLE = "First Hospitality x Archer Design | Private Partnership Concept";
const PAGE_DESCRIPTION =
  "A private creative-production partnership concept prepared by Archer Design for First Hospitality.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/first-hospitality") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

/* ── Service icon map (SERVICE_OUTPUTS order in first-hospitality-content.ts) ── */
const SERVICE_ICONS = [Film, ImageIcon, UtensilsCrossed, PartyPopper, CalendarRange, Building2, Smartphone, Presentation];

export default function FirstHospitalityPage() {
  return (
    <div className={`${fraunces.variable} fh-theme relative min-h-screen`} id="top">
      <FirstHospitalityHeader />

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="fh-hero-cinematic">
        <div className="fh-hero-shell">
          <div className="fh-hero-media-box">
            <FirstHospitalityConceptCard concept={HERO_CONCEPT} eager />
            <div className="fh-hero-overlay" aria-hidden="true" />
            <div className="fh-hero-copy">
              <span className="fh-eyebrow">{HERO_EYEBROW}</span>
              <h1 className="fh-serif">{HERO_HEADLINE}</h1>
              <p className="fh-sub">{HERO_SUPPORTING_COPY}</p>
              <p className="fh-sub fh-sub-line">{HERO_SUPPORTING_LINE}</p>
              <div className="fh-hero-actions">
                <a href="#partner-model" className="fh-btn fh-btn-primary">
                  Explore the partner model
                </a>
                <a href="#custom-work" className="fh-btn fh-btn-ghost-light">
                  View the creative
                </a>
              </div>
              <p className="fh-hero-note">{HERO_NOTE}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          THE OPPORTUNITY
          ============================================================ */}
      <section className="fh-on-white fh-section-pad" id="opportunity">
        <div className="fh-opportunity-shell">
          <Reveal className="fh-opportunity-grid">
            <div className="fh-opportunity-left">
              <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">The opportunity</span></div>
              <h2 className="fh-serif">{OPPORTUNITY_HEADING}</h2>
              {OPPORTUNITY_COPY.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="fh-opportunity-panel fh-glass">
              <ul className="fh-opportunity-list">
                {OPPORTUNITY_POINTS.map((point) => (
                  <li key={point.rest}>
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                    <span>
                      <strong>{point.lead}</strong> {point.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1} className="fh-portfolio-stats">
            {PORTFOLIO_STATS.map((stat) => (
              <div key={stat.label} className="fh-portfolio-stat">
                <span className="fh-num fh-serif">{stat.value}</span>
                <span className="fh-lbl">{stat.label}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={2}>
            <p className="fh-portfolio-support">{OPPORTUNITY_SUPPORT_COPY}</p>
            <p className="fh-portfolio-source">{PORTFOLIO_SOURCE_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          CUSTOM FEATURE 02 — sunset-to-galaxy resort concept (The Abbey
          Resort). Large, near-full-width cinematic placement reinforcing
          the destination/portfolio-scale narrative just above.
          ============================================================ */}
      <section className="fh-on-ink fh-feature-pad" id="custom-work">
        <div className="fh-shell">
          <Reveal>
            <FirstHospitalityFeature
              concept={CONCEPT_GALAXY}
              number={CUSTOM_FEATURES.galaxy.number}
              heading={CUSTOM_FEATURES.galaxy.heading}
              copy={CUSTOM_FEATURES.galaxy.copy}
              variant="full"
              disclaimer={CONCEPT_DISCLAIMER_FULL}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          THE SHARED OPPORTUNITY — new section making the commercial
          opportunity explicit for owners/properties, First Hospitality, and
          Archer Design, plus a simple commercial-flow diagram.
          ============================================================ */}
      <section className="fh-on-white-alt fh-section-pad" id="shared-opportunity">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">{SHARED_OPPORTUNITY_EYEBROW}</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{SHARED_OPPORTUNITY_HEADING}</h2>
              {SHARED_OPPORTUNITY_COPY.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1} className="fh-value-columns">
            {SHARED_VALUE_COLUMNS.map((col) => (
              <div key={col.key} className="fh-value-column fh-glass">
                <h3 className="fh-serif">{col.title}</h3>
                <ul className="fh-value-list">
                  {col.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>

          <Reveal delay={2}>
            <h3 className="fh-serif fh-flow-heading">{MONEY_FLOW_HEADING}</h3>
            <div className="fh-flow-diagram">
              {COMMERCIAL_FLOW_STEPS.map((step) => (
                <div key={step.key} className="fh-flow-step fh-glass">
                  <h4 className="fh-serif">{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
            <p className="fh-flow-note">{BILLING_STRUCTURE_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          CUSTOM FEATURE 03 — luxury lobby/lounge concept. Two-column
          video-and-copy layout, placed near owner-value / what-Archer-
          provides so it reinforces the "reuse of existing photography"
          argument right where that argument is made.
          ============================================================ */}
      <section className="fh-on-white-alt fh-feature-pad">
        <div className="fh-shell">
          <Reveal>
            <FirstHospitalityFeature
              concept={CONCEPT_ROOM}
              number={CUSTOM_FEATURES.room.number}
              heading={CUSTOM_FEATURES.room.heading}
              copy={CUSTOM_FEATURES.room.copy}
              variant="split"
              disclaimer={CONCEPT_DISCLAIMER_SHORT}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PARTNERSHIP — what Archer provides, workflow, commercial models
          ============================================================ */}
      <section className="fh-on-white fh-section-pad" id="partnership">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">What Archer provides</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{SERVICE_OUTPUTS_HEADING}</h2>
              <p>{SERVICE_OUTPUTS_COPY}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="fh-service-grid">
              {SERVICE_OUTPUTS.map((label, i) => {
                const Icon = SERVICE_ICONS[i] ?? Film;
                return (
                  <div key={label} className="fh-service-item">
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="fh-on-white-alt fh-section-pad">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">A simple operating model</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">First Hospitality leads. Archer produces.</h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="fh-workflow-cols">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.idx} className="fh-workflow-col fh-glass">
                  <span className="fh-idx fh-serif">{step.idx}</span>
                  <h3 className="fh-serif">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <p className="fh-workflow-summary">{WORKFLOW_SUMMARY}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          CUSTOM FEATURE 04 — cocktail / F&B concept. Reversed, asymmetric
          two-column layout placed directly before the commercial-partnership
          models, reinforcing restaurants and bars as a revenue-driving part
          of the proposal.
          ============================================================ */}
      <section className="fh-on-ink fh-feature-pad">
        <div className="fh-shell">
          <Reveal>
            <FirstHospitalityFeature
              concept={CONCEPT_DRINK}
              number={CUSTOM_FEATURES.drink.number}
              heading={CUSTOM_FEATURES.drink.heading}
              copy={CUSTOM_FEATURES.drink.copy}
              variant="split"
              reversed
              asymmetric
              disclaimer={CONCEPT_DISCLAIMER_SHORT}
            />
          </Reveal>
        </div>
      </section>

      <section className="fh-on-white fh-section-pad" id="partner-model">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">Commercial structure</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{PARTNERSHIP_HEADING}</h2>
              <p>{PARTNERSHIP_COPY}</p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="fh-partnership-models">
              {PARTNERSHIP_MODELS.map((model) => (
                <div key={model.key} className={`fh-partnership-model fh-glass${model.recommended ? " fh-partnership-model--recommended" : ""}`}>
                  {model.badge && <span className="fh-partnership-badge">{model.badge}</span>}
                  <h3 className="fh-serif">{model.title}</h3>
                  <p>{model.body}</p>
                  {model.emphasis && <p className="fh-partnership-emphasis">{model.emphasis}</p>}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <blockquote className="fh-partnership-quote">{PARTNERSHIP_QUOTE}</blockquote>
            <p className="fh-partnership-transparency">
              <strong>Terms in plain language:</strong> {COMMERCIAL_TERMS_NOTE}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PARTNER ECONOMICS — package cards (owner-facing price / Archer
          production rate / First Hospitality retains) reusing exact
          approved /topline economics, plus the portfolio revenue calculator.
          ============================================================ */}
      <section className="fh-on-white-alt fh-section-pad" id="partner-economics">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">Partner economics</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{PARTNER_ECONOMICS_HEADING}</h2>
              <p>{PARTNER_ECONOMICS_COPY}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="fh-econ-cards">
              {FIRST_HOSPITALITY_PACKAGES.map((pkg) => (
                <div key={pkg.key} className="fh-econ-card fh-glass">
                  <h3 className="fh-serif">{pkg.name}</h3>
                  <p className="fh-econ-positioning">{pkg.positioning}</p>
                  <div className="fh-econ-rows">
                    <div className="fh-econ-row">
                      <span>Owner pays</span>
                      <span>{fmtMoney(pkg.retail)} / month</span>
                    </div>
                    <div className="fh-econ-row">
                      <span>Archer&rsquo;s rate</span>
                      <span>{fmtMoney(pkg.wholesale)} / month</span>
                    </div>
                    <div className="fh-econ-row fh-econ-row--highlight">
                      <span>First Hospitality keeps</span>
                      <span className="fh-calc-margin-figure">
                        {fmtMoney(monthlyMargin(pkg))} / month{" "}
                        <span className="fh-calc-margin-pct">&mdash; a {fmtPct(marginPct(pkg))} margin</span>
                      </span>
                    </div>
                  </div>
                  {pkg.includesHeading && <p className="fh-econ-includes-heading">{pkg.includesHeading}</p>}
                  <ul className="fh-econ-includes">
                    {pkg.includes.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {pkg.footnote && <p className="fh-econ-footnote">{pkg.footnote}</p>}
                  <p className="fh-econ-annual">Illustrative annual margin: {fmtMoney(annualMargin(pkg))} per property</p>
                </div>
              ))}
            </div>
            <p className="fh-partnership-transparency">{PARTNER_ECONOMICS_QUALIFICATION}</p>
          </Reveal>

          <Reveal delay={2}>
            <div className="fh-calc-shell fh-glass-elevated">
              <FirstHospitalityRevenueCalculator />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          WHY EACH SIDE SAYS YES — merged from what were two separate
          sections (owner value / platform value) into one section with two
          subsections, per Devon's copy rewrite.
          ============================================================ */}
      <section className="fh-on-white fh-section-pad">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">{WHY_EACH_SIDE_EYEBROW}</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{WHY_EACH_SIDE_HEADING}</h2>
            </div>
          </Reveal>
          <Reveal delay={1} className="fh-why-columns">
            <div className="fh-why-column">
              <h3 className="fh-serif">{WHY_OWNER_HEADING}</h3>
              <ul className="fh-reason-grid">
                {WHY_OWNER_POINTS.map((item) => (
                  <li key={item} className="fh-reason-item">
                    <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fh-why-column">
              <h3 className="fh-serif">{WHY_PLATFORM_HEADING}</h3>
              <ul className="fh-reason-grid">
                {WHY_PLATFORM_POINTS.map((item) => (
                  <li key={item} className="fh-reason-item">
                    <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          EXISTING ARCHER DESIGN WORK — one polished slideshow (not the five
          First Hospitality custom concepts) modeled closely on the
          /social-media-work carousel experience, demonstrating the broader
          range and quality of Archer Design's real, already-delivered
          hospitality client work.
          ============================================================ */}
      <section className="fh-on-ink fh-section-pad" id="archer-work">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">{EXISTING_WORK_EYEBROW}</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{EXISTING_WORK_HEADING}</h2>
              <p>{EXISTING_WORK_SUPPORTING_COPY}</p>
            </div>
            <p className="fh-existing-work-intro">{EXISTING_WORK_INTRO}</p>
          </Reveal>

          <Reveal delay={1}>
            <FirstHospitalityGallery
              slides={EXISTING_WORK_SLIDES}
              ariaLabel="Existing Archer Design work"
              idPrefix="existing"
              filters={EXISTING_WORK_FILTERS}
            />
          </Reveal>

          <Reveal delay={2}>
            <p className="fh-existing-work-note">{EXISTING_WORK_NOTE}</p>
            <div className="fh-existing-logos">
              {FIRST_HOSPITALITY_PROOF_LOGOS.filter((logo) => logo.available).map((logo) => (
                <span key={logo.alt} className={`fh-existing-logo-chip fh-existing-logo-chip--${logo.tone}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- small full-color brand-logo strip, not a content image */}
                  <img src={logo.src} alt={logo.alt} />
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PROOF
          ============================================================ */}
      <section className="fh-on-ink fh-section-pad" id="proof">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">Archer proof</span></div>
          </Reveal>
          <Reveal delay={1}>
            <div className="fh-metrics fh-metrics-ink">
              {PROOF_STATS.map((stat) => (
                <div key={stat.label} className="fh-metric">
                  <span className="fh-num fh-serif">{stat.value}</span>
                  <span className="fh-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="fh-proof-note">{PROOF_NOTE}</p>
          </Reveal>
          <Reveal delay={2}>
            <div className="fh-indigo-card fh-glass-dark">
              <blockquote className="fh-indigo-quote fh-serif">&ldquo;{HOTEL_INDIGO_QUOTE}&rdquo;</blockquote>
              <p className="fh-indigo-support">{HOTEL_INDIGO_SUPPORTING_COPY}</p>
              <p className="fh-indigo-name">Hotel Indigo Pittsburgh, University-Oakland</p>
              <p className="fh-indigo-qualification">{HOTEL_INDIGO_QUALIFICATION}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          CUSTOM FEATURE 05 — bellman / guest-arrival concept. The final
          custom video feature, placed directly before the pilot section so
          the proposal closes with the same First Hospitality footage it
          opened with. Portrait clip, given an elegant centered portrait
          treatment rather than a small card.
          ============================================================ */}
      <section className="fh-on-white-alt fh-feature-pad">
        <div className="fh-shell">
          <Reveal>
            <FirstHospitalityFeature
              concept={CONCEPT_LADY}
              number={CUSTOM_FEATURES.lady.number}
              heading={CUSTOM_FEATURES.lady.heading}
              copy={CUSTOM_FEATURES.lady.copy}
              variant="portrait"
              disclaimer={CONCEPT_DISCLAIMER_SHORT}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PILOT
          ============================================================ */}
      <section className="fh-on-white fh-section-pad" id="pilot">
        <div className="fh-shell">
          <Reveal>
            <div className="fh-label-row"><span className="fh-rule" /><span className="fh-eyebrow">Getting started</span></div>
            <div className="fh-section-head">
              <h2 className="fh-serif">{PILOT_HEADING}</h2>
            </div>
          </Reveal>
          <Reveal delay={1} className="fh-pilot-structure">
            {PILOT_STRUCTURE.map((item) => (
              <div key={item.label} className="fh-pilot-struct-item">
                <span className="fh-num">{item.value}</span>
                <span className="fh-lbl">{item.label}</span>
              </div>
            ))}
          </Reveal>
          <Reveal delay={2}>
            <p className="fh-pilot-review-heading">{PILOT_SETUP_HEADING}</p>
            <ul className="fh-pilot-items">
              {PILOT_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={3}>
            <p className="fh-pilot-review-heading">{PILOT_REVIEW_HEADING}</p>
            <p className="fh-pilot-review-inline">{PILOT_REVIEW_CRITERIA.join(" · ")}</p>
            <p className="fh-pilot-closing-copy">{PILOT_CLOSING_COPY}</p>
            <p className="fh-pilot-scope-note">{PILOT_SCOPE_NOTE}</p>
          </Reveal>
          <Reveal delay={4} className="fh-pilot-cta-row">
            <a href={PILOT_MAILTO} className="fh-btn fh-btn-primary">
              Discuss a First Hospitality pilot
            </a>
            <Link href="/social-media-work" className="fh-text-link">
              View Archer Design hospitality work
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="fh-on-ink-deep fh-section-pad">
        <div className="fh-shell fh-cta-inner">
          <div className="fh-cta-panel fh-glass-elevated">
            <Reveal>
              <span className="fh-eyebrow" style={{ display: "block", marginBottom: "22px" }}>Next step</span>
              <h2 className="fh-serif">{FINAL_CTA_HEADING}</h2>
              <p>{FINAL_CTA_COPY}</p>
            </Reveal>
            <Reveal delay={1}>
              <div className="fh-cta-actions">
                <a href={PILOT_MAILTO} className="fh-btn fh-btn-primary">
                  Discuss the owner-service model
                </a>
                <a href="#pilot" className="fh-btn fh-btn-ghost-light">
                  Review the pilot structure
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="fh-on-ink-deep fh-footer">
        <div className="fh-shell fh-footer-inner">
          <span className="fh-footer-lockup">First Hospitality &times; Archer Design</span>
          <p className="fh-footer-note">
            Private speculative partnership concept.
            <br />
            Archer Design LLC &middot;{" "}
            <a href="https://www.archerdesign.shop" className="fh-footer-link" target="_blank" rel="noopener">
              www.archerdesign.shop
            </a>
          </p>
          <p className="fh-footer-legal">
            <Info size={12} strokeWidth={2} aria-hidden="true" style={{ display: "inline", marginRight: 6, verticalAlign: "-1px" }} />
            <strong>Important:</strong> {FOOTER_IMPORTANT_NOTE}
          </p>
        </div>
      </footer>
    </div>
  );
}
