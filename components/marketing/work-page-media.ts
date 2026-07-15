// Auto-generated from a verified inventory of hotel-pipeline-os/public/"Work page"/.
// Every entry below was confirmed to exist on disk (either at this worktree's public
// root or under public/work-page/) with real pixel dimensions read directly from the
// file, so nothing here can render as a blank or broken slide. Three source files were
// deliberately excluded: one screenshot exposed a live Facebook comment thread with real
// commenters' names, and two graphics had a named staff member's direct work email and
// phone number baked into the creative. Everything else in the source folder is included.

export type WorkPageVideo = {
  src: string;
  title: string;
  category: string;
  width: number;
  height: number;
  // Explicit display order for the motion slideshow. Lower numbers show
  // first. Kept as data (not a component-level override) so the sequence
  // stays stable across filtering, refreshes, rebuilds, and deploys. The
  // hotel-arrival clip (1) and poolside clip (2) are pinned first per the
  // approved slideshow order; everything else follows in its original
  // generation order.
  order: number;
};

export type WorkPageImage = {
  src: string;
  title: string;
  category: string;
  width: number;
  height: number;
};

// Slides 1 and 2 are pinned first by design: a hotel-arrival exterior clip
// (vintage car, property entrance) and a poolside motion clip (lounge
// chairs, umbrellas, palm trees, subtle movement), matching the approved
// slideshow opening. The `order` field — not array position — is the
// source of truth the gallery sorts by, so this stays correct even if the
// array is edited later.
export const WORK_PAGE_VIDEOS: WorkPageVideo[] = [
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20hotel%20exterior%20images%20as%20the%20visual%20reference%20and%20keep%20the%20building.mp4", title: "Hotel Arrival, Vintage Car", category: "motion hospitality", width: 1664, height: 1248, order: 1 },
  { src: "/Poolside.mp4", title: "Poolside Lounge", category: "motion hospitality", width: 1280, height: 720, order: 2 },
  { src: "/Bartender.mp4", title: "Bar & Cocktails", category: "motion fb", width: 834, height: 1112, order: 3 },
  { src: "/Hopping%20Bar.mp4", title: "Bar Social", category: "motion hospitality", width: 1280, height: 720, order: 4 },
  { src: "/work-page/Seedance%202_0%20-%20A%20cinematic%20close-up%20in%20a%20dark_%20upscale%20bar%20setting_%20Keep%20the%20exact%20framing%20and%20compo%281%29.mp4", title: "Upscale Bar, Close-Up", category: "motion fb", width: 834, height: 1112, order: 5 },
  { src: "/work-page/Seedance%202_0%20-%20A%20cinematic%20luxury%20hotel%20room%20timelapse%20transitioning%20from%20daytime%20into%20sunset%20and%20th.mp4", title: "Luxury Room Timelapse", category: "motion hospitality experimental", width: 1280, height: 720, order: 6 },
  { src: "/Seedance%202_0%20-%20A%20serene%20static%20luxury%20resort%20shot%20in%20bright%20tropical%20daylight_%20Preserve%20the%20exact%20co.mp4", title: "Tropical Resort Daylight", category: "motion hospitality", width: 1112, height: 834, order: 7 },
  { src: "/work-page/Seedance%202_0%20-%20Create%20a%20cinematic%20half-circle%20orbit%20shot%20around%20the%20couple%20kissing%20in%20front%20of%20the%20e.mp4", title: "Couple, Orbit Shot", category: "motion campaigns", width: 834, height: 1112, order: 8 },
  { src: "/Seedance%202_0%20-%20Create%20a%20cinematic%20hotel%20exterior%20transition%20using%20the%20two%20reference%20images%20as%20keyfra.mp4", title: "Hotel Exterior Transition", category: "motion hospitality", width: 1280, height: 720, order: 9 },
  { src: "/work-page/Seedance%202_0%20-%20Create%20a%20luxurious_%20cinematic%20logo%20animation%20on%20a%20clean%20light%20background%20using%20the%20ex.mp4", title: "Logo Animation", category: "motion product experimental", width: 1280, height: 720, order: 10 },
  { src: "/work-page/Seedance%202_0%20-%20Create%20a%20smooth_%20cinematic%2010-second%20timelapse%20transition%20between%20the%20two%20reference%20i.mp4", title: "Cinematic Timelapse Transition", category: "motion experimental", width: 834, height: 1112, order: 11 },
  { src: "/work-page/Seedance%202_0%20-%20Locked-off%20cinematic%20exterior%20shot%20of%20the%20Pendry%20hotel%20entrance%20at%20night_%20ultra-detai.mp4", title: "Luxury Hotel Entrance, Night (Concept)", category: "motion hospitality", width: 1280, height: 720, order: 12 },
  { src: "/Seedance%202_0%20-%20Use%20the%20first%20image%20as%20the%20starting%20frame%20and%20the%20second%20image%20as%20the%20ending%20frame_Cr%281%29.mp4", title: "Image-to-Image Transition", category: "motion experimental", width: 720, height: 1280, order: 13 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20first%20image%20as%20the%20starting%20frame%20and%20the%20second%20image%20as%20the%20ending%20frame_Cr.mp4", title: "Image-to-Image Transition, Alt Cut", category: "motion experimental", width: 720, height: 1280, order: 14 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20first%20image%20as%20the%20starting%20frame%20and%20the%20second%20image%20as%20the%20final%20environme.mp4", title: "Environment Transition", category: "motion experimental", width: 1112, height: 834, order: 15 },
  { src: "/Seedance%202_0%20-%20Use%20the%20left%20grayscale%20image%20as%20the%20starting%20frame%20and%20the%20right%20colorful%20image%20as%20th.mp4", title: "Grayscale to Color Transition", category: "motion experimental", width: 960, height: 960, order: 16 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20champagne%20detail%20image%20as%20the%20exact%20source%20frame_%20Preserve%20the%20Grand.mp4", title: "Champagne Detail", category: "motion campaigns", width: 1112, height: 834, order: 17 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20image%20as%20the%20exact%20source%20frame_%20Create%20an%208-second%20elegant%20hospital.mp4", title: "Elegant Hospitality Moment", category: "motion hospitality", width: 1280, height: 720, order: 18 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20image%20as%20the%20exact%20source%20frame_%20Preserve%20the%20composition_%20the%20bride%281%29.mp4", title: "Bridal Portrait, Alt Cut", category: "motion campaigns", width: 1112, height: 834, order: 19 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20provided%20image%20as%20the%20exact%20source%20frame_%20Preserve%20the%20couple_%20pose_%20courtyar.mp4", title: "Courtyard Couple", category: "motion campaigns", width: 834, height: 1112, order: 20 },
  { src: "/Seedance%202_0%20-%20Use%20the%20reference%20image%20as%20the%20exact%20composition%20and%20lighting%20guide_%20Create%20a%20cinemat.mp4", title: "Cinematic Reference Composition", category: "motion experimental", width: 834, height: 1112, order: 21 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20image%20as%20the%20exact%20starting%20frame_%20Create%20a%20cinematic%208-second%20luxur.mp4", title: "Luxury Starting Frame", category: "motion hospitality", width: 1280, height: 720, order: 22 },
  { src: "/work-page/Seedance%202_0%20-%20Use%20the%20uploaded%20luxury%20bedroom%20reference%20sequence%20as%20the%20source_%20Create%20an%208-second.mp4", title: "Luxury Bedroom Sequence", category: "motion hospitality", width: 1920, height: 1080, order: 23 },
  { src: "/work-page/Seedance%202_0%20-%20bring%20this%20breakfast%20image%20to%20life_%20have%20coffee%20steam%20rise%20from%20the%20cup%20and%20from%20out.mp4", title: "Breakfast, Coffee Steam", category: "motion fb", width: 1112, height: 834, order: 24 },
  { src: "/work-page/Seedance%202_0%20-%20bring%20this%20image%20to%20life%20please_%20have%20the%20beer%20be%20bubbling%20and%20water%20droplets%20running.mp4", title: "Beer, Bubbling", category: "motion fb", width: 834, height: 1112, order: 25 },
  { src: "/Seedance%202_0%20-%20bring%20this%20image%20to%20life_%20have%20the%20chocolate%20sauce%20be%20poured%20slowly%20onto%20the%20pancakes.mp4", title: "Chocolate Sauce, Pancakes", category: "motion fb", width: 834, height: 1112, order: 26 },
  { src: "/Seedance%202_0%20-%20bring%20this%20image%20to%20life_%20static%20shot_%20have%20the%20person%20be%20totally%20still_%20have%20the%20win.mp4", title: "Suite, Window Light", category: "motion hospitality", width: 1280, height: 720, order: 27 },
  { src: "/work-page/Seedance%202_0%20-%20food%20photography_%20strawberries%20and%20sauce%20slowly%20pouring%20onto%20the%20waffle_%208k%20uhd.mp4", title: "Waffle Pour", category: "motion fb", width: 1280, height: 720, order: 28 },
  { src: "/work-page/Seedance%202_0%20-%20static%20shot_%20bring%20this%20image%20to%20life_%20a%20little%20light%20wind%20blowing%20the%20palm%20trees%20and.mp4", title: "Palm Trees, Light Wind", category: "motion hospitality", width: 1280, height: 720, order: 29 },
  { src: "/work-page/Seedance%202_0%20-%20timelapse%20of%20fall%20to%20winter%20please.mp4", title: "Fall to Winter Timelapse", category: "motion experimental", width: 1280, height: 720, order: 30 },
  { src: "/glass.mp4", title: "Signature Cocktail", category: "motion fb experimental", width: 1440, height: 1440, order: 31 },
  { src: "/pancakes.mp4", title: "Pancake Pour", category: "motion fb", width: 1248, height: 1664, order: 32 },
];

export const WORK_PAGE_IMAGES: WorkPageImage[] = [
  { src: "/Image%202.png", title: "Hotel Indigo Pittsburgh — Room Collage", category: "hospitality", width: 1080, height: 1350 },
  { src: "/Image%203.png", title: "Eliza Hot Metal Bistro — Holiday Billboard", category: "campaigns fb", width: 1784, height: 1616 },
  { src: "/Image%204.png", title: "Hampton by Hilton — Flood City Music Festival", category: "campaigns hospitality", width: 1106, height: 1516 },
  { src: "/Image%205.png", title: "Eliza Hot Metal Bistro — Burgers Poster", category: "fb campaigns", width: 1424, height: 1998 },
  { src: "/Image%206.png", title: "Eliza Hot Metal Bistro — Live Music Series", category: "campaigns experimental", width: 1080, height: 1350 },
  { src: "/Image%207.png", title: "Eliza Hot Metal Bistro — Takeout Packaging", category: "product", width: 1150, height: 1460 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.00.10%E2%80%AFAM.png", title: "Eliza Hot Metal Bistro — July Menu", category: "fb", width: 1322, height: 1792 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.00.32%E2%80%AFAM.png", title: "Eliza Hot Metal Bistro — June Menu", category: "fb", width: 1352, height: 1556 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.00.46%E2%80%AFAM.png", title: "Eliza Hot Metal Bistro — May Menu", category: "fb", width: 1336, height: 1544 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.01.31%E2%80%AFAM.png", title: "Hampton Inn Greensburg × Elements — Floating Sound Bath", category: "hospitality", width: 1322, height: 1848 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.03.18%E2%80%AFAM.png", title: "Hampton Inn Johnstown — Flood City Music Festival", category: "campaigns hospitality", width: 1334, height: 1576 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.04.04%E2%80%AFAM.png", title: "Hampton Inn Johnstown — Pet Friendly", category: "hospitality", width: 1348, height: 1782 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.04.30%E2%80%AFAM.png", title: "Hampton Inn Johnstown — Pool & Patio", category: "hospitality", width: 1346, height: 1816 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.04.43%E2%80%AFAM.png", title: "Hampton Inn Johnstown — Bring Your Best Friend", category: "hospitality", width: 1332, height: 1774 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.05.09%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — America's 250th Anniversary", category: "campaigns hospitality", width: 1328, height: 1778 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.05.31%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Wings of Steel Lecture Series", category: "campaigns hospitality", width: 1346, height: 1042 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.06.03%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Wedding Room Block", category: "hospitality", width: 1326, height: 1792 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.07.04%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Rooftop Party, Big Blitz Band", category: "campaigns hospitality", width: 1336, height: 1782 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.08.40%E2%80%AFAM.png", title: "Eliza Hot Metal Bistro × Hotel Indigo — Share the Love", category: "campaigns fb", width: 1308, height: 1760 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.09.01%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Last Minute Christmas Party", category: "campaigns hospitality", width: 1354, height: 1758 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.09.42%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Rooftop Party, Eliza Live Music", category: "campaigns hospitality", width: 1342, height: 1762 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.48.56%E2%80%AFAM.png", title: "Hotel Indigo Pittsburgh — Instagram Grid", category: "hospitality", width: 3024, height: 2202 },
  { src: "/work-page/Screenshot%202026-07-14%20at%209.49.55%E2%80%AFAM.png", title: "Hampton Inn Greensburg — Instagram Grid", category: "hospitality", width: 3032, height: 2202 },
  { src: "/image%2012.png", title: "Minty Fresh — Beverage Art Direction", category: "product experimental fb", width: 1080, height: 1350 },
];
