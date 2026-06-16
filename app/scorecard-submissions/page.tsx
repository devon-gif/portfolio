"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /contacts */

// Scorecard Submissions — admin command center for the Hotel Creative
// Bandwidth Scorecard funnel. Lead scoring, copy/paste follow-ups + nurture,
// 3-Property Creative Gap Review requests, and review prep outlines.
// SAFETY: nothing here sends anything. Every message is manual copy/paste.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clipboard, ClipboardCheck, Flame, Loader2, RefreshCw, Star, Sprout, Circle,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  COMPANY_TYPES, SCORE_BANDS, STATUS_LABELS, SUBMISSION_STATUSES,
  bandForScore, leadTier, renderFollowup, type ScoreBandKey, type SubmissionStatus,
} from "@/lib/scorecard";
import { NURTURE_SEQUENCE } from "@/lib/scorecard-nurture";
import {
  GAP_REVIEW_STATUSES, GAP_REVIEW_STATUS_LABELS, gapReviewFollowup, gapReviewNextAction,
  reviewPrepOutline, type GapReview, type GapReviewStatus,
} from "@/lib/gap-review";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  website: string | null;
  linkedin_url: string | null;
  company_type: string | null;
  property_count: string | null;
  score_total: number | null;
  score_band: string | null;
  pain_points: string[] | null;
  recommended_next_step: string | null;
  lead_score: number | null;
  status: SubmissionStatus;
  follow_up_due: string | null;
  notes: string | null;
  // AI website audit + Calendly handoff fields
  audit_source: string | null;
  website_audited: string | null;
  ai_score_total: number | null;
  ai_score_band: string | null;
  ai_confidence: string | null;
  ai_summary: string | null;
  ai_strongest_gaps: string[] | null;
  ai_quick_wins: string[] | null;
  property_links: string[] | null;
  biggest_concern: string | null;
  calendly_clicked_at: string | null;
  review_requested_at: string | null;
};

