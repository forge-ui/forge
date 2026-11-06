# 用 Forge 搭运营看板

## 需要什么

先确认指标口径、时间范围、下钻对象与刷新频率。选择 /templates/dashboards/analytics 作为主对照，不从空白卡片墙开始。

## 选择配方

dashboard-header、kpi-metrics、trend-chart、recent-records。Blocks 是复制到项目的源码，不是 core 导出；先通过 MCP get_block 查询安装命令与完整 props。Screens 见 [模板](/templates)，组件见 [案例](/cases)。

## 示例代码

```tsx
import { KpiMetrics } from "@/components/blocks/kpi-metrics";

export function Overview() {
  return <KpiMetrics metrics={[{ id: "orders", title: "订单", value: "128" }]} />;
}
```

## 常见错误与验收

保留 Screen 的层级与密度：外壳 16/20、区块间 20、Grid 16、卡片 padding 16；图域参考 224。按业务选择 4 等分、8:4、3 等分或 2 等分；窄屏重排。不要把模板圆角 24 和 token 20 混作同一标准。

## 规范依据

[对应规范](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/page-recommended-standard.md) · [统一审计清单](https://github.com/forge-ui/forge/blob/main/skills/forge-skill/references/audit-checklist.md)

