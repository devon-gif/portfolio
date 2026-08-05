import type { ReactNode } from "react";
import "./pyramid.css";

// Scoped layout for the /pyramid private creative-production concept,
// prepared privately by Archer Design for Pyramid Global Hospitality.
// Importing pyramid.css here (rather than adding it to globals.css) keeps
// every .pyr-theme rule out of the main site's bundle on every other route.
// Same pattern as app/first-hospitality/layout.tsx and app/oxford/layout.tsx.
export default function PyramidLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
