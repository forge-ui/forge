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
      className="mt-2 max-w-full overflow-x-auto whitespace-nowrap px-2 text-xs text-fg-grey-800 hover:text-fg-black"
    >
      {copied ? "已复制" : command}
    </button>
  );
}
