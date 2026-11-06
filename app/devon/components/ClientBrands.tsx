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
    <section className={`${styles.panel} ${styles.brandCompact}`} id="clients" aria-labelledby="client-brands-title">
      <div className={styles.brandCompactHeading}>
        <p id="client-brands-title">Selected clients &amp; collaborations</p>
        <span>Hospitality, creative production &amp; product work</span>
      </div>
      <ul className={styles.brandStrip} aria-label="Organizations Devon has created for">
        {brands.map((brand) => (
          <li className={styles.brandMark} key={brand.name} title={`${brand.name} — ${brand.work}`}>
            <Image
              src={brand.src}
              alt={brand.name}
              fill
              sizes="(min-width: 1200px) 10vw, 132px"
              style={{ objectFit: "contain" }}
            />
          </li>
        ))}
      </ul>
      <p className={styles.brandCompactMore}>
        Also: <Link href="/devon/investor-deal-rooms">CR-91 Park Plaza</Link> &amp; Magic Housekeeping
      </p>
    </section>
  );
}
