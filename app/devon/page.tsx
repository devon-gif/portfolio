import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import DevonAIClone from "./components/DevonAIClone";
import { HeroColorField } from "./components/HeroColorField";
import LivingLobbyPreview from "./components/LivingLobbyPreview";
import AuraLivePreview from "./components/AuraLivePreview";
import LiveSitePreview from "./components/LiveSitePreview";
import ProjectVideo from "./components/ProjectVideo";
import StudioReel from "./components/StudioReel";
import OpusClock from "./components/OpusClock";
import ClientBrands from "./components/ClientBrands";
import { PortfolioNav } from "./components/PortfolioChrome";
import styles from "./opus.module.css";

const PAGE_TITLE = "Devon Archer — Creative Technologist | Motion & AI Creative Systems";
const PAGE_DESCRIPTION =
  "Creative technologist combining motion, AI creative systems, interactive 3D experiences and client-ready digital experiences in Lehi, Utah.";

const PROFILE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": absoluteUrl("/devon#person"),
      name: "Devon Archer",
      url: absoluteUrl("/devon"),
      image: absoluteUrl("/infuse/brand/devon-archer-portrait.png"),
      jobTitle: "Creative Technologist and AI Creative Producer",
      description: PAGE_DESCRIPTION,
      homeLocation: { "@type": "Place", name: "Lehi, Utah, United States" },
      worksFor: { "@id": absoluteUrl("/#organization") },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Full Sail University" },
      sameAs: [
        "https://www.linkedin.com/in/devonarcher",
        "https://github.com/devon-gif",
      ],
      knowsAbout: [
        "Creative technology",
        "Design engineering",
        "Applied AI product design",
        "Real-time graphics",
        "Product UX",
        "Motion design",
        "Hospitality creative",
      ],
    },
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "Archer Design",
      legalName: "Archer Design LLC",
      url: absoluteUrl("/"),
      founder: { "@id": absoluteUrl("/devon#person") },
    },
  ],
};

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  authors: [{ name: "Devon Archer", url: absoluteUrl("/devon") }],
  creator: "Devon Archer",
  publisher: "Archer Design LLC",
  keywords: [
    "Creative Technologist",
    "AI Creative Producer",
    "AI Product Designer",
    "Design Technologist",
    "Generative Media",
    "real-time graphics",
    "creative coding",
    "applied AI",
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "Devon Archer",
  ],
  alternates: { canonical: absoluteUrl("/devon") },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: absoluteUrl("/devon"),
    type: "website",
    images: [
      {
        url: absoluteUrl("/devon/projects/vibecode-neon-code-repair-hero.png"),
        width: 1200,
        height: 630,
        alt: "Devon Archer creative technology portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [absoluteUrl("/devon/projects/vibecode-neon-code-repair-hero.png")],
  },
};

