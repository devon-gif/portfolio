"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, FlaskConical, Loader2, Users, Search, Briefcase, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Company } from "@/lib/types";
import Link from "next/link";

type CompanyRow = Company & { market?: "US" | "Canada" | "UK" | "UAE" | "Other" | null };

// Lead-type vocabulary (matches the 20260605b migration). Label + filter chip text.
const LEAD_TYPE_LABELS: Record<string, string> = {
  direct_buyer: "Direct Buyer",
  hiring_signal: "Hiring Signal",
  partner: "Partner",
  enterprise_router: "Enterprise Router",
  spa: "Spa / Wellness",
  restaurant_fnb: "F&B / Restaurant",
  wedding_events: "Wedding / Events",
  job_application: "Job Application",
  warm_linkedin: "Warm LinkedIn",
};

// Filter chips requested for the Opportunity OS view.
const LEAD_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hiring_signal", label: "Hiring Signals" },
  { key: "direct_buyer", label: "Direct Buyers" },
  { key: "partner", label: "Partners" },
  { key: "spa", label: "Spas" },
  { key: "restaurant_fnb", label: "F&B / Restaurants" },
  { key: "wedding_events", label: "Wedding / Events" },
  { key: "enterprise_router", label: "Enterprise Routers" },
  { key: "job_application", label: "Job Applications" },
];

function leadTypeLabel(v?: string | null): string {
  if (!v) return "—";
  return LEAD_TYPE_LABELS[v] ?? v;
}

const BLANK: Omit<CompanyRow, "id" | "created_at"> = {
  name: "",
  website: null,
  company_type: null,
  market: null,
  location: null,
  fit_score: null,
  status: null,
  notes: null,
  personalization_angle: null,
  specific_use_cases: null,
  specific_client_type: null,
};

// `companies.type` is NOT NULL with a strict enum; map the free-text form value
// onto a valid value (default "other") so inserts never fail the constraint.
const VALID_COMPANY_TYPES = new Set([
  "hotel_management_company",
  "hospitality_group",
  "boutique_hotel_group",
  "resort_group",
  "independent_lifestyle_hotel",
  "branded_hotel",
  "other",
]);
const VALID_MARKETS = new Set(["US", "Canada", "UK", "UAE", "Other"]);

// Pull a clean URL out of messy input:
//   "HVMG https://www.hvmg.com/"            -> "https://www.hvmg.com/"
//   "[www.hvmg.com](https://www.hvmg.com)"  -> "https://www.hvmg.com"
//   "hvmg.com"                              -> "https://hvmg.com"
function sanitizeWebsite(raw: string | null | undefined): string | null {
  const input = (raw ?? "").trim();
  if (!input) return null;

  let candidate = "";
  // Markdown link -> use the URL inside the parentheses.
  const md = input.match(/\]\(\s*(\S+?)\s*\)/);
  if (md) candidate = md[1];
  // An explicit http(s):// URL anywhere in the string.
  if (!candidate) {
    const http = input.match(/https?:\/\/\S+/i);
    if (http) candidate = http[0];
  }
  // A bare domain token like hvmg.com / www.hvmg.com (optionally with a path).
  if (!candidate) {
    const dom = input.match(/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i);
    if (dom) candidate = dom[0];
  }
  if (!candidate) return null;

  candidate = candidate.replace(/[)\].,;]+$/, ""); // strip trailing punctuation
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  try {
    const u = new URL(candidate);
    if (!u.hostname.includes(".")) return null;
    return candidate; // preserve the user's path / trailing slash as typed
  } catch {
    return null;
  }
}

// True when a Supabase error is just a missing/unknown column, so we can retry
// with a minimal known-safe payload instead of crashing.
function isMissingColumnError(err: { code?: string; message?: string } | null | undefined): boolean {
  if (!err) return false;
  if (err.code === "PGRST204") return true;
  const m = (err.message ?? "").toLowerCase();
  return (
    m.includes("does not exist") ||
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("unknown column")
  );
}

