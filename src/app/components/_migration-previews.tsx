"use client";

import { useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { Button, FileTypeIcon } from "@forge-ui-official/core";
import { MetricNumberPreview } from "./_migration-number-preview";
import { SelectionToolbarPreview } from "./_migration-selection-preview";
import { EmptyExamplesPreview } from "./_migration-empty-preview";
import { ToggleMotionPreview } from "./_migration-toggle-preview";
import { AccordionMotionPreview } from "./_migration-accordion-preview";
import { PaginationMotionPreview } from "./_migration-pagination-preview";
import { TabsMotionPreview } from "./_migration-tabs-preview";
import { CommandMotionPreview } from "./_migration-command-preview";
import { SelectMotionPreview } from "./_migration-select-preview";

export type MigrationPreviewKind = "empty" | "hold" | "number" | "selection" | "toggle" | "accordion" | "pagination" | "tabs" | "command" | "select";

export function MigrationPreview({ kind, locale: localeProp, color: colorProp, motion: motionProp, hideControls = false }: {
  kind: MigrationPreviewKind;
  locale?: "zh" | "en";
  color?: "blue" | "purple" | "black";
  motion?: "auto" | "none";
  hideControls?: boolean;
}) {
  const [localLocale, setLocale] = useState<"zh" | "en">("zh");
  const [localColor, setColor] = useState<"blue" | "purple" | "black">("blue");
  const [localMotion, setMotion] = useState<"auto" | "none">("auto");
  const locale = localeProp ?? localLocale;
  const color = colorProp ?? localColor;
  const motion = motionProp ?? localMotion;
  const zh = locale === "zh";
  const props = { locale, color, motion };

  return (
    <MotionConfig reducedMotion={motion === "none" ? "always" : "user"}>
      <div data-migration-preview={kind} className="flex min-w-0 flex-col gap-6">
        {!hideControls && <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" color="black" onClick={() => setLocale(zh ? "en" : "zh")}>{zh ? "切换英文" : "中文"}</Button>
          {(["blue", "purple", "black"] as const).map((item, index) => (
            <Button key={item} size="sm" color={item} variant={color === item ? "primary" : "tertiary"} aria-pressed={color === item} onClick={() => setColor(item)}>
              {(zh ? ["蓝", "紫", "黑"] : ["Blue", "Purple", "Black"])[index]}
            </Button>
          ))}
          <Button size="sm" color="black" variant="tertiary" aria-pressed={motion === "none"} onClick={() => setMotion(motion === "auto" ? "none" : "auto")}>
            {motion === "auto" ? (zh ? "动效：跟随系统" : "Motion: system") : (zh ? "动效：关闭" : "Motion: off")}
          </Button>
        </div>}
        {kind === "tabs" && <TabsMotionPreview {...props} />}
        {kind === "command" && <CommandMotionPreview {...props} />}
        {kind === "select" && <SelectMotionPreview {...props} />}
        {kind === "toggle" && <ToggleMotionPreview {...props} />}
        {kind === "accordion" && <AccordionMotionPreview {...props} />}
        {kind === "pagination" && <PaginationMotionPreview {...props} />}
        {kind === "number" && <MetricNumberPreview {...props} />}
        {kind === "selection" && <SelectionToolbarPreview {...props} />}
        {kind === "empty" && <EmptyExamplesPreview {...props} />}
        {kind === "hold" && <HoldDeletePreview {...props} />}
      </div>
    </MotionConfig>
  );
}

function HoldDeletePreview({ locale, color, motion }: { locale: "zh" | "en"; color: "blue" | "purple" | "black"; motion: "auto" | "none" }) {
  const [deleted, setDeleted] = useState(false);
  const systemReduced = useReducedMotion();
  const reduced = motion === "none" || systemReduced;
  const zh = locale === "zh";

  return (
    <div className="mx-auto flex min-h-[230px] w-full max-w-80 flex-col items-center justify-center gap-6">
      <div
        aria-hidden={deleted || undefined}
        className="flex w-full max-w-[268px] origin-bottom items-center gap-3.5 rounded-2xl border border-fg-grey-200 bg-fg-white px-4 py-3.5 transition-[transform,opacity,filter] duration-700 motion-reduce:transition-none"
        style={{ transform: deleted && !reduced ? "translateY(18px) scale(.55) rotate(-6deg)" : "none", opacity: deleted ? 0 : 1, filter: deleted && !reduced ? "blur(6px)" : "none", transitionDuration: reduced ? "0s" : undefined }}
      >
        <FileTypeIcon fileName="brand-concept.fig" className="h-12 w-10" />
        <span>
          <span className="block text-sm font-semibold leading-5 text-fg-black">{zh ? "品牌方案 v3.fig" : "Brand concept v3.fig"}</span>
          <span className="mt-1 block text-xs font-medium leading-4.5 text-fg-grey-500">{zh ? "48.2 MB · 昨天编辑" : "48.2 MB · Edited yesterday"}</span>
        </span>
      </div>
      <Button variant="hold" color={color} locale={locale} motion={motion} confirmed={deleted} onConfirm={() => setDeleted(true)} onUndo={() => setDeleted(false)} holdLabels={{ done: zh ? "文件已删除" : "File deleted" }} />
      <p className="text-xs leading-4.5 text-fg-grey-600">{zh ? "按住 1.2 秒删除，提前松开即可取消。" : "Hold for 1.2 seconds to delete; release early to cancel."}</p>
    </div>
  );
}
