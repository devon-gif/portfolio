"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  Search,
  Mail,
  Link,
  ClipboardList,
  Send,
  MessageSquareWarning,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
import { scoreBuyerTitle, actionLabel, TIER_BADGE, TIER_LABEL } from "@/lib/buyer-titles";
import { generateTodaysDrafts, describeSkipped } from "@/lib/generate-drafts";

type CompanyToday = {
  id: string;
  name: string;
  website: string | null;
  last_researched_at: string | null;
  market: string | null;
  company_score: number | null;
};

type Candidate = {
  id: string;
  company_id: string | null;
  name: string | null;
  title: string | null;
  email: string | null;
  email_status: string | null;
  email_confidence: number | null;
  linkedin_url: string | null;
  recommended_action: string | null;
  recommended_channel: string | null;
  confidence_score: number;
  status: string;
  source_url: string | null;
  source_type: string | null;
  source_excerpt: string | null;
  companies?: { name?: string | null; website?: string | null } | null;
};

type MessageRow = {
  id: string;
  channel: string;
  status: string;
  subject: string | null;
  body: string;
  created_at: string;
  scheduled_send_at: string | null;
  sent_at: string | null;
  contacts?: { first_name?: string | null; last_name?: string | null; title?: string | null; email?: string | null; source?: string | null; companies?: { name?: string | null } | null } | null;
};

type ContactIssue = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  status: string | null;
  replied_at: string | null;
  email_opt_out: boolean | null;
  bounced: boolean | null;
  companies?: { name?: string | null } | null;
};

