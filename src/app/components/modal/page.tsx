import { ConfirmationDialog } from "@forge-ui-official/core";
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
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            5 种语义色：<InlineCode>red</InlineCode> 危险 / <InlineCode>green</InlineCode> 成功 / <InlineCode>yellow</InlineCode> 警示 / <InlineCode>purple</InlineCode> 推广 / <InlineCode>blue</InlineCode> 通知。
          </p>
          <PreviewBlock code={CODE_COLORS} minHeight={400}>
            <div className="flex flex-wrap items-start justify-center gap-4">
              <ConfirmationDialog
                color="red"
                layout="spread"
                title="确认删除？"
                description="此操作无法撤销"
                confirmLabel="删除"
                cancelLabel="取消"
                icon={<DangerBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="green"
                layout="spread"
                title="发送消息？"
                description="所有成员都能看到你的回复"
                confirmLabel="发送"
                cancelLabel="取消"
                icon={<PlainBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="yellow"
                layout="spread"
                title="有未保存的修改"
                description="离开前要保存修改吗？"
                confirmLabel="保存修改"
                cancelLabel="不保存"
                icon={<DangerTriangleBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="purple"
                layout="spread"
                title="立即升级？"
                description="每月 ¥88，解锁全部专业版功能"
                confirmLabel="升级"
                cancelLabel="取消"
                icon={<RocketBold size={32} color="currentColor" />}
              />
              <ConfirmationDialog
                color="blue"
                layout="spread"
                title="开启通知？"
                description="重要动态发生时会收到提醒"
                confirmLabel="开启"
                cancelLabel="取消"
                icon={<BellBold size={32} color="currentColor" />}
              />
            </div>
          </PreviewBlock>
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
