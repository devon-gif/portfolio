import type { ReactNode } from "react";

// The Revstudio's light/glass theme and text-contrast rules now live
// entirely in app/globals.css (.revstudio-theme, scoped to the page root
// rendered in app/revstudio/page.tsx) as normal CSS custom properties and
// component classes. This layout no longer needs its own stylesheet, a
// wrapper div, or the runtime DOM-based contrast-fixing components that
// used to live here (HeroTextContrastFix / SectionTextContrastFix /
// HeroBrandStyleFix) — those were client-side patches working around
// styling that lives correctly in the real components now.
export default function RevstudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
