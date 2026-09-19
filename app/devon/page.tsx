import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  Mail,
  Sparkles,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { DevonMotionSlideshow } from "./components/DevonMotionSlideshow";
import { DevonGraphicSlideshow } from "./components/DevonGraphicSlideshow";
import { TCRM_IMAGES } from "@/app/tcrm/tcrm-media";
import { DEVON_COMMERCIAL_MOTION, DEVON_FNB_MOTION, DEVON_HOTEL_MOTION } from "./motion-data";

const PAGE_TITLE = "Devon Archer — Creative Technologist & Design Engineer";
const PAGE_DESCRIPTION =
  "Portfolio of Devon Archer: product UX, AI-assisted frontend development, motion, brand systems, and creative production.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/devon") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const builds = [
  {
    index: "01",
    title: "VibeCode+",
    category: "Creative technology / AI developer tooling",
    description:
      "A GitHub-native AI repair system I designed and engineered across product UX and implementation. The build combines Next.js and TypeScript with Supabase authentication, GitHub App repository access, customer-owned Anthropic or OpenAI credentials, deterministic guardrails, GitHub Actions verification, and human-reviewed draft pull requests.",
    image: "/devon/projects/vibecode-neon-code-repair-hero.png",
    href: "https://vibe-code-final.vercel.app/",
    cta: "Open VibeCode+",
    tags: ["Product UX", "Next.js", "TypeScript", "GitHub Apps", "Supabase", "AI systems"],
  },
  {
    index: "02",
    title: "Baseten Inference Lab",
    category: "Design engineering / AI infrastructure",
    description:
      "An independent design-engineering concept for Baseten that turns a model request into a visible five-step experience — Request, Prepare, Route, Compute, Respond — then carries the idea through responsive implementation and deployment.",
    image: "/devon/projects/baseten-inference-lab.png",
    href: "https://baseten-inference-lab.vercel.app/",
    cta: "View live build",
    tags: ["Next.js", "TypeScript", "Responsive UI", "Vercel"],
  },
  {
    index: "03",
    title: "CheckRay",
    category: "Trust UX / AI product",
    description:
      "A live AI-assisted risk product for suspicious texts, links, jobs, bills, and emails. The interface turns model interpretation and deterministic guardrails into clear next steps without hiding uncertainty or removing human judgment.",
    image: "/devon/projects/checkray-home.png",
    href: "https://checkray.app",
    cta: "Open CheckRay",
    tags: ["AI product", "UX/UI", "Next.js", "Supabase", "Evaluation"],
  },
];

