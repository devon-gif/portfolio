"use client";
/* eslint-disable react-hooks/set-state-in-effect -- same data-loading pattern as /contacts */

// Client Onboarding — proposal accepted → active client pipeline.
// Agreements, Stripe billing links, intake, kickoff checklist.
// All client messages are manual copy/paste. Nothing auto-sends.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Clipboard, ClipboardCheck,
  CreditCard, FolderTree, Loader2, Plus, RefreshCw, UserPlus,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { AgreementGenerator } from "@/components/AgreementGenerator";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  BILLING_STATUSES, FOLDER_STRUCTURE, INTAKE_FORM_TEXT, KICKOFF_CHECKLIST,
  ONBOARDING_MESSAGES, PACKAGES, STAGES, canActivate, nextAction, renewalPrompt,
  type RecordLike,
} from "@/lib/onboarding";

type OnboardingRecord = RecordLike & {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  package_name: string | null;
  monthly_fee: number | null;
  setup_fee: number | null;
  property_count: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_latest_invoice_id: string | null;
  payment_link_sent_at: string | null;
  intake_sent_at: string | null;
  kickoff_completed_at: string | null;
  notes: string | null;
  created_at: string;
};

type Task = { id: string; title: string; status: "pending" | "done" | "skipped"; sort_order: number };

const INPUT = "w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600/50";

const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label]));
const STAGE_CLS: Record<string, string> = {
  active_client: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  first_payment_completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  renewal_expansion: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
};
const BILLING_CLS: Record<string, string> = {
  subscription_active: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  paid: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  past_due: "bg-red-500/10 text-red-400 ring-red-500/20",
  failed: "bg-red-500/10 text-red-400 ring-red-500/20",
  canceled: "bg-red-500/10 text-red-400 ring-red-500/20",
};

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
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
      {done ? "Copied" : label}
    </button>
  );
}

