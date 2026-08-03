import type { ReactNode } from "react";
import "./oxford.css";

// Scoped layout for the /oxford private proposal, prepared for Oxford
// Hotels & Resorts. Importing oxford.css here (rather than adding it to
// globals.css) keeps every .oxford-theme rule out of the main site's
// bundle on every other route. Same pattern as app/tcrm/layout.tsx.
export default function OxfordLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
