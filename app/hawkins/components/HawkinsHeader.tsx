"use client";

import { useEffect, useRef, useState } from "react";

const NAV = [
  { href: "#fit", label: "Why it fits" },
  { href: "#connect", label: "Where we connect" },
  { href: "#model", label: "Operating model" },
  { href: "#economics", label: "Economics" },
  { href: "#work", label: "Work" },
  { href: "#pilot", label: "Pilot" },
];

export function HawkinsHeader() {
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
    <header className="tl-header">
      <div className="tl-shell flex items-center justify-between gap-4 py-4">
        <a href="#top" className="min-w-0 shrink-0" aria-label="Hawkins Hospitality and Archer Design partnership concept, top of page">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Private partnership concept
          </p>
          <div className="mt-1 flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-[13px] font-semibold tracking-[0.12em] text-white sm:text-[14px]">
              HAWKINS HOSPITALITY
            </span>
            <span className="h-4 w-px bg-white/25" aria-hidden="true" />
            <span className="text-[13px] tracking-[0.08em] text-white/78 sm:text-[14px]">ARCHER DESIGN</span>
          </div>
        </a>

        <nav className="hidden items-center gap-5 text-[12px] xl:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="tl-header-nav-link whitespace-nowrap">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center xl:flex">
          <a href="#pilot" className="tl-btn px-5 py-2.5 text-[12.5px]">
            Discuss a Pilot
          </a>
        </div>

        <button
          type="button"
          className="tl-header-menu-btn flex h-9 w-9 items-center justify-center rounded-md border xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="hawkins-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav id="hawkins-mobile-nav" aria-label="Page sections" className="tl-mobile-nav border-t border-[rgba(255,255,255,0.08)] px-6 py-5 xl:hidden">
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="tl-header-nav-link" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#pilot" className="tl-btn mt-1 px-5 py-2.5 text-[13px]" onClick={() => setOpen(false)}>
                Discuss a Pilot
              </a>
            </li>
          </ul>
        </nav>
      )}

      <span ref={barRef} className="tl-progress" aria-hidden="true" />
    </header>
  );
}
