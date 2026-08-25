import { GET as getLegacyHome } from "../legacy-home/route";
import { TCRM_BLOB_MOTION } from "../tcrm/tcrm-motion-blob-manifest";

export const dynamic = "force-static";

const IMAGE_END_ANCHOR = `
 <article class="work-slide is-portrait" data-slide="11">
 <div class="work-slide-media">
 <img src="/Image%205.png" alt="Archer Design hospitality creative sample" loading="lazy" />
 </div>
 </article>`;

const EXTRA_IMAGE_SLIDES = `
 <article class="work-slide is-portrait" data-slide="12">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.00.10%E2%80%AFAM.png" alt="Eliza Hot Metal Bistro July menu design" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="13">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.00.32%E2%80%AFAM.png" alt="Eliza Hot Metal Bistro June menu design" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="14">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.01.31%E2%80%AFAM.png" alt="Hampton Inn Greensburg and Elements floating sound bath campaign" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="15">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.04.04%E2%80%AFAM.png" alt="Hampton Inn Johnstown pet friendly campaign" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="16">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.04.30%E2%80%AFAM.png" alt="Hampton Inn Johnstown pool and patio campaign" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="17">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.05.09%E2%80%AFAM.png" alt="Hotel Indigo Pittsburgh America 250 campaign" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="18">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.05.31%E2%80%AFAM.png" alt="Hotel Indigo Pittsburgh Wings of Steel lecture series campaign" loading="lazy" />
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="19">
 <div class="work-slide-media">
 <img src="/work-page/Screenshot%202026-07-14%20at%209.06.03%E2%80%AFAM.png" alt="Hotel Indigo Pittsburgh wedding room block campaign" loading="lazy" />
 </div>
 </article>`;

function openingPriority(src: string) {
  const lower = src.toLowerCase();

  if (lower.includes("hotel-arrival-vintage-car")) return 0;
  if (lower.includes("lady")) return 1;

  return 10;
}

