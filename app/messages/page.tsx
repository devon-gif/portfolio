"use client";

import { useEffect, useState, useMemo } from "react";
import { AlertTriangle, FlaskConical, Send, CheckCircle, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
import { SlideOver, Field, Input, Textarea } from "@/components/SlideOver";
import clsx from "clsx";

type Msg = {
  id: string;
  subject: string | null;
  body: string;
  status: string;
  channel: string | null;
  sent_at: string | null;
  scheduled_send_at: string | null;
  error_message: string | null;
  created_at: string;
  contact_id: string | null;
  contacts?: { first_name?: string; last_name?: string; email?: string; companies?: { name?: string } | null } | null;
};

const FILTERS = ["all", "draft", "approved", "scheduled", "sent", "send_failed"] as const;
type Filter = (typeof FILTERS)[number];

const BADGE: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-violet-500/10 text-violet-400 ring-violet-500/20" },
  needs_review: { label: "Needs Review", cls: "bg-violet-500/10 text-violet-400 ring-violet-500/20" },
  approved: { label: "Approved", cls: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20" },
  scheduled: { label: "Scheduled", cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20" },
  sending: { label: "Sending", cls: "bg-amber-500/10 text-amber-300 ring-amber-500/20" },
  sent: { label: "Sent", cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" },
  send_failed: { label: "Failed", cls: "bg-red-500/10 text-red-400 ring-red-500/20" },
  failed: { label: "Failed", cls: "bg-red-500/10 text-red-400 ring-red-500/20" },
  replied: { label: "Replied", cls: "bg-teal-500/10 text-teal-400 ring-teal-500/20" },
};

function Badge({ status }: { status: string }) {
  const c = BADGE[status] ?? { label: status, cls: "bg-zinc-800 text-zinc-400 ring-zinc-700" };
  return <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap", c.cls)}>{c.label}</span>;
}

function fmt(d: string | null) {
  return d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";
}

export default function MessagesPage() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [testMode, setTestMode] = useState<{ on: boolean; email: string }>({ on: true, email: "" });

  const [open, setOpen] = useState<Msg | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState<"" | "save" | "approve" | "test" | "send">("");
  const [note, setNote] = useState<string | null>(null);

  async function load() {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("id, subject, body, status, channel, sent_at, scheduled_send_at, error_message, created_at, contact_id, contacts(first_name,last_name,email,companies(name))")
      .order("created_at", { ascending: false });
    setRows((data as unknown as Msg[]) ?? []);
    setLoading(false);
  }
  async function loadTestMode() {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from("app_settings").select("test_mode, test_email").limit(1).single();
    if (data) setTestMode({ on: data.test_mode !== false, email: data.test_email ?? "" });
  }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); loadTestMode(); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const m of rows) {
      const k = m.status === "needs_review" ? "draft" : m.status === "failed" ? "send_failed" : m.status === "sending" ? "scheduled" : m.status;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((m) =>
      filter === "draft" ? (m.status === "draft" || m.status === "needs_review")
      : filter === "scheduled" ? (m.status === "scheduled" || m.status === "sending")
      : filter === "send_failed" ? (m.status === "send_failed" || m.status === "failed")
      : m.status === filter
    );
  }, [rows, filter]);

  function openMsg(m: Msg) {
    setOpen(m); setSubject(m.subject ?? ""); setBody(m.body ?? ""); setNote(null);
  }
  const editable = open && (open.status === "draft" || open.status === "needs_review" || open.status === "approved");

  async function saveEdits() {
    if (!open) return;
    setBusy("save"); setNote(null);
    const { error } = await supabase.from("messages").update({ subject, body }).eq("id", open.id);
    setBusy("");
    if (error) { setNote(error.message); return; }
    setNote("Saved.");
    await load();
  }
  async function approve() {
    if (!open) return;
    setBusy("approve"); setNote(null);
    const { error } = await supabase.from("messages").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", open.id).in("status", ["draft", "needs_review"]);
    setBusy("");
    if (error) { setNote(error.message); return; }
    setOpen({ ...open, status: "approved" });
    await load();
  }
  async function sendTest() {
    if (!open) return;
    setBusy("test"); setNote(null);
    try {
      const res = await fetch("/api/send-test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message_id: open.id }) });
      const j = await res.json();
      setNote(j.ok ? `Test sent to ${testMode.email || "your inbox"}.` : `Test failed: ${j.error}`);
    } catch (e) { setNote(`Test failed: ${e instanceof Error ? e.message : "error"}`); }
    finally { setBusy(""); }
  }
  async function sendNow() {
    if (!open || open.status !== "approved") return;
    setBusy("send"); setNote(null);
    try {
      const res = await fetch("/api/send-approved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message_id: open.id }) });
      const j = await res.json();
      setNote(j.ok ? "Sent." : `Send failed: ${j.error}`);
      if (j.ok) setOpen({ ...open, status: "sent" });
    } catch (e) { setNote(`Send failed: ${e instanceof Error ? e.message : "error"}`); }
    finally { setBusy(""); await load(); }
  }

  return (
    <div className="px-6 py-6 max-w-6xl">
      <PageHeader
        title="Messages"
        description="All drafts and sent emails."
        action={<button onClick={() => { load(); loadTestMode(); }} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"><RefreshCw className={clsx("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh</button>}
      />

      {testMode.on && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <FlaskConical className="h-3.5 w-3.5" /> Test mode is ON — real sends go to {testMode.email || "your test inbox"}.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={clsx("rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            filter === f ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30" : "bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800")}>
            {f === "all" ? "All" : f.replace("_", " ")}
            {f !== "all" && <span className="ml-1.5 tabular-nums text-zinc-600">{counts[f] ?? 0}</span>}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Contact", "Company", "Subject", "Status", "Scheduled", "Sent"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
            {!isSupabaseConfigured ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">Connect Supabase to view messages.</td></tr>
            ) : loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-600">No messages.</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.id} onClick={() => openMsg(m)} className="cursor-pointer hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-200">{`${m.contacts?.first_name ?? ""} ${m.contacts?.last_name ?? ""}`.trim() || "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{m.contacts?.companies?.name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-300 max-w-xs truncate">{m.subject || <span className="text-zinc-600 italic">No subject</span>}</td>
                <td className="px-4 py-3"><Badge status={m.status} /></td>
                <td className="px-4 py-3 text-xs text-zinc-500 tabular-nums">{m.status === "scheduled" ? fmt(m.scheduled_send_at) : "—"}</td>
                <td className="px-4 py-3 text-xs text-zinc-500 tabular-nums">{fmt(m.sent_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail / edit panel */}
      <SlideOver
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `${open.contacts?.first_name ?? ""} ${open.contacts?.last_name ?? ""}`.trim() || "Message" : "Message"}
        description={open?.contacts?.email ?? undefined}
        wide
        footer={open ? (
          <>
            {note && <span className="mr-auto text-xs text-zinc-400">{note}</span>}
            {editable && (
              <button onClick={saveEdits} disabled={busy !== ""} className="rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors">
                {busy === "save" ? "Saving…" : "Save Edits"}
              </button>
            )}
            {(open.status === "draft" || open.status === "needs_review") && (
              <button onClick={approve} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors">
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
            )}
            {testMode.on && (
              <button onClick={sendTest} disabled={busy !== "" || !subject.trim()} className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 disabled:opacity-50 px-3 py-2 text-sm font-medium transition-colors">
                <FlaskConical className="h-4 w-4" /> {busy === "test" ? "Sending…" : "Send Test"}
              </button>
            )}
            {open.status === "approved" && (
              <button onClick={sendNow} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors">
                <Send className="h-4 w-4" /> {busy === "send" ? "Sending…" : testMode.on ? "Send (to test inbox)" : "Send Now"}
              </button>
            )}
          </>
        ) : undefined}
      >
        {open && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><Badge status={open.status} />{open.error_message && <span className="text-xs text-red-400 inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{open.error_message}</span>}</div>
            <Field label="Subject">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={!editable} />
            </Field>
            <Field label="Body" hint={editable ? "Editable while in draft or approved. The unsubscribe footer + address are added automatically at send time." : "Read-only — this message has already been scheduled or sent."}>
              <Textarea rows={16} value={body} onChange={(e) => setBody(e.target.value)} disabled={!editable} className="font-mono text-xs" />
            </Field>
          </div>
        )}
      </SlideOver>
    </div>
  );
}
