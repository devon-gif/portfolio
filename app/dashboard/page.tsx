"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Send, Bell, BarChart2, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Company, OutreachQueueItem } from "@/lib/types";
import Link from "next/link";

interface ProspectCounts {
  follow_up_due: number;
  ready_to_email: number;
  drafted: number;
  replied: number;
  total: number;
}

interface Stats {
  companies: number;
  contacts: number;
  queued: number;
  pending_followups: number;
}

// Weekly growth reminders — manual tasks only, nothing auto-sends/posts/submits.
const GROWTH_WEEK = [
  { day: "Mon", task: "Draft one SEO page or case study", href: "/growth" },
  { day: "Tue", task: "Submit to 5 citation/directory sites", href: "/growth" },
  { day: "Wed", task: "Send 2 review requests manually", href: "/growth" },
  { day: "Thu", task: "Comment on 10 hotel posts on LinkedIn", href: "/growth" },
  { day: "Fri", task: "Email 10 hotel buyers via /daily", href: "/daily" },
];

const TODAY_DOW = new Date().getDay(); // 0 = Sunday

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ companies: 0, contacts: 0, queued: 0, pending_followups: 0 });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [queue, setQueue] = useState<OutreachQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [prospectCounts, setProspectCounts] = useState<ProspectCounts>({ follow_up_due: 0, ready_to_email: 0, drafted: 0, replied: 0, total: 0 });

  useEffect(() => {
    async function load() {
      const [
        { count: companies },
        { count: contacts },
        { count: queued },
        { count: pending_followups },
        { data: latestCompanies },
        { data: todayQueue },
        { data: allContacts },
        { data: allMsgs },
        { data: allFups },
      ] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("outreach_queue").select("*", { count: "exact", head: true }).eq("status", "queued"),
        supabase.from("followups").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("companies").select("*").order("created_at", { ascending: false }).limit(5),
        supabase
          .from("outreach_queue")
          .select("*, contacts(first_name, last_name, title, company)")
          .eq("status", "queued")
          .limit(8),
        // Prospect status counts (contacts with status-related fields)
        supabase
          .from("contacts")
          .select("id, status, email, email_opt_out, replied_at")
          .limit(1000),
        supabase
          .from("messages")
          .select("id, contact_id, status, sent_at")
          .in("status", ["draft", "needs_review", "approved", "approved_for_today", "scheduled", "sent"])
          .limit(1000),
        supabase
          .from("followups")
          .select("id, contact_id, due_date, status")
          .eq("status", "pending")
          .limit(1000),
      ]);
      setStats({
        companies: companies ?? 0,
        contacts: contacts ?? 0,
        queued: queued ?? 0,
        pending_followups: pending_followups ?? 0,
      });
      setRecentCompanies((latestCompanies as Company[]) ?? []);
      setQueue((todayQueue as OutreachQueueItem[]) ?? []);

      // Compute prospect status counts from raw data
      if (allContacts) {
        const msgs = allMsgs ?? [];
        const fups = allFups ?? [];
        const counts: ProspectCounts = { follow_up_due: 0, ready_to_email: 0, drafted: 0, replied: 0, total: allContacts.length };
        const now = new Date();
        for (const ct of allContacts) {
          const s = (ct.status ?? "").toLowerCase();
          if (["do_not_contact", "unsubscribed", "not_interested"].includes(s)) continue;
          if (ct.email_opt_out) continue;
          const cMsgs = msgs.filter((m) => m.contact_id === ct.id);
          const cFups = fups.filter((f) => f.contact_id === ct.id);
          if (ct.replied_at || cMsgs.some((m) => m.status === "replied")) { counts.replied++; continue; }
          const sentMsg = cMsgs.find((m) => m.status === "sent" || m.status === "approved_for_today");
          if (sentMsg) {
            const pending = cFups.find((f) => f.due_date);
            if (pending?.due_date && new Date(pending.due_date) <= now) { counts.follow_up_due++; }
            continue;
          }
          const draft = cMsgs.find((m) => ["draft", "needs_review", "approved", "scheduled"].includes(m.status));
          if (draft) { counts.drafted++; continue; }
          if (ct.email) { counts.ready_to_email++; }
        }
        setProspectCounts(counts);
      }

      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
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
                <Icon
                  className={`h-4 w-4 ${accent ? "text-emerald-500" : warn ? "text-amber-500" : "text-zinc-600"}`}
                />
              </div>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  loading
                    ? "text-zinc-700"
                    : accent
                    ? "text-emerald-400"
                    : warn
                    ? "text-amber-400"
                    : "text-zinc-100"
                }`}
              >
                {loading ? "—" : value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Prospects summary card */}
      <div className="mb-6 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" />
            Prospects
          </h2>
          <Link href="/prospects" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Open Prospects →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-800">
          {[
            { label: "Follow-up Due", value: prospectCounts.follow_up_due, cls: "text-orange-400" },
            { label: "Ready to Email", value: prospectCounts.ready_to_email, cls: "text-blue-400" },
            { label: "Drafted", value: prospectCounts.drafted, cls: "text-violet-400" },
            { label: "Replied", value: prospectCounts.replied, cls: "text-teal-400" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="px-5 py-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${loading ? "text-zinc-700" : cls}`}>
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent companies */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">Recent Companies</h2>
            <Link href="/companies" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {loading ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Loading…</p>
            ) : recentCompanies.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">No companies yet.</p>
            ) : (
              recentCompanies.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {c.company_type ?? "—"}
                      {c.location ? ` · ${c.location}` : ""}
                    </p>
                  </div>
                  {c.fit_score != null && (
                    <span
                      className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ring-1 ring-inset ${
                        c.fit_score >= 7
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                          : c.fit_score >= 4
                          ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                          : "bg-zinc-800 text-zinc-500 ring-zinc-700"
                      }`}
                    >
                      {c.fit_score}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's queue */}
        <div className="rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-200">Today&apos;s Queue</h2>
            <Link href="/daily" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Command Center →
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {loading ? (
              <p className="px-5 py-8 text-sm text-zinc-600 text-center">Loading…</p>
            ) : queue.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-zinc-600">Queue is empty.</p>
                <Link
                  href="/daily"
                  className="mt-2 inline-block text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Open Command Center →
                </Link>
              </div>
            ) : (
              queue.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {item.contacts
                        ? `${item.contacts.first_name} ${item.contacts.last_name}`
                        : "Unknown"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {item.contacts?.title ?? ""}
                      {item.contacts?.company ? ` · ${item.contacts.company}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-600 bg-zinc-800 rounded-full px-2 py-0.5 capitalize">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Growth & SEO ─────────────────────────────────────────────────────── */}
      {/* Weekly task reminders — manual-only, nothing here auto-sends or auto-posts */}
      <div className="mt-6 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-500" />
            Growth &amp; SEO — This Week
          </h2>
          <div className="flex items-center gap-3">
            <Link href="/growth" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Open Growth →
            </Link>
          </div>
        </div>

        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GROWTH_WEEK.map(({ day, task, href }, i) => {
            // i=0 Mon=1, i=1 Tue=2 … i=4 Fri=5
            const isToday = TODAY_DOW === i + 1;
            const isPast = TODAY_DOW > i + 1 && TODAY_DOW <= 5;
            return (
              <Link
                key={day}
                href={href}
                className={`block rounded-lg px-3 py-3 text-xs transition-colors hover:border-zinc-600 border ${
                  isToday
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : isPast
                    ? "border-zinc-700/50 bg-zinc-800/30"
                    : "border-zinc-800 bg-zinc-800/20"
                }`}
              >
                <div
                  className={`font-bold mb-1 ${isToday ? "text-emerald-400" : isPast ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {day}
                  {isToday && (
                    <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] text-emerald-400 font-medium">
                      today
                    </span>
                  )}
                </div>
                <p className={`leading-snug ${isToday ? "text-zinc-200" : isPast ? "text-zinc-600" : "text-zinc-400"}`}>
                  {task}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-zinc-800 flex flex-wrap gap-4 text-xs">
          <span className="text-zinc-600 text-[11px]">Quick links:</span>
          {[
            { label: "Growth", href: "/growth" },
            { label: "Command Center", href: "/daily" },
            { label: "Companies", href: "/companies" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "Contacts", href: "/contacts" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="text-zinc-400 hover:text-emerald-400 transition-colors">
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
