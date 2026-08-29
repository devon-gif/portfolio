import { Reveal } from "./components/Reveal";
import { CALENDLY_URL } from "./infuse-content";
import {
  PRICING_EYEBROW,
  PRICING_HEADLINE_LINE_1,
  PRICING_HEADLINE_LINE_2,
  PRICING_SUBCOPY,
  PRICING_PULL_QUOTE,
  PILOT_EYEBROW,
  PILOT_HEADLINE,
  PILOT_PRICE,
  PILOT_PRICE_NOTE,
  PILOT_COPY,
  PILOT_INCLUDES,
  PILOT_FOOTNOTE,
  PILOT_CTA,
  TIERS,
  CUSTOM_EYEBROW,
  CUSTOM_NAME,
  CUSTOM_PRICE,
  CUSTOM_PRICE_RANGE,
  CUSTOM_POSITIONING,
  CUSTOM_PHRASE,
  CUSTOM_EXPLANATION,
  CUSTOM_INCLUDES,
  CUSTOM_SCOPE_NOTE,
  CUSTOM_QUEUE_NOTE,
  CUSTOM_CTA,
  HOURLY_LABEL,
  HOURLY_RATE,
  HOURLY_NOTE,
  SCOPE_REVISIONS_NOTE,
  SCOPE_TURNAROUND_NOTE,
  PRICING_CLOSING_EYEBROW,
  PRICING_CLOSING_COPY,
  PRICING_CLOSING_CTA_PRIMARY,
  PRICING_CLOSING_CTA_SECONDARY,
} from "./infuse-pricing-content";

/**
 * Pricing / engagement section for /infuse. A separate component (rather
 * than folded into InfuseShowcase.tsx) because it's a large, self-contained
 * block with its own data shape — same reasoning as this project's other
 * private pages splitting large sections into their own components (e.g.
 * app/dns/components/DnsReferralCalculator.tsx).
 *
 * Deliberately NOT four identical SaaS cards in a row: the 30-day pilot
 * stands alone as the low-risk entry point, the four standard tiers sit in
 * a 2x2 grid with the "Recommended" tier visually larger, and the
 * high-volume option is a wide block below — not a fifth matching card.
 */
export function InfusePricing() {
  return (
    <section className="infuse-pricing" id="pricing">
      <div className="infuse-shell">
        <Reveal>
          <span className="infuse-eyebrow">{PRICING_EYEBROW}</span>
          <div className="infuse-heading">
            <h2 className="infuse-serif">
              {PRICING_HEADLINE_LINE_1}
              <br />
              {PRICING_HEADLINE_LINE_2}
            </h2>
            <p>{PRICING_SUBCOPY}</p>
          </div>
        </Reveal>

        <Reveal delay={2}>
          <blockquote className="infuse-pull-quote infuse-serif">
            &ldquo;{PRICING_PULL_QUOTE}&rdquo;
          </blockquote>
        </Reveal>

        {/* ── 30-day pilot ──────────────────────────────────────────── */}
        <Reveal id="pilot" delay={2}>
          <div className="infuse-pilot-card">
            <div className="infuse-pilot-copy">
              <span className="infuse-eyebrow">{PILOT_EYEBROW}</span>
              <h3 className="infuse-serif">{PILOT_HEADLINE}</h3>
              <p>{PILOT_COPY}</p>
              <p className="infuse-pilot-footnote">{PILOT_FOOTNOTE}</p>
              <a className="infuse-btn infuse-btn-outline" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {PILOT_CTA}
              </a>
            </div>
            <div className="infuse-pilot-details">
              <div className="infuse-pilot-price">
                <strong>{PILOT_PRICE}</strong>
                <span>{PILOT_PRICE_NOTE}</span>
              </div>
              <ul className="infuse-tier-includes">
                {PILOT_INCLUDES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ── Four standard tiers, 2x2 ──────────────────────────────── */}
        <div className="infuse-tiers-grid">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.number} delay={((i % 2) + 2) as 2 | 3} className="infuse-reveal-tier">
              <article className={`infuse-tier-card${tier.badge ? " infuse-tier-featured" : ""}`}>
                {tier.badge && <span className="infuse-tier-badge">{tier.badge}</span>}
                <span className="infuse-tier-number">{tier.number}</span>
                <h3 className="infuse-serif">{tier.name}</h3>
                <div className="infuse-tier-price">
                  <strong>{tier.price}</strong>
                  <span>{tier.cadence}</span>
                </div>
                <p className="infuse-tier-positioning">{tier.positioning}</p>
                <ul className="infuse-tier-includes">
                  {tier.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {tier.note && <p className="infuse-tier-note">{tier.note}</p>}
                <p className="infuse-tier-caption">{tier.caption}</p>
                <a className="infuse-tier-cta" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                  {tier.ctaLabel} <span aria-hidden="true">&rarr;</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ── High-volume custom block ──────────────────────────────── */}
        <Reveal delay={2}>
          <div className="infuse-custom-block">
            <div className="infuse-custom-intro">
              <span className="infuse-eyebrow">{CUSTOM_EYEBROW}</span>
              <h3 className="infuse-serif">{CUSTOM_NAME}</h3>
              <div className="infuse-tier-price">
                <strong>{CUSTOM_PRICE}</strong>
              </div>
              <p className="infuse-custom-range">{CUSTOM_PRICE_RANGE}</p>
              <p className="infuse-tier-positioning">{CUSTOM_POSITIONING}</p>
              <p className="infuse-custom-phrase infuse-serif">{CUSTOM_PHRASE}</p>
              <p className="infuse-custom-explanation">{CUSTOM_EXPLANATION}</p>
              <a className="infuse-btn infuse-btn-solid" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {CUSTOM_CTA}
              </a>
            </div>
            <div className="infuse-custom-includes-col">
              <ul className="infuse-tier-includes infuse-custom-includes">
                {CUSTOM_INCLUDES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="infuse-custom-note">{CUSTOM_SCOPE_NOTE}</p>
              <p className="infuse-custom-note">{CUSTOM_QUEUE_NOTE}</p>
            </div>
          </div>
        </Reveal>

        {/* ── Hourly / scope footnotes ──────────────────────────────── */}
        <Reveal>
          <div className="infuse-hourly-note">
            <p>
              <strong>{HOURLY_LABEL}</strong> {HOURLY_RATE}
            </p>
            <p>{HOURLY_NOTE}</p>
          </div>
          <p className="infuse-scope-footnotes">
            {SCOPE_REVISIONS_NOTE} {SCOPE_TURNAROUND_NOTE}
          </p>
        </Reveal>

        {/* ── Pricing-specific closing CTA ──────────────────────────── */}
        <Reveal delay={2}>
          <div className="infuse-pricing-closing">
            <span className="infuse-eyebrow">{PRICING_CLOSING_EYEBROW}</span>
            <p>{PRICING_CLOSING_COPY}</p>
            <div className="infuse-hero-actions">
              <a className="infuse-btn infuse-btn-solid" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {PRICING_CLOSING_CTA_PRIMARY}
              </a>
              <a className="infuse-btn infuse-btn-outline" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {PRICING_CLOSING_CTA_SECONDARY}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
