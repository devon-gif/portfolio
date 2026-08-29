"use client";

import { useEffect, useRef } from "react";

/**
 * Thin fixed coral hairline at the very top of the page tracking scroll
 * progress through the document. Pure imperative DOM update on a ref (no
 * React state), throttled to animation frames, so there is no re-render
 * cost per scroll event. Skips entirely under prefers-reduced-motion —
 * matching the rest of this page's motion policy — leaving just the faint
 * static track underneath.
 */
export function InfuseScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function update() {
      ticking = false;
      const el = fillRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      el.style.width = `${pct}%`;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="infuse-scrollline" aria-hidden="true">
      <div ref={fillRef} className="infuse-scrollline-fill" />
    </div>
  );
}
