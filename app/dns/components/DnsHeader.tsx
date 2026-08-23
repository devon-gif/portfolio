"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CONTACT_MAILTO, NAV_LOCKUP_SHORT, NAV_MICROCOPY, NAV_ITEMS, NAV_CTA } from "../dns-content";

/**
 * Private-presentation header for /dns, rebuilt to TCRM's header quality:
 * fixed, glass-on-scroll, scroll progress bar, a compact nav row, one
 * prominent rounded CTA. Never added to the main site's public navigation —
 * direct URL only, matching every other private proposal microsite in this
 * project (app/tcrm, app/first-hospitality, app/rebel).
 */
export function DnsHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
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
    <header className={`dns-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="dns-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1">
          <a href="#top" className="dns-logo-group" aria-label="DNS Industries times Archer Design, top of page">
            <span className="dns-logo-word">{NAV_LOCKUP_SHORT}</span>
          </a>
          <p className="dns-logo-microcopy">{NAV_MICROCOPY}</p>
        </div>

        <nav className="hidden items-center gap-7 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="dns-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/social-media-work" className="dns-text-link whitespace-nowrap">
            View Archer work
          </Link>
          <a href={CONTACT_MAILTO} className="dns-btn dns-btn-primary px-5 py-2.5 text-[12px]">
            {NAV_CTA}
          </a>
        </div>

        <button
          type="button"
          className="dns-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="dns-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current"
          />
        </button>
      </div>

      {open && (
        <nav id="dns-mobile-nav" aria-label="Page sections" className="dns-mobile-nav border-t px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="dns-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/social-media-work" className="dns-text-link" onClick={() => setOpen(false)}>
                View Archer work
              </Link>
            </li>
            <li>
              <a href={CONTACT_MAILTO} className="dns-btn dns-btn-primary mt-1 px-5 py-2.5 text-[13px]" onClick={() => setOpen(false)}>
                {NAV_CTA}
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="dns-progress" aria-hidden="true" />
    </header>
  );
}
