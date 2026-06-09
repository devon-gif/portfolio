import { GOLD_GRADIENT } from "./media";

const stroke = {
  fill: "none",
  stroke: "#C9A44C",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STEPS = [
  {
    number: "01",
    title: "Send what you have.",
    body: "Property photos, menus, event details, spa services, seasonal notes. No photo shoot, no creative brief, no onboarding project.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Get finished creative back.",
    body: "Polished social graphics, short-form motion, and campaign assets, delivered on a monthly plan, with captions included.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Stay visible, every month.",
    body: "Rooms, restaurants, events, and spa services stay in front of guests between your big campaigns, without adding headcount.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            How it works
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4.4vw,48px)] font-semibold leading-[1.05] text-[#F6F1E7]">
            From the photos you already have to a live campaign in days.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="glass-card-strong rounded-2xl p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(201,164,76,0.28)] bg-[rgba(5,5,5,0.42)] text-[#C9A44C]"
                >
                  {step.icon}
                </span>
                <span
                  className="font-serif text-[clamp(36px,4vw,52px)] leading-none text-[#F6F1E7]/10 select-none"
                  aria-hidden
                >
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-xl leading-snug text-[#F6F1E7]">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#A9A092]">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#1a1407] shadow-[0_6px_30px_rgba(201,164,76,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,164,76,0.4)]"
            style={{ background: GOLD_GRADIENT }}
          >
            Get 5 Free Sample Assets <span aria-hidden>→</span>
          </a>
          <p className="mt-3 text-[13px] text-[#A9A092]">No call required. No card. 5 finished pieces in 7 days.</p>
        </div>
      </div>
    </section>
  );
}
