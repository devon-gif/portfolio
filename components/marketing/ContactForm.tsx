"use client";

import { useState } from "react";

const EMPTY_STATE = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  message: "",
};

export function ContactForm({ initialMessage = "" }: { initialMessage?: string }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_STATE, message: initialMessage }));
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
      setForm(EMPTY_STATE);
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-[var(--st-line)] bg-[var(--st-white)] px-4 py-3 text-[var(--st-ink)] outline-none transition placeholder:text-[var(--st-ink-muted)] focus:border-[var(--st-gold)]";
  const labelClass = "mb-2 block text-sm font-medium text-[var(--st-ink)]";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>First name</span>
          <input
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            className={fieldClass}
            autoComplete="given-name"
            required
          />
        </label>
        <label className="block">
          <span className={labelClass}>Last name</span>
          <input
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            className={fieldClass}
            autoComplete="family-name"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Property or company</span>
        <input
          value={form.company}
          onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
          className={fieldClass}
          autoComplete="organization"
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className={fieldClass}
          autoComplete="email"
          required
        />
      </label>

      <label className="block">
        <span className={labelClass}>What do you need?</span>
        <textarea
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className={`min-h-36 ${fieldClass}`}
          placeholder="A property link, restaurant or event details, the assets you already have, and what you'd like to see."
          required
        />
      </label>

      {status.kind !== "idle" ? (
        <p className={status.kind === "success" ? "text-sm text-[var(--st-ink-soft)]" : "text-sm text-[#b4524a]"}>
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="st-btn px-8 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
