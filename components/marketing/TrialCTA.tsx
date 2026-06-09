import { GOLD_GRADIENT } from "./media";

const INCLUDES = [
  "Free — no card, no contract",
  "5 finished assets in 7 days",
  "Built from your existing photos and details",
  "One round of feedback included",
  "No obligation to continue",
];

export function TrialCTA() {
  return (
    <section id="trial" className="px-6 py-24">
      <div className="glass-card-strong mx-auto max-w-3xl rounded-3xl p-10 text-center md:p-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
          Free trial
        </span>
        <h2 className="mt-3 font-serif text-[clamp(28px,4vw,44px)] font-semibold leading-tight text-[#F6F1E7]">
          See 5 finished pieces before you spend a dollar.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#A9A092]">
          Send your existing property photos, menu items, event details, or seasonal campaign notes.
          Within 7 days, you&apos;ll have 5 polished, campaign-ready assets built from your own
          material — so you can judge the quality on your brand, not a portfolio.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {INCLUDES.map((i) => (
            <span
              key={i}
              className="rounded-full border border-[rgba(201,164,76,0.24)] bg-[rgba(5,5,5,0.26)] px-3.5 py-1.5 text-[13px] text-[#E8D7A2] backdrop-blur-md"
            >
              ✓ {i}
            </span>
          ))}
        </div>

        <a
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
          style={{ background: GOLD_GRADIENT }}
        >
          Get 5 Free Sample Assets <span aria-hidden>→</span>
        </a>

        <p className="mt-4 text-[13px] text-[#A9A092]">No call required. No card. 5 finished pieces in 7 days.</p>

        <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-[#A9A092]/70">
          If you&apos;re evaluating creative support for a multi-property group, mention it in your
          request — we&apos;ll build the samples across more than one property.
        </p>
      </div>
    </section>
  );
}
