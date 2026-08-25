// ─────────────────────────────────────────────────────────────────────────────
// portal/types.ts — normalized shapes for the client portal.
//
// Carries DATABASE values (review_items.current_status) rather than
// pre-formatted UI strings, so labels stay in the components and a second
// consumer doesn't inherit one product's wording.
//
// WHAT MAPS ONTO THE EXISTING SCHEMA AND WHAT DOESN'T
//   ReviewItem / ReviewVersion / ReviewAction  → review_items, review_versions,
//     review_actions. Exact fit, no changes needed.
//   GeneralNote                                → review_messages. Exact fit.
//   Annotation                                 → NO HOME. Needs new columns or
//     a table (see supabase/migrations/20260825a_*.sql — written, not applied).
//   Caption / CaptionApproval                  → NO HOME. Needs a new table.
//   ServiceResponsibility                      → NO HOME. Needs columns on
//     review_organizations or review_properties.
// ─────────────────────────────────────────────────────────────────────────────

/** Mirrors review_items.current_status exactly. */
export type ReviewStatus =
  | "draft"
  | "ready_for_review"
  | "changes_requested"
  | "new_direction_requested"
  | "approved"
  | "archived";

/** Mirrors the decisions review_client_decide accepts. */
export type ClientDecision = "approved" | "changes_requested" | "new_direction_requested";

export type ReviewVersion = {
  id: string;
  versionNumber: number;
  storagePath: string;
  originalFilename: string | null;
  mimeType: string | null;
  createdAt: string;
  /** Signed and short-lived for live data; a public /portal-demo path in demo mode. */
  url: string | null;
  /** Uploader's note explaining what changed in this version. */
  note?: string | null;
};

export type ReviewAction = {
  id: string;
  action: string;
  message: string | null;
  createdAt: string;
  /** Display name only — never an email. Resolved via the review_participants RPC. */
  byName: string;
  byRole: "admin" | "client";
};

/**
 * A point comment pinned to a spot on the artwork.
 *
 * x and y are NORMALIZED to the media box (0–1), never browser pixels, so a
 * marker stays on the same part of the image at any viewport size or zoom.
 * timestampSeconds is reserved for video: null on stills, a playhead position
 * on motion. Storing it now means video annotation is a UI addition later
 * rather than a data migration.
 */
export type Annotation = {
  id: string;
  versionId: string;
  /** 0–1, fraction of media width. */
  x: number;
  /** 0–1, fraction of media height. */
  y: number;
  /** Video only. Null for stills. */
  timestampSeconds: number | null;
  body: string;
  authorName: string;
  authorRole: "admin" | "client";
  createdAt: string;
  resolved: boolean;
};

/** A comment not tied to a point on the artwork. Maps to review_messages. */
export type GeneralNote = {
  id: string;
  body: string;
  authorName: string;
  authorRole: "admin" | "client";
  createdAt: string;
};

export type CaptionStatus = "draft" | "ready_for_review" | "changes_requested" | "approved";

export type Caption = {
  id: string;
  platform: string;
  body: string;
  headline: string | null;
  callToAction: string | null;
  hashtags: string[];
  status: CaptionStatus;
  updatedAt: string;
};

export type ReviewItem = {
  id: string;
  organizationId: string;
  propertyId: string;
  propertyName: string;
  title: string;
  description: string | null;
  mediaType: "image" | "video";
  status: ReviewStatus;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  versions: ReviewVersion[];
  actions: ReviewAction[];
  annotations: Annotation[];
  notes: GeneralNote[];
  captions: Caption[];
  /** Optional metadata — all nullable, none required to render. */
  campaign: string | null;
  channels: string[];
  dueDate: string | null;
  durationSeconds: number | null;
  dimensions: string | null;
};

export type OnboardingTask = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "done" | "skipped";
};

export type PortalAccount = {
  id: string | null;
  companyName: string;
  contactName: string | null;
  packageName: string | null;
  monthlyFee: number | null;
  propertyCount: number | null;
  billingStatus: string | null;
  hasBillingPortal: boolean;
};

export type PortalProperty = { id: string; name: string };

export type Party = "archer" | "client" | "external";

/**
 * Who does what for this client. Modelled as three independent axes rather
 * than a single enum, because the combinations are real: Archer might create
 * creative and copy while an external agency publishes.
 */
export type ServiceResponsibility = {
  creative: Party;
  copy: Party;
  publishing: Party;
  socialContactName: string | null;
  socialContactEmail: string | null;
};

export type PortalData = {
  source: "live" | "demo";
  organizationId: string | null;
  organizationName: string;
  viewerFirstName: string;
  account: PortalAccount;
  properties: PortalProperty[];
  tasks: OnboardingTask[];
  items: ReviewItem[];
  responsibility: ServiceResponsibility;
  otherOrganizations: { id: string; name: string }[];
};

export const ACTIVE_STATUSES: ReviewStatus[] = [
  "ready_for_review",
  "changes_requested",
  "new_direction_requested",
  "approved",
];

export function statusLabel(status: ReviewStatus): string {
  switch (status) {
    case "ready_for_review": return "Ready for review";
    case "changes_requested": return "Changes requested";
    case "new_direction_requested": return "New direction";
    case "approved": return "Approved";
    case "draft": return "In progress";
    case "archived": return "Archived";
  }
}

export function statusTone(status: ReviewStatus): "await" | "changes" | "approved" | "neutral" {
  switch (status) {
    case "ready_for_review": return "await";
    case "changes_requested":
    case "new_direction_requested": return "changes";
    case "approved": return "approved";
    default: return "neutral";
  }
}

export function captionStatusLabel(status: CaptionStatus): string {
  switch (status) {
    case "ready_for_review": return "Awaiting approval";
    case "changes_requested": return "Changes requested";
    case "approved": return "Approved";
    case "draft": return "Being written";
  }
}

export function captionStatusTone(status: CaptionStatus): "await" | "changes" | "approved" | "neutral" {
  switch (status) {
    case "ready_for_review": return "await";
    case "changes_requested": return "changes";
    case "approved": return "approved";
    default: return "neutral";
  }
}

export function onboardingProgress(tasks: OnboardingTask[]): number {
  const counted = tasks.filter((t) => t.status !== "skipped");
  if (counted.length === 0) return 0;
  return Math.round((counted.filter((t) => t.status === "done").length / counted.length) * 100);
}

/**
 * Whether an item has cleared every approval it needs.
 *
 * Copy only gates the item when Archer is the one writing it — if the client's
 * own team writes captions, an approved graphic is finished from Archer's side.
 */
export function isFullyApproved(item: ReviewItem, responsibility: ServiceResponsibility): boolean {
  if (item.status !== "approved") return false;
  if (responsibility.copy !== "archer") return true;
  if (item.captions.length === 0) return true;
  return item.captions.every((c) => c.status === "approved");
}

/** What happens once everything is approved, in the client's own terms. */
export function handoffState(
  item: ReviewItem,
  responsibility: ServiceResponsibility
): "not_ready" | "ready_to_publish" | "approved_ready_to_download" {
  if (!isFullyApproved(item, responsibility)) return "not_ready";
  return responsibility.publishing === "archer" ? "ready_to_publish" : "approved_ready_to_download";
}

export function partyLabel(party: Party, orgName: string): string {
  switch (party) {
    case "archer": return "Archer Design";
    case "client": return orgName;
    case "external": return "Your marketing partner";
  }
}
