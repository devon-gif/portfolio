import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles runs before Next.js route matching, so the static
      // Archer preview page is served at / instead of app/page.tsx.
      // (vercel.json rewrites run after the framework routes, so they
      // cannot override the prerendered homepage.)
      beforeFiles: [
        {
          source: "/dovetail",
          destination: "/dovetail/index.html",
        },
        {
          source: "/",
          destination: "/archer-preview/index.html",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