export default function DevonCreativeTechnologistPage() {
  return (
    <div className="realiz-page">
      <aside className="rz-rail" aria-label="Portfolio navigation">
        <div className="rz-rail-accent">
          <span>DESIGN — MOTION — CODE — SYSTEMS</span>
        </div>
        <div className="rz-rail-main">
          <a className="rz-mark" href="#top" aria-label="Back to top">
            DA
          </a>
          <nav>
            <a href="#builds">Builds</a>
            <a href="#archer">Studio</a>
            <a href="#motion">Motion</a>
            <a href="#graphics">Creative</a>
          </nav>
          <span className="rz-copyright">© 2026 DEVON ARCHER</span>
        </div>
      </aside>

      <main className="rz-main" id="top">
        <section className="rz-hero">
          <div className="rz-hero-copy">
            <p className="rz-kicker">DEVON ARCHER / CREATIVE TECHNOLOGIST</p>
            <h1>
              <span>DESIGN.</span>
              <span>BUILD.</span>
              <em>SHIP.</em>
            </h1>
            <p className="rz-lead">
              I start with the experience and stay with the work through implementation. My work spans product
              UX, AI-assisted frontend development, brand systems, motion, and creative production — from Figma
              and rough concepts to working experiences in production.
            </p>
            <div className="rz-actions">
              <a href="#builds" className="rz-btn rz-btn-primary">
                Explore the work <ArrowDownRight size={16} aria-hidden="true" />
              </a>
              <a href="mailto:heydevon@gmail.com" className="rz-btn rz-btn-outline">
                Get in touch <Mail size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="rz-hero-portrait" aria-label="Portrait of Devon Archer">
            <div className="rz-portrait-art" aria-hidden="true">
              <Image
                src="/tcrm/images/hotel-indigo-pittsburgh-room-collage.png"
                alt=""
                fill
                sizes="(min-width: 900px) 30vw, 80vw"
              />
            </div>
            <div className="rz-portrait-frame">
              <Image
                src="/infuse/brand/devon-archer-portrait.png"
                alt="Devon Archer"
                fill
                priority
                sizes="(min-width: 900px) 34vw, 84vw"
              />
            </div>
            <div className="rz-portrait-label">
              <span>DEVON ARCHER</span>
              <small>UX / BRAND / AI / MOTION</small>
            </div>
            <div className="rz-orbit-note">Designer first. Builder when the idea needs to become real.</div>
          </div>
        </section>

        <section className="rz-section rz-builds" id="builds">
          <div className="rz-section-head">
            <div>
              <div className="rz-section-number">01 / BUILDS</div>
              <p className="rz-kicker">PRODUCT UX / DESIGN ENGINEERING / AI</p>
              <h2>Working products, not portfolio-only mockups.</h2>
            </div>
            <p>
              I move between interface design, code, states, QA, and deployment so ideas can become real
              experiences quickly. These projects show the product thinking and technical depth behind the
              visual craft.
            </p>
          </div>

          <div className="rz-build-list">
            {builds.map((build) => (
              <article className="rz-build" key={build.title}>
                <a
                  className="rz-build-image"
                  href={build.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${build.title} website`}
                  style={{ backgroundImage: `url(${build.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div className="rz-build-copy">
                  <span className="rz-build-index">{build.index}</span>
                  <p className="rz-kicker">{build.category}</p>
                  <h3>{build.title}</h3>
                  <p>{build.description}</p>
                  <div className="rz-tags">
                    {build.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <a className="rz-text-link inverse" href={build.href} target="_blank" rel="noreferrer">
                    {build.cta} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="rz-system-links">
            <a href="/devon/auto">
              <Code2 size={17} aria-hidden="true" />
              <span><strong>Auto Creative OS</strong><small>Production system / Next.js / TypeScript</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="/hotel-creative-scorecard">
              <Sparkles size={17} aria-hidden="true" />
              <span><strong>Hotel Creative Scorecard</strong><small>AI website analysis / structured output</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="rz-proof" aria-label="Selected proof points">
          <div><strong>14.8M+</strong><span>tracked campaign impressions</span></div>
          <div><strong>565K+</strong><span>direct engagements</span></div>
          <div><strong>5+ yrs</strong><span>designing and shipping</span></div>
          <div><strong>Live</strong><span>products, not portfolio-only mockups</span></div>
        </section>

        <section className="rz-studio" id="archer">
          <div className="rz-section-number">02 / ARCHER DESIGN</div>
          <div className="rz-studio-copy">
            <p className="rz-kicker dark">INDEPENDENT CREATIVE STUDIO</p>
            <h2>Creative direction with production muscle.</h2>
            <p>
              Archer Design is my independent studio for hospitality, restaurants, startups, and digital
              products. I work across brand systems, campaign creative, motion, landing pages, product visuals,
              and AI-assisted production — giving clients senior-level creative thinking without separating the
              idea from the execution.
            </p>
            <p>
              The through-line is simple: make the work distinctive, make it usable, and make sure it actually
              ships.
            </p>
            <a className="rz-text-link" href="/">
              Visit Archer Design <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="rz-studio-mosaic">
            <div className="rz-mosaic-large">
              <Image
                src="/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png"
                alt="Selected Archer Design campaign artwork"
                fill
                sizes="(min-width: 900px) 36vw, 90vw"
              />
            </div>
            <div className="rz-mosaic-small top">
              <Image
                src="/tcrm/images/minty-fresh-beverage-art-direction.png"
                alt="Selected Archer Design art direction"
                fill
                sizes="(min-width: 900px) 18vw, 45vw"
              />
            </div>
            <div className="rz-mosaic-small bottom">
              <Image
                src="/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png"
                alt="Selected Archer Design food and beverage poster"
                fill
                sizes="(min-width: 900px) 18vw, 45vw"
              />
            </div>
          </div>
        </section>

        <section className="rz-section rz-motion" id="motion">
          <div className="rz-section-head">
            <div>
              <div className="rz-section-number">03 / MOTION</div>
              <p className="rz-kicker">GENERATIVE R&D / EDITING / STORYTELLING</p>
              <h2>Motion that starts with the shot, not the tool.</h2>
            </div>
            <p>
              Generative motion, cinematic experiments, hospitality promos, and branded edits. I define the
              intended shot, test movement and continuity, select the strongest result, then finish with
              traditional editing and design craft.
            </p>
          </div>

          <div className="rz-motion-groups">
            <div className="rz-motion-group">
              <div className="rz-motion-group-head">
                <div>
                  <span className="rz-motion-group-index">01</span>
                  <h3>Hotel &amp; Hospitality</h3>
                </div>
                <p>
                  Hotels, resorts, rooms, lobbies, arrivals, pools, weddings, property experiences, and destination-led motion.
                </p>
              </div>
              <DevonMotionSlideshow items={DEVON_HOTEL_MOTION} showFullLibraryLink={false} />
            </div>

            <div className="rz-motion-group">
              <div className="rz-motion-group-head">
                <div>
                  <span className="rz-motion-group-index">02</span>
                  <h3>Food &amp; Beverage</h3>
                </div>
                <p>
                  Restaurants, bars, cocktails, breakfast, plated food, coffee, and culinary storytelling.
                </p>
              </div>
              <DevonMotionSlideshow items={DEVON_FNB_MOTION} showFullLibraryLink={false} />
            </div>

            <div className="rz-motion-group">
              <div className="rz-motion-group-head">
                <div>
                  <span className="rz-motion-group-index">03</span>
                  <h3>Commercial</h3>
                </div>
                <p>
                  Product, brand, interface, campaign, and experimental motion — including Nike and other non-hospitality work.
                </p>
              </div>
              <DevonMotionSlideshow items={DEVON_COMMERCIAL_MOTION} showFullLibraryLink={false} />
            </div>
          </div>
        </section>

        <section className="rz-section rz-graphics" id="graphics">
          <div className="rz-section-head light">
            <div>
              <div className="rz-section-number">04 / CREATIVE</div>
              <p className="rz-kicker dark">GRAPHICS / CAMPAIGNS / ART DIRECTION</p>
              <h2>Brand work built for real campaigns.</h2>
            </div>
            <p>
              Social systems, hospitality campaigns, food and beverage creative, events, packages, and launch
              work — designed to feel polished at the individual asset level while still holding together as a
              larger brand system.
            </p>
          </div>

          <DevonGraphicSlideshow
            items={TCRM_IMAGES.map((item) => ({
              src: item.src,
              alt: item.title,
              title: item.title,
              category: item.category,
              width: item.width,
              height: item.height,
            }))}
          />
        </section>

        <section className="rz-contact" id="contact">
          <p className="rz-kicker dark">AVAILABLE FOR THE RIGHT TEAM / PROJECT</p>
          <h2>Have something worth making?</h2>
          <a href="mailto:heydevon@gmail.com">
            heydevon@gmail.com <ArrowUpRight size={28} aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  );
}
