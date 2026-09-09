"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./FeaturedBuildsShowcase.module.css";

export function FeaturedBuildsShowcase() {
  const pathname = usePathname();
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (pathname !== "/devon") {
      setTarget(null);
      return;
    }

    const main = document.querySelector<HTMLElement>(".devon-ct main");
    if (!main) return;

    let host = document.getElementById("devon-featured-builds-root") as HTMLElement | null;
    let createdHost = false;

    if (!host) {
      host = document.createElement("div");
      host.id = "devon-featured-builds-root";
      main.insertBefore(host, main.firstChild);
      createdHost = true;
    }

    const nav = document.querySelector<HTMLElement>(".ct-nav-links");
    let buildsLink = nav?.querySelector<HTMLAnchorElement>('a[href="#builds"]') ?? null;
    let createdLink = false;

    if (nav && !buildsLink) {
      buildsLink = document.createElement("a");
      buildsLink.href = "#builds";
      buildsLink.textContent = "Builds";
      nav.insertBefore(buildsLink, nav.firstChild);
      createdLink = true;
    }

    setTarget(host);

    return () => {
      if (createdLink) buildsLink?.remove();
      if (createdHost) host?.remove();
    };
  }, [pathname]);

  if (pathname !== "/devon" || !target) return null;

  return createPortal(
    <section id="builds" className={styles.section} aria-label="Selected design engineering builds">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Selected builds / design → code</p>
          <h2>Working products, not portfolio-only mockups.</h2>
        </div>
        <p className={styles.intro}>
          I use design as the starting point, then stay with the work through implementation,
          states, QA, and deployment. These are live builds where the interface, system
          behavior, and product story all matter.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <a
            className={styles.preview}
            href="https://baseten-inference-lab.vercel.app/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Baseten Inference Lab"
          >
            <img
              src="/devon/projects/baseten-inference-lab.png"
              alt="Baseten Inference Lab independent design-engineering concept"
              loading="eager"
            />
            <span className={styles.previewTag}>Independent Baseten concept</span>
          </a>
          <div className={styles.body}>
            <p className={styles.eyebrow}>AI infrastructure / design engineering</p>
            <h3>Baseten Inference Lab</h3>
            <p>
              An independent design-engineering concept for Baseten&apos;s inference platform. I
              turned a model request into a visible five-step flow — Request → Prepare → Route →
              Compute → Respond — then built the responsive experience and shipped it on Vercel.
            </p>
            <div className={styles.tags}>
              <span>Next.js</span>
              <span>TypeScript</span>
              <span>Responsive UI</span>
              <span>Technical storytelling</span>
              <span>Vercel</span>
            </div>
            <a
              className={styles.link}
              href="https://baseten-inference-lab.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              View the live build <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </article>

        <article className={styles.card}>
          <a
            className={styles.preview}
            href="https://checkray.app"
            target="_blank"
            rel="noreferrer"
            aria-label="Open CheckRay"
          >
            <img
              src="/devon/projects/checkray-home.png"
              alt="CheckRay live AI risk-analysis product homepage"
              loading="eager"
            />
            <span className={styles.previewTag}>Live AI product</span>
          </a>
          <div className={styles.body}>
            <p className={styles.eyebrow}>Trust UX / AI product</p>
            <h3>CheckRay</h3>
            <p>
              A live AI-assisted risk product for suspicious texts, links, job posts, bills, and
              emails. The interface turns model interpretation and deterministic guardrails into
              clear next steps without hiding uncertainty or removing human judgment.
            </p>
            <div className={styles.tags}>
              <span>AI product</span>
              <span>UX/UI</span>
              <span>Next.js</span>
              <span>Supabase</span>
              <span>Evaluation</span>
            </div>
            <a className={styles.link} href="https://checkray.app" target="_blank" rel="noreferrer">
              Open CheckRay <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>

      <p className={styles.note}>
        Screenshots are from the actual deployed projects. Open either card to inspect the live experience.
      </p>
    </section>,
    target,
  );
}
