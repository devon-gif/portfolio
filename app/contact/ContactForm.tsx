"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Mail, Send } from "lucide-react";

const CONTACT_EMAIL = "hello@archerdesign.shop";
const CALENDLY_URL = "https://calendly.com/devonavich0/30min";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Project inquiry from ${name || "Archer Design website"}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-amber-200/20 bg-zinc-950/80 shadow-2xl shadow-black/40">
      <div className="grid gap-px bg-amber-200/10 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-950 p-6 sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">Contact</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Tell me what you are building.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              Send a quick note about the project, timeline, and what kind of creative or technical support you need.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-amber-200/60"
              placeholder="Your name"
              type="text"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">Email</span>
            <input
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-amber-200/60"
              placeholder="you@company.com"
              type="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">Message</span>
            <textarea
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-amber-200/60"
              placeholder="Tell me about the project, deadline, budget range, and what you need help with."
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white sm:w-auto"
          >
            Send message <Send size={16} aria-hidden="true" />
          </button>
        </form>

        <aside className="bg-[radial-gradient(circle_at_top,rgba(245,204,120,0.18),transparent_40%),linear-gradient(145deg,#18120b,#09090b)] p-6 sm:p-8">
          <div className="flex h-full flex-col justify-between gap-10 rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">Direct</p>
              <a className="mt-4 inline-flex items-center gap-3 text-xl font-semibold text-white" href={`mailto:${CONTACT_EMAIL}`}>
                <Mail size={20} aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                This routes to my inbox. I usually respond with a few questions or a simple next step.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200/20 bg-amber-200/10 p-5">
              <p className="text-sm font-semibold text-amber-100">Want to talk through it live?</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Book a 30-minute intro call and we can look at the project, scope, timeline, and whether I am the right fit.
              </p>
              <a
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-200/40 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-100 hover:bg-amber-100 hover:text-zinc-950"
                href={CALENDLY_URL}
                target="_blank"
                rel="noreferrer"
              >
                Schedule on Calendly <CalendarDays size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
