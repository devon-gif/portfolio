import { SPLIT_INTRO } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

/**
 * Split video + copy section, directly after the cinematic beat — mirrors
 * Dovetail's "Different properties. Different stories." split section
 * (public/dovetail/index.html .split#idea): full-height video on one side,
 * copy on the other, dark ground.
 */
export function SplitIntro() {
  return (
    <section className="ct-on-dark ct-split">
      <div className="ct-media-frame">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
          <source src={encodeURI(SPLIT_INTRO.videoSrc)} type="video/mp4" />
        </video>
        <span className="ct-scene-tag">{SPLIT_INTRO.sceneTag}</span>
      </div>
      <div className="ct-split-copy">
        <Reveal>
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{SPLIT_INTRO.eyebrow}</span></div>
          <h2 className="ct-serif">{SPLIT_INTRO.headline}</h2>
        </Reveal>
        <Reveal delay={1}>
          <p>{SPLIT_INTRO.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
