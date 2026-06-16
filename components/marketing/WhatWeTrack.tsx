// WhatWeTrack — measurement transparency + service grouping.
// Left: tracking scope checklist. Right: pilot framing + honest booking note.
// Safe language throughout — no direct booking claims.

import { TRACKING_SCOPE } from "@/lib/proof-stats";

const SERVICE_GROUPS = [
  {
    id: "creative",
    title: "Creative Production",
    items: [
      "Social graphics and campaign visuals",
      "Short-form motion and reel covers",
      "Captions and post copy",
      "Photo polishing and retouching",
      "New branded creative and campaign concepts",
    ],
  },
  {
    id: "campaigns",
    title: "Hospitality Campaigns",
    items: [
      "F&B promotions and seasonal offers",
      "Event campaigns and local event promos",
      "Wedding, meeting, and group-sales assets",
      "Spa and wellness campaign creative",
      "Property-level marketing assets",
    ],
  },
  {
    id: "local",
    title: "Local Visibility Support",
    items: [
      "Local SEO content direction",
      "Google Business Profile support",
      "Campaign copy and landing page recommendations",
      "Search-friendly content direction",
    ],
  },
  {
    id: "reporting",
    title: "Reporting & Tracking",
    items: [
      "Weekly performance pulse checks (pilots and retainers)",
      "Monthly performance recaps",
      "UTM links and campaign tracking setup",
      "Social analytics and engagement reporting",
      "Google Business Profile action reporting where access is available",
      "Website traffic and Search Console visibility where available",
      "Inquiry/booking-support signals where the client provides data",
    ],
  },
];

const WHAT_WORKS = [
  "Seasonal campaigns",
  "F&B promotions",
  "Local events",
  "Giveaways and community campaigns",
  "Hotel experiences",
  "Wellness and service announcements",
  "Meeting, wedding, and group-sales moments",
  "Clear calls to action",
];

export function WhatWeTrack() {
  return (
    <>
      {/* ── Service grouping section ─────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
              What Archer Design does
            </span>
            <h2 className="mt-3 font-serif text-[clamp(24px,3.5vw,40px)] font-semibold leading-tight text-[#F6F1E7]">
              The creative system behind property-level marketing.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
              Archer Design supports the full creative system behind property-level hospitality
              marketing: social graphics, short-form motion, campaign visuals, F&amp;B and event
              promos, meeting and wedding assets, spa and wellness campaigns, photo polishing, new
              branded creative, local SEO content, Google Business Profile support, and performance
              reporting.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICE_GROUPS.map((g) => (
              <div
                key={g.id}
                className="glass-card rounded-2xl border border-[rgba(201,164,76,0.14)] p-6"
              >
                <h3 className="font-serif text-[15px] font-semibold text-[#F6F1E7]">{g.title}</h3>
                <ul className="mt-4 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#A9A092]">
                      <span className="mt-[5px] shrink-0 text-[7px] text-[#C9A44C]">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What works in hospitality ────────────────────────────────────── */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card rounded-3xl border border-[rgba(201,164,76,0.14)] p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  What works
                </span>
                <h3 className="mt-3 font-serif text-[clamp(22px,2.8vw,34px)] font-semibold leading-tight text-[#F6F1E7]">
                  Campaigns people notice, click, and share.
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                  Across tracked hospitality campaigns, the strongest response came from content tied
                  to real reasons people act: events, F&amp;B offers, seasonal moments, giveaways,
                  openings, wellness services, local attractions, meetings, weddings, and
                  property-level promotions.
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 self-center">
                {WHAT_WORKS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#A9A092]">
                    <span className="mt-[5px] shrink-0 text-[7px] text-[#C9A44C]">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we track beyond likes ───────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card rounded-3xl border border-[rgba(201,164,76,0.14)] p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">

              {/* Left: tracking scope */}
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                  Measurement
                </span>
                <h2 className="mt-3 font-serif text-[clamp(22px,2.8vw,36px)] font-semibold leading-tight text-[#F6F1E7]">
                  What we track beyond likes.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-[#A9A092]">
                  Creative should do more than look good. Archer Design helps hospitality teams track
                  the signals that show whether campaigns are creating attention and action.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {TRACKING_SCOPE.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-[#A9A092]">
                      <span className="mt-[5px] shrink-0 text-[8px] text-[#C9A44C]">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: pilot framing + booking disclaimer */}
              <div className="space-y-6">
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A44C]">
                    The 30–60 day pilot
                  </span>
                  <h3 className="mt-3 font-serif text-[22px] font-semibold leading-snug text-[#F6F1E7]">
                    A low-risk way to prove the work.
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#A9A092]">
                    For hotel groups, we recommend a focused 3–5 property pilot before expanding
                    across the portfolio. In that window we:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      "Prove creative quality on your properties",
                      "Prove the approval workflow and monthly cadence",
                      "Set up UTM links, campaign links, and tracking where access allows",
                      "Deliver weekly pulse checks and a monthly performance recap",
                      "Review performance signals together at the end of the period",
                      "Give you a clear recommendation on whether and how to expand",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[14px] text-[#A9A092]">
                        <span className="mt-[5px] shrink-0 text-[8px] text-[#C9A44C]">◆</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Attribution note */}
                <div className="rounded-xl border border-[rgba(201,164,76,0.18)] bg-[rgba(201,164,76,0.04)] p-5">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#C9A44C]">
                    On booking attribution
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#A9A092]">
                    The report data shows strong reach, impressions, engagement, shares, comments,
                    and reported post clicks across tracked campaigns. Direct booking attribution
                    depends on the property&apos;s own tracking setup. During a pilot, Archer Design
                    can help set up UTM links, campaign links, Google Business Profile tracking,
                    landing page traffic, and inquiry/booking-support reporting where access is
                    available.
                  </p>
                </div>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,164,76,0.32)] bg-[rgba(201,164,76,0.06)] px-5 py-3 text-sm font-semibold text-[#E8D7A2] transition hover:-translate-y-0.5 hover:border-[#C9A44C]"
                >
                  Request a Creative Pilot <span aria-hidden>→</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
