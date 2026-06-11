import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Hotel social media management without the full-time hire: on-brand social graphics, short-form video, and captions delivered monthly, approval-ready for your scheduler.";

export const metadata: Metadata = {
  title: "Hotel Social Media Management Without a Full-Time Hire",
  description: DESCRIPTION,
  alternates: { canonical: "/hotel-social-media-management" },
  openGraph: {
    title: "Hotel Social Media Management Without a Full-Time Hire",
    description: DESCRIPTION,
    url: "/hotel-social-media-management",
  },
};

const VIDEOS = [
  HERO_ROTATION[0], // Signature reel
  MOTION_CAROUSEL[12], // Vertical social
  MOTION_CAROUSEL[15], // Square social
  HERO_ROTATION[8], // Lobby, lit
  MOTION_CAROUSEL[11], // Suite, window light
  MOTION_CAROUSEL[13], // Seasonal timelapse
];

export default function HotelSocialMediaManagementPage() {
  return (
    <SeoLandingPage
      path="/hotel-social-media-management"
      serviceName="Hotel Social Media Management"
      serviceType="Hotel social media content and management support"
      metaDescription={DESCRIPTION}
      eyebrow="Hotel Social Media"
      h1="Hotel social media management, without hiring anyone."
      intro={[
        "Most hotels don't have a social media problem. They have a bandwidth problem. The photos exist, the events are booked, the menus change with the season, but the person responsible for posting is usually a GM, sales manager, or a marketing lead covering five other jobs. So the feed goes quiet for two weeks, then three posts appear in one day, then quiet again.",
        "Archer Design fixes the bandwidth problem directly. We take the property photography, event details, and F&B updates you already have and turn them into a steady monthly stream of finished social content: graphics, short-form video, and captions, delivered approval-ready so your team only has to review and schedule.",
        "No recruiting, no salary and benefits, no software stack to manage. One fixed monthly fee for the output of a dedicated social creative.",
      ]}
      videoHeading="What the content looks like"
      videoBlurb="Real examples of the short-form social content we build for hotel feeds, all made from existing property assets, no new shoots required."
      videos={VIDEOS}
      sections={[
        {
          heading: "What's included each month",
          paragraphs: [
            "Every month starts with a short creative plan matched to your calendar: what's coming up at the property, which seasonal pushes matter, what F&B or event promotion needs support. From there, we deliver finished assets on a steady cadence rather than a single end-of-month dump, so your feed never goes dark while you wait.",
            "A typical month includes a mix of:",
          ],
          bullets: [
            "Feed graphics and carousels sized for Instagram and Facebook",
            "Short-form video (Reels and vertical cuts) built from your existing footage and photos",
            "Stories assets for events, offers, and seasonal moments",
            "Captions written to match your property's voice, ready to paste",
            "Event, F&B, and package promos timed to your calendar",
          ],
        },
        {
          heading: "The approval-ready workflow",
          paragraphs: [
            "Everything we send is built to pass review the first time: correct logo usage, brand colors, and, for flag properties like Hampton or Hotel Indigo, brand-standard awareness baked in from the start. Assets arrive labeled and organized, with captions attached, so whoever owns your scheduler can load a week of content in minutes.",
            "You keep final say on everything. We deliver, you approve, your team posts (or we hand off into whatever scheduling tool you already use). One round of feedback is part of the normal flow, and revisions are quick because we work from your brand files rather than guessing.",
          ],
        },
        {
          heading: "Who this works best for",
          paragraphs: [
            "Select-service and limited-service hotels where no one owns creative full time. Independent properties where the marketing lead is stretched across PR, groups, and OTA management. And multi-property groups or management companies who need consistent output across locations without putting a creative hire in every building.",
            "If your property posts inconsistently, recycles the same four photos, or goes quiet during your busiest season precisely because everyone is too busy to post, that's the exact situation this service was built for.",
          ],
        },
        {
          heading: "What it costs compared with hiring",
          paragraphs: [
            "A dedicated in-house social media or creative hire typically runs $90K–$180K a year once you count salary, benefits, payroll taxes, software, recruiting, and the management time to keep them busy and on-brand. Most hotels can't justify that for one property, which is why the work lands on someone who already has a full-time job.",
            "Archer Design delivers the monthly output of that role for a fixed fee, with no employment overhead and no replacement risk if someone leaves. You can see the math on our hotel marketing cost savings page, or compare monthly tiers on the packages page.",
          ],
        },
        {
          heading: "How to start",
          paragraphs: [
            "Start with the free trial: send your existing property photos, a menu, or an upcoming event, and we'll return 5 finished, approval-ready assets within 7 days. No card, no contract. You judge the quality on your own brand, not a portfolio. If it's useful, pick a monthly package. If not, you keep the assets and we part ways friendly.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Do you post for us, or just create the content?",
          a: "Our core service is creating finished, approval-ready content: graphics, video, and captions, organized so your team can schedule a week of posts in minutes. If you'd rather hand off scheduling entirely, ask about it during your trial and we'll scope it for your setup.",
        },
        {
          q: "Do we need new photography first?",
          a: "No. We build from what you already have: property photography, past campaign material, menus, event details, even good phone photos. If your library is genuinely thin in one area, we'll tell you honestly and work with what performs.",
        },
        {
          q: "Can you match our brand standards?",
          a: "Yes, that's table stakes. We work from your brand files and, for flag properties, with brand-standard awareness built in. Assets are built to pass your review (and your brand's) the first time.",
        },
        {
          q: "How fast do we get content each month?",
          a: "Delivery runs on a steady cadence through the month rather than one big drop, and the first batch from the free trial arrives within 7 days. Time-sensitive event or promo assets get prioritized around your calendar.",
        },
        {
          q: "What if we have multiple properties?",
          a: "Multi-property groups are the core of what we do: group-level brand consistency with property-level customization, on one plan and one invoice. Groups of 5+ properties get a custom-scoped partnership.",
        },
      ]}
      related={[
        { href: "/hotel-video-marketing", label: "Hotel video marketing" },
        { href: "/hospitality-creative-support", label: "Hospitality creative support" },
        { href: "/hotel-restaurant-event-promos", label: "Restaurant & event promos" },
        { href: "/hotel-marketing-cost-savings", label: "Marketing cost savings" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/packages", label: "Packages" },
      ]}
    />
  );
}
