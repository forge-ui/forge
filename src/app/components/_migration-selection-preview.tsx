"use client";

import { useState } from "react";
import { AnimatePresence, motion as animated, useReducedMotion, useIsPresent } from "motion/react";
import { Button, Checkbox, ListGroup, ListItem, Toolbar } from "@forge-ui-official/core";
import { FileTextLinear } from "@forge-ui-official/core/icons";

export function SelectionToolbarPreview({ locale = "zh", color = "blue", motion = "auto" }: {
  locale?: "zh" | "en";
  color?: "blue" | "purple" | "black";
  motion?: "auto" | "none";
}) {
  const [items, setItems] = useState([0, 1, 2]);
  const [selected, setSelected] = useState<number[]>([]);
  const [archived, setArchived] = useState<number[]>([]);
  const prefersReduced = useReducedMotion();
  const reduced = motion === "none" || prefersReduced;
  const zh = locale === "zh";
  const names = zh ? ["产品需求文档", "设计规范", "发布计划"] : ["Product requirements", "Design guidelines", "Release plan"];
  const allSelected = items.length > 0 && selected.length === items.length;

  function archive() {
    if (!selected.length) return;
    setArchived(previous => [...previous, ...selected]);
    setItems(previous => previous.filter(id => !selected.includes(id)));
    setSelected([]);
  }

  function undo() {
    setItems(previous => [...previous, ...archived].sort((a, b) => a - b));
    setArchived([]);
    setSelected([]);
  }

  return <div className="w-full max-w-xl">
    <ListGroup title={zh ? "工作区文档" : "Workspace documents"} color={color} className="w-full"
      subtitle={zh ? "选择文档，集中处理归档操作。" : "Select documents to archive them together."}
      action={<span className="text-xs font-medium leading-4 text-fg-grey-700">{zh ? `${items.length} 个文件` : `${items.length} files`}</span>}
      items={<>
        <div className="flex items-center gap-3 text-xs font-medium leading-4 text-fg-grey-700">
          <Checkbox checked={allSelected}
            disabled={items.length === 0} color={color} motion={motion}
            aria-label={zh ? "全选文档" : "Select all documents"}
            onChange={checked => setSelected(checked ? [...items] : [])} />
          <span>{zh ? "全选" : "Select all"}</span>
        </div>
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map(id => <SelectionDocumentRow key={id} name={names[id]} locale={locale} color={color} motion={motion}
              reduced={Boolean(reduced)} checked={selected.includes(id)}
              onChange={checked => setSelected(previous => checked ? [...previous, id] : previous.filter(value => value !== id))} />)}
          </AnimatePresence>
          {items.length === 0 && <p className="py-4 text-sm leading-5 text-fg-grey-700">{zh ? "文件已全部归档" : "All files archived"}</p>}
        </div>
        <div className="min-h-[60px]">
          <Toolbar locale={locale} motion={motion}
            left={<span className="py-2 text-xs leading-4 text-fg-grey-700">{zh ? "选择后可批量归档" : "Select files to archive"}</span>}
            right={<Button size="sm" color={color} variant="tertiary" motion={motion} disabled={items.length === 0}
              onClick={() => setSelected([...items])}>{zh ? "全选" : "Select all"}</Button>}
            selection={{ count: selected.length, onClear: () => setSelected([]), actions:
              <Button size="sm" color={color} variant={color === "black" ? "secondary" : "primary"} motion={motion}
                onClick={archive}>{zh ? "归档" : "Archive"}</Button> }} />
        </div>
        {archived.length > 0 && <div className="flex items-center justify-between gap-3 text-xs leading-4 text-fg-grey-700">
          <span role="status">{zh ? `已归档 ${archived.length} 个文件` : `${archived.length} files archived`}</span>
          <Button size="sm" color={color} variant="tertiary" motion={motion} onClick={undo}>{zh ? "撤销归档" : "Undo archive"}</Button>
        </div>}
      </>} />
  </div>;
}

function SelectionDocumentRow({ name, locale, color, motion, reduced, checked, onChange }: {
  name: string; locale: "zh" | "en"; color: "blue" | "purple" | "black";
  motion: "auto" | "none"; reduced: boolean; checked: boolean; onChange: (checked: boolean) => void;
}) {
  const present = useIsPresent();
  const zh = locale === "zh";
  return <animated.div layout={!reduced} inert={!present || undefined} aria-hidden={!present || undefined}
    initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: reduced ? 0 : 18, height: 0 }}
    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
    className="flex items-center gap-3">
    <Checkbox color={color} motion={motion} checked={checked} disabled={!present}
      aria-label={`${zh ? "选择" : "Select"} ${name}`} onChange={onChange} />
    <ListItem className="min-w-0" title={name} subtitle={zh ? "工作区文档" : "Workspace document"}
      lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, color: "black", variant: "light", size: "md" }} />
  </animated.div>;
}
