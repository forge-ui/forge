# tool-call

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/tool-call.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToolCall (value)

```ts
({ name, title, summary, status, args, result, error, startedAt, duration, icon, onRetry, approvalReason, onApprove, onDeny, defaultOpen, variant, locale, size, className }: ToolCallProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` | Tool name as the model calls it, shown in mono, e.g. "search_orders". |
| `title` | 否 | `ReactNode` | Human label shown instead of the name, e.g. "查询订单". |
| `summary` | 否 | `ReactNode` | Short summary after the label, e.g. the main argument or "12 条结果". |
| `status` | 是 | `ToolCallStatus` |  |
| `args` | 否 | `unknown` |  |
| `result` | 否 | `unknown` |  |
| `error` | 否 | `string \| undefined` |  |
| `startedAt` | 否 | `number \| Date \| undefined` | Start time, for the live timer while running. |
| `duration` | 否 | `number \| undefined` | Final duration in milliseconds. |
| `icon` | 否 | `ReactNode` |  |
| `onRetry` | 否 | `(() => void) \| undefined` | Shown on errors. |
| `approvalReason` | 否 | `ReactNode` | Why the agent wants to run this; shown while awaiting approval. |
| `onApprove` | 否 | `(() => void) \| undefined` |  |
| `onDeny` | 否 | `(() => void) \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `variant` | 否 | `"row" \| "card" \| undefined` | row drops the border, for calls listed inside a ToolCallGroup. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolCallGroup (value)

```ts
({ children, label, count, status, defaultOpen, locale, className }: ToolCallGroupProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `label` | 否 | `ReactNode` | e.g. "调用了 3 个工具"; defaults from `count`. |
| `count` | 否 | `number \| undefined` |  |
| `status` | 否 | `"success" \| "error" \| "running" \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` | Uncontrolled default; the group opens itself while running or after an error. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolCallGroupProps (type)

```ts
export type ToolCallGroupProps = {
  children: ReactNode;
  /** e.g. "调用了 3 个工具"; defaults from `count`. */
  label?: ReactNode;
  count?: number;
  status?: "running" | "success" | "error";
  /** Uncontrolled default; the group opens itself while running or after an error. */
  defaultOpen?: boolean;
  locale?: AgentLocale;
  className?: string;
};
```

## ToolCallProps (type)

```ts
export type ToolCallProps = {
  /** Tool name as the model calls it, shown in mono, e.g. "search_orders". */
  name: string;
  /** Human label shown instead of the name, e.g. "查询订单". */
  title?: ReactNode;
  /** Short summary after the label, e.g. the main argument or "12 条结果". */
  summary?: ReactNode;
  status: ToolCallStatus;
  args?: unknown;
  result?: unknown;
  error?: string;
  /** Start time, for the live timer while running. */
  startedAt?: number | Date;
  /** Final duration in milliseconds. */
  duration?: number;
  icon?: ReactNode;
  /** Shown on errors. */
  onRetry?: () => void;
  /** Why the agent wants to run this; shown while awaiting approval. */
  approvalReason?: ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  defaultOpen?: boolean;
  /** row drops the border, for calls listed inside a ToolCallGroup. */
  variant?: "card" | "row";
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## ToolCallStatus (type)

```ts
export type ToolCallStatus = "pending" | "running" | "awaiting-approval" | "success" | "error" | "denied";
```
