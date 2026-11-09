# 自主智能体

分类：AI 与智能体。系统预置与我的自主智能体卡片，显示运行时与确认策略，一键运行并在最近任务中跟踪状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、Modal、PlusIcon、SelectOption、StatusBadge、TextArea、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { AutonomousAgents } from "@/components/blocks/autonomous-agents";

export default function Example() {
  return (<AutonomousAgents onRun={(agent, prompt) => console.log(agent.name, prompt)} />);
}
```

## AutonomousAgents Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AutonomousAgent[] \| undefined` |
| tasks | 否 | `AutonomousTask[] \| undefined` |
| onRun | 否 | `((agent: AutonomousAgent, prompt: string) => void) \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
