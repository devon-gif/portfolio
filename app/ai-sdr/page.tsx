"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bot,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Settings = {
  id?: string;
  ai_sdr_enabled: boolean;
  ai_sdr_auto_promote: boolean;
  ai_sdr_auto_hunter: boolean;
  ai_sdr_auto_draft: boolean;
  ai_sdr_daily_prospect_limit: number;
  ai_sdr_enrich_limit: number;
  ai_sdr_min_confidence: number;
  ai_sdr_calendly_url: string;
};

type RunRow = {
  id: string;
  status: string;
  trigger_type: string;
  prospects_found: number;
  companies_promoted: number;
  companies_enriched: number;
  candidates_found: number;
  hunter_lookups: number;
  contacts_prepared: number;
  drafts_created: number;
  warnings: string[] | null;
  started_at: string;
  finished_at: string | null;
};

type DiscoveryRow = {
  id: string;
  name: string;
  website: string | null;
  source_url: string;
  company_category: string | null;
  fit_reason: string | null;
  confidence_score: number;
  status: string;
  discovered_at: string;
};

const DEFAULTS: Settings = {
  ai_sdr_enabled: false,
  ai_sdr_auto_promote: true,
  ai_sdr_auto_hunter: false,
  ai_sdr_auto_draft: true,
  ai_sdr_daily_prospect_limit: 10,
  ai_sdr_enrich_limit: 5,
  ai_sdr_min_confidence: 70,
  ai_sdr_calendly_url: "https://calendly.com/devonavich0/30min",
};

function timeAgo(raw: string | null) {
  if (!raw) return "—";
  const ms = Date.now() - new Date(raw).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return new Date(raw).toLocaleDateString();
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "success"
      ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
      : status === "partial"
        ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
        : status === "error"
          ? "bg-red-500/10 text-red-400 ring-red-500/20"
          : "bg-zinc-800 text-zinc-400 ring-zinc-700";
  return <span className={`rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${cls}`}>{status}</span>;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  caution,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
  caution?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-100">{label}</span>
          {caution && <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">USES CREDITS</span>}
        </div>
        <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-emerald-500"
      />
    </label>
  );
}

