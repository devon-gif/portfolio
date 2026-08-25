import { Fraunces } from "next/font/google";

/**
 * Shared display serif for the light "Archer Studio" marketing system.
 * Exposes the --font-luxury-serif CSS variable consumed by the .archer-studio
 * theme in globals.css. Import { fraunces } and apply fraunces.variable on the
 * page root so every marketing page renders identical typography.
 */
export const fraunces = Fraunces({
  variable: "--font-luxury-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
