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

const PAGE_TITLE = "Devon Archer — Creative Technologist";
const PAGE_DESCRIPTION =
  "Creative technology portfolio spanning generative motion, AI-assisted production systems, product prototyping, filmmaking, and shipped creative.";

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
  "OpenAI APIs",
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
        <p className="ct-eyebrow"><Film size={13} aria-hidden="true" /> {eyebrow}</p>
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
            <a href="#motion">Motion</a>
            <a href="#systems">Systems</a>
            <a href="#products">AI Products</a>
            <a href="#story">Film</a>
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
                from image-to-video workflows and narrative editing to working AI products and production
                tools with explicit guardrails, evaluation, and human review.
              </p>
              <div className="ct-actions">
                <a href="#motion" className="ct-btn">
                  See motion work
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
              <div className="ct-proof-num">32</div>
              <div className="ct-proof-label">Motion / generative studies</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">14.8M+</div>
              <div className="ct-proof-label">Tracked campaign impressions</div>
            </div>
            <div className="ct-proof-item">
              <div className="ct-proof-num">3</div>
              <div className="ct-proof-label">Working AI / systems builds</div>
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
                  continuity, people, food, hospitality, and cinematic lifestyle imagery.
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
                <p className="ct-eyebrow">Motion library / generative R&amp;D</p>
                <h2>Start with the shot, not the model.</h2>
              </div>
              <p className="ct-section-intro">
                The full motion library is here, not a five-clip highlight reel. I use generative video as a
                production tool: define the intended shot, test motion and continuity, compare outputs, inspect
                artifacts, select the strongest result, then finish with traditional editing and design tools.
              </p>
            </div>

            <DevonMotionSlideshow />
          </div>
        </section>

        <section id="systems" className="ct-section">
          <div className="ct-shell ct-case">
            <div className="ct-case-copy">
              <p className="ct-eyebrow">Case study / Auto Creative OS</p>
              <h3>From one approved campaign to a repeatable production system.</h3>
              <p>
                Auto Creative OS is a self-initiated prototype built around a real production problem: one
                approved automotive campaign being rebuilt across portrait, square, landscape, display,
                billboard, and micro-banner placements. Instead of treating the ad as one flat image, I modeled
                the creative as semantic roles — vehicle, headline, offer, logo, legal, background — and built a
                Source → Map → Compose → Review → Export workflow around them.
              </p>
              <div className="ct-case-list">
                <div><b>01</b><span>Recomposition instead of blind resizing, so hierarchy and intent can survive format changes.</span></div>
                <div><b>02</b><span>Pass / Warning / Blocked validation for crop safety, legal readability, source fidelity, and brand constraints.</span></div>
                <div><b>03</b><span>Real PSD and rendering failures used to improve the abstraction instead of hiding symptoms with one-off fixes.</span></div>
                <div><b>04</b><span>Preview and export share the same rendering path; a reviewed artifact should match what actually ships.</span></div>
              </div>
              <div className="ct-tools">
                <span>Next.js</span><span>TypeScript</span><span>Canvas</span><span>PSD ingestion</span><span>validation</span><span>42 tests</span>
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

        <section id="products" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">AI products in practice</p>
                <h2>Not just prompts. Working systems around the model.</h2>
              </div>
              <p className="ct-section-intro">
                The common thread is turning probabilistic AI behavior into a product somebody can actually
                operate: structured input, constrained output, visible confidence, deterministic rules, and a
                clear fallback when the model or source evidence is not good enough.
              </p>
            </div>

            <div className="ct-ai-grid">
              <article className="ct-ai-card">
                <div>
                  <p className="ct-eyebrow"><ShieldCheck size={13} aria-hidden="true" /> Live AI product</p>
                  <h3>CheckRay</h3>
                  <p>
                    A personal risk assistant for suspicious messages, links, bills, job offers, rental
                    listings, and marketplace conversations. The model interprets context while structured
                    outputs, deterministic risk floors, evaluation cases, and a shared policy layer make the
                    result safer and more testable.
                  </p>
                  <div className="ct-ai-flow" aria-label="CheckRay processing flow">
                    <span>Input</span><span>AI interpretation</span><span>Risk floors</span><span>Policy</span><span>Report</span>
                  </div>
                </div>
                <a href="https://checkray.app" target="_blank" rel="noreferrer" className="ct-btn">
                  Visit checkray.app
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </article>

              <article className="ct-ai-card">
                <div>
                  <p className="ct-eyebrow"><Cpu size={13} aria-hidden="true" /> AI website analysis</p>
                  <h3>Hotel Creative Scorecard</h3>
                  <p>
                    A working hospitality website-audit flow that fetches public pages, extracts usable text
                    and social signals, sends a bounded evidence set through the OpenAI Responses API, and
                    returns a strict structured scorecard. Confidence and fallback states stay explicit when a
                    site blocks scanning or the evidence is incomplete.
                  </p>
                  <div className="ct-ai-flow" aria-label="Hotel Creative Scorecard processing flow">
                    <span>Website</span><span>Extraction</span><span>AI analysis</span><span>JSON schema</span><span>Scorecard</span>
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

        <section id="story" className="ct-section">
          <div className="ct-shell">
            <div className="ct-section-head">
              <div>
                <p className="ct-eyebrow">Narrative + commercial editing</p>
                <h2>The output still has to make somebody feel something.</h2>
              </div>
              <p className="ct-section-intro">
                Creative technology is useful because it expands what can be made, not because it replaces
                taste. These edits show the other side of the work: pacing, music, escalation, brand tone,
                visual selection, and shaping raw material into a story.
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
                Archer Design keeps the technical work grounded in production reality: hospitality campaigns,
                short-form motion, social systems, F&amp;B, events, weddings, and property-level creative. Across
                tracked hospitality work, campaigns have generated 14.8M+ impressions and 565K+ direct engagements.
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
              <div className="ct-rd-note">
                Current R&amp;D direction: deeper node-based generative workflows, model conditioning, and more
                repeatable character / shot consistency across multi-shot sequences.
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
            Devon Archer · Utah / Remote · Creative technology, generative motion, design systems, AI product
            prototyping, filmmaking, and production workflows. This page is intentionally noindex while the
            portfolio is being refined for creative-technology applications.
          </p>
        </div>
      </footer>
    </div>
  );
}
