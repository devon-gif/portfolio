// Glass proof card — 5 key metrics, sourced from SHAIPE grouped report
// Dec 31 2020 – Jun 14 2026 across all tracked hospitality profiles.
// Safe attribution: no direct booking claims.

import { PROOF } from "@/lib/proof-stats";

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
    num: PROOF.impressions,
    label: "Impressions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    num: PROOF.engagements,
    label: "Direct Engagements",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 20.5l8.8-8.8a5 5 0 0 0 0-7.1Z" />
      </svg>
    ),
  },
  {
    num: PROOF.reach,
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
    num: PROOF.post_clicks,
    label: "Reported Post Clicks",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M15 3h6v6" />
        <path d="M10 14L21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    ),
  },
  {
    num: PROOF.engagement_rate,
    label: "Engagement Rate",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export function MetricsStrip() {
  return (
    <section className="px-6 pb-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card-strong grid grid-cols-2 divide-y divide-[rgba(201,164,76,0.16)] rounded-2xl sm:grid-cols-3 md:grid-cols-5 md:divide-y-0 md:divide-x">
          {METRICS.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-2 px-4 py-7 text-center">
              <span className="text-[#C9A44C]">{m.icon}</span>
              <span className="font-serif text-[clamp(22px,2.6vw,34px)] leading-none text-[#F6F1E7]">
                {m.num}
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#A9A092]">{m.label}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-center text-[13px] text-[#A9A092]">
          Tracked across hotel, restaurant, event, and wellness campaigns. Impressions, reach, engagement, and reported post clicks sourced from SHAIPE-tracked hospitality profiles. Direct booking attribution depends on property-level tracking setup.
        </p>
      </div>
    </section>
  );
}
