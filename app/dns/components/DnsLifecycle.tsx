"use client";

import { useEffect, useRef, useState } from "react";
import { LIFECYCLE_STAGES } from "../dns-content";

/**
 * Signature "From Built Environment to Booked Experience" lifecycle. Once the
 * section scrolls into view, a connecting line progresses through all eight
 * stages (horizontal on desktop, vertical on mobile via CSS) and each stage
 * label fades in with a short stagger — communicating the DNS → Archer
 * handoff in a few seconds, not a continuously-animating gimmick.
 *
 * Respects prefers-reduced-motion by jumping straight to the fully-progressed
 * state (handled in CSS) rather than skipping the reveal outright.
 */
export function DnsLifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`dns-lifecycle${active ? " is-active" : ""}`}>
      <div className="dns-lifecycle-track" aria-hidden="true">
        <span className="dns-lifecycle-line" />
      </div>
      <ol className="dns-lifecycle-stages">
        {LIFECYCLE_STAGES.map((stage, i) => (
          <li
            key={stage.key}
            className={`dns-lifecycle-stage dns-lifecycle-stage--${stage.owner}`}
            style={{ transitionDelay: `${0.15 + i * 0.09}s` }}
          >
            <span className="dns-lifecycle-node" aria-hidden="true" />
            <span className="dns-lifecycle-label">{stage.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
