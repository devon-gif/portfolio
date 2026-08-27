"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  DEVON_MOTION_HIGHLIGHTS,
  type DevonMotionItem,
} from "../motion-data";

type Props = {
  items?: readonly DevonMotionItem[];
  showFullLibraryLink?: boolean;
};

export function DevonMotionSlideshow({
  items = DEVON_MOTION_HIGHLIGHTS,
  showFullLibraryLink = true,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const filmstripRef = useRef<HTMLDivElement | null>(null);
  const active = items[activeIndex] ?? items[0];

  const goTo = useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [activeIndex, items.length]);

  useEffect(() => {
    const selected = filmstripRef.current?.querySelector(`[data-motion-index="${activeIndex}"]`);
    selected?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") goTo(-1);
      if (event.key === "ArrowRight") goTo(1);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, lightboxOpen]);

  if (!active) return null;

  return (
    <div className="ct-motion-carousel">
      <div className="ct-motion-stage-shell">
        <div className="ct-motion-stage">
          <video
            key={active.src}
            src={active.src}
            aria-label={active.title}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />

          <button
            type="button"
            className="ct-motion-arrow left"
            onClick={() => goTo(-1)}
            aria-label="Previous motion piece"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            className="ct-motion-arrow right"
            onClick={() => goTo(1)}
            aria-label="Next motion piece"
          >
            <ChevronRight size={20} />
          </button>

          <button
            type="button"
            className="ct-motion-open"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open motion piece full screen"
          >
            <Maximize2 size={16} />
          </button>

          <div className="ct-motion-stage-overlay">
            <div className="ct-motion-stage-copy">
              <div className="ct-motion-stage-title">{active.title}</div>
              <div className="ct-motion-stage-meta">
                {active.category.replace("motion", "").trim() || "motion study"}
              </div>
            </div>
            <div className="ct-motion-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {items.length}
            </div>
          </div>
        </div>

        <div className="ct-motion-filmstrip" ref={filmstripRef} aria-label="Motion work">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.src}
              data-motion-index={index}
              onClick={() => setActiveIndex(index)}
              className={`ct-motion-thumb${index === activeIndex ? " active" : ""}`}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex}
            >
              <video src={item.src} muted playsInline preload="none" aria-hidden="true" />
              <span className="ct-motion-thumb-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        {showFullLibraryLink && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <a href="/devon/motion" className="ct-btn-ghost">
              View the full motion library
              <ChevronRight size={15} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="ct-motion-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} full screen`}
        >
          <button
            type="button"
            className="ct-motion-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close full screen"
          >
            <X size={18} />
          </button>
          <video
            key={`lightbox-${active.src}`}
            src={active.src}
            autoPlay
            muted
            loop
            playsInline
            controls
            aria-label={active.title}
          />
        </div>
      )}
    </div>
  );
}
