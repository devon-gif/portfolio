"use client";
/* eslint-disable react-hooks/set-state-in-effect -- one-time read of URL attribution params on mount */

import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/scorecard";

const FIELD =
  "w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C] placeholder:text-[#6f685c]";
const LABEL = "mb-2 block text-sm font-medium text-[#E8D7A2]";

const INITIAL = {
  name: "",
  email: "",
  company: "",
  role: "",
  website: "",
  property1: "",
  property2: "",
  property3: "",
  biggestConcern: "",
  preferredCallTime: "",
  notes: "",
};

export function GapReviewForm() {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  // Scorecard attribution carried via ?source=scorecard&submission_id=<id>.
  const [attribution, setAttribution] = useState({ submissionId: "", source: "" });
  const fromScorecard = attribution.source === "scorecard";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      submissionId: params.get("submission_id") ?? "",
      source: params.get("source") ?? "",
    });
  }, []);

  function set<K extends keyof typeof INITIAL>(key: K, value: string) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  const valid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.company.trim() &&
    form.property1.trim();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/creative-gap-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          submissionId: attribution.submissionId,
          source: attribution.source,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[rgba(201,164,76,0.25)] bg-[rgba(201,164,76,0.06)] p-8 text-center">
        <h2 className="text-2xl font-semibold text-[#F6F1E7]">Request received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#C8BFAD]">
          Thanks — Devon will review your properties and reach out personally to map the
          biggest creative opportunities and find a time to walk through them.
        </p>
        {BOOKING_URL && (
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition"
            style={{ background: "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)" }}
          >
            Book a Google Meet now →
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-[rgba(201,164,76,0.14)] bg-[#100e0b]/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-8"
    >
      {fromScorecard && (
        <p className="rounded-xl border border-[rgba(201,164,76,0.2)] bg-[rgba(201,164,76,0.06)] px-4 py-3 text-sm text-[#D8CFBE]">
          Thanks for running the scorecard — your result is attached to this request. Add your
          three property links below and Devon will map the biggest opportunities.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>Name</span>
          <input className={FIELD} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </label>
        <label className="block">
          <span className={LABEL}>Work email</span>
          <input className={FIELD} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </label>
        <label className="block">
          <span className={LABEL}>Company</span>
          <input className={FIELD} value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
        </label>
        <label className="block">
          <span className={LABEL}>Your role</span>
          <input className={FIELD} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. VP Marketing, GM, Owner" />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL}>Website</span>
          <input className={FIELD} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="yourhotel.com" inputMode="url" />
        </label>
      </div>

      <div className="space-y-4 rounded-xl border border-[rgba(201,164,76,0.12)] bg-[#0e0c0a] p-4">
        <p className="text-sm font-medium text-[#E8D7A2]">Three property links</p>
        <input className={FIELD} value={form.property1} onChange={(e) => set("property1", e.target.value)} placeholder="Property 1 URL (required)" inputMode="url" />
        <input className={FIELD} value={form.property2} onChange={(e) => set("property2", e.target.value)} placeholder="Property 2 URL" inputMode="url" />
        <input className={FIELD} value={form.property3} onChange={(e) => set("property3", e.target.value)} placeholder="Property 3 URL" inputMode="url" />
      </div>

      <label className="block">
        <span className={LABEL}>Biggest concern right now</span>
        <textarea
          className={`${FIELD} min-h-24`}
          value={form.biggestConcern}
          onChange={(e) => set("biggestConcern", e.target.value)}
          placeholder="e.g. feeds go quiet between pushes, F&B promos look thin, no view into what's working…"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>Preferred call time</span>
          <input className={FIELD} value={form.preferredCallTime} onChange={(e) => set("preferredCallTime", e.target.value)} placeholder="e.g. weekday mornings ET" />
        </label>
        <label className="block">
          <span className={LABEL}>Anything else <span className="text-[#6f685c]">(optional)</span></span>
          <input className={FIELD} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Context, timing, goals…" />
        </label>
      </div>

      {error && <p className="text-sm text-[#F3A6A6]">{error}</p>}

      <button
        type="submit"
        disabled={!valid || submitting}
        className="inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)" }}
      >
        {submitting ? "Sending…" : "Request my Creative Gap Review"}
      </button>
      <p className="text-center text-xs text-[#7c7468]">
        No spam, no automated sequences. Devon reviews every request personally.
      </p>
    </form>
  );
}
