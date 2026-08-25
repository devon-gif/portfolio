import { GET as getLegacyHome } from "../legacy-home/route";

export const dynamic = "force-static";

const MOTION_END_ANCHOR = `
 <article class="work-slide is-landscape" data-slide="16">
 <div class="work-slide-media">
 <video src="/waffle.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>`;

const EXTRA_MOTION_SLIDES = `
 <article class="work-slide is-landscape" data-slide="17">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20hotel%20exterior%20images%20as%20the%20visual%20reference%20and%20keep%20the%20building.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="18">
 <div class="work-slide-media">
 <video src="/Bartender.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-portrait" data-slide="19">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20A%20cinematic%20close-up%20in%20a%20dark_%20upscale%20bar%20setting_%20Keep%20the%20exact%20framing%20and%20compo%281%29.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="20">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20A%20cinematic%20luxury%20hotel%20room%20timelapse%20transitioning%20from%20daytime%20into%20sunset%20and%20th.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="21">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20Use%20the%20provided%20image%20as%20the%20exact%20source%20frame_%20Create%20an%208-second%20elegant%20hospital.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="22">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20luxury%20bedroom%20reference%20sequence%20as%20the%20source_%20Create%20an%208-second.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="23">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20bring%20this%20breakfast%20image%20to%20life_%20have%20coffee%20steam%20rise%20from%20the%20cup%20and%20from%20out.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>
 <article class="work-slide is-landscape" data-slide="24">
 <div class="work-slide-media">
 <video src="/work-page/Seedance%202_0%20-%20static%20shot_%20bring%20this%20image%20to%20life_%20a%20little%20light%20wind%20blowing%20the%20palm%20trees%20and.mp4" muted loop playsinline preload="metadata"></video>
 </div>
 </article>`;

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

const OLD_MOTION_COPY =
  "Send a short clip from your phone. Archer Design edits, colors, cuts, and captions it into short-form motion and reels that look like your property at its best. No crew, no shoot day, no perfect footage required.";

const NEW_MOTION_COPY =
  "Send a still photo or short clip from your phone. Archer Design uses editing, motion design, VFX, and AI-assisted animation to turn existing property assets into polished short-form content and reels. No crew, no shoot day, no perfect footage required.";

function injectAfter(html: string, anchor: string, addition: string, label: string) {
  if (!html.includes(anchor)) {
    throw new Error(`Could not find ${label} anchor in Archer homepage.`);
  }
  return html.replace(anchor, `${anchor}${addition}`);
}

export async function GET() {
  const legacyResponse = await getLegacyHome();
  let html = await legacyResponse.text();

  html = injectAfter(html, MOTION_END_ANCHOR, EXTRA_MOTION_SLIDES, "motion carousel");
  html = injectAfter(html, IMAGE_END_ANCHOR, EXTRA_IMAGE_SLIDES, "image carousel");
  html = html.replace(OLD_MOTION_COPY, NEW_MOTION_COPY);

  if (!html.includes("/Bartender.mp4") || !html.includes("wedding room block campaign")) {
    throw new Error("Expanded Archer homepage work was not injected.");
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
