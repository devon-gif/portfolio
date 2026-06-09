"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Send, Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Company, OutreachQueueItem } from "@/lib/types";
import Link from "next/link";

interface Stats {
  companies: number;
  contacts: number;
  queued: number;
  pending_followups: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ companies: 0, contacts: 0, queued: 0, pending_followups: 0 });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [queue, setQueue] = useState<OutreachQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: companies },
        { count: contacts },
        { count: queued },
        { count: pending_followups },
        { data: latestCompanies },
        { data: todayQueue },
      ] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("outreach_queue").select("*", { count: "exact", head: true }).eq("status", "queued"),
        supabase.from("followups").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("companies").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("outreach_queue").select("*, contacts(first_name, last_name, title, company)").eq("status", "queued").limit(8),
      ]);
      setStats({
        companies: companies ?? 0,
        contacts: contacts ?? 0,
        queued: queued ?? 0,
        pending_followups: pending_followups ?? 0,
      });
      setRecentCompanies((latestCompanies as Company[]) ?? []);
      setQueue((todayQueue as OutreachQueueItem[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[
          { label: "Companies", value: stats.companies, icon: Building2, href: "/companies" },
          { label: "Contacts", value: stats.contacts, icon: Users, href: "/contacts" },
          { label: "Queued Outreach", value: stats.queued, icon: Send, href: "/outreach", accent: true },
          { label: "Pending Follow-ups", value: stats.pending_followups, icon: Bell, href: "/followups", warn: true },
        ].map(({ label, value, icon: Icon, href, accent, warn }) => (
          <Link key={label} href={href} className="block">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
                <Icon className={`h-4 w-4 ${accent ? "text-emerald-500" : warn ? "text-amber-500" : "text-zinc-600"}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${loading ? "text-zinc-700" : accent ? "text-emerald-400" : warn ? "text-amber-400" : "text-zinc-100"}`}>
                {loading ? "—" : value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Companies</h2>
            <Link href="/companies" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {loading ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Loading…</p>
            ) : recentCompanies.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">No companies yet.</p>
            ) : recentCompanies.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{c.company_type ?? "—"}{c.location ? ` · ${c.location}` : ""}</p>
                </div>
                {c.fit_score != null && (
                  <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ring-1 ring-inset ${c.fit_score >= 7 ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : c.fit_score >= 4 ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" : "bg-zinc-800 text-zinc-500 ring-zinc-700"}`}>
                    {c.fit_score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">Today&apos;s Queue</h2>
            <Link href="/outreach" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Manage →</Link>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {loading ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Loading…</p>
            ) : queue.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Queue is empty.</p>
            ) : queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {item.contacts ? `${item.contacts.first_name} ${item.contacts.last_name}` : "Unknown"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {item.contacts?.title ?? ""}{item.contacts?.company ? ` · ${item.contacts.company}` : ""}
                  </p>
                </div>
                <span className="text-xs text-zinc-600 bg-zinc-800 rounded-full px-2 py-0.5 capitalize">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
