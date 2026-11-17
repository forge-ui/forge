"use client";

import { useState, type ReactNode } from "react";
import {
  AgentPlan,
  Approval,
  BarChart,
  BarHorizontalChart,
  Button,
  DonutChart,
  ProgressBar,
  Question,
  SmoothLineChart,
  cn,
  type PlanStep,
} from "@forge-ui-official/core";
import { AltArrowRightLinear, CheckCircleLinear, DangerTriangleLinear, InfoCircleLinear } from "@forge-ui-official/core/icons";
import type { UiSpec } from "./schema";

/** Components the model writes into its answer, beyond cards, tables and metrics (see render.tsx). */

const frame = "flex min-w-0 flex-col gap-2 rounded-2xl bg-background p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200";
const Title = ({ children }: { children?: ReactNode }) => (children ? <p className="text-sm font-semibold text-fg-black">{children}</p> : null);
const Answered = ({ children }: { children: ReactNode }) => (
  <p className="flex items-start gap-1.5 text-sm text-fg-grey-700"><CheckCircleLinear size={14} color="var(--fg-green-500)" className="mt-0.5 shrink-0" /><span className="min-w-0">{children}</span></p>
);
const safeHref = (href?: string) => (href && (/^\/(?!\/)/.test(href) || /^https:\/\//.test(href)) ? href : undefined);

/* ── Display ── */

const TONE = {
  info: { icon: InfoCircleLinear, style: "border-fg-blue-200 bg-fg-blue-50 text-fg-blue-800" },
  success: { icon: CheckCircleLinear, style: "border-fg-green-200 bg-fg-green-50 text-fg-green-700" },
  warning: { icon: DangerTriangleLinear, style: "border-fg-yellow-300 bg-fg-yellow-50 text-fg-yellow-900" },
  danger: { icon: DangerTriangleLinear, style: "border-fg-red-200 bg-fg-red-50 text-fg-red-700" },
} as const;

export function Callout({ tone, title, text }: UiSpec<"show_callout">) {
  const { icon: Icon, style } = TONE[tone];
  return (
    <div role={tone === "danger" || tone === "warning" ? "alert" : "note"} className={cn("flex gap-2 rounded-xl border px-3 py-2.5 text-sm leading-5", style)}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">{title && <span className="font-semibold">{title}</span>}<span>{text}</span></div>
    </div>
  );
}

export function RecordCard({ title, subtitle, status, fields, href }: UiSpec<"show_record">) {
  const link = safeHref(href);
  return (
    <div className={frame}>
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-fg-black">{title}</span>
          {subtitle && <span className="truncate text-xs text-fg-grey-700">{subtitle}</span>}
        </div>
        {status && <span className="shrink-0 rounded-full bg-fg-grey-100 px-2 py-0.5 text-xs text-fg-grey-900">{status}</span>}
      </div>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
        {fields.map(field => (
          <div key={field.label} className="contents"><dt className="text-fg-grey-700">{field.label}</dt><dd className="min-w-0 break-words text-fg-black">{field.value}</dd></div>
        ))}
      </dl>
      {link && <a href={link} className="flex items-center gap-1 self-start text-xs font-medium text-accent hover:underline">查看详情<AltArrowRightLinear size={12} /></a>}
    </div>
  );
}

export function ListBlock({ title, items }: UiSpec<"show_list">) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Title>{title}</Title>
      <ul className="flex flex-col divide-y divide-fg-grey-100 rounded-2xl bg-background outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
        {items.map(item => {
          const link = safeHref(item.href);
          const body = (
            <>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm text-fg-black">{item.title}</span>
                {item.description && <span className="line-clamp-2 text-xs text-fg-grey-700">{item.description}</span>}
              </span>
              {item.tag && <span className="shrink-0 rounded-full bg-fg-grey-100 px-2 py-0.5 text-xs text-fg-grey-900">{item.tag}</span>}
              {item.meta && <span className="shrink-0 text-xs tabular-nums text-fg-grey-500">{item.meta}</span>}
            </>
          );
          return <li key={item.title}>{link ? <a href={link} className="flex min-w-0 items-center gap-2 px-3 py-2 hover:bg-fg-grey-50">{body}</a> : <div className="flex min-w-0 items-center gap-2 px-3 py-2">{body}</div>}</li>;
        })}
      </ul>
    </div>
  );
}

const DOT = { info: "bg-accent", success: "bg-fg-green-500", warning: "bg-fg-yellow-500", danger: "bg-fg-red" } as const;

