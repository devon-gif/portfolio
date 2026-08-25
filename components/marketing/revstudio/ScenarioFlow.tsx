import { CalendarClock, BarChart3, Palette, Sparkles } from "lucide-react";

export type ScenarioItem = {
  t: string;
  setup: string;
  revstudio: string;
  archer: string;
  outcome: string;
};

/**
 * "What a coordinated priority looks like." — four scenarios as a
 * zero-JS, radio-driven pill switcher (same native-control approach as
 * PartnershipFAQ's <details>/<summary> accordion: fully keyboard- and
 * screen-reader-operable without a client component). Selecting a pill
 * reveals a short four-step flow (Opportunity -> Revstudio -> Archer
 * Design -> Outcome) with a soft cross-fade; see .rv-scenario-* in
 * app/globals.css. Manual selection only (no JS auto-rotate), but the
 * cross-fade + connector draw-in keeps switching feeling alive.
 */
export function ScenarioFlow({ items }: { items: ScenarioItem[] }) {
  return (
    <div className="rv-scenario">
      {items.map((_, i) => (
        <input key={i} type="radio" name="rv-scenario" id={`rv-scenario-${i}`} className="rv-scenario-radio" defaultChecked={i === 0} />
      ))}

      <fieldset className="rv-scenario-pills">
        <legend className="sr-only">Choose a scenario</legend>
        {items.map((item, i) => (
          <label key={item.t} htmlFor={`rv-scenario-${i}`} className="rv-scenario-pill">
            <span className="rv-scenario-pill-index" aria-hidden="true">
              0{i + 1}
            </span>
            {item.t}
          </label>
        ))}
      </fieldset>

      <div className="rv-scenario-panels">
        {items.map((item, i) => (
          <div key={item.t} className="rv-scenario-panel" data-panel-index={i}>
            <div className="rv-scenario-flow">
              <div className="rv-scenario-step rv-scenario-step--opportunity">
                <span className="rv-scenario-step-icon" aria-hidden="true">
                  <CalendarClock strokeWidth={1.6} />
                </span>
                <p className="rv-scenario-step-chip">Opportunity</p>
                <p className="rv-scenario-step-text">{item.setup}</p>
              </div>
              <span className="rv-scenario-arrow" aria-hidden="true" />
              <div className="rv-scenario-step rv-scenario-step--revstudio">
                <span className="rv-scenario-step-icon" aria-hidden="true">
                  <BarChart3 strokeWidth={1.6} />
                </span>
                <p className="rv-scenario-step-chip">Revstudio</p>
                <p className="rv-scenario-step-text">{item.revstudio}</p>
              </div>
              <span className="rv-scenario-arrow" aria-hidden="true" />
              <div className="rv-scenario-step rv-scenario-step--archer">
                <span className="rv-scenario-step-icon" aria-hidden="true">
                  <Palette strokeWidth={1.6} />
                </span>
                <p className="rv-scenario-step-chip">Archer Design</p>
                <p className="rv-scenario-step-text">{item.archer}</p>
              </div>
              <span className="rv-scenario-arrow" aria-hidden="true" />
              <div className="rv-scenario-step rv-scenario-step--outcome">
                <span className="rv-scenario-step-icon" aria-hidden="true">
                  <Sparkles strokeWidth={1.6} />
                </span>
                <p className="rv-scenario-step-chip">Outcome</p>
                <p className="rv-scenario-step-text">{item.outcome}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
