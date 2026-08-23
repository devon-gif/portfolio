import { DnsMotionSlideshow, type DnsMotionSlide } from "./DnsMotionSlideshow";
import { TCRM_BLOB_MOTION } from "../../tcrm/tcrm-motion-blob-manifest";
import { TCRM_VIDEOS } from "../../tcrm/tcrm-media";
import { CREATIVE_EYEBROW, CREATIVE_HEADING_LINE_1, CREATIVE_HEADING_LINE_2, CREATIVE_COPY, CREATIVE_TAGS } from "../dns-content";
import styles from "./DnsMotionShowcase.module.css";

// The DNS hero background reuses this exact clip (see HERO_ENVIRONMENT_VIDEO
// in dns-media.ts) — excluded here so it doesn't also open the carousel
// directly below itself.
const HERO_DUPLICATE_LOCAL = "public/tcrm/videos/luxury-hotel-entrance-night-concept.mp4";

// TCRM_BLOB_MOTION's "Hospitality · Motion Design" group (29 items) turns
// out to be a 1:1 blob-hosted mirror of the same clips already in
// TCRM_VIDEOS (verified: every item's `local` field points at the exact
// same public/tcrm/videos/*.mp4 path). The earlier version of this
// component added the local set ON TOP of the full blob library, which
// silently duplicated ~22 clips — the same footage playing twice under two
// different URLs. This rewrite sources each of those clips from the blob
// manifest exactly once, and pulls in only the one genuinely blob-missing
// local clip (poolside-lounge.mp4).
function findByLocalPath(localPath: string) {
  return TCRM_BLOB_MOTION.find((item) => item.local === localPath) ?? null;
}

function toSlide(item: (typeof TCRM_BLOB_MOTION)[number]): DnsMotionSlide {
  return { src: item.src, label: item.label, group: item.group };
}

// The explicit, cinematic-first sequence: Hotel Arrival, Vintage Car must
// open the carousel, followed by the strongest polished hotel/lifestyle
// clips, before F&B and campaign motion (hotels have restaurants and bars
// too — that content stays, just supporting the story rather than leading
// it), before the wider cross-client hospitality library, with purely
// experimental motion closing out the sequence rather than opening it.
const HOTEL_LIFESTYLE_SEQUENCE = [
  "public/tcrm/videos/hotel-arrival-vintage-car.mp4",
  "public/tcrm/videos/luxury-bedroom-sequence.mp4",
  "public/tcrm/videos/tropical-resort-daylight.mp4",
  "public/tcrm/videos/hotel-exterior-transition.mp4",
  // luxury-hotel-entrance-night-concept.mp4 intentionally skipped here —
  // it's the hero background clip (see HERO_DUPLICATE_LOCAL above).
  "public/tcrm/videos/elegant-hospitality-moment.mp4",
  "public/tcrm/videos/luxury-starting-frame.mp4",
  "public/tcrm/videos/suite-window-light.mp4",
  "public/tcrm/videos/poolside-lounge.mp4", // blob-missing; local-only, added below
  "public/tcrm/videos/palm-trees-light-wind.mp4",
  "public/tcrm/videos/bar-social.mp4",
  "public/tcrm/videos/bar-and-cocktails.mp4",
  "public/tcrm/videos/upscale-bar-close-up.mp4",
];

const FNB_SEQUENCE = [
  "public/tcrm/videos/breakfast-coffee-steam.mp4",
  "public/tcrm/videos/beer-bubbling.mp4",
  "public/tcrm/videos/chocolate-sauce-pancakes.mp4",
  "public/tcrm/videos/waffle-pour.mp4",
  "public/tcrm/videos/pancake-pour.mp4",
];

const WEDDINGS_EVENTS_SEQUENCE = [
  "public/tcrm/videos/couple-orbit-shot.mp4",
  "public/tcrm/videos/champagne-detail.mp4",
  "public/tcrm/videos/bridal-portrait-alt-cut.mp4",
  "public/tcrm/videos/courtyard-couple.mp4",
];

