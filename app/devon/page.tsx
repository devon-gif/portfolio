import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Mail, Play } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

const PAGE_TITLE = "Devon Archer — Design Engineer & Creative Technologist";
const PAGE_DESCRIPTION =
  "Design engineering and creative technology portfolio spanning AI products, web experiences, motion, production systems, and shipped creative.";

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

const work = [
  {
    src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png",
    alt: "Hotel Indigo Pittsburgh campaign work",
    label: "Hospitality campaign system",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png",
    alt: "Eliza Hot Metal Bistro live music campaign",
    label: "Event creative",
  },
  {
    src: "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png",
    alt: "Hampton Inn Johnstown local event campaign",
    label: "Local demand campaign",
  },
  {
    src: "/tcrm/images/minty-fresh-beverage-art-direction.png",
    alt: "Minty Fresh beverage art direction",
    label: "Art direction",
  },
  {
    src: "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png",
    alt: "Hotel Indigo Pittsburgh wedding room block campaign",
    label: "Group sales creative",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png",
    alt: "Eliza Hot Metal Bistro holiday billboard",
    label: "Campaign adaptation",
  },
];

const tools = [
  "Figma",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Supabase",
  "Vercel",
  "GitHub",
  "Claude",
  "ChatGPT / Codex",
  "Adobe Creative Suite",
  "After Effects",
  "Premiere Pro",
  "Runway",
  "Seedance",
  "Flux",
];

