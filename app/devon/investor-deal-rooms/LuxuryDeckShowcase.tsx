import styles from "./LuxuryDeckShowcase.module.css";

const auraDeckPreview = "DATAURI_PLACEHOLDER";

export function LuxuryDeckShowcase() {
  return (
    <>
      <section className={styles.section} id="luxury-investor-deck">
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>REDESIGNED PRESENTATION CONCEPT</p>
            <h2>Luxury investor deck system.</h2>
          </div>
          <p>
            A polished investor presentation concept built from a luxury architecture direction and adapted into a
            hospitality-development investment story. This replaces raw PDF previews with a more intentional,
            portfolio-ready design system.
          </p>
        </div>

        <div className={styles.frame}>
          <div className={styles.stage}>
            <article className={`${styles.slide} ${styles.dark}`}>
              <div className={styles.meta}>Investment &amp; Development Overview</div>
              <div className={styles.star} />
              <div className={styles.ruleH} style={{ bottom: "29%" }} />
              <div className={styles.ruleV} style={{ left: "72%" }} />
              <div className={styles.largeTitle}>CR-91</div>
              <p className={styles.copy}>Redefining luxury in a hospitality-led urban development.</p>
              <span className={styles.footerText}>CR-91 Park Plaza · Portfolio Concept</span>
              <span className={styles.number}>01 / 08</span>
            </article>

            <article className={styles.slide}>
              <div className={styles.meta}>The Opportunity</div>
              <h3 className={styles.title}>Hospitality, <span className={styles.accent}>investment</span> and place.</h3>
              <p className={styles.copy}>A development story made clear: vision, proof, capital plan, and operating path.</p>
              <div className={styles.pills}><span>Development</span><span>Capital</span><span>Proof</span></div>
              <span className={styles.footerText}>CR-91 Park Plaza · Portfolio Concept</span>
              <span className={styles.number}>02 / 08</span>
            </article>
          </div>

          <div className={styles.grid}>
            <article className={styles.slide}>
              <div className={styles.meta}>Investment Thesis</div>
              <h3 className={styles.title}>Four reasons the story works.</h3>
              <div className={styles.columns}>
                <div className={styles.column}><span className={styles.dot}>01</span><h3>Destination demand</h3><p>Travel, dining, events, and local experience.</p></div>
                <div className={styles.column}><span className={styles.dot}>02</span><h3>Mixed-use hospitality</h3><p>Multiple components support a more resilient narrative.</p></div>
                <div className={styles.column}><span className={styles.dot}>03</span><h3>Investor clarity</h3><p>Deck, one-pager, visuals, and room create one source of truth.</p></div>
                <div className={styles.column}><span className={styles.dot}>04</span><h3>Expandable proof</h3><p>Documents, research, financials, and updates stay organized.</p></div>
              </div>
              <span className={styles.number}>03 / 08</span>
            </article>

            <article className={styles.slide}>
              <div className={styles.meta}>Capital Story</div>
              <h3 className={styles.title}>Uses of capital, without the clutter.</h3>
              <div className={styles.donut} />
              <div className={styles.legend}><span>Land / project costs</span><span>Architecture and design</span><span>Diligence and legal</span><span>Pre-development reserves</span></div>
              <p className={styles.copy} style={{ top: "61%" }}>A clean visual layer for investor conversations while source documents and models stay private.</p>
              <span className={styles.number}>06 / 08</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section} id="aura-tower-deck">
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>SWISS-STYLE PRESENTATION CONCEPT</p>
            <h2>AURA Tower hotel deck.</h2>
          </div>
          <p>
            A second presentation concept redesigned from the Swiss business/corporate direction: a fictional
            tall-skyscraper hotel and residences development with clean editorial grids, restrained red accents,
            generated architectural imagery, and investor-facing development language.
          </p>
        </div>

        <div
          style={{
            background: "#f7f5ef",
            border: "1px solid rgba(241,239,231,.16)",
            padding: "clamp(16px, 2.5vw, 34px)",
            boxShadow: "0 30px 90px rgba(0,0,0,.18)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, .48fr) minmax(0, 1fr)",
              gap: "clamp(22px, 4vw, 58px)",
              alignItems: "center",
              color: "#171717",
            }}
          >
            <div>
              <p className={styles.kicker} style={{ color: "#b5101a" }}>AURA TOWER HOTEL &amp; RESIDENCES</p>
              <h3
                style={{
                  margin: 0,
                  fontSize: "clamp(42px, 5.8vw, 86px)",
                  lineHeight: ".9",
                  letterSpacing: "-.07em",
                  fontWeight: 500,
                }}
              >
                Precision, demand, altitude.
              </h3>
              <p style={{ marginTop: 24, color: "rgba(23,23,23,.62)", fontSize: 15, lineHeight: 1.72, maxWidth: 520 }}>
                An eight-slide portfolio concept for a vertical hospitality investment: hotel keys, branded residences,
                sky club, rooftop F&amp;B, capital story, diligence room, and closing narrative.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                <span style={{ background: "#b5101a", color: "#fff", padding: "9px 12px", fontSize: 10, letterSpacing: ".12em", fontWeight: 800 }}>PORTFOLIO CONCEPT</span>
                <span style={{ border: "1px solid rgba(23,23,23,.16)", padding: "9px 12px", fontSize: 10, letterSpacing: ".12em", fontWeight: 800 }}>SWISS EDITORIAL SYSTEM</span>
              </div>
            </div>

            <div style={{ background: "#fff", padding: 10, border: "1px solid rgba(23,23,23,.1)", boxShadow: "0 24px 70px rgba(0,0,0,.16)" }}>
              <img
                src={auraDeckPreview}
                alt="AURA Tower Hotel and Residences Swiss-style investor deck preview"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
