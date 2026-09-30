export function LuxuryDeckShowcase() {
  return (
    <section
      id="luxury-investor-deck"
      style={{
        padding: "clamp(72px, 8vw, 120px) clamp(24px, 5vw, 72px)",
        background: "#0f0f10",
        color: "#f1f1ee",
        borderTop: "1px solid rgba(241,241,238,.12)",
        borderBottom: "1px solid rgba(241,241,238,.12)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.05fr) minmax(280px,.65fr)",
          gap: "clamp(28px, 6vw, 88px)",
          alignItems: "end",
          marginBottom: "34px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 16px",
              color: "#7384ff",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            FEATURED PRESENTATION
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: "980px",
              fontSize: "clamp(42px, 5.8vw, 88px)",
              lineHeight: ".92",
              letterSpacing: "-.06em",
              fontWeight: 700,
            }}
          >
            Creative Technology, Systems &amp; Storytelling.
          </h2>
        </div>
        <div>
          <p
            style={{
              margin: 0,
              color: "rgba(241,241,238,.68)",
              fontSize: "15px",
              lineHeight: 1.7,
            }}
          >
            An eight-slide editorial presentation showing how I communicate complex product, AI, technical,
            investor, and creative-system work. The presentation itself is embedded below so the portfolio shows the
            actual finished design rather than a recreated preview.
          </p>
          <a
            href="/devon/investor/creative-technology-systems-storytelling.html"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              marginTop: "20px",
              paddingBottom: "5px",
              borderBottom: "1px solid currentColor",
              color: "#f1f1ee",
              textDecoration: "none",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: ".11em",
              textTransform: "uppercase",
            }}
          >
            Open full presentation ↗
          </a>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "min(82vh, 940px)",
          minHeight: "620px",
          overflow: "hidden",
          border: "1px solid rgba(241,241,238,.18)",
          background: "#19191b",
          boxShadow: "0 28px 80px rgba(0,0,0,.28)",
        }}
      >
        <iframe
          src="/devon/investor/creative-technology-systems-storytelling.html"
          title="Archer Design Creative Technology, Systems and Storytelling presentation"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            background: "#19191b",
          }}
        />
      </div>
    </section>
  );
}
