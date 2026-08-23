import { ArrowDown } from "lucide-react";
import { JOURNEY_STAGES, JOURNEY_FINAL_LABEL, JOURNEY_FINAL_COPY } from "../dns-content";

/**
 * Vertical client-journey diagram: DNS's build stages handing off at "the
 * space opens" into Archer's launch activation, then into an ongoing
 * monthly subscription, ending on the recurring-partner-value idea this
 * whole section exists to introduce. Deliberately simple/linear ("extremely
 * easy to understand visually") rather than the branching layouts used
 * elsewhere on the page.
 */
export function DnsClientJourney() {
  return (
    <div className="dns-journey">
      {JOURNEY_STAGES.map((stage, i) => (
        <div key={stage.key}>
          {i > 0 && (
            <div className="dns-journey-arrow" aria-hidden="true">
              <ArrowDown size={16} strokeWidth={1.75} />
            </div>
          )}
          <div className="dns-journey-stage">
            <span className="dns-journey-stage-label">{stage.label}</span>
            {stage.items.length > 0 && (
              <div className="dns-journey-items">
                {stage.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="dns-journey-arrow" aria-hidden="true">
        <ArrowDown size={16} strokeWidth={1.75} />
      </div>
      <div className="dns-journey-stage">
        <span className="dns-journey-stage-label">{JOURNEY_FINAL_LABEL}</span>
        <p className="dns-journey-final">{JOURNEY_FINAL_COPY}</p>
      </div>
    </div>
  );
}
