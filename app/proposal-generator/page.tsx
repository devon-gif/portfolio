"use client";

// Proposal Generator — 3–5 Property Creative Pilot drafts.
// Form left, generated proposal right. Copy/save only; nothing sends.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clipboard, ClipboardCheck, FileText, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import {
  COMPANY_TYPES, PAIN_POINTS, PRICE_OPTIONS, SERVICES, TIMELINES, TONES,
  generateProposal, proposalToText, type ProposalInputs,
} from "@/lib/proposal-generator";

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

const DEFAULTS: ProposalInputs = {
  company: "", contactName: "", contactTitle: "",
  companyType: "hotel group", propertyCount: "", pilotCount: "3",
  painPoints: ["inconsistent", "stretched"],
  services: ["plan", "graphics", "motion", "fnb", "seasonal", "polish", "captions"],
  price: PRICE_OPTIONS[1], timeline: TIMELINES[0], tone: "premium",
};

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : label}
    </button>
  );
}

export default function ProposalGeneratorPage() {
  const [form, setForm] = useState<ProposalInputs>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const proposal = useMemo(() => generateProposal(form), [form]);
  const fullText = useMemo(() => proposalToText(proposal), [proposal]);

  function toggle(list: "painPoints" | "services", key: string) {
    setForm((f) => ({
      ...f,
      [list]: f[list].includes(key) ? f[list].filter((k) => k !== key) : [...f[list], key],
    }));
  }

  async function saveProposal() {
    setSaving(true);
    const { error } = await supabase.from("generated_proposals").insert({
      title: proposal.title,
      proposal_body: fullText,
      price: form.price,
      status: "draft",
    });
    setSaving(false);
    setNote(error
      ? (error.message.includes("generated_proposals")
          ? "generated_proposals table missing — run supabase/migrations/20260612_generated_proposals.sql first."
          : `Save failed: ${error.message}`)
      : "Proposal saved as draft.");
  }

  return (
    <div className="max-w-7xl px-6 py-6">
      <PageHeader
        title="Proposal Generator"
        description="Generate a 3–5 Property Creative Pilot proposal, then copy it into a doc, email, or deck. Nothing sends from here."
        action={
          <Link href="/sales-assets" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
            Sales Assets →
          </Link>
        }
      />

      {note && <p className="mb-4 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">{note}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Form ── */}
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-zinc-400">Prospect / company name</label>
              <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="e.g. Island Hospitality" className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Primary contact</label>
              <input value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} placeholder="Name" className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Contact title</label>
              <input value={form.contactTitle} onChange={(e) => setForm((f) => ({ ...f, contactTitle: e.target.value }))} placeholder="e.g. VP Sales & Marketing" className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Company type</label>
              <select value={form.companyType} onChange={(e) => setForm((f) => ({ ...f, companyType: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Number of properties</label>
              <input value={form.propertyCount} onChange={(e) => setForm((f) => ({ ...f, propertyCount: e.target.value }))} placeholder="e.g. 18" className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Pilot property count</label>
              <select value={form.pilotCount} onChange={(e) => setForm((f) => ({ ...f, pilotCount: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                {["1", "3", "5", "3–5", "custom"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Timeline</label>
              <select value={form.timeline} onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-400">Main pain points</p>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {PAIN_POINTS.map((p) => (
                <label key={p.key} className="flex cursor-pointer items-start gap-2 rounded px-1.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800/50">
                  <input type="checkbox" checked={form.painPoints.includes(p.key)} onChange={() => toggle("painPoints", p.key)} className="mt-0.5" />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-zinc-400">Services included</p>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label key={s.key} className="flex cursor-pointer items-start gap-2 rounded px-1.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800/50">
                  <input type="checkbox" checked={form.services.includes(s.key)} onChange={() => toggle("services", s.key)} className="mt-0.5" />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Price option</label>
              <select value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                {PRICE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Tone</label>
              <select value={form.tone} onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Output ── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <FileText className="h-4 w-4 text-[#C9A44C]" /> Generated proposal
            </h2>
            <div className="flex items-center gap-2">
              <CopyBtn text={fullText} label="Copy full proposal" />
              <button
                onClick={saveProposal}
                disabled={saving || !form.company.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save draft
              </button>
            </div>
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#E8D7A2]">{proposal.title}</h3>
          <div className="mt-3 space-y-4">
            {proposal.sections.map((s) => (
              <div key={s.heading} className="rounded-lg bg-zinc-800/40 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-300">{s.heading}</h4>
                  <CopyBtn text={`${s.heading}\n\n${s.body}`} />
                </div>
                <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-zinc-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