type AppFlags = {
  test_mode: boolean;
  require_manual_approval: boolean;
};

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function DailyCommandCenterPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string>("");
  const [note, setNote] = useState<string | null>(null);
  const [noteType, setNoteType] = useState<"info" | "warn" | "error">("info");
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
  const [totalContacts, setTotalContacts] = useState<number>(0);

  const [settingsFlags, setSettingsFlags] = useState<AppFlags>({ test_mode: true, require_manual_approval: true });
  const [companiesToday, setCompaniesToday] = useState<CompanyToday[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [contactIssues, setContactIssues] = useState<ContactIssue[]>([]);

  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [expandedMsgId, setExpandedMsgId] = useState<string | null>(null);

  async function reloadAll() {
    setLoading(true);
    setNote(null);
    setNoteType("info");

    if (!isSupabaseConfigured) {
      setLoading(false);
      setNote("Supabase is not configured.");
      return;
    }

    const todayIso = startOfTodayIso();

    const [settingsRes, companiesRes, candidatesRes, messagesRes, contactsRes, totalCompaniesRes, totalContactsRes] = await Promise.all([
      supabase.from("app_settings").select("test_mode, require_manual_approval, daily_send_goal").limit(1).single(),
      supabase
        .from("companies")
        .select("id, name, website, last_researched_at, market, company_score")
        .gte("last_researched_at", todayIso)
        .order("last_researched_at", { ascending: false })
        .limit(100),
      supabase
        .from("contact_candidates")
        .select("id, company_id, name, title, email, email_status, email_confidence, linkedin_url, recommended_action, recommended_channel, confidence_score, status, source_url, source_type, source_excerpt, companies(name, website)")
        .eq("status", "needs_review")
        .order("confidence_score", { ascending: false })
        .limit(300),
      supabase
        .from("messages")
        .select("id, channel, status, subject, body, created_at, scheduled_send_at, sent_at, contacts(first_name,last_name,title,email,source,companies(name))")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("contacts")
        .select("id, first_name, last_name, email, status, replied_at, email_opt_out, bounced, companies(name)")
        .or("replied_at.not.is.null,email_opt_out.eq.true,bounced.eq.true,status.eq.unsubscribed")
        .order("created_at", { ascending: false })
        .limit(200),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
    ]);

    if (!settingsRes.error && settingsRes.data) {
      setSettingsFlags({
        test_mode: settingsRes.data.test_mode !== false,
        require_manual_approval: settingsRes.data.require_manual_approval !== false,
      });
      const g = (settingsRes.data as { daily_send_goal?: number }).daily_send_goal;
      if (typeof g === "number" && g > 0) setDailyGoal(g);
    }

    setCompaniesToday(((companiesRes.data ?? []) as unknown as CompanyToday[]));
    setCandidates(((candidatesRes.data ?? []) as unknown as Candidate[]));
    setMessages(((messagesRes.data ?? []) as unknown as MessageRow[]));
    setContactIssues(((contactsRes.data ?? []) as unknown as ContactIssue[]));
    setTotalCompanies(totalCompaniesRes.count ?? 0);
    setTotalContacts(totalContactsRes.count ?? 0);

    setSelectedCandidates(new Set());
    setSelectedEmails(new Set());
    setLoading(false);
  }

  useEffect(() => {
    reloadAll();
  }, []);

  const hunterQueue = useMemo(
    () => candidates.filter((c) => c.recommended_action === "verify_with_hunter" || c.email_status === "needs_email" || c.email_status === "unverified" || c.email_status === "risky"),
    [candidates]
  );

  const linkedInDraftsReady = useMemo(
    () => candidates.filter((c) => c.recommended_action === "create_linkedin_draft"),
    [candidates]
  );

  const contactFormTasksReady = useMemo(
    () => candidates.filter((c) => c.recommended_action === "create_contact_form_task"),
    [candidates]
  );

  const emailDraftsReady = useMemo(
    () => messages.filter((m) => m.channel === "email" && (m.status === "draft" || m.status === "needs_review")),
    [messages]
  );

  const scheduledSends = useMemo(
    () => messages.filter((m) => m.channel === "email" && (m.status === "scheduled" || m.status === "sending")),
    [messages]
  );

  // Approved for today but not yet scheduled — shown so they're never invisible.
  const approvedAwaitingSchedule = useMemo(
    () => messages.filter((m) => m.channel === "email" && (m.status === "approved_for_today" || m.status === "approved")),
    [messages]
  );

  const failures = useMemo(
    () => messages.filter((m) => m.status === "failed" || m.status === "send_failed" || m.status === "bounced" || m.status === "replied"),
    [messages]
  );

  const sentToday = useMemo(() => {
    const todayIso = startOfTodayIso();
    return messages.filter((m) => m.status === "sent" && m.sent_at && m.sent_at >= todayIso);
  }, [messages]);

  function toggleCandidate(id: string) {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleEmail(id: string) {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function approveSelectedHunterLookups() {
    const selected = candidates.filter((c) => selectedCandidates.has(c.id));
    if (selected.length === 0) return setNote("Select candidate(s) in Hunter queue first.");

    setBusy("hunter");
    setNote(null);
    let ok = 0;
    let fail = 0;

    for (const cand of selected) {
      try {
        const endpoint = cand.email && cand.email_status !== "verified" ? "/api/hunter/verify-email" : "/api/hunter/find-email";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: cand.id }),
        });
        const body = await res.json();
        if (body.ok) ok++; else fail++;
      } catch {
        fail++;
      }
    }

    setBusy("");
    setNote(`Hunter lookups completed: ${ok} success, ${fail} failed.`);
    await reloadAll();
  }

  async function skipSelectedCandidates() {
    const ids = candidates.filter((c) => selectedCandidates.has(c.id)).map((c) => c.id);
    if (ids.length === 0) return setNote("Select candidate(s) first.");

    setBusy("skip");
    for (const id of ids) {
      await fetch("/api/research/candidate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: id, action: "skip" }),
      });
    }
    setBusy("");
    setNote(`Skipped ${ids.length} candidate(s).`);
    await reloadAll();
  }

  async function promoteSelectedCandidates() {
    const selected = candidates.filter((c) => selectedCandidates.has(c.id));
    if (selected.length === 0) return setNote("Select candidate(s) first.");

    setBusy("promote");
    let ok = 0;
    let fail = 0;
    const noEmailNames: string[] = [];
    for (const cand of selected) {
      if (!cand.email) noEmailNames.push(cand.name ?? "(no name)");
      try {
        const res = await fetch("/api/research/promote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: cand.id }),
        });
        const body = await res.json();
        if (body.ok) ok++; else fail++;
      } catch {
        fail++;
      }
    }
    setNoteType(fail > 0 ? "warn" : "info");
    const noEmailNote = noEmailNames.length > 0
      ? ` Note: ${noEmailNames.join(", ")} ha${noEmailNames.length === 1 ? "s" : "ve"} no email — run Hunter lookup to find one before generating drafts.`
      : "";
    setNote(`Promoted ${ok} contact${ok !== 1 ? "s" : ""}${fail > 0 ? `, ${fail} failed` : ""}. Now click Generate Today's Queue to draft emails.${noEmailNote}`);
    await reloadAll();
  }

  // Mark draft/needs_review emails as approved_for_today. Returns false on error.
  async function markApprovedForToday(ids: string[]): Promise<boolean> {
    if (ids.length === 0) return true;
    const { error } = await supabase
      .from("messages")
      .update({ status: "approved_for_today", approved_at: new Date().toISOString() })
      .in("id", ids)
      .in("status", ["draft", "needs_review"]);
    if (error) {
      setNote(`Approve failed: ${error.message}`);
      return false;
    }
    return true;
  }

  async function approveSelectedEmailsForToday() {
    const ids = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    if (ids.length === 0) return setNote("Select email draft(s) first.");

    setBusy("approveEmails");
    const ok = await markApprovedForToday(ids);
    setBusy("");
    if (ok) setNote(`Approved ${ids.length} email(s) for today. Click “Approve & Schedule Today” to schedule them.`);
    await reloadAll();
  }

  // Approve any selected drafts for today, then schedule ALL approved-for-today
  // emails across the send window. One click — no per-send approval.
  async function approveAndScheduleToday() {
    setBusy("schedule");
    setNote(null);
    const selectedIds = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    const ok = await markApprovedForToday(selectedIds);
    if (!ok) {
      setBusy("");
      await reloadAll();
      return;
    }
    try {
      const res = await fetch("/api/schedule-approved-today", { method: "POST" });
      const body = await res.json();
      setNote(body.ok ? `Scheduled ${body.scheduled} email(s) across today’s window.` : `Schedule failed: ${body.error}`);
    } catch (e) {
      setNote(`Schedule failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
    }
    await reloadAll();
  }

  async function sendDueNow() {
    setBusy("sendDue");
    try {
      const res = await fetch("/api/send-due", { method: "POST" });
      const body = await res.json();
      setNote(body.ok ? `Sent ${body.sent ?? 0}, failed ${body.failed ?? 0}.` : `Send failed: ${body.error}`);
    } catch (e) {
      setNote(`Send failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
    }
    await reloadAll();
  }

  async function skipSelectedEmails() {
    const ids = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    if (ids.length === 0) return setNote("Select email draft(s) first.");
    setBusy("skipEmails");
    const { error } = await supabase
      .from("messages")
      .update({ status: "skipped" })
      .in("id", ids)
      .in("status", ["draft", "needs_review"]);
    setBusy("");
    setNote(error ? `Skip failed: ${error.message}` : `Skipped ${ids.length} draft(s).`);
    await reloadAll();
  }

  async function markEmailsNeedsReview() {
    const ids = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    if (ids.length === 0) return setNote("Select email draft(s) first.");
    setBusy("needsReview");
    const { error } = await supabase.from("messages").update({ status: "needs_review" }).in("id", ids);
    setBusy("");
    setNote(error ? `Update failed: ${error.message}` : `Marked ${ids.length} draft(s) as needs review.`);
    await reloadAll();
  }

  async function generateTodaysQueue() {
    setBusy("generate");
    setNote(null);
    try {
      const r = await generateTodaysDrafts();
      if (r.noContacts) {
        setNoteType("warn");
        setNote(
          "No promoted contacts yet — select candidate(s) in the section below and click ‘Promote selected candidates’, then generate drafts again."
        );
      } else if (r.made > 0) {
        setNoteType("info");
        const skippedNote = r.skipped && describeSkipped(r.skipped) ? ` Skipped: ${describeSkipped(r.skipped)}.` : "";
        setNote(`Generated ${r.made} draft${r.made !== 1 ? "s" : ""} into Today's Outreach Batch.${skippedNote}`);
      } else {
        setNoteType("warn");
        setNote(r.reason ?? "No new eligible contacts to draft.");
      }
    } catch (e) {
      setNoteType("error");
      setNote(`Generate failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
    }
    await reloadAll();
  }

  // Best decision-maker contacts first.
  const candidatesSorted = [...candidates].sort(
    (a, b) =>
      scoreBuyerTitle(b.title).score - scoreBuyerTitle(a.title).score ||
      b.confidence_score - a.confidence_score
  );

  return (
    <div className="px-6 py-6 max-w-7xl space-y-6">
      <PageHeader title="Command Center" description="Find, review, approve, and schedule hotel outreach." />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-inset ${settingsFlags.test_mode ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-red-500/10 text-red-400 ring-red-500/20"}`}>
            {settingsFlags.test_mode ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} Test mode {settingsFlags.test_mode ? "ON" : "OFF"}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ring-inset ${settingsFlags.require_manual_approval ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-red-500/10 text-red-400 ring-red-500/20"}`}>
            {settingsFlags.require_manual_approval ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />} Manual approval {settingsFlags.require_manual_approval ? "REQUIRED" : "OFF"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-zinc-300">
            Today&apos;s target: <span className="font-semibold text-zinc-100">{dailyGoal}</span> approved emails
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={generateTodaysQueue} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 px-3 py-1.5 text-xs text-emerald-400 disabled:opacity-40">
            {busy === "generate" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />} Generate Today&apos;s Queue
          </button>
          <button onClick={sendDueNow} disabled={busy !== ""} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 px-3 py-1.5 text-xs text-amber-400 disabled:opacity-40">
            <Send className="h-3.5 w-3.5" /> Send Due Now
          </button>
          <button onClick={reloadAll} disabled={loading} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-40">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Refresh
          </button>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { label: "Companies", count: totalCompanies, sub: `${companiesToday.length} researched today`, href: "/companies" },
          { label: "To review", count: candidates.length, sub: "contact candidates", href: "#sec-candidates" },
          { label: "Contacts", count: totalContacts, sub: "promoted + manual", href: "/contacts" },
          { label: "Drafts", count: emailDraftsReady.length, sub: null, href: "#sec-batch" },
          { label: "Approved", count: approvedAwaitingSchedule.length, sub: null, href: "#sec-scheduled" },
          { label: "Scheduled", count: scheduledSends.length, sub: null, href: "#sec-scheduled" },
          { label: "Sent", count: sentToday.length, sub: null, href: "#sec-scheduled" },
          { label: "Failed", count: failures.length, sub: null, href: "#sec-failures" },
        ].map((s) => (
          <a key={s.label} href={s.href} className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-center transition hover:border-zinc-600">
            <div className="text-xl font-semibold text-zinc-100">{s.count}</div>
            <div className="text-[11px] uppercase tracking-wide text-zinc-500">{s.label}</div>
            {s.sub && <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight">{s.sub}</div>}
          </a>
        ))}
      </div>

      {note && (
        <p className={`rounded-lg px-3 py-2 text-xs ${noteType === "error" ? "bg-red-500/10 text-red-400" : noteType === "warn" ? "bg-amber-500/10 text-amber-400" : "bg-zinc-800 text-zinc-300"}`}>
          {note}
        </p>
      )}

      {/* Promote-first workflow banner: candidates exist but nothing promoted yet */}
      {!loading && candidates.length > 0 && totalContacts === 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          <p className="font-semibold mb-1.5">You have {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} but no promoted contacts yet — drafts only generate for promoted contacts.</p>
          <ol className="list-decimal list-inside space-y-0.5 text-amber-300/90">
            <li>Review candidates below (<a href="#sec-candidates" className="underline">jump to candidates</a>)</li>
            <li>Check the good ones and click <span className="font-medium">Promote selected → create contacts</span></li>
            <li>Click <span className="font-medium">Generate Today&apos;s Queue</span> (top right)</li>
            <li>Approve and schedule the drafts — nothing sends without your approval</li>
          </ol>
        </div>
      )}

      {/* Today's Outreach Batch — the main section */}
      <section id="sec-batch" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
        <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Mail className="h-4 w-4" /> Today&apos;s Outreach Batch ({emailDraftsReady.length})</h2>
        <p className="text-xs text-zinc-600 mt-1">Approve one batch in the morning. Nothing sends until you approve and schedule.</p>
        <div className="mt-3 space-y-2 max-h-[30rem] overflow-auto">
          {emailDraftsReady.map((m) => {
            const ct = m.contacts;
            const buyer = scoreBuyerTitle(ct?.title);
            const fullName = `${ct?.first_name ?? ""} ${ct?.last_name ?? ""}`.trim() || "(no name)";
            const expanded = expandedMsgId === m.id;
            return (
              <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={selectedEmails.has(m.id)} onChange={() => toggleEmail(m.id)} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-zinc-200 font-medium">{fullName}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ring-1 ring-inset ${TIER_BADGE[buyer.tier]}`}>{TIER_LABEL[buyer.tier]}</span>
                      <span className="rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-300">{m.status}</span>
                    </div>
                    <div>{ct?.title ? `${ct.title} · ` : ""}{ct?.companies?.name ?? "Unknown"}</div>
                    <div className="truncate">{ct?.email ?? "no email"} · source: {ct?.source ?? "—"}</div>
                    <div className="text-zinc-500">Reason selected: {buyer.label} ({TIER_LABEL[buyer.tier]})</div>
                    <div className="mt-1 text-zinc-300">Angle: {m.subject ?? "(no subject)"}</div>
                    <button
                      type="button"
                      onClick={() => setExpandedMsgId(expanded ? null : m.id)}
                      className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                    >
                      {expanded ? "Hide draft preview" : "Show draft preview"}
                    </button>
                    {expanded && (
                      <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-950/70 p-3 text-[11px] leading-relaxed text-zinc-300">
                        {m.body || "(empty draft)"}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {emailDraftsReady.length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-5 text-xs text-zinc-500 space-y-2">
              <p className="text-center">No drafts yet.</p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-600 text-[11px]">
                <li>In <span className="text-zinc-400">Contact candidates</span> below, check a candidate and click <span className="text-emerald-400">Promote selected candidates</span> — this creates a real contact.</li>
                <li>Then click <span className="text-emerald-400">Generate Today&apos;s Queue</span> above to draft emails for promoted contacts.</li>
                <li>Approve and schedule the batch. Nothing sends until you approve.</li>
              </ol>
              {totalContacts > 0 && (
                <p className="text-center text-zinc-600 pt-1">{totalContacts} contact{totalContacts !== 1 ? "s" : ""} in DB — click <span className="text-emerald-400">Generate Today&apos;s Queue</span> to draft for eligible contacts.</p>
              )}
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={approveSelectedEmailsForToday} disabled={busy !== ""} className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 px-3 py-1.5 text-xs text-emerald-400 disabled:opacity-40">Approve selected for today</button>
          <button onClick={approveAndScheduleToday} disabled={busy !== ""} className="rounded-lg bg-violet-600/20 hover:bg-violet-600/40 px-3 py-1.5 text-xs text-violet-400 disabled:opacity-40">Approve &amp; Schedule Today</button>
          <button onClick={markEmailsNeedsReview} disabled={busy !== ""} className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40">Mark needs review</button>
          <button onClick={skipSelectedEmails} disabled={busy !== ""} className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-zinc-400 disabled:opacity-40">Skip selected</button>
        </div>
      </section>

      <h2 className="pt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Research &amp; candidates</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section id="sec-companies" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Companies researched today ({companiesToday.length})</h2>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {companiesToday.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.name}</div>
                <div>{c.market ?? "—"} · score {c.company_score ?? "—"}</div>
              </div>
            ))}
            {companiesToday.length === 0 && <p className="text-xs text-zinc-600">No companies yet → research a company in <span className="text-zinc-400">Companies</span> to start.</p>}
          </div>
        </section>

        <section id="sec-candidates" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Users className="h-4 w-4" /> Contact candidates needing review ({candidates.length})</h2>
          <p className="text-xs text-zinc-600 mt-1">
            Sorted with buyer decision-makers first. <span className="text-amber-400">Promote</span> a candidate to create a contact — then generate drafts above.
          </p>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {candidatesSorted.map((c) => {
              const buyer = scoreBuyerTitle(c.title);
              const hasEmail = !!c.email;
              return (
              <label key={c.id} className="block rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 cursor-pointer">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={selectedCandidates.has(c.id)} onChange={() => toggleCandidate(c.id)} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-zinc-200 font-medium">{c.name ?? "(no name)"}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ring-1 ring-inset ${TIER_BADGE[buyer.tier]}`}>{TIER_LABEL[buyer.tier]}</span>
                      {hasEmail
                        ? (!c.name || (c.email_status ?? "").includes("generic") || c.recommended_channel === "generic_email")
                          ? <span className="rounded-full bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20 px-2 py-0.5 text-[10px]">generic email</span>
                          : <span className="rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 px-2 py-0.5 text-[10px]">has email</span>
                        : <span className="rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 px-2 py-0.5 text-[10px]">no email — Hunter needed</span>
                      }
                      {c.source_type && <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] text-zinc-400">{c.source_type}</span>}
                    </div>
                    <div>{c.title ? `${c.title} · ` : ""}{c.companies?.name ?? "Unknown"}</div>
                    <div>conf {c.confidence_score} · <span className="text-zinc-300">{actionLabel(c.recommended_action)}</span></div>
                    {c.source_url && <div className="truncate text-zinc-600">{c.source_url}</div>}
                  </div>
                </div>
              </label>
              );
            })}
            {candidates.length === 0 && <p className="text-xs text-zinc-600">No candidates yet → run Firecrawl research on a company to surface contacts.</p>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={promoteSelectedCandidates}
              disabled={busy !== "" || selectedCandidates.size === 0}
              className="rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-600/30 px-3 py-1.5 text-xs font-medium text-emerald-300 disabled:opacity-40"
            >
              {busy === "promote" ? <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Promoting…</span> : `Promote selected → create contact${selectedCandidates.size > 1 ? "s" : ""}`}
            </button>
            <button onClick={skipSelectedCandidates} disabled={busy !== ""} className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40">Skip selected</button>
          </div>
          {selectedCandidates.size > 0 && (
            <p className="mt-2 text-[11px] text-zinc-500">
              {selectedCandidates.size} selected — promote to create contacts, then click <span className="text-emerald-400">Generate Today&apos;s Queue</span> to draft emails.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Search className="h-4 w-4" /> Hunter lookup queue ({hunterQueue.length})</h2>
          <p className="text-xs text-zinc-600 mt-1">Manual only. Hunter never runs unless you approve.</p>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {hunterQueue.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.name ?? "(no name)"} {c.email ? `· ${c.email}` : ""}</div>
                <div>{c.companies?.name ?? "Unknown"} · status {c.email_status ?? "—"} · action {c.recommended_action ?? "—"}</div>
              </div>
            ))}
            {hunterQueue.length === 0 && <p className="text-xs text-zinc-600">No hunter lookups queued.</p>}
          </div>
          <div className="mt-3">
            <button onClick={approveSelectedHunterLookups} disabled={busy !== ""} className="rounded-lg bg-sky-600/20 hover:bg-sky-600/40 px-3 py-1.5 text-xs text-sky-400 disabled:opacity-40">Approve selected Hunter lookups</button>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Link className="h-4 w-4" /> LinkedIn drafts ready ({linkedInDraftsReady.length})</h2>
          <div className="mt-3 space-y-2 max-h-56 overflow-auto">
            {linkedInDraftsReady.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.name ?? "(no name)"}</div>
                <div>{c.title ?? "—"} · {c.companies?.name ?? "Unknown"}</div>
              </div>
            ))}
            {linkedInDraftsReady.length === 0 && <p className="text-xs text-zinc-600">No LinkedIn drafts queued.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Contact form tasks ready ({contactFormTasksReady.length})</h2>
          <div className="mt-3 space-y-2 max-h-56 overflow-auto">
            {contactFormTasksReady.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.companies?.name ?? "Unknown"}</div>
                <div className="truncate">{c.source_url ?? c.source_excerpt ?? "No URL"}</div>
              </div>
            ))}
            {contactFormTasksReady.length === 0 && <p className="text-xs text-zinc-600">No contact form tasks queued.</p>}
          </div>
        </section>

        <section id="sec-scheduled" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Send className="h-4 w-4" /> Scheduled &amp; sent today ({scheduledSends.length} scheduled · {sentToday.length} sent)</h2>
          {approvedAwaitingSchedule.length > 0 && (
            <p className="mt-1 text-xs text-violet-400">{approvedAwaitingSchedule.length} approved, awaiting schedule — click “Approve &amp; Schedule Today”.</p>
          )}
          <div className="mt-3 space-y-2 max-h-56 overflow-auto">
            {scheduledSends.map((m) => (
              <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{m.subject ?? "(no subject)"}</div>
                <div>{m.scheduled_send_at ? new Date(m.scheduled_send_at).toLocaleString() : "pending schedule"}</div>
              </div>
            ))}
            {sentToday.map((m) => (
              <div key={m.id} className="rounded-lg bg-emerald-500/5 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{m.subject ?? "(no subject)"} <span className="text-emerald-400">· sent</span></div>
                <div>{m.sent_at ? new Date(m.sent_at).toLocaleString() : ""}</div>
              </div>
            ))}
            {scheduledSends.length === 0 && sentToday.length === 0 && (
              <p className="text-xs text-zinc-600">No scheduled sends → approve and schedule today&apos;s batch above.</p>
            )}
          </div>
          <div className="mt-3">
            <button onClick={sendDueNow} disabled={busy !== ""} className="rounded-lg bg-amber-600/20 hover:bg-amber-600/40 px-3 py-1.5 text-xs text-amber-400 disabled:opacity-40">Send Due Now</button>
          </div>
        </section>

        <section id="sec-failures" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4 xl:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><MessageSquareWarning className="h-4 w-4" /> Replies / opt-outs / failures ({contactIssues.length + failures.length})</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-500 mb-2">Contact-level</p>
              <div className="space-y-2 max-h-64 overflow-auto">
                {contactIssues.map((c) => (
                  <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                    <div className="text-zinc-200 font-medium">{c.first_name} {c.last_name} · {c.companies?.name ?? "Unknown"}</div>
                    <div>{c.email ?? "no email"} · {c.status ?? "—"} {c.replied_at ? "· replied" : ""} {c.email_opt_out ? "· opted out" : ""} {c.bounced ? "· bounced" : ""}</div>
                  </div>
                ))}
                {contactIssues.length === 0 && <p className="text-xs text-zinc-600">No contact issues.</p>}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-2">Message-level</p>
              <div className="space-y-2 max-h-64 overflow-auto">
                {failures.map((m) => (
                  <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                    <div className="text-zinc-200 font-medium">{m.subject ?? "(no subject)"}</div>
                    <div>status: {m.status}</div>
                  </div>
                ))}
                {failures.length === 0 && <p className="text-xs text-zinc-600">No message failures/replies recorded.</p>}
              </div>
            </div>
          </div>
        </section>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading daily queues…
          </div>
        </div>
      )}
    </div>
  );
}
