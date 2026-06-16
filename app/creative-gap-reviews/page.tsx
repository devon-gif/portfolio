"use client";

// Admin route — 3-Property Creative Gap Review requests.
// Behind the owner auth guard (CRM route, not in AppChrome PUBLIC_ROUTES).
import { PageHeader } from "@/components/PageHeader";
import { GapReviewsPanel } from "@/components/GapReviewsPanel";

export default function CreativeGapReviewsPage() {
  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Creative Gap Reviews"
        description="3-Property Creative Gap Review requests. Prep outline + manual follow-up per request. Nothing here sends."
      />
      <GapReviewsPanel />
    </div>
  );
}
