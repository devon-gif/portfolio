"use client";

import { useEffect, useMemo, useState } from "react";

const chefInputs = [
  "Profile",
  "Menu",
  "Experiences",
  "Photography",
  "Availability",
  "Booking data",
];

const outputs = [
  {
    number: "01",
    title: "Premium microsite",
    copy: "A chef-first digital presence that feels custom, elevated and ready to convert interest into bookings — even when the starting assets are limited.",
  },
  {
    number: "02",
    title: "Booking funnel",
    copy: "Clear experience pages, stronger calls to action and a cleaner path from discovery to inquiry or reservation.",
  },
  {
    number: "03",
    title: "Social launch kit",
    copy: "Polished launch posts, story formats and evergreen templates built from the chef’s existing Cootoh profile and available imagery.",
  },
  {
    number: "04",
    title: "Motion content",
    copy: "Existing stills — even ordinary or imperfect photos — can be rebuilt into premium motion using Photoshop, After Effects, VFX and AI-assisted image and video workflows.",
  },
  {
    number: "05",
    title: "Campaign content",
    copy: "Seasonal dinners, celebrations, corporate events, holidays and private experiences packaged into bookable stories without requiring a brand-new shoot every time.",
  },
  {
    number: "06",
    title: "Reusable brand system",
    copy: "Typography, layout, visual language and repeatable creative rules that keep future content consistent across still, motion and digital touchpoints.",
  },
];

const benefits = [
  ["Higher-value onboarding", "A premium creative tier can become an optional paid upgrade instead of an outside agency search."],
  ["Better marketplace quality", "Every participating chef looks more polished, differentiated and ready for premium buyers."],
  ["More from existing assets", "A small library of stills can become motion, campaigns and launch content instead of sitting unused or forcing another photo shoot."],
  ["Stronger retention", "Cootoh becomes more than booking infrastructure — it becomes a chef growth system."],
  ["New revenue", "The creative layer can be productized with a clear scope, turnaround and economic model."],
  ["Distribution flywheel", "Better presentation creates more sharing, more traffic, more bookings and more product learning."],
];

const waysToStart = [
  {
    tag: "POSSIBLE PILOT",
    title: "Pilot the Premium Chef Launch",
    copy: "Choose one strong Cootoh chef. Archer builds the first complete launch package, then we document what repeats, what should stay custom and what could eventually be automated.",
  },
  {
    tag: "DIRECT SUPPORT",
    title: "Archer supports Cootoh",
    copy: "Use Archer directly for product design, landing pages, decks, VFX, still-to-motion transformation, launch creative, UX and sales materials when Cootoh needs extra bandwidth.",
  },
  {
    tag: "NETWORK",
    title: "Reciprocal referrals",
    copy: "Cootoh surfaces chefs and hospitality businesses that need creative. Archer surfaces hotels, venues and operators where Cootoh fits.",
  },
];

const stills = [
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-holiday-billboard.png",
    alt: "Eliza Hot Metal Bistro holiday campaign artwork",
    label: "Seasonal campaign",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-burgers-poster.png",
    alt: "Eliza Hot Metal Bistro burger promotion",
    label: "Offer creative",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-july-menu.png",
    alt: "Eliza Hot Metal Bistro July menu design",
    label: "Menu system",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-june-menu.png",
    alt: "Eliza Hot Metal Bistro June menu design",
    label: "Monthly campaign",
  },
  {
    src: "/tcrm/images/eliza-hot-metal-bistro-may-menu.png",
    alt: "Eliza Hot Metal Bistro May menu design",
    label: "F&B identity",
  },
  {
    src: "/tcrm/images/minty-fresh-beverage-art-direction.png",
    alt: "Minty Fresh beverage art direction",
    label: "Art direction",
  },
];

