// Archer Review — shared types for the review-portal data layer.
// These are the shapes the UI (SimpleAdminReview / SimpleClientReview /
// ChatPanel / MediaPreview) works with, regardless of which backend
// (lib/review/local.ts or lib/review/supabase.ts) actually produced them.
// Keeping one normalized shape here is what lets the UI stay backend-agnostic.

export type ReviewStatus =
  | "Draft"
  | "Awaiting review"
  | "Revision requested"
  | "New direction requested"
  | "Approved"
  | "Archived";

export type MediaKind = "image" | "video";

export type HistoryEntry = {
  id: string;
  by: string;
  message: string;
  createdAt: string;
};

// Where the renderable media for a version actually lives. MediaPreview uses
// this to decide how to resolve `assetRef` into a real, playable URL:
//   "url"     -> assetRef is already a public path (e.g. seed demo assets).
//   "blob"    -> assetRef is an IndexedDB record id (local demo fallback).
//   "storage" -> assetRef is a Supabase Storage path in the private
//                "review-media" bucket; resolve with a signed URL.
export type AssetSource = "url" | "blob" | "storage";

export type ReviewItemRecord = {
  id: string;
  organizationId: string;
  organizationName: string;
  propertyId: string;
  property: string;
  title: string;
  description: string;
  kind: MediaKind;
  assetSource: AssetSource;
  assetRef: string;
  assetName?: string;
  assetSize?: number;
  version: number;
  status: ReviewStatus;
  dueDate: string;
  clientFeedback: string;
  internalNote: string;
  decisionBy: string;
  decisionAt: string;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
};

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
};

export type PropertyRecord = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  active: boolean;
};

export type ChatMessageRecord = {
  id: string;
  organizationId: string;
  reviewItemId?: string | null;
  sender: string;
  senderRole: "admin" | "client";
  body: string;
  createdAt: string;
  readAt: string | null;
};

export type ReviewProfile = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "client";
};

export type ClientDecision = "Approved" | "Revision requested" | "New direction requested";

// A tiny pub/sub contract so the UI can call one `subscribe(...)` regardless
// of whether updates come from a `storage`/CustomEvent pair (local demo) or
// Supabase Realtime (production).
export type Unsubscribe = () => void;
