"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  Breadcrumbs,
  Toggle,
  TopBar,
  type PageHeaderColor,
  type TopBarColor,
} from "@forge-ui-official/core";
import { Logout3Linear } from "@forge-ui-official/core/icons";
import { DemoPageHeader } from "../../components/page-header/ask-ai-example";
import { PageHeading, Section, SubSection } from "../_shared";

type Swatch<T extends string> = {
  value: T;
  semantic: string;
  token: string;
  swatch: string;
};

const HEADER_SWATCHES: readonly Swatch<PageHeaderColor>[] = [
  { value: "purple", semantic: "品牌", token: "--fg-violet", swatch: "bg-fg-violet" },
  { value: "blue", semantic: "信息", token: "--fg-blue", swatch: "bg-fg-blue" },
  { value: "black", semantic: "中性", token: "--fg-black", swatch: "bg-fg-black" },
];

const TOPBAR_SWATCHES: readonly Swatch<TopBarColor>[] = [
  { value: "purple", semantic: "品牌", token: "--fg-violet", swatch: "bg-fg-violet" },
  { value: "blue", semantic: "信息", token: "--fg-blue", swatch: "bg-fg-blue" },
  { value: "green", semantic: "完成", token: "--fg-green-500", swatch: "bg-fg-green-500" },
];

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

const CRUMB_ITEMS = [
  { label: "首页", href: "#" },
  { label: "项目", href: "#" },
  { label: "当前页面" },
];

function SemanticSwatches<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  options: readonly Swatch<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, options.findIndex((item) => item.value === value));
  const current = options[index] ?? options[0];

  function select(next: number) {
    const item = options[next];
    if (!item) return;
    onChange(item.value);
    buttons.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    if (key === "Home") {
      select(0);
      return;
    }
    if (key === "End") {
      select(options.length - 1);
      return;
    }
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    select((index + delta + options.length) % options.length);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div
        role="radiogroup"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex items-center"
        style={{ gap: 8 }}
        onKeyDown={onKeyDown}
      >
        {options.map((item, itemIndex) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                buttons.current[itemIndex] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={item.semantic}
              title={item.semantic}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(itemIndex)}
              className={`shrink-0 cursor-pointer rounded-full border-0 p-0 ${item.swatch}`}
              style={{
                width: 24,
                height: 24,
                outline: selected ? `2px solid var(${item.token})` : "none",
                outlineOffset: selected ? 2 : 0,
                transform: selected ? "scale(1.1)" : "none",
                transition: "none",
              }}
            />
          );
        })}
      </div>
      <p className="text-sm text-fg-grey-700" aria-live="polite">
        当前：{current.semantic}
      </p>
    </div>
  );
}

function AttributeSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-fg-grey-900">
      {label}
      <Toggle checked={checked} onChange={onChange} ariaLabel={label} color="black" size="sm" />
    </label>
  );
}

export default function PageHeaderCasePage() {
  const [crumbColor, setCrumbColor] = useState<PageHeaderColor>("purple");
  const [topColor, setTopColor] = useState<TopBarColor>("purple");
  const [headerColor, setHeaderColor] = useState<PageHeaderColor>("purple");
  const [showAddButton, setShowAddButton] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showBackButton, setShowBackButton] = useState(true);
  const [showTitleAvatar, setShowTitleAvatar] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="页面顶栏"
        hint="组织页面标题、搜索、通知和常用操作，明确当前位置。"
      />

      <Section title="Breadcrumbs" description="用主色表示可返回的路径，当前页保持中性。">
        <SemanticSwatches
          label="面包屑主色"
          options={HEADER_SWATCHES}
          value={crumbColor}
          onChange={setCrumbColor}
        />
        <Breadcrumbs color={crumbColor} items={CRUMB_ITEMS} />
      </Section>

      <Section title="TopBar" description="进度条只切换主色，宽度保持当前进度。">
        <SemanticSwatches
          label="进度主色"
          options={TOPBAR_SWATCHES}
          value={topColor}
          onChange={setTopColor}
        />
        <div className="w-full">
          <TopBar value={60} color={topColor} className="[&>div]:transition-none" />
        </div>
      </Section>

      <Section
        title="PageHeader"
        description="下面只保留搜索、菜单和标题三种结构。主色、新增、资料、返回和头像由上方控件切换，三个示例同时更新。"
      >
        <div className="flex flex-col gap-4">
          <SemanticSwatches
            label="顶栏主色"
            options={HEADER_SWATCHES}
            value={headerColor}
            onChange={setHeaderColor}
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <AttributeSwitch label="新增按钮" checked={showAddButton} onChange={setShowAddButton} />
            <AttributeSwitch label="个人资料" checked={showProfile} onChange={setShowProfile} />
            <AttributeSwitch label="返回" checked={showBackButton} onChange={setShowBackButton} />
            <AttributeSwitch label="标题头像" checked={showTitleAvatar} onChange={setShowTitleAvatar} />
          </div>
        </div>

        <SubSection title="搜索" stack>
          <div className="w-full overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
            <DemoPageHeader
              variant="search"
              color={headerColor}
              leftMode="search"
              showCalendar
              notifications={99}
              messages={99}
              languageFlag={FLAG}
              showAddButton={showAddButton}
              showProfile={showProfile}
              profile={PROFILE}
            />
          </div>
        </SubSection>

        <SubSection title="菜单" stack>
          <div className="w-full overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
            <DemoPageHeader
              variant="search"
              color={headerColor}
              leftMode="hamburger"
              showCalendar
              notifications={99}
              messages={99}
              languageFlag={FLAG}
              showAddButton={showAddButton}
              showProfile={showProfile}
              profile={PROFILE}
            />
          </div>
        </SubSection>

        <SubSection title="标题" stack>
          <div className="w-full overflow-hidden rounded-xl border border-fg-grey-200 bg-white">
            <DemoPageHeader
              variant="title"
              color={headerColor}
              title="页面标题"
              showBackButton={showBackButton}
              titleAvatar={showTitleAvatar ? PROFILE.avatar : undefined}
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
        </SubSection>
      </Section>
    </div>
  );
}
