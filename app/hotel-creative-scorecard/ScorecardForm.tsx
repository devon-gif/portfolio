"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  ANSWER_OPTIONS,
  COMPANY_TYPES,
  CTA_SUBTEXT,
  MAX_SCORE,
  PROPERTY_COUNTS,
  QUESTIONS,
  type AnswerValue,
} from "@/lib/scorecard";
import { gapReviewLink } from "@/lib/site-config";

/* ----------------------------- Validation ----------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function isValidWebsite(raw: string): boolean {
  const v = raw.trim();
  if (!v) return true; // optional unless required by caller
  try {
    const u = new URL(normalizeUrl(v));
    return /^[^\s.]+(\.[^\s.]+)+$/.test(u.hostname) && u.hostname.includes(".");
  } catch {
    return false;
  }
}

function isValidLinkedIn(raw: string): boolean {
  const v = raw.trim();
  if (!v) return true;
  try {
    return new URL(normalizeUrl(v)).hostname.toLowerCase().endsWith("linkedin.com");
  } catch {
    return false;
  }
}

/* ------------------------------- Styling ------------------------------- */

const FIELD =
  "w-full rounded-xl border bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition placeholder:text-[#6f685c]";
const LABEL = "mb-2 block text-sm font-medium text-[#E8D7A2]";
const GOLD = "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)";

function fieldCls(error?: string): string {
  return `${FIELD} ${error ? "border-[#C2554F] focus:border-[#E08A84]" : "border-[rgba(201,164,76,0.18)] focus:border-[#C9A44C]"}`;
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={LABEL}>
        {label} {hint && <span className="text-[#6f685c]">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-[#F3A6A6]">{error}</span>}
    </label>
  );
}

const CARD =
  "rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[#100e0b]/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-8";

/* ------------------------------- Types -------------------------------- */

type AiAudit = {
  scoreTotal: number;
  scoreBand: string;
  confidence: string;
  summary: string;
  whatAiSaw: string[];
  strongestGaps: string[];
  quickWins: string[];
  recommendedNextStep: string;
};

type AiResponse = {
  ok?: boolean;
  enabled?: boolean;
  fallback?: boolean;
  cached?: boolean;
  submissionId?: string | null;
  website?: string;
  audit?: AiAudit;
  error?: string;
};

type ManualResult = {
  scoreTotal: number;
  band: { key: string; label: string; explanation: string };
  gaps: string[];
  recommendedNextStep: string;
  submissionId: string | null;
};

const LOADING_STAGES = [
  "Scanning your website…",
  "Checking property-level creative signals…",
  "Looking for F&B, event, meeting, wedding, and local campaign opportunities…",
  "Reviewing visual polish and campaign clarity…",
  "Building your preliminary creative bandwidth score…",
];

/* ============================ Top-level form ============================ */

export function ScorecardForm() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");

  if (mode === "manual") {
    return <ManualScorecard onUseAi={() => setMode("ai")} />;
  }
  return <AiFlow onUseManual={() => setMode("manual")} />;
}

/* ============================== AI flow =============================== */

