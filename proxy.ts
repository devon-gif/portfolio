import { NextResponse, type NextRequest } from "next/server";

const SOURCE_URL = "https://www.archerdesign.shop/archer-preview/index.html";

const PRICING_CSS = String.raw`
<style id="archer-flex-pricing-2026">
  .flex-pricing-intro {
    margin: 22px 0 28px;
    padding: 18px 20px;
    border: 1px solid rgba(217, 182, 109, 0.22);
    background: rgba(217, 182, 109, 0.055);
  }

  .flex-pricing-intro strong {
    color: #d9b66d;
    font-weight: 650;
  }

  .flex-pricing-intro p {
    margin: 0;
    color: rgba(248, 241, 230, 0.64);
    font-size: 13.5px;
    line-height: 1.58;
  }

  .creative-builder {
    display: grid;
    gap: 12px;
    margin: 26px 0 22px;
  }

  .creative-builder-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 16px;
    align-items: center;
    padding: 16px 17px;
    border: 1px solid rgba(248, 241, 230, 0.11);
    background: rgba(0, 0, 0, 0.14);
  }

  .creative-builder-row.featured {
    border-color: rgba(184, 138, 53, 0.42);
    background: rgba(184, 138, 53, 0.09);
  }

  .creative-builder-name strong {
    display: block;
    color: #fff8ec;
    font-size: 15px;
    font-weight: 600;
  }

  .creative-builder-name span {
    display: block;
    margin-top: 4px;
    color: rgba(248, 241, 230, 0.46);
    font-size: 11.5px;
    line-height: 1.4;
  }

  .creative-builder-rate {
    min-width: 72px;
    color: rgba(248, 241, 230, 0.78);
    font-size: 13px;
    text-align: right;
    white-space: nowrap;
  }

  .creative-builder-rate strong {
    color: #d9b66d;
    font-size: 17px;
  }

  .creative-stepper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .creative-stepper button {
    width: 31px;
    height: 31px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid rgba(248, 241, 230, 0.18);
    background: rgba(255, 255, 255, 0.035);
    color: #f8f1e6;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
  }

  .creative-stepper button:hover:not(:disabled) {
    border-color: rgba(217, 182, 109, 0.58);
    background: rgba(217, 182, 109, 0.10);
  }

  .creative-stepper button:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  .creative-stepper output {
    width: 24px;
    color: #fff8ec;
    font-size: 16px;
    font-weight: 650;
    text-align: center;
  }

  .creative-builder-total {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    padding: 21px 0 2px;
    border-top: 1px solid rgba(248, 241, 230, 0.12);
  }

  .creative-builder-total span {
    color: rgba(248, 241, 230, 0.52);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.20em;
    text-transform: uppercase;
  }

  .creative-builder-total strong {
    color: #fff8ec;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 38px;
    font-weight: 400;
    line-height: 0.95;
  }

  .creative-builder-summary {
    margin: 8px 0 24px;
    color: rgba(248, 241, 230, 0.48);
    font-size: 12.5px;
    line-height: 1.55;
  }

  .starter-strip {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 28px;
    align-items: center;
    margin: 0 0 34px;
    padding: 26px 28px;
    border: 1px solid rgba(199, 154, 66, 0.34);
    background: rgba(199, 154, 66, 0.075);
  }

  .starter-strip-copy .package-label {
    margin-bottom: 9px;
  }

  .starter-strip-copy h3 {
    margin: 0;
    color: #fff9ee;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 25px;
    font-weight: 400;
  }

  .starter-strip-copy p {
    max-width: 650px;
    margin: 8px 0 0;
    color: rgba(247, 240, 229, 0.62);
    font-size: 13.5px;
    line-height: 1.55;
  }

  .starter-strip-price {
    color: #fff9ee;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 38px;
    line-height: 1;
    white-space: nowrap;
  }

  .starter-strip-price span {
    display: block;
    margin-top: 5px;
    color: rgba(247, 240, 229, 0.48);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .starter-strip a,
  .package-card .package-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 0 18px;
    border: 1px solid rgba(247, 240, 229, 0.22);
    color: #f7f0e5;
    text-decoration: none;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .starter-strip a:hover,
  .package-card .package-cta:hover {
    background: #f7f0e5;
    color: #12100e;
  }

  .package-card .package-cta {
    margin-top: 22px;
  }

  .package-counts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: 2px 0 24px;
  }

  .package-counts div {
    padding: 13px 10px;
    border: 1px solid rgba(247, 240, 229, 0.10);
    background: rgba(0, 0, 0, 0.10);
    text-align: center;
  }

  .package-counts strong {
    display: block;
    color: #fff9ee;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 25px;
    font-weight: 400;
    line-height: 1;
  }

  .package-counts span {
    display: block;
    margin-top: 6px;
    color: rgba(247, 240, 229, 0.44);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
  }

  .pricing-footnote {
    max-width: 880px;
    margin: 28px auto 0;
    color: rgba(247, 240, 229, 0.44);
    font-size: 12.5px;
    line-height: 1.6;
    text-align: center;
  }

  @media (max-width: 980px) {
    .creative-builder-row {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .creative-builder-rate {
      grid-column: 1;
      grid-row: 2;
      text-align: left;
    }

    .creative-stepper {
      grid-column: 2;
      grid-row: 1 / span 2;
    }

    .starter-strip {
      grid-template-columns: 1fr;
      gap: 18px;
    }

    .starter-strip a {
      width: 100%;
    }
  }
</style>
`;

