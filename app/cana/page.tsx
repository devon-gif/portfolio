import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Film,
  Handshake,
  Hotel,
  Images,
  Layers3,
  Megaphone,
  Percent,
  Presentation,
  Repeat,
  RefreshCw,
  Rocket,
  Share2,
  Sparkles,
  Store,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { CanaMotionGallery } from "./CanaMotionGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { CANA_VIDEOS, CANA_IMAGES } from "./cana-media";
import { PROOF_STATS, PROOF_DISCLAIMER } from "../tcrm/tcrm-content";
import { ACTIVATION_TIERS, fmtMoney } from "../tcrm/tcrm-pricing";

const PAGE_TITLE = "Cana × Archer Design Collaboration Concept";
const PAGE_DESCRIPTION =
  "A private collaboration concept exploring how Archer Design could add flexible restaurant, bar, event, and hospitality creative production around Cana Development’s places, tenants, and operators.";

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
  ["F&B", "Promote restaurants, bars, menus, specials, and culinary moments."],
  ["Events", "Turn programming, live music, and gatherings into finished campaigns."],
  ["Opening", "Reveal the place and give people a reason to show up."],
  ["Tenants", "Give individual concepts launch-ready creative without adding internal headcount."],
  ["Seasonal", "Keep the destination visible with recurring reasons to return."],
  ["Hospitality", "Support hotel, meeting, guest-experience, and property-level campaigns."],
] as const;

