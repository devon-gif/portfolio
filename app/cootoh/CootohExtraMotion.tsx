"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const SUSHI_STORY_SRC =
  "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Sushi-b6e99999.mp4";
const PREMIUM_STAGE_SRC = "/tcrm/videos/Baker.mp4";

const extraMotion = [
  { src: "/tcrm/videos/pancake-pour.mp4", label: "Pancake motion" },
  { src: "/tcrm/videos/breakfast-coffee-steam.mp4", label: "Breakfast motion" },
  { src: "/infuse/videos/floating-sushi.mp4", label: "Sushi art direction" },
  { src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lunch-0e5b3671.mp4", label: "Lunch campaign" },
  { src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lark-coastal-fnb-b9439714.mp4", label: "Coastal F&B" },
  { src: "/tcrm/videos/signature-cocktail.mp4", label: "Signature beverage" },
  { src: "/tcrm/videos/upscale-bar-close-up.mp4", label: "Beverage detail" },
  { src: "/tcrm/videos/bar-and-cocktails.mp4", label: "Restaurant & bar" },
];

function swapVideo(selector: string, src: string, removePoster = false) {
  const video = document.querySelector<HTMLVideoElement>(selector);
  if (!video) return;

  if (removePoster) video.removeAttribute("poster");
  video.src = src;
  video.load();
  void video.play().catch(() => undefined);
}

export function CootohExtraMotion() {
  const [target, setTarget] = useState<Element | null>(null);

  useLayoutEffect(() => {
    // Lead with the human chef/plating moment rather than the stylized red sushi.
    swapVideo(".cootoh-hero-video", "/infuse/videos/chef-plating.mp4", true);

    // Give the premium chef launch panel its own food-focused motion not used elsewhere on the page.
    swapVideo(".cootoh-output-stage video", PREMIUM_STAGE_SRC);

    // Use the chef lifting sushi with chopsticks for the full-bleed visual-story beat.
    swapVideo(".cootoh-motion-break video", SUSHI_STORY_SRC);

    // Keep the red-background sushi piece, but move it into the work gallery below.
    setTarget(document.querySelector(".cootoh-motion-grid"));
  }, []);

  return (
    <>
      <style>{`
        .cootoh-motion-card.card-7 { grid-column: span 4; grid-row: span 5; }
        .cootoh-motion-card.card-8 { grid-column: span 3; grid-row: span 6; }
        .cootoh-motion-card.card-9 { grid-column: span 5; grid-row: span 5; }
        .cootoh-motion-card.card-10 { grid-column: span 5; grid-row: span 6; }
        .cootoh-motion-card.card-11 { grid-column: span 4; grid-row: span 6; }
        .cootoh-motion-card.card-12 { grid-column: span 3; grid-row: span 5; }
        .cootoh-motion-card.card-13 { grid-column: span 4; grid-row: span 5; }
        .cootoh-motion-card.card-14 { grid-column: span 8; grid-row: span 5; }
        @media (max-width: 1100px) {
          .cootoh-motion-card.card-7,
          .cootoh-motion-card.card-8,
          .cootoh-motion-card.card-9,
          .cootoh-motion-card.card-10,
          .cootoh-motion-card.card-11,
          .cootoh-motion-card.card-12,
          .cootoh-motion-card.card-13,
          .cootoh-motion-card.card-14 { grid-column: auto; grid-row: auto; }
        }
        @media (max-width: 700px) {
          .cootoh-motion-card.card-7,
          .cootoh-motion-card.card-8,
          .cootoh-motion-card.card-9,
          .cootoh-motion-card.card-10,
          .cootoh-motion-card.card-11,
          .cootoh-motion-card.card-12,
          .cootoh-motion-card.card-13,
          .cootoh-motion-card.card-14 { min-height: 390px; }
        }
      `}</style>
      {target
        ? createPortal(
            <>
              {extraMotion.map((item, index) => (
                <figure className={`cootoh-motion-card card-${index + 7}`} key={item.src}>
                  <video autoPlay muted loop playsInline preload="metadata">
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </>,
            target
          )
        : null}
    </>
  );
}
