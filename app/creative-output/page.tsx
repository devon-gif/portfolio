"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /daily and /messages */

// Creative Output Sprint — 30-day premium hospitality client-acquisition
// command center. Daily work planner + copy/paste assistant.
// SAFETY: nothing on this page sends anything. LinkedIn is manual-only.
// Email sending stays in the existing approved/compliant queue (/daily, /messages).

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  Clock,
  Flag,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Target,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  REVIEW_DAYS,
  SEGMENTS,
  SPRINT_DESCRIPTION,
  SPRINT_NAME,
  SPRINT_TEMPLATES,
  phaseForDay,
  planForDay,
  sampleRuleForDay,
  targetsForDay,
  weeklyAdjustments,
  workBlocksForDay,
} from "@/lib/creative-sprint-plan";

// ── Types ─────────────────────────────────────────────────────────────────────

type Sprint = { id: string; name: string; start_date: string; status: string };

type SprintDay = {
  id: string;
  sprint_id: string;
  day_number: number;
  status: "not_started" | "in_progress" | "complete";
  post_status: "draft" | "posted" | "skipped";
  posted_url: string | null;
  asset_status: "not_started" | "in_progress" | "done" | "posted";
  asset_link: string | null;
};

type SprintTask = {
  id: string;
  sprint_day_id: string;
  title: string;
  task_type: string;
  target_count: number | null;
  timebox_minutes: number | null;
  status: "not_started" | "done" | "skipped";
  sort_order: number;
};

type Metrics = {
  comments_made: number;
  connections_sent: number;
  accepted_connections: number;
  first_dms_sent: number; // direct buyer DMs
  buyer_positive_replies: number;
  followups_sent: number;
  partner_dms_sent: number;
  partner_positive_replies: number;
  hiring_dms_sent: number;
  hiring_positive_replies: number;
  warm_intro_requests_sent: number;
  warm_intros_received: number;
  positive_replies: number; // overall (kept for back-compat)
  sample_requests: number;
  sample_packs_sent: number;
  calls_booked: number;
  pilots_sent: number;
  revenue_pipeline: number;
  notes: string;
};

const BLANK_METRICS: Metrics = {
  comments_made: 0, connections_sent: 0, accepted_connections: 0, first_dms_sent: 0,
  buyer_positive_replies: 0, followups_sent: 0, partner_dms_sent: 0, partner_positive_replies: 0,
  hiring_dms_sent: 0, hiring_positive_replies: 0, warm_intro_requests_sent: 0, warm_intros_received: 0,
  positive_replies: 0, sample_requests: 0, sample_packs_sent: 0, calls_booked: 0,
  pilots_sent: 0, revenue_pipeline: 0, notes: "",
};

type WinningMessage = {
  id: string;
  created_at: string;
  message_type: string | null;
  audience: string | null;
  message_body: string;
  result: string | null;
};

type IntroSourceLite = {
  id: string;
  name: string;
  company: string | null;
  category: string | null;
  relationship_strength: string;
  intro_quality: string;
  next_touch: string | null;
  intro_requested: boolean;
  intro_made: boolean;
};

function rate(n: number, d: number): string {
  return d > 0 ? `${Math.round((n / d) * 100)}%` : "—";
}

const GOLD = "text-[#C9A44C]";
const CARD = "rounded-xl border border-zinc-800 bg-zinc-900 p-4";

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayNumberForToday(startDate: string): number {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.min(Math.max(diff, 1), 30);
}

