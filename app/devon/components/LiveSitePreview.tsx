"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LiveSitePreview.module.css";

type Props = {
  /** The live site to show. */
  src: string;
  /** Still screenshot shown while loading, off screen, and for reduced motion. */
  poster: string;
  title: string;
  /** Width the site is rendered at before scaling down, so the card shows the desktop layout. */
  desktopWidth?: number;
};

/**
 * Shows a project's real, running homepage inside a project card.
 *
 * The site is rendered at desktop width and scaled down to fit, so the card
 * shows the same layout and motion a visitor sees on a laptop. It only loads
 * while the card is on or near the screen and is removed again when the card
 * is far away, so three live sites never run at once. The preview is not
 * interactive (scrolling the page over it keeps working); clicking it opens
 * the site in a new tab.
 */
export default function LiveSitePreview({ src, poster, title, desktopWidth = 1440 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const r = root.getBoundingClientRect();
      if (!r.width) return;
      const s = r.width / desktopWidth;
      setScale(s);
      setHeight(Math.ceil(r.height / s));
    };
    // ResizeObserver reports the initial size right away, so this also does the first measurement.
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    // Respect reduced motion and data-saver: keep the still screenshot.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData) return () => ro.disconnect();

    // Load when the card comes within half a screen; unload when it is well out of view.
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setActive(true), { rootMargin: "50% 0px" });
    const far = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          setActive(false);
          setLoaded(false);
        }
      },
      { rootMargin: "150% 0px" },
    );
    near.observe(root);
    far.observe(root);
    return () => {
      ro.disconnect();
      near.disconnect();
      far.disconnect();
    };
  }, [desktopWidth]);

  return (
    <div ref={rootRef} className={styles.root}>
      <Image
        className={styles.poster}
        src={poster}
        alt={`${title} homepage`}
        fill
        sizes="(min-width: 1000px) 62vw, 94vw"
        data-hidden={loaded ? "true" : undefined}
      />
      {active && scale > 0 ? (
        <iframe
          className={styles.frame}
          src={src}
          title={`${title}, live homepage`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ width: desktopWidth, height, transform: `scale(${scale})` }}
          data-loaded={loaded ? "true" : undefined}
          onLoad={() => setLoaded(true)}
        />
      ) : null}
      <a className={styles.cover} href={src} target="_blank" rel="noreferrer" aria-label={`Open ${title} in a new tab`}>
        <span className={styles.tag}>
          <span className={styles.dot} data-live={loaded ? "true" : undefined} />
          {loaded ? "Live site" : "Screenshot"}
        </span>
        <span className={styles.open}>Open site ↗</span>
      </a>
    </div>
  );
}
