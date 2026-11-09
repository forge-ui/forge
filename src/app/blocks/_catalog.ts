import registry from "../../../blocks/registry.json";

export const categories = ["看板首屏", "AI 与智能体", "数据列表", "详情页", "表单", "协作与项目", "财务", "设置", "图表与指标", "页面结构", "认证"];
type BlockShellConfig = { menu: string; active: string; title: string; with?: string } | "none";
type BlockEntry = Omit<(typeof registry)[number], "shell"> & { shell: BlockShellConfig };
export const blocks: BlockEntry[] = [...(registry as unknown as BlockEntry[])].sort((left, right) => categories.indexOf(left.category) - categories.indexOf(right.category));
export const categoryItems = categories.map(category => ({
  category,
  label: `${category} ${blocks.filter(block => block.category === category).length}`,
}));

export function installationCommand(name: string) {
  return `npx shadcn@latest add https://forgeui.org/r/${name}.json`;
}

export function formatPropType(type: string) {
  return type.replace(/import\(["'](?:@forge-ui-official\/core|react)["']\)\./g, "");
}