function TagList({ items }: { items: string[] }) {
  return <div className="rz-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

export default function DevonPortfolio() {
  return (
    <div className="rz-page" id="top">
      <aside className="rz-rail" aria-label="Portfolio navigation">
        <div className="rz-rail-strip"><span>Design — AI — Motion — Code — Systems</span></div>
        <div className="rz-rail-main">
          <a className="rz-monogram" href="#top" aria-label="Back to top">DA</a>
          <nav className="rz-rail-links">
            <a href="#work">Work</a>
            <a href="#motion">Motion</a>
            <a href="#creative">Creative</a>
          </nav>
          <span className="rz-rail-copy">© 2026 Devon Archer</span>
        </div>
      </aside>

      <div className="rz-main">
        <header className="rz-mobile-nav">
          <strong>Devon Archer</strong>
          <nav><a href="#work">Work</a><a href="mailto:heydevon@gmail.com">Contact</a></nav>
        </header>

        <main>
          <section className="rz-hero">
            <div className="rz-shell rz-hero-grid">
              <div>
                <p className="rz-kicker">Design engineer / creative technologist</p>
                <h1 className="rz-title">Design that<em>ships.</em></h1>
                <p className="rz-intro">
                  I start with the interface, stay with the system, and carry the work through implementation.
                  My work spans product UX, AI-assisted frontend development, brand systems, motion, and creative
                  production — from Figma and rough concepts to working experiences in production.
                </p>
                <div className="rz-actions">
                  <a className="rz-btn" href="#work">Selected work <ArrowDownRight size={15} /></a>
                  <a className="rz-btn-ghost" href="mailto:heydevon@gmail.com">Get in touch <Mail size={14} /></a>
                </div>
              </div>

              <div className="rz-hero-media" aria-label="Selected work montage">
                <a className="rz-frame rz-frame-a" href="https://baseten-inference-lab.vercel.app/" target="_blank" rel="noreferrer">
                  <Image src="/devon/projects/baseten-inference-lab.png" alt="Baseten Inference Lab concept" fill sizes="(max-width: 780px) 80vw, 44vw" priority />
                  <span className="rz-frame-tag">Baseten / design engineering</span>
                </a>
                <a className="rz-frame rz-frame-b" href="https://checkray.app" target="_blank" rel="noreferrer">
                  <Image src="/devon/projects/checkray-home.png" alt="CheckRay AI risk product" fill sizes="(max-width: 780px) 70vw, 36vw" priority />
                  <span className="rz-frame-tag">CheckRay / AI product</span>
                </a>
                <a className="rz-frame rz-frame-c" href="/devon/motion">
                  <video src="/tcrm/videos/fall-to-winter-timelapse.mp4" autoPlay muted loop playsInline preload="metadata" />
                  <span className="rz-frame-tag">Motion R&amp;D</span>
                </a>
              </div>
            </div>
          </section>

          <section className="rz-index" aria-label="Selected proof points">
            <div className="rz-shell rz-index-grid">
              <div className="rz-stat"><strong>14.8M+</strong><span>Tracked impressions</span></div>
              <div className="rz-stat"><strong>565K+</strong><span>Direct engagements</span></div>
              <div className="rz-stat"><strong>5+</strong><span>Years design + digital</span></div>
              <div className="rz-stat"><strong>Live</strong><span>Products, not mockups</span></div>
            </div>
          </section>

          <section className="rz-section" id="work">
            <div className="rz-shell">
              <div className="rz-section-head">
                <div>
                  <p className="rz-eyebrow">Selected work / design → code</p>
                  <h2>Working systems with visual judgment.</h2>
                </div>
                <p>
                  The strongest thread across my work is ownership. I define the experience, prototype it,
                  build enough of the interface to make the idea real, then keep refining the details that
                  separate “works” from “good.”
                </p>
              </div>

              <div className="rz-projects">
                <article className="rz-project">
                  <div className="rz-project-num">01 / AI INFRASTRUCTURE</div>
                  <div className="rz-project-copy">
                    <p className="rz-eyebrow">Independent Baseten concept</p>
                    <h3>Baseten Inference Lab</h3>
                    <p>
                      A developer-facing design-engineering concept that turns a model request into a visible
                      five-stage experience: Request → Prepare → Route → Compute → Respond. I designed the visual
                      system, product narrative, interaction states, and responsive experience, then shipped it on Vercel.
                    </p>
                    <TagList items={["Next.js", "TypeScript", "Responsive UI", "Technical storytelling", "Vercel"]} />
                    <a className="rz-project-link" href="https://baseten-inference-lab.vercel.app/" target="_blank" rel="noreferrer">View live build <ArrowUpRight size={14} /></a>
                  </div>
                  <a className="rz-project-media" href="https://baseten-inference-lab.vercel.app/" target="_blank" rel="noreferrer">
                    <Image src="/devon/projects/baseten-inference-lab.png" alt="Baseten Inference Lab homepage" fill sizes="(max-width: 1100px) 78vw, 44vw" />
                  </a>
                </article>

                <article className="rz-project">
                  <div className="rz-project-num">02 / TRUST UX</div>
                  <div className="rz-project-copy">
                    <p className="rz-eyebrow">Live AI product</p>
                    <h3>CheckRay</h3>
                    <p>
                      An AI-assisted risk product for suspicious texts, links, bills, jobs, and emails. The UX
                      turns probabilistic model interpretation, deterministic guardrails, confidence, and safer
                      next steps into something clear enough to use under uncertainty.
                    </p>
                    <TagList items={["AI product", "UX/UI", "Next.js", "Supabase", "Evaluation"]} />
                    <a className="rz-project-link" href="https://checkray.app" target="_blank" rel="noreferrer">Open CheckRay <ArrowUpRight size={14} /></a>
                  </div>
                  <a className="rz-project-media" href="https://checkray.app" target="_blank" rel="noreferrer">
                    <Image src="/devon/projects/checkray-home.png" alt="CheckRay homepage" fill sizes="(max-width: 1100px) 78vw, 44vw" />
                  </a>
                </article>

                <article className="rz-project">
                  <div className="rz-project-num">03 / CREATIVE SYSTEMS</div>
                  <div className="rz-project-copy">
                    <p className="rz-eyebrow">Production workflow prototype</p>
                    <h3>Auto Creative OS</h3>
                    <p>
                      A system for turning one approved campaign into repeatable creative across placement
                      families without flattening hierarchy. The workflow models semantic creative roles,
                      validation states, review, and export instead of relying on blind resizing.
                    </p>
                    <TagList items={["Next.js", "TypeScript", "Canvas", "PSD ingestion", "42 tests"]} />
                    <a className="rz-project-link" href="/devon/auto">Open system <ArrowUpRight size={14} /></a>
                  </div>
                  <a className="rz-project-media" href="/devon/auto">
                    <div className="rz-system-visual" aria-label="Auto Creative OS workflow">
                      <div className="rz-system-bar"><span>Auto Creative OS / production pipeline</span><span className="rz-dots"><i /><i /><i /></span></div>
                      <div className="rz-system-row"><b>01 SOURCE</b><span>Ingest approved master</span><em>Ready</em></div>
                      <div className="rz-system-row"><b>02 MAP</b><span>Assign semantic roles</span><em>Mapped</em></div>
                      <div className="rz-system-row"><b>03 COMPOSE</b><span>Recompose placements</span><em>Built</em></div>
                      <div className="rz-system-row"><b>04 REVIEW</b><span>Run production constraints</span><em>Warning</em></div>
                      <div className="rz-system-row"><b>05 EXPORT</b><span>Ship reviewed output</span><em>Human OK</em></div>
                    </div>
                  </a>
                </article>

                <article className="rz-project">
                  <div className="rz-project-num">04 / AI ANALYSIS</div>
                  <div className="rz-project-copy">
                    <p className="rz-eyebrow">Working web analysis tool</p>
                    <h3>Hotel Creative Scorecard</h3>
                    <p>
                      A structured website-audit flow that gathers bounded evidence from public pages, runs AI
                      analysis, returns a strict scorecard, and keeps confidence and fallback states explicit
                      when the available evidence is incomplete.
                    </p>
                    <TagList items={["AI analysis", "Structured output", "UX", "Web tooling", "Human review"]} />
                    <a className="rz-project-link" href="/hotel-creative-scorecard">Open scorecard <ArrowUpRight size={14} /></a>
                  </div>
                  <a className="rz-project-media" href="/hotel-creative-scorecard">
                    <div className="rz-system-visual">
                      <div className="rz-system-bar"><span>Creative scorecard / evidence flow</span><span className="rz-dots"><i /><i /><i /></span></div>
                      <div className="rz-system-row"><b>01 FETCH</b><span>Public website evidence</span><em>Input</em></div>
                      <div className="rz-system-row"><b>02 EXTRACT</b><span>Usable text + signals</span><em>Bounded</em></div>
                      <div className="rz-system-row"><b>03 ANALYZE</b><span>AI assessment</span><em>Model</em></div>
                      <div className="rz-system-row"><b>04 SCORE</b><span>Structured JSON result</span><em>Schema</em></div>
                      <div className="rz-system-row"><b>05 REVIEW</b><span>Confidence + next steps</span><em>Human</em></div>
                    </div>
                  </a>
                </article>
              </div>
            </div>
          </section>

          <section className="rz-section rz-motion" id="motion">
            <div className="rz-shell">
              <div className="rz-section-head">
                <div>
                  <p className="rz-eyebrow">Motion / generative R&amp;D</p>
                  <h2>Start with the shot, not the model.</h2>
                </div>
                <p>
                  I use generative video as a production tool: define the intended shot, test movement and
                  continuity, inspect artifacts, select the strongest output, then finish with traditional
                  editing and design tools.
                </p>
              </div>
              <div className="rz-motion-grid">
                <a className="rz-video large" href="/devon/motion">
                  <video src="/tcrm/videos/luxury-hotel-entrance-night-concept.mp4" autoPlay muted loop playsInline preload="metadata" />
                  <span className="rz-video-label"><Play size={11} /> AI motion R&amp;D</span>
                </a>
                <div className="rz-motion-stack">
                  <a className="rz-video" href="/devon/motion"><video src="/tcrm/videos/courtyard-couple.mp4" autoPlay muted loop playsInline preload="metadata" /><span className="rz-video-label">Character + environment</span></a>
                  <a className="rz-video" href="/devon/motion"><video src="/tcrm/videos/fall-to-winter-timelapse.mp4" autoPlay muted loop playsInline preload="metadata" /><span className="rz-video-label">Transition study</span></a>
                </div>
              </div>
            </div>
          </section>

          <section className="rz-section" id="creative">
            <div className="rz-shell">
              <div className="rz-section-head">
                <div>
                  <p className="rz-eyebrow">Creative production</p>
                  <h2>Systems underneath. Taste on the surface.</h2>
                </div>
                <p>
                  My technical work grew out of real production: brand systems, hospitality campaigns, social,
                  motion, events, F&amp;B, and client delivery. The point of the system is still the output.
                </p>
              </div>
              <div className="rz-creative-grid">
                {work.map((item) => (
                  <div className="rz-work" key={item.src}>
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 780px) 100vw, 50vw" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="rz-tools">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            </div>
          </section>

          <section className="rz-contact">
            <div className="rz-shell rz-contact-grid">
              <div>
                <p className="rz-eyebrow">Available for the right design + technology team</p>
                <h2>Make it real.</h2>
                <p>
                  I am interested in design engineering, creative technology, AI product design, and roles where
                  the person shaping the experience can stay close enough to the implementation to improve what ships.
                </p>
              </div>
              <a href="mailto:heydevon@gmail.com">heydevon@gmail.com <ArrowUpRight size={15} /></a>
            </div>
          </section>
        </main>

        <footer className="rz-footer">
          <div className="rz-shell rz-footer-inner">
            <span>Devon Archer / Design Engineer + Creative Technologist</span>
            <span>Salt Lake City, Utah / Remote</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
