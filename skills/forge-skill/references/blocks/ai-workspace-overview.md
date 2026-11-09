# 智能体工作台

分类：AI 与智能体。智能体、知识库、工具与模型的资源概况，按 7/30/90 天切换的监控统计与用户、对话趋势。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ButtonGroup、Panel、ProgressBar、SmoothLineChart、StatCard、cn。

## 最小可用示例

```tsx
import { AiWorkspaceOverview } from "@/components/blocks/ai-workspace-overview";

export default function Example() {
  return (<AiWorkspaceOverview />);
}
```

## AiWorkspaceOverview Props

| Prop | 必填 | Type |
|---|---|---|
| resources | 否 | `WorkspaceResource[] \| undefined` |
| periods | 否 | `WorkspacePeriod[] \| undefined` |
| className | 否 | `string \| undefined` |
