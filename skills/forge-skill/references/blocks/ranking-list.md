# 排行列表卡

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ListGroup。

## 最小可用示例

```tsx
import { RankingList } from "@/components/blocks/ranking-list";

export default function Example() {
  return (<RankingList title="商品排行" items={[<span key="1">商品 A · 192 件</span>]} />);
}
```

## RankingList Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 否 | `string \| undefined` |
| color | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").AccentColor \| undefined` |
| badge | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| items | 是 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| action | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| tabs | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").ListGroupTab[] \| undefined` |
| activeTab | 否 | `string \| undefined` |
| onTabChange | 否 | `((value: string) => void) \| undefined` |
| closable | 否 | `boolean \| undefined` |
| onClose | 否 | `(() => void) \| undefined` |
| density | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardDensity \| undefined` |
| className | 否 | `string \| undefined` |
