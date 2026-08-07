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
          // Private, speculative Bridgetown Revenue Management Solutions
          // partnership concept. Per-page noindex/nofollow metadata already
          // blocks it (app/bridgetown/page.tsx); listed here too,
          // belt-and-suspenders, same as /coraltree, /emma, /oxford, and
          // /pyramid above.
          "/bridgetown",
          "/candidates",
          "/companies",
          "/contact-candidates",
          "/contacts",
          // Private, personalized sales proposal — per-page noindex/nofollow
          // metadata already blocks it (app/coraltree/page.tsx); listed here
          // too, belt-and-suspenders, same as /revstudio's approach.
          "/coraltree",
          "/daily",
          "/dashboard",
          // Private Valencia review portal. /emma and /review/admin also
          // carry per-page noindex metadata; listed here too, same
          // belt-and-suspenders treatment as /coraltree above.
          "/emma",
          "/followups",
          // Private, speculative GRANT Hospitality × Archer Design
          // partnership concept. Per-page noindex/nofollow metadata already
          // blocks it (app/grant-hospitality/page.tsx); listed here too,
          // belt-and-suspenders, same as /bridgetown above.
          "/grant-hospitality",
          "/hiring-signals",
          // Private HSC × The RevStudio × Archer Design joint partner-review
          // page. Per-page noindex/nofollow metadata already blocks it
          // (app/hotel-commercial-growth/page.tsx and .../one-page/page.tsx);
          // listed here too, belt-and-suspenders, same as /bridgetown,
          // /coraltree, /emma, /oxford, and /pyramid above.
          "/hotel-commercial-growth",
          "/intake",
          // Private, speculative Jacaruso Enterprises × Archer Design
          // partnership concept. Per-page noindex/nofollow metadata already
          // blocks it (app/jacaruso/page.tsx); listed here too,
          // belt-and-suspenders, same as /bridgetown and /grant-hospitality
          // above.
          "/jacaruso",
          "/login",
          "/messages",
          "/outreach",
          // Private Oxford Hotels & Resorts outreach page. Per-page
          // noindex/nofollow metadata already blocks it
          // (app/oxford/page.tsx); listed here too, belt-and-suspenders,
          // same as /coraltree and /emma above.
          "/oxford",
          "/partners",
          // Private Pyramid Global Hospitality creative-production concept.
          // Per-page noindex/nofollow metadata already blocks it
          // (app/pyramid/page.tsx); listed here too, belt-and-suspenders,
          // same as /coraltree, /emma, and /oxford above.
          "/pyramid",
          "/review",
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
