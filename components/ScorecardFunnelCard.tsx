"use client";

// Scorecard funnel snapshot card. Drops into /creative-output (or any CRM page).
// Reads live counts from Supabase. Links into the admin command center.
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Flame, FileSearch, CalendarCheck, Bell, FileText } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { leadTier } from "@/lib/scorecard";

type Counts = {
  newSubs: number;
  hot: number;
  reviews: number;
  followUpsDue: number;
  booked: number;
  proposals: number;
};

const ZERO: Counts = { newSubs: 0, hot: 0, reviews: 0, followUpsDue: 0, booked: 0, proposals: 0 };

export function ScorecardFunnelCard() {
  const [c, setC] = useState<Counts>(ZERO);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!isSupabaseConfigured) {
        setReady(true);
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      const [subsRes, reviewsRes] = await Promise.all([
        supabase.from("scorecard_submissions").select("status, lead_score, follow_up_due"),
        supabase.from("creative_gap_reviews").select("status"),
      ]);
      if (!active) return;
      const subs = (subsRes.data as { status: string; lead_score: number | null; follow_up_due: string | null }[]) ?? [];
      const reviews = (reviewsRes.data as { status: string }[]) ?? [];
      setC({
        newSubs: subs.filter((s) => s.status === "new").length,
        hot: subs.filter((s) => leadTier(s.lead_score ?? 0).key === "hot").length,
        reviews: reviews.length,
        followUpsDue: subs.filter((s) => s.follow_up_due && s.follow_up_due <= today && !["won", "lost", "archived"].includes(s.status)).length,
        booked: subs.filter((s) => s.status === "call_booked").length + reviews.filter((r) => r.status === "call_booked").length,
        proposals: subs.filter((s) => s.status === "proposal_sent").length + reviews.filter((r) => r.status === "proposal_sent").length,
      });
      setReady(true);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const items = [
    { label: "New submissions", value: c.newSubs, Icon: ClipboardList, cls: "text-sky-400" },
    { label: "Hot leads", value: c.hot, Icon: Flame, cls: "text-red-400" },
    { label: "Gap reviews", value: c.reviews, Icon: FileSearch, cls: "text-amber-400" },
    { label: "Follow-ups due", value: c.followUpsDue, Icon: Bell, cls: "text-indigo-300" },
    { label: "Calls booked", value: c.booked, Icon: CalendarCheck, cls: "text-emerald-400" },
    { label: "Proposals sent", value: c.proposals, Icon: FileText, cls: "text-violet-400" },
  ];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Scorecard funnel</h2>
          <p className="text-[11px] text-zinc-500">Hotel Creative Bandwidth Scorecard → gap review → booked call</p>
        </div>
        <Link href="/scorecard-submissions" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800">
          Open submissions →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(({ label, value, Icon, cls }) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-3">
            <Icon className={`mb-1.5 h-4 w-4 ${cls}`} />
            <div className="text-xl font-semibold text-zinc-100">{ready ? value : "—"}</div>
            <div className="text-[11px] leading-tight text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
