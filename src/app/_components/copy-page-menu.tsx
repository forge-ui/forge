"use client";

import { useEffect, useRef, useState } from "react";
import { DropdownPanel, MenuItem } from "@forge-ui-official/core";
import {
  AltArrowDownLinear,
  ArrowRightUpLinear,
  CopyLinear,
  DocumentTextLinear,
  StarsLinear,
} from "@forge-ui-official/core/icons";

const SITE = "https://forgeui.org";

type Status = { key: "prompt" | "page"; result: "done" | "error" } | null;

function pageUrl() {
  return SITE + window.location.pathname;
}

function setupPrompt(title: string) {
  return [
    "在当前项目里用 Forge UI（@forge-ui-official/core）实现界面。",
    `1. 先读 ${SITE}/llms.txt 和这一页：${pageUrl()}（${title}）。`,
    `2. 运行 curl -fsSL ${SITE}/setup.sh | bash 安装 Forge Skill 和只读 MCP 服务（${SITE}/api/mcp）。`,
    "3. 写页面前先用 MCP 的 recommend 找最接近的模板和页面组件，写完用 check_code 检查。",
    "4. 组件一律从 @forge-ui-official/core 引入，颜色、字号、间距走 Forge token，不要手写已有的基础组件。",
  ].join("\n");
}

function askPrompt() {
  return `阅读 ${pageUrl()}.md ，它是 Forge UI 文档的 Markdown 版本。我接下来会问这一页的问题，请按页面内容回答。`;
}

export function CopyPageMenu({ title }: { title: string }) {
  const [status, setStatus] = useState<Status>(null);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  async function pageMarkdown() {
    const response = await fetch(window.location.pathname.replace(/\/$/, "") + ".md");
    if (response.ok) return response.text();
    return document.querySelector("article")?.innerText.trim() ?? "";
  }

  async function copy(key: "prompt" | "page", text: () => string | Promise<string>) {
    setOpen(false);
    try {
      // Safari only allows clipboard writes started synchronously in the click; ClipboardItem accepts the pending text.
      const pending = Promise.resolve(text()).then((value) => {
        if (!value) throw new Error("empty");
        return value;
      });
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": pending.then((value) => new Blob([value], { type: "text/plain" })) })]);
      } else {
        await navigator.clipboard.writeText(await pending);
      }
      setStatus({ key, result: "done" });
    } catch {
      setStatus({ key, result: "error" });
    }
    window.setTimeout(() => setStatus(null), 2000);
  }

  function openIn(base: string) {
    setOpen(false);
    window.open(base + encodeURIComponent(askPrompt()), "_blank", "noopener,noreferrer");
  }

  const label = (key: "prompt" | "page", idle: string) =>
    status?.key === key ? (status.result === "done" ? "已复制" : "复制失败") : idle;
  const pill = "flex h-9 shrink-0 items-center gap-2 bg-fg-grey-100 px-4 text-sm font-semibold text-fg-black transition-colors hover:bg-fg-grey-200";

  return (
    <div ref={root} className="relative flex shrink-0 items-center gap-2" aria-live="polite">
      <button type="button" onClick={() => copy("prompt", () => setupPrompt(title))} className={`${pill} rounded-full`}>
        <StarsLinear size={14} color="currentColor" />
        {label("prompt", "复制提示词")}
      </button>
      <div className="flex items-center gap-px">
        <button
          type="button"
          onClick={() => copy("page", pageMarkdown)}
          className={`${pill} rounded-l-full`}
        >
          <CopyLinear size={14} color="currentColor" />
          {label("page", "复制页面")}
        </button>
        <button
          type="button"
          aria-label="更多复制方式"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
          className={`${pill} rounded-r-full px-3`}
        >
          <AltArrowDownLinear size={14} color="currentColor" />
        </button>
      </div>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-2">
          <DropdownPanel width="w-56">
            <MenuItem className="w-full" lead={{ kind: "icon", icon: <ArrowRightUpLinear size={18} color="currentColor" /> }} label="在 Claude 中打开" onClick={() => openIn("https://claude.ai/new?q=")} />
            <MenuItem className="w-full" lead={{ kind: "icon", icon: <ArrowRightUpLinear size={18} color="currentColor" /> }} label="在 ChatGPT 中打开" onClick={() => openIn("https://chatgpt.com/?q=")} />
            <MenuItem className="w-full" lead={{ kind: "icon", icon: <DocumentTextLinear size={18} color="currentColor" /> }} label="查看 Markdown" onClick={() => { setOpen(false); window.open(window.location.pathname.replace(/\/$/, "") + ".md", "_blank", "noopener"); }} />
            <MenuItem className="w-full" lead={{ kind: "icon", icon: <DocumentTextLinear size={18} color="currentColor" /> }} label="查看 llms.txt" onClick={() => { setOpen(false); window.open("/llms.txt", "_blank", "noopener"); }} />
          </DropdownPanel>
        </div>
      )}
    </div>
  );
}