export default function AiSdrPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [discoveries, setDiscoveries] = useState<DiscoveryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState<{ type: "ok" | "error" | "info"; text: string } | null>(null);
  const [migrationMissing, setMigrationMissing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMigrationMissing(false);
    try {
      const [settingsRes, runsRes, discoveriesRes] = await Promise.all([
        supabase.from("app_settings").select("*").limit(1).maybeSingle(),
        supabase.from("ai_sdr_runs").select("*").order("created_at", { ascending: false }).limit(12),
        supabase
          .from("discovered_companies")
          .select("id,name,website,source_url,company_category,fit_reason,confidence_score,status,discovered_at")
          .order("discovered_at", { ascending: false })
          .limit(25),
      ]);

      if (settingsRes.error) throw settingsRes.error;
      if (settingsRes.data) {
        const row = settingsRes.data as Record<string, unknown>;
        setSettings({
          id: String(row.id ?? ""),
          ai_sdr_enabled: row.ai_sdr_enabled === true,
          ai_sdr_auto_promote: row.ai_sdr_auto_promote !== false,
          ai_sdr_auto_hunter: row.ai_sdr_auto_hunter === true,
          ai_sdr_auto_draft: row.ai_sdr_auto_draft !== false,
          ai_sdr_daily_prospect_limit: Number(row.ai_sdr_daily_prospect_limit ?? 10),
          ai_sdr_enrich_limit: Number(row.ai_sdr_enrich_limit ?? 5),
          ai_sdr_min_confidence: Number(row.ai_sdr_min_confidence ?? 70),
          ai_sdr_calendly_url: String(row.ai_sdr_calendly_url ?? DEFAULTS.ai_sdr_calendly_url),
        });
      }

      if (runsRes.error) {
        setMigrationMissing(true);
      } else {
        setRuns((runsRes.data ?? []) as RunRow[]);
      }

      if (!discoveriesRes.error) setDiscoveries((discoveriesRes.data ?? []) as DiscoveryRow[]);
    } catch (e) {
      setNote({ type: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveSettings() {
    setSaving(true);
    setNote(null);
    try {
      const payload = {
        ai_sdr_enabled: settings.ai_sdr_enabled,
        ai_sdr_auto_promote: settings.ai_sdr_auto_promote,
        ai_sdr_auto_hunter: settings.ai_sdr_auto_hunter,
        ai_sdr_auto_draft: settings.ai_sdr_auto_draft,
        ai_sdr_daily_prospect_limit: Math.max(1, Math.min(100, Math.floor(settings.ai_sdr_daily_prospect_limit))),
        ai_sdr_enrich_limit: Math.max(1, Math.min(25, Math.floor(settings.ai_sdr_enrich_limit))),
        ai_sdr_min_confidence: Math.max(0, Math.min(100, Math.floor(settings.ai_sdr_min_confidence))),
        ai_sdr_calendly_url: settings.ai_sdr_calendly_url.trim(),
      };

      let query;
      if (settings.id) query = supabase.from("app_settings").update(payload).eq("id", settings.id);
      else query = supabase.from("app_settings").insert(payload);
      const { error } = await query;
      if (error) {
        setMigrationMissing(true);
        throw new Error(`Could not save AI SDR settings. The AI SDR migration likely still needs to be applied. ${error.message}`);
      }
      setNote({ type: "ok", text: "AI SDR settings saved." });
      await load();
    } catch (e) {
      setNote({ type: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  }

  async function runNow() {
    setRunning(true);
    setNote({ type: "info", text: "Scout is working. Discovery + website enrichment can take a few minutes." });
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your CRM session is missing. Sign out and back in.");

      const res = await fetch("/api/ai-sdr/scout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error || "AI SDR run failed.");

      if (body.skipped) {
        setNote({ type: "info", text: body.warnings?.[0] || "AI SDR is disabled." });
      } else {
        const c = body.counts || {};
        setNote({
          type: body.status === "partial" ? "info" : "ok",
          text: `Scout finished: ${c.prospects_found || 0} new prospects, ${c.companies_enriched || 0} enriched, ${c.contacts_prepared || 0} contacts prepared, ${c.drafts_created || 0} drafts created.`,
        });
      }
      await load();
    } catch (e) {
      setNote({ type: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setRunning(false);
    }
  }

  const latest = runs[0];
  const recentTotals = useMemo(
    () =>
      runs.slice(0, 7).reduce(
        (acc, r) => ({
          prospects: acc.prospects + (r.prospects_found || 0),
          contacts: acc.contacts + (r.contacts_prepared || 0),
          drafts: acc.drafts + (r.drafts_created || 0),
        }),
        { prospects: 0, contacts: 0, drafts: 0 },
      ),
    [runs],
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
              <Bot className="h-4 w-4" />
              Archer Design Hotel Scout
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">AI SDR</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Finds reachable hotel prospects, researches real buying signals, prepares decision-maker contacts, and creates personalized drafts. Nothing is sent without your existing approval workflow.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading || running}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={runNow}
              disabled={running || loading || migrationMissing}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? "Scouting…" : "Run scout now"}
            </button>
          </div>
        </header>

        {migrationMissing && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <strong>Setup required:</strong> apply <code className="rounded bg-black/20 px-1">20260923_ai_sdr_controls.sql</code> to the Hotel Pipeline Supabase database before enabling this page.
          </div>
        )}

        {note && (
          <div className={`rounded-xl border p-4 text-sm ${
            note.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : note.type === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-sky-500/30 bg-sky-500/10 text-sky-300"
          }`}>
            {note.text}
          </div>
        )}

        <section className="grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between text-zinc-500"><Search className="h-4 w-4" /><span className="text-xs">Recent runs</span></div>
            <div className="mt-3 text-2xl font-semibold">{recentTotals.prospects}</div>
            <div className="mt-1 text-xs text-zinc-500">new prospects discovered</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between text-zinc-500"><Users className="h-4 w-4" /><span className="text-xs">Prepared</span></div>
            <div className="mt-3 text-2xl font-semibold">{recentTotals.contacts}</div>
            <div className="mt-1 text-xs text-zinc-500">decision-maker contacts</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between text-zinc-500"><Sparkles className="h-4 w-4" /><span className="text-xs">Drafted</span></div>
            <div className="mt-3 text-2xl font-semibold">{recentTotals.drafts}</div>
            <div className="mt-1 text-xs text-zinc-500">emails awaiting approval</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between text-zinc-500"><CalendarClock className="h-4 w-4" /><span className="text-xs">Last run</span></div>
            <div className="mt-3">{latest ? <StatusPill status={latest.status} /> : <span className="text-sm text-zinc-600">None yet</span>}</div>
            <div className="mt-2 text-xs text-zinc-500">{latest ? timeAgo(latest.finished_at || latest.started_at) : "Run once after setup"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold">Automation controls</h2>
          </div>
          <div className="space-y-3">
            <Toggle
              checked={settings.ai_sdr_enabled}
              onChange={(v) => setSettings((s) => ({ ...s, ai_sdr_enabled: v }))}
              label="Enable weekday hotel scouting"
              description="Allows the scheduled scout and manual Run Now action to discover prospects. Keep this off until the database migration and API credentials are verified."
            />
            <Toggle
              checked={settings.ai_sdr_auto_promote}
              onChange={(v) => setSettings((s) => ({ ...s, ai_sdr_auto_promote: v }))}
              label="Auto-promote strong prospects"
              description="Moves high-confidence companies into the existing CRM and runs public website research. It does not contact anyone."
            />
            <Toggle
              checked={settings.ai_sdr_auto_hunter}
              onChange={(v) => setSettings((s) => ({ ...s, ai_sdr_auto_hunter: v }))}
              label="Use Hunter for top decision-makers"
              description="Only for named, high-confidence buyers after public website research. Hunter credits may be consumed, so this starts OFF."
              caution
            />
            <Toggle
              checked={settings.ai_sdr_auto_draft}
              onChange={(v) => setSettings((s) => ({ ...s, ai_sdr_auto_draft: v }))}
              label="Create personalized email drafts"
              description="Creates draft messages for qualified contacts. Drafts still require your normal approval before scheduling or sending."
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <label className="text-xs text-zinc-400">
              Prospects per run
              <input
                type="number"
                min={1}
                max={100}
                value={settings.ai_sdr_daily_prospect_limit}
                onChange={(e) => setSettings((s) => ({ ...s, ai_sdr_daily_prospect_limit: Number(e.target.value) }))}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="text-xs text-zinc-400">
              Enrich per run
              <input
                type="number"
                min={1}
                max={25}
                value={settings.ai_sdr_enrich_limit}
                onChange={(e) => setSettings((s) => ({ ...s, ai_sdr_enrich_limit: Number(e.target.value) }))}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="text-xs text-zinc-400">
              Minimum confidence
              <input
                type="number"
                min={0}
                max={100}
                value={settings.ai_sdr_min_confidence}
                onChange={(e) => setSettings((s) => ({ ...s, ai_sdr_min_confidence: Number(e.target.value) }))}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </label>
            <label className="text-xs text-zinc-400">
              Booking link
              <input
                type="url"
                value={settings.ai_sdr_calendly_url}
                onChange={(e) => setSettings((s) => ({ ...s, ai_sdr_calendly_url: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500"
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              No automatic cold email sending. Existing suppression, unsubscribe, and approval controls remain in charge.
            </div>
            <button
              type="button"
              onClick={saveSettings}
              disabled={saving || migrationMissing}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Recent prospects</h2>
              <p className="mt-1 text-xs text-zinc-500">Public-source discoveries only. Giant enterprise hotel brands are intentionally deprioritized.</p>
            </div>
            <Link href="/prospects" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
              Open CRM →
            </Link>
          </div>
          {discoveries.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-zinc-600">No AI SDR discoveries yet.</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {discoveries.map((row) => (
                <div key={row.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.4fr_.8fr_.5fr_.5fr_30px] md:items-center">
                  <div>
                    <div className="text-sm font-medium text-zinc-200">{row.name}</div>
                    <div className="mt-1 line-clamp-1 text-xs text-zinc-500">{row.fit_reason || row.website || "Hospitality prospect"}</div>
                  </div>
                  <div className="text-xs text-zinc-500">{row.company_category?.replace(/_/g, " ") || "hospitality"}</div>
                  <div className="text-xs text-zinc-400">{row.confidence_score}% confidence</div>
                  <div className="text-xs text-zinc-500">{row.status}</div>
                  <a href={row.source_url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-emerald-400">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {runs.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold">Run history</h2>
            </div>
            <div className="divide-y divide-zinc-800">
              {runs.map((run) => (
                <div key={run.id} className="grid gap-2 px-5 py-3 text-xs text-zinc-500 md:grid-cols-[90px_90px_1fr_1fr_1fr_120px] md:items-center">
                  <StatusPill status={run.status} />
                  <span>{run.trigger_type}</span>
                  <span>{run.prospects_found} prospects</span>
                  <span>{run.contacts_prepared} contacts</span>
                  <span>{run.drafts_created} drafts</span>
                  <span>{timeAgo(run.finished_at || run.started_at)}</span>
                  {run.warnings && run.warnings.length > 0 && (
                    <div className="md:col-span-6 rounded-lg bg-amber-500/5 px-3 py-2 text-[11px] text-amber-400/80">
                      {run.warnings.join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="pb-4 text-center text-xs text-zinc-600">
          The AI SDR is a prospecting layer for your existing Hotel Pipeline. Review drafts in the current Command Center before anything is sent.
        </p>
      </div>
    </main>
  );
}
