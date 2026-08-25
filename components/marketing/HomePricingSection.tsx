"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MonthlyPlan = {
  name: string;
  price: string;
  note: string;
  features: string[];
  badge?: string;
  featured?: boolean;
  query: string;
};

const STATIC_PRICE = 75;
const MOTION_PRICE = 95;

const MONTHLY_PLANS: MonthlyPlan[] = [
  {
    name: "Essentials",
    price: "$800/mo",
    note: "A focused monthly creative rhythm for one active property or brand.",
    features: [
      "4–6 finished creative assets each month",
      "Static + short-form motion mix",
      "Seasonal, local-demand, F&B, or event promos",
      "Captions included",
      "One monthly planning touchpoint",
    ],
    query: "essentials-800",
  },
  {
    name: "Growth",
    price: "$1,000/mo",
    note: "More room for active campaigns, motion, events, F&B, and ongoing property storytelling.",
    features: [
      "8–10 finished creative assets each month",
      "Regular motion / short-form video",
      "Campaign planning across property revenue moments",
      "F&B, event, package, meeting, or wedding support",
      "Monthly performance recap",
    ],
    badge: "Recommended",
    featured: true,
    query: "growth-1000",
  },
  {
    name: "Portfolio Studio",
    price: "$1,200/mo",
    note: "The broader outside creative-studio role for properties with higher volume and more channels to support.",
    features: [
      "12–16 finished creative assets each month",
      "Priority motion and campaign production",
      "Full monthly content calendar",
      "Email / landing-page creative support",
      "Event, F&B, seasonal, and sales-campaign support",
      "Reporting and monthly optimization",
    ],
    query: "portfolio-studio-1200",
  },
];

function Counter({
  label,
  price,
  value,
  onChange,
}: {
  label: string;
  price: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--st-line)] bg-white/55 px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[var(--st-ink)]">{label}</div>
        <div className="text-[12px] text-[var(--st-ink-muted)]">${price} each</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--st-line)] bg-white text-[18px] text-[var(--st-ink)] transition hover:border-[var(--st-gold)]"
          aria-label={`Remove one ${label.toLowerCase()}`}
        >
          −
        </button>
        <span className="w-5 text-center font-serif text-[20px] text-[var(--st-ink)]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(6, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--st-line)] bg-white text-[18px] text-[var(--st-ink)] transition hover:border-[var(--st-gold)]"
          aria-label={`Add one ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function HomePricingSection() {
  const [staticCount, setStaticCount] = useState(1);
  const [motionCount, setMotionCount] = useState(0);
  const total = useMemo(
    () => staticCount * STATIC_PRICE + motionCount * MOTION_PRICE,
    [staticCount, motionCount]
  );
  const hasSelection = staticCount + motionCount > 0;

  return (
    <section id="pricing" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="st-kicker">Pricing</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,4vw,46px)] leading-[1.08] text-[var(--st-ink)]">
            Start small, stay flexible, or plug Archer in as your monthly creative team.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            You do not have to start with a large retainer. Buy a single asset when you need it, keep a small monthly creative lane open, or choose a fuller property-level partnership.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="st-panel p-7 md:p-8">
            <span className="st-kicker">One-off creative</span>
            <h3 className="mt-3 font-serif text-[26px] text-[var(--st-ink)]">Buy only what you need.</h3>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
              Need one graphic for an event, a restaurant special, a package, or a quick motion piece? Choose the exact mix with no monthly commitment.
            </p>

            <div className="mt-6 space-y-3">
              <Counter label="Static graphic" price={STATIC_PRICE} value={staticCount} onChange={setStaticCount} />
              <Counter label="Motion graphic" price={MOTION_PRICE} value={motionCount} onChange={setMotionCount} />
            </div>

            <div className="mt-6 flex items-end justify-between gap-5 border-t border-[var(--st-line)] pt-5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--st-ink-muted)]">Your one-off total</div>
                <div className="mt-1 font-serif text-[34px] leading-none text-[var(--st-ink)]">${total.toLocaleString("en-US")}</div>
              </div>
              {hasSelection ? (
                <Link
                  href={{
                    pathname: "/contact",
                    query: {
                      service: "one-off-creative",
                      static: String(staticCount),
                      motion: String(motionCount),
                      total: String(total),
                    },
                  }}
                  className="st-btn"
                >
                  Request these assets <span aria-hidden>→</span>
                </Link>
              ) : (
                <button type="button" disabled className="st-btn opacity-45">
                  Choose an asset
                </button>
              )}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-[var(--st-ink-muted)]">
              One property or brand · one consolidated minor revision round · finished campaign-ready files.
            </p>
          </div>

          <div className="st-card border-[var(--st-gold-soft)] p-7 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="st-kicker">Creative Lite</span>
              <span className="rounded-full border border-[var(--st-gold-soft)] bg-[var(--st-gold-pale)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--st-gold)]">
                Low-commitment monthly
              </span>
            </div>
            <h3 className="mt-3 font-serif text-[27px] text-[var(--st-ink)]">$299.99/mo</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">
              A small recurring creative lane for properties that need dependable support but are not ready for a full monthly program.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] text-[var(--st-ink-soft)]">
              {[
                "Up to 4 finished assets each month",
                "Up to 1 motion piece; remaining assets are static",
                "Captions included",
                "One consolidated minor revision round",
                "One property or brand",
                "Month-to-month — cancel anytime",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-[2px] text-[var(--st-gold)]">✦</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact?plan=creative-lite-299" className="st-btn mt-7 inline-flex">
              Choose Creative Lite <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="st-kicker">Monthly partnerships</span>
            <h3 className="mt-3 font-serif text-[clamp(24px,3vw,34px)] text-[var(--st-ink)]">
              Property-level creative support at $800, $1,000, or $1,200 per month.
            </h3>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-[var(--st-ink-muted)]">
            Rates are per active property or brand. Multi-property scopes can be coordinated under one workflow and invoice.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {MONTHLY_PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex h-full flex-col rounded-2xl border p-7 shadow-[var(--st-shadow-soft)] ${
                plan.featured
                  ? "border-[var(--st-gold)] bg-white"
                  : "border-[var(--st-line)] bg-[rgba(255,255,255,0.72)]"
              }`}
            >
              {plan.badge && (
                <span className="mb-4 self-start rounded-full border border-[var(--st-gold-soft)] bg-[var(--st-gold-pale)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--st-gold)]">
                  {plan.badge}
                </span>
              )}
              <h4 className="font-serif text-[24px] text-[var(--st-ink)]">{plan.name}</h4>
              <div className="mt-2 font-serif text-[32px] leading-none text-[var(--st-gold)]">{plan.price}</div>
              <p className="mt-4 text-[14px] leading-relaxed text-[var(--st-ink-soft)]">{plan.note}</p>
              <ul className="mt-6 flex-1 space-y-3 text-[13.5px] text-[var(--st-ink-soft)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-[2px] text-[var(--st-gold)]">✦</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/contact?plan=${plan.query}`} className={plan.featured ? "st-btn mt-7 inline-flex" : "st-btn-ghost mt-7 inline-flex"}>
                Choose {plan.name} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[12.5px] leading-relaxed text-[var(--st-ink-muted)]">
          All monthly plans are month-to-month unless a separate agreement says otherwise. Final scope is confirmed before kickoff so the asset mix matches the property&apos;s actual campaign calendar.
        </p>
      </div>
    </section>
  );
}
