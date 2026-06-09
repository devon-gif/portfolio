"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldQuestion,
  UserPlus,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Candidate = {
  id: string;
  company_id: string | null;
  name: string | null;
  title: string | null;
  email: string | null;
  email_status: string | null;
  linkedin_url: string | null;
  source_url: string | null;
  source_type: string | null;
  source_excerpt: string | null;
  confidence_score: number | null;
  recommended_channel: string | null;
  recommended_action: string | null;
  status: string | null;
  notes?: string | null;
  companies?: { name?: string | null } | null;
};

type FilterKey =
  | "needs_review"
  | "verify_with_hunter"
  | "create_email_draft"
  | "create_linkedin_draft"
  | "contact_form_task"
  | "skipped"
  | "promoted";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "needs_review", label: "Needs review" },
  { key: "verify_with_hunter", label: "Verify with Hunter" },
  { key: "create_email_draft", label: "Email draft" },
  { key: "create_linkedin_draft", label: "LinkedIn draft" },
  { key: "contact_form_task", label: "Contact form task" },
  { key: "skipped", label: "Skipped" },
  { key: "promoted", label: "Promoted" },
];

const CONTACT_COLUMNS = [
  "first_name",
  "last_name",
  "title",
  "company_id",
  "status",
  "email",
  "phone",
  "linkedin_url",
  "notes",
  "source",
  "type",
  "company_name",
  "company_type",
  "score",
] as const;

const BADGE =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset";
const INPUT =
  "rounded-lg bg-zinc-800/60 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

