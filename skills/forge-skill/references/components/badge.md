# badge

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/badge.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ArtisticIcon (value)

```ts
({ children, color, variant, }: { children: ReactNode; color?: ArtisticIconColor; variant?: ArtisticIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `variant` | 否 | `ArtisticIconVariant \| undefined` |  |

## ArtisticIconColor (type)

```ts
export type ArtisticIconColor = keyof typeof artisticShells;
```

## ArtisticIconVariant (type)

```ts
export type ArtisticIconVariant = "gradient" | "orbs";
```

## CircleIcon (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: CircleIconColor; size?: CircleIconSize; variant?: CircleIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| "xs" \| undefined` |  |
| `variant` | 否 | `"solid" \| "light" \| "neutral" \| undefined` |  |

## CircleIconColor (type)

```ts
export type CircleIconColor = keyof typeof circleIconVariants.solid;
```

## CircleIconSize (type)

```ts
export type CircleIconSize = keyof typeof circleIconSizes;
```

## CircleIconVariant (type)

```ts
export type CircleIconVariant = keyof typeof circleIconVariants;
```

## Label (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: LabelColor; size?: LabelSize; variant?: LabelVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "red" \| "gray" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `variant` | 否 | `LabelVariant \| undefined` |  |

## LabelColor (type)

```ts
export type LabelColor = keyof typeof labelColors;
```

## LabelSize (type)

```ts
export type LabelSize = keyof typeof labelSizes;
```

## LabelVariant (type)

```ts
export type LabelVariant = "outline" | "solid";
```

## NotificationBadge (value)

```ts
({ children, color, }: { children: ReactNode; color?: NotificationBadgeColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| undefined` |  |

## NotificationBadgeColor (type)

```ts
export type NotificationBadgeColor = keyof typeof notificationColors;
```

## 选型

| 场景 | 选 |
|---|---|
| 铃铛未读数 / 角标 | `NotificationBadge` |
| 业务页状态 / 分类 / 角色 / 标签 | **纯文本**（危险红字、失效灰字、其余黑字），不用本节组件 |
| 营销页强调 Tag（新功能、VIP，产品方明确要求） | `Label variant="solid"` |
| 图标美化 | `CircleIcon`（圆底） / `ArtisticIcon`（装饰） |
| 表格状态列 | 纯文本（`CellText`/`CellMuted`），**不用** `StatusBadge`/`Label` |
