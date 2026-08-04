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
  // Plain process.env.GITHUB_ACTIONS isn't inlined into the client bundle
  // (only NEXT_PUBLIC_* vars are), so lib/basePath.ts read "true" during
  // the server-side export but undefined after client hydration — breaking
  // asset URLs right after the page loaded. Exposing it here fixes that.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
