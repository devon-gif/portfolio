"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LIBRARY_VIDEOS } from "./media";
import { LazyVideo } from "./LazyVideo";

export function VideoCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  const markFailed = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  const visible = LIBRARY_VIDEOS.filter((v) => !failedSrcs.has(v.src));

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Motion library
            </span>
            <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
              Short-form motion for hotels, restaurants, spas, and events.
            </h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/60 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/60 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((v) => (
            <figure
              key={v.src}
              className="w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.24)] bg-[#11100E] sm:w-[46%] lg:w-[31%]"
            >
              <LazyVideo
                src={v.src}
                label={v.label}
                className="aspect-[9/12] w-full object-cover sm:aspect-video"
                onFailed={() => markFailed(v.src)}
              />
              <figcaption className="px-4 py-3 text-[13px] text-[#A9A092]">{v.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
