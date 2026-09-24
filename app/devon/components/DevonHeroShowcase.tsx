"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  FileText,
  GraduationCap,
  Mail,
  Play,
} from "lucide-react";
import { InvestorSystemVisual } from "./InvestorSystemVisual";

type SectionKey = "work" | "investor" | "hotels" | "restaurants" | "commercial" | "about";

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
  href?: string;
};

type SectionConfig = {
  label: string;
  kicker: string;
  lines: [string, string, string];
  lead: string;
  detailKicker: string;
  detailTitle: string;
  detailBody: string;
  primary: { label: string; href: string };
  capabilities: Array<[string, string]>;
  features: Feature[];
};

const sections: Record<SectionKey, SectionConfig> = {
  work: {
    label: "Work",
    kicker: "DESIGN ENGINEER + CREATIVE TECHNOLOGIST",
    lines: ["DESIGN.", "BUILD.", "SHIP."],
    lead:
      "I turn ambiguous ideas into working experiences. Product design, AI systems, web products, motion, and creative direction — from the first interaction model through real states, QA, deployment, and iteration.",
    detailKicker: "SELECTED CAPABILITIES",
    detailTitle: "Design thinking with production muscle.",
    detailBody:
      "I work where product, visual design, AI, code, and storytelling overlap. The goal is not a pretty prototype. It is a clear, useful experience that can survive contact with real users and real constraints.",
    primary: { label: "Explore product work", href: "#builds" },
    capabilities: [
      ["Product UX", "Interaction design, system states, flows, prototypes, and decision-support experiences."],
      ["Design engineering", "React / Next.js builds, TypeScript, frontend implementation, APIs, auth, and product QA."],
      ["Applied AI", "Human-centered AI workflows, structured outputs, evals, trust UX, and visible model behavior."],
      ["Rapid prototyping", "Functional prototypes that expose assumptions before a team over-invests in polish."],
      ["Motion & explainers", "Product storytelling, generative motion, interface animation, and launch visuals."],
      ["Creative systems", "Campaign systems, modular brand assets, templates, and repeatable production workflows."],
    ],
    features: [
      {
        eyebrow: "AI DEVELOPER TOOLING",
        title: "VibeCode+",
        body: "Inspectable AI code repair with verification and human review.",
        image: "/devon/projects/vibecode-neon-code-repair-hero.png",
        href: "https://vibe-code-final.vercel.app/",
      },
      {
        eyebrow: "TRUST UX / APPLIED AI",
        title: "CheckRay",
        body: "Risk analysis designed around evidence, uncertainty, and useful next steps.",
        image: "/devon/projects/checkray-home.png",
        href: "https://checkray.app",
      },
      {
        eyebrow: "AI INFRASTRUCTURE",
        title: "Baseten Inference Lab",
        body: "A visible, interactive explanation of an otherwise invisible inference system.",
        image: "/devon/projects/baseten-inference-lab.png",
        href: "https://baseten-inference-lab.vercel.app/",
      },
      {
        eyebrow: "DECISION SUPPORT",
        title: "SFC Evaluator Workbench",
        body: "A design-engineering concept for structured evaluation and human review.",
        href: "https://sfc-evaluator-workbench.vercel.app/en/dashboard",
      },
    ],
  },
  investor: {
    label: "Investor / Deal Rooms",
    kicker: "INVESTOR SYSTEMS + FUNDRAISING MATERIALS",
    lines: ["DESIGN.", "BUILD.", "LAUNCH."],
    lead:
      "I help founders, developers, operators, and hospitality projects turn complex raises into clear investor-ready experiences — pitch decks, data rooms, diligence systems, research, financial visuals, project websites, and ongoing creative support.",
    detailKicker: "INVESTOR SYSTEMS",
    detailTitle: "Everything you need to raise, in one place.",
    detailBody:
      "From early story to final close, I create the materials, systems, and experiences that give investors clarity and give project teams a polished source of truth that can evolve as the raise moves forward.",
    primary: { label: "Explore investor work", href: "/devon/investor-deal-rooms" },
    capabilities: [
      ["Investor decks", "Pitch narrative, slide design, financial storytelling, diagrams, and presentation polish."],
      ["Investor / data rooms", "Secure, organized, professional project systems for documents, proof, access, and updates."],
      ["Diligence dashboards", "Track readiness, evidence, missing items, validation, and investor-facing proof."],
      ["Proof registers", "Structure claims, sources, exhibits, documents, permissions, and diligence status."],
      ["Market research", "Turn dense research into concise, credible, visual investor-facing insights."],
      ["Financial visuals", "Key metrics, milestones, scenarios, assumptions, and capital-story visuals."],
      ["Project websites", "Private or public investor sites, landing pages, launch pages, and partner portals."],
      ["Launch materials", "One-pagers, brochures, partner decks, brand assets, diagrams, and presentation support."],
      ["Motion / explainers", "Videos, concept walkthroughs, animated diagrams, and investor-facing story visuals."],
      ["Ongoing support", "A fractional creative partner from first deck through meetings, revisions, proof, and launch."],
    ],
    features: [
      {
        eyebrow: "INVESTOR / DEAL ROOM",
        title: "CR 91 Investor Room",
        body: "A secure diligence dashboard for proof, documents, permissions, research, and investor access.",
      },
      {
        eyebrow: "INVESTOR DECK",
        title: "CR 91 Park Plaza Deck",
        body: "Opportunity framing, research, slide design, visual hierarchy, and financial storytelling.",
      },
      {
        eyebrow: "PROJECT WEBSITE",
        title: "Investor-facing project site",
        body: "A polished home for the opportunity, supporting evidence, project story, and investor outreach.",
      },
      {
        eyebrow: "DILIGENCE SYSTEM",
        title: "Proof & readiness register",
        body: "Document organization, evidence tracking, claims, gaps, permissions, and clear readiness workflows.",
      },
    ],
  },
  hotels: {
    label: "Hotels",
    kicker: "HOSPITALITY CREATIVE + PROPERTY STORYTELLING",
    lines: ["HOTELS.", "CAMPAIGNS.", "MOMENTS."],
    lead:
      "I help hotel teams turn the property, F&B, events, offers, and guest experience they already have into stronger campaigns, social creative, motion, and booking-support assets without adding another full-time creative role.",
    detailKicker: "HOTEL CREATIVE",
    detailTitle: "Property-level creative that feels like the property.",
    detailBody:
      "The strongest hotel marketing is specific. I work from the actual rooms, spaces, people, events, food, neighborhood, and brand standards to create a consistent stream of useful creative.",
    primary: { label: "Explore hotel work", href: "#hotels" },
    capabilities: [
      ["Social creative", "Feed, story, carousel, paid-social, and evergreen property creative."],
      ["Seasonal campaigns", "Offers, holidays, local events, packages, and destination-led campaign systems."],
      ["F&B promotion", "Restaurants, bars, breakfast, menus, specials, rooftop, catering, and culinary moments."],
      ["Short-form motion", "Reels, motion graphics, AI-assisted image-to-video, and property storytelling."],
      ["Meetings & events", "Weddings, group sales, meeting rooms, celebrations, and event promotion."],
      ["Booking support", "Landing pages, offer graphics, sales collateral, direct-booking creative, and email assets."],
    ],
    features: [
      {
        eyebrow: "HOTEL INDIGO",
        title: "Property campaigns",
        body: "Rooms, rooftop, weddings, events, local culture, and F&B creative.",
        image: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png",
      },
      {
        eyebrow: "HAMPTON BY HILTON",
        title: "Always-on hotel creative",
        body: "Seasonal campaigns, breakfast, events, pet-friendly, pool, and local-demand content.",
        image: "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png",
      },
      {
        eyebrow: "HOTEL + F&B",
        title: "Cross-property storytelling",
        body: "Integrated hotel and restaurant creative built to feel connected rather than templated.",
        image: "/tcrm/images/eliza-hot-metal-bistro-hotel-indigo-share-the-love.png",
      },
      {
        eyebrow: "SOCIAL SYSTEMS",
        title: "Campaign continuity",
        body: "Creative systems that keep a property's feed, offers, events, and story moving month after month.",
        image: "/tcrm/images/hotel-indigo-pittsburgh-instagram-grid.png",
      },
    ],
  },
  restaurants: {
    label: "Restaurants",
    kicker: "FOOD + BEVERAGE CREATIVE",
    lines: ["FOOD.", "DRINK.", "MOMENTS."],
    lead:
      "Restaurant creative should make the experience feel immediate. I build campaigns around food, cocktails, menus, live music, seasonal offers, events, and the personality of the room — across social, motion, web, and print.",
    detailKicker: "F&B CREATIVE",
    detailTitle: "Make people want to be there.",
    detailBody:
      "From a weekly special to a full seasonal campaign, I build visual systems that make food, drinks, events, and atmosphere feel consistent and worth showing up for.",
    primary: { label: "Explore restaurant work", href: "#restaurants" },
    capabilities: [
      ["Food & drink campaigns", "Seasonal menus, specials, cocktails, brunch, takeout, and signature-item creative."],
      ["Social systems", "Feed, stories, carousels, event graphics, and ongoing content packages."],
      ["Motion & reels", "Food movement, beverage detail, atmosphere, quick edits, and short-form storytelling."],
      ["Events & live music", "Posters, series systems, ticketed events, entertainment, and recurring programming."],
      ["Menus & collateral", "Menu design, takeout assets, table pieces, signage, and promotional materials."],
      ["Digital touchpoints", "Landing pages, microsites, email graphics, and campaign extensions."],
    ],
    features: [
      {
        eyebrow: "ELIZA HOT METAL BISTRO",
        title: "Campaign system",
        body: "Food, drinks, events, seasonal promotions, and hotel-connected storytelling.",
        image: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png",
      },
      {
        eyebrow: "BEVERAGE ART DIRECTION",
        title: "Minty Fresh",
        body: "High-impact product art direction designed for scroll-stopping social creative.",
        image: "/tcrm/images/minty-fresh-beverage-art-direction.png",
      },
      {
        eyebrow: "LIVE MUSIC",
        title: "Event series",
        body: "Repeatable visual systems for programming that still let every event feel distinct.",
        image: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png",
      },
      {
        eyebrow: "MENU / PROMOTION",
        title: "Seasonal F&B",
        body: "Menu launches, monthly specials, takeout, holidays, and offer-driven creative.",
        image: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png",
      },
    ],
  },
  commercial: {
    label: "Commercial",
    kicker: "BRAND + PRODUCT + MOTION",
    lines: ["BRAND.", "PRODUCT.", "MOTION."],
    lead:
      "For startups and commercial teams, I move between brand, product UX, websites, presentations, motion, campaign creative, and AI-assisted production so the story and the shipped experience stay connected.",
    detailKicker: "COMMERCIAL CREATIVE",
    detailTitle: "One creative partner across the idea and the execution.",
    detailBody:
      "When the work spans a product, website, campaign, deck, motion piece, and launch, I can keep the system coherent instead of handing every piece to a different production lane.",
    primary: { label: "Explore commercial work", href: "#commercial" },
    capabilities: [
      ["Brand systems", "Visual direction, campaign systems, design language, and scalable asset families."],
      ["Product visuals", "UI concepts, product storytelling, launch images, diagrams, and feature communication."],
      ["Web experiences", "Landing pages, microsites, responsive builds, and campaign-specific web experiences."],
      ["Pitch & sales materials", "Presentations, one-pagers, partner collateral, and executive-ready visual narratives."],
      ["Motion & video", "Product motion, short-form campaigns, explainers, editing, and AI-assisted production."],
      ["Creative technology", "Interactive prototypes, Next.js builds, AI workflows, and rapid product experiments."],
    ],
    features: [
      {
        eyebrow: "PRODUCT UX",
        title: "CheckRay",
        body: "Trust-centered AI product design and live product implementation.",
        image: "/devon/projects/checkray-home.png",
        href: "https://checkray.app",
      },
      {
        eyebrow: "DESIGN ENGINEERING",
        title: "VibeCode+",
        body: "A working product system that turns AI repair into visible, inspectable states.",
        image: "/devon/projects/vibecode-neon-code-repair-hero.png",
        href: "https://vibe-code-final.vercel.app/",
      },
      {
        eyebrow: "AI INFRASTRUCTURE",
        title: "Baseten Inference Lab",
        body: "A concept-to-code experience for explaining and demonstrating technical capability.",
        image: "/devon/projects/baseten-inference-lab.png",
        href: "https://baseten-inference-lab.vercel.app/",
      },
      {
        eyebrow: "CAMPAIGN ART DIRECTION",
        title: "Commercial creative",
        body: "Product, campaign, motion, and digital work designed to feel like one system.",
        image: "/tcrm/images/minty-fresh-beverage-art-direction.png",
      },
    ],
  },
  about: {
    label: "About",
    kicker: "ABOUT DEVON ARCHER",
    lines: ["DESIGNER.", "BUILDER.", "PARTNER."],
    lead:
      "I am a design engineer and creative technologist who works across product UX, hospitality creative, motion, AI-assisted production, web development, and visual systems. I am most useful when an idea needs both creative judgment and someone willing to stay with the build until it ships.",
    detailKicker: "RESUME + BACKGROUND",
    detailTitle: "Creative range, grounded in execution.",
    detailBody:
      "My career has moved through client-facing graphic design, hospitality marketing, product positioning, UX, creative technology, and independent studio work. The common thread is turning complex briefs into clear, polished things people can actually use.",
    primary: { label: "View resume", href: "#about-resume" },
    capabilities: [
      ["Archer Design", "Founder, 2021–present. Hospitality creative, motion, websites, product visuals, and AI-assisted digital work."],
      ["SHAIPE Agency", "Graphic Designer & Client-Facing Operator, 2021–2025. Multi-account campaigns, brand assets, and direct client delivery."],
      ["JobGhost", "Co-Founder, Growth Systems & Product Positioning, 2025–2026. Product positioning, workflows, outreach systems, and AI product thinking."],
      ["Education", "M.S. UX Design and B.S. UX/UI Design, Full Sail University. Graphic Design Certificate, California Institute of the Arts."],
      ["Product systems", "React, Next.js, TypeScript, Supabase, Vercel, GitHub, APIs, auth, and AI-assisted development."],
      ["Creative stack", "Figma, Adobe Creative Suite, motion, video, social systems, AI image/video, art direction, and presentation design."],
    ],
    features: [
      { eyebrow: "TRACKED IMPRESSIONS", title: "9.13M", body: "Across tracked hospitality, restaurant, event, and wellness social work." },
      { eyebrow: "TRACKED REACH", title: "4.69M", body: "Aggregate reach across tracked campaigns and profiles." },
      { eyebrow: "TRACKED ENGAGEMENTS", title: "636K+", body: "Engagements across tracked social work." },
      { eyebrow: "CREATIVE PIECES / POSTS", title: "2,970", body: "Tracked output across client and campaign work." },
    ],
  },
};

