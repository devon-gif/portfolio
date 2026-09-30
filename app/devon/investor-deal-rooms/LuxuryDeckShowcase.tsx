import styles from "./LuxuryDeckShowcase.module.css";

export function LuxuryDeckShowcase() {
  return (
    <section className={styles.section} id="luxury-investor-deck">
      <div className={styles.head}>
        <div>
          <p className={styles.kicker}>REDESIGNED PRESENTATION CONCEPT</p>
          <h2>Luxury investor deck system.</h2>
        </div>
        <p>
          A polished 8-slide investor presentation concept built from a luxury architecture deck direction and adapted into a CR-91 style hospitality-development story. This replaces raw PDF previews with more intentional, portfolio-ready presentation design.
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
            <p className={styles.copy}>CR-91 Park Plaza is presented as a development story that needs to be understood quickly: vision, proof, capital plan, and operating path.</p>
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
            <div className={styles.meta}>Development Vision</div>
            <h3 className={styles.title}>A staged path from concept to opening.</h3>
            <div className={styles.panelBox} style={{ height: "24%" }} />
            <div className={styles.timeline}>
              <div><strong>Site and research</strong></div>
              <div><strong>Design and brand</strong></div>
              <div><strong>Capital and diligence</strong></div>
              <div><strong>Buildout and launch</strong></div>
              <div><strong>Open and operate</strong></div>
            </div>
            <span className={styles.number}>04 / 08</span>
          </article>

          <article className={styles.slide}>
            <div className={styles.meta}>Market + Demand Story</div>
            <h3 className={styles.title}>Make demand visible.</h3>
            <div className={styles.mapBox}>
              <span className={styles.mapItem} style={{ left: "16%", top: "54%" }}>Lodging demand</span>
              <span className={styles.mapItem} style={{ left: "40%", top: "42%" }}>Dining traffic</span>
              <span className={styles.mapItem} style={{ left: "65%", top: "28%" }}>Event nights</span>
              <span className={styles.mapItem} style={{ left: "25%", top: "72%" }}>Local draw</span>
            </div>
            <div className={styles.stats}><div><strong className={styles.accent}>01</strong><span>Tourism</span></div><div><strong className={styles.slate}>02</strong><span>F&amp;B</span></div><div><strong>03</strong><span>Events</span></div></div>
            <span className={styles.number}>05 / 08</span>
          </article>

          <article className={styles.slide}>
            <div className={styles.meta}>Capital Story</div>
            <h3 className={styles.title}>Uses of capital, without the clutter.</h3>
            <div className={styles.donut} />
            <div className={styles.legend}><span>Land / project costs</span><span>Architecture and design</span><span>Diligence and legal</span><span>Pre-development reserves</span></div>
            <p className={styles.copy} style={{ top: "61%" }}>A clean visual layer for investor conversations while source documents and models stay private.</p>
            <span className={styles.number}>06 / 08</span>
          </article>

          <article className={styles.slide}>
            <div className={styles.meta}>Diligence System</div>
            <h3 className={styles.title}>One room. One source of truth.</h3>
            <p className={styles.copy} style={{ left: "6%", right: "auto", top: "62%" }}>The deck gets attention. The diligence room creates trust.</p>
            <div className={styles.room}>
              <div className={styles.roomNav}><span>Overview</span><span>Docs</span><span>Financials</span><span>Diligence</span><span>Research</span><span>Updates</span></div>
              <div className={styles.roomMain}><h3>Diligence readiness</h3><div className={styles.tiles}><span>Legal docs</span><span>Market proof</span><span>Financial model</span><span>Project updates</span><span>Open questions</span><span>Investor access</span></div></div>
            </div>
            <span className={styles.number}>07 / 08</span>
          </article>

          <article className={styles.slide}>
            <div className={styles.meta}>Closing System</div>
            <h3 className={styles.title}><span className={styles.slate}>A complex</span> development, <span className={styles.accent}>made clear.</span></h3>
            <div className={styles.star} />
            <div className={styles.contactCard}><strong>Devon Archer</strong><small>Archer Design</small><p>Investor decks, project websites, diligence rooms, executive presentations, and visual systems.</p></div>
            <span className={styles.footerText}>archerdesign.shop/devon</span>
            <span className={styles.number}>08 / 08</span>
          </article>
        </div>
      </div>
    </section>
  );
}
