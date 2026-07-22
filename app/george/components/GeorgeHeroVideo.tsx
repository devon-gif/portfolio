"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Large, cinematic hero video for the /george private preview. Unlike a
 * typical full-bleed marketing hero, this is deliberately NOT stretched or
 * cropped to fill the screen -- it plays at its natural aspect ratio inside
 * a dark, centered stage (see .gg-hero-stage / video rules in george.css)
 * so nothing important in the footage is ever clipped.
 *
 * Autoplays muted + looped only when the visitor has not requested reduced
 * motion; otherwise it loads and shows the first frame without playing.
 * Falls back to a quiet "Preview unavailable" state on error, matching the
 * graceful-failure pattern used by components/marketing/LazyVideo.tsx
 * elsewhere on the site (not reused directly here because that component
 * assumes an absolutely-positioned, object-fit: cover background video,
 * which is the opposite of what this contained, uncropped player needs).
 */
export function GeorgeHeroVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleError() {
      console.error(`[GeorgeHeroVideo] video failed to load, src: ${src}`);
      setFailed(true);
    }

    el.addEventListener("error", handleError);
    el.src = src;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReduced) {
      void el.play().catch(() => {});
    }

    return () => {
      el.removeEventListener("error", handleError);
    };
  }, [src]);

  if (failed) {
    return (
      <div className="gg-hero-stage-fallback" role="img" aria-label={`${label}, preview unavailable`}>
        Preview unavailable
      </div>
    );
  }

  return <video ref={ref} muted loop playsInline preload="metadata" aria-label={label} />;
}
