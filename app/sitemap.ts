import type { MetadataRoute } from "next";
import { PUBLIC_PAGES, absoluteUrl } from "@/lib/seo";
import { isRevstudioPageApproved } from "@/lib/revstudio";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = PUBLIC_PAGES.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // /revstudio is an early, unapproved partnership page — only listed in
  // the sitemap once REVSTUDIO_PAGE_APPROVED=true (see lib/revstudio.ts +
  // REVSTUDIO_PARTNERSHIP_PAGE_SETUP.md). The page itself is also
  // per-page noindex until then (app/revstudio/page.tsx), so this is
  // belt-and-suspenders rather than the only gate.
  if (isRevstudioPageApproved()) {
    pages.push({
      url: absoluteUrl("/revstudio"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
