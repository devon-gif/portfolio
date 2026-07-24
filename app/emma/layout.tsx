import type { ReactNode } from "react";

// /emma is Emma's private review-portal entry point — renders full-bleed
// with no CRM chrome (see components/AppChrome.tsx, which lists "/emma"
// among the public prefixes). It ships its own auth (EmmaPortalGate,
// checked against Supabase + review_profiles), not the CRM's owner guard.
export default function EmmaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
