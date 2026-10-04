import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import DevonAIClone from "./components/DevonAIClone";
import LivingLobbyPreview from "./components/LivingLobbyPreview";
import OpusClock from "./components/OpusClock";
import styles from "./opus.module.css";

const PAGE_TITLE = "Devon Archer — Design Engineer + Creative Technologist";
const PAGE_DESCRIPTION =
  "Devon Archer designs and builds AI products, real-time interactive work, production software, motion, and hospitality creative.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Creative Technologist",
    "Design Engineer",
    "AI Product Designer",
    "Design Technologist",
    "Creative Developer",
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
    slug: "living-lobby",
    title: "Living Lobby",
    status: "In development · Part 1 built",
    tags: "Real-time graphics, GPU simulation, live data, installation",
    summary:
      "A generative brand installation for hotel lobbies. Particles move through a world shaped by live time and weather, gather into a wordmark, and respond to people in front of the screen. The system is designed to run unattended like an installation rather than behave like another portfolio demo.",
    facts: ["26K–124K GPU particles", "Live sun + weather inputs", "Director mode + kiosk hardening"],
    tone: "night",
    image: null,
    href: null,
  },
  {
    slug: "vibecode",
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
    slug: "checkray",
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
    slug: "baseten",
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
  {
    slug: "deal-rooms",
    title: "Investor Deal Rooms",
    status: "Client work",
    tags: "Investor storytelling, Dashboards, Decks, Web",
    summary:
      "Pitch decks, private investor rooms, and project dashboards for hospitality and real-estate raises. The job is to turn a complicated deal into a story investors can follow, interrogate, and act on.",
    facts: ["Deck, data room, and site as one system", "Built for active raises"],
    tone: "paper",
    image: "/devon/investor/investor-dashboard.png",
    href: "/devon/investor-deal-rooms",
  },
] as const;

const skills = [
  [
    "Applied AI product design",
    "AI features people can trust. I design what the model may do, what it shows as evidence, where uncertainty appears, and where a person stays in control. Then I build it.",
  ],
  [
    "Design engineering",
    "Design and code as one feedback loop. I take an idea from interaction model to deployed React and Next.js software with real states, data, auth, APIs, QA, and iteration.",
  ],
  [
    "Real-time + interactive",
    "Experiences that respond to people and the world around them: particle systems, shaders, live data, installation behavior, computer vision, and multi-device interaction.",
  ],
  [
    "Rapid prototyping",
    "Working prototypes that test the risky part first. I would rather expose an assumption with a real interaction than polish a fake certainty.",
  ],
  [
    "Motion + campaign systems",
    "Motion, social systems, short-form video, brand assets, and AI-assisted production designed to hold together across large volumes of real client work.",
  ],
  [
    "Creative direction",
    "Hospitality, F&B, events, investor storytelling, and visual systems, with enough production and technical depth to keep the idea connected to what ships.",
  ],
] as const;

