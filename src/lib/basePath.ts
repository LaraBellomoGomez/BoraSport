// Served from the root of www.borasports.com.ar — no path prefix needed.
const BASE_PATH = "";

export function assetPath(path: string) {
  return `${BASE_PATH}${path}`;
}
