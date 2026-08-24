// ─────────────────────────────────────────────────────────────────────────────
// portal/types.ts — normalized shapes for the client portal.
//
// Deliberately carries DATABASE values (review_items.current_status) rather
// than pre-formatted UI strings. The review-os data layer returned display text
// like "Awaiting review" straight from the repository, which meant a second
// consumer inherited one product's exact wording and could not relabel without
// touching data code. Labels live in the components here.
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
  /** Signed, short-lived. Null when it could not be minted (or in demo mode). */
  url: string | null;
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
};

export type OnboardingTask = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "done" | "skipped";
};

/** The plan/billing half, from client_onboarding_records. */
export type PortalAccount = {
  id: string | null;
  companyName: string;
  contactName: string | null;
  packageName: string | null;
  monthlyFee: number | null;
  propertyCount: number | null;
  billingStatus: string | null;
  /** Present only when a Stripe customer exists. Never rendered — gates the button. */
  hasBillingPortal: boolean;
};

export type PortalProperty = { id: string; name: string };

/**
 * Everything one client portal render needs.
 *
 * `source` is load-bearing: "demo" means this came from an in-repo fixture and
 * the UI must say so. It is never "demo" for a real client session.
 */
export type PortalData = {
  source: "live" | "demo";
  organizationId: string | null;
  organizationName: string;
  viewerFirstName: string;
  account: PortalAccount;
  properties: PortalProperty[];
  tasks: OnboardingTask[];
  items: ReviewItem[];
  /** Set when the client is a member of more than one organization. */
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
    case "ready_for_review":
      return "Ready for review";
    case "changes_requested":
      return "Changes requested";
    case "new_direction_requested":
      return "New direction requested";
    case "approved":
      return "Approved";
    case "draft":
      return "In progress";
    case "archived":
      return "Archived";
  }
}

export function statusTone(status: ReviewStatus): "await" | "changes" | "approved" | "progress" {
  switch (status) {
    case "ready_for_review":
      return "await";
    case "changes_requested":
    case "new_direction_requested":
      return "changes";
    case "approved":
      return "approved";
    default:
      return "progress";
  }
}

export function onboardingProgress(tasks: OnboardingTask[]): number {
  const counted = tasks.filter((t) => t.status !== "skipped");
  if (counted.length === 0) return 0;
  const done = counted.filter((t) => t.status === "done").length;
  return Math.round((done / counted.length) * 100);
}
