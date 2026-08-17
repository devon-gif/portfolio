import type { ReactNode } from "react";
import "./rebel.css";

// Scoped layout for the /rebel private partnership concept.
// Importing rebel.css here (rather than adding it to globals.css) keeps
// every .rebel-theme rule out of the main site's bundle on every other
// route, matching the pattern used by /jacaruso, /bridgetown,
// /grant-hospitality, /tcrm, and /pyramid.
export default function RebelLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
