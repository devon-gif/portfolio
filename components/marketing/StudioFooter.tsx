import Image from "next/image";
import Link from "next/link";
import { LOGO_PATH } from "@/lib/seo";

const LINKS = [
  { label: "Hotels", href: "/hotels" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Bars", href: "/bars" },
  { label: "Work", href: "/case-studies" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

/** Shared light-theme footer for all Archer Studio marketing pages. */
export function StudioFooter() {
  return (
    <footer className="border-t border-[var(--st-line)] px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[var(--st-line)] bg-white">
            <Image src={LOGO_PATH} alt="Archer Design logo" fill sizes="36px" className="object-cover" />
          </div>
          <div className="wordmark-font text-[0.95rem]">
            <span className="text-[var(--st-ink)]">Archer</span>
            <span className="text-[var(--st-gold)]">Design</span>
          </div>
        </div>
        <p className="max-w-2xl font-serif text-[clamp(18px,2.4vw,26px)] leading-snug text-[var(--st-ink)]">
          A remote hospitality creative studio making the assets you already have
          work harder.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[var(--st-ink-soft)]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--st-ink)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-2xl text-[12px] leading-relaxed text-[var(--st-ink-muted)]">
          Archer Design — hospitality creative, social content, short-form motion,
          and booking-support visuals for hotels, hotel groups, restaurants, bars,
          spas, and events.
        </p>
      </div>
    </footer>
  );
}
