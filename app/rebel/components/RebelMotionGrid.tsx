import { RebelMotion } from "./RebelMotion";
import type { RebelMotionAsset } from "../rebel-motion-data";

/**
 * Three-up motion grid -- one of the page's ~4 required motion moments
 * (see Devon's brief: "three-property motion grid"). Purely presentational
 * and data-driven: it renders whatever three RebelMotionAsset entries it's
 * given, so swapping in real Rebel property footage later is a
 * rebel-motion-data.ts edit, never a component change.
 */
export function RebelMotionGrid({ items }: { items: RebelMotionAsset[] }) {
  return (
    <div className="rb-motion-grid">
      {items.map((item, i) => (
        <div key={item.key} className="rb-motion-grid-item">
          <RebelMotion
            videoSrc={item.videoSrc}
            posterSrc={item.posterSrc || undefined}
            alt={item.alt}
            caption={item.caption}
            eager={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
