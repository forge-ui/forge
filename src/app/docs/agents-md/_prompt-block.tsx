"use client";

import { useState } from "react";
import { CopyLinear, CheckCircleLinear } from "solar-icon-set";
import { cn } from "@forge-ui/react";

const COLLAPSED_MAX_HEIGHT = 320;
const COLLAPSE_THRESHOLD_LINES = 12;

export function PromptBlock({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  const lines = content.split("\n");
  const collapsible = lines.length > COLLAPSE_THRESHOLD_LINES;
  const showCollapsed = collapsible && !expanded;

  return (
    <div className="relative overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy prompt"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black transition-colors"
      >
        {copied ? (
          <CheckCircleLinear size={16} color="#09B96D" />
        ) : (
          <CopyLinear size={16} color="#71717A" />
        )}
      </button>

      <div
        className="relative overflow-hidden transition-[max-height] duration-200"
        style={{ maxHeight: showCollapsed ? COLLAPSED_MAX_HEIGHT : 20000 }}
      >
        <pre className="overflow-x-auto py-4 text-[13px] leading-relaxed text-fg-black">
          <code className="block font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-12 shrink-0 select-none pr-4 text-right text-fg-grey-400">
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre pr-6">
                  {line || "\u00A0"}
                </span>
              </div>
            ))}
          </code>
        </pre>

        {showCollapsed && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/85 to-transparent" />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-fg-black shadow-sm hover:bg-fg-grey-50 transition-colors"
            >
              展开代码
            </button>
          </>
        )}
      </div>

      {collapsible && expanded && (
        <div className="flex justify-center border-t border-fg-grey-200 bg-fg-grey-50 py-2.5">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className={cn(
              "rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-fg-black shadow-sm",
              "hover:bg-fg-grey-50 transition-colors",
            )}
          >
            收起代码
          </button>
        </div>
      )}
    </div>
  );
}
