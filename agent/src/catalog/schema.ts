import { z } from "zod";

// The generative UI catalog. The model can only answer with these shapes; each is validated
// before anything renders, and the client draws them with Forge components.

const text = (max: number) => z.string().trim().min(1).max(max);
const tone = z.enum(["info", "success", "warning", "danger"]);

export const uiSchemas = {
  /* ── Display ── */
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
  show_steps: z.object({
    title: text(60).optional(),
    steps: z.array(z.object({ title: text(80), detail: text(400).optional(), code: z.string().max(2000).optional() })).min(1).max(10),
  }),
  show_callout: z.object({
    tone,
    title: text(60).optional(),
    text: text(400),
  }),
  show_record: z.object({
    title: text(60),
    subtitle: text(80).optional(),
    status: text(20).optional(),
    fields: z.array(z.object({ label: text(20), value: text(120) })).min(1).max(12),
    href: z.string().max(300).optional(),
  }),
  show_list: z.object({
    title: text(60).optional(),
    items: z.array(z.object({ title: text(80), description: text(160).optional(), meta: text(30).optional(), tag: text(20).optional(), href: z.string().max(300).optional() })).min(1).max(12),
  }),
  show_timeline: z.object({
    title: text(60).optional(),
    events: z.array(z.object({ time: text(30), title: text(80), detail: text(200).optional(), tone: tone.optional() })).min(1).max(12),
  }),
  show_tags: z.object({
    title: text(60).optional(),
    tags: z.array(text(24)).min(1).max(20),
  }),
  show_compare: z.object({
    title: text(60).optional(),
    items: z.array(z.object({ title: text(40), tag: text(20).optional(), points: z.array(text(80)).min(1).max(6), recommended: z.boolean().optional() })).min(2).max(4),
  }),
  show_changes: z.object({
    title: text(60).optional(),
    fields: z.array(z.object({ label: text(30), before: z.string().max(120), after: z.string().max(120) })).min(1).max(12),
  }),
  show_flow: z.object({
    title: text(60).optional(),
    nodes: z.array(z.object({ id: text(20), label: text(40), kind: z.enum(["start", "step", "decision", "end"]).optional() })).min(2).max(12),
    edges: z.array(z.object({ from: text(20), to: text(20), label: text(20).optional() })).max(16),
  }),
  show_images: z.object({
    items: z.array(z.object({ src: z.string().max(300), caption: text(60).optional() })).min(1).max(8),
  }),
  /* ── Data ── */
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
    type: z.enum(["line", "area", "bar", "hbar", "donut"]),
    labels: z.array(text(20)).min(2).max(60),
    series: z.array(z.object({ label: text(30), data: z.array(z.number()) })).min(1).max(4),
  }),
  show_progress: z.object({
    title: text(60).optional(),
    items: z.array(z.object({ label: text(30), value: z.number().min(0).max(100), note: text(40).optional() })).min(1).max(8),
  }),
  show_funnel: z.object({
    title: text(60).optional(),
    stages: z.array(z.object({ label: text(20), value: z.number().min(0) })).min(2).max(8),
  }),
  /* ── Asking and acting ── */
  show_choices: z.object({
    title: text(80),
    options: z.array(z.object({ label: text(60), description: text(120).optional() })).min(2).max(8),
  }),
  show_questions: z.object({
    questions: z.array(z.object({
      title: text(80),
      options: z.array(z.object({ label: text(60), description: text(120).optional() })).max(8),
      multiple: z.boolean().optional(),
      allowText: z.boolean().optional(),
    })).min(1).max(4),
  }),
  show_form: z.object({
    title: text(60),
    submitLabel: text(12).optional(),
    fields: z.array(z.object({
      name: text(30),
      label: text(30),
      type: z.enum(["text", "textarea", "number", "date", "select", "multiselect", "switch"]),
      options: z.array(text(40)).max(12).optional(),
      required: z.boolean().optional(),
      placeholder: text(60).optional(),
      default: z.union([z.string().max(200), z.number(), z.boolean(), z.array(z.string().max(40))]).optional(),
    })).min(1).max(10),
  }),
  show_confirm: z.object({
    title: text(80),
    description: text(300).optional(),
    risk: z.enum(["low", "medium", "high"]).optional(),
    fields: z.array(z.object({ label: text(30), before: z.string().max(120).optional(), after: z.string().max(120) })).max(10).optional(),
    confirmLabel: text(12).optional(),
  }),
  show_plan: z.object({
    title: text(60).optional(),
    steps: z.array(z.object({ title: text(80), detail: text(200).optional() })).min(2).max(10),
  }),
  show_actions: z.object({
    items: z.array(z.object({ label: text(20), ask: text(80).optional(), href: z.string().max(300).optional(), primary: z.boolean().optional() })).min(1).max(4),
  }),
  suggest_followups: z.object({
    questions: z.array(text(40)).min(1).max(4),
  }),
} as const;

