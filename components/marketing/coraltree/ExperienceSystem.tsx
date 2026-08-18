import { EXPERIENCE_SYSTEM } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * Experience-specific creative system: one card per CoralTree experience
 * type (hotels/resorts, restaurants/bars, meetings/weddings, spa/wellness,
 * golf/outdoor, residences/lifestyle), plus the repeatable output set each
 * property photograph can become. Deliberately bounded — not "unlimited work."
 */
export function ExperienceSystem() {
  return (
    <section className="ct-on-ivory ct-canopy-bg ct-section-pad" id="experience-system">
      <div className="ct-shell">
        <Reveal className="ct-experience-head">
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{EXPERIENCE_SYSTEM.eyebrow}</span></div>
          <h2 className="ct-serif">{EXPERIENCE_SYSTEM.headline}</h2>
          <p>{EXPERIENCE_SYSTEM.body}</p>
        </Reveal>

        <Reveal delay={1}>
          <div className="ct-category-grid">
            {EXPERIENCE_SYSTEM.categories.map((c) => (
              <div className="ct-category-card" key={c.title}>
                <h3 className="ct-serif">{c.title}</h3>
                <p>{c.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={2} className="ct-outputs-row">
          <span className="ct-outputs-label">One photograph becomes:</span>
          {EXPERIENCE_SYSTEM.outputs.map((o) => (
            <span className="ct-output-chip" key={o}>{o}</span>
          ))}
        </Reveal>

        <Reveal delay={3} className="ct-video-strip">
          <div className="ct-media-frame">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
              <source src={encodeURI(EXPERIENCE_SYSTEM.videoSrc)} type="video/mp4" />
            </video>
            <span className="ct-scene-tag">{EXPERIENCE_SYSTEM.sceneTag}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
