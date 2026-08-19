import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Film,
  Layers3,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

const PAGE_TITLE = "Devon Archer — Creative Technologist";
const PAGE_DESCRIPTION =
  "Creative technology portfolio spanning generative motion, AI-assisted production systems, product prototyping, and hospitality creative.";

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

const motionWork = [
  {
    src: "/tcrm/videos/luxury-bedroom-sequence.mp4",
    title: "Luxury bedroom sequence",
    type: "Generative motion / hospitality",
  },
  {
    src: "/tcrm/videos/cinematic-timelapse-transition.mp4",
    title: "Cinematic timelapse",
    type: "AI transition study",
  },
  {
    src: "/tcrm/videos/couple-orbit-shot.mp4",
    title: "Orbit shot",
    type: "Camera movement / people",
  },
  {
    src: "/tcrm/videos/image-to-image-transition.mp4",
    title: "Image-to-image transition",
    type: "Continuity experiment",
  },
  {
    src: "/tcrm/videos/environment-transition.mp4",
    title: "Environment transition",
    type: "Scene transformation",
  },
];

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
];

const tools = [
  "Seedance",
  "Runway",
  "Flux",
  "Adobe After Effects",
  "Premiere Pro",
  "Photoshop",
  "Figma",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Canvas",
  "Supabase",
  "Vercel",
  "Git",
];

