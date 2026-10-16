"use client";

import { useState } from "react";
import { Pagination, Stepper, PageDot } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample, ExampleGrid } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { Pagination, Stepper, PageDot } from "@forge-ui-official/core";`;

const CODE_PAGINATION_USAGE = `<Pagination totalPages={10} currentPage={3} onPageChange={(p) => setPage(p)} />`;

const CODE_STEPPER_USAGE = `<Stepper total={5} current={3} />`;

const CODE_PAGEDOT_USAGE = `<PageDot active>1</PageDot>
<PageDot onClick={() => {}}>2</PageDot>
<PageDot>...</PageDot>`;

const PAGINATION_PROPS: ApiTableRow[] = [
  { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "前后翻页与当前页的可访问名称。" },
  { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "选中背景平滑移动；none 立即切换。" },
  { attr: "totalPages", type: "number", defaultValue: "—", description: "总页数。" },
  { attr: "currentPage", type: "number", defaultValue: "—", description: "当前页码（1-based）。" },
  { attr: "onPageChange", type: "(page: number) => void", defaultValue: "—", description: "切换页码回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "选中页主色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const STEPPER_PROPS: ApiTableRow[] = [
  { attr: "total", type: "number", defaultValue: "—", description: "步骤总数。" },
  { attr: "current", type: "number", defaultValue: "1", description: "当前完成到第几步（active 胶囊数量）。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "active 胶囊颜色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const PAGEDOT_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "显示内容，通常是数字或 \"...\"。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'blue'", description: "active 态主色。" },
  { attr: "active", type: "boolean", defaultValue: "false", description: "是否选中态（实心填充）。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "点击回调。传了就渲染成 button，没传是 span。" },
];

export default function PaginationStepperCasePage() {
  const [page, setPage] = useState(3);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="分页与步骤"
        hint="翻页、步骤条和单个页码点是三件东西。主色相同，不单独再摆一套颜色。"
      />

      <Section title="用法" description="分页用总页数和当前页驱动。点击后通过 onPageChange 更新。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="pagination" title="Pagination" summary="当前页可以点击切换。" code={CODE_PAGINATION_USAGE}>
            <Pagination totalPages={10} currentPage={page} onPageChange={setPage} />
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="步骤条表示流程走到哪一步。页码点是分页里的一个位置，省略号不可点。">
        <ExampleGrid>
          <DocExample id="stepper" title="Stepper" summary="current 是已经到达的步数。" code={CODE_STEPPER_USAGE}>
            <Stepper total={5} current={3} />
          </DocExample>
          <DocExample id="pagedot" title="PageDot" summary="选中是实心。传入 onClick 才能点击，省略号保持纯展示。" code={CODE_PAGEDOT_USAGE}>
            <PageDot active>1</PageDot>
            <PageDot onClick={() => {}}>2</PageDot>
            <PageDot>...</PageDot>
          </DocExample>
        </ExampleGrid>
      </Section>

      <Section title="API" description="三个组件都有 color。分页负责页码，步骤条负责进度，页码点负责单个位置。">
        <ApiBlock id="pagination" title="Pagination" rows={PAGINATION_PROPS} />
        <ApiBlock id="stepper" title="Stepper" rows={STEPPER_PROPS} />
        <ApiBlock id="pagedot" title="PageDot" rows={PAGEDOT_PROPS} />
      </Section>
    </div>
  );
}
