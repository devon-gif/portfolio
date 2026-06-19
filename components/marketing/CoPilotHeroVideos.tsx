"use client";

import { useEffect, useRef, useState } from "react";

export type HeroClip = {
  src: string;
  poster: string;
  label: string;
  tag: string;
};

/**
 * Hero media rotator for the Archer Local Co-Pilot homepage.
 * Shows one polished landscape video card that crossfades through a short
 * playlist every ~6.5s. Every clip is muted/looped/inline and shows its
 * poster instantly so the card never renders as a black box. Inactive clips
 * use preload="none" so only watched clips are downloaded. Respects
 * prefers-reduced-motion (no auto-cycling).
 */
export function CoPilotHeroVideos({ clips }: { clips: readonly HeroClip[] }) {
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

  return (
    <div>
      <div className="glass-card-strong overflow-hidden rounded-3xl p-2 ring-1 ring-[rgba(201,164,76,0.3)] sm:p-2.5">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          {clips.map((clip, i) => (
            <video
              key={clip.src}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              style={{ opacity: i === active ? 1 : 0 }}
              poster={clip.poster}
              autoPlay
              muted
              loop
              playsInline
              preload={i === active ? "auto" : "none"}
              aria-label={clip.label}
            />
          ))}

          {/* caption tag */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3.5">
            <span className="text-[12px] font-medium text-[#F6F1E7]">
              {clips[active]?.label}
            </span>
            <span className="rounded-full border border-[rgba(201,164,76,0.4)] bg-[rgba(5,5,5,0.5)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8D7A2]">
              {clips[active]?.tag}
            </span>
          </div>
        </div>
      </div>

      {/* dot indicators */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {clips.map((clip, i) => (
          <button
            key={clip.src}
            type="button"
            aria-label={`Show ${clip.label}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-[#C9A44C]" : "w-1.5 bg-[rgba(201,164,76,0.3)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
