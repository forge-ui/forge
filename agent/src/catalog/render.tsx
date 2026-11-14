"use client";

import { useState, type ReactNode } from "react";
import { AgentCodeBlock, BarChart, DataTable, PromptSuggestions, SmoothLineChart, StatCard, type ColumnDef } from "@forge-ui-official/core";
import { CheckCircleLinear, CopyLinear } from "@forge-ui-official/core/icons";
import { uiSchemas, type UiSpec, type UiToolName } from "./schema";

type Row = Record<string, string | number | boolean | null>;

// A command to copy: one grey line (or a few), without the file header and line numbers of a code block.
function Command({ text }: { text: string }) {
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

function Cards({ title, items }: UiSpec<"show_cards">) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {title && <p className="text-sm font-semibold text-fg-black">{title}</p>}
      <div className="grid min-w-0 gap-2">
        {items.map(item => {
          const body = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- the package does not depend on Next.js */}
              {item.image && <img src={item.image} alt="" onError={event => { event.currentTarget.hidden = true; }} className="aspect-[16/10] w-full rounded-lg border border-fg-grey-200 object-cover object-top" loading="lazy" />}
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

function Chart({ title, type, labels, series }: UiSpec<"show_chart">) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-fg-grey-200 bg-background p-3">
      {title && <p className="text-sm font-semibold text-fg-black">{title}</p>}
      <div className="h-40">
        {type === "bar"
          ? <BarChart data={labels.map((label, index) => ({ label, value: series[0]?.data[index] ?? 0 }))} ariaLabel={title} />
          : <SmoothLineChart series={series.map(item => ({ label: item.label, data: item.data }))} ariaLabel={title} />}
      </div>
      <div className="flex justify-between text-xs text-fg-grey-700"><span>{labels[0]}</span><span>{labels[labels.length - 1]}</span></div>
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
    })),
  };
}

function numbersOf(name: UiToolName, spec: unknown): (string | number)[] {
  if (name === "show_metrics") return (spec as UiSpec<"show_metrics">).items.map(item => item.value.replace(/[^0-9.\-]/g, "")).filter(Boolean);
  if (name === "show_chart") return (spec as UiSpec<"show_chart">).series.flatMap(item => item.data);
  if (name === "show_table") {
    const table = spec as UiSpec<"show_table">;
    const numeric = table.columns.filter(column => column.numeric).map(column => column.key);
    return table.rows.flatMap(row => numeric.map(key => row[key]).filter((value): value is number | string => typeof value === "number" || typeof value === "string"));
  }
  return [];
}

/**
 * Renders one catalog tool call. Inputs are validated again here, so a part replayed from storage or a
 * malformed call shows nothing rather than a broken component. Numbers in tables, metrics and charts
 * must come from tool results in the same answer; otherwise a note replaces the figure.
 */
export function renderCatalog(name: UiToolName, input: unknown, onAsk: (question: string) => void, sources: Sources): ReactNode {
  const parsed = uiSchemas[name].safeParse(input);
  if (!parsed.success) return null;
  const data = name === "show_cards" ? groundCards(parsed.data as UiSpec<"show_cards">, sources) : parsed.data;
  if (numbersOf(name, data).some(value => !sources.has(value))) {
    return <p className="text-xs text-fg-grey-700">这组数字没能和查询结果核对上，已省略。</p>;
  }
  // The chat column is narrow; wide content (code, tables) scrolls inside its own box.
  return <div className="min-w-0 max-w-full overflow-x-auto">{catalogContent(name, data, onAsk)}</div>;
}

function catalogContent(name: UiToolName, data: unknown, onAsk: (question: string) => void): ReactNode {
  const parsed = { data };
  switch (name) {
    case "show_cards": return <Cards {...(parsed.data as UiSpec<"show_cards">)} />;
    case "show_code": {
      const spec = parsed.data as UiSpec<"show_code">;
      return <AgentCodeBlock className="min-w-0" filename={spec.filename ?? "代码"} lines={spec.code.replace(/\n$/, "").split("\n")} />;
    }
    case "show_table": return <Table {...(parsed.data as UiSpec<"show_table">)} />;
    case "show_metrics": return <Metrics {...(parsed.data as UiSpec<"show_metrics">)} />;
    case "show_chart": return <Chart {...(parsed.data as UiSpec<"show_chart">)} />;
    case "show_steps": return <Steps {...(parsed.data as UiSpec<"show_steps">)} />;
    case "suggest_followups": return <PromptSuggestions size="sm" suggestions={(parsed.data as UiSpec<"suggest_followups">).questions} onSelect={onAsk} />;
  }
}
