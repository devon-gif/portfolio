"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WorkPageImage } from "./work-page-media";

type Props = {
  items: readonly WorkPageImage[];
};

/**
 * Light-theme ("archer-studio") immersive stills slideshow, mirroring
 * MotionPortfolioGallery's large-stage-plus-filmstrip pattern. Each image
 * keeps its real aspect ratio in the primary stage (no crop, no
 * distortion); the filmstrip below uses a fixed square crop only for quick
 * navigation thumbnails.
 */
export function WorkPageStillsGallery({ items }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      for (const c of item.category.split(" ")) set.add(c);
    }
    return ["All", ...Array.from(set)];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const filmstripRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? items
        : items.filter((i) => i.category.split(" ").includes(activeCategory)),
    [items, activeCategory]
  );

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    setActiveIndex(0);
  }

  const active = filtered[activeIndex] ?? filtered[0] ?? null;

  const goTo = useCallback(
    (dir: number) => {
      setActiveIndex((i) => {
        if (filtered.length === 0) return i;
        return (i + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  useEffect(() => {
    const el = filmstripRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goTo]);

  if (!active) return null;

  const ratio = active.width / active.height;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => selectCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`rounded-full border px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.12em] transition ${
              activeCategory === cat
                ? "border-[var(--st-ink)] bg-[var(--st-ink)] text-[var(--st-ivory)]"
                : "border-[var(--st-line)] text-[var(--st-ink-soft)] hover:border-[var(--st-gold)] hover:text-[var(--st-ink)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Large primary stage */}
      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${active.title} full-screen`}
          className="relative mx-auto block w-full overflow-hidden rounded-3xl border border-[var(--st-line)] bg-[var(--st-sand)] shadow-[var(--st-shadow)]"
          style={{
            aspectRatio: `${ratio}`,
            maxHeight: "min(78vh, 760px)",
            maxWidth: ratio < 1 ? "min(92vw, 520px)" : "100%",
          }}
        >
          <Image
            key={active.src}
            src={active.src}
            alt={active.title}
            fill
            sizes="(min-width: 1024px) 900px, 92vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,13,10,0.82)] to-transparent p-5 text-left">
            <span className="text-[15px] font-medium text-white">{active.title}</span>
          </div>
        </button>

        <button
          type="button"
          aria-label="Previous image"
          onClick={() => goTo(-1)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/90 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-left-5"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={() => goTo(1)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/90 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-right-5"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] text-[var(--st-ink-muted)]">
        {activeIndex + 1} / {filtered.length} · tap the image to view full-screen
      </p>

      {/* Filmstrip */}
      <div
        ref={filmstripRef}
        className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {filtered.map((item, i) => (
          <button
            key={item.src}
            type="button"
            data-index={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === activeIndex}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[var(--st-sand)] transition ${
              i === activeIndex
                ? "border-[var(--st-gold)]"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={item.src} alt={item.title} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} full-screen`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,17,13,0.94)] px-4 py-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close full-screen"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 p-2 text-white transition hover:border-[var(--st-gold-soft)]"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(-1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:border-[var(--st-gold-soft)] sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[86vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[74vh] w-full" style={{ aspectRatio: `${ratio}` }}>
              <Image
                src={active.src}
                alt={active.title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between bg-[rgba(10,9,7,0.85)] px-5 py-3">
              <span className="text-[13px] font-medium text-white">{active.title}</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-gold-soft)]">
                {active.category}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:border-[var(--st-gold-soft)] sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
