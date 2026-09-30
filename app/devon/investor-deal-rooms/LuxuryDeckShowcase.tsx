import styles from "./LuxuryDeckShowcase.module.css";

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

        <div className={styles.frame} style={{ background: "#f7f5ef", color: "#171717" }}>
          <div className={styles.stage}>
            <article className={styles.slide} style={{ background: "#f7f5ef" }}>
              <div className={styles.meta}>Investment &amp; Development Overview</div>
              <h3 className={styles.title} style={{ fontSize: "clamp(44px, 6vw, 86px)", lineHeight: ".9" }}>AURA<br />TOWER</h3>
              <p className={styles.copy}>Vertical hospitality concept for a landmark mixed-use tower with hotel, branded residences, private club, and sky-level amenities.</p>
              <div className={styles.pills}><span>62 stories</span><span>312 keys</span><span>148 residences</span></div>
              <span className={styles.footerText}>AURA Tower · Portfolio Concept</span>
              <span className={styles.number}>01 / 08</span>
            </article>

            <article className={`${styles.slide} ${styles.dark}`}>
              <div className={styles.meta}>Generated Architectural Imagery</div>
              <div className={styles.star} />
              <div className={styles.ruleH} style={{ bottom: "34%" }} />
              <div className={styles.ruleV} style={{ left: "68%" }} />
              <h3 className={styles.title} style={{ color: "#fff", maxWidth: "70%" }}>Precision, demand, altitude.</h3>
              <p className={styles.copy}>A skyline hotel investment story built around vertical identity, hospitality revenue, residence sales, and destination amenities.</p>
              <span className={styles.footerText}>Swiss editorial direction · Spec deck</span>
              <span className={styles.number}>02 / 08</span>
            </article>
          </div>

          <div className={styles.grid}>
            <article className={styles.slide}>
              <div className={styles.meta}>Demand Stack</div>
              <h3 className={styles.title}>Four revenue layers designed to reinforce one another.</h3>
              <div className={styles.columns}>
                <div className={styles.column}><span className={styles.dot}>01</span><h3>Hotel keys</h3><p>Transient luxury, corporate demand, event compression.</p></div>
                <div className={styles.column}><span className={styles.dot}>02</span><h3>Residences</h3><p>Premium sale velocity from service and identity.</p></div>
                <div className={styles.column}><span className={styles.dot}>03</span><h3>Sky club</h3><p>Recurring membership, wellness, private events.</p></div>
                <div className={styles.column}><span className={styles.dot}>04</span><h3>F&amp;B</h3><p>Public demand generator and resident amenity.</p></div>
              </div>
              <span className={styles.number}>03 / 08</span>
            </article>

            <article className={styles.slide}>
              <div className={styles.meta}>Capital + Diligence</div>
              <h3 className={styles.title}>Investor-ready structure, not decorative slides.</h3>
              <div className={styles.room} style={{ transform: "none", width: "78%", left: "11%", top: "36%" }}>
                <div className={styles.roomNav}><span>Overview</span><span>Docs</span><span>Financials</span><span>Diligence</span></div>
                <div className={styles.roomMain}><h3>Diligence readiness</h3><div className={styles.tiles}><span>Market proof</span><span>Development proof</span><span>Financial proof</span><span>Visual proof</span></div></div>
              </div>
              <span className={styles.number}>07 / 08</span>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
