"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#work", label: "The Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#workflow", label: "Workflow" },
  { href: "#pilot", label: "Pilot" },
];

/**
 * Minimal sticky header for the /oxford private concept, modeled on the
 * /valencia private-concept nav (fixed, glass-on-scroll, brass/bronze hover
 * accent) and on app/tcrm/components/TcrmHeader.tsx's React structure.
 *
 * Lockup is the official Oxford Hotels & Resorts, LLC mark (sourced only
 * from ohrllc.com, saved locally at public/oxford/branding/) followed by
 * "x Archer Design" and the "Private Creative Concept" microcopy -- this
 * ordering and the microcopy label are deliberate so the header never reads
 * as an approved/finalized partnership lockup.
 */
export function OxfordHeader() {
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
    <header className={`ox-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="ox-shell flex items-center justify-between gap-4 py-4">
        <div className="flex min-w-0 shrink-0 flex-col gap-1.5">
          <a
            href="#top"
            className="ox-logo-group"
            aria-label="Private creative concept prepared by Archer Design for Oxford Hotels & Resorts, top of page"
          >
            <Image
              src="/oxford/branding/oxford-hotels-resorts-logo.png"
              alt="Oxford Hotels & Resorts, LLC"
              width={400}
              height={144}
              priority
              className="ox-logo-mark"
            />
            <span className="ox-logo-x" aria-hidden="true">&times;</span>
            <span className="ox-logo-word">Archer Design</span>
          </a>
          <p className="ox-logo-microcopy">Private creative concept</p>
        </div>

        <nav className="hidden items-center gap-6 text-[12.5px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="ox-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link href="/social-media-work" className="ox-btn ox-btn-primary px-5 py-2.5 text-[12.5px]">
            More Work
          </Link>
        </div>

        <button
          type="button"
          className="ox-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="oxford-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current"
          />
        </button>
      </div>

      {open && (
        <nav id="oxford-mobile-nav" aria-label="Page sections" className="ox-mobile-nav border-t px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="ox-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/social-media-work"
                className="ox-btn ox-btn-primary mt-1 px-5 py-2.5 text-[13px]"
                onClick={() => setOpen(false)}
              >
                More Work
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="ox-progress" aria-hidden="true" />
    </header>
  );
}
