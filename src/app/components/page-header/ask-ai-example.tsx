"use client";

import { useCallback, useRef, useState, type ComponentProps } from "react";
import { PageHeader, type AskAiProps, type AskAiSessionItem } from "@forge-ui-official/core";

const SEED: AskAiSessionItem[] = [
  { id: "demo-1", title: "这个页面可以做什么？" },
  { id: "demo-2", title: "帮我总结当前内容" },
];

/** One Ask AI demo. Each header keeps its own session list. */
export function useAskAiExample(): AskAiProps {
  const [sessions, setSessions] = useState<AskAiSessionItem[]>(SEED);
  const [currentSessionId, setCurrentSessionId] = useState(SEED[0].id);
  const currentSessionIdRef = useRef(currentSessionId);
  currentSessionIdRef.current = currentSessionId;

  const onSend = useCallback<AskAiProps["onSend"]>(async (question) => {
    const sessionId = currentSessionIdRef.current;
    setSessions((prev) => prev.map((item) => (
      item.id === sessionId && item.title === "新对话"
        ? { ...item, title: question.replace(/\s+/g, " ").slice(0, 80) }
        : item
    )));
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      text: `演示回复：已收到“${question}”。\n\n业务系统可通过 onSend 接入真实 AI 服务，返回的内容会显示在这里。`,
      links: [
        { label: "查看项目列表", href: "/templates/project-template/projects" },
        { label: "查看商品列表", href: "/templates/ecommerce/products" },
      ],
    };
  }, []);

  const onNewSession = useCallback(() => {
    const id = `demo-${Date.now()}`;
    setSessions((prev) => [{ id, title: "新对话" }, ...prev]);
    setCurrentSessionId(id);
  }, []);

  return {
    suggestions: ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"],
    sessions,
    currentSessionId,
    landingTitle: "今天想做什么？",
    onSelectSession: setCurrentSessionId,
    onNewSession,
    onSend,
  };
}

export function DemoPageHeader(props: Omit<ComponentProps<typeof PageHeader>, "askAi">) {
  const askAi = useAskAiExample();
  return <PageHeader {...props} askAi={askAi} />;
}
