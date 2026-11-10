# Forge 页面生成评测

- 编码助手：claude；Forge core：0.6.0；日期：2026-11-10
- baseline：项目已装 @forge-ui-official/core，没有 Forge 的 Skill、MCP 和 DESIGN.md；forge：额外运行 setup.sh 并接入 MCP。
- 合格 = 页面存在、类型检查通过、从 core 引入组件、没有引入其他 UI 库、forge-check 无错误、用到任务要求的组件，六项全部通过。

| 条件 | 题数 | 合格率 | 平均分 | 编译通过 | 用 core 组件 | 检查无错误 | 用对组件 | 平均警告 | 总耗时（分钟） |
|---|---|---|---|---|---|---|---|---|---|
| baseline | 20 | 90% | 98 | 100% | 100% | 95% | 95% | 0.7 | 38 |
| forge | 20 | 100% | 100 | 100% | 100% | 100% | 100% | 0.0 | 55 |

| 任务 | baseline | forge |
|---|---|---|
| orders-list | 合格 | 合格 |
| customer-detail | 合格 | 合格 |
| ops-dashboard | 合格 | 合格 |
| product-form | 合格 | 合格 |
| checkout-steps | 合格 | 合格 |
| profile-settings | 合格 | 合格 |
| notification-settings | 合格 | 合格 |
| members-roles | 合格 | 合格 |
| login | 合格 | 合格 |
| agent-chat | 合格 | 合格 |
| task-board | 合格 | 合格 |
| file-manager | 合格 | 合格 |
| calendar | 83（expectedComponents） | 合格 |
| invoice-detail | 合格 | 合格 |
| transactions | 合格 | 合格 |
| approval | 合格 | 合格 |
| delete-confirm | 合格 | 合格 |
| workflow-list | 合格 | 合格 |
| runtime-monitor | 合格 | 合格 |
| app-shell | 83（checkClean） | 合格 |