const projects = [
  {
    slug: "promo-generator",
    title: "Hotel Promo Generator",
    status: "Working tool · Remotion",
    tags: "Creative automation, Remotion, React, TypeScript, Motion",
    summary:
      "A working branded video concept that converts four spreadsheet offers into 12 hotel promos across three formats. I defined the creative system and directed AI-assisted implementation to demonstrate reliable multi-format production.",
    facts: ["4 offers × 3 formats = 12 video outputs", "Consistent typography, layout and safe zones", "Creative direction and AI-assisted implementation"],
    tone: "night",
    image: "/devon/projects/promo-generator-grid.jpg",
    video: "/devon/projects/promo-generator-grid.mp4",
    videoAlt: "Twelve hotel promo videos generated from one template, playing together in a grid",
    href: "/devon/promo-generator",
  },
  {
    slug: "aura-one",
    title: "AURA ONE",
    status: "Live interactive concept",
    tags: "Interactive 3D, Blender, React Three Fiber, GSAP, Next.js",
    summary:
      "A fictional luxury headphone launch combining Blender visuals, interactive product storytelling, scroll-driven 3D motion and a live product experience. I defined the design direction and guided AI-assisted React Three Fiber / GSAP implementation.",
    facts: ["Concept, art direction and interaction design", "AI-assisted Three.js / GSAP implementation", "Live demo: exploded view and product colorways"],
    tone: "night",
    image: null,
    href: "https://aura-one-devon-gifs-projects.vercel.app",
  },
  {
    slug: "deal-rooms",
    title: "Investor Decks & Deal Rooms",
    status: "Client work · CR91 Park Plaza",
    tags: "Investor storytelling, Dashboards, Decks, Web",
    summary:
      "For CR91 Park Plaza, I designed investor presentations, the project website and a private materials system. I directed AI-assisted implementation to bring real client documents, project updates and storytelling into one experience.",
    facts: ["Real client project: concept, visual direction and delivery", "Investor decks, site and private document workflows"],
    tone: "paper",
    image: "/devon/investor/cr91-live-investor-room.png",
    href: "/devon/investor-deal-rooms",
  },
  {
    slug: "living-lobby",
    title: "Living Lobby",
    status: "In development · Part 1 built",
    tags: "Real-time graphics, GPU simulation, live data, installation",
    summary:
      "A generative brand installation for hotel lobbies. Particles move through a world shaped by live time and weather, gather into a wordmark, and respond to people in front of the screen. The system is designed to run unattended like an installation rather than behave like another portfolio demo.",
    facts: ["26K–124K GPU particles", "Live sun + weather inputs", "Director mode + kiosk hardening"],
    tone: "night",
    image: null,
    href: "/devon/living-lobby",
  },
  {
    slug: "checkray",
    live: "https://www.checkray.app/",
    title: "CheckRay",
    status: "Live product",
    tags: "Trust UX, Applied AI, Evaluation, Supabase",
    summary:
      "Scam risk analysis for suspicious texts, links, job offers, bills, and emails. Evidence is separated from interpretation, uncertainty stays visible, and newly collected scam intelligence is reviewed before the product treats it as trusted context.",
    facts: ["Evidence first, then a risk state", "Human review + regression workflows"],
    tone: "mint",
    image: "/devon/projects/checkray-home.png",
    href: "https://checkray.app",
  },
  {
    slug: "vibecode",
    live: "https://vibe-code-final.vercel.app/",
    title: "VibeCode+",
    status: "Live product",
    tags: "AI developer tooling, Product UX, Next.js, GitHub",
    summary:
      "Inspectable AI code repair. Deterministic health checks, bounded AI fixes, GitHub verification, and human review let a developer see what the system did before accepting a change. Successful repairs land as draft pull requests instead of silent production changes.",
    facts: ["216/216 automated tests in latest audit", "Draft PRs, never silent changes"],
    tone: "night",
    image: "/devon/projects/vibecode-neon-code-repair-hero.png",
    href: "https://vibe-code-final.vercel.app/",
  },
  {
    slug: "baseten",
    live: "https://baseten-inference-lab.vercel.app/",
    title: "Baseten Inference Lab",
    status: "Independent concept",
    tags: "Design engineering, AI infrastructure, Motion, Vercel",
    summary:
      "A model request made visible as five steps: request, prepare, route, compute, respond. Live inference, responsive layout, and motion turn invisible infrastructure into something a person evaluating the platform can actually understand.",
    facts: ["Live model calls", "Independent concept, not affiliated with Baseten"],
    tone: "lime",
    image: "/devon/projects/baseten-inference-lab.png",
    href: "https://baseten-inference-lab.vercel.app/",
  },
] as const;

const skills = [
  ["AI creative production systems", "Repeatable image and video workflows, branded variations, visual consistency, editing and quality review for multi-format campaigns."],
  ["Motion + visual storytelling", "Kinetic typography, interface animation, promotional video, campaign motion and detailed art direction across Adobe tools and generative workflows."],
  ["Interactive experiences", "Blender visualization, interactive 3D and real-time experiences designed and implemented through AI-assisted Three.js, React and GSAP workflows."],
  ["AI-assisted product direction", "I define the behavior, states, requirements and quality bar; guide AI coding tools through implementation; review, test and iterate. I do not claim independent JavaScript programming fluency."],
  ["Client creative production", "Hospitality, food and beverage, wellness and events creative. 2.7K+ assets and aggregate tracked campaign performance."],
  ["Concept to delivery", "Visual concept, storyboarding, styleframes, prototypes, feedback, production and launch, keeping creative intent intact."],
] as const;

