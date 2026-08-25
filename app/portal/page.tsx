import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadPortalData } from "@/lib/portal/data";
import { PortalShell } from "./components/PortalShell";
import { PortalHome } from "./components/PortalHome";
import { NotProvisioned } from "./components/NotProvisioned";

export const dynamic = "force-dynamic";

/**
 * Client home.
 *
 * Authorization is membership-based and resolved server-side: getAuthContext()
 * reads the verified session, then review_memberships under RLS. There is no id
 * in this route — a client cannot address another client's workspace because
 * there is nowhere to put the address. `?org=` only selects among memberships
 * the caller already has (validated inside loadPortalData).
 */
export default async function PortalPage({ searchParams }: { searchParams: Promise<{ org?: string }> }) {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/portal/login");
  if (ctx.role === "owner") redirect("/client-accounts");

  const { org } = await searchParams;
  const data = await loadPortalData(ctx, org);
  if (!data) return <NotProvisioned />;

  const needsReview = data.items.filter((i) => i.status === "ready_for_review").length;

  return (
    <PortalShell reviewCount={needsReview}>
      <PortalHome data={data} hrefBase="/portal/review" />
    </PortalShell>
  );
}
