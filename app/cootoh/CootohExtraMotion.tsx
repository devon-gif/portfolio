"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const extraMotion = [
  { src: "/tcrm/videos/pancake-pour.mp4", label: "Pancake motion" },
  { src: "/tcrm/videos/breakfast-coffee-steam.mp4", label: "Breakfast motion" },
  { src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/Sushi-b6e99999.mp4", label: "Sushi experience" },
  { src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lunch-0e5b3671.mp4", label: "Lunch campaign" },
  { src: "https://j8byvflzmlnitcvt.public.blob.vercel-storage.com/tcrm-motion/lark-coastal-fnb-b9439714.mp4", label: "Coastal F&B" },
  { src: "/tcrm/videos/signature-cocktail.mp4", label: "Signature beverage" },
  { src: "/tcrm/videos/upscale-bar-close-up.mp4", label: "Beverage detail" },
  { src: "/tcrm/videos/bar-and-cocktails.mp4", label: "Restaurant & bar" },
];

export function CootohExtraMotion() {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
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
