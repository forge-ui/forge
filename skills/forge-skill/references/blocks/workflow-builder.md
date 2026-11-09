# 工作流编辑器

分类：AI 与智能体。左侧节点库、中间流程画布、右侧节点配置，可添加、编辑、删除节点并发布。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：AgentFlowchart、Button、Panel、SelectOption、StatusBadge、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { WorkflowBuilder } from "@/components/blocks/workflow-builder";

export default function Example() {
  return (<WorkflowBuilder onPublish={nodes => console.log(nodes.length)} />);
}
```

## WorkflowBuilder Props

| Prop | 必填 | Type |
|---|---|---|
| nodes | 否 | `AgentFlowNode[] \| undefined` |
| edges | 否 | `AgentFlowEdge[] \| undefined` |
| onPublish | 否 | `((nodes: AgentFlowNode[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
