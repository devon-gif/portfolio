import type { FirstHospitalityConcept } from "../first-hospitality-media";
import { FirstHospitalityConceptCard } from "./FirstHospitalityConceptCard";

export type FirstHospitalityFeatureVariant = "full" | "split" | "portrait";

/**
 * Large editorial feature pairing one First Hospitality custom concept video
 * with business-narrative copy. Distributed individually throughout
 * /first-hospitality (see page.tsx) rather than grouped into one carousel,
 * so each of the five custom videos is large, visible while scrolling, and
 * reinforces the section of the commercial proposal it sits beside.
 *
 * One reusable structure (media + copy) with three CSS-driven variants so
 * the five placements don't all look identical:
 *  - "full": near-full-width cinematic video with the copy panel layered
 *    over a bottom gradient (landscape clips read best this way).
 *  - "split": classic two-column video-and-copy layout. `reversed` flips
 *    which side the video sits on; `asymmetric` narrows the video column.
 *  - "portrait": a centered, generously-sized portrait frame with copy
 *    alongside on desktop -- built for the vertical clips so they never
 *    feel like a tiny card in an oversized empty stage.
 *
 * Reuses FirstHospitalityConceptCard (and, underneath it,
 * FirstHospitalityVideoCard / the shared LazyVideo) for playback, poster
 * fallback, prefers-reduced-motion handling and the missing-media
 * placeholder -- nothing here duplicates that behavior.
 */
export function FirstHospitalityFeature({
  concept,
  number,
  heading,
  copy,
  variant,
  reversed = false,
  asymmetric = false,
  disclaimer,
  eager = false,
}: {
  concept: FirstHospitalityConcept;
  /** Two-digit editorial number, e.g. "02". */
  number: string;
  heading: string;
  copy: string;
  variant: FirstHospitalityFeatureVariant;
  reversed?: boolean;
  asymmetric?: boolean;
  disclaimer?: string;
  eager?: boolean;
}) {
  const label = concept.property ? `${concept.property} — ${concept.category}` : concept.category;

  const classNames = [
    "fh-feature",
    `fh-feature--${variant}`,
    reversed ? "fh-feature--reversed" : "",
    asymmetric ? "fh-feature--asymmetric" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      <div className="fh-feature-media">
        <FirstHospitalityConceptCard concept={concept} eager={eager} className="fh-feature-frame" />
        <span className="fh-feature-media-caption">{label}</span>
      </div>
      <div className="fh-feature-copy">
        <span className="fh-feature-number" aria-hidden="true">
          {number}
        </span>
        {concept.property && <span className="fh-feature-property">{concept.property}</span>}
        <h3 className="fh-serif">{heading}</h3>
        <p>{copy}</p>
        {disclaimer && <p className="fh-concept-disclaimer fh-feature-disclaimer">{disclaimer}</p>}
      </div>
    </div>
  );
}
