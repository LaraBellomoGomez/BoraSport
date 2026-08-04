import type { NextConfig } from "next";

// Temporarily back on the /BoraSport sub-path while the custom domain
// (www.borasports.com.ar) is still pointing at the old Tiendanube store —
// switch back to no basePath once that domain is repointed for real.
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPages ? "/BoraSport" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
