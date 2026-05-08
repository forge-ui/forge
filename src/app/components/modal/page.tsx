import Link from "next/link";
import { ConfirmationDialog } from "@forge-ui-official/core";
import {
  DangerBold,
  PlainBold,
  DangerTriangleBold,
  RocketBold,
  BellBold,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

// ─── 代码片段 ───

const CODE_IMPORT = `import { ConfirmationDialog } from "@forge-ui-official/core";`;

const CODE_USAGE = `<ConfirmationDialog
  color="red"
  layout="spread"
  title="Delete this item?"
  description="This action can't be undone"
  confirmLabel="Delete"
  cancelLabel="Cancel"
  icon={<DangerBold size={32} color="currentColor" />}
/>`;

const CODE_COLORS = `<ConfirmationDialog color="red" icon={<DangerBold size={32} />} ... />
<ConfirmationDialog color="green" icon={<PlainBold size={32} />} ... />
<ConfirmationDialog color="yellow" icon={<DangerTriangleBold size={32} />} ... />
<ConfirmationDialog color="purple" icon={<RocketBold size={32} />} ... />
<ConfirmationDialog color="blue" icon={<BellBold size={32} />} ... />`;

const CODE_LAYOUT = `<ConfirmationDialog layout="spread" ... />
<ConfirmationDialog layout="right" ... />`;

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
    description: "左上方的 32px 图标，建议 solar-icon-set Bold 系列。",
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
        title="Modal"
        hint="弹窗家族，当前提供 ConfirmationDialog 预设 5 种语义色 × 2 种布局。"
      />

      <Section
        title="ConfirmationDialog"
        description="确认对话框，用于关键动作二次确认（删除 / 发送 / 保存 / 升级 / 激活 等）。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>title</InlineCode> / <InlineCode>description</InlineCode> / <InlineCode>icon</InlineCode>，color 决定主按钮色。
          </p>
          <PreviewBlock code={CODE_USAGE} minHeight={320}>
            <ConfirmationDialog
              color="red"
              layout="spread"
              title="Delete this item?"
              description="Lorem ipsum dolor sit amet lorem? This action can't be undone"
              confirmLabel="Delete"
              cancelLabel="Cancel"
              icon={<DangerBold size={32} color="currentColor" />}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            5 种语义色：<InlineCode>red</InlineCode> 危险 / <InlineCode>green</InlineCode> 成功 / <InlineCode>yellow</InlineCode> 警示 / <InlineCode>purple</InlineCode> 推广 / <InlineCode>blue</InlineCode> 通知。
          </p>
          <PreviewBlock code={CODE_COLORS} minHeight={400}>
            <div className="flex flex-wrap items-start justify-center gap-4">
              <ConfirmationDialog
                color="red"
                layout="spread"
                title="Delete?"
                description="This action can't be undone"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                icon={<DangerBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="green"
                layout="spread"
                title="Send message?"
                description="Your reply will be visible to all members"
                confirmLabel="Send"
                cancelLabel="Cancel"
                icon={<PlainBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="yellow"
                layout="spread"
                title="Unsaved changes"
                description="Do you want to save before leaving?"
                confirmLabel="Yes, Save"
                cancelLabel="Don't Save"
                icon={<DangerTriangleBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="purple"
                layout="spread"
                title="Upgrade now?"
                description="Unlock all Pro features for $12/month"
                confirmLabel="Upgrade"
                cancelLabel="Cancel"
                icon={<RocketBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="blue"
                layout="spread"
                title="Enable notifications?"
                description="You'll get alerts for key activities"
                confirmLabel="Activate"
                cancelLabel="Cancel"
                icon={<BellBold size={32} color="currentColor" />}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Layout" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>spread</InlineCode> 居中对齐，按钮左右铺开；<InlineCode>right</InlineCode> 文案左对齐，按钮靠右。
          </p>
          <PreviewBlock code={CODE_LAYOUT} minHeight={320}>
            <div className="flex flex-wrap items-start justify-center gap-4">
              <ConfirmationDialog
                color="red"
                layout="spread"
                title="Spread layout"
                description="Centered, buttons span full width"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                icon={<DangerBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="red"
                layout="right"
                title="Right layout"
                description="Text left-aligned, buttons on the right"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                icon={<DangerBold size={32} color="currentColor" />}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/modal" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
