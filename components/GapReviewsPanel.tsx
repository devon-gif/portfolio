"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /contacts */

// Self-contained admin panel for 3-Property Creative Gap Review requests.
// Used by /creative-gap-reviews. Manual copy/paste only — nothing here sends.
import { useCallback, useEffect, useState } from "react";
import { Clipboard, ClipboardCheck, Flame, Loader2, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { leadTier } from "@/lib/scorecard";
import {
  GAP_REVIEW_STATUSES, GAP_REVIEW_STATUS_LABELS, gapReviewFollowup, gapReviewNextAction,
  reviewPrepOutline, type GapReview, type GapReviewStatus,
} from "@/lib/gap-review";

type LinkedSub = { id: string; score_total: number | null; score_band: string | null; lead_score: number | null };

const STATUS_CLS: Record<string, string> = {
  new: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  reviewing: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  review_prepared: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
  call_requested: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  call_booked: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  proposal_sent: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  won: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  lost: "bg-red-500/10 text-red-400 ring-red-500/20",
  archived: "bg-zinc-700/20 text-zinc-500 ring-zinc-700/30",
};

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-800"
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

function Row({ k, v, link }: { k: string; v: string | null; link?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="w-40 shrink-0 text-[11px] text-zinc-500">{k}</span>
      {link && v ? (
        <a href={v.startsWith("http") ? v : `https://${v}`} target="_blank" rel="noopener noreferrer" className="break-all text-emerald-400 hover:underline">{v}</a>
      ) : (
        <span className="break-words text-zinc-300">{v || "—"}</span>
      )}
    </div>
  );
}

export function GapReviewsPanel() {
  const [reviews, setReviews] = useState<GapReview[]>([]);
  const [subs, setSubs] = useState<LinkedSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setReviews([]);
      setSubs([]);
      setLoading(false);
      return;
    }
    const [{ data: r }, { data: s }] = await Promise.all([
      supabase.from("creative_gap_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("scorecard_submissions").select("id, score_total, score_band, lead_score"),
    ]);
    setReviews((r as GapReview[]) ?? []);
    setSubs((s as LinkedSub[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, p: Partial<GapReview>) {
    setReviews((cur) => cur.map((x) => (x.id === id ? { ...x, ...p } : x)));
    await supabase.from("creative_gap_reviews").update({ ...p, updated_at: new Date().toISOString() }).eq("id", id);
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <div className="text-2xl font-semibold text-zinc-100">{reviews.length}</div>
          <div className="text-[11px] text-zinc-500">Total requests</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <div className="text-2xl font-semibold text-zinc-100">{reviews.filter((r) => r.status === "new").length}</div>
          <div className="text-[11px] text-zinc-500">New</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <div className="text-2xl font-semibold text-zinc-100">{reviews.filter((r) => r.status === "call_booked").length}</div>
          <div className="text-[11px] text-zinc-500">Calls booked</div>
        </div>
        <button onClick={load} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
          Supabase isn&apos;t configured, so requests can&apos;t be loaded. Set the env vars and run the migrations.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-600">No gap review requests yet.</p>
      ) : (
        <div className="space-y-2.5">
          {reviews.map((r) => {
            const isOpen = expanded === r.id;
            const linked = subs.find((s) => s.id === r.linked_scorecard_submission_id);
            const props = (r.property_urls ?? []).filter(Boolean);
            const prep = reviewPrepOutline(r);
            const followup = gapReviewFollowup(r);
            return (
              <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                <button onClick={() => setExpanded(isOpen ? null : r.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-zinc-100">{r.name}</span>
                      <span className="text-sm text-zinc-500">{r.company || "—"}</span>
                      {linked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400 ring-1 ring-red-500/20">
                          {leadTier(linked.lead_score ?? 0).key === "hot" && <Flame className="h-3 w-3" />}
                          {linked.score_total}/100
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {props.length} propert{props.length === 1 ? "y" : "ies"} · {r.role || "—"} · {fmtDate(r.created_at)}
                    </div>
                  </div>
                  <span className={clsx("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1", STATUS_CLS[r.status] ?? "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20")}>
                    {GAP_REVIEW_STATUS_LABELS[r.status]}
                  </span>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-zinc-800 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-600/20 bg-emerald-500/5 px-3 py-2">
                      <span className="text-[13px] text-emerald-300">
                        <span className="text-[11px] uppercase tracking-wide text-emerald-500/70">Next action · </span>
                        {gapReviewNextAction(r.status)}
                      </span>
                      <CopyBtn text={followup} label="Copy follow-up" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 text-sm">
                        <Row k="Email" v={r.email} />
                        <Row k="Website" v={r.website} link />
                        <Row k="Biggest concern" v={r.biggest_concern} />
                        <Row k="Preferred call time" v={r.preferred_call_time} />
                        {props.map((p, i) => <Row key={i} k={`Property ${i + 1}`} v={p} link />)}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-[11px] text-zinc-500">Status</label>
                          <select
                            value={r.status}
                            onChange={(e) => patch(r.id, { status: e.target.value as GapReviewStatus })}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                          >
                            {GAP_REVIEW_STATUSES.map((st) => (
                              <option key={st} value={st}>{GAP_REVIEW_STATUS_LABELS[st]}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-zinc-500">Notes</label>
                          <textarea
                            defaultValue={r.notes ?? ""}
                            onBlur={(e) => patch(r.id, { notes: e.target.value })}
                            className="min-h-16 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                            placeholder="Private notes…"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-400">Review prep outline</span>
                        <CopyBtn text={prep} label="Copy prep outline" />
                      </div>
                      <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-zinc-400">{prep}</pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
