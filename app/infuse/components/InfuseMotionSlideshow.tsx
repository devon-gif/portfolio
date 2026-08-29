"use client";

import { useEffect, useRef, useState } from "react";
import type { InfuseMotionItem } from "../infuse-motion-gallery-media";

/**
 * Motion Work slideshow for /infuse. Interaction model closely follows
 * app/tcrm/components/MotionDesignSlideshow.tsx (large active video,
 * previous/next arrows, auto-advance on end, counter, dot navigation) —
 * reused rather than reinventing a carousel, per direction. Restyled and
 * contained (see .infuse-mgallery-* in infuse.css) rather than filling the
 * viewport, and only ever mounts one <video> element, so only the active
 * clip ever loads or plays.
 */
export function InfuseMotionSlideshow({ items }: { items: InfuseMotionItem[] }) {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const item = items[active];

  function move(direction: number) {
    if (!items.length) return;
    setActive((current) => (current + direction + items.length) % items.length);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    const play = video.play();
    if (play) play.catch(() => {});
  }, [active]);

  if (!item) return null;

  return (
    <div className="infuse-mgallery-slideshow">
      <div className="infuse-mgallery-stage">
        <video
          key={item.src}
          ref={videoRef}
          src={item.src}
          className="infuse-mgallery-video"
          autoPlay
          muted
          playsInline
          controls
          preload="metadata"
          onEnded={() => move(1)}
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="infuse-mgallery-arrow infuse-mgallery-left"
              onClick={() => move(-1)}
              aria-label="Previous motion example"
            >
              &larr;
            </button>
            <button
              type="button"
              className="infuse-mgallery-arrow infuse-mgallery-right"
              onClick={() => move(1)}
              aria-label="Next motion example"
            >
              &rarr;
            </button>
          </>
        )}

        <div className="infuse-mgallery-counter">
          {String(active + 1).padStart(2, "0")}
          <span>/</span>
          {String(items.length).padStart(2, "0")}
        </div>
      </div>

      <div className="infuse-mgallery-meta">
        <div>
          <span className="infuse-mgallery-group">{item.group}</span>
          <strong>{item.label}</strong>
        </div>

        <div className="infuse-mgallery-dots">
          {items.map((slide, index) => (
            <button
              key={`${slide.src}-${index}`}
              type="button"
              className={`infuse-mgallery-dot${index === active ? " infuse-mgallery-dot-active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`View motion example ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
