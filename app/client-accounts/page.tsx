"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CreditCard,
  DollarSign,
  Eye,
  Layers3,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Users,
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
  notes: string | null;
  created_at: string;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ACTIVE_BILLING = new Set(["subscription_active", "paid", "manual"]);
const ATTENTION_BILLING = new Set(["past_due", "failed"]);

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferOffer(notes: string | null) {
  const match = notes?.match(/Self-serve checkout offer:\s*([^\n]+)/i);
  if (!match) return null;
  const id = match[1].trim().toLowerCase();
  if (id === "elaine") return "CR 91 / Elaine";
  if (id === "valencia") return "Valencia Hotel Group";
  return match[1].trim();
}

function isTestRecord(account: ClientAccount) {
  return account.company_name.startsWith("[TEST]") || /LOCAL TEST ONBOARDING/i.test(account.notes ?? "");
}

function billingPill(status: string) {
  if (ACTIVE_BILLING.has(status)) return "border-emerald-700/15 bg-emerald-700/8 text-emerald-800";
  if (ATTENTION_BILLING.has(status)) return "border-red-700/15 bg-red-700/8 text-red-800";
  if (status === "payment_link_sent" || status === "invoice_sent") return "border-amber-700/15 bg-amber-700/8 text-amber-800";
  return "border-[#7b6947]/15 bg-[#7b6947]/7 text-[#6a5a3d]";
}

function MetricCard({ icon: Icon, eyebrow, value, helper }: { icon: typeof Users; eyebrow: string; value: string; helper: string }) {
  return (
    <div className="rounded-[26px] border border-white/75 bg-white/58 p-5 shadow-[0_20px_60px_rgba(86,67,32,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d7a58]">{eyebrow}</p>
          <p className="mt-2 font-serif text-3xl text-[#2b241a]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#b89446]/15 bg-[#b89446]/8 text-[#a47f34]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#8b8174]">{helper}</p>
    </div>
  );
}

