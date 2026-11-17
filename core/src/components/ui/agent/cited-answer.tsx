"use client";

import { useState, type ReactNode } from "react";
import { DocumentTextLinear, LinkLinear } from "../../../icons";
import { cn } from "../../../lib/utils";
import { pick, type AgentLocale } from "./agent-utils";

export type CitationSource = {
  /** The number used in the text: "[2]" refers to id 2. */
  id: number;
  title: string;
  href?: string;
  /** e.g. "docs.example.com" or "订单 1024". */
  domain?: string;
  /** The passage the claim rests on, shown in the preview. */
  quote?: string;
};

export type CitationProps = {
  source: CitationSource;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  locale?: AgentLocale;
};

/** A numbered citation chip; pointing at it previews the source and its quote. */
export function Citation({ source, active = false, onActiveChange, locale = "zh" }: CitationProps) {
  const [open, setOpen] = useState(false);
  const show = (value: boolean) => { setOpen(value); onActiveChange?.(value); };
  return (
    <span className="relative inline-block align-baseline" onPointerEnter={() => show(true)} onPointerLeave={() => show(false)}>
      <button
        type="button"
        aria-label={pick(locale, `来源 ${source.id}：${source.title}`, `Source ${source.id}: ${source.title}`)}
        aria-expanded={open}
        onFocus={() => show(true)}
        onBlur={() => show(false)}
        onClick={() => { if (source.href) window.open(source.href, "_blank", "noopener"); }}
        className={cn("mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded px-1 align-[1px] text-[10px] font-semibold leading-none transition-colors", active || open ? "bg-accent text-white" : "bg-fg-grey-100 text-fg-grey-700 hover:bg-fg-grey-200")}
      >
        {source.id}
      </button>
      {open && (
        <span role="tooltip" className="absolute left-0 top-full z-30 mt-1 flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-1.5 rounded-xl border border-fg-grey-200 bg-background p-3 text-left text-xs leading-5 tracking-fg shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)]">
          <span className="flex items-center gap-1.5 text-fg-grey-700">
            {source.href ? <LinkLinear size={12} /> : <DocumentTextLinear size={12} />}
            <span className="truncate">{source.domain ?? (source.href ? safeHost(source.href) : pick(locale, "资料", "Document"))}</span>
          </span>
          <span className="font-semibold text-fg-black">{source.title}</span>
          {source.quote && <span className="border-l-2 border-accent pl-2 text-fg-grey-900">“{source.quote}”</span>}
        </span>
      )}
    </span>
  );
}

function safeHost(href: string) {
  try { return new URL(href).hostname; } catch { return href; }
}

export type CitedAnswerProps = {
  /** Plain text with citation markers like "[1]" or "[1][3]"; blank lines separate paragraphs. */
  text: string;
  sources: CitationSource[];
  /** Hide the numbered source list under the answer. */
  hideSourceList?: boolean;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};

const SENTENCE = /[^。！？!?.\n]+(?:[。！？!?.]+|$)(?:\s*\[\d+\])*/g;
const MARKER = /\[(\d+)\]/g;

/**
 * An answer wired to its sources: citation chips in the text preview the source and quote, and
 * pointing at one lights up the sentence it supports and its entry in the source list.
 */
export function CitedAnswer({ text, sources, hideSourceList = false, locale = "zh", size = "md", className }: CitedAnswerProps) {
  const [active, setActive] = useState<{ sentence: string; source: number }>();
  const byId = new Map(sources.map(source => [source.id, source]));
  const used = new Set<number>();
  const paragraphs = text.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean);

  const renderSentence = (sentence: string, key: string): ReactNode => {
    const pieces: ReactNode[] = [];
    let last = 0;
    for (const match of sentence.matchAll(MARKER)) {
      const source = byId.get(Number(match[1]));
      pieces.push(sentence.slice(last, match.index));
      last = (match.index ?? 0) + match[0].length;
      if (!source) continue;
      used.add(source.id);
      pieces.push(<Citation key={`${key}-${match.index}`} source={source} locale={locale} active={active?.sentence === key && active.source === source.id} onActiveChange={on => setActive(on ? { sentence: key, source: source.id } : undefined)} />);
    }
    pieces.push(sentence.slice(last));
    return <span key={key} className={cn("rounded-sm transition-colors", active?.sentence === key && "bg-fg-yellow-100")}>{pieces}</span>;
  };

  const body = paragraphs.map((paragraph, index) => (
    <p key={index}>{(paragraph.match(SENTENCE) ?? [paragraph]).map((sentence, at) => renderSentence(sentence, `${index}-${at}`))}</p>
  ));
  const listed = sources.filter(source => used.has(source.id));

  return (
    <div className={cn("flex min-w-0 flex-col gap-3 tracking-fg text-fg-black", size === "sm" ? "text-[13px] leading-6" : "text-sm leading-6", className)}>
      {body}
      {!hideSourceList && listed.length > 0 && (
        <ol aria-label={pick(locale, "来源", "Sources")} className="flex flex-col gap-1 border-t border-fg-grey-100 pt-2 text-xs">
          {listed.map(source => (
            <li key={source.id} className={cn("flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 transition-colors", active?.source === source.id ? "bg-fg-blue-50" : "")}>
              <span className="flex size-4 shrink-0 items-center justify-center rounded bg-fg-grey-100 text-[10px] font-semibold text-fg-grey-700">{source.id}</span>
              {source.href
                ? <a href={source.href} target="_blank" rel="noreferrer" className="min-w-0 truncate text-fg-black hover:underline">{source.title}</a>
                : <span className="min-w-0 truncate text-fg-black">{source.title}</span>}
              {(source.domain || source.href) && <span className="shrink-0 text-fg-grey-500">{source.domain ?? safeHost(source.href ?? "")}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
