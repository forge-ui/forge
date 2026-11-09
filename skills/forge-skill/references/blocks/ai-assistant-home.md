# AI 助手首页

分类：AI 与智能体。问候、已连接应用、带快捷操作的输入框与建议问题；提问后展示思考过程与流式回答。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Button、ChatBubble、ChatInputBar、StreamingAnswer、ThinkingTrace、cn。

## 最小可用示例

```tsx
import { AiAssistantHome } from "@/components/blocks/ai-assistant-home";

export default function Example() {
  return (<AiAssistantHome userName="张宁" />);
}
```

## AiAssistantHome Props

| Prop | 必填 | Type |
|---|---|---|
| userName | 否 | `string \| undefined` |
| suggestions | 否 | `AssistantSuggestion[] \| undefined` |
| apps | 否 | `string[] \| undefined` |
| answer | 否 | `((prompt: string) => string) \| undefined` |
| className | 否 | `string \| undefined` |
