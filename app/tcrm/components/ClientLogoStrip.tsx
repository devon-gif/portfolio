import styles from "./ClientLogoStrip.module.css";

const clients = [
  {
    "label": "Hampton Inn",
    "src": "/archer-preview/logos/Hampton-Brand-Logo_TM_CMYK_Full-Color.png"
  },
  {
    "label": "Hotel Indigo",
    "src": "/revenue-activation/logos/hotel-indigo-logo.svg"
  },
  {
    "label": "IHG Hotels",
    "src": "/archer-preview/logos/ihg-logo.png"
  },
  {
    "label": "Eliza Restaurant",
    "src": "/archer-preview/logos/ELIZA LOGO UPDATE WHITE.png"
  },
  {
    "label": "Elements Spa",
    "src": "/archer-preview/logos/Elements Full logo- NO BACK GROUND.png"
  }
];

export function ClientLogoStrip() {
  return (
    <section
      className={styles.section}
      aria-label="Brands supported by Archer Design"
    >
      <div className={styles.shell}>
        <p className={styles.label}>
          CREATIVE EXPERIENCE ACROSS
        </p>

        <div className={styles.logos}>
          {clients.map((client) => (
            <div className={styles.logoItem} key={client.label}>
              {client.src ? (
                <img
                  src={client.src}
                  alt={client.label}
                  className={styles.logo}
                />
              ) : (
                <span className={styles.wordmark}>
                  {client.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