const motion = [
  { src: "/infuse/videos/floating-food.mp4", label: "Food art direction" },
  { src: "/infuse/videos/chef-plating.mp4", label: "Chef storytelling" },
  { src: "/infuse/videos/floating-forks.mp4", label: "Motion system" },
  { src: "/tcrm/videos/chocolate-sauce-pancakes.mp4", label: "Brunch campaign" },
  { src: "/tcrm/videos/waffle-pour.mp4", label: "Food motion" },
  { src: "/tcrm/videos/bar-social.mp4", label: "Restaurant atmosphere" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CootohLanding() {
  const [progress, setProgress] = useState(0);
  const [activeOutput, setActiveOutput] = useState(0);
  const output = useMemo(() => outputs[activeOutput], [activeOutput]);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => observer.observe(el));
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="cootoh-page">
      <div className="cootoh-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="cootoh-nav">
        <a className="cootoh-lockup" href="#top" aria-label="Cootoh and Archer Design concept home">
          <span>COOTOH</span>
          <i>×</i>
          <span>ARCHER</span>
        </a>
        <nav aria-label="Page navigation">
          <a href="#system">The system</a>
          <a href="#work">Work</a>
          <a href="#hotel">Hotel angle</a>
          <a className="cootoh-nav-cta" href="#pilot">Explore a pilot</a>
        </nav>
      </header>

      <section className="cootoh-hero" id="top">
        <video className="cootoh-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/infuse/posters/floating-sushi.jpg">
          <source src="/infuse/videos/floating-sushi.mp4" type="video/mp4" />
        </video>
        <div className="cootoh-hero-overlay" />
        <div className="cootoh-hero-grain" aria-hidden="true" />

        <div className="cootoh-hero-shell">
          <div className="cootoh-hero-kicker">EXPLORATORY CONCEPT PREPARED FOR COOTOH</div>
          <h1>
            From chef profile to
            <span> booking-ready brand.</span>
          </h1>
          <p>
            A potential creative and marketing layer for the Cootoh Chef Operating System — using existing chef data and imagery to build premium microsites, campaigns, motion and guest-facing experiences. This is a starting idea for discussion, not a finalized partnership model.
          </p>
          <div className="cootoh-hero-actions">
            <a href="#system" className="cootoh-btn cootoh-btn-solid">
              See the concept <ArrowIcon />
            </a>
            <a href="https://archerdesign.shop/devon" target="_blank" rel="noreferrer" className="cootoh-btn cootoh-btn-ghost">
              About Devon
            </a>
          </div>
        </div>

        <div className="cootoh-hero-foot">
          <span>COOTOH × ARCHER DESIGN</span>
          <span>Exploratory partnership concept · nothing finalized</span>
          <span>2026</span>
        </div>
      </section>

      <section className="cootoh-intro cootoh-section">
        <div className="cootoh-shell cootoh-intro-grid">
          <div data-reveal>
            <span className="cootoh-eyebrow">THE OPPORTUNITY</span>
            <h2 className="cootoh-display">Cootoh already has the ingredients.</h2>
          </div>
          <div className="cootoh-intro-copy" data-reveal>
            <p className="cootoh-lead">
              Cootoh is already collecting the information a chef needs to operate and get booked. That same information — plus whatever photography already exists — could power a premium customer-facing marketing system.
            </p>
            <p>
              The starting photos do not have to be perfect. Archer can retouch, rebuild, composite and animate existing still imagery using Photoshop, After Effects, VFX and AI-assisted tools, creating motion and campaign content without requiring a new production shoot for every launch.
            </p>
          </div>
        </div>

        <div className="cootoh-ingredient-rail" data-reveal>
          {chefInputs.map((item, index) => (
            <div className="cootoh-ingredient" key={item}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cootoh-system cootoh-section" id="system">
        <div className="cootoh-shell">
          <div className="cootoh-system-heading" data-reveal>
            <span className="cootoh-eyebrow">THE BIG IDEA</span>
            <h2 className="cootoh-display">One profile. An entire launch system.</h2>
            <p>Cootoh provides the structured chef intelligence. Archer could turn that data — and even a small or imperfect photo library — into the visual and marketing layer customers experience.</p>
          </div>

          <div className="cootoh-flow" data-reveal>
            <div className="cootoh-flow-card is-source">
              <span className="cootoh-flow-tag">01 · COOTOH</span>
              <strong>Chef joins Cootoh</strong>
              <p>Profile, menus, services, photos, booking details, availability and experience data.</p>
            </div>
            <div className="cootoh-flow-arrow" aria-hidden="true"><ArrowIcon /></div>
            <div className="cootoh-flow-card is-engine">
              <span className="cootoh-flow-tag">02 · ARCHER</span>
              <strong>Creative transformation</strong>
              <p>Retouch stills, improve weak source imagery, build composites, add VFX and turn static assets into premium motion and launch-ready creative.</p>
            </div>
            <div className="cootoh-flow-arrow" aria-hidden="true"><ArrowIcon /></div>
            <div className="cootoh-flow-card is-result">
              <span className="cootoh-flow-tag">03 · MARKET</span>
              <strong>Bookable brand</strong>
              <p>Microsite, booking funnel, social, motion, campaigns and a reusable visual system.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cootoh-output cootoh-section">
        <div className="cootoh-shell cootoh-output-layout">
          <div className="cootoh-output-menu" data-reveal>
            <span className="cootoh-eyebrow">ONE POSSIBLE PREMIUM CHEF LAUNCH</span>
            <h2 className="cootoh-display">What one chef could receive.</h2>
            <div className="cootoh-output-tabs" role="tablist" aria-label="Premium chef launch outputs">
              {outputs.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeOutput === index}
                  className={activeOutput === index ? "is-active" : ""}
                  onClick={() => setActiveOutput(index)}
                  key={item.number}
                >
                  <span>{item.number}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="cootoh-output-stage" data-reveal>
            <video autoPlay muted loop playsInline preload="metadata">
              <source src={activeOutput % 2 === 0 ? "/infuse/videos/chef-plating.mp4" : "/infuse/videos/floating-food.mp4"} type="video/mp4" />
            </video>
            <div className="cootoh-output-shade" />
            <div className="cootoh-output-card">
              <span>{output.number}</span>
              <h3>{output.title}</h3>
              <p>{output.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cootoh-motion-break" aria-label="Archer motion example">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/tcrm/videos/chocolate-sauce-pancakes.mp4" type="video/mp4" />
        </video>
        <div className="cootoh-motion-break-overlay" />
        <div className="cootoh-motion-copy" data-reveal>
          <span>STILL FRAME → MOTION</span>
          <h2 className="cootoh-display">Make existing imagery feel alive.</h2>
        </div>
      </section>

      <section className="cootoh-scale cootoh-section">
        <div className="cootoh-shell">
          <div className="cootoh-scale-heading" data-reveal>
            <span className="cootoh-eyebrow">BUILT TO SCALE</span>
            <h2 className="cootoh-display">Productized, not another agency project.</h2>
            <p>The value is in building a repeatable workflow: use the chef information and imagery already available, improve what needs help, create motion where stills are enough, and reserve new shoots for the moments that truly require them.</p>
          </div>

          <div className="cootoh-compare" data-reveal>
            <div className="cootoh-compare-col is-muted">
              <span>TRADITIONAL AGENCY</span>
              <ul>
                <li>New discovery process every time</li>
                <li>Custom scope and scattered assets</li>
                <li>New production often required</li>
                <li>Different deliverables for every chef</li>
                <li>Difficult to scale</li>
              </ul>
            </div>
            <div className="cootoh-compare-vs">VS</div>
            <div className="cootoh-compare-col is-bright">
              <span>POTENTIAL COOTOH × ARCHER SYSTEM</span>
              <ul>
                <li>Cootoh data starts the process</li>
                <li>Existing stills can become motion</li>
                <li>Photos can be retouched, rebuilt and elevated</li>
                <li>Repeatable output library</li>
                <li>Designed for automation and scale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cootoh-work cootoh-section" id="work">
        <div className="cootoh-shell">
          <div className="cootoh-work-heading" data-reveal>
            <span className="cootoh-eyebrow">ARCHER FOOD + HOSPITALITY CREATIVE</span>
            <h2 className="cootoh-display">Still in. Motion out.</h2>
            <p>Much of the opportunity is not about constantly shooting new footage. Archer can take existing photography — including stills that feel flat, dated or limited — and extend them through retouching, compositing, VFX, Photoshop, After Effects and AI-assisted motion. The examples below show the kind of food and hospitality production that could sit behind a Cootoh chef tier.</p>
          </div>
        </div>

        <div className="cootoh-motion-grid">
          {motion.map((item, index) => (
            <figure className={`cootoh-motion-card card-${index + 1}`} data-reveal key={item.src}>
              <video autoPlay muted loop playsInline preload="metadata">
                <source src={item.src} type="video/mp4" />
              </video>
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="cootoh-still-grid">
          {stills.map((item) => (
            <figure className="cootoh-still-card" data-reveal key={item.src}>
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="cootoh-benefits cootoh-section">
        <div className="cootoh-shell cootoh-benefits-layout">
          <div className="cootoh-benefits-sticky" data-reveal>
            <span className="cootoh-eyebrow">WHY IT COULD HELP COOTOH</span>
            <h2 className="cootoh-display">Creative becomes part of the product.</h2>
            <p>Not decoration. A possible way to turn the content Cootoh already collects into stronger chef launches, a better marketplace and more value from every existing asset.</p>
          </div>
          <div className="cootoh-benefits-list">
            {benefits.map(([title, copy], index) => (
              <article data-reveal key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cootoh-hotel cootoh-section" id="hotel">
        <div className="cootoh-hotel-media">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src="/tcrm/videos/bar-social.mp4" type="video/mp4" />
          </video>
          <div className="cootoh-hotel-media-overlay" />
        </div>
        <div className="cootoh-shell cootoh-hotel-inner">
          <div data-reveal>
            <span className="cootoh-eyebrow">ONE POSSIBLE HOTEL ANGLE</span>
            <h2 className="cootoh-display">Private dining without operating a full restaurant.</h2>
          </div>
          <div className="cootoh-hotel-copy" data-reveal>
            <p className="cootoh-lead">A boutique hotel could use Cootoh to offer curated private-chef experiences while Archer handles the guest-facing launch — even when the property only has a handful of usable food or lifestyle photos.</p>
            <div className="cootoh-hotel-flow">
              <span>Boutique hotel</span>
              <i>→</i>
              <span>Cootoh chef</span>
              <i>→</i>
              <span>Archer campaign</span>
              <i>→</i>
              <span>Premium guest experience</span>
            </div>
            <div className="cootoh-experience-tags">
              <span>Chef in Your Suite</span>
              <span>Anniversary Dinner</span>
              <span>Executive Private Dining</span>
              <span>Family Chef Night</span>
              <span>Culinary Weekend Package</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cootoh-network cootoh-section">
        <div className="cootoh-shell">
          <div className="cootoh-network-heading" data-reveal>
            <span className="cootoh-eyebrow">REFERRALS + DISTRIBUTION</span>
            <h2 className="cootoh-display">Different services. Overlapping buyers.</h2>
          </div>
          <div className="cootoh-network-grid">
            <article data-reveal>
              <span className="cootoh-network-label">ARCHER → COOTOH</span>
              <h3>Hospitality operators who need a chef solution.</h3>
              <p>Boutique hotels, independent hotels, resorts, spas, event venues, restaurants and hospitality consultants.</p>
            </article>
            <article data-reveal>
              <span className="cootoh-network-label">COOTOH → ARCHER</span>
              <h3>Chefs and hospitality brands that need stronger presentation.</h3>
              <p>Private chefs, chef entrepreneurs, caterers, restaurants, venues and hospitality startups needing web, campaigns, motion or help turning underwhelming source photos into polished guest-facing creative.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="cootoh-archer cootoh-section">
        <div className="cootoh-shell">
          <div className="cootoh-archer-top" data-reveal>
            <div>
              <span className="cootoh-eyebrow">WHY ARCHER</span>
              <h2 className="cootoh-display">Hospitality creative, motion transformation and a product-builder mindset.</h2>
            </div>
            <p>Archer works where hospitality marketing, design, motion and technology overlap. A major part of that is making more from the assets a client already has: repairing weak imagery, extending stills, building composites and using Photoshop, After Effects, VFX and AI to create polished motion without a long production chain.</p>
          </div>

          <div className="cootoh-stats" data-reveal>
            <div><strong>18.6M+</strong><span>tracked impressions</span></div>
            <div><strong>4.9M+</strong><span>reach</span></div>
            <div><strong>612K+</strong><span>engagements</span></div>
            <div><strong>2.7K+</strong><span>creative pieces</span></div>
          </div>

          <div className="cootoh-capabilities" data-reveal>
            <span>Still photo → motion</span>
            <span>Photoshop + compositing</span>
            <span>After Effects + VFX</span>
            <span>AI image + video workflows</span>
            <span>Hospitality campaigns</span>
            <span>Motion + short form</span>
            <span>Microsites + landing pages</span>
            <span>Product UI</span>
            <span>Next.js + TypeScript</span>
            <span>Supabase + Vercel</span>
          </div>
        </div>
      </section>

      <section className="cootoh-start cootoh-section" id="pilot">
        <div className="cootoh-shell">
          <div className="cootoh-start-heading" data-reveal>
            <span className="cootoh-eyebrow">POTENTIAL WAYS TO START</span>
            <h2 className="cootoh-display">Nothing here is written in stone.</h2>
            <p>This page is meant to make the possibilities tangible. The actual relationship, scope, pricing and workflow would be shaped together around what is most useful for Cootoh and its chefs.</p>
          </div>
          <div className="cootoh-start-grid">
            {waysToStart.map((item, index) => (
              <article className={index === 0 ? "is-featured" : ""} data-reveal key={item.title}>
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cootoh-final">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/tcrm/videos/waffle-pour.mp4" type="video/mp4" />
        </video>
        <div className="cootoh-final-overlay" />
        <div className="cootoh-final-inner" data-reveal>
          <span className="cootoh-eyebrow">ONE POSSIBLE NEXT STEP</span>
          <h2 className="cootoh-display">Start with one chef.</h2>
          <p>If the idea feels useful, select one existing Cootoh chef, test a Premium Chef Launch, document what works and use the pilot to decide whether there is a repeatable partnership worth building. Nothing needs to be predetermined.</p>
          <div className="cootoh-pilot-steps" aria-label="Pilot process">
            <span>Pilot</span><i>→</i><span>Refine</span><i>→</i><span>Productize</span><i>→</i><span>Scale</span>
          </div>
          <a className="cootoh-btn cootoh-btn-solid" href="mailto:heydevon@gmail.com?subject=Cootoh%20Premium%20Chef%20Pilot">
            Explore the first chef <ArrowIcon />
          </a>
        </div>
      </section>

      <footer className="cootoh-footer">
        <div className="cootoh-lockup"><span>COOTOH</span><i>×</i><span>ARCHER</span></div>
        <p>Private exploratory concept prepared for Jarrett Applewhite / Cootoh. This is an idea for a potential partnership only — no relationship, scope, pricing or structure shown here is finalized or written in stone.</p>
        <div>
          <a href="https://archerdesign.shop" target="_blank" rel="noreferrer">Archer Design</a>
          <a href="https://archerdesign.shop/devon" target="_blank" rel="noreferrer">Devon Archer</a>
        </div>
      </footer>
    </div>
  );
}
