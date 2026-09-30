const HALITE_PDF_URL = "https://at.adobe.com/BcY5QLVuXF9KOT0j";

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
            FEATURED INVESTOR PRESENTATION
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
            A 16-page hospitality investor presentation. Open the original PDF to view the full deck at native quality with the exact typography, imagery, charts, and layouts.
          </p>

          <a
            href={HALITE_PDF_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "24px",
              padding: "14px 20px",
              border: "1px solid rgba(241,241,238,.35)",
              color: "#f1f1ee",
              textDecoration: "none",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: ".11em",
              textTransform: "uppercase",
              background: "rgba(255,255,255,.04)",
            }}
          >
            View full Halite investor deck ↗
          </a>

          <p
            style={{
              margin: "14px 0 0",
              color: "rgba(241,241,238,.42)",
              fontSize: "10px",
              lineHeight: 1.6,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Original PDF · 16 pages · Opens in a new tab
          </p>
        </div>
      </div>
    </section>
  );
}
