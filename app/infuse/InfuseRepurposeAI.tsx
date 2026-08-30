import { Fragment } from "react";
import { Reveal } from "./components/Reveal";
import {
  REPURPOSE_EYEBROW,
  REPURPOSE_HEADLINE,
  REPURPOSE_COPY,
  REPURPOSE_STEPS,
  AI_EYEBROW,
  AI_COPY,
  AI_SECOND_LINE,
} from "./infuse-repurpose-ai-content";

/**
 * Compact section combining two small, related ideas: one source asset
 * becoming many pieces of content (a simple step progression, kept
 * minimal), and how AI fits into that workflow — positioned as a
 * production advantage, not the product itself, in a visually subordinate
 * aside rather than a competing headline.
 */
export function InfuseRepurposeAI() {
  return (
    <section className="infuse-repurpose-section">
      <div className="infuse-shell">
        <Reveal className="infuse-repurpose-heading">
          <span className="infuse-eyebrow">{REPURPOSE_EYEBROW}</span>
          <h2 className="infuse-serif">{REPURPOSE_HEADLINE}</h2>
          <p>{REPURPOSE_COPY}</p>
        </Reveal>

        <Reveal delay={2} className="infuse-repurpose-steps">
          {REPURPOSE_STEPS.map((step, i) => (
            <Fragment key={step}>
              {i > 0 && (
                <span className="infuse-repurpose-arrow" aria-hidden="true">
                  &rarr;
                </span>
              )}
              <span className="infuse-repurpose-step">{step}</span>
            </Fragment>
          ))}
        </Reveal>

        <Reveal delay={3} className="infuse-ai-aside">
          <span className="infuse-eyebrow">{AI_EYEBROW}</span>
          <p>{AI_COPY}</p>
          <p className="infuse-ai-aside-line">{AI_SECOND_LINE}</p>
        </Reveal>
      </div>
    </section>
  );
}
