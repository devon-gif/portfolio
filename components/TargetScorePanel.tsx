"use client";

// Target-account scoring checklist + account-plan generator.
// Rendered inside the expanded company row on /companies.
// Score = number of true criteria (1–10), saved to companies.fit_score.

import { useState } from "react";
import { Clipboard, ClipboardCheck, FileText, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SCORE_CRITERIA, computeScore, generateAccountPlan, type ScoreChecks } from "@/lib/account-plan";

interface CompanyLike {
  id: string;
  name: string;
  website?: string | null;
  market?: string | null;
  company_type?: string | null;
  fit_score?: number | null;
  notes?: string | null;
}

export function TargetScorePanel({ company, onSaved }: { company: CompanyLike; onSaved?: () => void }) {
  const [checks, setChecks] = useState<ScoreChecks>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const score = computeScore(checks);

  async function saveScore() {
    setSaving(true);
    setMsg(null);
    let { error } = await supabase.from("companies").update({ fit_score: score }).eq("id", company.id);
    if (error) {
      // Fallback for schemas where the column is named company_score.
      ({ error } = await supabase.from("companies").update({ company_score: score }).eq("id", company.id));
    }
    setSaving(false);
    setMsg(error ? `Save failed: ${error.message}` : `Saved fit score ${score}/10.`);
    if (!error) onSaved?.();
  }

  const plan = generateAccountPlan({
    name: company.name,
    category: company.company_type,
    market: company.market,
    website: company.website,
    company_score: score || company.fit_score,
    notes: company.notes,
  });

  return (
    <div className="mt-4 border-t border-zinc-800/60 pt-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Scoring checklist */}
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <Target className="h-3.5 w-3.5 text-emerald-400" /> Target score
            <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${score >= 8 ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800 text-zinc-300"}`}>
              {score}/10{score >= 8 ? " · Priority 8+" : ""}
            </span>
          </p>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {SCORE_CRITERIA.map((c) => (
              <label key={c.key} className="flex cursor-pointer items-start gap-2 rounded px-1.5 py-1 text-[11px] text-zinc-400 hover:bg-zinc-800/40">
                <input
                  type="checkbox"
                  checked={!!checks[c.key]}
                  onChange={(e) => setChecks((p) => ({ ...p, [c.key]: e.target.checked }))}
                  className="mt-0.5"
                />
                {c.label}
              </label>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={saveScore}
              disabled={saving}
              className="rounded-lg bg-emerald-600/20 px-3 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save fit score"}
            </button>
            {msg && <span className="text-[11px] text-zinc-500">{msg}</span>}
          </div>
        </div>

        {/* Account plan */}
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
            <FileText className="h-3.5 w-3.5 text-violet-400" /> Account plan (Island-style)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlanOpen((v) => !v)}
              className="rounded-lg bg-violet-600/20 px-3 py-1.5 text-[11px] font-medium text-violet-400 hover:bg-violet-600/40"
            >
              {planOpen ? "Hide plan" : "Generate account plan"}
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(plan);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
            >
              {copied ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
              {copied ? "Copied" : "Copy plan"}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-600">
            Template-driven: [brackets] are for facts from real research. Never message several executives at once.
          </p>
          {planOpen && (
            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-[10.5px] leading-relaxed text-zinc-400">
              {plan}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
