import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { PROOF } from "@/lib/proof-stats";
import { Reveal } from "./components/Reveal";
import { DnsHeader } from "./components/DnsHeader";
import { DnsHeroVideoBackground } from "./components/DnsHeroVideoBackground";
import { DnsMotionShowcase } from "./components/DnsMotionShowcase";
import { DnsBroaderMotionShowcase } from "./components/DnsBroaderMotionShowcase";
import { DnsStillsGallery } from "./components/DnsStillsGallery";
import { DnsReferralCalculator } from "./components/DnsReferralCalculator";
import { DnsReciprocityDiagram } from "./components/DnsReciprocityDiagram";
import { DnsClientJourney } from "./components/DnsClientJourney";
import { DnsLifecycle } from "./components/DnsLifecycle";
import { HERO_ENVIRONMENT_VIDEO, HERO_ENVIRONMENT_POSTER, HERO_ENVIRONMENT_ALT } from "./dns-media";
import { DNS_STILLS, DNS_STILLS_NOTE } from "./dns-stills-data";
import { ACTIVATION_TIERS, DEFAULT_TIER_KEY, fmtMoney, tierByKey } from "../tcrm/tcrm-pricing";
import {
  CONTACT_MAILTO,
  HERO_EYEBROW,
  HERO_EYEBROW_SUB,
  HERO_HEADLINE_LINE_1,
  HERO_HEADLINE_LINE_2,
  HERO_COPY,
  HERO_CTA_PRIMARY,
  HERO_CTA_SECONDARY,
  HERO_WORKFLOW_DNS_LABEL,
  HERO_WORKFLOW_DNS_STAGES,
  HERO_WORKFLOW_HANDOFF,
  HERO_WORKFLOW_ARCHER_LABEL,
  HERO_WORKFLOW_ARCHER_STAGES,
  HERO_FIT_CARD_TITLE,
  HERO_FIT_CARD_BODY,
  HERO_FIT_CARD_NOTE,
  POSTINSTALL_EYEBROW,
  POSTINSTALL_HEADING_LINE_1,
  POSTINSTALL_HEADING_LINE_2,
  POSTINSTALL_COPY,
  POSTINSTALL_DNS_LABEL,
  POSTINSTALL_DNS_ITEMS,
  POSTINSTALL_ARCHER_LABEL,
  POSTINSTALL_ARCHER_ITEMS,
  POSTINSTALL_STATEMENT_LINE_1,
  POSTINSTALL_STATEMENT_LINE_2,
  STATIC_EYEBROW,
  STATIC_HEADING_LINE_1,
  STATIC_HEADING_LINE_2,
  STATIC_COPY,
  THREE_WAYS_EYEBROW,
  THREE_WAYS_HEADING,
  THREE_WAYS,
  REVEALKIT_EYEBROW,
  REVEALKIT_HEADING,
  REVEALKIT_DISCLAIMER,
  REVEALKIT_COPY,
  REVEALKIT_DELIVERABLES,
  REVEALKIT_STATEMENT_LINE_1,
  REVEALKIT_STATEMENT_LINE_2,
  REVEALKIT_NOTE,
  DNSBD_EYEBROW,
  DNSBD_HEADING_LINE_1,
  DNSBD_HEADING_LINE_2,
  DNSBD_COPY,
  DNSBD_EXAMPLES,
  DNSBD_IMPORTANT,
  DNSBD_CASESTUDY_HEADING,
  DNSBD_CASESTUDY_COPY,
  DNSBD_CASESTUDY_NOTE,
  DNS_AT_A_GLANCE_LABEL,
  DNS_FACTS,
  DNS_CREDIBILITY_NOTE,
  MODELS_EYEBROW,
  MODELS_HEADING,
  PARTNERSHIP_MODELS,
  MODELS_NOTE,
  ECON_EYEBROW,
  ECON_HEADING,
  ECON_COPY,
  JOURNEY_EYEBROW,
  JOURNEY_HEADING,
  JOURNEY_COPY,
  PATHS_NOTE,
  PATH_PROJECT,
  PATH_SUBSCRIPTION,
  RECURRING_EYEBROW,
  RECURRING_HEADING,
  RECURRING_COPY,
  RECURRING_SUPPORTING_LINE,
  RECURRING_TIERS_LABEL,
  RECURRING_SHARE_TIERS,
  RECURRING_SHARE_NOTE,
  RECURRING_RETENTION_NOTE,
  FIRST_MONTH_BONUS_PCT,
  BONUS_EYEBROW,
  BONUS_COPY,
  BONUS_TAG_1,
  BONUS_TAG_2,
  BONUS_FLOW_STEP_0,
  BONUS_FLOW_STEP_1_STAGE,
  BONUS_FLOW_STEP_1_VALUE,
  BONUS_FLOW_STEP_1_DESC,
  BONUS_FLOW_STEP_2_STAGE,
  BONUS_FLOW_STEP_2_VALUE,
  BONUS_FLOW_STEP_2_DESC,
  BONUS_FLOW_FINAL,
  fmtDnsMoneySmart,
  fmtDnsMoneyExact,
  EXAMPLE_EYEBROW,
  EXAMPLE_PROPERTY_LABEL,
  EXAMPLE_MONTH1_LABEL,
  EXAMPLE_MONTH2_LABEL,
  EXAMPLE_YEAR1_LABEL,
  EXAMPLE_NOTE,
  WHY_DNS_HEADING,
  WHY_DNS_COPY,
  WHY_HOTEL_HEADING,
  WHY_HOTEL_INTRO,
  WHY_HOTEL_ITEMS,
  LEGAL_EYEBROW,
  LEGAL_COPY,
  CALC_WIDGET_HEADING,
  CALC_WIDGET_COPY,
  LIFECYCLE_EYEBROW,
  LIFECYCLE_HEADING_LINE_1,
  LIFECYCLE_HEADING_LINE_2,
  LIFECYCLE_DNS_LABEL,
  LIFECYCLE_ARCHER_LABEL,
  LIFECYCLE_OVERLAP_NOTE,
  PROOF_EYEBROW,
  PROOF_HEADING_LINE_1,
  PROOF_HEADING_LINE_2,
  PROOF_SUPPORTING_COPY,
  HOTEL_INDIGO_QUOTE,
  HOTEL_INDIGO_SUPPORTING_COPY,
  HOTEL_INDIGO_QUALIFICATION,
  FINAL_EYEBROW,
  FINAL_HEADING,
  FINAL_COPY,
  FINAL_CTA_PRIMARY,
  FINAL_CTA_SECONDARY,
  FOOTER_LOCKUP,
  FOOTER_DISCLOSURE_LINE,
} from "./dns-content";

