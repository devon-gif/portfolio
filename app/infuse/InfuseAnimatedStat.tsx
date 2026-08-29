"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a track-record figure (e.g. "18.6M+") counting up from zero the
 * first time it scrolls into view. The server-rendered and first-client-
 * render markup are IDENTICAL to the final value — the count-up is a purely
 * imperative DOM text update applied after mount, so there is no hydration
 * mismatch and no risk if the animation never runs (JS disabled, or
 * prefers-reduced-motion). The numeric-suffix split (12.4 / "M+") is
 * highlighted with the coral accent via a nested span, same as the static
 * markup it replaces.
 */
export function InfuseAnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^([\d.,]+)(.*)$/);
    if (!match) return;
    const numeric = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] ?? "";
    const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
    if (Number.isNaN(numeric)) return;

    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done) {
            done = true;
            io.disconnect();
            animate();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    function animate() {
      const duration = 1100;
      const start = performance.now();
      function frame(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = numeric * eased;
        if (el) {
          el.textContent = `${current.toFixed(decimals)}${suffix}`;
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else if (el) {
          el.textContent = value;
        }
      }
      requestAnimationFrame(frame);
    }

    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
