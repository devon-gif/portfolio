// Archer Review — workspace scope.
//
// "Which workspace am I looking at" is the one piece of state the admin
// shell, the switcher, and the URL all have to agree on, so it lives here as
// a plain value type with pure helpers — no React, no I/O, no Supabase. That
// keeps components/review/WorkspaceSwitcher.tsx and SimpleAdminReview.tsx
// from having to import each other just to share a representation.
//
// A scope is either every workspace the signed-in user can see ("all", which
// leans entirely on RLS to decide what "every" means) or one specific
// organization. Organizations are referenced by an opaque `ref` rather than a
// resolved id because the value round-trips through the URL, where a slug is
// far friendlier than a UUID — resolveScopeOrganization() accepts either.
//
// Partner-scoped and Archer-internal workspaces are deliberately absent: this
// is the Phase 1/2 slice (switcher, All Workspaces, single-organization
// views, filtering) and nothing more.

import type { OrganizationRecord } from "./types";

export type WorkspaceScope =
  | { kind: "all" }
  | { kind: "organization"; ref: string };

export const ALL_WORKSPACES: WorkspaceScope = { kind: "all" };

/** Query-string key used to make a workspace selection shareable. */
export const WORKSPACE_QUERY_PARAM = "ws";

/**
 * Parses a `?ws=` token (or a persisted preference) back into a scope.
 * Returns null — not a default — for anything unrecognized, so callers can
 * tell "no preference expressed" apart from "explicitly All Workspaces" and
 * apply defaultWorkspaceScope() only in the former case.
 */
export function parseWorkspaceScope(token: string | null | undefined): WorkspaceScope | null {
  const raw = (token ?? "").trim();
  if (!raw) return null;
  if (raw === "all") return ALL_WORKSPACES;
  if (raw.startsWith("org:")) {
    const ref = raw.slice("org:".length).trim();
    return ref ? { kind: "organization", ref } : null;
  }
  return null;
}

export function serializeWorkspaceScope(scope: WorkspaceScope): string {
  return scope.kind === "all" ? "all" : `org:${scope.ref}`;
}

export function workspaceScopesEqual(a: WorkspaceScope, b: WorkspaceScope): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "all" || b.kind === "all") return true;
  return a.ref.toLowerCase() === b.ref.toLowerCase();
}

/**
 * Resolves a scope's `ref` against the organizations the user can actually
 * see, matching on either id or slug. Returns null for All Workspaces and for
 * a ref that no longer resolves (a stale bookmark, or an organization whose
 * access was revoked) — callers should treat null as "show everything the
 * user can see" rather than erroring, since RLS is the real boundary.
 */
export function resolveScopeOrganization(
  scope: WorkspaceScope,
  organizations: OrganizationRecord[]
): OrganizationRecord | null {
  if (scope.kind !== "organization") return null;
  const ref = scope.ref.toLowerCase();
  return (
    organizations.find(
      (organization) =>
        organization.id.toLowerCase() === ref || (organization.slug ?? "").toLowerCase() === ref
    ) ?? null
  );
}

/** Prefer the slug in URLs, but fall back to the id for slug-less rows. */
export function organizationScope(organization: OrganizationRecord): WorkspaceScope {
  return { kind: "organization", ref: organization.slug || organization.id };
}

/**
 * What to show when the visitor has expressed no preference. A user with
 * exactly one accessible organization lands directly in it — that is the
 * pre-multi-client behavior, preserved verbatim, and an "All Workspaces" view
 * of a single client would only add a redundant hop.
 */
export function defaultWorkspaceScope(organizations: OrganizationRecord[]): WorkspaceScope {
  return organizations.length === 1 ? organizationScope(organizations[0]) : ALL_WORKSPACES;
}
