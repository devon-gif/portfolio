import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  UtensilsCrossed,
  PartyPopper,
  CheckCircle2,
  Film,
  ImageIcon,
  Wine,
  Sparkles,
  Heart,
  Tag,
  CalendarRange,
  Layers,
  Smartphone,
  Presentation,
  Wand2,
  MessageSquareText,
  Info,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl, CALENDLY_URL } from "@/lib/seo";
import { oxfordVideoByKey, oxfordVideosByPresentation } from "./oxford-media";
import { Reveal } from "./components/Reveal";
import { OxfordHeader } from "./components/OxfordHeader";
import { OxfordVideoCard } from "./components/OxfordVideoCard";

// Private, personalized outreach page prepared for George Jordan, President,
// Oxford Hotels & Resorts, LLC. Never indexed, never linked from the main
// nav, sitemap (see lib/seo.ts PUBLIC_PAGES, which intentionally omits this
// route), or footer. Accessible only via the direct URL. Same treatment as
// this project's other private proposal microsites (/tcrm, /topline,
// /george): per-page noindex/nofollow metadata, plus components/AppChrome.tsx
// PUBLIC_PREFIXES so it renders full-bleed instead of the CRM sidebar.
const PAGE_TITLE = "Creative Production Concept for Oxford Hotels & Resorts";
const PAGE_DESCRIPTION =
  "A private creative-production concept prepared for Oxford Hotels & Resorts by Archer Design.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/oxford") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/* ── Cinematic media hierarchy ────────────────────────────────────────────
   All 11 clips in public/oxford/videos are used, in the exact order Devon
   specified. app/oxford/oxford-media.ts is the single source of truth for
   src/poster/copy/order -- this file only decides layout per presentation
   tier and, where a clip's real orientation (checked via ffprobe) differs
   from what a generic "landscape" treatment would assume, the specific
   aspect box used.

     1. Langham.mp4    hero        landscape 16:9  full cinematic opener
     2. Lexington.mp4  immersive   portrait  3:4    large centered feature
     3. Sushi.mp4      feature     square    1:1    large square feature
     4. rooftop.mp4    feature     landscape 4:3    near-full-screen feature
     5. sailboat.mp4   feature     portrait  3:4    large split-column feature
     6. Lobby.mp4      editorial   landscape 16:9   alternating (left)
     7. Fountain.mp4   editorial   portrait  3:4    alternating (right)
     8. galaxy.mp4      editorial  square    1:1    alternating (wide)
     9. pool.mp4        compact    landscape 16:9   supporting grid
    10. Drink.mp4       compact    square    1:1    supporting grid
    11. Wedding.mp4     compact    landscape 4:3    supporting grid

   Note on Langham.mp4: this clip visibly shows "THE LANGHAM" signage on the
   entrance canopy, a different, unrelated hotel brand. Devon confirmed
   in-session that it should be used as the hero exactly as-is. */
const HERO_VIDEO = oxfordVideoByKey("langham");
const IMMERSIVE_VIDEO = oxfordVideoByKey("lexington");
const [FEATURE_SUSHI, FEATURE_ROOFTOP, FEATURE_SAILBOAT] = oxfordVideosByPresentation("feature");
const EDITORIAL_VIDEOS = oxfordVideosByPresentation("editorial");
const COMPACT_VIDEOS = oxfordVideosByPresentation("compact");

const FEATURE_HEADINGS: Record<string, string> = {
  sushi: "Small details make dining feel alive.",
  rooftop: "The skyline is part of the experience.",
  sailboat: "A room can carry the destination with it.",
};
const EDITORIAL_HEADINGS: Record<string, string> = {
  lobby: "Public spaces should feel active before the guest arrives.",
  fountain: "Atmosphere extends beyond the guest room.",
  galaxy: "One view can hold an entire evening.",
};
const EDITORIAL_ALIGN: Record<string, "left" | "right" | "wide"> = {
  lobby: "left",
  fountain: "right",
  galaxy: "wide",
};

