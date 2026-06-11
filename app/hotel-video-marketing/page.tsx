import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";
import { FEATURED_MOTION, HERO_ROTATION, MOTION_CAROUSEL } from "@/components/marketing/media";

const DESCRIPTION =
  "Hotel video marketing built from the footage and photos you already have: short-form Reels, room and amenity videos, F&B and event promos, delivered monthly, no shoots required.";

export const metadata: Metadata = {
  title: "Hotel Video Marketing & Short-Form Video for Hotels",
  description: DESCRIPTION,
  alternates: { canonical: "/hotel-video-marketing" },
  openGraph: {
    title: "Hotel Video Marketing & Short-Form Video for Hotels",
    description: DESCRIPTION,
    url: "/hotel-video-marketing",
  },
};

const VIDEOS = [
  FEATURED_MOTION, // Poolside campaign
  HERO_ROTATION[5], // Luxury room timelapse
  MOTION_CAROUSEL[0], // Bar & cocktails
  MOTION_CAROUSEL[13], // Seasonal timelapse
  HERO_ROTATION[1], // Hotel entrance
  MOTION_CAROUSEL[9], // Photorealistic timelapse transition
];

export default function HotelVideoMarketingPage() {
  return (
    <SeoLandingPage
      path="/hotel-video-marketing"
      serviceName="Hotel Video Marketing"
      serviceType="Short-form video production for hotels and hospitality brands"
      metaDescription={DESCRIPTION}
      eyebrow="Hotel Video Marketing"
      h1="Short-form video for hotels, made from the footage you already have."
      intro={[
        "Video is what social platforms reward right now, Reels and short vertical cuts consistently out-reach static posts for hotels. The catch is that most properties think video means hiring a videographer or booking a production day. It usually doesn't.",
        "Archer Design builds hotel marketing video from the material you already own: property photography, B-roll from past shoots, drone clips, even strong phone footage from your events team. We cut, color, caption, and format it into platform-ready short-form video, delivered monthly alongside your graphics, and where photography is all you have, we can produce cinematic motion from stills.",
        "The result is a feed that moves: room and amenity videos, F&B promos, event recaps, and seasonal campaign spots, without a single production day on your calendar.",
      ]}
      videoHeading="Examples from the portfolio"
      videoBlurb="Short-form hospitality video built without new shoots, room timelapses, F&B motion, poolside campaign cuts, and seasonal transitions, all from existing assets."
      videos={VIDEOS}
      sections={[
        {
          heading: "What hotel video marketing covers",
          paragraphs: [
            "Each month we look at your calendar and build video where it earns its keep. That usually means a mix of always-on property content (rooms, lobby, pool, views), revenue-driving promos (restaurant specials, spa offers, packages), and time-boxed moments (weddings, holidays, local events).",
            "Typical deliverables include:",
          ],
          bullets: [
            "Vertical Reels and TikTok-format cuts sized 9:16",
            "Room, suite, and amenity showcase videos",
            "F&B and bar motion content for specials and seasonal menus",
            "Event and wedding promo spots that fill the calendar",
            "Seasonal transitions and campaign openers built from stills",
            "Captions and on-screen text written to match your voice",
          ],
        },
        {
          heading: "No shoot? Not a problem.",
          paragraphs: [
            "The biggest myth in hotel video is that you need fresh footage to start. Most properties are sitting on years of photography that has never been used as motion. We animate stills into cinematic timelapses, build transitions between seasons, and combine photo sets into moving sequences that read as video on a phone screen.",
            "When you do have real footage (a past brand shoot, drone passes, or event clips), we cut it into multiple short-form pieces rather than letting it sit in a folder. One good 3-minute property video can become eight Reels.",
          ],
        },
        {
          heading: "Built for how hotels actually approve content",
          paragraphs: [
            "Every video arrives finished and labeled, with caption copy attached, sized for the platform it's going to. Flag properties get brand-standard-aware editing, logo treatment, typography, and tone that won't bounce off a brand review. You review, approve, and schedule; we handle revisions quickly because we're working from your brand files.",
            "If you already work with us on social media management, video slots into the same monthly plan and the same approval flow: one partner, one invoice.",
          ],
        },
        {
          heading: "The cost case",
          paragraphs: [
            "A freelance videographer day runs real money before editing even starts, and an in-house content hire who can shoot and edit is a $90K+ commitment with benefits and management overhead on top. For a single property posting 3–5 videos a month, neither math works.",
            "Because we build from existing assets, you pay a fixed monthly fee for finished video as part of your creative package. See the cost savings breakdown or compare packages for current tiers.",
          ],
        },
        {
          heading: "Start with a free sample",
          paragraphs: [
            "Send us a handful of property photos or a clip you already have, and we'll include short-form motion in your free 5-asset trial so you can see exactly how your property looks in movement. Five finished pieces, 7 days, no card. If the quality earns the budget, we go monthly.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Can you really make video from photos alone?",
          a: "Yes. We produce cinematic motion from stills, timelapses, seasonal transitions, parallax movement, and image-to-image sequences. On a phone screen, well-built motion from photography reads as video and performs like it.",
        },
        {
          q: "What formats do you deliver?",
          a: "Whatever the platform needs: 9:16 vertical for Reels, TikTok and Stories, 1:1 and 4:5 for feed, 16:9 for YouTube or your website. Each video is exported per placement, not one file stretched across all of them.",
        },
        {
          q: "Do you write the captions and hooks?",
          a: "Yes, every video ships with caption copy and on-screen text written for your property's voice. You can edit anything before it posts; most clients post as delivered.",
        },
        {
          q: "How many videos do we get per month?",
          a: "It depends on your package and your calendar, months with a big event or seasonal push usually weight heavier toward video. Ask about specific counts during the free trial and we'll scope it to your properties.",
        },
        {
          q: "Who owns the finished videos?",
          a: "You do. Everything we deliver is yours to use across social, your website, OTA listings, screens on property, anywhere.",
        },
      ]}
      related={[
        { href: "/hotel-social-media-management", label: "Hotel social media management" },
        { href: "/hotel-restaurant-event-promos", label: "Restaurant & event promos" },
        { href: "/hospitality-creative-support", label: "Hospitality creative support" },
        { href: "/hotel-marketing-cost-savings", label: "Marketing cost savings" },
        { href: "/case-studies", label: "Case studies" },
        { href: "/packages", label: "Packages" },
      ]}
    />
  );
}