const FITS = [
  {
    num: "01",
    title: "Extend Cana’s creative capacity",
    icon: Sparkles,
    body: "Archer can support Cana’s existing marketing and activation work when there’s a need for more production bandwidth, specialized motion, campaign volume, or short-term overflow.",
    tags: ["Motion", "Campaign production", "Social creative", "Event creative", "F&B promotions", "Launch assets", "Digital production"],
    key: "Cana keeps the strategy and relationship. Archer adds production capacity when useful.",
  },
  {
    num: "02",
    title: "Optional tenant + operator creative support",
    icon: Store,
    body: "Restaurants, bars, food-hall tenants, hotel operators, and hospitality concepts may need more recurring creative support than the normal destination-level marketing program provides. Archer can provide additional production capacity when a tenant’s needs extend beyond the normal scope or volume Cana’s core team wants to absorb.",
    tags: ["Monthly creative support", "F&B campaigns", "Events", "Social graphics", "Motion", "Email creative", "Digital ads", "Seasonal promotions", "Launch support"],
    key: "Cana can connect an operator with additional creative capacity without absorbing every recurring production request internally.",
  },
  {
    num: "03",
    title: "Create recurring partner value",
    icon: Repeat,
    body: "If a Cana-introduced tenant or operator becomes an ongoing Archer client, Cana could participate in the recurring value of that relationship. Cana introduces the opportunity. Archer manages the additional creative relationship. The tenant receives dedicated production capacity, and Cana participates in an agreed share of eligible recurring subscription revenue.",
    tags: ["Proposed model", "Introduction only", "Subject to mutual agreement"],
    key: "This is a proposed commercial model, not an existing agreement — see the recurring-partner section below.",
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
  { icon: Film, title: "Project-reveal films", text: "Turn a completed place into a cinematic asset that makes the work easy to understand and share." },
  { icon: Layers3, title: "Case studies", text: "Package the concept, execution, tenant mix, and experience into a repeatable sales story." },
  { icon: Presentation, title: "Pursuit decks", text: "Give executive audiences a polished visual narrative around a new hospitality or mixed-use opportunity." },
  { icon: Presentation, title: "Pitch presentations", text: "Support new-business pitches with finished, presentation-ready visual materials." },
  { icon: Images, title: "Hospitality capability materials", text: "Show the full range of what a Cana destination can offer operators and tenants." },
  { icon: Rocket, title: "Destination launch assets", text: "Build the campaign-ready materials a new destination needs on day one." },
  { icon: Share2, title: "LinkedIn / B2B content", text: "Create ongoing content that keeps Cana’s work visible between active pursuits." },
  { icon: Images, title: "Portfolio storytelling", text: "Turn finished projects into a cohesive, shareable body of work." },
] as const;

const MUTUAL_CANA_TO_ARCHER = [
  "Restaurant tenant needs more monthly production",
  "Bar needs recurring campaigns",
  "Hotel operator needs ongoing creative",
  "New tenant launch",
  "Event-heavy venue",
  "Seasonal marketing support",
];

const MUTUAL_ARCHER_TO_CANA = [
  "Food-hall opportunity",
  "Hospitality redevelopment",
  "Restaurant / F&B development",
  "Mixed-use destination",
  "Hotel F&B activation",
  "Placemaking / development expertise",
];

const MONTHLY_EXAMPLES = [
  "Weekly promotions",
  "Monthly menus",
  "Live music",
  "Happy hours",
  "Seasonal campaigns",
  "Tenant launches",
  "Events",
  "Digital ads",
  "Social motion",
  "Email",
  "Special offers",
  "Local programming",
];

const MONTHLY_TIER_KEYS = ["essential", "growth", "full"] as const;

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
              <p className="cana-eyebrow">Cana × Archer Design · Private collaboration concept</p>
              <h1>From active places<br />to active campaigns.</h1>
              <p className="cana-hero-lead">
                Cana defines, develops, leases, operates, markets, and activates distinctive places. Archer could add another layer of flexible creative production when a destination, tenant, restaurant, hospitality operator, or event needs more campaign capacity, specialized motion, or ongoing content support.
              </p>
              <div className="cana-hero-actions">
                <a href="#fit" className="cana-btn">Explore the opportunity <ArrowRight size={16} /></a>
                <a href="#creative" className="cana-btn-ghost">See the work <ArrowRight size={16} /></a>
              </div>
              <div className="cana-hero-flow" aria-label="Potential collaboration workflow">
                <div><strong>CANA</strong><span>Define → Develop → Lease → Operate → Activate</span></div>
                <div className="cana-flow-center"><span>Real-world moments</span><strong>OPEN · PROGRAM · PROMOTE · GROW</strong></div>
                <div><strong>ARCHER</strong><span>Campaigns → Motion → Content → Production</span></div>
              </div>
            </div>

            <aside className="cana-hero-card">
              <p className="cana-card-kicker">The opportunity</p>
              <h2>A living destination creates dozens of campaign-ready moments.</h2>
              <p>
                Cana’s restaurants, bars, tenants, events, and programming already keep these places active. Archer can add production capacity — motion, campaigns, and content — when that activity needs more than the core team wants to absorb internally.
              </p>
              <div className="cana-card-rule" />
              <span>This is an extension of capacity — not a replacement for Cana’s existing marketing team.</span>
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
                A successful hospitality or mixed-use destination rarely has only one thing to promote. Restaurants, bars, events, tenants, openings, seasonal programming, and new concepts continually create demand for finished creative.
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
                <p className="cana-eyebrow">Food, drink, events, experiences</p>
                <h2>The things that keep a place active.</h2>
              </div>
              <p>
                Cana’s destinations live through the restaurants, bars, programming, tenants, events, and experiences inside them. Archer’s motion work can turn those everyday moments into campaign-ready content built to keep the destination visible.
              </p>
            </div>
            <div className="cana-gallery-dark mt-10">
              <CanaMotionGallery items={CANA_VIDEOS} />
            </div>
            <p className="cana-media-note">Existing Archer Design work shown as capability reference. Unrelated to Cana Development.</p>
          </div>
        </section>

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <div className="cana-heading-grid">
              <div>
                <p className="cana-eyebrow dark">Always-on campaign production</p>
                <h2>The place becomes a constant stream of campaigns.</h2>
              </div>
              <p>
                Menus change. Events get added. New tenants open. Seasonal programming begins. Restaurants launch specials. Venues need promotion. Archer can turn those moments into finished campaign assets without adding more production burden to Cana’s core team.
              </p>
            </div>
            <div className="cana-gallery-light mt-10">
              <WorkPageStillsGallery items={CANA_IMAGES} />
            </div>
            <p className="cana-media-note dark-note">Existing Archer Design work shown as capability reference. Unrelated to Cana Development.</p>
          </div>
        </section>

        <section id="fit" className="cana-section cana-ink">
          <div className="cana-shell">
            <p className="cana-eyebrow">Where the overlap gets interesting</p>
            <h2 className="cana-display">Three ways Archer could fit alongside Cana.</h2>
            <div className="cana-fit-grid">
              {FITS.map((fit) => {
                const Icon = fit.icon;
                return (
                  <article key={fit.num} className="cana-fit-card">
                    <div className="cana-fit-top"><span>{fit.num}</span><Icon size={22} /></div>
                    <h3>{fit.title}</h3>
                    <p>{fit.body}</p>
                    <div className="cana-tag-row">{fit.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <p className="cana-fit-key">{fit.key}</p>
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

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">One possible model</p>
            <h2 className="cana-display dark-display">Cana Creative Extension</h2>
            <p className="cana-copy-dark" style={{ maxWidth: "640px" }}>
              Optional premium production support for active tenants and hospitality operators. Cana’s existing marketing services remain intact — Archer simply becomes another production resource available when a tenant or operator needs more.
            </p>
            <div className="cana-extension">
              <div className="cana-extension-node is-ink">
                <strong>CANA</strong>
                <div className="cana-extension-tags">
                  {["Strategy", "Placemaking", "Programming", "Marketing", "Tenant relationship"].map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <ArrowDown className="cana-extension-arrow" size={22} aria-hidden="true" />
              <div className="cana-extension-node is-connector">
                <span className="cana-extension-connector-text">Operator needs additional capacity</span>
              </div>
              <ArrowDown className="cana-extension-arrow" size={22} aria-hidden="true" />
              <div className="cana-extension-node">
                <strong>ARCHER</strong>
                <div className="cana-extension-tags">
                  {["Motion", "Campaigns", "F&B", "Social", "Events", "Email", "Digital"].map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <ArrowDown className="cana-extension-arrow" size={22} aria-hidden="true" />
              <div className="cana-extension-node is-connector">
                <span className="cana-extension-connector-text">Ongoing creative support</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cana-section cana-sand">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">Ongoing creative demand</p>
            <h2 className="cana-display dark-display">The need doesn’t stop after opening night.</h2>
            <p className="cana-copy-dark" style={{ maxWidth: "660px" }}>
              Restaurants run specials. Bars create programming. Food halls host events. Hotels promote packages. Tenants launch seasonal campaigns. Destinations continually need new reasons for people to return. Archer can provide ongoing monthly creative production around those recurring needs.
            </p>
            <div className="cana-tag-row" style={{ marginTop: "26px" }}>
              {MONTHLY_EXAMPLES.map((item) => <span key={item} style={{ borderColor: "rgba(23,25,21,.16)", color: "#6b655b" }}>{item}</span>)}
            </div>
            <div className="cana-tier-row">
              {MONTHLY_TIER_KEYS.map((key) => {
                const tier = ACTIVATION_TIERS.find((t) => t.key === key)!;
                return (
                  <article key={key}>
                    <strong>{fmtMoney(tier.retail)}</strong>
                    <em>/ month</em>
                    <span>{tier.name}{tier.badge ? ` · ${tier.badge}` : ""}</span>
                  </article>
                );
              })}
            </div>
            <p className="cana-fine-print">Current Archer monthly production pricing, shown for reference — not a proposal specific to Cana or any tenant.</p>
          </div>
        </section>

        <section className="cana-section cana-light">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">Potential recurring model</p>
            <h2 className="cana-display dark-display">When a referred client stays, the value can continue.</h2>
            <p className="cana-copy-dark" style={{ maxWidth: "700px" }}>
              One possible structure is for Cana to receive an agreed share of eligible monthly subscription revenue from Cana-introduced tenants or hospitality operators, for as long as those referred accounts remain active, paid Archer clients.
            </p>
            <div className="cana-percent-wrap">
              <div>
                <div className="cana-percent-num"><Percent size={30} aria-hidden="true" /> TBD</div>
                <p className="cana-percent-label">Proposed model<br />Subject to mutual agreement</p>
              </div>
              <div className="cana-percent-copy">
                <p>
                  No specific referral share is proposed on this page. A percentage would need to be discussed and agreed with Cana directly — nothing here implies Michael or Cana has agreed to any figure.
                </p>
                <p className="cana-percent-terms">
                  Final referral percentage, eligibility, payment timing, term, cancellations, refunds, client ownership, and other commercial terms would be documented separately.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cana-section cana-sand">
          <div className="cana-shell">
            <p className="cana-eyebrow dark">A useful option, not a requirement</p>
            <h2 className="cana-display dark-display">Cana keeps the relationship. Archer can work behind the scenes.</h2>
            <div className="cana-whitelabel">
              <p>
                For projects where Cana wants to remain the primary client-facing partner, Archer could potentially provide production behind Cana’s existing marketing and activation team.
              </p>
              <div className="cana-tag-row">
                {["High-volume campaign periods", "Motion", "Large event calendars", "Tenant launch packages", "Seasonal pushes", "Special projects", "Portfolio case studies"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
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
                <h2>Archer could also support Cana directly.</h2>
              </div>
              <p>
                A placemaking project contains multiple stories — the concept, the operators, the physical environment, the guest experience, and the activity it creates. Those stories can become business-development assets.
              </p>
            </div>
            <div className="cana-use-grid">
              {CANA_CLIENT_USE_CASES.map((item) => {
                const Icon = item.icon;
                return <article key={item.title}><Icon size={20}/><h3>{item.title}</h3><p>{item.text}</p></article>;
              })}
            </div>
            <p className="cana-pullquote">The larger opportunity may be extending Cana’s existing capabilities, not replacing them.</p>
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
                  {MUTUAL_CANA_TO_ARCHER.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
              <div className="cana-handshake"><Handshake size={34}/><span>Mutual opportunity</span></div>
              <article>
                <div className="cana-referral-head"><Hotel size={22}/><span>Archer → Cana</span></div>
                <ul>
                  {MUTUAL_ARCHER_TO_CANA.map((item) => <li key={item}>{item}</li>)}
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
              The first step does not need to be a formal partnership. We can identify one live project, operator, tenant, or business-development need where the overlap is useful — and see how the workflow performs in practice.
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
