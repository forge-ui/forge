"use client";

import { useEffect, useRef, useState } from "react";
import { Button, CommandSearch, Modal, SurfaceCard } from "@forge-ui-official/core";
import { AddCircleLinear, BellLinear, FileTextLinear, MagniferLinear } from "@forge-ui-official/core/icons";

const documents = [
  { id: "guide", zh: "设计规范", en: "Design guidelines", bodyZh: "组件使用统一的蓝、紫、黑主题。图标优先选用 Solar，正文保持清晰、简洁的层级。", bodyEn: "Components share blue, purple and black themes. Use Solar icons and clear, concise typography." },
  { id: "requirements", zh: "产品需求说明", en: "Product requirements", bodyZh: "本轮关注高频操作：快速找到文档、执行常用命令，并让结果在当前工作区内立即生效。", bodyEn: "This iteration focuses on finding documents, running common commands and applying results in the current workspace." },
  { id: "schedule", zh: "开发排期", en: "Development schedule", bodyZh: "先完成现有组件的交互融合，再逐项验收。通过验收后统一准备发布。", bodyEn: "Integrate interactions into existing components, review each result, then prepare a release." },
  { id: "review", zh: "组件验收记录", en: "Component review", bodyZh: "验收检查键盘操作、语言切换、三种主题，以及减少动态效果后的行为。", bodyEn: "Review keyboard navigation, language switching, all three themes and reduced motion." },
  { id: "research", zh: "用户访谈纪要", en: "User interviews", bodyZh: "用户希望常用操作保持直接：通过输入筛选，用方向键移动，再按回车确认。", bodyEn: "Users want direct actions: type to filter, move with the arrow keys and confirm with Enter." },
  { id: "release", zh: "版本发布说明", en: "Release notes", bodyZh: "本地验收通过后，再检查包内容、运行测试并发布版本。", bodyEn: "After local review, check package contents, run tests and publish the version." },
];

export function CommandMotionPreview({ locale, color, motion }: {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
}) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("guide");
  const [created, setCreated] = useState(0);
  const [muted, setMuted] = useState(false);
  const zh = locale === "zh";
  const selectedDocument = documents.find(item => item.id === selected);
  const title = selectedDocument ? (zh ? selectedDocument.zh : selectedDocument.en) : (zh ? `新文档 ${selected.split("-").at(-1)}` : `New document ${selected.split("-").at(-1)}`);
  const openPanel = () => { setQuery(""); setOpen(true); };

  useEffect(() => {
    if (open) root.current?.querySelector<HTMLInputElement>('[role="combobox"]')?.focus();
  }, [open]);

  useEffect(() => {
    const dialog = root.current?.querySelector("dialog");
    const restoreFocus = () => root.current?.querySelector<HTMLButtonElement>("[data-command-trigger]")?.focus();
    dialog?.addEventListener("close", restoreFocus);
    return () => dialog?.removeEventListener("close", restoreFocus);
  }, []);

  return <div ref={root} className="flex w-full min-w-0 flex-col gap-4" onKeyDown={event => {
    if (event.key === "Escape" && open && !event.defaultPrevented && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      if (open) setOpen(false); else openPanel();
    }
  }}>
    <div className="flex flex-wrap items-center gap-3">
      <Button data-command-trigger color={color} variant="secondary" size="sm" motion={motion}
        iconLeft={<MagniferLinear size={16} color="currentColor" />} onClick={openPanel}>
        {zh ? "搜索文档与命令" : "Search documents and commands"}
      </Button>
      <span className="text-xs leading-4 text-fg-grey-500">{zh ? "此示例内可按 ⌘ / Ctrl + K" : "Use ⌘ / Ctrl + K within this example"}</span>
    </div>
    <SurfaceCard className="w-full" padding="md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-fg-grey-500"><FileTextLinear size={20} color="currentColor" /><span className="text-xs">{zh ? "当前文档" : "Current document"}</span></div>
        <h3 className="text-base font-semibold leading-6 text-fg-black">{title}</h3>
        <p className="text-sm leading-6 text-fg-grey-700">{selectedDocument ? zh ? selectedDocument.bodyZh : selectedDocument.bodyEn : zh ? "这是一份刚创建的空白文档，可以从命令面板再次找到它。" : "This is a newly created document. Find it again in the command panel."}</p>
        <p role="status" className="text-xs leading-4 text-fg-grey-500">{zh ? `工作区共 ${documents.length + created} 份文档 · 消息提醒${muted ? "已暂停" : "已开启"}` : `${documents.length + created} workspace documents · Notifications ${muted ? "paused" : "enabled"}`}</p>
      </div>
    </SurfaceCard>
    <Modal open={open} onOpenChange={setOpen} title={zh ? "搜索文档与命令" : "Search documents and commands"} locale={locale} motion={motion}>
      <div className="flex min-w-0 flex-col gap-3">
        <CommandSearch locale={locale} color={color} motion={motion} autoFocus query={query} onQueryChange={setQuery}
          placeholder={zh ? "搜索文档或输入命令…" : "Search documents or type a command…"}
          items={[
            ...documents.map(item => ({ id: item.id, label: zh ? item.zh : item.en, group: zh ? "工作区文档" : "Workspace documents", keywords: [item.zh, item.en], icon: <FileTextLinear size={20} color="currentColor" /> })),
            ...Array.from({ length: created }, (_, index) => ({ id: `new-${index + 1}`, label: zh ? `新文档 ${index + 1}` : `New document ${index + 1}`, group: zh ? "工作区文档" : "Workspace documents", keywords: ["新文档", "new document"], icon: <FileTextLinear size={20} color="currentColor" /> })),
            { id: "create", label: zh ? "创建新文档" : "Create a document", group: zh ? "常用命令" : "Commands", keywords: ["新建", "创建", "create", "new"], shortcut: "Enter", icon: <AddCircleLinear size={20} color="currentColor" /> },
            { id: "mute", label: zh ? muted ? "开启消息提醒" : "暂停消息提醒" : muted ? "Enable notifications" : "Pause notifications", group: zh ? "常用命令" : "Commands", keywords: ["消息", "提醒", "notifications", "mute"], icon: <BellLinear size={20} color="currentColor" /> },
          ]}
          onSelect={item => {
            if (item.id === "create") { setCreated(value => value + 1); setSelected(`new-${created + 1}`); }
            else if (item.id === "mute") setMuted(value => !value);
            else setSelected(item.id);
            setOpen(false);
          }} />
        <p className="text-xs leading-5 text-fg-grey-500">{zh ? "方向键移动，Home / End 跳到首尾，Enter 执行，Esc 关闭。" : "Move with arrow keys, jump with Home / End, run with Enter, close with Esc."}</p>
      </div>
    </Modal>
  </div>;
}
