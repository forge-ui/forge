// 公共 API 表 — HeroUI 风格：浅灰 header + attr 紫色 code + type/default 等宽小字 + description 正常字号
// 所有 case 页的 "API" SubSection 复用这个组件，传入 rows 数组即可。

export type ApiTableRow = {
  attr: string;
  type: string;
  defaultValue: string;
  description: string;
};

export function ApiTable({ rows }: { rows: ApiTableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-fg-grey-200 bg-white">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[26%]" />
          <col className="w-[12%]" />
          <col className="w-[34%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-fg-grey-200 bg-fg-grey-50">
            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">
              Attribute
            </th>
            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">
              Type
            </th>
            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">
              Default
            </th>
            <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-fg text-fg-grey-700">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.attr}
              className="border-b border-fg-grey-200 last:border-0"
            >
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[13px] text-fg-violet break-words">
                  {row.attr}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[12px] leading-relaxed text-fg-grey-900 break-words">
                  {row.type}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top">
                <code className="font-mono text-[12px] text-fg-grey-700">
                  {row.defaultValue}
                </code>
              </td>
              <td className="px-4 py-2.5 align-top text-fg-grey-900 break-words">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Import / Usage code block — 纯展示代码，不带 Preview 区
export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
      <pre className="overflow-x-auto px-4 py-3 text-[13px] leading-relaxed text-fg-black">
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// 行内 code snippet — 用在 description 里
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-fg-grey-100 px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  );
}
