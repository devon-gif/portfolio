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
    setTarget(document.querySelector<HTMLElement>("#systems"));
  }, [pathname]);

  if (pathname !== "/devon" || !target) return null;

  return createPortal(
    <div className={styles.shell}>
      <div className={styles.intro}>
        <div>
          <span>WORKING DEMO / RESPONSIVE RECOMPOSITION</span>
          <h3>One approved creative becomes multiple placement-specific compositions.</h3>
        </div>
        <div>
          <p>
            The system maps vehicle, headline, offer, logo, legal, and background as separate roles. Those roles
            can then recompose for square, story, portrait, and banner placements instead of blindly scaling a
            finished flat image.
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
