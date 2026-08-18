import { ENTRY_POINT, FINAL_CTA, PERSONALIZED_NOTE, REFERENCE_IMAGES } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * The page's closing run: recommended entry point (5-property cluster),
 * the personalized note for Genevieve, the final CTA, and the footer.
 * Grouped in one file since each section is short and they read as a
 * single closing sequence — see lib/coraltree-content.ts for the copy.
 */
export function EntryPointSection() {
  return (
    <section className="ct-on-ivory ct-section-pad" id="entry-point">
      <div className="ct-shell">
        <Reveal className="ct-entry-head">
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{ENTRY_POINT.eyebrow}</span></div>
          <h2 className="ct-serif">{ENTRY_POINT.headline}</h2>
          <p>{ENTRY_POINT.body}</p>
        </Reveal>

        <Reveal delay={1}>
          <div className="ct-entry-grid">
            <div className="ct-cluster-card">
              <h3>{ENTRY_POINT.cluster.heading}</h3>
              <ul>
                {ENTRY_POINT.cluster.mix.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="ct-deliverables">
              <h3>What's included</h3>
              <ul>
                {ENTRY_POINT.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="ct-pricing-note">{ENTRY_POINT.pricingNote}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PersonalizedNoteSection() {
  return (
    <section className="ct-on-cream ct-section-pad" style={{ paddingTop: "0" }} id="for-genevieve">
      <div className="ct-shell">
        <Reveal>
          <div className="ct-note-card">
            <span className="ct-eyebrow">Prepared privately</span>
            <h2 className="ct-serif">{PERSONALIZED_NOTE.heading}</h2>
            <p className="ct-note-role">{PERSONALIZED_NOTE.role}</p>
            <p className="ct-note-org">{PERSONALIZED_NOTE.org}</p>
            <p className="ct-note-body">{PERSONALIZED_NOTE.body}</p>

            <div className="ct-note-reference-row">
              <div className="ct-note-reference">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={REFERENCE_IMAGES.magnoliaDenver.src} alt={REFERENCE_IMAGES.magnoliaDenver.alt} loading="lazy" />
                <span>{REFERENCE_IMAGES.magnoliaDenver.caption}</span>
              </div>
              <div className="ct-note-reference">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={REFERENCE_IMAGES.magnoliaStLouis.src} alt={REFERENCE_IMAGES.magnoliaStLouis.alt} loading="lazy" />
                <span>{REFERENCE_IMAGES.magnoliaStLouis.caption}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="ct-final-cta" id="contact">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="ct-final-cta-bg" autoPlay muted loop playsInline preload="none" aria-hidden="true">
        <source src={encodeURI(FINAL_CTA.videoSrc)} type="video/mp4" />
      </video>
      <div className="ct-final-cta-inner">
        <div className="ct-shell" style={{ width: "100%" }}>
          <Reveal>
            <span className="ct-eyebrow" style={{ display: "block", marginBottom: "20px" }}>Devon Archer, Archer Design</span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="ct-serif">{FINAL_CTA.headline}</h2>
          </Reveal>
          <Reveal delay={2}>
            <p>{FINAL_CTA.body}</p>
          </Reveal>
          <Reveal delay={3} className="ct-final-cta-actions">
            <a href={FINAL_CTA.primaryHref} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn-primary">{FINAL_CTA.primaryLabel}</a>
            <a href={FINAL_CTA.secondaryHref} target="_blank" rel="noopener noreferrer" className="ct-text-link">
              {FINAL_CTA.secondaryLabel}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function CoralTreeFooter() {
  return (
    <footer className="ct-footer">
      <div className="ct-shell ct-footer-inner">
        <div className="ct-footer-mark">
          <span>Archer Design × CoralTree Hospitality</span>
        </div>
        <div className="ct-footer-note">Prepared privately for CoralTree Hospitality — not for distribution.</div>
      </div>
    </footer>
  );
}
