"use client";

import { useState } from "react";
import { Pagination, Stepper, PageDot } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { Pagination, Stepper, PageDot } from "@forge-ui-official/core";`;

const CODE_PAGINATION_USAGE = `<Pagination totalPages={10} currentPage={3} onPageChange={(p) => setPage(p)} />`;

const CODE_PAGINATION_COLOR = `<Pagination totalPages={10} currentPage={3} color="purple" />`;

const CODE_STEPPER_USAGE = `<Stepper total={5} current={3} />`;

const CODE_STEPPER_COLOR = `<Stepper total={5} current={3} color="purple" />`;

const CODE_PAGEDOT_USAGE = `<PageDot active>1</PageDot>
<PageDot onClick={() => {}}>2</PageDot>
<PageDot>...</PageDot>`;

const PAGINATION_PROPS: ApiTableRow[] = [
  { attr: "locale", type: "'zh' | 'en'", defaultValue: "'zh'", description: "前后翻页与当前页的可访问名称。" },
  { attr: "motion", type: "'auto' | 'none'", defaultValue: "'auto'", description: "选中背景平滑移动；none 立即切换。" },
  { attr: "totalPages", type: "number", defaultValue: "—", description: "总页数。" },
  { attr: "currentPage", type: "number", defaultValue: "—", description: "当前页码（1-based）。" },
  { attr: "onPageChange", type: "(page: number) => void", defaultValue: "—", description: "切换页码回调。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "选中页主色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const STEPPER_PROPS: ApiTableRow[] = [
  { attr: "total", type: "number", defaultValue: "—", description: "步骤总数。" },
  { attr: "current", type: "number", defaultValue: "1", description: "当前完成到第几步（active 胶囊数量）。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 胶囊颜色。" },
  { attr: "className", type: "string", defaultValue: "—", description: "额外 className。" },
];

const PAGEDOT_PROPS: ApiTableRow[] = [
  { attr: "children", type: "ReactNode", defaultValue: "—", description: "显示内容，通常是数字或 \"...\"。" },
  { attr: "color", type: "'purple' | 'blue' | 'black'", defaultValue: "'purple'", description: "active 态主色。" },
  { attr: "active", type: "boolean", defaultValue: "false", description: "是否选中态（实心填充）。" },
  { attr: "onClick", type: "() => void", defaultValue: "—", description: "点击回调。传了就渲染成 button，没传是 span。" },
];

export default function PaginationStepperCasePage() {
  const [page, setPage] = useState(3);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="分页与步骤"
        hint="切换列表页码，或展示分步流程的当前位置。"
      />

      <Section
        title="Pagination"
        description="切换页码，支持前后翻页和页码省略。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>totalPages</InlineCode> + <InlineCode>currentPage</InlineCode> 受控驱动，<InlineCode>onPageChange</InlineCode> 捕获点击。
          </p>
          <PreviewBlock code={CODE_PAGINATION_USAGE}>
            <Pagination totalPages={10} currentPage={page} onPageChange={setPage} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种主色。示例用 purple，其余见 cases。
          </p>
          <PreviewBlock code={CODE_PAGINATION_COLOR}>
            <Pagination totalPages={10} currentPage={3} color="purple" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PAGINATION_PROPS} />
        </SubSection>

      </Section>

      <Section
        title="Stepper"
        description="展示分步流程的当前位置。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_STEPPER_USAGE}>
            <Stepper total={5} current={3} />
          </PreviewBlock>
        </SubSection>

        <SubSection title="颜色" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 色可选，示例为 purple。
          </p>
          <PreviewBlock code={CODE_STEPPER_COLOR}>
            <Stepper total={5} current={3} color="purple" />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={STEPPER_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="PageDot"
        description="分页和步骤指示中的单个位置标记。"
      >
        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传 <InlineCode>onClick</InlineCode> 渲染为 button，否则是 span（用于 ellipsis 或静态展示）。
          </p>
          <PreviewBlock code={CODE_PAGEDOT_USAGE}>
            <PageDot active>1</PageDot>
            <PageDot onClick={() => {}}>2</PageDot>
            <PageDot>...</PageDot>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={PAGEDOT_PROPS} />
        </SubSection>
      </Section>
    </div>
  );
}
