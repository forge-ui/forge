"use client";

import {
  MapCard,
  type MapVariant,
  type MapRegion,
  type AccentColor,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const mapColors: AccentColor[] = ["purple", "blue", "black"];

const demoRegions: MapRegion[] = [
  { name: "USA", flag: "https://flagcdn.com/w80/us.png", salesLabel: "340 Sales", value: "$17,678" },
  { name: "Germany", flag: "https://flagcdn.com/w80/de.png", salesLabel: "220 Sales", value: "$11,420" },
  { name: "Indonesia", flag: "https://flagcdn.com/w80/id.png", salesLabel: "180 Sales", value: "$9,210" },
  { name: "France", flag: "https://flagcdn.com/w80/fr.png", salesLabel: "140 Sales", value: "$7,450" },
  { name: "Spain", flag: "https://flagcdn.com/w80/es.png", salesLabel: "98 Sales", value: "$5,120" },
];

export default function MapCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Map"
        hint="MapCard — 世界地图 + 区域销售列表。3 variants (sm / md / lg) × 3 colors (purple / blue / black)。"
      />

      {/* ============ Variants × Colors ============ */}
      <Section
        title="Variants (sm / md)"
        description="紧凑版和中号控制内部地图高度；宽度默认填满父级列。3 色全铺。"
      >
        {(["sm", "md"] as MapVariant[]).map((v) => (
          <SubSection key={v} title={`Variant: ${v}`} >
            {mapColors.map((c) => (
              <Labeled key={c} label={c}>
                <MapCard
                  variant={v}
                  color={c}
                  title="Top Region"
                  subtitle="Sales by region"
                  regions={v === "sm" ? demoRegions : demoRegions.slice(0, 4)}
                  highlights={["north-america", "oceania"]}
                  onMenuClick={() => {}}
                />
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Large variant (full-width with search) ============ */}
      <Section
        title="Variant: lg"
        description="整页大地图 + 右上浮层搜索面板，3 色。"
      >
        {mapColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`} >
            <MapCard
              variant="lg"
              color={c}
              title="Global Sales"
              subtitle="Top performing regions this month"
              regions={demoRegions}
              highlights={["north-america", "europe", "asia"]}
              onMenuClick={() => {}}
            />
          </SubSection>
        ))}
      </Section>

      {/* ============ Highlights variations ============ */}
      <Section
        title="Continent Highlights"
        description="highlights prop 按大洲组合高亮——可自由挑几个大洲着色。"
      >
        <SubSection title="Different continent combos (purple, sm)" >
          <Labeled label="Americas only">
            <MapCard
              variant="sm"
              color="purple"
              regions={demoRegions.slice(0, 3)}
              highlights={["north-america", "south-america"]}
            />
          </Labeled>
          <Labeled label="Europe + Asia">
            <MapCard
              variant="sm"
              color="purple"
              regions={demoRegions.slice(0, 3)}
              highlights={["europe", "asia"]}
            />
          </Labeled>
          <Labeled label="All continents">
            <MapCard
              variant="sm"
              color="purple"
              regions={demoRegions.slice(0, 3)}
              highlights={[
                "north-america",
                "south-america",
                "europe",
                "africa",
                "asia",
                "oceania",
              ]}
            />
          </Labeled>
        </SubSection>
      </Section>
    </div>
  );
}
