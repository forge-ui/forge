"use client";

import { Tooltip, TooltipBubble, TooltipAnchor } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";
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
        hint="悬停或聚焦时补一句说明。方向和单行、多行只定一次，入口图标再套上气泡。"
      />

      <Section title="用法" description="把说明包在触发图标外面。不传 open 时，悬停或聚焦才出现。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="tooltip" title="Tooltip" summary="这里把 open 固定打开，方便查看。正式使用时去掉 open。" code={CODE_TOOLTIP_USAGE} minHeight={180}>
            <Tooltip content={SHORT} position="top" size="sm" open>
              <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="active" />
            </Tooltip>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="方向和尺寸都是气泡本身，放在一组里。">
        <DocExample id="tooltipbubble" title="TooltipBubble" summary="上、下、左、右，再加上短句 sm 和需要换行的 lg。" code={`${CODE_BUBBLE_POSITION}\n${CODE_BUBBLE_SIZE}`} minHeight={240}>
          <div className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              <TooltipBubble content={SHORT} position="top" size="sm" />
              <TooltipBubble content={SHORT} position="bottom" size="sm" />
              <TooltipBubble content={SHORT} position="left" size="sm" />
              <TooltipBubble content={SHORT} position="right" size="sm" />
            </div>
            <TooltipBubble content={LONG} position="top" size="lg" />
          </div>
        </DocExample>
      </Section>

      <Section title="入口">
        <ExampleGrid>
          <DocExample id="tooltipanchor" title="TooltipAnchor" summary="idle 是灰色，active 是强调色。信息图标和警告图标都可以当入口。" code={CODE_ANCHOR_USAGE} minHeight={140}>
            <div className="flex items-center gap-6">
              <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="idle" />
              <TooltipAnchor icon={<InfoCircleBoldDuotone size={14} />} state="active" />
              <TooltipAnchor icon={<DangerCircleBoldDuotone size={14} />} state="idle" />
              <TooltipAnchor icon={<DangerCircleBoldDuotone size={14} />} state="active" />
            </div>
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API" description="气泡写下方向和尺寸。入口只有图标和状态。Tooltip 把两者包在一起。">
        <ApiBlock id="tooltipbubble" title="TooltipBubble" rows={BUBBLE_PROPS} />
        <ApiBlock id="tooltipanchor" title="TooltipAnchor" rows={ANCHOR_PROPS} />
        <ApiBlock id="tooltip" title="Tooltip" rows={TOOLTIP_PROPS} />
      </Section>
    </div>
  );
}
