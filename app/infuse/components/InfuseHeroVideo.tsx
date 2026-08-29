"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Single continuously-looping hero video for /infuse — the hero no longer
 * cycles through multiple clips (see infuse-media.ts HERO_VIDEO_SRC); this
 * is the page's one continuous visual identity. Adapted from
 * app/dns/components/DnsHeroVideoBackground.tsx (route-local copy, per this
 * project's convention of copying rather than importing another private
 * page's component directly). Never assigns `video.src` (so nothing loads
 * or plays) when the visitor prefers reduced motion — a static poster
 * <Image> is shown instead. Eager-loaded: this is the only video on the
 * page allowed to load immediately, since it is the LCP element.
 */
export function InfuseHeroVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
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
    return (
      <Image
        src={poster}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="infuse-hero-media"
      />
    );
  }

  return (
    <video
      ref={ref}
      className="infuse-hero-media"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      aria-label={alt}
    />
  );
}
