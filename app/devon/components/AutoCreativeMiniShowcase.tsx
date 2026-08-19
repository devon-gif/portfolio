import styles from "./AutoCreativeMiniShowcase.module.css";

const CAR_IMAGE = "https://raw.githubusercontent.com/devon-gif/portfolio/auto-creative-os/public/auto/orlando-glc.webp";

const outputs = [
  { label: "1:1", kind: "square" },
  { label: "9:16", kind: "story" },
  { label: "4:5", kind: "portrait" },
  { label: "728×90", kind: "banner" },
] as const;

function MiniCreative({ kind }: { kind: string }) {
  return (
    <div className={`${styles.creative} ${styles[kind]}`}>
      <img className={styles.photo} src={CAR_IMAGE} alt="" />
      <div className={styles.shade} />
      <span className={styles.brand}>ORLANDO MOTOR ATELIER</span>
      <div className={styles.copy}>
        <small>GLC SPRING ARRIVAL</small>
        <strong>DESIGNED FOR EVERY ARRIVAL</strong>
        <em>FROM $699/MO</em>
      </div>
      <span className={styles.legal}>Concept offer · legal copy locked</span>
    </div>
  );
}

export function AutoCreativeMiniShowcase() {
  return (
    <div className={styles.window} aria-label="Auto Creative OS recomposition preview">
      <div className={styles.bar}>
        <span>AUTO CREATIVE OS / RECOMPOSE</span>
        <i>4 outputs ready</i>
      </div>
      <div className={styles.body}>
        <div className={styles.source}>
          <div className={styles.label}>01 / APPROVED MASTER</div>
          <div className={styles.masterWrap}><MiniCreative kind="portrait" /></div>
          <div className={styles.roles}>
            <span>vehicle</span><span>headline</span><span>offer</span><span>logo</span><span>legal</span>
          </div>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={styles.generated}>
          <div className={styles.label}>02 / RESPONSIVE OUTPUTS</div>
          <div className={styles.grid}>
            {outputs.map((item) => (
              <div className={styles.output} key={item.label}>
                <div className={styles.outputFrame}><MiniCreative kind={item.kind} /></div>
                <div className={styles.outputMeta}><b>{item.label}</b><span>PASS</span></div>
              </div>
            ))}
          </div>
          <p>Same approved campaign → placement-specific composition → validation → human review.</p>
        </div>
      </div>
    </div>
  );
}
