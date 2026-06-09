"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_IMAGES } from "./media";

export function ImageSlideshow() {
  const [index, setIndex] = useState(0);
  const count = GALLERY_IMAGES.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Portfolio
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Existing assets, turned into finished hospitality campaigns.
          </h2>
          <p className="mt-4 text-[#A9A092]">
            Most properties already have beautiful photos, menus, spaces, and offers. We turn those
            raw assets into consistent creative that keeps the brand visible between major campaigns.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.24)] bg-[#11100E] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {GALLERY_IMAGES.map((img) => (
              <div key={img.src} className="relative w-full shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#E8D7A2]">
                  {img.category}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2" aria-label="Gallery navigation">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-[#C9A44C]" : "w-2.5 bg-[#A9A092]/40 hover:bg-[#A9A092]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
