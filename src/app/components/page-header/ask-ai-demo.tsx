"use client";

import { useState } from "react";
import { PageHeader, type AskAiProps } from "@forge-ui-official/core";

export function AskAiDemo() {
  const [selection, setSelection] = useState("");
  const askAi: AskAiProps = {
    context: "项目概览 / projects",
    suggestions: ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"],
    onSend: async (question, request) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return `演示回复：已收到“${question}”。\n\n${request.context ? `本次携带当前页：${request.context}。` : "本次未携带当前页。"}\n\n业务系统可通过 onSend 接入真实 AI 服务，返回的内容会显示在这里。`;
    },
  };
  return (
    <div className="w-full min-w-0 flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
        <PageHeader variant="title" title="项目概览" showBackButton={false} showDatePicker={false}
          showFilters={false} showFavorite={false} showKebab={false}
          askAi={askAi} primaryAction={{ label: "新建项目", onClick: () => setSelection("新建项目") }} />
      </div>
      <div className="overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
        <PageHeader variant="search" searchPlaceholder="搜索项目…" showAddButton={false}
          showProfile={false} notifications={3} askAi={askAi}
          showMobileMenuButton onHamburgerClick={() => setSelection("打开导航")}
          onCalendarClick={() => setSelection("打开日历")} onNotificationsClick={() => setSelection("查看通知")} />
      </div>
      <p className="text-sm text-fg-grey-700">点击 Ask AI 打开右侧对话框。示例使用本地演示回复。{selection && `已触发：${selection}`}</p>
    </div>
  );
}
