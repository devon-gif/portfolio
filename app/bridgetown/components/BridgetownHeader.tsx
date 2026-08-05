"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/seo";

const NAV = [
  { href: "#craft", label: "The Craft" },
  { href: "#fit", label: "Strategic Fit" },
  { href: "#economics", label: "Partner Economics" },
  { href: "#work", label: "The Work" },
  { href: "#workflow", label: "How It Works" },
  { href: "#pilot", label: "The Pilot" },
];

/**
 * Sticky glass header for the /bridgetown private concept page. Adapted
 * from app/tcrm/components/TcrmHeader.tsx (same scroll-progress bar +
 * mobile-nav pattern), given its own bt-header background/logo lockup so
 * it never reads as a reskinned TCRM header.
 *
 * LOGO LOCKUP: Bridgetown's real supplied wordmark (public/bridgetown/
 * bridgetown-rms-logo.png, sourced from bridgetownrms.com) and the Archer
 * Design mark alone (public/bridgetown/archer-design-monogram.png, a
 * generic Archer asset, copied locally so this page has no dependency on
 * /tcrm's public folder). Two marks only -- there is no combined,
 * co-branded lockup, since no partnership currently exists.
 */
export function BridgetownHeader() {
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
    <header className="bt-header">
      <div className="bt-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1.5">
          <a
            href="#top"
            className="bt-logo-group"
            aria-label="Independent partnership concept for Bridgetown Revenue Management Solutions, prepared by Archer Design, top of page"
          >
            <Image
              src="/bridgetown/bridgetown-rms-logo.png"
              alt="Bridgetown Revenue Management Solutions"
              width={500}
              height={220}
              className="bt-logo-bridgetown"
              priority
            />

            <span className="bt-logo-sep" aria-hidden="true" />

            {/* Archer Design's own mark, standing alone. */}
            <Image
              src="/bridgetown/archer-design-monogram.png"
              alt="Archer Design"
              width={1000}
              height={605}
              className="bt-logo-archer"
            />
          </a>
          <p className="bt-logo-microcopy">Independent partnership concept</p>
        </div>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="bt-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bt-btn px-5 py-2.5 text-[12.5px]"
          >
            Discuss a Bridgetown pilot
          </a>
        </div>

        <button
          type="button"
          className="bt-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="bridgetown-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav id="bridgetown-mobile-nav" aria-label="Page sections" className="bt-mobile-nav border-t border-[rgba(255,255,255,0.08)] px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="bt-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bt-btn mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                Discuss a Bridgetown pilot
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="bt-progress" aria-hidden="true" />
    </header>
  );
}
