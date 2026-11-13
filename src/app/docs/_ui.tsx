"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CheckCircleLinear, CopyLinear, InfoCircleLinear } from "@forge-ui-official/core/icons";

// ============================================================
// Docs page building blocks — only used under /docs
// ============================================================

/** Shows scrollbars only while the page scrolls, like an overlay scrollbar. */
export function ScrollbarAutoHide() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      document.documentElement.dataset.scrolling = "";
      clearTimeout(timer);
      timer = setTimeout(() => delete document.documentElement.dataset.scrolling, 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(timer);
      delete document.documentElement.dataset.scrolling;
    };
  }, []);
  return null;
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative flex gap-3 overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-grey-100/60 p-4 pl-5 before:absolute before:inset-y-3 before:left-1.5 before:w-0.5 before:rounded-full before:bg-fg-blue">
      <InfoCircleLinear size={18} className="mt-0.5 shrink-0 text-fg-blue" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="font-semibold text-fg-black">{title}</p>
        <div className="text-[15px] leading-7 text-fg-grey-900">{children}</div>
      </div>
    </div>
  );
}

export function Code({ children, label }: { children: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-fg-grey-200 bg-fg-grey-100/60">
      {label && <div className="border-b border-fg-grey-200 px-4 py-2.5 text-[13px] text-fg-grey-700">{label}</div>}
      <div className="relative">
        <pre className="docs-scroll overflow-x-auto py-3.5 pl-4 pr-12 font-mono text-[13px] leading-6 text-fg-black"><code>{children}</code></pre>
        <button
          type="button"
          aria-label={copied ? "已复制" : "复制代码"}
          onClick={() => navigator.clipboard.writeText(children).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined)}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-fg-grey-700 transition-colors hover:bg-fg-grey-200 hover:text-fg-black"
        >
          {copied ? <CheckCircleLinear size={16} /> : <CopyLinear size={16} />}
        </button>
      </div>
    </div>
  );
}

/** Numbered steps joined by a vertical rule. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="docs-steps ml-4 flex flex-col gap-10 border-l border-fg-grey-200 pl-8">{children}</ol>;
}

export function Step({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <li id={id} className="docs-step relative flex scroll-mt-24 flex-col gap-4">
      <h2 className="text-xl font-semibold leading-8 text-fg-black">{title}</h2>
      {children}
    </li>
  );
}
