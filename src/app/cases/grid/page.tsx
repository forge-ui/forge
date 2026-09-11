"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Grid, GridItem, ButtonGroup, Checkbox, type GridColumns, type GridGap } from "@forge-ui-official/core";
import { PageHeading, Section } from "../../components/_shared";
import { CodeBlock } from "../../components/_api-table";

// These rulers and translucent blocks explain layout geometry, not business UI.
function Ruler({ columns = 12, gap = 16 }: { columns?: GridColumns; gap?: GridGap }) {
  return <Grid columns={columns} gap={gap} aria-hidden className="mb-3">
    {Array.from({ length: columns }, (_, i) => <div key={i} className="min-w-0 border-t border-fg-violet-200 pt-2 text-center font-mono text-xs text-fg-grey-500">{i + 1}</div>)}
  </Grid>;
}

function Board({ children, columns = 12, gap = 16, guides = true, label }: { children: ReactNode; columns?: GridColumns; gap?: GridGap; guides?: boolean; label: string }) {
  return <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto border-y border-fg-grey-200 bg-white py-5">
    <div className="min-w-[560px] px-4">
      <Ruler columns={columns} gap={gap} />
      <div className="relative">
        {guides && <Grid columns={columns} gap={gap} aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: columns }, (_, i) => <div key={i} className="border-x border-dashed border-fg-violet-200 bg-fg-violet-50/50" />)}
        </Grid>}
        <div className="relative flex flex-col gap-4">{children}</div>
      </div>
    </div>
  </div>;
}

function Block({ span, start, children, secondary = false, height = 56 }: { span: GridColumns; start?: GridColumns; children?: ReactNode; secondary?: boolean; height?: number }) {
  return <GridItem span={span} start={start} style={{ minHeight: height }} className={`flex items-center justify-center border px-2 py-3 font-mono text-sm ${secondary ? "border-fg-violet-200 bg-fg-violet-100/80 text-fg-violet" : "border-fg-violet bg-fg-violet/90 text-white"}`}>
    {children ?? `span ${span}`}
  </GridItem>;
}

function Caption({ title, detail }: { title: string; detail: string }) {
  return <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm"><h3 className="font-semibold text-fg-black">{title}</h3><span className="font-mono text-xs text-fg-grey-500">{detail}</span></div>;
}

const splits: GridColumns[][] = [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [8, 4], [3, 9]];
const sources = [
  { name: "完整内容区", href: "/templates/dashboards/analytics" },
  { name: "Analytics · 双表格", href: "/templates/dashboards/analytics" },
  { name: "CRM · 三等分", href: "/templates/dashboards/crm" },
  { name: "Analytics · 指标区", href: "/templates/dashboards/analytics" },
  { name: "Analytics · 主图表与辅助区", href: "/templates/dashboards/analytics" },
  { name: "Finance 3 · 左辅右主", href: "/templates/dashboards/finance-3" },
];
const gapOptions: GridGap[] = [0, 8, 16, 24, 32];

