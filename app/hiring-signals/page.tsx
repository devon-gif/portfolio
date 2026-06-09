"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search, Loader2, ExternalLink, Plus, CheckCircle2, AlertTriangle, RefreshCw, Briefcase,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  platform: string;
};

type SavedSignal = {
  id: string;
  name: string;
  hiring_role_title: string | null;
  hiring_job_url: string | null;
  hiring_platform: string | null;
  opportunity_status: string | null;
  last_signal_at: string | null;
};

const DEFAULT_QUERIES = [
  "hotel social media manager",
  "hotel marketing manager",
  "hospitality content creator",
  "hotel graphic designer",
  "hotel digital marketing manager",
  "F&B marketing hotel",
  "events marketing hotel",
];

export default function HiringSignalsPage() {
  const [query, setQuery] = useState(DEFAULT_QUERIES[0]);
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [savedUrls, setSavedUrls] = useState<Record<string, boolean>>({});
  const [savingUrl, setSavingUrl] = useState<string | null>(null);

  // Manual entry
  const [m, setM] = useState({ name: "", jobUrl: "", roleTitle: "", platform: "", summary: "" });
  const [savingManual, setSavingManual] = useState(false);

  const [recent, setRecent] = useState<SavedSignal[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const loadRecent = useCallback(async () => {
    const { data } = await supabase
      .from("companies")
      .select("id,name,hiring_role_title,hiring_job_url,hiring_platform,opportunity_status,last_signal_at")
      .eq("lead_type", "hiring_signal")
      .order("last_signal_at", { ascending: false })
      .limit(25);
    setRecent((data as SavedSignal[]) ?? []);
    setLoadingRecent(false);
  }, []);

  useEffect(() => {
    let active = true;
    supabase
      .from("companies")
      .select("id,name,hiring_role_title,hiring_job_url,hiring_platform,opportunity_status,last_signal_at")
      .eq("lead_type", "hiring_signal")
      .order("last_signal_at", { ascending: false })
      .limit(25)
      .then(({ data }) => {
        if (active) setRecent((data as SavedSignal[]) ?? []);
      });
    return () => {
      active = false;
    };
  }, []);

  async function runSearch() {
    setSearching(true);
    setError(null);
    setInfo(null);
    setResults([]);
    try {
      const res = await fetch("/api/signals/hiring/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Search failed.");
        if (data.manualOnly) setInfo("Add job URLs manually in the panel on the right.");
        return;
      }
      setResults(data.results ?? []);
      if ((data.results ?? []).length === 0) setInfo("No results. Try another query or add a job URL manually.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function saveResult(r: SearchResult) {
    setSavingUrl(r.url);
    setError(null);
    try {
      const res = await fetch("/api/signals/hiring/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: r.title || r.platform || r.url,
          jobUrl: r.url,
          roleTitle: query,
          platform: r.platform,
          sourceUrl: r.url,
          summary: r.snippet,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Save failed.");
        return;
      }
      setSavedUrls((prev) => ({ ...prev, [r.url]: true }));
      loadRecent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingUrl(null);
    }
  }

  async function saveManual() {
    if (!m.name.trim() || !m.jobUrl.trim()) {
      setError("Manual entry needs at least a company name and a job URL.");
      return;
    }
    setSavingManual(true);
    setError(null);
    try {
      const res = await fetch("/api/signals/hiring/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: m.name,
          jobUrl: m.jobUrl,
          roleTitle: m.roleTitle,
          platform: m.platform,
          sourceUrl: m.jobUrl,
          summary: m.summary,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Save failed.");
        return;
      }
      setM({ name: "", jobUrl: "", roleTitle: "", platform: "", summary: "" });
      setInfo(data.already_saved ? "Already saved earlier." : "Saved as hiring signal.");
      loadRecent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSavingManual(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60";

  return (
    <div className="p-6">
      <PageHeader
        title="Hiring Signal Finder"
        description="Find companies hiring for hotel/hospitality marketing, social, content, design, F&B, or events roles. Save them as Opportunity OS hiring signals for manual review. No emails sent, no Hunter enrichment."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search + results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-zinc-500">
                Query
                <input className={`mt-1 ${inputCls}`} value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <label className="text-xs text-zinc-500">
                Location / country (optional)
                <input
                  className={`mt-1 ${inputCls}`}
                  placeholder="e.g. Pittsburgh, PA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {DEFAULT_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    query === q
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-500">
                lead type: hiring_signal
              </span>
              <button
                type="button"
                onClick={runSearch}
                disabled={searching}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search (Firecrawl)
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {info && <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-sm text-zinc-400">{info}</div>}

          <div className="space-y-3">
            {results.map((r) => {
              const saved = savedUrls[r.url];
              return (
                <div key={r.url} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-100 hover:text-emerald-400"
                      >
                        <span className="truncate">{r.title || r.url}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                      {r.platform && <p className="mt-0.5 text-[11px] text-zinc-500">{r.platform}</p>}
                      {r.snippet && <p className="mt-1.5 line-clamp-2 text-sm text-zinc-400">{r.snippet}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => saveResult(r)}
                      disabled={saved || savingUrl === r.url}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        saved
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "border border-zinc-700 text-zinc-200 hover:border-emerald-500/50 hover:text-emerald-400"
                      }`}
                    >
                      {savingUrl === r.url ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : saved ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      {saved ? "Saved" : "Save as Hiring Signal"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual entry + recently saved */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Plus className="h-4 w-4 text-emerald-400" /> Add a job URL manually
            </h2>
            <p className="mt-1 text-xs text-zinc-500">Paste a public job post from a company website or board.</p>
            <div className="mt-3 space-y-2">
              <input className={inputCls} placeholder="Company name *" value={m.name} onChange={(e) => setM({ ...m, name: e.target.value })} />
              <input className={inputCls} placeholder="Job URL *" value={m.jobUrl} onChange={(e) => setM({ ...m, jobUrl: e.target.value })} />
              <input className={inputCls} placeholder="Role title (e.g. Hotel Social Media Manager)" value={m.roleTitle} onChange={(e) => setM({ ...m, roleTitle: e.target.value })} />
              <input className={inputCls} placeholder="Platform (e.g. indeed.com, company site)" value={m.platform} onChange={(e) => setM({ ...m, platform: e.target.value })} />
              <textarea className={`${inputCls} min-h-[64px]`} placeholder="Short summary / why it's a signal" value={m.summary} onChange={(e) => setM({ ...m, summary: e.target.value })} />
              <button
                type="button"
                onClick={saveManual}
                disabled={savingManual}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {savingManual ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save as Hiring Signal
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                <Briefcase className="h-4 w-4 text-emerald-400" /> Recently saved
              </h2>
              <button type="button" onClick={() => { setLoadingRecent(true); loadRecent(); }} className="text-zinc-500 hover:text-zinc-200" aria-label="Refresh saved signals">
                <RefreshCw className={`h-4 w-4 ${loadingRecent ? "animate-spin" : ""}`} />
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {recent.length === 0 && <li className="text-xs text-zinc-600">No hiring signals saved yet.</li>}
              {recent.map((s) => (
                <li key={s.id} className="rounded-lg border border-zinc-800/70 px-3 py-2">
                  <p className="truncate text-sm text-zinc-200">{s.name}</p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {s.hiring_role_title || "role n/a"} · {s.hiring_platform || "source"} · {s.opportunity_status}
                  </p>
                  {s.hiring_job_url && (
                    <a href={s.hiring_job_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-500 hover:underline">
                      view job post
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
