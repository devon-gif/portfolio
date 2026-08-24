"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Layers3,
  Link2,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type ClientAccount = {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  package_name: string | null;
  monthly_fee: number | null;
  setup_fee: number | null;
  property_count: number | null;
  stage: string;
  billing_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_latest_invoice_id: string | null;
  agreement_signed_at: string | null;
  payment_link_sent_at: string | null;
  first_payment_completed_at: string | null;
  intake_completed_at: string | null;
  kickoff_scheduled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const ACTIVE_BILLING = new Set(["subscription_active", "paid", "manual"]);
const ATTENTION_BILLING = new Set(["past_due", "failed"]);

const BILLING_STYLE: Record<string, string> = {
  subscription_active: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  paid: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  manual: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  payment_link_sent: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  invoice_sent: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  not_started: "bg-zinc-800 text-zinc-400 ring-zinc-700",
  past_due: "bg-red-500/10 text-red-300 ring-red-500/20",
  failed: "bg-red-500/10 text-red-300 ring-red-500/20",
  canceled: "bg-zinc-800 text-zinc-500 ring-zinc-700",
};

const STAGE_STYLE: Record<string, string> = {
  active_client: "text-emerald-300",
  first_payment_completed: "text-emerald-300",
  intake_completed: "text-sky-300",
  kickoff_scheduled: "text-violet-300",
  payment_link_sent: "text-amber-300",
  agreement_signed: "text-amber-300",
};

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferOffer(notes: string | null) {
  const match = notes?.match(/Self-serve checkout offer:\s*([^\n]+)/i);
  if (!match) return null;
  const id = match[1].trim().toLowerCase();
  if (id === "elaine") return "CR 91 / Elaine";
  if (id === "valencia") return "Valencia Hotel Group";
  if (id === "general") return "General Archer checkout";
  return match[1].trim();
}

function firstLetter(name: string) {
  return name.trim().charAt(0).toUpperCase() || "A";
}

function CopyButton({ value, labelText }: { value: string; labelText: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : labelText}
    </button>
  );
}

