import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Calm, premium creative support for spas, salons, and wellness brands. We turn existing treatment imagery, space photography, and staff clips into serene social graphics, short-form motion, seasonal package promos, and membership creative.";

export const metadata: Metadata = {
  title: "Spa & Salon Creative Support | Wellness Social & Promo Design",
  description: DESCRIPTION,
  alternates: { canonical: "/spa-salon-creative-support" },
  openGraph: {
    title: "Spa & Salon Creative Support | Wellness Social & Promo Design",
    description: DESCRIPTION,
    url: "/spa-salon-creative-support",
  },
};

const VIDEOS = [
  HERO_ROTATION[5], // Luxury room timelapse (calm)
  HERO_ROTATION[7], // Luxury pool
  HERO_ROTATION[6], // Open-air lodge lounge
  MOTION_CAROUSEL[12], // Vertical social
  HERO_ROTATION[4], // Mountain valley terrace
  MOTION_CAROUSEL[15], // Square social
];

export default function SpaSalonCreativeSupportPage() {
  return (
    <SeoLandingPage
      path="/spa-salon-creative-support"
      serviceName="Spa & Salon Creative Support"
      serviceType="Spa and wellness social media and campaign creative"
      metaDescription={DESCRIPTION}
      eyebrow="Spa & Wellness Creative Support"
      h1="Calm, premium creative that feels as considered as the experience."
      intro={[
        "Archer Design is a remote hospitality creative studio for spas, salons, and wellness brands. We turn the treatment imagery, space photography, and quiet staff clips you already have into serene, on-brand creative.",
        "Raw assets in, finished creative out — social graphics, soft-motion content, seasonal package promos, and membership creative, delivered approval-ready so the brand always feels intentional, never rushed.",
      ]}
      videoHeading="Soft motion that keeps the calm"
      videoBlurb="Gentle short-form motion built from existing imagery — serene, premium, and on-brand for wellness audiences."
      sections={[
        {
          heading: "The hardest aesthetic to produce between clients.",
          paragraphs: [
            "A wellness brand lives on a calm, premium feel — exactly the look that's hardest to create in spare moments between appointments. When creative gets rushed, the brand feels it.",
            "We act as your remote post-production studio: you send treatment photos, space imagery, and seasonal offers, and we turn them into a steady rhythm of polished, quiet creative.",
          ],
          bullets: [
            "Treatment and service features",
            "Seasonal package and gift-card promos",
            "Membership and retention creative",
            "Soft-motion reels and atmosphere content",
            "Local visibility and Google Business creative",
          ],
        },
        {
          heading: "One studio. Lower overhead. On-brand every time.",
          paragraphs: [
            "Instead of stacking a designer, an editor, and social help, one studio keeps everything consistent and moving — at a fraction of the cost of an in-house team.",
            "Scalable for a single location or a group of wellness properties, with a predictable monthly rhythm.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Do we need new professional photos first?",
          a: "No. Existing treatment and space imagery, plus quick staff clips, are usually enough to build a calm, consistent monthly rhythm.",
        },
        {
          q: "Can you keep our quieter brand voice?",
          a: "Yes. Captions and creative are written in your brand's tone — serene and intentional, not hype-driven.",
        },
        {
          q: "How does this work remotely?",
          a: "Most creative is produced from the assets you send. If you ever need new hero imagery, we can help coordinate a local shooter, but it's rarely required for monthly work.",
        },
      ]}
      related={[
        { href: "/hotels", label: "Hotels & Resorts" },
        { href: "/restaurants", label: "Restaurants" },
        { href: "/case-studies", label: "Case Studies" },
        { href: "/packages", label: "Packages" },
        { href: "/contact", label: "Contact" },
      ]}
      videos={VIDEOS}
    />
  );
}