// Explicitly experimental-tagged clips (per TCRM_VIDEOS' own category) —
// held back to the very end of the sequence rather than mixed in early,
// even though they happen to also live in the "Hospitality" blob group.
const EXPERIMENTAL_TAIL = ["public/tcrm/videos/luxury-room-timelapse.mp4", "public/tcrm/videos/signature-cocktail.mp4"];

// Simple label-keyword heuristic so obviously F&B-labeled clips from the
// wider cross-client blob library (Valencia, Pyramid, Oxford, CoralTree,
// First Hospitality, Lark, Dovetail) sink toward the end of that "other
// hospitality campaigns" bucket rather than leading it — without needing
// to watch every clip. Judgment call, disclosed in the delivery report.
const FNB_KEYWORDS = ["drink", "lunch", "sushi", "texican bar", "fnb", "cocktail", "coffee", "breakfast", "pancake", "wine", "brunch", "dinner"];
function looksLikeFnb(label: string) {
  const lower = label.toLowerCase();
  return FNB_KEYWORDS.some((kw) => lower.includes(kw));
}

function getVideos(): DnsMotionSlide[] {
  const usedLocalPaths = new Set<string>();
  const slides: DnsMotionSlide[] = [];

  function pushByLocal(localPath: string) {
    const blobItem = findByLocalPath(localPath);
    if (blobItem) {
      slides.push(toSlide(blobItem));
      usedLocalPaths.add(localPath);
      return;
    }
    // Not in the blob library — fall back to the local TCRM_VIDEOS entry
    // (only expected for poolside-lounge.mp4).
    const localItem = TCRM_VIDEOS.find((v) => `public/tcrm/videos${v.src.replace("/tcrm/videos", "")}` === localPath);
    if (localItem) {
      slides.push({ src: localItem.src, label: localItem.title, group: "Archer Design · Hospitality Motion" });
      usedLocalPaths.add(localPath);
    }
  }

  HOTEL_LIFESTYLE_SEQUENCE.forEach(pushByLocal);
  FNB_SEQUENCE.forEach(pushByLocal);
  WEDDINGS_EVENTS_SEQUENCE.forEach(pushByLocal);

  // Everything else in the blob library not already placed above and not
  // reserved for the experimental tail: the wider cross-client hospitality
  // motion library, F&B-keyword-labeled clips nudged toward the end.
  const remaining = TCRM_BLOB_MOTION.filter(
    (item) => !usedLocalPaths.has(item.local) && !EXPERIMENTAL_TAIL.includes(item.local) && item.local !== HERO_DUPLICATE_LOCAL
  );
  const remainingPrimary = remaining.filter((item) => !looksLikeFnb(item.label));
  const remainingFnb = remaining.filter((item) => looksLikeFnb(item.label));
  slides.push(...remainingPrimary.map(toSlide), ...remainingFnb.map(toSlide));

  EXPERIMENTAL_TAIL.forEach(pushByLocal);

  return slides;
}

/**
 * The large motion carousel directly below /dns's hero. Opens with the most
 * cinematic hotel/lifestyle clips available (Hotel Arrival, Vintage Car
 * first), moves through F&B and wedding/event motion in a supporting role,
 * then the wider cross-client hospitality library, and closes with purely
 * experimental motion. Reuses Archer Design's existing, real, cross-client
 * motion library (app/tcrm/tcrm-motion-blob-manifest.ts, imported
 * read-only — never duplicated or modified), plus the one local clip the
 * blob library doesn't already cover (app/tcrm/tcrm-media.ts, also
 * read-only), via a route-local slideshow/showcase pair rather than the
 * shared MotionDesignShowcase (which is /tcrm-scoped).
 */
export function DnsMotionShowcase() {
  const videos = getVideos();
  if (!videos.length) return null;

  return (
    <section className={styles.section} id="creative">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>{CREATIVE_EYEBROW}</span>
            <h2>
              {CREATIVE_HEADING_LINE_1}
              <br />
              {CREATIVE_HEADING_LINE_2}
            </h2>
          </div>
          <p>{CREATIVE_COPY}</p>
        </div>

        <DnsMotionSlideshow items={videos} />

        <div className={styles.footer}>
          {CREATIVE_TAGS.map((tag) => (
            <span key={tag}>{tag.toUpperCase()}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
