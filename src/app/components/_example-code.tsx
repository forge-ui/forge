"use client";

import { useState } from "react";
import { CodeBlock } from "./_api-table";
import sources from "./_example-sources.json";

type SourcePath = keyof typeof sources;
/** The exact source of the running example, including its local helpers. */
export function ExampleCode({ files }: { files: string[] }) {
  const available = files.filter((file): file is SourcePath => file in sources);
  const [selected, setSelected] = useState(available[0]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  if (!selected) return null;
  return <details className="min-w-0 rounded-xl border border-fg-grey-200 bg-fg-grey-50">
    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-fg-black">查看示例代码</summary>
    <div className="flex min-w-0 flex-col gap-3 px-4 pb-4">
      <p className="text-xs leading-5 text-fg-grey-700">以下为当前演示的完整源码。复用组合示例时，请同时保留辅助文件与样式文件，并按项目目录调整相对导入路径。</p>
      <label className="flex flex-wrap items-center gap-2 text-xs text-fg-grey-700">源文件
        <select className="min-w-0 max-w-full rounded-lg border border-fg-grey-200 bg-fg-white px-2 py-1.5 text-fg-black" value={selected} onChange={event => { setSelected(event.target.value as SourcePath); setCopied(false); setError(false); }}>
          {available.map(file => <option key={file} value={file}>{file.replace("src/app/", "")}</option>)}
        </select>
        <button type="button" className="rounded-lg px-2 py-1.5 font-semibold hover:bg-fg-grey-100" onClick={async () => {
          try { await navigator.clipboard.writeText(sources[selected]); setCopied(true); setError(false); }
          catch { setCopied(false); setError(true); }
        }}>{copied ? "已复制" : "复制代码"}</button>
        <span role="status">{error ? "复制失败，请选中代码手动复制。" : copied ? "代码已复制。" : ""}</span>
      </label>
      <div className="max-h-96 overflow-auto"><CodeBlock code={sources[selected]} /></div>
    </div>
  </details>;
}
