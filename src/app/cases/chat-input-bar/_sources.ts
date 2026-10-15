import type { ComposerSource } from "@forge-ui-official/core";

/** Share typed mentions so every composer example demonstrates selected context cards. */
export const demoSources: ComposerSource[] = [
  { id: "sales-agent", kind: "agent", label: "销售分析助手", description: "分析销量和经营指标", avatarSrc: "/images/protask/crm/linda-blair-avatar.png" },
  { id: "summary-skill", kind: "skill", label: "文档总结", description: "提取文档要点" },
  { id: "docs", kind: "tool", label: "销量数据", description: "查询销售与流失指标", connected: true },
];
