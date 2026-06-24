import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // On GitHub Pages, the site lives at /Resume — not needed for local dev
  basePath: process.env.GITHUB_ACTIONS ? "/Resume" : "",
  images: {
    unoptimized: true,
  },
  // Disable ESLint during build (run separately with npm run lint)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
