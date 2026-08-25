"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./MotionDesignShowcase.module.css";

export type MotionSlide = {
  src: string;
  label: string;
  group: string;
};

export function MotionDesignSlideshow({
  items,
}: {
  items: MotionSlide[];
}) {
  const [active, setActive] = useState(0);
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const item = items[active];

  function move(direction: number) {
    if (!items.length) return;

    setActive((current) => {
      return (
        current +
        direction +
        items.length
      ) % items.length;
    });
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;

    const play = video.play();

    if (play) {
      play.catch(() => {});
    }
  }, [active]);

  if (!item) return null;

  return (
    <div className={styles.slideshow}>
      <div className={styles.stage}>
        <video
          key={item.src}
          ref={videoRef}
          src={item.src}
          className={styles.video}
          autoPlay
          muted
          playsInline
          controls
          preload="metadata"
          onEnded={() => move(1)}
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.left}`}
              onClick={() => move(-1)}
              aria-label="Previous motion example"
            >
              ←
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.right}`}
              onClick={() => move(1)}
              aria-label="Next motion example"
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

      <div className={styles.meta}>
        <div>
          <span className={styles.group}>
            {item.group}
          </span>

          <strong>{item.label}</strong>
        </div>

        <div className={styles.navigation}>
          {items.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`${styles.dot} ${
                index === active
                  ? styles.dotActive
                  : ""
              }`}
              onClick={() => setActive(index)}
              aria-label={`View motion example ${index + 1}`}
              aria-current={
                index === active
                  ? "true"
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
