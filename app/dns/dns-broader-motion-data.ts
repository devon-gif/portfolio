// ─────────────────────────────────────────────────────────────────────────────
// dns-broader-motion-data.ts — broader (non-hospitality) motion capability
// for /dns's "Additional Creative Range" section, placed below the
// calculator. Two real, already-existing sources, nothing invented:
//
// 1. The twelve branded/product/lifestyle motion clips already live on the
//    site's own /devon/motion route (app/devon/motion-data.ts's
//    DEVON_EXTRA_MOTION export) — including the Nike piece this section was
//    specifically asked to surface. Reused here by reference (same existing
//    /tcrm/videos/ asset paths that route already serves), not duplicated
//    as new uploads.
// 2. The purely experimental/product clips already in
//    app/tcrm/tcrm-media.ts's TCRM_VIDEOS manifest that carry no
//    hospitality/fb/campaigns tag — i.e. the clips NOT already used in the
//    hospitality motion section above (see DnsMotionShowcase.tsx), so
//    nothing appears twice on the page.
// ─────────────────────────────────────────────────────────────────────────────

import { TCRM_VIDEOS } from "../tcrm/tcrm-media";

export type DnsBroaderMotionItem = {
  src: string;
  label: string;
  group: string;
};

// Mirrors DEVON_EXTRA_MOTION in app/devon/motion-data.ts exactly (same
// paths, same titles) — that file is left untouched; this is a read-only
// reuse of the same already-shipped asset list for this route.
const DEVON_EXTRA_MOTION: DnsBroaderMotionItem[] = [
  { src: "/tcrm/videos/Nike.mp4", label: "Nike Product Motion", group: "Archer Design · Product Motion" },
  { src: "/tcrm/videos/App.mp4", label: "App Motion Study", group: "Archer Design · Digital Product Motion" },
  { src: "/tcrm/videos/kid eating.mp4", label: "Lifestyle Food Moment", group: "Archer Design · Lifestyle Motion" },
  { src: "/tcrm/videos/dashboard2.mp4", label: "Dashboard Interface Study II", group: "Archer Design · Digital Product Motion" },
  { src: "/tcrm/videos/headphones.mp4", label: "Headphones Product Motion", group: "Archer Design · Product Motion" },
  { src: "/tcrm/videos/tiny building.mp4", label: "Miniature Building Study", group: "Archer Design · 3D Experimental Motion" },
  { src: "/tcrm/videos/white sneaker.mp4", label: "White Sneaker Product Motion", group: "Archer Design · Product Motion" },
  { src: "/tcrm/videos/food.mp4", label: "Food Motion Study", group: "Archer Design · Food Lifestyle Motion" },
  { src: "/tcrm/videos/man falling.mp4", label: "Falling Figure Study", group: "Archer Design · Experimental Motion" },
  { src: "/tcrm/videos/Baker.mp4", label: "Baker Motion Study", group: "Archer Design · Lifestyle Food Motion" },
  { src: "/tcrm/videos/Dashboard.mp4", label: "Dashboard Interface Study", group: "Archer Design · Digital Product Motion" },
  { src: "/tcrm/videos/SEO thing.mp4", label: "SEO Interface Motion", group: "Archer Design · Digital Product Motion" },
];

// The remaining TCRM_VIDEOS entries with no hospitality/fb/campaigns tag —
// purely experimental or product-style clips, distinct from every clip
// already shown in the hospitality motion section above.
const broaderTcrmItems: DnsBroaderMotionItem[] = TCRM_VIDEOS.filter((item) => {
  const tags = item.category.split(" ");
  return !tags.includes("hospitality") && !tags.includes("fb") && !tags.includes("campaigns");
}).map((item) => ({ src: item.src, label: item.title, group: "Archer Design · Experimental Motion" }));

export const DNS_BROADER_MOTION: DnsBroaderMotionItem[] = [...DEVON_EXTRA_MOTION, ...broaderTcrmItems];
