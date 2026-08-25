"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /scorecard-submissions */

// Promo Rescue Lead Finder — admin-only workflow for finding, scoring, and
// drafting (never sending) outreach for the $59.99 Promo Rescue offer.
//
// SAFETY: nothing on this page sends a message. Search hits Google Places.
// Scoring scrapes only public pages via Firecrawl (no login, no LinkedIn,
// no Facebook/Instagram-behind-login, no robots/rate-limit bypassing).
// Every lead lands in Supabase with status "new" for manual review.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Clipboard, ClipboardCheck, ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { PROMO_CATEGORIES, type PromoCategory, type LeadStatus, type ScoredLead } from "@/lib/promo-leads";

type SavedLead = ScoredLead & { id: string; created_at: string };

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "contacted", label: "Contacted" },
  { value: "not_fit", label: "Not a fit" },
];

const STATUS_CLS: Record<LeadStatus, string> = {
  new: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  reviewed: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  contacted: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  not_fit: "bg-red-500/10 text-red-400 ring-red-500/20",
};

function scoreColor(score: number) {
  if (score >= 10) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-zinc-500";
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-800"
    >
      {done ? <ClipboardCheck className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
      {done ? "Copied" : "Copy message"}
    </button>
  );
}

export default function PromoLeadsPage() {
  const [state, setState] = useState("PA");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<PromoCategory>("restaurant");
  const [maxResults, setMaxResults] = useState(25);
  const [minRating, setMinRating] = useState("");
  const [hasWebsite, setHasWebsite] = useState<"" | "true" | "false">("");

  const [searching, setSearching] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [scoreProgress, setScoreProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<ScoredLead[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [saved, setSaved] = useState<SavedLead[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [tab, setTab] = useState<"results" | "saved">("results");

  const loadSaved = useCallback(async () => {
    setLoadingSaved(true);
    try {
      const res = await fetch("/api/promo-leads/save");
      const data = await res.json();
      setSaved(data.leads ?? []);
    } catch {
      setSaved([]);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  async function runSearch() {
    setSearching(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch("/api/promo-leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          city: city || undefined,
          category,
          maxResults,
          minRating: minRating ? Number(minRating) : undefined,
          hasWebsite: hasWebsite === "" ? undefined : hasWebsite === "true",
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Search failed.");
        setSearching(false);
        return;
      }
      const businesses = data.results as ScoredLead[];
      setSearching(false);

      // Score sequentially (one Firecrawl scrape batch per business) to
      // respect rate limits — no parallel hammering of either API.
      setScoring(true);
      setScoreProgress({ done: 0, total: businesses.length });
      const scored: ScoredLead[] = [];
      for (const business of businesses) {
        try {
          const scoreRes = await fetch("/api/promo-leads/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ business, category }),
          });
          const scoreData = await scoreRes.json();
          if (scoreData.ok) scored.push(scoreData.lead);
        } catch {
          // Skip a single failed scoring call; keep going with the rest.
        }
        setScoreProgress((p) => ({ ...p, done: p.done + 1 }));
        setResults([...scored].sort((a, b) => b.fit_score - a.fit_score));
      }
      setScoring(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
      setSearching(false);
      setScoring(false);
    }
  }

  async function saveLead(lead: ScoredLead, status: LeadStatus = "new") {
    const res = await fetch("/api/promo-leads/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: { ...lead, status } }),
    });
    const data = await res.json();
    if (data.ok) await loadSaved();
    return data;
  }

  async function patchSavedStatus(lead: SavedLead, status: LeadStatus) {
    setSaved((cur) => cur.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await fetch("/api/promo-leads/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead: { ...lead, status } }),
    });
  }

  const stats = useMemo(
    () => ({
      newResults: results.length,
      savedTotal: saved.length,
      approved: saved.filter((l) => l.status === "approved").length,
      contacted: saved.filter((l) => l.status === "contacted").length,
    }),
    [results, saved],
  );

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Promo Rescue Lead Finder"
        description="Finds and scores PA small businesses for the $59.99 Promo Rescue offer. Nothing here sends outreach automatically — every message is drafted for manual copy/paste."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Current search results", value: stats.newResults },
          { label: "Saved leads", value: stats.savedTotal },
          { label: "Approved", value: stats.approved },
          { label: "Contacted", value: stats.contacted },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <div className="text-2xl font-semibold text-zinc-100">{s.value}</div>
            <div className="text-[11px] text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search form */}
      <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">State</label>
            <input value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">City (optional)</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Pittsburgh" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as PromoCategory)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200">
              {PROMO_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">Max results</label>
            <input type="number" min={1} max={60} value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">Min rating</label>
            <input value={minRating} onChange={(e) => setMinRating(e.target.value)} placeholder="e.g. 4.0" className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-zinc-500">Has website</label>
            <select value={hasWebsite} onChange={(e) => setHasWebsite(e.target.value as "" | "true" | "false")} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-200">
              <option value="">Any</option>
              <option value="true">Has website</option>
              <option value="false">No website</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={runSearch}
            disabled={searching || scoring}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-50"
          >
            {searching || scoring ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            {searching ? "Searching..." : scoring ? `Scoring ${scoreProgress.done}/${scoreProgress.total}...` : "Run search"}
          </button>
          {error && <span className="text-[12px] text-red-400">{error}</span>}
        </div>
      </div>

      <div className="mb-4 flex rounded-lg border border-zinc-800 p-0.5 w-fit">
        {(["results", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx("rounded-md px-3 py-1.5 text-sm transition", tab === t ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-200")}
          >
            {t === "results" ? `Search results (${results.length})` : `Saved leads (${saved.length})`}
          </button>
        ))}
        <button onClick={loadSaved} className="ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-200">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {tab === "results" && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">Business</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Fit reason</th>
                <th className="px-3 py-2">Suggested message</th>
                <th className="px-3 py-2">Links</th>
                <th className="px-3 py-2">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-zinc-500">
                    {searching || scoring ? "Working..." : "Run a search to find leads."}
                  </td>
                </tr>
              )}
              {results.map((lead) => (
                <tr key={lead.place_id ?? lead.business_name} className="align-top">
                  <td className="px-3 py-3">
                    <div className="font-medium text-zinc-100">{lead.business_name}</div>
                    <div className="text-[11px] text-zinc-500">
                      {lead.category} · {lead.city ?? "—"}, {lead.state ?? "—"}
                      {lead.rating ? ` · ${lead.rating}★ (${lead.review_count ?? 0})` : ""}
                    </div>
                  </td>
                  <td className={clsx("px-3 py-3 font-semibold", scoreColor(lead.fit_score))}>{lead.fit_score}</td>
                  <td className="px-3 py-3 max-w-[260px] text-[12px] text-zinc-400">{lead.fit_reason}</td>
                  <td className="px-3 py-3 max-w-[320px]">
                    <p className="text-[12px] text-zinc-400">{lead.suggested_message}</p>
                    <div className="mt-2"><CopyBtn text={lead.suggested_message} /></div>
                  </td>
                  <td className="px-3 py-3 text-[12px]">
                    {lead.website && (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 hover:underline">
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {lead.google_maps_url && (
                      <a href={lead.google_maps_url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-zinc-500 hover:underline">
                        Maps
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => saveLead(lead)}
                      className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800"
                    >
                      Save lead
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "saved" && (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">Business</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Suggested message</th>
                <th className="px-3 py-2">Links</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loadingSaved && (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-zinc-500">Loading...</td></tr>
              )}
              {!loadingSaved && saved.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-zinc-500">No saved leads yet.</td></tr>
              )}
              {saved.map((lead) => (
                <tr key={lead.id} className="align-top">
                  <td className="px-3 py-3">
                    <div className="font-medium text-zinc-100">{lead.business_name}</div>
                    <div className="text-[11px] text-zinc-500">{lead.category} · {lead.city ?? "—"}, {lead.state ?? "—"}</div>
                  </td>
                  <td className={clsx("px-3 py-3 font-semibold", scoreColor(lead.fit_score ?? 0))}>{lead.fit_score ?? "—"}</td>
                  <td className="px-3 py-3 max-w-[320px]">
                    <p className="text-[12px] text-zinc-400">{lead.suggested_message}</p>
                    <div className="mt-2"><CopyBtn text={lead.suggested_message ?? ""} /></div>
                  </td>
                  <td className="px-3 py-3 text-[12px]">
                    {lead.website && (
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 hover:underline">
                        Website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => patchSavedStatus(lead, e.target.value as LeadStatus)}
                      className={clsx("rounded-full px-2 py-1 text-[11px] ring-1", STATUS_CLS[lead.status])}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
