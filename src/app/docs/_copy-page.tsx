"use client";

import { useState } from "react";
import { CopyLinear } from "@forge-ui-official/core/icons";

export function CopyPageButton() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function copy() {
    const article = document.querySelector("article");
    const text = article?.innerText?.trim() ?? "";
    if (!text) {
      setState("error");
      window.setTimeout(() => setState("idle"), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  const label = state === "done" ? "已复制" : state === "error" ? "复制失败" : "复制页面";

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="flex shrink-0 items-center gap-2 rounded-full bg-fg-grey-100 px-4 py-2 text-sm font-semibold text-fg-black transition-colors hover:bg-fg-grey-200"
    >
      <CopyLinear size={14} color="#71717A" />
      {label}
    </button>
  );
}
