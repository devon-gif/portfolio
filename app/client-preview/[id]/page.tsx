import { redirect } from "next/navigation";

/**
 * Legacy route — superseded by /client-accounts/[id]/preview.
 *
 * The owner's client-dashboard preview now lives under the same owner-only
 * prefix as the rest of the CRM and renders the REAL portal components
 * (app/portal/components/PortalDashboard), so what the owner reviews is
 * genuinely what a client sees rather than a second, drifting copy of it.
 *
 * The previous 300-line implementation here was that second copy: it rendered
 * its own hardcoded "Creative review" panel showing zeros, and took the client's
 * identity straight from the URL id. Both problems are gone with it.
 *
 * Kept as a redirect rather than deleted so existing links and bookmarks still
 * resolve. Consolidated, not layered.
 */
export default async function LegacyClientPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/client-accounts/${id}/preview`);
}
