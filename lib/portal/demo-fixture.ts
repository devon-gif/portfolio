// ─────────────────────────────────────────────────────────────────────────────
// portal/demo-fixture.ts — the Solstice Harbor demo workspace.
//
// WHY A FIXTURE
// The live review_* tables are empty (0 memberships, 0 items) and the migration
// linking a CRM record to a review organization is written but NOT applied.
// Seeding real rows would mean writing to production data to make a preview
// look good. This renders through the SAME components a real client gets, so it
// is a faithful UX preview with no database writes and no Stripe object.
//
// MEDIA IS REAL ARCHER WORK, not invented URLs: files copied into
// public/portal-demo/ from the existing Valencia and TCRM asset libraries.
// Nothing here points at a URL that does not exist on disk.
//
// Everything is obviously fake: [DEMO] company prefix, a fictional contact, and
// PortalData.source === "demo" drives a banner. A real session resolves its
// organization from review_memberships, which this never touches.
// ─────────────────────────────────────────────────────────────────────────────
import type { Annotation, Caption, GeneralNote, PortalData, ReviewItem } from "./types";

export const DEMO_ORG_ID = "demo-solstice-harbor";
export const DEMO_COMPANY_NAME = "[DEMO] Solstice Harbor Hotel Group";

/** Fixed clock so the demo never shows a future date. */
const NOW = Date.UTC(2026, 7, 25, 15, 0, 0);
function daysAgo(n: number): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}
function daysAhead(n: number): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
}

const HARBOUR = { id: "demo-prop-harbour", name: "Solstice Harbour House" };
const DUNES = { id: "demo-prop-dunes", name: "Solstice Dunes Resort" };

function note(id: string, body: string, who: "Devon" | "Avery", days: number): GeneralNote {
  return {
    id,
    body,
    authorName: who,
    authorRole: who === "Devon" ? "admin" : "client",
    createdAt: daysAgo(days),
  };
}

function annotation(
  id: string,
  versionId: string,
  x: number,
  y: number,
  body: string,
  who: "Devon" | "Avery",
  days: number
): Annotation {
  return {
    id,
    versionId,
    x,
    y,
    timestampSeconds: null,
    body,
    authorName: who,
    authorRole: who === "Devon" ? "admin" : "client",
    createdAt: daysAgo(days),
    resolved: false,
  };
}

function caption(
  id: string,
  platform: string,
  body: string,
  hashtags: string[],
  status: Caption["status"],
  days: number,
  extra: Partial<Caption> = {}
): Caption {
  return {
    id,
    platform,
    body,
    headline: null,
    callToAction: null,
    hashtags,
    status,
    updatedAt: daysAgo(days),
    ...extra,
  };
}