// ── Small components ──────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
      <Icon className={`h-4 w-4 ${GOLD}`} /> {children}
    </h2>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreativeOutputPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [days, setDays] = useState<SprintDay[]>([]);
  const [dayNumber, setDayNumber] = useState(1);
  const [tasks, setTasks] = useState<SprintTask[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(BLANK_METRICS);
  const [metricsSaved, setMetricsSaved] = useState(false);
  const [weekMetrics, setWeekMetrics] = useState<(Metrics & { sprint_day_id: string })[]>([]);
  const [dueFollowups, setDueFollowups] = useState<number | null>(null);
  const [postedUrlDraft, setPostedUrlDraft] = useState("");
  const [assetLinkDraft, setAssetLinkDraft] = useState("");
  const [winners, setWinners] = useState<WinningMessage[]>([]);
  const [winnerDraft, setWinnerDraft] = useState({ message_body: "", message_type: "dm1", audience: "direct buyer", result: "reply" });
  const [introSources, setIntroSources] = useState<IntroSourceLite[]>([]);
  const [introTablesReady, setIntroTablesReady] = useState(true);

  const plan = planForDay(dayNumber);
  const segment = SEGMENTS[plan.segmentKey];
  const targets = targetsForDay(dayNumber);
  const blocks = workBlocksForDay(dayNumber);
  const day = days.find((d) => d.day_number === dayNumber) ?? null;
  const isReviewDay = REVIEW_DAYS.has(dayNumber);

  // ── Loading ───────────────────────────────────────────────────────────────
  const loadSprint = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setNote("Supabase isn't configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: sp, error } = await supabase
      .from("creative_sprints")
      .select("id, name, start_date, status")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      setNote(error.message.includes("creative_sprints")
        ? "creative_sprints tables not found — run supabase/migrations/20260610_creative_output_sprint.sql first."
        : error.message);
      setLoading(false);
      return;
    }
    if (!sp) {
      setSprint(null);
      setLoading(false);
      return;
    }
    setSprint(sp as Sprint);
    const { data: dayRows } = await supabase
      .from("creative_sprint_days")
      .select("id, sprint_id, day_number, status, post_status, posted_url, asset_status, asset_link")
      .eq("sprint_id", (sp as Sprint).id)
      .order("day_number");
    setDays((dayRows ?? []) as SprintDay[]);
    setDayNumber(dayNumberForToday((sp as Sprint).start_date));
    setLoading(false);
  }, []);

  useEffect(() => { void loadSprint(); }, [loadSprint]);

  // Per-day data
  useEffect(() => {
    if (!day) { setTasks([]); setMetrics(BLANK_METRICS); setMetricsSaved(false); return; }
    setPostedUrlDraft(day.posted_url ?? "");
    setAssetLinkDraft(day.asset_link ?? "");
    void (async () => {
      const [tRes, mRes] = await Promise.all([
        supabase.from("creative_sprint_tasks").select("*").eq("sprint_day_id", day.id).order("sort_order"),
        supabase.from("creative_sprint_metrics").select("*").eq("sprint_day_id", day.id).maybeSingle(),
      ]);
      setTasks((tRes.data ?? []) as SprintTask[]);
      if (mRes.data) {
        const row = mRes.data as Record<string, unknown>;
        const loaded = { ...BLANK_METRICS };
        for (const k of Object.keys(BLANK_METRICS) as (keyof Metrics)[]) {
          if (k === "notes") loaded.notes = (row.notes as string) ?? "";
          else (loaded as Record<string, unknown>)[k] = Number(row[k]) || 0;
        }
        setMetrics(loaded);
        setMetricsSaved(true);
      } else {
        setMetrics(BLANK_METRICS);
        setMetricsSaved(false);
      }
    })();
  }, [day?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Weekly review data (metrics for this 5-day window)
  useEffect(() => {
    if (!isReviewDay || days.length === 0) { setWeekMetrics([]); return; }
    const windowDays = days.filter((d) => d.day_number > dayNumber - 5 && d.day_number <= dayNumber);
    if (windowDays.length === 0) return;
    void supabase
      .from("creative_sprint_metrics")
      .select("*")
      .in("sprint_day_id", windowDays.map((d) => d.id))
      .then(({ data }) => setWeekMetrics((data ?? []) as (Metrics & { sprint_day_id: string })[]));
  }, [isReviewDay, dayNumber, days]);

  // Due follow-ups from the existing followups table (graceful if empty/missing)
  useEffect(() => {
    void supabase
      .from("followups")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .lte("due_date", toISODate(new Date()))
      .then(({ count, error }) => setDueFollowups(error ? null : (count ?? 0)));
  }, []);

  // Winning messages + intro sources (graceful when migration not yet run)
  const loadWinners = useCallback(async () => {
    const { data, error } = await supabase
      .from("winning_messages")
      .select("id, created_at, message_type, audience, message_body, result")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(5);
    if (!error) setWinners((data ?? []) as WinningMessage[]);
  }, []);

  useEffect(() => {
    void loadWinners();
    void supabase
      .from("intro_sources")
      .select("id, name, company, category, relationship_strength, intro_quality, next_touch, intro_requested, intro_made")
      .order("next_touch", { ascending: true, nullsFirst: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setIntroTablesReady(false);
        else setIntroSources((data ?? []) as IntroSourceLite[]);
      });
  }, [loadWinners]);

  async function saveWinner() {
    if (!winnerDraft.message_body.trim()) { setNote("Paste the winning message first."); return; }
    setBusy("winner");
    const { error } = await supabase.from("winning_messages").insert({
      ...winnerDraft,
      source: "linkedin",
      sprint_day_id: day?.id ?? null,
    });
    setBusy("");
    if (error) setNote(`Save winner failed: ${error.message}`);
    else {
      setWinnerDraft((w) => ({ ...w, message_body: "" }));
      setNote("Saved to winning messages — the learning loop is fed.");
      await loadWinners();
    }
  }

  // ── Seeding ───────────────────────────────────────────────────────────────
  async function createSprint() {
    setBusy("seed");
    setNote(null);
    try {
      await supabase.from("creative_sprints").upsert(
        { name: SPRINT_NAME, description: SPRINT_DESCRIPTION, start_date: toISODate(new Date()), status: "active" },
        { onConflict: "name", ignoreDuplicates: true }
      );
      const { data: sp } = await supabase
        .from("creative_sprints").select("id, name, start_date, status").eq("name", SPRINT_NAME).single();
      if (!sp) throw new Error("Sprint row not found after insert.");

      const dayRows = Array.from({ length: 30 }, (_, i) => {
        const n = i + 1;
        const p = planForDay(n);
        return {
          sprint_id: sp.id,
          day_number: n,
          phase: phaseForDay(n),
          objective: p.objective,
          content_theme: p.contentTheme,
          target_segment: SEGMENTS[p.segmentKey].label,
          time_required_minutes: workBlocksForDay(n).reduce((a, b) => a + b.minutes, 0),
        };
      });
      await supabase.from("creative_sprint_days").upsert(dayRows, { onConflict: "sprint_id,day_number", ignoreDuplicates: true });

      const { data: insertedDays } = await supabase
        .from("creative_sprint_days").select("id, day_number").eq("sprint_id", sp.id);
      const taskRows = (insertedDays ?? []).flatMap((d: { id: string; day_number: number }) => {
        const p = planForDay(d.day_number);
        const base = workBlocksForDay(d.day_number).map((b, idx) => ({
          sprint_day_id: d.id,
          title: b.title,
          task_type: b.taskType,
          timebox_minutes: b.minutes,
          sort_order: idx,
        }));
        const extras = (p.extraTasks ?? []).map((t, idx) => ({
          sprint_day_id: d.id, title: t, task_type: "general", timebox_minutes: null as number | null, sort_order: 100 + idx,
        }));
        return [...base, ...extras];
      });
      for (let i = 0; i < taskRows.length; i += 100) {
        await supabase.from("creative_sprint_tasks").upsert(taskRows.slice(i, i + 100), {
          onConflict: "sprint_day_id,title", ignoreDuplicates: true,
        });
      }
      setNote("Sprint created — Day 1 starts today.");
      await loadSprint();
    } catch (e) {
      setNote(`Create failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
    }
  }

  // ── Day actions ───────────────────────────────────────────────────────────
  async function patchDay(patch: Partial<SprintDay>) {
    if (!day) return;
    const { error } = await supabase
      .from("creative_sprint_days")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", day.id);
    if (error) setNote(error.message);
    else setDays((prev) => prev.map((d) => (d.id === day.id ? { ...d, ...patch } : d)));
  }

  async function toggleTask(t: SprintTask) {
    const status = t.status === "done" ? "not_started" : "done";
    const { error } = await supabase
      .from("creative_sprint_tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", t.id);
    if (error) setNote(error.message);
    else setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
  }

  async function saveMetrics() {
    if (!day) return;
    setBusy("metrics");
    const { error } = await supabase
      .from("creative_sprint_metrics")
      .upsert({ sprint_day_id: day.id, ...metrics, updated_at: new Date().toISOString() }, { onConflict: "sprint_day_id" });
    setBusy("");
    if (error) setNote(`Metrics save failed: ${error.message}`);
    else { setMetricsSaved(true); setNote("Metrics saved."); }
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const allTasksDone = tasks.length > 0 && doneTasks === tasks.length;

  const weekStats = useMemo(() => {
    const sum = (k: keyof Metrics) => weekMetrics.reduce((a, m) => a + (Number(m[k]) || 0), 0);
    return {
      connectionsSent: sum("connections_sent"),
      accepted: sum("accepted_connections"),
      dmsSent: sum("first_dms_sent") + sum("partner_dms_sent") + sum("hiring_dms_sent"),
      buyerReplies: sum("buyer_positive_replies") || sum("positive_replies"),
      partnerReplies: sum("partner_positive_replies"),
      sampleInterest: sum("sample_requests"),
      callsBooked: sum("calls_booked"),
    };
  }, [weekMetrics]);

  function whatNext(): { title: string; detail: string } {
    if (!day) return { title: "Create the sprint", detail: "One click seeds all 30 days." };
    if (day.status === "not_started") return { title: "Start the day", detail: "Hit Start Day, then open with the 20-minute LinkedIn warm-up block." };
    if (metrics.positive_replies > 0 && targets.samplePacks > 0)
      return { title: "Positive replies in — build the sample pack or book the call", detail: "A warm signal beats more cold volume. 60–90 min max, reusable templates." };
    if (allTasksDone && !metricsSaved) return { title: "Day complete — log metrics", detail: "Fill the metrics card below so the weekly review has real numbers." };
    if (allTasksDone && metricsSaved) return { title: "Ready for tomorrow", detail: day.status !== "complete" ? "Hit Complete Day and close the laptop." : "Done. See you on the next block." };
    const nextTask = tasks.find((t) => t.status === "not_started");
    return nextTask
      ? { title: `Next block: ${nextTask.title}`, detail: `${nextTask.timebox_minutes ?? "—"} min. Check it off when done.` }
      : { title: "Work the plan", detail: "Top to bottom — the blocks are already in order." };
  }

  function copyTodaysPlan() {
    const lines = [
      `DAY ${dayNumber} OF 30 — ${phaseForDay(dayNumber)}`,
      `Objective: ${plan.objective}`,
      ``,
      `POST: ${plan.postHook}`,
      plan.postBody,
      `CTA: ${plan.cta}`,
      ``,
      `GRAPHIC: ${plan.graphicAssignment} (${plan.assetTimeboxMinutes} min, ${plan.tools.join(" / ")})`,
      ``,
      `TARGET: ${segment.label}`,
      `Personas: ${segment.personas.join(", ")}`,
      `Queries: ${segment.queries.join(" · ")}`,
      ``,
      `DO: ${targets.comments} comments · ${targets.connections} connects · ${targets.buyerDms} buyer DMs · ${targets.partnerDms} partner DMs · follow-ups: ${targets.followups}${dueFollowups !== null ? ` (${dueFollowups} due)` : ""}`,
      `SAMPLE RULE: ${sampleRuleForDay(dayNumber)}`,
      ``,
      `BLOCKS:`,
      ...blocks.map((b) => `- ${b.minutes} min — ${b.title}`),
    ];
    return lines.join("\n");
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-6 py-10 flex items-center gap-2 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading sprint…
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="px-6 py-6 max-w-3xl">
        <PageHeader title="Creative Output Sprint" description="30 days. 2–3 focused hours a day. Premium hospitality clients." />
        {note && <p className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300">{note}</p>}
        <div className={`${CARD} text-center py-12`}>
          <Rocket className={`mx-auto h-8 w-8 ${GOLD}`} />
          <h2 className="mt-4 text-lg font-semibold text-zinc-100">{SPRINT_NAME}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{SPRINT_DESCRIPTION}</p>
          <button
            onClick={createSprint}
            disabled={busy !== "" || !isSupabaseConfigured}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy === "seed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create sprint — Day 1 starts today
          </button>
          <p className="mt-3 text-[11px] text-zinc-600">Requires migration 20260610_creative_output_sprint.sql. Seeding is idempotent.</p>
        </div>
      </div>
    );
  }

  const next = whatNext();

  return (
    <div className="px-6 py-6 max-w-6xl space-y-5">
      <PageHeader
        title="Creative Output Sprint"
        description="Daily command center — what to post, who to target, what to send. All sending is manual."
        action={
          <div className="flex items-center gap-2">
            <CopyButton text={copyTodaysPlan()} label="Copy Today's Plan" />
            <button onClick={() => void loadSprint()} className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 hover:bg-zinc-800" aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {note && <p className="rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">{note}</p>}

      {/* ── Top card ── */}
      <section className="rounded-xl border border-[rgba(201,164,76,0.25)] bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setDayNumber((d) => Math.max(1, d - 1))} disabled={dayNumber <= 1} className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30" aria-label="Previous day">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <h2 className="text-xl font-semibold text-zinc-100">
                Day <span className={GOLD}>{dayNumber}</span> of 30
              </h2>
              <button onClick={() => setDayNumber((d) => Math.min(30, d + 1))} disabled={dayNumber >= 30} className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30" aria-label="Next day">
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="rounded-full border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)] px-3 py-1 text-xs font-medium text-[#E8D7A2]">
                {phaseForDay(dayNumber)}
              </span>
              {isReviewDay && (
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400 ring-1 ring-inset ring-violet-500/30">Weekly review day</span>
              )}
              {dayNumber === dayNumberForToday(sprint.start_date) && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">today</span>
              )}
            </div>
            <p className="mt-2.5 max-w-2xl text-sm text-zinc-300">{plan.objective}</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5" /> ~{Math.round(blocks.reduce((a, b) => a + b.minutes, 0) / 60 * 10) / 10}h focused work
              <span className="mx-1">·</span>
              <span className={clsx(
                "capitalize",
                day?.status === "complete" ? "text-emerald-400" : day?.status === "in_progress" ? "text-amber-400" : "text-zinc-500"
              )}>
                {(day?.status ?? "not_started").replace("_", " ")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {day?.status === "not_started" && (
              <button onClick={() => void patchDay({ status: "in_progress" })} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                <Play className="h-4 w-4" /> Start Day
              </button>
            )}
            {day?.status === "in_progress" && (
              <button onClick={() => void patchDay({ status: "complete" })} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10">
                <CheckCircle2 className="h-4 w-4" /> Complete Day
              </button>
            )}
            {day?.status === "complete" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Complete</span>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#10b981,#C9A44C)" }} />
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500">{doneTasks}/{tasks.length} tasks · {progress}%</p>
        </div>
      </section>

      {/* ── What to do next ── */}
      <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-300">→ {next.title}</p>
        <p className="mt-0.5 text-xs text-zinc-400">{next.detail}</p>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* ── Work blocks + checklist ── */}
        <section className={CARD}>
          <SectionTitle icon={Clock}>Today&apos;s work blocks</SectionTitle>
          <ul className="mt-3 space-y-1.5">
            {tasks.length > 0 ? tasks.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-zinc-800/40 px-3 py-2.5 hover:bg-zinc-800/70">
                  <input type="checkbox" checked={t.status === "done"} onChange={() => void toggleTask(t)} className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className={clsx("block text-xs", t.status === "done" ? "text-zinc-500 line-through" : "text-zinc-200")}>{t.title}</span>
                    {t.timebox_minutes && <span className="text-[10px] text-zinc-600">{t.timebox_minutes} min</span>}
                  </span>
                </label>
              </li>
            )) : (
              <li className="text-xs text-zinc-600">No tasks for this day — reseed via the Create button or check the migration.</li>
            )}
          </ul>
        </section>

        {/* ── Daily targets ── */}
        <section className={CARD}>
          <SectionTitle icon={Target}>Daily targets</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: "Comments", v: String(targets.comments) },
              { label: "Connections", v: String(targets.connections) },
              { label: "Buyer DMs", v: String(targets.buyerDms) },
              { label: "Partner DMs", v: String(targets.partnerDms) },
              { label: "Follow-ups", v: dueFollowups !== null ? `${dueFollowups} due` : targets.followups },
              { label: "Sample packs", v: String(targets.samplePacks) },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-800/50 px-3 py-2.5 text-center">
                <div className="text-lg font-semibold text-zinc-100">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] leading-relaxed text-amber-300/90">
            <Flag className="mr-1 inline h-3 w-3" /> {sampleRuleForDay(dayNumber)}
          </p>
          {dueFollowups !== null && dueFollowups > 0 && (
            <p className="mt-2 text-xs text-zinc-400">
              <Link href="/followups" className="text-emerald-400 hover:underline">{dueFollowups} follow-up{dueFollowups !== 1 ? "s" : ""} due</Link> in the CRM — clear them in the DM block.
            </p>
          )}
        </section>

        {/* ── Daily content card ── */}
        <section className={CARD}>
          <div className="flex items-start justify-between gap-2">
            <SectionTitle icon={MessageSquare}>Today&apos;s LinkedIn post</SectionTitle>
            <CopyButton text={`${plan.postHook}\n\n${plan.postBody}\n\n${plan.cta}`} label="Copy post" />
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-100">“{plan.postHook}”</p>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-zinc-400">{plan.postBody}</p>
          <p className="mt-2 text-xs text-[#E8D7A2]">CTA: {plan.cta}</p>
          <p className="mt-2 text-[11px] text-zinc-600">Media: {plan.mediaType} · Theme: {plan.contentTheme}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-3">
            {day?.post_status !== "posted" ? (
              <button
                onClick={() => void patchDay({ post_status: "posted" })}
                className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/40"
              >
                Mark posted
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" /> Posted</span>
            )}
            <input
              value={postedUrlDraft}
              onChange={(e) => setPostedUrlDraft(e.target.value)}
              onBlur={() => { if (postedUrlDraft !== (day?.posted_url ?? "")) void patchDay({ posted_url: postedUrlDraft || null }); }}
              placeholder="Post URL after publishing…"
              className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        </section>

        {/* ── Before/after creative card ── */}
        <section className={CARD}>
          <SectionTitle icon={ImageIcon}>Before/after creative assignment</SectionTitle>
          <div className="mt-3 space-y-2 text-xs text-zinc-400">
            <p><span className="text-zinc-500">Type:</span> <span className="rounded-full bg-[rgba(201,164,76,0.1)] px-2 py-0.5 text-[#E8D7A2]">{plan.creativeType}</span></p>
            <p><span className="text-zinc-500">Assignment:</span> <span className="text-zinc-200">{plan.graphicAssignment}</span></p>
            <p><span className="text-zinc-500">Before source:</span> {plan.beforeSource}</p>
            <p><span className="text-zinc-500">After output:</span> {plan.afterOutput}</p>
            <p><span className="text-zinc-500">Headline:</span> “{plan.suggestedHeadline}” <CopyButton text={plan.suggestedHeadline} label="Copy" /></p>
            <p><span className="text-zinc-500">Caption angle:</span> {plan.captionAngle}</p>
            <p><span className="text-zinc-500">Tools:</span> {plan.tools.join(" · ")} <span className="mx-1">·</span> <span className="text-zinc-500">Timebox:</span> {plan.assetTimeboxMinutes} min</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-3">
            <select
              value={day?.asset_status ?? "not_started"}
              onChange={(e) => void patchDay({ asset_status: e.target.value as SprintDay["asset_status"] })}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300"
            >
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
              <option value="posted">Posted</option>
            </select>
            <input
              value={assetLinkDraft}
              onChange={(e) => setAssetLinkDraft(e.target.value)}
              onBlur={() => { if (assetLinkDraft !== (day?.asset_link ?? "")) void patchDay({ asset_link: assetLinkDraft || null }); }}
              placeholder="Asset link (Drive, Figma, file)…"
              className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        </section>

        {/* ── Targeting card ── */}
        <section className={CARD}>
          <SectionTitle icon={Target}>Today&apos;s targeting — {segment.label}</SectionTitle>
          <div className="mt-3 space-y-2.5 text-xs text-zinc-400">
            <p><span className="text-zinc-500">Personas:</span> {segment.personas.join(" · ")}</p>
            <div>
              <p className="text-zinc-500 mb-1">Search queries:</p>
              <ul className="space-y-1">
                {segment.queries.map((q) => (
                  <li key={q} className="flex items-center justify-between gap-2 rounded bg-zinc-800/40 px-2.5 py-1.5">
                    <code className="text-[11px] text-zinc-300">{q}</code>
                    <CopyButton text={q} label="Copy" />
                  </li>
                ))}
              </ul>
            </div>
            <p><span className="text-zinc-500">Example companies:</span> {segment.exampleCompanies.join(", ")}</p>
            <p><span className="text-zinc-500">Priority rules:</span> {segment.priorityRules}</p>
            <p><span className="text-zinc-500">First question:</span> <span className="text-zinc-200">“{segment.firstQuestion}”</span> <CopyButton text={segment.firstQuestion} label="Copy" /></p>
            <p><span className="text-zinc-500">Next step:</span> {segment.nextStep}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-800 pt-3 text-xs">
            {[
              { href: "/companies", label: "+ Add Company" },
              { href: "/contacts", label: "+ Add Contact" },
              { href: "/partners", label: "+ Add Partner" },
              { href: "/intro-sources", label: "Intro Sources" },
              { href: "/sales-assets", label: "Sales Assets" },
              { href: "/account-pitch-planner", label: "Pitch Planner" },
              { href: "/templates", label: "Templates" },
              { href: "/outreach", label: "Outreach" },
              { href: "/growth", label: "Growth" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
                {l.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Templates card ── */}
        <section className={CARD}>
          <SectionTitle icon={Clipboard}>Copy/paste templates (send manually)</SectionTitle>
          <p className="mt-1 text-[11px] text-zinc-600">LinkedIn is manual-only — copy, personalize the [brackets], send yourself. Never automate.</p>
          <div className="mt-3 space-y-2">
            {SPRINT_TEMPLATES.map((t) => (
              <details key={t.key} className="group rounded-lg bg-zinc-800/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-medium text-zinc-200">{t.label}</span>
                  <CopyButton text={t.body} label="Copy" />
                </summary>
                <p className="whitespace-pre-wrap border-t border-zinc-800 px-3 py-2.5 text-[11px] leading-relaxed text-zinc-400">{t.body}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Metrics card ── */}
        <section className={CARD}>
          <SectionTitle icon={TrendingUp}>End-of-day metrics</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {([
              ["comments_made", "Comments"],
              ["connections_sent", "Connects sent"],
              ["accepted_connections", "Accepted"],
              ["first_dms_sent", "Buyer DMs"],
              ["buyer_positive_replies", "Buyer replies"],
              ["partner_dms_sent", "Partner DMs"],
              ["partner_positive_replies", "Partner replies"],
              ["hiring_dms_sent", "Hiring-signal DMs"],
              ["hiring_positive_replies", "Hiring replies"],
              ["warm_intro_requests_sent", "Intro requests"],
              ["warm_intros_received", "Intros received"],
              ["followups_sent", "Follow-ups"],
              ["sample_requests", "Sample requests"],
              ["sample_packs_sent", "Samples sent"],
              ["calls_booked", "Calls booked"],
              ["pilots_sent", "Pilots proposed"],
              ["revenue_pipeline", "Pipeline $"],
            ] as [keyof Metrics, string][]).map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-[10px] uppercase tracking-wide text-zinc-500">{label}</span>
                <input
                  type="number"
                  min={0}
                  value={Number(metrics[key]) || 0}
                  onChange={(e) => setMetrics((m) => ({ ...m, [key]: Math.max(0, Number(e.target.value) || 0) }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <textarea
            rows={2}
            value={metrics.notes}
            onChange={(e) => setMetrics((m) => ({ ...m, notes: e.target.value }))}
            placeholder="Notes / lessons / best reply today (paste winning messages here — feed the learning loop)…"
            className="mt-2.5 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
          />
          <button
            onClick={saveMetrics}
            disabled={busy !== "" || !day}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy === "metrics" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            {metricsSaved ? "Update metrics" : "Save metrics"}
          </button>
          {/* Calculated rates */}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-5">
            {[
              { label: "Buyer reply rate", v: rate(metrics.buyer_positive_replies, metrics.first_dms_sent) },
              { label: "Partner reply rate", v: rate(metrics.partner_positive_replies, metrics.partner_dms_sent) },
              { label: "Hiring reply rate", v: rate(metrics.hiring_positive_replies, metrics.hiring_dms_sent) },
              { label: "Intro conversion", v: rate(metrics.warm_intros_received, metrics.warm_intro_requests_sent) },
              {
                label: "Overall reply rate",
                v: rate(
                  metrics.buyer_positive_replies + metrics.partner_positive_replies + metrics.hiring_positive_replies,
                  metrics.first_dms_sent + metrics.partner_dms_sent + metrics.hiring_dms_sent
                ),
              },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-800/40 px-2 py-2 text-center">
                <div className="text-sm font-semibold text-zinc-100">{s.v}</div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Warm Intro Daily card ── */}
        <section className={CARD}>
          <SectionTitle icon={Rocket}>Warm intro engine — today</SectionTitle>
          {!introTablesReady ? (
            <p className="mt-3 text-xs text-amber-400">
              Run supabase/migrations/20260611_warm_intro_engine.sql, then add sources at /intro-sources.
            </p>
          ) : introSources.length === 0 ? (
            <p className="mt-3 text-xs text-zinc-500">
              No intro sources yet — add consultants, recruiters, task-force pros, and vendors you already know at{" "}
              <Link href="/intro-sources" className="text-emerald-400 hover:underline">/intro-sources</Link>.
            </p>
          ) : (
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <p className="mb-1 font-semibold text-zinc-300">Message these 3 (touch due or oldest):</p>
                {introSources.slice(0, 3).map((s) => (
                  <p key={s.id} className="text-zinc-400">• {s.name}{s.company ? ` (${s.company})` : ""} — {s.category ?? "—"} · {s.relationship_strength}</p>
                ))}
              </div>
              <div>
                <p className="mb-1 font-semibold text-zinc-300">Comment on posts from 3 (warm them first):</p>
                {introSources.filter((s) => s.relationship_strength === "cold" || s.relationship_strength === "warming").slice(0, 3).map((s) => (
                  <p key={s.id} className="text-zinc-400">• {s.name} — {s.category ?? "—"}</p>
                ))}
              </div>
              {(() => {
                const ask = introSources.find((s) => !s.intro_requested && (s.relationship_strength === "warm" || s.relationship_strength === "strong") && s.intro_quality !== "low");
                const fup = introSources.find((s) => s.intro_requested && !s.intro_made);
                return (
                  <>
                    <p><span className="font-semibold text-[#E8D7A2]">Ask for 1 specific intro:</span>{" "}
                      <span className="text-zinc-400">{ask ? `${ask.name} — name the exact company/person you want to meet.` : "no warm source ready — keep warming."}</span>
                    </p>
                    <p><span className="font-semibold text-zinc-300">Send 1 follow-up:</span>{" "}
                      <span className="text-zinc-400">{fup ? `${fup.name} — intro requested, not yet made.` : "none pending."}</span>
                    </p>
                  </>
                );
              })()}
              <p className="border-t border-zinc-800 pt-2 text-[11px] text-zinc-600">
                Suggested copy: use the three “Warm intro” templates in the templates card — perspective ask first, referral ask only after a reply.{" "}
                <Link href="/intro-sources" className="text-emerald-400 hover:underline">Manage sources →</Link>
              </p>
            </div>
          )}
        </section>

        {/* ── Winning messages ── */}
        <section className={CARD}>
          <SectionTitle icon={Award}>Winning messages — the learning loop</SectionTitle>
          <div className="mt-3 space-y-2">
            {winners.length === 0 && (
              <p className="text-xs text-zinc-500">Nothing saved yet. The first reply you get goes here — that's how the system gets smarter.</p>
            )}
            {winners.map((w) => (
              <details key={w.id} className="group rounded-lg bg-zinc-800/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 truncate text-[11px] text-zinc-300">
                    <span className="text-emerald-400">{w.result ?? "win"}</span> · {w.audience ?? "—"} · {w.message_type ?? "—"} · {new Date(w.created_at).toLocaleDateString()}
                  </span>
                  <CopyButton text={w.message_body} label="Copy winner" />
                </summary>
                <p className="whitespace-pre-wrap border-t border-zinc-800 px-3 py-2 text-[11px] leading-relaxed text-zinc-400">{w.message_body}</p>
              </details>
            ))}
          </div>
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <p className="mb-1.5 text-[11px] font-semibold text-zinc-300">Save a winner</p>
            <textarea
              rows={2}
              value={winnerDraft.message_body}
              onChange={(e) => setWinnerDraft((w) => ({ ...w, message_body: e.target.value }))}
              placeholder="Paste the exact message that worked…"
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select value={winnerDraft.message_type} onChange={(e) => setWinnerDraft((w) => ({ ...w, message_type: e.target.value }))} className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-[11px] text-zinc-300">
                {["connection", "dm1", "followup", "partner", "hiring_signal", "warm_intro", "post"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={winnerDraft.audience} onChange={(e) => setWinnerDraft((w) => ({ ...w, audience: e.target.value }))} className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-[11px] text-zinc-300">
                {["direct buyer", "partner", "hiring signal", "intro source"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select value={winnerDraft.result} onChange={(e) => setWinnerDraft((w) => ({ ...w, result: e.target.value }))} className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-[11px] text-zinc-300">
                {["reply", "call_booked", "sample_requested", "pilot_proposed", "won"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <button
                onClick={saveWinner}
                disabled={busy !== ""}
                className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50"
              >
                Save as winner
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Weekly review ── */}
      {isReviewDay && (
        <section className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-5">
          <SectionTitle icon={Award}>Weekly review — days {dayNumber - 4}–{dayNumber}</SectionTitle>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: "Connects sent", v: weekStats.connectionsSent },
              { label: "Accepted", v: weekStats.accepted },
              { label: "Acceptance", v: weekStats.connectionsSent > 0 ? `${Math.round((weekStats.accepted / weekStats.connectionsSent) * 100)}%` : "—" },
              { label: "Reply rate", v: weekStats.dmsSent > 0 ? `${Math.round(((weekStats.buyerReplies + weekStats.partnerReplies) / weekStats.dmsSent) * 100)}%` : "—" },
              { label: "Calls booked", v: weekStats.callsBooked },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-900/70 px-3 py-2.5 text-center">
                <div className="text-lg font-semibold text-zinc-100">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-violet-300">Suggested adjustments</p>
            <ul className="mt-1.5 space-y-1 text-xs text-zinc-400">
              {weeklyAdjustments(weekStats).map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
          <p className="mt-3 text-[11px] text-zinc-600">
            Reflect in today&apos;s metrics notes: What worked? Best reply? Best post? Best segment? What changes next week?
          </p>
        </section>
      )}

      {/* ── Sprint overview strip ── */}
      <section className={CARD}>
        <SectionTitle icon={Calendar}>Sprint map</SectionTitle>
        <div className="mt-3 grid grid-cols-10 gap-1.5 sm:grid-cols-15">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
            const d = days.find((x) => x.day_number === n);
            return (
              <button
                key={n}
                onClick={() => setDayNumber(n)}
                title={`Day ${n} — ${phaseForDay(n)}`}
                className={clsx(
                  "rounded-md py-1.5 text-[11px] font-medium transition-colors",
                  n === dayNumber ? "bg-[rgba(201,164,76,0.2)] text-[#E8D7A2] ring-1 ring-inset ring-[rgba(201,164,76,0.45)]"
                    : d?.status === "complete" ? "bg-emerald-500/15 text-emerald-400"
                    : d?.status === "in_progress" ? "bg-amber-500/15 text-amber-400"
                    : "bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800"
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
