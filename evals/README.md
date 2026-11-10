# Forge 页面生成评测

同样 20 道后台页面需求，比较编码助手在两种条件下写出的页面：

- **baseline**：Next.js 项目已装 `@forge-ui-official/core`，没有 Forge 的 Skill、MCP、DESIGN.md。
- **forge**：在 baseline 上运行 `setup.sh --scope project --design`，并接入 Forge MCP 服务器。

题目在 [`tasks.json`](tasks.json)，每题写一个 `app/<id>/page.tsx`。

## 打分

每题六项，全部通过算合格：

| 项 | 判定 |
|---|---|
| page | 生成了 `app/<id>/page.tsx` |
| compiles | 该题目录内没有 TypeScript 错误 |
| usesCore | 从 `@forge-ui-official/core` 引入了组件 |
| noForeignUi | 没有引入其他 UI 或图标库 |
| checkClean | [`forge-check`](../public/forge-check.mjs) 没有错误 |
| expectedComponents | 用到了题目要求的组件（每组任选其一） |

视觉和交互不自动打分；每次发布时抽查截图。

## 运行

```bash
node evals/run.mjs --agent claude                    # 20 题 × 2 种条件
node evals/run.mjs --agent codex --tasks orders-list,login
node evals/run.mjs --report evals/results/<run>      # 重新生成 report.md
node evals/run.mjs --report evals/results/<run> --rescore   # 用当前 score.mjs 和 tasks.json 重新打分
```

- 依赖装在 `~/.cache/forge-evals/base`，每题的工作区放在 `evals/results/<run>/<条件>/<题目>/`，只提交 `results.json` 和 `report.md`。
- 机器上全局装过 forge-skill 时，baseline 会读到它，脚本会拒绝运行；先移走全局 skill。
- 每题默认最长 15 分钟（`--timeout` 秒）。
- 用同一个 `--out` 重跑会跳过已完成的题；`setup.sh` 拉 GitHub 失败会自动重试。

## 结果

| 日期 | 编码助手 | core | baseline 合格率 | forge 合格率 | 耗时（baseline / forge） | 报告 |
|---|---|---|---|---|---|---|
| 2026-11-10 | Claude Code | 0.6.0 | 90% | 100% | 38 / 55 分钟 | [report.md](results/2026-11-10-claude/report.md) |

这次 baseline 已经很高，两者的差距主要在：forge 条件全部通过 `forge-check`，平均警告从 0.7 降到 0；calendar 用了整体日历组件而不是自己拼格子；app-shell 没有写死色值。forge 条件每题平均多花约 50 秒。

