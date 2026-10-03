import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Code2, Mail, Sparkles } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import DevonAIClone from "./components/DevonAIClone";
import DevonLiveMeta from "./components/DevonLiveMeta";
import LivingLobbyPreview from "./components/LivingLobbyPreview";

const PAGE_TITLE = "Devon Archer — Creative Technologist & Design Engineer";
const PAGE_DESCRIPTION =
  "Creative Technologist and Design Engineer building AI products, interactive systems, real-time experiences, motion, and production software.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Creative Technologist",
    "Design Engineer",
    "AI Product Designer",
    "Design Technologist",
    "Creative Developer",
    "design engineering",
    "interactive systems",
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

const proof = [
  ["18.6M+", "tracked impressions"],
  ["612K+", "engagements"],
  ["2.7K+", "creative pieces"],
  ["216/216", "latest VibeCode+ audit"],
] as const;

const projects = [
  {
    index: "02",
    title: "VibeCode+",
    eyebrow: "AI DEVELOPER TOOLING / PRODUCT UX / DESIGN ENGINEERING",
    statement: "Make autonomous code repair inspectable instead of magical.",
    body:
      "A GitHub-native AI repair system built around deterministic health checks, bounded AI repair, visible workflow state, verification, and human review. Successful repairs end as draft pull requests instead of silent production changes.",
    metrics: ["216/216 automated tests", "Next.js + TypeScript", "GitHub-native workflow"],
    image: "/devon/projects/vibecode-neon-code-repair-hero.png",
    href: "https://vibe-code-final.vercel.app/",
  },
  {
    index: "03",
    title: "CheckRay",
    eyebrow: "TRUST UX / APPLIED AI / PRODUCT SYSTEM",
    statement: "AI risk analysis that shows evidence, uncertainty, and the next move.",
    body:
      "A live AI-assisted product for suspicious texts, links, jobs, bills, and emails. The experience separates evidence from interpretation and keeps newly collected scam intelligence behind review before it becomes authoritative.",
    metrics: ["Structured evidence", "Human review loop", "Regression + eval workflows"],
    image: "/devon/projects/checkray-home.png",
    href: "https://checkray.app",
  },
  {
    index: "04",
    title: "Baseten Inference Lab",
    eyebrow: "AI INFRASTRUCTURE / INTERACTION DESIGN / FRONTEND",
    statement: "Turn invisible infrastructure into something a person can understand.",
    body:
      "An independent design-engineering concept that turns a model request into a visible five-step experience: Request, Prepare, Route, Compute, Respond. The concept carries through responsive implementation, live model interaction, motion, and deployment.",
    metrics: ["Live inference", "Responsive React UI", "Motion + system visualization"],
    image: "/devon/projects/baseten-inference-lab.png",
    href: "https://baseten-inference-lab.vercel.app/",
  },
] as const;

const capabilities = [
  {
    n: "01",
    title: "AI Product Design",
    body:
      "Designing non-deterministic products where the model handles ambiguity and the interface makes uncertainty, evidence, permissions, and human control understandable.",
    tags: ["LLM UX", "Evals", "Guardrails", "Human review"],
  },
  {
    n: "02",
    title: "Design Engineering",
    body:
      "Moving from interaction model to working software with React, Next.js, TypeScript, Supabase, APIs, GitHub, Vercel, testing, and production QA.",
    tags: ["React", "Next.js", "TypeScript", "Supabase"],
  },
  {
    n: "03",
    title: "Creative Technology",
    body:
      "Building interactive systems that blend code, motion, real-time inputs, computer vision, generative media, and brand behavior instead of stopping at static screens.",
    tags: ["Real-time", "Motion", "Computer vision", "Generative"],
  },
  {
    n: "04",
    title: "Creative Direction",
    body:
      "Campaign systems, hospitality creative, motion, video, investor storytelling, and visual design backed by enough technical depth to keep concept and execution connected.",
    tags: ["Figma", "Adobe", "Motion", "Campaigns"],
  },
] as const;

