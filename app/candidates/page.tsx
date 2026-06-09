"use client";

import { useEffect, useState, useCallback } from "react";
import {
  UserPlus, X, Loader2, ExternalLink, Mail, Link2, Globe, AlertTriangle, RefreshCw, Search, ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Candidate = {
  id: string;
  run_id: string | null;
  company_id: string | null;
  name: string | null;
  title: string | null;
  email: string | null;
  email_status: string | null;
  linkedin_url: string | null;
  source_url: string | null;
  source_type: string | null;
  source_excerpt: string | null;
  confidence_score: number;
  recommended_channel: string | null;
  recommended_action: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  companies?: { name?: string | null; website?: string | null } | null;
};

const CHANNEL_BADGE: Record<string, string> = {
  email: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  generic_email: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  contact_form: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  linkedin: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  needs_manual_research: "bg-zinc-800 text-zinc-500 ring-zinc-700",
};

const CHANNEL_LABEL: Record<string, string> = {
  email: "Email",
  generic_email: "Generic email",
  contact_form: "Contact form",
  linkedin: "LinkedIn",
  needs_manual_research: "Manual research",
};

const ACTION_LABEL: Record<string, string> = {
  create_email_draft: "Create email draft",
  create_linkedin_draft: "Create LinkedIn draft",
  create_contact_form_task: "Create contact form task",
  verify_with_hunter: "Verify with Hunter",
  manual_review: "Manual review",
  skip: "Skip",
};

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

export default function CandidatesPage() {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<Record<string, { kind: "ok" | "err" | "info"; text: string }>>({});
  const [running, setRunning] = useState<Record<string, string>>({}); // per-candidate action label
  const [hunterConfigured, setHunterConfigured] = useState(false);
  const [tick, setTick] = useState(0);
  function reload() { setTick((t) => t + 1); }

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_candidates")
      .select("*, companies(name, website)")
      .eq("status", "needs_review")
      .order("confidence_score", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    setRows((data as Candidate[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load, tick]);

  useEffect(() => {
    fetch("/api/research/diagnostics")
      .then((r) => r.json())
      .then((d) => setHunterConfigured(!!d?.hunter))
      .catch(() => setHunterConfigured(false));
  }, []);

  useEffect(() => {
    supabase.from("companies").select("id, name").order("name").then(({ data }) => {
      setCompanies((data as { id: string; name: string }[]) ?? []);
    });
  }, []);

  async function promote(id: string) {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const r = await fetch("/api/research/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: id }),
      });
      const d = await r.json();
      if (d.ok) {
        setMsg((m) => ({ ...m, [id]: { kind: "ok", text: "Promoted to Contact." } }));
        setTimeout(() => reload(), 600);
      } else {
        setMsg((m) => ({ ...m, [id]: { kind: "err", text: d.error ?? "Promote failed." } }));
      }
    } catch (e) {
      setMsg((m) => ({ ...m, [id]: { kind: "err", text: e instanceof Error ? e.message : "Network error." } }));
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  }

  async function reject(id: string) {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      await fetch("/api/research/candidate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: id, action: "skip" }),
      });
      setMsg((m) => ({ ...m, [id]: { kind: "ok", text: "Skipped." } }));
      setTimeout(() => reload(), 400);
    } catch (e) {
      setMsg((m) => ({ ...m, [id]: { kind: "err", text: e instanceof Error ? e.message : "Network error." } }));
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  }

  async function setAction(id: string, action: string) {
    setBusy((b) => ({ ...b, [id]: true }));
    try {
      const r = await fetch("/api/research/candidate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: id, action }),
      });
      const d = await r.json();
      setMsg((m) => ({ ...m, [id]: { kind: d.ok ? "ok" : "err", text: d.ok ? "Action saved." : (d.error ?? "Action failed.") } }));
      if (d.ok) setTimeout(() => reload(), 500);
    } catch (e) {
      setMsg((m) => ({ ...m, [id]: { kind: "err", text: e instanceof Error ? e.message : "Network error." } }));
    } finally {
      setBusy((b) => ({ ...b, [id]: false }));
    }
  }

  function splitName(name?: string | null): { first: string | null; last: string | null } {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return { first: null, last: null };
    return { first: parts[0], last: parts.slice(1).join(" ") };
  }

  function hasDomain(site?: string | null): boolean {
    if (!site) return false;
    const raw = site.trim();
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return !!new URL(withScheme).hostname;
    } catch {
      return false;
    }
  }

  function verifyStatusLabel(status?: string | null): string {
    switch ((status ?? "").toLowerCase()) {
      case "verified": return "valid";
      case "risky": return "risky";
      case "invalid": return "invalid";
      case "unverified":
      case "unknown": return "unknown";
      default: return status || "unknown";
    }
  }

  function clearMsg(id: string) {
    setMsg((m) => { const n = { ...m }; delete n[id]; return n; });
  }

  async function hunterFindEmail(candidate: Candidate) {
    const { first, last } = splitName(candidate.name);
    if (!first || !last) {
      setMsg((m) => ({ ...m, [candidate.id]: { kind: "info", text: "Hunter email finder needs a named person. This is a generic email candidate." } }));
      return;
    }
    if (!hasDomain(candidate.companies?.website)) {
      setMsg((m) => ({ ...m, [candidate.id]: { kind: "info", text: "Add a company website/domain before using the email finder." } }));
      return;
    }
    setBusy((b) => ({ ...b, [candidate.id]: true }));
    setRunning((r) => ({ ...r, [candidate.id]: "Finding…" }));
    clearMsg(candidate.id);
    try {
      const r = await fetch("/api/hunter/find-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidate.id }),
      });
      const d = await r.json();
      if (d.ok) {
        const parts: string[] = [];
        if (d.email) parts.push(d.email);
        if (d.status) parts.push(verifyStatusLabel(d.status));
        if (typeof d.score === "number") parts.push(`confidence ${d.score}%`);
        setMsg((m) => ({ ...m, [candidate.id]: { kind: "ok", text: `Hunter: ${parts.join(" · ") || "lookup complete."}` } }));
        setTimeout(() => reload(), 500);
      } else {
        setMsg((m) => ({ ...m, [candidate.id]: { kind: "err", text: d.error ?? "Hunter email finder failed." } }));
      }
    } catch (e) {
      setMsg((m) => ({ ...m, [candidate.id]: { kind: "err", text: e instanceof Error ? e.message : "Network error calling Hunter." } }));
    } finally {
      setBusy((b) => ({ ...b, [candidate.id]: false }));
      setRunning((r) => { const n = { ...r }; delete n[candidate.id]; return n; });
    }
  }

  async function hunterVerifyEmail(candidate: Candidate) {
    if (!candidate.email) {
      setMsg((m) => ({ ...m, [candidate.id]: { kind: "err", text: "No email on this candidate to verify." } }));
      return;
    }
    setBusy((b) => ({ ...b, [candidate.id]: true }));
    setRunning((r) => ({ ...r, [candidate.id]: "Verifying…" }));
    clearMsg(candidate.id);
    try {
      const r = await fetch("/api/hunter/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidate.id }),
      });
      const d = await r.json();
      if (d.ok) {
        const label = verifyStatusLabel(d.status);
        const conf = typeof d.score === "number" ? ` · confidence ${d.score}%` : "";
        const kind = label === "valid" ? "ok" : label === "invalid" ? "err" : "info";
        setMsg((m) => ({ ...m, [candidate.id]: { kind, text: `Hunter: email is ${label}${conf}.` } }));
        setTimeout(() => reload(), 500);
      } else {
        setMsg((m) => ({ ...m, [candidate.id]: { kind: "err", text: d.error ?? "Hunter verification failed." } }));
      }
    } catch (e) {
      setMsg((m) => ({ ...m, [candidate.id]: { kind: "err", text: e instanceof Error ? e.message : "Network error calling Hunter." } }));
    } finally {
      setBusy((b) => ({ ...b, [candidate.id]: false }));
      setRunning((r) => { const n = { ...r }; delete n[candidate.id]; return n; });
    }
  }

  const filtered = rows.filter((r) => {
    if (filterCompany !== "all" && r.company_id !== filterCompany) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (r.name ?? "").toLowerCase().includes(q) ||
      (r.title ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.companies?.name ?? "").toLowerCase().includes(q) ||
      (r.source_excerpt ?? "").toLowerCase().includes(q)
    );
  });

  // Group by company
  const byCompany: Record<string, { name: string; items: Candidate[] }> = {};
  for (const c of filtered) {
    const cid = c.company_id ?? "unknown";
    const cname = c.companies?.name ?? "Unknown Company";
    if (!byCompany[cid]) byCompany[cid] = { name: cname, items: [] };
    byCompany[cid].items.push(c);
  }

  return (
    <div className="px-6 py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Contact Candidates</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{rows.length} awaiting review</p>
        </div>
        <button onClick={reload} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {!hunterConfigured && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Hunter API key not detected. Find/Verify will return the exact API error when clicked until <code className="text-amber-200">HUNTER_API_KEY</code> is set.</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates…"
          className="w-64 rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className={`w-56 ${INPUT}`}
        >
          <option value="all">All companies</option>
          {companies.map((co) => <option key={co.id} value={co.id}>{co.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 py-10"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : Object.keys(byCompany).length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
          <p className="text-sm text-zinc-500">No candidates to review.</p>
          <p className="text-xs text-zinc-600 mt-1">Run Research Company on a company with a website to discover contacts.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byCompany).map(([cid, group]) => (
            <div key={cid}>
              <h2 className="text-sm font-semibold text-zinc-300 mb-3">{group.name} <span className="text-zinc-600 font-normal">({group.items.length})</span></h2>
              <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/60">
                      {["Name / Title", "Contact", "Channel", "Score", "Source", ""].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
                    {group.items.map((c) => (
                      <tr key={c.id} className="group hover:bg-zinc-800/20 transition-colors">
                        <td className="px-4 py-3 max-w-[200px]">
                          {c.name
                            ? <p className="text-sm font-medium text-zinc-200 truncate">{c.name}</p>
                            : <p className="text-xs text-zinc-600 italic">No name</p>}
                          {c.title && <p className="text-xs text-zinc-500 truncate mt-0.5">{c.title}</p>}
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {c.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-zinc-600 shrink-0" />
                              <span className="text-xs text-zinc-400 truncate">{c.email}</span>
                              {c.email_status && (
                                <span className="text-xs text-zinc-600">({c.email_status})</span>
                              )}
                            </div>
                          )}
                          {c.linkedin_url && (
                            <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 mt-0.5 text-xs text-blue-400 hover:underline">
                              <Link2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">LinkedIn</span>
                            </a>
                          )}
                          {!c.email && !c.linkedin_url && c.source_url && (
                            <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
                              <Globe className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[140px]">{c.source_url.replace(/^https?:\/\//, "")}</span>
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {c.recommended_channel && (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${CHANNEL_BADGE[c.recommended_channel] ?? "bg-zinc-800 text-zinc-500 ring-zinc-700"}`}>
                              {CHANNEL_LABEL[c.recommended_channel] ?? c.recommended_channel}
                            </span>
                          )}
                          {c.recommended_action && (
                            <p className="text-xs text-zinc-600 mt-0.5">{ACTION_LABEL[c.recommended_action] ?? c.recommended_action}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold ${c.confidence_score >= 85 ? "text-emerald-400" : c.confidence_score >= 70 ? "text-amber-400" : "text-zinc-500"}`}>
                            {c.confidence_score}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[180px]">
                          {c.source_url && (
                            <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400">
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[140px]">{c.source_type ?? "source"}</span>
                            </a>
                          )}
                          {c.source_excerpt && (
                            <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{c.source_excerpt}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => promote(c.id)}
                              disabled={busy[c.id]}
                              title="Promote to Contact"
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 disabled:opacity-40 px-2 py-1 text-xs font-medium text-emerald-400 transition-colors"
                            >
                              {busy[c.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3" />}
                              Promote
                            </button>
                            <button
                              onClick={() => setAction(c.id, "create_email_draft")}
                              disabled={busy[c.id] || !c.email}
                              title="Create Email Draft"
                              className="inline-flex items-center gap-1 rounded-lg hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              Email Draft
                            </button>
                            <button
                              onClick={() => setAction(c.id, "create_linkedin_draft")}
                              disabled={busy[c.id]}
                              title="Create LinkedIn Draft"
                              className="inline-flex items-center gap-1 rounded-lg hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              LinkedIn Draft
                            </button>
                            <button
                              onClick={() => setAction(c.id, "create_contact_form_task")}
                              disabled={busy[c.id] || !c.source_url}
                              title="Create Contact Form Task"
                              className="inline-flex items-center gap-1 rounded-lg hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                              Form Task
                            </button>
                            {(() => {
                              const nm = splitName(c.name);
                              const hasName = !!nm.first && !!nm.last;
                              const findLabel = running[c.id]
                                ? running[c.id]
                                : !hasName
                                  ? "Finder unavailable: no person name"
                                  : "Find Email with Hunter";
                              return (
                                <button
                                  onClick={() => hunterFindEmail(c)}
                                  disabled={busy[c.id] || !hasName || !hasDomain(c.companies?.website) || c.confidence_score < 75}
                                  title={hasName ? "Find Email with Hunter" : "Hunter email finder needs a named person"}
                                  className="inline-flex items-center gap-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 disabled:opacity-40 px-2 py-1 text-xs font-medium text-sky-400 transition-colors"
                                >
                                  {running[c.id] === "Finding…" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
                                  {findLabel}
                                </button>
                              );
                            })()}
                            {(() => {
                              const isGeneric = !!c.email && (!c.name || (c.email_status ?? "").includes("generic"));
                              const verifyLabel = running[c.id]
                                ? running[c.id]
                                : isGeneric
                                  ? "Verify generic email"
                                  : "Verify Email with Hunter";
                              return (
                                <button
                                  onClick={() => hunterVerifyEmail(c)}
                                  disabled={busy[c.id] || !c.email || c.email_status === "verified"}
                                  title={c.email ? "Verify Email with Hunter" : "No email to verify"}
                                  className="inline-flex items-center gap-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 disabled:opacity-40 px-2 py-1 text-xs font-medium text-violet-400 transition-colors"
                                >
                                  {running[c.id] === "Verifying…" ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                  {verifyLabel}
                                </button>
                              );
                            })()}
                            <button
                              onClick={() => reject(c.id)}
                              disabled={busy[c.id]}
                              title="Skip / Reject"
                              className="inline-flex items-center gap-1 rounded-lg hover:bg-zinc-700 disabled:opacity-40 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              <X className="h-3 w-3" />
                              Skip
                            </button>
                          </div>
                          {msg[c.id] && (
                            <p
                              className={`mt-1.5 text-[11px] leading-snug text-right ${
                                msg[c.id].kind === "ok"
                                  ? "text-emerald-400"
                                  : msg[c.id].kind === "err"
                                    ? "text-red-400"
                                    : "text-amber-400"
                              }`}
                            >
                              {msg[c.id].kind === "err" && <AlertTriangle className="h-3 w-3 inline mr-1 -mt-0.5" />}
                              {msg[c.id].text}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
