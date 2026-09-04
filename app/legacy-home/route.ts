import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

const ROI_PRICE_STACK = `
 <div class="price-stack">
 <div class="price-row">
 <span>30-day pilot</span>
 <strong>$3,500 one-time</strong>
 <em>up to 30 hours of focused creative support</em>
 </div>
 <div class="price-row">
 <span>Essential Creative</span>
 <strong>$1,299/mo</strong>
 <em>up to 10 hours of dependable production support</em>
 </div>
 <div class="price-row">
 <span>Creative Support</span>
 <strong>$2,500/mo</strong>
 <em>approximately 20 hours of broader creative capacity</em>
 </div>
 <div class="price-row featured">
 <span>Creative + Marketing</span>
 <strong>$4,500/mo</strong>
 <em>approximately 40 hours of production + marketing execution</em>
 </div>
 <div class="price-row">
 <span>Embedded Creative</span>
 <strong>$7,500/mo</strong>
 <em>approximately 65–70 hours of fractional team capacity</em>
 </div>
 <div class="price-row">
 <span>Priority Partnership</span>
 <strong>$10K–$12K+/mo</strong>
 <em>high-volume, multi-property or multi-concept support</em>
 </div>
 </div>
`;

const CURRENT_PRICING_SECTION = `
<style id="current-pricing-guide-style">
  .current-pricing-section {
    background: #100f0d !important;
    color: #f8f1e6 !important;
  }

  .current-pricing-section .packages-inner {
    width: min(1320px, calc(100% - 96px));
    margin: 0 auto;
  }

  .current-pricing-section .packages-heading {
    max-width: 920px;
    margin: 0 auto 52px;
    text-align: center;
  }

  .current-pricing-section .packages-heading h2 {
    max-width: 980px;
    margin-left: auto;
    margin-right: auto;
  }

  .current-pricing-low-grid,
  .current-pricing-main-grid {
    display: grid;
    gap: 20px;
  }

  .current-pricing-low-grid,
  .current-pricing-main-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .current-pricing-low-grid {
    margin-bottom: 56px;
  }

  .current-pricing-card {
    position: relative;
    display: flex;
    min-height: 100%;
    flex-direction: column;
    border: 1px solid rgba(248, 241, 230, 0.13);
    background: #1b1916;
    padding: 34px;
  }

  .current-pricing-card.is-featured {
    border-color: rgba(206, 157, 69, 0.52);
    background: #24211d;
    box-shadow: inset 0 0 0 1px rgba(206, 157, 69, 0.08);
  }

  .current-pricing-label,
  .current-pricing-subhead {
    color: #d2a44f;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }

  .current-pricing-card h3 {
    margin: 16px 0 0;
    color: #fff8ec;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .current-pricing-price {
    margin-top: 16px;
    color: #fff8ec;
    font-size: clamp(34px, 3.4vw, 50px);
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.055em;
  }

  .current-pricing-price span {
    margin-left: 5px;
    color: rgba(248, 241, 230, 0.55);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
  }

  .current-pricing-copy {
    margin: 22px 0 0;
    color: rgba(248, 241, 230, 0.67);
    font-size: 15px;
    line-height: 1.65;
  }

  .current-pricing-card ul {
    margin: 28px 0 0;
    padding: 24px 0 0;
    border-top: 1px solid rgba(248, 241, 230, 0.12);
    list-style: none;
  }

  .current-pricing-card li {
    position: relative;
    margin: 0 0 14px;
    padding-left: 20px;
    color: rgba(248, 241, 230, 0.7);
    font-size: 14px;
    line-height: 1.55;
  }

  .current-pricing-card li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #d2a44f;
  }

  .current-pricing-card .pricing-button {
    width: fit-content;
    margin-top: auto;
    padding-top: 18px;
    color: #fff8ec;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .current-pricing-card .pricing-button:hover {
    color: #d2a44f;
  }

  .current-pricing-monthly-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 28px;
    margin-bottom: 28px;
  }

  .current-pricing-monthly-head h3 {
    max-width: 820px;
    margin: 10px 0 0;
    color: #fff8ec;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: clamp(34px, 4vw, 54px);
    font-weight: 400;
    line-height: 1.02;
    letter-spacing: -0.045em;
  }

  .current-pricing-monthly-head p {
    max-width: 420px;
    margin: 0;
    color: rgba(248, 241, 230, 0.52);
    font-size: 13px;
    line-height: 1.55;
  }

  .current-pricing-recommended {
    display: inline-flex;
    width: fit-content;
    margin-bottom: 16px;
    border: 1px solid rgba(210, 164, 79, 0.34);
    padding: 7px 10px;
    color: #d2a44f;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .current-pricing-note {
    max-width: 920px;
    margin: 30px auto 0;
    color: rgba(248, 241, 230, 0.48);
    font-size: 12px;
    line-height: 1.65;
    text-align: center;
  }

  .current-pricing-cta {
    display: flex;
    justify-content: center;
    margin-top: 34px;
  }

  .current-pricing-cta a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 56px;
    padding: 0 30px;
    border-radius: 999px;
    background: #f8f1e6;
    color: #171411;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
  }

  @media (max-width: 900px) {
    .current-pricing-section .packages-inner {
      width: min(100% - 40px, 1320px);
    }

    .current-pricing-low-grid,
    .current-pricing-main-grid {
      grid-template-columns: 1fr;
    }

    .current-pricing-monthly-head {
      align-items: start;
      flex-direction: column;
    }
  }
</style>

<section id="packages" class="packages-section current-pricing-section luxe-reveal">
  <div class="packages-inner">
    <div class="packages-heading">
      <p class="packages-kicker">Engagement options</p>
      <h2>Flexible support. Built around the workload.</h2>
      <p>
        Your team may need anything from occasional creative help to hands-on support across multiple properties or concepts. Start at the level that makes sense now and expand only where additional support proves useful.
      </p>
    </div>

    <div class="current-pricing-low-grid">
      <article class="current-pricing-card is-featured">
        <p class="current-pricing-label">Not sure where to start?</p>
        <h3>30-Day Creative Pilot</h3>
        <div class="current-pricing-price">$3,500<span>one-time</span></div>
        <p class="current-pricing-copy">
          A short first engagement designed to learn your workflow, take pressure off the current team, and determine what level of ongoing support actually makes sense.
        </p>
        <ul>
          <li>Up to 30 hours of support</li>
          <li>Design and creative production</li>
          <li>Social content and motion / reels</li>
          <li>Menus, events, campaigns, and promotional assets</li>
          <li>One weekly check-in</li>
          <li>Priority turnaround</li>
          <li>Review of the current workflow and creative queue</li>
          <li>End-of-month recommendation for ongoing support</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=30-day-creative-pilot">Start with the pilot →</a>
      </article>

      <article class="current-pricing-card">
        <p class="current-pricing-label">High-volume / multi-property</p>
        <h3>Priority Creative Partnership</h3>
        <div class="current-pricing-price">$10K<span>+/mo</span></div>
        <p class="current-pricing-copy">
          For high-volume, multi-property or multi-concept teams that want Archer functioning as an embedded external creative department. Typical scopes land around $10K–$12K+ per month depending on workload.
        </p>
        <ul>
          <li>Unlimited request queue</li>
          <li>2–3 active projects at a time</li>
          <li>Priority turnaround and high-priority access</li>
          <li>Creative direction, design, social, motion, and campaign production</li>
          <li>Multi-property / multi-concept production systems</li>
          <li>Weekly coordination</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=priority-creative-partnership">Talk through scope →</a>
      </article>
    </div>

    <div class="current-pricing-monthly-head">
      <div>
        <p class="current-pricing-subhead">Monthly partnerships</p>
        <h3>Choose the amount of creative and marketing capacity your team actually needs.</h3>
      </div>
      <p>Each step up adds more availability, faster turnaround, and more responsibility — not simply more graphics.</p>
    </div>

    <div class="current-pricing-main-grid">
      <article class="current-pricing-card">
        <p class="current-pricing-label">Essential Creative</p>
        <h3>Reliable production support</h3>
        <div class="current-pricing-price">$1,299<span>/mo</span></div>
        <p class="current-pricing-copy">Still primarily production — dependable creative help without a large ongoing commitment.</p>
        <ul>
          <li>Up to 10 hours of creative support per month</li>
          <li>Social graphics, menus, flyers, event creative, and email graphics</li>
          <li>Digital signage and existing-template updates</li>
          <li>Light motion / simple animated assets where appropriate</li>
          <li>One active request at a time</li>
          <li>Standard turnaround</li>
          <li>Monthly check-in</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=essential-creative-1299">Discuss this level →</a>
      </article>

      <article class="current-pricing-card">
        <p class="current-pricing-label">Creative Support</p>
        <h3>Broader creative capacity</h3>
        <div class="current-pricing-price">$2,500<span>/mo</span></div>
        <p class="current-pricing-copy">Broader production capacity for steady creative overflow across more categories.</p>
        <ul>
          <li>Approximately 20 hours of support per month</li>
          <li>Graphic design, menus, social creative, and campaign assets</li>
          <li>Event promotion, digital signage, and email creative</li>
          <li>Sales collateral and quick-turn marketing requests</li>
          <li>Photo retouching and cleanup</li>
          <li>Turning existing stills into short-form motion</li>
          <li>Up to 2 active requests at a time</li>
          <li>Regular monthly planning call</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=creative-support-2500">Discuss this level →</a>
      </article>

      <article class="current-pricing-card is-featured">
        <span class="current-pricing-recommended">Recommended</span>
        <p class="current-pricing-label">Creative + Marketing Partner</p>
        <h3>Production + ongoing marketing execution</h3>
        <div class="current-pricing-price">$4,500<span>/mo</span></div>
        <p class="current-pricing-copy">For teams that want Archer involved in both creative production and recurring marketing execution.</p>
        <ul>
          <li>Approximately 40 hours of monthly support</li>
          <li>Everything in Creative Support</li>
          <li>Social media management for up to 3 selected concepts / accounts</li>
          <li>Content calendars, captions, scheduling, and publishing</li>
          <li>Campaign planning and execution</li>
          <li>Motion graphics, reels, and still-to-motion creative</li>
          <li>Email marketing and landing-page creative</li>
          <li>Sales / proposal support and content repurposing</li>
          <li>Light analytics / monthly performance review</li>
          <li>Priority turnaround and 2–3 active projects at once</li>
          <li>Weekly or biweekly marketing check-in</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=creative-marketing-partner-4500">Talk through scope →</a>
      </article>

      <article class="current-pricing-card">
        <p class="current-pricing-label">Embedded Creative Partner</p>
        <h3>A fractional extension of the marketing team</h3>
        <div class="current-pricing-price">$7,500<span>/mo</span></div>
        <p class="current-pricing-copy">Designed for periods when a hospitality team needs meaningful additional marketing capacity without adding another full-time role.</p>
        <ul>
          <li>Approximately 65–70 hours of monthly capacity</li>
          <li>Multi-property / multi-concept creative support</li>
          <li>Ongoing social media management and campaign execution</li>
          <li>Advanced photo retouching, compositing, and VFX-driven motion</li>
          <li>Menus, events, email, digital, web, and landing-page creative</li>
          <li>Sales enablement / proposal support</li>
          <li>Asset and workflow organization + multi-brand template systems</li>
          <li>Priority production capacity and faster turnaround</li>
          <li>Up to 3 active projects at once</li>
          <li>Weekly planning and direct team collaboration</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=embedded-creative-partner-7500">Talk through scope →</a>
      </article>
    </div>

    <p class="current-pricing-note">
      Additional or outside-scope support can be quoted separately or handled at $125/hour with approval. Large website builds, full brand development, extensive video production, paid media spend, printing, photography, travel, and specialized technical services are scoped separately. Reasonable revisions within the approved project scope are included; turnaround depends on complexity and the active production queue.
    </p>

    <div class="current-pricing-cta">
      <a href="https://calendly.com/devonavich0/30min" target="_blank" rel="noopener">Talk through the workload →</a>
    </div>
  </div>
</section>
`;

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "archer-preview", "index.html");
  const source = await readFile(filePath, "utf8");

  let html = source;

  html = html.replace(
    /<div class="price-stack">[\s\S]*?(?=\s*<div class="roi-callout">)/,
    ROI_PRICE_STACK,
  );

  html = html
    .replace("One creative desk gets cheaper as your portfolio grows.", "One creative partner, scaled to the workload.")
    .replace("One monthly creative system", "Flexible creative support")
    .replace(
      "One workflow for photos, clips, reels, social graphics, F&B promos, event creative, and approval-ready content. Built to scale across a hospitality portfolio.",
      "One workflow for design, social, motion, campaigns, F&B, events, digital creative, and approval-ready content. Start with a focused lane and scale into embedded support as the workload grows.",
    )
    .replace(
      /<div class="roi-callout">[\s\S]*?<\/div>\s*<a class="roi-cta"[^>]*>[^<]*<\/a>/,
      `<div class="roi-callout"><strong>Capacity, not asset-count pricing:</strong> each level adds more availability, faster turnaround, and more responsibility — not simply more graphics.</div>\n <a class="roi-cta" href="/contact">Talk through the right fit →</a>`,
    );

  html = html.replace(
    /<section id="packages" class="packages-section luxe-reveal">[\s\S]*?<\/section>/,
    CURRENT_PRICING_SECTION,
  );

  if (!html.includes("$1,299") || !html.includes("$4,500") || !html.includes("$7,500")) {
    throw new Error("Updated Archer engagement pricing was not injected into the legacy homepage.");
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
