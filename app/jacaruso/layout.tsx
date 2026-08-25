import type { ReactNode } from "react";
import "./jacaruso.css";

// Scoped layout for the /jacaruso private partnership concept.
// Importing jacaruso.css here (rather than adding it to globals.css) keeps
// every .jacaruso-theme rule out of the main site's bundle on every other
// route, matching the pattern used by /bridgetown, /grant-hospitality,
// /tcrm, /pyramid, and /first-hospitality.
export default function JacarusoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
