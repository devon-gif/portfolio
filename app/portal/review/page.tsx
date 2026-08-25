import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadPortalData } from "@/lib/portal/data";
import { PortalShell } from "../components/PortalShell";
import { ReviewQueue } from "../components/ReviewQueue";
import { NotProvisioned } from "../components/NotProvisioned";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/portal/login");
  if (ctx.role === "owner") redirect("/client-accounts");

  const data = await loadPortalData(ctx);
  if (!data) return <NotProvisioned />;

  const needsReview = data.items.filter((i) => i.status === "ready_for_review").length;

  return (
    <PortalShell reviewCount={needsReview}>
      <header>
        <h1 className="ap-h1">Creative Review</h1>
        <p className="ap-muted" style={{ marginTop: 8 }}>
          Everything Archer is working on for {data.organizationName}.
        </p>
      </header>
      <ReviewQueue data={data} hrefBase="/portal/review" />
    </PortalShell>
  );
}
