"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { LazyVideo } from "./LazyVideo";
import type { WorkPageVideo } from "./work-page-media";

type Props = {
  items: readonly WorkPageVideo[];
};

/**
 * Light-theme ("archer-studio") immersive motion slideshow. A large primary
 * stage plays the active clip (real aspect ratio, no crop) with prev/next
 * controls, a category filter, and a scrollable filmstrip of every clip in
 * the current category. The stage can expand into a true full-screen
 * lightbox for the most immersive view. No external carousel dependency.
 */
export function MotionPortfolioGallery({ items }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      for (const c of item.category.split(" ")) {
        if (c !== "motion") set.add(c);
      }
    }
    return ["All", ...Array.from(set)];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const filmstripRef = useRef<HTMLDivElement | null>(null);
  // Skips the filmstrip auto-scroll on first mount (see effect below) so
  // the gallery never nudges the page's own scroll position on load.
  const skipInitialScrollRef = useRef(true);

  const filtered = useMemo(() => {
    const base =
      activeCategory === "All"
        ? items
        : items.filter((i) => i.category.split(" ").includes(activeCategory));
    // Sort by the manifest's explicit `order` field rather than trusting
    // array position, so the slideshow sequence (hotel-arrival clip first,
    // poolside clip second) stays stable across filtering, refreshes,
    // rebuilds, and deploys.
    return [...base].sort((a, b) => a.order - b.order);
  }, [items, activeCategory]);

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
    // Root cause of the page loading mid-scroll: this effect also ran on
    // the very first mount (activeIndex starts at 0), and scrollIntoView's
    // "nearest" block option was pulling the whole page's scroll position
    // toward the filmstrip before the user had scrolled there themselves.
    // Only real navigation (arrows, thumbnail clicks, keyboard) should
    // trigger this, so the first run is skipped here.
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }
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
        <div
          className="relative mx-auto w-full overflow-hidden rounded-3xl border border-[var(--st-line)] bg-black shadow-[var(--st-shadow)]"
          style={{
            aspectRatio: `${ratio}`,
            maxHeight: "min(78vh, 760px)",
            maxWidth: ratio < 1 ? "min(92vw, 520px)" : "100%",
          }}
        >
          <LazyVideo
            key={active.src}
            src={active.src}
            eager
            label={active.title}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[rgba(15,13,10,0.82)] to-transparent p-5">
            <span className="text-[15px] font-medium text-white">{active.title}</span>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Open full-screen"
              className="pointer-events-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-black/40 text-white transition hover:border-[var(--st-gold-soft)]"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous clip"
          onClick={() => goTo(-1)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/90 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-left-5"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next clip"
          onClick={() => goTo(1)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/90 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-right-5"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] text-[var(--st-ink-muted)]">
        {activeIndex + 1} / {filtered.length} · tap a clip below to jump, or use the arrows
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
            className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 bg-[var(--st-sand)] transition ${
              i === activeIndex
                ? "border-[var(--st-gold)]"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <LazyVideo src={item.src} label={item.title} className="h-full w-full object-cover" />
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
            aria-label="Previous clip"
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
            <video
              key={active.src}
              src={active.src}
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label={active.title}
              className="max-h-[86vh] w-full object-contain"
              onError={(e) => {
                // A failed source here should never bubble into an uncaught
                // error / dev overlay -- just log it for debugging and close
                // the lightbox back to the (already-guarded) primary stage.
                console.error(`[MotionPortfolioGallery lightbox] video failed to load — src: ${active.src}`, e);
                setLightboxOpen(false);
              }}
            />
            <div className="flex items-center justify-between bg-[rgba(10,9,7,0.85)] px-5 py-3">
              <span className="text-[13px] font-medium text-white">{active.title}</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--st-gold-soft)]">
                {active.category.replace("motion", "").trim()}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next clip"
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
