"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FEATURED_MOTION, MOTION_CAROUSEL } from "./media";
import { LazyVideo } from "./LazyVideo";
import { VideoCard } from "./VideoCard";

/**
 * Featured motion showcase - sits directly beneath the hero.
 * One large cinematic landscape video, then a horizontal scroll-snap row of
 * mixed-orientation cards. Each card preserves its real aspect ratio.
 * Prev/next controls sit directly beneath the carousel row.
 */
export function FeaturedMotionShowcase() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 700), behavior: "smooth" });
  };

  return (
    <section id="work" className="scroll-mt-24 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Motion library
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4.4vw,48px)] font-semibold leading-[1.05] text-[#F6F1E7]">
            Short-form motion that makes guests stop, look, and book.
          </h2>
          <p className="mt-3 text-[#A9A092]">
            Your properties already have the raw material. We turn hotel photos, restaurant visuals,
            spa content, and event details into scroll-stopping motion built for social, local
            visibility, and direct booking interest.
          </p>
        </div>

        {/* Large featured video - cinematic, real aspect ratio, eager-loaded */}
        <figure className="mx-auto mb-8 w-full max-w-4xl">
          <div
            className="glass-card-strong overflow-hidden rounded-[1.25rem]"
            style={{ aspectRatio: `${FEATURED_MOTION.width} / ${FEATURED_MOTION.height}` }}
          >
            <LazyVideo src={FEATURED_MOTION.src} eager label={FEATURED_MOTION.label} className="h-full w-full object-cover" />
          </div>
          <figcaption className="mt-3 flex items-center justify-between px-1">
            <span className="text-sm text-[#D8CFBE]">{FEATURED_MOTION.label}</span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#C9A44C]">
              {FEATURED_MOTION.category}
            </span>
          </figcaption>
        </figure>
      </div>

      {/* Full-bleed-ish horizontal carousel; cards keep natural orientation */}
      <div
        ref={trackRef}
        className="mx-auto flex max-w-[1400px] snap-x snap-mandatory items-end gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MOTION_CAROUSEL.map((a) => (
          <VideoCard key={a.src + a.label} asset={a} />
        ))}
      </div>

      {/* Prev/next controls directly beneath the videos */}
      <div className="mx-auto mt-5 flex max-w-[1400px] justify-center gap-3 px-6">
        <button
          type="button"
          aria-label="Scroll motion left"
          onClick={() => scrollBy(-1)}
          className="rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/60 p-2.5 text-[#E8D7A2] transition hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.08)]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll motion right"
          onClick={() => scrollBy(1)}
          className="rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/60 p-2.5 text-[#E8D7A2] transition hover:border-[#C9A44C] hover:bg-[rgba(201,164,76,0.08)]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
