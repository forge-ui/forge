# agent-welcome

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-welcome.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentWelcome (value)

```ts
({ title, description, icon, capabilities, onPick, footer, size, className }: AgentWelcomeProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` |  |
| `capabilities` | 否 | `WelcomeCapability[] \| undefined` | What it can do, as cards that start a conversation. |
| `onPick` | 否 | `((prompt: string) => void) \| undefined` |  |
| `footer` | 否 | `ReactNode` | Anything under the cards, e.g. recent conversations. |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentWelcomeProps (type)

```ts
export type AgentWelcomeProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** What it can do, as cards that start a conversation. */
  capabilities?: WelcomeCapability[];
  onPick?: (prompt: string) => void;
  /** Anything under the cards, e.g. recent conversations. */
  footer?: ReactNode;
  size?: "md" | "sm";
  className?: string;
};
```

## WelcomeCapability (type)

```ts
export type WelcomeCapability = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Sent as the first message when picked. */
  prompt: string;
};
```
