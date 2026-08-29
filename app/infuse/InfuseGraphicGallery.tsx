import { Reveal } from "./components/Reveal";
import { InfuseGraphicSlideshow } from "./components/InfuseGraphicSlideshow";
import { INFUSE_GRAPHIC_ITEMS } from "./infuse-graphic-gallery-media";

const GRAPHIC_EYEBROW = "GRAPHIC + CAMPAIGN WORK";
const GRAPHIC_HEADLINE = "The still side of the system.";
const GRAPHIC_COPY =
  "Menus, campaigns, events, social content and promotional creative built to give each concept a polished identity while keeping production moving.";

const BG_WORDS = ["CAMPAIGN", "SOCIAL", "MENUS", "ACTIVATIONS"];

/**
 * Major "Graphic + Campaign Work" section — the second of the two primary
 * portfolio galleries, directly after Motion Work. Warm off-white ground,
 * with oversized, very-low-opacity decorative background typography
 * (purely visual — aria-hidden, no reading-order impact).
 */
export function InfuseGraphicGallery() {
  return (
    <section className="infuse-ggallery-section" id="graphic-work">
      <div className="infuse-ggallery-bgtype" aria-hidden="true">
        {BG_WORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
      <div className="infuse-shell">
        <Reveal className="infuse-ggallery-heading">
          <span className="infuse-eyebrow">{GRAPHIC_EYEBROW}</span>
          <h2 className="infuse-serif">{GRAPHIC_HEADLINE}</h2>
          <p>{GRAPHIC_COPY}</p>
        </Reveal>

        <Reveal delay={2}>
          <InfuseGraphicSlideshow items={INFUSE_GRAPHIC_ITEMS} />
        </Reveal>
      </div>
    </section>
  );
}
