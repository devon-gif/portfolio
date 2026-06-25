"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type StudioGalleryItem = {
  src: string;
  alt: string;
  tag: string;
};

/**
 * Light-theme horizontal scroll-snap gallery for hospitality work / proof.
 * Mixed-aspect source images are framed in a fixed 4:3 card with object-cover
 * so nothing stretches. Swipeable on mobile; arrow buttons on desktop.
 * Reusable across future light marketing pages.
 */
export function StudioGallery({ items }: { items: readonly StudioGalleryItem[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-5 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]"
      >
        {items.map((item) => (
          <figure
            key={item.src}
            className="group relative w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--st-line)] bg-[var(--st-sand)] shadow-[var(--st-shadow-soft)]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 31vw"
                loading="lazy"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--st-ink-soft)]">
              <span className="text-[var(--st-gold)]">—</span>
              {item.tag}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
