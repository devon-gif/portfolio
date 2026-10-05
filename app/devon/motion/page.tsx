import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { TCRM_IMAGES } from "@/app/tcrm/tcrm-media";
import { DEVON_COMMERCIAL_MOTION, DEVON_FNB_MOTION, DEVON_HOTEL_MOTION } from "../motion-data";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";
import { MotionLibrary } from "./MotionLibrary";

export const metadata: Metadata = {
  title: "Motion & Campaign Library · Devon Archer",
  description:
    "Short-form motion, campaign graphics and art direction by Devon Archer for hotels, restaurants and commercial clients.",
  alternates: { canonical: absoluteUrl("/devon/motion") },
  robots: { index: true, follow: true },
};

const groups = [
  { key: "hotels", label: "Hotels & places", items: DEVON_HOTEL_MOTION },
  { key: "fnb", label: "Food & beverage", items: DEVON_FNB_MOTION },
  { key: "commercial", label: "Commercial & product", items: DEVON_COMMERCIAL_MOTION },
].filter((g) => g.items.length > 0);

const total = groups.reduce((n, g) => n + g.items.length, 0);

export default function DevonMotionLibraryPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="work" />

      <main className={opus.shell}>
        <section className={sub.hero} id="top">
          <div className={sub.heroCopy}>
            <Crumb label="Motion library" />
            <h1>
              <span>Motion</span> and campaign work.
            </h1>
            <p>
              Short-form motion, campaign graphics and art direction made for real hotels, restaurants and brands.
              {` ${total}`} clips and {TCRM_IMAGES.length} graphics, delivered as part of week-to-week production at
              Archer Design.
            </p>
            <div className={sub.actions}>
              <a className={opus.pill} href="#motion">
                Watch the motion{" "}
                <i>
                  <ArrowDown size={15} />
                </i>
              </a>
              <a className={sub.ghost} href="#graphics">
                See the graphics
              </a>
            </div>
          </div>
          <div className={sub.heroMedia} style={{ aspectRatio: "4 / 5", maxHeight: 560, justifySelf: "end", width: "min(100%, 440px)" }}>
            <Image
              src="/tcrm/images/hotel-indigo-pittsburgh-room-collage.png"
              alt="Hotel Indigo Pittsburgh room collage campaign graphic"
              fill
              priority
              sizes="440px"
            />
            <div className={sub.mediaCaption}>
              <span>Campaign graphic</span>
              <strong>Hotel Indigo Pittsburgh, room collage</strong>
            </div>
          </div>
        </section>

        <section className={opus.panel} id="motion">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> Motion
            </p>
            <h2>
              <span>Hover to play,</span> click to watch.
            </h2>
            <p>Grouped by the kind of client it was made for. Clips load as you scroll so the page stays light.</p>
          </div>
          <MotionLibrary groups={groups} />
        </section>

        <section className={opus.panel} id="graphics">
          <div className={sub.head}>
            <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
              <b /> Graphics
            </p>
            <h2>
              <span>Brand work built</span> for real campaigns.
            </h2>
            <p>
              Social systems, hospitality campaigns, menus, events and packaging, designed to hold up as single pieces and
              as a system. Property-level work, not a claim of corporate endorsement.
            </p>
          </div>
          <div className={sub.gallery}>
            {TCRM_IMAGES.map((img) => (
              <figure key={img.src}>
                <Image src={img.src} alt={img.title} width={img.width} height={img.height} sizes="(min-width: 1100px) 25vw, (min-width: 600px) 45vw, 92vw" />
                <figcaption>{img.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <PortfolioContact />
        <PortfolioFooter />
      </main>
    </div>
  );
}
