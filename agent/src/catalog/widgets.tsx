"use client";

import { useState, type ReactNode } from "react";
import {
  AgentFlowchart,
  AgentPlan,
  Approval,
  BarChart,
  Button,
  ChangeLedger,
  DescriptionItem,
  DonutChart,
  HistoryGrouped,
  ImageGrid,
  Label,
  ListGroup,
  ListItem,
  Panel,
  ProgressBar,
  Question,
  SelectOption,
  SmoothLineChart,
  StatusBadge,
  TextArea,
  TextField,
  Toggle,
  cn,
  type AgentFlowKind,
  type PlanStep,
} from "@forge-ui-official/core";
import { AltArrowRightLinear, CheckCircleLinear, DangerTriangleLinear, InfoCircleLinear } from "@forge-ui-official/core/icons";
import type { UiSpec } from "./schema";

/**
 * Components the model writes into its answer, drawn with the same Forge components the pages use:
 * Panel, StatCard, the charts, ListGroup, HistoryGrouped, DescriptionItem, AgentFlowchart and the
 * form fields. Cards, tables and metrics live in render.tsx.
 */

const Answered = ({ children }: { children: ReactNode }) => (
  <p className="flex items-start gap-2 text-sm text-fg-grey-700"><CheckCircleLinear size={16} color="var(--fg-green-500)" className="mt-0.5 shrink-0" /><span className="min-w-0">{children}</span></p>
);
const safeHref = (href?: string) => (href && (/^\/(?!\/)/.test(href) || /^https:\/\//.test(href)) ? href : undefined);
export const formatNumber = (value: number) => value.toLocaleString("zh-CN");

/* ── Display ── */

const TONE = {
  info: { icon: InfoCircleLinear, style: "bg-fg-blue-50 text-fg-blue-800 outline-fg-blue-200", color: "var(--fg-blue-500)" },
  success: { icon: CheckCircleLinear, style: "bg-fg-green-50 text-fg-green-700 outline-fg-green-200", color: "var(--fg-green-500)" },
  warning: { icon: DangerTriangleLinear, style: "bg-fg-yellow-50 text-fg-yellow-900 outline-fg-yellow-200", color: "var(--fg-yellow-700)" },
  danger: { icon: DangerTriangleLinear, style: "bg-fg-red-50 text-fg-red-700 outline-fg-red-200", color: "var(--fg-red)" },
} as const;

export function Callout({ tone, title, text }: UiSpec<"show_callout">) {
  const { icon: Icon, style, color } = TONE[tone];
  return (
    <div role={tone === "danger" || tone === "warning" ? "alert" : "note"} className={cn("flex gap-3 rounded-2xl px-4 py-3 text-sm leading-6 tracking-fg outline outline-1 outline-offset-[-1px]", style)}>
      <Icon size={18} color={color} className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-col">{title && <span className="font-semibold">{title}</span>}<span>{text}</span></div>
    </div>
  );
}

const STATUS_TONE: { test: RegExp; color: "green" | "yellow" | "red" | "blue" | "grey" }[] = [
  { test: /完成|成功|通过|已退款|已付|正常|启用/, color: "green" },
  { test: /失败|拒绝|驳回|逾期|异常|超/, color: "red" },
  { test: /待|审核|处理中|进行|退款中|中$/, color: "yellow" },
];
const statusColor = (status: string) => STATUS_TONE.find(rule => rule.test.test(status))?.color ?? "grey";

export function RecordCard({ title, subtitle, status, fields, href }: UiSpec<"show_record">) {
  const link = safeHref(href);
  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={status && <StatusBadge label={status} color={statusColor(status)} />}
      footer={link && <a href={link} className="inline-flex items-center gap-1 self-start text-sm font-semibold text-accent hover:underline">查看详情<AltArrowRightLinear size={14} /></a>}
      gap="sm"
    >
      <div className="flex flex-col gap-3">
        {fields.map(field => <DescriptionItem key={field.label} label={field.label} content={field.value} />)}
      </div>
    </Panel>
  );
}

export function ListBlock({ title, items }: UiSpec<"show_list">) {
  return (
    <ListGroup
      title={title ?? "列表"}
      density="compact"
      className="w-full"
      items={items.map(item => {
        const link = safeHref(item.href);
        const row = <ListItem key={item.title} title={item.title} subtitle={item.description} value={item.meta} trailing={item.tag ? <StatusBadge label={item.tag} color={statusColor(item.tag)} /> : undefined} />;
        return link ? <a key={item.title} href={link} className="block rounded-xl hover:bg-fg-grey-50">{row}</a> : row;
      })}
    />
  );
}

const HISTORY_COLOR = { info: "blue", success: "green", warning: "yellow", danger: "red" } as const;

export function Timeline({ title, events }: UiSpec<"show_timeline">) {
  return (
    <HistoryGrouped
      title={title ?? "经过"}
      items={events.map((event, index) => ({ title: event.title, description: event.detail, datetime: event.time, color: HISTORY_COLOR[event.tone ?? "info"], showConnector: index < events.length - 1 }))}
    />
  );
}

export function Tags({ title, tags }: UiSpec<"show_tags">) {
  return (
    <Panel title={title} gap="sm">
      <div className="flex flex-wrap gap-2">{tags.map(tag => <Label key={tag} color="gray" size="md">{tag}</Label>)}</div>
    </Panel>
  );
}

export function Compare({ title, items }: UiSpec<"show_compare">) {
  return (
    <Panel title={title} gap="sm">
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <section key={item.title} className={cn("flex flex-col gap-2 rounded-2xl p-4 outline outline-1 outline-offset-[-1px]", item.recommended ? "bg-accent-soft/40 outline-accent" : "outline-fg-grey-200")}>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 text-sm font-semibold text-fg-black">{item.title}</span>
              {item.recommended ? <StatusBadge label="推荐" color="blue" /> : item.tag && <StatusBadge label={item.tag} color="grey" />}
            </div>
            <ul className="flex flex-col gap-1.5">
              {item.points.map(point => <li key={point} className="flex gap-2 text-sm leading-5 text-fg-grey-900"><CheckCircleLinear size={16} color={item.recommended ? "var(--accent)" : "var(--fg-grey-400)"} className="mt-0.5 shrink-0" />{point}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </Panel>
  );
}

// What changed, as one entry of the same ledger the agent keeps for undo; no undo here.
export function Changes({ title, fields }: UiSpec<"show_changes">) {
  return <ChangeLedger size="sm" title="改动" entries={[{ id: "changes", title: title ?? "改动明细", fields: fields.map(field => ({ label: field.label, before: field.before || "空", after: field.after || "空" })) }]} />;
}

const FLOW_KIND: Record<string, AgentFlowKind> = { start: "trigger", step: "action", decision: "condition", end: "action" };

export function Flow({ title, nodes, edges }: UiSpec<"show_flow">) {
  return (
    <AgentFlowchart
      title={title}
      nodes={nodes.map(node => ({ id: node.id, kind: FLOW_KIND[node.kind ?? "step"], title: node.label }))}
      edges={edges.map(edge => ({ from: edge.from, to: edge.to, label: edge.label }))}
      kindLabels={{ trigger: "开始", action: "步骤", condition: "判断" }}
    />
  );
}

export function Images({ items }: UiSpec<"show_images">) {
  return (
    <Panel gap="sm">
      <ImageGrid images={items.map(item => item.src)} size="md" />
      {items.some(item => item.caption) && <p className="text-xs text-fg-grey-500">{items.map(item => item.caption).filter(Boolean).join(" · ")}</p>}
    </Panel>
  );
}

/* ── Data ── */

// The latest value of a single series leads the chart, as on Forge's chart cards.
function Headline({ label, value, previous }: { label: string; value: number; previous?: number }) {
  const change = previous ? ((value - previous) / previous) * 100 : undefined;
  return (
    <div>
      <p className="text-xs text-fg-grey-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums tracking-fg text-fg-black">{formatNumber(value)}</p>
      {change !== undefined && Number.isFinite(change) && <p className={cn("text-xs", change < 0 ? "text-fg-red" : "text-fg-green-500")}>{change >= 0 ? "+" : ""}{change.toFixed(1)}% 较上一期</p>}
    </div>
  );
}

// As in Forge's spending case: the ring and its rows point at each other on hover.
function Donut({ title, points, total }: { title?: string; points: { label: string; value: number }[]; total: number }) {
  const [active, setActive] = useState<number>();
  const shown = active === undefined ? total : points[active].value;
  return (
    <Panel title={title}>
      <div className="text-fg-black">
        <DonutChart interactive segments={points} activeIndex={active} onActiveIndexChange={setActive} centerValue={formatNumber(shown)} subtitle={active === undefined ? "合计" : `${points[active].label} · ${Math.round((points[active].value / (total || 1)) * 100)}%`} ariaLabel={title} />
      </div>
      <ValueRows rows={points} total={total} active={active} onActive={setActive} />
    </Panel>
  );
}

function ValueRows({ rows, total, active, onActive }: { rows: { label: string; value: number }[]; total?: number; active?: number; onActive?: (index?: number) => void }) {
  return (
    <div className="flex flex-col gap-1" onPointerLeave={() => onActive?.(undefined)}>
      {rows.map((row, index) => (
        <div key={row.label} onPointerEnter={() => onActive?.(index)} className={cn("flex min-h-9 items-center justify-between gap-3 rounded-lg px-2 text-sm text-fg-black hover:bg-fg-grey-50", active === index && "bg-fg-grey-50")}>
          <span className="min-w-0 truncate">{row.label}</span>
          <span className="flex items-baseline gap-2 tabular-nums">{formatNumber(row.value)}{total ? <span className="w-10 text-right text-xs text-fg-grey-500">{Math.round((row.value / total) * 100)}%</span> : null}</span>
        </div>
      ))}
    </div>
  );
}

export function Chart({ title, type, labels, series }: UiSpec<"show_chart">) {
  const first = series[0]?.data ?? [];
  const points = labels.map((label, index) => ({ label, value: first[index] ?? 0 }));
  const total = points.reduce((sum, point) => sum + point.value, 0);
  if (type === "donut") return <Donut title={title} points={points} total={total} />;
  if (type === "hbar" || (type === "bar" && points.length > 8)) {
    const top = Math.max(1, ...points.map(point => point.value));
    return (
      <Panel title={title}>
        <div className="flex flex-col gap-3">
          {points.map(point => (
            <div key={point.label} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm"><span className="min-w-0 truncate text-fg-black">{point.label}</span><span className="tabular-nums text-fg-black">{formatNumber(point.value)}</span></div>
              <ProgressBar value={(point.value / top) * 100} size="sm" />
            </div>
          ))}
        </div>
      </Panel>
    );
  }
  if (type === "bar") {
    return (
      <Panel title={title}>
        <Headline label="合计" value={total} />
        <BarChart data={points} showLabels barWidth="wide" height="h-44" ariaLabel={title} />
      </Panel>
    );
  }
  const single = series.length === 1;
  return (
    <Panel title={title}>
      {single && first.length > 0 && <Headline label={labels[labels.length - 1] ?? ""} value={first[first.length - 1]} previous={first[first.length - 2]} />}
      <SmoothLineChart series={series.map(item => ({ label: item.label, data: item.data, fillArea: single || type === "area" }))} height="h-40" ariaLabel={title} />
      <div className="flex justify-between text-xs tabular-nums text-fg-grey-500">{(labels.length > 4 ? [labels[0], labels[Math.floor((labels.length - 1) / 2)], labels[labels.length - 1]] : labels).map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
      {!single && <ValueRows rows={series.map(item => ({ label: `${item.label}（最新）`, value: item.data[item.data.length - 1] ?? 0 }))} />}
    </Panel>
  );
}

export function Progress({ title, items }: UiSpec<"show_progress">) {
  return (
    <Panel title={title}>
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <ProgressBar key={item.label} value={item.value} label={item.note ? `${item.label} · ${item.note}` : item.label} showPercentage color={item.value >= 90 ? "red" : item.value >= 75 ? "yellow" : "blue"} size="sm" />
        ))}
      </div>
    </Panel>
  );
}

export function Funnel({ title, stages }: UiSpec<"show_funnel">) {
  const top = Math.max(1, stages[0]?.value ?? 1);
  return (
    <Panel title={title}>
      <div className="flex flex-col gap-3">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-3 text-sm">
              <span className="min-w-0 flex-1 truncate text-fg-black">{stage.label}</span>
              {index > 0 && <span className="text-xs tabular-nums text-fg-grey-500">转化 {stages[index - 1].value ? `${Math.round((stage.value / stages[index - 1].value) * 100)}%` : "—"}</span>}
              <span className="tabular-nums font-semibold text-fg-black">{formatNumber(stage.value)}</span>
            </div>
            <ProgressBar value={(stage.value / top) * 100} size="sm" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Asking and acting: what the user does goes back as their next message ── */

export function Questions({ questions, answer, onAsk }: UiSpec<"show_questions"> & { answer?: string; onAsk: (text: string) => void }) {
  if (answer) return <Answered>{answer}</Answered>;
  const items = questions.map((question, index) => ({ id: String(index), title: question.title, multiple: question.multiple, allowText: question.allowText, options: question.options.map(option => ({ id: option.label, ...option })) }));
  return (
    <Question
      size="sm"
      questions={items}
      onSubmit={answers => onAsk(items.map(item => `${item.title}：${[...(answers[item.id]?.optionIds ?? []), answers[item.id]?.text?.trim()].filter(Boolean).join("、") || "不限"}`).join("；"))}
    />
  );
}

type FieldValue = string | number | boolean | string[];

export function Form({ title, submitLabel, fields, answer, onAsk }: UiSpec<"show_form"> & { answer?: string; onAsk: (text: string) => void }) {
  const [values, setValues] = useState<Record<string, FieldValue>>(() => Object.fromEntries(fields.map(field => [field.name, field.default ?? (field.type === "switch" ? false : field.type === "multiselect" ? [] : "")])));
  if (answer) return <Answered>{answer}</Answered>;
  const set = (name: string, value: FieldValue) => setValues(current => ({ ...current, [name]: value }));
  const missing = fields.filter(field => field.required && (values[field.name] === "" || (Array.isArray(values[field.name]) && !(values[field.name] as string[]).length)));
  const describe = (value: FieldValue) => (Array.isArray(value) ? value.join("、") : typeof value === "boolean" ? (value ? "是" : "否") : String(value));
  const label = (field: (typeof fields)[number]) => `${field.label}${field.required ? " *" : ""}`;
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (missing.length) return;
        onAsk(`提交「${title}」：${fields.filter(field => describe(values[field.name]) !== "").map(field => `${field.label}：${describe(values[field.name])}`).join("；")}`);
      }}
    >
      <Panel title={title} footer={<Button size="sm" type="submit" disabled={missing.length > 0} className="self-end">{submitLabel ?? "提交"}</Button>}>
        <div className="flex flex-col gap-4">
          {fields.map(field => {
            const value = values[field.name];
            const options = (field.options ?? []).map(option => ({ value: option, label: option }));
            if (field.type === "textarea") return <TextArea key={field.name} label={label(field)} value={String(value)} placeholder={field.placeholder} onChange={next => set(field.name, next)} />;
            if (field.type === "select") return <SelectOption key={field.name} type="single" label={label(field)} width="100%" options={options} value={String(value) || undefined} placeholder={field.placeholder ?? "请选择"} onChange={((next: string) => set(field.name, next)) as never} />;
            if (field.type === "multiselect") return <SelectOption key={field.name} type="multiple" label={label(field)} width="100%" options={options} value={value as string[]} placeholder={field.placeholder ?? "可多选"} onChange={((next: string[]) => set(field.name, next)) as never} />;
            if (field.type === "switch") return <label key={field.name} className="flex items-center justify-between gap-3 text-sm text-fg-black">{field.label}<Toggle checked={Boolean(value)} onChange={checked => set(field.name, checked)} /></label>;
            return <TextField key={field.name} label={label(field)} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={String(value)} placeholder={field.placeholder} onChange={next => set(field.name, field.type === "number" && next !== "" ? Number(next) : next)} />;
          })}
        </div>
      </Panel>
    </form>
  );
}

