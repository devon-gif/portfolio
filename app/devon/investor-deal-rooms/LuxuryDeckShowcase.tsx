const HALITE_PDF_URL = "https://at.adobe.com/PTiLGhv4P56qBJeP";

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
              color: "#c69059",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            FEATURED INVESTOR PRESENTATION · ORIGINAL PDF
          </p>
          <h2
            style={{
              margin: 0,
              maxWidth: "980px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(50px, 7vw, 104px)",
              lineHeight: ".9",
              letterSpacing: "-.055em",
              fontWeight: 400,
            }}
          >
            The Halite.
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
            The actual 16-slide Halite investor presentation, shown here from the original PDF rather than a recreated web version. This preserves the real typography, imagery, layouts, charts, and visual system exactly as designed.
          </p>
          <a
            href={HALITE_PDF_URL}
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
            Open original PDF ↗
          </a>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "min(84vh, 980px)",
          minHeight: "640px",
          overflow: "hidden",
          border: "1px solid rgba(241,241,238,.18)",
          background: "#18181a",
          boxShadow: "0 28px 80px rgba(0,0,0,.32)",
        }}
      >
        <iframe
          src={HALITE_PDF_URL}
          title="The Halite investor presentation — original PDF"
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            background: "#18181a",
          }}
        />
      </div>

      <p
        style={{
          margin: "14px 0 0",
          color: "rgba(241,241,238,.48)",
          fontSize: "10px",
          lineHeight: 1.6,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Original presentation PDF · 16 slides · Portfolio presentation sample
      </p>
    </section>
  );
}
