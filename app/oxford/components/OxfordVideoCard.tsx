"use client";

import { useEffect, useState } from "react";
import { LazyVideo } from "@/components/marketing/LazyVideo";
import type { OxfordVideo } from "../oxford-media";

/**
 * Renders one piece of Oxford motion work inside the project's existing
 * .ox-media-frame treatment. Wraps components/marketing/LazyVideo.tsx (the
 * project's existing viewport-aware autoplay/pause video component, already
 * used on /social-media-work and elsewhere) rather than building a second
 * video system.
 *
 * Adds one thing LazyVideo doesn't do on its own: prefers-reduced-motion.
 * LazyVideo is shared across the site, so that check lives here (Oxford-only)
 * instead of inside LazyVideo, to avoid changing autoplay behavior on any
 * other page. When the visitor has reduced motion enabled, this renders the
 * still poster frame instead of mounting <video> at all.
 */
export function OxfordVideoCard({
  video,
  eager = false,
  className,
  showReelTag = false,
  aspectClassName,
  fill = false,
}: {
  video: OxfordVideo;
  eager?: boolean;
  className?: string;
  showReelTag?: boolean;
  /** Overrides the aspect class normally derived from video.aspect, for
   * placements (like the opportunity cards) that need to match a sibling
   * grid's existing card proportions instead. */
  aspectClassName?: string;
  /** For full-bleed cinematic placements (hero, oversized feature sections)
   * where the parent element defines its own height (via CSS, e.g. a
   * clamp()'d vh value) and this card should absolutely-position to fill it
   * edge-to-edge instead of reserving space via an aspect-ratio box. */
  fill?: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const aspectClass = fill
    ? "ox-fill"
    : aspectClassName ??
      (video.aspect === "portrait" ? "aspect-[4/5]" : video.aspect === "square" ? "aspect-square" : "aspect-[4/3]");

  return (
    <div className={["ox-media-frame ox-video-frame", aspectClass, className].filter(Boolean).join(" ")}>
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element -- static poster fallback, not a Next <Image> content image
        <img src={video.poster} alt={video.description} className="h-full w-full object-cover" />
      ) : (
        <LazyVideo src={video.src} poster={video.poster} eager={eager} label={video.title} className="h-full w-full object-cover" />
      )}
      {showReelTag && <span className="ox-reel-tag">{video.title}</span>}
    </div>
  );
}
