"use client";

import {
  MotionDesignSlideshow,
  type MotionSlide,
} from "../../tcrm/components/MotionDesignSlideshow";

import { TCRM_BLOB_MOTION } from "../../tcrm/tcrm-motion-blob-manifest";

import styles from "../../tcrm/components/MotionDesignShowcase.module.css";

/*
 * Hawkins-specific motion library.
 *
 * IMPORTANT:
 * - Does not modify /tcrm.
 * - Does not delete any source videos.
 * - Removes duplicate representations only from this slideshow.
 * - Opening sequence is based on the slide numbers Devon selected
 *   from the previous 78-slide Hawkins/TCRM ordering.
 */

const PINNED_LOCALS = [
  // Previous #34
  "public/coral-tree/movies/hero background.mp4",

  // Previous #74
  "public/tcrm/videos/valencia/valencia-motion-01.mp4",

  // Previous #69
  "public/tcrm/videos/pancake-pour.mp4",

  // Previous #67
  "public/Oxford/videos/Langham.mp4",

  // Previous #59
  "public/Pyramid hospitality/Videos/Room.mp4",

  // Previous #50
  "public/tcrm/videos/elegant-hospitality-moment.mp4",

  // Previous #48
  "public/Oxford/videos/Sushi.mp4",

  // Previous #36
  "public/first-hospitality/videos/wedding-hero.mp4",

  // Previous #32
  "public/tcrm/videos/bar-and-cocktails.mp4",

  // Previous #28
  "public/Oxford/videos/Lexington.mp4",

  // Previous #21
  "public/Pyramid hospitality/Videos/aerial.mp4",

  // Previous #11
  "public/tcrm/videos/luxury-hotel-entrance-night-concept.mp4",

  // Previous #8
  "public/tcrm/videos/valencia/valencia-motion-02.mp4",
] as const;

/*
 * Known duplicate representations discovered in the 78-slide set.
 *
 * Valencia duplicate pairs:
 *   #5  George Exterior       = #7  Valencia Motion 04
 *   #6  Valencia Motion 05    = #60 Cielo Sunset
 *   #8  Valencia Motion 02    = #57 Pool Experience
 *   #14 Arrival Car           = #24 Valencia Motion 03
 *   #15 Texican Bar           = #18 Valencia Motion 06
 *   #46 Hero                  = #74 Valencia Motion 01
 *
 * We keep the stronger/descriptive version unless one of Devon's
 * specifically requested opening slides needs to be preserved.
 *
 * Pyramid web/full pairs:
 * Keep the full version and hide the duplicate web encode.
 */
const DROP_LOCALS = new Set<string>([
  // Valencia mirrors
  "public/valencia/media/george-exterior.mp4",
  "public/tcrm/videos/valencia/valencia-motion-05.mp4",
  "public/valencia/media/pool-experience.mp4",
  "public/tcrm/videos/valencia/valencia-motion-03.mp4",
  "public/tcrm/videos/valencia/valencia-motion-06.mp4",
  "public/valencia/media/hero.mp4",

  // Pyramid duplicate web encodes
  "public/Pyramid hospitality/Videos/pool-web.mp4",
  "public/Pyramid hospitality/Videos/aerial-web.mp4",
  "public/Pyramid hospitality/Videos/room-web.mp4",
  "public/Pyramid hospitality/Videos/dock-web.mp4",
  "public/Pyramid hospitality/Videos/pancake-web.mp4",
]);

function mix(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  hash ^= 8132026;

  return hash >>> 0;
}

function getVideos(): MotionSlide[] {
  /*
   * First remove the known duplicates and protect against an identical
   * Blob URL accidentally appearing more than once.
   */
  const seenSrc = new Set<string>();

  const clean = TCRM_BLOB_MOTION
    .filter((item) => !DROP_LOCALS.has(item.local))
    .filter((item) => {
      if (seenSrc.has(item.src)) return false;
      seenSrc.add(item.src);
      return true;
    });

  const byLocal = new Map(
    clean.map((item) => [item.local, item]),
  );

  /*
   * Devon's selected sequence always comes first.
   */
  const pinned = PINNED_LOCALS
    .map((local) => byLocal.get(local))
    .filter(
      (
        item,
      ): item is (typeof clean)[number] =>
        Boolean(item),
    );

  const pinnedSet = new Set(PINNED_LOCALS);

  /*
   * Everything else follows in a stable curated order.
   * This keeps the library varied without changing on reload.
   */
  const remainder = clean
    .filter((item) => !pinnedSet.has(item.local))
    .sort((a, b) => mix(a.src) - mix(b.src));

  return [...pinned, ...remainder].map((item) => ({
    src: item.src,
    label: item.label,
    group: item.group,
  }));
}

export function HawkinsMotionDesignShowcase() {
  const videos = getVideos();

  if (!videos.length) return null;

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
            experiences, destination
            storytelling, transitions,
            F&amp;B, rooms, events, and
            polished motion designed to
            turn existing property imagery
            into something guests can feel.
          </p>
        </div>

        <MotionDesignSlideshow items={videos} />

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
