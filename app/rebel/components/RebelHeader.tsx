"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/seo";
import { NAV_ITEMS } from "../rebel-content";

/**
 * Sticky glass header for the /rebel private concept page. Structurally
 * cloned from app/jacaruso/components/JacarusoHeader.tsx (same
 * scroll-progress bar + mobile-nav pattern), given its own rb-header
 * background/logo lockup so it never reads as a reskinned Jacaruso header.
 *
 * LOGO LOCKUP: Rebel Hotel Company's own logo file is not used here.
 * Per the brief's "don't misuse trademarks" instruction, and since no
 * Rebel-provided or independently licensed logo asset exists in this
 * project, the Rebel side of the lockup is a styled text wordmark
 * ("REBEL HOTEL COMPANY") rather than a downloaded/reproduced logo image
 * -- the same conservative choice made for the Archer Design mark, which
 * is reused directly from public/bridgetown/archer-design-monogram.png (a
 * generic, non-Rebel-specific Archer asset already used by /jacaruso).
 */
export function RebelHeader() {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = barRef.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        el.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="rb-header">
      <div className="rb-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1.5">
          <a
            href="#top"
            className="rb-logo-group"
            aria-label="Independent partnership concept for Rebel Hotel Company, prepared by Archer Design, top of page"
          >
            <span className="rb-logo-rebel">REBEL HOTEL CO.</span>
            <span className="rb-logo-sep" aria-hidden="true" />
            <Image
              src="/bridgetown/archer-design-monogram.png"
              alt="Archer Design"
              width={1000}
              height={605}
              className="rb-logo-archer"
            />
          </a>
          <p className="rb-logo-microcopy">Independent partnership concept</p>
        </div>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="rb-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rb-btn px-5 py-2.5 text-[12.5px]"
          >
            Discuss a Pilot
          </a>
        </div>

        <button
          type="button"
          className="rb-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="rebel-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav id="rebel-mobile-nav" aria-label="Page sections" className="rb-mobile-nav border-t border-[rgba(255,255,255,0.08)] px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rb-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rb-btn mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                Discuss a Pilot
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="rb-progress" aria-hidden="true" />
    </header>
  );
}