export default function ClientAccountsPage() {
  const [accounts, setAccounts] = useState<ClientAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [billingFilter, setBillingFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [portalBusy, setPortalBusy] = useState<string | null>(null);
  const [portalMessage, setPortalMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured in this environment.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("client_onboarding_records")
      .select("*")
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
      activeAccounts: active.length,
      mrr: active.reduce((sum, account) => sum + Number(account.monthly_fee ?? 0), 0),
      properties: active.reduce((sum, account) => sum + Number(account.property_count ?? 0), 0),
      attention: accounts.filter((account) => ATTENTION_BILLING.has(account.billing_status)).length,
    };
  }, [accounts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch =
        !needle ||
        account.company_name.toLowerCase().includes(needle) ||
        (account.contact_name ?? "").toLowerCase().includes(needle) ||
        (account.contact_email ?? "").toLowerCase().includes(needle) ||
        (account.package_name ?? "").toLowerCase().includes(needle) ||
        (inferOffer(account.notes) ?? "").toLowerCase().includes(needle);

      const matchesBilling =
        billingFilter === "all" ||
        (billingFilter === "active" && ACTIVE_BILLING.has(account.billing_status)) ||
        (billingFilter === "attention" && ATTENTION_BILLING.has(account.billing_status)) ||
        account.billing_status === billingFilter;

      return matchesSearch && matchesBilling;
    });
  }, [accounts, billingFilter, query]);

  async function createPortalLink(account: ClientAccount) {
    setPortalBusy(account.id);
    setPortalMessage(null);
    try {
      const response = await fetch("/api/stripe/portal-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_id: account.id }),
      });
      const json = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !json.ok || !json.url) throw new Error(json.error ?? "Could not create billing portal link.");
      await navigator.clipboard.writeText(json.url);
      setPortalMessage(`Billing portal link copied for ${account.company_name}.`);
    } catch (err) {
      setPortalMessage(err instanceof Error ? err.message : "Could not create billing portal link.");
    } finally {
      setPortalBusy(null);
    }
  }

  return (
    <div className="max-w-7xl px-6 py-6">
      <PageHeader
        title="Client Accounts"
        description="Every Archer Design client, subscription, property count, and onboarding status in one place."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/start"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              <Link2 className="h-4 w-4" /> Checkout page
            </Link>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Refresh accounts"
            >
              <RefreshCw className={clsx("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Active accounts" value={String(metrics.activeAccounts)} helper="Recurring or paid clients" />
        <MetricCard icon={DollarSign} label="Active MRR" value={money.format(metrics.mrr)} helper="Based on active billing records" />
        <MetricCard icon={Building2} label="Properties in scope" value={String(metrics.properties)} helper="Across active accounts" />
        <MetricCard
          icon={AlertTriangle}
          label="Needs attention"
          value={String(metrics.attention)}
          helper="Past due or failed billing"
          alert={metrics.attention > 0}
        />
      </div>

      <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative min-w-0 flex-1 md:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, contact, plan, or offer…"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-emerald-600/60"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["active", "Active"],
              ["payment_link_sent", "Payment pending"],
              ["attention", "Needs attention"],
              ["canceled", "Canceled"],
            ].map(([value, text]) => (
              <button
                key={value}
                type="button"
                onClick={() => setBillingFilter(value)}
                className={clsx(
                  "rounded-lg px-3 py-2 text-xs font-medium transition",
                  billingFilter === value
                    ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20"
                    : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                )}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {portalMessage && (
        <div className="mb-4 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
          {portalMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-14 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading client accounts…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-14 text-center">
          <Users className="mx-auto h-7 w-7 text-zinc-700" />
          <p className="mt-3 text-sm font-medium text-zinc-300">No matching client accounts</p>
          <p className="mt-1 text-sm text-zinc-600">New self-serve checkouts will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((account) => {
            const expanded = expandedId === account.id;
            const offer = inferOffer(account.notes);
            return (
              <section key={account.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : account.id)}
                  className="grid w-full gap-4 px-4 py-4 text-left md:grid-cols-[minmax(0,1.4fr)_minmax(160px,0.8fr)_120px_150px_28px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-300">
                      {firstLetter(account.company_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-100">{account.company_name}</div>
                      <div className="mt-0.5 truncate text-xs text-zinc-500">
                        {account.contact_name || "No contact name"}
                        {account.contact_email ? ` · ${account.contact_email}` : ""}
                      </div>
                      {offer && <div className="mt-1 text-[11px] font-medium text-emerald-400/80">{offer}</div>}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-sm text-zinc-300">{account.package_name || "No package selected"}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                      <Layers3 className="h-3.5 w-3.5" /> {account.property_count ?? 0} {account.property_count === 1 ? "property" : "properties"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-zinc-100">{money.format(Number(account.monthly_fee ?? 0))}</div>
                    <div className="text-[11px] text-zinc-600">per month</div>
                  </div>

                  <div>
                    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset", BILLING_STYLE[account.billing_status] ?? BILLING_STYLE.not_started)}>
                      {label(account.billing_status)}
                    </span>
                    <div className={clsx("mt-1 text-[11px]", STAGE_STYLE[account.stage] ?? "text-zinc-600")}>{label(account.stage)}</div>
                  </div>

                  <div className="hidden justify-self-end md:block">
                    {expanded ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-zinc-800 bg-zinc-950/35 px-4 py-5">
                    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr_0.9fr]">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Account</p>
                        <dl className="mt-3 space-y-2.5 text-sm">
                          <Detail labelText="Contact" value={account.contact_name || "—"} />
                          <Detail labelText="Email" value={account.contact_email || "—"} />
                          <Detail labelText="Package" value={account.package_name || "—"} />
                          <Detail labelText="Properties / brands" value={String(account.property_count ?? 0)} />
                          <Detail labelText="Monthly fee" value={money.format(Number(account.monthly_fee ?? 0))} />
                          <Detail labelText="Created" value={shortDate.format(new Date(account.created_at))} />
                        </dl>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Billing</p>
                        <dl className="mt-3 space-y-2.5 text-sm">
                          <Detail labelText="Status" value={label(account.billing_status)} />
                          <Detail labelText="Stripe customer" value={account.stripe_customer_id || "Not created"} mono />
                          <Detail labelText="Subscription" value={account.stripe_subscription_id || "Not active"} mono />
                          <Detail labelText="First payment" value={account.first_payment_completed_at ? shortDate.format(new Date(account.first_payment_completed_at)) : "Pending"} />
                        </dl>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Onboarding</p>
                        <dl className="mt-3 space-y-2.5 text-sm">
                          <Detail labelText="Stage" value={label(account.stage)} />
                          <Detail labelText="Agreement" value={account.agreement_signed_at ? shortDate.format(new Date(account.agreement_signed_at)) : "Not signed"} />
                          <Detail labelText="Intake" value={account.intake_completed_at ? "Completed" : "Not completed"} />
                          <Detail labelText="Kickoff" value={account.kickoff_scheduled_at ? shortDate.format(new Date(account.kickoff_scheduled_at)) : "Not scheduled"} />
                        </dl>
                      </div>
                    </div>

                    {account.notes && (
                      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">Account notes</p>
                        <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-zinc-500">{account.notes}</pre>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {account.contact_email && <CopyButton value={account.contact_email} labelText="Copy email" />}
                      <button
                        type="button"
                        disabled={!account.stripe_customer_id || portalBusy === account.id}
                        onClick={() => void createPortalLink(account)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {portalBusy === account.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                        Copy billing portal
                      </button>
                      {account.stripe_customer_id && (
                        <a
                          href={`https://dashboard.stripe.com/customers/${account.stripe_customer_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Open in Stripe
                        </a>
                      )}
                      <Link
                        href="/client-onboarding"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
                      >
                        <ChevronRight className="h-3.5 w-3.5" /> Open onboarding
                      </Link>
                      {account.contact_email && (
                        <a
                          href={`mailto:${account.contact_email}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-800"
                        >
                          <Mail className="h-3.5 w-3.5" /> Email client
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  alert = false,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  helper: string;
  alert?: boolean;
}) {
  return (
    <div className={clsx("rounded-2xl border bg-zinc-900/70 p-4", alert ? "border-red-500/20" : "border-zinc-800")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <div className={clsx("rounded-lg p-2", alert ? "bg-red-500/10 text-red-300" : "bg-zinc-800 text-zinc-400")}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={clsx("mt-3 text-2xl font-semibold tracking-tight", alert ? "text-red-200" : "text-zinc-100")}>{value}</div>
      <p className="mt-1 text-[11px] text-zinc-600">{helper}</p>
    </div>
  );
}

function Detail({ labelText, value, mono = false }: { labelText: string; value: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[118px_minmax(0,1fr)] gap-3">
      <dt className="text-zinc-600">{labelText}</dt>
      <dd className={clsx("min-w-0 break-words text-zinc-300", mono && "font-mono text-[11px] text-zinc-500")}>{value}</dd>
    </div>
  );
}
