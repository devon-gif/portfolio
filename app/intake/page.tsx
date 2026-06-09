"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";

// Fixed values applied to every hiring signal (per spec).
const HIRING_SIGNAL_DEFAULTS = {
  lead_type: "hiring_signal",
  opportunity_type: "hiring_signal",
  opportunity_trigger: "hiring for marketing/content/social/design role",
  opportunity_status: "new_signal",
  recommended_approach: "contract alternative to full-time creative hire",
  recommended_next_action: "find decision maker and draft hiring-signal outreach",
};

const BLANK = {
  name: "",
  website: "",
  job_title: "",
  job_url: "",
  platform: "",
  location: "",
  notes: "",
  recommended_contact: "",
};

function normalizeUrl(u: string): string {
  const v = u.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function hostOf(u: string): string {
  try {
    return new URL(normalizeUrl(u)).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export default function HiringSignalIntakePage() {
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setResult(null);
    if (!isSupabaseConfigured) {
      setResult({ ok: false, msg: "Supabase isn't configured." });
      return;
    }
    if (!form.name.trim() && !form.website.trim()) {
      setResult({ ok: false, msg: "Enter a company name or website." });
      return;
    }
    setSaving(true);
    try {
      const website = normalizeUrl(form.website);
      const domain = hostOf(form.website);

      // Try to find an existing company by website domain, then by exact name.
      let existingId: string | null = null;
      if (domain) {
        const { data } = await supabase.from("companies").select("id, website").ilike("website", `%${domain}%`).limit(1);
        if (data && data.length > 0) existingId = data[0].id as string;
      }
      if (!existingId && form.name.trim()) {
        const { data } = await supabase.from("companies").select("id").ilike("name", form.name.trim()).limit(1);
        if (data && data.length > 0) existingId = data[0].id as string;
      }

      const triggerSummary = [
        form.job_title ? `Hiring: ${form.job_title}` : "Hiring signal",
        form.platform ? `via ${form.platform}` : "",
        form.recommended_contact ? `· Recommended contact: ${form.recommended_contact}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      // Only set fields that have a value, plus the fixed hiring-signal defaults.
      const payload: Record<string, unknown> = {
        ...HIRING_SIGNAL_DEFAULTS,
        name: form.name.trim() || domain || "Unknown company",
        hiring_role_title: form.job_title.trim() || null,
        hiring_job_url: normalizeUrl(form.job_url) || null,
        hiring_platform: form.platform.trim() || null,
        trigger_source_url: normalizeUrl(form.job_url) || null,
        trigger_summary: triggerSummary || null,
        last_signal_at: new Date().toISOString(),
      };
      if (website) payload.website = website;
      if (form.location.trim()) payload.location = form.location.trim();
      // Append the free-text notes (+ recommended contact) without clobbering.
      const noteBits = [form.notes.trim(), form.recommended_contact.trim() ? `Recommended contact: ${form.recommended_contact.trim()}` : ""].filter(Boolean);
      if (noteBits.length) payload.notes = noteBits.join("\n");

      let error;
      let companyName = payload.name as string;
      if (existingId) {
        ({ error } = await supabase.from("companies").update(payload).eq("id", existingId));
      } else {
        const ins = await supabase.from("companies").insert(payload).select("id, name").single();
        error = ins.error;
        if (ins.data?.name) companyName = ins.data.name;
      }

      if (error) {
        setResult({
          ok: false,
          msg: /column/i.test(error.message)
            ? `${error.message} — run supabase/migrations/20260605b_opportunity_os.sql, then retry.`
            : error.message,
        });
        return;
      }

      setResult({ ok: true, msg: `${existingId ? "Updated" : "Created"} “${companyName}” as a hiring signal.` });
      setForm({ ...BLANK });
    } catch (e) {
      setResult({ ok: false, msg: e instanceof Error ? e.message : "Unexpected error." });
    } finally {
      setSaving(false);
    }
  }

  const FIELDS: [keyof typeof BLANK, string, string, boolean][] = [
    ["name", "Company name", "Acme Hotel Group", false],
    ["website", "Website", "acmehotels.com", false],
    ["job_title", "Job title", "Director of Marketing", false],
    ["job_url", "Job URL", "https://…/jobs/12345", false],
    ["platform", "Platform", "LinkedIn / Indeed / company site", false],
    ["location", "Location", "Miami, FL", false],
    ["recommended_contact", "Recommended contact (if known)", "Name / title / LinkedIn", false],
  ];

  return (
    <div className="px-6 py-6 max-w-2xl">
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-3">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Companies
      </Link>
      <PageHeader title="Add Hiring Signal" description="Log a hotel hiring a marketing/content/social/design role — a contract-alternative opportunity." />

      {!isSupabaseConfigured && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" /> Supabase isn&apos;t configured — this won&apos;t persist.
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="flex items-center gap-2 text-amber-300">
          <Briefcase className="h-4 w-4" />
          <span className="text-sm font-semibold">Hiring signal details</span>
        </div>

        {FIELDS.map(([key, label, placeholder]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Anything useful about this signal…"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50 resize-none"
          />
        </div>

        <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 px-3 py-2.5 text-xs text-zinc-500">
          Saved as <span className="text-zinc-300">lead_type = hiring_signal</span>, status{" "}
          <span className="text-zinc-300">new_signal</span>. Recommended approach: contract alternative to a full-time creative hire.
          No emails are sent — this only creates a tracked opportunity.
        </div>

        {result && (
          <div className={`flex items-center gap-2 text-xs ${result.ok ? "text-emerald-400" : "text-red-400"}`}>
            {result.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            {result.msg}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Link href="/companies" className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">Cancel</Link>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Hiring Signal"}
          </button>
        </div>
      </div>
    </div>
  );
}
