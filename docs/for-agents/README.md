# Forge for Agents

**写 Forge UI 业务页时先读这里**，再进 skill / cases。

| 文件 | 用途 |
|------|------|
| [`routes.md`](./routes.md) | **路由表**：`/cases/*` → 源码 → 覆盖组件；场景速查 |
| [`components.md`](./components.md) | **介绍表**：组件用途 + 标记 + 对应 case |
| [`inventory.json`](./inventory.json) | 机器可读全量 export 清单 |

## 推荐流程

```text
1. 定页面角色（列表 / 表单 / 详情 / 看板）
2. routes.md 场景速查 → 打开 case 源码
3. components.md 确认组件是否在 Kit 内
4. import from @forge-ui-official/core
5. 没有 → FORGE-GAP
```

## 与其它文档的关系

| 文档 | 关系 |
|------|------|
| [`../../skills/forge-react/SKILL.md`](../../skills/forge-react/SKILL.md) | 组件、token、`AppLayout` 约束 |
| [`../../skills/forge-react/references/page-patterns.md`](../../skills/forge-react/references/page-patterns.md) | 更长的页面模式说明 |
| [`../../skills/forge-react/references/layout-grid.md`](../../skills/forge-react/references/layout-grid.md) | 栅格与页面栏 |
| `../forge-starter/docs/forge-components.md` | 与 Starter 并排检出时的后台捷径，链回本目录 |

## 本地看 cases

```bash
# 在 forge monorepo
pnpm dev   # 按仓库 README
# 浏览器打开 /cases 、 /cases/table 等
```
