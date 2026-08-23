"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { DnsStillImage } from "../dns-stills-data";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hospitality", label: "Hospitality" },
  { key: "fb", label: "F&B" },
  { key: "events", label: "Events" },
  { key: "seasonal", label: "Seasonal" },
  { key: "campaigns", label: "Campaigns" },
  { key: "brand-promo", label: "Brand & Promo" },
];

/**
 * Static/campaign gallery for /dns. Ported from the large-stage + filmstrip
 * + lightbox interaction pattern in
 * components/marketing/WorkPageStillsGallery.tsx (a shared component, left
 * completely unmodified) — this is a route-local copy restyled with
 * dns-prefixed classes against dns.css's own tokens (so it carries the DNS
 * red accent rather than the homepage's gold), with a fixed
 * All/Hospitality/F&B/Events/Seasonal/Campaigns/Brand & Promo filter order
 * instead of categories derived dynamically from the data. Shows every
 * available Archer static graphic (dns-stills-data.ts pulls the full
 * TCRM_IMAGES set, not a small curated handful) so the section proves
 * production volume, not just a sample.
 */
export function DnsStillsGallery({ items }: { items: readonly DnsStillImage[] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const filmstripRef = useRef<HTMLDivElement | null>(null);
  const skipInitialScrollRef = useRef(true);

  const filtered = useMemo(
    () => (activeFilter === "all" ? items : items.filter((i) => i.category.split(" ").includes(activeFilter))),
    [items, activeFilter]
  );

  function selectFilter(key: string) {
    setActiveFilter(key);
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
    <div className="dns-stills">
      <div className="dns-stills-filters" role="group" aria-label="Filter by category">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => selectFilter(f.key)}
            aria-pressed={activeFilter === f.key}
            className={`dns-stills-filter${activeFilter === f.key ? " is-active" : ""}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="dns-stills-stage-wrap">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${active.title} full-screen`}
          className="dns-stills-stage"
          style={{
            aspectRatio: `${ratio}`,
            maxHeight: "min(74vh, 720px)",
            maxWidth: ratio < 1 ? "min(92vw, 480px)" : "100%",
          }}
        >
          <Image key={active.src} src={active.src} alt={active.title} fill sizes="(min-width: 1024px) 860px, 92vw" className="object-cover" />
          <div className="dns-stills-stage-caption">
            <span>{active.title}</span>
          </div>
        </button>

        <button type="button" aria-label="Previous image" onClick={() => goTo(-1)} className="dns-stills-arrow dns-stills-arrow--left">
          <ChevronLeft size={20} />
        </button>
        <button type="button" aria-label="Next image" onClick={() => goTo(1)} className="dns-stills-arrow dns-stills-arrow--right">
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="dns-stills-counter">
        {activeIndex + 1} / {filtered.length} · tap the image to view full-screen
      </p>

      <div ref={filmstripRef} className="dns-stills-filmstrip">
        {filtered.map((item, i) => (
          <button
            key={item.src}
            type="button"
            data-index={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === activeIndex}
            className={`dns-stills-thumb${i === activeIndex ? " is-active" : ""}`}
          >
            <Image src={item.src} alt={item.title} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label={`${active.title} full-screen`} className="dns-stills-lightbox" onClick={() => setLightboxOpen(false)}>
          <button type="button" aria-label="Close full-screen" onClick={() => setLightboxOpen(false)} className="dns-stills-lightbox-close">
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(-1);
            }}
            className="dns-stills-lightbox-arrow dns-stills-lightbox-arrow--left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="dns-stills-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="dns-stills-lightbox-frame" style={{ aspectRatio: `${ratio}` }}>
              <Image src={active.src} alt={active.title} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="dns-stills-lightbox-meta">
              <span>{active.title}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              goTo(1);
            }}
            className="dns-stills-lightbox-arrow dns-stills-lightbox-arrow--right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
