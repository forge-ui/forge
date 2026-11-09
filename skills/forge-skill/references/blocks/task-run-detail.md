# 任务执行详情

分类：AI 与智能体。任务概要、带时间线的执行过程，以及可预览、下载、复制的结果产物。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、HistoryItem、Modal、Panel、StatusBadge、StreamingAnswer、cn。

## 最小可用示例

```tsx
import { TaskRunDetail } from "@/components/blocks/task-run-detail";

export default function Example() {
  return (<TaskRunDetail onDownload={artifact => console.log(artifact.name)} />);
}
```

## TaskRunDetail Props

| Prop | 必填 | Type |
|---|---|---|
| task | 否 | `TaskRunDetailData \| undefined` |
| onDownload | 否 | `((artifact: TaskArtifact) => void) \| undefined` |
| className | 否 | `string \| undefined` |
