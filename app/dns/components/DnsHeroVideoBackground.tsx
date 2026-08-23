"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full-bleed hero background video for /dns, ported from
 * app/tcrm/components/HeroVideoBackground.tsx (route-local copy per this
 * page's "prefer copying/adapting route-local versions" instruction, rather
 * than importing the TCRM component directly). Same reduced-motion handling:
 * never assigns `video.src` (so nothing loads or plays) for
 * prefers-reduced-motion, swapping in a static poster `<img>` instead.
 */
export function DnsHeroVideoBackground({
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
        className="dns-hero-video"
      />
    );
  }

  return (
    <video
      ref={ref}
      className="dns-hero-video"
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
