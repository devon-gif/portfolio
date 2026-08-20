"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FirstHospitalityVideoCard } from "./FirstHospitalityVideoCard";

/**
 * Route-scoped slideshow gallery for /first-hospitality, modeled on the
 * interaction quality of components/marketing/MotionPortfolioGallery.tsx
 * (the carousel powering /social-media-work) -- large real-aspect-ratio
 * stage, prev/next controls, a slide counter, and a scrollable strip of
 * secondary navigation -- but built as its own component rather than
 * importing that shared one directly, for two reasons:
 *
 *  1. /social-media-work's carousel must never change behavior as a side
 *     effect of this page's requirements, and this page needs stricter
 *     video behavior than that component provides.
 *  2. The filmstrip in MotionPortfolioGallery mounts a real <video> (via
 *     LazyVideo) for every visible thumbnail. This gallery never mounts more
 *     than one <video> element at a time -- thumbnails/dots always render a
 *     static poster <img>/<Image>, and only the active slide gets a real
 *     video card (via the existing FirstHospitalityVideoCard, which already
 *     handles viewport-gated autoplay/pause, muted/loop/inline, poster
 *     fallback, prefers-reduced-motion, and a graceful "Preview unavailable"
 *     state on load failure -- reused here rather than duplicated).
 *
 * Used in two modes from app/first-hospitality/page.tsx: the speculative
 * "First Hospitality Custom Concepts" gallery (filters disabled, all 5
 * concepts, speculative disclaimer) and the "Existing Archer Design Work"
 * gallery (filters enabled, real client media only).
 */

export type GallerySlide = {
  id: string;
  kind: "video" | "image";
  title: string;
  subtitle?: string;
  /** Lowercase tags used for filter matching. Ignored when filters are disabled. */
  categories: string[];
  src: string;
  poster?: string;
  width: number;
  height: number;
  alt: string;
  available: boolean;
  posterAvailable: boolean;
  order: number;
};

export type GalleryFilter = { key: string; label: string };

