// Campaign results section — four property cards with SHAIPE-sourced data.
// Safe attribution: numbers reflect impressions, reach, engagement, and reported
// post clicks across tracked profiles. No direct booking claims are made.

import { PROFILE_STATS } from "@/lib/proof-stats";
import { siteConfig } from "@/lib/site-config";

type StatItem = { val: string; label: string };

const CARDS: {
  id: string;
  label: string;
  stats: StatItem[];
  summary: string;
}[] = [
  {
    id: "eliza",
    label: "F&B + Events",
    stats: [
      { val: PROFILE_STATS.eliza.impressions,        label: "Impressions" },
      { val: PROFILE_STATS.eliza.post_engagements,   label: "Post Engagements" },
      { val: PROFILE_STATS.eliza.post_clicks,        label: "Post Clicks" },
      { val: PROFILE_STATS.eliza.reactions,          label: "Reactions" },
      { val: PROFILE_STATS.eliza.shares,             label: "Shares" },
      { val: PROFILE_STATS.eliza.comments,           label: "Comments" },
    ],
    summary:
      "F&B, event, and seasonal campaigns that generated measurable local attention and action.",
  },
  {
    id: "indigo",
    label: "Hotel Creative",
    stats: [
      { val: PROFILE_STATS.indigo.impressions,       label: "Impressions" },
      { val: PROFILE_STATS.indigo.post_engagements,  label: "Post Engagements" },
      { val: PROFILE_STATS.indigo.post_clicks,       label: "Post Clicks" },
      { val: PROFILE_STATS.indigo.reactions,         label: "Reactions" },
      { val: PROFILE_STATS.indigo.shares,            label: "Shares" },
      { val: PROFILE_STATS.indigo.comments,          label: "Comments" },
    ],
    summary:
      "Hotel property creative, local campaign support, and consistent social output for a branded lifestyle property.",
  },
  {
    id: "hampton",
    label: "Select-Service Hotel",
    stats: [
      { val: PROFILE_STATS.hampton_greensburg.impressions,       label: "Impressions" },
      { val: PROFILE_STATS.hampton_greensburg.post_engagements,  label: "Post Engagements" },
      { val: PROFILE_STATS.hampton_greensburg.post_clicks,       label: "Post Clicks" },
      { val: PROFILE_STATS.hampton_greensburg.reactions,         label: "Reactions" },
      { val: PROFILE_STATS.hampton_greensburg.shares,            label: "Shares" },
      { val: PROFILE_STATS.hampton_greensburg.comments,          label: "Comments" },
    ],
    summary:
      "Proof that branded select-service hotels can create strong local visibility with consistent property-level creative.",
  },
  {
    id: "elements",
    label: "Spa + Opening Campaign",
    stats: [
      { val: PROFILE_STATS.elements.impressions,       label: "Impressions" },
      { val: PROFILE_STATS.elements.post_engagements,  label: "Post Engagements" },
      { val: PROFILE_STATS.elements.post_clicks,       label: "Post Clicks" },
      { val: PROFILE_STATS.elements.reactions,         label: "Reactions" },
      { val: PROFILE_STATS.elements.shares,            label: "Shares" },
      { val: PROFILE_STATS.elements.comments,          label: "Comments" },
    ],
    summary:
      "Wellness, opening, and service-promotion campaigns that helped create local awareness and action.",
  },
];

const CARD_NAMES: Record<string, string> = {
  eliza:   "Eliza PGH / Eliza Hot Metal Bistro",
  indigo:  "Hotel Indigo Pittsburgh",
  hampton: "Hampton Inn Greensburg",
  elements:"Elements Salon & Wellness",
};

const CARD_CATEGORIES: Record<string, string> = {
  eliza:   "Restaurant, F&B, and event-driven creative",
  indigo:  "Boutique flag hotel",
  hampton: "Select-service Hilton flag",
  elements:"Salon, spa, and wellness",
};

function StatCell({ val, label }: StatItem) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-serif text-[clamp(17px,2vw,24px)] leading-none text-[#F6F1E7]">{val}</span>
      <span className="text-[10px] uppercase tracking-[0.15em] text-[#A9A092]">{label}</span>
    </div>
  );
}

export function CampaignResults() {
  return (
    <section className="px-6 py-20" id="proof">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
            Campaign results
          </span>
          <h2 className="mt-3 font-serif text-[clamp(28px,4vw,46px)] font-semibold leading-tight text-[#F6F1E7]">
            Creative that creates measurable attention and action.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
            Across tracked hotel, restaurant, event, and wellness campaigns, Archer Design creative
            has helped generate 14.8M+ impressions, 565K+ direct engagements, 4.3M+ reach, 670K+
            reported post clicks, 12.9K+ comments, and 11.4K+ shares.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
            These are the kinds of signals hospitality teams need to see before expanding a creative
            program: people noticing, clicking, commenting, sharing, and engaging around real
            property moments.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {CARDS.map((c) => (
            <div
              key={c.id}
              className="glass-card flex flex-col gap-5 rounded-2xl border border-[rgba(201,164,76,0.16)] p-6"
            >
              <div>
                <span className="inline-block rounded-full border border-[rgba(201,164,76,0.28)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A44C]">
                  {c.label}
                </span>
                <h3 className="mt-3 font-serif text-[15px] font-semibold leading-snug text-[#F6F1E7]">
                  {CARD_NAMES[c.id]}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#A9A092]">{CARD_CATEGORIES[c.id]}</p>
              </div>

              {/* Stats 3x2 grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[rgba(201,164,76,0.12)] pt-4">
                {c.stats.map((s) => (
                  <StatCell key={s.label} val={s.val} label={s.label} />
                ))}
              </div>

              <p className="text-[13px] leading-relaxed text-[#A9A092]">{c.summary}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] text-[#A9A092]/60">
          Numbers sourced from SHAIPE-tracked profile data across hotel, restaurant, event, and wellness campaigns.
          These reflect impressions, reach, engagement, and reported post clicks.
          Direct booking attribution depends on property-level tracking setup and is not claimed above.
        </p>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-[15px] text-[#A9A092]">
            Want to see what this could look like for a few properties first?
          </p>
          <a
            href={siteConfig.scorecardUrl}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-6 py-3 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C]"
          >
            Take the Creative Bandwidth Scorecard <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
