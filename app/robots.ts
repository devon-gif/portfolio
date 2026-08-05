import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Allow crawling of the public marketing site; block the CRM/admin app,
 * auth flows, and API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/auth/",
          "/candidates",
          "/companies",
          "/contact-candidates",
          "/contacts",
          "/daily",
          "/dashboard",
          "/followups",
          "/hiring-signals",
          "/intake",
          "/login",
          "/messages",
          "/outreach",
          "/partners",
          // Private Pyramid Global Hospitality creative-production concept.
          // Per-page noindex/nofollow metadata already blocks it
          // (app/pyramid/page.tsx); listed here too, belt-and-suspenders.
          "/pyramid",
          "/settings",
          "/suppression",
          "/templates",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
