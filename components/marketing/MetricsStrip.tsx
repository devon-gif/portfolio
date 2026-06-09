// Glass proof card - 4 metrics with gold line-icons + vertical dividers,
// sits directly under the hero (matches the mockup).

type Metric = { num: string; label: string; icon: React.ReactNode };

const stroke = {
  fill: "none",
  stroke: "#C9A44C",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const METRICS: Metric[] = [
  {
    num: "13.9M+",
    label: "Impressions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    num: "543K+",
    label: "Direct Engagements",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 20.5l8.8-8.8a5 5 0 0 0 0-7.1Z" />
      </svg>
    ),
  },
  {
    num: "3.6M+",
    label: "Reach",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        <path d="M16 11a3 3 0 0 0 0-6" />
        <path d="M22 20c0-2.6-1.8-4.8-4.5-5.6" />
      </svg>
    ),
  },
  {
    num: "2.4K+",
    label: "Assets Delivered",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M12 3l2.6 5.6 6 .7-4.4 4 1.2 6L12 16.9 6.6 19.3l1.2-6L3.4 9.3l6-.7L12 3Z" />
      </svg>
    ),
  },
];

export function MetricsStrip() {
  return (
    <section className="px-6 pb-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card-strong grid grid-cols-2 divide-y divide-[rgba(201,164,76,0.16)] rounded-2xl md:grid-cols-4 md:divide-y-0 md:divide-x">
          {METRICS.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-2 px-4 py-7 text-center">
              <span className="text-[#C9A44C]">{m.icon}</span>
              <span className="font-serif text-[clamp(26px,3vw,38px)] leading-none text-[#F6F1E7]">
                {m.num}
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#A9A092]">{m.label}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[14px] text-[#E8D7A2]">
          13.9M+ impressions &middot; 543K+ direct engagements &middot; 3.6M+ reach &middot; 2,400+ assets delivered
        </p>
        {/* TODO(devon): Fill in your real start year below. */}
        <p className="mx-auto mt-2 max-w-3xl text-center text-[13px] text-[#A9A092]">
          Across 5 hospitality brands since 2024, hotels, restaurants, spas, and event venues in
          active markets.
        </p>
      </div>
    </section>
  );
}
