import { GOLD_GRADIENT } from "./media";

/**
 * Starter Sprint — the $950 one-time paid pilot. Sits between the free
 * sample-assets section and the monthly packages so the page reads as a
 * ladder: free samples → paid sprint → monthly plans.
 */
const BULLETS = [
  "15 finished, approval-ready assets in 7 days",
  "Social graphics, F&B and event promos, captions included",
  "Built from the photos and details you already have",
  "One round of revisions included",
  "Move to any monthly plan within 30 days and the full $950 is credited toward your first month",
];

export function StarterSprint() {
  return (
    <section id="sprint" className="px-6 py-20 scroll-mt-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Copy */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Paid pilot
            </span>
            <h2 className="mt-3 font-serif text-[clamp(28px,4vw,44px)] font-semibold leading-tight text-[#F6F1E7]">
              Not ready for a monthly plan? Start with a Sprint.
            </h2>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[#A9A092]">
              The Starter Sprint is a one-time, fixed-scope engagement: send us your property
              photos, menus, and event details, and within 7 days you&apos;ll have 15 finished,
              approval-ready assets — social graphics, promos, and captions, built on your brand.
              No contract, no onboarding project, no monthly commitment.
            </p>
          </div>

          {/* Offer card */}
          <div
            className="glass-card-strong rounded-3xl p-8"
            style={{
              borderColor: "transparent",
              boxShadow: "0 0 60px rgba(201,164,76,0.16)",
              backgroundImage: `linear-gradient(#11100E,#11100E), ${GOLD_GRADIENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "1.5px solid transparent",
            }}
          >
            <h3 className="font-serif text-2xl text-[#F6F1E7]">Starter Sprint</h3>
            <div className="mt-2 font-serif text-3xl text-[#C9A44C]">
              $950 <span className="text-base text-[#A9A092]">— one-time</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-[14.5px] text-[#A9A092]">
              {BULLETS.map((b) => (
                <li key={b} className="relative pl-5">
                  <span className="absolute left-0 top-[7px] text-[9px] text-[#C9A44C]">◆</span>
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
              style={{ background: GOLD_GRADIENT }}
            >
              Start a Sprint <span aria-hidden>→</span>
            </a>
            <p className="mt-3 text-center text-[12px] text-[#A9A092]/80">
              One Sprint per property. Best for teams evaluating ongoing creative support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