/* ── Process strip beneath the "Motion from Existing Photography" intro ── */
const PROCESS_STEPS = [
  {
    num: "01",
    title: "Existing property photography",
    body: "Approved imagery becomes the visual foundation.",
  },
  {
    num: "02",
    title: "Motion, compositing and VFX",
    body: "Light, atmosphere, people and environmental movement are introduced.",
  },
  {
    num: "03",
    title: "Campaign-ready hospitality asset",
    body: "The finished visual can support web, advertising, social and property campaigns.",
  },
];

/* ── What Archer adds — capability grid ───────────────────────────────── */
const CAPABILITIES = [
  { label: "Short-form motion from existing photography", icon: Film },
  { label: "Social and campaign graphics", icon: ImageIcon },
  { label: "Restaurant and F&B promotions", icon: UtensilsCrossed },
  { label: "Rooftop and nightlife campaigns", icon: Wine },
  { label: "Wedding, meeting, and event creative", icon: PartyPopper },
  { label: "Package and direct-booking visuals", icon: Tag },
  { label: "Seasonal and local-demand campaigns", icon: CalendarRange },
  { label: "Property-level campaign adaptations", icon: Layers },
  { label: "Platform-ready feed and Story exports", icon: Smartphone },
  { label: "Sales-support and presentation assets", icon: Presentation },
  { label: "Photo polishing and branded treatments", icon: Wand2 },
  { label: "Concise campaign captions", icon: MessageSquareText },
];

/* ── Pricing ───────────────────────────────────────────────────────────
   Every number and phrase below matches the pricing rules agreed with
   Devon: $800/property/month is the only concrete dollar figure on the
   page. The 15+ and full-portfolio tiers are deliberately priced as
   "discounted flat rate" / "deepest portfolio rate" with no invented
   number, and no exact Oxford property count appears anywhere -- Oxford's
   own site describes "Select Properties" without a dependable current
   total, so this page never states one. */
const PRICING_INCLUDES = [
  "5 original motion graphics per month",
  "5 original static graphics per month",
  "10 original creative pieces total",
  "Produced from approved property photography and materials",
  "Property-specific brand execution",
  "Standard social-format delivery",
  "One consolidated minor revision round",
  "Organized monthly delivery",
];

const VOLUME_SUBPOINTS = [
  "One centralized Oxford approver",
  "Consolidated monthly briefs",
  "Consolidated revisions",
  "Agreed monthly asset-submission deadlines",
  "Phased onboarding if needed",
];

/* ── Workflow — four steps ───────────────────────────────────────────── */
const WORKFLOW_STEPS = [
  {
    idx: "01",
    title: "Property & priority selection",
    body: "Oxford selects participating properties and monthly priorities.",
  },
  {
    idx: "02",
    title: "Materials & direction",
    body: "Oxford supplies approved photography, campaign details, dates, restrictions, and brand guidance.",
  },
  {
    idx: "03",
    title: "Production",
    body: "Archer produces five motion and five static concepts per property.",
  },
  {
    idx: "04",
    title: "Review & distribution",
    body: "Oxford reviews, approves, and distributes the work.",
  },
];

/* ── Rollout ──────────────────────────────────────────────────────────── */
const ROLLOUT_CHOICES = ["Initial property cluster", "15+ property activation", "Full participating portfolio"];

/* ── Proof section ────────────────────────────────────────────────────────
   Oxford-specific proof figures, sourced directly from Devon's current
   social analytics dashboard for the reporting period Jan 1, 2021 - Aug 3,
   2026 (verified dashboard totals: 2.64K posts / 16.05M impressions / 5.2M
   reach / 596.43K engagements / 14.8K followers / 3.72% engagement rate --
   only the first four are shown here). Deliberately a local constant, not
   lib/proof-stats.ts (PROOF), because that file's rounded aggregate figures
   are shared with the homepage MetricsStrip and /social-media-work and are
   from a different reporting period -- changing it would alter unrelated
   routes. The 2.64K figure reflects posts published, not verified unique
   creative pieces, so it is labeled accordingly. */
const OXFORD_PROOF_STATS = [
  { value: "2.64K", label: "Social posts published", icon: Layers },
  { value: "16.05M", label: "Impressions generated", icon: Sparkles },
  { value: "5.2M", label: "People reached", icon: Building2 },
  { value: "596.43K", label: "Engagements generated", icon: Heart },
];
const PROOF_DISCLAIMER =
  "Tracked across supported hospitality social campaigns from January 1, 2021 through August 3, 2026. Presented as evidence of existing Archer Design-supported work and not as a guarantee of future performance for Oxford.";

