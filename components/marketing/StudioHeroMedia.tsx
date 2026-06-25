"use client";

import { useEffect, useRef, useState } from "react";

export type StudioClip = {
  src: string;
  label: string;
  tag: string;
};

/**
 * Light-theme hero media rotator for the Archer Studio homepage.
 * Crossfades through a short playlist of real hospitality clips inside a clean
 * ivory frame. Every clip is muted/looped/inline. Inactive clips use
 * preload="none" so only watched clips download. Respects
 * prefers-reduced-motion (no auto-cycling). Reusable on future light pages.
 */
export function StudioHeroMedia({ clips }: { clips: readonly StudioClip[] }) {
  const [active, setActive] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current || clips.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % clips.length), 6500);
    return () => clearInterval(t);
  }, [clips.length]);

  const current = clips[active];

  return (
    <div className="st-media-frame">
      <div className="st-media-inner relative aspect-[4/5] sm:aspect-[4/3]">
        {clips.map((clip, i) => (
          <video
            key={clip.src}
            src={clip.src}
            muted
            loop
            playsInline
            autoPlay
            preload={i === active ? "auto" : "none"}
            aria-label={clip.label}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* soft warm gradient for label legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[rgba(28,24,20,0.5)] to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[rgba(251,248,242,0.92)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2a2520]">
            {current?.tag}
          </span>
          <span className="text-[12px] font-medium text-[rgba(251,248,242,0.92)]">
            {current?.label}
          </span>
        </div>

        {/* dots */}
        <div className="absolute right-4 top-4 flex gap-1.5">
          {clips.map((c, i) => (
            <span
              key={c.src}
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-5 bg-[rgba(251,248,242,0.95)]"
                  : "w-1.5 bg-[rgba(251,248,242,0.5)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
