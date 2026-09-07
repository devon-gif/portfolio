import { CINEMATIC_BEAT, HERO, SCALE_STRIP } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * Full-bleed cinematic hero, matching the visual weight of Dovetail's hero
 * (public/dovetail/index.html) but in the CoralTree forest/gold palette.
 * Reuses an existing Archer Design reel (Valencia resort footage) as the
 * hero visual — evocative of independent lifestyle/resort hospitality,
 * not presented as a CoralTree property (see ct-scene-tag caption).
 */
export function Hero() {
  return (
    <section className="ct-hero" id="top">
      <div className="ct-media-frame">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src={encodeURI(HERO.videoSrc)} type="video/mp4" />
        </video>
        <span className="ct-scene-tag">{HERO.sceneTag}</span>
      </div>
      <div className="ct-hero-overlay" />
      <div className="ct-hero-inner">
        <div className="ct-shell">
          <Reveal className="ct-eyebrow" id="hero-eyebrow">{HERO.eyebrow}</Reveal>
          <Reveal delay={1}>
            <h1 className="ct-serif">{HERO.headline}</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="ct-sub">{HERO.body}</p>
          </Reveal>
          <Reveal delay={3} className="ct-hero-actions">
            <a href={HERO.primaryHref} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn-primary">{HERO.primaryCta}</a>
            <a href={HERO.secondaryHref} className="ct-btn ct-btn-ghost-light">{HERO.secondaryCta}</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Second cinematic beat, directly beneath the hero — same full-bleed,
 * eyebrow + headline-only pattern as Dovetail's "Bermuda, from above"
 * section (public/dovetail/index.html .experience#bermuda), using the
 * dedicated book.mp4 clip supplied for this proposal.
 */
export function CinematicBeat() {
  return (
    <section className="ct-cinematic">
      <div className="ct-media-frame">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src={encodeURI(CINEMATIC_BEAT.videoSrc)} type="video/mp4" />
        </video>
        <span className="ct-scene-tag">{CINEMATIC_BEAT.sceneTag}</span>
      </div>
      <div className="ct-cinematic-overlay" />
      <div className="ct-cinematic-inner">
        <div className="ct-shell">
          <Reveal>
            <span className="ct-eyebrow" style={{ display: "block", marginBottom: "18px" }}>
              {CINEMATIC_BEAT.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="ct-serif">{CINEMATIC_BEAT.headline}</h2>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Scale/opportunity strip directly beneath the hero — presents CoralTree's
 * public portfolio scale as a creative opportunity, not a problem.
 */
export function ScaleStrip() {
  return (
    <section className="ct-on-dark ct-contour-bg ct-scale-strip">
      <div className="ct-shell">
        <Reveal>
          <h2 className="ct-serif ct-scale-heading">{SCALE_STRIP.heading}</h2>
        </Reveal>
        <Reveal delay={1}>
          <div className="ct-scale-row">
            {SCALE_STRIP.stats.map((s) => (
              <div className="ct-scale-stat" key={s.label}>
                <span className="ct-num ct-serif">{s.value}</span>
                <span className="ct-lbl">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="ct-scale-note">{SCALE_STRIP.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