export default function ClientAccountsPage() {
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured in this environment.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("client_onboarding_records")
      .select("id,company_name,contact_name,contact_email,package_name,monthly_fee,property_count,stage,billing_status,stripe_customer_id,notes,created_at")
      .order("created_at", { ascending: false });

    if (loadError) {
      setError(loadError.message);
    } else {
      setAccounts((data ?? []) as ClientAccount[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    const active = accounts.filter((account) => ACTIVE_BILLING.has(account.billing_status));
    return {
      accounts: accounts.length,
      active: active.length,
      mrr: active.reduce((sum, account) => sum + Number(account.monthly_fee ?? 0), 0),
      properties: active.reduce((sum, account) => sum + Number(account.property_count ?? 0), 0),
      attention: accounts.filter((account) => ATTENTION_BILLING.has(account.billing_status)).length,
    };
  }, [accounts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const text = [account.company_name, account.contact_name, account.contact_email, account.package_name, inferOffer(account.notes)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !needle || text.includes(needle);
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && ACTIVE_BILLING.has(account.billing_status)) ||
        (filter === "attention" && ATTENTION_BILLING.has(account.billing_status)) ||
        (filter === "test" && isTestRecord(account)) ||
        account.billing_status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [accounts, filter, query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eee7da] text-[#2b241a]">
      <div className="pointer-events-none absolute -left-20 -top-24 h-[360px] w-[360px] rounded-full bg-[#d8bd7d]/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[180px] h-[420px] w-[420px] rounded-full bg-white/55 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-[30%] h-[420px] w-[420px] rounded-full bg-[#c9a44c]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px] px-6 py-8 lg:px-9">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9c8041]">
              <Sparkles className="h-3.5 w-3.5" /> Archer Design · Client Management
            </div>
            <h1 className="font-serif text-[clamp(34px,4vw,52px)] leading-[0.98] tracking-[-0.025em] text-[#241e16]">Client Accounts</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#756b5e]">
              Open any account to manage onboarding, billing, notes, and preview the polished dashboard that client will see.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/start?offer=elaine"
              target="_blank"
              className="rounded-xl border border-[#8e743a]/15 bg-white/50 px-4 py-2.5 text-sm font-medium text-[#5f5138] backdrop-blur-lg transition hover:bg-white/75"
            >
              Elaine checkout
            </Link>
            <Link
              href="/start?offer=valencia"
              target="_blank"
              className="rounded-xl border border-[#8e743a]/15 bg-white/50 px-4 py-2.5 text-sm font-medium text-[#5f5138] backdrop-blur-lg transition hover:bg-white/75"
            >
              Valencia checkout
            </Link>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2a241b] px-4 py-2.5 text-sm font-semibold text-[#f6f1e7] shadow-[0_12px_30px_rgba(61,47,24,0.16)] transition hover:bg-[#3a3023]"
            >
              <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} /> Refresh
            </button>
          </div>
        </header>

        <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard icon={Users} eyebrow="Accounts" value={String(metrics.accounts)} helper="All onboarding and client records" />
          <MetricCard icon={CreditCard} eyebrow="Active" value={String(metrics.active)} helper="Paid, active, or manually billed" />
          <MetricCard icon={DollarSign} eyebrow="Active MRR" value={money.format(metrics.mrr)} helper="Recurring monthly value" />
          <MetricCard icon={Building2} eyebrow="Properties" value={String(metrics.properties)} helper="Properties in active scope" />
          <MetricCard icon={AlertTriangle} eyebrow="Attention" value={String(metrics.attention)} helper="Past due or failed billing" />
        </div>

        <section className="rounded-[30px] border border-white/70 bg-white/45 p-4 shadow-[0_22px_70px_rgba(83,65,31,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3 border-b border-[#8e743a]/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 lg:max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a09179]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search company, contact, package, or offer…"
                className="w-full rounded-2xl border border-[#8e743a]/12 bg-[#fbf8f2]/75 py-3 pl-10 pr-4 text-sm text-[#332a1e] outline-none transition placeholder:text-[#a69a88] focus:border-[#b49146]/35 focus:bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["payment_link_sent", "Payment pending"],
                ["attention", "Needs attention"],
                ["test", "Tests"],
              ].map(([value, text]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={clsx(
                    "rounded-xl border px-3 py-2 text-xs font-medium transition",
                    filter === value
                      ? "border-[#ad8a3f]/20 bg-[#ad8a3f]/12 text-[#725b2b]"
                      : "border-transparent text-[#8a7e6d] hover:border-[#8e743a]/10 hover:bg-white/45 hover:text-[#5f5445]"
                  )}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-700/10 bg-red-50/70 px-4 py-3 text-sm text-red-800">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#8a7d6b]">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading client accounts…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="mx-auto h-7 w-7 text-[#b6aa98]" />
              <p className="mt-3 text-sm font-semibold text-[#544b3e]">No matching accounts</p>
              <p className="mt-1 text-sm text-[#958a79]">Try another filter or create a new checkout record.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {filtered.map((account) => {
                const offer = inferOffer(account.notes);
                const test = isTestRecord(account);
                return (
                  <article
                    key={account.id}
                    className="group rounded-[24px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.70),rgba(250,246,237,0.48))] p-5 shadow-[0_14px_40px_rgba(72,55,26,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 hover:border-[#b89446]/25 hover:shadow-[0_18px_50px_rgba(72,55,26,0.10)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#b89446]/18 bg-[#b89446]/10 font-serif text-lg text-[#8d6d2e]">
                          {account.company_name.replace(/^\[TEST\]\s*/i, "").charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate font-serif text-xl text-[#2c2418]">{account.company_name}</h2>
                            {test && <span className="rounded-full border border-[#a4772d]/14 bg-[#a4772d]/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8b6c37]">Test</span>}
                          </div>
                          <p className="mt-1 truncate text-xs text-[#817665]">
                            {account.contact_name || "No contact name"}{account.contact_email ? ` · ${account.contact_email}` : ""}
                          </p>
                          {offer && <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9c7a37]">{offer}</p>}
                        </div>
                      </div>
                      <span className={clsx("shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold", billingPill(account.billing_status))}>
                        {label(account.billing_status)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#8e743a]/8 bg-[#f7f2e9]/60 p-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.16em] text-[#a19584]">Plan</p>
                        <p className="mt-1 truncate text-xs font-semibold text-[#5b4e3a]">{account.package_name || "Not selected"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.16em] text-[#a19584]">Monthly</p>
                        <p className="mt-1 text-xs font-semibold text-[#5b4e3a]">{money.format(Number(account.monthly_fee ?? 0))}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.16em] text-[#a19584]">Properties</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#5b4e3a]"><Layers3 className="h-3 w-3" /> {account.property_count ?? 0}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[#8d8271]">Stage: <span className="font-medium text-[#5f513b]">{label(account.stage)}</span></div>
                      <div className="flex gap-2">
                        <Link
                          href={`/client-preview/${account.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#8e743a]/12 bg-white/55 px-3 py-2 text-xs font-semibold text-[#64563d] transition hover:bg-white"
                        >
                          <Eye className="h-3.5 w-3.5" /> Client view
                        </Link>
                        <Link
                          href={`/client-accounts/${account.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2c251c] px-3 py-2 text-xs font-semibold text-[#f8f3e8] transition hover:bg-[#403426]"
                        >
                          Open workspace <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
