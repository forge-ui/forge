"use client";

import { Tooltip, TooltipBubble, TooltipAnchor } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";
import {
  InfoCircleBoldDuotone,
  DangerCircleBoldDuotone,
} from "@forge-ui-official/core/icons";

const SHORT = "示例文本";
const LONG = "这里展示详细说明，帮助你了解当前操作。";

// ─── 代码片段 ───

const CODE_IMPORT = `import { Tooltip, TooltipBubble, TooltipAnchor } from "@forge-ui-official/core";`;

const CODE_BUBBLE_USAGE = `<TooltipBubble content="示例文本" position="top" size="sm" />
<TooltipBubble content="查看详细说明" position="top" size="lg" />`;

const CODE_BUBBLE_POSITION = `<TooltipBubble content="示例文本" position="top" />
<TooltipBubble content="示例文本" position="bottom" />
<TooltipBubble content="示例文本" position="left" />
<TooltipBubble content="示例文本" position="right" />`;

const CODE_BUBBLE_SIZE = `<TooltipBubble content="示例文本" size="sm" />
<TooltipBubble content="这里展示详细说明，帮助你了解当前操作。" size="lg" />`;

const CODE_ANCHOR_USAGE = `<TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="idle" />
<TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="active" />`;

const CODE_TOOLTIP_USAGE = `<Tooltip content="示例文本" position="top" size="lg" open={true}>
  <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="active" />
</Tooltip>`;

const BUBBLE_PROPS: ApiTableRow[] = [
  {
    attr: "content",
    type: "string",
    defaultValue: "—",
    description: "气泡内显示的文字。",
  },
  {
    attr: "position",
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'top'",
    description: "气泡方向，决定箭头位置。",
  },
  {
    attr: "size",
    type: "'sm' | 'lg'",
    defaultValue: "'sm'",
    description: "sm 为单行，lg 为 w-44 多行。",
  },
];

const ANCHOR_PROPS: ApiTableRow[] = [
  {
    attr: "icon",
    type: "ReactNode",
    defaultValue: "—",
    description: "触发 icon，推荐 @forge-ui-official/core/icons 14px。",
  },
  {
    attr: "state",
    type: "'idle' | 'active'",
    defaultValue: "'idle'",
    description: "idle 灰色 / active 紫色。",
  },
];

const TOOLTIP_PROPS: ApiTableRow[] = [
  {
    attr: "children",
    type: "ReactNode",
    defaultValue: "—",
    description: "触发元素，一般为 TooltipAnchor。",
  },
  {
    attr: "content",
    type: "string",
    defaultValue: "—",
    description: "气泡文案。",
  },
  {
    attr: "position",
    type: "'top' | 'bottom' | 'left' | 'right'",
    defaultValue: "'top'",
    description: "气泡方向。",
  },
  {
    attr: "size",
    type: "'sm' | 'lg'",
    defaultValue: "'sm'",
    description: "气泡尺寸。",
  },
  {
    attr: "open",
    type: "boolean",
    defaultValue: "undefined",
    description: "受控显示；不传则 hover/focus 触发。",
  },
];

export default function TooltipCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="提示气泡"
        hint="在悬停或聚焦时补充简短说明，帮助用户理解操作。"
      />

      <Section
        title="TooltipBubble"
        description="展示简短说明气泡，可单独预览方向和尺寸。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>content</InlineCode> 与 <InlineCode>position</InlineCode>，<InlineCode>size</InlineCode> 控制单行或多行。
          </p>
          <PreviewBlock code={CODE_BUBBLE_USAGE} minHeight={200}>
            <div className="flex items-center gap-10">
              <TooltipBubble content={SHORT} position="top" size="sm" />
              <TooltipBubble content={LONG} position="top" size="lg" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="位置" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            4 个方向：<InlineCode>top</InlineCode> / <InlineCode>bottom</InlineCode> / <InlineCode>left</InlineCode> / <InlineCode>right</InlineCode>。
          </p>
          <PreviewBlock code={CODE_BUBBLE_POSITION} minHeight={240}>
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              <TooltipBubble content={SHORT} position="top" size="sm" />
              <TooltipBubble content={SHORT} position="bottom" size="sm" />
              <TooltipBubble content={SHORT} position="left" size="sm" />
              <TooltipBubble content={SHORT} position="right" size="sm" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="尺寸" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> 单行、<InlineCode>lg</InlineCode> w-44 多行自动换行。
          </p>
          <PreviewBlock code={CODE_BUBBLE_SIZE} minHeight={200}>
            <div className="flex items-center gap-10">
              <TooltipBubble content={SHORT} position="top" size="sm" />
              <TooltipBubble content={LONG} position="top" size="lg" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={BUBBLE_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="TooltipAnchor"
        description="用小图标作为提示气泡的触发入口。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            通过 <InlineCode>icon</InlineCode> 传入 14px 的图标节点，常用 Info / Danger 两类。
          </p>
          <PreviewBlock code={CODE_ANCHOR_USAGE} minHeight={140}>
            <div className="flex items-center gap-6">
              <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="idle" />
              <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="active" />
              <TooltipAnchor icon={<DangerCircleBoldDuotone size={14} />} state="idle" />
              <TooltipAnchor icon={<DangerCircleBoldDuotone size={14} />} state="active" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ANCHOR_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="Tooltip"
        description="悬停或聚焦时显示说明，也可由外部控制显示状态。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            下面示例把 <InlineCode>open</InlineCode> 固定为 true 便于截图；真实用法省略 open 即可走 hover 逻辑。
          </p>
          <PreviewBlock code={CODE_TOOLTIP_USAGE} minHeight={260}>
            <div className="grid grid-cols-2 gap-x-24 gap-y-20 py-8">
              {(["top", "right", "bottom", "left"] as const).map((pos, i) => (
                <Tooltip key={pos} content={LONG} position={pos} size="lg" open>
                  <TooltipAnchor
                    icon={
                      i < 2 ? (
                        <InfoCircleBoldDuotone size={14} />
                      ) : (
                        <DangerCircleBoldDuotone size={14} />
                      )
                    }
                    state="active"
                  />
                </Tooltip>
              ))}
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={TOOLTIP_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
