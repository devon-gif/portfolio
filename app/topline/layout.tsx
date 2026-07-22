import type { ReactNode } from "react";
import "./topline.css";

// /topline is a private, personalized proposal microsite prepared for
// Topline Revenue Management — it renders full-bleed with no CRM chrome
// (see components/AppChrome.tsx, which lists "/topline" among the
// public/full-bleed routes). All styling lives in ./topline.css, scoped
// under .topline-theme with a tl- class prefix so it can never affect
// /revstudio, /coraltree, or any other route.
export default function ToplineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
