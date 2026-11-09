# 即时会话

分类：协作与项目。联系人列表与会话窗口，支持搜索联系人、切换会话、文件与语音消息以及发送新消息。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Avatar、Button、ChatBubble、ChatInputBar、ContactItem、IconButton、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { ChatWorkspace } from "@/components/blocks/chat-workspace";

export default function Example() {
  return (<ChatWorkspace onSend={(contactId, content) => console.log(contactId, content)} />);
}
```

## ChatWorkspace Props

| Prop | 必填 | Type |
|---|---|---|
| contacts | 否 | `ChatContact[] \| undefined` |
| messages | 否 | `ChatMessage[] \| undefined` |
| onSend | 否 | `((contactId: string, content: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |
