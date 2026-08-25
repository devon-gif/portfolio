"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";
import {
  CalendarDays, FolderOpen, Home, Images, LifeBuoy, LogOut,
  MessageSquare, Moon, Receipt, Send, Settings, Sun,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

const THEME_KEY = "archer-portal-theme";
const THEME_EVENT = "archer-portal-theme-change";
type Theme = "light" | "dark";

/**
 * The theme's source of truth is the DOM (`data-theme` on .archer-portal),
 * which the inline script in layout.tsx sets before first paint.
 *
 * Read through useSyncExternalStore rather than mirrored into useState via an
 * effect: an effect would set state after hydration, which React flags as a
 * cascading render, and a useState initializer reading localStorage would
 * hydrate to a different value than the server rendered. This reads the value
 * React is already committed to and re-reads it when we dispatch a change.
 */
function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}
function readTheme(): Theme {
  return document.querySelector<HTMLElement>(".archer-portal")?.dataset.theme === "dark" ? "dark" : "light";
}
/** The server always renders light; the inline script corrects it before paint. */
function serverTheme(): Theme {
  return "light";
}

const NAV = [
  { href: "/portal", label: "Home", icon: Home },
  { href: "/portal/review", label: "Creative Review", icon: Images, badgeKey: "review" as const },
  { href: "/portal/calendar", label: "Content Calendar", icon: CalendarDays },
  { href: "/portal/requests", label: "Requests", icon: Send },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/files", label: "Files", icon: FolderOpen },
  { href: "/portal/billing", label: "Plan & Billing", icon: Receipt },
  { href: "/portal/settings", label: "Settings", icon: Settings },
];

/** Mobile tab bar carries the five destinations a client actually uses. */
const MOBILE_NAV = NAV.filter((n) =>
  ["/portal", "/portal/review", "/portal/messages", "/portal/requests", "/portal/billing"].includes(n.href)
);

/**
 * Client portal chrome: its own sidebar, its own theme, its own navigation.
 *
 * Deliberately shares nothing with components/Sidebar.tsx — that is the CRM's
 * dark navigation over prospects, outreach and pipeline, and a client must
 * never see it or anything shaped like it.
 *
 * Theme is stored per-browser in localStorage. There is no user-preference
 * table in this schema, and adding one for a cosmetic setting would mean a
 * migration to the live database for something that does not need to follow the
 * user across devices. If a preferences table arrives later, this is the only
 * place that reads or writes the value.
 */
export function PortalShell({
  children,
  reviewCount = 0,
  demo = false,
  wide = false,
}: {
  children: React.ReactNode;
  reviewCount?: number;
  demo?: boolean;
  wide?: boolean;
}) {
  const pathname = usePathname() ?? "/portal";
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, serverTheme);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.querySelector<HTMLElement>(".archer-portal");
    if (root) root.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode / storage blocked — the choice just won't persist */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  async function signOut() {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    window.location.assign("/portal/login");
  }

  function isCurrent(href: string) {
    if (href === "/portal") return pathname === "/portal";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="ap-app">
      <aside className="ap-side">
        <div className="ap-side-brand">
          <strong>Archer Design</strong>
          <span>Client Portal</span>
        </div>

        <nav className="ap-nav" aria-label="Client portal">
          {NAV.map(({ href, label, icon: Icon, badgeKey }) => (
            <Link key={href} href={href} aria-current={isCurrent(href) ? "page" : undefined}>
              <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
              {label}
              {badgeKey === "review" && reviewCount > 0 && (
                <span className="ap-nav-badge" aria-label={`${reviewCount} awaiting your review`}>
                  {reviewCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="ap-side-foot">
          <div className="ap-theme" role="group" aria-label="Appearance">
            <button type="button" aria-pressed={theme === "light"} onClick={() => applyTheme("light")}>
              <Sun size={13} aria-hidden="true" /> Light
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => applyTheme("dark")}>
              <Moon size={13} aria-hidden="true" /> Dark
            </button>
          </div>

          <div className="ap-side-sep" />

          <a className="ap-side-link" href="mailto:devon@archerdesign.shop">
            <LifeBuoy size={14} strokeWidth={1.9} aria-hidden="true" />
            Contact Archer Design
          </a>

          {!demo && (
            <button type="button" className="ap-side-link" onClick={signOut}>
              <LogOut size={14} strokeWidth={1.9} aria-hidden="true" />
              Sign out
            </button>
          )}
        </div>
      </aside>

      <main className={wide ? "ap-main--wide" : "ap-main"}>{children}</main>

      <nav className="ap-mobile-nav" aria-label="Client portal">
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-current={isCurrent(href) ? "page" : undefined}>
            <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
            {label.replace("Creative ", "").replace("Plan & ", "")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