const ITEMS: ReviewItem[] = [
  // ── Ready for review · still · has client annotations already ────────────
  {
    id: "rooftop-summer-dining",
    organizationId: DEMO_ORG_ID,
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Rooftop Summer Dining",
    description: "Announcement graphic for the rooftop dining series relaunch.",
    mediaType: "image",
    status: "ready_for_review",
    currentVersion: 2,
    createdAt: daysAgo(11),
    updatedAt: daysAgo(2),
    campaign: "Summer on the Roof",
    channels: ["Instagram", "Facebook"],
    dueDate: daysAhead(4),
    durationSeconds: null,
    dimensions: "1080 × 1350",
    versions: [
      {
        id: "rooftop-v1",
        versionNumber: 1,
        storagePath: "portal-demo/rooftop-summer-dining.jpg",
        originalFilename: "rooftop-summer-dining-v1.jpg",
        mimeType: "image/jpeg",
        createdAt: daysAgo(11),
        url: "/portal-demo/rooftop-summer-dining.jpg",
        note: "First pass on the rooftop announcement.",
      },
      {
        id: "rooftop-v2",
        versionNumber: 2,
        storagePath: "portal-demo/rooftop-summer-dining.jpg",
        originalFilename: "rooftop-summer-dining-v2.jpg",
        mimeType: "image/jpeg",
        createdAt: daysAgo(2),
        url: "/portal-demo/rooftop-summer-dining.jpg",
        note: "Raised the lockup and warmed the grade as discussed.",
      },
    ],
    actions: [
      { id: "rooftop-a1", action: "submitted", message: null, createdAt: daysAgo(10), byName: "Devon", byRole: "admin" },
      { id: "rooftop-a2", action: "changes_requested", message: "Type is sitting a little low against the skyline.", createdAt: daysAgo(6), byName: "Avery", byRole: "client" },
      { id: "rooftop-a3", action: "version_uploaded", message: "Raised the lockup and warmed the grade.", createdAt: daysAgo(2), byName: "Devon", byRole: "admin" },
      { id: "rooftop-a4", action: "submitted", message: null, createdAt: daysAgo(2), byName: "Devon", byRole: "admin" },
    ],
    annotations: [
      annotation("rooftop-an1", "rooftop-v2", 0.5, 0.19, "Can the headline sit slightly higher? It's crowding the skyline.", "Avery", 6),
      annotation("rooftop-an2", "rooftop-v2", 0.27, 0.78, "Could we make the date a touch larger here?", "Avery", 6),
    ],
    notes: [
      note("rooftop-n1", "Love this direction overall — it feels like the right summer tone for us.", "Avery", 6),
      note("rooftop-n2", "Thanks Avery. V2 raises the lockup and gives the date more presence.", "Devon", 2),
    ],
    captions: [
      caption(
        "rooftop-c1",
        "Instagram",
        "Summer belongs on the roof.\n\nJoin us Thursday through Sunday for sunset dining above the harbour — a new seasonal menu, a shorter list of very good wines, and the best seat in the city.",
        ["#SolsticeHarbour", "#RooftopDining", "#SummerInTheCity"],
        "ready_for_review",
        2
      ),
      caption(
        "rooftop-c2",
        "Facebook",
        "Sunset dining is back on the roof at Solstice Harbour House. New seasonal menu, Thursday–Sunday from 5pm. Reservations open now.",
        [],
        "ready_for_review",
        2,
        { callToAction: "Book a table" }
      ),
    ],
  },

  // ── Ready for review · VIDEO ─────────────────────────────────────────────
  {
    id: "arrival-film",
    organizationId: DEMO_ORG_ID,
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Arrival Film — Autumn Campaign",
    description: "Hero arrival sequence for the autumn brand refresh.",
    mediaType: "video",
    status: "ready_for_review",
    currentVersion: 1,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
    campaign: "Autumn Arrivals",
    channels: ["Instagram Reel", "Website"],
    dueDate: daysAhead(2),
    durationSeconds: 12,
    dimensions: "1920 × 1080",
    versions: [
      {
        id: "arrival-v1",
        versionNumber: 1,
        storagePath: "portal-demo/arrival-vintage-car.mp4",
        originalFilename: "arrival-vintage-car.mp4",
        mimeType: "video/mp4",
        createdAt: daysAgo(3),
        url: "/portal-demo/arrival-vintage-car.mp4",
        note: "First cut — 12 seconds, no audio bed yet.",
      },
    ],
    actions: [
      { id: "arrival-a1", action: "submitted", message: null, createdAt: daysAgo(3), byName: "Devon", byRole: "admin" },
    ],
    annotations: [],
    notes: [
      note("arrival-n1", "Audio bed is still to come — reviewing the picture cut first.", "Devon", 3),
    ],
    captions: [
      caption(
        "arrival-c1",
        "Instagram",
        "Autumn arrives at the harbour.\n\nCooler evenings, warmer welcomes, and a season that suits us rather well.",
        ["#SolsticeHarbour", "#AutumnEscape"],
        "draft",
        3
      ),
    ],
  },

  // ── Changes requested · still ────────────────────────────────────────────
  {
    id: "wedding-room-block",
    organizationId: DEMO_ORG_ID,
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Wedding Room Blocks",
    description: "Enquiry carousel for the weddings programme.",
    mediaType: "image",
    status: "changes_requested",
    currentVersion: 1,
    createdAt: daysAgo(16),
    updatedAt: daysAgo(7),
    campaign: "Weddings 2027",
    channels: ["Instagram", "LinkedIn"],
    dueDate: daysAhead(9),
    durationSeconds: null,
    dimensions: "1080 × 1080",
    versions: [
      {
        id: "wedding-v1",
        versionNumber: 1,
        storagePath: "portal-demo/wedding-room-block.jpg",
        originalFilename: "wedding-room-block-v1.jpg",
        mimeType: "image/jpeg",
        createdAt: daysAgo(16),
        url: "/portal-demo/wedding-room-block.jpg",
        note: null,
      },
    ],
    actions: [
      { id: "wed-a1", action: "submitted", message: null, createdAt: daysAgo(15), byName: "Devon", byRole: "admin" },
      { id: "wed-a2", action: "changes_requested", message: "Please drop the price point and swap the third frame for the terrace.", createdAt: daysAgo(7), byName: "Avery", byRole: "client" },
    ],
    annotations: [
      annotation("wed-an1", "wedding-v1", 0.72, 0.62, "Let's remove the starting price — we'd rather they enquire.", "Avery", 7),
    ],
    notes: [note("wed-n1", "Understood — revision coming this week.", "Devon", 6)],
    captions: [],
  },

  // ── Approved · still · caption still pending (mixed state) ───────────────
  {
    id: "eliza-july-menu",
    organizationId: DEMO_ORG_ID,
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Bistro Menu Launch",
    description: "Seasonal menu announcement for the bistro.",
    mediaType: "image",
    status: "approved",
    currentVersion: 1,
    createdAt: daysAgo(22),
    updatedAt: daysAgo(12),
    campaign: "Seasonal Menus",
    channels: ["Instagram", "Facebook"],
    dueDate: null,
    durationSeconds: null,
    dimensions: "1080 × 1350",
    versions: [
      {
        id: "eliza-v1",
        versionNumber: 1,
        storagePath: "portal-demo/eliza-july-menu.jpg",
        originalFilename: "bistro-menu-v1.jpg",
        mimeType: "image/jpeg",
        createdAt: daysAgo(22),
        url: "/portal-demo/eliza-july-menu.jpg",
        note: null,
      },
    ],
    actions: [
      { id: "eliza-a1", action: "submitted", message: null, createdAt: daysAgo(20), byName: "Devon", byRole: "admin" },
      { id: "eliza-a2", action: "approved", message: "Beautiful — approved.", createdAt: daysAgo(12), byName: "Avery", byRole: "client" },
    ],
    annotations: [],
    notes: [],
    captions: [
      caption(
        "eliza-cap1",
        "Instagram",
        "The new season is on the board.\n\nA shorter menu, a longer list of reasons to stay for dessert. Now serving at the Dunes bistro.",
        ["#SolsticeDunes", "#SeasonalMenu"],
        "ready_for_review",
        4
      ),
    ],
  },

  // ── Approved · video · fully cleared incl. caption ───────────────────────
  {
    id: "bar-service",
    organizationId: DEMO_ORG_ID,
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Evening Bar Service",
    description: "Short loop for the evening bar programme.",
    mediaType: "video",
    status: "approved",
    currentVersion: 2,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(18),
    campaign: "Evenings at the Dunes",
    channels: ["Instagram Reel"],
    dueDate: null,
    durationSeconds: 8,
    dimensions: "1080 × 1920",
    versions: [
      {
        id: "bar-v1",
        versionNumber: 1,
        storagePath: "portal-demo/bar-service.mp4",
        originalFilename: "bar-service-v1.mp4",
        mimeType: "video/mp4",
        createdAt: daysAgo(30),
        url: "/portal-demo/bar-service.mp4",
        note: null,
      },
      {
        id: "bar-v2",
        versionNumber: 2,
        storagePath: "portal-demo/bar-service.mp4",
        originalFilename: "bar-service-v2.mp4",
        mimeType: "video/mp4",
        createdAt: daysAgo(20),
        url: "/portal-demo/bar-service.mp4",
        note: "Trimmed the opening two seconds.",
      },
    ],
    actions: [
      { id: "bar-a1", action: "submitted", message: null, createdAt: daysAgo(28), byName: "Devon", byRole: "admin" },
      { id: "bar-a2", action: "changes_requested", message: "Slightly too long at the top.", createdAt: daysAgo(24), byName: "Avery", byRole: "client" },
      { id: "bar-a3", action: "version_uploaded", message: "Trimmed the opening.", createdAt: daysAgo(20), byName: "Devon", byRole: "admin" },
      { id: "bar-a4", action: "approved", message: "Perfect now.", createdAt: daysAgo(18), byName: "Avery", byRole: "client" },
    ],
    annotations: [],
    notes: [],
    captions: [
      caption(
        "bar-cap1",
        "Instagram",
        "Evenings, poured properly.\n\nThe bar opens at five.",
        ["#SolsticeDunes"],
        "approved",
        17
      ),
    ],
  },

  // ── In progress (draft) ─────────────────────────────────────────────────
  {
    id: "property-exterior",
    organizationId: DEMO_ORG_ID,
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Property Exterior — Winter Teaser",
    description: "Establishing shot for the winter package teaser.",
    mediaType: "video",
    status: "draft",
    currentVersion: 1,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    campaign: "Winter Packages",
    channels: ["Instagram"],
    dueDate: daysAhead(12),
    durationSeconds: 9,
    dimensions: "1920 × 1080",
    versions: [
      {
        id: "exterior-v1",
        versionNumber: 1,
        storagePath: "portal-demo/property-exterior.mp4",
        originalFilename: "property-exterior-v1.mp4",
        mimeType: "video/mp4",
        createdAt: daysAgo(1),
        url: "/portal-demo/property-exterior.mp4",
        note: "Rough assembly.",
      },
    ],
    actions: [],
    annotations: [],
    notes: [],
    captions: [],
  },

  // ── Approved · still · client publishes this one ────────────────────────
  {
    id: "pool-and-patio",
    organizationId: DEMO_ORG_ID,
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Pool & Patio Weekends",
    description: "Weekend programme announcement.",
    mediaType: "image",
    status: "approved",
    currentVersion: 1,
    createdAt: daysAgo(40),
    updatedAt: daysAgo(33),
    campaign: "Summer Weekends",
    channels: ["Instagram", "Facebook"],
    dueDate: null,
    durationSeconds: null,
    dimensions: "1080 × 1080",
    versions: [
      {
        id: "pool-v1",
        versionNumber: 1,
        storagePath: "portal-demo/pool-and-patio.jpg",
        originalFilename: "pool-and-patio-v1.jpg",
        mimeType: "image/jpeg",
        createdAt: daysAgo(40),
        url: "/portal-demo/pool-and-patio.jpg",
        note: null,
      },
    ],
    actions: [
      { id: "pool-a1", action: "submitted", message: null, createdAt: daysAgo(38), byName: "Devon", byRole: "admin" },
      { id: "pool-a2", action: "approved", message: null, createdAt: daysAgo(33), byName: "Avery", byRole: "client" },
    ],
    annotations: [],
    notes: [],
    captions: [],
  },
];

