import type { NextConfig } from "next";

// Served from the root of www.borasports.com.ar (custom domain), not a
// GitHub Pages sub-path, so no basePath/assetPrefix is needed.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
