const presentations = [
  {
    eyebrow: "HOSPITALITY INVESTOR PRESENTATION",
    title: "The Halite.",
    description:
      "A 16-page hospitality investor presentation. Open the original PDF to view the full deck at native quality with the exact typography, imagery, charts, and layouts.",
    href: "https://at.adobe.com/BcY5QLVuXF9KOT0j",
    button: "View full Halite investor deck ↗",
    meta: "Original PDF · 16 pages · Opens in a new tab",
  },
  {
    eyebrow: "CREATIVE TECHNOLOGY / EXECUTIVE STORYTELLING",
    title: "Creative Technology, Systems & Storytelling.",
    description:
      "An 8-page presentation showing how I communicate complex product, AI, systems, and creative-technology work through a polished executive narrative. Open the original PDF at full quality.",
    href: "https://at.adobe.com/zTGCy850Nyt4aIxS",
    button: "View full Creative Technology deck ↗",
    meta: "Original PDF · 8 pages · Opens in a new tab",
  },
] as const;

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
      <div style={{ marginBottom: "clamp(36px, 5vw, 64px)" }}>
        <p
          style={{
            margin: "0 0 14px",
            color: "#c69059",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: ".18em",
            textTransform: "uppercase",
          }}
        >
          FEATURED PRESENTATION WORK
        </p>
        <h2
          style={{
            margin: 0,
            maxWidth: "980px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(46px, 6.5vw, 92px)",
            lineHeight: ".92",
            letterSpacing: "-.05em",
            fontWeight: 400,
          }}
        >
          Investor decks and complex-storytelling systems.
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "22px",
        }}
      >
        {presentations.map((presentation) => (
          <article
            key={presentation.title}
            style={{
              display: "flex",
              minHeight: "360px",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(28px, 4vw, 46px)",
              border: "1px solid rgba(241,241,238,.16)",
              background: "linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018))",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 20px",
                  color: "#c69059",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                }}
              >
                {presentation.eyebrow}
              </p>
              <h3
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(34px, 4vw, 62px)",
                  lineHeight: ".98",
                  letterSpacing: "-.045em",
                  fontWeight: 400,
                }}
              >
                {presentation.title}
              </h3>
              <p
                style={{
                  margin: "24px 0 0",
                  maxWidth: "620px",
                  color: "rgba(241,241,238,.68)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {presentation.description}
              </p>
            </div>

            <div style={{ marginTop: "42px" }}>
              <a
                href={presentation.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                {presentation.button}
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
                {presentation.meta}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
