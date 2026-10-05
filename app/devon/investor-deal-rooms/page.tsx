import type { Metadata } from "next";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  FileCheck2,
  FileText,
  Film,
  FolderLock,
  Globe2,
  Layers3,
  Presentation,
  Rocket,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import type { InvestorAtlasTile } from "../components/InvestorImageAtlas";
import { Crumb, PortfolioContact, PortfolioFooter, PortfolioNav } from "../components/PortfolioChrome";
import opus from "../opus.module.css";
import sub from "../subpage.module.css";

const PAGE_TITLE = "Investor Rooms, Pitch Decks & Diligence Systems · Devon Archer";
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

const selectedWork = [
  {
    eyebrow: "TECHNICAL / PRODUCT STORYTELLING",
    title: "Two Systems build story",
    body:
      "A 21-page case-study deck translating two complex product systems into a clear executive narrative: workflow, architecture, failure analysis, deterministic guardrails, human review, QA, and working-versus-roadmap boundaries.",
    image: "/devon/investor/selected-technical-storytelling.svg",
    note: "Based on real product work across Auto Creative OS and CheckRay.",
  },
  {
    eyebrow: "PARTNERSHIP / PILOT STRATEGY",
    title: "Hospitality specialist handoff concept",
    body:
      "A six-page strategy deck that turns a partnership idea into a concrete operating model: customer flow, signal detection, specialist boundaries, integration options, consent guardrails, and a measurable 30-day pilot.",
    image: "/devon/investor/selected-partnership-system.svg",
    note: "Client and partner names are anonymized for portfolio use.",
  },
  {
    eyebrow: "EXECUTIVE GROWTH STRATEGY",
    title: "Multi-property marketing operating plan",
    body:
      "A ten-page executive proposal that combines creative production, lifecycle marketing, SEO, landing pages, CRM, approvals, reporting, and a 90-day stabilize-build-scale roadmap across a hospitality portfolio.",
    image: "/devon/investor/selected-growth-strategy.svg",
    note: "Commercially sensitive property details are anonymized.",
  },
] as const;

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

const atlas: Record<InvestorAtlasTile, string> = {
  system: "/devon/investor/investor-system-composition.png",
  building: "/devon/investor/investor-building.png",
  dashboard: "/devon/investor/investor-dashboard.png",
  deck: "/devon/investor/investor-pitch-deck.png",
  diligence: "/devon/investor/investor-proof-register.png",
  research: "/devon/investor/investor-research-report.png",
  financial: "/devon/investor/investor-financial-spread.png",
};

const presentations = [
  {
    eyebrow: "Hospitality investor presentation",
    title: "The Halite.",
    description:
      "A 16-page hospitality investor presentation. Open the original PDF to see the full deck at native quality, with the exact typography, imagery, charts and layouts.",
    href: "https://at.adobe.com/BcY5QLVuXF9KOT0j",
    button: "View the Halite deck",
    meta: "Original PDF · 16 pages · Opens in a new tab",
  },
  {
    eyebrow: "Creative technology / executive storytelling",
    title: "Creative Technology, Systems & Storytelling.",
    description:
      "An 8-page presentation on how I communicate complex product, AI, systems and creative-technology work through a clear executive narrative.",
    href: "https://at.adobe.com/zTGCy850Nyt4aIxS",
    button: "View the Creative Technology deck",
    meta: "Original PDF · 8 pages · Opens in a new tab",
  },
] as const;

