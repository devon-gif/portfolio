import type { ReactNode } from "react";
import "./first-hospitality.css";

// Scoped layout for the /first-hospitality private partnership concept,
// prepared for First Hospitality. Importing first-hospitality.css here
// (rather than adding it to globals.css) keeps every .fh-theme rule out of
// the main site's bundle on every other route. Same pattern as
// app/oxford/layout.tsx and app/tcrm/layout.tsx.
export default function FirstHospitalityLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
