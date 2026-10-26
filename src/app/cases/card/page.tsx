"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  SurfaceCard,
  StatCard,
  ProgressStatCard,
  LineChartStatCard,
  WheelChartStatCard,
  BarChartStatCard,
  ImageStatCard,
  BalanceCard,
  DebitCard,
  CreditCard,
  ProgressCard,
  HighlightCard,
  ActivityCard,
  ProjectCard,
  TaskCard,
  UserCard,
  EventCard,
  ProfileCard,
  IconButton,
  Toggle,
  type CardTheme,
  type EventCardColor,
  type FinancialTheme,
  type FinancialVariant,
  type LineChartColor,
  type ProfileCardState,
  type TaskCardColor,
} from "@forge-ui-official/core";
import {
  WalletBoldDuotone,
  ChartBoldDuotone,
  UsersGroupRoundedBoldDuotone,
  ShareLinear,
} from "@forge-ui-official/core/icons";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

type Swatch = {
  value: CardTheme;
  semantic: string;
  token: string;
  swatch: string;
};

const THEME_SWATCHES: readonly Swatch[] = [
  { value: "white", semantic: "中性", token: "--fg-grey-700", swatch: "bg-white" },
  { value: "black", semantic: "深色", token: "--fg-black", swatch: "bg-fg-black" },
  { value: "purple", semantic: "品牌", token: "--fg-violet", swatch: "bg-fg-violet" },
  { value: "blue", semantic: "信息", token: "--fg-blue", swatch: "bg-fg-blue" },
  { value: "green", semantic: "成功", token: "--fg-green-500", swatch: "bg-fg-green-500" },
  { value: "red", semantic: "警示", token: "--fg-red", swatch: "bg-fg-red" },
  { value: "yellow", semantic: "警告", token: "--fg-yellow", swatch: "bg-fg-yellow" },
  { value: "cyan", semantic: "关注", token: "--fg-cyan-500", swatch: "bg-fg-cyan-500" },
];

const FINANCIAL_VARIANTS: readonly { value: FinancialVariant; semantic: string }[] = [
  { value: "glow", semantic: "光晕" },
  { value: "gradient", semantic: "渐变" },
  { value: "flat", semantic: "平面" },
];

const profileStates: ProfileCardState[] = ["idle", "hover", "selected"];

const demoAvatars = [
  "https://placehold.co/40x40/b794f4/ffffff?text=A",
  "https://placehold.co/40x40/63b3ed/ffffff?text=B",
  "https://placehold.co/40x40/f6ad55/ffffff?text=C",
  "https://placehold.co/40x40/68d391/ffffff?text=D",
];

function chartColor(theme: CardTheme): LineChartColor {
  if (theme === "white" || theme === "black") return "purple";
  return theme;
}

function taskColor(theme: CardTheme): TaskCardColor {
  if (theme === "white" || theme === "black") return "gray";
  return theme;
}

function eventColor(theme: CardTheme): EventCardColor {
  if (theme === "white" || theme === "black") return "black";
  return theme;
}

function bankTheme(theme: CardTheme): FinancialTheme {
  if (theme === "white" || theme === "black") return "dark";
  return theme;
}

function initialsColor(theme: CardTheme): "purple" | "blue" | "green" | "orange" {
  if (theme === "purple" || theme === "blue" || theme === "green") return theme;
  if (theme === "red") return "orange";
  return "blue";
}

function profileAccent(theme: CardTheme): "purple" | "blue" | "black" {
  if (theme === "blue") return "blue";
  if (theme === "white" || theme === "black") return "black";
  return "purple";
}

