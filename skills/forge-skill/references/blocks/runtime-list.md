# 运行时管理

分类：AI 与智能体。智能体运行时的类型、在线状态与连接地址，支持单个检查与全部探测。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、DataTable、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { RuntimeList } from "@/components/blocks/runtime-list";

export default function Example() {
  return (<RuntimeList />);
}
```

## RuntimeList Props

| Prop | 必填 | Type |
|---|---|---|
| runtimes | 否 | `AgentRuntime[] \| undefined` |
| check | 否 | `((runtime: AgentRuntime) => Promise<RuntimeState>) \| undefined` |
| className | 否 | `string \| undefined` |