const faqs = [
  {
    q: "Can you actually code, or do you stop at Figma?",
    a:
      "I build functional products. My strongest lane is the design-to-frontend boundary, but I regularly work across React/Next.js, TypeScript, Supabase/Postgres, APIs, auth, GitHub, Vercel, workflow logic, testing, and deployment. I am not presenting myself as a senior infrastructure engineer; I am a design-led technologist who can take an idea much farther toward working software.",
  },
  {
    q: "What kind of role fits you best?",
    a:
      "Creative Technologist, Design Technologist, Design Engineer, AI Product Designer, Creative Developer, or prototyping roles where visual design and working software overlap. I do best when the brief is ambiguous and someone needs to turn it into a clear behavior, a convincing experience, and something real enough to test.",
  },
  {
    q: "What makes your AI work different from chatbot UI design?",
    a:
      "I focus on system behavior: what the model knows, what it can do, what stays deterministic, where confidence is shown, when a human reviews the result, and how the product recovers when something goes wrong. VibeCode+ and CheckRay are the clearest examples.",
  },
  {
    q: "Why keep hospitality in a Creative Technologist portfolio?",
    a:
      "Because it is useful domain depth, not a box. Years of real hotel, restaurant, F&B, event, campaign, and property-level creative give me a place to deploy interactive and AI work with actual operators and guests. Living Lobby is designed specifically to turn that advantage into an experiential technology case study.",
  },
] as const;

const experience = [
  ["2021 — NOW", "Archer Design", "Founder / Creative Technologist", "Creative systems, hospitality campaigns, motion, investor storytelling, web experiences, and AI-assisted product implementation."],
  ["2025 — 2026", "JobGhost", "Co-Founder / Product + Growth Systems", "Product positioning, recruiting workflows, outreach systems, growth experiments, and AI-assisted product thinking."],
  ["2021 — 2025", "SHAIPE Agency", "Graphic Designer / Client-Facing Operator", "Multi-account design, campaign visuals, brand systems, social creative, and direct client collaboration."],
] as const;

