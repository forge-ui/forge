import Link from "next/link";
import { ProgressBar } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { ProgressBar } from "@forge-ui-official/core";`;

const CODE_USAGE = `<ProgressBar value={45} />
<ProgressBar value={75} showPercentage />
<ProgressBar value={60} label="Progress" showPercentage />`;

const CODE_COLORS = `<ProgressBar value={60} color="purple" />
<ProgressBar value={60} color="blue" />
<ProgressBar value={60} color="green" />
<ProgressBar value={60} color="red" />
<ProgressBar value={60} color="yellow" />
<ProgressBar value={60} color="cyan" />
<ProgressBar value={60} color="gray" />`;

const CODE_SIZES = `<ProgressBar value={75} size="sm" label="Small" showPercentage />
<ProgressBar value={75} size="md" label="Medium" showPercentage />`;

const CODE_LABELS = `<ProgressBar value={45} label="Progress" showPercentage />
<ProgressBar value={45} label="$400" labelVariant="value" showPercentage />`;

const CODE_LABEL_SIZE = `<ProgressBar value={45} label="Progress" labelSize="xs" showPercentage />
<ProgressBar value={45} label="Progress" labelSize="sm" showPercentage />`;

const CODE_DARK = `<div className="bg-fg-black p-6 rounded-xl">
  <ProgressBar value={60} color="purple" label="Progress" showPercentage onDark />
</div>`;

const PROGRESS_PROPS: ApiTableRow[] = [
  {
    attr: "value",
    type: "number",
    defaultValue: "0",
    description: "进度值，0-100，自动 clamp。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'cyan' | 'gray'",
    defaultValue: "'purple'",
    description: "填充色，8 种语义色。",
  },
  {
    attr: "size",
    type: "'sm' | 'md'",
    defaultValue: "'sm'",
    description: "进度条粗细，sm 8px / md 12px。",
  },
  {
    attr: "label",
    type: "string",
    defaultValue: "—",
    description: "左侧文字，如 'Progress' 或金额 '$400'。",
  },
  {
    attr: "labelVariant",
    type: "'default' | 'value'",
    defaultValue: "'default'",
    description: "default 灰色 medium，value 黑色 semibold。",
  },
  {
    attr: "labelSize",
    type: "'xs' | 'sm'",
    defaultValue: "'sm'",
    description: "label 与百分比文字大小。",
  },
  {
    attr: "showPercentage",
    type: "boolean",
    defaultValue: "false",
    description: "是否显示右侧百分比。",
  },
  {
    attr: "onDark",
    type: "boolean",
    defaultValue: "false",
    description: "深色底上渲染：半透明轨道 + 白色文字。",
  },
];

export default function ProgressCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Progress"
        hint="ProgressBar 线性进度条，8 色 × 2 尺寸，支持 label、百分比与深色底。"
      />

      <Section
        title="ProgressBar"
        description="最基础的进度展示元素，常用于 dashboard、卡片、任务完成度等场景。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            最简用法只需传 <InlineCode>value</InlineCode>，配合 <InlineCode>label</InlineCode> 与 <InlineCode>showPercentage</InlineCode> 组合出完整条目。
          </p>
          <PreviewBlock code={CODE_USAGE} minHeight={200}>
            <div className="flex w-full max-w-md flex-col gap-4">
              <ProgressBar value={45} />
              <ProgressBar value={75} showPercentage />
              <ProgressBar value={60} label="Progress" showPercentage />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            8 种色：purple / blue / green / red / orange / yellow / cyan / gray。
          </p>
          <PreviewBlock code={CODE_COLORS} minHeight={260}>
            <div className="flex w-full max-w-md flex-col gap-3">
              <ProgressBar value={60} color="purple" />
              <ProgressBar value={60} color="blue" />
              <ProgressBar value={60} color="green" />
              <ProgressBar value={60} color="red" />
              <ProgressBar value={60} color="yellow" />
              <ProgressBar value={60} color="cyan" />
              <ProgressBar value={60} color="gray" />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Sizes" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> 8px 高，<InlineCode>md</InlineCode> 12px 高。
          </p>
          <PreviewBlock code={CODE_SIZES} minHeight={180}>
            <div className="flex w-full max-w-md flex-col gap-4">
              <ProgressBar value={75} size="sm" label="Small" showPercentage />
              <ProgressBar value={75} size="md" label="Medium" showPercentage />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Label variants" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>default</InlineCode> 灰色 medium 适合描述文本；<InlineCode>value</InlineCode> 黑色 semibold 适合展示金额 / 数值。
          </p>
          <PreviewBlock code={CODE_LABELS} minHeight={180}>
            <div className="flex w-full max-w-md flex-col gap-4">
              <ProgressBar value={45} label="Progress" showPercentage />
              <ProgressBar value={45} label="$400" labelVariant="value" showPercentage />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Label size" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            label 与百分比字号联动，<InlineCode>xs</InlineCode> 用于紧凑卡片，<InlineCode>sm</InlineCode> 为默认。
          </p>
          <PreviewBlock code={CODE_LABEL_SIZE} minHeight={180}>
            <div className="flex w-full max-w-md flex-col gap-4">
              <ProgressBar value={45} label="Progress" labelSize="xs" showPercentage />
              <ProgressBar value={45} label="Progress" labelSize="sm" showPercentage />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="On dark" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>onDark</InlineCode> 用于深色卡片 / dashboard，轨道变半透明，文字转白色。
          </p>
          <PreviewBlock code={CODE_DARK} minHeight={180}>
            <div className="w-full max-w-md rounded-xl bg-fg-black p-6">
              <ProgressBar value={60} color="purple" label="Progress" showPercentage onDark />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROGRESS_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/progress" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
