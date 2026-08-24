"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  CreditCard,
  Eye,
  Loader2,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import clsx from "clsx";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type ClientAccount = {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  package_name: string | null;
  monthly_fee: number | null;
  property_count: number | null;
  stage: string;
  billing_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type OnboardingTask = {
  id: string;
  onboarding_record_id: string;
  title: string;
  description: string | null;
  status: "pending" | "done" | "skipped";
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
};

const STAGES = [
  "proposal_accepted",
  "agreement_sent",
  "agreement_signed",
  "payment_link_sent",
  "first_payment_completed",
  "intake_sent",
  "intake_completed",
  "kickoff_scheduled",
  "active_client",
  "renewal_expansion",
];

const BILLING = [
  "not_started",
  "payment_link_sent",
  "subscription_active",
  "invoice_sent",
  "paid",
  "past_due",
  "failed",
  "canceled",
  "manual",
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function ownerToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export default function ClientWorkspacePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [stage, setStage] = useState("");
  const [billingStatus, setBillingStatus] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    if (!id || !isSupabaseConfigured) {
      setError("Client workspace is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: record, error: recordError }, { data: taskRows, error: tasksError }] = await Promise.all([
      supabase.from("client_onboarding_records").select("*").eq("id", id).single(),
      supabase.from("client_onboarding_tasks").select("*").eq("onboarding_record_id", id).order("sort_order", { ascending: true }),
    ]);

    if (recordError) {
      setError(recordError.message);
      setLoading(false);
      return;
    }
    if (tasksError) {
      setError(tasksError.message);
      setLoading(false);
      return;
    }

    const typed = record as ClientAccount;
    setAccount(typed);
    setTasks((taskRows ?? []) as OnboardingTask[]);
    setStage(typed.stage);
    setBillingStatus(typed.billing_status);
    setNotes(typed.notes ?? "");
    setError(null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
  }, [tasks]);

  async function updateTask(task: OnboardingTask) {
    const token = await ownerToken();
    if (!token) {
      setError("Your owner session expired. Sign in again.");
      return;
    }
    const nextStatus = task.status === "done" ? "pending" : "done";
    setTasks((rows) => rows.map((row) => (row.id === task.id ? { ...row, status: nextStatus } : row)));
    const response = await fetch("/api/client-accounts/task", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ task_id: task.id, status: nextStatus }),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !json.ok) {
      setTasks((rows) => rows.map((row) => (row.id === task.id ? task : row)));
      setError(json.error ?? "Could not update onboarding task.");
    }
  }

  async function saveAccount() {
    if (!account) return;
    const token = await ownerToken();
    if (!token) {
      setError("Your owner session expired. Sign in again.");
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/client-accounts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ record_id: account.id, stage, billing_status: billingStatus, notes }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Could not save account.");
      setAccount({ ...account, stage, billing_status: billingStatus, notes });
      setMessage("Client workspace saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save account.");
    } finally {
      setSaving(false);
    }
  }

  async function copyBillingPortal() {
    if (!account) return;
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: account.id }),
      });
      const json = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !json.ok || !json.url) throw new Error(json.error ?? "Could not create billing portal link.");
      await navigator.clipboard.writeText(json.url);
      setMessage("Stripe billing portal link copied.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create billing portal link.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eee7da] text-[#776b5b]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading client workspace…
      </div>
    );
  }

  if (!account) {
    return <div className="min-h-screen bg-[#eee7da] p-8 text-[#6f6250]">{error ?? "Client account not found."}</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eee7da] text-[#2b241a]">
      <div className="pointer-events-none absolute -left-24 top-0 h-[350px] w-[350px] rounded-full bg-[#d9bf83]/22 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[120px] h-[440px] w-[440px] rounded-full bg-white/55 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-8 lg:px-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/client-accounts" className="inline-flex items-center gap-2 text-sm font-medium text-[#76674e] transition hover:text-[#3f3527]">
            <ArrowLeft className="h-4 w-4" /> Client Accounts
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/client-accounts/${account.id}/preview`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#b89446]/40 bg-[#e8d3a2] px-4 py-2.5 text-sm font-semibold text-[#3a2f18] transition hover:bg-[#e0c68d]"
            >
              <Eye className="h-4 w-4" /> View client dashboard
            </Link>
            <button
              type="button"
              onClick={() => void saveAccount()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c251c] px-4 py-2.5 text-sm font-semibold text-[#f8f3e8] transition hover:bg-[#403426] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
          </div>
        </div>

        <header className="mb-7 rounded-[30px] border border-white/70 bg-white/52 p-7 shadow-[0_25px_80px_rgba(82,63,28,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9a7a3c]">
                <Sparkles className="h-3.5 w-3.5" /> Archer Design · Client Workspace
              </div>
              <h1 className="font-serif text-[clamp(34px,4vw,50px)] leading-none text-[#271f16]">{account.company_name}</h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#7a6e5d]">
                <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" /> {account.contact_name || "No contact name"}</span>
                {account.contact_email && <span>{account.contact_email}</span>}
              </p>
            </div>
            <div className="grid min-w-[300px] grid-cols-3 gap-2 rounded-2xl border border-[#8e743a]/10 bg-[#f8f3ea]/70 p-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#9c907f]">Plan</p>
                <p className="mt-1 truncate text-xs font-semibold text-[#594b36]">{account.package_name || "—"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#9c907f]">Monthly</p>
                <p className="mt-1 text-xs font-semibold text-[#594b36]">{money.format(Number(account.monthly_fee ?? 0))}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#9c907f]">Properties</p>
                <p className="mt-1 text-xs font-semibold text-[#594b36]">{account.property_count ?? 0}</p>
              </div>
            </div>
          </div>
        </header>

        {(message || error) && (
          <div className={clsx("mb-5 rounded-2xl border px-4 py-3 text-sm", error ? "border-red-800/10 bg-red-50/70 text-red-800" : "border-emerald-800/10 bg-emerald-50/70 text-emerald-800")}>
            {error ?? message}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_20px_65px_rgba(82,63,28,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a3c]">Onboarding</p>
                <h2 className="mt-1 font-serif text-2xl text-[#2b241a]">Client setup checklist</h2>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl text-[#7c622f]">{progress}%</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#9b907f]">complete</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#d8cfbf]/60">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#b28b3e,#d1b66f)] transition-all" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-5 space-y-2">
              {tasks.map((task) => {
                const done = task.status === "done";
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => void updateTask(task)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#8e743a]/8 bg-[#fbf8f1]/58 px-4 py-3 text-left transition hover:border-[#b49146]/20 hover:bg-white/75"
                  >
                    <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", done ? "border-[#a98135]/20 bg-[#b49146]/12 text-[#8d6b2e]" : "border-[#aa9e8d]/25 bg-white/50 text-[#aea18d]")}>
                      {done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={clsx("text-sm font-medium", done ? "text-[#756b5d] line-through decoration-[#b89b65]/45" : "text-[#4c4132]")}>{task.title}</p>
                      {task.description && <p className="mt-0.5 text-xs text-[#938775]">{task.description}</p>}
                    </div>
                    {done && <CheckCircle2 className="h-4 w-4 text-[#a57c32]" />}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_20px_65px_rgba(82,63,28,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a3c]">Account controls</p>
              <h2 className="mt-1 font-serif text-2xl text-[#2b241a]">Status & billing</h2>

              <label className="mt-5 block text-xs font-medium text-[#6e6251]">
                Client stage
                <select value={stage} onChange={(event) => setStage(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#8e743a]/12 bg-[#fbf8f1]/80 px-3 py-3 text-sm text-[#493e30] outline-none focus:border-[#b49146]/35">
                  {STAGES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
                </select>
              </label>

              <label className="mt-4 block text-xs font-medium text-[#6e6251]">
                Billing status
                <select value={billingStatus} onChange={(event) => setBillingStatus(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#8e743a]/12 bg-[#fbf8f1]/80 px-3 py-3 text-sm text-[#493e30] outline-none focus:border-[#b49146]/35">
                  {BILLING.map((value) => <option key={value} value={value}>{label(value)}</option>)}
                </select>
              </label>

              <button
                type="button"
                onClick={() => void copyBillingPortal()}
                className="mt-4 inline-flex w-full items-center justify-between rounded-2xl border border-[#8e743a]/12 bg-white/55 px-4 py-3 text-sm font-semibold text-[#625238] transition hover:bg-white"
              >
                <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4" /> Copy Stripe billing portal</span>
                <ChevronRight className="h-4 w-4 text-[#a59477]" />
              </button>
            </section>

            <section className="rounded-[28px] border border-white/70 bg-white/50 p-6 shadow-[0_20px_65px_rgba(82,63,28,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7a3c]">Internal only</p>
              <h2 className="mt-1 font-serif text-2xl text-[#2b241a]">Archer notes</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#8b7f6e]">These notes are never shown in the client-facing preview.</p>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={9}
                className="mt-4 w-full resize-y rounded-2xl border border-[#8e743a]/12 bg-[#fbf8f1]/80 px-3 py-3 text-sm leading-relaxed text-[#493e30] outline-none placeholder:text-[#aca08e] focus:border-[#b49146]/35"
                placeholder="Internal context, next steps, special billing notes…"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
