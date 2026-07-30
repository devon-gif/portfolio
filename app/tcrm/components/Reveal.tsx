"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up-on-scroll wrapper for the /tcrm proposal page. Identical
 * IntersectionObserver-driven reveal pattern used across the site's other
 * proposal pages, kept as its own /tcrm-scoped copy (targets .tl-reveal in
 * app/tcrm/tcrm.css) so future edits to one page never touch another. CSS
 * handles the prefers-reduced-motion override.
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
