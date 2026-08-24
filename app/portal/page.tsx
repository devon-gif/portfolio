import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadPortalData } from "@/lib/portal/data";
import { PortalDashboard } from "./components/PortalDashboard";
import { PortalSignOut } from "./components/PortalSignOut";

// Session-dependent by definition.
export const dynamic = "force-dynamic";

/**
 * The real client portal.
 *
 * Authorization is membership-based and resolved entirely server-side:
 * getAuthContext() reads the verified session, then reads review_memberships
 * under RLS. There is no id in this route and nothing is read from the URL —
 * a client cannot address another client's workspace because there is nowhere
 * to put the address.
 *
 * The owner previewing a client uses a different, owner-only route
 * (/client-accounts/[id]/preview) rather than this one.
 */
export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ org?: string }>;
}) {
  const ctx = await getAuthContext();

  // proxy.ts already bounces signed-out visitors; this is the second line.
  if (!ctx.user) redirect("/portal/login");

  // The owner has no membership of their own — send them to the CRM, which is
  // where their view of a client lives.
  if (ctx.role === "owner") redirect("/client-accounts");

  const { org } = await searchParams;
  // `org` only ever selects among memberships the caller already has;
  // loadPortalData validates it against ctx.organizationIds and ignores
  // anything else.
  const data = await loadPortalData(ctx, org);

  if (!data) {
    return (
      <div className="ap-shell">
        <div className="ap-main" style={{ maxWidth: 620, margin: "0 auto", paddingTop: 90 }}>
          <div className="ap-card" style={{ textAlign: "center" }}>
            <span className="ap-eyebrow">Archer Design</span>
            <h1 className="ap-section-title" style={{ marginTop: 12, marginBottom: 12 }}>
              Your workspace isn&apos;t set up yet
            </h1>
            <p className="ap-muted" style={{ marginBottom: 22 }}>
              You&apos;re signed in, but this account isn&apos;t linked to a client workspace yet. Reach out to Devon at
              Archer Design and he&apos;ll finish setting it up.
            </p>
            <PortalSignOut />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PortalDashboard data={data} />
      {data.otherOrganizations.length > 0 && (
        <div className="ap-shell" style={{ paddingBottom: 60 }}>
          <div className="ap-card ap-card--tight">
            <span className="ap-label">Other workspaces</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {data.otherOrganizations.map((o) => (
                <Link key={o.id} href={`/portal?org=${o.id}`} className="ap-btn ap-btn--quiet">
                  {o.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
