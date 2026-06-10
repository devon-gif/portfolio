"use client";

// Growth Command Center — weekly, manual-first growth workflow.
// This page guides work and creates tasks/drafts only. It never posts to
// LinkedIn, never submits directories, never requests reviews, and never
// sends outreach. Friday outreach routes through the /daily Command Center,
// which keeps Test Mode + manual approval in force.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  Lightbulb,
  Loader2,
  Plus,
  RefreshCw,
  SkipForward,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────────

type GrowthStatus = "todo" | "in_progress" | "done" | "skipped";
type GrowthDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface GrowthTask {
  id: string;
  week_start: string;
  day: GrowthDay;
  category: string;
  title: string;
  goal: string | null;
  status: GrowthStatus;
  notes: string | null;
  source_url: string | null;
  next_action: string | null;
  due_day: string | null;
  completed_at: string | null;
}

// ── Week helpers ──────────────────────────────────────────────────────────────

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday of the week containing `d` (local time). */
function mondayOf(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = copy.getDay(); // 0 = Sunday
  copy.setDate(copy.getDate() + (dow === 0 ? -6 : 1 - dow));
  return copy;
}

const DAY_ORDER: GrowthDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_OFFSET: Record<GrowthDay, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
};

function dueDateFor(weekStartISO: string, day: GrowthDay): string {
  const [y, m, dd] = weekStartISO.split("-").map(Number);
  const d = new Date(y, m - 1, dd + DAY_OFFSET[day]);
  return toISODate(d);
}

// ── Lane definitions + default weekly tasks ───────────────────────────────────

const LANES: {
  day: GrowthDay;
  label: string;
  category: string;
  laneTitle: string;
  defaultTask: { title: string; goal: string; next_action: string };
}[] = [
  {
    day: "monday",
    label: "Monday",
    category: "seo",
    laneTitle: "SEO page / case study",
    defaultTask: {
      title: "Draft one SEO service page or case study",
      goal: "Publish one new page targeting a hotel/hospitality keyword, or a new client case study.",
      next_action: "Pick a topic from the draft helper below, outline H1 + sections, draft 700+ words.",
    },
  },
  {
    day: "tuesday",
    label: "Tuesday",
    category: "citations",
    laneTitle: "Citations / directories",
    defaultTask: {
      title: "Submit Archer Design to 5 directories/citation sites",
      goal: "5 new manual directory/citation listings with consistent name, URL, and description.",
      next_action: "Work the list manually — keep NAP identical everywhere. Log each URL in notes.",
    },
  },
  {
    day: "wednesday",
    label: "Wednesday",
    category: "reviews",
    laneTitle: "Review requests",
    defaultTask: {
      title: "Request 2 reviews/testimonials from current or past clients",
      goal: "2 personal, low-pressure review/testimonial asks sent by you (not automated).",
      next_action: "Personalize the draft below for 2 clients and send manually.",
    },
  },
  {
    day: "thursday",
    label: "Thursday",
    category: "linkedin",
    laneTitle: "LinkedIn engagement",
    defaultTask: {
      title: "Comment on 10 hotel marketing/management posts",
      goal: "10 useful, specific comments on hotel marketing/management posts — visibility without pitching.",
      next_action: "Use the search terms below; comment as yourself, no links, no pitch.",
    },
  },
  {
    day: "friday",
    label: "Friday",
    category: "outreach",
    laneTitle: "Hotel buyer / partner outreach",
    defaultTask: {
      title: "Email 10 highly relevant hotel buyers or partners",
      goal: "10 outreach drafts approved and scheduled through the existing approval flow.",
      next_action: "Run this through the /daily Command Center — Test Mode and manual approval stay in force.",
    },
  },
];

// ── Draft helper content (static, manual-use only) ───────────────────────────

const SEO_PAGE_IDEAS = [
  "Hotel spa & wellness marketing support (target: spa directors at full-service hotels)",
  "Boutique hotel social media — independent properties without a flag's template library",
  "Hotel group / management company creative partner (multi-property consistency angle)",
  "Local angle: hotel social media management in Pittsburgh / Western PA",
  "Wedding venue marketing creative — filling next season's open dates",
  "Hotel content calendar: what to post when nobody on property has time",
];

const CASE_STUDY_IDEAS = [
  "Hampton Inn Johnstown — extending the Greensburg model to a second property",
  "Eliza Hot Metal Bistro — a seasonal menu launch, from menu PDF to finished promo set",
  "Elements Salon & Wellness — building a calm, premium feed without a designer on staff",
  "Before/after: one property's feed, 90 days into the monthly plan",
];

const REVIEW_REQUEST_DRAFT = `Hey [Name] — quick favor. I'm building out the public side of Archer Design and a short note from you would carry a lot of weight.

If you've got 3 minutes, would you write a sentence or two about what the monthly creative has been like to work with? Whatever's honest — workload, quality, turnaround.

[Google review link or "just reply to this email"]

No pressure at all if you're slammed — and either way, thanks for being a great client to work with.

— Devon`;

