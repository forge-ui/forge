"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChoiceCard, DataTable, PromptSuggestions, StatCard, type ColumnDef } from "@forge-ui-official/core";
import { CheckCircleLinear, CopyLinear } from "@forge-ui-official/core/icons";
import { uiSchemas, type UiSpec, type UiToolName } from "./schema";
import { Actions, Callout, Changes, Chart, Compare, Confirm, Flow, Form, Funnel, Images, ListBlock, Plan, Progress, Questions, RecordCard, Tags, Timeline } from "./widgets";

type Row = Record<string, string | number | boolean | null>;

// A command to copy: one grey line (or a few), without the file header and line numbers of a code block.
export function Command({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const multiline = text.includes("\n");
  return (
    <div className={`flex gap-2 rounded-lg bg-fg-grey-100 py-1.5 pl-3 pr-1.5 font-mono text-xs leading-5 text-fg-black ${multiline ? "items-start" : "items-center"}`}>
      {multiline ? <pre className="min-w-0 flex-1 overflow-x-auto">{text}</pre> : <span className="min-w-0 flex-1 truncate" title={text}>{text}</span>}
      <button
        type="button"
        aria-label={copied ? "已复制" : "复制"}
        onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
        className="shrink-0 rounded-md p-1 text-fg-grey-700 hover:bg-fg-grey-200 hover:text-fg-black"
      >
        {copied ? <CheckCircleLinear size={14} /> : <CopyLinear size={14} />}
      </button>
    </div>
  );
}

// Code in the narrow panel: small type, a one-line header with the language and copy, no line numbers.
function CodeView({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-fg-grey-200 bg-fg-grey-50">
      <div className="flex items-center justify-between border-b border-fg-grey-200 py-1 pl-3 pr-1 text-xs text-fg-grey-700">
        <span className="font-mono">{language}</span>
        <button
          type="button"
          aria-label={copied ? "已复制" : "复制"}
          onClick={() => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
          className="rounded-md p-1 hover:bg-fg-grey-200 hover:text-fg-black"
        >
          {copied ? <CheckCircleLinear size={14} /> : <CopyLinear size={14} />}
        </button>
      </div>
      <pre className="max-h-80 overflow-auto px-3 py-2 font-mono text-xs leading-5 text-fg-black">{code}</pre>
    </div>
  );
}

const PREVIEW_WIDTH = 1024;

/**
 * A same-site page drawn as a scaled-down, inert thumbnail, so a card shows what it points at.
 * Loaded when scrolled near; hidden if the page turns out not to exist.
 */
function PagePreview({ path, label }: { path: string; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const resize = new ResizeObserver(() => setWidth(element.clientWidth));
    const visible = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setNear(true);
    }, { rootMargin: "300px" });
    resize.observe(element);
    visible.observe(element);
    return () => { resize.disconnect(); visible.disconnect(); };
  }, []);
  if (state === "missing") return null;
  return (
    <div ref={box} aria-hidden="true" inert className="pointer-events-none relative aspect-[8/5] w-full select-none overflow-hidden rounded-lg border border-fg-grey-200 bg-fg-grey-50">
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-fg-grey-100" />}
      {near && width > 0 && (
        <iframe
          src={path}
          title={`${label} 预览`}
          tabIndex={-1}
          loading="lazy"
          onLoad={event => {
            // Same origin, so a missing page shows up as the 404 document.
            const title = safeTitle(event.currentTarget);
            setState(/404|not be found|找不到/i.test(title) ? "missing" : "ready");
          }}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * 5 / 8, transform: `scale(${width / PREVIEW_WIDTH})`, visibility: state === "ready" ? "visible" : "hidden" }}
        />
      )}
    </div>
  );
}

function safeTitle(frame: HTMLIFrameElement) {
  try {
    return frame.contentDocument?.title ?? "";
  } catch {
    return "";
  }
}

