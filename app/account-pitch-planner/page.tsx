"use client";

// Account Pitch Planner — tailored outreach + pitch plan per account.
// Generates from facts Devon enters; claims nothing else. Manual copy/paste only.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clipboard, ClipboardCheck, Loader2, Save, Target } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import {
  ACCOUNT_TYPES, CONTACT_TYPES, CREATIVE_QUALITY, RELATIONSHIP_STATUS, WARM_PATH,
  generatePitchPlan, type PitchPlanInputs,
} from "@/lib/pitch-plan";

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

const DEFAULTS: PitchPlanInputs = {
  company: "", website: "", accountType: "hotel management company", propertyCount: "",
  brands: "", hasFnb: false, hasEvents: false, hasSpa: false, hasMeetings: false,
  creativeQuality: "unknown", warmPath: "unknown", hiringSignal: false, activePoster: false,
  dmVisible: false, revLeaderVisible: false,
  contactName: "", contactTitle: "", contactType: "direct buyer",
  notes: "", relationshipStatus: "not connected",
};

function CopyBtn({ text }: { text: string }) {
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
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export default function AccountPitchPlannerPage() {
  const [form, setForm] = useState<PitchPlanInputs>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const plan = useMemo(() => generatePitchPlan(form), [form]);

  async function savePlan() {
    setSaving(true);
    const { error } = await supabase.from("account_pitch_plans").insert({
      fit_score: plan.score,
      account_type: form.accountType,
      primary_angle: plan.sections[2]?.body ?? null,
      generated_plan: { inputs: form, sections: plan.sections },
      notes: form.notes || null,
    });
    setSaving(false);
    setNote(error
      ? (error.message.includes("account_pitch_plans")
          ? "account_pitch_plans table missing — run supabase/migrations/20260613_account_pitch_plans.sql first."
          : `Save failed: ${error.message}`)
      : `Plan saved (${form.company || "unnamed account"}, score ${plan.score}/10).`);
  }

  const set = <K extends keyof PitchPlanInputs>(k: K, v: PitchPlanInputs[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-7xl px-6 py-6">
      <PageHeader
        title="Account Pitch Planner"
        description="Enter what you actually know about an account; get the who-first, what-angle, what-message plan. Never message several people at one company at once."
        action={
          <Link href="/sales-assets" className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
            Sales Assets →
          </Link>
        }
      />

      {note && <p className="mb-4 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">{note}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Inputs ── */}
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Company name</label>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Website</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Company type</label>
              <select value={form.accountType} onChange={(e) => set("accountType", e.target.value)} className={`${INPUT} cursor-pointer`}>
                {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400"># properties</label>
              <input value={form.propertyCount} onChange={(e) => set("propertyCount", e.target.value)} placeholder="e.g. 14" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-zinc-400">Brands / flags</label>
              <input value={form.brands} onChange={(e) => set("brands", e.target.value)} placeholder="e.g. Marriott + Hilton select-service" className={INPUT} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {([["hasFnb", "Has F&B"], ["hasEvents", "Events/weddings"], ["hasSpa", "Spa/wellness"], ["hasMeetings", "Meetings/groups"]] as const).map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800/50">
                <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
                {label}
              </label>
            ))}
            {([["dmVisible", "Mktg DM visible"], ["revLeaderVisible", "Rev leader visible"], ["hiringSignal", "Hiring signal"], ["activePoster", "Active LI poster"]] as const).map(([k, label]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800/50">
                <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Current creative quality</label>
              <select value={form.creativeQuality} onChange={(e) => set("creativeQuality", e.target.value)} className={`${INPUT} cursor-pointer`}>
                {CREATIVE_QUALITY.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Warm path exists</label>
              <select value={form.warmPath} onChange={(e) => set("warmPath", e.target.value)} className={`${INPUT} cursor-pointer`}>
                {WARM_PATH.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Primary contact name</label>
              <input value={form.contactName} onChange={(e) => set("contactName", e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Contact title</label>
              <input value={form.contactTitle} onChange={(e) => set("contactTitle", e.target.value)} placeholder="e.g. Director of Digital Marketing" className={INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Contact type</label>
              <select value={form.contactType} onChange={(e) => set("contactType", e.target.value)} className={`${INPUT} cursor-pointer`}>
                {CONTACT_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">Relationship status</label>
              <select value={form.relationshipStatus} onChange={(e) => set("relationshipStatus", e.target.value)} className={`${INPUT} cursor-pointer`}>
                {RELATIONSHIP_STATUS.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Notes from research</label>
            <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Only facts you've verified — these flow into the plan." className={`${INPUT} resize-y`} />
          </div>
        </div>

        {/* ── Plan ── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Target className="h-4 w-4 text-emerald-400" /> Account pitch plan
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${plan.score >= 8 ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-300"}`}>
                {plan.score}/10{plan.score >= 8 ? " · Priority 8+" : ""}
              </span>
            </h2>
            <button
              onClick={savePlan}
              disabled={saving || !form.company.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save plan
            </button>
          </div>

          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-300">
            ⚠ One thread per company. Do not message several people at the same company at once —
            start with the best-fit person, wait 3 business days, then route through a second contact if needed.
          </p>

          <div className="space-y-3">
            {plan.sections.map((s) => (
              <div key={s.heading} className="rounded-lg bg-zinc-800/40 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-300">{s.heading}</h4>
                  {s.copyable && <CopyBtn text={s.body} />}
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
