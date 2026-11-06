import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import AuraTeaser from "../components/AuraTeaser";
import styles from "../opus.module.css";

export const metadata: Metadata = {
  title: "AURA ONE — Interactive 3D Product Experience | Devon Archer",
  description:
    "AURA ONE is Devon Archer's independent luxury-audio concept exploring Blender product visualization, interactive WebGL, React Three Fiber, GSAP, and motion-led storytelling.",
};

const work = [
  ["Design & visual direction", "A fictional $899 premium audio brand with editorial typography, product art direction, four finish stories, and polished visual systems."],
  ["3D product engineering", "A detailed headphone model prepared in Blender, including material treatments, an exploded mechanical view, studio rendering, and optimization for the web."],
  ["Interactive development", "Next.js, React Three Fiber and GSAP power scroll-controlled product movement, finish configuration, and reverse-scroll interaction."],
  ["Lifestyle & motion", "Composited lifestyle photography and four synchronized color transitions extend the product narrative beyond isolated renders."],
];

export default function AuraOneCaseStudy() {
  return (
    <main className={styles.opusPage}>
      <div className={styles.shell} style={{ paddingTop: 24, paddingBottom: 32 }}>
        <section className={styles.panel} style={{ padding: "clamp(28px,5vw,64px)" }}>
          <Link href="/devon#work" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "inherit", textDecoration: "none", fontSize: 13 }}>
            <ArrowLeft size={16} /> Back to selected work
          </Link>
          <p className={styles.eyebrow} style={{ marginTop: 38 }}><b /> Independent concept / creative technology</p>
          <h1 style={{ margin: "0 0 20px", fontSize: "clamp(4rem,11vw,9.5rem)", fontWeight: 600, letterSpacing: "-.085em", lineHeight: ".9" }}>
            AURA ONE.
          </h1>
          <p style={{ maxWidth: 720, fontSize: "clamp(1.2rem,2vw,1.8rem)", lineHeight: 1.4, color: "#56706a" }}>
            An immersive product launch for a fictional luxury headphone brand—where industrial visualization, scroll-driven 3D, and high-end editorial design meet.
          </p>
          <p style={{ fontSize: 12, color: "#677a76", margin: "26px 0 0" }}>
            Status: interactive prototype in local development. The public live experience is not yet available.
          </p>
        </section>

        <div style={{ marginTop: 12, borderRadius: 28, overflow: "hidden" }}>
          <AuraTeaser />
        </div>

        <section className={styles.panel} style={{ marginTop: 12, padding: "clamp(28px,5vw,64px)" }}>
          <p className={styles.eyebrow}><b /> The work behind the experience</p>
          <h2 style={{ fontSize: "clamp(2.3rem,5vw,5rem)", lineHeight: 1, letterSpacing: "-.055em", margin: "0 0 40px" }}>
            Designed to be explored,<br />not just viewed.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 26 }}>
            {work.map(([heading, body], index) => (
              <article key={heading} style={{ borderTop: "1px solid #cdd4ce", paddingTop: 20 }}>
                <span style={{ fontSize: 12, color: "#617770" }}>0{index+1}</span>
                <h3 style={{ fontSize: 22, margin: "15px 0" }}>{heading}</h3>
                <p style={{ lineHeight: 1.65, color: "#617770", fontSize: 14 }}>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.panel} style={{ marginTop: 12, padding: "clamp(28px,5vw,64px)" }}>
          <p className={styles.eyebrow}><b /> Tools & process</p>
          <p style={{ maxWidth: 900, fontSize: "clamp(1.3rem,2vw,2rem)", lineHeight: 1.5, letterSpacing: "-.025em" }}>
            Blender · Photoshop · Next.js · React · Three.js · React Three Fiber · GSAP / ScrollTrigger · AI-assisted development
          </p>
          <p style={{ maxWidth: 690, lineHeight: 1.7, color: "#617770" }}>
            AURA ONE is an independent portfolio demonstration, not a real retail product or a commissioned client engagement. The interactive site is being developed separately; this page documents the concept while the public demo is prepared.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 28 }}>
            <Link className={styles.pill} href="/devon">Explore more work <i><ArrowUpRight size={15} /></i></Link>
            <a className={styles.pill} href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer">
              Connect on LinkedIn <i><ArrowUpRight size={15} /></i>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
