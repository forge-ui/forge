"use client";

import {
  TabBar,
  ButtonGroup,
  type TabBarColor,
  type ButtonGroupColor,
  type ButtonGroupShape,
  type TabItem,
  type ButtonGroupItem,
} from "@forge-ui/react";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const tabColors: TabBarColor[] = ["purple", "blue", "black"];
const btnColors: ButtonGroupColor[] = ["purple", "blue", "black"];
const btnShapes: ButtonGroupShape[] = ["rounded", "pill"];

const inGroupCounts = [2, 3, 4, 5, 6, 7];

// TabBar 的 `active` 在 item 上，跟 ButtonGroup 的 activeIndex 不同。
const mkTabs = (count: number, activeIndex = 0): TabItem[] =>
  Array.from({ length: count }, (_, i) => ({
    label: "Text Here",
    active: i === activeIndex,
  }));

const mkItems = (count: number): ButtonGroupItem[] =>
  Array.from({ length: count }, () => ({ label: "Text Here" }));

export default function TabCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Tab"
        hint="TabBar / ButtonGroup — 下划线标签栏 + pill 分段控制器。"
      />

      {/* ============ TabBar - Single ============ */}
      <Section
        title="Tab Bar - Single"
        description="下划线样式，单独 tab 的 active / inactive。3 色。"
      >
        {tabColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            <Labeled label="active">
              <TabBar color={c} tabs={[{ label: "Text Here", active: true }]} />
            </Labeled>
            <Labeled label="inactive">
              <TabBar color={c} tabs={[{ label: "Text Here" }]} />
            </Labeled>
          </SubSection>
        ))}
      </Section>

      {/* ============ TabBar - In Group ============ */}
      <Section
        title="Tab Bar - In Group"
        description="多 tab 组合，first 激活，其余 inactive。3 色 × 2-7 tabs。"
      >
        {tabColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            {inGroupCounts.map((n) => (
              <Labeled key={n} label={`${n} tabs`}>
                <TabBar color={c} tabs={mkTabs(n)} />
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ TabBar - With Badge (Kit extra) ============ */}
      <Section
        title="Tab Bar - With Badge"
        description="Kit 扩展：tab 右侧可挂数字徽章，active 时徽章跟主题色（Figma 未展示此变体）。"
      >
        <SubSection title="Purple">
          <Labeled label="active first">
            <TabBar
              color="purple"
              tabs={[
                { label: "All", active: true, badge: 24 },
                { label: "Pending", badge: 8 },
                { label: "Done", badge: 12 },
              ]}
            />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Page Tab (wide, surface="page") ============ */}
      <Section
        title="Page Tab"
        description='整页 tab 栏，白底 + 内边距 + 底部分隔线（TabBar surface="page"）。3 色 × 2-7 tabs。'
      >
        {tabColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`} stack>
            {inGroupCounts.map((n) => (
              <TabBar
                key={n}
                color={c}
                surface="page"
                tabs={mkTabs(n)}
              />
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Button Group - Single Tab ============ */}
      <Section
        title="Button Group - Single Tab"
        description="pill 形单个 tab，3 色 × 2 shape × active / inactive。"
      >
        {btnShapes.map((sh) => (
          <SubSection key={sh} title={`Shape: ${sh}`}>
            {btnColors.map((c) => (
              <Labeled key={`${c}-active`} label={`${c} active`}>
                <ButtonGroup
                  color={c}
                  shape={sh}
                  items={[{ label: "Text Here" }]}
                  activeIndex={0}
                />
              </Labeled>
            ))}
            {btnColors.map((c) => (
              <Labeled key={`${c}-inactive`} label={`${c} inactive`}>
                <ButtonGroup
                  color={c}
                  shape={sh}
                  items={[{ label: "Text Here" }]}
                  activeIndex={-1}
                />
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Button Group - In Group (2-col grid) ============ */}
      <Section
        title="Button Group - In Group"
        description="pill 形分段控制器，3 色 × 2 shape × 2-7 items。按宽度自然换行。"
      >
        {btnColors.map((c) => (
          <div key={c} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-fg-grey-700 uppercase tracking-fg">
              Color: {c}
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-4 items-start">
              {btnShapes.flatMap((sh) =>
                inGroupCounts.map((n) => (
                  <Labeled key={`${sh}-${n}`} label={`${sh} / ${n}`}>
                    <ButtonGroup color={c} shape={sh} items={mkItems(n)} />
                  </Labeled>
                )),
              )}
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}
