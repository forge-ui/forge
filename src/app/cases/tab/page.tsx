"use client";

import { useState } from "react";
import {
  TabBar,
  TabsContent,
  SurfaceCard,
  Checkbox,
  ButtonGroup,
  type TabBarColor,
  type ButtonGroupColor,
  type ButtonGroupShape,
  type TabItem,
  type ButtonGroupItem,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const tabColors: TabBarColor[] = ["purple", "blue", "black"];
const btnColors: ButtonGroupColor[] = ["purple", "blue", "black"];
const btnShapes: ButtonGroupShape[] = ["rounded", "pill"];

const inGroupCounts = [4];

// TabBar 的 `active` 在 item 上，跟 ButtonGroup 的 activeIndex 不同。
const mkTabs = (count: number, activeIndex = 0): TabItem[] =>
  Array.from({ length: count }, (_, i) => ({
    label: "示例文本",
    active: i === activeIndex,
  }));

const mkItems = (count: number): ButtonGroupItem[] =>
  Array.from({ length: count }, () => ({ label: "示例文本" }));

export default function TabCasePage() {
  const [active, setActive] = useState(0);
  const [withoutMotion, setWithoutMotion] = useState(false);
  const panels = [
    { label: "概览", title: "项目概览", text: "查看项目进度与当前工作安排。" },
    { label: "成员", title: "项目成员", text: "查看团队成员与协作分工情况。" },
    { label: "设置", title: "项目设置", text: "查看项目配置与通知接收方式。" },
  ];
  const motion = withoutMotion ? "none" : "auto";
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="页签与切换"
        hint="在同一页面中切换内容、分类或视图。"
      />

      <Section title="TabsContent 原地淡入" description="点击标签，或使用左右方向键、Home / End 切换；可快速连续操作。内容仅淡入 180ms，系统减少动态效果时直接显示。">
        <label className="flex items-center gap-2 text-sm text-fg-grey-700">
          <Checkbox checked={withoutMotion} onChange={setWithoutMotion} aria-label="关闭内容动效" />
          关闭内容动效（motion=&quot;none&quot;）
        </label>
        <TabBar ariaLabel="内容切换演示" tabs={panels.map((panel, index) => ({ label: panel.label, active: active === index }))} onChange={setActive} motion={motion} />
        <TabsContent activeKey={active} ariaLabel={`${panels[active].label}内容`} motion={motion}>
          <SurfaceCard title={panels[active].title}>
            <p className="text-sm leading-6 text-fg-black">{panels[active].text}</p>
          </SurfaceCard>
        </TabsContent>
        <p className="text-sm text-fg-grey-700">布局参照线：切换时本行、卡片边缘与文字尺寸保持稳定。</p>
      </Section>

      {/* ============ TabBar - Single ============ */}
      <Section
        title="Tab Bar - Single"
        description="下划线样式，单独 tab 的 active / inactive。3 色。"
      >
        {tabColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            <Labeled label="active">
              <TabBar color={c} tabs={[{ label: "示例文本", active: true }]} />
            </Labeled>
            <Labeled label="inactive">
              <TabBar color={c} tabs={[{ label: "示例文本" }]} />
            </Labeled>
          </SubSection>
        ))}
      </Section>

      {/* ============ TabBar - In Group ============ */}
      <Section
        title="Tab Bar - In Group"
        description="多 tab 组合，first 激活，其余 inactive。3 色 × 4 个页签。"
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
        <SubSection title="紫色">
          <Labeled label="active first">
            <TabBar
              color="blue"
              tabs={[
                { label: "全部", active: true, badge: 24 },
                { label: "待处理", badge: 8 },
                { label: "已完成", badge: 12 },
              ]}
            />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Page Tab (wide, surface="page") ============ */}
      <Section
        title="页面页签"
        description='整页 tab 栏，白底 + 内边距 + 底部分隔线（TabBar surface="page"）。3 色 × 4 个页签。'
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
                  items={[{ label: "示例文本" }]}
                  activeIndex={0}
                />
              </Labeled>
            ))}
            {btnColors.map((c) => (
              <Labeled key={`${c}-inactive`} label={`${c} inactive`}>
                <ButtonGroup
                  color={c}
                  shape={sh}
                  items={[{ label: "示例文本" }]}
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
        description="pill 形分段控制器，3 色 × 2 shape × 4 个选项。按宽度自然换行。"
      >
        {btnColors.map((c) => (
          <div key={c} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-fg-grey-700 uppercase tracking-fg">
              颜色： {c}
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
