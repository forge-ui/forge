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

## 尺寸图 skill

设计或审计 ForgeUI 组件时，用仓库里的开源 skill 出 Apple 风格尺寸图。它只给 agent 读，不打进已发布的 `@forge-ui-official/core`，也不要加为 core 的运行时依赖。`public/install-skill.sh` 仍然只安装 `skills/forge-react`。

| Skill | 路径 |
| --- | --- |
| `dimensional-drawing` | [`skills/dimensional-drawing/SKILL.md`](../../skills/dimensional-drawing/SKILL.md) |
| `dimensional-drawing-motion`（可选） | [`skills/dimensional-drawing-motion/SKILL.md`](../../skills/dimensional-drawing-motion/SKILL.md) |

调用：先读对应 `SKILL.md`，再指向组件源码。例如：「按 `skills/dimensional-drawing/SKILL.md`，为这个 ForgeUI 组件出一张尺寸图。」静态图用 `dimensional-drawing`；图纸完成后再要约 10 秒的绘制动画时，才读 `dimensional-drawing-motion`。

规矩：单色；画架构不画文案；源码里没有的尺寸不要编造，写 `[TBD]`。上游为 Enes Ozturk 的 MIT 作品（https://github.com/enesozturk/dimensional-drawing ，commit `5c457437c8c83524308aad3b7443e81adcc13153`）。许可证副本在各 skill 目录的 `LICENSE`。`dimensional-drawing-motion/adapters/headless/package.json` 是上游自带的 private 渲染脚本，不在 pnpm workspace 里，不要把它加进根目录或 `@forge-ui-official/core` 的依赖。

## 本地看 cases

```bash
# 在 forge monorepo
pnpm dev   # 按仓库 README
# 浏览器打开 /cases 、 /cases/table 等
```
