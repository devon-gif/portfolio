"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoAsset } from "./media";

/**
 * Rotates through a playlist of premium hero videos, crossfading between them
 * every ~7.5s. Respects prefers-reduced-motion (shows the first video, no
 * cycling). All videos autoplay muted/looped/inline.
 */
export function HeroVideoRotator({
  videos,
  className = "",
}: {
  videos: VideoAsset[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current || videos.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % videos.length), 7500);
    return () => clearInterval(t);
  }, [videos.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {videos.map((vid, i) => (
        <video
          key={vid.src}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === active ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden={i === active ? undefined : true}
          aria-label={i === active ? `Archer Design, ${vid.label}` : undefined}
        >
          <source src={vid.src} type="video/mp4" />
        </video>
      ))}
      {/* Readability + warmth overlays (kept lighter so the video stays apparent). */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08),rgba(5,5,5,0.42))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_15%,rgba(201,164,76,0.14),transparent_55%)]" />
    </div>
  );
}
