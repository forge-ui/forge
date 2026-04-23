"use client";

// PreviewBlock — HeroUI 风格：Preview 上 + Code 下折叠
// 不是 tab 切换，两个区并存在一个卡片里

import { useState, type ReactNode } from "react";
import { CopyLinear, CheckCircleLinear } from "solar-icon-set";
import { cn } from "@forge-ui/react";

const COLLAPSED_HEIGHT = 180;
const COLLAPSIBLE_MIN_LINES = 7;

export function PreviewBlock({
  children,
  code,
  className,
  minHeight = 160,
}: {
  children: ReactNode;
  code: string;
  className?: string;
  minHeight?: number;
}) {
  const lines = code.split("\n");
  const collapsible = lines.length >= COLLAPSIBLE_MIN_LINES;
  const [expanded, setExpanded] = useState(!collapsible);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-fg-grey-200 bg-white",
        className,
      )}
    >
      {/* Preview 区：白底，组件居中 */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 bg-white px-6 py-10"
        style={{ minHeight: minHeight }}
      >
        {children}
      </div>

      {/* Code 区：浅灰底 + 默认折叠 */}
      <div className="relative border-t border-fg-grey-200 bg-fg-grey-50">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="复制代码"
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-md text-fg-grey-700 transition-colors hover:bg-fg-grey-100 hover:text-fg-black"
        >
          {copied ? (
            <CheckCircleLinear size={14} color="#09B96D" />
          ) : (
            <CopyLinear size={14} color="#71717A" />
          )}
        </button>

        <div
          className="relative overflow-hidden transition-[max-height] duration-200"
          style={{ maxHeight: expanded ? 10000 : COLLAPSED_HEIGHT }}
        >
          <pre className="overflow-x-auto py-4 pr-10 text-[13px] leading-relaxed text-fg-black">
            <code className="block font-mono">
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-12 shrink-0 select-none pr-4 text-right text-fg-grey-400">
                    {i + 1}
                  </span>
                  <span className="flex-1 whitespace-pre">
                    {line || "\u00A0"}
                  </span>
                </div>
              ))}
            </code>
          </pre>

          {collapsible && !expanded && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-fg-grey-50 via-fg-grey-50/85 to-transparent" />
          )}

          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-fg-black shadow-sm transition-colors hover:bg-fg-grey-50"
            >
              {expanded ? "收起代码" : "展开代码"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
