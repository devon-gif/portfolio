"use client";

import { useCallback, useState } from "react";
import { FEATURED_VIDEOS } from "./media";
import { LazyVideo } from "./LazyVideo";

export function FeaturedVideoGrid() {
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  const markFailed = useCallback((src: string) => {
    setFailedSrcs((prev) => new Set(prev).add(src));
  }, []);

  const visible = FEATURED_VIDEOS.filter((v) => !failedSrcs.has(v.src));

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Featured work
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Short-form motion, built from what you already have.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {visible.map((v) => (
            <figure
              key={v.src}
              className="group overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.24)] bg-[#11100E] transition hover:shadow-[0_14px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(201,164,76,0.2)]"
            >
              <LazyVideo
                src={v.src}
                label={v.label}
                className="aspect-video w-full object-cover"
                onFailed={() => markFailed(v.src)}
              />
              <figcaption className="flex items-center justify-between px-5 py-4">
                <span className="font-serif text-lg text-[#F6F1E7]">{v.label}</span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#C9A44C]">Motion</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
