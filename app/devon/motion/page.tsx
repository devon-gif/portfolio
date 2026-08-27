import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { DevonMotionSlideshow } from "../components/DevonMotionSlideshow";
import { DEVON_ALL_MOTION } from "../motion-data";

export const metadata: Metadata = {
  title: "Motion Library — Devon Archer",
  description: "Full motion, generative video, product, hospitality, and experimental portfolio library by Devon Archer.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function DevonMotionLibraryPage() {
  return (
    <div className="devon-ct">
      <main>
        <section className="ct-section" style={{ paddingTop: 56 }}>
          <div className="ct-shell">
            <a
              href="/devon"
              className="ct-btn-ghost"
              style={{ display: "inline-flex", marginBottom: 44 }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to portfolio
            </a>

            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Full motion library</p>
                <h1 style={{ margin: "14px 0 0", fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 0.95 }}>
                  Motion, product, hospitality, and experiments.
                </h1>
              </div>
              <p className="ct-section-intro">
                {DEVON_ALL_MOTION.length} pieces, deliberately mixed instead of grouped by category. Product,
                interface, lifestyle, hospitality, food, cinematic transitions, and generative motion all live
                in one sequence. Nike opens the reel.
              </p>
            </div>

            <DevonMotionSlideshow items={DEVON_ALL_MOTION} showFullLibraryLink={false} />
          </div>
        </section>
      </main>
    </div>
  );
}
