import { PROOF } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * Archer Design's current tracked performance figures, presented alongside
 * relevant hospitality client examples and clear attribution/disclaimer
 * language (no claimed direct bookings, no implied CoralTree endorsement).
 */
export function ProofSection() {
  return (
    <section className="ct-on-dark ct-section-pad" id="proof">
      <div className="ct-shell">
        <div className="ct-proof-grid">
          <Reveal>
            <h2 className="ct-serif">{PROOF.headline}</h2>
            <div className="ct-proof-metrics">
              {PROOF.metrics.map((m) => (
                <div className="ct-proof-metric" key={m.label}>
                  <span className="ct-num ct-serif">{m.value}</span>
                  <span className="ct-lbl">{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="ct-client-card">
              <h3>Relevant hospitality experience</h3>
              <ul className="ct-client-list">
                {PROOF.clients.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="ct-proof-disclaimer">{PROOF.disclaimer}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
