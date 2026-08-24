"use client";

import { useMemo, useState } from "react";
import type { CheckoutOffer } from "@/lib/checkout-offers";
import { monthlyTotal, normalizePropertyCount } from "@/lib/checkout-offers";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function CheckoutClient({ offer, canceled = false }: { offer: CheckoutOffer; canceled?: boolean }) {
  const [planId, setPlanId] = useState(offer.plans[0]?.id ?? "");
  const selectedPlan = useMemo(
    () => offer.plans.find((plan) => plan.id === planId) ?? offer.plans[0],
    [offer.plans, planId]
  );
  const [propertyCount, setPropertyCount] = useState(selectedPlan?.fixedProperties ?? selectedPlan?.minProperties ?? 1);
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!selectedPlan) return null;

  const normalizedCount = normalizePropertyCount(selectedPlan, propertyCount);
  const total = monthlyTotal(selectedPlan, normalizedCount);
  const perProperty = selectedPlan.pricingModel === "per_property";
  const canChangeCount = !selectedPlan.fixedProperties && selectedPlan.maxProperties > selectedPlan.minProperties;

  function selectPlan(id: string) {
    const next = offer.plans.find((plan) => plan.id === id);
    if (!next) return;
    setPlanId(id);
    setPropertyCount(next.fixedProperties ?? next.minProperties);
    setError(null);
  }

  async function checkout() {
    setError(null);
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      setError("Please add your company, name, and email before continuing.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the monthly service and recurring billing terms before continuing.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/stripe/public-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_id: offer.id,
          plan_id: selectedPlan.id,
          property_count: normalizedCount,
          company_name: companyName,
          contact_name: contactName,
          contact_email: email,
          accepted_terms: acceptedTerms,
        }),
      });
      const json = (await response.json()) as { ok?: boolean; url?: string; error?: string };
      if (!response.ok || !json.ok || !json.url) {
        throw new Error(json.error ?? "Could not start checkout.");
      }
      window.location.assign(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
      <div>
        {canceled && (
          <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Checkout was canceled. Nothing was charged — your selections are still available below.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {offer.plans.map((plan) => {
            const active = plan.id === selectedPlan.id;
            const unitLabel = plan.pricingModel === "per_property" ? " / property / mo" : " / month";
            return (
              <button
                type="button"
                key={plan.id}
                onClick={() => selectPlan(plan.id)}
                className={`relative rounded-3xl border p-5 text-left transition ${
                  active
                    ? "border-[#C9A44C] bg-[rgba(201,164,76,0.1)] shadow-[0_0_44px_rgba(201,164,76,0.1)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {plan.badge && (
                  <span className="mb-3 inline-flex rounded-full bg-[#C9A44C] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#161006]">
                    {plan.badge}
                  </span>
                )}
                <h2 className="font-serif text-xl text-[#F6F1E7]">{plan.name}</h2>
                <div className="mt-2 text-2xl font-semibold text-[#E8D7A2]">
                  {money.format(plan.monthlyUnitAmount / 100)}
                  <span className="text-xs font-normal text-[#8F877B]">{unitLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#A9A092]">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-[13px] leading-relaxed text-[#B9B0A1]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-1 text-[9px] text-[#C9A44C]">◆</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className={`mt-5 text-xs font-semibold ${active ? "text-[#E8D7A2]" : "text-[#777066]"}`}>
                  {active ? "Selected" : "Choose this plan"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A9A092]">
                {offer.propertyLabel}
              </label>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!canChangeCount || normalizedCount <= selectedPlan.minProperties}
                  onClick={() => setPropertyCount(Math.max(selectedPlan.minProperties, normalizedCount - 1))}
                  className="h-11 w-11 rounded-xl border border-white/10 text-xl text-[#F6F1E7] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease property count"
                >
                  −
                </button>
                <input
                  type="number"
                  min={selectedPlan.minProperties}
                  max={selectedPlan.maxProperties}
                  disabled={!canChangeCount}
                  value={normalizedCount}
                  onChange={(event) => setPropertyCount(Number(event.target.value))}
                  className="h-11 w-24 rounded-xl border border-white/10 bg-black/30 px-3 text-center text-lg text-[#F6F1E7] outline-none focus:border-[#C9A44C] disabled:opacity-70"
                  aria-label={offer.propertyLabel}
                />
                <button
                  type="button"
                  disabled={!canChangeCount || normalizedCount >= selectedPlan.maxProperties}
                  onClick={() => setPropertyCount(Math.min(selectedPlan.maxProperties, normalizedCount + 1))}
                  className="h-11 w-11 rounded-xl border border-white/10 text-xl text-[#F6F1E7] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase property count"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#777066]">
                {selectedPlan.fixedProperties
                  ? `This package is built for exactly ${selectedPlan.fixedProperties} properties.`
                  : perProperty
                    ? `Your total is based on ${money.format(selectedPlan.monthlyUnitAmount / 100)} per property each month.`
                    : "This offer is flat-rate; the count is captured for onboarding and scope planning."}
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(201,164,76,0.2)] bg-[rgba(201,164,76,0.06)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8AA87]">Monthly total</p>
              <div className="mt-2 font-serif text-4xl text-[#E8D7A2]">{money.format(total / 100)}</div>
              <p className="mt-2 text-xs leading-relaxed text-[#8F877B]">
                Recurring monthly billing through Stripe. Cancel future renewals anytime through the billing portal.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-[#B9B0A1]">
              Company / organization
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                autoComplete="organization"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[#F6F1E7] outline-none focus:border-[#C9A44C]"
                placeholder="Company name"
              />
            </label>
            <label className="text-sm text-[#B9B0A1]">
              Your name
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                autoComplete="name"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[#F6F1E7] outline-none focus:border-[#C9A44C]"
                placeholder="Full name"
              />
            </label>
            <label className="text-sm text-[#B9B0A1] md:col-span-2">
              Work email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-[#F6F1E7] outline-none focus:border-[#C9A44C]"
                placeholder="you@company.com"
              />
            </label>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-[#A9A092]">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#C9A44C]"
            />
            <span>
              I agree to the{" "}
              <a href="/start/terms" target="_blank" className="text-[#E8D7A2] underline underline-offset-4">
                monthly service and recurring billing terms
              </a>
              . The subscription renews monthly until canceled. Cancellation stops future renewals; work already delivered or underway in the current billing period is not automatically refunded.
            </span>
          </label>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100" role="alert">
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => void checkout()}
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#C9A44C] px-5 py-4 text-sm font-bold text-[#161006] transition hover:bg-[#D9BA68] disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? "Opening secure checkout…" : `Continue to Stripe — ${money.format(total / 100)}/mo`}
          </button>
          <p className="mt-3 text-center text-xs text-[#777066]">
            Secure checkout is hosted by Stripe. Archer Design does not store your card number.
          </p>
        </div>
      </div>

      <aside className="lg:sticky lg:top-8">
        <div className="rounded-3xl border border-[rgba(201,164,76,0.2)] bg-[rgba(8,8,8,0.78)] p-6 shadow-[0_0_60px_rgba(201,164,76,0.08)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">Your selection</p>
          <h3 className="mt-3 font-serif text-2xl text-[#F6F1E7]">{selectedPlan.name}</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <dt className="text-[#8F877B]">{offer.propertyLabel}</dt>
              <dd className="font-semibold text-[#F6F1E7]">{normalizedCount}</dd>
            </div>
            {perProperty && (
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <dt className="text-[#8F877B]">Per property</dt>
                <dd className="font-semibold text-[#F6F1E7]">{money.format(selectedPlan.monthlyUnitAmount / 100)}</dd>
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <dt className="text-[#8F877B]">Due today</dt>
              <dd className="text-right">
                <div className="font-serif text-3xl text-[#E8D7A2]">{money.format(total / 100)}</div>
                <div className="mt-1 text-xs text-[#777066]">then monthly until canceled</div>
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-xs leading-relaxed text-[#8F877B]">
            <strong className="text-[#D8CFBE]">After checkout:</strong> your selection is added to Archer Design onboarding, billing is activated in Stripe, and we confirm access, priorities, approvals, and kickoff details.
          </div>
        </div>
      </aside>
    </div>
  );
}
