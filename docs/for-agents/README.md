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
| `.agents/skills/forge/SKILL.md` | 铁律 + 工作流；**入口应先指到本目录** |
| `.agents/skills/forge/references/cases-index.md` | cases 原始索引；routes.md 已吸收 |
| `.agents/skills/forge/references/page-patterns.md` | 更长的页面模式说明 |
| `../forge-readdy/catalog/` | 介绍表原稿 + sync 脚本（codegen 用） |
| `../forge-starter/docs/forge-components.md` | Starter 后台捷径，链回本目录 |

## 本地看 cases

```bash
# 在 forge monorepo
pnpm dev   # 按仓库 README
# 浏览器打开 /cases 、 /cases/table 等
```
