# SurfaceCard

> 源: `./surface-card` | 示例: `/components/card`

通用白底内容面板。用于业务 section、详情侧栏、筛选块、空状态等普通容器。不要用 `ChartCard` 伪装非图表面板，也不要在业务 app 里手写 `SectionCard` / `PanelCard`。

## Props

| prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `ReactNode` | — | 标题 |
| `subtitle` | `ReactNode` | — | 副标题 |
| `action` | `ReactNode` | — | 右上操作 |
| `children` | `ReactNode` | **必填** | 主体内容 |
| `footer` | `ReactNode` | — | 底部区域 |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 内容区内边距 |
| `className` | `string` | — | 外层样式 |
| `headerClassName` | `string` | — | header 样式 |
| `contentClassName` | `string` | — | 内容区样式 |
| `footerClassName` | `string` | — | footer 样式 |

## 示例

```tsx
import { Button, SurfaceCard } from "@forge-ui-official/core";

<SurfaceCard
  title="Approval context"
  subtitle="Risk, owner, and next action."
  action={<Button size="sm">Open</Button>}
>
  <p className="text-sm text-fg-grey-700">Use real business content here.</p>
</SurfaceCard>
```

## 选型

| 场景 | 选 |
|---|---|
| 普通标题面板 / section 容器 | `SurfaceCard` |
| 图表容器 | `ChartCard` |
| 看板任务卡 | `TaskCard` |
| 有 logo / 项目进度卡 | `ProjectCard` |
| 活动记录卡 | `ActivityCard` |

## 踩坑

1. `SurfaceCard` 只提供中性容器，不负责业务布局；内部仍应优先使用 Forge 组件。
2. 不要再在业务 app 里定义 `SectionCard` / `MiniCard` / `PanelCard` 这类通用视觉壳。
