// Top campaign moments — highlight results from individual campaigns.
// Safe framing: "helped generate", "supported visibility", "drove engagement around."
// No direct booking claims.

const MOMENTS = [
  {
    id: "halloween",
    profile: "Eliza PGH",
    campaign: "Halloween Campaign",
    stats: [
      { val: "22.7K", label: "Engagements" },
      { val: "193.7K", label: "Reach" },
      { val: "389", label: "Shares" },
      { val: "107", label: "Comments" },
    ],
    type: "Local event + F&B",
  },
  {
    id: "snowflake",
    profile: "Eliza PGH",
    campaign: "Snowflake Campaign",
    stats: [
      { val: "19.8K", label: "Engagements" },
      { val: "56.8K", label: "Reach" },
    ],
    type: "Seasonal campaign",
  },
  {
    id: "elements-opening",
    profile: "Elements Salon & Wellness",
    campaign: "Opening Campaign",
    stats: [
      { val: "14K", label: "Engagements" },
      { val: "50.9K", label: "Reach" },
    ],
    type: "Opening + wellness",
  },
  {
    id: "stitch",
    profile: "Eliza PGH",
    campaign: "Breakfast with Stitch",
    stats: [
      { val: "3.6K", label: "Likes" },
      { val: "807", label: "Shares" },
      { val: "221", label: "Comments" },
    ],
    type: "Family + F&B experience",
  },
];

export function TopCampaignMoments() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Top campaign moments
          </span>
          <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,40px)] font-semibold leading-tight text-[#F6F1E7]">
            Strong results around the moments that matter.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
            The strongest results came from the exact moments hospitality teams need to promote every
            month: local events, seasonal campaigns, F&amp;B experiences, openings, family events, and
            property-level offers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENTS.map((m) => (
            <div
              key={m.id}
              className="glass-card rounded-2xl border border-[rgba(201,164,76,0.14)] p-5"
            >
              <div className="mb-4">
                <span className="inline-block rounded-full bg-[rgba(201,164,76,0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C9A44C]">
                  {m.type}
                </span>
                <p className="mt-2 text-[11px] text-[#A9A092]">{m.profile}</p>
                <h3 className="mt-0.5 font-serif text-[15px] font-semibold text-[#F6F1E7]">
                  {m.campaign}
                </h3>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-[rgba(201,164,76,0.12)] pt-4">
                {m.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5">
                    <span className="font-serif text-[22px] leading-none text-[#F6F1E7]">{s.val}</span>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[#A9A092]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[12px] text-[#A9A092]/50">
          Campaign-level metrics from SHAIPE-tracked profiles. These reflect engagement, reach, shares, and comments for individual campaigns, not aggregate totals.
        </p>
      </div>
    </section>
  );
}