export function Timeline({ title, events }: UiSpec<"show_timeline">) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Title>{title}</Title>
      <ol className="flex flex-col">
        {events.map((event, index) => (
          <li key={`${event.time}-${index}`} className="relative flex gap-3 pb-3 last:pb-0">
            {index < events.length - 1 && <span aria-hidden="true" className="absolute left-[3.5px] top-3 h-full w-px bg-fg-grey-200" />}
            <span aria-hidden="true" className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[event.tone ?? "info"])} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs tabular-nums text-fg-grey-500">{event.time}</span>
              <span className="text-sm text-fg-black">{event.title}</span>
              {event.detail && <span className="text-xs leading-5 text-fg-grey-700">{event.detail}</span>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Tags({ title, tags }: UiSpec<"show_tags">) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Title>{title}</Title>
      <div className="flex flex-wrap gap-1.5">{tags.map(tag => <span key={tag} className="rounded-full border border-fg-grey-200 px-2.5 py-0.5 text-xs text-fg-grey-900">{tag}</span>)}</div>
    </div>
  );
}

export function Compare({ title, items }: UiSpec<"show_compare">) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Title>{title}</Title>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(9rem, 1fr))` }}>
        {items.map(item => (
          <div key={item.title} className={cn("flex min-w-0 flex-col gap-1.5 rounded-xl border p-3", item.recommended ? "border-accent bg-fg-blue-50" : "border-fg-grey-200 bg-background")}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-fg-black">{item.title}</span>
              {item.recommended && <span className="rounded-full bg-accent px-1.5 py-px text-2xs text-white">推荐</span>}
              {item.tag && !item.recommended && <span className="rounded-full bg-fg-grey-100 px-1.5 py-px text-2xs text-fg-grey-700">{item.tag}</span>}
            </div>
            <ul className="flex flex-col gap-1 text-xs leading-5 text-fg-grey-900">{item.points.map(point => <li key={point} className="flex gap-1.5"><span className="text-fg-grey-400">·</span>{point}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Changes({ title, fields }: UiSpec<"show_changes">) {
  return (
    <div className={frame}>
      <Title>{title}</Title>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
        {fields.map(field => (
          <div key={field.label} className="contents">
            <dt className="text-fg-grey-700">{field.label}</dt>
            <dd className="min-w-0 break-words"><span className="rounded bg-fg-red-50 px-1 text-fg-red-700 line-through">{field.before || "空"}</span> → <span className="rounded bg-fg-green-50 px-1 text-fg-green-700">{field.after || "空"}</span></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Flow({ title, nodes, edges }: UiSpec<"show_flow">) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  return (
    <div className={frame}>
      <Title>{title}</Title>
      <ol className="flex flex-col gap-1">
        {nodes.map(node => {
          const out = edges.filter(edge => edge.from === node.id && byId.has(edge.to));
          const decision = node.kind === "decision";
          return (
            <li key={node.id} className="flex flex-col items-start gap-1">
              <span className={cn("px-3 py-1.5 text-sm text-fg-black", decision ? "rounded-lg border border-dashed border-fg-yellow-400 bg-fg-yellow-50" : node.kind === "start" || node.kind === "end" ? "rounded-full bg-fg-grey-100" : "rounded-lg border border-fg-grey-200 bg-background")}>{node.label}</span>
              {out.map(edge => (
                <span key={`${edge.from}-${edge.to}`} className="ml-3 flex items-center gap-1 text-xs text-fg-grey-700">
                  ↓{edge.label && <span className="rounded bg-fg-grey-100 px-1.5 py-px">{edge.label}</span>}<span className="text-fg-grey-500">到「{byId.get(edge.to)?.label}」</span>
                </span>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Images({ items }: UiSpec<"show_images">) {
  return (
    <div className={cn("grid gap-2", items.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
      {items.map(item => (
        <figure key={item.src} className="flex min-w-0 flex-col gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- the package does not depend on Next.js */}
          <img src={item.src} alt={item.caption ?? ""} loading="lazy" onError={event => { event.currentTarget.parentElement!.hidden = true; }} className="aspect-[4/3] w-full rounded-lg border border-fg-grey-200 object-cover" />
          {item.caption && <figcaption className="truncate text-xs text-fg-grey-700">{item.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

/* ── Data ── */

export function Chart({ title, type, labels, series }: UiSpec<"show_chart">) {
  const first = series[0]?.data ?? [];
  const points = labels.map((label, index) => ({ label, value: first[index] ?? 0 }));
  return (
    <div className={frame}>
      <Title>{title}</Title>
      {type === "donut" ? (
        <div className="flex items-center gap-4">
          <DonutChart segments={points} size="sm" ariaLabel={title} />
          <ul className="flex min-w-0 flex-col gap-1 text-xs">{points.map(point => <li key={point.label} className="flex gap-2"><span className="truncate text-fg-grey-700">{point.label}</span><span className="ml-auto tabular-nums text-fg-black">{point.value}</span></li>)}</ul>
        </div>
      ) : type === "hbar" ? (
        <BarHorizontalChart data={points} showLabels />
      ) : (
        <>
          <div className="h-40">
            {type === "bar"
              ? <BarChart data={points} ariaLabel={title} />
              : <SmoothLineChart series={series.map(item => ({ label: item.label, data: item.data, fillArea: type === "area" }))} ariaLabel={title} />}
          </div>
          <div className="flex justify-between text-xs text-fg-grey-700"><span>{labels[0]}</span><span>{labels[labels.length - 1]}</span></div>
          {series.length > 1 && <div className="flex flex-wrap gap-3 text-xs text-fg-grey-700">{series.map(item => <span key={item.label}>{item.label}</span>)}</div>}
        </>
      )}
    </div>
  );
}

export function Progress({ title, items }: UiSpec<"show_progress">) {
  return (
    <div className={frame}>
      <Title>{title}</Title>
      {items.map(item => (
        <div key={item.label} className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2 text-sm"><span className="min-w-0 flex-1 truncate text-fg-black">{item.label}</span>{item.note && <span className="text-xs text-fg-grey-500">{item.note}</span>}<span className="tabular-nums text-fg-grey-900">{item.value}%</span></div>
          <ProgressBar value={item.value} color={item.value >= 90 ? "red" : "blue"} />
        </div>
      ))}
    </div>
  );
}

export function Funnel({ title, stages }: UiSpec<"show_funnel">) {
  const top = Math.max(1, stages[0]?.value ?? 1);
  return (
    <div className={frame}>
      <Title>{title}</Title>
      {stages.map((stage, index) => (
        <div key={stage.label} className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="min-w-0 flex-1 truncate text-fg-black">{stage.label}</span>
            <span className="tabular-nums text-fg-black">{stage.value}</span>
            {index > 0 && <span className="w-12 text-right tabular-nums text-xs text-fg-grey-500">{stages[index - 1].value ? `${Math.round((stage.value / stages[index - 1].value) * 100)}%` : "—"}</span>}
          </div>
          <div className="h-2 rounded-full bg-fg-grey-100"><div className="h-full rounded-full bg-accent" style={{ width: `${(stage.value / top) * 100}%`, opacity: 1 - index * 0.08 }} /></div>
        </div>
      ))}
    </div>
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
  const input = "w-full min-w-0 rounded-lg border border-fg-grey-200 bg-background px-2.5 py-1.5 text-sm text-fg-black outline-none placeholder:text-fg-grey-500 focus:border-accent";
  const describe = (value: FieldValue) => (Array.isArray(value) ? value.join("、") : typeof value === "boolean" ? (value ? "是" : "否") : String(value));
  return (
    <form
      className={frame}
      onSubmit={event => {
        event.preventDefault();
        if (missing.length) return;
        onAsk(`提交「${title}」：${fields.filter(field => describe(values[field.name]) !== "").map(field => `${field.label}：${describe(values[field.name])}`).join("；")}`);
      }}
    >
      <Title>{title}</Title>
      {fields.map(field => {
        const id = `forge-form-${field.name}`;
        const value = values[field.name];
        return (
          <div key={field.name} className={cn("flex gap-1", field.type === "switch" ? "items-center justify-between" : "flex-col")}>
            <label htmlFor={id} className="text-xs text-fg-grey-700">{field.label}{field.required && <span className="text-fg-red"> *</span>}</label>
            {field.type === "textarea" ? <textarea id={id} rows={3} value={String(value)} placeholder={field.placeholder} onChange={event => set(field.name, event.target.value)} className={input} />
              : field.type === "select" ? (
                <select id={id} value={String(value)} onChange={event => set(field.name, event.target.value)} className={input}>
                  <option value="">{field.placeholder ?? "请选择"}</option>
                  {(field.options ?? []).map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : field.type === "multiselect" ? (
                <div id={id} role="group" aria-label={field.label} className="flex flex-wrap gap-1.5">
                  {(field.options ?? []).map(option => {
                    const on = (value as string[]).includes(option);
                    return <button key={option} type="button" aria-pressed={on} onClick={() => set(field.name, on ? (value as string[]).filter(item => item !== option) : [...(value as string[]), option])} className="rounded-full border border-fg-grey-200 px-2.5 py-0.5 text-xs text-fg-grey-900 aria-pressed:border-accent aria-pressed:bg-fg-blue-50 aria-pressed:text-accent">{option}</button>;
                  })}
                </div>
              ) : field.type === "switch" ? (
                <button id={id} type="button" role="switch" aria-checked={Boolean(value)} onClick={() => set(field.name, !value)} className="relative h-5 w-9 shrink-0 rounded-full bg-fg-grey-200 transition-colors aria-checked:bg-accent">
                  <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-all", value ? "left-[18px]" : "left-0.5")} />
                </button>
              ) : <input id={id} type={field.type} value={String(value)} placeholder={field.placeholder} onChange={event => set(field.name, field.type === "number" && event.target.value !== "" ? Number(event.target.value) : event.target.value)} className={input} />}
          </div>
        );
      })}
      <Button size="sm" type="submit" disabled={missing.length > 0} className="self-start">{submitLabel ?? "提交"}</Button>
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
      fields={fields?.map(field => (field.after === undefined ? { label: field.label, after: field.before ?? "" } : { label: field.label, before: field.before, after: field.after }))}
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

