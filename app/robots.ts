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
