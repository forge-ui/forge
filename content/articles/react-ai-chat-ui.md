---
title: 用 React 和 AI SDK 做 AI 对话界面：消息、流式回答、工具调用与确认
description: 给后台加一个 AI 助手，界面要处理的不只是一问一答：流式回答、思考过程、工具调用、需要用户确认的操作、生成的文件。本文用 AI SDK 7 和 Forge 的对话组件，一步步搭出一个能用的 AI 对话界面。
date: 2026-11-12
keywords: React AI 对话组件, AI 聊天界面, AI SDK, useChat, AgentParts, 工具调用确认, Ant Design X, TDesign Chat
tags: AI 对话, 生成式 UI
---

给后台加一个 AI 助手，第一版通常是一个输入框加一列气泡。真正上线时会发现要处理的东西多得多：回答是一个字一个字流出来的，模型会先“想一想”，会去调接口查数据，有些操作要用户点头才能做，最后还可能生成一份文件。

这篇文章用 AI SDK 7 管模型和流式，用 Forge 的对话组件管界面，从一个能问答的对话框开始，逐步加上这些能力。

![做完的样子：消息、复制和反馈、推荐提问、输入栏](/images/articles/ai-chat-conversation.png)

## 一条回复里有什么

先看清楚要显示的东西。AI SDK 的 `useChat` 把每条消息拆成若干段（parts），每段有自己的类型：

```cards 一条助手回复可能包含的内容
文本 | 回答正文，流式到达，通常是 Markdown。 | text
思考过程 | 模型在回答前的推理，适合折叠起来。 | reasoning
工具调用 | 查库存、算销量、发邮件，带参数、结果和状态。 | tool-工具名
来源和文件 | 引用的网页或文档，生成的表格和报告。 | source-url、file
```

界面要做的，就是把每一段按类型画对，并且在流式过程中不闪、不跳。

## 第一步：能问能答

服务端用 `streamText` 调模型，再转成 UI 消息流返回：

```ts
// app/api/chat/route.ts
import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage } from "ai";
import { model } from "@/ai/model";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({ model, messages: await convertToModelMessages(messages) });
  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
```

前端用 `useChat` 拿到消息，交给 Forge 的组件：

```tsx
"use client";
import { useChat } from "@ai-sdk/react";
import { AgentMessage, AgentParts, ChatInputBar, Conversation } from "@forge-ui-official/core";

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat();
  return (
    <div className="flex h-full flex-col">
      <Conversation followKey={messages.length}>
        {messages.map(message => (
          <AgentMessage key={message.id} role={message.role === "user" ? "user" : "assistant"}>
            <AgentParts parts={message.parts} status={status} />
          </AgentMessage>
        ))}
      </Conversation>
      <ChatInputBar
        onSend={text => sendMessage({ text })}
        status={status === "submitted" || status === "streaming" ? "running" : "idle"}
        onStop={stop}
      />
    </div>
  );
}
```

这几行已经处理了不少细节：

- `Conversation` 在你停留在底部时自动跟随新内容；往上翻看历史时不再抢滚动，并出现“回到最新”。
- `AgentParts` 把最后一段文本按 Markdown 边收边显示，标题、列表、表格和代码块在流式过程中正常排版。
- `ChatInputBar` 在生成中（status 为 running）变成“停止生成”，支持多行输入、附件和 @ 提及。

## 第二步：思考过程和工具调用

给模型加上工具之后，同一条回复里会出现思考过程和工具调用。`AgentParts` 会把思考过程折叠起来，把连续的工具调用合成一组，显示每次调用的参数和状态，来源挂在回答下面，生成的文件变成可以打开的卡片：

![一条回复里的思考过程、两次工具调用、回答、来源和生成的文件](/images/articles/generative-ui-default.png)

这一步前端代码不用改，还是那一行 `<AgentParts parts={message.parts} />`。

## 第三步：会改数据的操作先确认

查库存可以直接执行，下采购单就不行。AI SDK 7 在服务端用 `toolApproval` 指定哪些工具要用户确认：

```ts
const result = streamText({
  model,
  messages: await convertToModelMessages(messages),
  tools: { getInventory, createPurchaseOrder },
  toolApproval: { createPurchaseOrder: "user-approval" },
});
```

模型调用这个工具时，消息里会出现一段等待确认的工具调用。把 `useChat` 返回的 `addToolApprovalResponse` 交给 `AgentParts`，它就会显示允许和拒绝：

```tsx
const { messages, status, addToolApprovalResponse } = useChat();

<AgentParts parts={message.parts} status={status} onToolApproval={addToolApprovalResponse} />
```

![需要确认的工具调用：说明原因、展示参数，用户点允许后才执行](/images/articles/ai-chat-tool-approval.png)

用户拒绝后，这次调用在工具组里显示为“已停止”，模型会接着用文字回应。

> 前端确认只是交互上的保护。服务端执行工具时仍要按当前用户的权限再校验一次，不能因为用户点了“允许”就跳过权限检查。

## 第四步：把工具结果换成自己的组件

工具调用默认显示为一条执行记录。如果希望库存查询直接显示成一张库存卡片，用 `renderTool` 按工具名替换：

```tsx
<AgentParts
  parts={message.parts}
  renderTool={{
    getInventory: part => <InventoryCard {...(part.output as Inventory)} />,
  }}
/>
```

这就是常说的生成式 UI：模型决定调用哪个工具，界面长什么样由你决定。展开讲可以看[《生成式 UI 是什么，React 里怎么实现》](/articles/generative-ui)。

## 回复下面的操作

最后补上复制、重新生成、有帮助 / 没帮助，以及推荐提问：

```tsx
<AgentMessage
  role="assistant"
  actions={<MessageActions copyText={text} onRetry={() => regenerate({ messageId: message.id })} onFeedback={value => rate(message.id, value)} />}
>
  <AgentParts parts={message.parts} status={status} />
</AgentMessage>
<PromptSuggestions suggestions={["本周退款最多的商品是哪个？"]} onSelect={text => sendMessage({ text })} />
```

`MessageActions` 只显示你传了回调的按钮，没接反馈接口就不会出现点了没反应的按钮。

## 整体流程

```flow 从用户提问到界面更新
用户提问 | ChatInputBar 发送
服务端 | streamText 调模型和工具
流式返回 | 文本、思考、工具调用逐段到达
需要确认 | 用户允许或拒绝
界面 | AgentParts 按类型渲染每一段
```

## 和其他方案怎么选

```cards 常见的 React AI 对话组件
Ant Design X | Ant Design 生态的 AI 组件。项目已经在用 Ant Design，选它最顺。 | 样式体系是 Ant Design
TDesign Chat | 腾讯 TDesign 的对话组件，React、Vue、小程序都有。 | 适合多端统一
Vercel AI Elements | AI SDK 团队基于 shadcn/ui 做的组件，源码复制进项目。 | 适合 shadcn 项目
Forge | Tailwind + Next.js，对话放进后台；审批、对比表、任务进度和表格、表单是同一套设计。 | 适合后台里的 AI 助手
```

想看所有组件的参数和可操作的例子，打开 [AI 对话组件文档](/components/agent)；想看这些组件拼成一个完整的工作台，打开[智能体工作台模板](/templates/agent)。

## 相关阅读

- [生成式 UI 是什么，React 里怎么实现](/articles/generative-ui)
- [2026 年 React 组件库怎么选](/articles/react-ui-library-2026)
- [用 Claude Code 写后台页面](/articles/claude-code-admin-pages)
