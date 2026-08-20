"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up-on-scroll wrapper for the /first-hospitality proposal page.
 * Same IntersectionObserver-driven reveal pattern used across the site's
 * other private proposal pages (see app/oxford/components/Reveal.tsx, itself
 * a port of app/tcrm/components/Reveal.tsx), kept as its own
 * /first-hospitality-scoped copy (targets .fh-reveal in
 * app/first-hospitality/first-hospitality.css) so future edits to one page
 * never touch another. CSS handles the prefers-reduced-motion override.
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

  const classes = ["fh-reveal", visible ? "is-visible" : "", delay ? `fh-reveal-d${delay}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} id={id} className={classes}>
      {children}
    </div>
  );
}
