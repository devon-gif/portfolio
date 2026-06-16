"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /contacts */

// LinkedIn Scorecard Launch Board — a daily dashboard for MANUALLY promoting the
// Hotel Creative Bandwidth Scorecard on LinkedIn and turning interest into
// 3-Property Creative Gap Review calls.
//
// SAFETY: nothing here automates LinkedIn. No scraping, no auto-DMs, no mass
// messaging. Every message is a copy block Devon pastes himself. The tracker is
// just a manual record of human outreach.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clipboard, ClipboardCheck, Loader2, Plus, RefreshCw, ExternalLink, Link2, Trash2,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { siteConfig } from "@/lib/site-config";
import { leadTier } from "@/lib/scorecard";
import {
  ACTION_GROUPS, CONNECTION_STATUSES, EXAMPLE_TARGETS, PRIORITIES, STATUS_LABEL,
  TARGET_TYPES, TARGET_TYPE_LABEL, buildLinkedInPost, buildMessageLibrary, buildShortDM,
  nextActionFor, type ConnectionStatus, type NextAction, type Priority, type TargetType,
} from "@/lib/linkedin-launch";

type Target = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  title: string | null;
  linkedin_url: string | null;
  target_type: TargetType;
  priority: Priority;
  connection_status: ConnectionStatus;
  scorecard_sent_at: string | null;
  responded_at: string | null;
  scorecard_completed: boolean;
  creative_gap_review_requested: boolean;
  call_booked: boolean;
  notes: string | null;
  source: string | null;
  linked_scorecard_submission_id: string | null;
};

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  lead_score: number | null;
  status: string;
};

const INPUT = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-600/50";

