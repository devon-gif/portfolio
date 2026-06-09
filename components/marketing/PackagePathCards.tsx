"use client";

import { LazyVideo } from "./LazyVideo";
import { FEATURED_VIDEOS } from "./media";

const stroke = {
  fill: "none",
  stroke: "#C9A44C",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PATHS = [
  {
    title: "Hotels",
    body: "Creative systems for hotel groups, boutique properties, meetings, F&B, and seasonal campaigns, built to support visibility and booking interest.",
    cta: "See hotel package",
    video: FEATURED_VIDEOS[0].src,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M3 21h18" />
        <path d="M5 21V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16" />
        <path d="M9 8h.01M12 8h.01M15 8h.01M9 12h.01M12 12h.01M15 12h.01" />
      </svg>
    ),
  },
  {
    title: "Spas",
    body: "Wellness, treatment, and local SEO content that helps guests understand what to book and why now.",
    cta: "See spa package",
    video: FEATURED_VIDEOS[1].src,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M12 22c0-5 0-8 0-8" />
        <path d="M12 14c-3 0-6-2.5-6-6 3 0 6 2 6 6Z" />
        <path d="M12 14c3 0 6-2.5 6-6-3 0-6 2-6 6Z" />
      </svg>
    ),
  },
  {
    title: "Restaurants",
    body: "Menu, event, and local campaign creative designed to keep offers visible and tables top of mind.",
    cta: "See restaurant package",
    video: FEATURED_VIDEOS[2].src,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" {...stroke}>
        <path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10" />
        <path d="M17 3c-1.7 0-3 2-3 5s1.3 4 3 4v9" />
      </svg>
    ),
  },
];

export function PackagePathCards() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
          Tailored packages for every property
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PATHS.map((p) => (
            <a
              key={p.title}
              href="#packages"
              className="glass-card-strong group relative flex h-80 flex-col justify-end overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A44C] hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
            >
              {/* background video */}
              <LazyVideo
                src={p.video}
                className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.25),rgba(5,5,5,0.88))]" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[rgba(232,215,162,0.12)]" />

              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,164,76,0.4)] bg-[#050505]/60">
                {p.icon}
              </span>
              <h3 className="font-serif text-2xl text-[#F6F1E7]">{p.title}</h3>
              <p className="mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-[#D8CFBE]">{p.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A44C]">
                {p.cta} <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
