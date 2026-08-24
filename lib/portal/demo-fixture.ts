// ─────────────────────────────────────────────────────────────────────────────
// portal/demo-fixture.ts — the Solstice Harbor demo workspace.
//
// WHY A FIXTURE AND NOT SEEDED ROWS
// The live Hotelauto project has zero review_memberships and zero review_items,
// and the migrations that link a client account to a review organization are
// written but NOT applied. Seeding real rows would mean writing to production
// data to make a preview look good. This renders through the SAME components
// as a real client, so it is a faithful UX preview, with no database writes and
// no Stripe object of any kind.
//
// Everything here is obviously fake: the company is prefixed [DEMO], the
// contact is fictional, and PortalData.source === "demo" makes the portal show
// a demo banner. It can never be mistaken for a real client's data because a
// real session resolves its organization from review_memberships, which this
// never touches.
// ─────────────────────────────────────────────────────────────────────────────
import type { PortalData, ReviewItem } from "./types";

export const DEMO_ORG_ID = "demo-solstice-harbor";
export const DEMO_COMPANY_NAME = "[DEMO] Solstice Harbor Hotel Group";

/** Stable relative timestamps so the demo never shows a date in the future. */
function daysAgo(n: number): string {
  const d = new Date(Date.UTC(2026, 7, 24, 15, 0, 0));
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

const HARBOUR = { id: "demo-prop-harbour", name: "Solstice Harbour House" };
const DUNES = { id: "demo-prop-dunes", name: "Solstice Dunes Resort" };

function item(partial: Omit<ReviewItem, "organizationId">): ReviewItem {
  return { ...partial, organizationId: DEMO_ORG_ID };
}

const DEMO_ITEMS: ReviewItem[] = [
  // 1 × in progress (draft) — visible to the owner preview only, and shown as
  // "In progress" so the client understands work is underway without being
  // asked to review something unfinished.
  item({
    id: "demo-item-autumn-suite",
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Autumn Suite Escape — hero film",
    description: "30s vertical cut for the autumn package launch.",
    mediaType: "video",
    status: "draft",
    currentVersion: 1,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    versions: [
      { id: "demo-v-1", versionNumber: 1, storagePath: "demo/autumn-suite-v1.mp4", originalFilename: "autumn-suite-v1.mp4", mimeType: "video/mp4", createdAt: daysAgo(1), url: null },
    ],
    actions: [
      { id: "demo-a-1", action: "version_uploaded", message: null, createdAt: daysAgo(1), byName: "Devon", byRole: "admin" },
    ],
  }),

  // 2 × ready for review
  item({
    id: "demo-item-harbour-brunch",
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Harbour House weekend brunch",
    description: "Three static frames for the seasonal brunch relaunch.",
    mediaType: "image",
    status: "ready_for_review",
    currentVersion: 2,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(3),
    versions: [
      { id: "demo-v-2a", versionNumber: 1, storagePath: "demo/brunch-v1.jpg", originalFilename: "brunch-v1.jpg", mimeType: "image/jpeg", createdAt: daysAgo(9), url: null },
      { id: "demo-v-2b", versionNumber: 2, storagePath: "demo/brunch-v2.jpg", originalFilename: "brunch-v2.jpg", mimeType: "image/jpeg", createdAt: daysAgo(3), url: null },
    ],
    actions: [
      { id: "demo-a-2", action: "submitted", message: null, createdAt: daysAgo(8), byName: "Devon", byRole: "admin" },
      { id: "demo-a-3", action: "changes_requested", message: "Could we warm up the exterior shot? It reads a little cool against the rest of the set.", createdAt: daysAgo(5), byName: "Avery", byRole: "client" },
      { id: "demo-a-4", action: "version_uploaded", message: "Warmed the grade and swapped the second frame.", createdAt: daysAgo(3), byName: "Devon", byRole: "admin" },
      { id: "demo-a-5", action: "submitted", message: null, createdAt: daysAgo(3), byName: "Devon", byRole: "admin" },
    ],
  }),
  item({
    id: "demo-item-dunes-spa",
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Dunes spa — midweek offer",
    description: "Story-format promo for the midweek treatment package.",
    mediaType: "image",
    status: "ready_for_review",
    currentVersion: 1,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
    versions: [
      { id: "demo-v-3", versionNumber: 1, storagePath: "demo/spa-v1.jpg", originalFilename: "spa-midweek-v1.jpg", mimeType: "image/jpeg", createdAt: daysAgo(4), url: null },
    ],
    actions: [
      { id: "demo-a-6", action: "submitted", message: null, createdAt: daysAgo(4), byName: "Devon", byRole: "admin" },
    ],
  }),

  // 1 × changes requested
  item({
    id: "demo-item-wedding-brochure",
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Weddings at Harbour House",
    description: "Carousel set for the weddings enquiry campaign.",
    mediaType: "image",
    status: "changes_requested",
    currentVersion: 1,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(6),
    versions: [
      { id: "demo-v-4", versionNumber: 1, storagePath: "demo/weddings-v1.jpg", originalFilename: "weddings-v1.jpg", mimeType: "image/jpeg", createdAt: daysAgo(12), url: null },
    ],
    actions: [
      { id: "demo-a-7", action: "submitted", message: null, createdAt: daysAgo(11), byName: "Devon", byRole: "admin" },
      { id: "demo-a-8", action: "changes_requested", message: "Love the direction. Can we swap the third frame for the terrace at golden hour, and drop the price point from the copy?", createdAt: daysAgo(6), byName: "Avery", byRole: "client" },
    ],
  }),

  // 2 × approved
  item({
    id: "demo-item-harvest-dinner",
    propertyId: DUNES.id,
    propertyName: DUNES.name,
    title: "Harvest dinner series",
    description: "Announcement set for the four-part autumn dinner series.",
    mediaType: "image",
    status: "approved",
    currentVersion: 2,
    createdAt: daysAgo(21),
    updatedAt: daysAgo(14),
    versions: [
      { id: "demo-v-5a", versionNumber: 1, storagePath: "demo/harvest-v1.jpg", originalFilename: "harvest-v1.jpg", mimeType: "image/jpeg", createdAt: daysAgo(21), url: null },
      { id: "demo-v-5b", versionNumber: 2, storagePath: "demo/harvest-v2.jpg", originalFilename: "harvest-v2.jpg", mimeType: "image/jpeg", createdAt: daysAgo(15), url: null },
    ],
    actions: [
      { id: "demo-a-9", action: "submitted", message: null, createdAt: daysAgo(20), byName: "Devon", byRole: "admin" },
      { id: "demo-a-10", action: "changes_requested", message: "Second frame only — could the type sit a little higher?", createdAt: daysAgo(17), byName: "Avery", byRole: "client" },
      { id: "demo-a-11", action: "version_uploaded", message: "Raised the lockup on frame two.", createdAt: daysAgo(15), byName: "Devon", byRole: "admin" },
      { id: "demo-a-12", action: "approved", message: "Perfect — thank you.", createdAt: daysAgo(14), byName: "Avery", byRole: "client" },
    ],
  }),
  item({
    id: "demo-item-arrival-film",
    propertyId: HARBOUR.id,
    propertyName: HARBOUR.name,
    title: "Arrival film — brand refresh",
    description: "Hero arrival sequence for the refreshed property page.",
    mediaType: "video",
    status: "approved",
    currentVersion: 1,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(24),
    versions: [
      { id: "demo-v-6", versionNumber: 1, storagePath: "demo/arrival-v1.mp4", originalFilename: "arrival-v1.mp4", mimeType: "video/mp4", createdAt: daysAgo(30), url: null },
    ],
    actions: [
      { id: "demo-a-13", action: "submitted", message: null, createdAt: daysAgo(29), byName: "Devon", byRole: "admin" },
      { id: "demo-a-14", action: "approved", message: "Approved — this is exactly the tone we wanted.", createdAt: daysAgo(24), byName: "Avery", byRole: "client" },
    ],
  }),
];

export function buildDemoPortalData(): PortalData {
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
      { id: "demo-t-1", title: "Agreement signed", description: null, status: "done" },
      { id: "demo-t-2", title: "Brand assets received", description: "Logos, type, and photography library", status: "done" },
      { id: "demo-t-3", title: "Property priorities call", description: null, status: "done" },
      { id: "demo-t-4", title: "Creative calendar approved", description: "First 30-day activation plan", status: "done" },
      { id: "demo-t-5", title: "Social accounts connected", description: null, status: "pending" },
      { id: "demo-t-6", title: "Photography refresh scheduled", description: "Autumn shoot for both properties", status: "pending" },
    ],
    items: DEMO_ITEMS,
    otherOrganizations: [],
  };
}