function Cards({ title, items }: UiSpec<"show_cards">) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {title && <p className="text-sm font-semibold text-fg-black">{title}</p>}
      <div className="grid min-w-0 gap-2">
        {items.map(item => {
          const body = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- the package does not depend on Next.js */}
              {item.preview ? <PagePreview path={item.preview} label={item.title} /> : item.image && <img src={item.image} alt="" onError={event => { event.currentTarget.hidden = true; }} className="aspect-[16/10] w-full rounded-lg border border-fg-grey-200 object-cover object-top" loading="lazy" />}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-fg-black">{item.title}</span>
                {item.tag && <span className="rounded-full bg-fg-grey-100 px-2 py-0.5 text-xs text-fg-grey-700">{item.tag}</span>}
              </div>
              {item.description && <p className="text-xs leading-5 text-fg-grey-700">{item.description}</p>}
            </>
          );
          return (
            <div key={item.title} className="flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border border-fg-grey-200 bg-background p-3">
              {item.href ? <a href={item.href} className="flex flex-col gap-2 hover:opacity-80">{body}</a> : body}
              {item.code && <Command text={item.code} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Table({ title, columns, rows }: UiSpec<"show_table">) {
  const defs: ColumnDef<Row>[] = columns.map(column => column.numeric
    ? { key: column.key, header: column.header, valueKind: "number", render: row => String(row[column.key] ?? "") }
    : { key: column.key, header: column.header, render: row => String(row[column.key] ?? "") });
  return <DataTable title={title} columns={defs} rows={rows} getRowKey={(_, index) => index} />;
}

function Metrics({ items }: UiSpec<"show_metrics">) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(item => (
        <StatCard key={item.label} title={item.label} value={item.value} trend={item.change} trendDirection={item.direction} size="sm" density="compact" width="full" />
      ))}
    </div>
  );
}

