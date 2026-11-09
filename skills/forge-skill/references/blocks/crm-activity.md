# 客户动态

分类：协作与项目。按团队成员勾选筛选的会议、电话与备注动态流，适合销售周会复盘。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Avatar、Button、Checkbox、Panel、TabBar、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { CrmActivity } from "@/components/blocks/crm-activity";

export default function Example() {
  return (<CrmActivity />);
}
```

## CrmActivity Props

| Prop | 必填 | Type |
|---|---|---|
| members | 否 | `CrmMember[] \| undefined` |
| activities | 否 | `CrmActivityItem[] \| undefined` |
| className | 否 | `string \| undefined` |
