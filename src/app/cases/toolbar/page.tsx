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
  type ToolbarColor,
  type ToolbarPillTab,
} from "@forge-ui-official/core";
import { AddCircleLinear } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";
import { ToolbarInteractiveDemo } from "./_interactive-demo";

const toolbarColors: ToolbarColor[] = ["purple", "blue", "black"];

function mkPillTabs(activeIndex: number): ToolbarPillTab[] {
  return ["全部", "使用中", "已归档"].map((label, i) => ({
    label,
    active: i === activeIndex,
  }));
}

// Breadcrumbs 组件按 isLast 判定当前项，不需要 active 字段
const breadcrumbItems = [
  { label: "工作台", href: "#" },
  { label: "订单", href: "#" },
  { label: "订单 #302012" },
];

export default function ToolbarCasePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="工具栏"
        hint="集中放置搜索、筛选、视图切换和页面操作。"
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
                  { label: "工作台", href: "#" },
                  { label: "订单" },
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
                  { label: "工作台", href: "#" },
                  { label: "客户", href: "#" },
                  { label: "张明", href: "#" },
                  { label: "订单" },
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
        <SubSection title="默认">
          <ToolbarSearchInput />
        </SubSection>
        <SubSection title="自定义占位文字">
          <ToolbarSearchInput placeholder="搜索编号、客户或商品…" />
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
        <SubSection title="单项">
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
                <ToolbarPillTabs color="blue" tabs={mkPillTabs(activeTab)} onChange={setActiveTab} />
                <ToolbarSearchInput />
              </div>
            }
            right={
              <ToolbarActions>
                <ToolbarFavoriteButton />
                <ToolbarKebabButton />
                <Button color="blue" variant="primary" size="lg" iconLeft={<AddCircleLinear size={20} color="currentColor" />}>
                  新增
                </Button>
              </ToolbarActions>
            }
          />
        </SubSection>
      </Section>

      {/* ============ Page Title Toolbar fixed variants ============ */}
      <Section
        title="Page Title Toolbar"
        description="页面头部固定预设：overview / collection / detail / action。业务页选择变体并传入结构化面包屑和操作，不重排标题区。"
      >
        {toolbarColors.map((c) => (
          <SubSection key={c} title={`Color: ${c}`} stack>
            <PageTitleToolbar
              variant="overview"
              color={c}
              title="销售概览"
              subtitle="了解销售进展，掌握今日重点工作。"
              breadcrumbItems={[{ label: "工作台" }, { label: "销售概览" }]}
              dateAction={{ label: "本月", enablePopover: true }}
              primaryAction={{ label: "新增线索", icon: <AddCircleLinear size={20} /> }}
            />
            <PageTitleToolbar
              variant="collection"
              color={c}
              title="订单"
              breadcrumbItems={[{ label: "工作台", href: "#" }, { label: "订单" }]}
              secondaryAction={{ label: "导出" }}
              primaryAction={{ label: "新建订单", icon: <AddCircleLinear size={20} /> }}
            />
            <PageTitleToolbar
              variant="detail"
              color={c}
              title="订单 #302012"
              breadcrumbItems={breadcrumbItems}
              menuAction={{ ariaLabel: "More order actions" }}
              secondaryAction={{ label: "编辑" }}
              primaryAction={{ label: "发货" }}
            />
            <PageTitleToolbar
              variant="action"
              color={c}
              title="创建订单"
              breadcrumbItems={[{ label: "订单", href: "#" }, { label: "创建订单" }]}
              secondaryAction={{ label: "取消" }}
              primaryAction={{ label: "保存订单", type: "submit", form: "toolbar-case-form" }}
            />
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
