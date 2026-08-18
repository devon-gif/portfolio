import { COST_CAPACITY } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * The qualitative capacity/cost case — no salary figures, no guaranteed
 * savings claims. Just a plain-language comparison of a fragmented
 * freelancer/agency model against one consolidated creative partner.
 */
export function CostCapacity() {
  return (
    <section className="ct-on-ivory ct-section-pad" id="capacity">
      <div className="ct-shell">
        <Reveal className="ct-cost-head">
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{COST_CAPACITY.eyebrow}</span></div>
          <h2 className="ct-serif">{COST_CAPACITY.headline}</h2>
          <p>{COST_CAPACITY.body}</p>
        </Reveal>

        <Reveal delay={1}>
          <div className="ct-cost-compare">
            <div className="ct-cost-col ct-cost-fragmented">
              <h3 className="ct-serif">{COST_CAPACITY.fragmented.heading}</h3>
              <ul>
                {COST_CAPACITY.fragmented.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="ct-cost-col ct-cost-consolidated">
              <h3 className="ct-serif">{COST_CAPACITY.consolidated.heading}</h3>
              <ul>
                {COST_CAPACITY.consolidated.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
