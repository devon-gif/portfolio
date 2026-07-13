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
          source: "/lark",
          destination: "/lark/index.html",
        },
        {
          source: "/valencia",
          destination: "/valencia/index.html",
        },
        {
          source: "/revenue-activation",
          destination: "/revenue-activation/index.html",
        },
        {
          source: "/revenue-activation/work",
          destination: "/revenue-activation/work/index.html",
        },
        {
          source: "/revenue-activation/confirmed",
          destination: "/revenue-activation/confirmed/index.html",
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
