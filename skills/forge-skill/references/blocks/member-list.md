# 成员列表

分类：协作与项目。展示团队成员、职位与在线状态，适用于项目和工作区。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ListGroup、UserCard。

## 最小可用示例

```tsx
import { MemberList } from "@/components/blocks/member-list";

export default function Example() {
  return (<MemberList title="成员" members={[{ id: "zhang", name: "张三", initials: "张", subtitle: "负责人" }]} />);
}
```

## MemberList Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("@forge-ui-official/core").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `import("react").ReactNode` |
| badge | 否 | `import("react").ReactNode` |
| tabs | 否 | `import("@forge-ui-official/core").ListGroupTab[] \| undefined` |
| activeTab | 否 | `string \| undefined` |
| onTabChange | 否 | `((value: string) => void) \| undefined` |
| closable | 否 | `boolean \| undefined` |
| onClose | 否 | `(() => void) \| undefined` |
| density | 否 | `import("@forge-ui-official/core").CardDensity \| undefined` |
| items | 否 | `import("react").ReactNode` |
| members | 否 | `({ avatar?: string; initials?: string; initialsColor?: "purple" \| "blue" \| "green" \| "orange"; name: string; badge?: import("react").ReactNode; subtitle?: import("react").ReactNode; stats?: { label: string; value: string; }[]; checked?: boolean; onMenuClick?: () => void; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; })[] \| undefined` |
