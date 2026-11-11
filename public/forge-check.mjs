#!/usr/bin/env node
// Forge page check: static rules from the Forge audit checklist that can be decided from source alone.
// Usage: node forge-check.mjs [paths...] [--json]   (defaults to ./src)
// No dependencies; also used by the Forge MCP server's check_code tool.

const RULES = [
  {
    rule: "hex-color", audit: "V1", severity: "error",
    pattern: /\[#[0-9a-fA-F]{3,8}\]|\b(?:color|fill|stroke|background|backgroundColor|borderColor|outlineColor|boxShadow|textColor|accentColor)\s*[:=]\s*\{?\s*["'`]#[0-9a-fA-F]{3,8}\b/g,
    skip: line => /^\s*(import|\/\/|\*|\/\*)/.test(line),
    message: "写死了 hex 颜色。",
    fix: "改用语义 token 或色阶类，例如 text-fg-grey-700、bg-fg-blue-500、var(--accent)；用 get_tokens 查名称。",
  },
  {
    rule: "arbitrary-px", audit: "V1", severity: "warning",
    pattern: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|text|rounded|leading|tracking)-\[\d+(?:\.\d+)?px\]/g,
    message: "间距、字号或圆角用了裸 px 的任意值。",
    fix: "用 Tailwind 刻度和 Forge token（p-4、gap-6、text-sm、rounded-card）；固定栏宽这类布局尺寸不受此限。",
  },
  {
    rule: "foreign-ui-library", audit: "C1", severity: "error",
    pattern: /from\s+["'](?:lucide-react|react-icons[^"']*|@heroicons\/[^"']+|@radix-ui\/[^"']+|antd|@mui\/[^"']+|@chakra-ui\/[^"']+|@mantine\/[^"']+|@headlessui\/[^"']+|@\/components\/ui\/[^"']+)["']/g,
    message: "引入了 Forge 以外的组件或图标库。",
    fix: "组件从 @forge-ui-official/core 引入，图标从 @forge-ui-official/core/icons 引入；缺失能力标记 FORGE-GAP 后再讨论。",
  },
  {
    rule: "direct-solar-import", audit: "M2", severity: "warning",
    pattern: /from\s+["']@solar-icons\/react[^"']*["']/g,
    message: "直接从 @solar-icons/react 引入图标。",
    fix: "改从 @forge-ui-official/core/icons 引入同名图标，保持尺寸和默认颜色一致。",
  },
  {
    rule: "raw-button", audit: "C1", severity: "warning",
    pattern: /<button\b(?![^>]*\bdata-forge-allow\b)/g,
    message: "手写了 <button>。",
    fix: "用 Button、IconButton 或 StyledLink；需要无样式按钮时用 <Button variant=\"unstyled\">。",
  },
  {
    rule: "raw-table", audit: "C2", severity: "warning",
    pattern: /<table\b(?![^>]*\bdata-forge-allow\b)/g,
    message: "手写了 <table>。",
    fix: "普通数据列表用 DataTable 或 FullWidthTable；邮件、可访问性等确需原生表格时加 data-forge-allow 并注明原因。",
  },
  {
    rule: "raw-form-control", audit: "C1", severity: "warning",
    pattern: /<(?:input|select|textarea)\b(?![^>]*\btype=["'](?:hidden|file)["'])(?![^>]*\bdata-forge-allow\b)/g,
    message: "手写了原生表单控件。",
    fix: "用 TextField、SelectOption、TextArea、Checkbox、RadioButton、Toggle 等 core 组件。",
  },
  {
    rule: "raw-dialog", audit: "C8", severity: "warning",
    pattern: /<dialog\b|role=["']dialog["']/g,
    message: "手写了弹窗。",
    fix: "用 Modal、Drawer 或 ConfirmationDialog，受控 open，焦点和 Escape 由 core 处理。",
  },
  {
    rule: "violet-color-prop", audit: "V2", severity: "error",
    pattern: /\b(?:color|accent)=["']violet["']/g,
    message: "组件颜色写成了 \"violet\"，不是合法取值。",
    fix: "组件 color prop 用 \"purple\"；CSS token 才叫 fg-violet。",
  },
  {
    rule: "purple-default", audit: "V2", severity: "warning",
    pattern: /\b(?:accent|topbarAccent)=["']purple["']/g,
    message: "页面壳用了紫色主题。",
    fix: "默认主色是蓝色；紫色只在产品明确选择时使用，确认后可忽略。",
  },
  {
    rule: "solid-status", audit: "V6", severity: "warning",
    pattern: /<StatusBadge\b[^>]*variant=["']solid["']/g,
    message: "状态用了 solid 实底胶囊。",
    fix: "状态默认用 soft StatusBadge；实底只用于极少数需要强提醒的场景。",
  },
  {
    rule: "handmade-status-pill", audit: "V6", severity: "warning",
    pattern: /className=["'][^"']*rounded-full[^"']*bg-fg-(?:green|red|yellow|blue|cyan)-(?:50|100)[^"']*["']/g,
    message: "手拼了状态胶囊。",
    fix: "用 StatusBadge（soft）表达状态；分类和角色用普通文字。",
  },
  {
    rule: "grey-heading", audit: "V7", severity: "warning",
    pattern: /<h[1-4]\b[^>]*className=["'][^"']*text-fg-grey-(?:300|400|500|600|700)\b[^"']*["']|<p\b[^>]*className=["'][^"']*text-fg-grey-(?:300|400)\b[^"']*["']/g,
    message: "标题或正文用了禁用级的浅灰色。",
    fix: "正文用 text-fg-black，次要信息 text-fg-grey-900，辅助说明 text-fg-grey-700；只有不可操作的内容才用更浅的灰。",
  },
  {
    rule: "white-surface", audit: "V1", severity: "warning",
    pattern: /\bbg-(?:fg-)?white(?:\/[4-9]\d)?\b(?!\/)/g,
    skip: line => /^\s*(import|\/\/|\*|\/\*)/.test(line),
    message: "背景写死了白色，深色模式下不会跟着变。",
    fix: "卡片、面板、输入框和浮层用 bg-background；只有压在彩色底上必须保持白色的小元素（开关圆点、选中单选的圆点）才用 bg-white。",
  },
  {
    rule: "placeholder-link", audit: "M4", severity: "error",
    pattern: /href=["']#["']/g,
    message: "链接指向 #。",
    fix: "链到真实路由；没有目标时不要渲染成链接。",
  },
  {
    rule: "empty-handler", audit: "C6", severity: "error",
    pattern: /\bon[A-Z]\w*=\{\s*\(\s*\)\s*=>\s*(?:\{\s*\}|undefined|null)\s*\}/g,
    message: "事件处理函数是空的。",
    fix: "接上真实操作并给出反馈；暂时做不了就禁用并说明原因。",
  },
  {
    rule: "fake-success", audit: "C6", severity: "warning",
    pattern: /\b(?:alert|console\.log)\(\s*["'`][^"'`]*(?:成功|已保存|已提交|success)/gi,
    message: "用 alert 或 console.log 假装操作成功。",
    fix: "调用真实接口，用 useToast 给出结果；演示数据要声明是 mock。",
  },
];

const IGNORE = /forge-check-disable-line|eslint-disable-next-line forge/;

export function checkCode(code, filename = "input.tsx") {
  const lines = String(code).split("\n");
  const findings = [];
  for (const rule of RULES) {
    lines.forEach((line, index) => {
      if (IGNORE.test(line) || (index > 0 && /forge-check-disable-next-line/.test(lines[index - 1]))) return;
      if (rule.skip?.(line)) return;
      for (const match of line.matchAll(rule.pattern)) {
        findings.push({ file: filename, line: index + 1, column: match.index + 1, rule: rule.rule, audit: rule.audit, severity: rule.severity, message: rule.message, fix: rule.fix, excerpt: line.trim().slice(0, 160) });
      }
    });
  }
  findings.sort((left, right) => left.line - right.line || left.column - right.column);
  return {
    summary: { errors: findings.filter(item => item.severity === "error").length, warnings: findings.filter(item => item.severity === "warning").length },
    findings,
    note: "只覆盖能从源码静态判断的审计条目；视觉、交互闭环和浏览器验收仍需按 audit-checklist 人工核对。单行豁免：行尾注释 forge-check-disable-line 并写明原因。",
  };
}

export const ruleList = RULES.map(({ rule, audit, severity, message, fix }) => ({ rule, audit, severity, message, fix }));

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const json = argv.includes("--json");
  const targets = argv.filter(arg => !arg.startsWith("--"));
  const roots = targets.length ? targets : ["src"];
  const files = [];
  const walk = target => {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      if (/node_modules|\.next|dist|build|coverage/.test(path.basename(target))) return;
      for (const entry of fs.readdirSync(target)) walk(path.join(target, entry));
    } else if (/\.(tsx|jsx)$/.test(target)) files.push(target);
  };
  roots.forEach(walk);
  const results = files.map(file => checkCode(fs.readFileSync(file, "utf8"), file));
  const findings = results.flatMap(result => result.findings);
  const summary = { files: files.length, errors: findings.filter(item => item.severity === "error").length, warnings: findings.filter(item => item.severity === "warning").length };
  if (json) {
    process.stdout.write(JSON.stringify({ summary, findings }, null, 2) + "\n");
  } else {
    for (const item of findings) console.log(`${item.file}:${item.line}:${item.column}  ${item.severity === "error" ? "错误" : "警告"}  ${item.message}（${item.audit} ${item.rule}）\n    ${item.fix}`);
    console.log(`\n检查了 ${summary.files} 个文件：${summary.errors} 个错误，${summary.warnings} 个警告。`);
  }
  process.exitCode = summary.errors ? 1 : 0;
}

const invokedDirectly = typeof process !== "undefined" && process.argv[1] && import.meta.url.endsWith("/" + process.argv[1].split(/[\\/]/).pop());
if (invokedDirectly) await main(process.argv.slice(2));
