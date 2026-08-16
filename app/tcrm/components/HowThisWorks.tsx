import { Compass, SlidersHorizontal, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

/**
 * Compact 3-step explanation of the TCRM -> Archer Design -> hotel
 * relationship, in the client's own language. Sits directly under the hero
 * so a hotel GM understands the mechanism before seeing any pricing.
 */
const STEPS = [
  {
    num: "01",
    icon: Compass,
    title: "TCRM identifies the opportunity",
    body: "Revenue priorities, underperforming offers, events, F&B, meetings, seasonal demand, and direct-booking opportunities already surfaced through your TCRM relationship.",
  },
  {
    num: "02",
    icon: SlidersHorizontal,
    title: "You choose the level of creative support",
    body: "A monthly program, a 30-day starter, or an individual asset pack, sized to what your property needs right now.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Archer Design creates the campaign assets",
    body: "Finished motion and static creative, built around your property's existing brand, imagery, and offer.",
  },
];

export function HowThisWorks() {
  return (
    <section id="how-it-works" className="tl-section">
      <div className="tl-shell relative">
        <Reveal className="max-w-2xl">
          <p className="tl-eyebrow">How this works</p>
          <h2 className="mt-4 text-[1.9rem] leading-[1.15] sm:text-[2.35rem]">
            From identified opportunity to finished creative.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={(i + 1) as 1 | 2 | 3} className="tl-panel tl-howto-card p-7 sm:p-8">
              <div className="tl-howto-top">
                <span className="tl-howto-num" aria-hidden="true">
                  {step.num}
                </span>
                <span className="tl-howto-icon" aria-hidden="true">
                  <step.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <h3 className="mt-5 text-[17px] text-[var(--tl-ink)]">{step.title}</h3>
              <span className="tl-hline my-4" aria-hidden="true" />
              <p className="text-[13.5px] leading-relaxed text-[var(--tl-ink-soft)]">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
