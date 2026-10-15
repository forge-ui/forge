"use client";

import {
  Breadcrumbs,
  TopBar,
  type PageHeaderColor,
} from "@forge-ui-official/core";
import { DemoPageHeader } from "../../components/page-header/ask-ai-example";
import { Logout3Linear } from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const HEADER_COLORS = ["purple", "blue", "black"] as const;

const PROFILE = {
  name: "张明",
  role: "经理",
  avatar: "https://i.pravatar.cc/100?img=12",
};

const FLAG = (
  <img
    className="w-5 h-5 rounded-full object-cover"
    src="https://flagcdn.com/w40/us.png"
    alt="lang"
  />
);

// 8-row matrix: leftMode × showAddButton × showProfile (matches Figma "Search & Widget")
const SEARCH_ROWS: {
  leftMode: "search" | "hamburger";
  showAddButton: boolean;
  showProfile: boolean;
}[] = [
  { leftMode: "search", showAddButton: true, showProfile: true },
  { leftMode: "search", showAddButton: false, showProfile: true },
  { leftMode: "search", showAddButton: true, showProfile: false },
  { leftMode: "search", showAddButton: false, showProfile: false },
  { leftMode: "hamburger", showAddButton: true, showProfile: true },
  { leftMode: "hamburger", showAddButton: false, showProfile: true },
  { leftMode: "hamburger", showAddButton: true, showProfile: false },
  { leftMode: "hamburger", showAddButton: false, showProfile: false },
];

// 3-layout matrix: showBackButton × titleAvatar (matches Figma "Page Title")
const TITLE_ROWS: {
  showBackButton: boolean;
  titleAvatar?: string;
}[] = [
  { showBackButton: true },
  { showBackButton: false },
  { showBackButton: true, titleAvatar: PROFILE.avatar },
];

export default function PageHeaderCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="页面顶栏"
        hint="组织页面标题、搜索、通知和常用操作，明确当前位置。"
      />

      <Section title="Breadcrumbs" description="Colors: purple, blue, black">
        <SubSection title="全部颜色">
          {HEADER_COLORS.map((c) => (
            <Labeled key={c} label={c}>
              <Breadcrumbs
                color={c}
                items={[
                  { label: "首页", href: "#" },
                  { label: "项目", href: "#" },
                  { label: "当前页面" },
                ]}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      <Section title="TopBar" description="Colors: purple, blue, green">
        <SubSection title="全部颜色">
          {(["purple", "blue", "green"] as const).map((c) => (
            <div key={c} className="w-full">
              <Labeled label={c}>
                <div className="w-full">
                  <TopBar value={60} color={c} />
                </div>
              </Labeled>
            </div>
          ))}
        </SubSection>
      </Section>

      <Section
        title="PageHeader · Search & Widget"
        description="原有搜索顶栏加入 Ask AI；点击打开右侧抽屉，标题栏可进独立全屏层。3 colors × 8 layouts。"
      >
        {HEADER_COLORS.map((color) => (
          <SubSection key={color} title={color}>
            <div className="w-full flex flex-col gap-3">
              {SEARCH_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="w-full bg-white rounded-xl border border-fg-grey-200 overflow-hidden"
                >
                  <DemoPageHeader
                    variant="search"
                    color={color as PageHeaderColor}
                    leftMode={row.leftMode}
                    showCalendar
                    notifications={99}
                    messages={99}
                    languageFlag={FLAG}
                    showAddButton={row.showAddButton}
                    showProfile={row.showProfile}
                    profile={PROFILE}
                  />
                </div>
              ))}
            </div>
          </SubSection>
        ))}
      </Section>

      <Section
        title="PageHeader · Page Title"
        description="原有标题顶栏加入 Ask AI，主次操作保留。3 colors × 3 layouts。"
      >
        {HEADER_COLORS.map((color) => (
          <SubSection key={color} title={color}>
            <div className="w-full flex flex-col gap-3">
              {TITLE_ROWS.map((row, i) => (
                <div
                  key={i}
                  className="w-full bg-white rounded-xl border border-fg-grey-200 overflow-hidden"
                >
                  <DemoPageHeader
                    variant="title"
                    color={color as PageHeaderColor}
                    title="页面标题"
                    showBackButton={row.showBackButton}
                    titleAvatar={row.titleAvatar}
                    showDatePicker
                    datePickerLabel="选择日期"
                    showFilters
                    filtersLabel="筛选条件"
                    showKebab
                    showFavorite
                    secondaryAction={{
                      label: "轻量按钮",
                      icon: <Logout3Linear size={16} color="currentColor" />,
                    }}
                    primaryAction={{ label: "主要按钮" }}
                  />
                </div>
              ))}
            </div>
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
