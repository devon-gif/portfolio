import {
  MotionDesignSlideshow,
  type MotionSlide,
} from "./MotionDesignSlideshow";

import {
  TCRM_BLOB_MOTION,
} from "../tcrm-motion-blob-manifest";

import styles from "./MotionDesignShowcase.module.css";

function openingPriority(src: string) {
  const lower = src.toLowerCase();

  // Always start with the woman / vintage-car arrival piece.
  if (
    lower.includes(
      "hotel-arrival-vintage-car"
    )
  ) {
    return 0;
  }

  if (
    lower.includes("lady")
  ) {
    return 1;
  }

  return 10;
}

function mix(value: string) {
  let hash = 2166136261;

  for (
    let i = 0;
    i < value.length;
    i++
  ) {
    hash ^= value.charCodeAt(i);

    hash = Math.imul(
      hash,
      16777619,
    );
  }

  hash ^= 8132026;

  return hash >>> 0;
}

function getVideos(): MotionSlide[] {
  return TCRM_BLOB_MOTION
    .map((item) => ({
      src: item.src,
      label: item.label,
      group: item.group,
    }))
    .sort((a, b) => {
      const aPriority =
        openingPriority(a.label);

      const bPriority =
        openingPriority(b.label);

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return (
        mix(a.src) -
        mix(b.src)
      );
    });
}

export function MotionDesignShowcase() {
  const videos = getVideos();

  if (!videos.length) {
    return null;
  }

  return (
    <section
      className={styles.section}
      id="motion-library"
    >
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              MOTION LIBRARY
            </span>

            <h2>
              Motion that makes the
              property feel alive.
            </h2>
          </div>

          <p>
            Hospitality campaigns,
            experiences, brand storytelling,
            transitions, and polished motion
            design built to stop the scroll
            and give guests something worth
            noticing.
          </p>
        </div>

        <MotionDesignSlideshow
          items={videos}
        />

        <div className={styles.footer}>
          <span>SHORT-FORM MOTION</span>
          <span>HOSPITALITY CAMPAIGNS</span>
          <span>BRAND MOTION</span>
          <span>SOCIAL CREATIVE</span>
        </div>
      </div>
    </section>
  );
}
