import type { ApiTableRow } from "./_api-table";
import { chatInputApiDescriptions } from "./_chat-input-api-descriptions";
import data from "./_agent-api-data.json";

/** Generated from the public core entry by audit-public-api-comparison.mjs. */
export function CompleteApiReference({ name, descriptions = [] }: { name: keyof typeof data; descriptions?: ApiTableRow[] }) {
  const explain = Object.fromEntries(descriptions.flatMap(row => row.attr.split("/").map(attr => [attr.trim(), row.description])));
  const hasDescriptions = name === "ChatInputBar" || descriptions.length > 0;
  return <div className="flex flex-col gap-3">
    <p className="text-sm leading-6 text-fg-grey-700">以下列出全部参数。“未设置”表示组件未在参数解构处提供默认值；可选参数可按需省略。具体交互说明见上方用法。</p>
    <div className="overflow-x-auto rounded-xl border border-fg-grey-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-fg-grey-50 text-fg-grey-700"><tr>{["参数", "类型", "必填", "源码默认值", ...(hasDescriptions ? ["说明"] : [])].map(label => <th key={label} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead>
        <tbody>{data[name].props.map(prop => <tr key={prop.name} className="border-t border-fg-grey-200">
          <td className="px-4 py-3 align-top"><code className="text-fg-blue">{prop.name}</code></td>
          <td className="max-w-xl break-words px-4 py-3 align-top"><code>{prop.type}</code></td>
          <td className="px-4 py-3 align-top">{prop.optional ? "否" : "是"}</td>
          <td className="px-4 py-3 align-top"><code>{prop.defaultValue ?? "未设置"}</code></td>
          {hasDescriptions && <td className="min-w-56 px-4 py-3 align-top">{name === "ChatInputBar" ? chatInputApiDescriptions[prop.name] : explain[prop.name] ?? "—"}</td>}
        </tr>)}</tbody>
      </table>
    </div>
    {data[name].types.length > 0 && <details className="rounded-xl border border-fg-grey-200 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-fg-black">查看参数与回调的数据结构</summary>
      <div className="mt-4 flex flex-col gap-5">{data[name].types.map(type => <div key={type.name} className="overflow-x-auto">
        <h4 className="mb-2 text-sm font-semibold text-fg-black">{type.name}</h4>
        {type.definition && <code className="block break-words text-sm">{type.definition}</code>}
        {type.fields.length > 0 && <table className="w-full text-left text-sm"><thead className="bg-fg-grey-50"><tr>{["字段", "类型", "必填"].map(label => <th key={label} className="px-3 py-2 font-semibold">{label}</th>)}</tr></thead>
          <tbody>{type.fields.map(field => <tr key={field.name} className="border-t border-fg-grey-200"><td className="px-3 py-2 align-top"><code>{field.name}</code></td><td className="max-w-xl break-words px-3 py-2 align-top"><code>{field.type}</code></td><td className="px-3 py-2 align-top">{field.optional ? "否" : "是"}</td></tr>)}</tbody>
        </table>}
      </div>)}</div>
    </details>}
  </div>;
}
