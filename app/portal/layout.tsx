import type { Metadata } from "next";
import "./portal.css";

export const metadata: Metadata = {
  title: "Archer Design — Client Portal",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Applies the stored theme BEFORE first paint.
 *
 * Without this the server always renders light, and a client who chose dark
 * gets a white flash on every navigation. Light is the default when nothing is
 * stored, and any storage error falls through to light rather than throwing.
 */
const THEME_SCRIPT = `(function(){try{if(localStorage.getItem("archer-portal-theme")==="dark"){var e=document.querySelector(".archer-portal");if(e)e.dataset.theme="dark";}}catch(e){}})();`;

/**
 * Chrome for the client portal.
 *
 * Renders no CRM sidebar and no OwnerAuthGuard — components/AppChrome.tsx
 * returns portal routes untouched. The .archer-portal class scopes the whole
 * light visual system and repaints the background, so the app's near-black body
 * never shows through.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="archer-portal" data-theme="light">
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {children}
    </div>
  );
}