function SectionHead({ eyebrow, title, muted, children }: { eyebrow: string; title: string; muted: string; children: ReactNode }) {
  return (
    <div className={sub.head}>
      <p className={`${opus.eyebrow} ${sub.headEyebrow}`}>
        <b /> {eyebrow}
      </p>
      <h2>
        <span>{muted}</span> {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}

export default function InvestorDealRoomsPage() {
  return (
    <div className={opus.opusPage}>
      <PortfolioNav current="work" />

      <main className={opus.shell}>
        <section className={sub.hero} id="top">
          <div className={sub.heroCopy}>
            <Crumb label="Investor / deal rooms" />
            <h1>
              <span>Investor rooms.</span> Pitch decks. Diligence systems.
            </h1>
            <p>
              I help founders, developers, operators and hospitality projects turn complex raises into clear,
              investor-ready systems: pitch decks, data rooms, research, financial visuals, project websites, and the
              ongoing creative support that keeps everything current.
            </p>
            <div className={sub.actions}>
              <a className={opus.pill} href="#decks">
                View the decks{" "}
                <i>
                  <ArrowUpRight size={15} />
                </i>
              </a>
              <a className={sub.ghost} href="#cr91">
                See a live project
              </a>
            </div>
          </div>
          <div className={sub.heroMedia}>
            <Image src={atlas.system} alt="Investor system with dashboard, deck, website and supporting materials" fill priority sizes="(min-width: 1000px) 45vw, 94vw" />
            <div className={sub.mediaCaption}>
              <span>Concept visualization</span>
              <strong>Investor ecosystem for a luxury hospitality development</strong>
            </div>
          </div>
        </section>

        <section className={opus.panel} id="capabilities">
          <SectionHead eyebrow="What I help with" muted="Everything a raise needs," title="in one place.">
            From early story to final close, I create the materials, systems and experiences that give investors clarity
            and give project teams one polished source of truth.
          </SectionHead>
          <div className={sub.grid}>
            {capabilities.map(({ icon: Icon, title, body }) => (
              <article className={sub.card} key={title}>
                <span className={sub.icon}>
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={opus.panel}>
          <SectionHead eyebrow="Process" muted="From idea" title="to investment.">
            A practical end-to-end workflow for turning a complex opportunity into a clear story, polished materials, and a
            system investors can navigate.
          </SectionHead>
          <div className={sub.grid4}>
            {process.map(([n, title, body]) => (
              <article className={sub.step} key={n}>
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={opus.panel} id="featured">
          <SectionHead eyebrow="Investor system capabilities" muted="Systems, materials" title="and proof.">
            Concept visuals of the end-to-end investor system I can provide: deck, research, data room, proof
            organization, financial storytelling, project imagery, and continuous revisions.
          </SectionHead>
          <div className={sub.grid}>
            {/* The full-system composition is already the hero image, so the grid starts with the parts. */}
            {featured.filter(([, , , tile]) => tile !== "system").map(([category, title, body, tile]) => (
              <article className={sub.imageCard} key={title}>
                <figure>
                  <Image src={atlas[tile]} alt={title} fill sizes="(min-width: 1100px) 31vw, (min-width: 760px) 47vw, 94vw" />
                </figure>
                <small>{category}</small>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={sub.dark} id="decks">
          <SectionHead eyebrow="Featured presentation work" muted="Investor decks" title="and complex storytelling.">
            Two full presentations, linked as the original PDFs so the typography, imagery and charts are exactly as
            delivered.
          </SectionHead>
          <div className={sub.deckGrid}>
            {presentations.map((d) => (
              <article className={sub.deck} key={d.title}>
                <div>
                  <small>{d.eyebrow}</small>
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                </div>
                <div className={sub.actions}>
                  <a className={sub.limePill} href={d.href} target="_blank" rel="noreferrer">
                    {d.button}{" "}
                    <i>
                      <ArrowUpRight size={15} />
                    </i>
                  </a>
                  <span className={sub.deckMeta}>{d.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={opus.panel} id="selected-work">
          <SectionHead eyebrow="Selected real-world storytelling" muted="Investor, strategy and" title="executive communication.">
            Long-form product case studies, partnership concepts and executive operating proposals. Client and partner
            names are anonymized where the underlying work is commercially sensitive.
          </SectionHead>
          <div className={sub.grid}>
            {selectedWork.map(({ eyebrow, title, body, image, note }) => (
              <article className={sub.imageCard} key={title}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element -- SVG previews */}
                  <img src={image} alt={`${title} preview`} loading="lazy" decoding="async" />
                </figure>
                <small>{eyebrow}</small>
                <h3>{title}</h3>
                <p>{body}</p>
                <p className={sub.note}>{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={opus.panel} id="cr91">
          <SectionHead eyebrow="Real project system" muted="CR-91 Park Plaza" title="investor room.">
            A live example of the investor-room work: a project website, secure proof room, pitch materials, diligence
            structure and rapid update system built around an active hospitality-development raise.
          </SectionHead>
          <div className={sub.grid}>
            {cr91Deliverables.map(({ eyebrow, title, body, image, href, linkLabel }) => (
              <article className={sub.imageCard} key={title}>
                <figure>
                  <Image src={image} alt={`${title} visual`} fill sizes="(min-width: 1100px) 31vw, (min-width: 760px) 47vw, 94vw" />
                </figure>
                <small>{eyebrow}</small>
                <h3>{title}</h3>
                <p>{body}</p>
                {href && linkLabel ? (
                  <a className={sub.textLink} href={href} target="_blank" rel="noreferrer">
                    {linkLabel} <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <PortfolioContact title="Investor-ready systems for ambitious projects." />
        <p className={sub.crumb} style={{ padding: "4px 18px" }}>
          <Link href="/devon">← Back to the full portfolio</Link>
        </p>
        <PortfolioFooter />
      </main>
    </div>
  );
}
