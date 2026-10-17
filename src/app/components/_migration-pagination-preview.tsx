"use client";

import { useState } from "react";
import { motion as animated, useReducedMotion } from "motion/react";
import { Button, ListGroup, ListItem, Pagination } from "@forge-ui-official/core";
import { FileTextLinear } from "@forge-ui-official/core/icons";

export function PaginationMotionPreview({ locale, color, motion }: {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
}) {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(20);
  const [narrow, setNarrow] = useState(false);
  const prefersReduced = useReducedMotion();
  const reduced = motion === "none" || prefersReduced;
  const zh = locale === "zh";
  const names = zh
    ? ["产品需求说明", "交互设计方案", "开发排期", "组件验收记录", "版本发布说明", "用户访谈纪要"]
    : ["Product requirements", "Interaction design", "Development schedule", "Component review", "Release notes", "User interviews"];

  return <div className="flex w-full min-w-0 flex-col gap-4">
    <div className="w-full" style={{ maxWidth: narrow ? 300 : 640 }}>
      <ListGroup title={zh ? "工作区文档" : "Workspace documents"} color={color} className="w-full" density="compact"
        subtitle={zh ? `共 ${total * 3} 份文档，每页 3 份` : `${total * 3} documents, 3 per page`}
        items={<>
          <animated.div key={page} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : .24, ease: [.22, 1, .36, 1] }} className="flex flex-col gap-4">
            {[0, 1, 2].map(index => {
              const number = (page - 1) * 3 + index + 1;
              return <ListItem key={number} title={`${names[(number - 1) % names.length]} ${String(Math.ceil(number / names.length)).padStart(2, "0")}`}
                subtitle={`DOC-${String(number).padStart(3, "0")}`}
                lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, color: "black", variant: "light", size: "md" }} />;
            })}
          </animated.div>
          <p role="status" className="text-xs leading-4 text-fg-grey-700">{zh ? `第 ${page} 页，共 ${total} 页` : `Page ${page} of ${total}`}</p>
        </>} />
      <div className="mt-4 w-full">
        <Pagination totalPages={total} currentPage={page} onPageChange={setPage} color={color} locale={locale} motion={motion} />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" color={color} variant="secondary" motion={motion} onClick={() => setPage(1)}>{zh ? "回到首页" : "First page"}</Button>
      <Button size="sm" color={color} variant="secondary" motion={motion} onClick={() => setPage(total)}>{zh ? "跳到末页" : "Last page"}</Button>
      <Button size="sm" color={color} variant="tertiary" motion={motion} aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>{zh ? narrow ? "恢复宽度" : "收窄预览" : narrow ? "Restore width" : "Narrow preview"}</Button>
      <Button size="sm" color={color} variant="tertiary" motion={motion} onClick={() => {
        const next = total === 20 ? 7 : 20;
        setTotal(next);
        setPage(value => Math.min(value, next));
      }}>{zh ? `切换为 ${total === 20 ? 7 : 20} 页` : `Show ${total === 20 ? 7 : 20} pages`}</Button>
    </div>
  </div>;
}
