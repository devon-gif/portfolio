"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, BookOpen } from "lucide-react";
import styles from "./illustration.module.css";

const TOTAL = 19;
const PAGE_IMAGES = Array.from({ length: TOTAL }, (_, i) =>
  "/devon/illustration/pedro/page-" + String(i + 1).padStart(2, "0") + ".jpg"
);

const CHAPTERS = [
  { page: 1, label: "Cover" },
  { page: 4, label: "Meet Pedro" },
  { page: 8, label: "Into the stars" },
  { page: 10, label: "A lost star" },
  { page: 15, label: "Back to Earth" },
  { page: 19, label: "The end" },
];

export default function BookReader() {
  const [page, setPage] = useState(1);
  const goTo = useCallback((next: number) => setPage(Math.min(TOTAL, Math.max(1, next))), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if (event.key === "ArrowRight") goTo(page + 1);
      if (event.key === "ArrowLeft") goTo(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo]);

  const src = PAGE_IMAGES[page - 1];

  return (
    <section className={styles.reader} id="read" aria-labelledby="reader-heading">
      <div className={styles.readerHeading}>
        <div>
          <p className={styles.eyebrow}>Read the complete book</p>
          <h2 id="reader-heading">A little adventure, <em>one page at a time.</em></h2>
        </div>
        <span className={styles.pageBadge}><BookOpen size={16} /> Page {page} of {TOTAL}</span>
      </div>

      <div className={styles.readerControls}>
        <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ArrowLeft size={19} /> Previous
        </button>
        <span aria-live="polite">Pedro the Star Catcher · {String(page).padStart(2, "0")} / {TOTAL}</span>
        <button type="button" onClick={() => goTo(page + 1)} disabled={page === TOTAL} aria-label="Next page">
          Next page <ArrowRight size={19} />
        </button>
      </div>

      <div className={styles.bookFrame}>
        <a href={src} target="_blank" rel="noreferrer" title="Open this page at full size">
          <Image src={src} key={src} alt={"Pedro the Star Catcher, original illustrated book page " + page + " of " + TOTAL} width={1600} height={1200} unoptimized priority={page === 1} sizes="(min-width:1100px) 1050px, 92vw" />
        </a>
        <a className={styles.openLarge} href={src} target="_blank" rel="noreferrer"><Expand size={14} /> Open full-size page</a>
      </div>

      <div className={styles.readerBottom}>
        <p>Use the arrows or your keyboard’s left/right keys to turn pages. Every page is shown in its original composition, without cropping.</p>
        <div className={styles.progressTrack} role="progressbar" aria-label="Reading progress" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={page}>
          <span style={{width:(page / TOTAL * 100) + "%"}} />
        </div>
      </div>

      <div className={styles.chapterList} aria-label="Jump to a book page">
        {CHAPTERS.map((chapter) => (
          <button key={chapter.page} type="button" className={styles.chapter} aria-current={page === chapter.page ? "page" : undefined} onClick={() => goTo(chapter.page)}>
            <span className={styles.chapterThumb}><Image src={PAGE_IMAGES[chapter.page - 1]} width={320} height={240} unoptimized alt="" sizes="(min-width:900px) 180px, 30vw" /></span>
            <span>{chapter.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
