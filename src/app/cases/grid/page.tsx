"use client";

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

const splits: GridColumns[][] = [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [8, 4], [3, 6, 3]];
const gapOptions: GridGap[] = [0, 8, 16, 24, 32];

export default function GridCases() {
  const [gapIndex, setGapIndex] = useState(2);
  const [guides, setGuides] = useState(true);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const gap = gapOptions[gapIndex];
  const activeSplit: GridColumns[] = [[8, 4], [6, 6], [3, 6, 3]][layoutIndex] as GridColumns[];

  return <>
    <PageHeading title="Grid 栅格" hint="列 Columns · 跨度 Span · 间距 Gutter · 起始列 Start" />

    <Section title="12 列基础栅格" description="同一套列轨道，六种分栏。色块边缘与列线对齐，留白部分就是列间距。">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-fg-grey-700">12 columns / 16 px gutter</span>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-fg-grey-700"><Checkbox checked={guides} onChange={setGuides} aria-label="显示列参考线" />显示列参考线</label>
      </div>
      <Board label="12 列跨度对照" guides={guides}>
        {splits.map((split, row) => <Grid key={row} data-testid={`grid-split-${row}`}>
          {split.map((span, i) => <Block key={i} span={span} secondary={i % 2 === 1}>{span === 12 ? "12 / 12" : `${span} / 12`}</Block>)}
        </Grid>)}
      </Board>
      <p className="text-xs text-fg-grey-500">窄屏可在对照图内横向滚动，保持列标尺与跨度关系清晰。</p>
    </Section>

    <Section title="调整分栏与间距" description="改变 gutter，列宽随之重新分配；容器总宽度保持不变。">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex flex-col gap-2"><span className="text-xs text-fg-grey-500">分栏比例</span><ButtonGroup ariaLabel="分栏比例" items={[{ label: "8 : 4" }, { label: "6 : 6" }, { label: "3 : 6 : 3" }]} activeIndex={layoutIndex} onChange={setLayoutIndex} /></div>
        <div className="flex min-w-0 flex-col gap-2"><span className="text-xs text-fg-grey-500">列间距 / px</span><div className="overflow-x-auto"><ButtonGroup ariaLabel="列间距" items={gapOptions.map(n => ({ label: String(n) }))} activeIndex={gapIndex} onChange={setGapIndex} /></div></div>
      </div>
      <Board label="交互栅格预览" gap={gap} guides={guides}>
        <Grid gap={gap} data-testid="grid-playground">{activeSplit.map((span, i) => <Block key={i} span={span} secondary={i % 2 === 1} height={112}>span {span}</Block>)}</Grid>
      </Board>
      <CodeBlock code={`<Grid gap={${gap}}>\n${activeSplit.map(span => `  <GridItem span={${span}}>…</GridItem>`).join("\n")}\n</Grid>`} />
    </Section>

    <Section title="起始列与 24 列精细分栏" description="空列保留在原位置。start 从 1 计数，span 决定内容占用多少列。">
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
