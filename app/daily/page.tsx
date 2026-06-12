"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageSquareWarning,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
import { scoreBuyerTitle, actionLabel, TIER_BADGE, TIER_LABEL } from "@/lib/buyer-titles";
import { generateTodaysDrafts, describeSkipped } from "@/lib/generate-drafts";

// ── Types ──────────────────────────────────────────────────────────────────────

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
  contacts?: {
    first_name?: string | null;
    last_name?: string | null;
    title?: string | null;
    email?: string | null;
    source?: string | null;
    companies?: { name?: string | null } | null;
  } | null;
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

type AppFlags = { test_mode: boolean; require_manual_approval: boolean };

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ── Page ──────────────────────────────────────────────────────────────────────

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

  // ── Data loading ─────────────────────────────────────────────────────────────

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

    const [
      settingsRes,
      companiesRes,
      candidatesRes,
      messagesRes,
      contactsRes,
      totalCompaniesRes,
      totalContactsRes,
    ] = await Promise.all([
      supabase.from("app_settings").select("test_mode, require_manual_approval, daily_send_goal").limit(1).single(),
      supabase
        .from("companies")
        .select("id, name, website, last_researched_at, market, company_score")
        .gte("last_researched_at", todayIso)
        .order("last_researched_at", { ascending: false })
        .limit(100),
      supabase
        .from("contact_candidates")
        .select(
          "id, company_id, name, title, email, email_status, email_confidence, linkedin_url, recommended_action, recommended_channel, confidence_score, status, source_url, source_type, source_excerpt, companies(name, website)"
        )
        .eq("status", "needs_review")
        .order("confidence_score", { ascending: false })
        .limit(300),
      supabase
        .from("messages")
        .select(
          "id, channel, status, subject, body, created_at, scheduled_send_at, sent_at, contacts(first_name,last_name,title,email,source,companies(name))"
        )
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

    setCompaniesToday((companiesRes.data ?? []) as unknown as CompanyToday[]);
    setCandidates((candidatesRes.data ?? []) as unknown as Candidate[]);
    setMessages((messagesRes.data ?? []) as unknown as MessageRow[]);
    setContactIssues((contactsRes.data ?? []) as unknown as ContactIssue[]);
    setTotalCompanies(totalCompaniesRes.count ?? 0);
    setTotalContacts(totalContactsRes.count ?? 0);
    setSelectedCandidates(new Set());
    setSelectedEmails(new Set());
    setLoading(false);
  }

  useEffect(() => {
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────────

  const hunterQueue = useMemo(
    () =>
      candidates.filter(
        (c) =>
          c.recommended_action === "verify_with_hunter" ||
          c.email_status === "needs_email" ||
          c.email_status === "unverified" ||
          c.email_status === "risky"
      ),
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

  const approvedAwaitingSchedule = useMemo(
    () => messages.filter((m) => m.channel === "email" && (m.status === "approved_for_today" || m.status === "approved")),
    [messages]
  );

  const failures = useMemo(
    () =>
      messages.filter(
        (m) =>
          m.status === "failed" ||
          m.status === "send_failed" ||
          m.status === "bounced" ||
          m.status === "replied"
      ),
    [messages]
  );

  const sentToday = useMemo(() => {
    const todayIso = startOfTodayIso();
    return messages.filter((m) => m.status === "sent" && m.sent_at && m.sent_at >= todayIso);
  }, [messages]);

  const candidatesSorted = useMemo(
    () =>
      [...candidates].sort(
        (a, b) =>
          scoreBuyerTitle(b.title).score - scoreBuyerTitle(a.title).score ||
          b.confidence_score - a.confidence_score
      ),
    [candidates]
  );

  // Which step needs action right now?
  const nextAction = useMemo(() => {
    if (totalCompanies === 0)
      return { step: 1 as const, msg: "Add companies first — go to Companies and research at least one." };
    if (candidates.length > 0 && totalContacts === 0)
      return { step: 1 as const, msg: `Promote ${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} below to create contacts, then generate drafts.` };
    if (candidates.length > 0)
      return { step: 1 as const, msg: `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} still need review — promote the good ones.` };
    if (totalContacts > 0 && emailDraftsReady.length === 0)
      return { step: 2 as const, msg: `Generate drafts for ${totalContacts} contact${totalContacts !== 1 ? "s" : ""}.` };
    if (emailDraftsReady.length > 0 && approvedAwaitingSchedule.length === 0 && scheduledSends.length === 0)
      return { step: 3 as const, msg: `Approve ${emailDraftsReady.length} draft${emailDraftsReady.length !== 1 ? "s" : ""} — select below, then approve and schedule.` };
    if (approvedAwaitingSchedule.length > 0)
      return { step: 3 as const, msg: `${approvedAwaitingSchedule.length} approved — click Approve & Schedule Today.` };
    if (scheduledSends.length > 0)
      return { step: 4 as const, msg: `${scheduledSends.length} scheduled — click Send Due Now when ready.` };
    return { step: 2 as const, msg: "Pipeline looks good — research more companies or check Growth." };
  }, [totalCompanies, candidates.length, totalContacts, emailDraftsReady.length, approvedAwaitingSchedule.length, scheduledSends.length]);

  // ── Selection toggles ─────────────────────────────────────────────────────────

  function toggleCandidate(id: string) {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleEmail(id: string) {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  // PART A FIX: 20s timeout, try/catch/finally (busy always resets), console diagnostics, actual error text.
  async function promoteSelectedCandidates() {
    const selected = candidates.filter((c) => selectedCandidates.has(c.id));
    if (selected.length === 0) {
      setNoteType("warn");
      setNote("Select at least one candidate in the 'Contact candidates' section below first.");
      return;
    }

    setBusy("promote");
    setNote(null);
    let ok = 0;
    let fail = 0;
    const errors: string[] = [];
    const noEmailNames: string[] = [];

    if (process.env.NODE_ENV === "development") {
      console.log("[promote] starting:", selected.map((c) => ({ id: c.id, name: c.name, hasEmail: !!c.email })));
    }

    try {
      for (const cand of selected) {
        if (!cand.email) noEmailNames.push(cand.name ?? "(no name)");

        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 20_000);

        try {
          const res = await fetch("/api/research/promote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidate_id: cand.id }),
            signal: controller.signal,
          });
          clearTimeout(tid);

          if (process.env.NODE_ENV === "development") {
            console.log("[promote] HTTP", res.status, "for candidate", cand.id);
          }

          let body: { ok?: boolean; error?: string; already_promoted?: boolean; deduped?: boolean } = {};
          try {
            body = await res.json();
          } catch {
            body = { ok: false, error: `HTTP ${res.status} — response was not JSON` };
          }

          if (process.env.NODE_ENV === "development") {
            console.log("[promote] response body:", body, "for", cand.id);
          }

          if (body.ok) {
            ok++;
          } else {
            fail++;
            if (body.error) errors.push(body.error);
          }
        } catch (err) {
          clearTimeout(tid);
          fail++;
          const isAbort = err instanceof Error && err.name === "AbortError";
          const msg = isAbort
            ? `Timed out after 20s for "${cand.name ?? cand.id}" — check SUPABASE_SERVICE_ROLE_KEY in .env.local`
            : err instanceof Error
            ? err.message
            : String(err);
          errors.push(msg);
          if (process.env.NODE_ENV === "development") {
            console.error("[promote] error for", cand.id, ":", err);
          }
        }
      }

      setNoteType(fail > 0 ? "warn" : "info");
      const parts: string[] = [
        `Promoted ${ok} contact${ok !== 1 ? "s" : ""}${fail > 0 ? `, ${fail} failed` : ""}.`,
      ];
      if (ok > 0) parts.push("Now click Generate Today's Queue to draft emails.");
      if (noEmailNames.length > 0)
        parts.push(`No email: ${noEmailNames.join(", ")} — run Hunter lookup first.`);
      if (errors.length > 0)
        parts.push(`Error${errors.length > 1 ? "s" : ""}: ${errors.slice(0, 2).join("; ")}.`);
      setNote(parts.join(" "));
    } finally {
      setBusy("");
      try {
        await reloadAll();
      } catch {
        // reloadAll doesn't throw but belt-and-suspenders
      }
    }
  }

  async function skipSelectedCandidates() {
    const ids = candidates.filter((c) => selectedCandidates.has(c.id)).map((c) => c.id);
    if (ids.length === 0) return setNote("Select candidate(s) first.");

    setBusy("skip");
    try {
      for (const id of ids) {
        await fetch("/api/research/candidate-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: id, action: "skip" }),
        });
      }
      setNote(`Skipped ${ids.length} candidate(s).`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function approveSelectedHunterLookups() {
    const selected = candidates.filter((c) => selectedCandidates.has(c.id));
    if (selected.length === 0) return setNote("Select candidate(s) in Hunter queue first.");

    setBusy("hunter");
    setNote(null);
    let ok = 0;
    let fail = 0;

    try {
      for (const cand of selected) {
        try {
          const endpoint =
            cand.email && cand.email_status !== "verified"
              ? "/api/hunter/verify-email"
              : "/api/hunter/find-email";
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidate_id: cand.id }),
          });
          const body = await res.json();
          if (body.ok) ok++;
          else fail++;
        } catch {
          fail++;
        }
      }
      setNote(`Hunter lookups: ${ok} success, ${fail} failed.`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function generateTodaysQueue() {
    setBusy("generate");
    setNote(null);
    try {
      const r = await generateTodaysDrafts();
      if (r.noContacts) {
        setNoteType("warn");
        setNote(
          "No promoted contacts — select candidate(s) in the section below and click 'Promote selected', then generate drafts again."
        );
      } else if (r.made > 0) {
        setNoteType("info");
        const skippedNote =
          r.skipped && describeSkipped(r.skipped) ? ` Skipped: ${describeSkipped(r.skipped)}.` : "";
        setNote(
          `Generated ${r.made} draft${r.made !== 1 ? "s" : ""} into Today's Outreach Batch.${skippedNote}`
        );
      } else {
        setNoteType("warn");
        setNote(r.reason ?? "No new eligible contacts to draft.");
      }
    } catch (e) {
      setNoteType("error");
      setNote(`Generate failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

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
    if (ids.length === 0) return setNote("Select email draft(s) below first.");
    setBusy("approveEmails");
    try {
      const ok = await markApprovedForToday(ids);
      if (ok) setNote(`Approved ${ids.length} email(s). Click "Approve & Schedule Today" to schedule.`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function approveAndScheduleToday() {
    setBusy("schedule");
    setNote(null);
    try {
      const selectedIds = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
      const ok = await markApprovedForToday(selectedIds);
      if (!ok) return;
      const res = await fetch("/api/schedule-approved-today", { method: "POST" });
      const body = await res.json();
      setNote(
        body.ok
          ? `Scheduled ${body.scheduled} email(s) across today's send window.`
          : `Schedule failed: ${body.error}`
      );
    } catch (e) {
      setNote(`Schedule failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function sendDueNow() {
    setBusy("sendDue");
    try {
      const res = await fetch("/api/send-due", { method: "POST" });
      const body = await res.json();
      setNote(
        body.ok
          ? `Sent ${body.sent ?? 0}, failed ${body.failed ?? 0}.`
          : `Send failed: ${body.error}`
      );
    } catch (e) {
      setNote(`Send failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function skipSelectedEmails() {
    const ids = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    if (ids.length === 0) return setNote("Select email draft(s) first.");
    setBusy("skipEmails");
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status: "skipped" })
        .in("id", ids)
        .in("status", ["draft", "needs_review"]);
      setNote(error ? `Skip failed: ${error.message}` : `Skipped ${ids.length} draft(s).`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  async function markEmailsNeedsReview() {
    const ids = emailDraftsReady.filter((m) => selectedEmails.has(m.id)).map((m) => m.id);
    if (ids.length === 0) return setNote("Select email draft(s) first.");
    setBusy("needsReview");
    try {
      const { error } = await supabase.from("messages").update({ status: "needs_review" }).in("id", ids);
      setNote(error ? `Update failed: ${error.message}` : `Marked ${ids.length} draft(s) as needs review.`);
    } finally {
      setBusy("");
      await reloadAll();
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const isBusy = busy !== "";

  // Candidates with no email among selected
  const selectedNoEmail = candidates
    .filter((c) => selectedCandidates.has(c.id) && !c.email)
    .map((c) => c.name ?? "(no name)");

  return (
    <div className="px-6 py-6 max-w-7xl space-y-5">
      <PageHeader title="Command Center" description="Daily outreach workflow — find, promote, draft, approve, send." />

      {/* Safety badges + target */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ring-inset font-medium ${
            settingsFlags.test_mode
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
              : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}
        >
          {settingsFlags.test_mode ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          Test mode {settingsFlags.test_mode ? "ON" : "OFF"}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1 ring-inset font-medium ${
            settingsFlags.require_manual_approval
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
              : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}
        >
          {settingsFlags.require_manual_approval ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          Manual approval {settingsFlags.require_manual_approval ? "REQUIRED" : "OFF"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">
          Daily target: <span className="font-semibold text-zinc-100 ml-0.5">{dailyGoal}</span>
        </span>
        <button
          onClick={reloadAll}
          disabled={loading}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {[
          {
            label: "Companies",
            count: totalCompanies,
            sub: `${companiesToday.length} today`,
            href: "/companies",
          },
          { label: "To review", count: candidates.length, sub: "candidates", href: "#sec-candidates" },
          { label: "Contacts", count: totalContacts, sub: "promoted", href: "/contacts" },
          { label: "Drafts", count: emailDraftsReady.length, sub: null, href: "#sec-batch" },
          { label: "Approved", count: approvedAwaitingSchedule.length, sub: null, href: "#sec-scheduled" },
          { label: "Scheduled", count: scheduledSends.length, sub: null, href: "#sec-scheduled" },
          { label: "Sent", count: sentToday.length, sub: "today", href: "#sec-scheduled" },
          { label: "Failed", count: failures.length, sub: null, href: "#sec-failures" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-2.5 text-center transition hover:border-zinc-600"
          >
            <div className="text-lg font-semibold text-zinc-100">{s.count}</div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">{s.label}</div>
            {s.sub && <div className="text-[9px] text-zinc-600 mt-0.5">{s.sub}</div>}
          </a>
        ))}
      </div>

      {/* ── NEXT BEST ACTION ─────────────────────────────────────────────────── */}
      {!loading && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="text-xs text-zinc-300">
            <span className="font-semibold text-zinc-100">Next: </span>
            {nextAction.msg}
          </span>
          <span className="ml-auto text-[10px] text-zinc-600 shrink-0">Step {nextAction.step} of 4</span>
        </div>
      )}

      {/* ── 4-STEP WORKFLOW ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

        {/* Step 1: Review & Promote */}
        <div
          className={`rounded-xl border p-4 flex flex-col gap-3 ${
            nextAction.step === 1
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 1</span>
            {nextAction.step === 1 && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                Action needed
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-400" /> Review &amp; Promote
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {candidates.length > 0
                ? `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} waiting`
                : totalContacts > 0
                ? `${totalContacts} contact${totalContacts !== 1 ? "s" : ""} ready`
                : "No candidates yet — research a company"}
            </p>
          </div>

          {selectedCandidates.size > 0 && (
            <div className="rounded-lg bg-zinc-800/60 px-2.5 py-2 text-[11px] text-zinc-300">
              <span className="font-medium text-zinc-100">{selectedCandidates.size} selected</span>
              {selectedNoEmail.length > 0 && (
                <span className="ml-1 text-amber-400">· {selectedNoEmail.length} no email</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5 mt-auto">
            <button
              onClick={promoteSelectedCandidates}
              disabled={isBusy || selectedCandidates.size === 0}
              className="w-full rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-600/30 px-3 py-2 text-xs font-medium text-emerald-300 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {busy === "promote" ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Promoting…
                </>
              ) : selectedCandidates.size > 0 ? (
                `Promote ${selectedCandidates.size} selected →`
              ) : (
                "Select candidates below ↓"
              )}
            </button>
            {candidates.length > 0 && selectedCandidates.size === 0 && (
              <a href="#sec-candidates" className="text-center text-[11px] text-zinc-500 hover:text-emerald-400">
                View {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ↓
              </a>
            )}
          </div>
        </div>

        {/* Step 2: Generate Drafts */}
        <div
          className={`rounded-xl border p-4 flex flex-col gap-3 ${
            nextAction.step === 2
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 2</span>
            {nextAction.step === 2 && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-medium">
                Action needed
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-400" /> Generate Drafts
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {totalContacts === 0
                ? "No contacts — promote candidates first"
                : emailDraftsReady.length > 0
                ? `${emailDraftsReady.length} draft${emailDraftsReady.length !== 1 ? "s" : ""} already generated`
                : `${totalContacts} contact${totalContacts !== 1 ? "s" : ""} ready to draft`}
            </p>
            {totalContacts === 0 && (
              <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Complete Step 1 first
              </p>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={generateTodaysQueue}
              disabled={isBusy || totalContacts === 0}
              className="w-full rounded-lg bg-emerald-600/25 hover:bg-emerald-600/40 border border-emerald-600/30 px-3 py-2 text-xs font-medium text-emerald-300 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {busy === "generate" ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3" /> Generate Today&apos;s Queue
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 3: Approve Drafts */}
        <div
          className={`rounded-xl border p-4 flex flex-col gap-3 ${
            nextAction.step === 3
              ? "border-violet-500/40 bg-violet-500/5"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 3</span>
            {nextAction.step === 3 && (
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-400 font-medium">
                Action needed
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-zinc-400" /> Approve Drafts
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {emailDraftsReady.length === 0
                ? "No drafts yet — generate first"
                : `${emailDraftsReady.length} draft${emailDraftsReady.length !== 1 ? "s" : ""} ready to review`}
            </p>
            {selectedEmails.size > 0 && (
              <p className="mt-1 text-[11px] text-zinc-300">
                <span className="font-medium text-zinc-100">{selectedEmails.size} selected</span> — approve or schedule
              </p>
            )}
            {emailDraftsReady.length > 0 && selectedEmails.size === 0 && (
              <p className="mt-1 text-[11px] text-zinc-500">Select drafts below ↓</p>
            )}
            <p className="mt-1.5 text-[10px] text-zinc-600">Nothing sends without your approval.</p>
          </div>

          <div className="flex flex-col gap-1.5 mt-auto">
            <button
              onClick={approveSelectedEmailsForToday}
              disabled={isBusy || selectedEmails.size === 0}
              className="w-full rounded-lg bg-violet-600/25 hover:bg-violet-600/40 border border-violet-600/30 px-3 py-2 text-xs font-medium text-violet-300 disabled:opacity-40"
            >
              {busy === "approveEmails" ? "Approving…" : "Approve selected for today"}
            </button>
            <button
              onClick={approveAndScheduleToday}
              disabled={isBusy}
              className="w-full rounded-lg bg-violet-600/15 hover:bg-violet-600/30 border border-violet-600/20 px-3 py-2 text-xs font-medium text-violet-400 disabled:opacity-40"
            >
              {busy === "schedule" ? "Scheduling…" : "Approve & Schedule Today"}
            </button>
            {emailDraftsReady.length > 0 && selectedEmails.size === 0 && (
              <a href="#sec-batch" className="text-center text-[11px] text-zinc-500 hover:text-violet-400">
                View {emailDraftsReady.length} draft{emailDraftsReady.length !== 1 ? "s" : ""} ↓
              </a>
            )}
          </div>
        </div>

        {/* Step 4: Send */}
        <div
          className={`rounded-xl border p-4 flex flex-col gap-3 ${
            nextAction.step === 4
              ? "border-amber-500/40 bg-amber-500/5"
              : "border-zinc-800 bg-zinc-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Step 4</span>
            {nextAction.step === 4 && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400 font-medium">
                Action needed
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Send className="h-4 w-4 text-zinc-400" /> Send
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              {scheduledSends.length > 0
                ? `${scheduledSends.length} scheduled · ${sentToday.length} sent today`
                : approvedAwaitingSchedule.length > 0
                ? `${approvedAwaitingSchedule.length} approved, awaiting schedule`
                : "No sends scheduled yet"}
            </p>
            {settingsFlags.test_mode && (
              <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Test mode — sends only to test inbox
              </p>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={sendDueNow}
              disabled={isBusy}
              className="w-full rounded-lg bg-amber-600/20 hover:bg-amber-600/35 border border-amber-600/25 px-3 py-2 text-xs font-medium text-amber-300 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {busy === "sendDue" ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" /> Send Due Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Note */}
      {note && (
        <div
          className={`rounded-lg px-3 py-2 text-xs ${
            noteType === "error"
              ? "bg-red-500/10 text-red-400"
              : noteType === "warn"
              ? "bg-amber-500/10 text-amber-400"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {note}
        </div>
      )}

      {/* ── DETAIL SECTIONS ──────────────────────────────────────────────────── */}
      <p className="pt-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
        Detailed queues — select items here, then use the step buttons above
      </p>

      {/* Today's Outreach Batch */}
      <section id="sec-batch" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
        <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Mail className="h-4 w-4" /> Today&apos;s Outreach Batch ({emailDraftsReady.length})
        </h2>
        <p className="text-xs text-zinc-600 mt-0.5">
          Select drafts, then use Step 3 buttons above to approve. Nothing sends without approval.
        </p>
        {(() => {
          const byCompany = new Map<string, number>();
          for (const m of emailDraftsReady) {
            const co = m.contacts?.companies?.name;
            if (co) byCompany.set(co, (byCompany.get(co) ?? 0) + 1);
          }
          const multi = [...byCompany.entries()].filter(([, n]) => n > 1).map(([co, n]) => `${co} (${n})`);
          return multi.length > 0 ? (
            <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              ⚠ Multiple drafts at the same company: {multi.join(", ")}. Do not message several executives at
              once. Start with the best-fit person, wait 3 business days, then route through a second person
              if needed. Skip the extras for now.
            </p>
          ) : null;
        })()}

        <div className="mt-3 space-y-2 max-h-[30rem] overflow-auto">
          {emailDraftsReady.map((m) => {
            const ct = m.contacts;
            const buyer = scoreBuyerTitle(ct?.title);
            const fullName = `${ct?.first_name ?? ""} ${ct?.last_name ?? ""}`.trim() || "(no name)";
            const expanded = expandedMsgId === m.id;
            return (
              <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEmails.has(m.id)}
                    onChange={() => toggleEmail(m.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-zinc-200 font-medium">{fullName}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ring-1 ring-inset ${TIER_BADGE[buyer.tier]}`}
                      >
                        {TIER_LABEL[buyer.tier]}
                      </span>
                      <span className="rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-300">
                        {m.status}
                      </span>
                    </div>
                    <div>
                      {ct?.title ? `${ct.title} · ` : ""}
                      {ct?.companies?.name ?? "Unknown"}
                    </div>
                    <div className="truncate">
                      {ct?.email ?? "no email"} · source: {ct?.source ?? "—"}
                    </div>
                    <div className="mt-1 text-zinc-300">Angle: {m.subject ?? "(no subject)"}</div>
                    <button
                      type="button"
                      onClick={() => setExpandedMsgId(expanded ? null : m.id)}
                      className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                    >
                      {expanded ? "Hide draft" : "Show draft"}
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
            <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-5 text-center text-xs text-zinc-600">
              {totalContacts > 0
                ? `${totalContacts} contact${totalContacts !== 1 ? "s" : ""} ready — click Generate Today's Queue (Step 2 above).`
                : "No drafts yet — complete Step 1 (promote) then Step 2 (generate)."}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={markEmailsNeedsReview}
            disabled={isBusy}
            className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
          >
            Mark needs review
          </button>
          <button
            onClick={skipSelectedEmails}
            disabled={isBusy}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs text-zinc-400 disabled:opacity-40"
          >
            Skip selected
          </button>
        </div>
      </section>

      {/* Research & Candidates */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Companies researched today */}
        <section id="sec-companies" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Companies researched today ({companiesToday.length})
          </h2>
          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {companiesToday.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.name}</div>
                <div>
                  {c.market ?? "—"} · score {c.company_score ?? "—"}
                </div>
              </div>
            ))}
            {companiesToday.length === 0 && (
              <p className="text-xs text-zinc-600">
                None today —{" "}
                <NextLink href="/companies" className="text-zinc-400 hover:text-emerald-400">
                  research a company
                </NextLink>{" "}
                to surface contact candidates.
              </p>
            )}
          </div>
        </section>

        {/* Contact candidates */}
        <section id="sec-candidates" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Users className="h-4 w-4" /> Contact candidates needing review ({candidates.length})
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Check candidates, then click Step 1 button above to promote them into real contacts.
          </p>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {candidatesSorted.map((c) => {
              const buyer = scoreBuyerTitle(c.title);
              const hasEmail = !!c.email;
              return (
                <label
                  key={c.id}
                  className="block rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(c.id)}
                      onChange={() => toggleCandidate(c.id)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-zinc-200 font-medium">{c.name ?? "(no name)"}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ring-1 ring-inset ${TIER_BADGE[buyer.tier]}`}
                        >
                          {TIER_LABEL[buyer.tier]}
                        </span>
                        {hasEmail ? (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 px-2 py-0.5 text-[10px]">
                            has email
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 px-2 py-0.5 text-[10px]">
                            no email — Hunter needed
                          </span>
                        )}
                        {c.source_type && (
                          <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] text-zinc-400">
                            {c.source_type}
                          </span>
                        )}
                      </div>
                      <div>
                        {c.title ? `${c.title} · ` : ""}
                        {c.companies?.name ?? "Unknown"}
                      </div>
                      <div>
                        conf {c.confidence_score} ·{" "}
                        <span className="text-zinc-300">{actionLabel(c.recommended_action)}</span>
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
            {candidates.length === 0 && (
              <p className="text-xs text-zinc-600">
                No candidates — run research on a company to surface contacts.
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={skipSelectedCandidates}
              disabled={isBusy}
              className="rounded-lg bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
            >
              Skip selected
            </button>
          </div>
        </section>

        {/* Hunter queue */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Search className="h-4 w-4" /> Hunter lookup queue ({hunterQueue.length})
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">Manual only — Hunter never runs unless you approve.</p>
          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {hunterQueue.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">
                  {c.name ?? "(no name)"} {c.email ? `· ${c.email}` : ""}
                </div>
                <div>
                  {c.companies?.name ?? "Unknown"} · {c.email_status ?? "—"}
                </div>
              </div>
            ))}
            {hunterQueue.length === 0 && (
              <p className="text-xs text-zinc-600">No Hunter lookups queued.</p>
            )}
          </div>
          <div className="mt-3">
            <button
              onClick={approveSelectedHunterLookups}
              disabled={isBusy}
              className="rounded-lg bg-sky-600/20 hover:bg-sky-600/40 px-3 py-1.5 text-xs text-sky-400 disabled:opacity-40"
            >
              {busy === "hunter" ? "Running…" : "Approve selected Hunter lookups"}
            </button>
          </div>
        </section>

        {/* LinkedIn drafts */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <LinkIcon className="h-4 w-4" /> LinkedIn drafts ready ({linkedInDraftsReady.length})
          </h2>
          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {linkedInDraftsReady.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.name ?? "(no name)"}</div>
                <div>
                  {c.title ?? "—"} · {c.companies?.name ?? "Unknown"}
                </div>
              </div>
            ))}
            {linkedInDraftsReady.length === 0 && (
              <p className="text-xs text-zinc-600">No LinkedIn drafts queued.</p>
            )}
          </div>
        </section>

        {/* Contact form tasks */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Contact form tasks ({contactFormTasksReady.length})
          </h2>
          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {contactFormTasksReady.map((c) => (
              <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{c.companies?.name ?? "Unknown"}</div>
                <div className="truncate">{c.source_url ?? c.source_excerpt ?? "No URL"}</div>
              </div>
            ))}
            {contactFormTasksReady.length === 0 && (
              <p className="text-xs text-zinc-600">No contact form tasks queued.</p>
            )}
          </div>
        </section>

        {/* Scheduled / sent */}
        <section id="sec-scheduled" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Send className="h-4 w-4" /> Scheduled &amp; sent ({scheduledSends.length} scheduled ·{" "}
            {sentToday.length} sent)
          </h2>
          {approvedAwaitingSchedule.length > 0 && (
            <p className="mt-1 text-xs text-violet-400">
              {approvedAwaitingSchedule.length} approved, awaiting schedule — use Step 3 above.
            </p>
          )}
          <div className="mt-3 space-y-2 max-h-48 overflow-auto">
            {scheduledSends.map((m) => (
              <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">{m.subject ?? "(no subject)"}</div>
                <div>
                  {m.scheduled_send_at
                    ? new Date(m.scheduled_send_at).toLocaleString()
                    : "pending schedule"}
                </div>
              </div>
            ))}
            {sentToday.map((m) => (
              <div key={m.id} className="rounded-lg bg-emerald-500/5 px-3 py-2 text-xs text-zinc-400">
                <div className="text-zinc-200 font-medium">
                  {m.subject ?? "(no subject)"}{" "}
                  <span className="text-emerald-400">· sent</span>
                </div>
                <div>{m.sent_at ? new Date(m.sent_at).toLocaleString() : ""}</div>
              </div>
            ))}
            {scheduledSends.length === 0 && sentToday.length === 0 && (
              <p className="text-xs text-zinc-600">No sends today — approve and schedule above.</p>
            )}
          </div>
        </section>

        {/* Failures / opt-outs */}
        <section id="sec-failures" className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 scroll-mt-4 xl:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <MessageSquareWarning className="h-4 w-4" /> Replies / opt-outs / failures (
            {contactIssues.length + failures.length})
          </h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-500 mb-2">Contact-level</p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {contactIssues.map((c) => (
                  <div key={c.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                    <div className="text-zinc-200 font-medium">
                      {c.first_name} {c.last_name} · {c.companies?.name ?? "Unknown"}
                    </div>
                    <div>
                      {c.email ?? "no email"} · {c.status ?? "—"}
                      {c.replied_at ? " · replied" : ""}
                      {c.email_opt_out ? " · opted out" : ""}
                      {c.bounced ? " · bounced" : ""}
                    </div>
                  </div>
                ))}
                {contactIssues.length === 0 && (
                  <p className="text-xs text-zinc-600">No contact issues.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-2">Message-level</p>
              <div className="space-y-2 max-h-48 overflow-auto">
                {failures.map((m) => (
                  <div key={m.id} className="rounded-lg bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400">
                    <div className="text-zinc-200 font-medium">{m.subject ?? "(no subject)"}</div>
                    <div>status: {m.status}</div>
                  </div>
                ))}
                {failures.length === 0 && (
                  <p className="text-xs text-zinc-600">No failures recorded.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        </div>
      )}
    </div>
  );
}