function LoopVideo({ src, label }: { src: string; label: string }) {
  return (
    <video
      src={src}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export default function DevonCreativeTechnologistPage() {
  return (
    <div className="devon-ct">
      <header className="ct-nav">
        <div className="ct-shell ct-nav-inner">
          <a href="#top" className="ct-brand" aria-label="Devon Archer, Creative Technologist">
            <span className="ct-brand-dot" aria-hidden="true" />
            Devon Archer / Creative Technologist
          </a>
          <nav className="ct-nav-links" aria-label="Portfolio sections">
            <a href="#motion">AI Motion</a>
            <a href="#systems">Systems</a>
            <a href="#work">Creative</a>
            <a href="mailto:heydevon@gmail.com">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="ct-hero">
          <div className="ct-grid-bg" aria-hidden="true" />
          <div className="ct-shell ct-hero-grid">
            <div>
              <p className="ct-kicker">AI × design × motion × production</p>
              <h1>
                Creative
                <em>technologist.</em>
              </h1>
              <p className="ct-hero-copy">
                I build creative systems where generative AI, design, motion, and production meet —
                from experimental image-to-video workflows to working internal tools with explicit
                guardrails, evaluation, and human review.
              </p>
              <div className="ct-actions">
                <a href="#motion" className="ct-btn">
                  See AI motion
                  <ArrowDownRight size={15} aria-hidden="true" />
                </a>
                <a href="https://checkray.app" target="_blank" rel="noreferrer" className="ct-btn-ghost">
                  Open CheckRay
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="ct-hero-media" aria-label="Selected generative motion work">
              <div className="ct-media-frame ct-media-a">
                <LoopVideo src="/tcrm/videos/luxury-hotel-entrance-night-concept.mp4" label="Luxury hotel entrance motion concept" />
                <span className="ct-media-label">AI motion R&amp;D</span>
              </div>
              <div className="ct-media-frame ct-media-b">
                <LoopVideo src="/tcrm/videos/courtyard-couple.mp4" label="Courtyard couple generative motion clip" />
                <span className="ct-media-label">Motion</span>
              </div>
              <div className="ct-media-frame ct-media-c">
                <LoopVideo src="/tcrm/videos/fall-to-winter-timelapse.mp4" label="Fall to winter generative transition" />
                <span className="ct-media-label">Transition study</span>
              </div>
            </div>
          </div>
        </section>

        <section className="ct-proof-strip" aria-label="Selected proof points">
          <div className="ct-shell ct-proof-grid">
            <div className="ct-proof-item">
              <div className="ct-proof-num">30+</div>
              <div className="ct-proof-label">AI motion experiments</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">14.8M+</div>
              <div className="ct-proof-label">Tracked campaign impressions</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">2</div>
              <div className="ct-proof-label">Working AI / systems products</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">Human</div>
              <div className="ct-proof-label">Final judgment stays in the loop</div>
            </div>
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">What I build</p>
                <h2>Creative craft with systems underneath it.</h2>
              </div>
              <p className="ct-section-intro">
                My background started in design, social creative, editing, and client delivery. The work has
                increasingly moved toward the layer underneath production: repeatable workflows, generative
                media experiments, internal tools, structured outputs, validation, and better ways for creative
                teams to move from an idea to something shippable.
              </p>
            </div>

            <div className="ct-project-grid">
              <article className="ct-card">
                <div className="ct-card-index">01 / GENERATIVE MEDIA</div>
                <h3>AI motion &amp; image-to-video workflows</h3>
                <p>
                  Shot-first experiments across camera movement, environmental motion, scene transitions,
                  continuity, and cinematic hospitality/lifestyle imagery.
                </p>
                <div className="ct-card-tag">Seedance · Runway · Flux · Adobe</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">02 / CREATIVE SYSTEMS</div>
                <h3>Tools that turn repetitive production into a system</h3>
                <p>
                  Structured creative roles, deterministic validation, approval states, regression tests,
                  and workflows designed around what a production team actually has to ship.
                </p>
                <div className="ct-card-tag">Next.js · TypeScript · Canvas · Git</div>
              </article>
              <article className="ct-card">
                <div className="ct-card-index">03 / AI RELIABILITY</div>
                <h3>Useful AI with explicit failure states</h3>
                <p>
                  I use models for ambiguity and interpretation, then add deterministic rules, structured
                  outputs, evals, and human review where the system needs guarantees.
                </p>
                <div className="ct-card-tag">Structured outputs · evals · guardrails</div>
              </article>
            </div>
          </div>
        </section>

        <section id="motion" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Generative motion R&amp;D</p>
                <h2>Start with the shot, not the model.</h2>
              </div>
              <p className="ct-section-intro">
                I use generative video as a production tool rather than a novelty. The process starts with
                the intended shot — movement, timing, continuity, what must remain visually consistent — then
                moves through model testing, variation, artifact review, selection, and traditional finishing.
              </p>
            </div>

            <div className="ct-motion-grid">
              {motionWork.map((item) => (
                <article className="ct-motion-tile" key={item.src}>
                  <LoopVideo src={item.src} label={item.title} />
                  <div className="ct-motion-meta">
                    <div className="ct-motion-title">{item.title}</div>
                    <div className="ct-motion-type">{item.type}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="systems" className="ct-section">
          <div className="ct-shell ct-case">
            <div className="ct-case-copy">
              <p className="ct-eyebrow">Case study / Auto Creative OS</p>
              <h3>From one approved campaign to a repeatable production system.</h3>
              <p>
                Auto Creative OS started with a manual production problem: one approved automotive campaign
                being rebuilt again and again across portrait, square, landscape, display, billboard, and
                micro-banner placements. Instead of treating the ad as one flat picture, I modeled the
                creative as semantic roles — vehicle, headline, offer, logo, legal, background — and built a
                Source → Map → Compose → Review → Export workflow around them.
              </p>
              <div className="ct-case-list">
                <div><b>01</b><span>Recomposition instead of blind resizing, so hierarchy and intent can survive format changes.</span></div>
                <div><b>02</b><span>Pass / Warning / Blocked validation for crop safety, legal readability, source fidelity, and brand constraints.</span></div>
                <div><b>03</b><span>Real PSD and rendering failures used to improve the abstraction instead of hiding symptoms with one-off fixes.</span></div>
                <div><b>04</b><span>AI can assist ambiguous interpretation; deterministic code protects guarantees; humans own final creative judgment.</span></div>
              </div>
              <div className="ct-tools">
                <span>Next.js</span><span>TypeScript</span><span>Canvas</span><span>PSD ingestion</span><span>validation</span><span>regression tests</span>
              </div>
            </div>

            <div className="ct-os" aria-label="Auto Creative OS workflow visualization">
              <div className="ct-os-window">
                <div className="ct-os-bar">
                  <span>AUTO CREATIVE OS / PRODUCTION PIPELINE</span>
                  <div className="ct-dots" aria-hidden="true"><span /><span /><span /></div>
                </div>
                <div className="ct-os-flow">
                  <div className="ct-stage">
                    <span className="ct-stage-code">01 SOURCE</span>
                    <div><div className="ct-stage-title">Ingest the approved master</div><div className="ct-stage-desc">PSD / raster / copy / brand data</div></div>
                    <span className="ct-status">Ready</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">02 MAP</span>
                    <div><div className="ct-stage-title">Assign semantic creative roles</div><div className="ct-stage-desc">vehicle · headline · offer · logo · legal</div></div>
                    <span className="ct-status">Mapped</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">03 COMPOSE</span>
                    <div><div className="ct-stage-title">Recompose for placement families</div><div className="ct-stage-desc">portrait · square · landscape · display</div></div>
                    <span className="ct-status">Built</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">04 REVIEW</span>
                    <div><div className="ct-stage-title">Run production constraints</div><div className="ct-stage-desc">crop · legal · fidelity · brand language</div></div>
                    <span className="ct-status warn">Warning</span>
                  </div>
                  <div className="ct-stage">
                    <span className="ct-stage-code">05 EXPORT</span>
                    <div><div className="ct-stage-title">Ship only what survives review</div><div className="ct-stage-desc">preview and export share one rendering path</div></div>
                    <span className="ct-status">Human OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Products + storytelling</p>
                <h2>Systems thinking is only useful if the output still has taste.</h2>
              </div>
              <p className="ct-section-intro">
                The technical layer matters, but so do pacing, visual hierarchy, narrative clarity, and the
                judgment to know what should stay human. These projects show both sides of that practice.
              </p>
            </div>

            <div className="ct-two-col">
              <article className="ct-live-card">
                <div>
                  <p className="ct-eyebrow"><ShieldCheck size={13} aria-hidden="true" /> Live AI product</p>
                  <h3>CheckRay</h3>
                  <p>
                    A personal risk assistant for suspicious messages, links, bills, job offers, rental
                    listings, and marketplace conversations. The model interprets context while deterministic
                    rules, structured output, and a shared policy layer make the result safer and more testable.
                  </p>
                  <div className="ct-checkray-flow" aria-label="CheckRay processing flow">
                    <span>Input</span><span>AI</span><span>Floors</span><span>Policy</span><span>Report</span>
                  </div>
                </div>
                <a href="https://checkray.app" target="_blank" rel="noreferrer" className="ct-btn">
                  Visit checkray.app
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </article>

              <article className="ct-trailer-card">
                <div className="ct-trailer-grid" aria-hidden="true" />
                <div>
                  <p className="ct-eyebrow"><Film size={13} aria-hidden="true" /> Narrative storytelling</p>
                  <h3>TV trailer / selected narrative edit</h3>
                  <p>
                    A dedicated trailer slot is reserved here for the final video asset. This section will
                    showcase editing, pacing, music, tone, and story — the craft layer behind the systems work.
                  </p>
                  <div className="ct-trailer-note">Trailer media to connect in the next pass</div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="work" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Archer Design / production proof</p>
                <h2>Real creative, shipped into real campaigns.</h2>
              </div>
              <p className="ct-section-intro">
                Archer Design is where the production side stays grounded: hospitality campaigns, short-form
                motion, social systems, F&amp;B, events, and property-level creative. Across tracked hospitality
                work, campaigns have generated 14.8M+ impressions and 565K+ direct engagements.
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

            <div className="ct-tools" aria-label="Selected tools">
              {tools.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-shell ct-case">
            <div className="ct-case-copy">
              <p className="ct-eyebrow"><Cpu size={13} aria-hidden="true" /> Working philosophy</p>
              <h3>Use AI for ambiguity. Use code for guarantees.</h3>
              <p>
                My strongest projects follow the same pattern: start from the actual workflow problem, model
                intent as structured data, prototype the smallest useful system, let edge cases break the
                assumptions, make failures visible, and keep a human decision point where judgment matters.
              </p>
              <div className="ct-case-list">
                <div><b>A</b><span>Creative intent becomes structured enough for a system to reason about.</span></div>
                <div><b>B</b><span>Models handle interpretation, variation, and ambiguous inputs.</span></div>
                <div><b>C</b><span>Deterministic rules protect known constraints and production guarantees.</span></div>
                <div><b>D</b><span>Evaluation and visible failure states are part of the product, not an afterthought.</span></div>
              </div>
            </div>
            <div className="ct-card" style={{ minHeight: 0 }}>
              <div className="ct-card-index">CURRENT FOCUS</div>
              <h3 style={{ marginTop: 120 }}>Generative media pipelines that creatives can actually use.</h3>
              <p>
                I am especially interested in AI filmmaking, repeatable shot workflows, model evaluation,
                creative automation, and tools that increase production capacity without removing taste or
                creative ownership from the people doing the work.
              </p>
              <div className="ct-card-tag"><Sparkles size={13} aria-hidden="true" /> Creative R&amp;D</div>
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
            Devon Archer · Utah / Remote · Creative technology, generative motion, design systems, AI product
            prototyping, and production workflows. This preview page is intentionally noindex while the
            project reel and final case-study media are being connected.
          </p>
        </div>
      </footer>
    </div>
  );
}
