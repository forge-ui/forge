"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ConfirmationDialog, type ConfirmationDialogColor } from "@forge-ui-official/core";
import {
  DangerBold,
  PlainBold,
  DangerTriangleBold,
  RocketBold,
  BellBold,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── 代码片段 ───

const CODE_IMPORT = `import { ConfirmationDialog } from "@forge-ui-official/core";`;

const CODE_USAGE = `<ConfirmationDialog
  color="red"
  layout="spread"
  title="确认删除此项？"
  description="此操作无法撤销"
  confirmLabel="删除"
  cancelLabel="取消"
  icon={<DangerBold size={32} color="currentColor" />}
/>`;

const CODE_LAYOUT = `<ConfirmationDialog layout="spread" ... />
<ConfirmationDialog layout="right" ... />`;

type ColorSpec = {
  color: ConfirmationDialogColor;
  semantic: string;
  token: string;
  swatch: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  iconName: string;
  icon: ReactNode;
};

const colorSpecs: ColorSpec[] = [
  {
    color: "red",
    semantic: "危险",
    token: "--fg-red",
    swatch: "bg-fg-red",
    title: "确认删除？",
    description: "此操作无法撤销",
    confirmLabel: "删除",
    cancelLabel: "取消",
    iconName: "DangerBold",
    icon: <DangerBold size={32} color="currentColor" />,
  },
  {
    color: "green",
    semantic: "成功",
    token: "--fg-green-500",
    swatch: "bg-fg-green-500",
    title: "发送消息？",
    description: "所有成员都能看到你的回复",
    confirmLabel: "发送",
    cancelLabel: "取消",
    iconName: "PlainBold",
    icon: <PlainBold size={32} color="currentColor" />,
  },
  {
    color: "yellow",
    semantic: "警示",
    token: "--fg-yellow",
    swatch: "bg-fg-yellow",
    title: "有未保存的修改",
    description: "离开前要保存修改吗？",
    confirmLabel: "保存修改",
    cancelLabel: "不保存",
    iconName: "DangerTriangleBold",
    icon: <DangerTriangleBold size={32} color="currentColor" />,
  },
  {
    color: "purple",
    semantic: "推广",
    token: "--fg-violet",
    swatch: "bg-fg-violet",
    title: "立即升级？",
    description: "每月 ¥88，解锁全部专业版功能",
    confirmLabel: "升级",
    cancelLabel: "取消",
    iconName: "RocketBold",
    icon: <RocketBold size={32} color="currentColor" />,
  },
  {
    color: "blue",
    semantic: "通知",
    token: "--fg-blue",
    swatch: "bg-fg-blue",
    title: "开启通知？",
    description: "重要动态发生时会收到提醒",
    confirmLabel: "开启",
    cancelLabel: "取消",
    iconName: "BellBold",
    icon: <BellBold size={32} color="currentColor" />,
  },
];

function colorPreviewCode(spec: ColorSpec) {
  return `<ConfirmationDialog
  color="${spec.color}"
  layout="spread"
  title="${spec.title}"
  description="${spec.description}"
  confirmLabel="${spec.confirmLabel}"
  cancelLabel="${spec.cancelLabel}"
  icon={<${spec.iconName} size={32} color="currentColor" />}
/>`;
}

function ColorSwatches() {
  const [color, setColor] = useState<ConfirmationDialogColor>("red");
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);
  const spec = colorSpecs.find((item) => item.color === color) ?? colorSpecs[0];
  const index = colorSpecs.indexOf(spec);

  function select(next: number) {
    const item = colorSpecs[next];
    if (!item) return;
    setColor(item.color);
    swatches.current[next]?.focus();
  }

  function onSwatchKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    if (key === "Home") {
      select(0);
      return;
    }
    if (key === "End") {
      select(colorSpecs.length - 1);
      return;
    }
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    select((index + delta + colorSpecs.length) % colorSpecs.length);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-2">
        <div
          role="radiogroup"
          aria-label="确认语义色"
          aria-orientation="horizontal"
          className="flex items-center"
          style={{ gap: 8 }}
          onKeyDown={onSwatchKeyDown}
        >
          {colorSpecs.map((item, itemIndex) => {
            const selected = item.color === color;
            return (
              <button
                key={item.color}
                ref={(node) => {
                  swatches.current[itemIndex] = node;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={item.semantic}
                title={item.semantic}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(itemIndex)}
                className={`shrink-0 cursor-pointer rounded-full border-0 p-0 ${item.swatch}`}
                style={{
                  width: 24,
                  height: 24,
                  outline: selected ? `2px solid var(${item.token})` : "none",
                  outlineOffset: selected ? 2 : 0,
                  transform: selected ? "scale(1.1)" : "none",
                  transition: "none",
                }}
              />
            );
          })}
        </div>
        <p className="text-sm text-fg-grey-700" aria-live="polite">
          当前语义：{spec.semantic}
        </p>
      </div>
      <PreviewBlock code={colorPreviewCode(spec)} minHeight={320}>
        <ConfirmationDialog
          color={spec.color}
          layout="spread"
          title={spec.title}
          description={spec.description}
          confirmLabel={spec.confirmLabel}
          cancelLabel={spec.cancelLabel}
          icon={spec.icon}
        />
      </PreviewBlock>
    </>
  );
}

