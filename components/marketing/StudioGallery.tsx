"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyVideo } from "./LazyVideo";
import { WORK_PAGE_IMAGES, WORK_PAGE_VIDEOS } from "./work-page-media";

export type StudioGalleryItem = {
  src: string;
  alt: string;
  tag: string;
};

const HOME_MOTION_ORDERS = new Set([1, 2, 3, 5, 6, 7, 8, 9, 17, 18, 23, 24, 25, 26, 28, 29]);

const HOME_MOTION = WORK_PAGE_VIDEOS.filter((item) => HOME_MOTION_ORDERS.has(item.order));

const EXTRA_STILLS: StudioGalleryItem[] = WORK_PAGE_IMAGES.slice(6, 20).map((item) => ({
  src: item.src,
  alt: item.title,
  tag: item.title,
}));

function motionTag(category: string) {
  if (category.includes("fb")) return "F&B motion";
  if (category.includes("campaigns")) return "Campaign motion";
  if (category.includes("experimental")) return "AI / VFX motion";
  return "Hospitality motion";
}

/**
 * Homepage portfolio showcase. It starts with a broader motion/VFX reel built
 * from the verified work-page media inventory, then expands the still-image
 * carousel with additional safe hospitality campaign graphics already used
 * elsewhere on the site.
 */
export function StudioGallery({ items }: { items: readonly StudioGalleryItem[] }) {
  const motionTrackRef = useRef<HTMLDivElement | null>(null);
  const stillTrackRef = useRef<HTMLDivElement | null>(null);

  const allStills = [
    ...items,
    ...EXTRA_STILLS.filter((extra) => !items.some((item) => item.src === extra.src)),
  ];

  const scrollBy = (ref: React.RefObject<HTMLDivElement | null>, dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <div className="space-y-14">
      <section aria-labelledby="home-motion-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 id="home-motion-heading" className="font-serif text-[24px] text-[var(--st-ink)]">
              Motion, VFX & AI-assisted animation
            </h3>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
              Existing hotel, restaurant, wedding, and destination stills brought to life with cinematic motion,
              parallax, lighting, subtle VFX, and AI-assisted animation — without requiring a new production day.
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll motion left"
              onClick={() => scrollBy(motionTrackRef, -1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll motion right"
              onClick={() => scrollBy(motionTrackRef, 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={motionTrackRef}
          className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]"
        >
          {HOME_MOTION.map((item) => (
            <figure
              key={item.src}
              className="group w-[82%] shrink-0 snap-start sm:w-[47%] lg:w-[31%]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--st-line)] bg-black shadow-[var(--st-shadow-soft)]">
                <LazyVideo
                  src={item.src}
                  label={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                  <p className="text-[13px] font-medium text-white">{item.title}</p>
                </div>
              </div>
              <figcaption className="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--st-ink-soft)]">
                <span className="text-[var(--st-gold)]">—</span>
                {motionTag(item.category)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-stills-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 id="home-stills-heading" className="font-serif text-[24px] text-[var(--st-ink)]">
              Campaign graphics & property creative
            </h3>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
              More of the day-to-day creative that keeps hotel, F&B, event, and seasonal campaigns moving.
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll graphics left"
              onClick={() => scrollBy(stillTrackRef, -1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Scroll graphics right"
              onClick={() => scrollBy(stillTrackRef, 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--st-line)] bg-white text-[#2a2520] transition hover:border-[var(--st-gold)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={stillTrackRef}
          className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:thin]"
        >
          {allStills.map((item) => (
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
      </section>
    </div>
  );
}
