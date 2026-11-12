// Chinese pages and their English counterparts. Pages without a pair link to the English home.
export const LANGUAGE_PAIRS: ReadonlyArray<readonly [zh: string, en: string]> = [
  ["/", "/en"],
  ["/docs/ui-for-agents", "/en/frontend-design-skill"],
  ["/templates", "/en/admin-templates"],
  ["/components/agent", "/en/ai-chat-components"],
];

export const isEnglishPath = (path: string) => path === "/en" || path.startsWith("/en/");

export function counterpart(path: string) {
  const normalized = path.length > 1 ? path.replace(/\/$/, "") : path;
  if (isEnglishPath(normalized)) return LANGUAGE_PAIRS.find(([, en]) => en === normalized)?.[0] ?? "/";
  return LANGUAGE_PAIRS.find(([zh]) => zh === normalized)?.[1] ?? "/en";
}

export function languageAlternates(path: string) {
  const pair = LANGUAGE_PAIRS.find(([zh, en]) => zh === path || en === path);
  return pair ? { "zh-CN": pair[0], en: pair[1], "x-default": pair[0] } : undefined;
}