const PROPS: ApiTableRow[] = [
  {
    attr: "color",
    type: "'red' | 'green' | 'yellow' | 'purple' | 'blue'",
    defaultValue: "'red'",
    description: "语义色，决定 icon 颜色与主按钮色。",
  },
  {
    attr: "layout",
    type: "'spread' | 'right'",
    defaultValue: "'spread'",
    description: "spread 居中左右铺开按钮，right 左对齐文字、按钮在右。",
  },
  {
    attr: "title",
    type: "string",
    defaultValue: "—",
    description: "对话框标题。",
  },
  {
    attr: "description",
    type: "string",
    defaultValue: "—",
    description: "描述文案。",
  },
  {
    attr: "confirmLabel",
    type: "string",
    defaultValue: "'Confirm'",
    description: "主按钮文案。",
  },
  {
    attr: "cancelLabel",
    type: "string",
    defaultValue: "'Cancel'",
    description: "次按钮文案。",
  },
  {
    attr: "icon",
    type: "ReactNode",
    defaultValue: "—",
    description: "左上方的 32px 图标，建议 @forge-ui-official/core/icons Bold 系列。",
  },
  {
    attr: "onConfirm",
    type: "() => void",
    defaultValue: "—",
    description: "主按钮点击回调。",
  },
  {
    attr: "onCancel",
    type: "() => void",
    defaultValue: "—",
    description: "次按钮点击回调。",
  },
];

export default function ModalCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="确认弹窗"
        hint="在删除、发送等重要操作前说明结果并请求确认。"
      />

      <Section
        title="ConfirmationDialog"
        description="在重要操作前说明影响，让用户确认或取消。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>title</InlineCode> / <InlineCode>description</InlineCode> / <InlineCode>icon</InlineCode>，color 决定主按钮色。
          </p>
          <PreviewBlock code={CODE_USAGE} minHeight={320}>
            <ConfirmationDialog
              color="red"
              layout="spread"
              title="确认删除此项？"
              description="删除后无法恢复，请确认是否继续。"
              confirmLabel="删除"
              cancelLabel="取消"
              icon={<DangerBold size={32} color="currentColor" />}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <ColorSwatches />
        </SubSection>

        <SubSection title="布局" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>spread</InlineCode> 居中对齐，按钮左右铺开；<InlineCode>right</InlineCode> 文案左对齐，按钮靠右。
          </p>
          <PreviewBlock code={CODE_LAYOUT} minHeight={320}>
            <div className="flex flex-wrap items-start justify-center gap-4">
              <ConfirmationDialog
                color="red"
                layout="spread"
                title="两端展开布局"
                description="内容居中，按钮铺满宽度"
                confirmLabel="删除"
                cancelLabel="取消"
                icon={<DangerBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="red"
                layout="right"
                title="右侧操作布局"
                description="文案左对齐，操作按钮位于右侧"
                confirmLabel="删除"
                cancelLabel="取消"
                icon={<DangerBold size={32} color="currentColor" />}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
