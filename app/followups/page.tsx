"use client";

import { useState, useMemo } from "react";
import { Calendar, CheckCircle, XCircle, Pencil, Clock } from "lucide-react";
import type { FollowUp, FollowUpStatus } from "@/lib/types";
import { MOCK_FOLLOWUPS, MOCK_CONTACTS } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { SlideOver, Field, Input, Textarea } from "@/components/SlideOver";
import clsx from "clsx";

function getFollowUps(): FollowUp[] {
  return MOCK_FOLLOWUPS.map((f) => ({
    ...f,
    contact: MOCK_CONTACTS.find((c) => c.id === f.contact_id) ?? f.contact,
  }));
}

const STATUS_TABS: { key: FollowUpStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function dueDateClass(due: string, status: FollowUpStatus) {
  if (status !== "pending") return "text-zinc-600";
  const d = new Date(due);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "text-red-400 font-semibold";
  if (diff === 0) return "text-amber-400 font-semibold";
  return "text-zinc-400";
}

function dueDateLabel(due: string) {
  const d = new Date(due);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(getFollowUps);
  const [tab, setTab] = useState<FollowUpStatus | "all">("pending");
  const [editTarget, setEditTarget] = useState<FollowUp | null>(null);
  const [editData, setEditData] = useState<{ due_date: string; notes: string }>({ due_date: "", notes: "" });

  const filtered = useMemo(() => {
    const list = tab === "all" ? followUps : followUps.filter((f) => f.status === tab);
    return [...list].sort(
      (a, b) => new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime()
    );
  }, [followUps, tab]);

  const counts = {
    pending: followUps.filter((f) => f.status === "pending").length,
    completed: followUps.filter((f) => f.status === "completed").length,
    cancelled: followUps.filter((f) => f.status === "cancelled").length,
  };

  function updateStatus(id: string, status: FollowUpStatus) {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, status, updated_at: new Date().toISOString() } : f)));
  }

  function openEdit(f: FollowUp) {
    setEditTarget(f);
    setEditData({ due_date: (f.due_date ?? "").slice(0, 10), notes: f.notes ?? "" });
  }

  function handleSave() {
    if (!editTarget) return;
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === editTarget.id
          ? { ...f, due_date: editData.due_date, notes: editData.notes, updated_at: new Date().toISOString() }
          : f
      )
    );
    setEditTarget(null);
  }

  return (
    <div className="px-6 py-6 max-w-4xl">
      <PageHeader
        title="Follow-ups"
        description={`${counts.pending} pending`}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Pending", count: counts.pending, color: "text-amber-400" },
          { label: "Completed", count: counts.completed, color: "text-emerald-400" },
          { label: "Cancelled", count: counts.cancelled, color: "text-zinc-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3">
            <p className="text-xs text-zinc-600 font-medium">{s.label}</p>
            <p className={clsx("text-xl font-bold tabular-nums mt-1", s.color)}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              tab === t.key
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            )}
          >
            {t.label}
            {t.key !== "all" && (
              <span className="ml-1.5 text-xs font-bold tabular-nums text-zinc-600">
                {counts[t.key as keyof typeof counts] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No follow-ups"
          description={tab === "pending" ? "All clear — no pending follow-ups." : `No ${tab} follow-ups.`}
          icon={<Calendar className="h-10 w-10" />}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => {
            const contact = f.contact;
            const isPending = f.status === "pending";
            return (
              <div
                key={f.id}
                className={clsx(
                  "group rounded-xl border bg-zinc-900 px-4 py-3.5 flex items-start gap-3 transition-colors",
                  isPending ? "border-zinc-800 hover:border-zinc-700" : "border-zinc-800/40 opacity-60"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  {f.status === "completed"
                    ? <CheckCircle className="h-4 w-4 text-emerald-500" />
                    : f.status === "cancelled"
                      ? <XCircle className="h-4 w-4 text-zinc-600" />
                      : <Clock className="h-4 w-4 text-amber-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-200">
                      {contact?.first_name} {contact?.last_name}
                    </span>
                    {contact?.title && <span className="text-xs text-zinc-500">{contact.title}</span>}
                    {contact?.company_name && <span className="text-xs text-zinc-600">· {contact.company_name}</span>}
                  </div>
                  {f.notes && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{f.notes}</p>}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className={clsx("text-xs tabular-nums", dueDateClass(f.due_date ?? "", f.status as FollowUpStatus))}>
                    {dueDateLabel(f.due_date ?? "")}
                  </span>
                  {isPending && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={() => updateStatus(f.id, "completed")} className="rounded-lg p-1.5 text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                        <CheckCircle className="h-3 w-3" />
                      </button>
                      <button onClick={() => updateStatus(f.id, "cancelled")} className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <XCircle className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit slide-over */}
      <SlideOver
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Follow-up"
        footer={
          <>
            <button onClick={() => setEditTarget(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
              Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Due Date">
            <Input type="date" value={editData.due_date} onChange={(e) => setEditData((d) => ({ ...d, due_date: e.target.value }))} />
          </Field>
          <Field label="Notes">
            <Textarea rows={4} value={editData.notes} onChange={(e) => setEditData((d) => ({ ...d, notes: e.target.value }))} />
          </Field>
        </div>
      </SlideOver>
    </div>
  );
}
