import type { ReactNode } from "react";

// /coraltree is a private, personalized sales proposal — it renders
// full-bleed with no CRM chrome (see components/AppChrome.tsx, which lists
// "/coraltree" among the public/full-bleed routes). All of its styling
// lives in app/globals.css under .coraltree-theme, so this layout stays a
// trivial passthrough, matching the pattern used by app/revstudio/layout.tsx.
export default function CoralTreeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