export default function ClientOnboardingPage() {
  const [records, setRecords] = useState<OnboardingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stageFilter, setStageFilter] = useState("all");
  const [billingFilter, setBillingFilter] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    company_name: "", contact_name: "", contact_email: "",
    package_name: PACKAGES[3].name as string, agreement_type: "pilot",
    monthly_fee: String(PACKAGES[3].fee), setup_fee: "", property_count: "5",
    start_date: "", term_months: "1",
  });
  const [priceIds, setPriceIds] = useState<Record<string, string>>({});
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) { setNote("Supabase isn't configured."); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("client_onboarding_records").select("*").order("created_at", { ascending: false });
    if (error) {
      setNote(error.message.includes("client_onboarding")
        ? "Onboarding tables missing — run supabase/migrations/20260614_client_onboarding.sql first."
        : error.message);
    } else {
      setRecords((data ?? []) as OnboardingRecord[]);
      setNote(null);
    }
    const { data: settings } = await supabase.from("app_settings").select("*").limit(1).single();
    if (settings) {
      setSettingsId((settings as { id?: string }).id ?? null);
      const ids: Record<string, string> = {};
      for (const p of PACKAGES) ids[p.priceKey] = ((settings as Record<string, unknown>)[p.priceKey] as string) ?? "";
      ids.stripe_price_setup_fee = ((settings as Record<string, unknown>).stripe_price_setup_fee as string) ?? "";
      setPriceIds(ids);
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Load checklist tasks for the expanded record
  useEffect(() => {
    if (!expandedId) { setTasks([]); return; }
    void supabase
      .from("client_onboarding_tasks").select("id, title, status, sort_order")
      .eq("onboarding_record_id", expandedId).order("sort_order")
      .then(({ data }) => setTasks((data ?? []) as Task[]));
  }, [expandedId]);

  const filtered = useMemo(() => records.filter((r) =>
    (stageFilter === "all" || r.stage === stageFilter) &&
    (billingFilter === "all" || r.billing_status === billingFilter)
  ), [records, stageFilter, billingFilter]);

  // ── Actions ────────────────────────────────────────────────────────────────
  async function createRecord() {
    if (!newForm.company_name.trim()) { setNote("Company name is required."); return; }
    setBusy("new");
    const { data, error } = await supabase.from("client_onboarding_records").insert({
      ...newForm,
      monthly_fee: Number(newForm.monthly_fee) || null,
      setup_fee: Number(newForm.setup_fee) || null,
      property_count: Number(newForm.property_count) || null,
      term_months: Number(newForm.term_months) || null,
      start_date: newForm.start_date || null,
    }).select("id").single();
    if (!error && data) {
      await supabase.from("client_onboarding_tasks").upsert(
        KICKOFF_CHECKLIST.map((title, i) => ({ onboarding_record_id: data.id, title, sort_order: i })),
        { onConflict: "onboarding_record_id,title", ignoreDuplicates: true }
      );
      setNewOpen(false);
      setExpandedId(data.id);
    }
    setBusy("");
    setNote(error ? `Create failed: ${error.message}` : `${newForm.company_name} added to onboarding.`);
    await load();
  }

  async function patchRecord(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("client_onboarding_records")
      .update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) setNote(error.message);
    await load();
  }

  async function toggleTask(t: Task) {
    const status = t.status === "done" ? "pending" : "done";
    await supabase.from("client_onboarding_tasks")
      .update({ status, completed_at: status === "done" ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
      .eq("id", t.id);
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status } : x)));
  }

  async function stripeAction(path: string, body: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.ok && json.url) {
        await navigator.clipboard.writeText(json.url);
        setNote(`${label} created and copied to clipboard: ${json.url}`);
      } else {
        setNote(`${label} failed: ${json.error ?? "unknown error"}`);
      }
    } catch (e) {
      setNote(`${label} failed: ${e instanceof Error ? e.message : "network error"}`);
    } finally {
      setBusy("");
      await load();
    }
  }

  async function savePriceIds() {
    if (!settingsId) { setNote("app_settings row not found."); return; }
    setBusy("prices");
    const { error } = await supabase.from("app_settings").update(priceIds).eq("id", settingsId);
    setBusy("");
    setNote(error
      ? (error.message.includes("column") ? "Price ID columns missing — run the 20260614 migration first." : error.message)
      : "Stripe price IDs saved.");
  }

  function priceIdForRecord(r: OnboardingRecord): string {
    const pkg = PACKAGES.find((p) => p.name === r.package_name);
    return (pkg && priceIds[pkg.priceKey]) || "";
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl px-6 py-6">
      <PageHeader
        title="Client Onboarding"
        description="Proposal accepted → agreement → payment → intake → kickoff → active. All messages are manual copy/paste."
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => setNewOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              <Plus className="h-4 w-4" /> New Client
            </button>
            <button onClick={() => void load()} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:bg-zinc-800" aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {note && <p className="mb-4 rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-300">{note}</p>}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-zinc-300">
          <option value="all">All stages</option>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={billingFilter} onChange={(e) => setBillingFilter(e.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-zinc-300">
          <option value="all">All billing statuses</option>
          {BILLING_STATUSES.map((b) => <option key={b} value={b}>{b.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Pipeline list */}
      <div className="space-y-3">
        {loading ? (
          <p className="flex items-center gap-2 py-8 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center text-sm text-zinc-600">
            No onboarding clients yet — click New Client when a proposal is accepted.
          </p>
        ) : filtered.map((r) => {
          const expanded = expandedId === r.id;
          const action = nextAction(r);
          const renewal = renewalPrompt(r);
          return (
            <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900">
              {/* Row */}
              <button onClick={() => setExpandedId(expanded ? null : r.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
                {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" /> : <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500" />}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-zinc-200">{r.company_name}</span>
                  <span className="block truncate text-[11px] text-zinc-500">
                    {r.contact_name ?? "—"} · {r.package_name ?? "—"} · {r.agreement_type.replace(/_/g, "-")}
                    {r.monthly_fee ? ` · $${Number(r.monthly_fee).toLocaleString()}/mo` : ""}
                  </span>
                </span>
                <span className={clsx("rounded-full px-2 py-0.5 text-[11px] ring-1 ring-inset", STAGE_CLS[r.stage] ?? "bg-zinc-800 text-zinc-300 ring-zinc-700")}>
                  {STAGE_LABEL[r.stage] ?? r.stage}
                </span>
                <span className={clsx("rounded-full px-2 py-0.5 text-[11px] ring-1 ring-inset", BILLING_CLS[r.billing_status] ?? "bg-zinc-800 text-zinc-400 ring-zinc-700")}>
                  {r.billing_status.replace(/_/g, " ")}
                </span>
              </button>
              <div className={clsx("border-t border-zinc-800/60 px-4 py-2 text-xs", action.warn ? "text-amber-300" : "text-zinc-500")}>
                {action.warn && <AlertTriangle className="mr-1 inline h-3 w-3" />} Next: {action.text}
                {renewal && r.stage === "active_client" && <span className="ml-2 text-violet-300">· {renewal}</span>}
              </div>

              {/* Detail */}
              {expanded && (
                <div className="space-y-5 border-t border-zinc-800 px-4 py-4">
                  {/* Stage + billing actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => void patchRecord(r.id, { stage: "agreement_sent", agreement_sent_at: new Date().toISOString() })} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800">Mark agreement sent</button>
                    <button onClick={() => void patchRecord(r.id, { stage: "agreement_signed", agreement_signed_at: new Date().toISOString() })} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800">Mark agreement signed</button>
                    <button
                      onClick={() => void stripeAction("/api/stripe/checkout-link", { record_id: r.id, price_id: priceIdForRecord(r), setup_price_id: r.setup_fee ? priceIds.stripe_price_setup_fee || undefined : undefined }, "Payment link")}
                      disabled={busy !== "" || !priceIdForRecord(r)}
                      title={priceIdForRecord(r) ? "Creates a Stripe Checkout subscription link" : "Set the Stripe price ID for this package below first"}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/20 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50"
                    >
                      <CreditCard className="h-3 w-3" /> Create payment link
                    </button>
                    <span className="inline-flex items-center gap-1">
                      <input value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} placeholder="$ one-time" className="w-24 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-[11px] text-zinc-300" />
                      <button
                        onClick={() => void stripeAction("/api/stripe/invoice-link", { record_id: r.id, amount: Number(invoiceAmount) }, "Invoice link")}
                        disabled={busy !== "" || !Number(invoiceAmount)}
                        className="rounded-lg bg-sky-600/20 px-2.5 py-1.5 text-[11px] font-medium text-sky-400 hover:bg-sky-600/40 disabled:opacity-50"
                      >
                        Create invoice
                      </button>
                    </span>
                    <button onClick={() => void stripeAction("/api/stripe/portal-link", { record_id: r.id }, "Billing portal link")} disabled={busy !== "" || !r.stripe_customer_id} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800 disabled:opacity-50">Customer portal link</button>
                    <button onClick={() => void patchRecord(r.id, { stage: "intake_sent", intake_sent_at: new Date().toISOString() })} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800">Mark intake sent</button>
                    <button onClick={() => void patchRecord(r.id, { stage: "intake_completed", intake_completed_at: new Date().toISOString() })} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800">Mark intake completed</button>
                    <button onClick={() => void patchRecord(r.id, { stage: "kickoff_scheduled", kickoff_scheduled_at: new Date().toISOString() })} className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800">Mark kickoff scheduled</button>
                    <button
                      onClick={() => {
                        if (!canActivate(r)) { setNote("Cannot activate: agreement must be signed AND first payment completed (or set manual override)."); return; }
                        void patchRecord(r.id, { stage: "active_client", kickoff_completed_at: new Date().toISOString() });
                      }}
                      className={clsx("rounded-lg px-2.5 py-1.5 text-[11px] font-medium", canActivate(r) ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40" : "border border-zinc-800 text-zinc-600")}
                    >
                      <CheckCircle2 className="mr-1 inline h-3 w-3" /> Activate client
                    </button>
                    <label className="ml-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <input type="checkbox" checked={r.manual_override} onChange={(e) => void patchRecord(r.id, { manual_override: e.target.checked })} />
                      manual override
                    </label>
                    <button onClick={() => void patchRecord(r.id, { stage: "renewal_expansion" })} className="rounded-lg border border-violet-500/40 px-2.5 py-1.5 text-[11px] text-violet-300 hover:bg-violet-500/10">→ Renewal/Expansion</button>
                  </div>

                  {/* Stripe info */}
                  <p className="text-[11px] text-zinc-600">
                    Stripe: customer {r.stripe_customer_id ?? "—"} · subscription {r.stripe_subscription_id ?? "—"} · latest invoice {r.stripe_latest_invoice_id ?? "—"}
                    {r.first_payment_completed_at && ` · first payment ${new Date(r.first_payment_completed_at).toLocaleDateString()}`}
                  </p>

                  {/* Checklist + copy panels */}
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Kickoff checklist</p>
                      <ul className="space-y-1">
                        {tasks.map((t) => (
                          <li key={t.id}>
                            <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[12px] text-zinc-400 hover:bg-zinc-800/50">
                              <input type="checkbox" checked={t.status === "done"} onChange={() => void toggleTask(t)} />
                              <span className={t.status === "done" ? "text-zinc-600 line-through" : ""}>{t.title}</span>
                            </label>
                          </li>
                        ))}
                        {tasks.length === 0 && <li className="text-[11px] text-zinc-600">No checklist yet (created automatically for new clients).</li>}
                      </ul>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400"><FolderTree className="h-3 w-3" /> Folder structure</p>
                        <CopyBtn text={FOLDER_STRUCTURE(r.company_name)} />
                        <CopyBtn text={INTAKE_FORM_TEXT} label="Copy intake form" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Onboarding messages (send manually)</p>
                      <div className="space-y-1.5">
                        {ONBOARDING_MESSAGES.map((m) => (
                          <details key={m.key} className="group rounded-lg bg-zinc-800/40">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
                              <span className="text-[12px] text-zinc-300">{m.label}</span>
                              <CopyBtn text={m.body} />
                            </summary>
                            <p className="whitespace-pre-wrap border-t border-zinc-800 px-3 py-2 text-[11px] leading-relaxed text-zinc-400">{m.body}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <textarea
                    rows={2}
                    defaultValue={r.notes ?? ""}
                    onBlur={(e) => { if (e.target.value !== (r.notes ?? "")) void patchRecord(r.id, { notes: e.target.value || null }); }}
                    placeholder="Notes (kickoff notes, folder link, special terms…)"
                    className={`${INPUT} resize-y text-xs`}
                  />

                  {/* Agreement generator, prefilled */}
                  <AgreementGenerator prefill={{
                    clientLegalName: r.company_name,
                    contactName: r.contact_name ?? "",
                    billingEmail: r.contact_email ?? "",
                    packageName: r.package_name ?? "",
                    agreementType: r.agreement_type === "custom" ? "pilot" : r.agreement_type,
                    propertyCount: r.property_count ? String(r.property_count) : "",
                    monthlyFee: r.monthly_fee ? String(r.monthly_fee) : "",
                    setupFee: r.setup_fee ? String(r.setup_fee) : "",
                    startDate: r.start_date ?? "",
                    termLength: r.term_months ? `${r.term_months} month(s)` : "30 days",
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stripe settings */}
      <details className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-zinc-300 [&::-webkit-details-marker]:hidden">
          ⚙ Stripe price IDs (manual entry, v1)
        </summary>
        <div className="border-t border-zinc-800 px-4 py-4">
          <p className="mb-3 text-[11px] text-zinc-600">
            Create products/prices in the Stripe dashboard, paste the price IDs here. Env needed on the server:
            STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL. Webhook endpoint: /api/stripe/webhook.
            {!settingsId && " (app_settings row not found — open /settings once first.)"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...PACKAGES.map((p) => ({ key: p.priceKey, label: p.name })), { key: "stripe_price_setup_fee", label: "One-time setup fee" }].map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-medium text-zinc-400">{f.label}</label>
                <input value={priceIds[f.key] ?? ""} onChange={(e) => setPriceIds((p) => ({ ...p, [f.key]: e.target.value }))} placeholder="price_…" className={INPUT} />
              </div>
            ))}
          </div>
          <button onClick={savePriceIds} disabled={busy !== ""} className="mt-3 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-600/40 disabled:opacity-50">
            {busy === "prices" ? "Saving…" : "Save price IDs"}
          </button>
        </div>
      </details>

      {/* New client slide-over */}
      {newOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNewOpen(false)} />
          <div className="relative flex w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-100"><UserPlus className="h-4 w-4" /> New Onboarding Client</h2>
              <button onClick={() => setNewOpen(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {([["Company name *", "company_name", "text"], ["Contact name", "contact_name", "text"], ["Contact email (billing)", "contact_email", "email"], ["Setup fee (USD)", "setup_fee", "number"], ["Property count", "property_count", "number"], ["Start date", "start_date", "date"], ["Term (months)", "term_months", "number"]] as const).map(([label, key, type]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
                  <input type={type} value={newForm[key]} onChange={(e) => setNewForm((f) => ({ ...f, [key]: e.target.value }))} className={INPUT} />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Package</label>
                <select
                  value={newForm.package_name}
                  onChange={(e) => {
                    const pkg = PACKAGES.find((p) => p.name === e.target.value);
                    setNewForm((f) => ({ ...f, package_name: e.target.value, monthly_fee: pkg ? String(pkg.fee) : f.monthly_fee }));
                  }}
                  className={`${INPUT} cursor-pointer`}
                >
                  {PACKAGES.map((p) => <option key={p.name} value={p.name}>{p.name} — ${p.fee.toLocaleString()}/mo</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Monthly fee (USD)</label>
                  <input type="number" value={newForm.monthly_fee} onChange={(e) => setNewForm((f) => ({ ...f, monthly_fee: e.target.value }))} className={INPUT} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Agreement type</label>
                  <select value={newForm.agreement_type} onChange={(e) => setNewForm((f) => ({ ...f, agreement_type: e.target.value }))} className={`${INPUT} cursor-pointer`}>
                    {["pilot", "6_month", "12_month", "custom"].map((v) => <option key={v} value={v}>{v.replace(/_/g, "-")}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 px-6 py-4">
              <button onClick={() => setNewOpen(false)} className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800">Cancel</button>
              <button onClick={createRecord} disabled={busy !== ""} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                {busy === "new" ? "Creating…" : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
