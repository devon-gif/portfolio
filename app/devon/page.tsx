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

const PAGE_TITLE = "Devon Archer — Design Engineer & Creative Technologist";
const PAGE_DESCRIPTION =
  "Portfolio of Devon Archer: design engineering, applied AI, product UX, React/Next.js builds, motion, brand systems, and creative production.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/devon") },
  robots: {
    index: true,
    follow: true,
  },
};

const pub = (file: string) => `/${encodeURIComponent(file)}`;

const brandProof = [
  { src: pub("Hampton-Brand-Logo_TM_CMYK_Full-Color.png"), alt: "Hampton by Hilton" },
  {
    src: pub("PITTSBURGH UNI-OAK_RGB_canvas_white_on_indigo_blue.png"),
    alt: "Hotel Indigo Pittsburgh University-Oakland",
  },
  { src: pub("Elements Full logo- NO BACK GROUND.png"), alt: "Elements Salon & Wellness" },
  { src: pub("Untitled.png"), alt: "Eliza Hot Metal Bistro" },
  { src: "/archer-preview/logos/rev.png", alt: "Revest Properties" },
  { src: "/archer-preview/logos/PRIMARY-1.png", alt: "Vigilant" },
] as const;

const builds = [
  {
    index: "01",
    title: "VibeCode+",
    category: "Creative technology / AI developer tooling",
    thesis: "Making autonomous code repair inspectable instead of magical.",
    description:
      "A GitHub-native AI repair system I designed across product UX and implementation. It combines deterministic health checks, bounded AI repair, visible workflow state, verification, and human review so a developer can understand what the system is doing before accepting a change.",
    image: "/devon/projects/vibecode-neon-code-repair-hero.png",
    href: "https://vibe-code-final.vercel.app/",
    cta: "Open VibeCode+",
    facts: [
      ["Problem", "AI repair is risky when the user cannot inspect real state or evidence."],
      ["System", "Health check → bounded repair → GitHub verification → review."],
      ["Control", "Successful repairs end as draft pull requests, not silent production changes."],
      ["Validation", "216/216 automated tests passing in the latest documented audit."],
    ],
    tags: ["Product UX", "Next.js", "TypeScript", "GitHub", "Supabase", "AI systems"],
  },
  {
    index: "02",
    title: "CheckRay",
    category: "Trust UX / applied AI",
    thesis: "Risk analysis that shows its evidence, uncertainty, and next step.",
    description:
      "A live AI-assisted risk product for suspicious texts, links, jobs, bills, and emails. Instead of treating the model as an authority, the experience separates evidence from interpretation, uses deterministic safeguards where possible, and keeps newly collected scam intelligence behind review before it becomes authoritative.",
    image: "/devon/projects/checkray-home.png",
    href: "https://checkray.app",
    cta: "Open CheckRay",
    facts: [
      ["Problem", "People need useful guidance without false certainty from an AI model."],
      ["System", "Structured analysis → evidence → risk state → recommended action."],
      ["Control", "New scam intelligence is reviewed before promotion into trusted product context."],
      ["Validation", "Offline regression and evaluation workflows protect core analyzer behavior."],
    ],
    tags: ["AI product", "Trust UX", "Next.js", "Supabase", "Evaluation", "Human review"],
  },
  {
    index: "03",
    title: "Baseten Inference Lab",
    category: "Design engineering / AI infrastructure",
    thesis: "Turning infrastructure into an experience someone can actually see.",
    description:
      "An independent design-engineering concept for Baseten that turns a model request into a visible five-step experience — Request, Prepare, Route, Compute, Respond — and carries the idea through responsive implementation, live inference, motion, and deployment.",
    image: "/devon/projects/baseten-inference-lab.png",
    href: "https://baseten-inference-lab.vercel.app/",
    cta: "View live build",
    facts: [
      ["Problem", "Infrastructure is powerful but often invisible to the person evaluating the product."],
      ["Experience", "Request → Prepare → Route → Compute → Respond."],
      ["Build", "Responsive React/Next.js interface with live model interaction and motion."],
      ["Goal", "Make technical capability legible without oversimplifying what is happening."],
    ],
    tags: ["Next.js", "TypeScript", "AI inference", "Responsive UI", "Motion", "Vercel"],
  },
];

