import Image from "next/image";
import Link from "next/link";
import { CALENDLY_URL, LOGO_PATH } from "@/lib/seo";

type NavKey = "hotels" | "restaurants" | "bars" | "work" | "packages";

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: "hotels", label: "Hotels", href: "/hotels" },
  { key: "restaurants", label: "Restaurants", href: "/restaurants" },
  { key: "bars", label: "Bars", href: "/bars" },
  { key: "work", label: "Work", href: "/case-studies" },
  { key: "packages", label: "Packages", href: "/packages" },
];

/**
 * Shared light-theme site header for all Archer Studio marketing pages.
 * Pass `active` to subtly mark the current section.
 */
export function StudioHeader({ active }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--st-line-soft)] bg-[rgba(251,248,242,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Archer Design home">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[var(--st-line)] bg-white">
            <Image src={LOGO_PATH} alt="Archer Design logo" fill sizes="40px" className="object-cover" priority />
          </div>
          <div className="wordmark-font text-[1rem]">
            <span className="text-[var(--st-ink)]">Archer</span>
            <span className="text-[var(--st-gold)]">Design</span>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-[13.5px]" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`hidden md:inline transition ${
                active === item.key
                  ? "text-[var(--st-ink)]"
                  : "text-[var(--st-ink-soft)] hover:text-[var(--st-ink)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="st-btn px-5 py-2.5 text-[13px]"
          >
            Book a quick intro
          </a>
        </nav>
      </div>
    </header>
  );
}
