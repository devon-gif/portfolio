"use client";

import { useEffect, useState } from "react";
import styles from "./NonHotelImageSlideshow.module.css";

type Slide = {
  src: string;
  alt: string;
};

export function NonHotelImageSlideshow({
  items,
}: {
  items: Slide[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  function goTo(index: number) {
    if (!items.length) return;

    setActive(
      ((index % items.length) + items.length) %
        items.length
    );
  }

  useEffect(() => {
    if (
      paused ||
      items.length <= 1 ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) =>
        (current + 1) % items.length
      );
    }, 5500);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.stage}>
        {items.map((item, index) => (
          <div
            className={`${styles.slide} ${
              index === active
                ? styles.active
                : ""
            }`}
            aria-hidden={index !== active}
            key={item.src}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading={
                index === 0 ? "eager" : "lazy"
              }
            />
          </div>
        ))}

        {items.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              onClick={() => goTo(active - 1)}
              aria-label="Previous artwork"
            >
              ←
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={() => goTo(active + 1)}
              aria-label="Next artwork"
            >
              →
            </button>
          </>
        )}

        <div className={styles.counter}>
          {String(active + 1).padStart(2, "0")}
          <span>/</span>
          {String(items.length).padStart(2, "0")}
        </div>
      </div>

      {items.length > 1 && (
        <div className={styles.controls}>
          <div
            className={styles.dots}
            aria-label="Artwork slides"
          >
            {items.map((item, index) => (
              <button
                type="button"
                key={item.src}
                className={`${styles.dot} ${
                  index === active
                    ? styles.dotActive
                    : ""
                }`}
                onClick={() => goTo(index)}
                aria-label={`Show artwork ${
                  index + 1
                }`}
                aria-current={
                  index === active
                    ? "true"
                    : undefined
                }
              />
            ))}
          </div>

          <span className={styles.hint}>
            Selected brand, product, 3D &amp;
            digital work
          </span>
        </div>
      )}
    </div>
  );
}
