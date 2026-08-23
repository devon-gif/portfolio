"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DnsVideo } from "./DnsVideo";
import { HERO_CAMPAIGN_FRAME_1, HERO_CAMPAIGN_FRAME_2, HERO_ENVIRONMENT_VIDEO } from "../dns-media";
import { HERO_VISUAL_CAPTION } from "../dns-content";

/**
 * The hero's "physical → digital" visual: one hospitality environment
 * occupies the majority of the frame, with two campaign frames appearing to
 * separate from it — the SPACE → STORY → CAMPAIGN idea the brief calls for.
 *
 * Animation is intentionally restrained: the frames ease into their offset
 * position once on mount/scroll-into-view (no continuous motion, no
 * spinning), and a thin architectural line draws in alongside them. All of
 * it is skipped for prefers-reduced-motion — frames simply render in their
 * final position with no transition.
 */
export function DnsHeroVisual() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger on the next frame so the initial (offset) state has already
    // painted once before easing to the final position.
    const raf = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={rootRef} className={`dns-hero-visual${active ? " is-active" : ""}`}>
      <div className="dns-hero-visual-environment dns-frame">
        <DnsVideo
          src={HERO_ENVIRONMENT_VIDEO}
          label="Branded hospitality environment"
          eager
          className="h-full w-full object-cover"
        />
        <svg className="dns-hero-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="0" x2="100" y2="0" />
          <line x1="0" y1="100" x2="100" y2="100" />
        </svg>
      </div>

      <div className="dns-hero-frame dns-hero-frame--1 dns-frame">
        <Image
          src={HERO_CAMPAIGN_FRAME_1.src}
          alt={HERO_CAMPAIGN_FRAME_1.alt}
          fill
          sizes="(min-width: 1024px) 22vw, 46vw"
          className="object-cover"
        />
      </div>

      <div className="dns-hero-frame dns-hero-frame--2 dns-frame">
        <Image
          src={HERO_CAMPAIGN_FRAME_2.src}
          alt={HERO_CAMPAIGN_FRAME_2.alt}
          fill
          sizes="(min-width: 1024px) 20vw, 40vw"
          className="object-cover"
        />
      </div>

      <span className="dns-hero-visual-caption">{HERO_VISUAL_CAPTION}</span>
    </div>
  );
}
