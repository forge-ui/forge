# 消息渠道

分类：AI 与智能体。把智能体接入企业微信、飞书、钉钉等渠道：渠道入口、已建连接卡片与绑定弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、Checkbox、IconButton、Modal、PlusIcon、SelectOption、StatusBadge、TextField、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { MessageChannels } from "@/components/blocks/message-channels";

export default function Example() {
  return (<MessageChannels onSave={connection => console.log(connection.name)} />);
}
```

## MessageChannels Props

| Prop | 必填 | Type |
|---|---|---|
| channels | 否 | `ChannelType[] \| undefined` |
| connections | 否 | `ChannelConnection[] \| undefined` |
| onSave | 否 | `((connection: ChannelConnection) => void) \| undefined` |
| className | 否 | `string \| undefined` |
