import Link from "next/link";
import { OnDemandPackBuilder } from "@/components/marketing/OnDemandPackBuilder";
import { ARCHER_PRICING, MONTHLY_PLANS, formatMoney } from "@/app/packages/pricing";

const CORE_MONTHLY = [
  "Standard social-format exports",
  "Promotional copy incorporated into designs",
  "Brand-safe execution using approved property materials",
  "One consolidated minor revision round",
  "Human review before delivery",
];

export function HomepagePricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="st-kicker">Pricing & ways to work together</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,4vw,48px)] leading-[1.08] text-[var(--st-ink)]">
            Creative when you need it. Ongoing support when you want it.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            You do not need a monthly contract just to get polished creative. Build a one-off pack for what you need now, try a focused 30-day starter, or choose monthly support when the volume makes sense.
          </p>
        </div>

        <div id="on-demand" className="scroll-mt-24 mt-12">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Option 1 · No contract</p>
              <h3 className="mt-2 font-serif text-[25px] text-[var(--st-ink)]">Build your own creative pack</h3>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-[var(--st-ink-muted)]">
              Best for events, menu launches, seasonal offers, wedding pushes, meeting-space campaigns, and one-off social needs.
            </p>
          </div>
          <OnDemandPackBuilder />
        </div>

        <div id="starter" className="scroll-mt-24 mt-16 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <div className="st-panel p-8 lg:p-10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Option 2 · One-time 30 days</span>
            <h3 className="mt-4 font-serif text-[clamp(25px,3vw,38px)] leading-[1.08] text-[var(--st-ink)]">30-Day Creative Starter</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
              Try a full month of Essential-level production on your actual property before deciding whether ongoing support is useful.
            </p>
            <div className="mt-7 flex items-end gap-2">
              <span className="font-serif text-[42px] leading-none text-[var(--st-ink)]">{formatMoney(ARCHER_PRICING.starter)}</span>
              <span className="pb-1 text-[12px] text-[var(--st-ink-muted)]">one-time</span>
            </div>
            <p className="mt-3 text-[12px] font-semibold text-[var(--st-gold)]">No ongoing commitment required.</p>
            <Link href="/contact?plan=starter" className="st-btn mt-7">
              Start a 30-day sprint <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="st-card p-8 lg:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">Included for one property</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[var(--st-cream)] p-5">
                <p className="font-serif text-[30px] text-[var(--st-ink)]">6</p>
                <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">motion concepts</p>
              </div>
              <div className="rounded-xl bg-[var(--st-cream)] p-5">
                <p className="font-serif text-[30px] text-[var(--st-ink)]">6</p>
                <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">static concepts</p>
              </div>
              <div className="rounded-xl bg-[var(--st-cream)] p-5">
                <p className="font-serif text-[30px] text-[var(--st-ink)]">12</p>
                <p className="mt-1 text-[12px] text-[var(--st-ink-soft)]">concise captions</p>
              </div>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "One defined 30-day creative period",
                "Built from your real property assets and offers",
                "Standard social-format exports",
                "One consolidated minor revision round",
                "Human review before delivery",
                "Option to continue afterward — only if it makes sense",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--st-ink-soft)]">
                  <span className="mt-[2px] shrink-0 text-[var(--st-gold)]">✦</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="monthly" className="scroll-mt-24 mt-16">
          <div className="max-w-2xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Option 3 · Ongoing support</span>
            <h3 className="mt-3 font-serif text-[clamp(25px,3vw,38px)] leading-[1.08] text-[var(--st-ink)]">
              More output when creative is an every-month need.
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
              Monthly plans are built for properties with enough promotions, events, F&B, meetings, packages, and seasonal moments to benefit from a steady production rhythm.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {MONTHLY_PLANS.map((plan) => (
              <div key={plan.key} className={`st-card relative flex flex-col p-7 ${plan.badge ? "border-[var(--st-gold)]" : ""}`}>
                {plan.badge ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[var(--st-ink)] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--st-ivory)]">{plan.badge}</span>
                ) : null}
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--st-gold)]">Monthly</p>
                <h4 className="mt-3 font-serif text-[25px] text-[var(--st-ink)]">{plan.name}</h4>
                <p className="mt-5 font-serif text-[38px] leading-none text-[var(--st-ink)]">
                  {formatMoney(plan.price)}<span className="text-[13px] font-sans text-[var(--st-ink-muted)]">/mo</span>
                </p>
                <p className="mt-4 min-h-[62px] text-[13px] leading-relaxed text-[var(--st-ink-soft)]">{plan.bestFor}</p>

                <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[var(--st-line)] py-5 text-center">
                  <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.motion}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">motion</p></div>
                  <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.static}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">static</p></div>
                  <div><p className="font-serif text-[23px] text-[var(--st-ink)]">{plan.captions}</p><p className="mt-1 text-[10px] text-[var(--st-ink-muted)]">captions</p></div>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-[var(--st-ink-soft)]">
                      <span className="mt-[1px] shrink-0 text-[var(--st-gold)]">✦</span>{item}
                    </li>
                  ))}
                </ul>

                <Link href={`/contact?plan=${plan.key}`} className={plan.badge ? "st-btn mt-7 justify-center" : "st-btn-ghost mt-7 justify-center"}>
                  Ask about {plan.name} <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="st-panel mt-8 p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--st-ink-muted)]">Included across monthly plans</p>
            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
              {CORE_MONTHLY.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-[12.5px] text-[var(--st-ink-soft)]"><span className="text-[var(--st-gold)]">✦</span>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