type Props = {
  slides: GallerySlide[];
  ariaLabel: string;
  idPrefix: string;
  filters?: GalleryFilter[];
  disclaimer?: string;
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function FirstHospitalityGallery({ slides, ariaLabel, idPrefix, filters, disclaimer }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const skipInitialScrollRef = useRef(true);
  const [inView, setInView] = useState(false);

  const sorted = useMemo(() => [...slides].sort((a, b) => a.order - b.order), [slides]);

  const filtered = useMemo(() => {
    if (!filters || activeFilter === "all") return sorted;
    return sorted.filter((s) => s.categories.includes(activeFilter));
  }, [sorted, filters, activeFilter]);

  function selectFilter(key: string) {
    setActiveFilter(key);
    setActiveIndex(0);
  }

  const active = filtered[activeIndex] ?? filtered[0] ?? null;

  const goTo = useCallback(
    (dir: number) => {
      setActiveIndex((i) => {
        if (filtered.length === 0) return 0;
        return (i + dir + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  // Keep the active index in range if the filtered list shrinks/changes.
  useEffect(() => {
    if (activeIndex >= filtered.length && filtered.length > 0) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  // Auto-scroll the active thumbnail into view, skipping the very first
  // mount so the gallery never nudges the page's own scroll position on
  // load (same guard used by MotionPortfolioGallery).
  useEffect(() => {
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }
    const el = stripRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  // Keyboard arrow navigation, active only while the gallery is scrolled
  // into view -- avoids hijacking arrow keys used elsewhere on the page.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, goTo]);

  if (!active) return null;

  const ratio = active.width / active.height;
  const isPortrait = ratio < 0.95;

  return (
    <div ref={containerRef} className="fh-gallery" role="group" aria-label={ariaLabel}>
      {filters && (
        <div className="fh-gallery-filters" role="group" aria-label={`Filter ${ariaLabel}`}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => selectFilter(f.key)}
              aria-pressed={activeFilter === f.key}
              className={`fh-gallery-filter${activeFilter === f.key ? " is-active" : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="fh-gallery-stage-wrap">
        <div
          className={`fh-gallery-stage fh-media-frame${isPortrait ? " fh-gallery-stage--portrait" : ""}`}
          style={{ aspectRatio: `${ratio}` }}
        >
          <GallerySlideMedia key={active.id} slide={active} idPrefix={idPrefix} />

          <div className="fh-gallery-caption">
            <span className="fh-gallery-caption-title">{active.title}</span>
            {active.subtitle && <span className="fh-gallery-caption-subtitle">{active.subtitle}</span>}
          </div>

          <span className="fh-gallery-counter" aria-hidden="true">
            {pad2(activeIndex + 1)} / {pad2(filtered.length)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Previous, ${ariaLabel}`}
          onClick={() => goTo(-1)}
          disabled={filtered.length < 2}
          className="fh-gallery-arrow fh-gallery-arrow--prev"
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Next, ${ariaLabel}`}
          onClick={() => goTo(1)}
          disabled={filtered.length < 2}
          className="fh-gallery-arrow fh-gallery-arrow--next"
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <p className="fh-gallery-live" aria-live="polite">
        {active.title}, slide {activeIndex + 1} of {filtered.length}
      </p>

      {disclaimer && <p className="fh-concept-disclaimer fh-gallery-disclaimer">{disclaimer}</p>}

      {filtered.length > 1 && (
        <div ref={stripRef} className="fh-gallery-strip" role="tablist" aria-label={`${ariaLabel} thumbnails`}>
          {filtered.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              data-index={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show ${slide.title}`}
              onClick={() => setActiveIndex(i)}
              className={`fh-gallery-thumb${i === activeIndex ? " is-active" : ""}`}
            >
              <GallerySlideThumb slide={slide} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Primary stage media: real video for the active slide only, or a static image/poster/placeholder. */
function GallerySlideMedia({ slide, idPrefix }: { slide: GallerySlide; idPrefix: string }) {
  const label = slide.subtitle ? `${slide.title} — ${slide.subtitle}` : slide.title;

  if (slide.kind === "video") {
    if (slide.available) {
      return (
        <FirstHospitalityVideoCard
          src={slide.src}
          poster={slide.posterAvailable ? slide.poster : undefined}
          label={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      );
    }
    if (slide.posterAvailable && slide.poster) {
      return (
        <Image src={slide.poster} alt={slide.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
      );
    }
    return <GallerySlidePlaceholder slide={slide} idPrefix={idPrefix} />;
  }

  if (slide.available) {
    return <Image src={slide.src} alt={slide.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />;
  }
  return <GallerySlidePlaceholder slide={slide} idPrefix={idPrefix} />;
}

function GallerySlidePlaceholder({ slide, idPrefix }: { slide: GallerySlide; idPrefix: string }) {
  return (
    <div
      className="fh-placeholder absolute inset-0"
      role="img"
      aria-label={`Media placeholder for ${slide.title}`}
      id={`${idPrefix}-${slide.id}-placeholder`}
    >
      <div className="fh-placeholder-inner">
        <span className="fh-placeholder-eyebrow">Preview unavailable</span>
        <p className="fh-placeholder-category">{slide.title}</p>
      </div>
    </div>
  );
}

/** Thumbnail/dot media -- always a static poster image, never a second live video. */
function GallerySlideThumb({ slide }: { slide: GallerySlide }) {
  const posterSrc = slide.kind === "video" ? (slide.posterAvailable ? slide.poster : undefined) : slide.available ? slide.src : undefined;

  if (!posterSrc) {
    return <span className="fh-gallery-thumb-fallback" aria-hidden="true" />;
  }
  // eslint-disable-next-line @next/next/no-img-element -- small static thumbnail, not a primary content image
  return <img src={posterSrc} alt="" className="fh-gallery-thumb-img" />;
}
