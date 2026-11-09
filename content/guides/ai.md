# 让 AI 用 Forge

## 需要什么

先安装唯一规范 forge-skill；MCP 提供可选的检索数据，不能覆盖规范正文。让 AI 先选择 Screen，再选 Blocks，最后查组件 API。

## 选择配方

forge-skill、MCP、llms.txt 与统一审计清单。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { Panel } from "@forge-ui-official/core";

export function ReviewScope() {
  return <Panel><p>按 Screen → Blocks → Components 实施，并提交真实验证证据。</p></Panel>;
}
```

## 常见错误与验收

安装：npx skills add https://github.com/forge-ui/forge --skill forge-skill。接入见 /docs/mcp，文本入口为 /llms.txt。示例提问：先检索运营看板 Screen 和趋势 Block，读取状态与布局规范，再给出配方。缺能力标记 FORGE-GAP 并询问；技术检查不能代替浏览器验收。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

