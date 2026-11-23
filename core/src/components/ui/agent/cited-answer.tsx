"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useState, type ReactNode } from "react";
import { AltArrowDownLinear, DocumentTextLinear, LinkLinear } from "../../../icons";
import { Disclosure, DisclosurePanel, DisclosureTrigger } from "../../../internal/agent-kit";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";
import { pick, type AgentLocale } from "./agent-utils";

export type CitationSource = {
  /** The number used in the text: "[2]" refers to id 2. */
  id: number;
  title: string;
  href?: string;
  /** e.g. "docs.example.com" or "订单中心". */
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

function safeHost(href: string) {
  try { return new URL(href).hostname; } catch { return href; }
}

/** A numbered citation chip; pointing at it previews the source and its quote. */
export function Citation({ source, active = false, onActiveChange, locale = "zh" }: CitationProps) {
  const [open, setOpen] = useState(false);
  const show = (value: boolean) => { setOpen(value); onActiveChange?.(value); };
  const where = source.domain ?? (source.href ? safeHost(source.href) : pick(locale, "资料", "Document"));
  return (
    <TooltipPrimitive.Root open={open} onOpenChange={next => show(next)}>
      <TooltipPrimitive.Trigger
        delay={0}
        closeDelay={80}
        aria-label={pick(locale, `来源 ${source.id}：${source.title}`, `Source ${source.id}: ${source.title}`)}
        onClick={() => { if (source.href) window.open(source.href, "_blank", "noopener"); }}
        className={cn("mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 align-[1px] text-2xs font-medium leading-none tracking-fg transition-colors", active || open ? "bg-accent text-accent-foreground" : "bg-fg-grey-100 text-fg-grey-700 hover:bg-fg-grey-200")}
      >
        {source.id}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={8} className="z-50">
          <TooltipPrimitive.Popup data-motion="auto" className="forge-popup flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-2xl bg-background p-4 text-left tracking-fg shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
            <span className="flex items-center gap-1.5 text-xs text-fg-grey-500">
              {source.href ? <LinkLinear size={12} color="var(--fg-grey-500)" /> : <DocumentTextLinear size={12} color="var(--fg-grey-500)" />}
              <span className="truncate">{where}</span>
            </span>
            <span className="text-sm font-medium leading-5 text-fg-black">{source.title}</span>
            {source.quote && <span className="rounded-xl bg-fg-grey-50 px-3 py-2 text-xs leading-5 text-fg-grey-900">{source.quote}</span>}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export type CitedAnswerProps = {
  /** Plain text with citation markers like "[1]" or "[1][3]"; blank lines separate paragraphs. */
  text: string;
  sources: CitationSource[];
  /** Hide the source list under the answer. */
  hideSourceList?: boolean;
  /** Whether the source list starts open. */
  defaultSourcesOpen?: boolean;
  sourcesLabel?: string;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};

const SENTENCE = /[^。！？!?.\n]+(?:[。！？!?.]+|$)(?:\s*\[\d+\])*/g;
const MARKER = /\[(\d+)\]/g;

/**
 * An answer wired to its sources: citation chips in the text preview the source and quote, and
 * pointing at one lights up the sentence it supports and its entry in the source list.
 */
export function CitedAnswer({ text, sources, hideSourceList = false, defaultSourcesOpen = true, sourcesLabel, locale = "zh", motion = "auto", size = "md", className }: CitedAnswerProps) {
  const [active, setActive] = useState<{ sentence: string; source: number }>();
  const [sourcesOpen, setSourcesOpen] = useState(defaultSourcesOpen);
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
    return <span key={key} className={cn("rounded-[4px] transition-colors duration-200", active?.sentence === key && "bg-accent-soft")}>{pieces}</span>;
  };

  const body = paragraphs.map((paragraph, index) => (
    <p key={index}>{(paragraph.match(SENTENCE) ?? [paragraph]).map((sentence, at) => renderSentence(sentence, `${index}-${at}`))}</p>
  ));
  const listed = sources.filter(source => used.has(source.id));

  return (
    <div className={cn("flex min-w-0 flex-col gap-3 text-sm leading-6 tracking-fg text-fg-black", size === "md" && "leading-7", className)}>
      {body}
      {!hideSourceList && listed.length > 0 && (
        <Disclosure open={sourcesOpen} onOpenChange={setSourcesOpen} className="flex flex-col gap-1.5">
          <DisclosureTrigger className="-ml-1.5 flex w-fit items-center gap-2 rounded-lg px-1.5 py-1 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100">
            <span className="flex -space-x-1">
              {listed.slice(0, 3).map(source => <span key={source.id} className="inline-flex size-5 items-center justify-center rounded-full bg-fg-grey-100 text-2xs font-medium text-fg-grey-700 outline outline-1 outline-white">{source.id}</span>)}
            </span>
            {sourcesLabel ?? pick(locale, `${listed.length} 个来源`, `${listed.length} sources`)}
            <AltArrowDownLinear size={12} color="var(--fg-grey-500)" className={cn("transition-transform", sourcesOpen && "rotate-180")} />
          </DisclosureTrigger>
          <DisclosurePanel motion={motion}>
            <ol aria-label={pick(locale, "来源", "Sources")} className="flex flex-col gap-0.5">
              {listed.map(source => {
                const row = (
                  <>
                    <span className={cn("inline-flex size-5 shrink-0 items-center justify-center rounded-full text-2xs font-medium transition-colors", active?.source === source.id ? "bg-accent text-accent-foreground" : "bg-fg-grey-100 text-fg-grey-700")}>{source.id}</span>
                    <span className="min-w-0 truncate font-medium text-fg-black">{source.title}</span>
                    {(source.domain || source.href) && <span className="shrink-0 text-xs text-fg-grey-500">{source.domain ?? safeHost(source.href ?? "")}</span>}
                  </>
                );
                const style = cn("flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors", active?.source === source.id && "bg-accent-soft");
                return <li key={source.id}>{source.href ? <a href={source.href} target="_blank" rel="noreferrer" className={cn(style, "hover:bg-fg-grey-100")}>{row}</a> : <div className={style}>{row}</div>}</li>;
              })}
            </ol>
          </DisclosurePanel>
        </Disclosure>
      )}
    </div>
  );
}