export function Confirm({ title, description, risk, fields, confirmLabel, answer, onAsk }: UiSpec<"show_confirm"> & { answer?: string; onAsk: (text: string) => void }) {
  const state = answer === undefined ? "pending" : answer.startsWith("确认") ? "approved" : "denied";
  return (
    <Approval
      size="sm"
      title={title}
      description={description}
      risk={risk}
      // A field with only "before" is context (the current value), not a change.
      fields={fields?.flatMap(field => {
        const after = field.after ?? field.value;
        if (after !== undefined) return [{ label: field.label, before: field.after !== undefined ? field.before : undefined, after }];
        return field.before ? [{ label: field.label, after: field.before }] : [];
      })}
      state={state}
      approveLabel={confirmLabel ?? "确认"}
      denyLabel="取消"
      onApprove={() => onAsk(`确认：${title}`)}
      onDeny={reason => onAsk(`取消：${title}${reason ? `（${reason}）` : ""}`)}
      askDenyReason
    />
  );
}

export function Plan({ title, steps, answer, onAsk }: UiSpec<"show_plan"> & { answer?: string; onAsk: (text: string) => void }) {
  const [draft, setDraft] = useState<PlanStep[]>(() => steps.map((step, index) => ({ id: String(index), title: step.title, detail: step.detail })));
  if (answer) {
    return (
      <div className="flex flex-col gap-1.5">
        <Answered>已确认计划</Answered>
        <AgentPlan size="sm" mode="done" title={title} steps={draft.map(step => ({ ...step, status: "pending" }))} />
      </div>
    );
  }
  return (
    <AgentPlan
      size="sm"
      title={title}
      steps={draft}
      onChange={setDraft}
      onApprove={() => onAsk(`按这个计划执行：\n${draft.filter(step => step.title.trim()).map((step, index) => `${index + 1}. ${step.title.trim()}`).join("\n")}`)}
    />
  );
}

export function Actions({ items, onAsk }: UiSpec<"show_actions"> & { onAsk: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const link = safeHref(item.href);
        if (link) return <a key={item.label} href={link} className={cn("inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium", item.primary ? "bg-accent text-white" : "border border-fg-grey-200 text-fg-black hover:bg-fg-grey-50")}>{item.label}<AltArrowRightLinear size={12} /></a>;
        if (!item.ask) return null;
        return <Button key={item.label} size="sm" variant={item.primary ? "primary" : "tertiary"} color={item.primary ? undefined : "grey"} onClick={() => onAsk(item.ask!)}>{item.label}</Button>;
      })}
    </div>
  );
}

