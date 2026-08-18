import { GALLERY_DISCLAIMER, GALLERY_ITEMS, GALLERY_LABEL, GALLERY_MORE_WORK } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

const SPAN_CLASS: Record<(typeof GALLERY_ITEMS)[number]["span"], string> = {
  wide: "ct-g-wide",
  tall: "ct-g-tall",
  square: "ct-g-square",
  full: "ct-g-full",
};

/**
 * Motion gallery — reuses the Dovetail-style asymmetric editorial grid
 * (public/dovetail/index.html .gallery/.g-item pattern), populated with
 * dedicated clips supplied for this proposal (public/coral-tree/movies)
 * plus existing Archer Design hospitality motion (valencia/lark/
 * archer-preview reels — every path below was verified to exist on disk).
 * None of this is CoralTree or Magnolia client work — see GALLERY_LABEL /
 * GALLERY_DISCLAIMER, rendered directly above the grid.
 */
export function MotionGallery() {
  return (
    <section className="ct-on-cream ct-section-pad" id="gallery">
      <div className="ct-shell">
        <Reveal className="ct-gallery-head">
          <div>
            <h2 className="ct-serif">{GALLERY_LABEL}</h2>
          </div>
          <a href={GALLERY_MORE_WORK.href} target="_blank" rel="noopener noreferrer" className="ct-text-link">
            {GALLERY_MORE_WORK.label}
          </a>
        </Reveal>
        <Reveal delay={1}>
          <p className="ct-gallery-disclaimer">{GALLERY_DISCLAIMER}</p>
        </Reveal>

        <div className="ct-gallery-grid">
          {GALLERY_ITEMS.map((item, i) => (
            <Reveal
              key={item.id}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              className={`ct-g-item ${SPAN_CLASS[item.span]}`}
            >
              <div className="ct-media-frame">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                  <source src={encodeURI(item.srcPath)} type="video/mp4" />
                </video>
              </div>
              <div className="ct-g-caption">
                <span className="ct-g-name ct-serif">{item.name}</span>
                <span className="ct-g-tag">{item.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
