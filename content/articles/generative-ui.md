---
title: 生成式 UI 是什么，React 里怎么实现
description: 生成式 UI 让大模型的回答不只是文字，而是可以操作的界面。本文讲清三种实现方式：Markdown、工具调用加预制组件、模型生成界面描述（A2UI、json-render），并用 AI SDK 7 和 Forge 演示最常用的工具调用方案。
date: 2026-11-12
keywords: 生成式 UI, Generative UI, AI SDK, useChat, React AI 组件, A2UI, json-render, 工具调用
tags: 生成式 UI, AI 对话
---

问运营助手“华东仓的耳机还剩多少”，它可以回一句话：“还剩 12 件”。也可以直接回一张库存卡片，下面带着“补货”按钮。后一种就是生成式 UI（Generative UI）：模型不只输出文字，还决定这次回答该用什么界面来呈现。

下面两张图是同一条回复。上图按默认方式显示工具调用记录，下图把库存查询换成了一张自定义卡片，其余部分不变。

![默认显示：思考过程、两次工具调用、回答正文、来源和生成的文件](/images/articles/generative-ui-default.png)

![换成自定义组件后：库存查询变成一张库存卡片，其余部分保持不变](/images/articles/generative-ui-render-tool.png)

## 三种实现方式

```cards 生成式 UI 的三种做法，从简单到灵活
Markdown 渲染 | 模型只输出文字，前端把标题、列表、表格、代码块渲染出来。 | 最简单，但只能看，不能操作
工具调用 + 预制组件 | 模型调用工具，前端按工具名把结果换成你写好的组件。 | 最常用，界面可控、可交互
模型生成界面描述 | 模型输出一份 JSON，前端按允许的组件清单渲染。 | 最灵活，代表是 A2UI 和 json-render
```

大多数产品从第一种起步，真正想要“回答就是界面”时用第二种，第三种适合界面组合太多、没法提前写好的场景。

## 第一种：把 Markdown 渲染好

这一步看起来简单，但流式输出时容易出问题：表格只来了一半、代码块还没闭合，页面会跳来跳去。用专门处理流式 Markdown 的渲染器（比如 Vercel 的 streamdown），未闭合的语法也能正常显示。

它的局限是只能看。用户看到“建议补货 90 件”，还得自己去别的页面下单。

## 第二种：工具调用加预制组件

AI SDK 文档里讲的生成式 UI 就是这种做法，也是目前最实用的方案。整个过程是这样的：

```flow 一次工具调用变成界面的过程
用户提问 | 华东仓的耳机还剩多少
模型选工具 | 决定调用 getInventory
服务端执行 | 查库存，返回 { stock: 12 }
消息里多一段 | tool-getInventory，带输入和输出
前端渲染 | 按工具名换成库存卡片
```

### 服务端：定义工具

用 AI SDK 7 写法，工具就是一个带说明、参数结构和执行函数的对象：

```ts
// app/api/chat/route.ts
import { convertToModelMessages, createUIMessageStreamResponse, isStepCount, streamText, tool, toUIMessageStream, type UIMessage } from "ai";
import { z } from "zod";
import { model } from "@/ai/model";

const tools = {
  getInventory: tool({
    description: "查询某个商品在仓库的库存",
    inputSchema: z.object({ sku: z.string() }),
    execute: async ({ sku }) => ({ sku, stock: 12, warehouse: "华东仓" }),
  }),
};

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(5),
  });
  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) });
}
```

### 前端：按工具名渲染组件

`useChat` 返回的每条消息都有 `parts`。工具调用的类型是 `tool-工具名`，并带着状态：参数还在生成、等待执行、完成、出错。前端按状态分别显示：

```tsx
{message.parts.map((part, index) => {
  if (part.type === "text") return <Markdown key={index}>{part.text}</Markdown>;
  if (part.type === "tool-getInventory") {
    if (part.state === "output-available") return <InventoryCard key={index} {...part.output} />;
    if (part.state === "output-error") return <ErrorNote key={index} text={part.errorText} />;
    return <Skeleton key={index} />;
  }
  return null;
})}
```

### 用 Forge 少写一些

真实的回复里，文字、思考过程、多次工具调用、来源和文件会混在一起，每种都要写一遍渲染逻辑。Forge 的 `AgentParts` 把这些都处理好了，你只需要说明哪些工具要换成自己的组件：

```tsx
<AgentParts
  parts={message.parts}
  status={status}
  renderTool={{
    getInventory: part => <InventoryCard {...(part.output as Inventory)} />,
  }}
/>
```

没写进 `renderTool` 的工具，按默认的工具调用记录显示；连续的调用会合成一组，带状态。文章开头那两张图，就是这个开关打开前后的样子。可以在 [AI 对话组件](/components/agent) 页面直接试。

> 让模型调用会改数据的工具（下单、退款、发通知）之前，先让用户确认。AI SDK 7 在 streamText 上用 toolApproval 配置哪些工具需要审批，前端用 addToolApprovalResponse 回传结果。

## 第三种：让模型生成界面描述

如果界面组合多到写不完，比如一个能回答任意经营问题的看板助手，可以让模型直接描述界面，前端负责画。为了安全，模型不写代码，只能从你允许的组件清单里选：

```flow 模型生成界面描述的过程
定义组件清单 | 卡片、表格、图表、按钮和它们的参数
告诉模型 | 把清单写进提示词，要求按格式输出
模型输出 JSON | 用哪些组件、怎么嵌套、绑定什么数据
前端渲染 | 按名字找到对应的 React 组件
```

两个值得关注的开源方案：

- [A2UI](https://github.com/google/A2UI)：Google 在 2025 年底开源的协议。智能体用声明式 JSON 描述界面，客户端用自己的组件库渲染，只允许使用客户端事先登记的组件。
- [json-render](https://github.com/vercel-labs/json-render)：Vercel Labs 的框架。用 Zod 定义组件目录，自动生成给模型的提示词，模型流式输出 JSON，渲染器映射到你的 React 组件。

代价是可控性下降：模型可能组合出别扭的布局，提示词也更长。建议先把常见问题用第二种做好，第三种只用在真正需要自由组合的地方。

## 怎么选

```cards 按需求选做法
只要回答好读 | Markdown 渲染，流式时用专门的渲染器 | 半天就能上线
回答要能操作 | 工具调用 + 预制组件，配合 AgentParts 的 renderTool | 大多数产品的选择
界面组合太多写不完 | A2UI 或 json-render，组件清单要收紧 | 先在小范围试
```

## 落地时容易忽略的几件事

- 每个状态都要有样子：参数生成中、执行中、失败，都要显示出来，别让用户对着空白等。
- 组件要和产品其他页面一致。模型生成的卡片用的是你的组件和颜色，用户才不会觉得是另一个产品。
- 会改数据的操作必须让用户确认，并且服务端要再校验权限，不能只靠前端按钮。
- 别让模型直接生成可执行的界面代码在用户浏览器里跑，用组件清单约束它。

## 相关阅读

- [React AI 对话组件：AgentParts、消息、输入栏](/components/agent)
- [2026 年 React 组件库怎么选](/articles/react-ui-library-2026)
- [智能体工作台模板](/templates/agent)
