/**
 * "Who this is best for / not for" qualification section.
 * Premium positioning: filters out cheap-service shoppers explicitly.
 */
export function FitSection() {
  const bestFor = [
    "Hotel groups with 3+ properties",
    "Properties with F&B, weddings, meetings, events, spas, or seasonal campaigns",
    "Teams with marketing leadership but limited creative bandwidth",
    "Groups that need consistent property-level output month after month",
    "Management companies that want a fixed monthly creative partner, one invoice, every property",
  ];
  const notFor = [
    "Teams looking for the cheapest possible social media posting service",
    "Properties with no approval process or single point of contact",
    "One-off, tiny design requests with no ongoing need",
    "Brands that do not value creative consistency",
  ];

  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-7">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Best fit
          </span>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-[#F6F1E7]">
            Who this works best for
          </h2>
          <ul className="mt-5 space-y-3 text-[14.5px] leading-relaxed text-[#A9A092]">
            {bestFor.map((item) => (
              <li key={item} className="relative pl-5">
                <span className="absolute left-0 top-[7px] text-[9px] text-[#C9A44C]">◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0b0a08]/70 p-7">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#A9A092]">
            Honest filter
          </span>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-[#F6F1E7]/80">
            Who this is not for
          </h2>
          <ul className="mt-5 space-y-3 text-[14.5px] leading-relaxed text-[#A9A092]/80">
            {notFor.map((item) => (
              <li key={item} className="relative pl-5">
                <span className="absolute left-0 top-[8px] block h-1.5 w-1.5 rounded-full bg-zinc-600" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] text-[#A9A092]/70">
            If that&apos;s the current need, no hard feelings, we&apos;d rather say it here than
            waste a call.
          </p>
        </div>
      </div>
    </section>
  );
}
