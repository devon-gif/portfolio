import { Reveal } from "./components/Reveal";
import { InfuseMotionSlideshow } from "./components/InfuseMotionSlideshow";
import { INFUSE_MOTION_ITEMS } from "./infuse-motion-gallery-media";

const MOTION_EYEBROW = "MOTION + VFX";
const MOTION_HEADLINE_LINE_1 = "Turn the assets you already have";
const MOTION_HEADLINE_LINE_2 = "into content that moves.";
const MOTION_COPY =
  "I combine design, Photoshop, VFX, motion and carefully directed AI tools to transform hospitality imagery into polished short-form video, campaigns, digital displays and social content.";
const MOTION_AI_LINE = "AI-assisted. Human-directed.";

/**
 * Major "Motion Work" section — now the first major section immediately
 * after the hero ("proof first, explanation second"). One of the two
 * primary portfolio galleries (the other being InfuseGraphicGallery).
 * Anchored at #work so the hero's "View the Work" button and "Scroll to
 * explore" cue both land straight here.
 */
export function InfuseMotionGallery() {
  return (
    <section className="infuse-mgallery-section" id="work">
      <div className="infuse-shell">
        <Reveal className="infuse-mgallery-heading">
          <span className="infuse-eyebrow">{MOTION_EYEBROW}</span>
          <h2 className="infuse-serif">
            {MOTION_HEADLINE_LINE_1}
            <br />
            {MOTION_HEADLINE_LINE_2}
          </h2>
          <p>{MOTION_COPY}</p>
          <p className="infuse-mgallery-ai-line">{MOTION_AI_LINE}</p>
        </Reveal>

        <Reveal delay={2}>
          <InfuseMotionSlideshow items={INFUSE_MOTION_ITEMS} />
        </Reveal>
      </div>
    </section>
  );
}
