import type { Metadata } from "next";
import { AgentHome } from "./_home";

export const metadata: Metadata = {
  title: { absolute: "Forge Agent · 智能体界面组件 · Forge UI" },
  description: "给 React 应用加一个能回答、能调接口、能操作页面的 AI 助手，以及做智能体界面的整套组件：对话、思考、工具调用、确认、引用、运行、治理和观测。",
  alternates: { canonical: "/agent" },
};

export default function AgentHomePage() {
  return <AgentHome />;
}
