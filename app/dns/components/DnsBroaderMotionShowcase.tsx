import { DnsMotionSlideshow, type DnsMotionSlide } from "./DnsMotionSlideshow";
import { DNS_BROADER_MOTION } from "../dns-broader-motion-data";
import { BROADER_EYEBROW, BROADER_HEADING, BROADER_COPY, BROADER_TAGS, BROADER_NOTE } from "../dns-content";
import styles from "./DnsMotionShowcase.module.css";

/**
 * New section, placed directly below the calculator/economics section:
 * broader (non-hospitality) motion capability, including the branded/
 * Nike-style product and lifestyle motion work from dns-broader-motion-data.ts.
 * Deliberately reuses DnsMotionShowcase's own CSS module and the same
 * DnsMotionSlideshow player rather than introducing new styles, so this
 * stays visually consistent with the hospitality motion section above it
 * without expanding dns.css.
 */
export function DnsBroaderMotionShowcase() {
  const videos: DnsMotionSlide[] = DNS_BROADER_MOTION.map((item) => ({ src: item.src, label: item.label, group: item.group }));
  if (!videos.length) return null;

  return (
    <section className={styles.section} id="broader-creative">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>{BROADER_EYEBROW}</span>
            <h2>{BROADER_HEADING}</h2>
          </div>
          <p>{BROADER_COPY}</p>
        </div>

        <DnsMotionSlideshow items={videos} />

        <div className={styles.footer}>
          {BROADER_TAGS.map((tag) => (
            <span key={tag}>{tag.toUpperCase()}</span>
          ))}
        </div>

        <p className={styles.note}>{BROADER_NOTE}</p>
      </div>
    </section>
  );
}
