import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

/**
 * Shared navigation, contact block and footer for the /devon sub-pages, so
 * every page carries the same pill nav and closing section as the homepage.
 * Links mirror the homepage nav; project pages highlight Work.
 */

const LINKS = [
  { href: "/devon", label: "Home", key: "home" },
  { href: "/devon#work", label: "Work", key: "work" },
  { href: "/devon#ask-ai", label: "AI", key: "ai" },
  { href: "/devon#skills", label: "Skills", key: "skills" },
  { href: "/devon#about", label: "About", key: "about" },
] as const;

export type NavKey = (typeof LINKS)[number]["key"];

export function PortfolioNav({ current }: { current: NavKey }) {
  return (
    <header className={opus.nav}>
      <Link className={opus.mark} href="/devon" aria-label="Devon Archer portfolio home">
        DA
      </Link>
      <nav className={sub.navLinks} aria-label="Portfolio">
        {LINKS.map((l) => (
          <Link key={l.key} href={l.href} aria-current={l.key === current ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <Link className={opus.cta} href="/devon#contact">
        Get in touch <i>↗</i>
      </Link>
    </header>
  );
}

export function Crumb({ label }: { label: string }) {
  return (
    <p className={sub.crumb}>
      <Link href="/devon">Devon Archer</Link>
      <span aria-hidden="true">/</span>
      <span>{label}</span>
    </p>
  );
}

export function PortfolioContact({ title = "Let's build something people walk up to." }: { title?: string }) {
  return (
    <section className={opus.contact} id="contact">
      <div className={`${opus.panel} ${opus.contactMain}`}>
        <p className={opus.eyebrow}>
          <b /> Work with me
        </p>
        <h2>{title}</h2>
        <Link className={opus.pill} href="/contact">
          Start a conversation{" "}
          <i>
            <ArrowUpRight size={15} />
          </i>
        </Link>
      </div>
      <div className={opus.links}>
        <a className={opus.linkTile} href="https://github.com/devon-gif" target="_blank" rel="noreferrer">
          <span>GitHub</span>
          <ArrowUpRight />
        </a>
        <a className={opus.linkTile} href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer">
          <span>LinkedIn</span>
          <ArrowUpRight />
        </a>
        <Link className={opus.linkTile} href="/devon">
          <span>Full portfolio</span>
          <ArrowUpRight />
        </Link>
        <Link className={opus.linkTile} href="/">
          <span>Archer Design</span>
          <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}

export function PortfolioFooter() {
  return (
    <footer className={opus.footer}>
      <span>© 2026 Devon Archer</span>
      <span>Salt Lake City, Utah · Working remotely</span>
    </footer>
  );
}