const NEW_ROI = String.raw`
<section class="roi-section" id="pricing">
  <div class="roi-inner">
    <div class="roi-heading">
      <p class="roi-eyebrow">Flexible creative</p>
      <h2>Start with the work you need. Scale when it makes sense.</h2>
      <p>
        You do not need a retainer just to get strong creative. Order a few finished assets for a campaign, event, menu, offer, or social push — then move into monthly support only when the volume makes sense.
      </p>
    </div>

    <div class="roi-grid">
      <div class="roi-panel roi-old">
        <p class="roi-panel-kicker">The old way</p>
        <h3>A fragmented creative stack</h3>

        <div class="roi-line"><span>Social media manager</span><strong>$5,400/mo</strong></div>
        <div class="roi-line"><span>Monthly photo / video shoots</span><strong>$3,500/mo</strong></div>
        <div class="roi-line"><span>Freelance designer</span><strong>$2,500/mo</strong></div>
        <div class="roi-line"><span>Video editor</span><strong>$2,000/mo</strong></div>
        <div class="roi-line"><span>Agency / coordination overhead</span><strong>$5,000/mo</strong></div>

        <div class="roi-total"><span>Typical monthly burn</span><strong>$17,500+</strong></div>
        <div class="flex-pricing-intro">
          <p><strong>Or skip the stack.</strong> Send the assets you already have and buy only the finished creative you need right now.</p>
        </div>
      </div>

      <div class="roi-panel roi-new" id="on-demand-builder">
        <p class="roi-panel-kicker">On demand · no contract</p>
        <h3>Build your own creative pack</h3>
        <p class="roi-panel-copy">
          Choose any mix of static and motion assets. One project, one clear total, no monthly commitment.
        </p>

        <div class="creative-builder" data-creative-builder>
          <div class="creative-builder-row">
            <div class="creative-builder-name">
              <strong>Static creative</strong>
              <span>Social, F&amp;B, event, offer, or campaign graphic</span>
            </div>
            <div class="creative-builder-rate"><strong>$75</strong> each</div>
            <div class="creative-stepper">
              <button type="button" data-kind="static" data-delta="-1" aria-label="Decrease static graphics">−</button>
              <output data-static-count>4</output>
              <button type="button" data-kind="static" data-delta="1" aria-label="Increase static graphics">+</button>
            </div>
          </div>

          <div class="creative-builder-row featured">
            <div class="creative-builder-name">
              <strong>Motion creative</strong>
              <span>Short-form animated creative built for social</span>
            </div>
            <div class="creative-builder-rate"><strong>$95</strong> each</div>
            <div class="creative-stepper">
              <button type="button" data-kind="motion" data-delta="-1" aria-label="Decrease motion graphics">−</button>
              <output data-motion-count>2</output>
              <button type="button" data-kind="motion" data-delta="1" aria-label="Increase motion graphics">+</button>
            </div>
          </div>
        </div>

        <div class="creative-builder-total">
          <span>Your one-time total</span>
          <strong data-pack-total>$490</strong>
        </div>
        <p class="creative-builder-summary" data-pack-summary>4 static · 2 motion · 6 total assets</p>

        <a class="roi-cta" data-pack-request href="/contact?package=on-demand&amp;static=4&amp;motion=2">Request this creative pack →</a>
      </div>
    </div>

    <p class="roi-note">One asset = one finished creative concept. On-demand packs include one consolidated minor revision round and campaign-ready files.</p>
  </div>
</section>
`;

