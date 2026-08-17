"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type StudioMotionLibraryItem = {
  src: string;
  label: string;
  group: string;
};

type Props = {
  items: readonly StudioMotionLibraryItem[];
};

function groupLabel(group: string) {
  return group.replace(/\s*·\s*/g, " · ").trim();
}

export function StudioMotionLibrary({ items }: Props) {
  const groups = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => groupLabel(item.group))))],
    [items]
  );

  const [activeGroup, setActiveGroup] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const filtered = useMemo(() => {
    const base =
      activeGroup === "All"
        ? items
        : items.filter((item) => groupLabel(item.group) === activeGroup);

    return [...base];
  }, [items, activeGroup]);

  const active = filtered[activeIndex] ?? filtered[0] ?? null;

  const goTo = useCallback(
    (direction: number) => {
      setActiveIndex((current) => {
        if (!filtered.length) return 0;
        return (current + direction + filtered.length) % filtered.length;
      });
    },
    [filtered.length]
  );

  function chooseGroup(group: string) {
    setActiveGroup(group);
    setActiveIndex(0);
  }

  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter motion library">
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => chooseGroup(group)}
            aria-pressed={activeGroup === group}
            className={`rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.11em] transition ${
              activeGroup === group
                ? "border-[var(--st-ink)] bg-[var(--st-ink)] text-[var(--st-ivory)]"
                : "border-[var(--st-line)] text-[var(--st-ink-soft)] hover:border-[var(--st-gold)] hover:text-[var(--st-ink)]"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="relative mt-8">
        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-3xl border border-[var(--st-line)] bg-black shadow-[var(--st-shadow)]">
          <video
            key={active.src}
            src={active.src}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label={active.label}
            className="h-full w-full object-contain"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-[rgba(10,9,7,0.86)] via-[rgba(10,9,7,0.42)] to-transparent p-5 text-left">
            <div className="min-w-0">
              <span className="block truncate text-[15px] font-medium text-white">{active.label}</span>
              <span className="mt-1 block truncate text-[11px] uppercase tracking-[0.14em] text-[#e4ca8c]">
                {groupLabel(active.group)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Open motion full-screen"
              className="pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-[#e4ca8c]"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous motion example"
          onClick={() => goTo(-1)}
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/95 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-left-5"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          aria-label="Next motion example"
          onClick={() => goTo(1)}
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--st-line)] bg-white/95 p-2.5 text-[#2a2520] shadow-[var(--st-shadow-soft)] transition hover:border-[var(--st-gold)] sm:grid sm:place-items-center md:-right-5"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] text-[var(--st-ink-muted)]">
        {activeIndex + 1} / {filtered.length} · use the arrows or choose a piece below
      </p>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {filtered.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-current={index === activeIndex}
            className={`w-48 shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
              index === activeIndex
                ? "border-[var(--st-gold)] bg-white shadow-[var(--st-shadow-soft)]"
                : "border-[var(--st-line)] bg-[var(--st-ivory)] hover:border-[var(--st-gold-soft)]"
            }`}
          >
            <span className="block truncate text-[12.5px] font-medium text-[var(--st-ink)]">{item.label}</span>
            <span className="mt-1 block truncate text-[10px] uppercase tracking-[0.12em] text-[var(--st-ink-muted)]">
              {groupLabel(item.group)}
            </span>
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.label} full-screen`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,17,13,0.95)] px-4 py-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close full-screen"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 p-2 text-white transition hover:border-[#e4ca8c]"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Previous motion example"
            onClick={(event) => {
              event.stopPropagation();
              goTo(-1);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:border-[#e4ca8c] sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="w-full max-w-6xl overflow-hidden rounded-2xl bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <video
              key={`fullscreen-${active.src}`}
              src={active.src}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
              aria-label={active.label}
              className="max-h-[82vh] w-full object-contain"
            />
            <div className="flex items-center justify-between gap-4 bg-[rgba(10,9,7,0.9)] px-5 py-3">
              <span className="truncate text-[13px] font-medium text-white">{active.label}</span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.13em] text-[#e4ca8c]">
                {activeIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Next motion example"
            onClick={(event) => {
              event.stopPropagation();
              goTo(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/30 p-2.5 text-white transition hover:border-[#e4ca8c] sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
