import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Crumb, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

const LIVE_DEMO = "https://auto-creative-os.vercel.app/auto";

export const metadata: Metadata = {
  title: "Auto Creative OS · Devon Archer",
  description: "The deployed Auto Creative OS production prototype by Devon Archer.",
  robots: { index: false, follow: false },
};

export default function AutoCreativeOSPortfolioPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="work" />

      <main className={opus.shell}>
        <section className={opus.panel}>
          <div className={sub.head} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Crumb label="Auto Creative OS" />
              <h2>
                <span>Auto</span> Creative OS.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p style={{ margin: 0, color: "var(--soft)", fontSize: 15, lineHeight: 1.65, maxWidth: "52ch" }}>
                A production system for creative work, built in Next.js and TypeScript. The live app runs below; open it on
                its own for the full-screen experience.
              </p>
              <a className={opus.pill} href={LIVE_DEMO} target="_blank" rel="noreferrer">
                Open standalone{" "}
                <i>
                  <ArrowUpRight size={15} />
                </i>
              </a>
            </div>
          </div>
        </section>

        <section className={sub.frame} aria-label="Auto Creative OS live application">
          <div className={sub.frameBar}>
            <span className={sub.frameDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Live app · auto-creative-os.vercel.app</span>
            <a href={LIVE_DEMO} target="_blank" rel="noreferrer">
              Open ↗
            </a>
          </div>
          <div className={`${sub.frameBody} ${sub.tall}`}>
            <iframe src={LIVE_DEMO} title="Auto Creative OS live application" allow="clipboard-write" loading="lazy" />
          </div>
        </section>

        <PortfolioFooter />
      </main>
    </div>
  );
}