export function buildDemoPortalData(): PortalData {
  // The contract every consumer relies on: versions[0] is the LATEST. The live
  // loader sorts descending, so the fixture must too — otherwise V1 renders as
  // "latest" and the newest version's annotations never appear.
  const items = ITEMS.map((item) => ({
    ...item,
    versions: [...item.versions].sort((a, b) => b.versionNumber - a.versionNumber),
  }));

  return {
    source: "demo",
    organizationId: DEMO_ORG_ID,
    organizationName: "Solstice Harbor Hotel Group",
    viewerFirstName: "Avery",
    account: {
      id: null,
      companyName: DEMO_COMPANY_NAME,
      contactName: "Avery Morgan",
      packageName: "Portfolio Studio",
      monthlyFee: 2400,
      propertyCount: 2,
      billingStatus: "subscription_active",
      hasBillingPortal: false,
    },
    properties: [HARBOUR, DUNES],
    tasks: [
      { id: "t1", title: "Agreement signed", description: null, status: "done" },
      { id: "t2", title: "Brand assets received", description: "Logos, type, and photography library", status: "done" },
      { id: "t3", title: "Property priorities call", description: null, status: "done" },
      { id: "t4", title: "Creative calendar approved", description: "First 30-day activation plan", status: "done" },
      { id: "t5", title: "Social accounts connected", description: null, status: "pending" },
      { id: "t6", title: "Photography refresh scheduled", description: "Autumn shoot for both properties", status: "pending" },
    ],
    items,
    responsibility: {
      creative: "archer",
      copy: "archer",
      publishing: "archer",
      socialContactName: null,
      socialContactEmail: null,
    },
    otherOrganizations: [],
  };
}