// Private, personalized collaboration concept prepared for Tony Spagnolo, VP
// Design at DNS Industries. Never indexed, never linked from the main nav,
// sitemap (lib/seo.ts PUBLIC_PAGES intentionally omits this route), or
// footer. Accessible only via the direct URL. Same treatment as this
// project's other private proposal microsites (/first-hospitality, /tcrm,
// /rebel, /jacaruso): per-page noindex/nofollow metadata, plus
// components/AppChrome.tsx PUBLIC_PREFIXES so it renders full-bleed instead
// of the CRM sidebar, plus an app/robots.ts disallow entry.
const PAGE_TITLE = "DNS Industries × Archer Design | Private Collaboration Concept";
const PAGE_DESCRIPTION =
  "A private collaboration concept prepared by Archer Design for DNS Industries — where physical hospitality environments meet commercial activation.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/dns") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

export default function DnsPage() {
  // Worked examples (Section 09's "Illustrative Examples" panel) — real
  // arithmetic computed from the real default Archer plan, the three
  // proposed recurring partner levels, and the proposed first-month bonus
  // percentage. Never a hand-typed total.
  const exampleTier = tierByKey(DEFAULT_TIER_KEY);
  const exampleMonth1Bonus = exampleTier.retail * (FIRST_MONTH_BONUS_PCT / 100);
  const exampleTierRows = RECURRING_SHARE_TIERS.map((t) => {
    const month2Plus = exampleTier.retail * (t.pct / 100);
    const yearOne = exampleMonth1Bonus + month2Plus * 11;
    return { ...t, month2Plus, yearOne };
  });

  return (
    <div className={`${fraunces.variable} dns-theme relative min-h-screen`} id="top">
      <DnsHeader />

      {/* ============================================================
          01 — HERO
          ============================================================ */}
      <section className="dns-hero--video">
        <DnsHeroVideoBackground src={HERO_ENVIRONMENT_VIDEO} poster={HERO_ENVIRONMENT_POSTER} alt={HERO_ENVIRONMENT_ALT} />
        <div className="dns-hero-overlay" aria-hidden="true" />

        <div className="dns-shell relative z-[3]">
          <Reveal className="dns-hero-content">
            <span className="dns-eyebrow dns-eyebrow--light">{HERO_EYEBROW}</span>
            <span className="dns-hero-eyebrow-sub">{HERO_EYEBROW_SUB}</span>
            <h1 className="dns-serif dns-hero-headline">
              {HERO_HEADLINE_LINE_1}
              <br />
              {HERO_HEADLINE_LINE_2}
            </h1>
            <p className="dns-hero-body">{HERO_COPY}</p>

            <div className="dns-hero-workflow">
              <div className="dns-hero-workflow-row">
                <span className="dns-hero-workflow-label">{HERO_WORKFLOW_DNS_LABEL}</span>
                {HERO_WORKFLOW_DNS_STAGES.map((stage, i) => (
                  <span key={stage} className="dns-hero-workflow-item">
                    {i > 0 && <span className="dns-hero-workflow-sep">→</span>}
                    <span className="dns-hero-workflow-stage">{stage}</span>
                  </span>
                ))}
              </div>
              <div className="dns-hero-workflow-handoff">{HERO_WORKFLOW_HANDOFF}</div>
              <div className="dns-hero-workflow-row dns-hero-workflow-row--archer">
                <span className="dns-hero-workflow-label">{HERO_WORKFLOW_ARCHER_LABEL}</span>
                {HERO_WORKFLOW_ARCHER_STAGES.map((stage, i) => (
                  <span key={stage} className="dns-hero-workflow-item">
                    {i > 0 && <span className="dns-hero-workflow-sep">→</span>}
                    <span className="dns-hero-workflow-stage">{stage}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="dns-hero-actions">
              <a href="#where-archer-fits" className="dns-btn dns-btn-primary">
                {HERO_CTA_PRIMARY}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="#creative" className="dns-btn dns-btn-ghost">
                {HERO_CTA_SECONDARY}
              </a>
            </div>
          </Reveal>

          <Reveal delay={2} className="dns-hero-fit-card">
            <h3 className="dns-serif">{HERO_FIT_CARD_TITLE}</h3>
            <p>{HERO_FIT_CARD_BODY}</p>
            <p className="dns-hero-fit-card-note">{HERO_FIT_CARD_NOTE}</p>
          </Reveal>
        </div>

        <div className="dns-hero-fade" aria-hidden="true" />
      </section>

      {/* ============================================================
          02 — THE OPPORTUNITY (light)
          ============================================================ */}
      <section className="dns-on-paper dns-section-pad" id="post-install">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule" />
              <span className="dns-eyebrow">{POSTINSTALL_EYEBROW}</span>
            </div>
            <div className="dns-section-head">
              <h2 className="dns-serif">
                {POSTINSTALL_HEADING_LINE_1}
                <br />
                {POSTINSTALL_HEADING_LINE_2}
              </h2>
              <p>{POSTINSTALL_COPY}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-postinstall-flow">
              <div className="dns-postinstall-col dns-postinstall-col--dns">
                <span className="dns-postinstall-col-label">{POSTINSTALL_DNS_LABEL}</span>
                <div className="dns-postinstall-tags">
                  {POSTINSTALL_DNS_ITEMS.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="dns-postinstall-arrow" aria-hidden="true">
                <ArrowRight size={20} strokeWidth={1.75} />
              </div>
              <div className="dns-postinstall-col dns-postinstall-col--archer">
                <span className="dns-postinstall-col-label">{POSTINSTALL_ARCHER_LABEL}</span>
                <div className="dns-postinstall-tags">
                  {POSTINSTALL_ARCHER_ITEMS.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="dns-postinstall-statement">
              <p className="dns-serif">{POSTINSTALL_STATEMENT_LINE_1}</p>
              <p>{POSTINSTALL_STATEMENT_LINE_2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          03 — MOTION (dark)
          ============================================================ */}
      <DnsMotionShowcase />

      {/* ============================================================
          04 — STATIC (light)
          ============================================================ */}
      <section className="dns-on-paper dns-section-pad" id="creative-static">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule" />
              <span className="dns-eyebrow">{STATIC_EYEBROW}</span>
            </div>
            <div className="dns-section-head">
              <h2 className="dns-serif">
                {STATIC_HEADING_LINE_1}
                <br />
                {STATIC_HEADING_LINE_2}
              </h2>
              <p>{STATIC_COPY}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <DnsStillsGallery items={DNS_STILLS} />
            <p className="dns-stills-note">{DNS_STILLS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          05 — THREE WAYS ARCHER COULD HELP DNS (dark)
          ============================================================ */}
      <section className="dns-on-ink dns-section-pad" id="where-archer-fits">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule dns-rule--light" />
              <span className="dns-eyebrow dns-eyebrow--light">{THREE_WAYS_EYEBROW}</span>
            </div>
            <h2 className="dns-serif dns-section-head-light">{THREE_WAYS_HEADING}</h2>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-threeways-grid">
              {THREE_WAYS.map((way) => (
                <div key={way.number} className="dns-threeways-panel">
                  <span className="dns-threeways-number">{way.number}</span>
                  <span className="dns-threeways-eyebrow">{way.eyebrow}</span>
                  <h3 className="dns-serif">{way.title}</h3>
                  <p>{way.copy}</p>
                  {way.copy2 && <p>{way.copy2}</p>}
                  {way.capabilities.length > 0 && (
                    <ul className="dns-threeways-list">
                      {way.capabilities.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}
                  {way.situations && (
                    <DnsReciprocityDiagram
                      dnsLabel={way.situations.dnsLabel}
                      dnsItems={way.situations.dnsItems}
                      archerLabel={way.situations.archerLabel}
                      archerItems={way.situations.archerItems}
                    />
                  )}
                  <p className="dns-threeways-keyline">{way.keyLine}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          06 — THE PROJECT REVEAL KIT (light)
          ============================================================ */}
      <section className="dns-on-paper dns-section-pad" id="project-reveal">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule" />
              <span className="dns-eyebrow">{REVEALKIT_EYEBROW}</span>
            </div>
            <div className="dns-section-head">
              <h2 className="dns-serif">{REVEALKIT_HEADING}</h2>
              <span className="dns-revealkit-disclaimer">{REVEALKIT_DISCLAIMER}</span>
              <p style={{ marginTop: 18 }}>{REVEALKIT_COPY}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-revealkit-grid">
              {REVEALKIT_DELIVERABLES.map((item) => (
                <div key={item} className="dns-revealkit-item">
                  {item}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="dns-revealkit-statement">
              <p className="dns-serif">{REVEALKIT_STATEMENT_LINE_1}</p>
              <p>{REVEALKIT_STATEMENT_LINE_2}</p>
            </div>
            <p className="dns-revealkit-note">{REVEALKIT_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          07 — DNS BUSINESS-DEVELOPMENT SUPPORT (dark)
          ============================================================ */}
      <section className="dns-on-ink dns-section-pad" id="dns-bd">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule dns-rule--light" />
              <span className="dns-eyebrow dns-eyebrow--light">{DNSBD_EYEBROW}</span>
            </div>
            <h2 className="dns-serif dns-section-head-light">
              {DNSBD_HEADING_LINE_1}
              <br />
              {DNSBD_HEADING_LINE_2}
            </h2>
            <p>{DNSBD_COPY}</p>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-bd-grid">
              {DNSBD_EXAMPLES.map((ex) => (
                <div key={ex.title} className="dns-bd-item">
                  <h3 className="dns-serif">{ex.title}</h3>
                  <p>{ex.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="dns-bd-important">{DNSBD_IMPORTANT}</p>
          </Reveal>

          <Reveal delay={3}>
            <p className="dns-eyebrow dns-eyebrow--light" style={{ marginBottom: 12 }}>
              {DNS_AT_A_GLANCE_LABEL}
            </p>
            <div className="dns-bd-facts">
              {DNS_FACTS.map((fact) => (
                <div key={fact.value} className="dns-bd-fact">
                  <span className="dns-bd-fact-value">{fact.value}</span>
                  <span className="dns-bd-fact-label">{fact.label}</span>
                </div>
              ))}
            </div>
            <p className="dns-bd-facts-note">{DNS_CREDIBILITY_NOTE}</p>
          </Reveal>

          <Reveal delay={4}>
            <div className="dns-bd-casestudy">
              <h3 className="dns-serif">{DNSBD_CASESTUDY_HEADING}</h3>
              <p>{DNSBD_CASESTUDY_COPY}</p>
              <p className="dns-bd-casestudy-note">{DNSBD_CASESTUDY_NOTE}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          08 — HOW THE WORK COULD RUN (flexible partnership models, light)
          ============================================================ */}
      <section className="dns-on-paper-deep dns-section-pad" id="partnership-models">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule" />
              <span className="dns-eyebrow">{MODELS_EYEBROW}</span>
            </div>
            <div className="dns-section-head">
              <h2 className="dns-serif">{MODELS_HEADING}</h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-models-grid">
              {PARTNERSHIP_MODELS.map((model) => (
                <div key={model.key} className="dns-model-card">
                  <h3 className="dns-serif">{model.title}</h3>
                  <p>{model.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="dns-models-note">{MODELS_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          09 — WAYS A PROPERTY COULD WORK WITH ARCHER (pricing / partner
          economics, dark)
          ============================================================ */}
      <section className="dns-on-ink dns-section-pad" id="scale">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule dns-rule--light" />
              <span className="dns-eyebrow dns-eyebrow--light">{ECON_EYEBROW}</span>
            </div>
            <h2 className="dns-serif dns-section-head-light">{ECON_HEADING}</h2>
            <p className="dns-calc-intro">{ECON_COPY}</p>
          </Reveal>

          <Reveal delay={1}>
            <div style={{ marginTop: 56 }}>
              <span className="dns-eyebrow dns-eyebrow--light">{JOURNEY_EYEBROW}</span>
              <h3 className="dns-serif dns-section-head-light" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", marginTop: 12 }}>
                {JOURNEY_HEADING}
              </h3>
              <p className="dns-calc-intro" style={{ marginTop: 14 }}>
                {JOURNEY_COPY}
              </p>
              <DnsClientJourney />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="dns-two-col-grid">
              <div className="dns-model-card">
                <span className="dns-model-card-badge">{PATH_PROJECT.badge}</span>
                <span className="dns-model-card-label">{PATH_PROJECT.label}</span>
                <h3 className="dns-serif">{PATH_PROJECT.title}</h3>
                <p>{PATH_PROJECT.copy}</p>
                <span className="dns-model-card-list-label">{PATH_PROJECT.bestForLabel}</span>
                <ul>
                  {PATH_PROJECT.bestFor.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <span className="dns-model-card-list-label">{PATH_PROJECT.deliverablesLabel}</span>
                <ul>
                  {PATH_PROJECT.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="dns-model-card dns-model-card--featured">
                <span className="dns-model-card-label">{PATH_SUBSCRIPTION.label}</span>
                <h3 className="dns-serif">{PATH_SUBSCRIPTION.headline}</h3>
                <p className="dns-model-card-sub">{PATH_SUBSCRIPTION.subhead}</p>
                <p>{PATH_SUBSCRIPTION.copy}</p>
                <span className="dns-model-card-list-label">{PATH_SUBSCRIPTION.examplesLabel}</span>
                <ul>
                  {PATH_SUBSCRIPTION.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <span className="dns-model-card-list-label">{PATH_SUBSCRIPTION.plansLabel}</span>
                <div className="dns-model-card-plans">
                  {ACTIVATION_TIERS.map((t) => (
                    <span key={t.key}>
                      {t.name} · {fmtMoney(t.retail)}/mo
                    </span>
                  ))}
                </div>
                <p className="dns-model-card-keyline">{PATH_SUBSCRIPTION.keyLine}</p>
              </div>
            </div>
            <p className="dns-paths-note">{PATHS_NOTE}</p>
          </Reveal>

          <Reveal delay={3}>
            <div className="dns-recurring">
              <span className="dns-eyebrow dns-eyebrow--light">{RECURRING_EYEBROW}</span>
              <h3 className="dns-recurring-heading dns-serif">{RECURRING_HEADING}</h3>
              <p className="dns-recurring-copy">{RECURRING_COPY}</p>
              <p className="dns-recurring-supporting">{RECURRING_SUPPORTING_LINE}</p>

              <span className="dns-recurring-tiers-label">{RECURRING_TIERS_LABEL}</span>
              <div className="dns-recurring-tiers">
                {RECURRING_SHARE_TIERS.map((tier) => (
                  <div key={tier.pct} className="dns-recurring-tier">
                    <span className="dns-recurring-tier-pct">{tier.pct}%</span>
                    <span className="dns-recurring-tier-name">{tier.name}</span>
                    <p className="dns-recurring-tier-copy">{tier.copy}</p>
                  </div>
                ))}
              </div>
              <p className="dns-recurring-share-note">{RECURRING_SHARE_NOTE}</p>
              <p className="dns-recurring-retention">{RECURRING_RETENTION_NOTE}</p>

              <div className="dns-bonus">
                <span className="dns-bonus-eyebrow">{BONUS_EYEBROW}</span>
                <span className="dns-bonus-value">{FIRST_MONTH_BONUS_PCT}%</span>
                <p className="dns-bonus-copy">{BONUS_COPY}</p>
                <div className="dns-bonus-tags">
                  <span>{BONUS_TAG_1}</span>
                  <span>{BONUS_TAG_2}</span>
                </div>
              </div>

              <div className="dns-bonus-flow">
                <div className="dns-bonus-flow-step">
                  <span className="dns-bonus-flow-stage">{BONUS_FLOW_STEP_0}</span>
                </div>
                <ArrowRight size={16} className="dns-bonus-flow-arrow dns-bonus-flow-arrow--down" aria-hidden="true" />
                <div className="dns-bonus-flow-step">
                  <span className="dns-bonus-flow-stage">{BONUS_FLOW_STEP_1_STAGE}</span>
                  <span className="dns-bonus-flow-value">{BONUS_FLOW_STEP_1_VALUE}</span>
                  <span className="dns-bonus-flow-desc">{BONUS_FLOW_STEP_1_DESC}</span>
                </div>
                <ArrowRight size={16} className="dns-bonus-flow-arrow dns-bonus-flow-arrow--down" aria-hidden="true" />
                <div className="dns-bonus-flow-step">
                  <span className="dns-bonus-flow-stage">{BONUS_FLOW_STEP_2_STAGE}</span>
                  <span className="dns-bonus-flow-value">{BONUS_FLOW_STEP_2_VALUE}</span>
                  <span className="dns-bonus-flow-desc">{BONUS_FLOW_STEP_2_DESC}</span>
                </div>
                <ArrowRight size={16} className="dns-bonus-flow-arrow dns-bonus-flow-arrow--down" aria-hidden="true" />
                <p className="dns-bonus-flow-final">{BONUS_FLOW_FINAL}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="dns-example">
              <span className="dns-example-eyebrow">{EXAMPLE_EYEBROW}</span>
              <p className="dns-example-plan-line">
                {EXAMPLE_PROPERTY_LABEL} — {exampleTier.name} · {fmtMoney(exampleTier.retail)}/mo
              </p>
              <div className="dns-example-tiers">
                {exampleTierRows.map((tier) => (
                  <div key={tier.pct} className="dns-example-tier">
                    <span className="dns-example-tier-pct">
                      {tier.pct}% · {tier.name}
                    </span>
                    <div className="dns-example-tier-row">
                      <span className="dns-example-tier-value">{fmtDnsMoneySmart(exampleMonth1Bonus)}</span>
                      <span className="dns-example-tier-label">{EXAMPLE_MONTH1_LABEL}</span>
                    </div>
                    <div className="dns-example-tier-row">
                      <span className="dns-example-tier-value">{fmtDnsMoneySmart(tier.month2Plus)}/mo</span>
                      <span className="dns-example-tier-label">{EXAMPLE_MONTH2_LABEL}</span>
                    </div>
                    <div className="dns-example-tier-row dns-example-tier-row--total">
                      <span className="dns-example-tier-value">{fmtDnsMoneyExact(tier.yearOne)}</span>
                      <span className="dns-example-tier-label">{EXAMPLE_YEAR1_LABEL}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="dns-example-note">{EXAMPLE_NOTE}</p>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div style={{ marginTop: 56 }}>
              <h3 className="dns-serif dns-section-head-light" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)" }}>
                {CALC_WIDGET_HEADING}
              </h3>
              <p className="dns-calc-intro" style={{ marginTop: 12 }}>
                {CALC_WIDGET_COPY}
              </p>
              <DnsReferralCalculator />
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="dns-two-col-grid" style={{ marginTop: 56 }}>
              <div>
                <h3 className="dns-why-heading dns-serif">{WHY_DNS_HEADING}</h3>
                <p className="dns-why-copy">{WHY_DNS_COPY}</p>
              </div>
              <div>
                <h3 className="dns-why-heading dns-serif">{WHY_HOTEL_HEADING}</h3>
                <p className="dns-why-intro">{WHY_HOTEL_INTRO}</p>
                <ul className="dns-why-list">
                  {WHY_HOTEL_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="dns-legal">
              <span className="dns-legal-eyebrow">{LEGAL_EYEBROW}</span>
              <p className="dns-legal-copy">{LEGAL_COPY}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          09.5 — ADDITIONAL CREATIVE RANGE (broader motion, dark)
          ============================================================ */}
      <DnsBroaderMotionShowcase />

      {/* ============================================================
          11 — LIFECYCLE (dark)
          ============================================================ */}
      <section className="dns-on-ink dns-section-pad" id="how-it-works">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule dns-rule--light" />
              <span className="dns-eyebrow dns-eyebrow--light">{LIFECYCLE_EYEBROW}</span>
            </div>
            <h2 className="dns-serif dns-section-head-light">
              {LIFECYCLE_HEADING_LINE_1}
              <br />
              {LIFECYCLE_HEADING_LINE_2}
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-lifecycle-legend">
              <span className="dns-lifecycle-legend-item dns-lifecycle-legend-item--dns">{LIFECYCLE_DNS_LABEL}</span>
              <span className="dns-lifecycle-legend-item dns-lifecycle-legend-item--archer">{LIFECYCLE_ARCHER_LABEL}</span>
            </div>
            <DnsLifecycle />
            <p className="dns-lifecycle-note">{LIFECYCLE_OVERLAP_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          12 — ARCHER PROOF (light)
          ============================================================ */}
      <section className="dns-on-paper dns-section-pad" id="work">
        <div className="dns-shell">
          <Reveal>
            <div className="dns-label-row">
              <span className="dns-rule" />
              <span className="dns-eyebrow">{PROOF_EYEBROW}</span>
            </div>
            <div className="dns-section-head">
              <h2 className="dns-serif">
                {PROOF_HEADING_LINE_1}
                <br />
                {PROOF_HEADING_LINE_2}
              </h2>
              <p>{PROOF_SUPPORTING_COPY}</p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="dns-metrics">
              <div className="dns-metric">
                <span className="dns-serif dns-metric-value">{PROOF.impressions}</span>
                <span className="dns-metric-label">Tracked impressions</span>
              </div>
              <div className="dns-metric">
                <span className="dns-serif dns-metric-value">{PROOF.reach}</span>
                <span className="dns-metric-label">Reach</span>
              </div>
              <div className="dns-metric">
                <span className="dns-serif dns-metric-value">{PROOF.engagements}</span>
                <span className="dns-metric-label">Engagements</span>
              </div>
              <div className="dns-metric">
                <span className="dns-serif dns-metric-value">{PROOF.post_clicks}</span>
                <span className="dns-metric-label">Reported post clicks</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="dns-indigo-card">
              <blockquote className="dns-serif dns-indigo-quote">&ldquo;{HOTEL_INDIGO_QUOTE}&rdquo;</blockquote>
              <p className="dns-indigo-support">{HOTEL_INDIGO_SUPPORTING_COPY}</p>
              <p className="dns-indigo-name">Hotel Indigo Pittsburgh, University-Oakland</p>
              <p className="dns-indigo-qualification">{HOTEL_INDIGO_QUALIFICATION}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          13 — FINAL CTA (dark)
          ============================================================ */}
      <section className="dns-on-ink dns-section-pad" id="discuss">
        <div className="dns-shell dns-final-inner">
          <Reveal>
            <span className="dns-eyebrow dns-eyebrow--light">{FINAL_EYEBROW}</span>
            <h2 className="dns-serif dns-final-heading">{FINAL_HEADING}</h2>
            <p className="dns-final-copy">{FINAL_COPY}</p>
          </Reveal>
          <Reveal delay={1}>
            <div className="dns-final-actions">
              <a href={CONTACT_MAILTO} className="dns-btn dns-btn-primary">
                {FINAL_CTA_PRIMARY}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a href="/social-media-work" className="dns-btn dns-btn-ghost--on-dark">
                {FINAL_CTA_SECONDARY}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="dns-on-ink dns-footer">
        <div className="dns-shell dns-footer-inner">
          <span className="dns-footer-lockup dns-serif">{FOOTER_LOCKUP}</span>
          <p className="dns-footer-note">{FOOTER_DISCLOSURE_LINE}</p>
        </div>
      </footer>
    </div>
  );
}
