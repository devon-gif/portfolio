"use client";

import { useState } from "react";

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "success" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setStatus({ kind: "error", message: data.error || "Something went wrong." });
        return;
      }

      setStatus({ kind: "success", message: "Thanks. Your message has been sent." });
      setForm(INITIAL_STATE);
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#E8D7A2]">First name</span>
          <input
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
            autoComplete="given-name"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#E8D7A2]">Last name</span>
          <input
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
            autoComplete="family-name"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#E8D7A2]">Company</span>
        <input
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
          className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
          autoComplete="organization"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#E8D7A2]">Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
          autoComplete="email"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#E8D7A2]">What do you need?</span>
        <textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-36 w-full rounded-xl border border-[rgba(201,164,76,0.18)] bg-[#0e0c0a] px-4 py-3 text-[#F6F1E7] outline-none transition focus:border-[#C9A44C]"
          placeholder="Trial request, property type, content needs, timelines, or a quick note."
          required
        />
      </label>

      {status.kind !== "idle" ? (
        <p className={status.kind === "success" ? "text-sm text-[#D8CFBE]" : "text-sm text-[#F3A6A6]"}>
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #E8D7A2, #C9A44C, #8B6A21)" }}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
