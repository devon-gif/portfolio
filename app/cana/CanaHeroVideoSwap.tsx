"use client";

import { useEffect } from "react";

const HERO_VIDEO = "/valencia/media/arrival-car.mp4";

/**
 * Keep the existing Cana hero markup/layout intact while swapping in the
 * stronger arrival-car motion piece for this private concept page only.
 */
export function CanaHeroVideoSwap() {
  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>(".cana-hero-video");
    if (!video || video.getAttribute("src") === HERO_VIDEO) return;

    video.src = HERO_VIDEO;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.load();
    void video.play().catch(() => {});
  }, []);

  return null;
}
