# 应用智能体目录

分类：AI 与智能体。左侧目录分组，按发布状态与复杂度筛选的智能体卡片，支持搜索、分页与从模板创建。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、ButtonGroup、IconButton、Pagination、Panel、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { AgentCatalog } from "@/components/blocks/agent-catalog";

export default function Example() {
  return (<AgentCatalog onOpen={agent => console.log(agent.name)} />);
}
```

## AgentCatalog Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AppAgent[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onCreateFromTemplate | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((agent: AppAgent) => void) \| undefined` |
| className | 否 | `string \| undefined` |
