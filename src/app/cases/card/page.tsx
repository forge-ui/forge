"use client";

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
  ALL_CARD_THEMES,
  IconButton,
  type CardTheme,
  type LineChartColor,
  type WheelColor,
  type BarColor,
  type FinancialTheme,
  type FinancialVariant,
  type EventCardColor,
  type ProfileCardState,
} from "@forge-ui-official/core";
import {
  WalletBoldDuotone,
  ChartBoldDuotone,
  CartLargeBoldDuotone,
  UsersGroupRoundedBoldDuotone,
  ShareLinear,
} from "solar-icon-set";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const themes: CardTheme[] = [...ALL_CARD_THEMES];
const financialThemes: FinancialTheme[] = [
  "dark", "purple", "blue", "yellow", "cyan", "green", "orange", "red",
];
const financialVariants: FinancialVariant[] = ["glow", "gradient", "flat"];
const eventColors: EventCardColor[] = [
  "purple", "blue", "black", "red", "yellow", "green", "cyan", "orange",
];
const profileStates: ProfileCardState[] = ["idle", "hover", "selected"];

const lineColors: LineChartColor[] = [
  "purple", "blue", "green", "red", "orange", "yellow", "cyan",
];
const wheelColors: WheelColor[] = [
  "purple", "blue", "green", "red", "orange", "yellow", "cyan",
];
const barColors: BarColor[] = [
  "purple", "blue", "green", "red", "orange", "yellow", "cyan",
];

const demoAvatars = [
  "https://placehold.co/40x40/b794f4/ffffff?text=A",
  "https://placehold.co/40x40/63b3ed/ffffff?text=B",
  "https://placehold.co/40x40/f6ad55/ffffff?text=C",
  "https://placehold.co/40x40/68d391/ffffff?text=D",
];

