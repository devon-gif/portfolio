import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import styles from "./illustration.module.css";
import BookReader from "./BookReader";

export const metadata: Metadata = {
  title: "Illustration & Children's Books · Devon Archer",
  description: "Read Pedro the Star Catcher, a 19-page illustrated children's story by Devon Archer, with illustrations and coloring by Camille Alton and Devon Archer.",
  alternates: { canonical: absoluteUrl("/devon/illustration") },
  openGraph: {
    title: "Pedro the Star Catcher — An Illustrated Children's Book",
    description: "Written by Devon Archer. Illustrations and coloring by Camille Alton and Devon Archer. Browse all 19 illustrated pages.",
    url: absoluteUrl("/devon/illustration"),
    images: [{url: absoluteUrl("/devon/illustration/pedro/page-01.jpg"), width:1600, height:1200, alt:"Pedro the Star Catcher illustrated cover"}],
  },
};

export default function IllustrationPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="illustration" />
      <main className={opus.shell}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <Crumb label="Illustration" />
            <p className={styles.kicker}><Sparkles size={15} /> Illustration · Children's publishing · Original story</p>
            <h1>Drawn to <em>tell stories.</em></h1>
            <p className={styles.lead}>A different side of my creative work: character illustration, picture-book storytelling, and imaginary worlds, developed page by page.</p>
            <Link className={styles.heroCta} href="#read">
              <BookOpen size={19} /> Open the story <ArrowUpRight size={17} />
            </Link>
            <p className={styles.credit}>Written by Devon Archer · Illustrations & coloring by Camille Alton and Devon Archer</p>
          </div>
          <div className={styles.heroArtwork}>
            <Image src="/devon/illustration/pedro/page-01.jpg" alt="Original Pedro the Star Catcher children's book cover featuring Pedro the space-pirate monkey" width={1600} height={1200} priority sizes="(min-width: 1100px) 44vw, 90vw" />
            <span>Original illustrated children's book · 19 pages</span>
          </div>
          <span className={styles.starOne} aria-hidden="true">✳</span>
          <span className={styles.starTwo} aria-hidden="true">✦</span>
        </section>

        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>01 / The book</p>
            <h2>Pedro the <span>Star Catcher.</span></h2>
          </div>
          <div className={styles.introText}>
            <p>Meet Pedro, a pirate monkey who sails through outer space collecting shooting stars. When a little star loses his way to Earth, Pedro helps him find his way back to the children waiting to make a wish.</p>
            <p>From the original character designs and space scenes to the full storybook layout, this project brings together writing, hand-drawn illustration, color, and visual storytelling.</p>
            <p className={styles.byline}><strong>Story:</strong> Devon Archer<br /><strong>Illustrations and coloring:</strong> Camille Alton &amp; Devon Archer<br /><strong>Editing:</strong> Heather Jepsen</p>
          </div>
        </section>

        <BookReader />

        <section className={styles.outro}>
          <div>
            <p className={styles.eyebrow}>02 / Beyond the book</p>
            <h2>Storytelling is a <em>design skill.</em></h2>
            <p>Illustrating a book means shaping character, pacing, atmosphere, and emotion across every page. Those same fundamentals carry into the campaigns, interfaces, motion work, and digital experiences I build today.</p>
            <div className={styles.outroLinks}>
              <Link href="/devon/motion">Explore motion & graphics <ArrowUpRight size={16} /></Link>
              <Link href="/devon#work">Back to selected work <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <div className={styles.outroImage}>
            <Image src="/devon/illustration/pedro/page-15.jpg" alt="Pedro and a smiling star above Earth from Pedro the Star Catcher" width={1600} height={1200} sizes="(min-width: 1000px) 42vw, 92vw" />
          </div>
        </section>

        <PortfolioContact title="Have a story worth bringing to life?" />
        <PortfolioFooter />
      </main>
    </div>
  );
}