// Build an insert/update payload that includes ONLY columns the live schema
// actually has. `name` is the single field we assume exists; everything else
// (including `type`, `website`, `notes`) is gated behind `knownColumns`, which
// comes from a loaded company row (Object.keys). When `knownColumns` is null
// (empty table) we send only { name } — nothing else is assumed.
function buildCompanyPayload(
  form: Omit<CompanyRow, "id" | "created_at">,
  knownColumns: Set<string> | null
): Record<string, unknown> {
  const payload: Record<string, unknown> = { name: (form.name ?? "").trim() };
  if (!knownColumns) return payload; // safest possible insert: { name }

  const has = (col: string) => knownColumns.has(col);

  if (has("website")) payload.website = sanitizeWebsite(form.website);
  // `notes` may be NOT NULL DEFAULT '' — only set it when the user typed something.
  if (has("notes") && (form.notes ?? "").trim()) payload.notes = form.notes;
  // `type` is an enum when present; map free-text → valid value (default "other").
  if (has("type")) payload.type = VALID_COMPANY_TYPES.has(String(form.company_type ?? "")) ? form.company_type : "other";

  if (has("company_type") && form.company_type) payload.company_type = form.company_type;
  if (has("market")) {
    const m = VALID_MARKETS.has(String(form.market ?? "")) ? form.market : null;
    if (m) payload.market = m;
  }
  if (has("location") && form.location) payload.location = form.location;
  if (has("fit_score") && form.fit_score != null) payload.fit_score = form.fit_score;
  if (has("status") && form.status) payload.status = form.status;
  if (has("personalization_angle") && form.personalization_angle) payload.personalization_angle = form.personalization_angle;
  if (has("specific_use_cases") && form.specific_use_cases) payload.specific_use_cases = form.specific_use_cases;
  if (has("specific_client_type") && form.specific_client_type) payload.specific_client_type = form.specific_client_type;

  return payload;
}

function suggestMarket(input: { website?: string | null; location?: string | null }): "US" | "Canada" | "UK" | "UAE" | "Other" {
  const text = `${input.website ?? ""} ${input.location ?? ""}`.toLowerCase();
  if (/\b(uk|united kingdom|london|manchester|\.co\.uk)\b/.test(text)) return "UK";
  if (/\b(canada|toronto|vancouver|montreal|\.ca)\b/.test(text)) return "Canada";
  if (/\b(uae|dubai|abu dhabi|emirates|\.ae)\b/.test(text)) return "UAE";
  if (/\b(us|usa|united states|new york|chicago|miami|\.com)\b/.test(text)) return "US";
  return "Other";
}

const PERSONALIZATION: [string, "personalization_angle" | "specific_use_cases" | "specific_client_type", string][] = [
  ["Personalization angle", "personalization_angle", "Why now / what's relevant to this company"],
  ["Specific use cases", "specific_use_cases", "e.g. social content, paid campaigns, brand creative"],
  ["Specific client type", "specific_client_type", "e.g. boutique hotel groups"],
];

