"use client";

import { useState } from "react";
import {
  Toolbar,
  ToolbarSearchInput,
  ToolbarActions,
  ToolbarKebabButton,
  ToolbarFavoriteButton,
  ToolbarPillTabs,
  PageTitleToolbar,
  Button,
  Breadcrumbs,
  type BreadcrumbColor,
  type ButtonColor,
  type ToolbarColor,
  type ToolbarPillTab,
} from "@forge-ui/react";
import { AddCircleLinear } from "solar-icon-set";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";
import { ToolbarInteractiveDemo } from "./_interactive-demo";

const toolbarColors: ToolbarColor[] = ["purple", "blue", "black"];

function mkPillTabs(activeIndex: number): ToolbarPillTab[] {
  return ["All", "Active", "Archived"].map((label, i) => ({
    label,
    active: i === activeIndex,
  }));
}

// Breadcrumbs 组件按 isLast 判定当前项，不需要 active 字段
const breadcrumbItems = [
  { label: "Dashboard", href: "#" },
  { label: "Orders", href: "#" },
  { label: "Order #302012" },
];

export default function ToolbarCasePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Toolbar"
        hint="Breadcrumbs / Toolbar / Search & Filter / Pill Tabs / PageTitleToolbar — 页面顶部工具栏组合。"
      />

      {/* ============ Breadcrumbs ============ */}
      <Section
        title="Breadcrumbs"
        description="面包屑导航。当前页（最后一项）按 color 主题高亮。3 色 × 2-4 层。"
      >
        {toolbarColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            <Labeled label="2 levels">
              <Breadcrumbs
                color={c as BreadcrumbColor}
                items={[
                  { label: "Dashboard", href: "#" },
                  { label: "Orders" },
                ]}
              />
            </Labeled>
            <Labeled label="3 levels">
              <Breadcrumbs color={c as BreadcrumbColor} items={breadcrumbItems} />
            </Labeled>
            <Labeled label="4 levels">
              <Breadcrumbs
                color={c as BreadcrumbColor}
                items={[
                  { label: "Dashboard", href: "#" },
                  { label: "Customers", href: "#" },
                  { label: "John Doe", href: "#" },
                  { label: "Orders" },
                ]}
              />
            </Labeled>
          </SubSection>
        ))}
      </Section>

      {/* ============ Search Input ============ */}
      <Section
        title="Toolbar Search Input"
        description="搜索输入框原型（静态，实际使用用 TextField 或 ToolbarSelectDropdown 搭配）。"
      >
        <SubSection title="Default">
          <ToolbarSearchInput />
        </SubSection>
        <SubSection title="Custom placeholder">
          <ToolbarSearchInput placeholder="Search by ID, customer, product..." />
        </SubSection>
      </Section>

      {/* ============ Pill Tabs ============ */}
      <Section
        title="Toolbar Pill Tabs"
        description="pill 型 tab 组合，3 色，first 激活示例。"
      >
        {toolbarColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`}>
            <Labeled label="first active">
              <ToolbarPillTabs color={c} tabs={mkPillTabs(0)} onChange={setActiveTab} />
            </Labeled>
            <Labeled label="second active">
              <ToolbarPillTabs color={c} tabs={mkPillTabs(1)} />
            </Labeled>
          </SubSection>
        ))}
      </Section>

      {/* ============ Isolated Action Buttons ============ */}
      <Section
        title="Toolbar Action Buttons"
        description="kebab / favorite 两个圆形图标按钮，跟 Toolbar 行尾 actions 搭配。"
      >
        <SubSection title="Single">
          <Labeled label="kebab">
            <ToolbarKebabButton />
          </Labeled>
          <Labeled label="favorite">
            <ToolbarFavoriteButton />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ Search & Filter Row (full, 3 colors) ============ */}
      <Section
        title="Search & Filter Row"
        description="完整工具栏组合：Row 1 = Search + Select + Datepicker + Filter + Show + Primary Button；Row 2 = Pill Tabs。3 色全铺（Figma Search & Filter 区）。"
      >
        {toolbarColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`} stack>
            <ToolbarInteractiveDemo color={c} />
          </SubSection>
        ))}
      </Section>

      {/* ============ Additional Toolbar combos ============ */}
      <Section
        title="Toolbar Layout - Other Combos"
        description="左侧 pill tabs + 搜索，右侧 favorite / kebab / primary。"
      >
        <SubSection title="With favorite + kebab (purple)" stack>
          <Toolbar
            left={
              <div className="flex items-center gap-3">
                <ToolbarPillTabs color="purple" tabs={mkPillTabs(activeTab)} onChange={setActiveTab} />
                <ToolbarSearchInput />
              </div>
            }
            right={
              <ToolbarActions>
                <ToolbarFavoriteButton />
                <ToolbarKebabButton />
                <Button color="purple" variant="primary" size="lg" iconLeft={<AddCircleLinear size={20} color="currentColor" />}>
                  Add New
                </Button>
              </ToolbarActions>
            }
          />
        </SubSection>
      </Section>

      {/* ============ Page Title Toolbar (3 colors × 3 content layouts) ============ */}
      <Section
        title="Page Title Toolbar"
        description="页面头部：title + subtitle / breadcrumbs / title only，3 色 × 3 内容组合（Figma Page Title 区）。"
      >
        {toolbarColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`} stack>
            <PageTitleToolbar
              title="Order Management"
              subtitle="View and manage all orders across your store."
              actions={
                <ToolbarActions>
                  <ToolbarFavoriteButton />
                  <Button color={c as ButtonColor} variant="primary" size="lg">
                    Export
                  </Button>
                </ToolbarActions>
              }
            />
            <PageTitleToolbar
              title="Order #302012"
              breadcrumbs={
                <Breadcrumbs color={c as BreadcrumbColor} items={breadcrumbItems} />
              }
              actions={
                <ToolbarActions>
                  <ToolbarKebabButton />
                  <Button color={c as ButtonColor} variant="secondary" size="lg">
                    Edit
                  </Button>
                  <Button color={c as ButtonColor} variant="primary" size="lg">
                    Fulfill
                  </Button>
                </ToolbarActions>
              }
            />
            <PageTitleToolbar
              title="Reports"
              actions={
                <Button color={c as ButtonColor} variant="primary" size="lg">
                  New Report
                </Button>
              }
            />
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
