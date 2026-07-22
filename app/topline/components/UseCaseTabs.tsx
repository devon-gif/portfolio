"use client";

import { useId, useState } from "react";
import Image from "next/image";

export interface UseCase {
  label: string;
  topline: string;
  revstudio: string;
  archer: string;
  /** Optional real work example shown above the three-part breakdown, so
   *  each scenario is grounded in an actual finished piece rather than pure
   *  text. Uses next/image (stills only — keeps this component simple and
   *  dependency-free; motion has its own dedicated gallery section). */
  media?: { src: string; alt: string; width: number; height: number };
}

/**
 * Accessible tabbed scenario panels for the /topline "in practice" section.
 * Real tab semantics (roving tabindex, arrow-key navigation, aria-selected /
 * aria-controls) rather than styled buttons. The active panel animates in
 * via .tl-tabpanel (disabled under prefers-reduced-motion in topline.css).
 */
export function UseCaseTabs({ items }: { items: UseCase[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight" ? (active + 1) % items.length : (active - 1 + items.length) % items.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  const current = items[active];

  return (
    <div>
      <div className="tl-tabs" role="tablist" aria-label="Scenario" onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.label}
            id={`${baseId}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="tl-tab"
            onClick={() => setActive(i)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        key={active}
        id={`${baseId}-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="tl-tabpanel tl-panel tl-panel--static mt-7 p-7 sm:p-9"
      >
        {current.media && (
          <div className="tl-usecase-media">
            <Image
              src={current.media.src}
              alt={current.media.alt}
              width={current.media.width}
              height={current.media.height}
              sizes="(min-width: 1024px) 900px, 92vw"
              loading="lazy"
            />
          </div>
        )}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="tl-usecase-col">
            <p className="tl-role-tag tl-role-tag--topline">Topline identifies</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{current.topline}</p>
          </div>
          <div className="tl-usecase-col tl-usecase-col--revstudio">
            <p className="tl-role-tag tl-role-tag--revstudio">The Revstudio supports</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{current.revstudio}</p>
          </div>
          <div className="tl-usecase-col tl-usecase-col--archer">
            <p className="tl-role-tag tl-role-tag--archer">Archer Design creates</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{current.archer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
