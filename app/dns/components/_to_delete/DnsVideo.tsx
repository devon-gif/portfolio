"use client";

import { useEffect, useState } from "react";
import { LazyVideo } from "@/components/marketing/LazyVideo";

/**
 * /dns-specific video wrapper. Wraps the project's existing
 * components/marketing/LazyVideo.tsx (viewport-aware autoplay/pause, muted,
 * loop, playsInline, no controls — already used by /oxford, /first-hospitality,
 * /social-media-work, and elsewhere) rather than building a second video
 * system, and rather than editing LazyVideo itself (which is shared and must
 * not change behavior on other routes).
 *
 * Adds prefers-reduced-motion handling here (route-scoped): reduced-motion
 * visitors get a static frame treatment (no mounted <video>) instead of the
 * shared component's default behavior.
 */
export function DnsVideo({
  src,
  label,
  eager = false,
  className,
}: {
  src: string;
  label: string;
  eager?: boolean;
  className?: string;
}) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return <div className={className ?? "h-full w-full"} style={{ background: "var(--dns-stone)" }} aria-label={label} role="img" />;
  }

  return <LazyVideo src={src} eager={eager} label={label} className={className ?? "h-full w-full object-cover"} />;
}
