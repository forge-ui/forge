# agent-ops

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-ops.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentInbox (value)

```ts
({ tasks, title, onApprove, onReject, onRetry, onOpen, locale, className }: AgentInboxProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 是 | `InboxTask[]` |  |
| `title` | 否 | `ReactNode` |  |
| `onApprove` | 否 | `((id: string) => void) \| undefined` |  |
| `onReject` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `onOpen` | 否 | `((id: string) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentInboxProps (type)

```ts
export type AgentInboxProps = {
  tasks: InboxTask[];
  title?: ReactNode;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};
```

## AgentTaskState (type)

```ts
export type AgentTaskState = "running" | "needs-you" | "failed" | "done";
```

## AwayItem (type)

```ts
export type AwayItem = {
  id: string;
  title: string;
  kind: "needs-you" | "failed" | "done";
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
};
```

## AwaySummary (value)

```ts
({ awayFor, items, onDismiss, locale, className }: AwaySummaryProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `awayFor` | 是 | `number` | How long the user was away, in milliseconds. |
| `items` | 是 | `AwayItem[]` |  |
| `onDismiss` | 否 | `(() => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AwaySummaryProps (type)

```ts
export type AwaySummaryProps = {
  /** How long the user was away, in milliseconds. */
  awayFor: number;
  items: AwayItem[];
  onDismiss?: () => void;
  locale?: AgentLocale;
  className?: string;
};
```

## InboxTask (type)

```ts
export type InboxTask = {
  id: string;
  title: string;
  /** Which agent works on it. */
  agent?: string;
  status: AgentTaskState;
  startedAt?: number | Date;
  duration?: number;
  /** One line on where it stands, e.g. "等你确认退款金额". */
  summary?: string;
  /** The last few things it did, shown when the row opens. */
  recent?: string[];
};
```

## RunningNow (value)

```ts
({ tasks, onOpen, locale, className }: RunningNowProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 是 | `InboxTask[]` |  |
| `onOpen` | 否 | `((id: string) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## RunningNowProps (type)

```ts
export type RunningNowProps = {
  tasks: InboxTask[];
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};
```
