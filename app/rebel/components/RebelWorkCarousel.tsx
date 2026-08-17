"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DesignWorkItem, MotionWorkItem, WorkCarouselOrientation } from "../rebel-work-carousel-data";

type Props =
  | { kind: "video"; items: MotionWorkItem[]; ariaLabel: string }
  | { kind: "image"; items: DesignWorkItem[]; ariaLabel: string };

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Faithful React port of the homepage's "centered work carousel" (see
 * public/archer-preview/index.html, `[data-carousel]` / "CENTERED WORK
 * CAROUSEL JS"): a single active slide is centered in the viewport via a
 * measured transform, landscape slides render wide and portrait slides
 * render narrow, prev/next arrows (and clicking any slide) change the
 * active index, and only the active video plays -- every other video
 * stays paused. Orientation for clips whose aspect ratio isn't known
 * ahead of time is detected client-side from the loaded video's real
 * dimensions, mirroring the homepage's "TCRM ORIENTATION FIX" script.
 *
 * Used for both of /rebel's "MORE ARCHER WORK" slideshows (Motion Work,
 * Design Work) so they share the exact sizing, motion and interaction as
 * the live Archer Design homepage -- these are the page's two broader
 * Archer portfolio slideshows, distinct from the Rebel-specific clips
 * used earlier in the page as storytelling media.
 */
export function RebelWorkCarousel(props: Props) {
  const { kind, items, ariaLabel } = props;
  const [active, setActive] = useState(0);
  const [detectedOrientation, setDetectedOrientation] = useState<Record<number, WorkCarouselOrientation>>({});
  const [reducedMotion] = useState(prefersReducedMotion);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const orientationFor = useCallback(
    (index: number): WorkCarouselOrientation => {
      const known = items[index]?.orientation;
      if (known) return known;
      return detectedOrientation[index] ?? "landscape";
    },
    [items, detectedOrientation]
  );

  const recenter = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slide = slideRefs.current[active];
    if (!viewport || !track || !slide) return;
    const viewportCenter = viewport.clientWidth / 2;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    track.style.transform = `translateX(${viewportCenter - slideCenter}px)`;
  }, [active]);

  useEffect(() => {
    recenter();
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, [recenter]);

  useEffect(() => {
    if (kind !== "video" || reducedMotion) return;
    // Pause every clip, then hand off to the active one after a short
    // delay -- same 160ms handoff the homepage uses so the outgoing clip
    // has actually stopped before the incoming one starts.
    videoRefs.current.forEach((v) => v?.pause());
    const t = setTimeout(() => {
      const v = videoRefs.current[active];
      if (!v) return;
      v.muted = true;
      void v.play().catch(() => {});
    }, 160);
    return () => clearTimeout(t);
  }, [active, kind, reducedMotion]);

  const goTo = useCallback(
    (dir: number) => {
      setActive((i) => (i + dir + items.length) % items.length);
    },
    [items.length]
  );

  if (items.length === 0) return null;

  return (
    <div className="rb-work-carousel" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="rb-work-arrow rb-work-arrow-left"
        aria-label={`Previous ${ariaLabel.toLowerCase()}`}
        onClick={() => goTo(-1)}
      >
        &lsaquo;
      </button>

      <div className="rb-work-carousel-viewport" ref={viewportRef}>
        <div className="rb-work-carousel-track" ref={trackRef}>
          {items.map((item, i) => {
            const orientation = orientationFor(i);
            const isActive = i === active;
            return (
              <div
                key={`${item.src}-${i}`}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className={`rb-work-slide is-${orientation}${isActive ? " is-active" : ""}`}
                aria-hidden={!isActive}
                onClick={() => setActive(i)}
              >
                <div className="rb-work-slide-media">
                  {kind === "video" ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={(item as MotionWorkItem).label}
                      onLoadedMetadata={(e) => {
                        if (item.orientation) return;
                        const v = e.currentTarget;
                        if (!v.videoWidth || !v.videoHeight) return;
                        setDetectedOrientation((prev) => ({
                          ...prev,
                          [i]: v.videoHeight > v.videoWidth ? "portrait" : "landscape",
                        }));
                      }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- exact 1:1 homepage carousel asset, not a Next/Image candidate
                    <img src={item.src} alt={(item as DesignWorkItem).alt} loading="lazy" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="rb-work-arrow rb-work-arrow-right"
        aria-label={`Next ${ariaLabel.toLowerCase()}`}
        onClick={() => goTo(1)}
      >
        &rsaquo;
      </button>

      <p className="rb-work-carousel-count">
        {active + 1} / {items.length}
      </p>
    </div>
  );
}
