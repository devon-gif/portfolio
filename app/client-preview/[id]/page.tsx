"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  CreditCard,
  Files,
  Loader2,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
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
};

type OnboardingTask = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "done" | "skipped";
  sort_order: number;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ClientPreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingBusy, setBillingBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id || !isSupabaseConfigured) {
      setError("Client preview is not configured.");
      setLoading(false);
      return;
    }

    const [{ data: record, error: recordError }, { data: taskRows, error: tasksError }] = await Promise.all([
      supabase
        .from("client_onboarding_records")
        .select("id,company_name,contact_name,contact_email,package_name,monthly_fee,property_count,stage,billing_status,stripe_customer_id")
        .eq("id", id)
        .single(),
      supabase
        .from("client_onboarding_tasks")
        .select("id,title,description,status,sort_order")
        .eq("onboarding_record_id", id)
        .order("sort_order", { ascending: true }),
    ]);

    if (recordError) {
      setError(recordError.message);
    } else if (tasksError) {
      setError(tasksError.message);
    } else {
      setAccount(record as ClientAccount);
      setTasks((taskRows ?? []) as OnboardingTask[]);
      setError(null);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
  }, [tasks]);

  const nextTasks = useMemo(() => tasks.filter((task) => task.status !== "done").slice(0, 4), [tasks]);

  async function openBillingPortal() {
    if (!account?.stripe_customer_id) return;
    setBillingBusy(true);
    try {
      const response = await fetch("/api/stripe/portal-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: account.id }),
      });
      const json = (await response.json()) as { ok?: boolean; url?: string };
      if (response.ok && json.ok && json.url) window.open(json.url, "_blank", "noopener,noreferrer");
    } finally {
      setBillingBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#efe8dc] text-[#756958]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading client dashboard…
      </div>
    );
  }

  if (!account) {
    return <div className="min-h-screen bg-[#efe8dc] p-8 text-[#6c5f4c]">{error ?? "Client account not found."}</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#efe8dc] text-[#2c241a]">
      <div className="pointer-events-none absolute -left-28 -top-24 h-[380px] w-[380px] rounded-full bg-[#d8bd7d]/28 blur-3xl" />
      <div className="pointer-events-none absolute right-[-130px] top-[160px] h-[500px] w-[500px] rounded-full bg-white/62 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-200px] left-[26%] h-[460px] w-[460px] rounded-full bg-[#c9a44c]/10 blur-3xl" />

      <div className="relative border-b border-[#9a7a3b]/10 bg-white/28 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#b58f42]/25 bg-white/55 text-[#9b7530] shadow-[0_8px_30px_rgba(89,67,27,0.08)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="font-serif text-[17px] leading-none text-[#30271d]">Archer Design</div>
              <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9a886d]">Client Portal</div>
            </div>
          </div>
          <Link
            href={`/client-accounts/${account.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#8f743b]/12 bg-white/45 px-3 py-2 text-xs font-semibold text-[#66573f] transition hover:bg-white/75"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to admin workspace
          </Link>
        </div>
      </div>

      <main className="relative mx-auto max-w-7xl px-6 py-9 lg:px-8 lg:py-12">
        <div className="mb-8 rounded-2xl border border-[#a98437]/12 bg-[#fffaf0]/60 px-4 py-2.5 text-center text-xs font-medium text-[#806638] backdrop-blur-xl">
          Preview mode · this is the client-facing experience. Admin-only notes and controls are hidden.
        </div>

        <section className="mb-7 rounded-[34px] border border-white/78 bg-white/54 p-7 shadow-[0_28px_90px_rgba(84,64,29,0.09),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9d7d3e]">Welcome to your workspace</p>
              <h1 className="mt-3 max-w-3xl font-serif text-[clamp(38px,5vw,62px)] leading-[0.98] tracking-[-0.03em] text-[#271f16]">
                {account.contact_name ? `Hi ${account.contact_name.split(" ")[0]},` : "Welcome,"} everything for {account.company_name} lives here.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#756b5d]">
                Review progress, keep onboarding moving, see what creative is ready for approval, and manage your plan without digging through email threads.
              </p>
            </div>
            <div className="rounded-[24px] border border-[#9a7a3b]/10 bg-[#f8f2e7]/68 p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9a8c78]">Current plan</p>
              <p className="mt-2 font-serif text-2xl text-[#4a3a25]">{account.package_name || "Archer Design"}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#8f743b]/9 pt-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#a09584]">Monthly</p>
                  <p className="mt-1 text-sm font-semibold text-[#625139]">{money.format(Number(account.monthly_fee ?? 0))}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[#a09584]">Properties</p>
                  <p className="mt-1 text-sm font-semibold text-[#625139]">{account.property_count ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-[28px] border border-white/75 bg-white/48 p-6 shadow-[0_20px_65px_rgba(79,60,27,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a3a]">Onboarding</p>
                <h2 className="mt-1 font-serif text-2xl text-[#2d251b]">Your setup progress</h2>
              </div>
              <div className="text-right">
                <p className="font-serif text-3xl text-[#82652d]">{progress}%</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-[#9b8f7d]">complete</p>
              </div>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#d9d0c1]/58">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#b1883b,#d0b46d)]" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(nextTasks.length ? nextTasks : tasks.slice(-4)).map((task) => {
                const done = task.status === "done";
                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-[#8e743a]/8 bg-[#fbf8f1]/58 px-4 py-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${done ? "border-[#a98135]/20 bg-[#b49146]/12 text-[#8d6b2e]" : "border-[#aa9e8d]/25 bg-white/50 text-[#aea18d]"}`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#554937]">{task.title}</p>
                      <p className="mt-0.5 text-[10px] text-[#9a8d7a]">{done ? "Complete" : "In progress"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/75 bg-white/48 p-6 shadow-[0_20px_65px_rgba(79,60,27,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a3a]">Account</p>
            <h2 className="mt-1 font-serif text-2xl text-[#2d251b]">Plan & billing</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-[#8e743a]/8 pb-3">
                <span className="text-[#918574]">Status</span>
                <span className="font-medium text-[#5b4d38]">{label(account.billing_status)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#8e743a]/8 pb-3">
                <span className="text-[#918574]">Stage</span>
                <span className="font-medium text-[#5b4d38]">{label(account.stage)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void openBillingPortal()}
              disabled={!account.stripe_customer_id || billingBusy}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e271e] px-4 py-3 text-sm font-semibold text-[#f8f3e8] transition hover:bg-[#403526] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {billingBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Manage billing
            </button>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/75 bg-white/48 p-6 shadow-[0_20px_65px_rgba(79,60,27,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#b49146]/15 bg-[#b49146]/8 text-[#9d7934]"><Files className="h-4.5 w-4.5" /></div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a3a]">Creative review</p>
                <h2 className="mt-1 font-serif text-2xl text-[#2d251b]">Nothing waiting on you yet</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#7d7161]">
              When creative is ready, this area will show the latest graphics and motion assets with simple Approve and Request changes actions.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["In progress", "Ready for review", "Approved"].map((text) => (
                <div key={text} className="rounded-2xl border border-[#8e743a]/8 bg-[#f8f3ea]/58 px-3 py-4 text-center">
                  <div className="font-serif text-2xl text-[#7d6331]">0</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#9e927f]">{text}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/75 bg-white/48 p-6 shadow-[0_20px_65px_rgba(79,60,27,0.07),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#b49146]/15 bg-[#b49146]/8 text-[#9d7934]"><CalendarDays className="h-4.5 w-4.5" /></div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9b7a3a]">This month</p>
                <h2 className="mt-1 font-serif text-2xl text-[#2d251b]">Creative cadence</h2>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {["Priorities & source assets", "Creative production", "Client review & revisions", "Final delivery / publishing handoff"].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-[#8e743a]/8 bg-[#fbf8f1]/55 px-4 py-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b49146]/10 text-[11px] font-semibold text-[#85662e]">{index + 1}</div>
                  <span className="text-sm text-[#5b4f3d]">{step}</span>
                </div>
              ))}
            </div>
            <button type="button" disabled className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#8e743a]/12 bg-white/55 px-4 py-3 text-sm font-semibold text-[#88775b] opacity-70">
              <MessageSquareText className="h-4 w-4" /> Request / message center coming next
            </button>
          </section>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#8f743b]/10 pt-6 text-xs text-[#968a77] sm:flex-row">
          <span>Archer Design · Hospitality creative support</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#a47d34]" /> Secure client workspace</span>
        </footer>
      </main>
    </div>
  );
}
