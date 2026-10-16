"use client";

import { Checklist, ChecklistItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { Checklist, ChecklistItem } from "@forge-ui-official/core";`;

const LIST_PROPS: ApiTableRow[] = [
  { attr: "tasks", type: "ChecklistTask[]", defaultValue: "—", description: "受控列表。" },
  { attr: "defaultTasks", type: "ChecklistTask[]", defaultValue: "[]", description: "非受控初始行。" },
  { attr: "onTasksChange", type: "(tasks) => void", defaultValue: "—", description: "勾选变化。" },
  { attr: "size", type: "'sm' | 'md'", defaultValue: "'md'", description: "行尺寸。" },
  { attr: "color", type: "ChecklistColor", defaultValue: "'blue'", description: "勾选色，与 Checkbox 对齐（无 orange 别名）。" },
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
        hint="整份清单负责勾选后把完成项沉到底部。单独一行用 ChecklistItem。"
      />

      <Section title="用法" description="传入任务数组。已完成的项会移到列表底部，再点一次可以恢复。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="checklist" title="Checklist" summary="defaultTasks 适合本地演示。受控时改用 tasks 和 onTasksChange。" code={`<Checklist defaultTasks={[{ id, label, done }]} />`} minHeight={280}>
            <Checklist defaultTasks={DEMO} />
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子">
        <ExampleGrid>
          <DocExample id="checklistitem" title="ChecklistItem" summary="一行的勾选外观和复选框一致。划线结束后触发 onSettled。" code={`<ChecklistItem label="核验冷链证书" />`} minHeight={120}>
            <ChecklistItem label="核验冷链证书" />
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API">
        <ApiBlock id="checklist" title="Checklist" rows={LIST_PROPS} />
        <ApiBlock id="checklistitem" title="ChecklistItem" rows={ITEM_PROPS} />
      </Section>
    </div>
  );
}
