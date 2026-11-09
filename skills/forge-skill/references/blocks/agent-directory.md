# 智能体列表

分类：协作与项目。按运行状态筛选的智能体卡片墙，显示职责、技能、任务数与最近运行，可直接对话或分配任务。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Avatar、Button、ButtonGroup、Panel、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { AgentDirectory } from "@/components/blocks/agent-directory";

export default function Example() {
  return (<AgentDirectory onAssign={agent => console.log(agent.name)} />);
}
```

## AgentDirectory Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AgentProfile[] \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onChat | 否 | `((agent: AgentProfile) => void) \| undefined` |
| onAssign | 否 | `((agent: AgentProfile) => void) \| undefined` |
| className | 否 | `string \| undefined` |
