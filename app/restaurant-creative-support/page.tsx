import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Monthly creative support for restaurants, hotel restaurants, bars, brunch spots, catering teams, and private dining. We turn existing food photography, menus, and event details into social graphics, short-form motion, menu promos, and seasonal campaigns.";

export const metadata: Metadata = {
  title: "Restaurant Creative Support | Monthly Social & Promo Design",
  description: DESCRIPTION,
  alternates: { canonical: "/restaurant-creative-support" },
  openGraph: {
    title: "Restaurant Creative Support | Monthly Social & Promo Design",
    description: DESCRIPTION,
    url: "/restaurant-creative-support",
  },
};

const VIDEOS = [
  MOTION_CAROUSEL[0], // Bar & cocktails
  HERO_ROTATION[2], // Upscale hotel bar
  MOTION_CAROUSEL[12], // Vertical social
  MOTION_CAROUSEL[15], // Square social
  HERO_ROTATION[3], // Luxury hotel bar
  MOTION_CAROUSEL[4], // Upscale bar
];

export default function RestaurantCreativeSupportPage() {
  return (
    <SeoLandingPage
      path="/restaurant-creative-support"
      serviceName="Restaurant Creative Support"
      serviceType="Restaurant social media, menu, and campaign creative"
      metaDescription={DESCRIPTION}
      eyebrow="Restaurant Creative Support"
      h1="Make your restaurant promos look as good as the food."
      intro={[
        "Archer Design is a remote hospitality creative studio for restaurants, hotel restaurants, bars, brunch spots, catering teams, and private dining spaces. We turn the food photography, menus, event details, and quick staff clips you already have into polished, on-brand creative.",
        "Raw assets in, finished creative out — social graphics, short-form motion, menu promos, seasonal campaigns, and Google Business updates, delivered approval-ready so your team can stay on the floor.",
      ]}
      videoHeading="Short-form motion, built from what you already have"
      videoBlurb="Reels and F&B motion created from existing photos and quick clips — appetizing, on-brand, and ready to post."
      sections={[
        {
          heading: "Your kitchen is busy. Your feed shouldn't go quiet.",
          paragraphs: [
            "Great dishes and full rooms don't always make it online. Between service, prep, and events, designing campaigns is the first thing to slip — even though the raw material is already there.",
            "We act as your remote post-production studio: you send menus, photos, and event details, and we turn them into a steady monthly rhythm of creative that keeps offers visible and tables top of mind.",
          ],
          bullets: [
            "Menu launches, specials, and signature-dish features",
            "Seasonal campaigns and restaurant-week pushes",
            "Events, live music, and private-dining promos",
            "Bar and beverage-program content",
            "Google Business and local visibility creative",
          ],
        },
        {
          heading: "One studio instead of stacking vendors.",
          paragraphs: [
            "Instead of juggling a freelance designer, a video editor, and social help, one studio keeps everything consistent and moving — at a fraction of the cost of building an in-house team.",
            "Scalable for a single restaurant or a multi-property F&B group, with a predictable monthly rhythm and lower overhead.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Do we need new professional photos first?",
          a: "No. The point is making the assets you already have work harder — past food photography, menus, and quick staff clips are usually more than enough to build a strong monthly rhythm.",
        },
        {
          q: "How does this work if you're not on-site?",
          a: "Most creative is handled remotely from the content you send. If you ever need new hero assets, we can help coordinate a local shooter, but it's rarely required for monthly work.",
        },
        {
          q: "Can you match our brand and a hotel's standards?",
          a: "Yes. We produce brand-standard-aware creative so it clears review the first time, including for hotel restaurants operating under a flag's guidelines.",
        },
      ]}
      related={[
        { href: "/restaurants", label: "Restaurants" },
        { href: "/bars", label: "Bars" },
        { href: "/hotels", label: "Hotels & Resorts" },
        { href: "/case-studies", label: "Case Studies" },
        { href: "/packages", label: "Packages" },
      ]}
      videos={VIDEOS}
    />
  );
}
