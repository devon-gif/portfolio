"use client";

import { useEffect, useState } from "react";
import { LazyVideo } from "@/components/marketing/LazyVideo";

/**
 * First-Hospitality-specific video wrapper. Wraps the project's existing
 * components/marketing/LazyVideo.tsx (viewport-aware autoplay/pause, muted,
 * loop, playsInline, no controls -- already used by /oxford, /social-media-work,
 * and elsewhere) rather than building a second video system, and rather than
 * editing LazyVideo itself (which is shared and must not change behavior on
 * other routes).
 *
 * Adds one thing LazyVideo doesn't do on its own: prefers-reduced-motion.
 * That check lives here (First-Hospitality-only) so reduced-motion visitors
 * see the still poster frame instead of a mounted <video>, without touching
 * LazyVideo's behavior anywhere else.
 */
export function FirstHospitalityVideoCard({
  src,
  poster,
  label,
  eager = false,
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  eager?: boolean;
  className?: string;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion && poster) {
    // eslint-disable-next-line @next/next/no-img-element -- static poster fallback, not a Next <Image> content image
    return <img src={poster} alt={label} className={className ?? "h-full w-full object-cover"} />;
  }

  return (
    <LazyVideo
      src={src}
      poster={poster}
      eager={eager}
      label={label}
      className={className ?? "h-full w-full object-cover"}
    />
  );
}
