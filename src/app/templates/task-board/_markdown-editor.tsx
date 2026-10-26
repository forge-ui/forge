"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { Button, IconButton, TextField } from "@forge-ui-official/core";
import { CodeLinear, LinkLinear } from "@forge-ui-official/core/icons";
import { richTextDocument, safeRichLink, isLegacyRichText } from "./_markdown";

export function MarkdownEditor({ value, onChange, label = "任务描述", autoFocus = false, compact = false }: { value: string; onChange: (value: string) => void; label?: string; autoFocus?: boolean; compact?: boolean }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [linkError, setLinkError] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: { openOnClick: false }, underline: false }), Markdown],
    content: isLegacyRichText(value) ? richTextDocument(value) : value, contentType: isLegacyRichText(value) ? "json" : "markdown", immediatelyRender: false,
    autofocus: autoFocus ? "end" : false,
    editorProps: { attributes: { role: "textbox", "aria-label": label, "aria-multiline": "true", "data-placeholder": "添加描述…" } },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getMarkdown()),
  });
  const state = useEditorState({ editor, selector: ({ editor }) => editor ? { bold: editor.isActive("bold"), italic: editor.isActive("italic"), bullet: editor.isActive("bulletList"), ordered: editor.isActive("orderedList"), quote: editor.isActive("blockquote"), code: editor.isActive("codeBlock"), link: editor.isActive("link"), undo: editor.can().undo(), redo: editor.can().redo() } : null });
  if (!editor) return <div className="task-rich-editor-loading" aria-label={label}>加载编辑器…</div>;
  const applyLink = () => { const href = safeRichLink(url); if (!href) { setLinkError(true); return; } const chain = editor.chain().focus(); if (editor.state.selection.empty && !editor.isActive("link")) chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run(); else chain.extendMarkRange("link").setLink({ href }).run(); setLinkOpen(false);  };
  const tool = (name: string, text: React.ReactNode, action: () => void, active = false, disabled = false) => <IconButton key={name} type="button" color="black" variant="ghost" shape="square" size="sm" aria-label={name} title={name} aria-pressed={active} disabled={disabled} onMouseDown={event => event.preventDefault()} onClick={action}>{text}</IconButton>;
  return <div className={`task-rich-editor${compact ? " is-compact" : ""}`}>
    <EditorContent editor={editor} />
    <BubbleMenu editor={editor} className="task-markdown-bubble" appendTo={() => editor.view.dom.closest<HTMLElement>(".forge-modal") || document.body} options={{ placement: "top", offset: 8, strategy: "fixed" }} shouldShow={({ state, editor }) => linkOpen || (!state.selection.empty && editor.isFocused)}>
    <div className="task-markdown-selection">
    <div className="task-rich-toolbar" role="toolbar" aria-label={`${label}格式`}>
      {tool("加粗", <strong>B</strong>, () => { editor.chain().focus().toggleBold().run(); }, state?.bold)}
      {tool("斜体", <em>I</em>, () => { editor.chain().focus().toggleItalic().run(); }, state?.italic)}
      {tool("代码", <CodeLinear size={18} />, () => { editor.chain().focus().toggleCode().run(); }, editor.isActive("code"))}
      {tool("链接", <LinkLinear size={18} />, () => { setUrl(editor.getAttributes("link").href || ""); setLinkError(false); setLinkOpen(current => !current); }, state?.link)}
    </div>
    {linkOpen && <div className="task-rich-link" role="group" aria-label="设置链接">
      <TextField color="blue" aria-label="链接地址" placeholder="https:// 或 mailto:" value={url} onChange={value => { setUrl(value); setLinkError(false); }} autoFocus onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); event.stopPropagation(); applyLink(); } if (event.key === "Escape") { event.stopPropagation(); setLinkOpen(false); editor.commands.focus(); } }} />
      <Button size="sm" color="blue" onClick={() => { applyLink();}}>应用</Button>
      <Button size="sm" color="grey" variant="secondary" onClick={() => { setLinkOpen(false); editor.commands.focus(); }}>取消</Button>
      {state?.link && <Button size="sm" color="black" variant="tertiary" onClick={() => { editor.chain().focus().extendMarkRange("link").unsetLink().run(); setLinkOpen(false); }}>移除链接</Button>}
      {linkError && <span role="alert">请输入有效的网页或邮箱链接</span>}
    </div>}
    </div>
    </BubbleMenu>
    <p className="task-markdown-hint">支持 Markdown</p>
  </div>;
}
