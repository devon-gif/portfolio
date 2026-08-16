import { PLAN_COMPARISON } from "../tcrm-pricing";
import { Reveal } from "./Reveal";

/**
 * "Which option fits?" -- a single horizontal scale across all five
 * purchase paths, rather than another dense pricing table. Names and
 * blurbs are sourced from PLAN_COMPARISON in tcrm-pricing.ts.
 */
export function CreativePlanComparison() {
  return (
    <section id="compare" className="tl-section">
      <div className="tl-shell relative">
        <Reveal className="max-w-2xl">
          <p className="tl-eyebrow">Which option fits?</p>
          <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">Five ways to start, one page.</h2>
        </Reveal>

        <Reveal delay={2} className="tl-fit-scale mt-9">
          {PLAN_COMPARISON.map((opt) => (
            <div key={opt.key} className={`tl-fit-item${opt.recommended ? " tl-fit-item--recommended" : ""}`}>
              {opt.recommended ? <span className="tl-pkg-badge tl-pkg-badge--inline">Recommended</span> : null}
              <p className="tl-fit-item-name">{opt.name}</p>
              <p className="tl-fit-item-blurb">{opt.blurb}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