export default function DevonPortfolioPage() {
  return (
    <div className="devon-best">
      <header className="db-nav">
        <div className="db-nav-inner">
          <a className="db-mark" href="#top" aria-label="Back to top">
            DA
          </a>
          <nav aria-label="Portfolio sections">
            <a href="#work">WORK</a>
            <a href="#skills">SKILLS</a>
            <a href="#about">ABOUT</a>
            <a href="#ask-devon">ASK AI</a>
          </nav>
          <a className="db-nav-cta" href="/contact">
            CONTACT ↗
          </a>
        </div>
      </header>

      <main id="top">
        <section className="db-hero">
          <div className="db-shell">
            <DevonLiveMeta />

            <div className="db-hero-tags" aria-label="Core disciplines">
              <span>CREATIVE TECHNOLOGY</span>
              <span>DESIGN ENGINEERING</span>
              <span>AI PRODUCT DESIGN</span>
              <span>MOTION + SYSTEMS</span>
            </div>

            <div className="db-hero-grid">
              <div className="db-hero-copy">
                <p className="db-eyebrow">DEVON ARCHER / CREATIVE TECHNOLOGIST</p>
                <h1>
                  DESIGN THE SYSTEM.
                  <em>BUILD THE EXPERIENCE.</em>
                </h1>
                <p className="db-hero-lead">
                  I turn ambiguous ideas into working AI products, interactive systems, and high-impact creative —
                  moving from visual direction and UX into code, real states, testing, deployment, and iteration.
                </p>
                <div className="db-hero-actions">
                  <a className="db-btn db-btn-accent" href="#ask-devon">
                    TALK TO MY AI <Sparkles size={15} aria-hidden="true" />
                  </a>
                  <a className="db-btn db-btn-ghost" href="#work">
                    VIEW THE WORK ↓
                  </a>
                </div>
                <p className="db-hero-note">
                  Recruiter? Ask the portfolio about role fit, technical depth, project decisions, or what I would
                  actually own on a team.
                </p>
              </div>

              <div className="db-hero-panel">
                <div className="db-hero-panel-top">
                  <span>PORTFOLIO / LIVE</span>
                  <span>2026</span>
                </div>
                <div className="db-hero-portrait">
                  <Image
                    src="/infuse/brand/devon-archer-portrait.png"
                    alt="Devon Archer"
                    fill
                    priority
                    sizes="(max-width: 900px) 88vw, 42vw"
                  />
                </div>
                <div className="db-hero-panel-bottom">
                  <div>
                    <span>FOCUS</span>
                    <strong>AI + INTERACTIVE SYSTEMS</strong>
                  </div>
                  <div>
                    <span>BASE</span>
                    <strong>SALT LAKE CITY / REMOTE</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="db-proof" aria-label="Selected proof points">
              {proof.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="db-section db-ai-section">
          <div className="db-shell">
            <div className="db-section-head db-section-head-ai">
              <div>
                <p className="db-section-index">00 / CONVERSATIONAL PORTFOLIO</p>
                <h2>Your next question is probably better than another resume bullet.</h2>
              </div>
              <p>
                This is a recruiter-facing AI guide grounded in my public professional portfolio. It can explain
                projects, compare my experience to a role, and point to the evidence behind an answer.
              </p>
            </div>
            <DevonAIClone />
          </div>
        </section>

        <section className="db-section db-work" id="work">
          <div className="db-shell">
            <div className="db-section-head">
              <div>
                <p className="db-section-index">01 / FEATURED WORK</p>
                <h2>Projects that make the system visible.</h2>
              </div>
              <p>
                I am deliberately moving beyond dashboard-only work. The strongest pieces below connect product
                thinking, creative direction, and working technology — including a new real-time hospitality
                installation designed to be experienced in a room, not just viewed on a screen.
              </p>
            </div>

            <article className="db-feature db-feature-lobby" id="living-lobby">
              <div className="db-feature-copy">
                <span className="db-project-index">01</span>
                <p className="db-eyebrow">REAL-TIME GRAPHICS / THREE.JS / GLSL / HOSPITALITY EXPERIENCE</p>
                <h3>Living Lobby</h3>
                <h4>A hotel brand system that behaves like a place, not a slide.</h4>
                <p>
                  A real-time lobby installation that turns time of day, live weather, and guest interaction into
                  a responsive visual identity. Part 1 is built as a Vite + TypeScript + Three.js engine with GPU
                  particle simulation, live sunrise/sunset timing, Open-Meteo weather, director mode, adaptive
                  quality, and kiosk hardening.
                </p>

                <div className="db-feature-stats">
                  <div><strong>26K → 124K</strong><span>GPU particles by quality tier</span></div>
                  <div><strong>24 SEC</strong><span>wordmark formation cycle</span></div>
                  <div><strong>LIVE</strong><span>sun + weather inputs</span></div>
                </div>

                <div className="db-chip-row">
                  <span>Three.js</span>
                  <span>GLSL</span>
                  <span>TypeScript</span>
                  <span>Open-Meteo</span>
                  <span>Real-time interaction</span>
                </div>

                <p className="db-project-note">
                  Next: camera interaction, audio response, phone-as-controller, brand-constrained generative
                  output, and a take-home guest moment.
                </p>
              </div>
              <LivingLobbyPreview />
            </article>

            <div className="db-project-list">
              {projects.map((project) => (
                <article className="db-project" key={project.title}>
                  <a
                    className="db-project-media"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title}`}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                    <span>OPEN PROJECT ↗</span>
                  </a>
                  <div className="db-project-copy">
                    <span className="db-project-index">{project.index}</span>
                    <p className="db-eyebrow">{project.eyebrow}</p>
                    <h3>{project.title}</h3>
                    <h4>{project.statement}</h4>
                    <p>{project.body}</p>
                    <div className="db-project-metrics">
                      {project.metrics.map((metric) => <span key={metric}>{metric}</span>)}
                    </div>
                    <a href={project.href} target="_blank" rel="noreferrer">
                      VIEW PROJECT <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="db-supporting-work">
              <a href="https://sfc-evaluator-workbench.vercel.app/en/dashboard" target="_blank" rel="noreferrer">
                <span>05</span>
                <div><strong>SFC Evaluator Workbench</strong><p>Decision support / React / TypeScript</p></div>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a href="/devon/auto">
                <span>06</span>
                <div><strong>Auto Creative OS</strong><p>Creative production system / Next.js</p></div>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a href="/devon/investor-atlas">
                <span>07</span>
                <div><strong>Investor Story Systems</strong><p>Complex information / visual narrative / web</p></div>
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="db-section db-skills" id="skills">
          <div className="db-shell">
            <div className="db-section-head">
              <div>
                <p className="db-section-index">02 / PRACTICE</p>
                <h2>A particular mix of design, code, and creative direction.</h2>
              </div>
              <p>
                The useful part is not being halfway between disciplines. It is knowing which discipline needs to
                lead at a given moment — and staying close enough to the build that the original idea survives.
              </p>
            </div>

            <div className="db-capability-grid">
              {capabilities.map((item) => (
                <article key={item.n}>
                  <span>{item.n}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div>
                    {item.tags.map((tag) => <b key={tag}>{tag}</b>)}
                  </div>
                </article>
              ))}
            </div>

            <div className="db-stack">
              <span>WORKING STACK</span>
              <p>
                Figma · Adobe Creative Suite · React · Next.js · TypeScript · Supabase · Postgres · REST APIs ·
                GitHub · Vercel · OpenAI / Claude-assisted development · motion · video · AI image / video
              </p>
            </div>
          </div>
        </section>

        <section className="db-section db-about" id="about">
          <div className="db-shell">
            <div className="db-about-grid">
              <div className="db-about-sticky">
                <p className="db-section-index">03 / ABOUT</p>
                <h2>Creative range, grounded in execution.</h2>
                <p>
                  My background started in design and marketing. The work kept moving closer to product,
                  engineering, and AI until the most accurate description became Creative Technologist.
                </p>
                <p>
                  Hospitality is still a major advantage because it gives the technology a real operating context:
                  real properties, real campaigns, real guests, and opportunities to deploy work outside a demo
                  environment.
                </p>
                <div className="db-about-actions">
                  <a className="db-btn db-btn-dark" href="https://github.com/devon-gif" target="_blank" rel="noreferrer">
                    GITHUB <Code2 size={15} aria-hidden="true" />
                  </a>
                  <a className="db-btn db-btn-light" href="/contact">
                    CONTACT <Mail size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="db-timeline">
                {experience.map(([years, company, role, body]) => (
                  <article key={company}>
                    <span>{years}</span>
                    <div>
                      <p>{company}</p>
                      <h3>{role}</h3>
                      <p>{body}</p>
                    </div>
                  </article>
                ))}

                <div className="db-education">
                  <span>EDUCATION</span>
                  <p><strong>M.S. UX Design</strong> / Full Sail University</p>
                  <p><strong>B.S. UX/UI Design</strong> / Full Sail University</p>
                  <p><strong>Graphic Design Certificate</strong> / California Institute of the Arts</p>
                </div>
              </div>
            </div>

            <div className="db-faq">
              <div>
                <p className="db-section-index">FAQ / ROLE FIT</p>
                <h2>Questions I would ask if I were hiring me.</h2>
              </div>
              <div className="db-faq-list">
                {faqs.map((item, index) => (
                  <details key={item.q} open={index === 0}>
                    <summary>{item.q}<span>+</span></summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="db-footer">
          <div className="db-shell">
            <p className="db-eyebrow">OPEN TO THE RIGHT PROBLEM</p>
            <h2>Have something hard to explain, prototype, or make real?</h2>
            <div className="db-footer-actions">
              <a className="db-btn db-btn-accent" href="/contact">
                LET’S TALK <Mail size={15} aria-hidden="true" />
              </a>
              <a className="db-btn db-btn-ghost" href="#ask-devon">
                ASK MY AI <Sparkles size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="db-footer-meta">
              <span>DEVON ARCHER / CREATIVE TECHNOLOGIST</span>
              <span>ARCHER DESIGN © 2026</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