const faq = [
  [
    "Can you actually code, or do you only prototype?",
    "I build and ship working software. My strongest ground is the line between design and frontend: React, Next.js, TypeScript, APIs, auth, Supabase, GitHub, and Vercel. I use AI-assisted development heavily and stay responsible for behavior, testing, and what goes live. I am not presenting myself as a senior infrastructure engineer, and I know when a problem needs one.",
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
    "Creative Technologist, Design Technologist, Design Engineer, AI Product Designer, Creative Developer, or prototyping roles where visual craft, product behavior, and working software overlap.",
  ],
] as const;

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
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
            {project.slug === "living-lobby" ? (
              <div
                className="devon-best opusLobby"
                style={{ minHeight: 0, height: "100%", background: "transparent" }}
              >
                <LivingLobbyPreview />
              </div>
            ) : (
              <Image
                src={project.image!}
                alt={project.title}
                fill
                sizes="(min-width: 1000px) 62vw, 94vw"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            )}
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
        {project.href ? (
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
      <header className={styles.nav}>
        <a className={styles.mark} href="#top" aria-label="Devon Archer, back to top">DA</a>
        <nav className={styles.navLinks} aria-label="Portfolio sections">
          <a href="#top">Home</a>
          <a href="#work">Work</a>
          <a href="#ask-ai">AI</a>
          <a href="#skills">Skills</a>
          <a href="#about">About</a>
        </nav>
        <a className={styles.cta} href="#contact">Get in touch <i>↗</i></a>
      </header>

      <main className={styles.shell}>
        <section className={styles.hero} id="top">
          <div className={styles.heroMeta}>
            <span className={styles.live}><span className={styles.liveDot} /><OpusClock /></span>
            <span className={styles.coords}>40.7608° N, 111.8910° W<br />SALT LAKE CITY | UTAH</span>
          </div>

          <svg className={styles.constellation} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 18 L48 10 L83 28 L35 48 L75 68 L10 77" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className={styles.nodes} aria-label="Focus areas">
            <li className={styles.n1}>Applied AI</li>
            <li className={styles.n2}>Design engineering</li>
            <li className={styles.n3}>Real-time graphics</li>
            <li className={styles.n4}>Product UX</li>
            <li className={styles.n5}>Motion</li>
            <li className={styles.n6}>Hospitality creative</li>
          </ul>

          <div className={styles.heroTitle}>
            <h1>Devon Archer</h1>
            <p className={styles.role}>Design Engineer + Creative Technologist</p>
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
                <p className={styles.hireTitle}>Hiring a creative technologist?<br />Start with what I&apos;ve shipped.</p>
                <p className={styles.small}>Live products, real-time builds, and campaign work, all linked below.</p>
                <a className={styles.pill} href="#work">See the work <i><ArrowDown size={15} /></i></a>
              </div>
            </div>

            <p className={styles.bio}>
              I&apos;m Devon Archer, a <strong>design engineer and creative technologist</strong> in Salt Lake City.
              I design AI products people can trust, build real-time interactive work, and run a
              <strong> hospitality creative studio</strong> that ships every week. Concept to deployed code, one loop.
            </p>

            <a className={styles.scroll} href="#work" aria-label="Scroll to work"><ArrowDown size={16} /></a>
          </div>
        </section>

        <section className={styles.panel} id="work">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}><b /> Selected work</p>
            <h2><span>Built, shipped</span> and still running.</h2>
            <p className={styles.lede}>
              The portfolio is organized around working systems, not categories of deliverables.
              Labels distinguish live products, client work, and independent concepts.
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
            <div className={styles.stats}>
              <div><strong>18.6M+</strong><span>impressions</span></div>
              <div><strong>4.9M+</strong><span>reach</span></div>
              <div><strong>612K+</strong><span>engagements</span></div>
              <div><strong>2.7K+</strong><span>creative pieces</span></div>
            </div>
          </div>
          <div className={styles.mosaic}>
            <figure><Image src="/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png" alt="Hospitality campaign artwork" fill sizes="30vw" /></figure>
            <figure><Image src="/tcrm/images/minty-fresh-beverage-art-direction.png" alt="Beverage art direction" fill sizes="18vw" /></figure>
            <figure><Image src="/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png" alt="Food and beverage poster" fill sizes="18vw" /></figure>
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
                  Product thinking, visual craft, creative direction, and enough engineering to ship the idea.
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
              M.S. UX Design, Full Sail University<br />
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
            <h2>Let&apos;s build something people walk up to.</h2>
            <Link className={styles.pill} href="/contact">Start a conversation <i><ArrowUpRight size={15} /></i></Link>
          </div>
          <div className={styles.links}>
            <a className={styles.linkTile} href="https://github.com/devon-gif" target="_blank" rel="noreferrer"><span>GitHub</span><ArrowUpRight /></a>
            <a className={styles.linkTile} href="https://www.linkedin.com/in/devonarcher" target="_blank" rel="noreferrer"><span>LinkedIn</span><ArrowUpRight /></a>
            <Link className={styles.linkTile} href="/contact"><span>Contact</span><ArrowUpRight /></Link>
            <Link className={styles.linkTile} href="/"><span>Archer Design</span><ArrowUpRight /></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>© 2026 Devon Archer</span>
          <span>Salt Lake City, Utah · Working remotely</span>
        </footer>
      </main>
    </div>
  );
}
