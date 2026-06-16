import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Outside creative support for hospitality teams: social graphics, short-form video, captions, and campaign assets for hotels, restaurants, spas, and event venues, without adding headcount.";

export const metadata: Metadata = {
  title: "Hospitality Creative Support for Hotels, Restaurants, Spas & Venues",
  description: DESCRIPTION,
  alternates: { canonical: "/hospitality-creative-support" },
  openGraph: {
    title: "Hospitality Creative Support for Hotels, Restaurants, Spas & Venues",
    description: DESCRIPTION,
    url: "/hospitality-creative-support",
  },
};

const VIDEOS = [
  HERO_ROTATION[0], // Signature reel
  MOTION_CAROUSEL[2], // Wedding & events
  MOTION_CAROUSEL[0], // Bar & cocktails
  HERO_ROTATION[7], // Luxury pool
  MOTION_CAROUSEL[14], // Champagne detail
  HERO_ROTATION[6], // Open-air lodge lounge
];

export default function HospitalityCreativeSupportPage() {
  return (
    <SeoLandingPage
      path="/hospitality-creative-support"
      serviceName="Hospitality Creative Support"
      serviceType="Outsourced creative and content support for hospitality businesses"
      metaDescription={DESCRIPTION}
      eyebrow="Hospitality Creative Support"
      h1="A creative department for hospitality teams that can't justify one."
      intro={[
        "Hotels, restaurants, spas, and venues all hit the same wall: the business generates endless content-worthy moments, new menus, weddings, seasonal packages, renovated rooms, but nobody on the team has the time or the tools to turn those moments into finished marketing assets. The choice usually looks like a $90K+ in-house hire, an agency retainer scoped for brands twice your size, or a rotating cast of freelancers who need re-briefing every month.",
        "Archer Design is the fourth option: a dedicated outside creative partner who learns your brand once, then delivers polished, approval-ready content every month. Social graphics, short-form video, captions, campaign copy, and promo assets, built from the photos and details you already have.",
        "One partner, one fixed monthly fee, no employment overhead. The work shows up finished; your team approves and posts.",
      ]}
      videoHeading="Across every hospitality category"
      videoBlurb="Hotels, F&B, weddings and events, spa and wellness, examples of finished creative built entirely from clients' existing assets."
      videos={VIDEOS}
      sections={[
        {
          heading: "Who we support",
          paragraphs: [
            "Our clients run the spread of hospitality: select-service hotels (Hampton, Hotel Indigo, and similar flags) where no one owns creative on property; independent hotels and resorts with seasonal campaign needs; hotel restaurants and standalone F&B that need a steady stream of menu and special content; spas and wellness studios that want a calm, premium feel without a designer on staff; and wedding and event venues that need promo creative to keep the calendar full.",
            "We also work at the group level: management companies and multi-property portfolios that need brand-consistent output across locations on one plan and one invoice, instead of a creative hire in every building.",
          ],
        },
        {
          heading: "What creative support actually includes",
          paragraphs: ["The monthly deliverable mix flexes with your calendar, but the core menu is:"],
          bullets: [
            "Social graphics: feed posts, carousels, and stories for Instagram and Facebook",
            "Short-form video: Reels and vertical cuts built from existing footage and stills",
            "Captions and campaign copy written in your property's voice",
            "Event, wedding, and F&B promo assets timed to what's coming up",
            "Seasonal campaign visuals, launches, holidays, local moments",
            "Branded collateral for offers, partnerships, and on-property screens",
          ],
        },
        {
          heading: "How the workload actually drops",
          paragraphs: [
            "The point isn't just prettier posts. It's hours back. Today, your GM or marketing lead is finding photos, fighting with a design tool, writing captions at 9pm, and still feeling behind. With a creative partner in place, their job shrinks to two steps: forward us what's happening (an event sheet, a menu, a few photos) and approve what comes back.",
            "Because everything arrives finished and labeled with captions attached, scheduling a full week of content takes minutes. The approval-ready workflow is the difference between creative support that saves time and creative support that creates a new management job.",
          ],
        },
        {
          heading: "Why not an agency or a freelancer?",
          paragraphs: [
            "Agencies are built for brands with budgets to match, strategy decks, account managers, and retainers that start where most single properties' entire marketing budget ends. Freelancers are affordable but fragile: quality varies, availability changes, and every new person re-learns your brand from zero.",
            "A dedicated outside partner sits in between: senior-level consistency and hospitality-specific instincts, at a fixed monthly cost a single property can justify. Across tracked hotel, restaurant, event, and wellness campaigns, Archer Design creative has helped generate 14.8M+ impressions, 565K+ direct engagements, 4.3M+ reach, and 670K+ reported post clicks. See the case studies for what that looks like property by property.",
          ],
        },
        {
          heading: "Getting started is deliberately easy",
          paragraphs: [
            "Send your existing photos, menus, or event details and we'll build 5 finished assets in 7 days, free, no card, no contract. You judge the quality on your own brand. If it's a fit, choose a monthly package; if your needs span several properties, we'll scope a group partnership. Either way, you'll know within a week whether this solves your bandwidth problem.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Is this an agency?",
          a: "No. There's no account team, no strategy retainer, no minimum scoped for a brand ten times your size. It's a dedicated outside creative partner who plugs into your existing team and delivers finished content every month.",
        },
        {
          q: "We're a restaurant / spa / venue, not a hotel. Does this still apply?",
          a: "Yes. Hotels are our anchor, but the same model covers hotel restaurants, standalone F&B, spas and wellness studios, and wedding and event venues. The deliverables shift to match, menu features, treatment promos, event creative, but the workflow is identical.",
        },
        {
          q: "What do you need from us each month?",
          a: "Surprisingly little: whatever's coming up (events, menu changes, offers) and any new photos you have. We handle planning, design, motion, and captions from there. Most clients spend under an hour a month on the whole relationship.",
        },
        {
          q: "Can you keep multiple properties consistent?",
          a: "Yes, that's a core use case. Group-level brand consistency with property-level customization, one plan, one invoice. Groups of 5+ properties get custom scoping.",
        },
        {
          q: "What does it cost?",
          a: "A fixed monthly fee that lands well under the loaded cost of an in-house hire, see the cost savings page for the full comparison, or the packages page for current tiers. The free 5-asset trial comes first either way.",
        },
      ]}
      related={[
        { href: "/hotel-social-media-management", label: "Hotel social media management" },
        { href: "/hotel-video-marketing", label: "Hotel video marketing" },
        { href: "/hotel-restaurant-event-promos", label: "Restaurant & event promos" },
        { href: "/hotel-marketing-cost-savings", label: "Marketing cost savings" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/packages", label: "Packages" },
      ]}
    />
  );
}
