import { notFound, redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadPortalData } from "@/lib/portal/data";
import { PortalShell } from "../../components/PortalShell";
import { ReviewWorkspace } from "../../components/ReviewWorkspace";
import { NotProvisioned } from "../../components/NotProvisioned";

export const dynamic = "force-dynamic";

/**
 * The review workspace for one item.
 *
 * NOTE the itemId in this URL is NOT an authorization mechanism: loadPortalData
 * returns only items belonging to organizations the caller is a member of (RLS
 * enforces it in Postgres), and the item is then looked up WITHIN that set. An
 * id belonging to another client simply isn't found.
 */
export default async function ReviewItemPage({ params }: { params: Promise<{ itemId: string }> }) {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/portal/login");
  if (ctx.role === "owner") redirect("/client-accounts");

  const data = await loadPortalData(ctx);
  if (!data) return <NotProvisioned />;

  const { itemId } = await params;
  const item = data.items.find((i) => i.id === itemId);
  if (!item) notFound();

  const needsReview = data.items.filter((i) => i.status === "ready_for_review").length;

  return (
    <PortalShell reviewCount={needsReview} wide>
      <ReviewWorkspace item={item} data={data} backHref="/portal/review" />
    </PortalShell>
  );
}