export default function CompaniesPage() {
  const [rows, setRows] = useState<CompanyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Omit<CompanyRow, "id" | "created_at">>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageMsg, setPageMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  // Research state per company
  const [researching, setResearching] = useState<Record<string, boolean>>({});
  const [huntering, setHuntering] = useState<Record<string, boolean>>({});
  const [researchMsg, setResearchMsg] = useState<Record<string, string>>({});
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>({});
  const [contactCounts, setContactCounts] = useState<Record<string, number>>({});
  const [hunterConfigured, setHunterConfigured] = useState(false);
  function reload() { setTick(t => t + 1); }

  useEffect(() => {
    supabase.from("companies").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as CompanyRow[]) ?? []);
        setLoading(false);
      });
  }, [tick]);

  // Load candidate counts for all companies
  useEffect(() => {
    fetch("/api/research/diagnostics")
      .then((r) => r.json())
      .then((d) => setHunterConfigured(!!d?.hunter))
      .catch(() => setHunterConfigured(false));
  }, []);

  useEffect(() => {
    supabase
      .from("contact_candidates")
      .select("company_id")
      .eq("status", "needs_review")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        for (const row of (data ?? [])) {
          if (row.company_id) counts[row.company_id] = (counts[row.company_id] ?? 0) + 1;
        }
        setCandidateCounts(counts);
      });
  }, [tick]);

  // Promoted-contact counts per company
  useEffect(() => {
    supabase
      .from("contacts")
      .select("company_id")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        for (const row of (data ?? [])) {
          if (row.company_id) counts[row.company_id] = (counts[row.company_id] ?? 0) + 1;
        }
        setContactCounts(counts);
      });
  }, [tick]);

  async function runResearch(company: Company) {
    if (!company.website) {
      setResearchMsg((m) => ({ ...m, [company.id]: "No website URL set." }));
      return;
    }
    setResearching((r) => ({ ...r, [company.id]: true }));
    setResearchMsg((m) => ({ ...m, [company.id]: "Researching with Firecrawl… (may take 20–40s)" }));
    try {
      const res = await fetch("/api/research-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: company.id }),
      });
      const d = await res.json();
      if (d.ok) {
        const count = Number(d.candidates_created ?? 0);
        setResearchMsg((m) => ({
          ...m,
          [company.id]: `Research complete. Created ${count} candidate${count === 1 ? "" : "s"}.`,
        }));
        reload();
      } else {
        setResearchMsg((m) => ({ ...m, [company.id]: d.error ?? "Error" }));
      }
    } catch (e) {
      setResearchMsg((m) => ({ ...m, [company.id]: e instanceof Error ? e.message : "Network error" }));
    } finally {
      setResearching((r) => ({ ...r, [company.id]: false }));
    }
  }

  async function hunterDomainSearch(company: Company) {
    if (!company.website) {
      setResearchMsg((m) => ({ ...m, [company.id]: "No website URL set." }));
      return;
    }
    if (!hunterConfigured) {
      setResearchMsg((m) => ({ ...m, [company.id]: "Hunter not configured." }));
      return;
    }
    setHuntering((h) => ({ ...h, [company.id]: true }));
    setResearchMsg((m) => ({ ...m, [company.id]: "Hunter domain search…" }));
    try {
      const res = await fetch("/api/hunter/domain-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: company.id }),
      });
      const d = await res.json();
      if (d.ok) {
        setResearchMsg((m) => ({ ...m, [company.id]: `Hunter added ${d.inserted} candidate(s)` }));
        reload();
      } else {
        setResearchMsg((m) => ({ ...m, [company.id]: d.error ?? "Hunter error" }));
      }
    } catch (e) {
      setResearchMsg((m) => ({ ...m, [company.id]: e instanceof Error ? e.message : "Network error" }));
    } finally {
      setHuntering((h) => ({ ...h, [company.id]: false }));
    }
  }

  function openAdd() {
    setEditId(null);
    setForm(BLANK);
    setFormError(null);
    setPageMsg(null);
    setOpen(true);
  }

  function openEdit(c: CompanyRow) {
    setEditId(c.id);
    setForm({ name: c.name, website: c.website, company_type: c.company_type, market: c.market ?? null, location: c.location, fit_score: c.fit_score, status: c.status, notes: c.notes, personalization_angle: c.personalization_angle, specific_use_cases: c.specific_use_cases, specific_client_type: c.specific_client_type });
    setFormError(null);
    setPageMsg(null);
    setOpen(true);
  }

  async function save() {
    if (saving) return; // guard against double-submit
    setFormError(null);

    const name = form.name.trim();
    if (!name) {
      setFormError("Company name is required.");
      return;
    }

    const website = sanitizeWebsite(form.website);
    if ((form.website ?? "").trim() && !website) {
      setFormError("That website doesn't look like a valid URL. Try something like https://example.com");
      return;
    }

    setSaving(true);
    try {
      // Only send columns the live schema actually has. Derive the column set
      // from a loaded company row; when the table is empty, knownColumns is null
      // and we assume ONLY `name`.
      const knownColumns = rows.length > 0 ? new Set(Object.keys(rows[0])) : null;
      const hasCol = (col: string) => (knownColumns ? knownColumns.has(col) : false);

      // Avoid duplicate inserts — only query columns that actually exist.
      if (!editId) {
        let exists = false;
        if (website && hasCol("website")) {
          const r = await supabase.from("companies").select("id").eq("website", website).limit(1);
          exists = !!(r.data && r.data.length);
        }
        if (!exists && (knownColumns === null || hasCol("name"))) {
          const r = await supabase.from("companies").select("id").ilike("name", name).limit(1);
          exists = !!(r.data && r.data.length);
        }
        if (exists) {
          setFormError("Company already exists.");
          setSaving(false);
          return;
        }
      }

      const payload = buildCompanyPayload(form, knownColumns);

      let error: { code?: string; message?: string } | null = null;
      if (editId) {
        ({ error } = await supabase.from("companies").update(payload).eq("id", editId));
        if (isMissingColumnError(error)) {
          ({ error } = await supabase.from("companies").update({ name }).eq("id", editId));
        }
      } else {
        ({ error } = await supabase.from("companies").insert(payload));
        // If a column is unknown to the live schema, retry with just { name }.
        if (isMissingColumnError(error)) {
          ({ error } = await supabase.from("companies").insert({ name }));
        }
        // If the table requires a website (NOT NULL) and { name } wasn't enough,
        // retry once with { name, website } — still never assuming `type`.
        if (error && website && /website/i.test(error.message ?? "") && /null|required|violates/i.test(error.message ?? "")) {
          ({ error } = await supabase.from("companies").insert({ name, website }));
        }
      }

      if (error) {
        setFormError(error.message || "Could not save the company.");
        return;
      }

      setPageMsg(editId ? "Company updated." : "Company added.");
      setOpen(false);
      setForm(BLANK);
      setEditId(null);
      reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Something went wrong saving the company.");
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!deleteId) return;
    await supabase.from("companies").delete().eq("id", deleteId);
    setDeleteId(null);
    reload();
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) => {
      if (leadFilter !== "all" && (r.lead_type ?? "") !== leadFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.company_type ?? "").toLowerCase().includes(q) ||
        (r.location ?? "").toLowerCase().includes(q) ||
        leadTypeLabel(r.lead_type).toLowerCase().includes(q) ||
        (r.opportunity_trigger ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, leadFilter]);

  const leadCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) if (r.lead_type) c[r.lead_type] = (c[r.lead_type] ?? 0) + 1;
    return c;
  }, [rows]);

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Companies</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{rows.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/candidates" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            <Users className="h-4 w-4" /> Candidates
          </Link>
          <Link href="/intake" className="inline-flex items-center gap-1.5 rounded-lg border border-amber-600/40 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-sm text-amber-300 transition-colors">
            <Briefcase className="h-4 w-4" /> Add Hiring Signal
          </Link>
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors">
            <Plus className="h-4 w-4" />Add Company
          </button>
        </div>
      </div>

      {pageMsg && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          <span>{pageMsg}</span>
          <button onClick={() => setPageMsg(null)} className="text-emerald-400/70 hover:text-emerald-300">✕</button>
        </div>
      )}

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search companies…"
        className="mb-4 w-72 rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50"
      />

      {/* Lead-type filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {LEAD_FILTERS.map((f) => {
          const count = f.key === "all" ? rows.length : (leadCounts[f.key] ?? 0);
          const active = leadFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setLeadFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${
                active
                  ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                  : "bg-zinc-900 text-zinc-400 ring-zinc-800 hover:text-zinc-200"
              }`}
            >
              {f.label}
              <span className="ml-1.5 tabular-nums text-zinc-600">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {["Company", "Opportunity", "Type", "Market", "Fit", "Status", "Research", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 bg-zinc-900">
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-600">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-600">No companies found.</td></tr>
            ) : filtered.map(c => {
              const expanded = expandedId === c.id;
              const hasOppDetail = !!(c.opportunity_trigger || c.trigger_summary || c.recommended_approach || c.recommended_next_action || c.hiring_role_title);
              return (
              <Fragment key={c.id}>
              <tr className="group hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => setExpandedId(expanded ? null : c.id)}
                      className="mt-0.5 text-zinc-600 hover:text-zinc-300 shrink-0"
                      aria-label={expanded ? "Collapse" : "Expand"}
                    >
                      {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                      {c.website && (
                        <a href={c.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 mt-0.5">
                          {c.website.replace(/^https?:\/\//, "")} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      {c.location && <p className="text-xs text-zinc-600 mt-0.5">{c.location}</p>}
                    </div>
                  </div>
                </td>
                {/* Opportunity column */}
                <td className="px-4 py-3">
                  {c.lead_type ? (
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-medium bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20 px-2 py-0.5 rounded-full">{leadTypeLabel(c.lead_type)}</span>
                      <span className="text-xs text-zinc-500">
                        {(c.opportunity_status ?? "—").replace(/_/g, " ")}
                        {c.priority_score != null ? ` · P${c.priority_score}` : ""}
                      </span>
                    </div>
                  ) : <span className="text-zinc-600 text-sm">—</span>}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400">{c.company_type ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-zinc-400">{c.market ?? "—"}</td>
                <td className="px-4 py-3">
                  {c.fit_score != null ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-inset ${c.fit_score >= 7 ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : c.fit_score >= 4 ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" : "bg-zinc-800 text-zinc-500 ring-zinc-700"}`}>
                      {c.fit_score}
                    </span>
                  ) : <span className="text-zinc-600">—</span>}
                </td>
                <td className="px-4 py-3">
                  {c.status ? <span className="text-xs capitalize bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{c.status}</span> : <span className="text-zinc-600 text-sm">—</span>}
                </td>
                {/* Research column */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => runResearch(c)}
                      disabled={researching[c.id] || !c.website}
                      className="inline-flex items-center gap-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 disabled:opacity-40 px-2 py-1 text-xs font-medium text-violet-400 transition-colors"
                    >
                      {researching[c.id]
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <FlaskConical className="h-3 w-3" />}
                      Research Company
                    </button>
                    <button
                      onClick={() => hunterDomainSearch(c)}
                      disabled={huntering[c.id] || !hunterConfigured || !c.website}
                      className="inline-flex items-center gap-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/40 disabled:opacity-40 px-2 py-1 text-xs font-medium text-sky-400 transition-colors"
                    >
                      {huntering[c.id]
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Search className="h-3 w-3" />}
                      Search Domain with Hunter
                    </button>
                    {researchMsg[c.id] && (
                      <p className="text-xs text-zinc-500 max-w-[130px] truncate">{researchMsg[c.id]}</p>
                    )}
                    {(candidateCounts[c.id] ?? 0) > 0 && (
                      <Link href="/candidates" className="text-xs text-emerald-400 hover:underline">
                        {candidateCounts[c.id]} candidate{candidateCounts[c.id] === 1 ? "" : "s"}
                      </Link>
                    )}
                    {(contactCounts[c.id] ?? 0) > 0 && (
                      <Link href="/contacts" className="text-xs text-sky-400 hover:underline">
                        {contactCounts[c.id]} contact{contactCounts[c.id] === 1 ? "" : "s"}
                      </Link>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-zinc-600 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="rounded-lg p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
              {expanded && (
                <tr className="bg-zinc-950/40">
                  <td colSpan={8} className="px-4 py-4">
                    {hasOppDetail ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                        <Detail label="Opportunity trigger" value={c.opportunity_trigger} />
                        <Detail label="Trigger summary" value={c.trigger_summary} />
                        <Detail label="Recommended approach" value={c.recommended_approach} />
                        <Detail label="Recommended next action" value={c.recommended_next_action} />
                        {c.hiring_role_title && <Detail label="Hiring role" value={c.hiring_role_title} />}
                        {c.hiring_platform && <Detail label="Platform" value={c.hiring_platform} />}
                        {c.hiring_job_url && (
                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-zinc-600 mb-0.5">Job posting</p>
                            <a href={c.hiring_job_url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline break-all">{c.hiring_job_url}</a>
                          </div>
                        )}
                        {c.examples_to_send && <Detail label="Examples to send" value={c.examples_to_send} />}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600">No opportunity signal recorded for this company yet.</p>
                    )}
                  </td>
                </tr>
              )}
              </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-zinc-100">{editId ? "Edit Company" : "Add Company"}</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {([
                ["Company Name *", "name", "text"],
                ["Website", "website", "url"],
                ["Company Type", "company_type", "text"],
                ["Market", "market", "text"],
                ["Location", "location", "text"],
                ["Status", "status", "text"],
              ] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(form[key] as string) ?? ""}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value || null }))}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50"
                  />
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, market: suggestMarket({ website: f.website, location: f.location }) }))}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-500"
                >
                  Auto-suggest market
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Fit Score (1–10)</label>
                <input
                  type="number" min={1} max={10}
                  value={form.fit_score ?? ""}
                  onChange={e => setForm(f => ({ ...f, fit_score: e.target.value ? parseInt(e.target.value) : null }))}
                  className="w-24 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Notes</label>
                <textarea
                  rows={4}
                  value={form.notes ?? ""}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50 resize-none"
                />
              </div>

              {/* Personalization (used when generating outreach drafts) */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">Personalization</p>
                <div className="space-y-4">
                  {PERSONALIZATION.map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}</label>
                      <textarea
                        rows={2}
                        placeholder={placeholder}
                        value={(form[key] as string) ?? ""}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value || null }))}
                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {formError && (
              <div className="mx-6 mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {formError}
              </div>
            )}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800">
              <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white transition-colors">
                {saving ? (editId ? "Saving…" : "Adding…") : editId ? "Save Changes" : "Add Company"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Delete company?</h3>
            <p className="text-sm text-zinc-500 mb-5">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition-colors">Cancel</button>
              <button onClick={del} className="rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-zinc-600 mb-0.5">{label}</p>
      <p className="text-zinc-300 whitespace-pre-wrap break-words">{value && value.trim() ? value : "—"}</p>
    </div>
  );
}