const faq = [
  [
    "How much code do you write yourself?",
    "I direct and ship functioning applications using Claude Code and Codex for much of the implementation. My personal strengths are design, interaction decisions, requirements, reviewing behavior, troubleshooting with AI, and guiding releases. I cannot write substantial React or JavaScript unaided today, so I do not claim to be an independent frontend engineer.",
  ],
  [
    "How do you use AI in your work?",
    "Use AI for ambiguity. Use deterministic systems for guarantees. Keep a human where judgment matters. The interface should make evidence, uncertainty, state, and control understandable instead of treating the model like an oracle.",
  ],
  [
    "Where does hospitality fit into a Creative Technologist role?",
    "Hotels and restaurants taught me to ship for real audiences on real deadlines. That domain experience now feeds projects like Living Lobby, where creative direction, real-time engineering, and physical guest experience meet.",
  ],
  [
    "What kind of role fits best?",
    "AI Creative Technologist, AI Creative Producer, Motion Designer, Interactive Experience Designer or Digital Designer roles emphasizing creative systems and AI-assisted delivery. Coding-heavy engineering positions are not my strongest match today.",
  ],
] as const;

type ProjectMedia = { title: string; image: string | null; live?: string; video?: string; videoWebm?: string; videoAlt?: string };

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const media: ProjectMedia = project;
  return (
    <article className={styles.project} id={project.slug}>
      <div className={styles.media} data-tone={project.tone}>
        <div className={styles.browser}>
          <div className={styles.browserBar} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.browserShot}>
            {project.slug === "aura-one" ? (
              <AuraLivePreview />
            ) : project.slug === "living-lobby" ? (
              <LivingLobbyPreview />
            ) : media.video && media.image ? (
              <ProjectVideo src={media.video} webm={media.videoWebm} poster={media.image} alt={media.videoAlt ?? media.title} objectPosition="center 40%" />
            ) : media.live && media.image ? (
              <LiveSitePreview src={media.live} poster={media.image} title={media.title} />
            ) : media.image ? (
              <Image
                src={media.image}
                alt={media.title}
                fill
                sizes="(min-width: 1000px) 62vw, 94vw"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            ) : null}
            {project.slug === "deal-rooms" ? <span className={styles.projectMediaCaption}>CR91 Park Plaza · project visualization</span> : null}
          </div>
        </div>
      </div>
      <div className={styles.projectCopy}>
        <span className={styles.status}>{project.status}</span>
        <h3>{project.title}</h3>
        <p className={styles.tags}>{project.tags}</p>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.facts}>
          {project.facts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>
        {project.slug === "aura-one" ? (
          <a className={styles.pill} data-aura-visit="true"
             href="https://aura-one-devon-gifs-projects.vercel.app/" target="_blank" rel="noopener noreferrer">
            Explore live AURA website <i><ArrowUpRight size={15} /></i>
          </a>
        ) : project.href ? (
          project.href.startsWith("http") ? (
            <a className={styles.pill} href={project.href} target="_blank" rel="noreferrer">
              View project <i><ArrowUpRight size={15} /></i>
            </a>
          ) : (
            <Link className={styles.pill} href={project.href}>
              View project <i><ArrowUpRight size={15} /></i>
            </Link>
          )
        ) : (
          <a className={styles.pill} href="#ask-ai">
            Ask about the build <i><ArrowUpRight size={15} /></i>
          </a>
        )}
      </div>
    </article>
  );
}

