"use client";

import { useEffect } from "react";

const LEGACY_CONTACT_HREFS = [
  "mailto:heydevon@gmail.com",
  "mailto:hello@archerdesign.shop",
];

export function ContactLinkRewriter() {
  useEffect(() => {
    if (!window.location.pathname.startsWith("/devon")) return;

    const rewriteLinks = () => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));

      anchors.forEach((anchor) => {
        const href = anchor.getAttribute("href") || "";
        const isLegacyContactLink = LEGACY_CONTACT_HREFS.some((legacyHref) => href.startsWith(legacyHref));
        const looksLikeContactButton = /contact|touch|project|work with me|talk about/i.test(anchor.textContent || "");

        if (isLegacyContactLink || looksLikeContactButton) {
          anchor.setAttribute("href", "/contact");
          anchor.removeAttribute("target");
          anchor.removeAttribute("rel");
        }
      });
    };

    rewriteLinks();

    const observer = new MutationObserver(rewriteLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
