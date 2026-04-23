const BASE_PATH = process.env.NODE_ENV === "production" ? "/forge" : "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
