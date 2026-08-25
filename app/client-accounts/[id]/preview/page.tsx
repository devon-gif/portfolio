import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/server";
import { loadOwnerPreviewData } from "@/lib/portal/context";
import { PortalShell } from "@/app/portal/components/PortalShell";
import { PortalHome } from "@/app/portal/components/PortalHome";
import { PreviewBar } from "./PreviewBar";
import "@/app/portal/portal.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Client dashboard preview — Archer Design",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Owner-only "View client dashboard".
 *
 * The ONLY place a client's portal is addressed by a URL id, and it is
 * owner-gated twice: proxy.ts rejects non-owner sessions before this runs, and
 * getAuthContext() is re-checked here. Production client authorization never
 * uses this path — /portal resolves the organization from review_memberships
 * and accepts no id at all.
 *
 * Renders the SAME components a real client gets, so what is reviewed here is
 * genuinely the client experience rather than a mock of it.
 */
export default async function PreviewHome({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthContext();
  if (ctx.role !== "owner") redirect("/login");

  const { id } = await params;
  const data = await loadOwnerPreviewData(id);

  return (
    <>
      <PreviewBar recordId={id} />
      <PortalShell reviewCount={data.items.filter((i) => i.status === "ready_for_review").length} demo>
        <PortalHome data={data} hrefBase={`/client-accounts/${id}/preview/review`} />
      </PortalShell>
    </>
  );
}
