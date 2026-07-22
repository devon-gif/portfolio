import type { ReactNode } from "react";
import "./george.css";

// /george is a private, personalized proposal microsite prepared for The
// George, it renders full-bleed with no CRM chrome (see
// components/AppChrome.tsx, which lists "/george" among the public
// prefixes). All styling lives in ./george.css, scoped under .george-theme
// with a gg- class prefix so it can never affect /topline, /revstudio,
// /coraltree, or any other route.
export default function GeorgeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
