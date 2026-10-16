"use client";

import { useState } from "react";
import { Button } from "@forge-ui-official/core";

export function InstallCommand({ command, label }: { command: string; label: string }) {
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
    <div className="flex w-full min-w-0 max-w-xl items-center gap-2 rounded-2xl bg-white py-1.5 pl-4 pr-1.5 home-shadow outline outline-1 outline-fg-grey-200">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2 font-mono text-[13px] leading-5 text-fg-black">
        {command}
      </code>
      <Button size="sm" color="black" onClick={copy} aria-label={label}>
        {copied ? "已复制" : "复制"}
      </Button>
    </div>
  );
}