const NEW_PACKAGES = String.raw`
<section id="packages" class="packages-section luxe-reveal">
  <div class="packages-inner">
    <div class="packages-heading">
      <p class="packages-kicker">Creative pricing</p>
      <h2>Ongoing support when you want the monthly rhythm.</h2>
      <p>
        Start with a one-time 30-day sprint or choose the monthly production level that fits your property. No need to jump into the largest plan on day one.
      </p>
    </div>

    <div class="starter-strip">
      <div class="starter-strip-copy">
        <p class="package-label">One-time option</p>
        <h3>30-Day Creative Starter</h3>
        <p>6 motion concepts, 6 static concepts, and 12 concise captions for one property. A full working month with no ongoing commitment required.</p>
      </div>
      <div class="starter-strip-price">$895<span>one-time</span></div>
      <a href="/contact?plan=starter">Start the 30-day sprint →</a>
    </div>

    <div class="packages-grid">
      <article class="package-card package-card-light">
        <p class="package-label">Essential</p>
        <h3>Dependable monthly creative</h3>
        <div class="package-price">$895<span>/mo</span></div>
        <p class="package-copy">For properties that need a reliable monthly stream of polished social, campaign, F&amp;B, and event creative.</p>
        <div class="package-counts">
          <div><strong>6</strong><span>motion</span></div>
          <div><strong>6</strong><span>static</span></div>
          <div><strong>12</strong><span>captions</span></div>
        </div>
        <ul>
          <li>Recommended posting order</li>
          <li>Standard social-format exports</li>
          <li>One consolidated minor revision round</li>
          <li>Human review before delivery</li>
        </ul>
        <a class="package-cta" href="/contact?plan=essential">Ask about Essential →</a>
      </article>

      <article class="package-card package-card-featured">
        <p class="package-label">Growth · recommended</p>
        <h3>More room for active campaigns</h3>
        <div class="package-price">$1,295<span>/mo</span></div>
        <p class="package-copy">For active properties with multiple revenue moments, seasonal offers, F&amp;B, events, and campaigns to promote every month.</p>
        <div class="package-counts">
          <div><strong>9</strong><span>motion</span></div>
          <div><strong>9</strong><span>static</span></div>
          <div><strong>18</strong><span>captions</span></div>
        </div>
        <ul>
          <li>Recommended 30-day activation calendar</li>
          <li>One rapid-turn campaign adaptation</li>
          <li>One consolidated minor revision round</li>
          <li>Human review before delivery</li>
        </ul>
        <a class="package-cta" href="/contact?plan=growth">Ask about Growth →</a>
      </article>

      <article class="package-card package-card-dark">
        <p class="package-label">Full Campaign</p>
        <h3>High-volume creative support</h3>
        <div class="package-price">$1,695<span>/mo</span></div>
        <p class="package-copy">For properties with F&amp;B, meetings, events, seasonal campaigns, packages, and a higher ongoing creative volume.</p>
        <div class="package-counts">
          <div><strong>12</strong><span>motion</span></div>
          <div><strong>12</strong><span>static</span></div>
          <div><strong>24</strong><span>captions</span></div>
        </div>
        <ul>
          <li>Recommended 30-day activation calendar</li>
          <li>Two rapid-turn campaign adaptations</li>
          <li>Priority production scheduling</li>
          <li>Human review before delivery</li>
        </ul>
        <a class="package-cta" href="/contact?plan=full-campaign">Ask about Full Campaign →</a>
      </article>
    </div>

    <p class="pricing-footnote">Need only a few pieces? Use the on-demand builder above at $75 per static concept and $95 per motion concept — no monthly contract required.</p>
  </div>
</section>
`;

