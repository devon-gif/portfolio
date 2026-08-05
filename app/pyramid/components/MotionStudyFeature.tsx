import type { PyramidMotionStudy } from "../pyramid-media";
import { SafeVideo } from "./SafeVideo";

/**
 * One large editorial motion-study block, reused for all Pyramid motion
 * studies (see pyramid-media.ts) rather than hardcoding separate copies of
 * near-identical markup. The `variant` field on each study drives a
 * genuinely different layout treatment (oversized, split, split-reverse,
 * strip, cinematic) via CSS in pyramid.css, so the section reads as several
 * distinct compositions rather than one card repeated.
 *
 * Not every study has a confirmed property/location (see pyramid-media.ts
 * for the attribution rules) -- this component gracefully falls back to the
 * study's general category instead of rendering "undefined" when `property`
 * is absent.
 */
export function MotionStudyFeature({ study, number, eager = false }: { study: PyramidMotionStudy; number: string; eager?: boolean }) {
  const hasProperty = Boolean(study.property);
  const label = hasProperty ? `${study.property} — ${study.location}` : study.category;
  const heading = study.property ?? study.category;
  const eyebrow = hasProperty ? study.category : "Speculative creative study";
  const alt = hasProperty ? `${study.property} motion study` : `${study.category} motion study`;

  return (
    <div className={`pyr-study pyr-study--${study.variant}`}>
      <div className="pyr-study-media">
        <SafeVideo videoSrc={study.videoSrc} posterSrc={study.posterSrc} alt={alt} eager={eager} />
        <span className="pyr-study-media-caption">{label}</span>
      </div>
      <div className="pyr-study-copy">
        <span className="pyr-study-number" aria-hidden="true">
          {number}
        </span>
        <span className="pyr-study-category">{eyebrow}</span>
        <h3 className="pyr-serif">{heading}</h3>
        <p className="pyr-study-direction">{study.creativeDirection}</p>
        <p className="pyr-study-caption">{study.caption}</p>
      </div>
    </div>
  );
}
