const BASE_PATH = process.env.GITHUB_ACTIONS === "true" ? "/BoraSport" : "";

export function assetPath(path: string) {
  return `${BASE_PATH}${path}`;
}
