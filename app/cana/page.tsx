import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Film,
  Handshake,
  Hotel,
  Layers3,
  Megaphone,
  Presentation,
  RefreshCw,
  Sparkles,
  Store,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { TCRM_VIDEOS, TCRM_IMAGES } from "../tcrm/tcrm-media";
import { PROOF_STATS, PROOF_DISCLAIMER } from "../tcrm/tcrm-content";

const PAGE_TITLE = "Cana × Archer Design Collaboration Concept";
const PAGE_DESCRIPTION =
  "A private collaboration concept exploring how Archer Design could add flexible creative production around Cana Development projects, operators, tenants, openings, and hospitality experiences.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/cana") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const PUBLIC_PROJECTS = [
  "Mt. Vernon Marketplace",
  "The Bourse",
  "Cross Street Market",
  "Western Market",
  "High Street Place",
  "Stock + Grain Assembly",
  "Bryant Street Market",
];

const MOMENTS = [
  ["Opening", "Reveal the place and give people a reason to show up."],
  ["F&B", "Promote restaurants, bars, menus, specials, and culinary moments."],
  ["Tenants", "Give individual concepts launch-ready creative without adding internal headcount."],
  ["Events", "Turn programming into finished campaigns across social, email, and digital."],
  ["Seasonal", "Keep the destination visible with recurring reasons to return."],
  ["Hospitality", "Support hotel, meeting, guest-experience, and property-level campaigns."],
] as const;

const FITS = [
  {
    num: "01",
    title: "Project + destination activation",
    icon: Sparkles,
    body: "When the strategy is clear but an operator needs finished campaign assets, Archer can become flexible execution capacity around openings, programming, F&B, events, and hospitality experiences.",
    tags: ["Opening campaigns", "Motion", "F&B", "Events", "Digital creative"],
  },
  {
    num: "02",
    title: "Operator + tenant support",
    icon: Store,
    body: "Cana works with restaurants, tenants, hospitality concepts, and destination partners. Archer can give those operators practical creative support without Cana becoming their in-house design department.",
    tags: ["Launch assets", "Social campaigns", "Menu promos", "Seasonal creative", "Ongoing production"],
  },
  {
    num: "03",
    title: "Cana business-development support",
    icon: Presentation,
    body: "Archer could also work directly for Cana—turning completed projects, project thinking, and placemaking expertise into polished business-development assets that help sell the next opportunity.",
    tags: ["Case studies", "Project reveals", "Pursuit decks", "Landing pages", "B2B content"],
  },
] as const;

const PHASES = [
  {
    label: "Pre-opening",
    icon: Building2,
    items: ["Teaser creative", "Progress storytelling", "Tenant announcements", "Opening countdown", "Launch assets"],
  },
  {
    label: "Opening",
    icon: Megaphone,
    items: ["Reveal motion", "Grand-opening creative", "Social", "Email", "Events", "F&B launch"],
  },
  {
    label: "Ongoing activation",
    icon: RefreshCw,
    items: ["Seasonal campaigns", "Tenant promotions", "Event creative", "Local programming", "Hospitality offers"],
  },
] as const;

const CANA_CLIENT_USE_CASES = [
  { icon: Film, title: "Project reveal", text: "Turn a completed place into a cinematic asset that makes the work easy to understand and share." },
  { icon: Layers3, title: "Case study", text: "Package the concept, execution, tenant mix, and experience into a repeatable sales story." },
  { icon: Presentation, title: "Pursuit / pitch", text: "Give executive audiences a polished visual narrative around a new hospitality or mixed-use opportunity." },
  { icon: Megaphone, title: "B2B content", text: "Create LinkedIn, email, and landing-page content that keeps Cana's work visible between active pursuits." },
] as const;

