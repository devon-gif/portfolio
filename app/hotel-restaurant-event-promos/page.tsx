import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Promo creative for hotel restaurants, bars, weddings, and events: menu features, specials, seasonal pushes, and event promos that fill covers and calendars — built from assets you already have.";

export const metadata: Metadata = {
  title: "Hotel Restaurant & Event Promos That Fill Covers and Calendars",
  description: DESCRIPTION,
  alternates: { canonical: "/hotel-restaurant-event-promos" },
  openGraph: {
    title: "Hotel Restaurant & Event Promos That Fill Covers and Calendars",
    description: DESCRIPTION,
    url: "/hotel-restaurant-event-promos",
  },
};

const VIDEOS = [
  MOTION_CAROUSEL[0], // Bar & cocktails
  MOTION_CAROUSEL[2], // Wedding & events
  HERO_ROTATION[2], // Upscale hotel bar
  MOTION_CAROUSEL[14], // Champagne detail
  MOTION_CAROUSEL[6], // Couple, orbit shot
  MOTION_CAROUSEL[4], // Upscale bar
];

export default function HotelRestaurantEventPromosPage() {
  return (
    <SeoLandingPage
      path="/hotel-restaurant-event-promos"
      serviceName="Hotel Restaurant & Event Promotion Creative"
      serviceType="F&B and event promotional content for hotels and venues"
      metaDescription={DESCRIPTION}
      eyebrow="F&B · Weddings · Events"
      h1="Restaurant and event promos that actually move covers and bookings."
      intro={[
        "A hotel restaurant with a new seasonal menu and an empty Tuesday has a promotion problem, not a food problem. Same for the ballroom with open Saturday dates next spring. The offer exists — what's missing is a steady stream of finished promo creative that puts it in front of people while it still matters.",
        "Archer Design builds that stream: menu features, specials and happy hour pushes, wedding and private-event promos, holiday campaigns — designed, written, and delivered approval-ready on a schedule that matches your F&B and events calendar.",
        "Everything is built from what your team already has: menu PDFs, event sheets, past wedding photos, and phone shots from the line. No food stylist, no production day.",
      ]}
      videoHeading="F&B and event creative in motion"
      videoBlurb="Bar and cocktail motion, wedding promos, and event creative — short-form pieces built to sell a specific offer, date, or experience."
      videos={VIDEOS}
      sections={[
        {
          heading: "Promos with a deadline get priority",
          paragraphs: [
            "F&B and event content is time-boxed by nature — a Valentine's prix fixe promoted on February 12th is wasted work. So we plan around your calendar, not ours. Each month we map what's coming: menu changes, holidays, local events that drive traffic, and open dates the sales team needs to fill, then deliver the supporting creative ahead of when it needs to run.",
            "Typical promo work includes:",
          ],
          bullets: [
            "Menu launch and seasonal-special features for feed and stories",
            "Bar program content — cocktails, happy hour, live music nights",
            "Wedding marketing creative aimed at filling next season's dates",
            "Private dining and corporate event promos for the sales team",
            "Holiday campaign sets — brunches, prix fixe, ticketed events",
          ],
        },
        {
          heading: "Built for the operator, not the agency review cycle",
          paragraphs: [
            "Restaurant and event promos die in slow approval loops. Ours arrive finished — correct logos, current prices pulled from the menu you sent, captions attached — so the F&B director or DOS can approve in one look. Need a price or date changed? Revisions turn around fast because we keep your brand files and templates on hand.",
            "For flag hotels, creative is built brand-standard-aware from the start, so the promo for Eliza at Hotel Indigo or a Hampton breakfast push doesn't bounce off a brand review.",
          ],
        },
        {
          heading: "One property, two revenue engines",
          paragraphs: [
            "Rooms get most of the marketing attention, but F&B and events are where local content earns direct, measurable response — a special that sells out, a wedding inquiry from a Reel, a holiday brunch that books full. Local audiences who will never book a room still follow, share, and show up for the restaurant.",
            "That's why our hotel packages treat F&B and event promos as first-class deliverables alongside rooms-and-amenities content, not an afterthought. If you run a standalone restaurant or venue without a hotel attached, the same service applies — several of our clients are exactly that.",
          ],
        },
        {
          heading: "What it replaces",
          paragraphs: [
            "Most properties handle promo creative one of three ways: the sales coordinator makes something in a free design tool at the last minute, the flag's template library produces something generic, or the promo simply doesn't get promoted. Each path costs covers and bookings.",
            "A fixed monthly creative partnership replaces all three with finished, on-brand promo content that ships on time — at a fraction of the loaded cost of in-house help. See the cost comparison or current packages for numbers.",
          ],
        },
        {
          heading: "Try it on a real promo",
          paragraphs: [
            "The free trial works best on something real: send a menu, an upcoming event sheet, or your next holiday push, and we'll return 5 finished promo assets within 7 days. You'll see exactly how your offers look with dedicated creative behind them — before spending anything.",
          ],
        },
      ]}
      faqs={[
        {
          q: "We don't have professional food photography. Can you still help?",
          a: "Usually, yes. Good phone photos of plates and drinks, your menu, and the room itself give us plenty to work with — and we'll tell you honestly if a specific promo needs better source material before we build it.",
        },
        {
          q: "How far ahead do you need event details?",
          a: "The earlier the better for ticketed events and weddings, but the practical minimum is about a week for a standard promo. Recurring needs (weekly specials, happy hour) get templated so turnaround drops to days.",
        },
        {
          q: "Can you support our wedding sales effort specifically?",
          a: "Yes — venue promos aimed at filling specific open dates and seasons are a core deliverable. We build creative the events team can run on social and send directly to inquiring couples.",
        },
        {
          q: "Do you handle the posting and boosting?",
          a: "We deliver approval-ready content with captions; your team posts and runs any paid boosts. Ad buying isn't our core service — we'd rather make the creative strong enough to work organically first.",
        },
        {
          q: "Is this only for hotel restaurants?",
          a: "No. Standalone restaurants, bars, and event venues use the same service — the deliverables just skew fully toward F&B and events instead of splitting with rooms content.",
        },
      ]}
      related={[
        { href: "/hotel-social-media-management", label: "Hotel social media management" },
        { href: "/hotel-video-marketing", label: "Hotel video marketing" },
        { href: "/hospitality-creative-support", label: "Hospitality creative support" },
        { href: "/hotel-marketing-cost-savings", label: "Marketing cost savings" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/packages", label: "Packages" },
      ]}
    />
  );
}
