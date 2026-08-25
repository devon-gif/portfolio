import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadOwnerPreviewData } from "@/lib/portal/context";
import { PortalShell } from "@/app/portal/components/PortalShell";
import { ReviewQueue } from "@/app/portal/components/ReviewQueue";
import { PreviewBar } from "../PreviewBar";
import "@/app/portal/portal.css";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function PreviewReview({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (ctx.role !== "owner") redirect("/login");

  const { id } = await params;
  const data = await loadOwnerPreviewData(id);

  return (
    <>
      <PreviewBar recordId={id} />
      <PortalShell reviewCount={data.items.filter((i) => i.status === "ready_for_review").length} demo>
        <header>
          <h1 className="ap-h1">Creative Review</h1>
          <p className="ap-muted" style={{ marginTop: 8 }}>
            Everything Archer is working on for {data.organizationName}.
          </p>
        </header>
        <ReviewQueue data={data} hrefBase={`/client-accounts/${id}/preview/review`} />
      </PortalShell>
    </>
  );
}
