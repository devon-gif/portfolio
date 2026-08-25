import { PortalShell } from "./PortalShell";

/**
 * Signed in, but no review_memberships row.
 *
 * Deliberately says nothing about whether an account exists elsewhere, and
 * offers no way in — membership is granted by Archer, never self-served.
 */
export function NotProvisioned() {
  return (
    <PortalShell>
      <div style={{ maxWidth: 520, margin: "10vh auto 0" }}>
        <div className="ap-card" style={{ textAlign: "center" }}>
          <span className="ap-eyebrow">Archer Design</span>
          <h1 className="ap-h2" style={{ margin: "12px 0" }}>Your workspace isn&apos;t set up yet</h1>
          <p className="ap-muted">
            You&apos;re signed in, but this account isn&apos;t linked to a client workspace yet. Reach out to Devon at
            Archer Design and he&apos;ll finish setting it up.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
