import sources from "../_example-sources.json";
import { actionIds, agentChartIds, compositionIds, formNavigationIds, type FusionCatalogItem } from "./registry";

const has = (ids: readonly string[], id: string) => ids.includes(id);
const base = "src/app/components/";
export function exampleSourceFiles(item: FusionCatalogItem): string[] {
  const migrationSources: Record<string, string> = { number: "number", selection: "selection", empty: "empty", toggle: "toggle", accordion: "accordion", pagination: "pagination", tabs: "tabs", command: "command", select: "select" };
  const entry = has(actionIds, item.id) ? `${base}_fusion/actions-buttons.tsx`
    : has(formNavigationIds, item.id) ? `${base}_fusion/forms-navigation.tsx`
    : has(agentChartIds, item.id) ? `${base}_fusion/agent-charts.tsx`
    : has(compositionIds, item.id) ? `${base}_fusion/compositions.tsx`
    : item.id === "040" ? "src/app/prototype/component-fusion/_sidebar-preview.tsx"
    : `${base}_migration-previews.tsx`;
  const found = new Set<string>();
  function collect(file: string) {
    if (found.has(file) || !(file in sources)) return;
    found.add(file);
    const text = sources[file as keyof typeof sources];
    for (const match of text.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)) {
      const parts = `${file.slice(0, file.lastIndexOf("/"))}/${match[1]}`.split("/");
      const normalized: string[] = [];
      for (const part of parts) { if (part === "..") normalized.pop(); else if (part !== ".") normalized.push(part); }
      const path = normalized.join("/");
      const dependency = [path, `${path}.tsx`, `${path}.ts`].find(candidate => candidate in sources);
      if (dependency) collect(dependency);
    }
  }
  if (has(actionIds, item.id)) {
    const cards = ["049", "050", "054"];
    const feedback = ["058", "070", "071", "076", "080", "083", "087", "089", "090"];
    collect(`${base}_fusion/${cards.includes(item.id) ? "actions-cards" : feedback.includes(item.id) ? "actions-feedback" : "actions-buttons"}.tsx`);
    collect(`${base}_fusion/actions-examples.css`);
  } else if (item.kind && migrationSources[item.kind]) collect(`${base}_migration-${migrationSources[item.kind]}-preview.tsx`);
  else collect(entry);
  return [...found];
}