function PhotoStack({
  images,
  portrait = false,
}: {
  images: Array<{ src: string; alt: string; label?: string }>;
  portrait?: boolean;
}) {
  return (
    <div className={`rz-dynamic-photo-stack${portrait ? " is-portrait" : ""}`}>
      {images.map((item, index) => (
        <div className={`rz-dynamic-photo card-${index + 1}`} key={item.src}>
          <Image src={item.src} alt={item.alt} fill sizes="(min-width: 900px) 34vw, 82vw" />
          {item.label ? <span>{item.label}</span> : null}
        </div>
      ))}
    </div>
  );
}

function HeroVisual({ active }: { active: SectionKey }) {
  if (active === "investor") {
    return (
      <div className="rz-dynamic-investor-visual">
        <InvestorSystemVisual />
      </div>
    );
  }

  if (active === "hotels") {
    return (
      <PhotoStack
        images={[
          { src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png", alt: "Hotel Indigo campaign collage", label: "HOTEL INDIGO" },
          { src: "/tcrm/images/hampton-inn-johnstown-pool-and-patio.png", alt: "Hampton Inn pool and patio campaign", label: "HAMPTON INN" },
          { src: "/tcrm/images/hotel-indigo-pittsburgh-rooftop-party-big-blitz-band.png", alt: "Hotel Indigo rooftop event campaign", label: "PROPERTY + EVENTS" },
        ]}
      />
    );
  }

  if (active === "restaurants") {
    return (
      <PhotoStack
        images={[
          { src: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png", alt: "Eliza Hot Metal Bistro burger campaign", label: "F&B CAMPAIGN" },
          { src: "/tcrm/images/minty-fresh-beverage-art-direction.png", alt: "Beverage art direction", label: "ART DIRECTION" },
          { src: "/tcrm/images/eliza-hot-metal-bistro-live-music-series.png", alt: "Eliza live music campaign", label: "EVENT SERIES" },
        ]}
      />
    );
  }

  if (active === "commercial") {
    return (
      <PhotoStack
        images={[
          { src: "/devon/projects/vibecode-neon-code-repair-hero.png", alt: "VibeCode plus product interface", label: "DESIGN ENGINEERING" },
          { src: "/devon/projects/checkray-home.png", alt: "CheckRay product interface", label: "AI PRODUCT" },
          { src: "/devon/projects/baseten-inference-lab.png", alt: "Baseten Inference Lab", label: "INTERACTIVE PRODUCT" },
        ]}
      />
    );
  }

  if (active === "about") {
    return (
      <div className="rz-about-hero-visual">
        <div className="rz-about-portrait">
          <Image
            src="/infuse/brand/devon-archer-portrait.png"
            alt="Devon Archer"
            fill
            sizes="(min-width: 900px) 30vw, 80vw"
          />
          <div className="rz-about-portrait-label">
            <strong>DEVON ARCHER</strong>
            <span>PRODUCT / AI / UX / MOTION</span>
          </div>
        </div>
        <div className="rz-about-note">Designer first. Builder when the idea needs to become real.</div>
        <div className="rz-about-mini-resume">
          <span>RESUME SNAPSHOT</span>
          <strong>Creative technologist for real-world ideas.</strong>
          <ul>
            <li>Founder — Archer Design</li>
            <li>M.S. UX Design</li>
            <li>Hospitality + product + AI</li>
            <li>Design through deployment</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <PhotoStack
      portrait
      images={[
        { src: "/infuse/brand/devon-archer-portrait.png", alt: "Devon Archer", label: "DEVON ARCHER" },
        { src: "/devon/projects/vibecode-neon-code-repair-hero.png", alt: "VibeCode plus interface", label: "PRODUCT / AI" },
        { src: "/tcrm/images/hotel-indigo-pittsburgh-room-collage.png", alt: "Hospitality campaign work", label: "CREATIVE / HOSPITALITY" },
      ]}
    />
  );
}

function FeatureCard({ feature, active, index }: { feature: Feature; active: SectionKey; index: number }) {
  const content = (
    <>
      <div className={`rz-dynamic-feature-art art-${index + 1} is-${active}`}>
        {feature.image ? (
          <Image src={feature.image} alt="" fill sizes="(min-width: 1100px) 22vw, 44vw" />
        ) : active === "investor" && index === 0 ? (
          <InvestorSystemVisual compact />
        ) : active === "investor" && index === 1 ? (
          <div className="rz-dynamic-mini-deck"><small>INVESTOR DECK</small><strong>PARK PLAZA</strong><span>Investment opportunity</span></div>
        ) : active === "investor" && index === 2 ? (
          <div className="rz-dynamic-mini-site"><small>PROJECT WEBSITE</small><strong>CR 91</strong><span>Investor-facing project story</span></div>
        ) : active === "investor" ? (
          <div className="rz-dynamic-mini-proof"><span>Claims & proof</span><span>Financials</span><span>Research</span><span>Permits</span></div>
        ) : active === "about" ? (
          <div className="rz-dynamic-number-art"><strong>{feature.title}</strong><span>{feature.eyebrow}</span></div>
        ) : (
          <div className="rz-dynamic-type-art"><span>{feature.eyebrow}</span><strong>{feature.title}</strong></div>
        )}
      </div>
      <small>{feature.eyebrow}</small>
      <h3>{feature.title}</h3>
      <p>{feature.body}</p>
      {feature.href ? <span className="rz-dynamic-feature-link">Open <ArrowUpRight size={13} /></span> : null}
    </>
  );

  if (feature.href) {
    return (
      <a href={feature.href} target={feature.href.startsWith("http") ? "_blank" : undefined} rel={feature.href.startsWith("http") ? "noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return <article>{content}</article>;
}

export function DevonHeroShowcase() {
  const [active, setActive] = useState<SectionKey>("work");
  const section = sections[active];

  const choose = (key: SectionKey) => {
    setActive(key);
    window.requestAnimationFrame(() => {
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="rz-dynamic-shell">
      <header className="rz-topnav rz-dynamic-topnav" aria-label="Portfolio categories">
        <button className="rz-topnav-home" type="button" onClick={() => choose("work")}>DEVON ARCHER</button>
        <nav>
          {(Object.keys(sections) as SectionKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={active === key ? "is-active" : undefined}
              onClick={() => choose(key)}
              aria-pressed={active === key}
            >
              {sections[key].label}
            </button>
          ))}
        </nav>
        <a className="rz-dynamic-contact" href="mailto:heydevon@gmail.com">Get in touch <ArrowUpRight size={14} /></a>
      </header>

      <section className={`rz-dynamic-hero is-${active}`} aria-live="polite">
        <div className="rz-dynamic-hero-copy">
          <p className="rz-kicker">{section.kicker}</p>
          <h1>
            <span>{section.lines[0]}</span>
            <span>{section.lines[1]}</span>
            <em>{section.lines[2]}</em>
          </h1>
          <p className="rz-lead">{section.lead}</p>
          <div className="rz-actions">
            <a className="rz-btn rz-btn-primary" href={section.primary.href}>
              {section.primary.label} <ArrowDownRight size={16} aria-hidden="true" />
            </a>
            {active !== "about" ? (
              <button className="rz-btn rz-btn-outline rz-btn-as-button" type="button" onClick={() => choose("about")}>
                About me <BriefcaseBusiness size={15} />
              </button>
            ) : (
              <a className="rz-btn rz-btn-outline" href="https://github.com/devon-gif" target="_blank" rel="noreferrer">
                GitHub <Code2 size={15} />
              </a>
            )}
            <a className="rz-btn rz-btn-outline" href="mailto:heydevon@gmail.com">
              Get in touch <Mail size={15} />
            </a>
          </div>
        </div>
        <HeroVisual active={active} />
      </section>

      <section className={`rz-dynamic-detail is-${active}`}>
        <div className="rz-dynamic-detail-head">
          <div>
            <p className="rz-kicker">{section.detailKicker}</p>
            <h2>{section.detailTitle}</h2>
          </div>
          <div>
            <p>{section.detailBody}</p>
            {active === "investor" ? (
              <a className="rz-btn rz-btn-primary rz-dynamic-detail-cta" href="/devon/investor-deal-rooms">
                Explore investor work <ArrowRight size={15} />
              </a>
            ) : active === "about" ? (
              <a className="rz-btn rz-btn-primary rz-dynamic-detail-cta" href="#about-resume">
                Full resume <FileText size={15} />
              </a>
            ) : (
              <a className="rz-btn rz-btn-primary rz-dynamic-detail-cta" href={section.primary.href}>
                View full section <ArrowRight size={15} />
              </a>
            )}
          </div>
        </div>

        <div className="rz-dynamic-capabilities">
          {section.capabilities.map(([title, body]) => (
            <article key={title}>
              <span className="rz-investor-service-mark" />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="rz-dynamic-feature-head">
          <span>{active === "about" ? "SELECTED ACCOMPLISHMENTS" : "FEATURED WORK"}</span>
          <button type="button" onClick={() => choose(active === "about" ? "work" : "about")}>
            {active === "about" ? "View work" : "About Devon"} <ArrowRight size={13} />
          </button>
        </div>

        <div className="rz-dynamic-feature-grid">
          {section.features.map((feature, index) => (
            <FeatureCard feature={feature} active={active} index={index} key={feature.title} />
          ))}
        </div>

        {active === "about" ? (
          <div className="rz-dynamic-about-footer">
            <div><GraduationCap size={19} /><span>M.S. UX Design · B.S. UX/UI Design · CalArts Graphic Design Certificate</span></div>
            <div><BriefcaseBusiness size={19} /><span>Archer Design · SHAIPE Agency · JobGhost</span></div>
            <div><Play size={19} /><span>Design · Product · AI · Motion · Hospitality · Web</span></div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
