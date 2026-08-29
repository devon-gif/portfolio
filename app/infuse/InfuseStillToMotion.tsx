import { Reveal } from "./components/Reveal";
import { STILL_LABEL, STILL_HEADLINE, STILL_COPY, STILL_CLOSING_LINE } from "./infuse-still-to-motion-content";

/**
 * Short, compact positioning section placed directly after the Motion Work
 * gallery and before the standalone value quote. Text-only by design — no
 * video, no before/after comparison, no floating capability labels — the
 * gallery above already did the selling; this just briefly explains how
 * that motion work gets made.
 */
export function InfuseStillToMotion() {
  return (
    <section className="infuse-still-to-motion">
      <div className="infuse-shell">
        <Reveal className="infuse-still-copy">
          <span className="infuse-eyebrow">{STILL_LABEL}</span>
          <h2 className="infuse-serif">{STILL_HEADLINE}</h2>
          <p>{STILL_COPY}</p>
          <p className="infuse-still-closing-line">{STILL_CLOSING_LINE}</p>
        </Reveal>
      </div>
    </section>
  );
}
