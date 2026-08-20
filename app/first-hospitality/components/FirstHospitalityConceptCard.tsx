import Image from "next/image";
import type { FirstHospitalityConcept } from "../first-hospitality-media";
import { FirstHospitalityVideoCard } from "./FirstHospitalityVideoCard";

/**
 * Renders one custom First Hospitality concept slot inside the project's
 * .fh-media-frame treatment. Branches at render time on the precomputed
 * `available`/`posterAvailable` flags (see first-hospitality-media.ts):
 *
 *  - Real video exists: real playback via FirstHospitalityVideoCard.
 *  - No video, but a poster exists: static poster image only (no <video>,
 *    no autoplay controls to hide, nothing that can visually "fail").
 *  - Neither exists yet: a refined placeholder card naming the category
 *    (and property, when known), so the section never shows a broken video
 *    icon, browser error UI, empty black box, or missing-image symbol.
 *
 * `concept.property` is optional -- only set when a property name is clearly
 * legible in the footage itself. When absent, every label below falls back
 * to the (always-accurate) category alone rather than guessing a name.
 */
export function FirstHospitalityConceptCard({
  concept,
  eager = false,
  className,
  aspectClassName,
}: {
  concept: FirstHospitalityConcept;
  eager?: boolean;
  className?: string;
  /** Overrides the concept's own real-aspect class, for placements (like the
   * page hero) where the parent element defines its own fill behavior. */
  aspectClassName?: string;
}) {
  const frameClass = ["fh-media-frame", aspectClassName ?? concept.aspectClassName, className].filter(Boolean).join(" ");
  const label = concept.property ? `${concept.property} — ${concept.category}` : concept.category;

  if (concept.available) {
    return (
      <div className={frameClass}>
        <FirstHospitalityVideoCard
          src={concept.src}
          poster={concept.posterAvailable ? concept.poster : undefined}
          label={`${label} motion concept`}
          eager={eager}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (concept.posterAvailable) {
    return (
      <div className={frameClass}>
        <Image
          src={concept.poster}
          alt={label}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={eager}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${frameClass} fh-placeholder`} role="img" aria-label={`Concept placeholder for ${label}`}>
      <div className="fh-placeholder-inner">
        <span className="fh-placeholder-eyebrow">Concept in production</span>
        {concept.property && <p className="fh-placeholder-property">{concept.property}</p>}
        <p className="fh-placeholder-category">{concept.category}</p>
      </div>
    </div>
  );
}
