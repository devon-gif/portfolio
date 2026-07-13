"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrackedBookingLink } from "./TrackedBookingLink";

const NAV = [
  { href: "#opportunity", label: "The opportunity" },
  { href: "#model", label: "The model" },
  { href: "#practice", label: "In practice" },
  { href: "#who", label: "Who it serves" },
  { href: "#pilot", label: "The pilot" },
  { href: "#about", label: "About" },
];

/**
 * Compact partnership header, unique to /revstudio — intentionally not the
 * standard Archer Design site nav (Hotels/Restaurants/Bars/Work/Packages),
 * since this is an early, unapproved partnership page (not yet in the main
 * nav — see REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md). Keeps a subtle route back
 * to the main Archer Design site.
 */
export function JointPartnerHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--rv-line)] bg-[rgba(6,11,22,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="#top" className="flex min-w-0 items-center gap-3" aria-label="The Revstudio × Archer Design — home">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[var(--rv-line-strong)] bg-[var(--rv-navy)]">
            <Image src="/archer-preview/brand/ad-logo.png" alt="" fill sizes="32px" className="object-contain p-1" aria-hidden="true" />
          </span>
          <span className="min-w-0 truncate font-serif text-[14px] leading-tight text-[var(--rv-ink)]">
            The Revstudio <span className="text-[var(--rv-gold)]">×</span> Archer Design
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] lg:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-[var(--rv-ink-soft)] transition hover:text-[var(--rv-ink)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/" className="text-[12px] text-[var(--rv-ink-muted)] transition hover:text-[var(--rv-slate)]">
            ← Back to Archer Design
          </Link>
          <TrackedBookingLink variant="header" className="rv-btn px-5 py-2.5 text-[12.5px]">
            Discuss a pilot
          </TrackedBookingLink>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--rv-line)] text-[var(--rv-ink)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="revstudio-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="block h-[1px] w-4 bg-current before:absolute before:-mt-1.5 before:block before:h-[1px] before:w-4 before:bg-current after:absolute after:mt-1.5 after:block after:h-[1px] after:w-4 after:bg-current" />
        </button>
      </div>

      {open && (
        <nav
          id="revstudio-mobile-nav"
          aria-label="Page sections"
          className="border-t border-[var(--rv-line)] bg-[rgba(6,11,22,0.98)] px-6 py-5 lg:hidden"
        >
          <ul className="flex flex-col gap-4 text-[15px]">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[var(--rv-ink-soft)]" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/" className="text-[13px] text-[var(--rv-ink-muted)]">
              ← Back to Archer Design
            </Link>
            <TrackedBookingLink variant="header" className="rv-btn justify-center px-5 py-3 text-[13px]">
              Discuss a pilot
            </TrackedBookingLink>
          </div>
        </nav>
      )}
    </header>
  );
}
