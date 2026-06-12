"use client";

import Link from "next/link";
import { MapCard } from "@forge-ui-official/core";
import type { MapRegion } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const FLAGS = {
  uk: "https://flagcdn.com/w80/gb.png",
  spain: "https://flagcdn.com/w80/es.png",
  indonesia: "https://flagcdn.com/w80/id.png",
  france: "https://flagcdn.com/w80/fr.png",
  germany: "https://flagcdn.com/w80/de.png",
};

const REGIONS: MapRegion[] = [
  { name: "United Kingdom", flag: FLAGS.uk, salesLabel: "340 Sales", value: "$17,678" },
  { name: "Spain", flag: FLAGS.spain, salesLabel: "100 Sales", value: "$5,500" },
  { name: "Indonesia", flag: FLAGS.indonesia, salesLabel: "50 Sales", value: "$2,500" },
  { name: "France", flag: FLAGS.france, salesLabel: "147 Sales", value: "$7,456" },
];

const CODE_IMPORT = `import { MapCard } from "@forge-ui-official/core";
import type { MapRegion } from "@forge-ui-official/core";`;

const CODE_USAGE = `<MapCard
  variant="sm"
  color="purple"
  regions={regions}
  highlights={["north-america", "oceania"]}
  onMenuClick={() => {}}
/>`;

const CODE_VARIANTS = `<MapCard variant="sm" regions={regions} />
<MapCard variant="md" regions={regions} />
<MapCard variant="lg" regions={regions} />`;

const CODE_COLORS = `<MapCard color="purple" regions={regions} highlights={["north-america", "oceania"]} />
<MapCard color="blue"   regions={regions} highlights={["europe", "asia"]} />
<MapCard color="black"  regions={regions} highlights={["africa", "south-america"]} />`;

const CODE_HIGHLIGHTS = `<MapCard
  highlights={["north-america", "europe", "asia"]}
  regions={regions}
/>`;

const MAP_PROPS: ApiTableRow[] = [
  {
    attr: "title",
    type: "string",
    defaultValue: "'Top Region'",
    description: "卡片标题。",
  },
  {
    attr: "subtitle",
    type: "string",
    defaultValue: "'Sales by region'",
    description: "标题下一行描述。",
  },
  {
    attr: "color",
    type: "'purple' | 'blue' | 'black'",
    defaultValue: "'purple'",
    description: "高亮大洲的填充色。",
  },
  {
    attr: "variant",
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'sm'",
    description: "sm 紧凑卡（384px），md 中号卡（480px），lg 全宽地图 + 浮层。",
  },
  {
    attr: "regions",
    type: "MapRegion[]",
    defaultValue: "[]",
    description: "区域销量列表，包含 name / flag / salesLabel / value。",
  },
  {
    attr: "highlights",
    type: "MapContinent[]",
    defaultValue: "['north-america', 'oceania']",
    description: "需要高亮的大洲，6 个可选：north-america / south-america / europe / africa / asia / oceania。",
  },
  {
    attr: "onMenuClick",
    type: "() => void",
    defaultValue: "—",
    description: "右上角 kebab 按钮点击回调，不传则不渲染按钮。",
  },
  {
    attr: "className",
    type: "string",
    defaultValue: "''",
    description: "额外 className，透传到根容器。",
  },
];

export default function MapCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Map"
        hint="MapCard 世界地图卡片，高亮大洲 + 区域销量列表，用于 dashboard 的地理分布模块。"
      />

      <Section
        title="MapCard"
        description="内置 SVG 世界地图，3 种尺寸 × 3 种主色，支持自定义高亮大洲与区域列表。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传入 <InlineCode>regions</InlineCode> 与 <InlineCode>highlights</InlineCode> 即可渲染。
          </p>
          <PreviewBlock code={CODE_USAGE} minHeight={520}>
            <MapCard
              variant="sm"
              color="purple"
              regions={REGIONS}
              highlights={["north-america", "oceania"]}
              onMenuClick={() => {}}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="Variants" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>sm</InlineCode> / <InlineCode>md</InlineCode> 为竖向卡片，<InlineCode>lg</InlineCode> 为全宽地图 + 右上浮动搜索面板。
          </p>
          <PreviewBlock code={CODE_VARIANTS} minHeight={540}>
            <div className="flex flex-wrap items-start gap-6">
              <MapCard variant="sm" color="purple" regions={REGIONS} highlights={["north-america", "oceania"]} />
              <MapCard variant="md" color="purple" regions={REGIONS} highlights={["north-america", "oceania"]} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Colors" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            3 种主色：<InlineCode>purple</InlineCode>（默认） / <InlineCode>blue</InlineCode> / <InlineCode>black</InlineCode>，影响高亮大洲的填充色。
          </p>
          <PreviewBlock code={CODE_COLORS} minHeight={540}>
            <div className="flex flex-wrap items-start gap-6">
              <MapCard variant="sm" color="purple" regions={REGIONS} highlights={["north-america", "oceania"]} />
              <MapCard variant="sm" color="blue" regions={REGIONS} highlights={["europe", "asia"]} />
              <MapCard variant="sm" color="black" regions={REGIONS} highlights={["africa", "south-america"]} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Large variant" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>lg</InlineCode> 适合主区域卡，地图铺满顶部，搜索 + 区域列表浮在右上角。
          </p>
          <PreviewBlock code={`<MapCard variant="lg" regions={regions} className="w-full" />`} minHeight={560}>
            <div className="w-full">
              <MapCard
                variant="lg"
                color="purple"
                regions={REGIONS}
                highlights={["north-america", "oceania"]}
                onMenuClick={() => {}}
                className="w-full"
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Highlights" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>highlights</InlineCode> 指定需着色的大洲，支持任意组合。
          </p>
          <PreviewBlock code={CODE_HIGHLIGHTS} minHeight={520}>
            <MapCard
              variant="sm"
              color="purple"
              regions={REGIONS}
              highlights={["north-america", "europe", "asia"]}
            />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={MAP_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/map" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
