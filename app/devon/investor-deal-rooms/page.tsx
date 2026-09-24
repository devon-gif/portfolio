import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  FileCheck2,
  FileText,
  Film,
  FolderLock,
  Globe2,
  Layers3,
  Mail,
  Presentation,
  Rocket,
  Search,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { InvestorImageAtlas, type InvestorAtlasTile } from "../components/InvestorImageAtlas";

const PAGE_TITLE = "Investor Rooms, Pitch Decks & Diligence Systems — Devon Archer";
const PAGE_DESCRIPTION =
  "Investor-facing design and systems for founders, developers, hospitality projects, and real-estate ventures: pitch decks, investor rooms, diligence dashboards, proof registers, research, financial visuals, project websites, and ongoing creative support.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/devon/investor-deal-rooms") },
  robots: { index: true, follow: true },
};

const capabilities = [
  { icon: Presentation, title: "Investor pitch decks", body: "Narrative, structure, slide design, financial storytelling, and presentation polish." },
  { icon: FolderLock, title: "Investor room / data room design", body: "Secure, organized, investor-friendly systems for documents, proof, access, and updates." },
  { icon: FileCheck2, title: "Diligence dashboards", body: "Clear views of what is complete, missing, validated, pending, or ready for review." },
  { icon: FileText, title: "Proof registers & document organization", body: "Structure evidence, source claims, organize exhibits, and reduce diligence friction." },
  { icon: Search, title: "Market research summaries", body: "Turn dense research into concise, credible, visual investor-facing insights." },
  { icon: BarChart3, title: "Financial snapshot visuals", body: "Translate key numbers, scenarios, milestones, and assumptions into clear visual stories." },
  { icon: Globe2, title: "Project websites & landing pages", body: "Private or public project sites for investor outreach, partners, press, and launch." },
  { icon: Database, title: "Upload centers / permissions", body: "Organize documents, access levels, upload workflows, and practical sharing systems." },
  { icon: Layers3, title: "Launch materials", body: "One-pagers, brochures, partner decks, brand assets, signage, and supporting collateral." },
  { icon: Film, title: "Motion / explainer visuals", body: "Short videos, diagrams, animated concepts, walkthroughs, and investor-facing explainers." },
  { icon: Rocket, title: "Ongoing design support", body: "An embedded creative partner from early story through revisions, meetings, and launch." },
] as const;

const process = [
  ["01", "Story & strategy", "Clarify the opportunity, audience, raise, proof, gaps, and the messages investors need to understand."],
  ["02", "Materials & design", "Build the deck, research visuals, financial snapshots, one-pagers, diagrams, and launch materials."],
  ["03", "Room & systems", "Create the investor room, structure documents, map access, and surface diligence status clearly."],
  ["04", "Launch & support", "Share with investors, support meetings, revise quickly, add new proof, and keep the system current."],
] as const;

const featured: Array<[string, string, string, InvestorAtlasTile]> = [
  ["INVESTOR SYSTEM", "Full investor ecosystem", "A cohesive presentation of the dashboard, deck, website, diligence, research, and supporting materials.", "system"],
  ["INVESTOR / DEAL ROOM", "Investor dashboard", "A controlled home for project status, documents, financial snapshots, permissions, proof, and investor access.", "dashboard"],
  ["INVESTOR DECK", "Pitch deck system", "Narrative, opportunity framing, visual hierarchy, architecture, market context, and financial storytelling.", "deck"],
  ["DILIGENCE SYSTEM", "Diligence & proof register", "A structured view of evidence, completion status, document counts, proof gaps, and readiness.", "diligence"],
  ["MARKET RESEARCH", "Research & demand story", "Competitive context, demand trends, regional insight, tourism indicators, and investor-facing research design.", "research"],
  ["FINANCIAL STORYTELLING", "Financial snapshot visuals", "Charts, scenarios, assumptions, milestones, and capital-story visuals designed to be legible at a glance.", "financial"],
  ["PROJECT VISUALIZATION", "Hospitality development imagery", "Investor-facing architectural imagery that gives the opportunity a believable visual identity before opening.", "building"],
];