export default function CanaPage() {
  return (
    <div id="top" className={`${fraunces.variable} cana-theme archer-studio min-h-screen`}>
      <header className="cana-nav">
        <a href="#top" className="cana-brand" aria-label="Cana and Archer collaboration concept">
          <span className="cana-brand-main">CANA × ARCHER</span>
          <span className="cana-brand-sub">Private collaboration concept</span>
        </a>
        <nav className="cana-nav-links" aria-label="Page navigation">
          <a href="#creative">Creative</a>
          <a href="#fit">Opportunity</a>
          <a href="#workflow">How it works</a>
          <a href="#proof">Proof</a>
        </nav>
        <a href="mailto:hello@archerdesign.shop?subject=Cana%20x%20Archer%20collaboration" className="cana-nav-cta">
          Discuss the opportunity
        </a>
      </header>

      <main>
        <section className="cana-hero">
          <video
            className="cana-hero-video"
            src="/tcrm/videos/bar-social.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="cana-hero-overlay" aria-hidden="true" />
          <div className="cana-shell cana-hero-inner">
            <div className="cana-hero-copy">
              <p className="cana-eyebrow">Cana × Archer Design · private collaboration concept</p>
              <h1>From placemaking<br />to market-facing momentum.</h1>
              <p className="cana-hero-lead">
                Cana defines, develops, leases, and activates distinctive places. Archer can add flexible hospitality creative production around the moments those places, operators, and tenants need to launch something, promote something, fill something, or tell the story of what has been created.
              </p>
              <div className="cana-hero-actions">
                <a href="#fit" className="cana-btn">Explore the opportunity <ArrowRight size={16} /></a>
                <a href="#creative" className="cana-btn-ghost">See the work <ArrowRight size={16} /></a>
              </div>
              <div className="cana-hero-flow" aria-label="Potential collaboration workflow">
                <div><strong>CANA</strong><span>Define → Develop → Lease → Activate</span></div>
                <div className="cana-flow-center"><span>Real-world moments</span><strong>OPEN · PROGRAM · PROMOTE · GROW</strong></div>
                <div><strong>ARCHER</strong><span>Campaigns → Motion → Content → Production</span></div>
              </div>
            </div>

            <aside className="cana-hero-card">
              <p className="cana-card-kicker">The opportunity</p>
              <h2>One place can create dozens of moments worth marketing.</h2>
              <p>
                Archer can become the production layer behind openings, restaurant launches, tenant campaigns, events, seasonal programming, hospitality experiences, and the business-development story around the project itself.
              </p>
              <div className="cana-card-rule" />
              <span>Complementary capacity — not a replacement for Cana's strategy.</span>
            </aside>
          </div>
          <div className="cana-hero-fade" aria-hidden="true" />
        </section>

        <section className="cana-context-strip" aria-label="Selected public Cana projects">
          <div className="cana-shell">
            <p>Public Cana project context</p>
            <div className="cana-context-list">
              {PUBLIC_PROJECTS.map((project) => <span key={project}>{project}</span>)}
            </div>
          </div>
        </section>

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <div className="cana-heading-grid">
              <div>
                <p className="cana-eyebrow dark">The creative opportunity</p>
                <h2>One destination can create dozens of marketing moments.</h2>
              </div>
              <p>
                A successful hospitality or mixed-use destination rarely has only one thing to promote. Openings, restaurants, tenants, events, seasonal programming, meetings, and new concepts continually create demand for finished creative.
              </p>
            </div>
            <div className="cana-moments-grid">
              {MOMENTS.map(([title, text]) => (
                <article key={title} className="cana-moment-card">
                  <span>{title}</span>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <p className="cana-production-line">Archer can become the production layer behind those moments.</p>
          </div>
        </section>

        <section id="creative" className="cana-section cana-motion">
          <div className="cana-shell">
            <div className="cana-heading-grid cana-heading-on-dark">
              <div>
                <p className="cana-eyebrow">Hospitality + experience motion</p>
                <h2>Creative that makes the place feel active.</h2>
              </div>
              <p>
                Motion built around rooms, restaurants, bars, events, amenities, and guest experiences—the kinds of assets that help an active place stay visible after launch.
              </p>
            </div>
            <div className="cana-gallery-dark mt-10">
              <MotionPortfolioGallery items={TCRM_VIDEOS} />
            </div>
            <p className="cana-media-note">Existing Archer Design work shown as capability reference. Unrelated to Cana Development.</p>
          </div>
        </section>

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <div className="cana-heading-grid">
              <div>
                <p className="cana-eyebrow dark">Campaign production</p>
                <h2>From one experience to a full campaign system.</h2>
              </div>
              <p>
                Hotels, restaurants, events, meetings, packages, seasonal offers, and property-level promotions—shown as real production work, not speculative mockups for Cana.
              </p>
            </div>
            <div className="cana-gallery-light mt-10">
              <WorkPageStillsGallery items={TCRM_IMAGES} />
            </div>
            <p className="cana-media-note dark-note">Existing Archer Design work shown as capability reference. Unrelated to Cana Development.</p>
          </div>
        </section>

        <section id="fit" className="cana-section cana-ink">
          <div className="cana-shell">
            <p className="cana-eyebrow">Where the overlap gets interesting</p>
            <h2 className="cana-display">Three ways Archer could support the Cana ecosystem.</h2>
            <div className="cana-fit-grid">
              {FITS.map((fit) => {
                const Icon = fit.icon;
                return (
                  <article key={fit.num} className="cana-fit-card">
                    <div className="cana-fit-top"><span>{fit.num}</span><Icon size={22} /></div>
                    <h3>{fit.title}</h3>
                    <p>{fit.body}</p>
                    <div className="cana-tag-row">{fit.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cana-section cana-sand">
          <div className="cana-shell cana-desk-grid">
            <div>
              <p className="cana-eyebrow dark">One possible model</p>
              <h2>A flexible creative desk for active places.</h2>
              <p className="cana-copy-dark">
                For a Cana project, operator, or tenant with recurring needs, Archer can provide production capacity without requiring another full-time creative hire. The priority can change week to week; the production layer stays available.
              </p>
            </div>
            <div className="cana-desk-card">
              <div><small>This week</small><strong>Opening announcement</strong></div>
              <div><small>Next week</small><strong>Restaurant event</strong></div>
              <div><small>Next month</small><strong>Seasonal campaign</strong></div>
              <div><small>Ongoing</small><strong>Motion + social + digital assets</strong></div>
              <div className="cana-desk-flow"><span>Cana / operator priority</span><ArrowRight size={18}/><span>Archer production</span><ArrowRight size={18}/><span>Finished campaign assets</span></div>
            </div>
          </div>
        </section>

        <section id="workflow" className="cana-section cana-light">
          <div className="cana-shell">
            <div className="cana-heading-grid">
              <div>
                <p className="cana-eyebrow dark">Project lifecycle</p>
                <h2>The need changes as the place comes to life.</h2>
              </div>
              <p>Archer does not need to be present for every phase. The model works best when creative capacity appears exactly where a project, operator, or tenant needs it.</p>
            </div>
            <div className="cana-phase-grid">
              {PHASES.map((phase) => {
                const Icon = phase.icon;
                return (
                  <article key={phase.label} className="cana-phase-card">
                    <Icon size={22}/>
                    <h3>{phase.label}</h3>
                    <ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cana-section cana-ink">
          <div className="cana-shell">
            <div className="cana-heading-grid cana-heading-on-dark">
              <div>
                <p className="cana-eyebrow">Not only referrals</p>
                <h2>Archer could also help Cana tell the story of its work.</h2>
              </div>
              <p>
                A placemaking project contains multiple stories—the concept, the operators, the physical environment, the guest experience, and the activity it creates. Those stories can become business-development assets.
              </p>
            </div>
            <div className="cana-use-grid">
              {CANA_CLIENT_USE_CASES.map((item) => {
                const Icon = item.icon;
                return <article key={item.title}><Icon size={20}/><h3>{item.title}</h3><p>{item.text}</p></article>;
              })}
            </div>
            <p className="cana-pullquote">This is not about changing Cana's strategy. It is about creating additional production capacity around how that strategy is presented.</p>
          </div>
        </section>

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">Mutual opportunity</p>
            <h2 className="cana-display dark-display">The relationship can create opportunity both ways.</h2>
            <div className="cana-referral-grid">
              <article>
                <div className="cana-referral-head"><Building2 size={22}/><span>Cana → Archer</span></div>
                <ul>
                  <li>Operator needs ongoing creative</li>
                  <li>F&B tenant needs launch support</li>
                  <li>Opening needs campaign production</li>
                  <li>Venue needs event creative</li>
                  <li>Team needs flexible production capacity</li>
                </ul>
              </article>
              <div className="cana-handshake"><Handshake size={34}/><span>Mutual opportunity</span></div>
              <article>
                <div className="cana-referral-head"><Hotel size={22}/><span>Archer → Cana</span></div>
                <ul>
                  <li>Owner evaluating redevelopment</li>
                  <li>Hotel exploring F&B activation</li>
                  <li>Mixed-use hospitality opportunity</li>
                  <li>Destination / food-hall concept</li>
                  <li>Owner needs placemaking expertise</li>
                </ul>
              </article>
            </div>
            <p className="cana-fine-print">Each company remains independent. Opportunities can be handled individually based on what the client actually needs.</p>
          </div>
        </section>

        <section className="cana-section cana-sand">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">Illustrative project flow</p>
            <h2 className="cana-display dark-display">One project. A clear handoff. No unnecessary overlap.</h2>
            <div className="cana-project-flow">
              <div><strong>CANA</strong><span>Defines, develops, leases, and activates the destination.</span></div>
              <ArrowRight aria-hidden="true" />
              <div><strong>NEW CONCEPT OPENS</strong><span>A restaurant, venue, hotel experience, tenant, or programmed space needs market-facing creative.</span></div>
              <ArrowRight aria-hidden="true" />
              <div><strong>ARCHER</strong><span>Creates launch motion, social campaigns, email creative, event assets, digital ads, and follow-up promotion.</span></div>
            </div>
          </div>
        </section>

        <section id="proof" className="cana-section cana-ink">
          <div className="cana-shell">
            <div className="cana-heading-grid cana-heading-on-dark">
              <div>
                <p className="cana-eyebrow">Existing Archer proof</p>
                <h2>Hospitality creative built for real property activity.</h2>
              </div>
              <p>Existing tracked hospitality work demonstrates production volume and campaign experience. It is not a forecast of results for Cana or any future client.</p>
            </div>
            <div className="cana-proof-grid">
              {PROOF_STATS.map((stat) => {
                const Icon = stat.icon;
                return <article key={stat.label}><Icon size={20}/><strong>{stat.value}</strong><span>{stat.label}</span></article>;
              })}
            </div>
            <p className="cana-fine-print on-dark">{PROOF_DISCLAIMER}</p>
          </div>
        </section>

        <section className="cana-final">
          <div className="cana-shell cana-final-inner">
            <p className="cana-eyebrow dark">A practical first step</p>
            <h2>There may be more than one way for this to work.</h2>
            <p>
              The first step does not need to be a formal partnership. We can identify one live project, operator, tenant, or business-development need where the overlap is useful—and see how the workflow performs in practice.
            </p>
            <div className="cana-hero-actions final-actions">
              <a href="mailto:hello@archerdesign.shop?subject=Cana%20x%20Archer%20first%20project" className="cana-btn dark-btn">Explore a first project <ArrowRight size={16}/></a>
              <a href="#creative" className="cana-btn-ghost light-ghost">View hospitality work <ArrowRight size={16}/></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="cana-footer">
        <div className="cana-shell">
          <div>
            <strong>CANA × ARCHER DESIGN</strong>
            <span>Private collaboration concept</span>
          </div>
          <p>
            Independent speculative concept prepared by Archer Design for discussion with Cana Development. Not commissioned, sponsored, endorsed, or approved by Cana Development. No partnership or referral arrangement currently exists.
          </p>
          <p>Public Cana company/project context referenced from placemakingworks.com.</p>
        </div>
      </footer>
    </div>
  );
}
