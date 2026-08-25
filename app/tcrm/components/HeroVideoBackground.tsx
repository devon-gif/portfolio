"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed hero background video for /tcrm. Autoplay/muted/loop/inline
 * like every other background video on the site, with one addition: it
 * actively respects prefers-reduced-motion by never assigning `video.src`
 * (so nothing loads or plays) and swapping in a static poster `<img>`
 * instead, rather than relying on CSS alone to hide motion.
 *
 * Points at public/tcrm/videos/tcrm-hero.mp4 (the same "Hotel Arrival,
 * Vintage Car" clip used across the site's hero backgrounds, copied into
 * this page's own asset folder and renamed). This source clip is a roughly
 * 4:3 frame (1664x1248), not widescreen, so .tl-hero-video's `object-fit:
 * cover` crops rather than stretches it to fill the full-bleed hero -- no
 * distortion, but a tighter zoom than a native-widescreen clip would show.
 * The poster lives at public/tcrm/images/tcrm-hero-poster.webp.
 */
export function HeroVideoBackground({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  // Lazy initializer reads the real value on first render (client only ,
  // SSR/hydration always starts from `false`, then this effect's listener
  // corrects it), so we never call setState synchronously inside the effect
  // body itself.
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    el.src = src;
    void el.play().catch(() => {});
  }, [src, reducedMotion]);

  if (reducedMotion) {
    // Decorative full-bleed background image (not a content image), so a
    // plain <img> with next/image's fill+object-cover equivalent handled by
    // the .tl-hero-video CSS class is intentional here.
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="tl-hero-video"
      />
    );
  }

  return (
    <video
      ref={ref}
      className="tl-hero-video"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      poster={poster}
      aria-label={alt}
    />
  );
}