const COMPANY_LABEL: Record<string, string> = Object.fromEntries(
  COMPANY_TYPES.map((c) => [c.value, c.label]),
);
const BAND_LABEL: Record<string, string> = Object.fromEntries(
  SCORE_BANDS.map((b) => [b.key, b.label]),
);

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ----------------------------- Copy button ----------------------------- */
function CopyBtn({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={clsx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-800",
        className,
      )}
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

/* ----------------------------- Lead badge ----------------------------- */
function LeadBadge({ score }: { score: number | null }) {
  const tier = leadTier(score ?? 0);
  const map = {
    hot: { cls: "bg-red-500/10 text-red-400 ring-red-500/20", Icon: Flame },
    good: { cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20", Icon: Star },
    nurture: { cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20", Icon: Sprout },
    low: { cls: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20", Icon: Circle },
  }[tier.key];
  const Icon = map.Icon;
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1", map.cls)}>
      <Icon className="h-3 w-3" />
      {tier.label} · {score ?? 0}/10
    </span>
  );
}

const STATUS_CLS: Record<string, string> = {
  new: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  reviewed: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  follow_up_sent: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
  creative_gap_review_requested: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  call_booked: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  deck_sent: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  proposal_sent: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  won: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  lost: "bg-red-500/10 text-red-400 ring-red-500/20",
  nurture: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  archived: "bg-zinc-700/20 text-zinc-500 ring-zinc-700/30",
};

export default function ScorecardSubmissionsPage() {
  const [tab, setTab] = useState<"submissions" | "reviews">("submissions");
  const [subs, setSubs] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<GapReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNurture, setShowNurture] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setSubs([]);
      setReviews([]);
      setLoading(false);
      return;
    }
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from("scorecard_submissions").select("*").order("lead_score", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("creative_gap_reviews").select("*").order("created_at", { ascending: false }),
    ]);
    setSubs((s as Submission[]) ?? []);
    setReviews((r as GapReview[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patchSub(id: string, patch: Partial<Submission>) {
    setSubs((cur) => cur.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await supabase.from("scorecard_submissions").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
  }
  async function patchReview(id: string, patch: Partial<GapReview>) {
    setReviews((cur) => cur.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await supabase.from("creative_gap_reviews").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
  }

  const stats = useMemo(() => {
    const isHot = (x: Submission) => leadTier(x.lead_score ?? 0).key === "hot";
    return {
      total: subs.length,
      newCount: subs.filter((x) => x.status === "new").length,
      hot: subs.filter(isHot).length,
      reviews: reviews.length,
      booked: subs.filter((x) => x.status === "call_booked").length + reviews.filter((x) => x.status === "call_booked").length,
      proposals: subs.filter((x) => x.status === "proposal_sent").length,
    };
  }, [subs, reviews]);

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Scorecard Submissions"
        description="Leads, lead scoring, follow-ups, and 3-Property Creative Gap Reviews. Manual copy/paste only — nothing here sends."
      />

      {/* Stat strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "New submissions", value: stats.newCount },
          { label: "Hot leads", value: stats.hot },
          { label: "Gap reviews", value: stats.reviews },
          { label: "Calls booked", value: stats.booked },
          { label: "Proposals sent", value: stats.proposals },
          { label: "All submissions", value: stats.total },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <div className="text-2xl font-semibold text-zinc-100">{s.value}</div>
            <div className="text-[11px] text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border border-zinc-800 p-0.5">
          {(["submissions", "reviews"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "rounded-md px-3 py-1.5 text-sm transition",
                tab === t ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-200",
              )}
            >
              {t === "submissions" ? `Submissions (${subs.length})` : `Gap Reviews (${reviews.length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNurture((v) => !v)} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200">
          {showNurture ? "Hide" : "Show"} nurture emails
        </button>
        <button onClick={load} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {showNurture && <NurturePanel />}

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
          Supabase isn&apos;t configured, so submissions can&apos;t be loaded. Set the Supabase
          env vars and run the migrations to see live leads here.
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : tab === "submissions" ? (
        <SubmissionsList subs={subs} expanded={expanded} setExpanded={setExpanded} patchSub={patchSub} />
      ) : (
        <ReviewsList reviews={reviews} subs={subs} expanded={expanded} setExpanded={setExpanded} patchReview={patchReview} />
      )}
    </div>
  );
}

/* ============================ Submissions ============================ */

function SubmissionsList({
  subs, expanded, setExpanded, patchSub,
}: {
  subs: Submission[];
  expanded: string | null;
  setExpanded: (v: string | null) => void;
  patchSub: (id: string, p: Partial<Submission>) => void;
}) {
  if (subs.length === 0) {
    return <p className="py-16 text-center text-sm text-zinc-600">No submissions yet. Share the scorecard on LinkedIn to start filling this in.</p>;
  }

  const QUICK: { label: string; status: SubmissionStatus }[] = [
    { label: "Reviewed", status: "reviewed" },
    { label: "Follow-up sent", status: "follow_up_sent" },
    { label: "Gap review req.", status: "creative_gap_review_requested" },
    { label: "Call booked", status: "call_booked" },
    { label: "Nurture", status: "nurture" },
    { label: "Archive", status: "archived" },
  ];

  return (
    <div className="space-y-2.5">
      {subs.map((s) => {
        const band = (s.score_band as ScoreBandKey) || (s.score_total != null ? bandForScore(s.score_total).key : "stretched");
        const isOpen = expanded === s.id;
        const followup = renderFollowup({
          band, name: s.name, company: s.company ?? "", score: s.score_total ?? 0, gaps: s.pain_points ?? [],
        });
        return (
          <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
            <button onClick={() => setExpanded(isOpen ? null : s.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-100">{s.name}</span>
                  <span className="text-sm text-zinc-500">{s.company || "—"}</span>
                  <LeadBadge score={s.lead_score} />
                  {s.audit_source === "ai" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-300 ring-1 ring-violet-500/20">
                      ✨ AI audit{s.ai_confidence ? ` · ${s.ai_confidence}` : ""}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
                  <span>{s.role || "—"}</span>
                  <span>· {s.company_type ? COMPANY_LABEL[s.company_type] ?? s.company_type : "—"}</span>
                  <span>· {s.property_count || "—"} properties</span>
                  <span>· {fmtDate(s.created_at)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-zinc-100">{s.score_total ?? "—"}<span className="text-xs text-zinc-600">/100</span></div>
                <div className="text-[11px] text-zinc-500">{BAND_LABEL[band]}</div>
              </div>
              <span className={clsx("ml-2 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1", STATUS_CLS[s.status])}>
                {STATUS_LABELS[s.status]}
              </span>
            </button>

            {isOpen && (
              <div className="space-y-4 border-t border-zinc-800 px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 text-sm">
                    <Row k="Email" v={s.email} />
                    <Row k="Website" v={s.website} link />
                    <Row k="LinkedIn" v={s.linkedin_url} link />
                    <Row k="Weak areas" v={(s.pain_points ?? []).join(", ") || "—"} />
                    <Row k="Recommended next action" v={s.recommended_next_step || "—"} />
                    {s.audit_source === "ai" && (
                      <>
                        <Row k="AI score" v={s.ai_score_total != null ? `${s.ai_score_total}/100` : "—"} />
                        <Row k="AI band" v={s.ai_score_band || "—"} />
                        <Row k="AI confidence" v={s.ai_confidence || "—"} />
                        <Row k="Website audited" v={s.website_audited} link />
                        <Row k="AI strongest gaps" v={(s.ai_strongest_gaps ?? []).join(", ") || "—"} />
                        <Row k="AI quick wins" v={(s.ai_quick_wins ?? []).join(", ") || "—"} />
                        {s.ai_summary && <Row k="AI summary" v={s.ai_summary} />}
                      </>
                    )}
                    {(s.property_links?.length || s.biggest_concern) && (
                      <>
                        <Row k="Property links" v={(s.property_links ?? []).join("  ·  ") || "—"} />
                        <Row k="Biggest concern" v={s.biggest_concern || "—"} />
                      </>
                    )}
                    {(s.calendly_clicked_at || s.review_requested_at) && (
                      <>
                        <Row k="Calendly clicked" v={s.calendly_clicked_at ? fmtDate(s.calendly_clicked_at) : "—"} />
                        <Row k="Review requested" v={s.review_requested_at ? fmtDate(s.review_requested_at) : "—"} />
                      </>
                    )}
                  </div>
                  <div className="space-y-3">
                    {/* Status */}
                    <div>
                      <label className="mb-1 block text-[11px] text-zinc-500">Status</label>
                      <select
                        value={s.status}
                        onChange={(e) => patchSub(s.id, { status: e.target.value as SubmissionStatus })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                      >
                        {SUBMISSION_STATUSES.map((st) => (
                          <option key={st} value={st}>{STATUS_LABELS[st]}</option>
                        ))}
                      </select>
                    </div>
                    {/* Follow-up due */}
                    <div>
                      <label className="mb-1 block text-[11px] text-zinc-500">Follow-up due</label>
                      <input
                        type="date"
                        value={s.follow_up_due ?? ""}
                        onChange={(e) => patchSub(s.id, { follow_up_due: e.target.value || null })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                      />
                    </div>
                    {/* Notes */}
                    <div>
                      <label className="mb-1 block text-[11px] text-zinc-500">Notes</label>
                      <textarea
                        defaultValue={s.notes ?? ""}
                        onBlur={(e) => patchSub(s.id, { notes: e.target.value })}
                        className="min-h-16 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
                        placeholder="Private notes…"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick status actions */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK.map((q) => (
                    <button
                      key={q.status}
                      onClick={() => patchSub(s.id, { status: q.status })}
                      className={clsx(
                        "rounded-lg border px-2.5 py-1.5 text-[11px] transition",
                        s.status === q.status
                          ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800",
                      )}
                    >
                      Mark {q.label}
                    </button>
                  ))}
                </div>

                {/* Follow-up message */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-400">Follow-up message (band: {BAND_LABEL[band]})</span>
                    <CopyBtn text={followup} label="Copy follow-up" />
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-zinc-300">{followup}</pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
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

/* ============================ Gap Reviews ============================ */

function ReviewsList({
  reviews, subs, expanded, setExpanded, patchReview,
}: {
  reviews: GapReview[];
  subs: Submission[];
  expanded: string | null;
  setExpanded: (v: string | null) => void;
  patchReview: (id: string, p: Partial<GapReview>) => void;
}) {
  if (reviews.length === 0) {
    return <p className="py-16 text-center text-sm text-zinc-600">No gap review requests yet.</p>;
  }
  return (
    <div className="space-y-2.5">
      {reviews.map((r) => {
        const isOpen = expanded === `rv-${r.id}`;
        const linkedSub = subs.find((s) => s.id === r.linked_scorecard_submission_id);
        const prep = reviewPrepOutline(r);
        const followup = gapReviewFollowup(r);
        const props = (r.property_urls ?? []).filter(Boolean);
        return (
          <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
            <button onClick={() => setExpanded(isOpen ? null : `rv-${r.id}`)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-100">{r.name}</span>
                  <span className="text-sm text-zinc-500">{r.company || "—"}</span>
                  {linkedSub && <LeadBadge score={linkedSub.lead_score} />}
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
                    {linkedSub && (
                      <Row k="Linked scorecard" v={`${linkedSub.score_total}/100 · ${BAND_LABEL[(linkedSub.score_band as string) || ""] ?? ""}`} />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[11px] text-zinc-500">Status</label>
                      <select
                        value={r.status}
                        onChange={(e) => patchReview(r.id, { status: e.target.value as GapReviewStatus })}
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
                        onBlur={(e) => patchReview(r.id, { notes: e.target.value })}
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
  );
}

/* ============================ Nurture panel ============================ */

function NurturePanel() {
  return (
    <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-200">5-email nurture sequence</h3>
        <CopyBtn
          label="Copy all 5"
          text={NURTURE_SEQUENCE.map((e) => `EMAIL ${e.step} — ${e.name}\nSubject: ${e.subject}\n\n${e.body}`).join("\n\n———\n\n")}
        />
      </div>
      <p className="mb-3 text-[11px] text-zinc-500">Copy/paste only. Personalize [brackets] before sending. Nothing auto-sends.</p>
      <div className="space-y-2">
        {NURTURE_SEQUENCE.map((e) => (
          <details key={e.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50">
            <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm text-zinc-300">
              <span>Email {e.step}: {e.name}</span>
              <CopyBtn text={`Subject: ${e.subject}\n\n${e.body}`} />
            </summary>
            <div className="border-t border-zinc-800 px-3 py-3">
              <p className="mb-2 text-[11px] text-zinc-500">Subject: <span className="text-zinc-300">{e.subject}</span></p>
              <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-zinc-400">{e.body}</pre>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
