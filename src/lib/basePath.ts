// Temporarily back on /BoraSport until www.borasports.com.ar is repointed.
// Must read NEXT_PUBLIC_BASE_PATH (set in next.config.ts), not GITHUB_ACTIONS
// directly — only NEXT_PUBLIC_* vars get inlined into the client bundle, so
// a plain env var here would read correctly during the server export but as
// undefined after client hydration, breaking every asset URL post-load.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string) {
  return `${BASE_PATH}${path}`;
}