export default function CardCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Card"
        hint="15+ 种卡片组件：StatCard 系列 / 金融卡 / Project / Task / User / Event / Profile / Highlight / Activity。"
      />

      {/* ============ SurfaceCard ============ */}
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

      {/* ============ StatCard (Regular) ============ */}
      <Section
        title="Regular Statistic Card"
        description="8 种 theme × 2 size（sm 258×152 / lg 360×264）。trend up/down + icon + kebab。"
      >
        <SubSection title="Themes (sm)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <StatCard
                title="Total Sale"
                value="$9,256.09"
                trend="2.1%"
                trendDirection="up"
                subtitle="vs. last week"
                theme={t}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Themes (sm, with icon)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <StatCard
                title="Orders"
                value="1,245"
                trend="4.3%"
                trendDirection="up"
                subtitle="this week"
                theme={t}
                icon={<CartLargeBoldDuotone size={20} color="currentColor" />}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Themes (lg, with icon + kebab)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <StatCard
                title="Total Sale"
                value="$9,256.09"
                trend="2.1%"
                trendDirection={t === "red" ? "down" : "up"}
                subtitle="vs. last week"
                theme={t}
                size="lg"
                icon={<ChartBoldDuotone size={24} color="currentColor" />}
                onKebabClick={() => {}}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ProgressStatCard ============ */}
      <Section
        title="Progress Statistic Card"
        description="下方带进度条的 StatCard，8 themes。"
      >
        <SubSection title="Themes (sm)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <ProgressStatCard
                title="Orders"
                value="1,245"
                trend="4.3%"
                theme={t}
                progressValue={65}
                progressColor={t === "white" || t === "black" ? "purple" : undefined}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ LineChartStatCard ============ */}
      <Section
        title="Line Chart Statistic Card"
        description="右侧带迷你折线图。"
      >
        <SubSection title="Themes (sm)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <LineChartStatCard
                title="Revenue"
                value="$12.4k"
                trend="8.7%"
                theme={t}
                chartColor={t === "white" || t === "black" ? "purple" : undefined}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Chart colors (white theme)">
          {lineColors.map((c) => (
            <Labeled key={c} label={c}>
              <LineChartStatCard
                title="Revenue"
                value="$12.4k"
                trend="8.7%"
                theme="white"
                chartColor={c}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ WheelChartStatCard ============ */}
      <Section
        title="Wheel Chart Statistic Card"
        description="右侧圆环进度图。"
      >
        <SubSection title="Themes (sm)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <WheelChartStatCard
                title="Completion"
                value="72%"
                trend="3.2%"
                theme={t}
                wheelPercent={72}
                wheelColor={t === "white" || t === "black" ? "purple" : undefined}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Wheel colors (white theme, 70%)">
          {wheelColors.map((c) => (
            <Labeled key={c} label={c}>
              <WheelChartStatCard
                title="Completion"
                value="70%"
                theme="white"
                wheelColor={c}
                wheelPercent={70}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ BarChartStatCard ============ */}
      <Section
        title="Bar Chart Statistic Card"
        description="右侧 5 根柱状图。"
      >
        <SubSection title="Themes (sm)">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <BarChartStatCard
                title="Daily Sales"
                value="$2.1k"
                trend="12%"
                theme={t}
                bars={[10, 22, 30, 40, 25]}
                barColor={t === "white" || t === "black" ? "purple" : undefined}
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Bar colors (white theme)">
          {barColors.map((c) => (
            <Labeled key={c} label={c}>
              <BarChartStatCard
                title="Daily Sales"
                value="$2.1k"
                trend="12%"
                theme="white"
                bars={[10, 22, 30, 40, 25]}
                barColor={c}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ImageStatCard ============ */}
      <Section
        title="Image Statistic Card"
        description="大面积背景 + 头像组，用作 campaign/collection 卡。"
      >
        <SubSection title="Themes">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <ImageStatCard
                title="Marketing ROI"
                subtitle="Jul 2024 - Today"
                value="$18,420"
                trend="12.5%"
                trendSubtitle="+$150 today"
                theme={t}
                avatars={demoAvatars}
                onKebabClick={() => {}}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ BalanceCard ============ */}
      <Section
        title="Balance Card"
        description="余额 + transfer/request 按钮。8 themes × 可选 balanceHidden。"
      >
        <SubSection title="Themes">
          {themes.map((t) => (
            <Labeled key={t} label={t}>
              <BalanceCard
                balance="$9,256.09"
                trend="2.1%"
                subtitle="vs. last month"
                theme={t}
                cardNumber="**** 9090"
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Balance hidden (white / purple)">
          <Labeled label="white (hidden)">
            <BalanceCard
              balance="$9,256.09"
              balanceHidden
              trend="2.1%"
              subtitle="vs. last month"
              theme="white"
              cardNumber="**** 9090"
            />
          </Labeled>
          <Labeled label="purple (hidden)">
            <BalanceCard
              balance="$9,256.09"
              balanceHidden
              trend="2.1%"
              subtitle="vs. last month"
              theme="purple"
              cardNumber="**** 9090"
            />
          </Labeled>
        </SubSection>
      </Section>

      {/* ============ DebitCard / CreditCard ============ */}
      <Section
        title="Debit & Credit Card"
        description="银行卡视觉：balance / number / expiry。8 种 financial theme × 2 variant (glow / orbs)。"
      >
        <SubSection title="Debit Card - Themes (glow)">
          {financialThemes.map((t) => (
            <Labeled key={t} label={t}>
              <DebitCard balance="$9,256.09" cardNumber="9090" expiry="07/25" theme={t} variant="glow" />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Credit Card - Themes (glow)">
          {financialThemes.map((t) => (
            <Labeled key={t} label={t}>
              <CreditCard cardNumber="4242424242429090" holderName="John Doe" expiry="07/25" theme={t} variant="glow" />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="Variants (purple)">
          {financialVariants.map((v) => (
            <Labeled key={v} label={v}>
              <DebitCard balance="$9,256.09" cardNumber="9090" expiry="07/25" theme="purple" variant={v} />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ProgressCard ============ */}
      <Section
        title="Progress Card"
        description="大圆环进度 + 列表项明细。环色跟 theme 走。"
      >
        <SubSection title="Themes">
          {(
            [
              { t: "white", ring: "#7c3aed" },
              { t: "black", ring: "#ffffff" },
              { t: "purple", ring: "#ffffff" },
              { t: "blue", ring: "#ffffff" },
              { t: "green", ring: "#ffffff" },
              { t: "red", ring: "#ffffff" },
              { t: "yellow", ring: "#ffffff" },
              { t: "cyan", ring: "#ffffff" },
            ] as const
          ).map(({ t, ring }) => (
            <Labeled key={t} label={t}>
              <ProgressCard
                title="Goals"
                value="72%"
                subtitle="On track"
                theme={t}
                progress={72}
                progressColor={ring}
                items={[
                  { label: "Done", value: "24", color: "#10b981" },
                  { label: "In Progress", value: "8", color: "#f59e0b" },
                  { label: "Not Started", value: "2", color: "#ef4444" },
                ]}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ProjectCard ============ */}
      <Section
        title="Project Card"
        description="白底卡：logo + title + label + progress + avatars + date。"
      >
        <SubSection title="Variants">
          <Labeled label="with logo + progress">
            <ProjectCard
              logo="https://placehold.co/48x48/b794f4/ffffff?text=P"
              title="Marketing Website Redesign"
              description="Revamp the landing page with new brand."
              labelText="Design"
              labelColor="purple"
              progress={65}
              progressColor="purple"
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

      {/* ============ TaskCard ============ */}
      <Section
        title="Task Card"
        description="任务卡：label + title + progress + avatars + date。label 跟进度条主题色一致。"
      >
        <SubSection title="Variants">
          {(["purple", "blue", "green", "red", "yellow", "cyan", "gray"] as const).map((c) => (
            <Labeled key={c} label={c}>
              <TaskCard
                title="Ship beta release"
                description="Roll out to 10% of users."
                labelText="Priority"
                labelColor={c}
                progress={60}
                progressColor={c}
                avatars={demoAvatars.slice(0, 2)}
                date="Tomorrow"
                onMenuClick={() => {}}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ UserCard ============ */}
      <Section
        title="User Card"
        description="头像 / initials + 名字 + badge + stats。"
      >
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
          {(["purple", "blue", "green", "orange"] as const).map((c) => (
            <Labeled key={c} label={`initials ${c}`}>
              <UserCard
                initials="AB"
                initialsColor={c}
                name="Ada Byron"
                subtitle={<span className="text-xs text-fg-grey-700">Engineer</span>}
              />
            </Labeled>
          ))}
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

      {/* ============ EventCard ============ */}
      <Section
        title="Event Card"
        description="日历事件卡：title + timeRange + avatars + bottom accent。8 色。"
      >
        <SubSection title="Colors">
          {eventColors.map((c) => (
            <Labeled key={c} label={c}>
              <EventCard
                title="Weekly Standup"
                timeRange="10:00 - 10:30 AM"
                color={c}
                avatars={demoAvatars.slice(0, 3)}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ ProfileCard ============ */}
      <Section
        title="Profile Card"
        description="会员 / 人员卡，idle / hover / selected 3 态 × accent 色。"
      >
        <SubSection title="States (purple)">
          {profileStates.map((st) => (
            <Labeled key={st} label={st}>
              <ProfileCard
                avatar="https://placehold.co/40x40/b794f4/ffffff?text=JD"
                name="John Doe"
                subtitle="Product Designer"
                state={st}
                accent="purple"
              />
            </Labeled>
          ))}
        </SubSection>
        <SubSection title="On colored bg">
          <div className="p-6 bg-fg-violet rounded-xl flex items-start gap-3">
            {profileStates.map((st) => (
              <ProfileCard
                key={st}
                avatar="https://placehold.co/40x40/ffffff/4c1d95?text=JD"
                name="John Doe"
                subtitle="Product Designer"
                state={st}
                surface="onColoredBg"
              />
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ============ HighlightCard ============ */}
      <Section
        title="Highlight Card"
        description="产品高亮卡：主图 + 标注气泡 + 推荐列表。"
      >
        <SubSection title="Purple theme">
          <HighlightCard
            title="Featured Product"
            theme="purple"
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
        </SubSection>
      </Section>

      {/* ============ ActivityCard ============ */}
      <Section
        title="Activity Card"
        description="时间线卡：icon + 标题 + 元数据。"
      >
        <SubSection title="Default">
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
        </SubSection>
      </Section>

      {/* ============ Custom action slot example ============ */}
      <Section
        title="Custom Action Slot"
        description="StatCard / ImageStatCard 的 action prop 可插任意 ReactNode（如 IconButton）。"
      >
        <SubSection title="StatCard (action = IconButton)">
          <StatCard
            title="Team Size"
            value="48"
            theme="purple"
            size="lg"
            icon={<UsersGroupRoundedBoldDuotone size={24} color="currentColor" />}
            action={
              <IconButton variant="ghost" shape="square" size="sm">
                <ShareLinear size={18} color="white" />
              </IconButton>
            }
          />
        </SubSection>
      </Section>
    </div>
  );
}
