---
title: 用 Claude Code 写后台页面：从一句话需求到通过规范检查
description: AI 写的后台页面往往能跑、但不像同一个产品。本文用 Forge 的 Skill、MCP 和页面检查，演示 Claude Code 从一句中文需求生成订单列表页，并把颜色、组件和交互都收进同一套规范。
date: 2026-11-12
tags: Claude Code, AI 写前端, vibe coding, 后台页面, 前端 Skill
---

让 Claude Code、Codex 或 Cursor 写一个后台页面，现在几分钟就能跑起来。问题通常出在第二个、第十个页面：按钮圆角不一样，表格有的自己画、有的用组件，状态颜色每页一套，弹窗按 Esc 有的能关、有的不能。单看每页都“能用”，放在一起却不像同一个产品。

原因不在模型不会写代码，而在它不知道你的规范。下面用 Forge 演示怎么把规范交给编码助手，让它每次都按同一套组件和规则生成页面。

## 准备：一条命令装好 Skill 和 MCP

在项目根目录运行：

```bash
curl -fsSL https://www.forgeui.org/setup.sh | bash
```

脚本会识别本机的 Claude Code、Cursor 和 Codex，给它们装好两样东西：

- **forge-skill**：Forge 的组件选型、布局、颜色层级和交互规则。编码助手遇到“做一个列表页”这类任务时会自动读取它。
- **Forge MCP**：按需查询组件参数、页面组件和模板源码，不用把整套文档塞进上下文；它还带一个 `check_code` 工具，编码助手写完代码可以直接自查。

想只装到当前项目、顺带放一份 DESIGN.md，可以加参数：

```bash
curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --scope project --design
```

## 实操：一句话生成订单列表页

在装好 Forge 的 Next.js 项目里，对 Claude Code 说：

> 做一个订单列表页：顶部有搜索和状态筛选，表格显示订单号、客户、金额、状态和下单时间，支持勾选后批量导出。

它会先读 Skill，确定这是“列表页”，再用 MCP 查 `DataTable`、`Toolbar`、`StatusBadge` 的参数。生成的列定义大致是这样：

```tsx
const columns: ColumnDef<Order>[] = [
  { key: "id", header: "订单号", valueKind: "identifier", minWidth: 170 },
  { key: "customer", header: "客户", flex: true, minWidth: 120 },
  { key: "amount", header: "金额", valueKind: "number", minWidth: 130 },
  { key: "status", header: "状态", render: order => <StatusBadge {...orderStatuses[order.status]} variant="soft" /> },
  { key: "createdAt", header: "下单时间", valueKind: "identifier", minWidth: 150 },
];
```

几个细节都来自规范，而不是临场发挥：金额标成 `number`，表格会自动右对齐；订单号和时间标成 `identifier`，保持左对齐；状态用 `StatusBadge` 的浅色样式，不手写彩色圆角块。导出 CSV 时还处理了中文乱码和公式注入。

## 检查：让问题在交付前暴露

页面写完，用 `forge-check` 跑一遍。它是一个没有依赖的脚本，下载下来就能用：

```bash
curl -fsSL https://www.forgeui.org/forge-check.mjs -o forge-check.mjs
node forge-check.mjs src/app/orders
```

它从源码里找写死的颜色、手搓的表格和弹窗、指向 `#` 的链接、空的点击事件等问题，按行号列出问题和改法。比如下面这段来自一次没有装 Skill 的生成结果，助手给头像写死了一个紫色：

```tsx
const avatarSvg = `<svg ...><rect width="80" height="80" fill="#7c3aed"/>...</svg>`;
```

检查会报 `hex-color`：写死了颜色，应改用色阶类或语义 token。改完、错误清零再交付。编码助手自己也能跑这条命令，或者调用 MCP 的 `check_code`，在 Claude Code 里直接说“检查一下这个页面，把错误修掉”就行。

## 效果：同一批任务，装与不装的差别

我们用 20 个常见后台任务（订单列表、客户详情、运营看板、设置页、登录、智能体对话、任务看板、日程等）做了一次对比，同一个 Claude Code，同样装了 Forge 组件库，区别只在有没有装 Skill 和 MCP：

| | 没装 Skill 和 MCP | 装了 Skill 和 MCP |
|---|---|---|
| 合格率（20 题） | 90% | 100% |
| 页面检查无错误 | 95% | 100% |
| 平均警告数 | 0.7 | 0 |
| 总耗时 | 38 分钟 | 55 分钟 |

两边差别最明显的两题：

- **日程页**：没装时，助手用日历格子自己拼了一个月视图；装了之后，直接用整体日历组件 `FullCalendar`。
- **后台框架**：没装时，头像颜色写死成 hex；装了之后没有。

代价是每题平均多花约 50 秒，花在读规范和查组件参数上。完整题目、评分规则和结果都在 [Forge 仓库的 evals 目录](https://github.com/forge-ui/forge/tree/main/evals)，可以自己复现。

## 把规范写进项目

Skill 解决“怎么用组件”，项目自己的约定还需要写下来：

- **AGENTS.md**：告诉编码助手用哪个组件库、页面放哪、写完要跑什么检查。Codex 和 Cursor 都会读它，Claude Code 读 CLAUDE.md，可以在里面引用 AGENTS.md。
- **DESIGN.md**：颜色、字色层级、圆角和状态色。安装时加 `--design` 会放一份 Forge 的版本，按你的品牌改主色即可，也可以在[主题定制](/docs/theme)里生成。

## 在 Codex 和 Cursor 里一样用

`setup.sh` 会同时给检测到的工具安装，Skill 遵循通用的 Agent Skills 格式，MCP 是标准的 Streamable HTTP 服务。提示词、检查命令都一样，换工具不用重学。

## 相关文档

- [前端设计 Skill：让编码助手按规范写后台页面](/docs/ui-for-agents)
- [MCP 服务器](/docs/mcp)
- [页面检查](/docs/check)
- [后台模板](/templates)
