import { Reveal } from "./components/Reveal";
import {
  BEYOND_EYEBROW,
  BEYOND_HEADLINE_LINE_1,
  BEYOND_HEADLINE_LINE_2,
  BEYOND_COPY,
  BEYOND_STRATEGY_LINE,
  BEYOND_ITEMS,
} from "./infuse-beyond-production-content";

/**
 * "Beyond Creative Production" — broadens the pitch from graphic design +
 * motion into day-to-day marketing execution (social, campaigns, email,
 * landing pages, sales enablement, reporting), without reading as a
 * full-service agency or a strategy replacement. Six editorial rows with a
 * thin hairline rhythm — deliberately not a SaaS icon grid. Sales
 * Enablement (05) gets a coral-accented treatment as the standout item.
 */
export function InfuseBeyondProduction() {
  return (
    <section className="infuse-beyond-section">
      <div className="infuse-shell">
        <Reveal className="infuse-beyond-heading">
          <span className="infuse-eyebrow">{BEYOND_EYEBROW}</span>
          <h2 className="infuse-serif">
            {BEYOND_HEADLINE_LINE_1}
            <br />
            {BEYOND_HEADLINE_LINE_2}
          </h2>
          <p>{BEYOND_COPY}</p>
          <p className="infuse-beyond-strategy-line infuse-serif">{BEYOND_STRATEGY_LINE}</p>
        </Reveal>

        <div className="infuse-beyond-rows">
          {BEYOND_ITEMS.map((item, i) => (
            <Reveal
              key={item.number}
              delay={((i % 3) + 2) as 2 | 3 | 4}
              className={`infuse-beyond-row${item.emphasis ? " infuse-beyond-row-featured" : ""}`}
            >
              <div className="infuse-beyond-row-head">
                <span className="infuse-beyond-number">{item.number}</span>
                <h3 className="infuse-serif">{item.title}</h3>
              </div>
              <div className="infuse-beyond-row-body">
                <p>{item.copy}</p>
                <ul className="infuse-beyond-examples">
                  {item.examples.map((example) => (
                    <li key={example}>{example}</li>
                  ))}
                </ul>
                {item.emphasis && <p className="infuse-beyond-emphasis infuse-serif">{item.emphasis}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
