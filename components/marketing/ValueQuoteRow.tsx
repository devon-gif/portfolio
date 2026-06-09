// Value strip (3 quick reasons) + a client results testimonial row.
// Uses user-provided hospitality testimonial copy with generic attribution.

const stroke = {
  fill: "none",
  stroke: "#C9A44C",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const VALUES = [
  {
    title: "No in-house hire needed",
    body: "Lower overhead than adding design, social, video, and SEO roles internally.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        <path d="M16 11a3 3 0 0 0 0-6" />
      </svg>
    ),
  },
  {
    title: "Turn existing assets into campaigns",
    body: "Use the photos and footage your team already has.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    ),
  },
  {
    title: "Hotels • Spas • Restaurants",
    body: "Property-level creative without property-level headcount.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5" />
      </svg>
    ),
  },
];

const PROOF_LABELS = [
  "Booking interest",
  "Event visibility",
  "Time saved",
  "Lower overhead",
  "Fast turnaround",
];

const TESTIMONIALS = [
  {
    quote:
      "Archer Design has helped drive more business, support stronger booking interest, and make our events stand out. The creative has made our promotions feel more polished and has helped bring stronger turnout to our events.",
    author: "Kristen, Hospitality Marketing Client",
  },
  {
    quote:
      "We started using Archer Design because we didn’t have the budget for another in-house hire. It has saved us so much time and money. Social media and promotions used to be a headache, now we have reliable creative support without adding payroll.",
    author: "Michelle, Hotel Operations Client",
  },
  {
    quote:
      "When our social media manager left, we were under pressure with events and design work that still had to get done. Archer Design stepped in quickly, handled the creative, and helped us keep moving. We’ve continued using them ever since.",
    author: "Michael, Hospitality Client",
  },
];

export function ValueQuoteRow() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Value strip */}
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

        <div className="mt-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              Client Results
            </span>
            <h2 className="mt-3 font-serif text-[clamp(28px,4vw,42px)] font-semibold leading-tight text-[#F6F1E7]">
              Creative support hospitality teams actually rely on.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#A9A092]">
              When properties need event promos, social content, restaurant campaigns, seasonal
              graphics, and fast-turnaround creative, Archer Design becomes the extra team they do
              not have to hire.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {PROOF_LABELS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[rgba(201,164,76,0.22)] bg-[rgba(17,16,14,0.78)] px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#E8D7A2] backdrop-blur-md"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.author}
                className="glass-card-strong min-w-[84%] snap-start rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-0.5 lg:min-w-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#C9A44C]" aria-hidden>
                    &ldquo;&rdquo;
                  </span>
                  <span aria-label="5 out of 5 stars" className="text-sm tracking-[0.2em] text-[#C9A44C]">
                    ★★★★★
                  </span>
                </div>
                <blockquote className="mt-4 font-serif text-[18px] leading-relaxed text-[#F6F1E7]">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 text-[13px] text-[#A9A092]">{item.author}</figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-4 text-center text-[12px] text-[#A9A092]">
            Results vary by property, campaign, and tracking setup. Testimonials reflect client experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
