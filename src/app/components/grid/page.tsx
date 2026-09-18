import Link from "next/link";
import { Grid, GridItem } from "@forge-ui-official/core";
import { PageHeading, Section } from "../_shared";
import { ApiTable, CodeBlock, type ApiTableRow } from "../_api-table";

const gridProps: ApiTableRow[] = [
  { attr: "columns", type: "GridResponsive<GridColumns>", defaultValue: "12", description: "1–24 列，支持响应式对象。" },
  { attr: "gap", type: "GridResponsive<GridGap>", defaultValue: "16", description: "像素预设：0/4/8/12/16/20/24/32/48，不是 Tailwind 间距倍数。" },
  { attr: "rowGap / columnGap", type: "GridResponsive<GridGap>", defaultValue: "跟随 gap", description: "分别覆盖纵向或横向间距，未设置的断点跟随 gap。" },
  { attr: "alignItems", type: "start | center | end | stretch | baseline", defaultValue: "stretch", description: "网格项在纵向的对齐方式。" },
];
const itemProps: ApiTableRow[] = [
  { attr: "span", type: "GridResponsive<GridColumns | 'full'>", defaultValue: "full", description: "跨度；full 从首列到末列并忽略 start。" },
  { attr: "start", type: "GridResponsive<GridColumns | 'auto'>", defaultValue: "auto", description: "从 1 开始的列号；auto 可重置较小断点的偏移。" },
];
const example = `import { Grid, GridItem, StatCard } from "@forge-ui-official/core";

// Analytics 模板的比例区域；固定辅助栏保留原模板宽度。
<Grid gap={16}>
  <GridItem span={{ base: "full", lg: 8 }}>主内容</GridItem>
  <GridItem span={{ base: "full", lg: 4 }}>辅助区</GridItem>
</Grid>

<Grid columns={{ base: 1, sm: 2, lg: 4 }}>
  {metrics.map(metric => <StatCard key={metric.title} {...metric} width="full" />)}
</Grid>`;
export default function GridDocs() {
  return <>
    <PageHeading title="Grid 栅格" hint="Forge 的响应式 CSS Grid 布局基础。" />
    <Section title="用法" description="先选择模板并继承宽度与间距。此处展示 Analytics 的比例分栏；商品 280px、卖家 336px 固定辅助栏继续使用静态 CSS Grid / Flex。AppLayout 管理页面边距。">
      <Grid><GridItem span={{ base: "full", lg: 8 }} className="bg-fg-grey-100 p-4">主内容</GridItem><GridItem span={{ base: "full", lg: 4 }} className="bg-fg-grey-100 p-4">辅助区</GridItem></Grid>
      <CodeBlock code={example} />
      <Link className="text-fg-violet" href="/cases/grid">查看完整栅格矩阵 →</Link>
    </Section>
    <Section title="Grid API"><ApiTable rows={gridProps} /></Section>
    <Section title="GridItem API"><ApiTable rows={itemProps} /></Section>
    <Section title="响应式与页面边界">
      <p>base 从最窄视口生效；sm 640、md 768、lg 1024、xl 1280、2xl 1536px。未指定断点继承前值；空对象使用默认值。列跨度和起始位置应落在父级当前列数内，避免创建隐式列。</p>
      <p>Grid 与 GridItem 支持标准 div 属性、className、style 和 ref，可用于服务端组件。自定义 style 与工具类属于显式覆盖。Grid 不加 padding 或最大宽度；表格与仪表盘用全宽，独立表单建议 max-width: 960px。工具栏继续使用 Flex。</p>
      <p>只有 GridItem 默认占满一行；Grid 的普通子组件按单个网格单元自动排列。嵌套 Grid 使用自己的列数和间距。按页面需要决定是否等高，避免机械拉伸所有卡片。</p>
      <p>参考：<a href="https://ant.design/components/grid-cn/">Ant Design</a>、<a href="https://mui.com/material-ui/react-grid/">MUI</a>、<a href="https://chakra-ui.com/docs/components/grid">Chakra UI</a>。</p>
    </Section>
  </>;
}
