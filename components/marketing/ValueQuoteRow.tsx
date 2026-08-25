// Value strip (3 quick reasons) + proof-based case study row.
// No fabricated testimonials or invented quotes/star ratings — case studies below
// describe real, tracked work for named Pittsburgh-area properties.

const stroke = {
  fill: "none",
  stroke: "#C9A44C",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const VALUES = [
  {
    title: "No hire needed",
    body: "Design, social, video, and SEO support without four new roles on payroll.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        <path d="M16 11a3 3 0 0 0 0-6" />
      </svg>
    ),
  },
  {
    title: "No photo shoot needed to start",
    body: "We start from your existing assets and create new branded graphics, motion, and polished visuals as needed.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    ),
  },
  {
    title: "Built for portfolios",
    body: "Consistent creative across every property, from one partner.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5" />
      </svg>
    ),
  },
];

const CASE_STUDIES = [
  {
    property: "Hotel Indigo Pittsburgh",
    category: "Hotel & property creative",
    summary:
      "Ongoing property-level creative and local campaign support for a boutique lifestyle hotel, keeping rooms, amenities, and seasonal offers consistently visible across social and Google Business.",
  },
  {
    property: "Eliza Hot Metal Bistro",
    category: "F&B, events & seasonal campaigns",
    summary:
      "A repeatable creative engine for menus, brunch, private dining, and seasonal promos, turning F&B and event content into a steady stream of packaged campaign visuals.",
  },
  {
    property: "Hampton Inn Greensburg / Johnstown",
    category: "Select-service local visibility",
    summary:
      "Proof that branded select-service hotels can build strong local visibility with consistent property-level creative, without a dedicated in-house marketer.",
  },
  {
    property: "Elements Salon & Wellness",
    category: "Spa & wellness opening campaign",
    summary:
      "Launch and local-awareness creative for a spa and wellness opening, packaging treatments, gift cards, and seasonal services into a clear campaign rollout.",
  },
];

export function ValueQuoteRow() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* 3-card value strip */}
        <div className="glass-card grid grid-cols-1 divide-y divide-[rgba(201,164,76,0.16)] rounded-2xl sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          {VALUES.map((v) => (
            <div key={v.title} className="flex flex-col gap-2 px-6 py-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,164,76,0.28)] bg-[rgba(5,5,5,0.42)] text-[#C9A44C] shadow-[0_0_18px_rgba(201,164,76,0.12)]">
                {v.icon}
              </span>
              <h3 className="font-serif text-lg leading-snug text-[#F6F1E7]">{v.title}</h3>
              <p className="text-[13px] leading-relaxed text-[#A9A092]">{v.body}</p>
            </div>
          ))}
        </div>

        {/* Client results header */}
        <div className="mt-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Proof from tracked campaigns
            </span>
            <h2 className="mt-3 font-serif text-[clamp(28px,4vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
              Real Pittsburgh-area hospitality work, not stock case studies.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#A9A092]">
              When properties need event promos, social content, restaurant campaigns, and
              fast-turnaround creative, Archer Design is the extra team they don&apos;t have to hire.
            </p>
          </div>

          {/* Case studies */}
          <div className="mt-8 -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {CASE_STUDIES.map((item) => (
              <figure
                key={item.property}
                className="glass-card-strong min-w-[84%] snap-start rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-0.5 lg:min-w-0"
              >
                <span className="inline-block rounded-full border border-[rgba(201,164,76,0.28)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A44C]">
                  {item.category}
                </span>
                <h3 className="mt-4 font-serif text-[17px] leading-snug text-[#F6F1E7]">
                  {item.property}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#A9A092]">{item.summary}</p>
              </figure>
            ))}
          </div>

          <p className="mt-4 text-center text-[12px] text-[#A9A092]">
            Performance figures live in the campaign results above. Direct booking attribution
            depends on each property&apos;s tracking setup.
          </p>
        </div>
      </div>
    </section>
  );
}
