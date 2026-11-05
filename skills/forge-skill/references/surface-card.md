# 内容面板边界

core/src/components/ui/surface-card.tsx 存在内部 SurfaceCard 实现，但当前主入口未导出。不得从 @forge-ui-official/core import SurfaceCard，也不能把它当已发布的通用标题 Panel。

按任务选真实 Screen：ecommerce-2 的表格卡壳是有效模板现状；不要把 ChartCard 伪装非图表面板。可复用模板已存在的局部结构；需要新公共 Panel API 时记录 FORGE-GAP 并等待决定。本阶段不新增公共组件。

查看 [生成导出目录](../../../docs/for-agents/components.md)、[Blocks 计划](blocks.md) 与 [统一审计清单](audit-checklist.md)。
