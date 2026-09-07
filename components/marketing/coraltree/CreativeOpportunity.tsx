import { BedDouble, Flag, MapPin, PartyPopper, Sparkles, UtensilsCrossed, Waves, type LucideIcon } from "lucide-react";
import { OPPORTUNITY } from "@/lib/coraltree-content";
import { Reveal } from "./Reveal";

type CardSpan = "ct-opp-span-4" | "ct-opp-span-5" | "ct-opp-span-7" | "ct-opp-span-8" | "ct-opp-span-12";
type CardVariant = "cream" | "sage" | "stone";
type CardSize = "large" | "medium" | "wide" | "banner";

/**
 * Per-card visual treatment, aligned 1:1 by index with OPPORTUNITY.moments
 * (lib/coraltree-content.ts) — the copy itself is untouched, this only maps
 * each existing moment to an icon, a grid span, and a surface variant so the
 * seven cards read as a curated editorial mosaic rather than a uniform
 * table grid. Row math on the 12-col grid (desktop, >=860px):
 *   row 1: Rooms (7)          + Restaurants (5)
 *   row 2: Meetings/Weddings (7) + Spa/Wellness (5)
 *   row 3: Golf (4)           + Openings/Renovations (8)
 *   row 4: Local culture (12) — full-width closing banner
 */
const CARD_META: { icon: LucideIcon; span: CardSpan; variant: CardVariant; size: CardSize }[] = [
  { icon: BedDouble, span: "ct-opp-span-7", variant: "cream", size: "large" }, // Rooms, suites & arrivals
  { icon: UtensilsCrossed, span: "ct-opp-span-5", variant: "sage", size: "medium" }, // Restaurants & seasonal menus
  { icon: PartyPopper, span: "ct-opp-span-7", variant: "stone", size: "large" }, // Meetings, weddings & celebrations
  { icon: Waves, span: "ct-opp-span-5", variant: "cream", size: "medium" }, // Spas, wellness & pools
  { icon: Flag, span: "ct-opp-span-4", variant: "sage", size: "medium" }, // Golf & destination activities
  { icon: Sparkles, span: "ct-opp-span-8", variant: "stone", size: "wide" }, // Openings, renovations & packages
  { icon: MapPin, span: "ct-opp-span-12", variant: "cream", size: "banner" }, // Local culture & sense of place
];

/**
 * "One portfolio. Thousands of moments guests can act on." — the recurring
 * content moments that repeat across CoralTree's collection, and the idea
 * that most of them already start with assets the properties own. Presented
 * as an asymmetric editorial card mosaic (see CARD_META above) rather than
 * a uniform grid.
 */
export function CreativeOpportunity() {
  return (
    <section className="ct-on-ivory ct-section-pad" id="opportunity">
      <div className="ct-shell">
        <Reveal className="ct-opportunity-head">
          <div className="ct-label-row"><span className="ct-rule" /><span className="ct-eyebrow">{OPPORTUNITY.eyebrow}</span></div>
          <h2 className="ct-serif">{OPPORTUNITY.headline}</h2>
          <p>{OPPORTUNITY.body}</p>
        </Reveal>

        <Reveal delay={1}>
          <div className="ct-mosaic-field">
            <div className="ct-moment-mosaic">
              {OPPORTUNITY.moments.map((m, i) => {
                const meta = CARD_META[i];
                const Icon = meta.icon;
                const isBanner = meta.size === "banner";
                return (
                  <div
                    key={m.title}
                    className={`ct-opp-card ct-opp-card--${meta.variant} ct-opp-card--${meta.size} ${meta.span}`}
                  >
                    <span className="ct-opp-icon" aria-hidden="true">
                      <Icon size={isBanner ? 22 : 18} strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3>{m.title}</h3>
                      <p>{m.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={2} className="ct-video-strip">
          <div className="ct-media-frame">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video autoPlay muted loop playsInline preload="none" aria-hidden="true">
              <source src={encodeURI(OPPORTUNITY.videoSrc)} type="video/mp4" />
            </video>
            <span className="ct-scene-tag">{OPPORTUNITY.sceneTag}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