function mix(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  hash ^= 8132026;

  return hash >>> 0;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMotionLibrary() {
  const unique = Array.from(
    new Map(TCRM_BLOB_MOTION.map((item) => [item.src, item])).values(),
  );

  return unique
    .map((item) => ({
      src: item.src,
      label: item.label,
      group: item.group,
    }))
    .sort((a, b) => {
      const aPriority = openingPriority(a.label);
      const bPriority = openingPriority(b.label);

      if (aPriority !== bPriority) return aPriority - bPriority;

      return mix(a.src) - mix(b.src);
    });
}

function buildMotionLibrarySection() {
  const items = getMotionLibrary();
  const first = items[0];

  if (!first) {
    throw new Error("TCRM motion library is empty.");
  }

  const safeData = JSON.stringify(items).replaceAll("<", "\\u003c");
  const dots = items
    .map(
      (_, index) =>
        `<button type="button" class="archer-motion-dot${index === 0 ? " is-active" : ""}" data-motion-index="${index}" aria-label="View motion example ${index + 1}"${index === 0 ? ' aria-current="true"' : ""}></button>`,
    )
    .join("");

  return `
<section class="archer-motion-library" id="work" data-motion-count="${items.length}">
  <style id="archer-tcrm-motion-library-style">
    .archer-motion-library {
      position: relative;
      overflow: hidden;
      padding: clamp(78px, 9vw, 130px) 0;
      background:
        radial-gradient(circle at 70% 15%, rgba(184, 138, 53, .14), transparent 32%),
        linear-gradient(145deg, #17130f 0%, #201a14 55%, #100d0a 100%);
      color: #f7f0e5;
      border-top: 1px solid rgba(255,255,255,.06);
      border-bottom: 1px solid rgba(255,255,255,.06);
    }

    .archer-motion-inner {
      width: min(1180px, calc(100% - 40px));
      margin: 0 auto;
    }

    .archer-motion-heading {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(260px, .75fr);
      gap: 60px;
      align-items: end;
      margin-bottom: 38px;
    }

    .archer-motion-eyebrow {
      display: block;
      margin-bottom: 13px;
      color: #d2a44f;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .22em;
      text-transform: uppercase;
    }

    .archer-motion-heading h2 {
      max-width: 720px;
      margin: 0;
      font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
      font-size: clamp(38px, 5vw, 68px);
      font-weight: 400;
      line-height: .98;
      letter-spacing: -.035em;
      color: #fff8ec;
    }

    .archer-motion-heading p {
      margin: 0;
      color: rgba(247, 240, 229, .62);
      font-size: 13px;
      line-height: 1.7;
    }

    .archer-motion-stage {
      position: relative;
      width: 100%;
      height: clamp(520px, 66vw, 790px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 28px;
      background:
        radial-gradient(circle at 50% 42%, rgba(184, 138, 53, .10), transparent 46%),
        #080705;
      box-shadow: 0 35px 100px rgba(0,0,0,.30);
    }

    .archer-motion-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #080705;
    }

    .archer-motion-arrow {
      position: absolute;
      z-index: 4;
      top: 50%;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(-50%);
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 999px;
      background: rgba(18, 14, 10, .74);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: #f7f0e5;
      font-size: 20px;
      cursor: pointer;
    }

    .archer-motion-arrow:hover {
      background: rgba(210, 164, 79, .18);
      color: #fff8ec;
    }

    .archer-motion-arrow.is-left { left: 20px; }
    .archer-motion-arrow.is-right { right: 20px; }

    .archer-motion-counter {
      position: absolute;
      z-index: 4;
      right: 22px;
      bottom: 22px;
      display: flex;
      gap: 7px;
      padding: 8px 13px;
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 999px;
      background: rgba(12, 9, 7, .74);
      backdrop-filter: blur(12px);
      color: rgba(247, 240, 229, .88);
      font-size: 10px;
      letter-spacing: .14em;
    }

    .archer-motion-counter span { opacity: .35; }

    .archer-motion-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      padding: 20px 4px 0;
    }

    .archer-motion-meta-copy {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 220px;
    }

    .archer-motion-group {
      color: #d2a44f;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .17em;
      text-transform: uppercase;
    }

    .archer-motion-label {
      color: rgba(255, 248, 236, .92);
      font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
      font-size: 17px;
      font-weight: 400;
    }

    .archer-motion-navigation {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      max-width: 580px;
    }

    .archer-motion-dot {
      width: 7px;
      height: 7px;
      padding: 0;
      border: 0;
      border-radius: 999px;
      background: rgba(210, 164, 79, .25);
      cursor: pointer;
      transition: width .25s ease, background .25s ease, transform .25s ease;
    }

    .archer-motion-dot:hover { transform: scale(1.25); }

    .archer-motion-dot.is-active {
      width: 27px;
      background: #d2a44f;
    }

    .archer-motion-footer {
      display: flex;
      flex-wrap: wrap;
      gap: 11px;
      margin-top: 35px;
    }

    .archer-motion-footer span {
      padding: 8px 11px;
      border: 1px solid rgba(210, 164, 79, .16);
      border-radius: 999px;
      color: rgba(247, 240, 229, .48);
      font-size: 8px;
      font-weight: 800;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    @media (max-width: 760px) {
      .archer-motion-heading {
        grid-template-columns: 1fr;
        gap: 18px;
      }

      .archer-motion-stage {
        height: 580px;
        border-radius: 20px;
      }

      .archer-motion-arrow {
        width: 43px;
        height: 43px;
      }

      .archer-motion-arrow.is-left { left: 10px; }
      .archer-motion-arrow.is-right { right: 10px; }

      .archer-motion-counter {
        right: 12px;
        bottom: 12px;
      }

      .archer-motion-meta {
        align-items: flex-start;
        flex-direction: column;
      }

      .archer-motion-navigation { justify-content: flex-start; }
    }

    @media (prefers-reduced-motion: reduce) {
      .archer-motion-dot { transition: none; }
    }
  </style>

  <div class="archer-motion-inner">
    <div class="archer-motion-heading">
      <div>
        <span class="archer-motion-eyebrow">Motion Library</span>
        <h2>Motion that makes the property feel alive.</h2>
      </div>
      <p>
        A broader look at Archer Design&apos;s motion skillset: hospitality campaigns, rooms, resorts, F&amp;B, weddings, brand storytelling, transitions, VFX, and AI-assisted animation. One piece plays at a time so you can actually watch the work instead of scanning a wall of duplicates.
      </p>
    </div>

    <div class="archer-motion-stage">
      <video
        class="archer-motion-video"
        data-motion-video
        src="${escapeHtml(first.src)}"
        autoplay
        muted
        playsinline
        controls
        preload="metadata"
      ></video>

      <button type="button" class="archer-motion-arrow is-left" data-motion-prev aria-label="Previous motion example">←</button>
      <button type="button" class="archer-motion-arrow is-right" data-motion-next aria-label="Next motion example">→</button>

      <div class="archer-motion-counter">
        <strong data-motion-current>01</strong>
        <span>/</span>
        <strong>${String(items.length).padStart(2, "0")}</strong>
      </div>
    </div>

    <div class="archer-motion-meta">
      <div class="archer-motion-meta-copy">
        <span class="archer-motion-group" data-motion-group>${escapeHtml(first.group)}</span>
        <strong class="archer-motion-label" data-motion-label>${escapeHtml(first.label)}</strong>
      </div>

      <div class="archer-motion-navigation" data-motion-nav>
        ${dots}
      </div>
    </div>

    <div class="archer-motion-footer">
      <span>Short-form motion</span>
      <span>Hospitality campaigns</span>
      <span>Brand motion</span>
      <span>Social creative</span>
      <span>VFX + AI-assisted animation</span>
    </div>
  </div>

  <script id="archer-tcrm-motion-library-script">
    (() => {
      const root = document.querySelector(".archer-motion-library");
      if (!root) return;

      const items = ${safeData};
      const video = root.querySelector("[data-motion-video]");
      const current = root.querySelector("[data-motion-current]");
      const group = root.querySelector("[data-motion-group]");
      const label = root.querySelector("[data-motion-label]");
      const dots = Array.from(root.querySelectorAll("[data-motion-index]"));
      const prev = root.querySelector("[data-motion-prev]");
      const next = root.querySelector("[data-motion-next]");
      let active = 0;

      function render(index) {
        if (!items.length || !video) return;
        active = (index + items.length) % items.length;
        const item = items[active];

        video.pause();
        video.src = item.src;
        video.currentTime = 0;
        video.muted = true;
        video.volume = 0;
        video.load();
        video.play().catch(() => {});

        if (current) current.textContent = String(active + 1).padStart(2, "0");
        if (group) group.textContent = item.group;
        if (label) label.textContent = item.label;

        dots.forEach((dot, dotIndex) => {
          const isActive = dotIndex === active;
          dot.classList.toggle("is-active", isActive);
          if (isActive) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
      }

      prev?.addEventListener("click", () => render(active - 1));
      next?.addEventListener("click", () => render(active + 1));
      video?.addEventListener("ended", () => render(active + 1));

      dots.forEach((dot) => {
        dot.addEventListener("click", () => {
          render(Number(dot.getAttribute("data-motion-index") || 0));
        });
      });

      root.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") render(active - 1);
        if (event.key === "ArrowRight") render(active + 1);
      });
    })();
  </script>
</section>`;
}

function injectAfter(html: string, anchor: string, addition: string, label: string) {
  if (!html.includes(anchor)) {
    throw new Error(`Could not find ${label} anchor in Archer homepage.`);
  }

  return html.replace(anchor, `${anchor}${addition}`);
}

function replaceMotionSection(html: string) {
  const pattern = /<section class="work-section showcase-section" id="work">[\s\S]*?<\/section>/;

  if (!pattern.test(html)) {
    throw new Error("Could not find the original Archer motion section.");
  }

  return html.replace(pattern, buildMotionLibrarySection());
}

export async function GET() {
  const legacyResponse = await getLegacyHome();
  let html = await legacyResponse.text();

  html = replaceMotionSection(html);
  html = injectAfter(html, IMAGE_END_ANCHOR, EXTRA_IMAGE_SLIDES, "image carousel");

  if (!html.includes("archer-tcrm-motion-library-script") || !html.includes("wedding room block campaign")) {
    throw new Error("Archer homepage work library was not injected.");
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