function Steps({ title, steps }: UiSpec<"show_steps">) {
  return (
    <div className="flex flex-col gap-2">
      {title && <p className="text-sm font-semibold text-fg-black">{title}</p>}
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-fg-grey-200 text-xs text-fg-grey-900">{index + 1}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="text-sm font-medium text-fg-black">{step.title}</span>
              {step.detail && <span className="text-xs leading-5 text-fg-grey-700">{step.detail}</span>}
              {step.code && <Command text={step.code.replace(/\n$/, "")} />}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Text of every non-catalog tool result in the same answer; generated values must appear in it. */
export type Sources = { has: (value: string | number) => boolean };

export function sourcesFrom(outputs: unknown[]): Sources {
  const text = outputs.map(output => JSON.stringify(output) ?? "").join("\n");
  return { has: value => text.includes(String(value)) };
}

// Drops images and external links the model made up; site-relative links are allowed.
function groundCards(spec: UiSpec<"show_cards">, sources: Sources): UiSpec<"show_cards"> {
  return {
    ...spec,
    items: spec.items.map(item => ({
      ...item,
      image: item.image && sources.has(item.image) ? item.image : undefined,
      href: item.href && (item.href.startsWith("/") || sources.has(item.href)) ? item.href : undefined,
      // Only this site's own pages are embedded.
      preview: item.preview && /^\/(?!\/)/.test(item.preview) ? item.preview : undefined,
    })),
  };
}

function numbersOf(name: UiToolName, spec: unknown): (string | number)[] {
  if (name === "show_metrics") return (spec as UiSpec<"show_metrics">).items.map(item => item.value.replace(/[^0-9.\-]/g, "")).filter(Boolean);
  if (name === "show_chart") return (spec as UiSpec<"show_chart">).series.flatMap(item => item.data);
  if (name === "show_progress") return (spec as UiSpec<"show_progress">).items.map(item => item.value);
  if (name === "show_funnel") return (spec as UiSpec<"show_funnel">).stages.map(stage => stage.value);
  if (name === "show_table") {
    const table = spec as UiSpec<"show_table">;
    const numeric = table.columns.filter(column => column.numeric).map(column => column.key);
    return table.rows.flatMap(row => numeric.map(key => row[key]).filter((value): value is number | string => typeof value === "number" || typeof value === "string"));
  }
  return [];
}

// Links and images must be this site's pages or appear in a tool result.
function ground(name: UiToolName, data: unknown, sources: Sources): unknown {
  const href = (value?: string) => (value && (value.startsWith("/") || sources.has(value)) ? value : undefined);
  switch (name) {
    case "show_cards": return groundCards(data as UiSpec<"show_cards">, sources);
    case "show_record": { const spec = data as UiSpec<"show_record">; return { ...spec, href: href(spec.href) }; }
    case "show_list": { const spec = data as UiSpec<"show_list">; return { ...spec, items: spec.items.map(item => ({ ...item, href: href(item.href) })) }; }
    case "show_actions": { const spec = data as UiSpec<"show_actions">; return { ...spec, items: spec.items.map(item => ({ ...item, href: href(item.href) })).filter(item => item.href || item.ask) }; }
    case "show_images": {
      const spec = data as UiSpec<"show_images">;
      const items = spec.items.filter(item => sources.has(item.src));
      return items.length ? { items } : undefined;
    }
    default: return data;
  }
}

/**
 * Renders one catalog tool call. Inputs are validated again here, so a part replayed from storage or a
 * malformed call shows nothing rather than a broken component. Numbers in tables, metrics, charts,
 * progress and funnels must come from tool results in the same answer; otherwise a note replaces them.
 */
export function renderCatalog(name: UiToolName, input: unknown, onAsk: (question: string) => void, sources: Sources, answer?: string): ReactNode {
  const parsed = uiSchemas[name].safeParse(input);
  if (!parsed.success) return null;
  const data = ground(name, parsed.data, sources);
  if (data === undefined) return null;
  if (numbersOf(name, data).some(value => !sources.has(value))) {
    return <p className="text-xs text-fg-grey-700">这组数字没能和查询结果核对上，已省略。</p>;
  }
  // The chat column is narrow; wide content (code, tables) scrolls inside its own box.
  return <div className="min-w-0 max-w-full overflow-x-auto">{catalogContent(name, data, onAsk, answer)}</div>;
}

function catalogContent(name: UiToolName, data: unknown, onAsk: (question: string) => void, answer?: string): ReactNode {
  switch (name) {
    case "show_cards": return <Cards {...(data as UiSpec<"show_cards">)} />;
    case "show_code": {
      const code = data as UiSpec<"show_code">;
      return <CodeView language={code.filename ?? "代码"} code={code.code.replace(/\n$/, "")} />;
    }
    case "show_steps": return <Steps {...(data as UiSpec<"show_steps">)} />;
    case "show_callout": return <Callout {...(data as UiSpec<"show_callout">)} />;
    case "show_record": return <RecordCard {...(data as UiSpec<"show_record">)} />;
    case "show_list": return <ListBlock {...(data as UiSpec<"show_list">)} />;
    case "show_timeline": return <Timeline {...(data as UiSpec<"show_timeline">)} />;
    case "show_tags": return <Tags {...(data as UiSpec<"show_tags">)} />;
    case "show_compare": return <Compare {...(data as UiSpec<"show_compare">)} />;
    case "show_changes": return <Changes {...(data as UiSpec<"show_changes">)} />;
    case "show_flow": return <Flow {...(data as UiSpec<"show_flow">)} />;
    case "show_images": return <Images {...(data as UiSpec<"show_images">)} />;
    case "show_table": return <Table {...(data as UiSpec<"show_table">)} />;
    case "show_metrics": return <Metrics {...(data as UiSpec<"show_metrics">)} />;
    case "show_chart": return <Chart {...(data as UiSpec<"show_chart">)} />;
    case "show_progress": return <Progress {...(data as UiSpec<"show_progress">)} />;
    case "show_funnel": return <Funnel {...(data as UiSpec<"show_funnel">)} />;
    case "show_choices": {
      // A pick is sent as the user's next message; once answered the card shows the answer.
      const choices = data as UiSpec<"show_choices">;
      const options = choices.options.map(option => ({ id: option.label, ...option }));
      return <ChoiceCard title={choices.title} options={options} answered={answer} onAnswer={picked => { if ("optionId" in picked) onAsk(picked.optionId); }} />;
    }
    case "show_questions": return <Questions {...(data as UiSpec<"show_questions">)} answer={answer} onAsk={onAsk} />;
    case "show_form": return <Form {...(data as UiSpec<"show_form">)} answer={answer} onAsk={onAsk} />;
    case "show_confirm": return <Confirm {...(data as UiSpec<"show_confirm">)} answer={answer} onAsk={onAsk} />;
    case "show_plan": return <Plan {...(data as UiSpec<"show_plan">)} answer={answer} onAsk={onAsk} />;
    case "show_actions": return <Actions {...(data as UiSpec<"show_actions">)} onAsk={onAsk} />;
    case "suggest_followups": return <PromptSuggestions size="sm" suggestions={(data as UiSpec<"suggest_followups">).questions} onSelect={onAsk} />;
  }
}
