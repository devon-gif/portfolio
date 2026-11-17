"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import sub from "../subpage.module.css";

type Props = {
  links: readonly { href: string; label: string; key: string }[];
  current: string;
};

export function PortfolioMobileNav({ links, current }: Props) {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details className={sub.mobileNav} ref={menu}>
      <summary>Menu <ChevronDown size={15} aria-hidden="true" /></summary>
      <nav aria-label="Portfolio mobile navigation">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            aria-current={link.key === current ? "page" : undefined}
            onClick={() => { if (menu.current) menu.current.open = false; }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
