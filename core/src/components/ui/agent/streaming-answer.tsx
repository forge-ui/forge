"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AltArrowDownLinear, CopyLinear, LinkLinear } from "solar-icon-set";
import { cn } from "../../../lib/utils";

export type StreamingSource = {
  name: string;
  domain?: string;
  href?: string;
};

export function StreamingAnswer({
  text,
  streaming = false,
  sources = [],
  sourcesLabel,
  followUps = [],
  followUpsLabel = "Follow-ups",
  onFollowUp,
  onDone,
  className = "",
}: {
  text: string;
  /** Reveal the answer word by word. Host should pass the growing string when driving a real stream. */
  streaming?: boolean;
  sources?: StreamingSource[];
  sourcesLabel?: string;
  followUps?: string[];
  followUpsLabel?: string;
  onFollowUp?: (text: string, index: number) => void;
  onDone?: () => void;
  className?: string;
}) {
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const [revealed, setRevealed] = useState(0);
  const [prevText, setPrevText] = useState(text);
  const [prevStreaming, setPrevStreaming] = useState(streaming);
  if (text !== prevText) {
    setPrevText(text);
    setRevealed(0);
  }
  if (streaming !== prevStreaming) {
    setPrevStreaming(streaming);
    setRevealed(0);
  }
  const count = streaming ? Math.min(revealed, words.length) : words.length;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const done = count >= words.length;

  const doneRef = useRef(false);
  useEffect(() => {
    if (!streaming) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    if (done) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    doneRef.current = false;
    const t = setTimeout(() => setRevealed((n) => n + 1), 55);
    return () => clearTimeout(t);
  }, [streaming, done, revealed, onDone]);

  return (
    <div className={cn("flex flex-col gap-3 text-sm", className)}>
      <p className="whitespace-pre-wrap text-[15px] leading-7 tracking-fg text-fg-black">
        {words.slice(0, count).map((word, i) => (
          <span key={`${word}-${i}`} className="forge-stream-in">
            {word}{" "}
          </span>
        ))}
        {streaming && !done && (
          <span className="forge-pulse-dot inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-fg-violet" />
        )}
      </p>

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

      {done && followUps.length > 0 && (
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
