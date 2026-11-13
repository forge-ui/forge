import { z } from "zod";

// The generative UI catalog. The model can only answer with these shapes; each is validated
// before anything renders, and the client draws them with Forge components.

const text = (max: number) => z.string().trim().min(1).max(max);

export const uiSchemas = {
  show_cards: z.object({
    title: text(60).optional(),
    items: z.array(z.object({
      title: text(60),
      description: text(200).optional(),
      href: z.string().max(300).optional().describe("站内路径（以 / 开头）或 https 链接"),
      image: z.string().max(300).optional().describe("图片地址，只用工具结果里给出的地址"),
      code: text(300).optional().describe("可复制的一行命令，例如安装命令"),
      tag: text(20).optional(),
    })).min(1).max(8),
  }),
  show_code: z.object({
    filename: text(80).optional(),
    code: z.string().min(1).max(6000),
  }),
  show_table: z.object({
    title: text(60).optional(),
    columns: z.array(z.object({ key: text(40), header: text(30), numeric: z.boolean().optional() })).min(1).max(8),
    rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))).max(50),
  }),
  show_metrics: z.object({
    items: z.array(z.object({
      label: text(30),
      value: text(30),
      change: text(20).optional(),
      direction: z.enum(["up", "down"]).optional(),
    })).min(1).max(6),
  }),
  show_chart: z.object({
    title: text(60).optional(),
    type: z.enum(["line", "bar"]),
    labels: z.array(text(20)).min(2).max(60),
    series: z.array(z.object({ label: text(30), data: z.array(z.number()) })).min(1).max(4),
  }),
  show_steps: z.object({
    title: text(60).optional(),
    steps: z.array(z.object({ title: text(80), detail: text(400).optional(), code: z.string().max(2000).optional() })).min(1).max(10),
  }),
  suggest_followups: z.object({
    questions: z.array(text(40)).min(1).max(4),
  }),
} as const;

export type UiToolName = keyof typeof uiSchemas;
export type UiSpec<Name extends UiToolName> = z.infer<(typeof uiSchemas)[Name]>;

export const uiDescriptions: Record<UiToolName, string> = {
  show_cards: "用卡片列出若干对象（组件、页面、文档、记录），每张卡可带链接、图片和一行可复制命令。",
  show_code: "展示一段代码或配置，用户可以复制。",
  show_table: "用表格展示多行同类数据。数字必须来自工具结果。",
  show_metrics: "展示 1 到 6 个关键数字。数字必须来自工具结果。",
  show_chart: "用折线图或柱状图展示随时间或类别变化的数字。数字必须来自工具结果。",
  show_steps: "按顺序列出操作步骤，每步可带一段代码。",
  suggest_followups: "在回答末尾给出 1 到 4 个用户可能接着问的问题。",
};

export const uiToolNames = Object.keys(uiSchemas) as UiToolName[];
