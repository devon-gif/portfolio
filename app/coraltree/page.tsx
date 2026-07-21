import type { Metadata } from "next";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { CoralTreeHeader } from "@/components/marketing/coraltree/CoralTreeHeader";
import { CinematicBeat, Hero, ScaleStrip } from "@/components/marketing/coraltree/Hero";
import { SplitIntro } from "@/components/marketing/coraltree/SplitIntro";
import { CreativeOpportunity } from "@/components/marketing/coraltree/CreativeOpportunity";
import { MotionDifferentiator } from "@/components/marketing/coraltree/MotionDifferentiator";
import { ExperienceSystem } from "@/components/marketing/coraltree/ExperienceSystem";
import { MotionGallery } from "@/components/marketing/coraltree/MotionGallery";
import { ProofSection } from "@/components/marketing/coraltree/ProofSection";
import { CostCapacity } from "@/components/marketing/coraltree/CostCapacity";
import {
  CoralTreeFooter,
  EntryPointSection,
  FinalCtaSection,
  PersonalizedNoteSection,
} from "@/components/marketing/coraltree/ClosingSections";

const PAGE_TITLE = "CoralTree Hospitality × Archer Design | Custom Creative Proposal";
const PAGE_DESCRIPTION =
  "A private motion and hospitality creative proposal prepared for CoralTree Hospitality and Genevieve Belou.";
const OG_IMAGE = absoluteUrl("/coraltree/media/reference/coraltree-resorts-collection.webp");

// Private, personalized sales page — never indexed, never listed in the
// sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits this
// route) or in any nav/footer. Accessible only via the direct URL.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/coraltree") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/coraltree"),
    images: [{ url: OG_IMAGE, width: 1200, height: 675, alt: "CoralTree Hospitality portfolio — reference photography" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function CoralTreePage() {
  return (
    <div className={`${fraunces.variable} coraltree-theme relative min-h-screen`}>
      <CoralTreeHeader />
      <Hero />
      <CinematicBeat />
      <SplitIntro />
      <ScaleStrip />
      <CreativeOpportunity />
      <MotionDifferentiator />
      <ExperienceSystem />
      <MotionGallery />
      <ProofSection />
      <CostCapacity />
      <EntryPointSection />
      <PersonalizedNoteSection />
      <FinalCtaSection />
      <CoralTreeFooter />
    </div>
  );
}
