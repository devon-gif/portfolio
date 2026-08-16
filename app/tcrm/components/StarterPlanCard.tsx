import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { fmtMoney, starterTier, STARTER_PLAN_COPY, STARTER_PLAN_KEY, totalConcepts } from "../tcrm-pricing";
import { Reveal } from "./Reveal";

/**
 * 30-Day Creative Starter: the lower-commitment way to try the workflow.
 * Priced and scoped identically to one month of Essential (see
 * starterTier() in tcrm-pricing.ts) -- there is no separate, invented
 * price or deliverable count here.
 */
export function StarterPlanCard() {
  const tier = starterTier();

  return (
    <Reveal delay={1} className="tl-panel tl-starter-card flex flex-col p-7 sm:p-8">
      <span className="tl-role-tag tl-role-tag--archer">One-time</span>
      <h3 className="mt-2 text-[21px] text-[var(--tl-ink)]">{STARTER_PLAN_COPY.name}</h3>
      <p className="tl-pkg-price mt-2">{fmtMoney(tier.retail)} one time, for 30 days</p>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--tl-ink-soft)]">
        <strong className="font-medium text-[var(--tl-ink)]">Best for:</strong> {STARTER_PLAN_COPY.bestFor}
      </p>

      <span className="tl-hline my-6" aria-hidden="true" />

      <p className="tl-pkg-subhead">
        Same production scope as Essential ({totalConcepts(tier)} original concepts, {tier.captions} captions)
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {STARTER_PLAN_COPY.bullets.map((item) => (
          <li key={item} className="tl-check">
            <span className="tl-check-icon" aria-hidden="true">
              <CheckCircle2 size={11} strokeWidth={2} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[12px] italic leading-relaxed text-[var(--tl-ink-muted)]">
        {STARTER_PLAN_COPY.continueNote}
      </p>

      <Link href={`/tcrm/schedule?plan=${STARTER_PLAN_KEY}`} className="tl-btn mt-8">
        Start a 30-Day Creative Month
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </Link>
    </Reveal>
  );
}