type Cr91Deliverable = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  href?: string;
  linkLabel?: string;
};

const cr91Deliverables: Cr91Deliverable[] = [
  {
    eyebrow: "CR-91 PARK PLAZA",
    title: "Live investor proof room",
    body: "A secure investor-facing destination for documents, proof, access, artwork, and project updates.",
    image: "/devon/investor/cr91-live-investor-room.png",
    href: "https://cr-91-website-first-draft.vercel.app/investor",
    linkLabel: "View CR-91 room",
  },
  {
    eyebrow: "CR-91 DELIVERABLE",
    title: "Private investor proof room",
    body: "A polished investor-facing hub for secure access, diligence materials, proof, documents, and project artwork.",
    image: "/devon/investor/cr91-private-proof-room.png",
  },
  {
    eyebrow: "CR-91 DELIVERABLE",
    title: "Pitch deck + numbers updates",
    body: "Presentation revisions, investor narrative, financial-material cleanup, and ongoing updates as feedback came in.",
    image: "/devon/investor/cr91-pitch-deck-updates.png",
  },
  {
    eyebrow: "CR-91 DELIVERABLE",
    title: "Project website system",
    body: "A public-facing CR-91 experience with hospitality positioning, visual storytelling, and a path into the investor room.",
    image: "/devon/investor/cr91-project-website-system.png",
  },
  {
    eyebrow: "CR-91 DELIVERABLE",
    title: "Rapid founder support",
    body: "Fast edits, new sections, investor-meeting updates, collateral cleanup, and practical support from concept through deployment.",
    image: "/devon/investor/cr91-rapid-founder-support.png",
  },
];