export default function GridCases() {
  const [gapIndex, setGapIndex] = useState(2);
  const [guides, setGuides] = useState(true);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const gap = gapOptions[gapIndex];
  const activeSplit: GridColumns[] = [[8, 4], [6, 6], [3, 6, 3]][layoutIndex] as GridColumns[];

  return <>
    <PageHeading title="Grid 栅格" hint="列 Columns · 跨度 Span · 间距 Gutter · 起始列 Start" />

    <Section title="模板中的比例布局" description="将 Forge 模板的分栏映射到 12 列。色块保留比例关系，点击来源可查看完整页面。">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-fg-grey-700">12 columns / 16 px gutter</span>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-grey-700"><Checkbox checked={guides} onChange={setGuides} aria-label="显示列参考线" />显示列参考线</label>
      </div>
      <Board label="12 列跨度对照" guides={guides}>
        {splits.map((split, row) => <div key={row}><Link href={sources[row].href} className="mb-2 inline-block text-xs text-fg-violet">{sources[row].name} →</Link><Grid data-testid={`grid-split-${row}`}>
          {split.map((span, i) => <Block key={i} span={span} secondary={i % 2 === 1}>{span === 12 ? "12 / 12" : `${span} / 12`}</Block>)}
        </Grid></div>)}
      </Board>
      <p className="text-xs text-fg-grey-500">窄屏可在对照图内横向滚动，保持列标尺与跨度关系清晰。</p>
    </Section>

    <Section title="模板中的固定辅助栏" description="表单和详情页保留辅助栏宽度，主区使用剩余空间；窄屏堆叠。固定栏不会随窗口变宽而变成三分之一。">
      <Link href="/templates/ecommerce/products/new" className="text-sm text-fg-violet">商品新增 · 右侧 280px →</Link>
      <div data-testid="case-product-fixed" className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 border border-fg-violet bg-fg-violet/90 p-6 text-center text-sm text-white">主表单 · 剩余宽度</div>
        <div className="min-w-0 border border-fg-violet-200 bg-fg-violet-100/80 p-6 text-center text-sm text-fg-violet">辅助区 · 280px</div>
      </div>
      <Link href="/templates/ecommerce/sellers/1" className="text-sm text-fg-violet">卖家详情 · 左侧 336px →</Link>
      <div data-testid="case-seller-fixed" className="grid grid-cols-1 gap-4 xl:grid-cols-[336px_minmax(0,1fr)]">
        <div className="min-w-0 border border-fg-violet-200 bg-fg-violet-100/80 p-6 text-center text-sm text-fg-violet">资料栏 · 336px</div>
        <div className="min-w-0 border border-fg-violet bg-fg-violet/90 p-6 text-center text-sm text-white">详情内容 · 剩余宽度</div>
      </div>
      <p className="text-xs text-fg-grey-500">宽屏固定栏从 xl 开始并排。内部等分区域继续使用 Grid，按钮组与工具栏使用 Flex。</p>
    </Section>

    <Section title="调整分栏与间距" description="改变 gutter，列宽随之重新分配；3∶6∶3 是通用跨度练习，实际页面以来源模板为准。">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2"><span className="text-xs text-fg-grey-500">分栏比例</span><ButtonGroup ariaLabel="分栏比例" items={[{ label: "8 : 4" }, { label: "6 : 6" }, { label: "3 : 6 : 3" }]} activeIndex={layoutIndex} onChange={setLayoutIndex} /></div>
        <div className="flex min-w-0 flex-col gap-2"><span className="text-xs text-fg-grey-500">列间距 / px</span><div className="overflow-x-auto"><ButtonGroup ariaLabel="列间距" items={gapOptions.map(n => ({ label: String(n) }))} activeIndex={gapIndex} onChange={setGapIndex} /></div></div>
      </div>
      <Board label="交互栅格预览" gap={gap} guides={guides}>
        <Grid gap={gap} data-testid="grid-playground">{activeSplit.map((span, i) => <Block key={i} span={span} secondary={i % 2 === 1} height={112}>span {span}</Block>)}</Grid>
      </Board>
      <CodeBlock code={`<Grid gap={${gap}}>\n${activeSplit.map(span => `  <GridItem span={${span}}>…</GridItem>`).join("\n")}\n</Grid>`} />
    </Section>

    <Section title="通用能力：起始列与 24 列" description="这些是组件能力补充，不是模板默认布局。start 从 1 计数，span 决定占用列数。">
      <Caption title="偏移与居中" detail="12 columns · gap 16" />
      <Board label="起始列对照" guides={guides}>
        <Grid><Block span={4} start={3}>start 3 · span 4</Block></Grid>
        <Grid><Block span={6} start={4}>start 4 · span 6</Block></Grid>
        <Grid><Block span={4} start={9}>start 9 · span 4</Block></Grid>
      </Board>
      <Caption title="更细的比例" detail="24 columns · gap 4" />
      <Board label="24 列跨度对照" columns={24} gap={4} guides={guides}>
        <Grid columns={24} gap={4}><Block span={5}>5</Block><Block span={14} secondary>14</Block><Block span={5}>5</Block></Grid>
        <Grid columns={24} gap={4}><Block span={7}>7</Block><Block span={17} secondary>17</Block></Grid>
      </Board>
    </Section>

    <Section title="嵌套与横纵间距" description="子栅格从自己的容器重新计算列宽，不继承父级列数或间距。">
      <Caption title="外层 8 : 4，内层 3 等分" detail="parent gap 16 / nested gap 8" />
      <Board label="嵌套栅格" guides={guides}>
        <Grid alignItems="start">
          <GridItem span={8} className="border border-fg-violet bg-white p-3"><p className="mb-3 font-mono text-xs text-fg-violet">span 8 → columns 3</p><Grid columns={3} gap={8} data-testid="grid-nested">{[1, 2, 3].map(n => <Block key={n} span={1} secondary>1 / 3</Block>)}</Grid></GridItem>
          <Block span={4} height={112}>span 4</Block>
        </Grid>
      </Board>
      <Caption title="横向 24px，纵向 8px" detail="columnGap 24 / rowGap 8" />
      <Board label="横纵间距对照" gap={24} guides={guides}>
        <Grid columnGap={24} rowGap={8} data-testid="grid-axis-gaps">{Array.from({ length: 6 }, (_, i) => <Block key={i} span={4} secondary={i > 2}>4 / 12</Block>)}</Grid>
      </Board>
    </Section>

  </>;
}
