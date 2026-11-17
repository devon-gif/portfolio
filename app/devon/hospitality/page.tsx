import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import { MotionLibrary } from "../motion/MotionLibrary";
import { HospitalityGallery } from "./HospitalityGallery";
import { HOSPITALITY_GRAPHICS, HOSPITALITY_MOTION, HOSPITALITY_MOTION_GROUPS } from "./hospitality-data";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";
import styles from "./hospitality.module.css";

const TITLE = "Hospitality Design & Motion · Devon Archer";
const DESCRIPTION = "Hotel, restaurant, spa and event creative by Devon Archer: hospitality videos, campaign design, seasonal menus, social content, presentations and web experiences.";
const OG_IMAGE = "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/devon/hospitality") },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/devon/hospitality"),
    type: "website",
    images: [{ url: absoluteUrl(OG_IMAGE), width: 1080, height: 1350, alt: "Hotel Indigo Pittsburgh campaign design by Devon Archer" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [absoluteUrl(OG_IMAGE)] },
};

const clients = [
  "Hotel Indigo Pittsburgh",
  "Hampton Inn Greensburg",
  "Hampton Inn Johnstown",
  "Eliza Hot Metal Bistro",
  "Elements Salon & Wellness",
];

export default function HospitalityPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="hospitality" />
      <main className={opus.shell}>
        <section className={`${sub.hero} ${styles.hero}`}>
          <div className={sub.heroCopy}>
            <Crumb label="Hospitality" />
            <h1>Hospitality.<br /><span>Design & motion.</span></h1>
            <p>
              The work behind the stay, the meal and the next visit. Hotel campaigns,
              restaurant menus, event promotions, spa creative and short-form video,
              brought together from my Archer Design practice.
            </p>
            <div className={sub.actions}>
              <a className={opus.pill} href="#videos">Watch the work <i><ArrowDown size={16} /></i></a>
              <a className={sub.ghost} href="#design">Browse design <ArrowDown size={15} /></a>
            </div>
            <div className={styles.collectionMeta}>
              <span><strong>{HOSPITALITY_MOTION.length}</strong> videos & motion pieces</span>
              <span><strong>{HOSPITALITY_GRAPHICS.length}</strong> campaign & design pieces</span>
            </div>
          </div>
          <div className={styles.heroCollage} aria-label="Selected hospitality campaign designs">
            <div className={styles.heroImageOne}>
              <Image src={OG_IMAGE} alt="Hotel Indigo Pittsburgh room collage campaign" fill priority sizes="(min-width: 1000px) 32vw, 65vw" />
            </div>
            <div className={styles.heroImageTwo}>
              <Image src="/tcrm/images/eliza-hot-metal-bistro-july-menu.png" alt="Eliza Hot Metal Bistro July menu design" fill priority sizes="(min-width: 1000px) 23vw, 45vw" />
            </div>
            <span className={styles.heroStamp}>Archer Design<br />Hospitality creative</span>
          </div>
        </section>

        <section className={`${opus.panel} ${styles.clients}`} aria-labelledby="hospitality-clients">
          <p className={opus.eyebrow} id="hospitality-clients"><b /> Property-level creative experience</p>
          <ul>{clients.map((client) => <li key={client}>{client}</li>)}</ul>
        </section>

        <nav className={styles.pageNav} aria-label="Hospitality work sections">
          <a href="#videos">Videos & motion <span>{HOSPITALITY_MOTION.length}</span></a>
          <a href="#design">Design & menus <span>{HOSPITALITY_GRAPHICS.length}</span></a>
          <a href="#web-presentations">Web & presentations <ArrowDown size={14} /></a>
          <Link href="/devon/social-performance">Campaign results <ArrowUpRight size={14} /></Link>
        </nav>

        <section className={`${opus.panel} ${styles.section}`} id="videos" aria-labelledby="hospitality-video-title">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}><b /> The motion library</p>
            <h2 id="hospitality-video-title">Places.<br /><span>Food. Atmosphere.</span></h2>
            <p>
              Hotel and destination films, food and beverage motion, wedding and seasonal
              visuals, and animation studies. Choose a clip to watch with playback controls,
              or use the categories to explore the full collection.
            </p>
          </div>
          <p className={styles.attribution}>
            The motion collection includes independent studio studies and proposal concepts.
            These demonstrate my creative production and do not imply a commissioned engagement
            with the properties shown.
          </p>
          <MotionLibrary groups={HOSPITALITY_MOTION_GROUPS} />
        </section>

        <section className={`${opus.panel} ${styles.section}`} id="design" aria-labelledby="hospitality-design-title">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}><b /> Campaigns, menus & social systems</p>
            <h2 id="hospitality-design-title">Design for<br /><span>real properties.</span></h2>
            <p>
              Work for Hampton Inn, Hotel Indigo Pittsburgh, Eliza Hot Metal Bistro and
              Elements, from room and restaurant promotions to live music, seasonal menus,
              wellness events and a consistent social feed. Studio studies are labeled separately.
            </p>
          </div>
          <HospitalityGallery items={HOSPITALITY_GRAPHICS} />
        </section>

        <section className={`${sub.dark} ${styles.section}`} id="web-presentations" aria-labelledby="hospitality-systems-title">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}><b /> Beyond the campaign</p>
            <h2 id="hospitality-systems-title">Websites.<br /><span>Presentations. Spaces.</span></h2>
            <p>Hospitality work also reaches the website, the investor conversation and the guest environment.</p>
          </div>
          <div className={styles.projectLinks}>
            <Link href="/devon/investor-deal-rooms">
              <span>Client work · CR91 Park Plaza</span>
              <h3>Project website & investor materials</h3>
              <p>The presentation, project website and private materials experience for a hospitality development project.</p>
              <span className={styles.projectAction}>Explore the work <ArrowUpRight size={18} /></span>
            </Link>
            <a href="https://drive.google.com/file/d/1Q3FnHhaOdwFKfomHefjP-HOYjLs82mFn/view" target="_blank" rel="noopener noreferrer">
              <span>Archer Design · Original presentation</span>
              <h3>Hospitality creative, in 12 pages</h3>
              <p>The original studio presentation, including campaign examples, hospitality imagery and the creative support model.</p>
              <span className={styles.projectAction}>View the presentation <ArrowUpRight size={18} /></span>
            </a>
            <Link href="/devon/living-lobby">
              <span>Independent concept · In development</span>
              <h3>Living Lobby</h3>
              <p>A generative installation concept for hotel lobbies, with real-time graphics, live weather and a responsive wordmark.</p>
              <span className={styles.projectAction}>View the concept <ArrowUpRight size={18} /></span>
            </Link>
          </div>
        </section>

        <PortfolioContact title="Have a property that needs creative support?" />
        <PortfolioFooter />
      </main>
    </div>
  );
}
