import type { Metadata } from "next";

const LIVE_DEMO = "https://auto-creative-os.vercel.app/auto";

export const metadata: Metadata = {
  title: "Auto Creative OS — Devon Archer",
  description: "The deployed Auto Creative OS production prototype by Devon Archer.",
  robots: { index: false, follow: false },
};

export default function AutoCreativeOSPortfolioPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "52px minmax(0, 1fr)",
        background: "#05090d",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "0 18px",
          borderBottom: "1px solid rgba(255,255,255,.1)",
          background: "#090d10",
          color: "#f3f1e8",
          font: "700 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <a href="/devon" style={{ color: "#b8bbb6", textDecoration: "none" }}>
          ← Devon Archer
        </a>
        <span style={{ color: "#ff8d3a", letterSpacing: ".08em" }}>AUTO CREATIVE OS / LIVE APP</span>
        <a
          href={LIVE_DEMO}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#ffad6d", textDecoration: "none" }}
        >
          Open standalone ↗
        </a>
      </div>
      <iframe
        src={LIVE_DEMO}
        title="Auto Creative OS live application"
        allow="clipboard-write"
        style={{ width: "100%", height: "100%", minHeight: "calc(100vh - 52px)", border: 0, background: "#05090d" }}
      />
    </main>
  );
}
