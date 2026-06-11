import { GOLD_GRADIENT } from "./media";

const INCLUDES = [
  "5 sample assets in 7 days",
  "No card required",
  "Built from your existing photos and details",
  "One round of feedback included",
  "Best for qualified hospitality teams evaluating monthly creative support",
];

export function TrialCTA() {
  return (
    <section id="trial" className="px-6 py-24">
      <div className="glass-card-strong mx-auto max-w-3xl rounded-3xl p-10 text-center md:p-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
          Sample assets
        </span>
        <h2 className="mt-3 font-serif text-[clamp(28px,4vw,44px)] font-semibold leading-tight text-[#F6F1E7]">
          See the quality before the first invoice.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#A9A092]">
          Send your property photos, campaign details, or event notes. Within 7 days you&apos;ll
          have 5 polished, approval-ready assets built from your own material. Judge the quality on
          your brand before committing to a monthly partnership.
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
          Request 5 Sample Assets <span aria-hidden>→</span>
        </a>

        <p className="mt-4 text-[13px] text-[#A9A092]">No card required. 5 finished, approval-ready pieces in 7 days.</p>

        <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-[#A9A092]/70">
          If you&apos;re evaluating creative support for a multi-property group, mention it in your
          request, we&apos;ll build the samples across more than one property.
        </p>
      </div>
    </section>
  );
}
