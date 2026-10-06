import Image from "next/image";
import Link from "next/link";
import styles from "../opus.module.css";

const brands = [
  { name: "Hampton by Hilton", work: "Greensburg & Johnstown creative", src: "/archer-preview/logos/Hampton-Brand-Logo_TM_CMYK_Full-Color.png", dark: false },
  { name: "IHG Hotels & Resorts", work: "Hotel Indigo property creative", src: "/archer-preview/logos/ihg-logo.png", dark: false },
  { name: "Hotel Indigo Pittsburgh", work: "University–Oakland campaigns", src: "/archer-preview/logos/PITTSBURGH UNI-OAK_RGB_canvas_white_no_background.png", dark: true },
  { name: "Eliza Hot Metal Bistro", work: "Menus, events & campaigns", src: "/archer-preview/logos/ELIZA LOGO UPDATE WHITE.png", dark: true },
  { name: "Elements Salon & Wellness", work: "Wellness & event creative", src: "/archer-preview/logos/Elements Full logo- NO BACK GROUND.png", dark: false },
  { name: "Revest Properties", work: "Hospitality portfolio creative", src: "/archer-preview/logos/rev.png", dark: false },
  { name: "Vigilant", work: "Video & creative support", src: "/archer-preview/logos/PRIMARY-1.png", dark: true },
  { name: "GutID", work: "Creative production", src: "/devon/logos/gutid.png", dark: true },
  { name: "RCC Hospitality Consulting", work: "Website design · in progress", src: "/devon/logos/rcc.jpg", dark: false },
  { name: "JobGhost", work: "Co-founder · product & growth", src: "/devon/logos/jobghost.png", dark: false },
] as const;

export default function ClientBrands() {
  return (
    <section className={`${styles.panel} ${styles.brandPanel}`} id="clients" aria-labelledby="client-brands-title">
      <div className={styles.brandHeading}>
        <div>
          <p className={styles.eyebrow}><b /> Clients & collaborations</p>
          <h2 id="client-brands-title">Teams I&apos;ve created for.</h2>
        </div>
        <p>Selected client work, hospitality property brands, and founder work.</p>
      </div>
      <ul className={styles.brandGrid}>
        {brands.map((brand) => (
          <li className={styles.brandCard} key={brand.name}>
            <div className={styles.brandLogo} data-dark={brand.dark}>
              <Image src={brand.src} alt={`${brand.name} logo`} fill sizes="(max-width: 600px) 44vw, (max-width: 1100px) 28vw, 18vw" />
            </div>
            <div className={styles.brandCaption}>
              <h3>{brand.name}</h3>
              <p>{brand.work}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.brandMore}>
        Additional work: <Link href="/devon/investor-deal-rooms">CR-91 Park Plaza · website & investor materials</Link>
        <span aria-hidden="true"> / </span>Magic Housekeeping · website design
      </p>
    </section>
  );
}
