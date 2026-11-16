import { readFile } from "node:fs/promises";
import path from "node:path";
import { CREATIVE_PLANS, PRICING_SCOPE_NOTE, type CreativePlan } from "@/lib/creative-pricing";

export const dynamic = "force-static";

const ROI_PRICE_STACK = `
 <div class="price-stack">
 ${CREATIVE_PLANS.map((plan) => `<div class="price-row${plan.recommended ? " featured" : ""}">
 <span>${plan.name}</span>
 <strong>${plan.price}${plan.period === "one-time" ? " one-time" : plan.period}</strong>
 <em>${plan.features[0]}</em>
 </div>`).join("")}
 </div>
`;

function pricingCard(plan: CreativePlan) {
  return `<article class="current-pricing-card${plan.recommended ? " is-featured" : ""}">
    ${plan.recommended ? '<span class="current-pricing-recommended">Recommended</span>' : ""}
    <p class="current-pricing-label">${plan.kind === "monthly" ? plan.name : plan.eyebrow}</p>
    <h3>${plan.title}</h3>
    <div class="current-pricing-price">${plan.price}<span>${plan.period}</span></div>
    <p class="current-pricing-copy">${plan.description}</p>
    <ul>${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
    <a class="pricing-button" href="/contact?plan=${plan.id}">${plan.cta}</a>
  </article>`;
}

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
      <h2>One project. Or ongoing creative support.</h2>
      <p>Start with a defined deliverable, or reserve monthly creative capacity for your team. Scope, revisions and timing are agreed before kickoff.</p>
    </div>
    <article class="current-pricing-card is-featured" style="min-height:0;margin-bottom:36px">
      <p class="current-pricing-label">Fixed-scope projects</p>
      <h3>Investor decks, websites and dashboards.</h3>
      <p class="current-pricing-copy">Send the materials you have, the outcome you need and your deadline. I will confirm the deliverables, fixed project quote and revision allowance before work starts.</p>
      <a class="pricing-button" href="/contact?service=project">Scope a project →</a>
    </article>
    <div class="current-pricing-monthly-head">
      <div>
        <p class="current-pricing-subhead">Monthly partnerships</p>
        <h3>Choose the capacity your team needs.</h3>
      </div>
      <p>Monthly fees reserve the stated creative capacity across an agreed workload. They are not per-property asset bundles.</p>
    </div>
    <div class="current-pricing-main-grid">
      ${CREATIVE_PLANS.filter((plan) => plan.kind === "monthly").map(pricingCard).join("")}
    </div>
    <div class="current-pricing-low-grid" style="margin-top:36px;margin-bottom:0">
      ${CREATIVE_PLANS.filter((plan) => plan.kind !== "monthly").map(pricingCard).join("")}
    </div>
    <p class="current-pricing-note">${PRICING_SCOPE_NOTE}</p>
    <div class="current-pricing-cta"><a href="/packages">View all engagement details →</a></div>
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
