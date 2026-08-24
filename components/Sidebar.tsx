"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Settings,
  MessageSquare,
  Target,
  ClipboardList,
  FileSearch,
  Share2,
  LogOut,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";

// Simplified nav — full route list still exists, just hidden from sidebar.
const NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/client-accounts", label: "Client Accounts", icon: Users },
  { href: "/prospects",  label: "Prospects",   icon: Target },
  { href: "/messages",   label: "Messages",    icon: MessageSquare },
  { href: "/followups",  label: "Follow-ups",  icon: Bell },
  { href: "/scorecard-submissions", label: "Scorecard", icon: ClipboardList },
  { href: "/creative-gap-reviews", label: "Gap Reviews", icon: FileSearch },
  { href: "/linkedin-scorecard-launch", label: "LinkedIn Launch", icon: Share2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-zinc-950 border-r border-zinc-800/60">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-zinc-800/60">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-zinc-950">H</div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">Hotel Pipeline</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings footer */}
      <div className="border-t border-zinc-800/60 px-2 py-3">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-emerald-500/10 text-emerald-400 font-medium"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-zinc-200"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
