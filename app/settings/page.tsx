"use client";

import { useState, useEffect } from "react";
import { Save, Check, Loader2, AlertTriangle, FlaskConical, Search, Globe } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
import { Field, Input, Textarea } from "@/components/SlideOver";

type Settings = Record<string, unknown> & { id?: string };

// Only columns that actually exist on app_settings.
const DEFAULTS: Settings = {
  daily_send_limit: 20,
  target_daily_send_limit: 50,
  daily_send_limit_us: 20,
  daily_send_limit_uk: 10,
  daily_send_limit_canada: 5,
  daily_send_limit_uae: 5,
  daily_send_limit_other: 5,
  target_daily_send_limit_us: 100,
  target_daily_send_limit_uk: 50,
  target_daily_send_limit_canada: 20,
  target_daily_send_limit_uae: 20,
  target_daily_send_limit_other: 10,
  send_window_start_hour: 9,
  send_window_end_hour: 17,
  batch_size_min: 3,
  batch_size_max: 8,
  minutes_between_batches_min: 20,
  minutes_between_batches_max: 60,
  require_manual_approval: true,
  mailing_address: "",
  opt_out_line: "",
  test_mode: true,
  test_email: "",
};

// ─── Shared sub-components ───────────────────────────────────────────────────

function DiagRow({
  label,
  configured,
  testStatus,
  unavailableLabel,
}: {
  label: string;
  configured: boolean;
  testStatus: "idle" | "ok" | "error" | "unavailable";
  unavailableLabel?: string;
}) {
  let badge: { text: string; cls: string; icon?: boolean };
  if (!configured) {
    badge = { text: "Not configured", cls: "bg-zinc-800 text-zinc-500 ring-zinc-700" };
  } else if (testStatus === "ok") {
    badge = { text: "Working", cls: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20", icon: true };
  } else if (testStatus === "unavailable") {
    badge = { text: unavailableLabel ?? "Configured · unavailable", cls: "bg-amber-500/10 text-amber-400 ring-amber-500/20" };
  } else if (testStatus === "error") {
    badge = { text: "Configured · error", cls: "bg-red-500/10 text-red-400 ring-red-500/20" };
  } else {
    badge = { text: "Configured", cls: "bg-sky-500/10 text-sky-400 ring-sky-500/20", icon: true };
  }
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.cls}`}>
        {badge.icon && configured && <Check className="h-3 w-3" />}
        {badge.text}
      </span>
    </li>
  );
}

function SearchResultList({ results, linkKey = "url" }: { results: { title: string; url?: string; link?: string; snippet: string }[]; linkKey?: "url" | "link" }) {
  return (
    <ul className="space-y-2">
      {results.map((r, i) => {
        const href = linkKey === "link" ? r.link : r.url;
        return (
          <li key={i} className="rounded-lg bg-zinc-800/60 border border-zinc-700/60 px-3 py-2.5">
            {href
              ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-emerald-400 hover:underline line-clamp-1">{r.title || href}</a>
              : <p className="text-xs font-medium text-zinc-300 line-clamp-1">{r.title}</p>}
            {r.snippet && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{r.snippet}</p>}
          </li>
        );
      })}
    </ul>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {hint && <p className="text-xs text-zinc-600 mt-0.5">{hint}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-zinc-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

type Diagnostics = {
  firecrawl: boolean;
  google_search_api_key: boolean;
  google_cse_id: boolean;
  hunter: boolean;
  apollo: boolean;
} | null;

// Per-test statuses tracked after running each test button
type TestStatus = "idle" | "ok" | "error" | "unavailable";

type SearchResult = { title: string; url?: string; link?: string; snippet: string };
type FirecrawlResult = { url: string; title: string; description: string; preview: string; total_chars: number };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  // Columns that actually exist on the app_settings row (captured at load). Used
  // to filter the save payload so a missing column never crashes the page.
  const [dbColumns, setDbColumns] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Research diagnostics
  const [diagnostics, setDiagnostics] = useState<Diagnostics>(null);
  const [diagLoading, setDiagLoading] = useState(true);

  // Per-test status (feeds back into diagnostics display)
  const [googleStatus, setGoogleStatus] = useState<TestStatus>("idle");
  const [fcScrapeStatus, setFcScrapeStatus] = useState<TestStatus>("idle");
  const [fcSearchStatus, setFcSearchStatus] = useState<TestStatus>("idle");

  // Google test
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleResults, setGoogleResults] = useState<SearchResult[] | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Firecrawl scrape test
  const [firecrawlUrl, setFirecrawlUrl] = useState("https://www.hvmg.com/");
  const [firecrawlLoading, setFirecrawlLoading] = useState(false);
  const [firecrawlResult, setFirecrawlResult] = useState<FirecrawlResult | null>(null);
  const [firecrawlError, setFirecrawlError] = useState<string | null>(null);

  // Firecrawl search test
  const [fcSearchLoading, setFcSearchLoading] = useState(false);
  const [fcSearchResults, setFcSearchResults] = useState<SearchResult[] | null>(null);
  const [fcSearchError, setFcSearchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured) { setLoading(false); return; }
      const { data, error } = await supabase.from("app_settings").select("*").limit(1).single();
      if (cancelled) return;
      if (error) setError(error.message);
      else if (data) {
        // Merge real row over defaults; null columns fall back to defaults below.
        const merged: Settings = { ...DEFAULTS };
        for (const [k, v] of Object.entries(data)) merged[k] = v ?? DEFAULTS[k] ?? v;
        setSettings(merged);
        setDbColumns(new Set(Object.keys(data)));
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetch("/api/research/diagnostics")
      .then((r) => r.json())
      .then((d) => setDiagnostics(d))
      .catch(() => setDiagnostics(null))
      .finally(() => setDiagLoading(false));
  }, []);

  async function testGoogle() {
    setGoogleLoading(true);
    setGoogleResults(null);
    setGoogleError(null);
    try {
      const r = await fetch("/api/research/test-google");
      const d = await r.json();
      if (d.ok) {
        setGoogleResults(d.results);
        setGoogleStatus("ok");
      } else {
        setGoogleError(d.error ?? "Unknown error");
        setGoogleStatus(d.unavailable ? "unavailable" : "error");
      }
    } catch (e) {
      setGoogleError(e instanceof Error ? e.message : String(e));
      setGoogleStatus("error");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function testFirecrawlScrape() {
    setFirecrawlLoading(true);
    setFirecrawlResult(null);
    setFirecrawlError(null);
    try {
      const r = await fetch("/api/research/test-firecrawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: firecrawlUrl }),
      });
      const d = await r.json();
      if (d.ok) {
        setFirecrawlResult(d);
        setFcScrapeStatus("ok");
      } else {
        setFirecrawlError(d.error ?? "Unknown error");
        setFcScrapeStatus("error");
      }
    } catch (e) {
      setFirecrawlError(e instanceof Error ? e.message : String(e));
      setFcScrapeStatus("error");
    } finally {
      setFirecrawlLoading(false);
    }
  }

  async function testFirecrawlSearch() {
    setFcSearchLoading(true);
    setFcSearchResults(null);
    setFcSearchError(null);
    try {
      const r = await fetch("/api/research/test-firecrawl-search");
      const d = await r.json();
      if (d.ok) {
        setFcSearchResults(d.results);
        setFcSearchStatus("ok");
      } else {
        setFcSearchError(d.error ?? "Unknown error");
        setFcSearchStatus("error");
      }
    } catch (e) {
      setFcSearchError(e instanceof Error ? e.message : String(e));
      setFcSearchStatus("error");
    } finally {
      setFcSearchLoading(false);
    }
  }

  function patch(key: string, value: unknown) { setSettings((s) => ({ ...s, [key]: value })); }
  function num(key: string, value: string, min: number, max: number) {
    const n = parseInt(value, 10);
    patch(key, Number.isNaN(n) ? min : Math.max(min, Math.min(max, n)));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) { setError("Supabase isn't configured."); return; }
    setSaving(true);
    // Only send columns that actually exist on app_settings. If we know the real
    // row columns (from load), intersect with them so a column missing in the DB
    // (e.g. a migration not yet run) can never crash the save.
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const k of Object.keys(DEFAULTS)) {
      if (dbColumns && !dbColumns.has(k)) continue; // skip columns the DB doesn't have
      payload[k] = settings[k];
    }
    const id = settings.id;
    const { error } = id
      ? await supabase.from("app_settings").update(payload).eq("id", id)
      : await supabase.from("app_settings").insert(payload);
    setSaving(false);
    if (error) {
      setError(
        /column/i.test(error.message)
          ? `${error.message} — run the latest Supabase migrations (supabase/migrations) and reload.`
          : error.message,
      );
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const s = settings;
  const n = (k: string, d = 0) => (typeof s[k] === "number" ? (s[k] as number) : d);
  const str = (k: string) => (typeof s[k] === "string" ? (s[k] as string) : "");
  const testOn = s.test_mode !== false;

  if (loading) {
    return <div className="px-6 py-6 max-w-2xl flex items-center gap-2 text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading settings…</div>;
  }

  return (
    <div className="px-6 py-6 max-w-2xl">
      <PageHeader title="Settings" description="Sending limits, schedule, compliance, and test mode." />

      {!isSupabaseConfigured && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" /> Supabase isn&apos;t configured — settings won&apos;t persist.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Test mode */}
        <section className={`rounded-xl border px-5 py-5 ${testOn ? "border-amber-500/40 bg-amber-500/5" : "border-zinc-800 bg-zinc-900"}`}>
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className={`h-4 w-4 ${testOn ? "text-amber-400" : "text-zinc-500"}`} />
            <h2 className="text-sm font-semibold text-zinc-300">Test Mode</h2>
          </div>
          <div className="space-y-4">
            <Toggle
              checked={testOn}
              onChange={(v) => patch("test_mode", v)}
              label="Route all sends to my test inbox"
              hint="When ON, every send (including scheduled batches) goes to your test email instead of the real contact. Subjects are tagged [TEST → original@email]."
            />
            <Field label="Test email" hint="Where test sends are delivered.">
              <Input type="email" value={str("test_email")} onChange={(e) => patch("test_email", e.target.value)} placeholder="you@example.com" />
            </Field>
          </div>
        </section>

        {/* Resend (env-managed, read-only here) */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-1">Resend</h2>
          <p className="text-xs text-zinc-600">From and Reply-To are configured via environment variables <code className="text-zinc-400">RESEND_FROM_EMAIL</code> and <code className="text-zinc-400">RESEND_REPLY_TO</code> (use your verified checkray.app domain).</p>
        </section>

        {/* Research Providers */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Research Providers</h2>

          {diagLoading ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking…</div>
          ) : (
            <ul className="space-y-2 mb-5">
              {/* Firecrawl scrape */}
              <DiagRow
                label="Firecrawl scrape"
                configured={!!diagnostics?.firecrawl}
                testStatus={fcScrapeStatus}
              />
              {/* Firecrawl search */}
              <DiagRow
                label="Firecrawl search"
                configured={!!diagnostics?.firecrawl}
                testStatus={fcSearchStatus}
              />
              {/* Google Search */}
              <DiagRow
                label="Google Search"
                configured={!!(diagnostics?.google_search_api_key && diagnostics?.google_cse_id)}
                testStatus={googleStatus}
                unavailableLabel="Configured · unavailable (API not enabled)"
              />
              {/* Hunter / Apollo */}
              <DiagRow label="Hunter" configured={!!diagnostics?.hunter} testStatus="idle" />
              <DiagRow label="Apollo" configured={!!diagnostics?.apollo} testStatus="idle" />
            </ul>
          )}

          {/* ── Test Firecrawl Search ── */}
          <div className="border-t border-zinc-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-300">Test Firecrawl Search</p>
                <p className="text-xs text-zinc-600 mt-0.5">Query: HVMG Director of Marketing hotel</p>
              </div>
              <button
                type="button"
                onClick={testFirecrawlSearch}
                disabled={fcSearchLoading || !diagnostics?.firecrawl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors"
              >
                {fcSearchLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                {fcSearchLoading ? "Searching…" : "Run Test"}
              </button>
            </div>
            {fcSearchError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{fcSearchError}</p>
            )}
            {fcSearchResults && fcSearchResults.length === 0 && (
              <p className="text-xs text-zinc-500">No results returned.</p>
            )}
            {fcSearchResults && fcSearchResults.length > 0 && (
              <SearchResultList results={fcSearchResults} />
            )}
          </div>

          {/* ── Test Google Search ── */}
          <div className="border-t border-zinc-800 pt-4 mt-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-300">Test Google Search</p>
                <p className="text-xs text-zinc-600 mt-0.5">Query: site:linkedin.com/in &quot;Director of Marketing&quot; &quot;hotel management&quot;</p>
                {googleStatus === "unavailable" && (
                  <p className="text-xs text-amber-400 mt-0.5">API returned 403 — enable Custom Search JSON API in Google Cloud Console.</p>
                )}
              </div>
              <button
                type="button"
                onClick={testGoogle}
                disabled={googleLoading || !diagnostics?.google_search_api_key || !diagnostics?.google_cse_id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors"
              >
                {googleLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                {googleLoading ? "Searching…" : "Run Test"}
              </button>
            </div>
            {googleError && googleStatus !== "unavailable" && (
              <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{googleError}</p>
            )}
            {googleResults && googleResults.length === 0 && (
              <p className="text-xs text-zinc-500">No results returned.</p>
            )}
            {googleResults && googleResults.length > 0 && (
              <SearchResultList results={googleResults} linkKey="link" />
            )}
          </div>

          {/* ── Test Firecrawl Scrape ── */}
          <div className="border-t border-zinc-800 pt-4 mt-1 space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-300">Test Firecrawl Scrape</p>
              <p className="text-xs text-zinc-600 mt-0.5">Scrape one URL and preview extracted text.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={firecrawlUrl}
                onChange={(e) => setFirecrawlUrl(e.target.value)}
                placeholder="https://www.hvmg.com/"
                className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50"
              />
              <button
                type="button"
                onClick={testFirecrawlScrape}
                disabled={firecrawlLoading || !diagnostics?.firecrawl || !firecrawlUrl.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors shrink-0"
              >
                {firecrawlLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
                {firecrawlLoading ? "Scraping…" : "Scrape"}
              </button>
            </div>
            {firecrawlError && (
              <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{firecrawlError}</p>
            )}
            {firecrawlResult && (
              <div className="rounded-lg bg-zinc-800/60 border border-zinc-700/60 px-3 py-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-300 truncate">{firecrawlResult.title || "(no title)"}</p>
                <p className="text-xs text-zinc-500 truncate">{firecrawlResult.url}</p>
                {firecrawlResult.description && (
                  <p className="text-xs text-zinc-500 italic line-clamp-2">{firecrawlResult.description}</p>
                )}
                <div className="mt-2 rounded bg-zinc-900 border border-zinc-700/40 p-2">
                  <pre className="text-xs text-zinc-400 whitespace-pre-wrap break-words">{firecrawlResult.preview}</pre>
                </div>
                <p className="text-xs text-zinc-600">{firecrawlResult.total_chars.toLocaleString()} total chars extracted (showing first 1,000)</p>
              </div>
            )}
          </div>
        </section>

        {/* Limits + schedule */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-1">Sending Limits & Schedule</h2>
          <p className="text-xs text-zinc-600 mb-4">Default 20/day. Raise over time up to a hard cap of 200/day.</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Daily send limit" hint="Max sent per day (1–200).">
              <Input type="number" min={1} max={200} value={n("daily_send_limit", 20)} onChange={(e) => num("daily_send_limit", e.target.value, 1, 200)} />
            </Field>
            <Field label="Target daily limit" hint="What you're ramping toward (≤200).">
              <Input type="number" min={1} max={200} value={n("target_daily_send_limit", 50)} onChange={(e) => num("target_daily_send_limit", e.target.value, 1, 200)} />
            </Field>
            <Field label="US daily limit"><Input type="number" min={0} max={200} value={n("daily_send_limit_us", 20)} onChange={(e) => num("daily_send_limit_us", e.target.value, 0, 200)} /></Field>
            <Field label="UK daily limit"><Input type="number" min={0} max={200} value={n("daily_send_limit_uk", 10)} onChange={(e) => num("daily_send_limit_uk", e.target.value, 0, 200)} /></Field>
            <Field label="Canada daily limit"><Input type="number" min={0} max={200} value={n("daily_send_limit_canada", 5)} onChange={(e) => num("daily_send_limit_canada", e.target.value, 0, 200)} /></Field>
            <Field label="UAE daily limit"><Input type="number" min={0} max={200} value={n("daily_send_limit_uae", 5)} onChange={(e) => num("daily_send_limit_uae", e.target.value, 0, 200)} /></Field>
            <Field label="Other daily limit"><Input type="number" min={0} max={200} value={n("daily_send_limit_other", 5)} onChange={(e) => num("daily_send_limit_other", e.target.value, 0, 200)} /></Field>
            <Field label="US target limit"><Input type="number" min={0} max={500} value={n("target_daily_send_limit_us", 100)} onChange={(e) => num("target_daily_send_limit_us", e.target.value, 0, 500)} /></Field>
            <Field label="UK target limit"><Input type="number" min={0} max={500} value={n("target_daily_send_limit_uk", 50)} onChange={(e) => num("target_daily_send_limit_uk", e.target.value, 0, 500)} /></Field>
            <Field label="Canada target limit"><Input type="number" min={0} max={500} value={n("target_daily_send_limit_canada", 20)} onChange={(e) => num("target_daily_send_limit_canada", e.target.value, 0, 500)} /></Field>
            <Field label="UAE target limit"><Input type="number" min={0} max={500} value={n("target_daily_send_limit_uae", 20)} onChange={(e) => num("target_daily_send_limit_uae", e.target.value, 0, 500)} /></Field>
            <Field label="Other target limit"><Input type="number" min={0} max={500} value={n("target_daily_send_limit_other", 10)} onChange={(e) => num("target_daily_send_limit_other", e.target.value, 0, 500)} /></Field>
            <Field label="Send window start (hour)" hint="0–23, local time.">
              <Input type="number" min={0} max={23} value={n("send_window_start_hour", 9)} onChange={(e) => num("send_window_start_hour", e.target.value, 0, 23)} />
            </Field>
            <Field label="Send window end (hour)" hint="1–24, after start.">
              <Input type="number" min={1} max={24} value={n("send_window_end_hour", 17)} onChange={(e) => num("send_window_end_hour", e.target.value, 1, 24)} />
            </Field>
            <Field label="Batch size min"><Input type="number" min={1} max={50} value={n("batch_size_min", 3)} onChange={(e) => num("batch_size_min", e.target.value, 1, 50)} /></Field>
            <Field label="Batch size max"><Input type="number" min={1} max={50} value={n("batch_size_max", 8)} onChange={(e) => num("batch_size_max", e.target.value, 1, 50)} /></Field>
            <Field label="Min minutes between batches"><Input type="number" min={1} max={600} value={n("minutes_between_batches_min", 20)} onChange={(e) => num("minutes_between_batches_min", e.target.value, 1, 600)} /></Field>
            <Field label="Max minutes between batches"><Input type="number" min={1} max={600} value={n("minutes_between_batches_max", 60)} onChange={(e) => num("minutes_between_batches_max", e.target.value, 1, 600)} /></Field>
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <Toggle checked={s.require_manual_approval !== false} onChange={(v) => patch("require_manual_approval", v)} label="Require manual approval before sending" hint="Keep this on — nothing sends until you approve it." />
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Per-Market Daily Caps</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="US daily / target"><Input type="number" min={1} max={200} value={n("daily_send_limit_us", 20)} onChange={(e) => num("daily_send_limit_us", e.target.value, 1, 200)} /></Field>
              <Field label="US target"><Input type="number" min={1} max={200} value={n("target_send_limit_us", 100)} onChange={(e) => num("target_send_limit_us", e.target.value, 1, 200)} /></Field>
              <Field label="UK daily"><Input type="number" min={1} max={200} value={n("daily_send_limit_uk", 10)} onChange={(e) => num("daily_send_limit_uk", e.target.value, 1, 200)} /></Field>
              <Field label="UK target"><Input type="number" min={1} max={200} value={n("target_send_limit_uk", 50)} onChange={(e) => num("target_send_limit_uk", e.target.value, 1, 200)} /></Field>
              <Field label="Canada daily"><Input type="number" min={1} max={200} value={n("daily_send_limit_canada", 5)} onChange={(e) => num("daily_send_limit_canada", e.target.value, 1, 200)} /></Field>
              <Field label="Canada target"><Input type="number" min={1} max={200} value={n("target_send_limit_canada", 20)} onChange={(e) => num("target_send_limit_canada", e.target.value, 1, 200)} /></Field>
              <Field label="UAE daily"><Input type="number" min={1} max={200} value={n("daily_send_limit_uae", 5)} onChange={(e) => num("daily_send_limit_uae", e.target.value, 1, 200)} /></Field>
              <Field label="UAE target"><Input type="number" min={1} max={200} value={n("target_send_limit_uae", 20)} onChange={(e) => num("target_send_limit_uae", e.target.value, 1, 200)} /></Field>
              <Field label="Other daily"><Input type="number" min={1} max={200} value={n("daily_send_limit_other", 5)} onChange={(e) => num("daily_send_limit_other", e.target.value, 1, 200)} /></Field>
              <Field label="Other target"><Input type="number" min={1} max={200} value={n("target_send_limit_other", 10)} onChange={(e) => num("target_send_limit_other", e.target.value, 1, 200)} /></Field>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-1">Compliance</h2>
          <p className="text-xs text-zinc-600 mb-4">Appended to every email. A physical mailing address is required to send.</p>
          <div className="space-y-4">
            <Field label="Physical mailing address" hint="Required by CAN-SPAM — sends are blocked if this is empty.">
              <Textarea rows={3} value={str("mailing_address")} onChange={(e) => patch("mailing_address", e.target.value)} placeholder="123 Main St, Suite 100&#10;New York, NY 10001" />
            </Field>
            <Field label="Opt-out line">
              <Textarea rows={2} value={str("opt_out_line")} onChange={(e) => patch("opt_out_line", e.target.value)} placeholder="You received this because of your work in hospitality." />
            </Field>
          </div>
        </section>

        {error && <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertTriangle className="h-3.5 w-3.5" />{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
