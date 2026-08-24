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
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client-accounts", label: "Client Accounts", icon: Users },
  { href: "/prospects", label: "Prospects", icon: Target },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/followups", label: "Follow-ups", icon: Bell },
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
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-[#C9A44C]/15 bg-[linear-gradient(180deg,#17130d_0%,#0e0c09_55%,#090807_100%)] text-[#F6F1E7] shadow-[20px_0_70px_rgba(32,24,10,0.12)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(201,164,76,0.13),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_20%)]" />

      <div className="relative flex h-[74px] items-center gap-3 border-b border-[#C9A44C]/12 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C9A44C]/35 bg-[#C9A44C]/10 text-[#E8D7A2] shadow-[0_0_24px_rgba(201,164,76,0.12)]">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div>
          <div className="font-serif text-[15px] tracking-[0.01em] text-[#F6F1E7]">Archer Design</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#A99B84]">Owner workspace</div>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all",
                active
                  ? "border-[#C9A44C]/28 bg-[#F6F1E7]/8 text-[#F6F1E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.12)]"
                  : "border-transparent text-[#9F9483] hover:border-[#C9A44C]/12 hover:bg-white/[0.035] hover:text-[#E8DFD0]"
              )}
            >
              <Icon className={clsx("h-4 w-4 shrink-0 transition-colors", active ? "text-[#D4B15A]" : "text-[#776E61] group-hover:text-[#BBAA8F]")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-[#C9A44C]/12 px-2.5 py-3">
        <Link
          href="/settings"
          className={clsx(
            "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all",
            pathname === "/settings"
              ? "border-[#C9A44C]/28 bg-[#F6F1E7]/8 text-[#F6F1E7]"
              : "border-transparent text-[#9F9483] hover:bg-white/[0.035] hover:text-[#E8DFD0]"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#7F7568] transition-colors hover:bg-white/[0.035] hover:text-[#D8CCB8]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