function ThemeSwatches({
  value,
  onChange,
}: {
  value: CardTheme;
  onChange: (value: CardTheme) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, THEME_SWATCHES.findIndex((item) => item.value === value));
  const current = THEME_SWATCHES[index];

  function select(next: number) {
    const item = THEME_SWATCHES[next];
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
      select(THEME_SWATCHES.length - 1);
      return;
    }
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    select((index + delta + THEME_SWATCHES.length) % THEME_SWATCHES.length);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-2">
      <div
        role="radiogroup"
        aria-label="卡片主题"
        aria-orientation="horizontal"
        className="flex items-center"
        style={{ gap: 8 }}
        onKeyDown={onKeyDown}
      >
        {THEME_SWATCHES.map((item, itemIndex) => {
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
                outline: selected
                  ? `2px solid var(${item.token})`
                  : item.value === "white"
                    ? "1px solid var(--fg-grey-300)"
                    : "none",
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

function Frame({ children }: { children: ReactNode }) {
  return <div className="w-fit max-w-full">{children}</div>;
}

export default function CardCasePage() {
  const [theme, setTheme] = useState<CardTheme>("white");
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [bankVariant, setBankVariant] = useState<FinancialVariant>("glow");
  const accent = chartColor(theme);
  const bank = bankTheme(theme);

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="卡片"
        hint="每种卡片只展示一个结构。主题从上方色板切换，所有示例同时更新。"
      />

      <Section
        title="主题"
        description="中性、深色、品牌、信息、成功、警示、警告、关注。左右方向键切换。"
      >
        <ThemeSwatches value={theme} onChange={setTheme} />
      </Section>

      <Section
        title="Surface Card"
        description="通用白底内容面板：标题 / 副标题 / action / footer。用于业务 section，不用 ChartCard 伪装普通面板。"
      >
        <SubSection title="Variants">
          <Labeled label="title + action">
            <SurfaceCard
              title="Approval context"
              subtitle="Reviewer signal, downstream impact, and next action."
              action={
                <IconButton aria-label="Share" size="sm" variant="tertiary">
                  <ShareLinear size={16} color="currentColor" />
                </IconButton>
              }
              className="w-full max-w-xl"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-fg-grey-700">Risk</p>
                  <p className="mt-1 text-xl font-semibold text-fg-black">High</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-fg-grey-700">Owner</p>
                  <p className="mt-1 text-xl font-semibold text-fg-black">Elena</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-fg-grey-700">Due</p>
                  <p className="mt-1 text-xl font-semibold text-fg-black">Today</p>
                </div>
              </div>
            </SurfaceCard>
          </Labeled>
          <Labeled label="no header">
            <SurfaceCard padding="sm" className="w-full max-w-xl">
              <p className="text-sm leading-5 text-fg-grey-700">
                Compact neutral surface for filters, empty states, or secondary page sections.
              </p>
            </SurfaceCard>
          </Labeled>
        </SubSection>
      </Section>

      <Section title="Regular Statistic Card" description="图标、趋势和更多操作在同一张统计卡上。警示主题显示下降趋势。">
        <Frame>
          <StatCard
            title="Total Sale"
            value="$9,256.09"
            trend="2.1%"
            trendDirection={theme === "red" ? "down" : "up"}
            subtitle="vs. last week"
            theme={theme}
            icon={<ChartBoldDuotone size={24} color="currentColor" />}
            onKebabClick={() => {}}
          />
        </Frame>
      </Section>

      <Section title="Progress Statistic Card" description="统计卡下方带进度条。">
        <Frame>
          <ProgressStatCard
            title="Orders"
            value="1,245"
            trend="4.3%"
            theme={theme}
            progressValue={65}
            progressColor={theme === "white" || theme === "black" ? "purple" : theme}
          />
        </Frame>
      </Section>

      <Section title="Line Chart Statistic Card" description="右侧迷你折线跟随当前主题。">
        <Frame>
          <LineChartStatCard
            title="Revenue"
            value="$12.4k"
            trend="8.7%"
            theme={theme}
            chartColor={accent}
          />
        </Frame>
      </Section>

      <Section title="Wheel Chart Statistic Card" description="右侧圆环进度跟随当前主题。">
        <Frame>
          <WheelChartStatCard
            title="Completion"
            value="72%"
            trend="3.2%"
            theme={theme}
            wheelPercent={72}
            wheelColor={accent}
          />
        </Frame>
      </Section>

      <Section title="Bar Chart Statistic Card" description="右侧柱状图跟随当前主题。">
        <Frame>
          <BarChartStatCard
            title="Daily Sales"
            value="$2.1k"
            trend="12%"
            theme={theme}
            bars={[10, 22, 30, 40, 25]}
            barColor={accent}
          />
        </Frame>
      </Section>

      <Section title="Image Statistic Card" description="大面积背景和头像组，用作活动或合集卡。">
        <Frame>
          <ImageStatCard
            title="Marketing ROI"
            subtitle="Jul 2024 - Today"
            value="$18,420"
            trend="12.5%"
            trendSubtitle="+$150 today"
            theme={theme}
            avatars={demoAvatars}
            onKebabClick={() => {}}
          />
        </Frame>
      </Section>

      <Section title="Balance Card" description="余额、卡号和转账操作。隐藏余额只切换数字，不另做一套主题。">
        <label className="flex items-center gap-2 text-sm font-medium text-fg-grey-900">
          隐藏余额
          <Toggle checked={balanceHidden} onChange={setBalanceHidden} ariaLabel="隐藏余额" color="black" size="sm" />
        </label>
        <Frame>
          <BalanceCard
            balance="$9,256.09"
            balanceHidden={balanceHidden}
            trend="2.1%"
            subtitle="vs. last month"
            theme={theme}
            cardNumber="**** 9090"
          />
        </Frame>
      </Section>

      <Section title="Debit & Credit Card" description="借记卡和信用卡各一张。中性与深色使用深色卡面，样式在光晕、渐变和平面之间切换。">
        <div
          role="radiogroup"
          aria-label="银行卡样式"
          className="flex flex-wrap gap-2"
          onKeyDown={(event) => {
            const key = event.key;
            if (key !== "ArrowLeft" && key !== "ArrowRight") return;
            event.preventDefault();
            const index = FINANCIAL_VARIANTS.findIndex((item) => item.value === bankVariant);
            const delta = key === "ArrowLeft" ? -1 : 1;
            const nextIndex = (index + delta + FINANCIAL_VARIANTS.length) % FINANCIAL_VARIANTS.length;
            setBankVariant(FINANCIAL_VARIANTS[nextIndex].value);
            event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
          }}
        >
          {FINANCIAL_VARIANTS.map((item) => {
            const selected = item.value === bankVariant;
            return (
              <button
                key={item.value}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={item.semantic}
                tabIndex={selected ? 0 : -1}
                onClick={() => setBankVariant(item.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${selected ? "bg-fg-black text-white" : "bg-white text-fg-grey-700 outline outline-1 outline-fg-grey-200"}`}
              >
                {item.semantic}
              </button>
            );
          })}
        </div>
        <SubSection title="借记卡">
          <Frame>
            <DebitCard balance="$9,256.09" cardNumber="9090" expiry="07/25" theme={bank} variant={bankVariant} />
          </Frame>
        </SubSection>
        <SubSection title="信用卡">
          <Frame>
            <CreditCard cardNumber="4242424242429090" holderName="John Doe" expiry="07/25" theme={bank} variant={bankVariant} />
          </Frame>
        </SubSection>
      </Section>

      <Section title="Progress Card" description="大圆环和分项明细。环色跟随当前主题。">
        <Frame>
          <ProgressCard
            title="Goals"
            value="72%"
            subtitle="On track"
            theme={theme}
            progress={72}
            progressColor={theme === "white" ? "#7c3aed" : "#ffffff"}
            items={[
              { label: "Done", value: "24", color: "#10b981" },
              { label: "In Progress", value: "8", color: "#f59e0b" },
              { label: "Not Started", value: "2", color: "#ef4444" },
            ]}
          />
        </Frame>
      </Section>

      <Section title="Project Card" description="有标识和无标识是两种项目卡结构，不按主题复制。">
        <SubSection title="Variants">
          <Labeled label="with logo + progress">
            <ProjectCard
              logo="https://placehold.co/48x48/b794f4/ffffff?text=P"
              title="Marketing Website Redesign"
              description="Revamp the landing page with new brand."
              labelText="Design"
              labelColor="purple"
              progress={65}
              progressColor="blue"
              avatars={demoAvatars}
              date="Due Aug 15"
              onMenuClick={() => {}}
            />
          </Labeled>
          <Labeled label="no logo + green">
            <ProjectCard
              title="Mobile App v2"
              description="Ship the new onboarding flow."
              labelText="Engineering"
              labelColor="green"
              progress={40}
              progressColor="green"
              avatars={demoAvatars.slice(0, 3)}
              date="Due Sep 10"
              onMenuClick={() => {}}
            />
          </Labeled>
        </SubSection>
      </Section>

      <Section title="Task Card" description="标签和进度条跟随当前主题。中性与深色使用灰色。">
        <Frame>
          <TaskCard
            title="Ship beta release"
            description="Roll out to 10% of users."
            labelText="Priority"
            labelColor={taskColor(theme)}
            progress={60}
            progressColor={taskColor(theme)}
            avatars={demoAvatars.slice(0, 2)}
            date="Tomorrow"
            onMenuClick={() => {}}
          />
        </Frame>
      </Section>

      <Section title="User Card" description="头像统计、字母头像和选中态是三种结构。字母颜色能对应时跟随主题。">
        <SubSection title="Variants">
          <Labeled label="avatar + stats">
            <UserCard
              avatar="https://placehold.co/80x80/b794f4/ffffff?text=JD"
              name="John Doe"
              subtitle={<span className="text-xs text-fg-grey-700">Product Designer</span>}
              stats={[
                { label: "Projects", value: "24" },
                { label: "Tasks", value: "156" },
              ]}
              onMenuClick={() => {}}
            />
          </Labeled>
          <Labeled label="initials">
            <UserCard
              initials="AB"
              initialsColor={initialsColor(theme)}
              name="Ada Byron"
              subtitle={<span className="text-xs text-fg-grey-700">Engineer</span>}
            />
          </Labeled>
          <Labeled label="checked (selected)">
            <UserCard
              avatar="https://placehold.co/80x80/63b3ed/ffffff?text=LB"
              name="Linda Blair"
              subtitle={<span className="text-xs text-fg-grey-700">Operations</span>}
              checked
            />
          </Labeled>
        </SubSection>
      </Section>

      <Section title="Event Card" description="日程卡底部强调色跟随当前主题。">
        <Frame>
          <EventCard
            title="Weekly Standup"
            timeRange="10:00 - 10:30 AM"
            color={eventColor(theme)}
            avatars={demoAvatars.slice(0, 3)}
          />
        </Frame>
      </Section>

      <Section title="Profile Card" description="默认底和彩色底各保留一组状态。强调色在品牌、信息和深色之间跟随主题。">
        <SubSection title="States">
          {profileStates.map((state) => (
            <Labeled key={state} label={state}>
              <ProfileCard
                avatar="https://placehold.co/40x40/b794f4/ffffff?text=JD"
                name="John Doe"
                subtitle="Product Designer"
                state={state}
                accent={profileAccent(theme)}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="On colored bg">
          <div className="flex min-w-0 max-w-full flex-wrap items-start gap-3 rounded-xl bg-fg-violet p-6">
            {profileStates.map((state) => (
              <ProfileCard
                key={state}
                avatar="https://placehold.co/40x40/ffffff/4c1d95?text=JD"
                name="John Doe"
                subtitle="Product Designer"
                state={state}
                surface="onColoredBg"
              />
            ))}
          </div>
        </SubSection>
      </Section>

      <Section title="Highlight Card" description="主图、标注和推荐列表。">
        <Frame>
          <HighlightCard
            title="Featured Product"
            theme={theme}
            image="https://placehold.co/280x280/ffffff/6d28d9?text=Product"
            annotations={[
              { label: "Material", value: "Leather", position: { top: "10%", left: "10%" } },
              { label: "Color", value: "Brown", position: { bottom: "30%", right: "10%" } },
            ]}
            products={[
              { image: "https://placehold.co/40x40/b794f4/ffffff?text=1", name: "Bag A", subtitle: "Leather", value: "$120" },
              { image: "https://placehold.co/40x40/63b3ed/ffffff?text=2", name: "Bag B", subtitle: "Canvas", value: "$89" },
            ]}
          />
        </Frame>
      </Section>

      <Section title="Activity Card" description="时间线卡：icon + 标题 + 元数据。">
        <Frame>
          <ActivityCard
            icon={<WalletBoldDuotone size={20} color="#7c3aed" />}
            headerText="Payment Received"
            datetime="2 hours ago"
            avatar="https://placehold.co/40x40/b794f4/ffffff?text=JD"
            title="John Doe paid $1,250"
            description="Invoice #302012 for Marketing services"
            metadata={[
              { label: "Amount", value: "$1,250" },
              { label: "Method", value: "Mastercard" },
              { label: "Status", value: "Completed" },
            ]}
            onMenuClick={() => {}}
          />
        </Frame>
      </Section>

      <Section title="Custom Action Slot" description="action 可以替换默认的更多操作。">
        <Frame>
          <StatCard
            title="Team Size"
            value="48"
            theme={theme}
            size="lg"
            icon={<UsersGroupRoundedBoldDuotone size={24} color="currentColor" />}
            action={
              <IconButton variant="ghost" shape="square" size="sm" aria-label="分享">
                <ShareLinear size={18} color="currentColor" />
              </IconButton>
            }
          />
        </Frame>
      </Section>

      <Section title="卡片动效" description="层叠和光照倾斜。移动指针可以看倾斜卡的光。">
        <SubSection title="效果">
          <Labeled label="层叠">
            <SurfaceCard effect="layered" title="设计札记" subtitle="6 分钟" className="w-72">
              <p className="text-sm text-fg-grey-700">恰当的留白，让复杂界面更易理解。</p>
            </SurfaceCard>
          </Labeled>
          <Labeled label="光照倾斜">
            <SurfaceCard effect="tilt" title="产品动态" subtitle="今天 · Forge 团队" className="w-72">
              <p className="text-sm text-fg-grey-700">把指针移到卡片上，查看光照跟随。</p>
            </SurfaceCard>
          </Labeled>
        </SubSection>
      </Section>
    </div>
  );
}