export default function InvestorDealRoomsPage() {
  return (
    <div className="realiz-page investor-page">
      <aside className="rz-rail" aria-label="Portfolio navigation">
        <div className="rz-rail-accent"><span>DESIGN — AI — CODE — SYSTEMS</span></div>
        <div className="rz-rail-main">
          <a className="rz-mark" href="/devon" aria-label="Back to Devon Archer portfolio">DA</a>
          <span className="rz-copyright">© 2026 DEVON ARCHER</span>
        </div>
      </aside>

      <main className="rz-main" id="top">
        <header className="rz-topnav investor-topnav">
          <a className="rz-topnav-home" href="/devon">DEVON ARCHER</a>
          <nav>
            <a href="/devon#builds">Work</a>
            <a className="is-active" href="/devon/investor-deal-rooms">Investor / Deal Rooms</a>
            <a href="/devon#hotels">Hotels</a>
            <a href="/devon#restaurants">Restaurants</a>
            <a href="/devon#commercial">Commercial</a>
          </nav>
          <a className="rz-investor-nav-cta" href="/contact">Get in touch <ArrowUpRight size={14} /></a>
        </header>

        <section className="rz-investor-page-hero">
          <div className="rz-investor-page-copy">
            <p className="rz-kicker">INVESTOR SYSTEMS + FUNDRAISING MATERIALS</p>
            <h1>
              <span>INVESTOR ROOMS.</span>
              <span>PITCH DECKS.</span>
              <em>DILIGENCE SYSTEMS.</em>
            </h1>
            <p>
              I help founders, developers, operators, and hospitality projects turn complex raises into clear,
              compelling investor-ready systems: pitch decks, data rooms, research, financial visuals, project
              websites, and the ongoing creative support that keeps everything current.
            </p>
            <div className="rz-actions">
              <a className="rz-btn rz-btn-primary" href="#featured">Explore the work <ArrowRight size={15} /></a>
              <a className="rz-btn rz-btn-outline" href="/contact">Start a project <Mail size={15} /></a>
            </div>
          </div>
          <div className="rz-investor-page-generated-hero">
            <InvestorImageAtlas tile="system" className="rz-investor-page-generated-hero-image" />
            <div className="rz-investor-page-generated-caption">
              <span>CONCEPT VISUALIZATION</span>
              <strong>Investor ecosystem for a luxury hospitality development</strong>
            </div>
          </div>
        </section>

        <section className="rz-investor-services" id="capabilities">
          <div className="rz-investor-services-head">
            <div>
              <p className="rz-kicker">WHAT I HELP WITH</p>
              <h2>Everything you need to raise, in one place.</h2>
            </div>
            <p>
              From early story to final close, I create the materials, systems, and experiences that give investors
              clarity and give project teams one polished source of truth.
            </p>
          </div>
          <div className="rz-investor-cap-grid">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <article key={title}>
                <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rz-investor-process">
          <div className="rz-investor-process-head">
            <div>
              <p className="rz-kicker">A SIMPLE, FOCUSED PROCESS</p>
              <h2>From idea to investment.</h2>
            </div>
            <p>A practical end-to-end workflow for turning a complex opportunity into a clear story, polished materials, and a system investors can navigate.</p>
          </div>
          <div className="rz-investor-process-grid">
            {process.map(([n, title, body], index) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                {index < process.length - 1 ? <ArrowRight className="rz-investor-process-arrow" size={18} /> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="rz-investor-featured" id="featured">
          <div className="rz-investor-featured-head">
            <div>
              <p className="rz-kicker">FEATURED INVESTOR WORK</p>
              <h2>Systems, materials, and proof.</h2>
            </div>
            <p>
              These anonymized concept visuals show the kind of end-to-end investor system I can provide: deck,
              research, data room, proof organization, financial storytelling, project imagery, and continuous revisions.
            </p>
          </div>
          <div className="rz-investor-featured-grid">
            {featured.map(([category, title, body, tile]) => (
              <article key={title}>
                <div className="rz-investor-feature-card-art rz-investor-feature-card-generated">
                  <InvestorImageAtlas tile={tile} className="rz-investor-feature-generated-image" />
                </div>
                <small>{category}</small>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rz-investor-featured" id="cr91">
          <div className="rz-investor-featured-head">
            <div>
              <p className="rz-kicker">REAL PROJECT SYSTEM</p>
              <h2>CR-91 Park Plaza investor room.</h2>
            </div>
            <p>
              CR-91 is a live example of the investor-room work: a project website, secure proof room, pitch materials,
              diligence structure, and rapid update system built around an active hospitality-development raise.
            </p>
          </div>

          <div className="rz-investor-featured-grid">
            {cr91Deliverables.map(({ eyebrow, title, body, image, href, linkLabel }) => {
              const cardArt = (
                <div
                  className="rz-investor-feature-card-art rz-investor-feature-card-generated"
                  role="img"
                  aria-label={`${title} visual`}
                  style={{
                    backgroundImage: `url('${image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              );

              return (
                <article key={title}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${title}`}>
                      {cardArt}
                    </a>
                  ) : (
                    cardArt
                  )}
                  <small>{eyebrow}</small>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  {href && linkLabel ? (
                    <a className="rz-text-link inverse" href={href} target="_blank" rel="noreferrer">
                      {linkLabel} <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="rz-investor-cta">
          <div>
            <p className="rz-kicker">LET&apos;S BUILD SOMETHING GREAT</p>
            <h2>Investor-ready systems for ambitious projects.</h2>
          </div>
          <div>
            <p>
              If you are raising for a hospitality project, real-estate development, destination concept, restaurant
              group, or another founder-led venture, I can help turn the vision into materials and systems people can
              understand, trust, and act on.
            </p>
            <div className="rz-actions">
              <a className="rz-btn rz-btn-primary" href="/contact">Start a project <ArrowUpRight size={15} /></a>
              <a className="rz-btn rz-btn-outline" href="/devon">View full portfolio <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
