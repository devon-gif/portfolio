import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

const ROI_PRICE_STACK = `
 <div class="price-stack">
 <div class="price-row">
 <span>One-off</span>
 <strong>$75 static / $95 motion</strong>
 <em>buy only what you need</em>
 </div>
 <div class="price-row">
 <span>Creative Lite</span>
 <strong>$299.99/mo</strong>
 <em>up to 4 finished assets each month</em>
 </div>
 <div class="price-row">
 <span>Essentials</span>
 <strong>$800/mo</strong>
 <em>4–6 finished assets each month</em>
 </div>
 <div class="price-row featured">
 <span>Growth</span>
 <strong>$1,000/mo</strong>
 <em>8–10 finished assets each month</em>
 </div>
 <div class="price-row">
 <span>Portfolio Studio</span>
 <strong>$1,200/mo</strong>
 <em>12–16 finished assets each month</em>
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
    max-width: 900px;
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

  .current-pricing-low-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-bottom: 56px;
  }

  .current-pricing-main-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
    max-width: 760px;
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
    max-width: 800px;
    margin: 30px auto 0;
    color: rgba(248, 241, 230, 0.48);
    font-size: 12px;
    line-height: 1.6;
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
      <p class="packages-kicker">Pricing</p>
      <h2>Start small, stay flexible, or plug Archer in as your monthly creative team.</h2>
      <p>
        You do not have to start with a large retainer. Buy a single asset when you need it, keep a small monthly creative lane open, or choose a fuller property-level partnership.
      </p>
    </div>

    <div class="current-pricing-low-grid">
      <article class="current-pricing-card">
        <p class="current-pricing-label">One-off creative</p>
        <h3>Buy only what you need.</h3>
        <div class="current-pricing-price">$75<span>static</span></div>
        <div class="current-pricing-price" style="font-size: 31px; margin-top: 12px;">$95<span>motion</span></div>
        <p class="current-pricing-copy">
          Need one graphic for an event, restaurant special, package, or quick motion piece? Choose the exact mix with no monthly commitment.
        </p>
        <ul>
          <li>Static graphic — $75 each</li>
          <li>Motion graphic — $95 each</li>
          <li>One consolidated minor revision round</li>
          <li>Finished campaign-ready files</li>
          <li>One property or brand</li>
        </ul>
        <a class="pricing-button" href="/contact?service=one-off-creative">Request one-off creative →</a>
      </article>

      <article class="current-pricing-card is-featured">
        <p class="current-pricing-label">Low-commitment monthly</p>
        <h3>Creative Lite</h3>
        <div class="current-pricing-price">$299.99<span>/mo</span></div>
        <p class="current-pricing-copy">
          A small recurring creative lane for properties that need dependable support but are not ready for a full monthly program.
        </p>
        <ul>
          <li>Up to 4 finished assets each month</li>
          <li>Up to 1 motion piece; remaining assets are static</li>
          <li>Captions included</li>
          <li>One consolidated minor revision round</li>
          <li>One property or brand</li>
          <li>Month-to-month — cancel anytime</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=creative-lite-299">Choose Creative Lite →</a>
      </article>
    </div>

    <div class="current-pricing-monthly-head">
      <div>
        <p class="current-pricing-subhead">Monthly partnerships</p>
        <h3>Property-level creative support at $800, $1,000, or $1,200 per month.</h3>
      </div>
      <p>Rates are per active property or brand. Multi-property scopes can be coordinated under one workflow and invoice.</p>
    </div>

    <div class="current-pricing-main-grid">
      <article class="current-pricing-card">
        <p class="current-pricing-label">Essentials</p>
        <h3>Focused monthly support</h3>
        <div class="current-pricing-price">$800<span>/mo</span></div>
        <p class="current-pricing-copy">A focused monthly creative rhythm for one active property or brand.</p>
        <ul>
          <li>4–6 finished creative assets each month</li>
          <li>Static + short-form motion mix</li>
          <li>Seasonal, local-demand, F&B, or event promos</li>
          <li>Captions included</li>
          <li>One monthly planning touchpoint</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=essentials-800">Choose Essentials →</a>
      </article>

      <article class="current-pricing-card is-featured">
        <span class="current-pricing-recommended">Recommended</span>
        <p class="current-pricing-label">Growth</p>
        <h3>Active campaign support</h3>
        <div class="current-pricing-price">$1,000<span>/mo</span></div>
        <p class="current-pricing-copy">More room for active campaigns, motion, events, F&B, and ongoing property storytelling.</p>
        <ul>
          <li>8–10 finished creative assets each month</li>
          <li>Regular motion / short-form video</li>
          <li>Campaign planning across property revenue moments</li>
          <li>F&B, event, package, meeting, or wedding support</li>
          <li>Monthly performance recap</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=growth-1000">Choose Growth →</a>
      </article>

      <article class="current-pricing-card">
        <p class="current-pricing-label">Portfolio Studio</p>
        <h3>Broader outside creative studio</h3>
        <div class="current-pricing-price">$1,200<span>/mo</span></div>
        <p class="current-pricing-copy">The broader outside creative-studio role for properties with higher volume and more channels to support.</p>
        <ul>
          <li>12–16 finished creative assets each month</li>
          <li>Priority motion and campaign production</li>
          <li>Full monthly content calendar</li>
          <li>Email / landing-page creative support</li>
          <li>Event, F&B, seasonal, and sales-campaign support</li>
          <li>Reporting and monthly optimization</li>
        </ul>
        <a class="pricing-button" href="/contact?plan=portfolio-studio-1200">Choose Portfolio Studio →</a>
      </article>
    </div>

    <p class="current-pricing-note">
      All monthly plans are month-to-month unless a separate agreement says otherwise. Final scope is confirmed before kickoff so the asset mix matches the property's actual campaign calendar.
    </p>

    <div class="current-pricing-cta">
      <a href="https://calendly.com/devonavich0/30min" target="_blank" rel="noopener">Talk through the right fit →</a>
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
    .replace("One monthly creative system", "Flexible creative support")
    .replace(
      "One workflow for photos, clips, reels, social graphics, F&B promos, event creative, and approval-ready content. Built to scale across a hospitality portfolio.",
      "One workflow for one-off assets, monthly creative, F&B promos, event support, and approval-ready content. Built to scale from one property to a hospitality portfolio.",
    )
    .replace(
      "<strong>Portfolio advantage:</strong>\n the more properties you add, the more the creative system, templates, approvals, and brand standards compound.",
      "<strong>Start where you need:</strong> choose a single asset, a small monthly lane, or fuller property-level creative support — then scale when the workload justifies it.",
    )
    .replace(
      '<a class="roi-cta" href="/archer-preview/book/">Build a portfolio creative plan →</a>',
      '<a class="roi-cta" href="/contact">Talk through the right fit →</a>',
    );

  html = html.replace(
    /<section id="packages" class="packages-section luxe-reveal">[\s\S]*?<\/section>/,
    CURRENT_PRICING_SECTION,
  );

  if (!html.includes("$299.99") || !html.includes("$1,200")) {
    throw new Error("Current Archer pricing was not injected into the legacy homepage.");
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
