"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./AutoCreativeMainPageShowcase.module.css";

const LIVE_DEMO = "https://auto-creative-os.vercel.app/auto";
const LIVE_MATRIX = "https://auto-creative-os.vercel.app/auto/visual-regression";

export function AutoCreativeMainPageShowcase() {
  const pathname = usePathname();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/devon") {
      setTarget(null);
      return;
    }

    const section = document.querySelector<HTMLElement>("#systems");
    setTarget(section);

    const sourceLink = section?.querySelector<HTMLAnchorElement>(
      'a[href="https://github.com/devon-gif/portfolio/tree/auto-creative-os/app/auto"]',
    );

    if (sourceLink) {
      sourceLink.href = LIVE_DEMO;
      sourceLink.target = "_blank";
      sourceLink.rel = "noreferrer";
      const textNode = Array.from(sourceLink.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Open live Auto Creative OS ";
    }
  }, [pathname]);

  if (pathname !== "/devon" || !target) return null;

  return createPortal(
    <div className={styles.shell}>
      <div className={styles.intro}>
        <div>
          <span>ACTUAL WORKING SYSTEM / AUTO CREATIVE OS</span>
          <h3>The real production prototype — not a recreated portfolio mockup.</h3>
        </div>
        <div>
          <p>
            This is the Auto Creative OS I built: bring in a layered PSD, separate assets, or a reference image;
            map semantic roles; choose placement families; generate responsive compositions; validate crop, legal,
            source fidelity, and overflow; then review, approve, and export.
          </p>
          <a href={LIVE_DEMO} target="_blank" rel="noreferrer">
            Open the live Auto Creative OS <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className={styles.liveFrame}>
        <div className={styles.frameBar}>
          <span>LIVE OUTPUT MATRIX / ACTUAL RENDERER</span>
          <a href={LIVE_MATRIX} target="_blank" rel="noreferrer">
            Open matrix <ArrowUpRight size={12} />
          </a>
        </div>
        <iframe
          src={LIVE_MATRIX}
          title="Auto Creative OS live placement matrix"
          loading="lazy"
          allow="clipboard-write"
        />
      </div>

      <p className={styles.note}>
        The embedded matrix is served directly from the deployed Auto Creative OS project. Open the full demo to
        walk through Source → Map → Compose → Review, including the sample automotive campaign and placement QA.
      </p>
    </div>,
    target,
  );
}
