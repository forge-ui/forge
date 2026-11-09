# 智能体运行

分类：AI 与智能体。一次自主运行的实时过程：计划逐步推进、工具调用、发送前的人工确认与流式生成的草稿。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：AgentTaskRows、ApprovalCard、Button、Panel、StatusBadge、StreamingAnswer、ThinkingTrace、ToolChips、cn。

## 最小可用示例

```tsx
import { AgentRun } from "@/components/blocks/agent-run";

export default function Example() {
  return (<AgentRun onApprove={answer => console.log(answer)} />);
}
```

## AgentRun Props

| Prop | 必填 | Type |
|---|---|---|
| run | 否 | `AgentRunData \| undefined` |
| stepDuration | 否 | `number \| undefined` |
| onApprove | 否 | `((answer: string[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
