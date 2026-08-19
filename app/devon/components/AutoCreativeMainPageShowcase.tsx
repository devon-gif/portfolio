"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { AutoCreativeMiniShowcase } from "./AutoCreativeMiniShowcase";
import styles from "./AutoCreativeMainPageShowcase.module.css";

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
      sourceLink.href = "/devon/auto";
      sourceLink.removeAttribute("target");
      sourceLink.removeAttribute("rel");
      const textNode = Array.from(sourceLink.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.textContent = "Open interactive Auto Creative OS demo ";
    }
  }, [pathname]);

  if (pathname !== "/devon" || !target) return null;

  return createPortal(
    <div className={styles.shell}>
      <div className={styles.intro}>
        <div>
          <span>WORKING DEMO / RESPONSIVE RECOMPOSITION</span>
          <h3>One approved automotive campaign becomes multiple placement-specific compositions.</h3>
        </div>
        <div>
          <p>
            Vehicle imagery, headline, offer, logo and legal stay as separate semantic roles. The live demo shows
            the same source campaign recomposed for square, story, portrait and banner placements while preserving
            hierarchy and approval constraints.
          </p>
          <a href="/devon/auto">
            Open interactive Auto Creative OS demo <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <AutoCreativeMiniShowcase />
    </div>,
    target,
  );
}
