"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Block, Streamdown, type BlockProps } from "streamdown";
import { AltArrowDownLinear, CopyLinear, LinkLinear } from "../../../icons";
import { useReducedMotion } from "../../../internal/motion";
import { segmentGraphemes, useStreamingText } from "../../../internal/streaming-text";
import type { MotionPreference } from "../../../lib/motion";
import { cn } from "../../../lib/utils";

export type StreamingSource = {
  name: string;
  domain?: string;
  href?: string;
};

export type StreamingAnswerStatus = "streaming" | "complete" | "stopped";

export type StreamingAnswerProps = {
  text: string;
  /** Replay a complete string. For a live response, use status instead. */
  streaming?: boolean;
  /** Transport state. Complete drains the display buffer; stopped freezes it. */
  status?: StreamingAnswerStatus;
  /** Plain preserves literal text and whitespace; Markdown is opt-in. */
  format?: "plain" | "markdown";
  animation?: "fade" | "blur";
  /** Fade duration in milliseconds; zero shows incoming content immediately. */
  duration?: number;
  motion?: MotionPreference;
  sources?: StreamingSource[];
  sourcesLabel?: string;
  followUps?: string[];
  followUpsLabel?: string;
  onFollowUp?: (text: string, index: number) => void;
  /** Called once per completed answer after its final fade, never on stop. */
  onDone?: () => void;
  className?: string;
};

function plainSegments(text: string) {
  const segments: { value: string; offset: number }[] = [];
  const word = /^[\p{Script=Latin}\p{Number}\p{Mark}'’_-]+$/u;
  for (const item of segmentGraphemes(text)) {
    const previous = segments.at(-1);
    if (previous && word.test(previous.value) && word.test(item.segment)) previous.value += item.segment;
    else segments.push({ value: item.segment, offset: item.index });
  }
  return segments;
}

type TextTree = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: TextTree[] };

// Streamdown's char separator uses code points. Merge adjacent animated spans
// at grapheme boundaries so emoji joins and combining marks share one glyph.
function keepAnimatedGraphemes() {
  return function transform(tree: TextTree) {
    if (!tree.children) return;
    const output: TextTree[] = [];
    for (let index = 0; index < tree.children.length;) {
      const run: TextTree[] = [];
      while (index < tree.children.length) {
        const child = tree.children[index];
        if (child.tagName !== "span" || !child.properties?.["data-sd-animate"] || child.children?.length !== 1 || child.children[0].type !== "text") break;
        run.push(child);
        index++;
      }
      if (!run.length) {
        const child = tree.children[index++];
        transform(child);
        output.push(child);
        continue;
      }
      const value = run.map((node) => node.children![0].value ?? "").join("");
      const ends = new Set(segmentGraphemes(value).map((item) => item.index + item.segment.length));
      let position = 0;
      let pending: TextTree | undefined;
      for (const node of run) {
        const fragment = node.children![0].value ?? "";
        position += fragment.length;
        if (pending) pending.children![0].value += fragment;
        else pending = { ...node, children: [{ type: "text", value: fragment }] };
        if (ends.has(position)) { output.push(pending); pending = undefined; }
      }
      if (pending) output.push(pending);
    }
    tree.children = output;
  };
}

function AnswerBlock(props: BlockProps) {
  const plugins = useMemo(() => [...(props.rehypePlugins ?? []), keepAnimatedGraphemes], [props.rehypePlugins]);
  return <Block {...props} rehypePlugins={plugins} />;
}

export function StreamingAnswer({
  text,
  streaming = false,
  status,
  format = "plain",
  animation = "fade",
  duration = 500,
  motion = "auto",
  sources = [],
  sourcesLabel,
  followUps = [],
  followUpsLabel = "Follow-ups",
  onFollowUp,
  onDone,
  className = "",
}: StreamingAnswerProps) {
  const reduced = useReducedMotion(motion);
  const fadeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 500;
  const playout = useStreamingText({ text, streaming, status, reducedMotion: reduced, duration: fadeDuration });
  const segments = useMemo(() => plainSegments(playout.text), [playout.text]);
  const animate = playout.busy && !playout.motionDisabled && !reduced && fadeDuration > 0;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const notified = useRef<{ generation: number; text: string } | null>(null);

  useEffect(() => {
    if (playout.done && (notified.current?.generation !== playout.generation || notified.current?.text !== text)) {
      notified.current = { generation: playout.generation, text };
      onDone?.();
    }
  }, [playout.done, playout.generation, text, onDone]);

  return (
    <div className={cn("forge-streaming-answer flex flex-col gap-3 text-sm", className)} data-motion={motion} data-streaming-state={status === "stopped" ? "stopped" : playout.busy ? "streaming" : "complete"} aria-busy={playout.busy}>
      {format === "markdown" ? (
        <Streamdown
          key={playout.generation}
          className="forge-streaming-body forge-streaming-markdown text-[15px] leading-7 tracking-fg text-fg-black"
          mode="streaming"
          BlockComponent={AnswerBlock}
          isAnimating={animate}
          animated={animate ? { animation: animation === "blur" ? "forge-answer-blur" : "forge-answer-in", duration: fadeDuration, easing: "linear", sep: "char", stagger: 0 } : false}
          controls={false}
          linkSafety={{ enabled: false }}
          skipHtml
        >{playout.text}</Streamdown>
      ) : (
        <p key={playout.generation} className="forge-streaming-body whitespace-pre-wrap text-[15px] leading-7 tracking-fg text-fg-black">
          {animate ? segments.map((segment) => <span key={segment.offset} className="forge-answer-segment" style={{ "--forge-answer-duration": `${fadeDuration}ms`, "--forge-answer-animation": animation === "blur" ? "sd-forge-answer-blur" : "sd-forge-answer-in" } as CSSProperties}>{segment.value}</span>) : playout.text}
        </p>
      )}

      {sources.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            className="flex w-fit items-center gap-2 rounded-lg px-1.5 py-1 text-xs font-medium text-fg-grey-700 hover:bg-fg-grey-100"
          >
            <span className="flex -space-x-1">
              {sources.slice(0, 3).map((source) => (
                <span
                  key={source.name}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-fg-grey-100 text-2xs font-semibold text-fg-grey-700 outline outline-1 outline-white"
                >
                  {source.name.slice(0, 1)}
                </span>
              ))}
            </span>
            {sourcesLabel ?? `${sources.length} sources`}
            <AltArrowDownLinear size={12} color="var(--fg-grey-500)" />
          </button>
          {sourcesOpen && (
            <ul className="flex flex-col gap-1.5">
              {sources.map((source) => (
                <li key={source.name}>
                  {source.href ? (
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-fg-grey-100"
                    >
                      <LinkLinear size={14} color="var(--fg-grey-500)" />
                      <span className="font-medium text-fg-black">{source.name}</span>
                      {source.domain && <span className="text-xs text-fg-grey-500">{source.domain}</span>}
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                      <LinkLinear size={14} color="var(--fg-grey-500)" />
                      <span className="font-medium text-fg-black">{source.name}</span>
                      {source.domain && <span className="text-xs text-fg-grey-500">{source.domain}</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {playout.done && followUps.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-fg text-fg-grey-500">{followUpsLabel}</p>
          {followUps.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => onFollowUp?.(item, index)}
              className="forge-fade-up flex items-center justify-between gap-2 rounded-lg border-b border-fg-grey-200 px-1.5 py-2 text-left text-sm text-fg-black hover:bg-fg-grey-100"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {item}
              <CopyLinear size={14} color="var(--fg-grey-500)" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