export default function DevonPortfolioPage() {
  return (
    <div className={styles.opusPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_SCHEMA) }}
      />
      <PortfolioNav current="work" />

      <main className={styles.shell}>
        <section className={styles.hero} id="top">
          <HeroColorField className={styles.field} />
          <div className={styles.heroMeta}>
            <span className={styles.live}><span className={styles.liveDot} /><OpusClock /></span>
            <span className={styles.coords}>40.3916° N, 111.8508° W<br />LEHI | UTAH | SLC METRO</span>
          </div>

          <svg className={styles.constellation} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 18 L48 10 L83 28 L35 48 L75 68 L10 77" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className={styles.nodes} aria-label="Focus areas">
            <li className={styles.n1}>AI creative systems</li>
            <li className={styles.n2}>Interactive design</li>
            <li className={styles.n3}>Generative media</li>
            <li className={styles.n4}>Art direction</li>
            <li className={styles.n5}>Motion</li>
            <li className={styles.n6}>Hospitality creative</li>
          </ul>

          <div className={styles.heroTitle}>
            <h1>Devon Archer</h1>
            <p className={styles.role}>Creative Technologist · AI Creative Systems · Motion</p>
          </div>

          <div className={styles.heroFoot}>
            <div className={styles.hireCard}>
              <div className={styles.portrait}>
                <Image
                  src="/infuse/brand/devon-archer-portrait.png"
                  alt="Devon Archer"
                  fill
                  priority
                  sizes="120px"
                />
              </div>
              <div className={styles.hireCopy}>
                <p className={styles.hireTitle}>Motion. Experiences.<br />Creative systems.</p>
                <p className={styles.small}>One project or ongoing design and technical support.</p>
                <Link className={styles.pill} href="/contact?service=project">Start a project <i><ArrowUpRight size={15} /></i></Link>
                <Link className={styles.hireSecondary} href="/devon/investor-deal-rooms#decks">See investor decks ↗</Link>
              </div>
            </div>

            <p className={styles.bio}>
              I&apos;m Devon Archer, a <strong>creative technologist</strong> based in Lehi, Utah. I combine
              <strong> motion, art direction, AI creative systems and interactive experiences</strong> for clients and independent work.
              I lead the concept and guide AI-assisted implementation, reviewing and refining the finished experience.
            </p>

            <a className={styles.scroll} href="#work" aria-label="Scroll to work"><ArrowDown size={16} /></a>
          </div>
        </section>

        <ClientBrands />


        <section className={styles.panel} id="work">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}><b /> Selected work</p>
            <h2><span>Creative technology.</span> Made real.</h2>
            <p className={styles.lede}>
              Start with creative automation, interactive 3D product storytelling and real client systems.
              Each project distinguishes creative direction from AI-assisted implementation.
            </p>
          </div>
        </section>

        {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}

        <section className={styles.studio}>
          <div className={styles.studioCopy}>
            <p className={styles.eyebrow}><b /> Studio practice</p>
            <h3>Archer Design</h3>
            <p>
              My studio for hotels, restaurants, spas, startups, and investor projects.
              Campaign systems, social creative, motion, web experiences, and visual storytelling
              delivered for real teams with real deadlines.
            </p>
            <p className={styles.capabilities}>
              {["Campaigns", "Motion", "Hospitality", "Product", "Investor Storytelling", "AI Creative"].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </p>
            <div className={styles.stats}>
              <div><strong>18.6M+</strong><span>impressions</span></div>
              <div><strong>4.9M+</strong><span>reach</span></div>
              <div><strong>612K+</strong><span>engagements</span></div>
              <div><strong>2.7K+</strong><span>creative pieces</span></div>
            </div>
            <Link className={styles.pill} href="/devon/social-performance" style={{marginTop:18}}>
              View verified ContentStudio performance <i><ArrowUpRight size={15} /></i>
            </Link>
            <p className={styles.metricNote}>
              Aggregate tracked campaign results through October 2026. Creative performance only; no booking attribution implied.
            </p>
            <Link className={styles.studioLink} href="/devon/hospitality">
              View hospitality work <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className={styles.reel}>
            <StudioReel />
          </div>
        </section>

        <nav className={styles.panel} aria-label="More builds">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}><b /> More builds</p>
            <h2><span>More systems,</span> more proof.</h2>
            <ul className={styles.facts}>
              <li><a href="https://sfc-evaluator-workbench.vercel.app/en/dashboard" target="_blank" rel="noreferrer">Evaluator Workbench ↗</a></li>
              <li><Link href="/devon/auto">Auto Creative OS ↗</Link></li>
              <li><Link href="/hotel-creative-scorecard">Hotel Creative Scorecard ↗</Link></li>
              <li><Link href="/devon/motion">Motion library ↗</Link></li>
              <li><Link href="/devon/hospitality">Hospitality work ↗</Link></li>
              <li><Link href="/devon/illustration">Illustration ↗</Link></li>
            </ul>
          </div>
        </nav>

        <section className={styles.aiPanel} id="ask-ai">
          <div className={styles.aiIntro}>
            <p className={styles.eyebrow}><b /> Ask my portfolio</p>
            <h2><span>Skip the generic bio.</span> Ask what I can actually do.</h2>
            <p className={styles.lede}>
              Devon AI is grounded in the professional work on this portfolio. Ask about role fit,
              technical depth, projects, process, or what I would own on a team.
            </p>
          </div>
          <div
            className="devon-best opusAI"
            style={{ minHeight: 0, background: "transparent", color: "#f3f4ec" }}
          >
            <DevonAIClone />
          </div>
        </section>

        <section className={styles.panel} id="skills">
          <div className={styles.skillsGrid}>
            <div>
              <p className={styles.eyebrow}><b /> Skills</p>
              <div className={styles.sectionHead} style={{ display: "block" }}>
                <h2><span>What I bring</span> to a team.</h2>
                <p className={styles.lede} style={{ marginTop: 22 }}>
                  Visual judgment, repeatable AI workflows, motion craft and product direction through AI-assisted implementation.
                </p>
              </div>
            </div>
            <div className={styles.skillList}>
              {skills.map(([title, body], index) => (
                <details className={styles.skill} key={title} open={index === 0}>
                  <summary>{title}<i>+</i></summary>
                  <p>{body}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.aboutRow} id="about">
          <div className={styles.panel + " " + styles.about}>
            <div className={styles.aboutPhoto}>
              <Image src="/infuse/brand/devon-archer-portrait.png" alt="Devon Archer" fill sizes="(min-width:900px) 40vw, 94vw" />
            </div>
            <p className={styles.eyebrow}><b /> About</p>
            <h2>Devon Archer</h2>
            <ul className={styles.timeline}>
              <li><span>2021 to now</span><div><strong>Founder, Archer Design</strong><small>Hospitality creative, motion, web, investor materials, and creative technology.</small></div></li>
              <li><span>2025 to 2026</span><div><strong>Co-founder, JobGhost</strong><small>Product positioning, growth systems, and recruiting SaaS.</small></div></li>
              <li><span>2021 to 2025</span><div><strong>Graphic Designer, SHAIPE</strong><small>Multi-account digital design and client delivery.</small></div></li>
            </ul>
            <p className={styles.small} style={{ marginTop: 20 }}>
              B.S. UX/UI Design, Full Sail University<br />
              Graphic Design Certificate, CalArts
            </p>
          </div>

          <div className={styles.panel + " " + styles.faq}>
            <p className={styles.eyebrow}><b /> Questions recruiters ask</p>
            {faq.map(([q, a], index) => (
              <details key={q} open={index === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <a className={styles.pill} href="#ask-ai">Ask something else <i><ArrowUpRight size={15} /></i></a>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <div className={styles.panel + " " + styles.contactMain}>
            <p className={styles.eyebrow}><b /> Work with me</p>
            <h2>Let&apos;s make your next project clear.</h2>
            <Link className={styles.pill} href="/contact">Start a conversation <i><ArrowUpRight size={15} /></i></Link>
          </div>
          <div className={styles.links}>
            <a className={styles.linkTile} href="https://github.com/devon-gif" target="_blank" rel="noreferrer"><span>GitHub</span><ArrowUpRight /></a>
            <a className={styles.linkTile} href="/devon/resume.pdf" target="_blank" rel="noreferrer"><span>Resume (PDF)</span><ArrowUpRight /></a>
            <a className={styles.linkTile} href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer"><span>LinkedIn</span><ArrowUpRight /></a>
            <Link className={styles.linkTile} href="/contact"><span>Contact</span><ArrowUpRight /></Link>
            <Link className={styles.linkTile} href="/"><span>Archer Design</span><ArrowUpRight /></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>© 2026 Devon Archer</span>
          <span>Lehi, Utah · Salt Lake City metro · Working remotely</span>
        </footer>
      </main>
    </div>
  );
}
