import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "What hotel marketing creative really costs: in-house hires run $90K–$180K loaded. Compare that with fixed-fee outside creative support, same monthly output, no employment overhead.";

export const metadata: Metadata = {
  title: "Hotel Marketing Cost Savings: Creative Output Without the Hire",
  description: DESCRIPTION,
  alternates: { canonical: "/hotel-marketing-cost-savings" },
  openGraph: {
    title: "Hotel Marketing Cost Savings: Creative Output Without the Hire",
    description: DESCRIPTION,
    url: "/hotel-marketing-cost-savings",
  },
};

const VIDEOS = [
  HERO_ROTATION[0], // Signature reel
  MOTION_CAROUSEL[13], // Seasonal timelapse
  HERO_ROTATION[5], // Luxury room timelapse
  MOTION_CAROUSEL[12], // Vertical social
  MOTION_CAROUSEL[0], // Bar & cocktails
  MOTION_CAROUSEL[15], // Square social
];

export default function HotelMarketingCostSavingsPage() {
  return (
    <SeoLandingPage
      path="/hotel-marketing-cost-savings"
      serviceName="Hotel Marketing Cost Savings"
      serviceType="Fixed-fee creative support as an alternative to in-house marketing hires"
      metaDescription={DESCRIPTION}
      eyebrow="The Cost Case"
      h1="The honest math on hotel marketing creative."
      intro={[
        "Every hotel eventually has the same conversation: the feed is inconsistent, the events aren't getting promoted, and somebody says \"we should hire a marketing person.\" Before that req gets written, it's worth running the real numbers, because the loaded cost of an in-house creative hire surprises most owners, and the alternatives have changed.",
        "This page lays out what each option actually costs a single property or small group, and where a fixed-fee outside creative partner fits. No calculator tricks, bring your own numbers and check the math.",
      ]}
      videoHeading="What the fixed fee buys"
      videoBlurb="The monthly output in question: social graphics, short-form video, and seasonal campaign creative, examples built entirely from clients' existing assets."
      videos={VIDEOS}
      sections={[
        {
          heading: "What an in-house creative hire really costs",
          paragraphs: [
            "The salary line is the smallest part of the lie. A social media manager, designer, or content person for a hotel typically posts at $50K–$90K, but the loaded cost is what hits the P&L:",
          ],
          bullets: [
            "Salary plus benefits, insurance, and payroll taxes, typically +25–35% on top of base",
            "Software: design tools, stock libraries, scheduling platforms",
            "Recruiting costs and the 2–3 month vacancy before they start",
            "Management time, someone has to brief, review, and develop them",
            "Replacement risk: when they leave, the content stops and the cycle restarts",
          ],
        },
        {
          heading: "All in: $90K–$180K a year",
          paragraphs: [
            "Loaded, a dedicated creative hire lands between $90K and $180K annually depending on market and seniority. For a 120-room select-service property, that's a serious line item for a role that's hard to keep busy at senior quality every single week, and hard to keep, period: marketing roles at single properties have notoriously high turnover because good creatives outgrow them.",
            "The usual fallback is worse but hidden: the work lands on the GM, AGM, or sales manager. That looks free on the P&L, but you're paying a revenue-generating leader to fight with design software, and the output still looks like it.",
          ],
        },
        {
          heading: "Agencies and freelancers: the middle options",
          paragraphs: [
            "Hospitality marketing agencies do strong work, but their retainers are scoped for groups and resort brands, strategy, account management, and paid media bundled in whether you need it or not. Single properties routinely quote out at $3K–$10K+ a month before any production.",
            "Freelancers are the budget path, and they can work, until your regular is booked during your busiest season, or you spend hours re-briefing a new one on logo usage. Variable quality and zero continuity are the real costs that never show up in the hourly rate.",
          ],
        },
        {
          heading: "The fixed-fee alternative",
          paragraphs: [
            "Archer Design delivers the monthly output of a dedicated creative, social graphics, short-form video, captions, and campaign assets, approval-ready, for a flat monthly fee that lands well under the loaded cost of a hire. No benefits, no software stack, no recruiting, no vacancy gap, no replacement risk.",
            "Because we build from the photos and assets you already own, there's also no production budget hiding behind the fee. And for groups, one partnership covers multiple properties with consistent branding, the math gets better with each property added, not worse. Current tiers are on the packages page; the homepage has a calculator where you can run your own numbers.",
          ],
        },
        {
          heading: "Prove it before you pay for it",
          paragraphs: [
            "Cost savings only matter if the quality holds, so we put the proof first: send your existing photos, a menu, or an event and get 5 finished assets back in 7 days, free. Compare them against what you're producing now, or what you imagined a hire would produce, then decide. If the quality doesn't make the decision easy, you've spent nothing and you keep the assets.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Where do the $90K–$180K numbers come from?",
          a: "Base salary ranges for marketing/creative roles plus standard loading: benefits, insurance, and payroll taxes (typically 25–35% on base), software, recruiting, and management time. Run your own market's numbers in the calculator on our homepage, the conclusion usually survives local adjustment.",
        },
        {
          q: "Is the monthly fee really fixed?",
          a: "Yes, each package is a flat monthly fee for a defined output level. If your needs grow (more properties, heavier seasons), you change tiers; nothing meters per asset behind your back.",
        },
        {
          q: "What's the catch versus an in-house hire?",
          a: "An in-house person can walk the property daily and shoot spontaneously; we work from the assets your team sends. In practice clients find that trade easy, phone photos from staff plus our finishing covers it, but it's the honest difference.",
        },
        {
          q: "Do we have to commit to a long contract to get the savings?",
          a: "No long lock-in is required to start. Begin with the free trial, then a monthly package, and ask us about commitment terms directly during the trial. Scale up, down, or pause as your season demands.",
        },
        {
          q: "Does this replace our whole marketing function?",
          a: "No, it replaces the creative production layer: the design, video, and caption work that eats the most time. Strategy, paid media buying, and PR stay with whoever owns them now; our content plugs into their plans.",
        },
      ]}
      related={[
        { href: "/hospitality-creative-support", label: "Hospitality creative support" },
        { href: "/hotel-social-media-management", label: "Hotel social media management" },
        { href: "/hotel-video-marketing", label: "Hotel video marketing" },
        { href: "/hotel-restaurant-event-promos", label: "Restaurant & event promos" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/packages", label: "Packages" },
      ]}
    />
  );
}