const LINKEDIN_SEARCH_TERMS = [
  `"hotel general manager" posts`,
  `"hotel marketing" — sort by recent`,
  `"hotel management company" marketing`,
  `"director of sales and marketing" hotel`,
  `"hospitality marketing" social media`,
  `"hotel social media" struggling OR tips`,
  `"select service" hotel marketing`,
  `hashtag: #hotelmarketing, #hospitalityindustry, #hotelmanagement`,
];

// ── Status styling ────────────────────────────────────────────────────────────

const STATUS_META: Record<GrowthStatus, { label: string; cls: string }> = {
  todo: { label: "To do", cls: "bg-zinc-800 text-zinc-300" },
  in_progress: { label: "In progress", cls: "bg-amber-500/15 text-amber-400" },
  done: { label: "Done", cls: "bg-emerald-500/15 text-emerald-400" },
  skipped: { label: "Skipped", cls: "bg-zinc-800/80 text-zinc-500 line-through" },
};

// ── Small components ──────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GrowthPage() {
  const [weekStart, setWeekStart] = useState<string>(() => toISODate(mondayOf(new Date())));
  const [tasks, setTasks] = useState<GrowthTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured — run the growth_tasks migration and set env vars.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("growth_tasks")
      .select("*")
      .eq("week_start", weekStart)
      .order("created_at", { ascending: true });
    if (err) {
      setError(
        err.message.includes("growth_tasks")
          ? "growth_tasks table not found — run supabase/migrations/20260609_growth_command_center.sql first."
          : err.message
      );
    } else {
      setError(null);
      setTasks((data ?? []) as GrowthTask[]);
    }
    setLoading(false);
  }, [weekStart]);

  useEffect(() => {
    void load();
  }, [load]);

  async function generateWeek() {
    setGenerating(true);
    setError(null);
    const rows = LANES.map((lane) => ({
      week_start: weekStart,
      day: lane.day,
      category: lane.category,
      title: lane.defaultTask.title,
      goal: lane.defaultTask.goal,
      next_action: lane.defaultTask.next_action,
      due_day: dueDateFor(weekStart, lane.day),
      status: "todo" as const,
    }));
    // Idempotent thanks to the (week_start, day, title) unique index:
    const { error: err } = await supabase
      .from("growth_tasks")
      .upsert(rows, { onConflict: "week_start,day,title", ignoreDuplicates: true });
    if (err) setError(err.message);
    await load();
    setGenerating(false);
  }

  async function setStatus(task: GrowthTask, status: GrowthStatus) {
    const patch: Partial<GrowthTask> & { updated_at: string } = {
      status,
      completed_at: status === "done" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from("growth_tasks").update(patch).eq("id", task.id);
    if (err) setError(err.message);
    else setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
  }

  async function saveNotes(task: GrowthTask) {
    const notes = notesDraft[task.id];
    if (notes === undefined || notes === (task.notes ?? "")) return;
    const patch = { notes, updated_at: new Date().toISOString() };
    const { error: err } = await supabase.from("growth_tasks").update(patch).eq("id", task.id);
    if (err) setError(err.message);
    else setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, notes } : t)));
  }

  function shiftWeek(delta: number) {
    const [y, m, d] = weekStart.split("-").map(Number);
    setWeekStart(toISODate(new Date(y, m - 1, d + delta * 7)));
  }

  const byDay = useMemo(() => {
    const map = new Map<GrowthDay, GrowthTask[]>();
    for (const day of DAY_ORDER) map.set(day, []);
    for (const t of tasks) map.get(t.day)?.push(t);
    return map;
  }, [tasks]);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const isCurrentWeek = weekStart === toISODate(mondayOf(new Date()));

  return (
    <div className="p-6 max-w-5xl">
      <PageHeader
        title="Growth"
        description="One free/cheap growth lane per weekday. This page guides the work and stores tasks — nothing here auto-posts, auto-submits, or auto-sends."
        action={
          <button
            onClick={generateWeek}
            disabled={generating || loading || !isSupabaseConfigured}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Generate this week&apos;s tasks
          </button>
        }
      />

      {/* Week switcher */}
      <div className="mb-6 flex items-center gap-3 text-sm">
        <button
          onClick={() => shiftWeek(-1)}
          className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="inline-flex items-center gap-2 text-zinc-300">
          <CalendarDays className="h-4 w-4 text-zinc-500" />
          Week of {weekStart}
          {isCurrentWeek && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">current</span>
          )}
        </span>
        <button
          onClick={() => shiftWeek(1)}
          className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => void load()}
          className="ml-1 rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:bg-zinc-800"
          aria-label="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        {tasks.length > 0 && (
          <span className="ml-auto text-xs text-zinc-500">
            {doneCount}/{tasks.length} done
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading week…
        </div>
      ) : (
        <div className="space-y-5">
          {LANES.map((lane) => {
            const laneTasks = byDay.get(lane.day) ?? [];
            return (
              <section
                key={lane.day}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40"
                aria-label={`${lane.label} lane: ${lane.laneTitle}`}
              >
                <header className="flex items-center justify-between border-b border-zinc-800/60 px-4 py-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      {lane.label}
                    </span>
                    <h2 className="text-sm font-medium text-zinc-100">{lane.laneTitle}</h2>
                  </div>
                  <span className="text-xs text-zinc-500">{lane.category}</span>
                </header>

                {laneTasks.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-zinc-600">
                    No tasks yet for this week — use “Generate this week&apos;s tasks”.
                  </p>
                ) : (
                  <ul className="divide-y divide-zinc-800/60">
                    {laneTasks.map((task) => {
                      const meta = STATUS_META[task.status];
                      return (
                        <li key={task.id} className="px-4 py-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-medium", meta.cls)}>
                                  {meta.label}
                                </span>
                                <h3
                                  className={clsx(
                                    "text-sm font-medium",
                                    task.status === "skipped" ? "text-zinc-500 line-through" : "text-zinc-100"
                                  )}
                                >
                                  {task.title}
                                </h3>
                              </div>
                              {task.goal && <p className="mt-1.5 text-xs text-zinc-500">Goal: {task.goal}</p>}
                              {task.next_action && (
                                <p className="mt-1 text-xs text-zinc-400">Next: {task.next_action}</p>
                              )}
                              <p className="mt-1 text-[11px] text-zinc-600">
                                Due {task.due_day ?? dueDateFor(task.week_start, task.day)}
                                {task.completed_at &&
                                  ` · completed ${new Date(task.completed_at).toLocaleString()}`}
                                {task.source_url && (
                                  <>
                                    {" · "}
                                    <a
                                      href={task.source_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-400 hover:underline"
                                    >
                                      source <ExternalLink className="inline h-3 w-3" />
                                    </a>
                                  </>
                                )}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              {task.status !== "done" && (
                                <button
                                  onClick={() => void setStatus(task, "done")}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-2.5 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" /> Mark done
                                </button>
                              )}
                              {task.status === "todo" && (
                                <button
                                  onClick={() => void setStatus(task, "in_progress")}
                                  className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                                >
                                  Start
                                </button>
                              )}
                              {task.status !== "skipped" && task.status !== "done" && (
                                <button
                                  onClick={() => void setStatus(task, "skipped")}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
                                >
                                  <SkipForward className="h-3.5 w-3.5" /> Skip
                                </button>
                              )}
                              {(task.status === "done" || task.status === "skipped") && (
                                <button
                                  onClick={() => void setStatus(task, "todo")}
                                  className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
                                >
                                  Reopen
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="mt-3 flex items-start gap-2">
                            <textarea
                              rows={1}
                              placeholder="Notes (URLs submitted, who you asked, what worked…)"
                              defaultValue={task.notes ?? ""}
                              onChange={(e) =>
                                setNotesDraft((p) => ({ ...p, [task.id]: e.target.value }))
                              }
                              onBlur={() => void saveNotes(task)}
                              className="min-h-[34px] w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Draft helpers per lane */}
                {lane.day === "monday" && (
                  <div className="border-t border-zinc-800/60 px-4 py-4">
                    <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Draft helper — topic ideas
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-500">SEO page topics</p>
                        <ul className="space-y-1 text-xs text-zinc-400">
                          {SEO_PAGE_IDEAS.map((i) => (
                            <li key={i}>• {i}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1.5 text-[11px] uppercase tracking-wider text-zinc-500">Case study topics</p>
                        <ul className="space-y-1 text-xs text-zinc-400">
                          {CASE_STUDY_IDEAS.map((i) => (
                            <li key={i}>• {i}</li>
                          ))}
                        </ul>
                        <p className="mt-2 text-[11px] text-zinc-600">
                          Existing pages live at /hotel-social-media-management, /hotel-video-marketing,
                          /hospitality-creative-support, /hotel-restaurant-event-promos,
                          /hotel-marketing-cost-savings, /case-studies.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {lane.day === "wednesday" && (
                  <div className="border-t border-zinc-800/60 px-4 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Draft helper — review request (send manually)
                      </h4>
                      <CopyButton text={REVIEW_REQUEST_DRAFT} />
                    </div>
                    <pre className="whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-sans text-xs leading-relaxed text-zinc-400">
                      {REVIEW_REQUEST_DRAFT}
                    </pre>
                  </div>
                )}

                {lane.day === "thursday" && (
                  <div className="border-t border-zinc-800/60 px-4 py-4">
                    <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> Draft helper — LinkedIn searches (use manually)
                    </h4>
                    <ul className="grid gap-1 text-xs text-zinc-400 sm:grid-cols-2">
                      {LINKEDIN_SEARCH_TERMS.map((t) => (
                        <li key={t}>• {t}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] text-zinc-600">
                      Comment as yourself with something specific and useful. No links, no pitch — the
                      profile click is the win.
                    </p>
                  </div>
                )}

                {lane.day === "friday" && (
                  <div className="border-t border-zinc-800/60 px-4 py-4">
                    <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Outreach runs through the Command Center
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Drafting, approval, Test Mode, and sending limits all live in the daily flow — this
                      lane just reminds you to do it.
                    </p>
                    <Link
                      href="/daily"
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Open /daily Command Center <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