const process = [
  {
    n: "01",
    title: "Frame",
    body: "Start with the user, desired outcome, constraints, and the riskiest assumption — not with a preferred technology.",
  },
  {
    n: "02",
    title: "Model",
    body: "Map the data, states, permissions, system boundaries, and what the user needs to understand at each step.",
  },
  {
    n: "03",
    title: "Prototype",
    body: "Build the smallest functional experience that can test the uncertain part instead of polishing a fake certainty.",
  },
  {
    n: "04",
    title: "Build",
    body: "Move into React/Next.js, APIs, data, auth, and workflow logic so the product can be experienced as a real system.",
  },
  {
    n: "05",
    title: "Validate",
    body: "Use builds, tests, evals, edge cases, and real state to prove that the interface is telling the truth about the system.",
  },
];

const stackGroups = [
  ["Frontend", "React · Next.js · TypeScript · Tailwind / CSS"],
  ["Product + data", "Supabase · Postgres · REST APIs · auth · structured state"],
  ["Delivery", "GitHub · Vercel · CI / automated validation · production QA"],
  ["AI workflow", "ChatGPT / Codex · Claude / Claude Code · structured outputs · evals"],
  ["Creative", "Figma · Adobe Creative Suite · motion · video · AI image / video"],
];

export default function DevonCreativeTechnologistPage() {
  return (
    <div className="realiz-page">
      <aside className="rz-rail" aria-label="Portfolio navigation">
        <div className="rz-rail-accent">
          <span>DESIGN — AI — CODE — SYSTEMS</span>
        </div>
        <div className="rz-rail-main">
          <a className="rz-mark" href="#top" aria-label="Back to top">
            DA
          </a>
          <span className="rz-copyright">© 2026 DEVON ARCHER</span>
        </div>
      </aside>

      <main className="rz-main" id="top">
        <header className="rz-topnav" aria-label="Motion portfolio categories">
          <a className="rz-topnav-home" href="#top">DEVON ARCHER</a>
          <nav>
            <a href="#hotels">Hotels</a>
            <a href="#restaurants">Restaurants</a>
            <a href="#commercial">Commercial</a>
          </nav>
        </header>
        <section className="rz-hero">
          <div className="rz-hero-copy">
            <p className="rz-kicker">DEVON ARCHER / DESIGN ENGINEER + CREATIVE TECHNOLOGIST</p>
            <h1>
              <span>DESIGN.</span>
              <span>BUILD.</span>
              <em>SHIP.</em>
            </h1>
            <p className="rz-lead">
              I turn ambiguous ideas into working experiences. My strongest work lives between product design
              and engineering: shaping the interaction, modeling the system, prototyping quickly, and staying
              with the build through real states, QA, deployment, and iteration.
            </p>
            <div className="rz-actions">
              <a href="#builds" className="rz-btn rz-btn-primary">
                Explore the work <ArrowDownRight size={16} aria-hidden="true" />
              </a>
              <a href="https://github.com/devon-gif" target="_blank" rel="noreferrer" className="rz-btn rz-btn-outline">
                GitHub <Code2 size={15} aria-hidden="true" />
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
              <small>PRODUCT / AI / UX / MOTION</small>
            </div>
            <div className="rz-orbit-note">Designer first. Builder when the idea needs to become real.</div>
          </div>
        </section>

        <section className="rz-brand-proof" aria-label="Selected brand and property experience">
          <div className="rz-brand-proof-copy">
            <span>SELECTED BRAND + PROPERTY EXPERIENCE</span>
            <p>Property-level, hospitality, and client work — not a claim of corporate employment or endorsement.</p>
          </div>
          <div className="rz-brand-logo-grid">
            {brandProof.map((brand) => (
              <div
                className={`rz-brand-logo${brand.alt === "Vigilant" ? " rz-brand-logo-darken" : ""}`}
                key={brand.alt}
              >
                <Image src={brand.src} alt={brand.alt} width={190} height={72} sizes="190px" />
              </div>
            ))}
          </div>
        </section>

        <section className="rz-section rz-builds" id="builds">
          <div className="rz-section-head">
            <div>
              <div className="rz-section-number">01 / BUILDS</div>
              <p className="rz-kicker">PRODUCT UX / DESIGN ENGINEERING / APPLIED AI</p>
              <h2>Systems I can explain, not just screens I can show.</h2>
            </div>
            <p>
              The goal is not to make a prototype look technical. It is to make the underlying behavior clear
              enough to test: what the system knows, what it is doing, what it is allowed to do, and where a
              human stays in control.
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
                  <h4>{build.thesis}</h4>
                  <p>{build.description}</p>
                  <div className="rz-build-facts">
                    {build.facts.map(([label, value]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
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
            <a href="https://sfc-evaluator-workbench.vercel.app/en/dashboard" target="_blank" rel="noreferrer">
              <Code2 size={17} aria-hidden="true" />
              <span><strong>SFC Evaluator Workbench</strong><small>Decision-support concept / React / TypeScript</small></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
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
          <div><strong>9.13M</strong><span>tracked social impressions</span></div>
          <div><strong>4.69M</strong><span>tracked reach</span></div>
          <div><strong>636K+</strong><span>tracked engagements</span></div>
          <div><strong>2,970</strong><span>tracked posts / creative pieces</span></div>
        </section>

        <section className="rz-process" id="process">
          <div className="rz-process-intro">
            <div className="rz-section-number">02 / PROCESS</div>
            <p className="rz-kicker dark">FROM AMBIGUOUS BRIEF TO WORKING PRODUCT</p>
            <h2>Design the behavior, then prove it.</h2>
            <p>
              I use design and code as one feedback loop. The prototype is not the end of the process; it is the
              fastest way to expose assumptions, technical constraints, missing states, and interaction problems.
            </p>
          </div>

          <div className="rz-process-grid">
            {process.map((step) => (
              <article key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="rz-technical-position">
            <div>
              <p className="rz-kicker">CAN I ACTUALLY BUILD?</p>
              <h3>Yes — with an honest boundary.</h3>
              <p>
                My strongest area is the design-to-frontend boundary, but I build functional products rather than
                stopping at Figma. I regularly work across React/Next.js, TypeScript, APIs, auth, Supabase/Postgres,
                GitHub, and Vercel. I use AI-assisted development heavily while staying responsible for product
                behavior, constraints, validation, testing, and what ships.
              </p>
              <p>
                I am not presenting myself as a senior infrastructure engineer. I am a design-led technologist who
                can take an idea much farther toward working software, communicate clearly with engineers, and know
                when a problem needs deeper specialization.
              </p>
              <a className="rz-text-link inverse" href="https://github.com/devon-gif" target="_blank" rel="noreferrer">
                Review the GitHub <Code2 size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="rz-stack-list">
              {stackGroups.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rz-studio" id="archer">
          <div className="rz-section-number">03 / ARCHER DESIGN</div>
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
              <div className="rz-section-number">04 / MOTION</div>
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
            <div className="rz-motion-group" id="hotels">
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

            <div className="rz-motion-group" id="restaurants">
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

            <div className="rz-motion-group" id="commercial">
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
              <div className="rz-section-number">05 / CREATIVE</div>
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

        <section className="rz-recommendation" aria-label="Recommendation">
          <div>
            <p className="rz-kicker dark">RECOMMENDATION</p>
            <blockquote>
              “Devon is an amazing employee and graphic designer here at SHAIPE... I would highly recommend Devon.”
            </blockquote>
            <p className="rz-rec-context">
              Ellie P. also highlights communication, judgment, customer-facing poise, web development, and video
              editing / production in her public LinkedIn recommendation.
            </p>
          </div>
          <div className="rz-rec-attribution">
            <strong>Ellie P.</strong>
            <span>SHAIPE / Vigilant · LinkedIn recommendation</span>
            <a href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer">
              View on LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
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
