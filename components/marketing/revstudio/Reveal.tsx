"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up-on-scroll wrapper, matching the HSC × Archer Design page's
 * IntersectionObserver-driven .reveal pattern (same easing/duration/stagger
 * tokens — see .rv-reveal in app/globals.css). Reveals once, then stops
 * observing. CSS handles the prefers-reduced-motion override, so this
 * component doesn't need to branch on it directly.
 */
export function Reveal({
  children,
  className,
  delay,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
  /** Forwarded to the rendered div, for in-page anchor targets. */
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy initializer (not a setState-in-effect) so environments without
  // IntersectionObserver just render already-visible, no extra render pass.
  const [visible, setVisible] = useState(() => typeof window !== "undefined" && !("IntersectionObserver" in window));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const classes = ["rv-reveal", visible ? "is-visible" : "", delay ? `rv-reveal-d${delay}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} id={id} className={classes}>
      {children}
    </div>
  );
}
