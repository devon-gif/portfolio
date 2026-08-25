"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type WorkItem = {
  src: string;
  alt: string;
  tag: string;
};

/**
 * Horizontal scroll-snap gallery for recent work / campaigns / builds.
 * Mixed-aspect source images are framed in a fixed 4:3 card with object-cover
 * so nothing stretches. Swipeable on mobile; arrow buttons on desktop.
 */
export function CoPilotWorkGallery({ items }: { items: readonly WorkItem[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(201,164,76,0.3)] bg-[rgba(5,5,5,0.4)] text-[#E8D7A2] transition hover:border-[#C9A44C]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-[rgba(201,164,76,0.3)] bg-[rgba(5,5,5,0.4)] text-[#E8D7A2] transition hover:border-[#C9A44C]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <figure
            key={item.src}
            className="group w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <div className="glass-card relative aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(201,164,76,0.16)]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                loading="lazy"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 rounded-full border border-[rgba(201,164,76,0.4)] bg-[rgba(5,5,5,0.55)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E8D7A2] backdrop-blur-sm">
                {item.tag}
              </span>
            </div>
            <figcaption className="mt-2.5 px-1 text-[12.5px] leading-snug text-[#A9A092]">
              {item.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