const PRICING_JS = String.raw`
<script id="archer-flex-pricing-script">
(() => {
  const builder = document.querySelector('[data-creative-builder]');
  if (!builder) return;

  let staticCount = 4;
  let motionCount = 2;
  const maxTotal = 10;
  const minTotal = 1;

  const staticOutput = document.querySelector('[data-static-count]');
  const motionOutput = document.querySelector('[data-motion-count]');
  const totalOutput = document.querySelector('[data-pack-total]');
  const summaryOutput = document.querySelector('[data-pack-summary]');
  const requestLink = document.querySelector('[data-pack-request]');

  function formatMoney(value) {
    return '$' + value.toLocaleString('en-US');
  }

  function render() {
    const total = staticCount + motionCount;
    const price = staticCount * 75 + motionCount * 95;
    if (staticOutput) staticOutput.textContent = String(staticCount);
    if (motionOutput) motionOutput.textContent = String(motionCount);
    if (totalOutput) totalOutput.textContent = formatMoney(price);
    if (summaryOutput) summaryOutput.textContent = staticCount + ' static · ' + motionCount + ' motion · ' + total + ' total assets';
    if (requestLink) requestLink.href = '/contact?package=on-demand&static=' + staticCount + '&motion=' + motionCount;

    builder.querySelectorAll('button[data-kind][data-delta]').forEach((button) => {
      const kind = button.getAttribute('data-kind');
      const delta = Number(button.getAttribute('data-delta'));
      const current = kind === 'static' ? staticCount : motionCount;
      button.disabled = delta < 0 ? (current <= 0 || total <= minTotal) : total >= maxTotal;
    });
  }

  builder.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-kind][data-delta]');
    if (!button || button.disabled) return;
    const kind = button.getAttribute('data-kind');
    const delta = Number(button.getAttribute('data-delta'));
    const total = staticCount + motionCount;
    if (delta > 0 && total >= maxTotal) return;
    if (delta < 0 && total <= minTotal) return;

    if (kind === 'static') staticCount = Math.max(0, staticCount + delta);
    if (kind === 'motion') motionCount = Math.max(0, motionCount + delta);
    render();
  });

  render();
})();
</script>
`;

function replacePricing(html: string): string {
  const roiStart = html.indexOf('<section class="roi-section" id="pricing">');
  const packagesStart = html.indexOf('<section id="packages" class="packages-section luxe-reveal">');
  const footerStart = html.indexOf('<footer id="contact" class="archer-footer">');

  if (roiStart < 0 || packagesStart < 0 || footerStart < 0 || !(roiStart < packagesStart && packagesStart < footerStart)) {
    return html;
  }

  let next = html.slice(0, roiStart) + NEW_ROI + "\n\n" + NEW_PACKAGES + "\n\n" + html.slice(footerStart);
  next = next.replace("</head>", PRICING_CSS + "\n</head>");
  next = next.replace("</body>", PRICING_JS + "\n</body>");
  return next;
}

export async function proxy(request: NextRequest) {
  try {
    const source = await fetch(SOURCE_URL, {
      headers: { "user-agent": "ArcherDesignHomepage/1.0" },
      cache: "no-store",
    });

    if (!source.ok) return NextResponse.next();

    const html = replacePricing(await source.text());
    return new NextResponse(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
        "x-archer-home": "flex-pricing-2026",
      },
    });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/",
};
