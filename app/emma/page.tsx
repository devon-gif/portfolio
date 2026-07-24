import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
import { EmmaPortalGate } from "@/components/review/EmmaPortalGate";

// Emma's dedicated review-portal entry point. Private — never indexed,
// never linked from any public nav/sitemap/footer, same treatment as
// /topline, /coraltree, and /george. See components/AppChrome.tsx, which
// lists "/emma" among the public prefixes so it renders full-bleed with no
// CRM sidebar/owner guard (this route ships its own auth via
// EmmaPortalGate, checked against Supabase + review_profiles, not the CRM's
// owner-only guard).
export const metadata: Metadata = {
  title: "Archer Review — Valencia Hotel Group",
  description: "Private creative review workspace for Valencia Hotel Group.",
  alternates: { canonical: absoluteUrl("/emma") },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function EmmaPage() {
  return <EmmaPortalGate />;
}
