"use client";

import { useState } from "react";

export function InstallCommand({
  command,
  label,
}: {
  command: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className="mt-5 flex w-full max-w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-fg-grey-300 bg-white px-4 py-2 text-left text-xs text-fg-grey-900"
    >
      <span className="min-w-0 truncate font-mono">{command}</span>
      <span className="shrink-0 font-medium text-fg-blue">{copied ? "已复制" : "复制"}</span>
    </button>
  );
}
