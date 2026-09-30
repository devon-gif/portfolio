export function LuxuryDeckShowcase() {
  const slides = [
    {
      eyebrow: "INVESTOR PRESENTATION · SEPTEMBER 2026",
      title: "The Halite",
      body: "A 220-key upscale lifestyle hotel for downtown Salt Lake City, opening into the city's Olympic decade.",
      dark: true,
      stats: ["$70.6M project cost", "$23.3M equity", "Mid-2030 opening"],
    },
    {
      eyebrow: "INVESTMENT SUMMARY",
      title: "A rooms-led lifestyle hotel, sized to what downtown Salt Lake City pays today.",
      body: "A focused 220-room concept with efficient operations, an intimate food-and-beverage program, and a capital story designed to remain legible at a glance.",
      stats: ["220 keys", "9.2% levered IRR", "8.3% yield on cost", "$86.4M stabilized value"],
    },
    {
      eyebrow: "WHY NOW",
      title: "Salt Lake City is rebuilding its core on a fixed deadline.",
      body: "The narrative connects convention-center adjacency, sports and entertainment investment, downtown population growth, and the 2034 Olympic cycle into one coherent demand story.",
      dark: true,
      stats: ["2034 Winter Games", "Convention district", "Downtown growth"],
    },
    {
      eyebrow: "MARKET PERFORMANCE",
      title: "Downtown hotels have added nearly ten points of occupancy since 2019.",
      body: "Market evidence is presented as a visual progression rather than a wall of research, letting the core operating thesis read quickly in an investor meeting.",
      stats: ["72.1% occupancy", "$176 ADR", "69.6% RevPAR recovery"],
    },
    {
      eyebrow: "THE BUSINESS",
      title: "Four rooms that carry the brand.",
      body: "Arrive. Eat and drink. Stay. Restore. The concept is intentionally rooms-led, with a handful of high-value hospitality moments rather than a full-service operating burden.",
      dark: true,
      stats: ["Lobby + arrival", "Bar + dining", "Guestrooms", "Wellness"],
    },
    {
      eyebrow: "CAPITAL STACK",
      title: "Conservative leverage, with a proven Salt Lake City tool.",
      body: "Sources, uses, incentives, and stabilization are organized into a simple capital narrative designed for a fast first read, with the detailed model remaining behind the presentation.",
      stats: ["$70.6M total cost", "$23.3M common equity", "$38.8M senior construction loan"],
    },
    {
      eyebrow: "RETURNS",
      title: "A 9.2% levered IRR before any Olympic upside.",
      body: "The base case separates the core operating thesis from upside, giving the investment story a more disciplined risk-and-return frame.",
      stats: ["9.2% levered IRR", "1.98x equity multiple", "8.3% stabilized yield on cost"],
    },
    {
      eyebrow: "DESIGN + DILIGENCE",
      title: "Every figure traces to a source.",
      body: "The presentation closes by connecting the investor narrative back to source material, operating assumptions, market evidence, and the broader diligence system.",
      dark: true,
      stats: ["Source register", "Market proof", "Cost assumptions", "Investor-ready narrative"],
    },
  ] as const;

  return (
    <section
      id="luxury-investor-deck"
      style={{
        padding: "clamp(72px, 8vw, 120px) clamp(24px, 5vw, 72px)",
        background: "#ece9e1",
        color: "#171717",
        borderTop: "1px solid rgba(20,20,20,.12)",
        borderBottom: "1px solid rgba(20,20,20,.12)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.05fr) minmax(280px,.65fr)",
          gap: "clamp(28px, 6vw, 88px)",
          alignItems: "end",
          marginBottom: "36px",
        }}
      >
        <div>
          <p style={{ margin: "0 0 15px", color: "#ad6a28", fontSize: "10px", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase" }}>
            FEATURED INVESTOR DECK
          </p>
          <h2 style={{ margin: 0, maxWidth: "980px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(48px, 7vw, 104px)", lineHeight: ".88", letterSpacing: "-.055em", fontWeight: 400 }}>
            The Halite.
          </h2>
        </div>
        <div>
          <p style={{ margin: 0, color: "rgba(23,23,23,.65)", fontSize: "15px", lineHeight: 1.7 }}>
            A 16-slide hospitality investor presentation built around a fictional 220-key Salt Lake City lifestyle hotel. The deck demonstrates investment narrative, market evidence, development positioning, capital structure, returns, and source-backed diligence in one polished visual system.
          </p>
          <p style={{ margin: "14px 0 0", color: "rgba(23,23,23,.5)", fontSize: "11px", lineHeight: 1.6 }}>
            Portfolio concept / presentation design sample. Financial figures shown are part of the concept deck and are not an investment offering.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "18px",
          overflowX: "auto",
          padding: "4px 4px 24px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
        }}
      >
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            style={{
              flex: "0 0 min(88vw, 980px)",
              aspectRatio: "16 / 9",
              scrollSnapAlign: "center",
              position: "relative",
              overflow: "hidden",
              padding: "clamp(28px, 4vw, 58px)",
              background: slide.dark ? "#111214" : "#f6f2e9",
              color: slide.dark ? "#f4f0e7" : "#171717",
              border: slide.dark ? "1px solid rgba(255,255,255,.12)" : "1px solid rgba(20,20,20,.12)",
              boxShadow: "0 20px 55px rgba(0,0,0,.12)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: slide.dark ? .38 : .12, background: index === 0 ? "radial-gradient(circle at 82% 28%, #c98743 0, transparent 28%), linear-gradient(140deg, transparent 55%, #8a552a 100%)" : index === 2 ? "linear-gradient(135deg, transparent 55%, #b16c2e 100%)" : index === 4 ? "linear-gradient(135deg, transparent 45%, #7d512c 100%)" : "linear-gradient(135deg, transparent 70%, #b37335 100%)" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: slide.dark ? "#c98c4d" : "#ad6a28" }}>{slide.eyebrow}</span>
              <span style={{ fontSize: "9px", letterSpacing: ".12em", opacity: .5 }}>THE HALITE · {String(index + 1).padStart(2, "0")}</span>
            </div>

            <div style={{ position: "relative", zIndex: 1, maxWidth: index === 0 ? "54%" : "72%", marginTop: index === 0 ? "12%" : "9%" }}>
              <h3 style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: index === 0 ? "clamp(52px, 8vw, 118px)" : "clamp(32px, 5vw, 72px)", lineHeight: .96, letterSpacing: "-.045em" }}>
                {slide.title}
              </h3>
              <p style={{ margin: "22px 0 0", maxWidth: "640px", fontSize: "clamp(12px, 1.3vw, 17px)", lineHeight: 1.6, opacity: .72 }}>{slide.body}</p>
            </div>

            <div style={{ position: "absolute", zIndex: 1, left: "clamp(28px, 4vw, 58px)", right: "clamp(28px, 4vw, 58px)", bottom: "clamp(24px, 3vw, 44px)", display: "grid", gridTemplateColumns: `repeat(${Math.min(slide.stats.length, 4)}, minmax(0,1fr))`, borderTop: slide.dark ? "1px solid rgba(255,255,255,.16)" : "1px solid rgba(20,20,20,.14)" }}>
              {slide.stats.map((stat) => (
                <div key={stat} style={{ padding: "13px 14px 0 0", fontSize: "clamp(10px, 1vw, 13px)", lineHeight: 1.3, opacity: .78 }}>{stat}</div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "4px", color: "rgba(23,23,23,.52)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase" }}>
        <span>Scroll horizontally to view selected pages</span>
        <span>16-slide presentation · Selected preview</span>
      </div>
    </section>
  );
}
