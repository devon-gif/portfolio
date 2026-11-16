import Link from "next/link";
import { CREATIVE_PLANS, PRICING_SCOPE_NOTE, type CreativePlan } from "@/lib/creative-pricing";

function PlanCard({ plan }: { plan: CreativePlan }) {
  return (
    <article className={`st-card flex h-full flex-col p-7 md:p-8 ${plan.recommended ? "border-[var(--st-gold)]" : ""}`}>
      {plan.recommended ? <span className="st-kicker mb-3">Recommended</span> : null}
      <p className="st-kicker">{plan.kind === "monthly" ? plan.name : plan.eyebrow}</p>
      <h3 className="mt-3 font-serif text-[26px] leading-tight text-[var(--st-ink)]">{plan.title}</h3>
      <p className="mt-5 font-serif text-[40px] leading-none text-[var(--st-ink)]">
        {plan.price}<span className="ml-1 font-sans text-[15px] text-[var(--st-ink-soft)]">{plan.period}</span>
      </p>
      <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--st-ink-soft)]">{plan.description}</p>
      <ul className="my-6 space-y-3 border-t border-[var(--st-line)] pt-5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--st-ink-soft)]">
            <span aria-hidden="true" className="text-[var(--st-gold)]">✦</span>{feature}
          </li>
        ))}
      </ul>
      <Link href={`/contact?plan=${plan.id}`} className="st-btn mt-auto w-fit">{plan.cta}</Link>
    </article>
  );
}

export function HomePricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-[var(--st-cream)] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <span className="st-kicker">Engagement options</span>
          <h2 className="mt-4 font-serif text-[clamp(28px,4vw,46px)] leading-[1.08] text-[var(--st-ink)]">
            One project. Or ongoing creative support.
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[var(--st-ink-soft)]">
            Start with a defined deliverable, or reserve monthly creative capacity for your team.
            Scope, revisions and timing are agreed before kickoff.
          </p>
        </div>
        <article className="st-panel mt-10 p-7 md:p-9">
          <span className="st-kicker">Fixed-scope projects</span>
          <h3 className="mt-3 font-serif text-[clamp(26px,3.5vw,38px)] leading-tight text-[var(--st-ink)]">
            Investor decks, websites and dashboards.
          </h3>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            Send the materials you have, the outcome you need and your deadline. I will confirm the
            deliverables, fixed project quote and revision allowance before work starts.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link href="/contact?service=project" className="st-btn">Scope a project <span aria-hidden="true">→</span></Link>
            <Link href="/devon/investor-deal-rooms" className="text-sm text-[var(--st-gold)] underline underline-offset-4">See investor and project work</Link>
          </div>
        </article>
        <div className="mb-8 mt-14 max-w-3xl">
          <span className="st-kicker">Monthly partnerships</span>
          <h3 className="mt-3 font-serif text-[30px] leading-tight text-[var(--st-ink)]">Choose the capacity your team needs.</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--st-ink-soft)]">
            Monthly fees reserve the stated creative capacity across an agreed workload.
            They are not per-property asset bundles.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {CREATIVE_PLANS.filter((plan) => plan.kind === "monthly").map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {CREATIVE_PLANS.filter((plan) => plan.kind !== "monthly").map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-[13px] leading-relaxed text-[var(--st-ink-muted)]">{PRICING_SCOPE_NOTE}</p>
      </div>
    </section>
  );
}
