import type { AskAiProps } from "@forge-ui-official/core";

/** Shared demo response for the existing PageHeader examples. */
export const askAiExample: AskAiProps = {
  context: "项目概览 / projects",
  suggestions: ["这个页面可以做什么？", "下一步该做什么？", "帮我总结当前内容"],
  onSend: async (question, request) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      text: `演示回复：已收到“${question}”。\n\n${request.context ? `本次携带当前页：${request.context}。` : "本次未携带当前页。"}\n\n业务系统可通过 onSend 接入真实 AI 服务，返回的内容会显示在这里。`,
      links: [
        { label: "查看项目列表", href: "/templates/project-template/projects" },
        { label: "查看商品列表", href: "/templates/ecommerce/products" },
      ],
    };
  },
};
