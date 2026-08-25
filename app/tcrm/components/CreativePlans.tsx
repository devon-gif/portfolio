import Link from "next/link";
import { ArrowRight, Film, LayoutGrid, MessageSquareText, CheckCircle2 } from "lucide-react";
import { ACTIVATION_TIERS, CORE_INCLUDES, fmtMoney, totalConcepts, type ActivationTier } from "../tcrm-pricing";
import { Reveal } from "./Reveal";
import { PlanFlexibilityNotice } from "./PlanFlexibilityNotice";

/**
 * MonthlyPlanCard: one of the three ongoing Revenue Priority Creative
 * Activation tiers (Essential / Growth / Full Campaign), rebuilt so a
 * hotel GM can compare all three in 10-15 seconds. Every deliverable
 * number is read from tcrm-pricing.ts, never restated here -- wholesale
 * cost and gross-profit figures are intentionally never rendered on this
 * client-facing card.
 */
function MonthlyPlanCard({ tier, index }: { tier: ActivationTier; index: number }) {
  const scopeChips = Array.from(new Set([...tier.features, ...CORE_INCLUDES]));

  return (
    <Reveal delay={(index + 1) as 1 | 2 | 3} className={`tl-panel${tier.badge ? " tl-panel--featured" : ""} flex flex-col p-7 sm:p-8`}>
      {tier.badge ? <span className="tl-pkg-badge">{tier.badge}</span> : null}

      <h3 className="mt-1 text-[21px] text-[var(--tl-ink)]">{tier.name}</h3>
      <p className="tl-pkg-price mt-2">{fmtMoney(tier.retail)} / month</p>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--tl-ink-soft)]">
        <strong className="font-medium text-[var(--tl-ink)]">Best for:</strong> {tier.bestFor}
      </p>

      <span className="tl-hline my-6" aria-hidden="true" />

      <p className="tl-pkg-subhead">What you receive</p>
      <div className="tl-receive-grid mt-4">
        <div className="tl-receive-row">
          <span className="tl-receive-icon" aria-hidden="true">
            <Film className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="tl-receive-num">{tier.motionConcepts}</span>
          <span className="tl-receive-label">Motion concepts / month</span>
        </div>
        <div className="tl-receive-row">
          <span className="tl-receive-icon" aria-hidden="true">
            <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="tl-receive-num">{tier.staticConcepts}</span>
          <span className="tl-receive-label">Static graphics / month</span>
        </div>
        <div className="tl-receive-row">
          <span className="tl-receive-icon" aria-hidden="true">
            <MessageSquareText className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="tl-receive-num">{tier.captions}</span>
          <span className="tl-receive-label">Captions / month</span>
        </div>
      </div>
      <p className="mt-3 text-[11.5px] text-[var(--tl-ink-muted)]">
        {totalConcepts(tier)} total original concepts every month.
      </p>

      <span className="tl-hline my-6" aria-hidden="true" />

      <p className="tl-pkg-subhead">Also included</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {scopeChips.map((item) => (
          <li key={item} className="tl-check">
            <span className="tl-check-icon" aria-hidden="true">
              <CheckCircle2 size={11} strokeWidth={2} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <PlanFlexibilityNotice compact />
<Link href={`/tcrm/schedule?plan=${tier.key}`} className="tl-btn mt-8">
        Choose Your Creative Plan
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}

export function CreativePlans() {
  return (
    <section id="plans" className="tl-section">
      <div className="tl-grid-field" aria-hidden="true" />
      <div className="tl-shell relative">
        <Reveal className="max-w-2xl">
          <p className="tl-eyebrow">Creative plans</p>
          <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">Choose the level of support.</h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-[var(--tl-ink-soft)]">
            Different properties need different amounts of creative production. Pick the plan that matches
            what your property has going on this month, F&amp;B, events, seasonal offers, or a single
            revenue priority.
          </p>
        </Reveal>

        <p className="tl-pkg-subhead mt-10">Ongoing support</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {ACTIVATION_TIERS.map((tier, i) => (
            <MonthlyPlanCard key={tier.key} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
