"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { DevonMotionItem } from "../motion-data";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

export type MotionGroup = { key: string; label: string; items: DevonMotionItem[] };

const PAGE = 12;

/**
 * A single clip tile. The video only starts loading once the tile is near the
 * viewport, then plays muted on hover (or while visible on touch screens).
 */
function Clip({ item, onOpen }: { item: DevonMotionItem; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        if (touch && !reduced) {
          if (entry.intersectionRatio > 0.6) void el.play().catch(() => {});
          else el.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: [0, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      className={sub.clip}
      onClick={onOpen}
      onMouseEnter={() => void ref.current?.play().catch(() => {})}
      onMouseLeave={() => ref.current?.pause()}
      aria-label={`Play ${item.title}`}
    >
      <video
        ref={ref}
        src={near ? `${item.src}#t=0.1` : undefined}
        muted
        loop
        playsInline
        preload={near ? "metadata" : "none"}
      />
      <span className={sub.clipLabel}>
        <strong>{item.title}</strong>
        <span>{item.category}</span>
      </span>
    </button>
  );
}

export function MotionLibrary({ groups }: { groups: MotionGroup[] }) {
  const [tab, setTab] = useState(groups[0]?.key ?? "");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const group = groups.find((g) => g.key === tab) ?? groups[0];
  const items = group?.items ?? [];

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const current = open === null ? null : items[open];

  return (
    <>
      <div className={sub.tabs} role="tablist" aria-label="Motion categories">
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            role="tab"
            className={sub.tab}
            aria-selected={g.key === tab}
            onClick={() => {
              setTab(g.key);
              setShown(PAGE);
            }}
          >
            {g.label}
            <small>{g.items.length}</small>
          </button>
        ))}
      </div>

      <div className={sub.videoGrid} role="tabpanel">
        {items.slice(0, shown).map((item, i) => (
          <Clip key={item.src} item={item} onOpen={() => setOpen(i)} />
        ))}
      </div>

      {shown < items.length ? (
        <div className={sub.more}>
          <button type="button" className={opus.pill} onClick={() => setShown((n) => n + PAGE)}>
            Show more ({items.length - shown} left){" "}
            <i>
              <ArrowRight size={15} />
            </i>
          </button>
        </div>
      ) : null}

      {current ? (
        <div className={sub.lightbox} role="dialog" aria-modal="true" aria-label={current.title} onClick={() => setOpen(null)}>
          <div className={sub.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <video key={current.src} src={current.src} controls autoPlay playsInline loop />
            <div className={sub.lightboxBar}>
              <div>
                <strong>{current.title}</strong>
                <br />
                <span>{current.category}</span>
              </div>
              <div className={sub.lightboxBtns}>
                <button type="button" onClick={() => step(-1)} aria-label="Previous clip">
                  <ArrowLeft size={18} />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next clip">
                  <ArrowRight size={18} />
                </button>
                <button type="button" onClick={() => setOpen(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
