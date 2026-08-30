import Image from "next/image";
import { Reveal } from "./components/Reveal";
import { PRICING_PULL_QUOTE, PRICING_PULL_QUOTE_NOTE } from "./infuse-pricing-content";

// The exact phrase highlighted in coral within the quote below. Kept as a
// substring match against PRICING_PULL_QUOTE (the single source of truth,
// also used verbatim in InfusePricing.tsx) rather than a duplicated string,
// so the wording can never drift between the two placements.
const HIGHLIGHT_PHRASE = "scale up or down";
const [quoteBefore, quoteAfter] = PRICING_PULL_QUOTE.split(HIGHLIGHT_PHRASE);

/**
 * Standalone value-quote section — one of the strongest typography moments
 * on the page. Sits by itself directly between the short "still image"
 * positioning section and the Graphic + Campaign Work gallery, answering
 * "why is this cost-effective" before moving into the static design work.
 * PRICING_PULL_QUOTE, verbatim, paired editorial-style with Devon's actual
 * portfolio portrait — not a testimonial card, no quote-mark icon, no
 * boxed avatar; just quote text and portrait side by side.
 */
export function InfuseValueQuote() {
  return (
    <section className="infuse-value-quote">
      <div className="infuse-shell">
        <Reveal className="infuse-vq-grid">
          <div className="infuse-vq-copy">
            <span className="infuse-vq-rule" aria-hidden="true" />
            <p className="infuse-serif infuse-vq-text">
              {quoteBefore}
              <span className="infuse-vq-accent">{HIGHLIGHT_PHRASE}</span>
              {quoteAfter}
            </p>
            <p className="infuse-vq-note">{PRICING_PULL_QUOTE_NOTE}</p>
          </div>

          <div className="infuse-vq-portrait">
            <div className="infuse-vq-portrait-frame">
              <Image
                src="/infuse/brand/devon-archer-portrait.png"
                alt="Devon Archer, founder of Archer Design"
                fill
                sizes="(max-width: 900px) 240px, 280px"
                className="infuse-vq-portrait-img"
              />
            </div>
            <div className="infuse-vq-portrait-caption">
              <strong className="infuse-serif">Devon Archer</strong>
              <span>Archer Design</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
