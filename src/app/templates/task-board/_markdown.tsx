import { Fragment, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { JSONContent } from "@tiptap/react";

const PREFIX = "forge-rich-text:v1:";
const nodeTypes = new Set(["doc", "paragraph", "text", "heading", "bulletList", "orderedList", "listItem", "blockquote", "codeBlock", "hardBreak", "horizontalRule"]);
export function safeRichLink(value: string): string | null {
  const href = value.trim();
  return /^(https?:\/\/|mailto:)/i.test(href) ? href : null;
}
function cleanNode(node: JSONContent, depth = 0): JSONContent | null {
  if (!node || depth > 30 || !node.type || !nodeTypes.has(node.type)) return null;
  if (node.type === "text") return { type: "text", text: typeof node.text === "string" ? node.text : "", marks: node.marks?.filter(mark => ["bold", "italic", "strike", "code", "underline", "link"].includes(mark.type)).map(mark => mark.type === "link" ? { type: "link", attrs: { href: safeRichLink(String(mark.attrs?.href || "")) || "" } } : { type: mark.type }) };
  return { type: node.type, ...(node.type === "heading" ? { attrs: { level: Math.min(3, Math.max(1, Number(node.attrs?.level) || 2)) } } : {}), ...(node.type === "orderedList" ? { attrs: { start: Math.max(1, Number(node.attrs?.start) || 1) } } : {}), content: Array.isArray(node.content) ? node.content.flatMap(child => { const safe = cleanNode(child, depth + 1); return safe ? [safe] : []; }) : [] };
}
export function richTextDocument(value: string): JSONContent {
  if (value.startsWith(PREFIX)) {
    try { const parsed = cleanNode(JSON.parse(value.slice(PREFIX.length))); if (parsed?.type === "doc") return parsed; } catch { /* Preserve malformed legacy content as text. */ }
  }
  return { type: "doc", content: value.split("\n").map(text => ({ type: "paragraph", content: text ? [{ type: "text", text }] : [] })) };
}
export function richTextPlain(value: string): string {
  const visit = (node: JSONContent): string => node.type === "text" ? node.text || "" : node.type === "hardBreak" ? "\n" : (node.content || []).map(visit).join(["doc", "bulletList", "orderedList"].includes(node.type || "") ? "\n" : "");
  return value.startsWith(PREFIX) ? visit(richTextDocument(value)) : value;
}
function renderNode(node: JSONContent, key: number): ReactNode {
  const children = node.content?.map(renderNode);
  if (node.type === "text") {
    let text: ReactNode = node.text;
    for (const mark of node.marks || []) {
      if (mark.type === "bold") text = <strong>{text}</strong>;
      if (mark.type === "italic") text = <em>{text}</em>;
      if (mark.type === "strike") text = <s>{text}</s>;
      if (mark.type === "underline") text = <u>{text}</u>;
      if (mark.type === "code") text = <code>{text}</code>;
      if (mark.type === "link") { const href = safeRichLink(String(mark.attrs?.href || "")); if (href) text = <a href={href} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}>{text}</a>; }
    }
    return <Fragment key={key}>{text}</Fragment>;
  }
  switch (node.type) {
    case "paragraph": return <p key={key}>{children?.length ? children : <br />}</p>;
    case "heading": return node.attrs?.level === 1 ? <h2 key={key}>{children}</h2> : <h3 key={key}>{children}</h3>;
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key} start={node.attrs?.start}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock": return <pre key={key}><code>{children}</code></pre>;
    case "horizontalRule": return <hr key={key} />;
    case "hardBreak": return <br key={key} />;
    default: return <Fragment key={key}>{children}</Fragment>;
  }
}
export function MarkdownContent({ value }: { value: string }) {
  return <div className="task-rich-content">{value.startsWith(PREFIX) ? richTextDocument(value).content?.map(renderNode) : <ReactMarkdown skipHtml components={{ a: ({ href, children }) => { const safe = safeRichLink(href || ""); return safe ? <a href={safe} target="_blank" rel="noopener noreferrer" onClick={event => event.stopPropagation()}>{children}</a> : <>{children}</>; }, img: ({ alt }) => <>{alt}</> }}>{value}</ReactMarkdown>}</div>;
}

export const isLegacyRichText = (value: string) => value.startsWith(PREFIX);
