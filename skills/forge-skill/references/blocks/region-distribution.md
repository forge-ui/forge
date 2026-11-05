# 地区分布卡

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：MapCard。

## 最小可用示例

```tsx
import { RegionDistribution } from "@/components/blocks/region-distribution";

export default function Example() {
  return (<RegionDistribution title="地区分布" />);
}
```

## RegionDistribution Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| subtitle | 否 | `string \| undefined` |
| color | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").AccentColor \| undefined` |
| variant | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").MapVariant \| undefined` |
| regions | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").MapRegion[] \| undefined` |
| highlights | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").MapContinent[] \| undefined` |
| onMenuClick | 否 | `(() => void) \| undefined` |
| width | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardWidth \| undefined` |
| className | 否 | `string \| undefined` |
