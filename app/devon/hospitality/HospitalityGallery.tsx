"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { HOSPITALITY_DESIGN_FILTERS, type HospitalityGraphic } from "./hospitality-data";
import styles from "./hospitality.module.css";

export function HospitalityGallery({ items }: { items: HospitalityGraphic[] }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const visible = filter === "all" ? items : items.filter((item) => item.groups.includes(filter));
  const current = selected === null ? null : visible[selected];

  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function step(direction: number) {
    setSelected((index) => index === null ? null : (index + direction + visible.length) % visible.length);
  }

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter hospitality design">
        {HOSPITALITY_DESIGN_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
            <span>{key === "all" ? items.length : items.filter((item) => item.groups.includes(key)).length}</span>
          </button>
        ))}
      </div>
      <p className={styles.resultCount} aria-live="polite">Showing {visible.length} designs. Select any piece to view it in full.</p>

      <div className={styles.designGrid}>
        {visible.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className={styles.designCard}
            onClick={() => { setSelected(index); dialog.current?.showModal(); }}
            aria-label={`Enlarge ${item.title}`}
          >
            <span className={styles.designImage}>
              <Image src={item.src} alt={item.title} fill sizes="(min-width: 1100px) 30vw, (min-width: 600px) 45vw, 92vw" />
              <span className={styles.enlarge} aria-hidden="true"><Maximize2 size={17} /></span>
            </span>
            <span className={styles.designCaption}>
              <span>{item.kind}</span>
              <strong>{item.title}</strong>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={titleId}
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
        }}
      >
        {current ? (
          <div className={styles.dialogContent}>
            <div className={styles.dialogBar}>
              <div><span>{current.kind}</span><h3 id={titleId}>{current.title}</h3></div>
              <button type="button" onClick={() => dialog.current?.close()} aria-label="Close design viewer" autoFocus><X size={21} /></button>
            </div>
            <div className={styles.dialogImage}>
              <Image key={current.src} src={current.src} alt={current.title} fill sizes="95vw" quality={90} />
            </div>
            <div className={styles.dialogControls}>
              <button type="button" onClick={() => step(-1)} aria-label="Previous design"><ArrowLeft size={18} /> Previous</button>
              <span>{(selected ?? 0) + 1} / {visible.length}</span>
              <button type="button" onClick={() => step(1)} aria-label="Next design">Next <ArrowRight size={18} /></button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
