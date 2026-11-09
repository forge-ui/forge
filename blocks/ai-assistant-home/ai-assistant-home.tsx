"use client";

import { useState } from "react";
import { Button, ChatBubble, ChatInputBar, StreamingAnswer, ThinkingTrace, cn, type ChatInputBarQuickAction } from "@forge-ui-official/core";
import { BillListBoldDuotone, BookBoldDuotone, ChartSquareBoldDuotone, LetterBoldDuotone } from "@forge-ui-official/core/icons";

export interface AssistantSuggestion {
  id: string;
  title: string;
  prompt: string;
  icon: "chart" | "mail" | "book" | "bill";
}

export const defaultAssistantSuggestions: AssistantSuggestion[] = [
  { id: "s1", title: "本周经营简报", prompt: "汇总本周营业收入、订单与新增客户，写成三段话的简报", icon: "chart" },
  { id: "s2", title: "回复客户邮件", prompt: "帮我回复远山设计关于二期排期的邮件，语气专业", icon: "mail" },
  { id: "s3", title: "查知识库", prompt: "退换货超过 7 天还能处理吗？请注明出处", icon: "book" },
  { id: "s4", title: "整理逾期发票", prompt: "列出所有逾期未付的发票和负责人", icon: "bill" },
];

export const defaultAssistantApps = ["飞书", "企业微信", "CRM", "知识库", "邮箱"];

const iconMap = { chart: ChartSquareBoldDuotone, mail: LetterBoldDuotone, book: BookBoldDuotone, bill: BillListBoldDuotone };
const quickActions: ChatInputBarQuickAction[] = [{ id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文件后说明要分析什么" }, { id: "note", label: "写笔记", kind: "note" }, { id: "event", label: "安排日程", kind: "event" }];

export interface AiAssistantHomeProps {
  userName?: string;
  suggestions?: AssistantSuggestion[];
  apps?: string[];
  answer?: (prompt: string) => string;
  className?: string;
}

const defaultAnswer = (prompt: string) => prompt.includes("退换货")
  ? "可以处理。根据《售后服务规范》第 3.2 条，签收后 7 天内无理由退换；超过 7 天但在 30 天内且存在质量问题的，可走**质量换货**流程，需要客户提供照片或检测报告。"
  : "本周营业收入 **¥128,600**，较上周增长 12.8%，主要来自企业年度订阅；成交订单 248 笔，客单价 ¥518.55。新增客户 86 家，其中教育与零售行业占一半以上。下周建议重点跟进 4 张待付款发票。";

export function AiAssistantHome({ userName = "张宁", suggestions = defaultAssistantSuggestions, apps = defaultAssistantApps, answer = defaultAnswer, className }: AiAssistantHomeProps) {
  const [question, setQuestion] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  function ask(prompt: string) {
    setQuestion(prompt);
    setRound(current => current + 1);
  }

  return <section className={cn("mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-6 py-6", className)}>
    {question ? <div className="flex flex-col gap-4">
      <ChatBubble type="sent" color="blue" content={question} time="刚刚" />
      <div className="flex flex-col gap-3 rounded-card border border-fg-grey-200 bg-white p-5">
        <ThinkingTrace key={`trace-${round}`} variant="search" query={question} />
        <StreamingAnswer key={`answer-${round}`} text={answer(question)} format="markdown" streaming sources={[{ name: "售后服务规范", domain: "知识库" }, { name: "经营看板", domain: "CRM" }]} followUps={["换成英文版本", "生成一页 PPT 大纲"]} onFollowUp={ask} />
      </div>
      <Button variant="tertiary" className="self-start" onClick={() => setQuestion(null)}>返回首页</Button>
    </div> : <>
      <div className="flex flex-col gap-2 pt-6 text-center"><p className="text-sm font-medium text-fg-blue">知行科技 · AI 助手</p><h2 className="text-3xl font-semibold tracking-fg text-fg-black">{userName}，今天想先处理什么？</h2><p className="text-sm text-fg-grey-700">可以查询业务数据、检索知识库，或交给智能体去执行。</p></div>
      <div className="flex flex-wrap justify-center gap-2">{apps.map(app => <span key={app} className="flex items-center gap-1.5 rounded-full border border-fg-grey-200 bg-white px-3 py-1 text-xs text-fg-grey-700"><span className="size-1.5 rounded-full bg-fg-green-500" />{app}</span>)}</div>
    </>}
    <ChatInputBar color="blue" placeholder="问点什么，或输入 / 调用命令" quickActions={quickActions} hasMessages={question !== null} onSend={ask} />
    {!question && <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">{suggestions.map(item => {
      const Icon = iconMap[item.icon];
      return <li key={item.id}><Button variant="unstyled" type="button" className="flex w-full items-start gap-3 rounded-card border border-fg-grey-200 bg-white p-4 text-left transition-colors hover:border-fg-blue-300 hover:bg-fg-blue-50/40" onClick={() => ask(item.prompt)}>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-fg-blue-50 text-fg-blue"><Icon size={18} /></span>
        <span className="min-w-0"><span className="block text-sm font-semibold text-fg-black">{item.title}</span><span className="mt-1 block text-xs leading-5 text-fg-grey-700">{item.prompt}</span></span>
      </Button></li>;
    })}</ul>}
  </section>;
}
