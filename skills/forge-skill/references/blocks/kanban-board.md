# 任务看板

分类：协作与项目。按阶段分列的任务看板，支持在列之间拖拽卡片、快速添加任务，显示优先级、子任务进度与负责人。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Avatar、Button、PlusIcon、TextField、cn。

## 最小可用示例

```tsx
import { KanbanBoard } from "@/components/blocks/kanban-board";

export default function Example() {
  return (<KanbanBoard onMove={(taskId, columnId) => console.log(taskId, columnId)} />);
}
```

## KanbanBoard Props

| Prop | 必填 | Type |
|---|---|---|
| columns | 否 | `KanbanColumn[] \| undefined` |
| onMove | 否 | `((taskId: string, toColumnId: string) => void) \| undefined` |
| onAdd | 否 | `((columnId: string, title: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |
