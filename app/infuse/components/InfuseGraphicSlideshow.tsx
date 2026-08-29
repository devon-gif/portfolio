"use client";

import Image from "next/image";
import { useState } from "react";
import type { InfuseGraphicItem } from "../infuse-graphic-gallery-media";

/**
 * Graphic + Campaign Work slideshow for /infuse. Interaction model follows
 * app/tcrm/components/NonHotelImageSlideshow.tsx (large active stage,
 * previous/next arrows, counter) with a thumbnail strip added underneath —
 * click a thumbnail to jump straight to it, active thumbnail indicated —
 * per direction. Uses next/image for every frame, including thumbnails.
 */
export function InfuseGraphicSlideshow({ items }: { items: InfuseGraphicItem[] }) {
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    if (!items.length) return;
    setActive(((index % items.length) + items.length) % items.length);
  }

  if (!items.length) return null;

  return (
    <div className="infuse-ggallery-wrap">
      <div className="infuse-ggallery-stage">
        {items.map((item, index) => (
          <div
            key={item.src}
            className={`infuse-ggallery-slide${index === active ? " infuse-ggallery-slide-active" : ""}`}
            aria-hidden={index !== active}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 900px) 100vw, 1180px"
              style={{ objectFit: "contain" }}
              priority={index === 0}
            />
          </div>
        ))}

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="infuse-ggallery-arrow infuse-ggallery-prev"
              onClick={() => goTo(active - 1)}
              aria-label="Previous artwork"
            >
              &larr;
            </button>
            <button
              type="button"
              className="infuse-ggallery-arrow infuse-ggallery-next"
              onClick={() => goTo(active + 1)}
              aria-label="Next artwork"
            >
              &rarr;
            </button>
          </>
        )}

        <div className="infuse-ggallery-counter">
          {String(active + 1).padStart(2, "0")}
          <span>/</span>
          {String(items.length).padStart(2, "0")}
        </div>
      </div>

      {items.length > 1 && (
        <div className="infuse-ggallery-thumbs" aria-label="Jump to artwork">
          {items.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className={`infuse-ggallery-thumb${index === active ? " infuse-ggallery-thumb-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Show artwork ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            >
              <Image src={item.src} alt="" fill sizes="74px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
