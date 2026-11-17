"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import styles from "./PlazaTour.module.css";

const TOUR_URL = "https://phase1-virtual.vercel.app";

/**
 * CR91 Park Plaza Phase 1 360° tour. The tour streams 17 full-resolution
 * panoramas, so the iframe only loads after the visitor presses Start.
 */
export default function PlazaTour() {
  const [started, setStarted] = useState(false);

  return (
    <section className={styles.section} id="plaza-tour" aria-labelledby="plaza-tour-title">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}><b /> 3D visualization · CR91 Park Plaza</p>
          <h2 id="plaza-tour-title"><span>Walk the plaza</span> before it&apos;s built.</h2>
        </div>
        <div className={styles.copy}>
          <p>
            A 360° tour of the planned Phase 1 Plaza for Dr. Elaine McNally in Goodwater, Alabama. I modeled
            and furnished the market, deli, coffee bar, restaurant, laundry and porches in Blender from the
            architectural plan, rendered 17 stops in Cycles, and linked them in a web viewer with a floor-plan map.
          </p>
          <ul className={styles.facts}>
            <li>Blender</li>
            <li>Cycles · 4096 × 2048</li>
            <li>17 linked stops</li>
            <li>Pannellum</li>
          </ul>
        </div>
      </div>

      <div className={styles.frame}>
        {started ? (
          <iframe
            className={styles.iframe}
            src={TOUR_URL}
            title="CR91 Park Plaza Phase 1 360° virtual tour"
            allow="fullscreen; accelerometer; gyroscope"
            allowFullScreen
          />
        ) : (
          <button type="button" className={styles.start} onClick={() => setStarted(true)}>
            <Image
              src="/devon/projects/cr91-plaza-360-tour.webp"
              alt="Restaurant interior from the CR91 Park Plaza 360° tour"
              fill
              sizes="(min-width: 1000px) 90vw, 100vw"
              className={styles.poster}
            />
            <span className={styles.shade} aria-hidden="true" />
            <span className={styles.startPill}>
              Start the 360° tour <i><ArrowUpRight size={15} /></i>
            </span>
          </button>
        )}
      </div>

      <div className={styles.foot}>
        <p>Concept visualization for a planned development. Drag to look around; tap the markers to move.</p>
        <a className={styles.fullLink} href={TOUR_URL} target="_blank" rel="noreferrer">
          Open full screen <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
