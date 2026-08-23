import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Film,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { DevonMotionSlideshow } from "./components/DevonMotionSlideshow";

const PAGE_TITLE = "Devon Archer — Design Technologist";
const PAGE_DESCRIPTION =
  "Design technologist portfolio spanning AI prototyping, product UI, frontend systems, internal tools, design-to-code workflows, and shipped creative.";

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

const archerWork = [
  {
    src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png",
    alt: "Hotel Indigo Pittsburgh room campaign",
    label: "Hospitality campaign system",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png",
    alt: "Eliza Hot Metal Bistro live music series",
    label: "Event creative",
  },
  {
    src: "/tcrm/images/hampton-inn-johnstown-flood-city-music-festival.png",
    alt: "Hampton Inn Johnstown local event campaign",
    label: "Local-demand campaign",
  },
  {
    src: "/tcrm/images/minty-fresh-beverage-art-direction.png",
    alt: "Minty Fresh beverage art direction",
    label: "Art direction / experiment",
  },
  {
    src: "/tcrm/images/hotel-indigo-pittsburgh-wedding-room-block.png",
    alt: "Hotel Indigo Pittsburgh wedding room block campaign",
    label: "Wedding / group-sales creative",
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
  "JavaScript",
  "OpenAI APIs",
  "Supabase",
  "Vercel",
  "Git",
  "Canvas",
  "Photoshop",
  "After Effects",
  "Premiere Pro",
  "Runway",
  "Seedance",
  "Flux",
];

function YouTubeCard({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <article className="ct-story-card">
      <div className="ct-youtube-frame">
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <div className="ct-story-body">
        <p className="ct-eyebrow">
          <Film size={13} aria-hidden="true" /> {eyebrow}
        </p>
        <h3>{title}</h3>
        <p>{description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noreferrer"
          className="ct-story-link"
        >
          Watch on YouTube <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function DevonDesignTechnologistPage() {
  return (
    <div className="devon-ct">
      <header className="ct-nav">
        <div className="ct-shell ct-nav-inner">
          <a href="#top" className="ct-brand" aria-label="Devon Archer, Design Technologist">
            <span className="ct-brand-dot" aria-hidden="true" />
            Devon Archer / Design Technologist
          </a>
          <nav className="ct-nav-links" aria-label="Portfolio sections">
            <a href="#systems">Systems</a>
            <a href="#products">AI Products</a>
            <a href="#bridge">Design ↔ Code</a>
            <a href="#motion">Motion</a>
            <a href="#work">Craft</a>
            <a href="mailto:heydevon@gmail.com">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="ct-hero">
          <div className="ct-grid-bg" aria-hidden="true" />
          <div className="ct-shell ct-hero-grid">
            <div>
              <p className="ct-kicker">Product design × AI prototyping × frontend systems</p>
              <h1>
                Design
                <em>technologist.</em>
              </h1>
              <p className="ct-hero-copy">
                I work between design and implementation — turning product ideas, Figma direction, AI
                workflows, and production problems into working prototypes, reusable interface patterns,
                internal tools, and shipped experiences. My background is rooted in visual design and creative
                production; the work now extends through Next.js, TypeScript, APIs, evaluation, and AI-assisted
                development.
              </p>
              <div className="ct-actions">
                <a href="#systems" className="ct-btn">
                  See product systems
                  <ArrowDownRight size={15} aria-hidden="true" />
                </a>
                <a href="https://checkray.app" target="_blank" rel="noreferrer" className="ct-btn-ghost">
                  Open CheckRay
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="ct-hero-media" aria-label="Design-to-code workflow">
              <div className="ct-os">
                <div className="ct-os-window">
                  <div className="ct-os-bar">
                    <span>DESIGN TECHNOLOGY / WORKFLOW</span>
                    <div className="ct-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className="ct-os-flow">
                    <div className="ct-stage">
                      <span className="ct-stage-code">01 DESIGN</span>
                      <div>
                        <div className="ct-stage-title">Define hierarchy, interaction, and states</div>
                        <div className="ct-stage-desc">visual direction · flows · edge cases</div>
                      </div>
                      <span className="ct-status">Figma</span>
                    </div>
                    <div className="ct-stage">
                      <span className="ct-stage-code">02 PROTOTYPE</span>
                      <div>
                        <div className="ct-stage-title">Turn concepts into working UI</div>
                        <div className="ct-stage-desc">responsive behavior · real data · APIs</div>
                      </div>
                      <span className="ct-status">Build</span>
                    </div>
                    <div className="ct-stage">
                      <span className="ct-stage-code">03 SYSTEMIZE</span>
                      <div>
                        <div className="ct-stage-title">Find the reusable pattern</div>
                        <div className="ct-stage-desc">shared states · conventions · components</div>
                      </div>
                      <span className="ct-status">System</span>
                    </div>
                    <div className="ct-stage">
                      <span className="ct-stage-code">04 EVALUATE</span>
                      <div>
                        <div className="ct-stage-title">Let edge cases challenge the abstraction</div>
                        <div className="ct-stage-desc">validation · failure states · regression tests</div>
                      </div>
                      <span className="ct-status warn">Test</span>
                    </div>
                    <div className="ct-stage">
                      <span className="ct-stage-code">05 SHIP</span>
                      <div>
                        <div className="ct-stage-title">Make the implementation hold up</div>
                        <div className="ct-stage-desc">production behavior · iteration · human judgment</div>
                      </div>
                      <span className="ct-status">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ct-proof-strip" aria-label="Selected proof points">
          <div className="ct-shell ct-proof-grid">
            <div className="ct-proof-item">
              <div className="ct-proof-num">Figma → UI</div>
              <div className="ct-proof-label">Design through implementation</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">3</div>
              <div className="ct-proof-label">Working AI / systems builds</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">42</div>
              <div className="ct-proof-label">Auto Creative OS regression tests</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">14.8M+</div>
              <div className="ct-proof-label">Tracked campaign impressions</div>
            </div>
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">What I build</p>
                <h2>Design decisions that survive contact with code.</h2>
              </div>
              <p className="ct-section-intro">
                I am most useful in the space between a polished concept and a production system: making the
                interaction tangible, understanding what breaks, turning repeated decisions into reusable
                patterns, and using AI where it makes the workflow faster or the product more capable.
              </p>
            </div>

            <div className="ct-project-grid">
              <article className="ct-card">
                <div className="ct-card-index">01 / DESIGN ↔ CODE</div>
                <h3>Product interfaces that survive implementation.</h3>
                <p>
                  Explore hierarchy and interaction in design tools, then validate the responsive states,
                  behavior, constraints, and details in frontend code.
                </p>
                <div className="ct-card-tag">Figma · Next.js · TypeScript</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">02 / AI PROTOTYPING</div>
                <h3>Working AI flows, not static concepts.</h3>
                <p>
                  Connect models, APIs, structured outputs, interface states, and evaluation into prototypes
                  that expose what the experience can actually do.
                </p>
                <div className="ct-card-tag">OpenAI APIs · structured outputs · evals</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">03 / SYSTEMS & TOOLING</div>
                <h3>Reusable patterns instead of one-off fixes.</h3>
                <p>
                  Build conventions, validation, approval states, shared behaviors, and repeatable workflows
                  around the decisions a team has to make more than once.
                </p>
                <div className="ct-card-tag">Components · states · automation · Git</div>
              </article>
            </div>
          </div>
        </section>

        <section id="systems" className="ct-section">
          <div className="ct-shell ct-case">
            <div className="ct-case-copy">
              <p className="ct-eyebrow">Case study / system design + frontend</p>
              <h3>Turn one approved campaign into a repeatable production system.</h3>
              <p>
                Auto Creative OS is a self-initiated prototype built around a real production problem: one
                approved automotive campaign being rebuilt across portrait, square, landscape, display,
                billboard, and micro-banner placements. I modeled the creative as semantic roles — vehicle,
                headline, offer, logo, legal, background — then designed and built the interface and rendering
                workflow around Source → Map → Compose → Review → Export.
              </p>
              <div className="ct-case-list">
                <div>
                  <b>01</b>
                  <span>Recomposition instead of blind resizing, so hierarchy and intent survive format changes.</span>
                </div>
                <div>
                  <b>02</b>
                  <span>Pass / Warning / Blocked states make crop safety, legal readability, fidelity, and brand constraints visible in the UI.</span>
                </div>
                <div>
                  <b>03</b>
                  <span>Real PSD and rendering failures were used to improve the underlying abstraction instead of accumulating local fixes.</span>
                </div>
                <div>
                  <b>04</b>
                  <span>Preview and export share the same rendering path, so the reviewed experience matches what actually ships.</span>
                </div>
              </div>
              <div className="ct-tools">
                <span>Next.js</span>
                <span>TypeScript</span>
                <span>Canvas</span>
                <span>PSD ingestion</span>
                <span>validation</span>
                <span>42 tests</span>
              </div>
              <div className="ct-case-actions">
                <a
                  href="https://github.com/devon-gif/portfolio/tree/auto-creative-os/app/auto"
                  target="_blank"
                  rel="noreferrer"
                  className="ct-btn"
                >
                  View Auto Creative OS source
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="ct-os" aria-label="Auto Creative OS workflow visualization">
              <div className="ct-os-window">
                <div className="ct-os-bar">
                  <span>AUTO CREATIVE OS / PRODUCTION PIPELINE</span>
                  <div className="ct-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="ct-os-flow">
                  <div className="ct-stage">
                    <span className="ct-stage-code">01 SOURCE</span>
                    <div>
                      <div className="ct-stage-title">Ingest the approved master</div>
                      <div className="ct-stage-desc">PSD / raster / copy / brand data</div>
                    </div>
                    <span className="ct-status">Ready</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">02 MAP</span>
                    <div>
                      <div className="ct-stage-title">Assign semantic creative roles</div>
                      <div className="ct-stage-desc">vehicle · headline · offer · logo · legal</div>
                    </div>
                    <span className="ct-status">Mapped</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">03 COMPOSE</span>
                    <div>
                      <div className="ct-stage-title">Recompose for placement families</div>
                      <div className="ct-stage-desc">portrait · square · landscape · display</div>
                    </div>
                    <span className="ct-status">Built</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">04 REVIEW</span>
                    <div>
                      <div className="ct-stage-title">Run production constraints</div>
                      <div className="ct-stage-desc">crop · legal · fidelity · brand language</div>
                    </div>
                    <span className="ct-status warn">Warning</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">05 EXPORT</span>
                    <div>
                      <div className="ct-stage-title">Ship only what survives review</div>
                      <div className="ct-stage-desc">preview and export share one rendering path</div>
                    </div>
                    <span className="ct-status">Human OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">AI products in practice</p>
                <h2>Prototype the behavior, not just the screen.</h2>
              </div>
              <p className="ct-section-intro">
                AI product design is interaction design plus uncertainty. These builds connect the interface to
                real model behavior, structured inputs and outputs, confidence, deterministic rules, fallback
                states, and evaluation so a concept can be judged as a working experience.
              </p>
            </div>

            <div className="ct-ai-grid">
              <article className="ct-ai-card">
                <div>
                  <p className="ct-eyebrow">
                    <ShieldCheck size={13} aria-hidden="true" /> Live AI product
                  </p>
                  <h3>CheckRay</h3>
                  <p>
                    A personal risk assistant for suspicious messages, links, bills, job offers, rental
                    listings, and marketplace conversations. The product has to make a probabilistic model feel
                    understandable: context comes in, AI interprets it, deterministic risk floors and a shared
                    policy layer constrain the result, and the UI returns a plain-language report with visible
                    reasoning and safer next steps.
                  </p>
                  <div className="ct-ai-flow" aria-label="CheckRay processing flow">
                    <span>Input</span>
                    <span>AI interpretation</span>
                    <span>Risk floors</span>
                    <span>Policy</span>
                    <span>Report</span>
                  </div>
                </div>
                <a href="https://checkray.app" target="_blank" rel="noreferrer" className="ct-btn">
                  Visit checkray.app
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </article>

              <article className="ct-ai-card">
                <div>
                  <p className="ct-eyebrow">
                    <Cpu size={13} aria-hidden="true" /> AI website analysis
                  </p>
                  <h3>Hotel Creative Scorecard</h3>
                  <p>
                    A working website-audit flow that fetches public pages, extracts usable evidence, sends a
                    bounded evidence set through the OpenAI Responses API, and returns a strict structured
                    scorecard. The interface keeps confidence and fallback states explicit when a site blocks
                    scanning or the evidence is incomplete.
                  </p>
                  <div className="ct-ai-flow" aria-label="Hotel Creative Scorecard processing flow">
                    <span>Website</span>
                    <span>Extraction</span>
                    <span>AI analysis</span>
                    <span>JSON schema</span>
                    <span>Scorecard</span>
                  </div>
                </div>
                <a href="/hotel-creative-scorecard" target="_blank" rel="noreferrer" className="ct-btn-ghost">
                  Open the live scorecard
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="bridge" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Design ↔ engineering</p>
                <h2>The mockup is not the finish line.</h2>
              </div>
              <p className="ct-section-intro">
                A design system only matters if the decisions hold up in implementation. I use code as a design
                material: responsive behavior, component states, data constraints, failure cases, and technical
                limitations all become inputs to the experience instead of cleanup after handoff.
              </p>
            </div>

            <div className="ct-project-grid">
              <article className="ct-card">
                <div className="ct-card-index">01 / FIGMA → FRONTEND</div>
                <h3>Prototype the actual interaction.</h3>
                <p>
                  Use Figma for interface direction and hierarchy, then Next.js and TypeScript to test the
                  behavior, responsive states, real content, and details a static frame cannot answer.
                </p>
                <div className="ct-card-tag">Figma · Next.js · TypeScript</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">02 / PATTERNS</div>
                <h3>Look for the reusable rule.</h3>
                <p>
                  Repeated controls, states, layouts, and workflow decisions should become shared patterns.
                  When an edge case breaks the pattern, improve the abstraction instead of patching one screen.
                </p>
                <div className="ct-card-tag">Components · interaction states · conventions</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">03 / AI WORKFLOWS</div>
                <h3>Use AI where it improves the product.</h3>
                <p>
                  Models are useful for interpretation, exploration, and automation. Structured outputs,
                  deterministic checks, and explicit failure states keep the experience legible and testable.
                </p>
                <div className="ct-card-tag">APIs · evals · guardrails · tooling</div>
              </article>
            </div>

            <div className="ct-tools" aria-label="Selected tools">
              {tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="motion" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Generative R&D / motion systems</p>
                <h2>Emerging tools are useful when they improve the work.</h2>
              </div>
              <p className="ct-section-intro">
                Generative video is one part of the toolkit. I define the intended shot, test motion and
                continuity, compare outputs, inspect artifacts, select the strongest result, and finish with
                traditional editing and design tools. The focus is repeatability and creative control, not a
                model demo for its own sake.
              </p>
            </div>

            <DevonMotionSlideshow />
          </div>
        </section>

        <section id="work" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Visual craft / production proof</p>
                <h2>Systems thinking still needs taste.</h2>
              </div>
              <p className="ct-section-intro">
                My design background is the foundation underneath the technical work: hierarchy, typography,
                composition, brand consistency, motion, campaign systems, and the judgment to know when a
                technically possible idea is not a good creative idea. Across tracked hospitality work,
                campaigns have generated 14.8M+ impressions and 565K+ direct engagements.
              </p>
            </div>

            <div className="ct-work-grid">
              {archerWork.map((item) => (
                <article className="ct-work-item" key={item.src}>
                  <Image src={item.src} alt={item.alt} fill sizes="(min-width: 980px) 25vw, 50vw" />
                  <div className="ct-work-label">{item.label}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Narrative + commercial editing</p>
                <h2>The output still has to make somebody feel something.</h2>
              </div>
              <p className="ct-section-intro">
                Creative technology expands what can be made; it does not replace taste. These edits show the
                other side of the work: pacing, music, escalation, brand tone, visual selection, and shaping raw
                material into an intentional story.
              </p>
            </div>

            <div className="ct-story-grid">
              <YouTubeCard
                id="I2uEgWTkNSg"
                eyebrow="Narrative storytelling"
                title="TV trailer / selected narrative edit"
                description="A narrative trailer built around pacing, music, tension, tone, and escalation — evidence of the filmmaking instincts behind the systems and generative-media work."
              />
              <YouTubeCard
                id="7gIJCHNmFts"
                eyebrow="Commercial work"
                title="Commercial / branded edit"
                description="Commercial editing and visual storytelling built to communicate a message quickly, control pacing, and make a polished branded piece feel intentional from the first frame to the last."
              />
              <YouTubeCard
                id="q-FAWqOdBFM"
                eyebrow="Additional branded video"
                title="Selected video work / TCRM portfolio"
                description="Additional branded video work from the Archer Design portfolio, showing range across commercial storytelling and motion-led editing."
              />
              <YouTubeCard
                id="-y1ZDJq33HY"
                eyebrow="Additional branded video"
                title="Selected video work / TCRM portfolio"
                description="Additional video work expanding the reel beyond hospitality motion into broader branded storytelling and campaign editing."
              />
            </div>
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-shell ct-case">
            <div className="ct-case-copy">
              <p className="ct-eyebrow">
                <Cpu size={13} aria-hidden="true" /> Working philosophy
              </p>
              <h3>Use design for intent. Use code to make it hold.</h3>
              <p>
                My strongest projects start from the actual workflow problem, make the interaction and state
                model explicit, prototype the smallest useful system, let edge cases challenge the assumptions,
                and turn repeated decisions into reusable rules. AI handles ambiguity where it is useful; code
                protects the things the experience needs to guarantee.
              </p>
              <div className="ct-case-list">
                <div>
                  <b>A</b>
                  <span>Start with the user, workflow, hierarchy, and the decision the interface needs to support.</span>
                </div>
                <div>
                  <b>B</b>
                  <span>Make interaction states and system behavior explicit instead of leaving them implied in a mockup.</span>
                </div>
                <div>
                  <b>C</b>
                  <span>Encode repeated decisions and known constraints as reusable patterns and rules.</span>
                </div>
                <div>
                  <b>D</b>
                  <span>Treat evaluation, edge cases, accessibility, and visible failure states as part of the design.</span>
                </div>
              </div>
            </div>
            <div className="ct-card" style={{ minHeight: 0 }}>
              <div className="ct-card-index">CURRENT FOCUS</div>
              <h3 style={{ marginTop: 120 }}>AI-native interfaces and design systems that stay useful in code.</h3>
              <p>
                I am especially interested in AI-assisted prototyping, reusable UI conventions, agent-driven
                experiences, and practical ways to reduce drift between design intent and production
                implementation.
              </p>
              <div className="ct-card-tag">
                <Sparkles size={13} aria-hidden="true" /> Product / design systems R&amp;D
              </div>
              <div className="ct-rd-note">
                Current R&amp;D direction: AI prototyping workflows, agentic UI patterns, component conventions,
                and practical design ↔ engineering convergence.
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ct-footer">
        <div className="ct-shell ct-footer-grid">
          <div>
            <p className="ct-eyebrow">Contact</p>
            <h2>Build something worth shipping.</h2>
            <div className="ct-actions">
              <a href="mailto:heydevon@gmail.com" className="ct-btn">
                <Mail size={14} aria-hidden="true" />
                heydevon@gmail.com
              </a>
              <a href="https://www.archerdesign.shop" target="_blank" rel="noreferrer" className="ct-btn-ghost">
                Archer Design <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="ct-footer-note">
            Devon Archer · Utah / Remote · Design technology, AI product prototyping, frontend systems,
            interaction design, generative media, and production workflows. This page is intentionally noindex
            while the portfolio is being refined for design-technology applications.
          </p>
        </div>
      </footer>
    </div>
  );
}
