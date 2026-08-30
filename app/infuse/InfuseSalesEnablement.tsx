import { Reveal } from "./components/Reveal";
import {
  SALES_EYEBROW,
  SALES_STATEMENT,
  SALES_COPY,
  SALES_HIGHLIGHT_LINE_1,
  SALES_HIGHLIGHT_LINE_2,
} from "./infuse-sales-enablement-content";

/**
 * "New business" editorial moment — deep charcoal/coral ground, sized to
 * feel like an important insight (large serif statement, supporting copy,
 * then a bold two-line highlighted close), without a card grid. Sits after
 * the content-repurposing/AI section and before First 30 Days / Pricing.
 */
export function InfuseSalesEnablement() {
  return (
    <section className="infuse-sales-section">
      <div className="infuse-shell">
        <Reveal className="infuse-sales-inner">
          <span className="infuse-eyebrow">{SALES_EYEBROW}</span>
          <p className="infuse-serif infuse-sales-statement">{SALES_STATEMENT}</p>
          <p className="infuse-sales-copy">{SALES_COPY}</p>
          <p className="infuse-sales-highlight infuse-serif">
            {SALES_HIGHLIGHT_LINE_1}
            <br />
            {SALES_HIGHLIGHT_LINE_2}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
