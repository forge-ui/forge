# Blocks 抽取计划（未实现）

以下约12项是从 Screen 抽取的计划，**不是当前 core 导出，不可直接 import**。先复用对应模板局部，新增公共原语须 FORGE-GAP 决策。

| 计划区块 | 来源与插槽 |
|---|---|
| KPI 行 | analytics：指标、单位、趋势 |
| 标题图表卡 | analytics：标题、指标、图域、图例 |
| 标题表格卡 | ecommerce-2：标题、工具、DataTable |
| 排行 | analytics：名称、指标、排序口径 |
| 构成 | analytics：分组、值、图例 |
| 地区 | ecommerce-3：地区、范围、度量 |
| 成员 | crm：身份、角色、操作 |
| 目标 | finance-3：余额、目标、进度 |
| 活动 | project-1：时间、对象、行为 |
| 收支 | finance-1：账户、金额、周期 |
| 项目摘要 | project-1：项目、负责人、阶段 |
| 看板外壳 | dashboards/_shared：页头、区块间距、响应式 |

来源为候选抽取范围，具体区块 API/命名/支持域均未实现、未验收。不要将 FilterPanel 或 DropdownPanel 当成已完成的通用标题 Panel。
