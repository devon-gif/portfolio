"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type Example = {
  src: string;
  alt: string;
  label: string;
};

type Props = {
  items: readonly Example[];
};

/**
 * Lightweight promo example carousel for /promo-rescue — no external
 * dependency. Desktop shows one large centered slide with dimmed side
 * previews; mobile gets a horizontally swipeable track. Auto-advances
 * every 4.5s and pauses while a user is interacting via the buttons.
 */
export function PromoExampleCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4500);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div>
      {/* Desktop: centered slide with side previews */}
      <div className="relative hidden items-center justify-center gap-4 lg:flex">
        <button
          type="button"
          aria-label="Previous example"
          onClick={() => go(-1)}
          className="z-10 shrink-0 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex w-full max-w-4xl items-center justify-center gap-3 overflow-hidden">
          {[-1, 0, 1].map((offset) => {
            const i = (index + offset + count) % count;
            const item = items[i];
            const isCenter = offset === 0;
            return (
              <div
                key={`${item.src}-${offset}`}
                className={`relative shrink-0 overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.16)] bg-black/20 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-500 ${
                  isCenter
                    ? "aspect-square w-[340px] opacity-100"
                    : "aspect-square w-[160px] opacity-40"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={isCenter ? "340px" : "160px"}
                  loading="lazy"
                  className="object-cover"
                />
                {isCenter && (
                  <span className="absolute bottom-3 left-3 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#E8D7A2]">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next example"
          onClick={() => go(1)}
          className="z-10 shrink-0 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 p-2 text-[#E8D7A2] transition hover:border-[#C9A44C]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile: horizontal swipeable scroll */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 lg:hidden">
        {items.map((item) => (
          <div
            key={item.src}
            className="relative aspect-square w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.16)] bg-black/20 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="80vw"
              loading="lazy"
              className="object-cover"
            />
            <span className="absolute bottom-3 left-3 rounded-full border border-[rgba(201,164,76,0.24)] bg-[#050505]/70 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#E8D7A2]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-2" aria-label="Example navigation">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Go to example ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-7 bg-[#C9A44C]" : "w-2.5 bg-[#A9A092]/40 hover:bg-[#A9A092]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
