import Link from "next/link";
import { PageHeading, Section } from "../_shared";
import { AdditionalComponentApi } from "../_additional-component-api";
import { Collapsible } from "@forge-ui-official/core";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, type ApiTableRow } from "../_api-table";

const CODE_COLLAPSIBLE = `<Collapsible title="高级设置">
  导出时保留原始字段名，并附带数据字典。
</Collapsible>`;

const COLLAPSIBLE_PROPS: ApiTableRow[] = [
  { attr: "title", type: "ReactNode", defaultValue: "—", description: "展开行的文字。" },
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "收起时隐藏的内容；浏览器页内搜索能搜到并自动展开。" },
  { attr: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open) => void", defaultValue: "—", description: "受控或非受控展开状态。" },
  { attr: "disabled", type: "boolean", defaultValue: "false", description: "禁用。" },
];

export default function AccordionPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="折叠面板"
        hint="同一时间展开一个面板，用来收纳较长说明。"
      />
      <Section title="用法" description="传入面板列表。value 为当前展开项，null 表示全部收起。">
        <p>
          可操作的示例在
          <Link href="/cases/accordion" className="mx-1 font-semibold text-fg-blue underline underline-offset-4">
            折叠面板案例
          </Link>
          。
        </p>
      </Section>
      <AdditionalComponentApi family="accordion" />
      <Section title="Collapsible" description="只有一段内容需要展开收起时用它，比如“高级设置”。多段并列用折叠面板。">
        <PreviewBlock code={CODE_COLLAPSIBLE} minHeight={140}>
          <div className="w-full max-w-md">
            <Collapsible title="高级设置">导出时保留原始字段名，并附带数据字典。</Collapsible>
          </div>
        </PreviewBlock>
        <ApiTable rows={COLLAPSIBLE_PROPS} />
      </Section>
    </div>
  );
}
