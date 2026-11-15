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
      preview: z.string().max(300).optional().describe("可嵌入预览的站内页面路径（以 / 开头），显示成缩略图"),
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

export const uiToolNames = Object.keys(uiSchemas) as UiToolName[];