function CopyBtn({ text, label = "Copy", primary }: { text: string; label?: string; primary?: boolean }) {
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
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] transition-colors",
        primary
          ? "bg-emerald-600/90 text-white hover:bg-emerald-600"
          : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800",
      )}
    >
      {done ? <ClipboardCheck className="h-3 w-3" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

const PRIORITY_CLS: Record<Priority, string> = {
  high: "bg-red-500/10 text-red-400 ring-red-500/20",
  medium: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  low: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
};

export default function LinkedInScorecardLaunchPage() {
  const [origin, setOrigin] = useState("");
  const [nowTs, setNowTs] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [gapReviewCount, setGapReviewCount] = useState({ requests: 0, booked: 0 });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    setNowTs(Date.now());
  }, []);

  const scorecardUrl = `${origin}${siteConfig.scorecardUrl}`;
  const gapReviewUrl = `${origin}${siteConfig.creativeGapReviewUrl}`;
  const messages = useMemo(() => buildMessageLibrary(scorecardUrl, gapReviewUrl), [scorecardUrl, gapReviewUrl]);

  const load = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    const [t, s, gr] = await Promise.all([
      supabase.from("linkedin_targets").select("*").order("created_at", { ascending: false }),
      supabase.from("scorecard_submissions").select("id, created_at, name, email, company, lead_score, status"),
      supabase.from("creative_gap_reviews").select("status"),
    ]);
    setTargets((t.data as Target[]) ?? []);
    setSubs((s.data as Submission[]) ?? []);
    const reviews = (gr.data as { status: string }[]) ?? [];
    setGapReviewCount({
      requests: reviews.length,
      booked: reviews.filter((r) => r.status === "call_booked").length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, p: Partial<Target>) {
    setTargets((cur) => cur.map((x) => (x.id === id ? { ...x, ...p } : x)));
    await supabase.from("linkedin_targets").update({ ...p, updated_at: new Date().toISOString() }).eq("id", id);
  }
  async function remove(id: string) {
    setTargets((cur) => cur.filter((x) => x.id !== id));
    await supabase.from("linkedin_targets").delete().eq("id", id);
  }

  // ── Performance snapshot ──
  const snapshot = useMemo(() => {
    const weekAgo = nowTs - 7 * 24 * 60 * 60 * 1000;
    const scSent = targets.filter(
      (t) => t.scorecard_sent_at || ["scorecard_sent", "responded", "call_booked"].includes(t.connection_status),
    ).length;
    const responded = targets.filter(
      (t) => t.responded_at || ["responded", "call_booked"].includes(t.connection_status),
    ).length;
    return {
      totalSubs: subs.length,
      newSubs: subs.filter((s) => new Date(s.created_at).getTime() >= weekAgo).length,
      hot: subs.filter((s) => leadTier(s.lead_score ?? 0).key === "hot").length,
      gapRequests: gapReviewCount.requests,
      callsBooked: gapReviewCount.booked + targets.filter((t) => t.call_booked).length,
      targetsAdded: targets.length,
      scorecardSent: scSent,
      responseRate: scSent > 0 ? Math.round((responded / scSent) * 100) : null,
    };
  }, [targets, subs, gapReviewCount, nowTs]);

  // ── Daily action queue ──
  const byAction = useMemo(() => {
    const map = new Map<NextAction, Target[]>();
    for (const t of targets) {
      const a = nextActionFor(t);
      if (a === "none") continue;
      if (!map.has(a)) map.set(a, []);
      map.get(a)!.push(t);
    }
    return map;
  }, [targets]);

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="LinkedIn Scorecard Launch Board"
        description="Manually drive scorecard traffic, track connections, and turn interest into Creative Gap Review calls. Copy/paste only — no LinkedIn automation."
        action={
          <button onClick={load} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      <p className="mb-5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs text-zinc-500">
        Reminder: no automation, no mass messaging, no auto-send. The scorecard is a helpful gut-check, not a sales trap. Always land on: <span className="text-zinc-300">Request a 3-Property Creative Gap Review</span>.
      </p>

      {/* ── 1. Scorecard Link Panel ── */}
      <section className="mb-6 rounded-xl border border-[rgba(201,164,76,0.25)] bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-100">Scorecard link panel</h2>
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
          <Link2 className="h-4 w-4 text-[#C9A44C]" />
          <code className="min-w-0 flex-1 truncate text-sm text-zinc-300">{scorecardUrl || siteConfig.scorecardUrl}</code>
          <CopyBtn text={scorecardUrl} label="Copy link" primary />
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyBtn text={buildLinkedInPost(scorecardUrl)} label="Copy LinkedIn post" />
          <CopyBtn text={buildShortDM(scorecardUrl)} label="Copy short DM" />
          <CopyBtn text={messages.find((m) => m.id === "follow_up")?.body ?? ""} label="Copy follow-up DM" />
          <CopyBtn text={gapReviewUrl} label="Copy gap review link" />
        </div>
      </section>

      {/* ── 5. Scorecard Performance Snapshot ── */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {[
            { label: "Total submissions", value: snapshot.totalSubs },
            { label: "New this week", value: snapshot.newSubs },
            { label: "Hot leads", value: snapshot.hot },
            { label: "Gap review requests", value: snapshot.gapRequests },
            { label: "Calls booked", value: snapshot.callsBooked },
            { label: "Targets added", value: snapshot.targetsAdded },
            { label: "Scorecard links sent", value: snapshot.scorecardSent },
            { label: "Response rate", value: snapshot.responseRate == null ? "—" : `${snapshot.responseRate}%` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-3">
              <div className="text-xl font-semibold text-zinc-100">{loading ? "—" : s.value}</div>
              <div className="text-[11px] leading-tight text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
          Supabase isn&apos;t configured, so targets can&apos;t be saved or loaded. Set the env vars and run the migrations.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── 3. Daily Action Queue ── */}
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100">Daily action queue</h2>
            <button onClick={() => setShowAdd((v) => !v)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">
              <Plus className="h-3.5 w-3.5" /> Add target
            </button>
          </div>

          {showAdd && <AddTargetForm onAdded={load} onClose={() => setShowAdd(false)} />}

          {loading ? (
            <div className="flex items-center gap-2 py-12 text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
          ) : targets.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-12 text-center text-sm text-zinc-600">
              No targets yet. Add hotel marketing/sales leaders, GMs, consultants, or referral partners to start.
            </p>
          ) : (
            <div className="space-y-4">
              {ACTION_GROUPS.map((g) => {
                const list = byAction.get(g.key) ?? [];
                if (list.length === 0) return null;
                return (
                  <div key={g.key} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-emerald-400">{g.label} <span className="text-zinc-600">· {list.length}</span></h3>
                      <span className="text-[11px] text-zinc-600">{g.hint}</span>
                    </div>
                    <div className="space-y-1.5">
                      {list.map((t) => (
                        <TargetRow
                          key={t.id}
                          t={t}
                          subs={subs}
                          open={expanded === t.id}
                          onToggle={() => setExpanded(expanded === t.id ? null : t.id)}
                          patch={patch}
                          remove={remove}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 4. Message Library + 8. Examples ── */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-zinc-100">Manual message library</h2>
            <div className="space-y-2">
              {messages.map((m) => (
                <details key={m.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                  <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5">
                    <span className="min-w-0 text-sm text-zinc-300">
                      <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[11px] font-semibold text-[#C9A44C]">{m.letter}</span>
                      {m.title}
                    </span>
                    <CopyBtn text={m.body} />
                  </summary>
                  <div className="border-t border-zinc-800 px-3 py-3">
                    <p className="mb-2 text-[11px] text-zinc-500">{m.whenToUse}</p>
                    <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-zinc-400">{m.body}</pre>
                  </div>
                </details>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-zinc-600">Replace {"{{name}}"} / {"{{property}}"} before sending. Read it out loud first.</p>
          </div>

          <div>
            <button onClick={() => setShowExamples((v) => !v)} className="mb-2 text-sm font-semibold text-zinc-100 hover:text-zinc-300">
              {showExamples ? "▾" : "▸"} Who to target (examples)
            </button>
            {showExamples && (
              <div className="space-y-1.5">
                {EXAMPLE_TARGETS.map((e) => (
                  <div key={e.title} className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-zinc-200">{e.title}</span>
                      <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{TARGET_TYPE_LABEL[e.type]}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-zinc-500">{e.note}</p>
                  </div>
                ))}
                <p className="text-[11px] text-zinc-600">Examples only — not saved as records. Add real people via &ldquo;Add target&rdquo;.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------------- Target row ----------------------------- */

function TargetRow({
  t, subs, open, onToggle, patch, remove,
}: {
  t: Target;
  subs: Submission[];
  open: boolean;
  onToggle: () => void;
  patch: (id: string, p: Partial<Target>) => void;
  remove: (id: string) => void;
}) {
  const linkedSub = subs.find((s) => s.id === t.linked_scorecard_submission_id);
  // Suggest matches by name/email/company for manual linking.
  const matches = subs.filter(
    (s) =>
      s.name?.toLowerCase() === t.name?.toLowerCase() ||
      (t.company && s.company && s.company.toLowerCase() === t.company.toLowerCase()),
  );

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40">
      <button onClick={onToggle} className="flex w-full items-center gap-2 px-3 py-2 text-left">
        <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-medium ring-1", PRIORITY_CLS[t.priority])}>{t.priority}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-zinc-200">
            {t.name} {t.company && <span className="text-zinc-500">· {t.company}</span>}
          </div>
          <div className="truncate text-[11px] text-zinc-500">{t.title || TARGET_TYPE_LABEL[t.target_type]} · {STATUS_LABEL[t.connection_status]}</div>
        </div>
        {t.linkedin_url && (
          <a href={t.linkedin_url.startsWith("http") ? t.linkedin_url : `https://${t.linkedin_url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 text-zinc-500 hover:text-[#0a66c2]">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </button>

      {open && (
        <div className="space-y-3 border-t border-zinc-800 px-3 py-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] text-zinc-500">Connection status</span>
              <select value={t.connection_status} onChange={(e) => patch(t.id, { connection_status: e.target.value as ConnectionStatus })} className={INPUT}>
                {CONNECTION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] text-zinc-500">Priority</span>
              <select value={t.priority} onChange={(e) => patch(t.id, { priority: e.target.value as Priority })} className={INPUT}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] text-zinc-500">Type</span>
              <select value={t.target_type} onChange={(e) => patch(t.id, { target_type: e.target.value as TargetType })} className={INPUT}>
                {TARGET_TYPES.map((tt) => <option key={tt.value} value={tt.value}>{tt.label}</option>)}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 text-[12px] text-zinc-400">
            <button onClick={() => patch(t.id, { scorecard_sent_at: t.scorecard_sent_at ? null : new Date().toISOString(), connection_status: t.scorecard_sent_at ? t.connection_status : "scorecard_sent" })} className={clsx("rounded-md border px-2 py-1", t.scorecard_sent_at ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-300" : "border-zinc-700")}>
              Scorecard sent{t.scorecard_sent_at ? " ✓" : ""}
            </button>
            <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={t.scorecard_completed} onChange={(e) => patch(t.id, { scorecard_completed: e.target.checked })} className="accent-emerald-500" /> Completed</label>
            <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={t.creative_gap_review_requested} onChange={(e) => patch(t.id, { creative_gap_review_requested: e.target.checked })} className="accent-emerald-500" /> Gap review req.</label>
            <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={t.call_booked} onChange={(e) => patch(t.id, { call_booked: e.target.checked, connection_status: e.target.checked ? "call_booked" : t.connection_status })} className="accent-emerald-500" /> Call booked</label>
            <label className="inline-flex items-center gap-1.5"><input type="checkbox" checked={!!t.responded_at} onChange={(e) => patch(t.id, { responded_at: e.target.checked ? new Date().toISOString() : null })} className="accent-emerald-500" /> Responded</label>
          </div>

          {/* Integration: link to a scorecard submission */}
          <label className="block">
            <span className="mb-1 block text-[11px] text-zinc-500">Linked scorecard submission</span>
            <select
              value={t.linked_scorecard_submission_id ?? ""}
              onChange={(e) => patch(t.id, { linked_scorecard_submission_id: e.target.value || null })}
              className={INPUT}
            >
              <option value="">— none —</option>
              {/* Suggested matches first */}
              {matches.length > 0 && (
                <optgroup label="Suggested matches">
                  {matches.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.company || s.email}</option>)}
                </optgroup>
              )}
              <optgroup label="All submissions">
                {subs.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.company || s.email}</option>)}
              </optgroup>
            </select>
            {linkedSub && <span className="mt-1 block text-[11px] text-emerald-400">Linked to {linkedSub.name} ({linkedSub.email})</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] text-zinc-500">Notes</span>
            <textarea defaultValue={t.notes ?? ""} onBlur={(e) => patch(t.id, { notes: e.target.value })} className={`${INPUT} min-h-14`} placeholder="Context, last touch, what they said…" />
          </label>

          <div className="flex justify-end">
            <button onClick={() => remove(t.id)} className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-red-400">
              <Trash2 className="h-3 w-3" /> Delete target
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Add form ----------------------------- */

function AddTargetForm({ onAdded, onClose }: { onAdded: () => void; onClose: () => void }) {
  const [f, setF] = useState({ name: "", company: "", title: "", linkedin_url: "", target_type: "direct_buyer" as TargetType, priority: "medium" as Priority, notes: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    if (!f.name.trim()) {
      setErr("Name is required.");
      return;
    }
    setSaving(true);
    setErr("");
    const { error } = await supabase.from("linkedin_targets").insert({
      name: f.name.trim(),
      company: f.company.trim() || null,
      title: f.title.trim() || null,
      linkedin_url: f.linkedin_url.trim() || null,
      target_type: f.target_type,
      priority: f.priority,
      notes: f.notes.trim() || null,
      source: "manual",
    });
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    onAdded();
    onClose();
  }

  return (
    <div className="mb-4 rounded-xl border border-zinc-700 bg-zinc-900/60 p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-200">Add LinkedIn target</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={INPUT} placeholder="Name *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={INPUT} placeholder="Company" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />
        <input className={INPUT} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input className={INPUT} placeholder="LinkedIn URL" value={f.linkedin_url} onChange={(e) => setF({ ...f, linkedin_url: e.target.value })} />
        <select className={INPUT} value={f.target_type} onChange={(e) => setF({ ...f, target_type: e.target.value as TargetType })}>
          {TARGET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className={INPUT} value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value as Priority })}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <textarea className={`${INPUT} mt-2 min-h-14`} placeholder="Notes" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      {err && <p className="mt-2 text-[12px] text-red-400">{err}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Add target
        </button>
        <button onClick={onClose} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800">Cancel</button>
      </div>
    </div>
  );
}
