"use client";

import {
  ALL_WORKSPACES,
  organizationScope,
  resolveScopeOrganization,
  workspaceScopesEqual,
  type OrganizationRecord,
  type WorkspaceScope,
} from "@/lib/review";

import styles from "./SimpleReview.module.css";

/**
 * The organization filter for the admin shell: "All workspaces" plus one tab
 * per organization the signed-in user can reach. The list is whatever
 * listOrganizations() returned, which is already RLS-scoped — this component
 * never decides who may see what, it only presents what came back.
 *
 * Renders nothing at all when there are fewer than two organizations. With a
 * single client, "All workspaces" and that client's workspace show the exact
 * same queue, so the switcher would be a control that changes nothing; hiding
 * it keeps today's single-client admin view pixel-identical to what it was
 * before multi-client landed.
 */
export function WorkspaceSwitcher({
  organizations,
  scope,
  onSelect,
}: {
  organizations: OrganizationRecord[];
  scope: WorkspaceScope;
  onSelect: (next: WorkspaceScope) => void;
}) {
  if (organizations.length < 2) return null;

  const activeOrganization = resolveScopeOrganization(scope, organizations);

  return (
    <div className={styles.workspaceBar}>
      <span className={styles.workspaceLabel}>Workspace</span>

      <div className={styles.tabs} role="group" aria-label="Workspace">
        <button
          type="button"
          className={`${styles.tab} ${scope.kind === "all" ? styles.tabActive : ""}`}
          aria-pressed={scope.kind === "all"}
          onClick={() => onSelect(ALL_WORKSPACES)}
        >
          All workspaces
        </button>

        {organizations.map((organization) => {
          const organizationsScope = organizationScope(organization);
          const active =
            activeOrganization?.id === organization.id &&
            workspaceScopesEqual(scope, organizationsScope);

          return (
            <button
              key={organization.id}
              type="button"
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              aria-pressed={active}
              onClick={() => onSelect(organizationsScope)}
            >
              {organization.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WorkspaceSwitcher;
