import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  Cpu,
  Handshake,
  Layers3,
  LineChart,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { fraunces } from "@/components/marketing/studioFont";
import { absoluteUrl } from "@/lib/seo";
import { MotionPortfolioGallery } from "@/components/marketing/MotionPortfolioGallery";
import { WorkPageStillsGallery } from "@/components/marketing/WorkPageStillsGallery";
import { HeroVideoBackground } from "../tcrm/components/HeroVideoBackground";
import { Reveal } from "../tcrm/components/Reveal";
import { TCRM_IMAGES, TCRM_VIDEOS } from "../tcrm/tcrm-media";

const PAGE_TITLE = "RCC Hospitality Consulting × Archer Design";
const PAGE_DESCRIPTION =
  "A private working concept for RCC Hospitality Consulting and Archer Design: operational strategy paired with hospitality creative, digital, and campaign execution.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/rcc") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const PROOF = [
  ["18.6M+", "Tracked impressions"],
  ["4.9M+", "Reach"],
  ["612K+", "Engagements"],
  ["2.7K+", "Creative pieces"],
];

const RCC_SCOPE = [
  "Operational systems, standards, and process improvement",
  "Leadership development, team performance, and service quality",
  "F&B operational improvement and multi-property consistency",
  "Practical technology adoption and workflow modernization",
  "Client relationship, discovery, and operational strategy",
];

const ARCHER_SCOPE = [
  "Property-level campaigns, social creative, motion, and short-form video",
  "F&B, events, packages, weddings, meetings, and seasonal promotions",
  "Email campaign creative, landing pages, and guest-facing digital execution",
  "Brand-safe toolkits, templates, and repeatable content systems",
  "UX, dashboards, rapid prototypes, and AI-assisted digital experiences",
];

const MODELS = [
  {
    icon: Handshake,
    tag: "Simple",
    title: "Referral Partner",
    copy: "RCC identifies a creative or digital need during an engagement and introduces Archer. Archer contracts directly with the client, while RCC stays focused on operations and leadership.",
    money: "Proposed referral share: 10% of collected Archer fees for the first 6 months of a referred client relationship.",
    example: "Illustrative: a $2,000/month Archer engagement would generate $200/month to RCC for six months — $1,200 total — without adding delivery work to Rachel's team.",
  },
  {
    icon: Layers3,
    tag: "Best fit",
    title: "RCC Creative Add-On",
    copy: "RCC keeps the client relationship and adds a creative execution layer to its own engagement. Archer fulfills the agreed production scope behind the scenes or as a visible specialist partner.",
    money: "RCC can package the service at its own client price and retain the difference between the client fee and the agreed Archer partner rate.",
    example: "Best for multi-property F&B, event, launch, repositioning, or operational-improvement engagements where RCC uncovers revenue opportunities that still need to be marketed.",
    recommended: true,
  },
  {
    icon: Sparkles,
    tag: "Strategic",
    title: "Joint Client Engagement",
    copy: "RCC and Archer pitch one coordinated solution when a property needs both operational improvement and guest-facing activation. Each party owns the part it does best.",
    money: "Commercial structure can be decided per opportunity: separate scopes, a shared proposal, or an agreed project split based on who sources and manages the engagement.",
    example: "This is the strongest model for larger hotel, resort, club, restaurant-group, or portfolio opportunities where operational and marketing gaps are connected.",
  },
];

