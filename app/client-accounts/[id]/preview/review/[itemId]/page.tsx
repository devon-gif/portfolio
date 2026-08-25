import { notFound, redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadOwnerPreviewData } from "@/lib/portal/context";
import { PortalShell } from "@/app/portal/components/PortalShell";
import { ReviewWorkspace } from "@/app/portal/components/ReviewWorkspace";
import { PreviewBar } from "../../PreviewBar";
import "@/app/portal/portal.css";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function PreviewItem({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const ctx = await getAuthContext();
  if (ctx.role !== "owner") redirect("/login");

  const { id, itemId } = await params;
  const data = await loadOwnerPreviewData(id);
  const item = data.items.find((i) => i.id === itemId);
  if (!item) notFound();

  return (
    <>
      <PreviewBar recordId={id} />
      <PortalShell reviewCount={data.items.filter((i) => i.status === "ready_for_review").length} demo wide>
        <ReviewWorkspace item={item} data={data} backHref={`/client-accounts/${id}/preview/review`} />
      </PortalShell>
    </>
  );
}
