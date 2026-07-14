import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16's experimental dev-only "mcpServer" feature writes a browser
  // log file to .next/dev/logs/next-development.log and rotates it on every
  // dev-server start. On filesystems that reject unlinking that file (seen
  // in restricted/sandboxed environments, and reproducible even against a
  // freshly created .next directory), the whole dev server process crashes
  // right after printing "Ready", which surfaces to the browser as an
  // Internal Server Error on every route, not just this one. This feature is
  // unrelated to the app's actual behavior (it only feeds Next's built-in
  // AI-tooling MCP server), so it's disabled here rather than worked around.
  experimental: {
    mcpServer: false,
  },
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
