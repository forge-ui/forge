"use client";

import { Checklist, ChecklistItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { Checklist, ChecklistItem } from "@forge-ui-official/core";`;

const LIST_PROPS: ApiTableRow[] = [
  { attr: "tasks", type: "ChecklistTask[]", defaultValue: "—", description: "受控列表。" },
  { attr: "defaultTasks", type: "ChecklistTask[]", defaultValue: "[]", description: "非受控初始行。" },
  { attr: "onTasksChange", type: "(tasks) => void", defaultValue: "—", description: "勾选变化。" },
  { attr: "size", type: "'sm' | 'md'", defaultValue: "'md'", description: "行尺寸。" },
  { attr: "color", type: "ChecklistColor", defaultValue: "'purple'", description: "勾选色，与 Checkbox 对齐（无 orange 别名）。" },
];

const ITEM_PROPS: ApiTableRow[] = [
  { attr: "label", type: "string", defaultValue: "—", description: "行文案。" },
  { attr: "checked", type: "boolean", defaultValue: "—", description: "受控勾选。" },
  { attr: "onSettled", type: "() => void", defaultValue: "—", description: "划线 + 轻甩结束后。" },
];

const DEMO = [
  { id: "vendor", label: "核对供应商联系人", done: true },
  { id: "certs", label: "核验冷链证书" },
  { id: "windows", label: "发布周末冷库作业时段" },
  { id: "reorder", label: "发送华丰食品补货单" },
];

export default function ChecklistSpecPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="待办清单"
        hint="勾选待办事项，已完成的内容自动移到列表底部。"
      />

      <Section title="导入组件" description="从 @forge-ui-official/core 导入所需组件。">
        <SubSection title="使用方法" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
      </Section>

      <Section title="Checklist" description="勾选待办事项，已完成项自动移到列表底部，可再次点击恢复。">
        <SubSection title="使用方法" stack>
          <PreviewBlock code={`<Checklist defaultTasks={[{ id, label, done }]} />`} minHeight={280}>
            <Checklist defaultTasks={DEMO} />
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={LIST_PROPS} />
        </SubSection>
      </Section>

      <Section title="ChecklistItem" description="展示一项可勾选的待办事项。">
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            勾选视觉跟 <InlineCode>Checkbox</InlineCode> 同一套几何；动效用 CSS，不加 Motion。
          </p>
          <PreviewBlock code={`<ChecklistItem label="核验冷链证书" />`} minHeight={120}>
            <ChecklistItem label="核验冷链证书" />
          </PreviewBlock>
        </SubSection>
        <SubSection title="API" stack>
          <ApiTable rows={ITEM_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
