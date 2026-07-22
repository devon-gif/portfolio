"use client";

import { useEffect, useState } from "react";

/**
 * Brief opening curtain for the /topline proposal: navy field, the
 * "Prepared for" kicker, the TOPLINE word, and a thin teal rule drawing
 * across — then the whole veil lifts (all timing lives in topline.css,
 * .topline-theme-intro). Fixed overlay, so zero layout shift; removed from
 * the DOM shortly after the CSS exit animation finishes. It is
 * server-rendered, so it is visible from the very first paint (before
 * hydration), and prefers-reduced-motion users never see it — the
 * stylesheet sets `display: none` on .topline-theme-intro for them.
 */
export function LoadingIntro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // CSS: content plays ~1.55s, then a 0.7s lift. Remove shortly after.
    const t = window.setTimeout(() => setDone(true), 2400);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="topline-theme-intro" aria-hidden="true">
      <div className="tl-intro-inner">
        <p className="tl-intro-kicker">Prepared for</p>
        <p className="tl-intro-word">TOPLINE</p>
        <span className="tl-intro-rule" />
      </div>
    </div>
  );
}
