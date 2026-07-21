import { DIFFERENTIATOR } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * "Hospitality motion is a specialty — not another template." Explains why
 * short-form hospitality motion needs several specialist disciplines, and
 * shows the elegant asset → creative direction → production → review →
 * final-creative process diagram.
 */
export function MotionDifferentiator() {
  return (
    <section className="ct-on-dark ct-ambient-section ct-section-pad" id="differentiator">
      <div className="ct-media-frame">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src={encodeURI(DIFFERENTIATOR.ambientVideoSrc)} type="video/mp4" />
        </video>
        <span className="ct-scene-tag">{DIFFERENTIATOR.ambientSceneTag}</span>
      </div>
      <div className="ct-ambient-overlay" />
      <div className="ct-shell">
        <Reveal className="ct-differentiator-head">
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{DIFFERENTIATOR.eyebrow}</span></div>
          <h2 className="ct-serif">{DIFFERENTIATOR.headline}</h2>
          <p>{DIFFERENTIATOR.body}</p>
        </Reveal>

        <Reveal delay={1} className="ct-pill-row">
          {DIFFERENTIATOR.capabilities.map((c) => (
            <span className="ct-pill" key={c}>{c}</span>
          ))}
        </Reveal>

        <Reveal delay={2}>
          <div className="ct-process-flow">
            {DIFFERENTIATOR.process.map((step) => (
              <div className="ct-process-step" key={step.index}>
                <span className="ct-idx">{step.index}</span>
                <h3 className="ct-serif">{step.label}</h3>
                <p>{step.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
