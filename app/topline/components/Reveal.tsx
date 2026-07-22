"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up-on-scroll wrapper for the /topline proposal page.
 * Mirrors the IntersectionObserver-driven reveal pattern used by
 * components/marketing/revstudio/Reveal.tsx and the CoralTree copy, but
 * kept as its own Topline-scoped component (targets .tl-reveal in
 * app/topline/topline.css) so future edits to one page never touch
 * another. CSS handles the prefers-reduced-motion override.
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
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const classes = ["tl-reveal", visible ? "is-visible" : "", delay ? `tl-reveal-d${delay}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} id={id} className={classes}>
      {children}
    </div>
  );
}
