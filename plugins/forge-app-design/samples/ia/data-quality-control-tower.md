# Data Quality Control Tower IA

Source PRD: `/Users/hesong/Desktop/数据集质量评估系统_产品方案PRD.md`

## Product Flow

`数据导入 -> 选择质检模板 -> 执行扫描 -> 查看问题清单 -> 选择修复策略 -> 确认修复(diff) -> 生成合规报告 -> 数据上报`

## IA Decision

This PRD must be treated as a management system with separated lifecycles, not as
one quality workspace. The correct split is:

| Route | Primary verb | Lifecycle | User decision | Links out |
|---|---|---|---|---|
| `/` | prioritize | overview | 哪个部门/数据源/批次风险最高 | `/quality-runs`, `/issues`, `/reports` |
| `/data-sources` | connect | artifact | 哪个数据源可用于质检，健康状态如何 | `/quality-runs/new` |
| `/templates` | govern | policy | 该用哪套国标模板，覆盖率和版本是否可靠 | `/templates/[id]`, `/quality-runs/new` |
| `/templates/[id]` | inspect | policy | 规则覆盖范围、严重级别、修复策略是否合规 | `/quality-runs/new` |
| `/quality-runs` | monitor | event | 哪些扫描正在跑、失败、待处理 | `/quality-runs/[id]`, `/quality-runs/new` |
| `/quality-runs/new` | configure | operation | 用哪个源、哪个模板、什么范围执行扫描 | `/quality-runs/[id]` |
| `/quality-runs/[id]` | diagnose | event | 此次扫描结果、根因分布、阻塞点是什么 | `/issues`, `/reports/[id]` |
| `/issues` | triage | operation | 哪些问题应优先自动修复/人工处理 | `/issues/[id]` |
| `/issues/[id]` | repair | operation | 是否采用某个修复策略并确认 diff | `/quality-runs/[id]`, `/audit-logs` |
| `/reports` | publish | artifact | 哪份报告达到上报标准 | `/reports/[id]` |
| `/reports/[id]` | review | artifact | 报告证据链是否足够导出/提交 | `/audit-logs` |
| `/audit-logs` | audit | event | 谁在何时对什么数据做了什么变更 | source/detail routes |
| `/settings` | configure | policy | 权限、阈值、报告章模板、保留策略 | `/audit-logs` |

## Anti-Pattern To Reject

Do not build `/quality-runs/[id]` as a page that contains:

- source connection management
- template library editing
- scan execution setup
- issue repair diff editor
- report preview/export
- audit log stream

That creates a visually dense page but not a credible management system.

## Minimum Fresh Validation Scope

For a first IA validation, implement these routes with real pages:

1. `/`
2. `/data-sources`
3. `/templates`
4. `/quality-runs`
5. `/quality-runs/new`
6. `/quality-runs/[id]`
7. `/issues`
8. `/issues/[id]`
9. `/reports`
10. `/reports/[id]`
11. `/audit-logs`
12. `/settings`

The first pass may use static data, but every route must expose its own primary
business verb and at least one link to the next lifecycle route.