export default function RccPage() {
  return (
    <div id="top" className={`${fraunces.variable} tcrm-theme rcc-theme archer-studio relative min-h-screen`}>
      <header className="rcc-header">
        <div className="tl-shell flex items-center justify-between gap-5 py-4">
          <a href="#top" className="rcc-logo-lockup" aria-label="RCC Hospitality Consulting and Archer Design partnership concept">
            <img
              src="https://a.favicon.im/rcchospitalityconsulting.com?larger=true"
              alt="RCC Hospitality Consulting"
              className="rcc-logo-icon"
            />
            <div>
              <div className="rcc-brand-name">RCC Hospitality Consulting</div>
              <div className="rcc-brand-sub">Partnership concept × Archer Design</div>
            </div>
          </a>
          <nav className="rcc-nav" aria-label="Page sections">
            <a href="#fit">The fit</a>
            <a href="#models">Partnership models</a>
            <a href="#work">Creative work</a>
            <a href="#next">Next step</a>
          </nav>
          <a href="#models" className="tl-btn hidden px-5 py-2.5 text-[12px] sm:inline-flex">
            Explore the models
          </a>
        </div>
      </header>

      <main>
        <section className="tl-hero--video">
          <HeroVideoBackground
            src="/tcrm/videos/tropical-resort-daylight.mp4"
            poster="/tcrm/images/tcrm-hero-poster.webp"
            alt="Hospitality resort setting"
          />
          <div className="tl-hero-overlay" aria-hidden="true" />
          <div className="tl-shell relative z-[3]">
            <Reveal className="tl-hero-content">
              <div className="rcc-hero-note">Prepared for Rachel Cimino · Working concept, not a contract</div>
              <p className="tl-eyebrow mt-5">RCC Hospitality Consulting × Archer Design</p>
              <span className="mt-4 block h-px w-12 bg-[#d8c3a9] opacity-90" aria-hidden="true" />
              <h1 className="mt-5 max-w-[14ch] text-[2.2rem] leading-[1.08] text-white sm:text-[3rem] lg:text-[3.45rem]">
                Operational strategy meets guest-facing execution.
              </h1>
              <p className="tl-hero-copy mt-5 max-w-[55ch] text-[15px] leading-[1.7]">
                RCC helps hospitality leaders build stronger systems, teams, service standards, and technology. Archer can extend that work into the campaigns, creative, email, digital experiences, and property-level activation that guests actually see.
              </p>

              <div className="rcc-partner-card mt-6">
                <strong>Simple premise:</strong> RCC identifies the operational and revenue opportunity. Archer helps turn the opportunity into finished guest-facing execution — without competing with RCC's core consulting work.
              </div>

              <div className="rcc-proof-grid mt-6">
                {PROOF.map(([value, label]) => (
                  <div key={label} className="rcc-proof">
                    <div className="rcc-proof-value">{value}</div>
                    <div className="rcc-proof-label">{label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3.5">
                <a href="#models" className="tl-btn">
                  See partnership options
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a href="#work" className="tl-btn-ghost tl-btn-ghost--on-dark">
                  View hospitality work
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
          <div className="tl-hero-fade" aria-hidden="true" />
        </section>

        <section id="fit" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Why the fit is clean</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                Two different parts of the same hospitality problem.
              </h2>
              <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                RCC's public positioning centers on operational systems, leadership, F&B execution, service quality, and practical technology adoption. Those engagements often reveal revenue opportunities that still need a guest-facing activation layer. Archer can fill that execution gap without asking RCC to become a marketing agency.
              </p>
            </Reveal>

            <div className="rcc-split mt-10">
              <Reveal className="rcc-card">
                <span className="rcc-pill"><Building2 className="h-3.5 w-3.5" /> RCC leads</span>
                <h3 className="mt-5 text-[1.65rem] leading-[1.2]">Inside the operation.</h3>
                <ul className="rcc-list">
                  {RCC_SCOPE.map((item) => (
                    <li key={item}><CheckCircle2 className="h-4 w-4" /><span>{item}</span></li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={2} className="rcc-card-dark">
                <span className="rcc-pill border-white/15 bg-white/10 text-[#e8ded2]"><Sparkles className="h-3.5 w-3.5" /> Archer extends</span>
                <h3 className="mt-5 text-[1.65rem] leading-[1.2]">What the guest sees.</h3>
                <ul className="rcc-list !text-white/70">
                  {ARCHER_SCOPE.map((item) => (
                    <li key={item}><CheckCircle2 className="h-4 w-4 !text-[#d8c3a9]" /><span>{item}</span></li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="rcc-band tl-section">
          <div className="tl-shell">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">The F&B opportunity</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                Fixing the operation is only half the revenue story.
              </h2>
              <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.8]">
                If RCC helps a hotel improve restaurant operations, events, service standards, or a multi-property F&B program, the client may still need campaigns that move people through the door: menu creative, event launches, happy hour, packages, weddings, local demand, email, motion, and social. That is a natural handoff instead of a competing service.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  [UtensilsCrossed, "RCC finds the opportunity", "Operational review surfaces the F&B, service, event, or revenue gap."],
                  [LineChart, "The offer is defined", "RCC helps shape the operationally realistic priority and desired outcome."],
                  [Sparkles, "Archer activates it", "Creative, motion, email, social, landing pages, and campaign assets go live."],
                ].map(([Icon, title, copy]) => {
                  const I = Icon as typeof UtensilsCrossed;
                  return (
                    <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                      <I className="h-5 w-5 text-[#d8c3a9]" />
                      <h3 className="mt-4 text-[1.2rem]">{String(title)}</h3>
                      <p className="mt-3 text-[13px] leading-[1.65]">{String(copy)}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="models" className="tl-section">
          <div className="tl-glow-teal" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Partnership models</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                Three ways RCC can benefit financially without changing what it does best.
              </h2>
              <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                These are conversation starters, not fixed commercial terms. The goal is to choose the lightest structure that creates a real incentive for RCC and a simple experience for the client.
              </p>
            </Reveal>

            <div className="rcc-model-grid mt-10">
              {MODELS.map((model, index) => {
                const Icon = model.icon;
                return (
                  <Reveal key={model.title} delay={((index % 3) + 1) as 1 | 2 | 3} className={`rcc-model-card${model.recommended ? " recommended" : ""}`}>
                    {model.recommended && <span className="rcc-recommended">Recommended</span>}
                    <span className="rcc-pill w-fit"><Icon className="h-3.5 w-3.5" /> {model.tag}</span>
                    <h3 className="rcc-model-title">{model.title}</h3>
                    <p className="rcc-model-copy">{model.copy}</p>
                    <div className="rcc-money"><BadgeDollarSign className="mr-1 inline h-4 w-4" /><strong>How RCC makes money:</strong> {model.money}</div>
                    <div className="rcc-example">{model.example}</div>
                  </Reveal>
                );
              })}
            </div>
            <p className="rcc-disclaimer">Any referral percentage, margin, partner rate, exclusivity, billing structure, or client ownership language would be documented separately and agreed by both parties before use.</p>
          </div>
        </section>

        <section className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">What a joint engagement could look like</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                One client problem. Clear ownership. No duplicated effort.
              </h2>
            </Reveal>
            <div className="rcc-flow mt-10">
              <Reveal className="rcc-flow-step">
                <div className="rcc-flow-num">01</div>
                <h3 className="mt-5 text-[1.25rem]">RCC diagnoses</h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[var(--tl-ink-soft)]">Rachel identifies operational, leadership, F&B, service, or technology issues and defines what needs to change inside the business.</p>
              </Reveal>
              <Reveal delay={2} className="rcc-flow-step">
                <div className="rcc-flow-num">02</div>
                <h3 className="mt-5 text-[1.25rem]">The opportunity is packaged</h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[var(--tl-ink-soft)]">Together, RCC and Archer decide whether the client also needs a promotional, creative, email, web, or digital-experience layer.</p>
              </Reveal>
              <Reveal delay={3} className="rcc-flow-step">
                <div className="rcc-flow-num">03</div>
                <h3 className="mt-5 text-[1.25rem]">Archer executes</h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[var(--tl-ink-soft)]">Archer builds the guest-facing assets and digital execution while RCC remains the operational authority and relationship lead where appropriate.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="tl-section">
          <div className="tl-shell">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Technology overlap</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                There is a second lane beyond marketing.
              </h2>
              <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                RCC's current positioning already includes practical hospitality technology and AI adoption. Archer can support that work on the experience layer — interface design, dashboards, workflow prototypes, lightweight tools, AI-assisted experiences, and implementation-ready product concepts.
              </p>
            </Reveal>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {[
                [Cpu, "Operational workflow prototype", "Turn a recurring manual process into a clickable or working prototype before a larger build."],
                [Layers3, "Dashboard or internal tool", "Design an interface around the data and actions operators actually need to see."],
                [Sparkles, "AI-assisted experience", "Prototype a focused AI workflow where automation supports — rather than replaces — hospitality teams."],
              ].map(([Icon, title, copy]) => {
                const I = Icon as typeof Cpu;
                return (
                  <Reveal key={String(title)} className="rcc-card">
                    <I className="h-5 w-5 text-[var(--tl-teal-deep)]" />
                    <h3 className="mt-4 text-[1.25rem]">{String(title)}</h3>
                    <p className="mt-3 text-[13.5px] leading-[1.7] text-[var(--tl-ink-soft)]">{String(copy)}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="work" className="tl-section">
          <div className="tl-glow-cyan" aria-hidden="true" />
          <div className="tl-shell relative">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Hospitality motion</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                The execution layer, shown rather than explained.
              </h2>
              <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">Selected motion work spanning hotels, resorts, F&B, weddings, events, and campaign concepts.</p>
            </Reveal>
            <Reveal delay={2} className="rcc-gallery-frame mt-9">
              <MotionPortfolioGallery items={TCRM_VIDEOS} />
            </Reveal>
          </div>
        </section>

        <section className="tl-section">
          <div className="tl-shell">
            <Reveal className="max-w-3xl">
              <p className="tl-eyebrow">Stills & campaigns</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.55rem]">
                Property-level work built for real revenue priorities.
              </h2>
              <p className="mt-5 max-w-[72ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">Hotels, restaurants, F&B, meetings, weddings, local demand, seasonal campaigns, and repeatable social systems.</p>
            </Reveal>
            <Reveal delay={2} className="rcc-gallery-frame mt-9">
              <WorkPageStillsGallery items={TCRM_IMAGES} />
            </Reveal>
          </div>
        </section>

        <section id="next" className="tl-section">
          <div className="tl-grid-field" aria-hidden="true" />
          <div className="tl-shell relative mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="tl-eyebrow">Suggested starting point</p>
              <h2 className="mt-4 text-[2rem] leading-[1.12] sm:text-[2.65rem]">
                Start with one real RCC client opportunity.
              </h2>
              <p className="mx-auto mt-5 max-w-[66ch] text-[15px] leading-[1.8] text-[var(--tl-ink-soft)]">
                Rather than building a complicated partnership before there is a project, the cleanest test is one client where RCC identifies a marketing, F&B activation, creative, email, or digital-experience need. We choose the commercial model together, deliver it well, then decide what is worth formalizing.
              </p>
              <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[var(--tl-line-strong)] bg-white/60 p-6 text-left">
                <p className="text-[12px] font-semibold uppercase tracking-[.15em] text-[var(--tl-teal-deep)]">Recommended pilot</p>
                <p className="mt-3 text-[14px] leading-[1.75] text-[var(--tl-ink-soft)]"><strong className="text-[var(--tl-ink)]">One 30-day client activation:</strong> RCC brings the opportunity, defines the operational/revenue priority, and stays involved. Archer handles the agreed creative/digital execution. At the end, both sides review client response, workflow, economics, and whether a repeatable partner offer makes sense.</p>
              </div>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <a href="mailto:heydevon@gmail.com?subject=RCC%20x%20Archer%20Partnership" className="tl-btn">
                  Discuss the partnership
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a href="https://rcchospitalityconsulting.com/" target="_blank" rel="noreferrer" className="tl-btn-ghost">
                  RCC Hospitality Consulting
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="rcc-footer">
        <div className="tl-shell flex flex-col items-center gap-3 text-center">
          <div className="font-semibold tracking-[.08em] text-[var(--tl-ink)]">RCC Hospitality Consulting × Archer Design</div>
          <p className="max-w-2xl">Private working concept prepared for Rachel Cimino. Proposed partnership structures are exploratory and subject to mutual agreement.</p>
          <p>© {new Date().getFullYear()} Archer Design · Private direct-link page</p>
        </div>
      </footer>
    </div>
  );
}