function AiFlow({ onUseManual }: { onUseManual: () => void }) {
  const [phase, setPhase] = useState<"intake" | "loading" | "result">("intake");
  const [stageIdx, setStageIdx] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", website: "", role: "" });
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<AiAudit | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Work email is required.";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address (e.g. bob@hilton.com).";
    if (!form.website.trim()) e.website = "Enter your hotel or company website.";
    else if (!isValidWebsite(form.website)) e.website = "Enter a valid website (e.g. hilton.com).";
    return e;
  }, [form]);
  const valid = Object.keys(errors).length === 0;

  function show(key: string): string | undefined {
    if (!errors[key]) return undefined;
    const live = key === "email" || key === "website";
    if (attempted || (live && (form as Record<string, string>)[key].trim())) return errors[key];
    return undefined;
  }

  function stopTimer() {
    if (stageTimer.current) {
      clearInterval(stageTimer.current);
      stageTimer.current = null;
    }
  }

  async function runAudit() {
    if (!valid) {
      setAttempted(true);
      return;
    }
    setError("");
    setStageIdx(0);
    setPhase("loading");
    const start = Date.now();
    stopTimer();
    stageTimer.current = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, LOADING_STAGES.length - 1));
    }, 1600);

    try {
      const res = await fetch("/api/website-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          website: normalizeUrl(form.website),
          role: form.role.trim(),
        }),
      });
      const data = (await res.json()) as AiResponse;

      // Minimum visible loading time of 3s for a calm, credible feel.
      const wait = Math.max(0, 3000 - (Date.now() - start));
      await new Promise((r) => setTimeout(r, wait));
      stopTimer();

      if (data.submissionId) setSubmissionId(data.submissionId);

      if (!res.ok || !data.ok) {
        setError(data.error || "We couldn't complete the AI scan, but you can still get a score manually.");
        setPhase("intake");
        return;
      }
      if (data.fallback || !data.audit) {
        setError(data.error || "We couldn't complete the AI scan, but you can still get a score manually.");
        setPhase("intake");
        return;
      }
      setAudit(data.audit);
      setPhase("result");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Website audit request failed:", err);
      stopTimer();
      const wait = Math.max(0, 3000 - (Date.now() - start));
      await new Promise((r) => setTimeout(r, wait));
      setError("We couldn't complete the AI scan, but you can still get a score manually.");
      setPhase("intake");
    }
  }

  if (phase === "loading") {
    return <LoadingScreen stage={LOADING_STAGES[stageIdx]} index={stageIdx} total={LOADING_STAGES.length} />;
  }

  if (phase === "result" && audit) {
    return (
      <AiResult audit={audit} submissionId={submissionId} />
    );
  }

  // Intake
  return (
    <div className={CARD}>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={show("name")}>
            <input className={fieldCls(show("name"))} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
          </Field>
          <Field label="Work email" error={show("email")}>
            <input type="email" className={fieldCls(show("email"))} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" placeholder="bob@hilton.com" />
          </Field>
          <Field label="Hotel or company website" error={show("website")}>
            <input className={fieldCls(show("website"))} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="hilton.com" inputMode="url" />
          </Field>
          <Field label="Your role" hint="(optional)">
            <input className={fieldCls(undefined)} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. VP Marketing, GM, Owner" />
          </Field>
        </div>

        {attempted && !valid && <p className="text-sm text-[#F3A6A6]">Please fix the highlighted fields to continue.</p>}
        {error && (
          <div className="rounded-xl border border-[rgba(201,164,76,0.2)] bg-[rgba(201,164,76,0.06)] px-4 py-3 text-sm text-[#E8D7A2]">
            {error}{" "}
            <button type="button" onClick={onUseManual} className="font-semibold underline underline-offset-2">
              Answer the scorecard manually →
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={runAudit}
          aria-disabled={!valid}
          className={`inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition ${valid ? "" : "opacity-40"}`}
          style={{ background: GOLD }}
        >
          Run my AI creative audit →
        </button>
        <p className="text-center text-xs text-[#7c7468]">
          AI will scan your public website and give you a preliminary creative bandwidth read. Takes about 30 seconds.
        </p>
        <p className="text-center text-xs text-[#6f685c]">
          Prefer to answer the full scorecard yourself?{" "}
          <button type="button" onClick={onUseManual} className="text-[#C9A44C] underline underline-offset-2 hover:text-[#E8D7A2]">
            Take the 10-question scorecard
          </button>
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- Loading screen ---------------------------- */

function LoadingScreen({ stage, index, total }: { stage: string; index: number; total: number }) {
  return (
    <div className={`${CARD} text-center`}>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative mb-7 h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-[rgba(201,164,76,0.15)]" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C9A44C]" style={{ animationDuration: "1.1s" }} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">Running your AI audit</p>
        <p className="mt-4 min-h-12 max-w-sm text-[15px] leading-relaxed text-[#F6F1E7] transition-opacity duration-300">
          {stage}
        </p>
        <div className="mt-6 flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= index ? "w-6 bg-[#C9A44C]" : "w-1.5 bg-[#3a3327]"}`} />
          ))}
        </div>
        <p className="mt-7 max-w-xs text-xs text-[#7c7468]">This is a preliminary read of your public website. Sit tight.</p>
      </div>
    </div>
  );
}

/* ----------------------------- AI result ------------------------------ */

const CONFIDENCE_CLS: Record<string, string> = {
  high: "text-[#9FD8A8] border-[rgba(120,200,140,0.35)] bg-[rgba(120,200,140,0.08)]",
  medium: "text-[#E8D7A2] border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.08)]",
  low: "text-[#D8CFBE] border-[rgba(160,150,130,0.35)] bg-[rgba(160,150,130,0.08)]",
};

function AiResult({ audit, submissionId }: { audit: AiAudit; submissionId: string | null }) {
  const pct = Math.round((audit.scoreTotal / 100) * 100);
  return (
    <div className="space-y-6">
      <div className={`${CARD} text-center`}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">Your preliminary AI creative bandwidth score</p>
        <div className="my-5 flex items-end justify-center gap-2">
          <span className="text-6xl font-semibold tracking-tight text-[#F6F1E7]">{audit.scoreTotal}</span>
          <span className="mb-2 text-lg text-[#7c7468]">/ 100</span>
        </div>
        <div className="mx-auto mb-5 h-2 w-full max-w-sm overflow-hidden rounded-full bg-[#221d14]">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8B6A21, #C9A44C, #E8D7A2)" }} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h2 className="text-2xl font-semibold text-[#E8D7A2]">{audit.scoreBand}</h2>
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${CONFIDENCE_CLS[audit.confidence] ?? CONFIDENCE_CLS.low}`}>
            {audit.confidence} confidence
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#C8BFAD]">{audit.summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {audit.strongestGaps.length > 0 && (
          <Panel title="Strongest gaps">
            <ul className="space-y-1.5 text-sm text-[#C8BFAD]">
              {audit.strongestGaps.map((g, i) => <li key={i}>• {g}</li>)}
            </ul>
          </Panel>
        )}
        {audit.quickWins.length > 0 && (
          <Panel title="Quick wins">
            <ul className="space-y-1.5 text-sm text-[#C8BFAD]">
              {audit.quickWins.map((g, i) => <li key={i}>• {g}</li>)}
            </ul>
          </Panel>
        )}
      </div>

      {audit.whatAiSaw.length > 0 && (
        <Panel title="What the AI noticed">
          <ul className="space-y-1.5 text-sm text-[#C8BFAD]">
            {audit.whatAiSaw.map((g, i) => <li key={i}>• {g}</li>)}
          </ul>
        </Panel>
      )}

      <Panel title="Recommended next step">
        <p className="text-sm leading-relaxed text-[#C8BFAD]">{audit.recommendedNextStep}</p>
      </Panel>

      <p className="rounded-xl border border-[rgba(201,164,76,0.14)] bg-[#0e0c0a] px-4 py-3 text-xs leading-relaxed text-[#9a917f]">
        This is a preliminary AI read based on your public website. Devon can map a sharper review using your actual
        property links, social channels, and campaign goals.
      </p>

      <ResultActions submissionId={submissionId} />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[#100e0b]/80 p-6">
      <p className="mb-3 text-sm font-semibold text-[#E8D7A2]">{title}</p>
      {children}
    </div>
  );
}

/* --------------- Shared result actions: links + Calendly --------------- */

function ResultActions({ submissionId }: { submissionId: string | null }) {
  const [showLinks, setShowLinks] = useState(false);
  const [links, setLinks] = useState({ p1: "", p2: "", p3: "", concern: "" });
  const [busy, setBusy] = useState<"" | "book" | "links">("");
  const [error, setError] = useState("");

  const linkErrors = useMemo(() => {
    const e: Record<string, string> = {};
    (["p1", "p2", "p3"] as const).forEach((k) => {
      const v = links[k];
      if (v.trim() && !isValidWebsite(v)) e[k] = "Enter a valid URL (e.g. hilton.com/property).";
    });
    return e;
  }, [links]);

  async function go(action: "book" | "links") {
    setError("");
    // No stored submission (e.g. storage not configured): fall back to the page.
    if (!submissionId) {
      window.location.href = gapReviewLink(null);
      return;
    }
    if (action === "links" && Object.keys(linkErrors).length > 0) return;
    setBusy(action);
    try {
      const propertyLinks = action === "links" ? [links.p1, links.p2, links.p3].filter((l) => l.trim()) : [];
      const res = await fetch("/api/scorecard/submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          propertyLinks,
          biggestConcern: action === "links" ? links.concern.trim() : "",
          calendlyClick: true,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; calendlyUrl?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy("");
        return;
      }
      // Prefer the server-built prefilled Calendly URL; otherwise use the page.
      window.location.href = data.calendlyUrl && data.calendlyUrl.length > 0 ? data.calendlyUrl : gapReviewLink(submissionId);
    } catch (err) {
      console.error("Calendly handoff failed:", err);
      setError("Something went wrong. Please try again.");
      setBusy("");
    }
  }

  return (
    <div className="rounded-2xl border border-[rgba(201,164,76,0.25)] bg-[rgba(201,164,76,0.06)] p-7">
      <h3 className="text-center text-xl font-semibold text-[#F6F1E7]">Want me to review 3 properties?</h3>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-[#C8BFAD]">
        Add up to 3 property links and I&apos;ll map the biggest creative opportunities around social, F&amp;B/events,
        local campaigns, and reporting.
      </p>

      {showLinks && (
        <div className="mt-5 space-y-3 rounded-xl border border-[rgba(201,164,76,0.14)] bg-[#0e0c0a] p-4">
          <p className="text-sm font-medium text-[#E8D7A2]">Want a sharper review?</p>
          <div className="space-y-2">
            <input className={fieldCls(linkErrors.p1)} value={links.p1} onChange={(e) => setLinks({ ...links, p1: e.target.value })} placeholder="Property 1 URL" inputMode="url" />
            {linkErrors.p1 && <span className="block text-xs text-[#F3A6A6]">{linkErrors.p1}</span>}
            <input className={fieldCls(linkErrors.p2)} value={links.p2} onChange={(e) => setLinks({ ...links, p2: e.target.value })} placeholder="Property 2 URL" inputMode="url" />
            {linkErrors.p2 && <span className="block text-xs text-[#F3A6A6]">{linkErrors.p2}</span>}
            <input className={fieldCls(linkErrors.p3)} value={links.p3} onChange={(e) => setLinks({ ...links, p3: e.target.value })} placeholder="Property 3 URL" inputMode="url" />
            {linkErrors.p3 && <span className="block text-xs text-[#F3A6A6]">{linkErrors.p3}</span>}
            <textarea className={`${fieldCls(undefined)} min-h-20`} value={links.concern} onChange={(e) => setLinks({ ...links, concern: e.target.value })} placeholder="Biggest concern right now (optional)" />
          </div>
          <button
            type="button"
            onClick={() => go("links")}
            disabled={busy !== ""}
            className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#1a1407] transition disabled:opacity-50"
            style={{ background: GOLD }}
          >
            {busy === "links" ? "Saving…" : "Save property links and book review"}
          </button>
        </div>
      )}

      {error && <p className="mt-4 text-center text-sm text-[#F3A6A6]">{error}</p>}

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go("book")}
          disabled={busy !== ""}
          className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition disabled:opacity-50"
          style={{ background: GOLD }}
        >
          {busy === "book" ? "Opening Calendly…" : "Book my free Creative Gap Review →"}
        </button>
        {!showLinks && (
          <button
            type="button"
            onClick={() => setShowLinks(true)}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(201,164,76,0.35)] bg-[rgba(201,164,76,0.06)] px-8 py-3.5 text-sm font-semibold text-[#E8D7A2] transition hover:border-[rgba(201,164,76,0.6)]"
          >
            Add property links first
          </button>
        )}
      </div>
    </div>
  );
}

/* ========================== Manual scorecard ========================== */

type Lead = {
  name: string; email: string; company: string; role: string;
  website: string; linkedinUrl: string; companyType: string; propertyCount: string;
};
const EMPTY_LEAD: Lead = { name: "", email: "", company: "", role: "", website: "", linkedinUrl: "", companyType: "", propertyCount: "" };
type LeadErrors = Partial<Record<keyof Lead, string>>;

function computeLeadErrors(lead: Lead): LeadErrors {
  const e: LeadErrors = {};
  if (!lead.name.trim()) e.name = "Please enter your name.";
  if (!lead.email.trim()) e.email = "Work email is required.";
  else if (!EMAIL_RE.test(lead.email.trim())) e.email = "Work email must be a valid email address (e.g. bob@hilton.com).";
  if (!lead.company.trim()) e.company = "Please enter your company.";
  if (!lead.role.trim()) e.role = "Please enter your role.";
  if (!lead.companyType) e.companyType = "Please select a company type.";
  if (!lead.propertyCount) e.propertyCount = "Please select your number of properties.";
  if (lead.website.trim() && !isValidWebsite(lead.website)) e.website = "Website must be a valid web address (e.g. hilton.com).";
  if (lead.linkedinUrl.trim() && !isValidLinkedIn(lead.linkedinUrl)) e.linkedinUrl = "Enter a valid LinkedIn URL, or leave it blank.";
  return e;
}

const TOTAL_STEPS = 1 + QUESTIONS.length;

function ManualScorecard({ onUseAi }: { onUseAi: () => void }) {
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [requestedReview, setRequestedReview] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ManualResult | null>(null);
  const [attemptedStart, setAttemptedStart] = useState(false);

  const progress = useMemo(() => (result ? 100 : Math.round((step / TOTAL_STEPS) * 100)), [step, result]);
  const leadErrors = useMemo(() => computeLeadErrors(lead), [lead]);
  const leadValid = Object.keys(leadErrors).length === 0;

  function setLeadField<K extends keyof Lead>(key: K, value: string) {
    setLead((c) => ({ ...c, [key]: value }));
  }
  function showFieldError(key: keyof Lead): string | undefined {
    const msg = leadErrors[key];
    if (!msg) return undefined;
    const live: (keyof Lead)[] = ["email", "website", "linkedinUrl"];
    if (attemptedStart || (live.includes(key) && lead[key].trim().length > 0)) return msg;
    return undefined;
  }
  function handleStart() {
    try {
      if (!leadValid) {
        setAttemptedStart(true);
        if (typeof document !== "undefined") {
          const firstKey = (Object.keys(leadErrors) as (keyof Lead)[])[0];
          const el = firstKey ? document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`) : null;
          el?.focus?.();
          el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }
        return;
      }
      setStep(1);
    } catch (err) {
      console.error("Scorecard start failed:", err);
      setError("Couldn't start the scorecard. Please try again.");
    }
  }
  function answer(qId: string, value: AnswerValue) {
    setAnswers((c) => ({ ...c, [qId]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), 180);
  }
  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          company: lead.company.trim(),
          role: lead.role.trim(),
          website: lead.website.trim() ? normalizeUrl(lead.website) : "",
          linkedinUrl: lead.linkedinUrl.trim() ? normalizeUrl(lead.linkedinUrl) : "",
          companyType: lead.companyType,
          propertyCount: lead.propertyCount,
          answers,
          requestedReview,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; result?: ManualResult };
      if (!res.ok || !data.ok || !data.result) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setResult(data.result);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Scorecard submission failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <ManualResultHeader result={result} />
        <ResultActions submissionId={result.submissionId} />
      </div>
    );
  }

  const isLeadStep = step === 0;
  const isReviewStep = step === TOTAL_STEPS;
  const currentQuestion = !isLeadStep && !isReviewStep ? QUESTIONS[step - 1] : null;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className={CARD}>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-[#9a917f]">
          <span>{isLeadStep ? "Your details" : isReviewStep ? "Review & submit" : `Question ${step} of ${QUESTIONS.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#221d14]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #8B6A21, #C9A44C, #E8D7A2)" }} />
        </div>
      </div>

      {isLeadStep && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={showFieldError("name")}>
              <input data-field="name" className={fieldCls(showFieldError("name"))} value={lead.name} onChange={(e) => setLeadField("name", e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Work email" error={showFieldError("email")}>
              <input data-field="email" type="email" className={fieldCls(showFieldError("email"))} value={lead.email} onChange={(e) => setLeadField("email", e.target.value)} autoComplete="email" placeholder="bob@hilton.com" />
            </Field>
            <Field label="Company" error={showFieldError("company")}>
              <input data-field="company" className={fieldCls(showFieldError("company"))} value={lead.company} onChange={(e) => setLeadField("company", e.target.value)} autoComplete="organization" />
            </Field>
            <Field label="Your role" error={showFieldError("role")}>
              <input data-field="role" className={fieldCls(showFieldError("role"))} value={lead.role} onChange={(e) => setLeadField("role", e.target.value)} placeholder="e.g. VP Marketing, GM, Owner" />
            </Field>
            <Field label="Company type" error={showFieldError("companyType")}>
              <select data-field="companyType" className={`${fieldCls(showFieldError("companyType"))} appearance-none`} value={lead.companyType} onChange={(e) => setLeadField("companyType", e.target.value)}>
                <option value="">Select…</option>
                {COMPANY_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Number of properties" error={showFieldError("propertyCount")}>
              <select data-field="propertyCount" className={`${fieldCls(showFieldError("propertyCount"))} appearance-none`} value={lead.propertyCount} onChange={(e) => setLeadField("propertyCount", e.target.value)}>
                <option value="">Select…</option>
                {PROPERTY_COUNTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Website" hint="(optional)" error={showFieldError("website")}>
              <input data-field="website" className={fieldCls(showFieldError("website"))} value={lead.website} onChange={(e) => setLeadField("website", e.target.value)} placeholder="hilton.com" inputMode="url" />
            </Field>
            <Field label="LinkedIn URL" hint="(optional)" error={showFieldError("linkedinUrl")}>
              <input data-field="linkedinUrl" className={fieldCls(showFieldError("linkedinUrl"))} value={lead.linkedinUrl} onChange={(e) => setLeadField("linkedinUrl", e.target.value)} placeholder="https://www.linkedin.com/in/example" />
            </Field>
          </div>

          {attemptedStart && !leadValid && <p className="text-sm text-[#F3A6A6]">Please fix the highlighted fields to continue.</p>}
          {error && <p className="text-sm text-[#F3A6A6]">{error}</p>}

          <button type="button" onClick={handleStart} aria-disabled={!leadValid} className={`inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition ${leadValid ? "" : "opacity-40"}`} style={{ background: GOLD }}>
            {leadValid ? "Start the scorecard →" : "Complete required fields to start"}
          </button>
          <p className="text-center text-xs text-[#7c7468]">You&apos;ll see your score immediately. LinkedIn URL is optional.</p>
          <p className="text-center text-xs text-[#6f685c]">
            Want the fast version?{" "}
            <button type="button" onClick={onUseAi} className="text-[#C9A44C] underline underline-offset-2 hover:text-[#E8D7A2]">
              Run the 30-second AI audit instead
            </button>
          </p>
        </div>
      )}

      {currentQuestion && (
        <div className="space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">{currentQuestion.pillar}</p>
          <h2 className="text-lg font-medium leading-relaxed text-[#F6F1E7] sm:text-xl">{currentQuestion.prompt}</h2>
          <div className="space-y-3">
            {ANSWER_OPTIONS.map((opt) => {
              const selected = answers[currentQuestion.id] === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => answer(currentQuestion.id, opt.value)} className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm transition ${selected ? "border-[#C9A44C] bg-[rgba(201,164,76,0.10)] text-[#F6F1E7]" : "border-[rgba(201,164,76,0.14)] bg-[#0e0c0a] text-[#D8CFBE] hover:border-[rgba(201,164,76,0.4)]"}`}>
                  <span>{opt.label}</span>
                  <span className={`ml-4 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#C9A44C] bg-[#C9A44C]" : "border-[#52493a]"}`}>
                    {selected && <span className="h-2 w-2 rounded-full bg-[#0b0a08]" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-sm text-[#9a917f] transition hover:text-[#E8D7A2]">← Back</button>
            {answers[currentQuestion.id] !== undefined && (
              <button type="button" onClick={() => setStep((s) => Math.min(s + 1, TOTAL_STEPS))} className="text-sm font-medium text-[#C9A44C] transition hover:text-[#E8D7A2]">Next →</button>
            )}
          </div>
        </div>
      )}

      {isReviewStep && (
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-[#F6F1E7]">One last thing</h2>
          <p className="text-sm leading-relaxed text-[#C8BFAD]">
            You answered all {answeredCount} of {QUESTIONS.length} questions. Submit to see your Creative Bandwidth
            score, your strongest gaps, and the recommended next step for {lead.company || "your properties"}.
          </p>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgba(201,164,76,0.14)] bg-[#0e0c0a] p-4">
            <input type="checkbox" checked={requestedReview} onChange={(e) => setRequestedReview(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#C9A44C]" />
            <span className="text-sm text-[#D8CFBE]">Yes — I&apos;d like a free <span className="text-[#E8D7A2]">3-Property Creative Gap Review</span>. {CTA_SUBTEXT}</span>
          </label>
          {error && <p className="text-sm text-[#F3A6A6]">{error}</p>}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="text-sm text-[#9a917f] transition hover:text-[#E8D7A2]">← Back</button>
            <button type="button" disabled={submitting || answeredCount < QUESTIONS.length} onClick={submit} className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition disabled:cursor-not-allowed disabled:opacity-50" style={{ background: GOLD }}>
              {submitting ? "Scoring…" : "See my score"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ManualResultHeader({ result }: { result: ManualResult }) {
  const pct = Math.round((result.scoreTotal / MAX_SCORE) * 100);
  return (
    <>
      <div className={`${CARD} text-center`}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A44C]">Your result</p>
        <div className="my-5 flex items-end justify-center gap-2">
          <span className="text-6xl font-semibold tracking-tight text-[#F6F1E7]">{result.scoreTotal}</span>
          <span className="mb-2 text-lg text-[#7c7468]">/ {MAX_SCORE}</span>
        </div>
        <div className="mx-auto mb-5 h-2 w-full max-w-sm overflow-hidden rounded-full bg-[#221d14]">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #8B6A21, #C9A44C, #E8D7A2)" }} />
        </div>
        <h2 className="text-2xl font-semibold text-[#E8D7A2]">{result.band.label}</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#C8BFAD]">{result.band.explanation}</p>
      </div>
      {result.gaps.length > 0 && (
        <div className="rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[#100e0b]/80 p-6">
          <p className="mb-3 text-sm font-semibold text-[#E8D7A2]">Your strongest gaps</p>
          <div className="flex flex-wrap gap-2">
            {result.gaps.map((g) => (
              <span key={g} className="rounded-full border border-[rgba(201,164,76,0.25)] bg-[rgba(201,164,76,0.08)] px-3 py-1.5 text-sm text-[#D8CFBE]">{g}</span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#C8BFAD]">
            <span className="font-medium text-[#E8D7A2]">Recommended next step: </span>{result.recommendedNextStep}
          </p>
        </div>
      )}
    </>
  );
}
