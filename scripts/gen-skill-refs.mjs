#!/usr/bin/env node
// 从 src/components/ui/index.ts 提取所有 export，生成 Skill references 骨架。
// 运行：node scripts/gen-skill-refs.mjs

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "..",
);
const UI_INDEX = path.join(ROOT, "src/components/ui/index.ts");
const CASES_DIR = path.join(ROOT, "src/app/(showcase)/cases");
const SKILL_ROOT = path.join(ROOT, ".claude/skills/forge");
const REFS = path.join(SKILL_ROOT, "references");
const COMPONENTS_DIR = path.join(REFS, "components");
const TEMPLATES_DIR = path.join(REFS, "templates");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function parseIndex(src) {
  const map = new Map();
  const re = /export\s+(type\s+)?\{([^}]+)\}\s+from\s+"([^"]+)";/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const isType = !!m[1];
    const names = m[2]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const source = m[3];
    if (!map.has(source))
      map.set(source, { values: new Set(), types: new Set() });
    const target = map.get(source);
    names.forEach((n) => (isType ? target.types : target.values).add(n));
  }
  return map;
}

function sourceToFileName(source) {
  return source.replace(/^\.\.?\//, "").replace(/\//g, "-");
}

function componentMd(source, values, types) {
  const fileName = sourceToFileName(source);
  const valueList = Array.from(values);
  const typeList = Array.from(types);
  const title = valueList[0] || fileName;

  const lines = [];
  lines.push(`# ${title}${valueList.length > 1 ? " 家族" : ""}`);
  lines.push("");
  lines.push(`> 源: \`${source}\` (相对 \`src/components/ui/\`)`);
  lines.push("");
  if (valueList.length > 0) {
    lines.push("## 包含");
    lines.push("");
    valueList.forEach((v) => lines.push(`- \`${v}\``));
    lines.push("");
  }
  if (typeList.length > 0) {
    lines.push("## 类型导出");
    lines.push("");
    typeList.forEach((t) => lines.push(`- \`${t}\``));
    lines.push("");
  }
  lines.push("## 用途");
  lines.push("");
  lines.push("<!-- 待补：一句话描述每个组件的用途 -->");
  lines.push("");
  lines.push("## Props");
  lines.push("");
  lines.push("完整 TS 类型见源文件。核心 prop:");
  lines.push("");
  lines.push("<!-- 待补：列核心 prop 和取值 -->");
  lines.push("");
  lines.push("## 示例");
  lines.push("");
  lines.push("```tsx");
  lines.push(
    `import { ${valueList.slice(0, 3).join(", ") || "X"} } from "@/components/ui";`,
  );
  lines.push("");
  lines.push("// 待补示例");
  lines.push("```");
  lines.push("");
  lines.push("## 选型建议");
  lines.push("");
  lines.push("<!-- 待补：什么场景用这个 -->");
  lines.push("");
  lines.push("## 常见踩坑");
  lines.push("");
  lines.push("<!-- 待补 -->");
  return lines.join("\n") + "\n";
}

function skillMd(map) {
  const entries = Array.from(map.entries())
    .filter(([, { values }]) => values.size > 0)
    .map(([source, { values }]) => ({
      fileName: sourceToFileName(source),
      source,
      values: Array.from(values),
    }));

  const lines = [];
  lines.push("---");
  lines.push("name: forge");
  lines.push(
    "description: Forge UI Kit（Next.js 16 + Tailwind v4）专用 Skill。写业务页面、查组件 props、配色、布局模板时调用。",
  );
  lines.push("---");
  lines.push("");
  lines.push("# Forge UI Kit Skill");
  lines.push("");
  lines.push(
    "你在基于 Forge UI Kit 的 Next.js 项目里工作。职责：读 PRD，用 Forge 组件拼业务页面，不手搓、不造轮子。",
  );
  lines.push("");
  lines.push("## 铁律（违反必须重写）");
  lines.push("");
  lines.push('1. 组件只 `import { X } from "@/components/ui"`');
  lines.push("2. 颜色只用 `fg-*` token，禁用 Tailwind 默认色（如 `text-blue-500`）");
  lines.push(
    '3. Icon 用 `solar-icon-set`，颜色走 `color="#HEX"` prop，不用 className',
  );
  lines.push("4. 布局用 `<AppLayout>`，不自拼 sidebar + topbar");
  lines.push("5. 写代码前读对应 `/cases/<name>` 页的源文件，不凭想象写 props");
  lines.push("");
  lines.push("## 按需加载 references");
  lines.push("");
  lines.push("| 场景 | 读 |");
  lines.push("|---|---|");
  lines.push("| 颜色 / token | `references/tokens.md` |");
  lines.push("| Icon 用法 | `references/icons.md` |");
  lines.push("| 登录页 | `references/templates/auth.md` |");
  lines.push("| 业务骨架 | `references/templates/business.md` |");
  lines.push("| 找 case 示例 | `references/cases-index.md` |");
  lines.push("| 工作流 | `references/workflow.md` |");
  lines.push("");
  lines.push("## 组件索引");
  lines.push("");
  lines.push("| 主组件 | 家族 / 子组件 | md |");
  lines.push("|---|---|---|");
  for (const { fileName, values } of entries) {
    const primary = values[0];
    const siblings =
      values.length > 1 ? values.slice(1, 4).join(", ") + (values.length > 4 ? ` ... +${values.length - 4}` : "") : "—";
    lines.push(`| \`${primary}\` | ${siblings} | \`components/${fileName}.md\` |`);
  }
  lines.push("");
  lines.push("## 工作流（摘要）");
  lines.push("");
  lines.push("1. 读 PRD");
  lines.push("2. 挑模板骨架（登录 / 电商 / 自定义）");
  lines.push("3. 拆页面 → 拼组件（先读 case 示例）");
  lines.push("4. 缺组件停下问，不手搓");
  lines.push("5. `pnpm tsc --noEmit` + 截图确认");
  lines.push("");
  lines.push("详见 `references/workflow.md`。");
  return lines.join("\n") + "\n";
}

function casesIndexMd() {
  const cases = fs
    .readdirSync(CASES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const lines = [];
  lines.push("# Case 索引");
  lines.push("");
  lines.push(
    `共 ${cases.length} 个 case，源文件 \`src/app/(showcase)/cases/<name>/page.tsx\`。AI 在写业务前读对应页的源文件查看组件实际用法。`,
  );
  lines.push("");
  lines.push("| Case | 路由 | 覆盖组件 |");
  lines.push("|---|---|---|");
  for (const name of cases) {
    lines.push(`| ${name} | \`/cases/${name}\` | <!-- 待补 --> |`);
  }
  return lines.join("\n") + "\n";
}

function tokensPlaceholder() {
  return `# Color & Typography Tokens

## Colors（8 色 × 10 shade）

完整 hex 清单见 \`src/app/globals.css\`。

- \`fg-violet-{50..900}\` 品牌主色（别名 \`fg-violet\` = 500 = #7239EA）
- \`fg-blue-{50..900}\`（500 = #3553FF）
- \`fg-green-{50..900}\`（500 = #09B96D）
- \`fg-red-{50..900}\`（别名 \`fg-red\` = 500 = #FE4A23）
- \`fg-yellow-{50..900}\`（别名 \`fg-yellow\` = 500 = #F6C002）
- \`fg-cyan-{50..900}\`（500 = #43CED7）
- \`fg-black-{50..900}\`（别名 \`fg-black\` = 500 = #000A19，非纯黑）
- \`fg-grey-{50..900}\`（50 = #FAFAFA，900 = #4F4F4F）

## Typography

- \`--font-sans\` = Manrope（正文）
- \`--font-display\` = Plus Jakarta Sans（标题）

## 用法

- Tailwind: \`bg-fg-violet-500\` / \`text-fg-black\` / \`border-fg-grey-200\`
- CSS: \`var(--fg-violet)\` / \`var(--fg-grey-700)\`

## 深浅调性

- 50 / 100 浅底
- 500 主色
- 700+ 深底或高对比文字
`;
}

function iconsPlaceholder() {
  return `# Icons — solar-icon-set

\`\`\`tsx
import { MagniferLinear, BellBoldDuotone } from "solar-icon-set";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
\`\`\`

## 项目统一色值

- 默认灰: \`#71717A\`（对应 \`fg-grey-700\`）

## 两个必踩的坑

1. **className 颜色无效**：\`className="text-fg-red"\` 对 solar icon 不生效，库里 fill 写死，颜色只能走 \`color\` prop。
2. **wrapper 压扁 SVG**：外层 \`p-Y\` 或固定 height 会压扁 icon。Icon 外层只给 \`w-X h-X\` 正方形 box 或 \`inline-flex items-center\`。

## 常用 icon 索引（按语义）

<!-- 待补：列 30-50 个高频 icon -->

- 搜索: \`MagniferLinear\`
- 通知: \`BellBoldDuotone\`
- 邮件: \`LetterBoldDuotone\`
- 日历: \`CalendarBoldDuotone\`
- 菜单: \`HamburgerMenuLinear\`
- 下拉: \`AltArrowDownLinear\`
- 复制: \`CopyLinear\`
- 外链: \`ArrowRightUpLinear\`
- 勾选: \`CheckCircleLinear\`
`;
}

function workflowPlaceholder() {
  return `# 工作流

## PRD → 页面（5 步）

1. **读 PRD**：抽页面清单、每页操作、数据字段、业务状态、权限
2. **挑模板**：
   - 登录 → 用 \`src/app/{sign-in,sign-up,forgot-password,reset-password}\` 现成页
   - 后台业务（列表 + 详情 + 新建） → 复制 \`src/app/app/ecommerce/<最接近模块>\` 改
   - 自定义 → 套 \`<AppLayout>\` 起架子
3. **拆页面 → 拼组件**：先骨架（AppLayout + Toolbar + 主容器），再按区块拆；每块对应 Kit 组件；不确定的读 \`/cases/<name>\` 示例
4. **缺组件停下问**：Kit 里没合适的，别手搓，问人
5. **自检**：\`pnpm tsc --noEmit\` + 截图

## 提交前自检

- [ ] 没有手搓 div 复刻 Kit 已有组件
- [ ] 颜色全走 \`fg-*\` token，无裸 Tailwind 默认色
- [ ] Icon 用 \`solar-icon-set\` + \`color\` prop
- [ ] 布局用 \`<AppLayout>\` 或继承自模板
- [ ] tsc 通过
- [ ] 截图对照过设计
- [ ] 不确定的已问人，未自行发挥
`;
}

function templatesAuthPlaceholder() {
  return `# 登录套件

4 个现成页面，改文案和接口即可：

| 路由 | 文件 |
|---|---|
| /sign-in | \`src/app/sign-in/page.tsx\` |
| /sign-up | \`src/app/sign-up/page.tsx\` |
| /forgot-password | \`src/app/forgot-password/page.tsx\` |
| /reset-password | \`src/app/reset-password/page.tsx\` |

## 改什么

- 文案 / 品牌 logo
- 表单字段 / 校验规则
- 接口对接（fetch / server action）
- 成功后跳转路径

## 不要改什么

- 整体布局结构
- 色板 / 字体 / icon 规范
`;
}

function templatesBusinessPlaceholder() {
  return `# 业务模板 — app/ecommerce

电商后台骨架，5 个模块，每模块三件套（列表 / 详情 / 新建）：

| 模块 | 路径 |
|---|---|
| categories | \`src/app/app/ecommerce/categories/\` |
| customers | \`src/app/app/ecommerce/customers/\` |
| orders | \`src/app/app/ecommerce/orders/\` |
| products | \`src/app/app/ecommerce/products/\` |
| sellers | \`src/app/app/ecommerce/sellers/\` |

每模块结构：

\`\`\`
<module>/
├── page.tsx          # 列表
├── [id]/
│   └── page.tsx      # 详情
└── new/
    └── page.tsx      # 新建
\`\`\`

## 新业务接入

1. 选最接近的模块 copy（如 orders 适合"订单类业务"）
2. 改路由目录名 + page 里的字段和接口
3. 保留 \`<AppLayout>\` + \`<Toolbar>\` + \`<DataTable>\` / 表单 骨架
4. 二开只改"数据"，不改"结构"
`;
}

function main() {
  ensureDir(COMPONENTS_DIR);
  ensureDir(TEMPLATES_DIR);

  const src = fs.readFileSync(UI_INDEX, "utf-8");
  const map = parseIndex(src);

  let count = 0;
  for (const [source, { values, types }] of map.entries()) {
    if (values.size === 0 && types.size === 0) continue;
    const fileName = sourceToFileName(source);
    fs.writeFileSync(
      path.join(COMPONENTS_DIR, `${fileName}.md`),
      componentMd(source, values, types),
    );
    count++;
  }

  fs.writeFileSync(path.join(SKILL_ROOT, "SKILL.md"), skillMd(map));
  fs.writeFileSync(path.join(REFS, "cases-index.md"), casesIndexMd());
  fs.writeFileSync(path.join(REFS, "tokens.md"), tokensPlaceholder());
  fs.writeFileSync(path.join(REFS, "icons.md"), iconsPlaceholder());
  fs.writeFileSync(path.join(REFS, "workflow.md"), workflowPlaceholder());
  fs.writeFileSync(
    path.join(TEMPLATES_DIR, "auth.md"),
    templatesAuthPlaceholder(),
  );
  fs.writeFileSync(
    path.join(TEMPLATES_DIR, "business.md"),
    templatesBusinessPlaceholder(),
  );

  console.log(`✅ 生成 ${count} 份组件 md`);
  console.log(`✅ SKILL.md + 5 份专题 md + cases-index.md`);
  console.log(`路径: ${SKILL_ROOT}`);
}

main();
