"use client";

import { useState } from "react";
import { CopyLinear, CheckCircleLinear } from "solar-icon-set";

export function CodeBlock({
  code,
  lang,
}: {
  code: string;
  lang?: string;
}) {
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
    <div className="relative overflow-hidden rounded-lg border border-fg-grey-200 bg-white">
      {lang && (
        <div className="border-b border-fg-grey-200 bg-fg-grey-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-grey-700">
          {lang}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="复制"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-fg-grey-700 hover:bg-fg-grey-100 hover:text-fg-black transition-colors"
        style={lang ? { top: "34px" } : undefined}
      >
        {copied ? (
          <CheckCircleLinear size={14} color="#09B96D" />
        ) : (
          <CopyLinear size={14} color="#71717A" />
        )}
      </button>
      <pre className="overflow-x-auto px-4 py-3 pr-12 text-[13px] leading-relaxed text-fg-black">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
