"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

export function ReferralForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      form.reset();
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 sm:p-10">
        <CheckCircle2 className="h-8 w-8 text-emerald-700" aria-hidden />
        <h3 className="mt-5 font-serif text-3xl text-[var(--st-ink)]">Referral received.</h3>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
          Thank you. Devon will review the introduction and follow up with you directly before contacting the referred opportunity when appropriate.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm font-semibold text-[var(--st-ink)] underline underline-offset-4"
        >
          Submit another referral
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(35,30,20,0.08)] sm:p-9">
      <div className="grid gap-8 lg:grid-cols-2">
        <fieldset className="space-y-5">
          <div>
            <span className="st-kicker">About you</span>
            <h3 className="mt-3 font-serif text-2xl text-[var(--st-ink)]">Who is making the introduction?</h3>
          </div>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Your name *
            <input name="referrerName" required autoComplete="name" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Your email *
            <input name="referrerEmail" type="email" required autoComplete="email" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Company / role
            <input name="referrerCompany" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Phone
            <input name="referrerPhone" type="tel" autoComplete="tel" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>
        </fieldset>

        <fieldset className="space-y-5">
          <div>
            <span className="st-kicker">The opportunity</span>
            <h3 className="mt-3 font-serif text-2xl text-[var(--st-ink)]">Who should Archer meet?</h3>
          </div>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Contact name *
            <input name="prospectName" required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Company / hotel / group *
            <input name="companyName" required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[var(--st-ink)]">
              Contact email
              <input name="prospectEmail" type="email" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
            </label>
            <label className="block text-sm font-semibold text-[var(--st-ink)]">
              Title
              <input name="prospectTitle" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[var(--st-ink)]">
              Website
              <input name="companyWebsite" inputMode="url" placeholder="https://" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
            </label>
            <label className="block text-sm font-semibold text-[var(--st-ink)]">
              Number of properties
              <input name="propertyCount" placeholder="e.g. 5, 20, 50+" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
            </label>
          </div>

          <label className="block text-sm font-semibold text-[var(--st-ink)]">
            Opportunity type *
            <select name="opportunityType" required defaultValue="" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30">
              <option value="" disabled>Select one</option>
              <option>Hotel / hotel group creative support</option>
              <option>Resort, restaurant, spa, or private club</option>
              <option>Hospitality consultant / white-label partnership</option>
              <option>Website / landing page / campaign build</option>
              <option>AI workflow / dashboard / product implementation</option>
              <option>Speaking / podcast / conference</option>
              <option>Other</option>
            </select>
          </label>
        </fieldset>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <label className="block text-sm font-semibold text-[var(--st-ink)]">
          How do you know them?
          <textarea name="relationship" rows={4} placeholder="A sentence or two about the relationship and why the introduction makes sense." className="mt-2 w-full resize-y rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
        </label>
        <label className="block text-sm font-semibold text-[var(--st-ink)]">
          Anything Devon should know?
          <textarea name="notes" rows={4} placeholder="Pain points, timing, current agency/team setup, a visible creative gap, or anything else useful." className="mt-2 w-full resize-y rounded-2xl border border-black/10 bg-[#fbfaf7] px-4 py-3 font-normal outline-none transition focus:border-black/30" />
        </label>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label>
          Confirm website
          <input name="websiteConfirm" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === "error" ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-[var(--st-ink-muted)]">
          Submit only introductions that are appropriate to make. Referral eligibility is confirmed by Archer Design before outreach; compensation applies only to qualified introductions that become a signed, paid client.
        </p>
        <button type="submit" disabled={state === "sending"} className="st-btn shrink-0 disabled:cursor-not-allowed disabled:opacity-60">
          {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Send referral
          {state !== "sending" ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </button>
      </div>
    </form>
  );
}