export type UiToolName = keyof typeof uiSchemas;
export type UiSpec<Name extends UiToolName> = z.infer<(typeof uiSchemas)[Name]>;

export const uiToolNames = Object.keys(uiSchemas) as UiToolName[];

/** The fenced block name the model writes for each component: ```forge:table … ```. */
export const BLOCK_OF: Record<UiToolName, string> = {
  show_cards: "forge:cards",
  show_code: "forge:code",
  show_steps: "forge:steps",
  show_callout: "forge:callout",
  show_record: "forge:record",
  show_list: "forge:list",
  show_timeline: "forge:timeline",
  show_tags: "forge:tags",
  show_compare: "forge:compare",
  show_changes: "forge:changes",
  show_flow: "forge:flow",
  show_images: "forge:images",
  show_table: "forge:table",
  show_metrics: "forge:metrics",
  show_chart: "forge:chart",
  show_progress: "forge:progress",
  show_funnel: "forge:funnel",
  show_choices: "forge:choices",
  show_questions: "forge:questions",
  show_form: "forge:form",
  show_confirm: "forge:confirm",
  show_plan: "forge:plan",
  show_actions: "forge:actions",
  suggest_followups: "forge:followups",
};

/** One line per component for the system prompt: shape first, then when to use it. */
export const BLOCK_GUIDE: Record<UiToolName, string> = {
  show_cards: `卡片：{"title"?, "items": [{"title", "description"?, "tag"?, "href"?, "preview"?, "code"?, "image"?}]}，最多 8 项。preview 是能嵌入预览的站内页面路径，会显示成缩略图；code 是一行可复制的命令。`,
  show_code: `代码：{"filename"?, "code"}。一般代码用普通 Markdown 代码块即可，要给文件名时用它。`,
  show_steps: `步骤：{"title"?, "steps": [{"title", "detail"?, "code"?}]}，教用户怎么做时用。`,
  show_callout: `提示框：{"tone": "info"|"success"|"warning"|"danger", "title"?, "text"}，只用于真正要提醒的一件事。`,
  show_record: `单条记录：{"title", "subtitle"?, "status"?, "fields": [{"label", "value"}], "href"?}，展示一个订单、账号、合同等的详情。`,
  show_list: `列表：{"title"?, "items": [{"title", "description"?, "meta"?, "tag"?, "href"?}]}，多条记录的摘要。`,
  show_timeline: `时间线：{"title"?, "events": [{"time", "title", "detail"?, "tone"?}]}，按时间排的经过、日志、进度。`,
  show_tags: `标签：{"title"?, "tags": [...]}`,
  show_compare: `方案对比：{"title"?, "items": [{"title", "tag"?, "points": [...], "recommended"?}]}，2 到 4 个方案并排比较。`,
  show_changes: `改动前后：{"title"?, "fields": [{"label", "before", "after"}]}，说明改了什么。`,
  show_flow: `流程图：{"title"?, "nodes": [{"id", "label", "kind"?: "start"|"step"|"decision"|"end"}], "edges": [{"from", "to", "label"?}]}，讲审批流、业务流程时用。`,
  show_images: `图片：{"items": [{"src", "caption"?}]}，src 只用工具结果里的图片地址。`,
  show_table: `表格：{"title"?, "columns": [{"key", "header", "numeric"?}], "rows": [{列 key: 值}]}`,
  show_metrics: `指标：{"items": [{"label", "value", "change"?, "direction"?: "up"|"down"}]}`,
  show_chart: `图表：{"title"?, "type": "line"|"area"|"bar"|"hbar"|"donut", "labels": [...], "series": [{"label", "data": [数字]}]}。趋势用 line/area，比较用 bar，排名用 hbar，占比用 donut（只取第一组数据）。`,
  show_progress: `进度：{"title"?, "items": [{"label", "value": 0 到 100, "note"?}]}，完成率、额度用量。`,
  show_funnel: `漏斗：{"title"?, "stages": [{"label", "value"}]}，转化各环节的数量。`,
  show_choices: `让用户选：{"title", "options": [{"label", "description"?}]}，2 到 8 项。要用户在几个明确方案里挑一个时用，用户点选后会作为下一条消息发来；问开放问题时直接用文字问。`,
  show_questions: `一次问几件事：{"questions": [{"title", "options": [{"label", "description"?}], "multiple"?, "allowText"?}]}，最多 4 题；缺好几项信息才能继续时用，答案会作为下一条消息发来。`,
  show_form: `表单：{"title", "submitLabel"?, "fields": [{"name", "label", "type": "text"|"textarea"|"number"|"date"|"select"|"multiselect"|"switch", "options"?, "required"?, "placeholder"?, "default"?}]}，让用户填一组结构化信息（例如新建记录）；提交内容会作为下一条消息发来。`,
  show_confirm: `请用户确认：{"title", "description"?, "risk"?: "low"|"medium"|"high", "fields"?: [{"label", "before"?, "after"}], "confirmLabel"?}，在你要执行改动前用；用户的确认或取消会作为下一条消息发来。`,
  show_plan: `执行计划：{"title"?, "steps": [{"title", "detail"?}]}，多步任务开始前给用户看，用户可以增删改步骤，确认后计划会作为下一条消息发来。`,
  show_actions: `操作按钮：{"items": [{"label", "ask"?, "href"?, "primary"?}]}，最多 4 个；ask 是点了之后发出的消息，href 是要打开的链接。`,
  suggest_followups: `后续问题：{"questions": [1 到 4 个短问题]}，放在回答最后，正文里不要再列一遍。`,
};

/** The prompt lines for the enabled components. */
export function catalogGuide(names: readonly UiToolName[] = uiToolNames) {
  return names.map(name => `  - ${BLOCK_OF[name]} ${BLOCK_GUIDE[name]}`).join("\n");
}

// One worked example keeps the fence format exact; the first enabled component that has one is used.
const EXAMPLES: Partial<Record<UiToolName, string>> = {
  show_cards: `{"items": [{"title": "订单列表", "tag": "页面", "description": "搜索、筛选、分页都已接好", "href": "/orders"}]}`,
  show_table: `{"columns": [{"key": "name", "header": "客户"}, {"key": "amount", "header": "金额", "numeric": true}], "rows": [{"name": "华东分公司", "amount": 1280}]}`,
  show_confirm: `{"title": "把张三的角色改为管理员", "risk": "medium", "fields": [{"label": "角色", "before": "成员", "after": "管理员"}]}`,
};

/** The prompt's example line for the enabled components, or nothing. */
export function catalogExample(names: readonly UiToolName[]) {
  const name = names.find(item => EXAMPLES[item]);
  return name ? `- 例：\n\`\`\`${BLOCK_OF[name]}\n${EXAMPLES[name]}\n\`\`\`\n` : "";
}
