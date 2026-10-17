import Link from "next/link";
import { PageHeading, Section } from "../_shared";
import { AdditionalComponentApi } from "../_additional-component-api";

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
    </div>
  );
}