// Exact approved wording, reused verbatim from app/social-media-work/page.tsx
// (HOTEL_INDIGO_QUOTE / HOTEL_INDIGO_SUPPORTING_COPY / HOTEL_INDIGO_QUALIFICATION).
// Do not alter this language.
const HOTEL_INDIGO_QUOTE =
  "During Archer Design's support, Hotel Indigo Pittsburgh University-Oakland reported becoming the top-performing Hotel Indigo on the East Coast.";
const HOTEL_INDIGO_SUPPORTING_COPY =
  "The approach connected events, F&B, meetings, local demand drivers, seasonal priorities, and property storytelling to a consistent creative and social-media calendar.";
const HOTEL_INDIGO_QUALIFICATION =
  "Performance statement reflects reporting shared by the property during the engagement and should not be interpreted as an independently audited brand-wide claim.";

export default function OxfordPage() {
  return (
    <div className={`${fraunces.variable} oxford-theme relative min-h-screen`} id="top">
      <OxfordHeader />

      {/* ============================================================
          HERO — Langham.mp4, contained cinematic box (~90-95vw)
          ============================================================ */}
      <section className="ox-hero-cinematic">
        <div className="ox-hero-shell">
          <div className="ox-hero-media-box">
            <OxfordVideoCard video={HERO_VIDEO} eager fill className="ox-fill-rounded" />
            <div className="ox-hero-overlay" aria-hidden="true" />
            <div className="ox-hero-cinematic-copy">
              <span className="ox-eyebrow">Prepared for Oxford Hotels &amp; Resorts</span>
              <h1 className="ox-serif">Creative built to move at portfolio speed.</h1>
              <p className="ox-sub">
                Archer Design turns approved property photography, dining experiences, events, packages, and
                commercial priorities into finished motion and campaign creative across the portfolio.
              </p>
              <div className="ox-hero-actions">
                <a href="#work" className="ox-btn ox-btn-primary">
                  Explore the work
                </a>
                <Link href="/social-media-work" className="ox-btn ox-btn-ghost-light">
                  More hospitality work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ox-notice-bar">
        <div className="ox-shell">
          <p>
            Private working concept prepared by Archer Design. No partnership, endorsement, property
            participation, or commercial agreement is implied.
          </p>
        </div>
      </div>

      {/* ============================================================
          MOTION FROM EXISTING PHOTOGRAPHY — the only section between the
          hero and the video sequence. Premium two-column editorial intro
          (headline left, glass copy panel right) plus a three-step glass
          process strip and a separate, subtle speculative-work note. The
          former "Opportunity" section (redundant with this one and with
          the "what Archer adds" section further down) has been removed
          entirely -- flow is now Hero -> this section -> the video work.
          ============================================================ */}
      <section className="ox-on-white ox-section-pad ox-process-intro" id="process">
        <div className="ox-process-shell">
          <Reveal className="ox-process-grid">
            <div className="ox-process-left">
              <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">Motion from existing photography</span></div>
              <h2 className="ox-serif ox-process-heading">Oxford&rsquo;s existing hotel photography, brought to life.</h2>
            </div>
            <div className="ox-process-panel ox-glass">
              <p>
                These private concepts began with existing photographs from Oxford Hotels &amp; Resorts
                properties. Archer Design used motion design, compositing, environmental animation, visual
                effects, and cinematic pacing to transform the still images into polished assets for hotel
                websites, digital advertising, social campaigns, property launches, dining promotions, weddings,
                events, and destination storytelling.
              </p>
              <p>
                The videos are intentionally presented without permanent headlines, logos, offers, or calls to
                action. Each piece can serve as a flexible visual foundation, then be adapted to a specific
                property, campaign, promotion, format, or commercial priority.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1} className="ox-process-steps">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="ox-process-step ox-glass">
                <span className="ox-process-step-num ox-serif">{step.num}</span>
                <h3 className="ox-serif">{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={2} className="ox-process-note">
            <Info size={15} strokeWidth={2} aria-hidden="true" />
            <p>
              Private speculative work created to demonstrate production possibilities. These concepts were not
              commissioned or approved by Oxford Hotels &amp; Resorts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          THE WORK — every clip in Devon's exact order: an immersive
          portrait feature, three large standalone features (each sized to
          its own real aspect ratio), a three-clip alternating editorial
          sequence, and a compact supporting grid. One continuous ink
          background so the whole sequence reads as one cinematic scroll
          story rather than a portfolio grid.
          ============================================================ */}
      <section className="ox-on-ink ox-work-cinematic" id="work">
        <div className="ox-shell">
          <Reveal>
            <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">Selected hospitality work</span></div>
            <p className="ox-section-disclaimer">
              These private speculative concepts were created to demonstrate possible motion treatments using
              property imagery. They are not commissioned Oxford campaigns.
            </p>
          </Reveal>
        </div>

        {/* ── Immersive feature: Lexington (portrait, real 3:4 source — a
             wide landscape crop would cut off most of the building, so this
             uses a large centered portrait frame instead of a wide box) ── */}
        <Reveal className="ox-feature-immersive">
          <div className="ox-feature-copy">
            <span className="ox-motion-label">Motion concept &middot; {IMMERSIVE_VIDEO.category}</span>
            <h2 className="ox-serif">Arrival becomes atmosphere.</h2>
            <p>{IMMERSIVE_VIDEO.description}</p>
          </div>
          <div className="ox-feature-media">
            <OxfordVideoCard video={IMMERSIVE_VIDEO} fill className="ox-fill-rounded" aspectClassName="aspect-[3/4]" showReelTag />
          </div>
        </Reveal>

        {/* ── Feature: Sushi (large square, source is genuinely 1:1) ── */}
        <Reveal className="ox-feature-square">
          <div className="ox-feature-copy">
            <span className="ox-motion-label">Motion concept &middot; {FEATURE_SUSHI.category}</span>
            <h2 className="ox-serif">{FEATURE_HEADINGS.sushi}</h2>
            <p>{FEATURE_SUSHI.description}</p>
          </div>
          <div className="ox-feature-media">
            <OxfordVideoCard video={FEATURE_SUSHI} fill className="ox-fill-rounded" />
          </div>
        </Reveal>

        {/* ── Feature: rooftop (near-full-screen, landscape) ── */}
        <Reveal className="ox-feature ox-feature-wide">
          <div className="ox-shell ox-feature-copy">
            <span className="ox-motion-label">Motion concept &middot; {FEATURE_ROOFTOP.category}</span>
            <h2 className="ox-serif">{FEATURE_HEADINGS.rooftop}</h2>
            <p>{FEATURE_ROOFTOP.description}</p>
          </div>
          <div className="ox-feature-media">
            <OxfordVideoCard video={FEATURE_ROOFTOP} fill className="ox-fill-rounded" />
          </div>
        </Reveal>

        {/* ── Feature: sailboat (portrait, split two-column — 56% media / 44%
             copy, does not stretch the vertical source horizontally) ── */}
        <Reveal className="ox-feature-split">
          <div className="ox-feature-media">
            <OxfordVideoCard video={FEATURE_SAILBOAT} fill className="ox-fill-rounded" aspectClassName="aspect-[3/4]" />
          </div>
          <div className="ox-feature-copy">
            <span className="ox-motion-label">Motion concept &middot; {FEATURE_SAILBOAT.category}</span>
            <h2 className="ox-serif">{FEATURE_HEADINGS.sailboat}</h2>
            <p>{FEATURE_SAILBOAT.description}</p>
          </div>
        </Reveal>

        {/* ── Alternating editorial sequence: Lobby, Fountain, galaxy ── */}
        <div className="ox-alt-sequence">
          {EDITORIAL_VIDEOS.map((video, i) => {
            const align = EDITORIAL_ALIGN[video.key] ?? "left";
            const aspectClassName =
              video.aspect === "square" ? "aspect-square" : video.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[16/9]";
            const rowClass = `ox-alt-row ox-alt-row--${align}${video.aspect === "portrait" ? " ox-alt-row--portrait" : ""}`;
            return (
              <Reveal key={video.key} className={rowClass} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="ox-alt-media">
                  <OxfordVideoCard video={video} aspectClassName={aspectClassName} className="ox-fill-rounded" />
                </div>
                <div className="ox-alt-copy">
                  <span className="ox-motion-label">Motion concept &middot; {video.category}</span>
                  <h3 className="ox-serif">{EDITORIAL_HEADINGS[video.key]}</h3>
                  <p>{video.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* ── Compact supporting grid: pool, Drink, Wedding ── */}
        <div className="ox-shell">
          <Reveal className="ox-compact-head">
            <span className="ox-motion-label">More motion concepts</span>
            <h2 className="ox-serif">More moments across the guest journey.</h2>
          </Reveal>
          <div className="ox-compact-grid">
            {COMPACT_VIDEOS.map((video, i) => {
              const aspectClassName =
                video.aspect === "square" ? "aspect-square" : video.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";
              return (
                <Reveal key={video.key} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="ox-compact-card">
                    <div className="relative">
                      {video.badge && <span className="ox-work-badge">{video.badge}</span>}
                      <OxfordVideoCard video={video} aspectClassName={aspectClassName} className="ox-fill-rounded" />
                    </div>
                    <div className="ox-compact-caption ox-glass-dark">
                      <p className="ox-work-category">{video.category}</p>
                      <p className="ox-work-sentence">{video.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="ox-shell">
          <Reveal delay={2} className="mt-4 flex justify-center">
            <Link href="/social-media-work" className="ox-btn ox-btn-ghost-light">
              View more hospitality work
            </Link>
          </Reveal>

          {/* ── Proof ────────────────────────────────────────────── */}
          <Reveal delay={3}>
            <div className="ox-metrics ox-metrics-ink">
              {OXFORD_PROOF_STATS.map((stat) => (
                <div key={stat.label} className="ox-metric">
                  <span className="ox-num ox-serif">{stat.value}</span>
                  <span className="ox-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
            <p className="ox-proof-note">{PROOF_DISCLAIMER}</p>
          </Reveal>

          <Reveal delay={4}>
            <div className="ox-indigo-card">
              <blockquote className="ox-indigo-quote ox-serif">&ldquo;{HOTEL_INDIGO_QUOTE}&rdquo;</blockquote>
              <p className="ox-indigo-support">{HOTEL_INDIGO_SUPPORTING_COPY}</p>
              <p className="ox-indigo-name">Hotel Indigo Pittsburgh, University-Oakland</p>
              <p className="ox-indigo-qualification">{HOTEL_INDIGO_QUALIFICATION}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          WHAT ARCHER ADDS
          ============================================================ */}
      <section className="ox-on-white-alt ox-section-pad" id="capabilities">
        <div className="ox-shell">
          <Reveal>
            <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">Creative-production capacity</span></div>
            <div className="ox-section-head">
              <h2 className="ox-serif">More finished creative without rebuilding the marketing department.</h2>
              <p>
                Archer Design supports the production layer behind hospitality marketing. Oxford retains its
                strategy, property leadership, approvals, distribution, and commercial decision-making. Archer
                helps transform those priorities into polished campaign assets.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="ox-cap-grid">
              {CAPABILITIES.map((cap) => (
                <div key={cap.label} className="ox-cap-item">
                  <cap.icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{cap.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PRICING
          ============================================================ */}
      <section className="ox-on-white ox-section-pad" id="pricing">
        <div className="ox-shell">
          <Reveal>
            <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">Monthly creative production</span></div>
            <div className="ox-section-head">
              <h2 className="ox-serif">A complete creative rhythm for every participating property.</h2>
              <p>
                Oxford retains campaign strategy, property communication, publishing, media decisions, and final
                approval. Archer Design supplies the recurring creative-production capacity.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="ox-pricing-primary ox-glass-elevated">
              <div className="ox-pricing-primary-head">
                <span className="ox-eyebrow">Property or cluster activation</span>
                <span className="ox-pricing-amount ox-serif">$800</span>
                <span className="ox-pricing-unit">per property / month</span>
              </div>
              <ul className="ox-pricing-includes">
                {PRICING_INCLUDES.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="ox-pricing-footnote">
                Format exports of the same concept are not counted as additional original creative pieces.
              </p>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="ox-pricing-tiers">
              <div className="ox-pricing-tier ox-glass">
                <span className="ox-eyebrow">Property or cluster activation</span>
                <h3 className="ox-serif">$800 / property / month</h3>
                <p>Available for individual properties and participating clusters of up to 14 hotels.</p>
              </div>
              <div className="ox-pricing-tier ox-glass">
                <span className="ox-eyebrow">15+ property activation</span>
                <h3 className="ox-serif">Discounted flat monthly rate</h3>
                <p>
                  When Oxford activates 15 or more properties under one centralized workflow, Archer Design can
                  offer a discounted flat monthly production rate rather than calculating every property
                  separately.
                </p>
                <ul className="ox-pricing-sub">
                  {VOLUME_SUBPOINTS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="ox-pricing-tier ox-glass">
                <span className="ox-eyebrow">Full participating portfolio</span>
                <h3 className="ox-serif">Deepest portfolio rate</h3>
                <p>
                  A broader portfolio-wide agreement can receive the strongest volume pricing once Oxford
                  confirms the participating property count, production workflow, approval structure, and
                  rollout schedule.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <p className="ox-pricing-note">
              Final volume pricing would be confirmed after Oxford identifies the participating properties and
              approval structure. Pricing shown is a private working concept and not a binding offer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          WORKFLOW
          ============================================================ */}
      <section className="ox-on-white-alt ox-section-pad" id="workflow">
        <div className="ox-shell">
          <Reveal>
            <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">A simple operating model</span></div>
            <div className="ox-section-head">
              <h2 className="ox-serif">Oxford sets the priority. Archer makes it launch-ready.</h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="ox-workflow-cols">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.idx} className="ox-workflow-col ox-glass">
                  <span className="ox-idx ox-serif">{step.idx}</span>
                  <h3 className="ox-serif">{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="ox-workflow-note">
              The workflow can remain centralized through Oxford or be adapted to approved property-level contacts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          ROLLOUT
          ============================================================ */}
      <section className="ox-on-ink ox-section-pad" id="pilot">
        <div className="ox-shell">
          <Reveal>
            <div className="ox-label-row"><span className="ox-rule" /><span className="ox-eyebrow">Getting started</span></div>
            <div className="ox-section-head">
              <h2 className="ox-serif">Start with a focused cluster or move directly into a portfolio activation.</h2>
              <p className="ox-pilot-copy">
                Oxford can begin with a smaller participating group at the standard per-property rate, activate
                15 or more hotels under a discounted flat-rate structure, or define a full participating-portfolio
                rollout. Larger activations can be phased to protect quality, turnaround, and approval
                consistency.
              </p>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="ox-rollout-choices">
              {ROLLOUT_CHOICES.map((choice) => (
                <div key={choice} className="ox-rollout-choice">
                  <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{choice}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="ox-pilot-note">
              Property selection, deliverables, timing, and responsibilities would be agreed before any work
              begins.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="ox-on-ink-deep ox-section-pad ox-cta">
        <div className="ox-shell ox-cta-inner">
          <div className="ox-cta-panel ox-glass-elevated">
            <Reveal>
              <span className="ox-eyebrow" style={{ display: "block", marginBottom: "22px" }}>Next step</span>
              <h2 className="ox-serif">Turn one Oxford property priority into a finished campaign.</h2>
              <p>
                Select a property, restaurant, rooftop, event space, or seasonal opportunity. Archer Design can
                map the creative requirements and propose a focused first project without disrupting
                Oxford&rsquo;s current marketing structure.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <div className="ox-cta-actions">
                <Link href="/social-media-work" className="ox-btn ox-btn-primary">
                  View more work
                </Link>
                <div className="ox-cta-links-row">
                  <a href={CALENDLY_URL} target="_blank" rel="noopener" className="ox-text-link">
                    Continue the conversation
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="ox-on-ink-deep ox-footer">
        <div className="ox-shell ox-footer-inner">
          <span className="ox-footer-word">Archer Design</span>
          <p className="ox-footer-note">
            Prepared privately for Oxford Hotels &amp; Resorts.
            <br />
            Private concept. Not for public distribution.
          </p>
        </div>
      </footer>
    </div>
  );
}