function splitName(name: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "Unknown", last_name: "Contact" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "Contact" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function candidateMatchesFilter(candidate: Candidate, filter: FilterKey) {
  const action = candidate.recommended_action ?? "";
  const status = candidate.status ?? "";
  if (filter === "needs_review") return status === "needs_review";
  if (filter === "verify_with_hunter") return action === "verify_with_hunter";
  if (filter === "create_email_draft") return action === "create_email_draft" || action === "email_draft";
  if (filter === "create_linkedin_draft") return action === "create_linkedin_draft" || action === "linkedin_draft";
  if (filter === "contact_form_task") {
    return action === "create_contact_form_task" || action === "contact_form_task";
  }
  if (filter === "skipped") return status === "rejected" || status === "skipped" || action === "skip";
  return status === "promoted";
}

function statusClass(status: string | null) {
  if (status === "promoted") return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
  if (status === "rejected" || status === "skipped") return "bg-red-500/10 text-red-400 ring-red-500/20";
  return "bg-zinc-800 text-zinc-400 ring-zinc-700";
}

function actionLabel(action: string | null) {
  return (action ?? "manual_review").replace(/^create_/, "").replace(/_/g, " ");
}

function linkLabel(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ContactCandidatesPage() {
  const [rows, setRows] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string; website?: string | null }[]>([]);
  const [hunterConfigured, setHunterConfigured] = useState(false);
  const [companyFilter, setCompanyFilter] = useState("all");
  const [filter, setFilter] = useState<FilterKey>("needs_review");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [contactColumns, setContactColumns] = useState<Set<string> | null>(null);
  const [candidateHasPromotedAt, setCandidateHasPromotedAt] = useState(false);
  const [tick, setTick] = useState(0);

  function reload() {
    setTick((value) => value + 1);
  }

  useEffect(() => {
    let alive = true;
    setLoading(true);
    supabase
      .from("contact_candidates")
      .select(
        "id, company_id, name, title, email, email_status, linkedin_url, source_url, source_type, source_excerpt, confidence_score, recommended_channel, recommended_action, status, notes, companies(name)",
      )
      .order("confidence_score", { ascending: false })
      .limit(500)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setMessage(error.message);
        setRows((data as Candidate[]) ?? []);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name, website")
      .order("name", { ascending: true })
      .then(({ data }) => setCompanies((data as { id: string; name: string; website?: string | null }[]) ?? []));
  }, []);

  // Whether HUNTER_API_KEY is configured server-side (booleans only, no key value).
  useEffect(() => {
    let alive = true;
    fetch("/api/research/diagnostics")
      .then((r) => r.json())
      .then((d) => { if (alive) setHunterConfigured(!!d?.hunter); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const websiteByCompany = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of companies) if (c.website) map.set(c.id, c.website);
    return map;
  }, [companies]);

  // Manual Hunter enrichment. Never runs automatically — only on click, with a
  // credit warning confirmation.
  async function findEmailWithHunter(candidate: Candidate) {
    if (typeof window !== "undefined" && !window.confirm("This may use a Hunter credit. Continue?")) return;
    setBusy((current) => ({ ...current, [candidate.id]: true }));
    setMessage(null);
    try {
      const res = await fetch("/api/hunter/find-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidate.id }),
      });
      const json = await res.json();
      if (!json.ok) {
        setMessage(json.error ?? "Hunter lookup failed.");
        return;
      }
      setMessage(
        json.email
          ? `Hunter found ${json.email} — status “${json.email_status}”, action “${json.recommended_action}”.`
          : `Hunter returned no email. Marked “${json.recommended_action}”.`,
      );
      reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Hunter lookup failed.");
    } finally {
      setBusy((current) => ({ ...current, [candidate.id]: false }));
    }
  }

  async function getContactColumns() {
    if (contactColumns) return contactColumns;
    const existing = new Set<string>();
    for (const column of CONTACT_COLUMNS) {
      const { error } = await supabase.from("contacts").select(column).limit(0);
      if (!error) existing.add(column);
    }
    setContactColumns(existing);
    return existing;
  }

  async function getCandidateHasPromotedAt() {
    if (candidateHasPromotedAt) return true;
    const { error } = await supabase.from("contact_candidates").select("promoted_at").limit(0);
    const exists = !error;
    setCandidateHasPromotedAt(exists);
    return exists;
  }

  async function updateCandidate(id: string, payload: Record<string, string | null>) {
    setBusy((current) => ({ ...current, [id]: true }));
    setMessage(null);
    const { error } = await supabase.from("contact_candidates").update(payload).eq("id", id);
    setBusy((current) => ({ ...current, [id]: false }));
    if (error) {
      setMessage(error.message);
      return;
    }
    reload();
  }

  async function promote(candidate: Candidate) {
    setBusy((current) => ({ ...current, [candidate.id]: true }));
    setMessage(null);

    const columns = await getContactColumns();
    const names = splitName(candidate.name);
    const notes = [
      "Promoted from Firecrawl contact candidate.",
      candidate.source_type ? `Source type: ${candidate.source_type}` : null,
      candidate.source_url ? `Source URL: ${candidate.source_url}` : null,
      candidate.source_excerpt ? `Excerpt: ${candidate.source_excerpt}` : null,
      candidate.notes ? `Candidate notes: ${candidate.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const fullPayload: Record<string, string | number | null> = {
      first_name: names.first_name,
      last_name: names.last_name,
      title: candidate.title,
      company_id: candidate.company_id,
      status: "new",
      email: candidate.email,
      phone: null,
      linkedin_url: candidate.linkedin_url,
      notes,
      source: "website",
      type: "unknown",
      company_name: candidate.companies?.name ?? "",
      company_type: "other",
      score: candidate.confidence_score ?? 0,
    };

    const payload = Object.fromEntries(Object.entries(fullPayload).filter(([key]) => columns.has(key)));
    const { error: insertError } = await supabase.from("contacts").insert(payload);
    if (insertError) {
      setMessage(insertError.message);
      setBusy((current) => ({ ...current, [candidate.id]: false }));
      return;
    }

    const update: Record<string, string | null> = { status: "promoted" };
    if (await getCandidateHasPromotedAt()) update.promoted_at = new Date().toISOString();

    const { error: updateError } = await supabase.from("contact_candidates").update(update).eq("id", candidate.id);
    setBusy((current) => ({ ...current, [candidate.id]: false }));
    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setMessage("Candidate promoted to contact.");
    reload();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((candidate) => {
      if (companyFilter !== "all" && candidate.company_id !== companyFilter) return false;
      if (!candidateMatchesFilter(candidate, filter)) return false;
      if (!q) return true;
      return [
        candidate.companies?.name,
        candidate.name,
        candidate.title,
        candidate.email,
        candidate.email_status,
        candidate.linkedin_url,
        candidate.source_url,
        candidate.source_type,
        candidate.source_excerpt,
        candidate.recommended_action,
        candidate.recommended_channel,
        candidate.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [companyFilter, filter, rows, search]);

  const grouped = useMemo(() => {
    const groups = new Map<string, { name: string; items: Candidate[] }>();
    for (const candidate of filtered) {
      const key = candidate.company_id ?? "unknown";
      const name = candidate.companies?.name ?? "Unknown company";
      const group = groups.get(key) ?? { name, items: [] };
      group.items.push(candidate);
      groups.set(key, group);
    }
    return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered]);

  return (
    <div className="px-6 py-6 max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Contact Candidates</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{filtered.length} shown from {rows.length} candidates</p>
        </div>
        <button
          onClick={reload}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-600" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search candidates"
            className={`${INPUT} w-full pl-9`}
          />
        </div>
        <select value={companyFilter} onChange={(event) => setCompanyFilter(event.target.value)} className={`${INPUT} w-full lg:w-64`}>
          <option value="all">All companies</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-inset ${
                filter === item.key
                  ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                  : "bg-zinc-900 text-zinc-500 ring-zinc-800 hover:text-zinc-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading candidates...
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-10 text-center text-sm text-zinc-500">
          No candidates match this view.
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <section key={group.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-200">{group.name}</h2>
                <span className="text-xs text-zinc-600">{group.items.length} candidate{group.items.length === 1 ? "" : "s"}</span>
              </div>
              <div className="space-y-2">
                {group.items.map((candidate) => (
                  <article key={candidate.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-zinc-100">{candidate.name ?? "Unnamed candidate"}</h3>
                          <span className={`${BADGE} ${statusClass(candidate.status ?? null)}`}>
                            {(candidate.status ?? "unknown").replace(/_/g, " ")}
                          </span>
                          <span className={`${BADGE} bg-zinc-800 text-zinc-400 ring-zinc-700`}>
                            score {candidate.confidence_score ?? 0}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400">{candidate.title ?? "No title"}</p>
                        <div className="mt-3 grid gap-2 text-xs text-zinc-500 md:grid-cols-2 xl:grid-cols-3">
                          <Field label="Company" value={candidate.companies?.name ?? "Unknown company"} />
                          <Field label="Email" value={candidate.email ?? "-"} />
                          <Field label="Email status" value={candidate.email_status ?? "-"} />
                          <Field label="Recommended channel" value={candidate.recommended_channel ?? "-"} />
                          <Field label="Recommended action" value={actionLabel(candidate.recommended_action)} />
                          <Field label="Source type" value={candidate.source_type ?? "-"} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                          {candidate.linkedin_url && <ExternalUrl label="LinkedIn" url={candidate.linkedin_url} />}
                          {candidate.source_url && <ExternalUrl label="Source" url={candidate.source_url} />}
                        </div>
                        {candidate.source_excerpt && (
                          <p className="mt-3 line-clamp-3 rounded-lg bg-zinc-950/60 px-3 py-2 text-xs leading-5 text-zinc-500">
                            {candidate.source_excerpt}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 xl:w-56 xl:justify-end">
                        {(() => {
                          const hasFullName =
                            (candidate.name ?? "").trim().split(/\s+/).filter(Boolean).length >= 2;
                          const hasWebsite = !!(candidate.company_id && websiteByCompany.has(candidate.company_id));
                          const meetsConfidence = (candidate.confidence_score ?? 0) >= 75;
                          const hunterEligible =
                            hunterConfigured &&
                            meetsConfidence &&
                            hasFullName &&
                            hasWebsite &&
                            candidate.status !== "promoted";
                          const why = !hunterConfigured
                            ? "HUNTER_API_KEY is not configured."
                            : !meetsConfidence
                              ? "Confidence must be ≥ 75."
                              : !hasFullName
                                ? "Candidate needs a first and last name."
                                : !hasWebsite
                                  ? "Company has no website/domain."
                                  : "Uses Hunter Email Finder + Verifier. This may use a Hunter credit.";
                          return (
                            <ActionButton
                              disabled={!!busy[candidate.id] || !hunterEligible}
                              onClick={() => findEmailWithHunter(candidate)}
                              label="Find Email with Hunter"
                              icon={<Mail className="h-3.5 w-3.5" />}
                              tone="emerald"
                              title={why}
                            />
                          );
                        })()}
                        <ActionButton
                          disabled={!!busy[candidate.id] || candidate.status === "promoted"}
                          onClick={() => promote(candidate)}
                          label="Promote to Contact"
                          icon={<UserPlus className="h-3.5 w-3.5" />}
                          tone="emerald"
                        />
                        <ActionButton
                          disabled={!!busy[candidate.id] || candidate.status === "promoted"}
                          onClick={() => updateCandidate(candidate.id, { status: "rejected", recommended_action: "skip" })}
                          label="Skip"
                          icon={<X className="h-3.5 w-3.5" />}
                        />
                        <ActionButton
                          disabled={!!busy[candidate.id] || candidate.status === "promoted"}
                          onClick={() => updateCandidate(candidate.id, { recommended_action: "verify_with_hunter", email_status: "needs_email", status: "needs_review" })}
                          label="Mark Needs Hunter"
                          icon={<ShieldQuestion className="h-3.5 w-3.5" />}
                        />
                        <ActionButton
                          disabled={!!busy[candidate.id] || candidate.status === "promoted"}
                          onClick={() => updateCandidate(candidate.id, { recommended_action: "manual_review", email_status: "needs_manual_review", status: "needs_review" })}
                          label="Mark Manual Review"
                          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-zinc-600">{label}</div>
      <div className="truncate text-zinc-300">{value}</div>
    </div>
  );
}

function ExternalUrl({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 text-emerald-400 hover:text-emerald-300">
      <span className="shrink-0">{label}:</span>
      <span className="truncate">{linkLabel(url)}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

function ActionButton({
  disabled,
  icon,
  label,
  onClick,
  tone = "zinc",
  title,
}: {
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "emerald" | "zinc";
  title?: string;
}) {
  const classes =
    tone === "emerald"
      ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}
    >
      {icon}
      {label}
    </button>
  );
}
