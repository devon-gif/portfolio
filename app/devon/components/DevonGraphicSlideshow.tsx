"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type GraphicItem = {
  src: string;
  alt: string;
  title: string;
  category: string;
  width: number;
  height: number;
};

type Props = {
  items: readonly GraphicItem[];
};

export function DevonGraphicSlideshow({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const skipInitialScrollRef = useRef(true);
  const active = items[activeIndex] ?? items[0];

  const goTo = useCallback(
    (direction: number) => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (skipInitialScrollRef.current) {
      skipInitialScrollRef.current = false;
      return;
    }

    const selected = stripRef.current?.querySelector(`[data-graphic-index="${activeIndex}"]`);
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
    <div className="rz-graphic-carousel">
      <div className="rz-graphic-stage">
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          sizes="(min-width: 900px) 78vw, 96vw"
          className="rz-graphic-stage-image"
        />

        <button
          type="button"
          className="rz-graphic-arrow left"
          onClick={() => goTo(-1)}
          aria-label="Previous graphic"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          className="rz-graphic-arrow right"
          onClick={() => goTo(1)}
          aria-label="Next graphic"
        >
          <ChevronRight size={20} />
        </button>

        <button
          type="button"
          className="rz-graphic-open"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open graphic full screen"
        >
          <Maximize2 size={16} />
        </button>

        <div className="rz-graphic-overlay">
          <div>
            <div className="rz-graphic-title">{active.title}</div>
            <div className="rz-graphic-meta">{active.category}</div>
          </div>
          <div className="rz-graphic-counter">
            {String(activeIndex + 1).padStart(2, "0")} / {items.length}
          </div>
        </div>
      </div>

      <div className="rz-graphic-filmstrip" ref={stripRef} aria-label="Graphic design work">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.src}
            data-graphic-index={index}
            onClick={() => setActiveIndex(index)}
            className={`rz-graphic-thumb${index === activeIndex ? " active" : ""}`}
            aria-label={`Show ${item.title}`}
            aria-current={index === activeIndex}
          >
            <Image
              src={item.src}
              alt=""
              fill
              sizes="120px"
              className="rz-graphic-thumb-image"
              aria-hidden="true"
            />
            <span className="rz-graphic-thumb-index">{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="rz-graphic-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} full screen`}
        >
          <button
            type="button"
            className="rz-graphic-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close full screen"
          >
            <X size={18} />
          </button>

          <div className="rz-graphic-lightbox-image">
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="96vw"
              className="rz-graphic-stage-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}
