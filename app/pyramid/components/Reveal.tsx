"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gentle fade-up-on-scroll wrapper for the /pyramid private concept page.
 * Same IntersectionObserver-driven reveal pattern used across this
 * project's other private proposal pages (see app/first-hospitality/
 * components/Reveal.tsx, app/oxford/components/Reveal.tsx), kept as its own
 * /pyramid-scoped copy (targets .pyr-reveal in app/pyramid/pyramid.css) so
 * future edits to one page never touch another. CSS handles the
 * prefers-reduced-motion override.
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

  const classes = ["pyr-reveal", visible ? "is-visible" : "", delay ? `pyr-reveal-d${delay}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} id={id} className={classes}>
      {children}
    </div>
  );
}
